/**
 * @File Name      : storage.js
 * @File path      : src/common/storage.js
 * @author         : 정선우
 * @Description    : 브라우저 스토리지 관리 유틸리티
 *                   - localStorage, sessionStorage 통합 관리
 *                   - 만료일이 있는 스토리지 아이템 관리
 *                   - 라우터 파라미터 저장/조회 기능
 *                   - JSON 데이터 자동 파싱/직렬화
 *                   - 브라우저 환경 안전성 검증
 * @History        : 20250701  최초 신규
 **/

import { util } from "@/app/shared/utils/com_util";

/**
 * 스토리지 관리 객체
 * - 브라우저의 localStorage와 sessionStorage를 통합 관리하는 유틸리티
 * - JSON 데이터의 자동 파싱/직렬화 처리
 * - 만료일 기반 데이터 자동 삭제 기능
 * - SSR(Server-Side Rendering) 환경에서의 안전성 보장
 *
 * @returns {Object} 스토리지 관리 함수들을 포함한 객체
 * @example
 * const storage = storage();
 * storage.setItem('user', {name: 'John'}, 'local');
 * const user = storage.getItem('user', 'local');
 */
const storage = () => {
    // 브라우저 환경 여부 확인 (SSR 안전성)
    const isBrowser = (() => typeof window !== 'undefined')();

    /**
     * 스토리지 타입 결정
     * - 'local' 또는 'session' 문자열을 실제 스토리지 객체명으로 변환
     * - 기본값은 sessionStorage로 설정
     *
     * @param {string} type - 스토리지 타입 ('local' 또는 'session')
     * @returns {string} 스토리지 타입 문자열 ('localStorage' 또는 'sessionStorage')
     * @example storageType('local') // 'localStorage'
     * @example storageType('session') // 'sessionStorage'
     * @example storageType() // 'sessionStorage' (기본값)
     */
    const storageType = (type) => `${type ?? 'session'}Storage`;

    /**
     * 스토리지에서 아이템 조회
     * - 저장된 데이터를 안전하게 조회하고 JSON 파싱 처리
     * - 브라우저 환경이 아닌 경우 undefined 반환
     *
     * @param {string} key - 조회할 키
     * @param {string} type - 스토리지 타입 ('local' 또는 'session')
     * @returns {*} 저장된 값 (JSON 파싱된 객체 또는 문자열), 브라우저가 아닌 경우 undefined
     * @example
     * const user = getItem('user', 'local'); // localStorage에서 'user' 키 조회
     * const session = getItem('temp', 'session'); // sessionStorage에서 'temp' 키 조회
     */
    const getItem = (key, type) => {
        if (isBrowser) {
            var result = window[storageType(type)][key];

            if (result != null) {
                result = decodeURIComponent(result);
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    // JSON 파싱 실패 시 원본 문자열 반환
                    // 숫자, 문자열 등 JSON이 아닌 데이터 처리
                }
            }

            return result;
        }
    };

    /**
     * 스토리지에 아이템 저장
     * - 객체는 JSON으로 직렬화하여 저장
     * - 모든 데이터는 URL 인코딩하여 안전하게 저장
     * - 브라우저 환경이 아닌 경우 false 반환
     *
     * @param {string} key - 저장할 키
     * @param {*} value - 저장할 값 (객체, 문자열, 숫자 등)
     * @param {string} type - 스토리지 타입 ('local' 또는 'session')
     * @returns {boolean} 저장 성공 여부
     * @example
     * setItem('user', {name: 'John', age: 30}, 'local'); // 객체 저장
     * setItem('token', 'abc123', 'session'); // 문자열 저장
     * setItem('count', 42, 'local'); // 숫자 저장
     */
    const setItem = (key, value, type) => {
        if (isBrowser) {
            if (value != null) {
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                value = encodeURIComponent(value);
            }

            window[storageType(type)].setItem(key, value);
            return true;
        }
        return false;
    };

    /**
     * 만료일이 있는 스토리지 아이템 조회
     * - 만료일이 지난 경우 자동으로 삭제하고 null 반환
     * - sessionStorage에만 저장되며, 만료일 기반 자동 정리
     * - 보안이 중요한 임시 데이터 저장에 활용
     *
     * @param {string} key - 조회할 키
     * @returns {*} 저장된 값 또는 null (만료된 경우)
     * @example
     * const tempData = getEItem('tempToken'); // 만료일 체크 후 값 반환
     * // 만료된 경우 자동 삭제되고 null 반환
     */
    const getEItem = (key) => {
        if (isBrowser) {
            var result = window.sessionStorage[key];

            if (result != null) {
                result = decodeURIComponent(result);
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    // JSON 파싱 실패 시 처리
                }

                // 현재 날짜와 만료일 비교
                let toDay = new Date(util.getDateTime("yyyy-mm-dd", util.getBoundDate(0, 0, 0, util.getToday())));
                let expiryDay = new Date(result.expiryDay);

                toDay = util.Dateformat(toDay, "yyyyMMdd");
                expiryDay = util.Dateformat(expiryDay, "yyyyMMdd");

                // 만료일이 지난 경우 삭제하고 null 반환
                if (Number(toDay) > Number(expiryDay)) {
                    window.sessionStorage[key] = null;
                    window.sessionStorage.removeItem(key);
                    return null;
                }
                return result.value;
            }
        }

        return null;
    };

    /**
     * 만료일이 있는 스토리지 아이템 저장
     * - 지정된 일수 후 자동으로 만료되는 데이터 저장
     * - sessionStorage에만 저장되며, 만료일 정보와 함께 저장
     * - 임시 토큰, 캐시 데이터 등에 활용
     *
     * @param {string} key - 저장할 키
     * @param {*} value - 저장할 값
     * @param {number} day - 만료일까지의 일수
     * @returns {boolean} 저장 성공 여부
     * @example
     * setEItem('tempToken', 'abc123', 1); // 1일 후 만료
     * setEItem('cacheData', {data: 'value'}, 7); // 7일 후 만료
     */
    const setEItem = (key, value, day) => {
        if (isBrowser) {
            // 만료일 계산 (현재 날짜 + 지정된 일수)
            var expiryDay = new Date(util.getDateTime("yyyy-mm-dd", util.getBoundDate(0, 0, Number(day), util.getToday())));

            const param = {
                value: value,
                expiryDay: expiryDay,
            }

            let cValue = JSON.stringify(param);
            cValue = encodeURIComponent(cValue);
            window.sessionStorage[key] = cValue;
            return true;
        }

        return false;
    };

    /**
     * 라우터 파라미터 조회
     * - 페이지 간 이동 시 파라미터를 저장/조회하는 기능
     * - Next.js 라우터와 연동하여 페이지 상태 유지
     *
     * @param {string} type - 스토리지 타입 ('local' 또는 'session')
     * @returns {Object} 라우터 파라미터 객체
     * @example
     * const params = getParam('session'); // sessionStorage에서 라우터 파라미터 조회
     * // {page: 1, filter: 'active', ...}
     */
    const getParam = (type) => {
        if (isBrowser) {
            var result = typeof window[storageType(type)]["RouterParam"] != "undefined" ? window[storageType(type)]["RouterParam"] : "{}";

            if (result != null) {
                result = decodeURIComponent(result);
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = {};
                }
            }

            return result;
        }
    };

    /**
     * 라우터 파라미터 저장
     * - 현재 페이지의 상태를 스토리지에 저장
     * - 페이지 새로고침 시에도 상태 유지 가능
     *
     * @param {Object} value - 저장할 파라미터 객체
     * @param {string} type - 스토리지 타입 ('local' 또는 'session')
     * @returns {boolean} 저장 성공 여부
     * @example
     * setParam({page: 1, filter: 'active'}, 'session'); // 현재 페이지 상태 저장
     */
    const setParam = (value, type) => {
        if (isBrowser) {
            if (value != null) {
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                value = encodeURIComponent(value);
            }

            window[storageType(type)].setItem("RouterParam", value);
            return true;
        }
        return false;
    }

    /**
     * 스토리지 아이템 삭제
     * - 지정된 키의 데이터를 완전히 삭제
     * - null 설정 후 removeItem으로 완전 제거
     *
     * @param {string} key - 삭제할 키
     * @param {string} type - 스토리지 타입 ('local' 또는 'session')
     * @example
     * removeItem('user', 'local'); // localStorage에서 'user' 키 삭제
     * removeItem('temp', 'session'); // sessionStorage에서 'temp' 키 삭제
     */
    const removeItem = (key, type) => {
        window[storageType(type)][key] = null;
        window[storageType(type)].removeItem(key);
    };

    /**
     * 스토리지 관리 함수들을 외부로 내보내기
     * - getItem: 일반 아이템 조회
     * - setItem: 일반 아이템 저장
     * - getEItem: 만료일 있는 아이템 조회
     * - setEItem: 만료일 있는 아이템 저장
     * - removeItem: 아이템 삭제
     * - setParam: 라우터 파라미터 저장
     * - getParam: 라우터 파라미터 조회
     */
    return {
        getItem,      // 일반 아이템 조회
        setItem,      // 일반 아이템 저장
        getEItem,     // 만료일 있는 아이템 조회
        setEItem,     // 만료일 있는 아이템 저장
        removeItem,   // 아이템 삭제
        setParam,     // 라우터 파라미터 저장
        getParam,     // 라우터 파라미터 조회
    };
};

export default storage;
