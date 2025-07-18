'use client';

import { alert } from '@/common/ui_com';
import { CmpButton } from '@/components/button/cmp_button';
import { CmpNoData } from '@/components/etc/cmp_noData';
import PageWrapper from '@/components/layout/PageWrapper';
import CmpInput from '@/components/ui/CmpInput';
import CmpSelect from '@/components/ui/CmpSelect';
import CmpTab from '@/components/ui/CmpTab';
import CommonModal from '@/components/ui/CommonModal';
import DataTable from '@/components/ui/DataTable';
import { authManagementAPI, permissionAPI } from '@/lib/api';
import { useEffect, useState } from 'react';
import {
  ActionButtons,
  ActionSection,
  FormGrid,
  FormRow,
  LoadingSpinner,
  ModalContent,
  PermissionGrid,
  PermissionItem,
  SearchSection,
  TabContainer,
  TabContent
} from './styled';

// 날짜 포맷팅 함수
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('ko-KR');
}

const AuthManagementPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Data states
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionPage, setPermissionPage] = useState(1);
  const [permissionTotalPages, setPermissionTotalPages] = useState(1);
  const [permissionSearch, setPermissionSearch] = useState({ searchField: '', keyword: '' });
  const [rolesOptions, setRolesOptions] = useState([]);

  // Tab configurations
  const tabs = [
    { key: 'users', label: '사용자 관리' },
    { key: 'roles', label: '역할 관리' },
    { key: 'permissions', label: '권한 관리' },
  ];

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Load roles for user form
  useEffect(() => {
    if (activeTab === 'users') {
      loadRolesForSelect();
    }
  }, [activeTab]);

  // 권한 목록 로드
  const loadPermissions = async (page = 1) => {
    const res = await permissionAPI.getList({
      page,
      size: 10,
      ...permissionSearch,
      sortKey: 'authLvl',
      sortOrder: 'desc'
    });
    setPermissions(res.content || []);
    setPermissionTotalPages(res.totalPages || 1);
    setPermissionPage(page);
  };

  // 권한 등록
  const handleCreatePermission = async (data) => {
    await permissionAPI.create(data);
    loadPermissions(permissionPage);
  };

  // 권한 수정
  const handleUpdatePermission = async (authCd, data) => {
    await permissionAPI.update(authCd, data);
    loadPermissions(permissionPage);
  };

  // 권한 삭제
  const handleDeletePermission = async (authCd) => {
    await permissionAPI.remove(authCd);
    loadPermissions(permissionPage);
  };

  // 권한 상세
  const handleGetPermission = async (authCd) => {
    return await permissionAPI.get(authCd);
  };

  // DataTable 컬럼 정의 (백엔드 필드명 기준)
  const permissionColumns = [
    { key: 'authNm', header: '권한명' },
    { key: 'authCd', header: '권한코드' },
    { key: 'authDesc', header: '권한설명' },
    { key: 'authLvl', header: '권한레벨', render: v => <span className="badge bg-primary">Level {v}</span> },
    { key: 'regDate', header: '등록일시', render: v => formatDate(v) },
    { key: 'updDate', header: '수정일시', render: v => formatDate(v) },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersResponse = await authManagementAPI.getUsers({
            search: searchTerm,
            status: statusFilter,
            role: roleFilter
          });
          setUsers(usersResponse.data || []);
          break;
        case 'roles':
          const rolesResponse = await authManagementAPI.getRoles({
            search: searchTerm
          });
          setRoles(rolesResponse.data || []);
          break;
        case 'permissions':
          const permissionsResponse = await permissionAPI.getList({
            page: permissionPage,
            size: 10,
            ...permissionSearch,
            sortKey: 'authLvl',
            sortOrder: 'desc'
          });
          setPermissions(permissionsResponse.content || []);
          setPermissionTotalPages(permissionsResponse.totalPages || 1);
          setPermissionPage(permissionPage);
          break;
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      // API 인터셉터에서 이미 에러 알림을 처리하므로 여기서는 로그만 출력
    } finally {
      setLoading(false);
    }
  };

  const loadRolesForSelect = async () => {
    try {
      const response = await authManagementAPI.getRoles();
      const rolesData = response.data || [];
      setRolesOptions(rolesData.map(role => ({
        value: role.name,
        label: role.name
      })));
    } catch (error) {
      console.error('역할 목록 로드 실패:', error);
    }
  };

  // Search and filter handlers
  const handleSearch = () => {
    loadData();
  };

  const handleFilterChange = () => {
    loadData();
  };

  // Table columns for each tab
  const getColumns = (tab) => {
    const baseColumns = {
      users: [
        { key: 'username', header: '사용자명' },
        { key: 'name', header: '이름' },
        { key: 'email', header: '이메일' },
        { key: 'role', header: '역할' },
        { key: 'department', header: '부서' },
        { key: 'status', header: '상태' },
        { key: 'lastLogin', header: '마지막 로그인' },
      ],
      roles: [
        { key: 'name', header: '역할명' },
        { key: 'description', header: '설명' },
        {
          key: 'permissions',
          header: '권한',
          render: (item) => {
            if (!item.permissions || item.permissions.length === 0) {
              return <span className="text-gray-400">권한 없음</span>;
            }
            const permissionNames = item.permissions.map(code => {
              const perm = permissions.find(p => p.code === code);
              return perm ? perm.name : code;
            });
            return (
              <div className="flex flex-wrap gap-1">
                {permissionNames.slice(0, 3).map((name, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {name}
                  </span>
                ))}
                {permissionNames.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{permissionNames.length - 3}
                  </span>
                )}
              </div>
            );
          }
        },
        { key: 'userCount', header: '사용자 수' },
      ],
      permissions: [
        { key: 'authNm', header: '권한명' },
        { key: 'authCd', header: '권한코드' },
        { key: 'authDesc', header: '권한설명' },
        { key: 'authLvl', header: '권한레벨', render: v => <span className="badge bg-primary">Level {v}</span> },
        { key: 'regDate', header: '등록일시', render: v => formatDate(v) },
        { key: 'updDate', header: '수정일시', render: v => formatDate(v) },
      ]
    };

    const columns = baseColumns[tab] || [];

    // Add action column
    columns.push({
      key: 'actions',
      header: '작업',
      render: (item) => (
        <ActionButtons>
          <CmpButton
            label="편집"
            styleType="secondary"
            size="sm"
            click={() => handleEdit(item)}
          />
          <CmpButton
            label="삭제"
            styleType="danger"
            size="sm"
            click={() => handleDelete(item)}
          />
        </ActionButtons>
      )
    });

    return columns;
  };

  // Form data handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permissionCode, checked) => {
    setFormData(prev => {
      const currentPermissions = prev.permissions || [];
      if (checked) {
        return {
          ...prev,
          permissions: [...currentPermissions, permissionCode]
        };
      } else {
        return {
          ...prev,
          permissions: currentPermissions.filter(p => p !== permissionCode)
        };
      }
    });
  };

  // Modal handlers
  const handleAdd = () => {
    setModalType('add');
    setSelectedItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = (item) => {
    const itemName = item.name || item.username || '항목';
    alert.ConfirmOpen(
      '삭제 확인',
      `정말 ${itemName}을(를) 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.`,
      {
        okCallback: async () => {
          try {
            switch (activeTab) {
              case 'users':
                await authManagementAPI.deleteUser(item.id);
                break;
              case 'roles':
                await authManagementAPI.deleteRole(item.id);
                break;
              case 'permissions':
                await permissionAPI.remove(item.authCd);
                break;
            }
            alert.AlertOpen('삭제 완료', '성공적으로 삭제되었습니다.');
            loadData(); // 데이터 다시 로드
          } catch (error) {
            console.error('삭제 실패:', error);
            // API 인터셉터에서 에러 알림 처리
          }
        },
        cancelCallback: () => {
          console.log('삭제 취소');
        },
        okLabel: '삭제',
        cancelLabel: '취소'
      }
    );
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name && activeTab !== 'users') {
      alert.AlertOpen('입력 오류', '이름을 입력해주세요.');
      return;
    }
    if (!formData.username && activeTab === 'users') {
      alert.AlertOpen('입력 오류', '사용자명을 입력해주세요.');
      return;
    }

    try {
      if (modalType === 'add') {
        // Add logic here
        switch (activeTab) {
          case 'users':
            await authManagementAPI.createUser(formData);
            break;
          case 'roles':
            await authManagementAPI.createRole(formData);
            break;
          case 'permissions':
            await permissionAPI.create(formData);
            break;
        }
        alert.AlertOpen('추가 완료', '성공적으로 추가되었습니다.');
      } else {
        // Edit logic here
        switch (activeTab) {
          case 'users':
            await authManagementAPI.updateUser(selectedItem.id, formData);
            break;
          case 'roles':
            await authManagementAPI.updateRole(selectedItem.id, formData);
            break;
          case 'permissions':
            await permissionAPI.update(selectedItem.authCd, formData);
            break;
        }
        alert.AlertOpen('수정 완료', '성공적으로 수정되었습니다.');
      }
      setShowModal(false);
      loadData(); // 데이터 다시 로드
    } catch (error) {
      console.error('저장 실패:', error);
      // API 인터셉터에서 에러 알림 처리
    }
  };

  // Render modal content based on active tab
  const renderModalContent = () => {
    const isEdit = modalType === 'edit';

    switch (activeTab) {
      case 'users':
        return (
          <ModalContent>
            <h3 className="text-lg font-semibold mb-4">
              {isEdit ? '사용자 수정' : '사용자 추가'}
            </h3>
            <FormGrid>
              <CmpInput
                label="사용자명"
                value={formData.username || ''}
                onChange={(e) => handleFormChange('username', e.target.value)}
                placeholder="사용자명을 입력하세요"
                required
              />
              <CmpInput
                label="이름"
                value={formData.name || ''}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="이름을 입력하세요"
                required
              />
              <CmpInput
                label="이메일"
                value={formData.email || ''}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="이메일을 입력하세요"
                type="email"
                required
              />
              <CmpInput
                label="부서"
                value={formData.department || ''}
                onChange={(e) => handleFormChange('department', e.target.value)}
                placeholder="부서를 입력하세요"
              />
              <CmpSelect
                label="역할"
                value={formData.role || ''}
                onChange={(value) => handleFormChange('role', value)}
                options={rolesOptions}
                required
              />
              <CmpSelect
                label="상태"
                value={formData.status || ''}
                onChange={(value) => handleFormChange('status', value)}
                options={[
                  { value: '활성', label: '활성' },
                  { value: '비활성', label: '비활성' },
                ]}
                required
              />
            </FormGrid>
            <div className="flex justify-end gap-2">
              <CmpButton
                label="취소"
                styleType="secondary"
                click={() => setShowModal(false)}
              />
              <CmpButton
                label={isEdit ? '수정' : '추가'}
                styleType="primary"
                click={handleSave}
              />
            </div>
          </ModalContent>
        );

      case 'roles':
        return (
          <ModalContent>
            <h3 className="text-lg font-semibold mb-4">
              {isEdit ? '역할 수정' : '역할 추가'}
            </h3>
            <FormRow>
              <CmpInput
                label="역할명"
                value={formData.name || ''}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="역할명을 입력하세요"
                required
              />
            </FormRow>
            <FormRow>
              <CmpInput
                label="설명"
                value={formData.description || ''}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="역할 설명을 입력하세요"
              />
            </FormRow>
            <FormRow>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                권한 설정
              </label>
              <PermissionGrid>
                {permissions.map(permission => (
                  <PermissionItem key={permission.id}>
                    <input
                      type="checkbox"
                      id={`perm_${permission.id}`}
                      checked={formData.permissions?.includes(permission.code) || false}
                      onChange={(e) => handlePermissionChange(permission.code, e.target.checked)}
                    />
                    <label htmlFor={`perm_${permission.id}`} className="text-sm">
                      {permission.name}
                    </label>
                  </PermissionItem>
                ))}
              </PermissionGrid>
            </FormRow>
            <div className="flex justify-end gap-2">
              <CmpButton
                label="취소"
                styleType="secondary"
                click={() => setShowModal(false)}
              />
              <CmpButton
                label={isEdit ? '수정' : '추가'}
                styleType="primary"
                click={handleSave}
              />
            </div>
          </ModalContent>
        );

      case 'permissions':
        return (
          <ModalContent>
            <h3 className="text-lg font-semibold mb-4">
              {isEdit ? '권한 수정' : '권한 추가'}
            </h3>
            <FormGrid>
              <CmpInput
                label="권한명"
                value={formData.authNm || ''}
                onChange={(e) => handleFormChange('authNm', e.target.value)}
                placeholder="권한명을 입력하세요"
                required
              />
              <CmpInput
                label="권한코드"
                value={formData.authCd || ''}
                onChange={(e) => handleFormChange('authCd', e.target.value)}
                placeholder="권한 코드를 입력하세요"
                required
                disabled={isEdit} // 수정 시에는 코드 변경 불가
              />
              <CmpInput
                label="권한설명"
                value={formData.authDesc || ''}
                onChange={(e) => handleFormChange('authDesc', e.target.value)}
                placeholder="권한 설명을 입력하세요"
              />
              <CmpSelect
                label="권한레벨"
                value={formData.authLvl || ''}
                onChange={(value) => handleFormChange('authLvl', parseInt(value))}
                options={[
                  { value: '1', label: '1 - 최하위 권한' },
                  { value: '2', label: '2 - 하위 권한' },
                  { value: '3', label: '3 - 일반 권한' },
                  { value: '4', label: '4 - 중간 권한' },
                  { value: '5', label: '5 - 상위 권한' },
                  { value: '6', label: '6 - 고위 권한' },
                  { value: '7', label: '7 - 관리자 권한' },
                  { value: '8', label: '8 - 시스템 관리자' },
                  { value: '9', label: '9 - 슈퍼 관리자' },
                  { value: '10', label: '10 - 최고 관리자' },
                ]}
                required
              />
            </FormGrid>
            <div className="flex justify-end gap-2">
              <CmpButton
                label="취소"
                styleType="secondary"
                click={() => setShowModal(false)}
              />
              <CmpButton
                label={isEdit ? '수정' : '추가'}
                styleType="primary"
                click={handleSave}
              />
            </div>
          </ModalContent>
        );

      default:
        return null;
    }
  };

  return (
    <PageWrapper
      title="권한 관리"
      subtitle="사용자, 역할, 권한을 관리할 수 있습니다."
      showCard={false}
    >
      <TabContainer>
        <CmpTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <TabContent>
          <SearchSection>
            <CmpInput
              label="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요"
              style={{ minWidth: '200px' }}
              onKeyDown={
                activeTab === 'permissions'
                  ? (e) => { if (e.key === 'Enter') loadPermissions(1); }
                  : (e) => { if (e.key === 'Enter') handleSearch(); }
              }
            />
            {activeTab === 'users' && (
              <>
                <CmpSelect
                  label="상태"
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    handleFilterChange();
                  }}
                  options={[
                    { value: '', label: '전체' },
                    { value: '활성', label: '활성' },
                    { value: '비활성', label: '비활성' },
                  ]}
                />
                <CmpSelect
                  label="역할"
                  value={roleFilter}
                  onChange={(value) => {
                    setRoleFilter(value);
                    handleFilterChange();
                  }}
                  options={[
                    { value: '', label: '전체' },
                    ...rolesOptions
                  ]}
                />
              </>
            )}
            {activeTab === 'permissions' && (
              <>
                <CmpSelect
                  label="검색 필드"
                  value={permissionSearch.searchField}
                  onChange={(value) => setPermissionSearch(prev => ({ ...prev, searchField: value }))}
                  options={[
                    { value: '', label: '전체' },
                    { value: 'authCd', label: '권한코드' },
                    { value: 'authNm', label: '권한명' },
                    { value: 'authDesc', label: '권한설명' },
                  ]}
                />
                <CmpInput
                  label="검색어"
                  value={permissionSearch.keyword}
                  onChange={(e) => setPermissionSearch(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="검색어를 입력하세요"
                  style={{ minWidth: '200px' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadPermissions(1); }}
                />
              </>
            )}
            <CmpButton
              label="검색"
              styleType="primary"
              click={activeTab === 'permissions' ? () => loadPermissions(1) : handleSearch}
            />
          </SearchSection>

          <ActionSection>
            <div>
              <span className="text-sm text-gray-600">
                총 {loading ? '로딩 중...' : `${(
                  activeTab === 'users' ? users.length :
                  activeTab === 'roles' ? roles.length :
                  permissions.length
                )}개`} 항목
              </span>
            </div>
            <CmpButton
              label={activeTab === 'users' ? '사용자 추가' :
                     activeTab === 'roles' ? '역할 추가' : '권한 추가'}
              styleType="primary"
              click={handleAdd}
            />
          </ActionSection>

          {loading ? (
            <LoadingSpinner>
              <div>데이터를 불러오는 중...</div>
            </LoadingSpinner>
          ) : (users.length + roles.length + permissions.length) > 0 ? (
            <DataTable
              data={activeTab === 'users' ? users : activeTab === 'roles' ? roles : permissions}
              columns={getColumns(activeTab)}
              showStatusBadge={activeTab === 'users'}
              headerBgColor="#f8f9fa"
              className="bg-white rounded-lg shadow"
            />
          ) : (
            <CmpNoData
              msg="데이터가 없습니다."
              img="img_noData.svg"
              subMsg="검색 조건을 변경해보세요."
            />
          )}
        </TabContent>
      </TabContainer>

      <CommonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title=""
        size="lg"
      >
        {renderModalContent()}
      </CommonModal>
    </PageWrapper>
  );
};

export default AuthManagementPage;
