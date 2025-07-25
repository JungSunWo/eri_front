/**
 * @File Name      : consultationAPI.js
 * @File path      : src/lib/api/consultationAPI.js
 * @author         : 정선우
 * @Description    : 상담 게시판 관련 API 함수들
 *                   - 상담 게시판 CRUD 및 페이징, 검색 기능
 *                   - 답변 관리 및 파일 첨부 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from './apiClient';

/**
 * 상담 게시판 관련 API
 * - 상담 게시판 CRUD 및 페이징, 검색 기능
 * - 답변 관리 및 파일 첨부 기능
 */
export const consultationAPI = {
  /**
   * 상담 목록 조회 (페이징/검색/필터링)
   * @param {Object} params - 조회 파라미터 (page, size, searchType, searchKeyword, categoryCd, stsCd, anonymousYn, urgentYn, startDate, endDate, sortBy, sortDirection)
   * @returns {Promise<Object>} 상담 목록 (페이징 정보 포함)
   */
  getConsultationList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/consultation/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 상담 상세 조회
   * @param {string|number} seq - 상담 시퀀스
   * @returns {Promise<Object>} 상담 상세 정보
   */
  getConsultationDetail: async (seq) => {
    const response = await api.get(`/api/consultation/${seq}`);
    return response.data;
  },

  /**
   * 상담 등록
   * @param {FormData} formData - 상담 데이터 (파일 포함)
   * @returns {Promise<Object>} 등록 결과
   */
  createConsultation: async (formData) => {
    const response = await api.post('/api/consultation/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 상담 수정
   * @param {string|number} seq - 상담 시퀀스
   * @param {FormData} formData - 수정할 데이터 (파일 포함)
   * @returns {Promise<Object>} 수정 결과
   */
  updateConsultation: async (seq, formData) => {
    const response = await api.put(`/api/consultation/${seq}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 상담 삭제
   * @param {string|number} seq - 상담 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteConsultation: async (seq) => {
    const response = await api.delete(`/api/consultation/${seq}`);
    return response.data;
  },

  /**
   * 답변 저장
   * @param {string|number} seq - 상담 시퀀스
   * @param {FormData} formData - 답변 데이터 (파일 포함)
   * @returns {Promise<Object>} 답변 저장 결과
   */
  saveAnswer: async (seq, formData) => {
    const response = await api.post(`/api/consultation/${seq}/answer`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 내 상담 목록 조회
   * @param {Object} params - 조회 파라미터 (page, size)
   * @returns {Promise<Object>} 내 상담 목록 (페이징 정보 포함)
   */
  getMyConsultationList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/consultation/my${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 상담 파일 다운로드
   * @param {string|number} fileSeq - 파일 시퀀스
   * @returns {Promise<Blob>} 다운로드 파일
   */
  downloadFile: async (fileSeq) => {
    const response = await api.get(`/api/file/download/${fileSeq}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 상담 파일 삭제
   * @param {string|number} fileSeq - 파일 시퀀스
   * @returns {Promise<Object>} 파일 삭제 결과
   */
  deleteFile: async (fileSeq) => {
    const response = await api.delete(`/api/file/${fileSeq}`);
    return response.data;
  },

  /**
   * 상담 조회수 증가
   * @param {string|number} seq - 상담 시퀀스
   * @returns {Promise<Object>} 조회수 증가 결과
   */
  incrementViewCount: async (seq) => {
    const response = await api.put(`/api/consultation/${seq}/view`);
    return response.data;
  },

  /**
   * 상담 상태 변경
   * @param {string|number} seq - 상담 시퀀스
   * @param {string} status - 변경할 상태
   * @returns {Promise<Object>} 상태 변경 결과
   */
  updateStatus: async (seq, status) => {
    const response = await api.put(`/api/consultation/${seq}/status`, { status });
    return response.data;
  },

  /**
   * 상담 우선순위 변경
   * @param {string|number} seq - 상담 시퀀스
   * @param {string} priority - 변경할 우선순위
   * @returns {Promise<Object>} 우선순위 변경 결과
   */
  updatePriority: async (seq, priority) => {
    const response = await api.put(`/api/consultation/${seq}/priority`, { priority });
    return response.data;
  },

  /**
   * 상담 통계 조회
   * @param {Object} params - 통계 파라미터 (startDate, endDate, categoryCd 등)
   * @returns {Promise<Object>} 상담 통계 데이터
   */
  getStatistics: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/consultation/statistics${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 상담 알림 발송
   * @param {string|number} seq - 상담 시퀀스
   * @param {Object} notificationData - 알림 데이터
   * @returns {Promise<Object>} 알림 발송 결과
   */
  sendNotification: async (seq, notificationData) => {
    const response = await api.post(`/api/consultation/${seq}/notify`, notificationData);
    return response.data;
  },

  /**
   * 상담 템플릿 목록 조회
   * @param {Object} params - 조회 파라미터
   * @returns {Promise<Object>} 템플릿 목록
   */
  getTemplates: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/consultation/templates${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 상담 템플릿으로 답변 생성
   * @param {string|number} seq - 상담 시퀀스
   * @param {string|number} templateSeq - 템플릿 시퀀스
   * @param {Object} answerData - 답변 데이터
   * @returns {Promise<Object>} 답변 생성 결과
   */
  createAnswerFromTemplate: async (seq, templateSeq, answerData) => {
    const response = await api.post(`/api/consultation/${seq}/answer/template/${templateSeq}`, answerData);
    return response.data;
  }
};
