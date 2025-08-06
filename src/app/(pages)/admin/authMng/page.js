'use client';

import { authManagementAPI, permissionAPI } from '@/app/core/services/api';
import CmpButton from '@/app/shared/components/button/cmp_button';
import { CmpNoData } from '@/app/shared/components/etc/cmp_noData';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import CmpTab from '@/app/shared/components/ui/CmpTab';
import CommonModal from '@/app/shared/components/ui/CommonModal';
import DataTable from '@/app/shared/components/ui/DataTable';
import { useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert, toast } from '@/app/shared/utils/ui_com';
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

  // Query parameters for each tab
  const usersQueryParams = {
    search: searchTerm,
    status: statusFilter,
    role: roleFilter
  };

  const rolesQueryParams = {
    search: searchTerm
  };

  const permissionsQueryParams = {
    page: permissionPage,
    size: 10,
    ...permissionSearch,
    sortKey: 'authLvl',
    sortOrder: 'desc'
  };

  // Users query
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery(
    ['users-list', usersQueryParams],
    () => authManagementAPI.getUsers(usersQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: activeTab === 'users'
    }
  );

  // Roles query
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles
  } = useQuery(
    ['roles-list', rolesQueryParams],
    () => authManagementAPI.getRoles(rolesQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: activeTab === 'roles'
    }
  );

  // Permissions query
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    error: permissionsError,
    refetch: refetchPermissions
  } = useQuery(
    ['permissions-list', permissionsQueryParams],
    () => permissionAPI.getList(permissionsQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: activeTab === 'permissions'
    }
  );

  // Roles for select options query
  const {
    data: rolesOptionsData,
    isLoading: rolesOptionsLoading
  } = useQuery(
    ['roles-options'],
    () => authManagementAPI.getRoles(),
    {
      cacheTime: 5 * 60 * 1000, // 5분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: activeTab === 'users'
    }
  );

  // User mutations
  const {
    mutate: createUserMutation,
    isLoading: createUserLoading,
    error: createUserError
  } = useMutation(
    'create-user',
    (userData) => authManagementAPI.createUser(userData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('사용자가 성공적으로 등록되었습니다.');
          setShowModal(false);
          refetchUsers();
        } else {
          toast.callCommonToastOpen(response.message || '사용자 등록에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('사용자 등록 실패:', error);
        toast.callCommonToastOpen('사용자 등록 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['users-list']]
    }
  );

  const {
    mutate: updateUserMutation,
    isLoading: updateUserLoading,
    error: updateUserError
  } = useMutation(
    'update-user',
    ({ userId, userData }) => authManagementAPI.updateUser(userId, userData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('사용자 정보가 성공적으로 수정되었습니다.');
          setShowModal(false);
          refetchUsers();
        } else {
          toast.callCommonToastOpen(response.message || '사용자 수정에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('사용자 수정 실패:', error);
        toast.callCommonToastOpen('사용자 수정 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['users-list']]
    }
  );

  const {
    mutate: deleteUserMutation,
    isLoading: deleteUserLoading,
    error: deleteUserError
  } = useMutation(
    'delete-user',
    (userId) => authManagementAPI.deleteUser(userId),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('사용자가 성공적으로 삭제되었습니다.');
          refetchUsers();
        } else {
          toast.callCommonToastOpen(response.message || '사용자 삭제에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('사용자 삭제 실패:', error);
        toast.callCommonToastOpen('사용자 삭제 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['users-list']]
    }
  );

  // Role mutations
  const {
    mutate: createRoleMutation,
    isLoading: createRoleLoading,
    error: createRoleError
  } = useMutation(
    'create-role',
    (roleData) => authManagementAPI.createRole(roleData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('역할이 성공적으로 등록되었습니다.');
          setShowModal(false);
          refetchRoles();
        } else {
          toast.callCommonToastOpen(response.message || '역할 등록에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('역할 등록 실패:', error);
        toast.callCommonToastOpen('역할 등록 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['roles-list']]
    }
  );

  const {
    mutate: updateRoleMutation,
    isLoading: updateRoleLoading,
    error: updateRoleError
  } = useMutation(
    'update-role',
    ({ roleId, roleData }) => authManagementAPI.updateRole(roleId, roleData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('역할 정보가 성공적으로 수정되었습니다.');
          setShowModal(false);
          refetchRoles();
        } else {
          toast.callCommonToastOpen(response.message || '역할 수정에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('역할 수정 실패:', error);
        toast.callCommonToastOpen('역할 수정 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['roles-list']]
    }
  );

  const {
    mutate: deleteRoleMutation,
    isLoading: deleteRoleLoading,
    error: deleteRoleError
  } = useMutation(
    'delete-role',
    (roleId) => authManagementAPI.deleteRole(roleId),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('역할이 성공적으로 삭제되었습니다.');
          refetchRoles();
        } else {
          toast.callCommonToastOpen(response.message || '역할 삭제에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('역할 삭제 실패:', error);
        toast.callCommonToastOpen('역할 삭제 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['roles-list']]
    }
  );

  // Permission mutations
  const {
    mutate: createPermissionMutation,
    isLoading: createPermissionLoading,
    error: createPermissionError
  } = useMutation(
    'create-permission',
    (permissionData) => permissionAPI.create(permissionData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('권한이 성공적으로 등록되었습니다.');
          setShowModal(false);
          refetchPermissions();
        } else {
          toast.callCommonToastOpen(response.message || '권한 등록에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('권한 등록 실패:', error);
        toast.callCommonToastOpen('권한 등록 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['permissions-list']]
    }
  );

  const {
    mutate: updatePermissionMutation,
    isLoading: updatePermissionLoading,
    error: updatePermissionError
  } = useMutation(
    'update-permission',
    ({ authCd, permissionData }) => permissionAPI.update(authCd, permissionData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('권한 정보가 성공적으로 수정되었습니다.');
          setShowModal(false);
          refetchPermissions();
        } else {
          toast.callCommonToastOpen(response.message || '권한 수정에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('권한 수정 실패:', error);
        toast.callCommonToastOpen('권한 수정 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['permissions-list']]
    }
  );

  const {
    mutate: deletePermissionMutation,
    isLoading: deletePermissionLoading,
    error: deletePermissionError
  } = useMutation(
    'delete-permission',
    (authCd) => permissionAPI.remove(authCd),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('권한이 성공적으로 삭제되었습니다.');
          refetchPermissions();
        } else {
          toast.callCommonToastOpen(response.message || '권한 삭제에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('권한 삭제 실패:', error);
        toast.callCommonToastOpen('권한 삭제 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['permissions-list']]
    }
  );

  // Data setting effects
  useEffect(() => {
    if (usersData?.data) {
      setUsers(usersData.data || []);
    }
  }, [usersData]);

  useEffect(() => {
    if (rolesData?.data) {
      setRoles(rolesData.data || []);
    }
  }, [rolesData]);

  useEffect(() => {
    if (permissionsData) {
      setPermissions(permissionsData.content || []);
      setPermissionTotalPages(permissionsData.totalPages || 1);
    }
  }, [permissionsData]);

  useEffect(() => {
    if (rolesOptionsData?.data) {
      const rolesData = rolesOptionsData.data || [];
      setRolesOptions(rolesData.map(role => ({
        value: role.name,
        label: role.name
      })));
    }
  }, [rolesOptionsData]);

  // Loading states
  const loading = usersLoading || rolesLoading || permissionsLoading ||
                 createUserLoading || updateUserLoading || deleteUserLoading ||
                 createRoleLoading || updateRoleLoading || deleteRoleLoading ||
                 createPermissionLoading || updatePermissionLoading || deletePermissionLoading;

  // Error handling
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

  // Search and filter handlers
  const handleSearch = () => {
    // Queries will automatically refetch when parameters change
  };

  const handleFilterChange = () => {
    // Queries will automatically refetch when parameters change
  };

  // Permission page change
  const handlePermissionPageChange = (page) => {
    setPermissionPage(page);
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
        okCallback: () => {
          try {
            switch (activeTab) {
              case 'users':
                deleteUserMutation(item.id);
                break;
              case 'roles':
                deleteRoleMutation(item.id);
                break;
              case 'permissions':
                deletePermissionMutation(item.authCd);
                break;
            }
          } catch (error) {
            console.error('삭제 실패:', error);
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
      toast.callCommonToastOpen('이름을 입력해주세요.');
      return;
    }
    if (!formData.username && activeTab === 'users') {
      toast.callCommonToastOpen('사용자명을 입력해주세요.');
      return;
    }

    try {
      if (modalType === 'add') {
        // Add logic here
        switch (activeTab) {
          case 'users':
            createUserMutation(formData);
            break;
          case 'roles':
            createRoleMutation(formData);
            break;
          case 'permissions':
            createPermissionMutation(formData);
            break;
        }
      } else {
        // Edit logic here
        switch (activeTab) {
          case 'users':
            updateUserMutation({ userId: selectedItem.id, userData: formData });
            break;
          case 'roles':
            updateRoleMutation({ roleId: selectedItem.id, roleData: formData });
            break;
          case 'permissions':
            updatePermissionMutation({ authCd: selectedItem.authCd, permissionData: formData });
            break;
        }
      }
    } catch (error) {
      console.error('저장 실패:', error);
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
      {/* 에러 메시지 표시 */}
      {(usersError || rolesError || permissionsError ||
        createUserError || updateUserError || deleteUserError ||
        createRoleError || updateRoleError || deleteRoleError ||
        createPermissionError || updatePermissionError || deletePermissionError) && (
        <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-800 mb-1">오류가 발생했습니다:</div>
          <div className="text-sm text-red-600">
            {usersError && <div>사용자 목록: {getErrorMessage(usersError)}</div>}
            {rolesError && <div>역할 목록: {getErrorMessage(rolesError)}</div>}
            {permissionsError && <div>권한 목록: {getErrorMessage(permissionsError)}</div>}
            {createUserError && <div>사용자 등록: {getErrorMessage(createUserError)}</div>}
            {updateUserError && <div>사용자 수정: {getErrorMessage(updateUserError)}</div>}
            {deleteUserError && <div>사용자 삭제: {getErrorMessage(deleteUserError)}</div>}
            {createRoleError && <div>역할 등록: {getErrorMessage(createRoleError)}</div>}
            {updateRoleError && <div>역할 수정: {getErrorMessage(updateRoleError)}</div>}
            {deleteRoleError && <div>역할 삭제: {getErrorMessage(deleteRoleError)}</div>}
            {createPermissionError && <div>권한 등록: {getErrorMessage(createPermissionError)}</div>}
            {updatePermissionError && <div>권한 수정: {getErrorMessage(updatePermissionError)}</div>}
            {deletePermissionError && <div>권한 삭제: {getErrorMessage(deletePermissionError)}</div>}
          </div>
        </div>
      )}

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
                  ? (e) => { if (e.key === 'Enter') setPermissionPage(1); }
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
                  onKeyDown={(e) => { if (e.key === 'Enter') setPermissionPage(1); }}
                />
              </>
            )}
            <CmpButton
              label="검색"
              styleType="primary"
              click={activeTab === 'permissions' ? () => setPermissionPage(1) : handleSearch}
              disabled={loading}
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
              disabled={loading}
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
              currentPage={activeTab === 'permissions' ? permissionPage : 1}
              totalPages={activeTab === 'permissions' ? permissionTotalPages : 1}
              onPageChange={activeTab === 'permissions' ? handlePermissionPageChange : undefined}
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
