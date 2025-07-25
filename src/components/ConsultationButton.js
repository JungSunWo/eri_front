'use client';

import { useConsultationPopupStore } from '@/common/store/consultationPopupStore';
import { CmpButton } from '@/components/ui';

const ConsultationButton = ({
    children = "상담 신청",
    variant = "primary",
    size = "md",
    className = "",
    onSuccess = null,
    ...props
}) => {
    const { openPopup } = useConsultationPopupStore();

    const handleClick = () => {
        openPopup(onSuccess);
    };

    return (
        <CmpButton
            variant={variant}
            size={size}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </CmpButton>
    );
};

export default ConsultationButton;
