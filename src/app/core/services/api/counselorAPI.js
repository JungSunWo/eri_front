import { api } from './apiClient';

/**
 * 상담사 관련 API
 */

// 상담사 목록 조회
export const getCounselorList = async (params = {}) => {
  try {
    const response = await api.get('/api/counselor/list', { params });
    return response.data;
  } catch (error) {
    console.error('상담사 목록 조회 실패:', error);
    throw error;
  }
};

// 상담사 등록
export const createCounselor = async (counselorData) => {
  try {
    const response = await api.post('/api/counselor/register', counselorData);
    return response.data;
  } catch (error) {
    console.error('상담사 등록 실패:', error);
    // 백엔드에서 반환한 오류 메시지를 그대로 반환
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// 상담사 수정
export const updateCounselor = async (counselorEmpId, counselorData) => {
  try {
    const response = await api.put(`/api/counselor/${counselorEmpId}`, counselorData);
    return response.data;
  } catch (error) {
    console.error('상담사 수정 실패:', error);
    // 백엔드에서 반환한 오류 메시지를 그대로 반환
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// 상담사 삭제
export const deleteCounselor = async (counselorEmpId) => {
  try {
    const response = await api.delete(`/api/counselor/${counselorEmpId}`);
    return response.data;
  } catch (error) {
    console.error('상담사 삭제 실패:', error);
    // 백엔드에서 반환한 오류 메시지를 그대로 반환
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

// 직원 목록 조회 (상담사 등록용)
export const getEmployeeList = async (params = {}) => {
  try {
    const response = await api.get('/api/counselor/employee/list', { params });
    return response.data;
  } catch (error) {
    console.error('직원 목록 조회 실패:', error);
    throw error;
  }
};

// 직원 상세 조회
export const getEmployeeDetail = async (empId) => {
  try {
    const response = await api.get(`/api/employee/${empId}`);
    return response.data;
  } catch (error) {
    console.error('직원 상세 조회 실패:', error);
    throw error;
  }
};
