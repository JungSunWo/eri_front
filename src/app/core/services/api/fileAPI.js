/**
 * @File Name      : fileAPI.js
 * @File path      : src/lib/api/fileAPI.js
 * @author         : 정선우
 * @Description    : 파일 관리 관련 API 함수들
 *                   - 파일 업로드, 다운로드, 목록 조회 등
 *                   - 파일 및 첨부파일 관리 기능
 * @History        : 20250701  최초 신규
 **/

import { api } from './apiClient';

/**
 * API 기본 URL 설정
 * 환경변수에서 URL을 가져오거나 기본값 사용
 * NEXT_PUBLIC_API_URL 환경변수가 설정되지 않은 경우 localhost:8080 사용
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 파일 관리 API
 * - 파일 업로드, 다운로드, 목록 조회 등
 * - 파일 및 첨부파일 관리 기능
 */
export const fileAPI = {
  /**
   * 파일 목록 조회
   * 특정 참조 테이블에 속한 파일 목록을 조회
   * @param {Object} params - 조회 파라미터 (refTblCd, refPkVal, 페이지네이션 등)
   * @returns {Promise<Object>} 파일 목록
   */
  getFileList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/file/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  // 파일 상세 조회
  getFileDetail: async (fileSeq) => {
    const response = await api.get(`/api/file/${fileSeq}`);
    return response.data;
  },

  // 파일 다운로드
  downloadFile: async (fileSeq) => {
    const response = await api.get(`/api/file/download/${fileSeq}`, {
      responseType: 'blob',
      withCredentials: true, // 세션 기반 인증 추가
    });
    return response.data;
  },

  // 파일 다운로드 (URL 반환)
  getDownloadUrl: (fileSeq) => {
    return `${API_BASE_URL}/api/file/download/${fileSeq}`;
  },

  // 파일 삭제
  deleteFile: async (fileSeq, empId) => {
    // 백엔드 API 변경사항 반영
    // 잘못된 URL: /api/file/delete/8
    // 올바른 URL: /api/file/8
    // HTTP 메서드: DELETE
    // 인증: 세션 기반 인증 필요 (credentials: 'include')
    try {
      const response = await api.delete(`/api/file/${fileSeq}`, {
        data: { empId }, // DELETE 요청의 body에 empId 포함
        withCredentials: true // 세션 기반 인증을 위한 credentials 포함
      });
      return response.data;
    } catch (error) {
      console.error('파일 삭제 API 호출 실패:', error);
      throw error;
    }
  },

  // 파일 업로드 (단일 파일)
  uploadFile: async (formData) => {
    const response = await api.post('/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // 세션 기반 인증 추가
    });
    return response.data;
  },

  // 파일 업로드 (다중 파일)
  uploadFiles: async (files, refTblCd, refPkVal, empId) => {
    const formData = new FormData();

    // 파일들 추가
    files.forEach(file => {
      formData.append('files', file);
    });

    // 메타데이터 추가
    formData.append('refTblCd', refTblCd);
    formData.append('refPkVal', refPkVal);
    formData.append('empId', empId);

    const response = await api.post('/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // 세션 기반 인증 추가
    });
    return response.data;
  },

  // 첨부파일 등록
  createAttachment: async (fileData) => {
    const response = await api.post('/api/file/attachment', fileData);
    return response.data;
  },

  // 첨부파일 수정
  updateAttachment: async (fileSeq, fileData) => {
    const response = await api.put(`/api/file/attachment/${fileSeq}`, fileData);
    return response.data;
  },

  // 첨부파일 삭제
  deleteAttachment: async (fileSeq, empId) => {
    const response = await api.delete(`/api/file/attachment/${fileSeq}?empId=${empId}`);
    return response.data;
  },

  // 파일 정보 수정 (파일명, 설명 등)
  updateFileInfo: async (fileSeq, fileInfo) => {
    const response = await api.put(`/api/file/${fileSeq}/info`, fileInfo);
    return response.data;
  },

  // 파일 검증 (바이러스 검사, 파일 타입 검증 등)
  validateFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/file/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // 세션 기반 인증 추가
    });
    return response.data;
  },

  // 파일 미리보기 URL 생성
  getPreviewUrl: (fileSeq) => {
    return `${API_BASE_URL}/api/file/preview/${fileSeq}`;
  },

  // 파일 미리보기 (이미지, PDF 등)
  previewFile: async (fileSeq) => {
    const response = await api.get(`/api/file/preview/${fileSeq}`, {
      responseType: 'blob',
      withCredentials: true, // 세션 기반 인증 추가
    });
    return response.data;
  },

  // 파일 압축 다운로드 (여러 파일을 ZIP으로)
  downloadFilesAsZip: async (fileSeqs) => {
    const response = await api.post('/api/file/download-zip', { fileSeqs }, {
      responseType: 'blob',
      withCredentials: true, // 세션 기반 인증 추가
    });
    return response.data;
  },

  // 파일 복사
  copyFile: async (sourceFileSeq, targetRefTblCd, targetRefPkVal, empId) => {
    const response = await api.post('/api/file/copy', {
      sourceFileSeq,
      targetRefTblCd,
      targetRefPkVal,
      empId
    });
    return response.data;
  },

  // 파일 이동
  moveFile: async (fileSeq, targetRefTblCd, targetRefPkVal, empId) => {
    const response = await api.put(`/api/file/${fileSeq}/move`, {
      targetRefTblCd,
      targetRefPkVal,
      empId
    });
    return response.data;
  },

  // 파일 권한 확인
  checkFilePermission: async (fileSeq, permission) => {
    const response = await api.get(`/api/file/${fileSeq}/permission?permission=${permission}`);
    return response.data;
  },

  // 파일 사용 통계
  getFileStats: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/file/stats${query ? `?${query}` : ''}`);
    return response.data;
  },

  // 파일 검색
  searchFiles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/file/search${query ? `?${query}` : ''}`);
    return response.data;
  },

  // 파일 태그 관리
  addFileTag: async (fileSeq, tag) => {
    const response = await api.post(`/api/file/${fileSeq}/tags`, { tag });
    return response.data;
  },

  removeFileTag: async (fileSeq, tag) => {
    const response = await api.delete(`/api/file/${fileSeq}/tags/${encodeURIComponent(tag)}`);
    return response.data;
  },

  getFileTags: async (fileSeq) => {
    const response = await api.get(`/api/file/${fileSeq}/tags`);
    return response.data;
  },

  // 파일 버전 관리
  getFileVersions: async (fileSeq) => {
    const response = await api.get(`/api/file/${fileSeq}/versions`);
    return response.data;
  },

  restoreFileVersion: async (fileSeq, versionId, empId) => {
    const response = await api.post(`/api/file/${fileSeq}/versions/${versionId}/restore`, { empId });
    return response.data;
  },

  // 파일 공유
  shareFile: async (fileSeq, shareData) => {
    const response = await api.post(`/api/file/${fileSeq}/share`, shareData);
    return response.data;
  },

  getSharedFiles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/file/shared${query ? `?${query}` : ''}`);
    return response.data;
  },

  // 파일 알림
  subscribeFileNotification: async (fileSeq, notificationType) => {
    const response = await api.post(`/api/file/${fileSeq}/notifications`, { notificationType });
    return response.data;
  },

  unsubscribeFileNotification: async (fileSeq, notificationType) => {
    const response = await api.delete(`/api/file/${fileSeq}/notifications/${notificationType}`);
    return response.data;
  },
};
