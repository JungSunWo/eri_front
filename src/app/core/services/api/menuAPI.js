/**
 * @File Name      : menuAPI.js
 * @File path      : src/lib/api/menuAPI.js
 * @author         : 정선우
 * @Description    : 메뉴 관련 API 함수들
 *                   - 메뉴 목록 조회, 등록, 수정, 삭제 등
 *                   - 사용자 권한에 따른 메뉴 정보 관리
 * @History        : 20250701  최초 신규
 **/

import { api } from '../apiClient';

/**
 * 메뉴 관련 API
 * - 메뉴 목록 조회 등
 * - 사용자 권한에 따른 메뉴 정보 관리
 */
export const menuAPI = {
  /**
   * 메뉴 목록 조회
   * 현재 사용자가 접근 가능한 메뉴 목록을 조회
   * @returns {Promise<Object>} 메뉴 목록
   */
  getMenuList: async () => {
    const response = await api.get('/api/menu/all');
    return response.data;
  },

  /**
   * 메뉴 목록 조회 (페이징/검색)
   * 메뉴 목록을 페이지네이션 및 검색 조건에 따라 조회
   * @param {Object} params - 조회 파라미터 (page, size, searchKeyword, mnuLvl, mnuUseYn, mnuAdminYn)
   * @returns {Promise<Object>} 메뉴 목록 (페이징 정보 포함)
   */
  getMenuListWithPaging: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/menu/list/paging${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 메뉴 상세 조회
   * 특정 메뉴의 상세 정보를 조회
   * @param {string} mnuCd - 메뉴 코드
   * @returns {Promise<Object>} 메뉴 상세 정보
   */
  getMenuByCd: async (mnuCd) => {
    const response = await api.get(`/api/menu/${mnuCd}`);
    return response.data;
  },

  /**
   * 상위 메뉴 목록 조회
   * 1depth 메뉴 목록을 조회 (서브메뉴 등록 시 사용)
   * @returns {Promise<Object>} 상위 메뉴 목록
   */
  getParentMenuList: async () => {
    const response = await api.get('/api/menu/parent');
    return response.data;
  },

  /**
   * 하위 메뉴 목록 조회
   * 특정 상위 메뉴의 하위 메뉴 목록을 조회
   * @param {string} pMnuCd - 상위 메뉴 코드
   * @returns {Promise<Object>} 하위 메뉴 목록
   */
  getSubMenuList: async (pMnuCd) => {
    const response = await api.get(`/api/menu/sub/${pMnuCd}`);
    return response.data;
  },

  /**
   * 메뉴 등록
   * 새로운 메뉴를 등록
   * @param {Object} menuData - 메뉴 데이터
   * @returns {Promise<Object>} 등록 결과
   */
  createMenu: async (menuData) => {
    console.log('메뉴 등록 요청 데이터:', menuData);
    const response = await api.post('/api/menu', menuData);
    return response.data;
  },

  /**
   * 메뉴 수정
   * 기존 메뉴 정보를 수정
   * @param {string} mnuCd - 메뉴 코드
   * @param {Object} menuData - 수정할 메뉴 데이터
   * @returns {Promise<Object>} 수정 결과
   */
  updateMenu: async (mnuCd, menuData) => {
    console.log('메뉴 수정 요청 데이터:', menuData);
    const response = await api.put(`/api/menu/${mnuCd}`, menuData);
    return response.data;
  },

  /**
   * 메뉴 삭제
   * 특정 메뉴를 삭제
   * @param {string} mnuCd - 메뉴 코드
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteMenu: async (mnuCd) => {
    const response = await api.delete(`/api/menu/${mnuCd}`);
    return response.data;
  },

  /**
   * 메뉴 순서 변경
   * 메뉴의 표시 순서를 변경
   * @param {string} mnuCd - 메뉴 코드
   * @param {number} mnuOrd - 새로운 순서
   * @returns {Promise<Object>} 변경 결과
   */
  updateMenuOrder: async (mnuCd, mnuOrd) => {
    const response = await api.put(`/api/menu/${mnuCd}/order?mnuOrd=${mnuOrd}`);
    return response.data;
  },

  /**
   * 사용자 접근 가능 메뉴 조회
   * 특정 사용자가 접근 가능한 메뉴 목록을 조회
   * @param {string} empId - 직원 ID
   * @param {boolean} isAdmin - 관리자 여부
   * @returns {Promise<Object>} 접근 가능 메뉴 목록
   */
  getUserAccessibleMenus: async (empId, isAdmin = false) => {
    const response = await api.get(`/api/menu/user/${empId}?isAdmin=${isAdmin}`);
    return response.data;
  },
};
