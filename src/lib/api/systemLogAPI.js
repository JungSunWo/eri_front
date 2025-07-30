import { api } from './apiClient';

export const systemLogAPI = {
  // 시스템 로그 목록 조회 (페이징)
  getList: async (params = {}) => {
    const {
      page = 1,
      size = 20,
      logLevel,
      logType,
      empId,
      errorCode,
      startDate,
      endDate,
      searchKeyword,
      sortKey = 'logSeq',
      sortOrder = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortKey,
      sortOrder
    });

    if (logLevel) queryParams.append('logLevel', logLevel);
    if (logType) queryParams.append('logType', logType);
    if (empId) queryParams.append('empId', empId);
    if (errorCode) queryParams.append('errorCode', errorCode);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (searchKeyword) queryParams.append('searchKeyword', searchKeyword);

    try {
      const response = await api.get(`/api/system-log?${queryParams}`);
      console.log('systemLogAPI.getList 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.getList 오류:', error);
      throw error;
    }
  },

  // 로그 레벨별 통계 조회
  getLogLevelStats: async () => {
    try {
      const response = await api.get('/api/system-log/stats/level');
      console.log('systemLogAPI.getLogLevelStats 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.getLogLevelStats 오류:', error);
      throw error;
    }
  },

  // 로그 타입별 통계 조회
  getLogTypeStats: async () => {
    try {
      const response = await api.get('/api/system-log/stats/type');
      console.log('systemLogAPI.getLogTypeStats 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.getLogTypeStats 오류:', error);
      throw error;
    }
  },

  // 에러 로그 통계 조회
  getErrorLogStats: async (startDate, endDate) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    try {
      const response = await api.get(`/api/system-log/stats/error?${queryParams}`);
      console.log('systemLogAPI.getErrorLogStats 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.getErrorLogStats 오류:', error);
      throw error;
    }
  },

  // 특정 기간 로그 통계 조회
  getLogStatsByPeriod: async (startDate, endDate) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    try {
      const response = await api.get(`/api/system-log/stats/period?${queryParams}`);
      console.log('systemLogAPI.getLogStatsByPeriod 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.getLogStatsByPeriod 오류:', error);
      throw error;
    }
  },

  // 특정 로그 삭제
  deleteLog: async (logSeq) => {
    try {
      const response = await api.delete(`/api/system-log/${logSeq}`);
      console.log('systemLogAPI.deleteLog 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.deleteLog 오류:', error);
      throw error;
    }
  },

  // 오래된 로그 삭제
  deleteOldLogs: async (days = 90) => {
    try {
      const response = await api.delete(`/api/system-log/old?days=${days}`);
      console.log('systemLogAPI.deleteOldLogs 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.deleteOldLogs 오류:', error);
      throw error;
    }
  },

  // 로그 상세 조회
  getLogDetail: async (logSeq) => {
    try {
      const response = await api.get(`/api/system-log/${logSeq}`);
      console.log('systemLogAPI.getLogDetail 응답:', response);
      return response.data;
    } catch (error) {
      console.error('systemLogAPI.getLogDetail 오류:', error);
      throw error;
    }
  }
};
