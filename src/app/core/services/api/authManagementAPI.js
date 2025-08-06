/**
 * @File Name      : authManagementAPI.js
 * @File path      : src/lib/api/authManagementAPI.js
 * @author         : 정선우
 * @Description    : 권한 관리 관련 API 함수들
 *                   - 사용자 관리, 역할 관리, 권한 관리
 *                   - 인증 및 권한 관련 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from '../apiClient';

/**
 * 권한 관리 관련 API
 */

class AuthManagementAPI {
  // 사용자 관리
  async getUsers(params = {}) {
    try {
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
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '사용자가 생성되었습니다.' };
      }
      const response = await api.post('/api/auth/users', userData);
      return response.data;
    } catch (error) {
      console.error('사용자 생성 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '사용자 정보가 업데이트되었습니다.' };
      }
      const response = await api.put(`/api/auth/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('사용자 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '사용자가 삭제되었습니다.' };
      }
      const response = await api.delete(`/api/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 역할 관리
  async getRoles(params = {}) {
    try {
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
    } catch (error) {
      console.error('역할 목록 조회 실패:', error);
      throw error;
    }
  }

  async createRole(roleData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '역할이 생성되었습니다.' };
      }
      const response = await api.post('/api/auth/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('역할 생성 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async updateRole(roleId, roleData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '역할 정보가 업데이트되었습니다.' };
      }
      const response = await api.put(`/api/auth/roles/${roleId}`, roleData);
      return response.data;
    } catch (error) {
      console.error('역할 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async deleteRole(roleId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '역할이 삭제되었습니다.' };
      }
      const response = await api.delete(`/api/auth/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error('역할 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 권한 관리
  async getPermissions(params = {}) {
    try {
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
    } catch (error) {
      console.error('권한 목록 조회 실패:', error);
      throw error;
    }
  }

  async createPermission(permissionData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '권한이 생성되었습니다.' };
      }
      const response = await api.post('/api/auth/permissions', permissionData);
      return response.data;
    } catch (error) {
      console.error('권한 생성 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async updatePermission(permissionId, permissionData) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '권한 정보가 업데이트되었습니다.' };
      }
      const response = await api.put(`/api/auth/permissions/${permissionId}`, permissionData);
      return response.data;
    } catch (error) {
      console.error('권한 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  async deletePermission(permissionId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        return { success: true, message: '권한이 삭제되었습니다.' };
      }
      const response = await api.delete(`/api/auth/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error('권한 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}

class PermissionAPI {
  // 권한 목록 조회 (페이징/검색)
  async getList(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/api/auth/list?${query}`);
      return response.data;
    } catch (error) {
      console.error('권한 목록 조회 실패:', error);
      throw error;
    }
  }

  // 권한 상세
  async get(authCd) {
    try {
      const response = await api.get(`/api/auth/${authCd}`);
      return response.data;
    } catch (error) {
      console.error('권한 상세 조회 실패:', error);
      throw error;
    }
  }

  // 권한 등록
  async create(data) {
    try {
      const response = await api.post('/api/auth', data);
      return response.data;
    } catch (error) {
      console.error('권한 등록 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 권한 수정
  async update(authCd, data) {
    try {
      const response = await api.put(`/api/auth/${authCd}`, data);
      return response.data;
    } catch (error) {
      console.error('권한 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 권한 삭제
  async remove(authCd) {
    try {
      const response = await api.delete(`/api/auth/${authCd}`);
      return response.data;
    } catch (error) {
      console.error('권한 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}

export const authManagementAPI = new AuthManagementAPI();
export const permissionAPI = new PermissionAPI();
