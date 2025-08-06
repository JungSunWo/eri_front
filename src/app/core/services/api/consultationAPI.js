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

  // =====================================================
  // 게시판 파일 첨부 관련 API
  // =====================================================

  /**
   * 게시판 파일 첨부 목록 조회 (페이징/검색)
   * @param {Object} params - 조회 파라미터 (page, size, searchType, searchKeyword, brdSeq, sortBy, sortDirection)
   * @returns {Promise<Object>} 파일 첨부 목록 (페이징 정보 포함)
   */
  getBoardFileAttachList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/board-file-attach/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 게시판 파일 첨부 상세 조회
   * @param {string|number} fileSeq - 파일 시퀀스
   * @returns {Promise<Object>} 파일 첨부 상세 정보
   */
  getBoardFileAttachDetail: async (fileSeq) => {
    const response = await api.get(`/api/board-file-attach/${fileSeq}`);
    return response.data;
  },

  /**
   * 게시글별 파일 첨부 목록 조회
   * @param {string|number} brdSeq - 게시글 시퀀스
   * @returns {Promise<Array>} 파일 첨부 목록
   */
  getBoardFileAttachByBrdSeq: async (brdSeq) => {
    const response = await api.get(`/api/board-file-attach/board/${brdSeq}`);
    return response.data;
  },

  /**
   * 게시판 파일 업로드
   * @param {FormData} formData - 파일 데이터 (file, brdSeq, regId)
   * @returns {Promise<Object>} 업로드된 파일 정보
   */
  uploadBoardFile: async (formData) => {
    const response = await api.post('/api/board-file-attach/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 게시판 파일 다운로드
   * @param {string|number} fileSeq - 파일 시퀀스
   * @returns {Promise<Blob>} 파일 데이터
   */
  downloadBoardFile: async (fileSeq) => {
    const response = await api.get(`/api/board-file-attach/download/${fileSeq}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 게시판 파일 미리보기 (이미지 파일)
   * @param {string|number} fileSeq - 파일 시퀀스
   * @returns {Promise<Blob>} 이미지 데이터
   */
  previewBoardFile: async (fileSeq) => {
    const response = await api.get(`/api/board-file-attach/preview/${fileSeq}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 게시판 파일 첨부 수정
   * @param {string|number} fileSeq - 파일 시퀀스
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정된 파일 첨부 정보
   */
  updateBoardFileAttach: async (fileSeq, data) => {
    const response = await api.put(`/api/board-file-attach/${fileSeq}`, data);
    return response.data;
  },

  /**
   * 게시판 파일 첨부 삭제
   * @param {string|number} fileSeq - 파일 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteBoardFileAttach: async (fileSeq) => {
    const response = await api.delete(`/api/board-file-attach/${fileSeq}`);
    return response.data;
  },

  /**
   * 게시글별 파일 첨부 삭제
   * @param {string|number} brdSeq - 게시글 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteBoardFileAttachByBrdSeq: async (brdSeq) => {
    const response = await api.delete(`/api/board-file-attach/board/${brdSeq}`);
    return response.data;
  },

  /**
   * 게시판 파일 이미지 링크 정보 업데이트
   * @param {string|number} fileSeq - 파일 시퀀스
   * @param {string} imgLinks - 이미지 링크 정보 (JSON 문자열)
   * @returns {Promise<Object>} 업데이트 결과
   */
  updateBoardFileImgLinks: async (fileSeq, imgLinks) => {
    const response = await api.put(`/api/board-file-attach/${fileSeq}/img-links`, {
      imgLinks: imgLinks,
    });
    return response.data;
  },

  // =====================================================
  // 이미지 게시판 관련 API
  // =====================================================

  /**
   * 이미지 게시판 목록 조회 (페이징/검색)
   * @param {Object} params - 조회 파라미터 (page, size, searchType, searchKeyword, sortBy, sortDirection)
   * @returns {Promise<Object>} 이미지 게시판 목록 (페이징 정보 포함)
   */
  getImageBoardList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/image-board/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 이미지 게시판 상세 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Object>} 이미지 게시판 상세 정보
   */
  getImageBoardDetail: async (imgBrdSeq) => {
    const response = await api.get(`/api/image-board/${imgBrdSeq}`);
    return response.data;
  },

  /**
   * 이미지 게시판과 이미지 파일들을 함께 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Object>} 이미지 게시판 정보 (이미지 파일 목록 포함)
   */
  getImageBoardWithFiles: async (imgBrdSeq) => {
    const response = await api.get(`/api/image-board/${imgBrdSeq}/with-files`);
    return response.data;
  },

  /**
   * 이미지 게시판 등록
   * @param {Object} data - 이미지 게시판 데이터
   * @returns {Promise<Object>} 등록된 이미지 게시판 정보
   */
  createImageBoard: async (data) => {
    const response = await api.post('/api/image-board', data);
    return response.data;
  },

  /**
   * 이미지 게시판 수정
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정된 이미지 게시판 정보
   */
  updateImageBoard: async (imgBrdSeq, data) => {
    const response = await api.put(`/api/image-board/${imgBrdSeq}`, data);
    return response.data;
  },

  /**
   * 이미지 게시판 삭제
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteImageBoard: async (imgBrdSeq) => {
    const response = await api.delete(`/api/image-board/${imgBrdSeq}`);
    return response.data;
  },

  /**
   * 최근 등록된 이미지 게시판 목록 조회
   * @param {number} limit - 조회 개수 제한
   * @returns {Promise<Array>} 이미지 게시판 목록
   */
  getRecentImageBoardList: async (limit = 5) => {
    const response = await api.get(`/api/image-board/recent?limit=${limit}`);
    return response.data;
  },

  /**
   * 이미지 게시판 제목 중복 확인
   * @param {string} imgBrdTitl - 이미지 게시판 제목
   * @returns {Promise<Object>} 중복 여부
   */
  checkImageBoardTitle: async (imgBrdTitl) => {
    const response = await api.get(`/api/image-board/check-title?imgBrdTitl=${imgBrdTitl}`);
    return response.data;
  },

  /**
   * 이미지 게시판 선택 통계 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Object>} 선택 통계 정보
   */
  getImageBoardStatistics: async (imgBrdSeq) => {
    const response = await api.get(`/api/image-board/${imgBrdSeq}/statistics`);
    return response.data;
  },

  // =====================================================
  // 이미지 파일 관련 API
  // =====================================================

  /**
   * 이미지 파일 목록 조회 (페이징/검색)
   * @param {Object} params - 조회 파라미터 (page, size, searchType, searchKeyword, imgBrdSeq, sortBy, sortDirection)
   * @returns {Promise<Object>} 이미지 파일 목록 (페이징 정보 포함)
   */
  getImageFileList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/image-file/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 이미지 파일 상세 조회
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @returns {Promise<Object>} 이미지 파일 상세 정보
   */
  getImageFileDetail: async (imgFileSeq) => {
    const response = await api.get(`/api/image-file/${imgFileSeq}`);
    return response.data;
  },

  /**
   * 이미지 게시판별 이미지 파일 목록 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Array>} 이미지 파일 목록
   */
  getImageFileByBrdSeq: async (imgBrdSeq) => {
    const response = await api.get(`/api/image-file/board/${imgBrdSeq}`);
    return response.data;
  },

  /**
   * 이미지 파일 업로드
   * @param {FormData} formData - 파일 데이터 (file, imgBrdSeq, imgText, regEmpId)
   * @returns {Promise<Object>} 업로드된 이미지 파일 정보
   */
  uploadImageFile: async (formData) => {
    const response = await api.post('/api/image-file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 이미지 파일 다운로드
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @returns {Promise<Blob>} 이미지 파일 데이터
   */
  downloadImageFile: async (imgFileSeq) => {
    const response = await api.get(`/api/image-file/download/${imgFileSeq}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 이미지 파일 미리보기
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @returns {Promise<Blob>} 이미지 데이터
   */
  previewImageFile: async (imgFileSeq) => {
    const response = await api.get(`/api/image-file/preview/${imgFileSeq}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 이미지 파일 수정
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정된 이미지 파일 정보
   */
  updateImageFile: async (imgFileSeq, data) => {
    const response = await api.put(`/api/image-file/${imgFileSeq}`, data);
    return response.data;
  },

  /**
   * 이미지 파일 삭제
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteImageFile: async (imgFileSeq) => {
    const response = await api.delete(`/api/image-file/${imgFileSeq}`);
    return response.data;
  },

  /**
   * 이미지 순서 업데이트
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @param {number} imgOrd - 이미지 순서
   * @returns {Promise<Object>} 업데이트 결과
   */
  updateImageOrder: async (imgFileSeq, imgOrd) => {
    const response = await api.put(`/api/image-file/${imgFileSeq}/order?imgOrd=${imgOrd}`);
    return response.data;
  },

  /**
   * 이미지 텍스트 업데이트
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @param {string} imgText - 이미지 텍스트
   * @returns {Promise<Object>} 업데이트 결과
   */
  updateImageText: async (imgFileSeq, imgText) => {
    const response = await api.put(`/api/image-file/${imgFileSeq}/text?imgText=${imgText}`);
    return response.data;
  },

  /**
   * 이미지 파일명 중복 확인
   * @param {string} imgFileNm - 이미지 파일명
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Object>} 중복 여부
   */
  checkImageFileName: async (imgFileNm, imgBrdSeq) => {
    const response = await api.get(`/api/image-file/check-filename?imgFileNm=${imgFileNm}&imgBrdSeq=${imgBrdSeq}`);
    return response.data;
  },

  // =====================================================
  // 이미지 선택 관련 API
  // =====================================================

  /**
   * 이미지 선택 목록 조회 (페이징/검색)
   * @param {Object} params - 조회 파라미터 (page, size, searchType, searchKeyword, imgBrdSeq, imgFileSeq, selEmpId, sortBy, sortDirection)
   * @returns {Promise<Object>} 이미지 선택 목록 (페이징 정보 포함)
   */
  getImageSelectionList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/image-selection/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 이미지 선택 상세 조회
   * @param {string|number} imgSelSeq - 이미지 선택 시퀀스
   * @returns {Promise<Object>} 이미지 선택 상세 정보
   */
  getImageSelectionDetail: async (imgSelSeq) => {
    const response = await api.get(`/api/image-selection/${imgSelSeq}`);
    return response.data;
  },

  /**
   * 이미지 게시판별 선택 목록 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Array>} 이미지 선택 목록
   */
  getImageSelectionByBrdSeq: async (imgBrdSeq) => {
    const response = await api.get(`/api/image-selection/board/${imgBrdSeq}`);
    return response.data;
  },

  /**
   * 직원별 선택 목록 조회
   * @param {string} selEmpId - 선택한 직원 ID
   * @returns {Promise<Array>} 이미지 선택 목록
   */
  getImageSelectionByEmpId: async (selEmpId) => {
    const response = await api.get(`/api/image-selection/employee/${selEmpId}`);
    return response.data;
  },

  /**
   * 이미지 파일별 선택 목록 조회
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @returns {Promise<Array>} 이미지 선택 목록
   */
  getImageSelectionByFileSeq: async (imgFileSeq) => {
    const response = await api.get(`/api/image-selection/file/${imgFileSeq}`);
    return response.data;
  },

  /**
   * 이미지 선택 등록
   * @param {Object} data - 이미지 선택 데이터
   * @returns {Promise<Object>} 등록된 이미지 선택 정보
   */
  createImageSelection: async (data) => {
    const response = await api.post('/api/image-selection', data);
    return response.data;
  },

  /**
   * 이미지 선택 삭제
   * @param {string|number} imgSelSeq - 이미지 선택 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteImageSelection: async (imgSelSeq) => {
    const response = await api.delete(`/api/image-selection/${imgSelSeq}`);
    return response.data;
  },

  /**
   * 직원별 이미지 선택 삭제
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @param {string} selEmpId - 선택한 직원 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteImageSelectionByEmpId: async (imgBrdSeq, selEmpId) => {
    const response = await api.delete(`/api/image-selection/board/${imgBrdSeq}/employee/${selEmpId}`);
    return response.data;
  },

  /**
   * 이미지 선택 여부 확인
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @param {string} selEmpId - 선택한 직원 ID
   * @returns {Promise<Object>} 선택 여부
   */
  checkImageSelection: async (imgBrdSeq, imgFileSeq, selEmpId) => {
    const response = await api.get(`/api/image-selection/check?imgBrdSeq=${imgBrdSeq}&imgFileSeq=${imgFileSeq}&selEmpId=${selEmpId}`);
    return response.data;
  },

  /**
   * 직원의 선택 개수 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @param {string} selEmpId - 선택한 직원 ID
   * @returns {Promise<Object>} 선택 개수
   */
  getImageSelectionCountByEmpId: async (imgBrdSeq, selEmpId) => {
    const response = await api.get(`/api/image-selection/count/employee?imgBrdSeq=${imgBrdSeq}&selEmpId=${selEmpId}`);
    return response.data;
  },

  /**
   * 이미지 파일의 선택 개수 조회
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @returns {Promise<Object>} 선택 개수
   */
  getImageSelectionCountByFileSeq: async (imgFileSeq) => {
    const response = await api.get(`/api/image-selection/count/file/${imgFileSeq}`);
    return response.data;
  },

  /**
   * 이미지 게시판의 전체 선택 개수 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Object>} 전체 선택 개수
   */
  getImageSelectionCountByBrdSeq: async (imgBrdSeq) => {
    const response = await api.get(`/api/image-selection/count/board/${imgBrdSeq}`);
    return response.data;
  },

  /**
   * 이미지 선택 토글 (선택/해제)
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @param {string|number} imgFileSeq - 이미지 파일 시퀀스
   * @param {string} selEmpId - 선택한 직원 ID
   * @returns {Promise<Object>} 토글 결과
   */
  toggleImageSelection: async (imgBrdSeq, imgFileSeq, selEmpId) => {
    const response = await api.post(`/api/image-selection/toggle?imgBrdSeq=${imgBrdSeq}&imgFileSeq=${imgFileSeq}&selEmpId=${selEmpId}`);
    return response.data;
  },

  /**
   * 이미지 선택 가능 여부 확인 (최대 선택 개수 체크)
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @param {string} selEmpId - 선택한 직원 ID
   * @param {number} maxSelCnt - 최대 선택 개수
   * @returns {Promise<Object>} 선택 가능 여부
   */
  canSelectImage: async (imgBrdSeq, selEmpId, maxSelCnt) => {
    const response = await api.get(`/api/image-selection/can-select?imgBrdSeq=${imgBrdSeq}&selEmpId=${selEmpId}&maxSelCnt=${maxSelCnt}`);
    return response.data;
  },

  /**
   * 이미지 선택 통계 조회
   * @param {string|number} imgBrdSeq - 이미지 게시판 시퀀스
   * @returns {Promise<Object>} 선택 통계 정보
   */
  getImageSelectionStatistics: async (imgBrdSeq) => {
    const response = await api.get(`/api/image-selection/statistics/${imgBrdSeq}`);
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
   * @param {FormData} formData - 신청 데이터 (파일 포함)
   * @returns {Promise<Object>} 등록 결과
   */
  createExpertConsultation: async (formData) => {
    const response = await api.post('/api/expert-consultation/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 전문가 상담 신청 수정
   * @param {string|number} appSeq - 신청 시퀀스
   * @param {FormData} formData - 수정할 데이터 (파일 포함)
   * @returns {Promise<Object>} 수정 결과
   */
  updateExpertConsultation: async (appSeq, formData) => {
    const response = await api.put(`/api/expert-consultation/${appSeq}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 전문가 상담 신청 삭제
   * @param {string|number} appSeq - 신청 시퀀스
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteExpertConsultation: async (appSeq) => {
    const response = await api.delete(`/api/expert-consultation/${appSeq}`);
    return response.data;
  },

  /**
   * 내 전문가 상담 신청 목록 조회
   * @param {Object} params - 조회 파라미터 (page, size)
   * @returns {Promise<Object>} 내 전문가 상담 신청 목록 (페이징 정보 포함)
   */
  getMyExpertConsultationList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/expert-consultation/my${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 전문가 상담 승인 상태 업데이트
   * @param {string|number} appSeq - 신청 시퀀스
   * @param {Object} data - 승인 데이터 (aprvStsCd, aprvEmpId, rejRsn)
   * @returns {Promise<Object>} 업데이트 결과
   */
  updateExpertConsultationApproval: async (appSeq, data) => {
    const response = await api.put(`/api/expert-consultation/${appSeq}/approval`, data);
    return response.data;
  },

  /**
   * 상담사 스케줄 조회
   * @param {Object} params - 조회 파라미터 (cnslrEmpId, schDt, schTyCd)
   * @returns {Promise<Array>} 상담사 스케줄 목록
   */
  getCounselorSchedule: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/counselor-schedule/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * 상담사 정보 조회
   * @param {string} cnslrEmpId - 상담사 직원 ID
   * @returns {Promise<Object>} 상담사 정보
   */
  getCounselorInfo: async (cnslrEmpId) => {
    const response = await api.get(`/api/counselor-info/${cnslrEmpId}`);
    return response.data;
  },

  /**
   * 상담 시간 제한 조회
   * @param {Object} params - 조회 파라미터 (cnslDt, cnslTm)
   * @returns {Promise<Object>} 상담 시간 제한 정보
   */
  getConsultationTimeLimit: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/consultation-time-limit/info${query ? `?${query}` : ''}`);
    return response.data;
  },
};
