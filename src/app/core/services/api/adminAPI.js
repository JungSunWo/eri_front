import { api } from '../apiClient';

/**
 * 관리자 관련 API
 */

class AdminAPI {
  // 관리자 목록 조회
  async getAdminList(params = {}) {
    try {
      const response = await api.get('/api/admin/list', { params });
      return response.data;
    } catch (error) {
      console.error('관리자 목록 조회 실패:', error);
      throw error;
    }
  }

  // 관리자 등록
  async createAdmin(adminData) {
    try {
      const response = await api.post('/api/admin/register', adminData);
      return response.data;
    } catch (error) {
      console.error('관리자 등록 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 관리자 수정
  async updateAdmin(adminId, adminData) {
    try {
      const response = await api.put(`/api/admin/${adminId}`, adminData);
      return response.data;
    } catch (error) {
      console.error('관리자 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 관리자 삭제
  async deleteAdmin(adminId) {
    try {
      const response = await api.delete(`/api/admin/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('관리자 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 직원 목록 조회 (관리자 등록용)
  async getEmployeeList(params = {}) {
    try {
      const response = await api.get('/api/admin/employee/list', { params });
      return response.data;
    } catch (error) {
      console.error('직원 목록 조회 실패:', error);
      throw error;
    }
  }

  // 직원 상세 조회
  async getEmployeeDetail(empId) {
    try {
      const response = await api.get(`/api/employee/${empId}`);
      return response.data;
    } catch (error) {
      console.error('직원 상세 조회 실패:', error);
      throw error;
    }
  }
}

export default new AdminAPI();
