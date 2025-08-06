import { api } from '../apiClient';

/**
 * 이미지 파일 API
 */
export const imgBrdAPI = {

    /**
     * 이미지 파일 목록 조회
     */
    getImgFileList: async (imgBrdSeq, selEmpId = null) => {
        try {
            const params = selEmpId ? { selEmpId } : {};
            const response = await api.get(`/api/img-brd/${imgBrdSeq}/images`, { params });
            return response.data;
        } catch (error) {
            console.error('이미지 파일 목록 조회 오류:', error);
            throw error;
        }
    },

    /**
     * 이미지 파일 업로드 (텍스트 포함)
     */
    uploadImages: async (imgBrdSeq, files, texts = []) => {
        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append('files', file);
            });

            // 텍스트 데이터 추가
            texts.forEach((text, index) => {
                formData.append('texts', text || '');
            });

            const response = await api.post(`/api/img-brd/${imgBrdSeq}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('이미지 파일 업로드 오류:', error);
            throw error;
        }
    },

    /**
     * 이미지 선택/해제
     */
    toggleImageSelection: async (imgBrdSeq, imgFileSeq) => {
        try {
            const response = await api.post(`/api/img-brd/${imgBrdSeq}/toggle-selection`, null, {
                params: { imgFileSeq }
            });
            return response.data;
        } catch (error) {
            console.error('이미지 선택/해제 오류:', error);
            throw error;
        }
    },

    /**
     * 사용자가 선택한 이미지 목록 조회
     */
    getSelectedImages: async (imgBrdSeq) => {
        try {
            const response = await api.get(`/api/img-brd/${imgBrdSeq}/selected`);
            return response.data;
        } catch (error) {
            console.error('선택한 이미지 목록 조회 오류:', error);
            throw error;
        }
    },

    /**
     * 모든 선택 해제
     */
    clearAllSelections: async (imgBrdSeq) => {
        try {
            const response = await api.delete(`/api/img-brd/${imgBrdSeq}/clear-selections`);
            return response.data;
        } catch (error) {
            console.error('모든 선택 해제 오류:', error);
            throw error;
        }
    },

    /**
     * 이미지 선택 통계 조회
     */
    getImageSelectionStats: async (imgBrdSeq) => {
        try {
            const response = await api.get(`/api/img-brd/${imgBrdSeq}/stats`);
            return response.data;
        } catch (error) {
            console.error('이미지 선택 통계 조회 오류:', error);
            throw error;
        }
    },

    /**
     * 이미지 다운로드 URL 생성
     */
    getImageDownloadUrl: (imgFileSeq) => {
        return `/api/img-brd/files/${imgFileSeq}/download`;
    },

    /**
     * 이미지 파일 다운로드 (blob)
     */
    downloadImageFile: async (imgFileSeq) => {
        try {
            const response = await api.get(`/api/img-brd/files/${imgFileSeq}/download`, {
                responseType: 'blob',
            });
            return response;
        } catch (error) {
            console.error('이미지 파일 다운로드 오류:', error);
            throw error;
        }
    },

    /**
     * 이미지 설명 수정
     */
    updateImageText: async (imgFileSeq, imgText) => {
        try {
            const response = await api.put(`/api/img-brd/files/${imgFileSeq}/text`, {
                imgText: imgText
            });
            return response.data;
        } catch (error) {
            console.error('이미지 설명 수정 오류:', error);
            throw error;
        }
    },

    /**
     * 이미지 파일 삭제
     */
    deleteImageFile: async (imgFileSeq) => {
        try {
            const response = await api.delete(`/api/img-brd/files/${imgFileSeq}`);
            return response.data;
        } catch (error) {
            console.error('이미지 파일 삭제 오류:', error);
            throw error;
        }
    }
};
