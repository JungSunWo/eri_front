/**
 * @File Name      : authAPI.js
 * @File path      : src/lib/api/authAPI.js
 * @author         : 정선우
 * @Description    : 인증 관련 API 함수들
 *                   - 로그인, 로그아웃, 사용자 정보 조회, 세션 관리 등
 *                   - 직원 인증 및 세션 상태 관리 기능 제공
 * @History        : 20250701  최초 신규
 **/

import { api } from '../apiClient';

/**
 * 인증 관련 API 함수들
 * - 로그인, 로그아웃, 사용자 정보 조회, 세션 관리 등
 * - 직원 인증 및 세션 상태 관리 기능 제공
 */
export const authAPI = {

  /**
   * 직원 로그인 함수
   * 직원번호로 직원 정보를 조회하여 로그인 처리
   * @param {string} empNo - 직원번호
   * @returns {Promise<Object>} 직원 정보
   */
  empLogin: async (empNo) => {
    const response = await api.post('/api/auth/login', {
      origEmpNo: empNo
    });
    return response.data;
  },

  /**
   * 로그아웃 함수
   * 현재 세션을 종료하고 로그아웃 처리
   * @returns {Promise<Object>} 로그아웃 결과
   */
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  /**
   * 현재 로그인한 사용자 정보 조회
   * 세션에서 현재 로그인한 사용자의 상세 정보를 조회
   * @returns {Promise<Object>} 사용자 정보
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/current-user');
    return response.data;
  },

  /**
   * 인증 상태 확인
   * 현재 사용자의 인증 상태를 확인
   * @returns {Promise<Object>} 인증 상태
   */
  checkAuth: async () => {
    const response = await api.get('/api/auth/check-auth');
    return response.data;
  },

  /**
   * 세션 상태 확인
   * 현재 세션의 유효성을 확인
   * @returns {Promise<Object>} 세션 상태
   */
  sessionStatus: async () => {
    const response = await api.get('/api/auth/session-status');
    return response.data;
  },

  /**
   * 직원 캐시 조회
   * 서버에 캐시된 직원 정보를 조회
   * @returns {Promise<Object>} 직원 캐시 정보
   */
  getEmployeeCache: async () => {
    const response = await api.get('/api/auth/employee-cache');
    return response.data;
  },
};
