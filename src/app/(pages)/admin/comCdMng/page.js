'use client';
import { commonCodeAPI } from '@/app/core/services/api';
import Board from '@/app/shared/components/Board';
import CmpButton from '@/app/shared/components/button/cmp_button';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import CmpTab from '@/app/shared/components/ui/CmpTab';
import CmpTextarea from '@/app/shared/components/ui/CmpTextarea';
import CommonModal from '@/app/shared/components/ui/CommonModal';
import { useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { useEffect, useState } from 'react';

export default function ComCdMngPage() {
  const [tab, setTab] = useState('group');
  const [groupCodes, setGroupCodes] = useState([]);

  const tabs = [
    { key: 'group', label: '그룹코드 관리' },
    { key: 'detail', label: '상세코드 관리' }
  ];

  return (
    <PageWrapper title="ERI 공통코드 관리" >
      <div className="max-w-6xl mx-auto">
        <CmpTab
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
        />
        {tab === 'group' && <GroupCodeSection groupCodes={groupCodes} setGroupCodes={setGroupCodes} />}
        {tab === 'detail' && <DetailCodeSection groupCodes={groupCodes} />}
      </div>
    </PageWrapper>
  );
}

function GroupCodeSection({ groupCodes, setGroupCodes }) {
  const [search, setSearch] = useState({ keyword: '', useYn: '' });
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  // 기본값 설정 개선
  const defaultGroupForm = {
    grpCd: '',
    grpCdNm: '',
    desc: '',
    useYn: 'Y' // 기본값을 'Y'로 설정
  };
  const [modalForm, setModalForm] = useState(defaultGroupForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  // Board 페이징/정렬 상태
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState('grpCd');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRow, setSelectedRow] = useState(null);

  // 그룹 코드 조회 쿼리 파라미터
  const groupQueryParams = {
    keyword: search.keyword,
    useYn: search.useYn,
    page,
    size,
    sortKey,
    sortOrder
  };

  // 그룹 코드 목록 조회 (Zustand Query 사용)
  const {
    data: groupData,
    isLoading: groupLoading,
    error: groupError,
    refetch: refetchGroups
  } = useQuery(
    ['group-code-list', groupQueryParams],
    () => commonCodeAPI.getGroupList(groupQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
    }
  );

  // 그룹 코드 생성 뮤테이션
  const {
    mutate: createGroupMutation,
    isLoading: createGroupLoading,
    error: createGroupError
  } = useMutation(
    'create-group-code',
    (groupData) => commonCodeAPI.createGroup(groupData),
    {
      onSuccess: (response) => {
        if (response.success) {
          setAlert('그룹 코드가 성공적으로 등록되었습니다.');
          setShowModal(false);
          setModalForm(defaultGroupForm); // 기본값으로 초기화
          refetchGroups();
        } else {
          setError(response.message || '그룹 코드 등록에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('그룹 코드 등록 실패:', error);
        setError('그룹 코드 등록 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['group-code-list']]
    }
  );

  // 그룹 코드 수정 뮤테이션
  const {
    mutate: updateGroupMutation,
    isLoading: updateGroupLoading,
    error: updateGroupError
  } = useMutation(
    'update-group-code',
    ({ grpCd, groupData }) => commonCodeAPI.updateGroup(grpCd, groupData),
    {
      onSuccess: (response) => {
        if (response.success) {
          setAlert('그룹 코드가 성공적으로 수정되었습니다.');
          setShowModal(false);
          setModalForm(defaultGroupForm); // 기본값으로 초기화
          refetchGroups();
        } else {
          setError(response.message || '그룹 코드 수정에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('그룹 코드 수정 실패:', error);
        setError('그룹 코드 수정 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['group-code-list']]
    }
  );

  // 그룹 코드 삭제 뮤테이션
  const {
    mutate: deleteGroupMutation,
    isLoading: deleteGroupLoading,
    error: deleteGroupError
  } = useMutation(
    'delete-group-code',
    (grpCd) => commonCodeAPI.deleteGroup(grpCd),
    {
      onSuccess: (response) => {
        if (response.success) {
          setAlert('그룹 코드가 성공적으로 삭제되었습니다.');
          refetchGroups();
        } else {
          setAlert(response.message || '그룹 코드 삭제에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('그룹 코드 삭제 실패:', error);
        setAlert('그룹 코드 삭제 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['group-code-list']]
    }
  );

  // 데이터 설정
  useEffect(() => {
    if (groupData?.success) {
      const responseData = groupData.data;
      setData(responseData.content || []);
      setTotalPages(responseData.totalPages || 1);
      setGroupCodes((responseData.content || []).map(row => ({ grpCd: row.grpCd, grpCdNm: row.grpCdNm })));
    }
  }, [groupData]);

  // 로딩 상태 통합
  const loading = groupLoading || createGroupLoading || updateGroupLoading || deleteGroupLoading;

  // 에러 메시지 생성 함수
  const getErrorMessage = (error) => {
    if (!error) return '';

    if (typeof error === 'string') {
      return error;
    }

    if (error.type === 'response') {
      return `서버 오류 (${error.status}): ${error.message}`;
    } else if (error.type === 'network') {
      return '네트워크 연결 오류가 발생했습니다.';
    } else if (error.type === 'request') {
      return `요청 오류: ${error.message}`;
    }

    return error.message || '알 수 없는 오류가 발생했습니다.';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setSearch({ keyword: '', useYn: '' });
    setPage(1);
  };

  const openAddModal = () => {
    setModalMode('add');
    setModalForm(defaultGroupForm); // 기본값으로 초기화
    setShowModal(true);
    setEditId(null);
    setError('');
  };

  const openEditModal = (row) => {
    setModalMode('edit');
    // 수정 모드에서 기본값 설정 및 수정 가능하게 처리
    setModalForm({
      grpCd: row.grpCd || '',
      grpCdNm: row.grpCdNm || '',
      desc: row.desc || '',
      useYn: row.useYn || 'Y' // 기본값 설정
    });
    setShowModal(true);
    setEditId(row.grpCd);
    setError('');
  };

  const handleDelete = (grpCd) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteGroupMutation(grpCd);
    }
  };

  const handleModalSave = (e) => {
    e.preventDefault();

    if (!modalForm.grpCd.trim()) {
      setError('그룹 코드를 입력해주세요.');
      return;
    }

    if (!modalForm.grpCdNm.trim()) {
      setError('그룹 코드명을 입력해주세요.');
      return;
    }

    const groupData = {
      grpCd: modalForm.grpCd,
      grpCdNm: modalForm.grpCdNm,
      desc: modalForm.desc,
      useYn: modalForm.useYn
    };

    if (modalMode === 'add') {
      createGroupMutation(groupData);
    } else {
      updateGroupMutation({ grpCd: editId, groupData });
    }
  };

  const columns = [
    { key: 'grpCd', label: '그룹코드' },
    { key: 'grpCdNm', label: '그룹코드명' },
    { key: 'desc', label: '설명' },
    { key: 'useYn', label: '사용여부' },
    { key: 'actions', label: '작업', width: '120px' }
  ];

  return (
    <div className="space-y-6">
      {/* 검색 폼 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색어</label>
            <CmpInput
              value={search.keyword}
              onChange={(e) => setSearch(prev => ({ ...prev, keyword: e.target.value }))}
              placeholder="그룹코드 또는 그룹코드명"
              className="w-64"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용여부</label>
            <CmpSelect
              value={search.useYn}
              onChange={(value) => setSearch(prev => ({ ...prev, useYn: value }))}
              options={[
                { value: '', label: '전체' },
                { value: 'Y', label: '사용' },
                { value: 'N', label: '미사용' }
              ]}
              className="w-32"
            />
          </div>
          <CmpButton type="submit" variant="primary">검색</CmpButton>
          <CmpButton type="button" variant="secondary" onClick={handleReset}>초기화</CmpButton>
          <CmpButton type="button" variant="primary" onClick={openAddModal}>등록</CmpButton>
        </form>
      </div>

      {/* 에러 메시지 표시 */}
      {(groupError || createGroupError || updateGroupError || deleteGroupError) && (
        <div className="p-4 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-800 mb-1">오류가 발생했습니다:</div>
          <div className="text-sm text-red-600">
            {groupError && <div>목록 조회: {getErrorMessage(groupError)}</div>}
            {createGroupError && <div>그룹 코드 등록: {getErrorMessage(createGroupError)}</div>}
            {updateGroupError && <div>그룹 코드 수정: {getErrorMessage(updateGroupError)}</div>}
            {deleteGroupError && <div>그룹 코드 삭제: {getErrorMessage(deleteGroupError)}</div>}
          </div>
        </div>
      )}

      {/* 알림 메시지 */}
      {alert && (
        <div className="p-4 bg-green-50 rounded border border-green-200">
          <div className="text-sm text-green-800">{alert}</div>
        </div>
      )}

      {/* 목록 */}
      <Board
        columns={columns}
        data={data}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={(key, order) => {
          setSortKey(key);
          setSortOrder(order);
          setPage(1);
        }}
        renderCell={(row, col) => {
          if (col.key === 'useYn') {
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.useYn === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {row.useYn === 'Y' ? '사용' : '미사용'}
              </span>
            );
          }
          if (col.key === 'actions') {
            return (
              <div className="flex gap-2">
                <CmpButton
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditModal(row)}
                >
                  수정
                </CmpButton>
                <CmpButton
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(row.grpCd)}
                >
                  삭제
                </CmpButton>
              </div>
            );
          }
          return row[col.key];
        }}
      />

      {/* 모달 */}
      <CommonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? '그룹 코드 등록' : '그룹 코드 수정'}
      >
        <form onSubmit={handleModalSave} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">그룹 코드 *</label>
            <CmpInput
              value={modalForm.grpCd}
              onChange={(e) => setModalForm(prev => ({ ...prev, grpCd: e.target.value }))}
              placeholder="그룹 코드를 입력하세요"
              disabled={modalMode === 'edit'} // 수정 모드에서는 비활성화
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">그룹 코드명 *</label>
            <CmpInput
              value={modalForm.grpCdNm}
              onChange={(e) => setModalForm(prev => ({ ...prev, grpCdNm: e.target.value }))}
              placeholder="그룹 코드명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <CmpTextarea
              value={modalForm.desc}
              onChange={(e) => setModalForm(prev => ({ ...prev, desc: e.target.value }))}
              placeholder="설명을 입력하세요"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용여부</label>
            <CmpSelect
              value={modalForm.useYn}
              onChange={(value) => setModalForm(prev => ({ ...prev, useYn: value }))}
              options={[
                { value: 'Y', label: '사용' },
                { value: 'N', label: '미사용' }
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <CmpButton type="button" variant="secondary" onClick={() => setShowModal(false)}>
              취소
            </CmpButton>
            <CmpButton type="submit" variant="primary" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </CmpButton>
          </div>
        </form>
      </CommonModal>
    </div>
  );
}

function DetailCodeSection({ groupCodes }) {
  const [search, setSearch] = useState({ grpCd: '', keyword: '', useYn: '' });
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  // 기본값 설정 개선
  const defaultDetailForm = {
    grpCd: '',
    dtlCd: '',
    dtlCdNm: '',
    desc: '',
    useYn: 'Y', // 기본값을 'Y'로 설정
    sortOrder: 1 // 기본값을 1로 설정
  };
  const [modalForm, setModalForm] = useState(defaultDetailForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  // Board 페이징/정렬 상태
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState('dtlCd');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRow, setSelectedRow] = useState(null);

  // 상세 코드 조회 쿼리 파라미터
  const detailQueryParams = {
    grpCd: search.grpCd,
    keyword: search.keyword,
    useYn: search.useYn,
    page,
    size,
    sortKey,
    sortOrder
  };

  // 상세 코드 목록 조회 (Zustand Query 사용)
  const {
    data: detailData,
    isLoading: detailLoading,
    error: detailError,
    refetch: refetchDetails
  } = useQuery(
    ['detail-code-list', detailQueryParams],
    () => commonCodeAPI.getDetailList(detailQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
    }
  );

  // 상세 코드 생성 뮤테이션
  const {
    mutate: createDetailMutation,
    isLoading: createDetailLoading,
    error: createDetailError
  } = useMutation(
    'create-detail-code',
    (detailData) => commonCodeAPI.createDetail(detailData),
    {
      onSuccess: (response) => {
        if (response.success) {
          setAlert('상세 코드가 성공적으로 등록되었습니다.');
          setShowModal(false);
          setModalForm(defaultDetailForm); // 기본값으로 초기화
          refetchDetails();
        } else {
          setError(response.message || '상세 코드 등록에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('상세 코드 등록 실패:', error);
        setError('상세 코드 등록 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['detail-code-list']]
    }
  );

  // 상세 코드 수정 뮤테이션
  const {
    mutate: updateDetailMutation,
    isLoading: updateDetailLoading,
    error: updateDetailError
  } = useMutation(
    'update-detail-code',
    ({ grpCd, dtlCd, detailData }) => commonCodeAPI.updateDetail(grpCd, dtlCd, detailData),
    {
      onSuccess: (response) => {
        if (response.success) {
          setAlert('상세 코드가 성공적으로 수정되었습니다.');
          setShowModal(false);
          setModalForm(defaultDetailForm); // 기본값으로 초기화
          refetchDetails();
        } else {
          setError(response.message || '상세 코드 수정에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('상세 코드 수정 실패:', error);
        setError('상세 코드 수정 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['detail-code-list']]
    }
  );

  // 상세 코드 삭제 뮤테이션
  const {
    mutate: deleteDetailMutation,
    isLoading: deleteDetailLoading,
    error: deleteDetailError
  } = useMutation(
    'delete-detail-code',
    ({ grpCd, dtlCd }) => commonCodeAPI.deleteDetail(grpCd, dtlCd),
    {
      onSuccess: (response) => {
        if (response.success) {
          setAlert('상세 코드가 성공적으로 삭제되었습니다.');
          refetchDetails();
        } else {
          setAlert(response.message || '상세 코드 삭제에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('상세 코드 삭제 실패:', error);
        setAlert('상세 코드 삭제 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['detail-code-list']]
    }
  );

  // 데이터 설정
  useEffect(() => {
    if (detailData?.success) {
      const responseData = detailData.data;
      setData(responseData.content || []);
      setTotalPages(responseData.totalPages || 1);
    }
  }, [detailData]);

  // 로딩 상태 통합
  const loading = detailLoading || createDetailLoading || updateDetailLoading || deleteDetailLoading;

  // 에러 메시지 생성 함수
  const getErrorMessage = (error) => {
    if (!error) return '';

    if (typeof error === 'string') {
      return error;
    }

    if (error.type === 'response') {
      return `서버 오류 (${error.status}): ${error.message}`;
    } else if (error.type === 'network') {
      return '네트워크 연결 오류가 발생했습니다.';
    } else if (error.type === 'request') {
      return `요청 오류: ${error.message}`;
    }

    return error.message || '알 수 없는 오류가 발생했습니다.';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setSearch({ grpCd: '', keyword: '', useYn: '' });
    setPage(1);
  };

  const openAddModal = () => {
    setModalMode('add');
    setModalForm(defaultDetailForm); // 기본값으로 초기화
    setShowModal(true);
    setEditId(null);
    setError('');
  };

  const openEditModal = (row) => {
    setModalMode('edit');
    // 수정 모드에서 기본값 설정 및 수정 가능하게 처리
    setModalForm({
      grpCd: row.grpCd || '',
      dtlCd: row.dtlCd || '',
      dtlCdNm: row.dtlCdNm || '',
      desc: row.desc || '',
      useYn: row.useYn || 'Y', // 기본값 설정
      sortOrder: row.sortOrder || 1 // 기본값 설정
    });
    setShowModal(true);
    setEditId({ grpCd: row.grpCd, dtlCd: row.dtlCd });
    setError('');
  };

  const handleDelete = (grpCd, dtlCd) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteDetailMutation({ grpCd, dtlCd });
    }
  };

  const handleModalSave = (e) => {
    e.preventDefault();

    if (!modalForm.grpCd.trim()) {
      setError('그룹 코드를 선택해주세요.');
      return;
    }

    if (!modalForm.dtlCd.trim()) {
      setError('상세 코드를 입력해주세요.');
      return;
    }

    if (!modalForm.dtlCdNm.trim()) {
      setError('상세 코드명을 입력해주세요.');
      return;
    }

    const detailData = {
      grpCd: modalForm.grpCd,
      dtlCd: modalForm.dtlCd,
      dtlCdNm: modalForm.dtlCdNm,
      desc: modalForm.desc,
      useYn: modalForm.useYn,
      sortOrder: modalForm.sortOrder
    };

    if (modalMode === 'add') {
      createDetailMutation(detailData);
    } else {
      updateDetailMutation({ grpCd: editId.grpCd, dtlCd: editId.dtlCd, detailData });
    }
  };

  const columns = [
    { key: 'grpCd', label: '그룹코드' },
    { key: 'dtlCd', label: '상세코드' },
    { key: 'dtlCdNm', label: '상세코드명' },
    { key: 'desc', label: '설명' },
    { key: 'useYn', label: '사용여부' },
    { key: 'sortOrder', label: '정렬순서' },
    { key: 'actions', label: '작업', width: '120px' }
  ];

  return (
    <div className="space-y-6">
      {/* 검색 폼 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">그룹코드</label>
            <CmpSelect
              value={search.grpCd}
              onChange={(value) => setSearch(prev => ({ ...prev, grpCd: value }))}
              options={[
                { value: '', label: '전체' },
                ...groupCodes.map(code => ({ value: code.grpCd, label: `${code.grpCd} - ${code.grpCdNm}` }))
              ]}
              className="w-48"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색어</label>
            <CmpInput
              value={search.keyword}
              onChange={(e) => setSearch(prev => ({ ...prev, keyword: e.target.value }))}
              placeholder="상세코드 또는 상세코드명"
              className="w-64"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용여부</label>
            <CmpSelect
              value={search.useYn}
              onChange={(value) => setSearch(prev => ({ ...prev, useYn: value }))}
              options={[
                { value: '', label: '전체' },
                { value: 'Y', label: '사용' },
                { value: 'N', label: '미사용' }
              ]}
              className="w-32"
            />
          </div>
          <CmpButton type="submit" variant="primary">검색</CmpButton>
          <CmpButton type="button" variant="secondary" onClick={handleReset}>초기화</CmpButton>
          <CmpButton type="button" variant="primary" onClick={openAddModal}>등록</CmpButton>
        </form>
      </div>

      {/* 에러 메시지 표시 */}
      {(detailError || createDetailError || updateDetailError || deleteDetailError) && (
        <div className="p-4 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-800 mb-1">오류가 발생했습니다:</div>
          <div className="text-sm text-red-600">
            {detailError && <div>목록 조회: {getErrorMessage(detailError)}</div>}
            {createDetailError && <div>상세 코드 등록: {getErrorMessage(createDetailError)}</div>}
            {updateDetailError && <div>상세 코드 수정: {getErrorMessage(updateDetailError)}</div>}
            {deleteDetailError && <div>상세 코드 삭제: {getErrorMessage(deleteDetailError)}</div>}
          </div>
        </div>
      )}

      {/* 알림 메시지 */}
      {alert && (
        <div className="p-4 bg-green-50 rounded border border-green-200">
          <div className="text-sm text-green-800">{alert}</div>
        </div>
      )}

      {/* 목록 */}
      <Board
        columns={columns}
        data={data}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={(key, order) => {
          setSortKey(key);
          setSortOrder(order);
          setPage(1);
        }}
        renderCell={(row, col) => {
          if (col.key === 'useYn') {
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.useYn === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {row.useYn === 'Y' ? '사용' : '미사용'}
              </span>
            );
          }
          if (col.key === 'actions') {
            return (
              <div className="flex gap-2">
                <CmpButton
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditModal(row)}
                >
                  수정
                </CmpButton>
                <CmpButton
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(row.grpCd, row.dtlCd)}
                >
                  삭제
                </CmpButton>
              </div>
            );
          }
          return row[col.key];
        }}
      />

      {/* 모달 */}
      <CommonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? '상세 코드 등록' : '상세 코드 수정'}
      >
        <form onSubmit={handleModalSave} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">그룹 코드 *</label>
            <CmpSelect
              value={modalForm.grpCd}
              onChange={(value) => setModalForm(prev => ({ ...prev, grpCd: value }))}
              options={groupCodes.map(code => ({ value: code.grpCd, label: `${code.grpCd} - ${code.grpCdNm}` }))}
              disabled={modalMode === 'edit'} // 수정 모드에서는 비활성화
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 코드 *</label>
            <CmpInput
              value={modalForm.dtlCd}
              onChange={(e) => setModalForm(prev => ({ ...prev, dtlCd: e.target.value }))}
              placeholder="상세 코드를 입력하세요"
              disabled={modalMode === 'edit'} // 수정 모드에서는 비활성화
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 코드명 *</label>
            <CmpInput
              value={modalForm.dtlCdNm}
              onChange={(e) => setModalForm(prev => ({ ...prev, dtlCdNm: e.target.value }))}
              placeholder="상세 코드명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <CmpTextarea
              value={modalForm.desc}
              onChange={(e) => setModalForm(prev => ({ ...prev, desc: e.target.value }))}
              placeholder="설명을 입력하세요"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용여부</label>
            <CmpSelect
              value={modalForm.useYn}
              onChange={(value) => setModalForm(prev => ({ ...prev, useYn: value }))}
              options={[
                { value: 'Y', label: '사용' },
                { value: 'N', label: '미사용' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정렬순서</label>
            <CmpInput
              type="number"
              value={modalForm.sortOrder}
              onChange={(e) => setModalForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 1 }))}
              placeholder="정렬순서를 입력하세요"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <CmpButton type="button" variant="secondary" onClick={() => setShowModal(false)}>
              취소
            </CmpButton>
            <CmpButton type="submit" variant="primary" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </CmpButton>
          </div>
        </form>
      </CommonModal>
    </div>
  );
}
