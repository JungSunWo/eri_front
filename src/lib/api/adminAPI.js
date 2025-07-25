import { apiClient } from './apiClient';

/**
 * 관리자 관련 API
 */

// 관리자 목록 조회
export const getAdminList = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/admin/list', { params });
    return response.data;
  } catch (error) {
    console.error('관리자 목록 조회 실패:', error);
    throw error;
  }
};

// 관리자 등록
export const createAdmin = async (adminData) => {
  try {
    const response = await apiClient.post('/api/admin/register', adminData);
    return response.data;
  } catch (error) {
    console.error('관리자 등록 실패:', error);
    throw error;
  }
};

// 관리자 수정
export const updateAdmin = async (adminId, adminData) => {
  try {
    const response = await apiClient.put(`/api/admin/${adminId}`, adminData);
    return response.data;
  } catch (error) {
    console.error('관리자 수정 실패:', error);
    throw error;
  }
};

// 관리자 삭제
export const deleteAdmin = async (adminId) => {
  try {
    const response = await apiClient.delete(`/api/admin/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('관리자 삭제 실패:', error);
    throw error;
  }
};

// 직원 목록 조회 (관리자 등록용)
export const getEmployeeList = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/admin/employee/list', { params });
    return response.data;
  } catch (error) {
    console.error('직원 목록 조회 실패:', error);
    throw error;
  }
};

// 직원 상세 조회
export const getEmployeeDetail = async (empId) => {
  try {
    const response = await apiClient.get(`/api/employee/${empId}`);
    return response.data;
  } catch (error) {
    console.error('직원 상세 조회 실패:', error);
    throw error;
  }
};
