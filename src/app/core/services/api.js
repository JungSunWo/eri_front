/**
 * @File Name      : api.js
 * @File path      : src/lib/api.js
 * @author         : 정선우
 * @Description    : 백엔드 API 통신을 위한 axios 인스턴스 및 API 함수들을 정의
 *                   - 각 도메인별 API 함수들을 통합하여 export
 *                   - 기존 코드와의 호환성을 위한 메인 진입점
 * @History        : 20250701  최초 신규, 20250115 API 분리 리팩토링
 **/

// 공통 API 클라이언트 및 유틸리티
export { api, apiCall, api as apiClient, serverApi } from './api/apiClient';

// 인증 관련 API
export { authAPI } from './api/authAPI';

// 메뉴 관련 API
export { menuAPI } from './api/menuAPI';

// 공통코드 관련 API
export { commonCodeAPI } from './api/commonCodeAPI';

// 공지사항 관련 API
export { noticeAPI } from './api/noticeAPI';

// 파일 관리 관련 API
export { fileAPI } from './api/fileAPI';

// 직원권익게시판 관련 API
export { boardAPI } from './api/boardAPI';

// 설문조사 관련 API
export { surveyAPI } from './api/surveyAPI';

// 상담 게시판 관련 API
export { consultationAPI } from './api/consultationAPI';

// 권한 관리 관련 API
export { authManagementAPI, permissionAPI } from './api/authManagementAPI';

// 관리자 관련 API
export {
    createAdmin, deleteAdmin, getAdminList, getEmployeeDetail, getEmployeeList, updateAdmin
} from './api/adminAPI';

// 시스템 로그 관련 API
export { systemLogAPI } from './api/systemLogAPI';

// 기본 export (기존 코드 호환성)
export { api as default } from './api/apiClient';
