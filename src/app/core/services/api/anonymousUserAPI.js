import { api } from '../apiClient';

/**
 * 익명 사용자 관련 API
 */

class AnonymousUserAPI {
    // 익명 사용자 목록 조회
    async getList(page = 1, size = 10, searchCondition = {}) {
        try {
            const params = {
                page,
                size,
                ...searchCondition
            };
            const response = await api.get('/api/anonymous-users', { params });
            return response.data;
        } catch (error) {
            console.error('익명 사용자 목록 조회 실패:', error);
            throw error;
        }
    }

    // 익명 사용자 상세 조회
    async getById(anonymousId) {
        try {
            const response = await api.get(`/api/anonymous-users/${anonymousId}`);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 상세 조회 실패:', error);
            throw error;
        }
    }

    // 닉네임으로 익명 사용자 조회
    async getByNickname(nickname) {
        try {
            const response = await api.get(`/api/anonymous-users/nickname/${encodeURIComponent(nickname)}`);
            return response.data;
        } catch (error) {
            console.error('닉네임으로 익명 사용자 조회 실패:', error);
            throw error;
        }
    }

    // 익명 사용자 등록
    async create(anonymousUser) {
        try {
            const response = await api.post('/api/anonymous-users', anonymousUser);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 등록 실패:', error);
            // 백엔드에서 반환한 오류 메시지를 그대로 반환
            if (error.response?.data) {
                return error.response.data;
            }
            throw error;
        }
    }

    // 익명 사용자 수정
    async update(anonymousId, anonymousUser) {
        try {
            const response = await api.put(`/api/anonymous-users/${anonymousId}`, anonymousUser);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 수정 실패:', error);
            // 백엔드에서 반환한 오류 메시지를 그대로 반환
            if (error.response?.data) {
                return error.response.data;
            }
            throw error;
        }
    }

    // 익명 사용자 삭제
    async delete(anonymousId, empId) {
        try {
            const response = await api.delete(`/api/anonymous-users/${anonymousId}?empId=${encodeURIComponent(empId)}`);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 삭제 실패:', error);
            // 백엔드에서 반환한 오류 메시지를 그대로 반환
            if (error.response?.data) {
                return error.response.data;
            }
            throw error;
        }
    }

    // 닉네임 중복 확인
    async checkNicknameExists(nickname) {
        try {
            const response = await api.get(`/api/anonymous-users/check-nickname/${encodeURIComponent(nickname)}`);
            return response.data;
        } catch (error) {
            console.error('닉네임 중복 확인 실패:', error);
            throw error;
        }
    }

    // 익명 사용자별 상담 건수 조회
    async getWithConsultationCount() {
        try {
            const response = await api.get('/api/anonymous-users/with-consultation-count');
            return response.data;
        } catch (error) {
            console.error('익명 사용자별 상담 건수 조회 실패:', error);
            throw error;
        }
    }
}

export default new AnonymousUserAPI();
