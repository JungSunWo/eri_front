/**
 * @File Name      : consultationAPI.js
 * @File path      : src/lib/api/consultationAPI.js
 * @author         : 정선우
 * @Description    : 상담 게시판 관련 API 함수들
 *                   - 상담 게시판 CRUD 및 페이징, 검색 기능
 *                   - 답변 관리 및 파일 첨부 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from '../apiClient';

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
  },

  // =====================================================
  // 전문가 상담 관련 API
  // =====================================================

  /**
   * 전문가 상담 신청 목록 조회 (페이징/검색/필터링)
   * @param {Object} params - 조회 파라미터 (page, size, searchType, searchKeyword, aprvStsCd, anonymousYn, startDate, endDate, sortBy, sortDirection)
   * @returns {Promise<Object>} 전문가 상담 신청 목록 (페이징 정보 포함)
   */
  getExpertConsultationList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/expert-consultation/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 전문가 상담 신청 상세 조회
   * @param {string|number} appSeq - 신청 시퀀스
   * @returns {Promise<Object>} 전문가 상담 신청 상세 정보
   */
  getExpertConsultationDetail: async (appSeq) => {
    const response = await api.get(`/api/expert-consultation/${appSeq}`);
    return response.data;
  },

  /**
   * 전문가 상담 신청 등록
   * @param {Object} expertConsultationData - 전문가 상담 신청 데이터
   * @param {string} empId - 직원 ID
   * @returns {Promise<Object>} 등록 결과
   */
  createExpertConsultation: async (expertConsultationData, empId) => {
    const response = await api.post(`/api/expert-consultation/create?empId=${empId}`, expertConsultationData);
    return response.data;
  },

  /**
   * 전문가 상담 신청 수정
   * @param {string|number} appSeq - 신청 시퀀스
   * @param {Object} expertConsultationData - 수정할 데이터
   * @param {string} empId - 직원 ID
   * @returns {Promise<Object>} 수정 결과
   */
  updateExpertConsultation: async (appSeq, expertConsultationData, empId) => {
    const response = await api.put(`/api/expert-consultation/${appSeq}?empId=${empId}`, expertConsultationData);
    return response.data;
  },

  /**
   * 전문가 상담 신청 삭제
   * @param {string|number} appSeq - 신청 시퀀스
   * @param {string} empId - 직원 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteExpertConsultation: async (appSeq, empId) => {
    const response = await api.delete(`/api/expert-consultation/${appSeq}?empId=${empId}`);
    return response.data;
  },

  /**
   * 내 전문가 상담 신청 목록 조회
   * @param {Object} params - 조회 파라미터 (page, size)
   * @param {string} empId - 직원 ID
   * @returns {Promise<Object>} 내 전문가 상담 신청 목록 (페이징 정보 포함)
   */
  getMyExpertConsultationList: async (params = {}, empId) => {
    const query = new URLSearchParams({ ...params, empId }).toString();
    const response = await api.get(`/api/expert-consultation/my-list?${query}`);
    return response.data;
  },

  /**
   * 전문가 상담 신청 승인/반려
   * @param {string|number} appSeq - 신청 시퀀스
   * @param {string} aprvStsCd - 승인상태코드 (APPROVED/REJECTED)
   * @param {string} aprvEmpId - 승인자 직원 ID
   * @param {string} rejRsn - 반려사유 (반려시에만)
   * @returns {Promise<Object>} 승인/반려 결과
   */
  updateExpertConsultationApproval: async (appSeq, aprvStsCd, aprvEmpId, rejRsn = null) => {
    const params = new URLSearchParams({
      aprvStsCd,
      aprvEmpId,
      ...(rejRsn && { rejRsn })
    });
    const response = await api.put(`/api/expert-consultation/${appSeq}/approval?${params.toString()}`);
    return response.data;
  },

  /**
   * 상담사 스케줄 조회
   * @param {Object} params - 조회 파라미터 (cnslrEmpId, schDt, schTyCd 등)
   * @returns {Promise<Object>} 상담사 스케줄 목록
   */
  getCounselorSchedule: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/counselor-schedule/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 상담사 정보 조회
   * @param {Object} params - 조회 파라미터 (cnslrEmpId, cnslrClsfCd, availYn 등)
   * @returns {Promise<Object>} 상담사 정보 목록
   */
  getCounselorInfo: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/counselor-info/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 상담 시간 제한 조회
   * @param {Object} params - 조회 파라미터 (cnslDt, cnslTm, availYn 등)
   * @returns {Promise<Object>} 상담 시간 제한 목록
   */
  getConsultationTimeLimit: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/consultation-time-limit/list${query ? `?${query}` : ''}`);
    return response.data;
  }
};
