'use client'

import { CmpToastBtn, CmpToastCont } from '@/app/shared/components/toast/cmp_toast';
import { toast } from '@/app/shared/utils/ui_com';
import { useEffect } from 'react';
import { StyledToast } from './cmp_toast_style';

//toast 버튼영역
const CmpWrapToastArea = (props) => {
    const { id, className, children, toastCont, showCancel, cancelCallback, showOk, okCallback } = props;

    useEffect(() => {

    }, [])


    const toastCancel = () => {
        toast.Closed("#" + id);
        if (cancelCallback !== undefined) {
            cancelCallback();
        }
    }

    const toastOk = () => {
        toast.Closed("#" + id);
        if (okCallback !== undefined) {
            okCallback();
        }
    }
    const setButtonArea = () => {

        if (showCancel !== undefined && showOk !== undefined) {
            console.log("showCancel showOk");
            return (
                <CmpToastBtn>
                    <button type="button" className="toastBtn btn01" onClick={toastCancel}><span className="base">취소</span></button>
                    <button type="button" className="toastBtn btn02" onClick={toastOk}><span className="base">확인</span></button>
                </CmpToastBtn>
            )

        } else if (showCancel !== undefined) {
            console.log("showCancel");
            return (
                <CmpToastBtn>
                    <button type="button" className="toastBtn btn01" onClick={toastCancel}><span className="base">취소</span></button>
                </CmpToastBtn>
            )
        } else if (showOk !== undefined) {
            console.log("showOk");
            return (
                <CmpToastBtn>
                    <button type="button" className="toastBtn btn02" onClick={toastOk}><span className="base">확인</span></button>
                </CmpToastBtn>
            )
        } else {
            return null;
        }

    }

    return (
        <>
            <StyledToast id={id} className={className}>
                <div className="toastPopupContArea">
                    <CmpToastCont>
                        {toastCont}
                    </CmpToastCont>
                    {setButtonArea()}
                </div>
            </StyledToast>
        </>
    );
};

const CmpWrapCommonToastArea = (props) => {
    const { id, className, children, toastCont, showCancel, cancelCallback, showOk, okCallback } = props;

    return (
        <>
            <StyledToast id={id} className={className}>
                <div className="toastPopupContArea">
                    <CmpToastCont />
                    <CmpToastBtn>
                        <button type="button" className="toastBtn btn01"><span className="base">취소</span></button>
                        <button type="button" className="toastBtn btn02"><span className="base">확인</span></button>
                    </CmpToastBtn>
                </div>
            </StyledToast>
        </>
    );
};
export { CmpWrapCommonToastArea, CmpWrapToastArea };
