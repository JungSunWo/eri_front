/**
 * @File Name      : authManagementAPI.js
 * @File path      : src/lib/api/authManagementAPI.js
 * @author         : 정선우
 * @Description    : 권한 관리 관련 API 함수들
 *                   - 사용자 관리, 역할 관리, 권한 관리
 *                   - 인증 및 권한 관련 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from './apiClient';

// 권한 관리 API
export const authManagementAPI = {
  // 사용자 관리
  getUsers: async (params = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const mockUsers = [
        { id: 1, username: 'admin', name: '관리자', email: 'admin@company.com', role: '관리자', department: 'IT팀', status: '활성', lastLogin: '2025-01-15 10:30:00' },
        { id: 2, username: 'user1', name: '김철수', email: 'kim@company.com', role: '사용자', department: '인사팀', status: '활성', lastLogin: '2025-01-14 15:20:00' },
        { id: 3, username: 'user2', name: '이영희', email: 'lee@company.com', role: '사용자', department: '영업팀', status: '비활성', lastLogin: '2025-01-10 09:15:00' },
      ];

      // 필터링 로직
      let filteredUsers = mockUsers;
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }
      if (params.status) {
        filteredUsers = filteredUsers.filter(user => user.status === params.status);
      }
      if (params.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }

      return { data: filteredUsers };
    }

    // 프로덕션 환경에서는 실제 API 호출
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/users${query ? `?${query}` : ''}`);
    return response.data;
  },

  createUser: async (userData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '사용자가 생성되었습니다.' };
    }
    const response = await api.post('/api/auth/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '사용자 정보가 업데이트되었습니다.' };
    }
    const response = await api.put(`/api/auth/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '사용자가 삭제되었습니다.' };
    }
    const response = await api.delete(`/api/auth/users/${userId}`);
    return response.data;
  },

  // 역할 관리
  getRoles: async (params = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const mockRoles = [
        { id: 1, name: '관리자', description: '시스템 전체 관리 권한', permissions: ['user:read', 'user:write', 'role:read', 'role:write'], userCount: 2 },
        { id: 2, name: '사용자', description: '일반 사용자 권한', permissions: ['user:read'], userCount: 15 },
        { id: 3, name: '게스트', description: '제한된 읽기 권한', permissions: [], userCount: 5 },
      ];

      // 필터링 로직
      let filteredRoles = mockRoles;
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredRoles = filteredRoles.filter(role =>
          role.name.toLowerCase().includes(searchTerm) ||
          role.description.toLowerCase().includes(searchTerm)
        );
      }

      return { data: filteredRoles };
    }

    // 프로덕션 환경에서는 실제 API 호출
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/roles${query ? `?${query}` : ''}`);
    return response.data;
  },

  createRole: async (roleData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '역할이 생성되었습니다.' };
    }
    const response = await api.post('/api/auth/roles', roleData);
    return response.data;
  },

  updateRole: async (roleId, roleData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '역할 정보가 업데이트되었습니다.' };
    }
    const response = await api.put(`/api/auth/roles/${roleId}`, roleData);
    return response.data;
  },

  deleteRole: async (roleId) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '역할이 삭제되었습니다.' };
    }
    const response = await api.delete(`/api/auth/roles/${roleId}`);
    return response.data;
  },

  // 권한 관리
  getPermissions: async (params = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const mockPermissions = [
        { id: 1, name: '사용자 읽기', code: 'user:read', description: '사용자 정보 조회 권한', category: '사용자 관리' },
        { id: 2, name: '사용자 쓰기', code: 'user:write', description: '사용자 정보 수정 권한', category: '사용자 관리' },
        { id: 3, name: '역할 읽기', code: 'role:read', description: '역할 정보 조회 권한', category: '역할 관리' },
        { id: 4, name: '역할 쓰기', code: 'role:write', description: '역할 정보 수정 권한', category: '역할 관리' },
        { id: 5, name: '권한 읽기', code: 'permission:read', description: '권한 정보 조회 권한', category: '권한 관리' },
        { id: 6, name: '권한 쓰기', code: 'permission:write', description: '권한 정보 수정 권한', category: '권한 관리' },
      ];

      // 필터링 로직
      let filteredPermissions = mockPermissions;
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredPermissions = filteredPermissions.filter(permission =>
          permission.name.toLowerCase().includes(searchTerm) ||
          permission.code.toLowerCase().includes(searchTerm) ||
          permission.description.toLowerCase().includes(searchTerm)
        );
      }

      return { data: filteredPermissions };
    }

    // 프로덕션 환경에서는 실제 API 호출
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/permissions${query ? `?${query}` : ''}`);
    return response.data;
  },

  createPermission: async (permissionData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '권한이 생성되었습니다.' };
    }
    const response = await api.post('/api/auth/permissions', permissionData);
    return response.data;
  },

  updatePermission: async (permissionId, permissionData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '권한 정보가 업데이트되었습니다.' };
    }
    const response = await api.put(`/api/auth/permissions/${permissionId}`, permissionData);
    return response.data;
  },

  deletePermission: async (permissionId) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '권한이 삭제되었습니다.' };
    }
    const response = await api.delete(`/api/auth/permissions/${permissionId}`);
    return response.data;
  },
};

export const permissionAPI = {
  // 권한 목록 조회 (페이징/검색)
  getList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/list?${query}`);
    return response.data;
  },
  // 권한 상세
  get: async (authCd) => {
    const response = await api.get(`/api/auth/${authCd}`);
    return response.data;
  },
  // 권한 등록
  create: async (data) => {
    const response = await api.post('/api/auth', data);
    return response.data;
  },
  // 권한 수정
  update: async (authCd, data) => {
    const response = await api.put(`/api/auth/${authCd}`, data);
    return response.data;
  },
  // 권한 삭제
  remove: async (authCd) => {
    const response = await api.delete(`/api/auth/${authCd}`);
    return response.data;
  }
};
