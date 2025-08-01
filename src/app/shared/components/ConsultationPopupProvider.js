'use client';

import { useConsultationPopupStore } from '@/app/core/slices/consultationPopupStore';
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
