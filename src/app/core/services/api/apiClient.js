/**
 * @File Name      : apiClient.js
 * @File path      : src/lib/api/apiClient.js
 * @author         : 정선우
 * @Description    : 공통 API 클라이언트 설정
 *                   - 클라이언트/서버 사이드 API 클라이언트 설정
 *                   - 요청/응답 인터셉터를 통한 에러 처리
 *                   - 세션 관리 및 자동 로그인 리다이렉트 기능
 * @History        : 20250701  최초 신규
 **/

import { toast } from '@/app/shared/utils/ui_com';
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
export const serverApi = axios.create({
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
export const api = axios.create({
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
 * - 400 에러는 비즈니스 로직 오류이므로 자동 알림 표시하지 않음
 * - 500 에러 등 서버 오류에 대해서만 자동 알림 표시
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

    // 400 에러는 비즈니스 로직 오류이므로 자동 알림 표시하지 않음
    // 각 API 함수에서 직접 처리하도록 함
    if (error.response?.status === 400) {
      return Promise.reject(error);
    }

    // 에러 메시지 추출
    const message =
      error.response?.data?.message ||
      error.message ||
      '알 수 없는 오류가 발생했습니다.';

    // 클라이언트 사이드에서만 ErrorAlert 호출 (서버 사이드에서는 console.error만)
    if (typeof window !== 'undefined') {
      // 토스트로 에러 알림
      toast.callCommonToastOpen(message);
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
 * 범용 API 호출 함수
 * - HTTP 메서드, URL, 데이터, 헤더를 받아서 API 호출
 * - 에러 처리 및 응답 데이터 정규화
 * @param {string} method - HTTP 메서드 (GET, POST, PUT, DELETE)
 * @param {string} url - API 엔드포인트 URL
 * @param {Object} data - 요청 데이터 (선택사항)
 * @param {Object} config - axios 설정 (선택사항)
 * @returns {Promise<Object>} API 응답 데이터
 */
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method: method.toLowerCase(),
      url,
      data,
      ...config
    });

    return {
      success: true,
      data: response.data,
      message: response.data?.message || '요청이 성공적으로 처리되었습니다.'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '요청 처리 중 오류가 발생했습니다.',
      error: error
    };
  }
};
