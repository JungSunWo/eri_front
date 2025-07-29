/**
 * @File Name      : page.js
 * @File path      : src/app/(page)/admin/menuMng/page.js
 * @author         : 정선우
 * @Description    : 메뉴 관리 페이지
 *                   - 왼쪽: 메뉴 트리뷰 (계층 구조)
 *                   - 오른쪽: 메뉴 상세 정보 및 편집
 * @History        : 20250701  최초 신규
 **/

'use client';

import { toast } from '@/common/ui_com';
import PageWrapper from '@/components/layout/PageWrapper';
import { CmpBadge, CmpInput, CmpSelect, CmpTextarea } from '@/components/ui';
import { menuAPI } from '@/lib/api';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  GripVertical,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MenuManagementPage() {
  const [menuTree, setMenuTree] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [parentMenus, setParentMenus] = useState([]); // 상위 메뉴 목록

  // 검색 상태
  const [searchKeyword, setSearchKeyword] = useState('');

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 폼 상태
  const [formData, setFormData] = useState({
    mnuCd: '',
    mnuNm: '',
    mnuUrl: '',
    mnuDesc: '',
    mnuLvl: '',
    pMnuCd: '',
    mnuOrd: 1,
    mnuUseYn: 'Y',
    mnuAuthType: 'USER'
  });

  // 메뉴 레벨 옵션
  const menuLevelOptions = [
    { value: '', label: '선택하세요' },
    { value: '1', label: '대메뉴' },
    { value: '2', label: '서브메뉴' }
  ];

  // 사용여부 옵션
  const useYnOptions = [
    { value: 'Y', label: '사용' },
    { value: 'N', label: '미사용' }
  ];

  // 관리자전용 옵션
  const adminYnOptions = [
    { value: 'N', label: '일반사용자' },
    { value: 'Y', label: '관리자전용' }
  ];

  // 메뉴권한구분 옵션
  const authTypeOptions = [
    { value: 'USER', label: '일반사용자' },
    { value: 'COUNSELOR', label: '상담사' },
    { value: 'ADMIN', label: '관리자' }
  ];

  // 드래그 가능한 트리 노드 컴포넌트
  const DraggableTreeNode = ({ menu, level = 0, onSelect, onToggle, isSelected, isExpanded, hasChildren }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: menu.mnuCd });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        className={`flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer ${
          isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : ''
        }`}
        style={{
          paddingLeft: `${level * 20 + 12}px`,
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
        }}
        onClick={() => onSelect(menu)}
      >
        {/* 드래그 핸들 */}
        <div
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(menu.mnuCd);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-blue-500" />
          ) : (
            <Folder className="w-4 h-4 text-blue-500" />
          )
        ) : (
          <FileText className="w-4 h-4 text-gray-500" />
        )}

        <span className="flex-1 text-sm">{menu.mnuNm}</span>

        <div className="flex gap-1">
          <CmpBadge variant={menu.mnuUseYn === 'Y' ? 'default' : 'destructive'} className="text-xs">
            {menu.mnuUseYnText}
          </CmpBadge>
          <CmpBadge
            variant={
              menu.mnuAuthType === 'ADMIN' ? 'secondary' :
              menu.mnuAuthType === 'COUNSELOR' ? 'outline' :
              'default'
            }
            className={`text-xs ${
              menu.mnuAuthType === 'COUNSELOR' ? 'border-green-500 text-green-600 bg-green-50' : ''
            }`}
          >
            {menu.mnuAuthTypeText}
          </CmpBadge>
        </div>
      </div>
    );
  };

  // 페이지 로드 시 메뉴 트리 조회
  useEffect(() => {
    loadMenuTree();
    loadParentMenus(); // 처음 화면 진입 시 상위 메뉴 목록도 함께 로드
  }, []);

  // 메뉴 트리 조회
  const loadMenuTree = async () => {
    setLoading(true);
    try {
      const result = await menuAPI.getMenuList();

      if (result.success) {
        console.log('백엔드 응답 전체:', result);
        console.log('메뉴 데이터 상세:', result.data.map(menu => ({
          mnuCd: menu.mnuCd,
          mnuNm: menu.mnuNm,
          mnuLvl: menu.mnuLvl,
          pMnuCd: menu.pMnuCd,
          pmnuCd: menu.pmnuCd, // 혹시 다른 필드명으로 올 수도 있음
          allFields: menu // 모든 필드 확인
        })));

        const treeData = buildMenuTree(result.data);
        setMenuTree(treeData);
      } else {
        toast.callCommonToastOpen('메뉴 트리 조회 실패: ' + result.message);
      }
    } catch (error) {
      toast.callCommonToastOpen('메뉴 트리 조회 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 상위 메뉴 목록 로드
  const loadParentMenus = async () => {
    try {
      const result = await menuAPI.getParentMenuList();

      if (result.success) {
        console.log('상위 메뉴 목록:', result.data);
        setParentMenus(result.data);
      } else {
        console.error('상위 메뉴 목록 로드 실패:', result.message);
      }
    } catch (error) {
      console.error('상위 메뉴 목록 로드 실패:', error);
    }
  };

    // 메뉴 데이터를 트리 구조로 변환
  const buildMenuTree = (menuList) => {
    console.log('원본 메뉴 목록:', menuList);

    const menuMap = new Map();
    const rootMenus = [];

    // 모든 메뉴를 Map에 저장
    menuList.forEach(menu => {
      menuMap.set(menu.mnuCd, { ...menu, children: [] });
    });

    // 트리 구조 생성
    menuList.forEach(menu => {
      const menuNode = menuMap.get(menu.mnuCd);

      // 상위 메뉴 코드 확인 (모든 가능한 필드명 확인)
      console.log(`메뉴 ${menu.mnuNm} (${menu.mnuCd}) - 모든 필드:`, menu);
      console.log(`  pMnuCd: ${menu.pMnuCd}`);
      console.log(`  pmnuCd: ${menu.pmnuCd}`);
      console.log(`  P_MNU_CD: ${menu.P_MNU_CD}`);
      console.log(`  p_mnu_cd: ${menu.p_mnu_cd}`);

      const parentMenuCode = menu.pMnuCd || menu.pmnuCd || menu.P_MNU_CD || menu.p_mnu_cd;

      console.log(`메뉴 ${menu.mnuNm} (${menu.mnuCd}) - 레벨: ${menu.mnuLvl}, 상위메뉴: ${parentMenuCode || '없음'}`);

      if (parentMenuCode && menuMap.has(parentMenuCode)) {
        // 상위 메뉴가 있는 경우
        const parentMenu = menuMap.get(parentMenuCode);
        parentMenu.children.push(menuNode);
        console.log(`  → ${menu.mnuNm}을 ${parentMenu.mnuNm}의 하위로 추가`);
      } else {
        // 루트 메뉴인 경우
        rootMenus.push(menuNode);
        console.log(`  → ${menu.mnuNm}을 루트 메뉴로 추가`);
      }
    });

    // 자식 메뉴들을 순서대로 정렬
    const sortChildren = (menus) => {
      menus.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          menu.children.sort((a, b) => a.mnuOrd - b.mnuOrd);
          sortChildren(menu.children);
        }
      });
    };

    // 루트 메뉴들을 순서대로 정렬
    rootMenus.sort((a, b) => a.mnuOrd - b.mnuOrd);
    sortChildren(rootMenus);

    console.log('최종 트리 구조:', rootMenus);
    return rootMenus;
  };

  // 검색
  const handleSearch = () => {
    // 검색 기능은 나중에 구현
    toast.callCommonToastOpen('검색 기능은 준비 중입니다.');
  };

  // 검색 조건 초기화
  const handleResetSearch = () => {
    setSearchKeyword('');
    loadMenuTree();
  };

  // 트리 노드 확장/축소
  const toggleNode = (mnuCd) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(mnuCd)) {
      newExpandedNodes.delete(mnuCd);
    } else {
      newExpandedNodes.add(mnuCd);
    }
    setExpandedNodes(newExpandedNodes);
  };

  // 메뉴 선택
  const selectMenu = async (menu) => {
    console.log('선택된 메뉴 전체 데이터:', menu);
    console.log('선택된 메뉴의 pMnuCd:', menu.pMnuCd);
    console.log('선택된 메뉴의 pmnuCd:', menu.pmnuCd);
    console.log('선택된 메뉴의 P_MNU_CD:', menu.P_MNU_CD);
    console.log('선택된 메뉴의 p_mnu_cd:', menu.p_mnu_cd);

    // 상위 메뉴 코드 확인 (모든 가능한 필드명 확인)
    const parentMenuCode = menu.pMnuCd || menu.pmnuCd || menu.P_MNU_CD || menu.p_mnu_cd;
    console.log('최종 상위 메뉴 코드:', parentMenuCode);

    setSelectedMenu(menu);
    setIsEditMode(true); // 바로 수정 모드로 전환
    setIsCreateMode(false);
    setFormData({
      mnuCd: menu.mnuCd,
      mnuNm: menu.mnuNm,
      mnuUrl: menu.mnuUrl || '',
      mnuDesc: menu.mnuDesc || '',
      mnuLvl: menu.mnuLvl.toString(),
      pMnuCd: parentMenuCode || '',
      mnuOrd: menu.mnuOrd,
      mnuUseYn: menu.mnuUseYn,
      mnuAuthType: menu.mnuAuthType
    });

    // 하위 메뉴인 경우 상위 메뉴 목록 로드
    if (menu.mnuLvl === '2') {
      console.log('하위 메뉴 선택됨, 상위 메뉴 목록 로드 시작');
      await loadParentMenus();
    } else {
      // 대메뉴인 경우에도 상위 메뉴 목록 다시 로드 (최신 상태 유지)
      await loadParentMenus();
    }
  };

  // 새 메뉴 생성 모드
  const createNewMenu = () => {
    setSelectedMenu(null);
    setIsEditMode(false);
    setIsCreateMode(true);
    setFormData({
      mnuCd: '',
      mnuNm: '',
      mnuUrl: '',
      mnuDesc: '',
      mnuLvl: '',
      pMnuCd: '',
      mnuOrd: 1,
      mnuUseYn: 'Y',
      mnuAuthType: 'USER'
    });
    // 상위 메뉴 목록 다시 로드
    loadParentMenus();
  };

    // 메뉴 수정 모드
  const editMenu = async () => {
    if (!selectedMenu) {
      toast.callCommonToastOpen('수정할 메뉴를 선택해주세요.');
      return;
    }
    setIsEditMode(true);
    setIsCreateMode(false);

    // 상위 메뉴 목록 다시 로드 (하위 메뉴 수정 시 필요)
    await loadParentMenus();

    // 수정 모드에서 폼 데이터 다시 설정
    console.log('수정 모드 - 선택된 메뉴 전체 데이터:', selectedMenu);
    console.log('수정 모드 - pMnuCd:', selectedMenu.pMnuCd);
    console.log('수정 모드 - pmnuCd:', selectedMenu.pmnuCd);
    console.log('수정 모드 - P_MNU_CD:', selectedMenu.P_MNU_CD);
    console.log('수정 모드 - p_mnu_cd:', selectedMenu.p_mnu_cd);

    const parentMenuCode = selectedMenu.pMnuCd || selectedMenu.pmnuCd || selectedMenu.P_MNU_CD || selectedMenu.p_mnu_cd;
    console.log('수정 모드 - 최종 상위 메뉴 코드:', parentMenuCode);

    const newFormData = {
      mnuCd: selectedMenu.mnuCd,
      mnuNm: selectedMenu.mnuNm,
      mnuUrl: selectedMenu.mnuUrl || '',
      mnuDesc: selectedMenu.mnuDesc || '',
      mnuLvl: selectedMenu.mnuLvl.toString(),
      pMnuCd: parentMenuCode || '',
      mnuOrd: selectedMenu.mnuOrd,
      mnuUseYn: selectedMenu.mnuUseYn,
      mnuAuthType: selectedMenu.mnuAuthType
    };

    console.log('수정 모드 - 설정할 폼 데이터:', newFormData);
    console.log('수정 모드 - 폼 데이터의 pMnuCd:', newFormData.pMnuCd);
    setFormData(newFormData);
  };

  // 메뉴 삭제
  const deleteMenu = async () => {
    if (!selectedMenu) {
      toast.callCommonToastOpen('삭제할 메뉴를 선택해주세요.');
      return;
    }

    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await menuAPI.deleteMenu(selectedMenu.mnuCd);

      if (result.success) {
        toast.callCommonToastOpen('메뉴가 삭제되었습니다.');
        setSelectedMenu(null);
        setIsEditMode(false);
        setIsCreateMode(false);
        loadMenuTree();
        loadParentMenus(); // 삭제 후 상위 메뉴 목록 다시 로드
      } else {
        toast.callCommonToastOpen('메뉴 삭제 실패: ' + result.message);
      }
    } catch (error) {
      toast.callCommonToastOpen('메뉴 삭제 실패: ' + error.message);
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.mnuCd || !formData.mnuNm || !formData.mnuLvl) {
      toast.callCommonToastOpen('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 메뉴 레벨이 2인 경우 상위 메뉴 코드 필수
    if (formData.mnuLvl === '2' && (!formData.pMnuCd || formData.pMnuCd.trim() === '')) {
      toast.callCommonToastOpen('하위 메뉴는 상위 메뉴를 선택해야 합니다.');
      return;
    }

    // 전송할 데이터 로그 출력
    console.log('전송할 폼 데이터 전체:', formData);
    console.log('메뉴 레벨:', formData.mnuLvl);
    console.log('상위 메뉴 코드:', formData.pMnuCd);
    console.log('상위 메뉴 코드 타입:', typeof formData.pMnuCd);
    console.log('상위 메뉴 코드 길이:', formData.pMnuCd ? formData.pMnuCd.length : 0);
    console.log('현재 폼 데이터의 pMnuCd 값:', formData.pMnuCd);

    // 백엔드로 전송될 JSON 데이터 확인
    const requestData = JSON.stringify(formData);
    console.log('백엔드로 전송될 JSON 데이터:', requestData);

    try {
      if (isEditMode) {
        // 수정 모드 - 백엔드가 기대하는 형식으로 데이터 정리
        const updateData = {
          mnuCd: formData.mnuCd,
          mnuNm: formData.mnuNm,
          mnuUrl: formData.mnuUrl,
          mnuDesc: formData.mnuDesc,
          mnuLvl: parseInt(formData.mnuLvl),
          pMnuCd: formData.pMnuCd || null,  // 명시적으로 null 처리
          mnuOrd: formData.mnuOrd,
          mnuUseYn: formData.mnuUseYn,
          mnuAuthType: formData.mnuAuthType
        };

        console.log('백엔드로 전송할 정리된 데이터:', updateData);

        const result = await menuAPI.updateMenu(formData.mnuCd, updateData);
        if (result.success) {
          toast.callCommonToastOpen('메뉴가 수정되었습니다.');
          setIsEditMode(false);
          loadMenuTree();
          loadParentMenus(); // 수정 후 상위 메뉴 목록 다시 로드
        } else {
          toast.callCommonToastOpen('메뉴 수정 실패: ' + result.message);
          return;
        }
      } else if (isCreateMode) {
        // 등록 모드 - 백엔드가 기대하는 형식으로 데이터 정리
        const createData = {
          mnuCd: formData.mnuCd,
          mnuNm: formData.mnuNm,
          mnuUrl: formData.mnuUrl,
          mnuDesc: formData.mnuDesc,
          mnuLvl: parseInt(formData.mnuLvl),
          pMnuCd: formData.pMnuCd || null,  // 명시적으로 null 처리
          mnuOrd: formData.mnuOrd,
          mnuUseYn: formData.mnuUseYn,
          mnuAuthType: formData.mnuAuthType
        };

        console.log('백엔드로 전송할 정리된 데이터 (등록):', createData);

        const result = await menuAPI.createMenu(createData);
        if (result.success) {
          toast.callCommonToastOpen('메뉴가 등록되었습니다.');
          setIsCreateMode(false);
          loadMenuTree();
          loadParentMenus(); // 등록 후 상위 메뉴 목록 다시 로드
        } else {
          toast.callCommonToastOpen('메뉴 등록 실패: ' + result.message);
          return;
        }
      }
    } catch (error) {
      toast.callCommonToastOpen((isEditMode ? '메뉴 수정' : '메뉴 등록') + ' 실패: ' + error.message);
    }
  };

  // 메뉴 레벨 변경 시 상위 메뉴 표시/숨김
  const handleMenuLevelChange = (value) => {
    console.log('메뉴 레벨 변경:', value);
    console.log('변경 전 폼 데이터:', formData);

    // 메뉴 레벨이 1로 변경되는 경우에만 상위 메뉴 코드 초기화
    const newFormData = {...formData, mnuLvl: value};
    if (value === '1') {
      newFormData.pMnuCd = '';
    }

    console.log('변경 후 폼 데이터:', newFormData);
    setFormData(newFormData);

    // 메뉴 레벨이 2인 경우 상위 메뉴 목록 로드
    if (value === '2') {
      loadParentMenus();
    }
  };

    // 드래그 앤 드롭 이벤트 핸들러
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // 전체 메뉴 트리에서 드래그된 메뉴와 대상 메뉴를 찾기
      const findMenuInTree = (menus, targetId) => {
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].mnuCd === targetId) {
            return { menu: menus[i], index: i, parent: null };
          }
          if (menus[i].children && menus[i].children.length > 0) {
            for (let j = 0; j < menus[i].children.length; j++) {
              if (menus[i].children[j].mnuCd === targetId) {
                return { menu: menus[i].children[j], index: j, parent: menus[i] };
              }
            }
          }
        }
        return null;
      };

      const activeMenuInfo = findMenuInTree(menuTree, active.id);
      const overMenuInfo = findMenuInTree(menuTree, over.id);

      if (activeMenuInfo && overMenuInfo) {
        // 같은 부모 내에서의 순서 변경인지 확인
        const isSameParent = (!activeMenuInfo.parent && !overMenuInfo.parent) ||
                           (activeMenuInfo.parent && overMenuInfo.parent &&
                            activeMenuInfo.parent.mnuCd === overMenuInfo.parent.mnuCd);

        if (isSameParent) {
          // 같은 레벨에서 순서 변경
          const targetArray = activeMenuInfo.parent ? activeMenuInfo.parent.children : menuTree;
          const oldIndex = activeMenuInfo.index;
          const newIndex = overMenuInfo.index;

          if (oldIndex !== -1 && newIndex !== -1) {
            const newArray = arrayMove(targetArray, oldIndex, newIndex);

            // 상태 업데이트
            if (activeMenuInfo.parent) {
              // 하위메뉴인 경우
              const newMenuTree = [...menuTree];
              const parentIndex = newMenuTree.findIndex(menu => menu.mnuCd === activeMenuInfo.parent.mnuCd);
              if (parentIndex !== -1) {
                newMenuTree[parentIndex] = { ...newMenuTree[parentIndex], children: newArray };
                setMenuTree(newMenuTree);
              }
            } else {
              // 최상위 메뉴인 경우
              setMenuTree(newArray);
            }

            // 백엔드에 순서 변경 요청 - 모든 메뉴의 순서를 업데이트
            try {
              // 이동된 메뉴의 새 순서
              const movedMenu = newArray[newIndex];

              // 같은 레벨의 모든 메뉴 순서를 백엔드에 업데이트
              const updatePromises = newArray.map((menu, index) => {
                const newOrder = index + 1; // 1부터 시작하는 순서
                return menuAPI.updateMenuOrder(menu.mnuCd, newOrder);
              });

              const results = await Promise.all(updatePromises);
              const allSuccess = results.every(result => result.success);

              if (allSuccess) {
                toast.callCommonToastOpen('메뉴 순서가 변경되었습니다.');
                // 트리 새로고침
                loadMenuTree();
              } else {
                const errorMessages = results
                  .filter(result => !result.success)
                  .map(result => result.message)
                  .join(', ');
                toast.callCommonToastOpen('메뉴 순서 변경 실패: ' + errorMessages);
                // 실패 시 원래 순서로 복원
                loadMenuTree();
              }
            } catch (error) {
              toast.callCommonToastOpen('메뉴 순서 변경 실패: ' + error.message);
              // 실패 시 원래 순서로 복원
              loadMenuTree();
            }
          }
        } else {
          // 다른 부모로 이동하는 경우 (현재는 지원하지 않음)
          toast.callCommonToastOpen('다른 레벨로의 이동은 지원하지 않습니다.');
        }
      }
    }
  };

  // 트리 노드 렌더링
  const renderTreeNode = (menu, level = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedNodes.has(menu.mnuCd);
    const isSelected = selectedMenu?.mnuCd === menu.mnuCd;

    console.log(`렌더링: ${menu.mnuNm} (레벨: ${level}, 하위메뉴수: ${hasChildren ? menu.children.length : 0}, 확장: ${isExpanded})`);

    return (
      <div key={menu.mnuCd}>
        <DraggableTreeNode
          menu={menu}
          level={level}
          onSelect={selectMenu}
          onToggle={toggleNode}
          isSelected={isSelected}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
        />

        {hasChildren && isExpanded && (
          <div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={menu.children.map(child => child.mnuCd)}
                strategy={verticalListSortingStrategy}
              >
                {menu.children.map(child => renderTreeNode(child, level + 1))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageWrapper
      title="메뉴 관리"
      subtitle="시스템 메뉴를 트리 구조로 관리할 수 있는 페이지입니다."
      showCard={false}
    >
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 메뉴 관리</h1>
        <p className="text-gray-600">시스템 메뉴를 트리 구조로 관리할 수 있는 페이지입니다.</p>
      </div>

      {/* 검색 섹션 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔍 메뉴 검색</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="searchKeyword" className="block text-sm font-medium text-gray-700 mb-1">
              검색어
            </label>
            <CmpInput
              id="searchKeyword"
              placeholder="메뉴명 또는 설명을 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '검색 중...' : '검색'}
            </button>
            <button
              onClick={handleResetSearch}
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 메뉴 트리 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">🌳 메뉴 트리</h2>
              <div className="flex gap-2">
                <button
                  onClick={createNewMenu}
                  disabled={loading}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  새 메뉴
                </button>
                <button
                  onClick={() => loadMenuTree()}
                  disabled={loading}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  새로고침
                </button>
              </div>
            </div>

            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4" />
                <span>드래그하여 메뉴 순서를 변경할 수 있습니다.</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : menuTree.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                등록된 메뉴가 없습니다.
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={menuTree.map(menu => menu.mnuCd)}
                    strategy={verticalListSortingStrategy}
                  >
                    {menuTree.map(menu => renderTreeNode(menu))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 메뉴 상세 정보 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isCreateMode ? '➕ 새 메뉴 등록' :
                 isEditMode ? '✏️ 메뉴 수정' :
                 selectedMenu ? '📋 메뉴 상세' : '📋 메뉴 정보'}
              </h2>
              {selectedMenu && isEditMode && (
                <div className="flex gap-2">
                  <button
                    onClick={deleteMenu}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </button>
                </div>
              )}
            </div>

            {!selectedMenu && !isCreateMode ? (
              <div className="text-center py-12 text-gray-500">
                <Menu className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>왼쪽에서 메뉴를 선택하면 바로 수정할 수 있습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mnuCd" className="block text-sm font-medium text-gray-700 mb-1">
                      메뉴 코드 *
                    </label>
                    <CmpInput
                      id="mnuCd"
                      value={formData.mnuCd}
                      onChange={(e) => setFormData({...formData, mnuCd: e.target.value})}
                      required
                      disabled={isEditMode}
                    />
                  </div>
                  <div>
                    <label htmlFor="mnuNm" className="block text-sm font-medium text-gray-700 mb-1">
                      메뉴명 *
                    </label>
                    <CmpInput
                      id="mnuNm"
                      value={formData.mnuNm}
                      onChange={(e) => setFormData({...formData, mnuNm: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mnuUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    메뉴 URL
                  </label>
                  <CmpInput
                    id="mnuUrl"
                    value={formData.mnuUrl}
                    onChange={(e) => setFormData({...formData, mnuUrl: e.target.value})}
                    placeholder="/example/path"
                  />
                </div>

                <div>
                  <label htmlFor="mnuDesc" className="block text-sm font-medium text-gray-700 mb-1">
                    메뉴 설명
                  </label>
                  <CmpTextarea
                    id="mnuDesc"
                    rows={3}
                    value={formData.mnuDesc}
                    onChange={(e) => setFormData({...formData, mnuDesc: e.target.value})}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mnuLvl" className="block text-sm font-medium text-gray-700 mb-1">
                      메뉴 레벨 *
                    </label>
                    <CmpSelect
                      value={formData.mnuLvl}
                      onChange={(value) => handleMenuLevelChange(value)}
                      options={menuLevelOptions}
                      required
                    />
                  </div>
                  {formData.mnuLvl === '2' && (
                    <div>
                      <label htmlFor="pMnuCd" className="block text-sm font-medium text-gray-700 mb-1">
                        상위 메뉴 *
                      </label>
                      {console.log('상위 메뉴 드롭다운 - 현재 값:', formData.pMnuCd)}
                      {console.log('상위 메뉴 드롭다운 - 옵션 목록:', parentMenus)}
                      <CmpSelect
                        value={formData.pMnuCd}
                        onChange={(value) => {
                          console.log('상위 메뉴 선택 변경:', value);
                          setFormData({...formData, pMnuCd: value});
                        }}
                        options={[
                          { value: '', label: '상위 메뉴를 선택하세요' },
                          ...parentMenus.map(menu => ({
                            value: menu.mnuCd,
                            label: `${menu.mnuNm} (${menu.mnuCd})`
                          }))
                        ]}
                        required
                      />
                      {parentMenus.length === 0 && (
                        <p className="text-sm text-red-500 mt-1">
                          상위 메뉴가 없습니다. 먼저 대메뉴를 등록해주세요.
                        </p>
                      )}
                      {formData.pMnuCd && parentMenus.length > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          현재 선택된 상위 메뉴: {parentMenus.find(m => m.mnuCd === formData.pMnuCd)?.mnuNm || formData.pMnuCd}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mnuOrd" className="block text-sm font-medium text-gray-700 mb-1">
                      메뉴 순서
                    </label>
                    <CmpInput
                      id="mnuOrd"
                      type="number"
                      value={formData.mnuOrd}
                      onChange={(e) => setFormData({...formData, mnuOrd: parseInt(e.target.value) || 1})}
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="mnuUseYn" className="block text-sm font-medium text-gray-700 mb-1">
                      사용여부
                    </label>
                    <CmpSelect
                      value={formData.mnuUseYn}
                      onChange={(value) => setFormData({...formData, mnuUseYn: value})}
                      options={useYnOptions}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mnuAuthType" className="block text-sm font-medium text-gray-700 mb-1">
                    메뉴권한구분
                  </label>
                  <CmpSelect
                    value={formData.mnuAuthType}
                    onChange={(value) => setFormData({...formData, mnuAuthType: value})}
                    options={authTypeOptions}
                  />
                </div>

                {(isEditMode || isCreateMode) && (
                  <div className="border-t pt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      onClick={() => {
                        setIsEditMode(false);
                        setIsCreateMode(false);
                        setSelectedMenu(null);
                      }}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {isEditMode ? '수정' : '등록'}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>


    </PageWrapper>
  );
}
