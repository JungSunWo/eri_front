/**
 * @File Name      : empNameCache.js
 * @File path      : src/common/empNameCache.js
 * @author         : 정선우
 * @Description    : 직원명 캐시 관리 유틸리티
 *                   - 직원ID와 직원명의 매핑 정보를 메모리에 캐시
 *                   - 빠른 직원명 조회 및 검색 기능 제공
 *                   - 싱글톤 패턴으로 전역 캐시 관리
 * @History        : 20250701  최초 신규
 **/

/**
 * 직원명 캐시 관리 클래스
 * 직원ID와 직원명의 매핑 정보를 메모리에 캐시하여 빠른 조회를 제공
 */
class EmpNameCache {
  /**
   * 캐시 클래스 생성자
   * Map을 사용하여 직원ID-직원명 매핑을 저장
   */
  constructor() {
    this.cache = new Map();        // 직원ID-직원명 매핑 저장소
    this.isInitialized = false;    // 캐시 초기화 여부
  }

  /**
   * 캐시 초기화
   * 서버에서 받은 직원 정보로 캐시를 초기화
   * @param {Object} employeeCache - 직원ID와 이름 매핑 객체
   */
  initialize(employeeCache) {
    if (!employeeCache || typeof employeeCache !== 'object') {
      console.warn('직원 캐시 초기화 실패: 유효하지 않은 데이터');
      return;
    }

    this.cache.clear();

    // 객체의 키-값 쌍을 Map에 저장
    Object.entries(employeeCache).forEach(([empId, empName]) => {
      if (empId && empName) {
        this.cache.set(empId, empName);
      }
    });

    this.isInitialized = true;
    console.log(`직원 캐시 초기화 완료: ${this.cache.size}명의 직원 정보`);
  }

  /**
   * 직원ID로 직원명 조회
   * 캐시에서 직원ID에 해당하는 직원명을 반환
   * @param {string} empId - 직원ID
   * @returns {string} 직원명 (없으면 직원ID 반환)
   */
  getEmpName(empId) {
    if (!empId) return '';

    const empName = this.cache.get(empId);
    return empName || empId; // 캐시에 없으면 직원ID 반환
  }

  /**
   * 직원명으로 직원ID 조회
   * 캐시에서 직원명에 해당하는 직원ID를 반환
   * @param {string} empName - 직원명
   * @returns {string} 직원ID (없으면 빈 문자열)
   */
  getEmpId(empName) {
    if (!empName) return '';

    for (const [empId, name] of this.cache.entries()) {
      if (name === empName) {
        return empId;
      }
    }
    return '';
  }

  /**
   * 캐시에 직원 정보 추가/업데이트
   * 새로운 직원 정보를 캐시에 추가하거나 기존 정보를 업데이트
   * @param {string} empId - 직원ID
   * @param {string} empName - 직원명
   */
  setEmpInfo(empId, empName) {
    if (empId && empName) {
      this.cache.set(empId, empName);
    }
  }

  /**
   * 캐시에서 직원 정보 삭제
   * 지정된 직원ID의 정보를 캐시에서 제거
   * @param {string} empId - 직원ID
   */
  removeEmpInfo(empId) {
    if (empId) {
      this.cache.delete(empId);
    }
  }

  /**
   * 전체 캐시 조회
   * 현재 캐시된 모든 직원 정보를 복사본으로 반환
   * @returns {Map} 전체 캐시 Map의 복사본
   */
  getAllCache() {
    return new Map(this.cache);
  }

  /**
   * 캐시 크기 조회
   * 현재 캐시된 직원 수를 반환
   * @returns {number} 캐시된 직원 수
   */
  getSize() {
    return this.cache.size;
  }

  /**
   * 캐시 초기화 여부 확인
   * 캐시가 초기화되었는지 여부를 반환
   * @returns {boolean} 초기화 여부
   */
  isCacheInitialized() {
    return this.isInitialized;
  }

  /**
   * 캐시 비우기
   * 모든 캐시 데이터를 삭제하고 초기화 상태로 리셋
   */
  clear() {
    this.cache.clear();
    this.isInitialized = false;
    console.log('직원 캐시가 비워졌습니다.');
  }

  /**
   * 검색 기능 (직원명에 특정 문자열이 포함된 직원들 조회)
   * 직원명에 검색어가 포함된 모든 직원을 찾아 반환
   * @param {string} searchTerm - 검색어
   * @returns {Array} 검색 결과 배열 [{empId, empName}]
   */
  searchByName(searchTerm) {
    if (!searchTerm) return [];

    const results = [];
    for (const [empId, empName] of this.cache.entries()) {
      if (empName.includes(searchTerm)) {
        results.push({ empId, empName });
      }
    }
    return results;
  }

  /**
   * 캐시 상태 정보 조회
   * 캐시의 현재 상태 정보를 객체로 반환
   * @returns {Object} 캐시 상태 정보
   * @returns {boolean} isInitialized - 초기화 여부
   * @returns {number} size - 캐시 크기
   * @returns {boolean} hasData - 데이터 존재 여부
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      size: this.cache.size,
      hasData: this.cache.size > 0
    };
  }
}

/**
 * 싱글톤 인스턴스 생성
 * 전역에서 하나의 캐시 인스턴스만 사용하도록 싱글톤 패턴 적용
 */
const empNameCache = new EmpNameCache();

export default empNameCache;
