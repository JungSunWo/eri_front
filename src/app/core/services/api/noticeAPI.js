/**
 * @File Name      : noticeAPI.js
 * @File path      : src/lib/api/noticeAPI.js
 * @author         : 정선우
 * @Description    : 공지사항 관련 API 함수들
 *                   - 공지사항 CRUD 및 페이징, 검색 기능
 *                   - 사용자에게 공지사항 정보를 제공하는 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from '../apiClient';

/**
 * 공지사항 관련 API
 * - 공지사항 CRUD 및 페이징, 검색 기능
 * - 사용자에게 공지사항 정보를 제공하는 기능
 */
export const noticeAPI = {
  /**
   * 공지사항 목록 조회 (페이징/검색)
   * 공지사항 목록을 페이지네이션 및 검색 조건에 따라 조회
   * @param {Object} params - 조회 파라미터 (page, size, sortKey, sortOrder, ttl 등)
   * @returns {Promise<Object>} 공지사항 목록 (페이징 정보 포함)
   */
  getNoticePage: async (params = {}) => {
    // 프론트엔드 파라미터를 백엔드 파라미터로 변환
    const backendParams = {
      page: params.page || 1,
      size: params.size || 10,
      sortBy: params.sortKey || 'rowNum',           // sortKey → sortBy
      sortDirection: params.sortOrder || 'asc',     // sortOrder → sortDirection
      searchKeyword: params.searchKeyword || '',    // 검색 키워드
      searchField: params.searchField || 'ttl',     // 검색 필드 (ttl: 제목, cntn: 내용)
      // 추가 검색 조건들
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      stsCd: params.stsCd || '',
    };
    const query = new URLSearchParams(backendParams).toString();
    const response = await api.get(`/api/nti/page${query ? `?${query}` : ''}`);
    return response.data?.data;
  },

  /**
   * 공지사항 상세 조회
   * 특정 공지사항의 상세 정보를 조회
   * @param {string|number} id - 공지사항 ID
   * @returns {Promise<Object>} 공지사항 상세 정보
   */
  getNoticeDetail: async (id) => {
    const response = await api.get(`/api/nti/${id}`);
    return response.data;
  },

  /**
   * 공지사항 목록 조회 (기본)
   * 공지사항 목록을 기본 조건에 따라 조회
   * @param {Object} params - 조회 파라미터
   * @returns {Promise<Object>} 공지사항 목록
   */
  getNoticeList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/notice/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 공지사항 등록
   * 새로운 공지사항 정보를 등록
   * @param {FormData} formData - 공지사항 데이터 (파일 포함)
   * @returns {Promise<Object>} 등록 결과
   */
  createNotice: async (formData) => {
    const response = await api.post('/api/notice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 공지사항 수정
   * 기존 공지사항 정보를 수정
   * @param {string|number} seq - 공지사항 시퀀스
   * @param {FormData} formData - 수정할 데이터 (파일 포함)
   * @returns {Promise<Object>} 수정 결과
   */
  updateNotice: async (seq, formData) => {
    const response = await api.put(`/api/notice/${seq}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 공지사항 삭제
   * 특정 공지사항을 삭제
   * @param {string|number} seq - 공지사항 시퀀스
   * @param {string} empId - 삭제 요청 직원 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteNotice: async (seq, empId) => {
    const response = await api.delete(`/api/notice/${seq}?empId=${empId}`);
    return response.data;
  },
};
