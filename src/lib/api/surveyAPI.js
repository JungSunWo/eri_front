/**
 * @File Name      : surveyAPI.js
 * @File path      : src/lib/api/surveyAPI.js
 * @author         : 정선우
 * @Description    : 설문조사 관련 API 함수들
 *                   - 설문조사 CRUD 및 결과 조회 기능
 *                   - 설문조사 문항 및 선택지 관리
 *                   - 설문조사 응답 및 통계 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from './apiClient';

/**
 * 설문조사 관리 API
 * - 설문조사 CRUD 및 결과 조회 기능
 * - 설문조사 문항 및 선택지 관리
 * - 설문조사 응답 및 통계 기능
 */
export const surveyAPI = {
  /**
   * 설문조사 목록 조회 (페이징/검색/필터링)
   * @param {Object} params - 조회 파라미터 (page, size, searchKeyword, surveyTyCd, surveyStsCd 등)
   * @returns {Promise<Object>} 설문조사 목록 (페이징 정보 포함)
   */
  getSurveyList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/surveys${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 설문조사 상세 조회
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @returns {Promise<Object>} 설문조사 상세 정보
   */
  getSurveyDetail: async (surveySeq) => {
    const response = await api.get(`/api/surveys/${surveySeq}`);
    return response.data;
  },

  /**
   * 설문조사 등록
   * @param {Object} surveyData - 설문조사 데이터
   * @returns {Promise<Object>} 등록 결과
   */
  createSurvey: async (surveyData) => {
    const response = await api.post('/api/surveys', surveyData);
    return response.data;
  },

  /**
   * 설문조사 수정
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} surveyData - 수정할 설문조사 데이터
   * @returns {Promise<Object>} 수정 결과
   */
  updateSurvey: async (surveySeq, surveyData) => {
    const response = await api.put(`/api/surveys/${surveySeq}`, surveyData);
    return response.data;
  },

  /**
   * 설문조사 삭제
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteSurvey: async (surveySeq) => {
    const response = await api.delete(`/api/surveys/${surveySeq}`);
    return response.data;
  },

  /**
   * 설문조사 상태 변경
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {string} status - 변경할 상태 (DRAFT, ACTIVE, CLOSED, ARCHIVED)
   * @returns {Promise<Object>} 상태 변경 결과
   */
  updateSurveyStatus: async (surveySeq, status) => {
    const response = await api.put(`/api/surveys/${surveySeq}/status`, { status });
    return response.data;
  },

  /**
   * 설문조사 결과 조회
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @returns {Promise<Object>} 설문조사 결과 통계
   */
  getSurveyResults: async (surveySeq) => {
    const response = await api.get(`/api/surveys/${surveySeq}/results`);
    return response.data;
  },

  /**
   * 설문조사 응답 목록 조회
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} params - 조회 파라미터 (page, size, anonymousYn 등)
   * @returns {Promise<Object>} 응답 목록 (페이징 정보 포함)
   */
  getSurveyResponses: async (surveySeq, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/surveys/${surveySeq}/responses${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 설문조사 문항 목록 조회
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @returns {Promise<Object>} 문항 목록
   */
  getSurveyQuestions: async (surveySeq) => {
    const response = await api.get(`/api/surveys/${surveySeq}/questions`);
    return response.data;
  },

  /**
   * 설문조사 문항 등록
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} questionData - 문항 데이터
   * @returns {Promise<Object>} 등록 결과
   */
  createSurveyQuestion: async (surveySeq, questionData) => {
    const response = await api.post(`/api/surveys/${surveySeq}/questions`, questionData);
    return response.data;
  },

  /**
   * 설문조사 문항 수정
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {string|number} questionSeq - 문항 시퀀스
   * @param {Object} questionData - 수정할 문항 데이터
   * @returns {Promise<Object>} 수정 결과
   */
  updateSurveyQuestion: async (surveySeq, questionSeq, questionData) => {
    const response = await api.put(`/api/surveys/${surveySeq}/questions/${questionSeq}`, questionData);
    return response.data;
  },

  /**
   * 설문조사 문항 삭제
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {string|number} questionSeq - 문항 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteSurveyQuestion: async (surveySeq, questionSeq) => {
    const response = await api.delete(`/api/surveys/${surveySeq}/questions/${questionSeq}`);
    return response.data;
  },

  /**
   * 설문조사 문항 순서 변경
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Array} questionOrders - 문항 순서 배열 [{questionSeq, questionOrd}, ...]
   * @returns {Promise<Object>} 순서 변경 결과
   */
  updateQuestionOrder: async (surveySeq, questionOrders) => {
    const response = await api.put(`/api/surveys/${surveySeq}/questions/order`, { questionOrders });
    return response.data;
  },

  /**
   * 설문조사 선택지 목록 조회
   * @param {string|number} questionSeq - 문항 시퀀스
   * @returns {Promise<Object>} 선택지 목록
   */
  getQuestionChoices: async (questionSeq) => {
    const response = await api.get(`/api/questions/${questionSeq}/choices`);
    return response.data;
  },

  /**
   * 설문조사 선택지 등록
   * @param {string|number} questionSeq - 문항 시퀀스
   * @param {Object} choiceData - 선택지 데이터
   * @returns {Promise<Object>} 등록 결과
   */
  createQuestionChoice: async (questionSeq, choiceData) => {
    const response = await api.post(`/api/questions/${questionSeq}/choices`, choiceData);
    return response.data;
  },

  /**
   * 설문조사 선택지 수정
   * @param {string|number} questionSeq - 문항 시퀀스
   * @param {string|number} choiceSeq - 선택지 시퀀스
   * @param {Object} choiceData - 수정할 선택지 데이터
   * @returns {Promise<Object>} 수정 결과
   */
  updateQuestionChoice: async (questionSeq, choiceSeq, choiceData) => {
    const response = await api.put(`/api/questions/${questionSeq}/choices/${choiceSeq}`, choiceData);
    return response.data;
  },

  /**
   * 설문조사 선택지 삭제
   * @param {string|number} questionSeq - 문항 시퀀스
   * @param {string|number} choiceSeq - 선택지 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteQuestionChoice: async (questionSeq, choiceSeq) => {
    const response = await api.delete(`/api/questions/${questionSeq}/choices/${choiceSeq}`);
    return response.data;
  },

  /**
   * 설문조사 응답 등록
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} responseData - 응답 데이터
   * @returns {Promise<Object>} 응답 등록 결과
   */
  submitSurveyResponse: async (surveySeq, responseData) => {
    const response = await api.post(`/api/surveys/${surveySeq}/submit`, responseData);
    return response.data;
  },

  /**
   * 설문조사 응답 상세 조회
   * @param {string|number} responseSeq - 응답 시퀀스
   * @returns {Promise<Object>} 응답 상세 정보
   */
  getResponseDetail: async (responseSeq) => {
    const response = await api.get(`/api/responses/${responseSeq}`);
    return response.data;
  },

  /**
   * 설문조사 통계 조회
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} params - 통계 파라미터 (groupBy, filterBy 등)
   * @returns {Promise<Object>} 통계 데이터
   */
  getSurveyStatistics: async (surveySeq, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/surveys/${surveySeq}/statistics${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 설문조사 결과 다운로드
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {string} format - 다운로드 형식 (excel, csv, pdf)
   * @returns {Promise<Blob>} 다운로드 파일
   */
  downloadSurveyResults: async (surveySeq, format = 'excel') => {
    const response = await api.get(`/api/surveys/${surveySeq}/download?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 설문조사 복사
   * @param {string|number} surveySeq - 원본 설문조사 시퀀스
   * @param {Object} copyData - 복사 설정 데이터
   * @returns {Promise<Object>} 복사된 설문조사 정보
   */
  copySurvey: async (surveySeq, copyData) => {
    const response = await api.post(`/api/surveys/${surveySeq}/copy`, copyData);
    return response.data;
  },

  /**
   * 설문조사 템플릿 목록 조회
   * @param {Object} params - 조회 파라미터
   * @returns {Promise<Object>} 템플릿 목록
   */
  getSurveyTemplates: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/surveys/templates${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 설문조사 템플릿으로 생성
   * @param {string|number} templateSeq - 템플릿 시퀀스
   * @param {Object} surveyData - 설문조사 기본 데이터
   * @returns {Promise<Object>} 생성된 설문조사 정보
   */
  createFromTemplate: async (templateSeq, surveyData) => {
    const response = await api.post(`/api/surveys/templates/${templateSeq}/create`, surveyData);
    return response.data;
  },

  /**
   * 설문조사 대상자 관리
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} targetData - 대상자 데이터
   * @returns {Promise<Object>} 대상자 설정 결과
   */
  setSurveyTargets: async (surveySeq, targetData) => {
    const response = await api.put(`/api/surveys/${surveySeq}/targets`, targetData);
    return response.data;
  },

  /**
   * 설문조사 대상자 목록 조회
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @returns {Promise<Object>} 대상자 목록
   */
  getSurveyTargets: async (surveySeq) => {
    const response = await api.get(`/api/surveys/${surveySeq}/targets`);
    return response.data;
  },

  /**
   * 설문조사 알림 발송
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} notificationData - 알림 데이터
   * @returns {Promise<Object>} 알림 발송 결과
   */
  sendSurveyNotification: async (surveySeq, notificationData) => {
    const response = await api.post(`/api/surveys/${surveySeq}/notify`, notificationData);
    return response.data;
  },

  /**
   * 설문조사 응답 기간 연장
   * @param {string|number} surveySeq - 설문조사 시퀀스
   * @param {Object} extensionData - 연장 데이터
   * @returns {Promise<Object>} 연장 결과
   */
  extendSurveyPeriod: async (surveySeq, extensionData) => {
    const response = await api.put(`/api/surveys/${surveySeq}/extend`, extensionData);
    return response.data;
  }
};
