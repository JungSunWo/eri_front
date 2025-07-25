import { create } from 'zustand';

/**
 * 상담신청 팝업 전역 상태 관리
 * - 팝업 열기/닫기 상태
 * - 성공 콜백 함수 관리
 */
export const useConsultationPopupStore = create((set, get) => ({
    // 팝업 열림 상태
    isOpen: false,

    // 성공 시 호출할 콜백 함수
    onSuccess: null,

    // 팝업 열기
    openPopup: (onSuccess = null) => {
        set({ isOpen: true, onSuccess });
    },

    // 팝업 닫기
    closePopup: () => {
        set({ isOpen: false, onSuccess: null });
    },

    // 성공 콜백 실행 후 팝업 닫기
    handleSuccess: () => {
        const { onSuccess } = get();
        if (onSuccess && typeof onSuccess === 'function') {
            onSuccess();
        }
        get().closePopup();
    }
}));
