import { api } from '../apiClient';

/**
 * 익명 사용자 동일성 판단 API
 */
class AnonymousIdentityAPI {
    /**
     * 익명 사용자 동일성 그룹 목록 조회
     */
    async getGroupList(useYn = 'Y') {
        try {
            const response = await api.get('/api/anonymous-identity/groups', {
                params: { useYn }
            });
            return response.data;
        } catch (error) {
            console.error('익명 사용자 동일성 그룹 목록 조회 오류:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 동일성 그룹 상세 조회
     */
    async getGroupDetail(groupSeq) {
        try {
            const response = await api.get(`/api/anonymous-identity/groups/${groupSeq}`);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 동일성 그룹 상세 조회 오류:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 동일성 그룹 등록
     */
    async createGroup(groupData) {
        try {
            const response = await api.post('/api/anonymous-identity/groups', groupData);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 동일성 그룹 등록 오류:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 동일성 그룹 수정
     */
    async updateGroup(groupSeq, groupData) {
        try {
            const response = await api.put(`/api/anonymous-identity/groups/${groupSeq}`, groupData);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 동일성 그룹 수정 오류:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 동일성 그룹 삭제
     */
    async deleteGroup(groupSeq, delEmpId) {
        try {
            const response = await api.delete(`/api/anonymous-identity/groups/${groupSeq}`, {
                params: { delEmpId }
            });
            return response.data;
        } catch (error) {
            console.error('익명 사용자 동일성 그룹 삭제 오류:', error);
            throw error;
        }
    }

    /**
     * 그룹 멤버 목록 조회
     */
    async getMemberList(groupSeq, useYn = 'Y') {
        try {
            const response = await api.get(`/api/anonymous-identity/groups/${groupSeq}/members`, {
                params: { useYn }
            });
            return response.data;
        } catch (error) {
            console.error('그룹 멤버 목록 조회 오류:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자를 그룹에 추가
     */
    async addMemberToGroup(groupSeq, memberData) {
        try {
            const response = await api.post(`/api/anonymous-identity/groups/${groupSeq}/members`, memberData);
            return response.data;
        } catch (error) {
            console.error('그룹 멤버 추가 오류:', error);
            throw error;
        }
    }

    /**
     * 그룹에서 멤버 제거
     */
    async removeMemberFromGroup(groupSeq, anonymousId, delEmpId) {
        try {
            const response = await api.delete(`/api/anonymous-identity/groups/${groupSeq}/members/${anonymousId}`, {
                params: { delEmpId }
            });
            return response.data;
        } catch (error) {
            console.error('그룹 멤버 제거 오류:', error);
            throw error;
        }
    }

    /**
     * 익명 사용자 ID로 소속 그룹 조회
     */
    async getGroupsByAnonymousId(anonymousId) {
        try {
            const response = await api.get(`/api/anonymous-identity/anonymous/${anonymousId}/groups`);
            return response.data;
        } catch (error) {
            console.error('익명 사용자 소속 그룹 조회 오류:', error);
            throw error;
        }
    }
}

export const anonymousIdentityAPI = new AnonymousIdentityAPI();
