/**
 * @File Name      : commonCodeAPI.js
 * @File path      : src/lib/api/commonCodeAPI.js
 * @author         : 정선우
 * @Description    : 공통코드 관련 API 함수들
 *                   - 그룹코드, 상세코드 CRUD 작업
 *                   - 시스템에서 사용하는 공통 코드 관리 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from '../apiClient';

/**
 * 공통코드관리 API
 * - 그룹코드, 상세코드 CRUD 작업
 * - 시스템에서 사용하는 공통 코드 관리 기능
 */
export const commonCodeAPI = {
  // 그룹코드 관련 API
  /**
   * 그룹코드 목록 조회
   * 공통코드 그룹 목록을 조회
   * @param {Object} params - 조회 파라미터 (페이지네이션, 검색 조건 등)
   * @returns {Promise<Object>} 그룹코드 목록
   */
  getGroupList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/common-code/groups${query ? `?${query}` : ''}`);
    return res.data;
  },

  /**
   * 그룹코드 생성
   * 새로운 공통코드 그룹을 생성
   * @param {Object} data - 그룹코드 데이터 (grpCd, grpNm, useYn 등)
   * @returns {Promise<Object>} 생성 결과
   */
  createGroup: async (data) => {
    const res = await api.post('/api/common-code/groups', data);
    return res.data;
  },

  /**
   * 그룹코드 수정
   * 기존 그룹코드 정보를 수정
   * @param {string} grpCd - 그룹코드
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정 결과
   */
  updateGroup: async (grpCd, data) => {
    const res = await api.put(`/api/common-code/groups/${grpCd}`, data);
    return res.data;
  },

  /**
   * 그룹코드 삭제
   * 그룹코드와 관련된 상세코드들을 함께 삭제
   * @param {string} grpCd - 그룹코드
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteGroup: async (grpCd) => {
    const res = await api.delete(`/api/common-code/groups/${grpCd}`);
    return res.data;
  },

  // 상세코드 관련 API
  /**
   * 상세코드 목록 조회
   * 특정 그룹코드에 속한 상세코드 목록을 조회
   * @param {Object} params - 조회 파라미터 (grpCd, 페이지네이션 등)
   * @returns {Promise<Object>} 상세코드 목록
   */
  getDetailList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/common-code/details${query ? `?${query}` : ''}`);
    return res.data;
  },

  /**
   * 상세코드 생성
   * 새로운 공통코드 상세 정보를 생성
   * @param {Object} data - 상세코드 데이터 (grpCd, dtlCd, dtlNm, useYn 등)
   * @returns {Promise<Object>} 생성 결과
   */
  createDetail: async (data) => {
    const res = await api.post('/api/common-code/details', data);
    return res.data;
  },

  /**
   * 상세코드 수정
   * 기존 상세코드 정보를 수정
   * @param {string} grpCd - 그룹코드
   * @param {string} dtlCd - 상세코드
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정 결과
   */
  updateDetail: async (grpCd, dtlCd, data) => {
    const res = await api.put(`/api/common-code/details/${grpCd}/${dtlCd}`, data);
    return res.data;
  },

  /**
   * 상세코드 삭제
   * 특정 그룹코드에 속한 상세코드를 삭제
   * @param {string} grpCd - 그룹코드
   * @param {string} dtlCd - 상세코드
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteDetail: async (grpCd, dtlCd) => {
    const res = await api.delete(`/api/common-code/details/${grpCd}/${dtlCd}`);
    return res.data;
  },
};
