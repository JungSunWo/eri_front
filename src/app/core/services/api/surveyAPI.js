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

import { api } from '../apiClient';

/**
 * 설문조사 관련 API
 */

class SurveyAPI {
  // 설문조사 목록 조회 (페이징/검색/필터링)
  async getSurveyList(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/api/surveys${query ? `?${query}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 목록 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 상세 조회
  async getSurveyDetail(surveySeq) {
    try {
      const response = await api.get(`/api/surveys/${surveySeq}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 상세 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 등록
  async createSurvey(surveyData) {
    try {
      const response = await api.post('/api/surveys', surveyData);
      return response.data;
    } catch (error) {
      console.error('설문조사 등록 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 수정
  async updateSurvey(surveySeq, surveyData) {
    try {
      const response = await api.put(`/api/surveys/${surveySeq}`, surveyData);
      return response.data;
    } catch (error) {
      console.error('설문조사 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 삭제
  async deleteSurvey(surveySeq) {
    try {
      const response = await api.delete(`/api/surveys/${surveySeq}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 상태 변경
  async updateSurveyStatus(surveySeq, status) {
    try {
      const response = await api.put(`/api/surveys/${surveySeq}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('설문조사 상태 변경 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 결과 조회
  async getSurveyResults(surveySeq) {
    try {
      const response = await api.get(`/api/surveys/${surveySeq}/results`);
      return response.data;
    } catch (error) {
      console.error('설문조사 결과 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 응답 목록 조회
  async getSurveyResponses(surveySeq, params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/api/surveys/${surveySeq}/responses${query ? `?${query}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 응답 목록 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 문항 목록 조회
  async getSurveyQuestions(surveySeq) {
    try {
      const response = await api.get(`/api/surveys/${surveySeq}/questions`);
      return response.data;
    } catch (error) {
      console.error('설문조사 문항 목록 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 문항 등록
  async createSurveyQuestion(surveySeq, questionData) {
    try {
      const response = await api.post(`/api/surveys/${surveySeq}/questions`, questionData);
      return response.data;
    } catch (error) {
      console.error('설문조사 문항 등록 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 문항 수정
  async updateSurveyQuestion(surveySeq, questionSeq, questionData) {
    try {
      const response = await api.put(`/api/surveys/${surveySeq}/questions/${questionSeq}`, questionData);
      return response.data;
    } catch (error) {
      console.error('설문조사 문항 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 문항 삭제
  async deleteSurveyQuestion(surveySeq, questionSeq) {
    try {
      const response = await api.delete(`/api/surveys/${surveySeq}/questions/${questionSeq}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 문항 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 문항 순서 변경
  async updateQuestionOrder(surveySeq, questionOrders) {
    try {
      const response = await api.put(`/api/surveys/${surveySeq}/questions/order`, { questionOrders });
      return response.data;
    } catch (error) {
      console.error('설문조사 문항 순서 변경 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 선택지 목록 조회
  async getQuestionChoices(questionSeq) {
    try {
      const response = await api.get(`/api/questions/${questionSeq}/choices`);
      return response.data;
    } catch (error) {
      console.error('설문조사 선택지 목록 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 선택지 등록
  async createQuestionChoice(questionSeq, choiceData) {
    try {
      const response = await api.post(`/api/questions/${questionSeq}/choices`, choiceData);
      return response.data;
    } catch (error) {
      console.error('설문조사 선택지 등록 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 선택지 수정
  async updateQuestionChoice(questionSeq, choiceSeq, choiceData) {
    try {
      const response = await api.put(`/api/questions/${questionSeq}/choices/${choiceSeq}`, choiceData);
      return response.data;
    } catch (error) {
      console.error('설문조사 선택지 수정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 선택지 삭제
  async deleteQuestionChoice(questionSeq, choiceSeq) {
    try {
      const response = await api.delete(`/api/questions/${questionSeq}/choices/${choiceSeq}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 선택지 삭제 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 응답 등록
  async submitSurveyResponse(surveySeq, responseData) {
    try {
      const response = await api.post(`/api/surveys/${surveySeq}/submit`, responseData);
      return response.data;
    } catch (error) {
      console.error('설문조사 응답 등록 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 응답 상세 조회
  async getResponseDetail(responseSeq) {
    try {
      const response = await api.get(`/api/responses/${responseSeq}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 응답 상세 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 통계 조회
  async getSurveyStatistics(surveySeq, params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/api/surveys/${surveySeq}/statistics${query ? `?${query}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 통계 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 결과 다운로드
  async downloadSurveyResults(surveySeq, format = 'excel') {
    try {
      const response = await api.get(`/api/surveys/${surveySeq}/download?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('설문조사 결과 다운로드 실패:', error);
      throw error;
    }
  }

  // 설문조사 복사
  async copySurvey(surveySeq, copyData) {
    try {
      const response = await api.post(`/api/surveys/${surveySeq}/copy`, copyData);
      return response.data;
    } catch (error) {
      console.error('설문조사 복사 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 템플릿 목록 조회
  async getSurveyTemplates(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/api/surveys/templates${query ? `?${query}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('설문조사 템플릿 목록 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 템플릿으로 생성
  async createFromTemplate(templateSeq, surveyData) {
    try {
      const response = await api.post(`/api/surveys/templates/${templateSeq}/create`, surveyData);
      return response.data;
    } catch (error) {
      console.error('템플릿으로 설문조사 생성 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 대상자 관리
  async setSurveyTargets(surveySeq, targetData) {
    try {
      const response = await api.put(`/api/surveys/${surveySeq}/targets`, targetData);
      return response.data;
    } catch (error) {
      console.error('설문조사 대상자 설정 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 대상자 목록 조회
  async getSurveyTargets(surveySeq) {
    try {
      const response = await api.get(`/api/surveys/${surveySeq}/targets`);
      return response.data;
    } catch (error) {
      console.error('설문조사 대상자 목록 조회 실패:', error);
      throw error;
    }
  }

  // 설문조사 알림 발송
  async sendSurveyNotification(surveySeq, notificationData) {
    try {
      const response = await api.post(`/api/surveys/${surveySeq}/notify`, notificationData);
      return response.data;
    } catch (error) {
      console.error('설문조사 알림 발송 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  // 설문조사 응답 기간 연장
  async extendSurveyPeriod(surveySeq, extensionData) {
    try {
      const response = await api.put(`/api/surveys/${surveySeq}/extend`, extensionData);
      return response.data;
    } catch (error) {
      console.error('설문조사 응답 기간 연장 실패:', error);
      // 백엔드에서 반환한 오류 메시지를 그대로 반환
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}

export const surveyAPI = new SurveyAPI();
