/**
 * @File Name      : api.js
 * @File path      : src/lib/api.js
 * @author         : 정선우
 * @Description    : 백엔드 API 통신을 위한 axios 인스턴스 및 API 함수들을 정의
 *                   - 클라이언트/서버 사이드 API 클라이언트 설정
 *                   - 요청/응답 인터셉터를 통한 에러 처리
 *                   - 인증, 메뉴, 공통코드, 공지사항 등 각 도메인별 API 함수 제공
 *                   - 세션 관리 및 자동 로그인 리다이렉트 기능
 * @History        : 20250701  최초 신규
 **/

import { alert as uiAlert } from '@/common/ui_com';
import axios from 'axios';

/**
 * API 기본 URL 설정
 * 환경변수에서 URL을 가져오거나 기본값 사용
 * NEXT_PUBLIC_API_URL 환경변수가 설정되지 않은 경우 localhost:8080 사용
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 서버 사이드 전용 API 클라이언트
 * - 에러 알림 없이 서버 사이드에서만 사용
 * - SSR(Server Side Rendering) 시 사용
 * - withCredentials: true로 설정하여 쿠키 전송
 */
const serverApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * 서버 사이드 API 응답 인터셉터
 * - 에러 발생 시 console.error만 출력하고 에러 알림은 표시하지 않음
 * - 서버 사이드에서는 사용자에게 알림을 표시할 수 없으므로 로그만 출력
 */
serverApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // 서버 사이드에서는 console.error만 출력
    console.error('Server API Error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

/**
 * 클라이언트 사이드 API 클라이언트
 * - 브라우저에서 사용하는 메인 API 클라이언트
 * - 에러 알림 및 세션 관리 기능 포함
 * - withCredentials: true로 설정하여 세션 쿠키 전송
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키 전송을 위해 필요
});

/**
 * 요청 인터셉터
 * - 요청 전송 전 공통 처리 로직
 * - 현재는 기본 설정만 유지, 필요시 인증 토큰 추가 등 확장 가능
 */
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 (에러 처리)
 * - 401 에러 시 자동 로그인 페이지 리다이렉트
 * - 에러 메시지 추출 및 사용자 알림 표시
 * - 클라이언트/서버 사이드 구분하여 처리
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 세션 만료시 로그인 페이지로 리다이렉트 (로그인 페이지와 가이드 페이지가 아닌 경우에만)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    // 에러 메시지 추출
    const message =
      error.response?.data?.message ||
      error.message ||
      '알 수 없는 오류가 발생했습니다.';

    // 클라이언트 사이드에서만 ErrorAlert 호출 (서버 사이드에서는 console.error만)
    if (typeof window !== 'undefined') {
      // ErrorAlert로 에러 알림 (toast 대신)
      uiAlert.ErrorAlert('오류 발생', [{
        ERR_CTNT: message,
        INBN_ERR_DVCD: error.response?.status?.toString() || '',
        INBN_ERR_CD: error.response?.statusText || '',
        SRVC_ID: 'API'
      }]);
    } else {
      // 서버 사이드에서는 console.error만 출력
      console.error('API Error:', {
        message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
    }

    return Promise.reject(error);
  }
);

/**
 * 인증 관련 API 함수들
 * - 로그인, 로그아웃, 사용자 정보 조회, 세션 관리 등
 * - 직원 인증 및 세션 상태 관리 기능 제공
 */
export const authAPI = {

  /**
   * 직원 로그인 함수
   * 암호화된 직원번호로 직원 정보를 조회하여 로그인 처리
   * @param {string} empNo - 직원번호
   * @returns {Promise<Object>} 직원 정보
   */
  empLogin: async (empNo) => {
    const response = await api.post('/api/emp-encrypt/get-emp-info', {
      origEmpNo: empNo
    });
    return response.data;
  },

  /**
   * 로그아웃 함수
   * 현재 세션을 종료하고 로그아웃 처리
   * @returns {Promise<Object>} 로그아웃 결과
   */
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  /**
   * 현재 로그인한 사용자 정보 조회
   * 세션에서 현재 로그인한 사용자의 상세 정보를 조회
   * @returns {Promise<Object>} 사용자 정보
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/current-user');
    return response.data;
  },

  /**
   * 인증 상태 확인
   * 현재 사용자의 인증 상태를 확인
   * @returns {Promise<Object>} 인증 상태
   */
  checkAuth: async () => {
    const response = await api.get('/api/auth/check-auth');
    return response.data;
  },

  /**
   * 세션 상태 확인
   * 현재 세션의 유효성을 확인
   * @returns {Promise<Object>} 세션 상태
   */
  sessionStatus: async () => {
    const response = await api.get('/api/auth/session-status');
    return response.data;
  },

  /**
   * 직원 캐시 조회
   * 서버에 캐시된 직원 정보를 조회
   * @returns {Promise<Object>} 직원 캐시 정보
   */
  getEmployeeCache: async () => {
    const response = await api.get('/api/auth/employee-cache');
    return response.data;
  },
};

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
};

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
      searchKeyword: params.ttl || '',              // ttl → searchKeyword
      searchField: 'ttl',                           // 검색 필드 지정
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

  // 첨부파일 목록 조회 (참조 테이블 기준) - 백엔드 API 미구현으로 인해 임시 비활성화
  // getAttachments: async (refTblCd, refPkVal) => {
  //   const params = { refTblCd, refPkVal };
  //   const query = new URLSearchParams(params).toString();
  //   const response = await api.get(`/api/file/attachments${query ? `?${query}` : ''}`);
  //   return response.data;
  // },

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

// 권한 관리 API
export const authManagementAPI = {
  // 사용자 관리
  getUsers: async (params = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const mockUsers = [
        { id: 1, username: 'admin', name: '관리자', email: 'admin@company.com', role: '관리자', department: 'IT팀', status: '활성', lastLogin: '2025-01-15 10:30:00' },
        { id: 2, username: 'user1', name: '김철수', email: 'kim@company.com', role: '사용자', department: '인사팀', status: '활성', lastLogin: '2025-01-14 15:20:00' },
        { id: 3, username: 'user2', name: '이영희', email: 'lee@company.com', role: '사용자', department: '영업팀', status: '비활성', lastLogin: '2025-01-10 09:15:00' },
      ];

      // 필터링 로직
      let filteredUsers = mockUsers;
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }
      if (params.status) {
        filteredUsers = filteredUsers.filter(user => user.status === params.status);
      }
      if (params.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }

      return { data: filteredUsers };
    }

    // 프로덕션 환경에서는 실제 API 호출
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/users${query ? `?${query}` : ''}`);
    return response.data;
  },

  createUser: async (userData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '사용자가 생성되었습니다.' };
    }
    const response = await api.post('/api/auth/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '사용자 정보가 업데이트되었습니다.' };
    }
    const response = await api.put(`/api/auth/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '사용자가 삭제되었습니다.' };
    }
    const response = await api.delete(`/api/auth/users/${userId}`);
    return response.data;
  },

  // 역할 관리
  getRoles: async (params = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const mockRoles = [
        { id: 1, name: '관리자', description: '시스템 전체 관리 권한', permissions: ['user:read', 'user:write', 'role:read', 'role:write'], userCount: 2 },
        { id: 2, name: '사용자', description: '일반 사용자 권한', permissions: ['user:read'], userCount: 15 },
        { id: 3, name: '게스트', description: '제한된 읽기 권한', permissions: [], userCount: 5 },
      ];

      // 필터링 로직
      let filteredRoles = mockRoles;
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredRoles = filteredRoles.filter(role =>
          role.name.toLowerCase().includes(searchTerm) ||
          role.description.toLowerCase().includes(searchTerm)
        );
      }

      return { data: filteredRoles };
    }

    // 프로덕션 환경에서는 실제 API 호출
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/roles${query ? `?${query}` : ''}`);
    return response.data;
  },

  createRole: async (roleData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '역할이 생성되었습니다.' };
    }
    const response = await api.post('/api/auth/roles', roleData);
    return response.data;
  },

  updateRole: async (roleId, roleData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '역할 정보가 업데이트되었습니다.' };
    }
    const response = await api.put(`/api/auth/roles/${roleId}`, roleData);
    return response.data;
  },

  deleteRole: async (roleId) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '역할이 삭제되었습니다.' };
    }
    const response = await api.delete(`/api/auth/roles/${roleId}`);
    return response.data;
  },

  // 권한 관리
  getPermissions: async (params = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const mockPermissions = [
        { id: 1, name: '사용자 읽기', code: 'user:read', description: '사용자 정보 조회 권한', category: '사용자 관리' },
        { id: 2, name: '사용자 쓰기', code: 'user:write', description: '사용자 정보 수정 권한', category: '사용자 관리' },
        { id: 3, name: '역할 읽기', code: 'role:read', description: '역할 정보 조회 권한', category: '역할 관리' },
        { id: 4, name: '역할 쓰기', code: 'role:write', description: '역할 정보 수정 권한', category: '역할 관리' },
        { id: 5, name: '권한 읽기', code: 'permission:read', description: '권한 정보 조회 권한', category: '권한 관리' },
        { id: 6, name: '권한 쓰기', code: 'permission:write', description: '권한 정보 수정 권한', category: '권한 관리' },
      ];

      // 필터링 로직
      let filteredPermissions = mockPermissions;
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredPermissions = filteredPermissions.filter(permission =>
          permission.name.toLowerCase().includes(searchTerm) ||
          permission.code.toLowerCase().includes(searchTerm) ||
          permission.description.toLowerCase().includes(searchTerm)
        );
      }

      return { data: filteredPermissions };
    }

    // 프로덕션 환경에서는 실제 API 호출
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/permissions${query ? `?${query}` : ''}`);
    return response.data;
  },

  createPermission: async (permissionData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '권한이 생성되었습니다.' };
    }
    const response = await api.post('/api/auth/permissions', permissionData);
    return response.data;
  },

  updatePermission: async (permissionId, permissionData) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '권한 정보가 업데이트되었습니다.' };
    }
    const response = await api.put(`/api/auth/permissions/${permissionId}`, permissionData);
    return response.data;
  },

  deletePermission: async (permissionId) => {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: '권한이 삭제되었습니다.' };
    }
    const response = await api.delete(`/api/auth/permissions/${permissionId}`);
    return response.data;
  },
};

export const permissionAPI = {
  // 권한 목록 조회 (페이징/검색)
  getList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/api/auth/list?${query}`);
    return response.data;
  },
  // 권한 상세
  get: async (authCd) => {
    const response = await api.get(`/api/auth/${authCd}`);
    return response.data;
  },
  // 권한 등록
  create: async (data) => {
    const response = await api.post('/api/auth', data);
    return response.data;
  },
  // 권한 수정
  update: async (authCd, data) => {
    const response = await api.put(`/api/auth/${authCd}`, data);
    return response.data;
  },
  // 권한 삭제
  remove: async (authCd) => {
    const response = await api.delete(`/api/auth/${authCd}`);
    return response.data;
  }
};

export default api;
