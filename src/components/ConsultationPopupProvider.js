'use client';

import { useConsultationPopupStore } from '@/common/store/consultationPopupStore';
import ConsultationPopup from './ConsultationPopup';

const ConsultationPopupProvider = ({ children }) => {
    const { isOpen, closePopup, handleSuccess } = useConsultationPopupStore();

    return (
        <>
            {children}
            <ConsultationPopup
                isOpen={isOpen}
                onClose={closePopup}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default ConsultationPopupProvider;
