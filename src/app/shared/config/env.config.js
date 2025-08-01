/**
 * @File Name      : env.config.js
 * @File path      : src/common/env.config.js
 * @author         : 정선우
 * @Description    : 개발/운영 환경설정 파일
 *                   - NODE_ENV에 따른 환경별 설정 관리
 *                   - API 엔드포인트, 디버그 모드 등 환경별 변수 설정
 *                   - 개발/운영 환경의 설정 분리
 * @History        : 20250701  최초 신규
 **/

/**
 * 현재 실행 환경 확인
 * NODE_ENV 환경변수가 설정되지 않은 경우 'development'로 기본값 설정
 */
const ENV = process.env.NODE_ENV || 'development';

/**
 * 환경별 설정 객체
 * 각 환경(development, production)에 맞는 설정값들을 정의
 */
const config = {
    /**
     * 개발 환경 설정
     * 로컬 개발 시 사용되는 설정값들
     */
    development: {
        API_BASE_URL: 'http://localhost:3000/api',  // 개발 서버 API 엔드포인트
        DEBUG: true,                                 // 디버그 모드 활성화
        LOG_LEVEL: 'debug',                         // 로그 레벨 설정
        CACHE_DURATION: 5 * 60 * 1000,              // 캐시 유지 시간 (5분)
        // 기타 개발 환경 설정
    },

    /**
     * 운영 환경 설정
     * 실제 서비스 운영 시 사용되는 설정값들
     */
    production: {
        API_BASE_URL: 'https://your-production-domain.com/api',  // 운영 서버 API 엔드포인트
        DEBUG: false,                                // 디버그 모드 비활성화
        LOG_LEVEL: 'error',                         // 로그 레벨 설정 (에러만)
        CACHE_DURATION: 30 * 60 * 1000,             // 캐시 유지 시간 (30분)
        // 기타 운영 환경 설정
    }
};

/**
 * 현재 환경에 맞는 설정 반환
 * 설정되지 않은 환경의 경우 개발 환경 설정을 기본값으로 반환
 */
export default config[ENV] || config.development;
