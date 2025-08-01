'use client';

import { CmpToastArea, CmpToastBtn, CmpToastCont } from '@/app/shared/components/toast/cmp_toast';
import { toast } from '@/app/shared/utils/ui_com';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const ToastContainer = ({
    id,
    message,
    type = 'info',
    onClose,
    showButton = false,
    buttonText = '확인'
}) => {
    const timerRef = useRef();

    const handleClose = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (onClose) {
            onClose();
        } else {
            toast.Closed(`#${id}`);
        }
    };

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            handleClose();
        }, 2500);
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <CmpToastArea id={id} className="on">
            <CmpToastCont type={type}>{message}</CmpToastCont>
            {showButton ? (
                <CmpToastBtn>
                    <button type="button" className="toastBtn btn01" onClick={handleClose}>
                        <span className="base">{buttonText}</span>
                    </button>
                </CmpToastBtn>
            ) : (
                <button
                    type="button"
                    className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                    onClick={handleClose}
                    aria-label="닫기"
                    style={{ background: 'transparent', border: 'none', padding: 0, marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                >
                    <X size={22} color="#fff" />
                </button>
            )}
        </CmpToastArea>
    );
};

export default ToastContainer;
