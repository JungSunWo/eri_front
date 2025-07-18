'use client'
import { CmpWrapAlertArea, CmpWrapCommonAlertArea, CmpWrapErrorAlertArea } from '@/components/alert/cmp_alert_wrapper';




const GlobalPopups = () => {
    return (
        <>
            <CmpWrapCommonAlertArea id="commonAlert" />
            <CmpWrapAlertArea id="commonConfirm" showCancel />
            <CmpWrapErrorAlertArea id="commonErrorAlert" />
        </>
    )
}

export default GlobalPopups;
