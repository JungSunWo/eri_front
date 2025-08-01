'use client'
import { CmpWrapAlertArea, CmpWrapCommonAlertArea, CmpWrapErrorAlertArea } from '@/app/shared/components/alert/cmp_alert_wrapper';
import { CmpWrapCommonToastArea } from '@/app/shared/components/toast/cmp_toast_wrapper';

const GlobalPopups = () => {
    return (
        <>
            <CmpWrapCommonAlertArea id="commonAlert" />
            <CmpWrapAlertArea id="commonConfirm" showCancel />
            <CmpWrapErrorAlertArea id="commonErrorAlert" />
            <CmpWrapCommonToastArea id="commonToast" />
        </>
    )
}

export default GlobalPopups;
