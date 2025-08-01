/**
 * 익명 사용자 API 클라이언트
 */
class AnonymousUserAPI {
    constructor() {
        this.baseURL = '/api/anonymous-users';
    }

    /**
     * 익명 사용자 목록 조회
     */
    async getList(page = 1, size = 10, searchCondition = {}) {
        try {
            const params = new URLSearchParams({
                page: page,
                size: size,
                ...searchCondition
            });

            const response = await fetch(`${this.baseURL}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('익명 사용자 목록 조회 실패:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 상세 조회
     */
    async getById(anonymousId) {
        try {
            const response = await fetch(`${this.baseURL}/${anonymousId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('익명 사용자 상세 조회 실패:', error);
            throw error;
        }
    }

    /**
     * 닉네임으로 익명 사용자 조회
     */
    async getByNickname(nickname) {
        try {
            const response = await fetch(`${this.baseURL}/nickname/${encodeURIComponent(nickname)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // 사용자가 존재하지 않음
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('닉네임으로 익명 사용자 조회 실패:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 등록
     */
    async create(anonymousUser) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(anonymousUser),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('익명 사용자 등록 실패:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 수정
     */
    async update(anonymousId, anonymousUser) {
        try {
            const response = await fetch(`${this.baseURL}/${anonymousId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(anonymousUser),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('익명 사용자 수정 실패:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 삭제
     */
    async delete(anonymousId, empId) {
        try {
            const response = await fetch(`${this.baseURL}/${anonymousId}?empId=${encodeURIComponent(empId)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('익명 사용자 삭제 실패:', error);
            throw error;
        }
    }

    /**
     * 닉네임 중복 확인
     */
    async checkNicknameExists(nickname) {
        try {
            const response = await fetch(`${this.baseURL}/check-nickname/${encodeURIComponent(nickname)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('닉네임 중복 확인 실패:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자별 상담 건수 조회
     */
    async getWithConsultationCount() {
        try {
            const response = await fetch(`${this.baseURL}/with-consultation-count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('익명 사용자별 상담 건수 조회 실패:', error);
            throw error;
        }
    }
}

// 싱글톤 인스턴스 생성
const anonymousUserAPI = new AnonymousUserAPI();

export default anonymousUserAPI;
