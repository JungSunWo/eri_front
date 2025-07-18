'use client'

import { util } from "@/common/com_util";
import { usePageMoveStore } from '@/common/store/pageMoveStore';
import { alert } from '@/common/ui_com';
import { CmpAlertBtn, CmpAlertCont, CmpAlertTitle } from '@/components/alert/cmp_alert';
import { CmpButton } from '@/components/button/cmp_button';
import { CmpAccordionCard, CmpAccordionCardBody, CmpAccordionCardItem, CmpAccordionCardTitle } from '@/components/contents/accordioncard/cmp_accordionCard';
import { CmpInfoBox, CmpInfoli } from '@/components/contents/infobox/cmp_infobox';
import { usePathname } from "next/navigation";
import { StyledAlert } from './cmp_alert_style';


const CmpWrapCommonAlertArea = (props) => {
    const { id, className, children, popTitle, popCont, showCancel } = props;

    const setCancelArea = () => {
        if (showCancel !== undefined) {
            return (<CmpButton label="취소" styleType="gray" />)
        } else {
            return null;
        }
    }

    return (
        <>
            <StyledAlert id={id} className={className}>
                <div className="alertPopupContArea">
                    <CmpAlertTitle popTitle={popTitle} id={id} />
                    <CmpAlertCont>{popCont}</CmpAlertCont>
                    <CmpAlertBtn>
                        {setCancelArea()}
                        <CmpButton label="확인" click={() => alert.Closed('#commonAlert')} />
                    </CmpAlertBtn>
                </div>
            </StyledAlert>
        </>
    )
};

const CmpWrapAlertArea = (props) => {
    const { id, className, children, popTitle, popCont, showCancel, cancelCallback, okCallback, okLabel, cancelLable } = props;

    const okName = okLabel ? okLabel : "확인";
    const calName = cancelLable ? cancelLable : "취소";

    const alertCancel = () => {
        alert.Closed("#" + id);
        if (cancelCallback !== undefined) {
            cancelCallback();
        }
    }

    const alertOk = () => {
        alert.Closed("#" + id);
        if (okCallback !== undefined) {
            okCallback();
        }
    }

    const setCancelArea = () => {
        if (showCancel !== undefined) {
            return (<CmpButton label={calName} styleType="gray" click={alertCancel} />)
        } else {
            return null;
        }
    }

    return (
        <>
            <StyledAlert id={id} className={`alertPopupArea ${className}`}>
                <div className="alertPopupContArea">
                    <CmpAlertTitle popTitle={popTitle} id={id} />
                    <CmpAlertCont>{popCont}</CmpAlertCont>
                    <CmpAlertBtn>
                        {setCancelArea()}
                        <CmpButton label={okName} click={alertOk} />
                    </CmpAlertBtn>
                </div>
            </StyledAlert>
        </>
    )
};

const CmpWrapErrorAlertArea = (props) => {

    const { id, className, children, popTitle, popCont, showCancel, cancelCallback, okCallback, img } = props;

    return (
        <>
            <StyledAlert id={id} className={className}>
                <div className="alertPopupContArea">
                    <CmpAlertTitle popTitle={popTitle} img={img} id={id} />
                    <CmpAlertCont>
                        <p>{popCont}</p>
                        <CmpAccordionCard type="info">
                            <CmpAccordionCardItem>
                                <CmpAccordionCardTitle panelStatus="none" type="info" title="오류 상세보기" />
                                <CmpAccordionCardBody panelStatus="none">
                                    <CmpInfoBox>
                                        <CmpInfoli>조치방법 출력됩니다. 조치방법 출력됩니다.</CmpInfoli>
                                        <CmpInfoli>조치방법 출력됩니다. 조치방법 출력됩니다.</CmpInfoli>
                                    </CmpInfoBox>
                                </CmpAccordionCardBody>
                            </CmpAccordionCardItem>
                        </CmpAccordionCard>
                    </CmpAlertCont>
                    <CmpAlertBtn>
                        <CmpButton
                          label="확인"
                          click={() => {
                            alert.Closed(`#${id}`);
                            if (okCallback) okCallback();
                          }}
                        />
                    </CmpAlertBtn>
                </div>
            </StyledAlert>
        </>
    )
};

const CmpWrapLogoutInfoAlertArea = (props) => {

    const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
    const pathName = usePathname();
    const { id, className, children } = props;

    const alertCancel = () => {
        alert.Closed("#" + id);
        logoutPopupShow = false;
        let isNextb = false;
        const cb = function (dat) {
            /*-----------------------------------------
            사용자 세션 데이터 클리어 및 invalidate 성공 이후 스크립트 전역 초기화 처리
            -----------------------------------------*/
            _ISLOGIN_ = false;

            util.initUser();

            /* 자동 로그아웃 세션 체크 중지 */
            var param = { "state": "N" };
            nc.nativeCall("", "JBNativeUIBR", "doNSessionTime", param);
            setMoveTo("/M_COM_LOGOUT");
        };

        if (pathName == "/") isNextb = true;

        // fnFetch("M_COM_LOGOUT_ACTION", cb
        //     ,{params:{}, header:{}, isNext : isNextb}
        // );

    }

    const alertOk = () => {
        //로그인연장처리
        if (typeof window != "undefined") {
            const params = { JSON_CTNT1: { SVCID: ["LOGOUT_EXTEND"] } };

            var url = "/JBN/getVariable.jct";

            if (location.href.indexOf("sm.jbbank.co.kr") > -1) {
                url = `https://sm.jbbank.co.kr:${location.port}/getVariable.jct`;
            } else if (location.href.indexOf("m.jbbank.co.kr") > -1) {
                url = `https://m.jbbank.co.kr:${location.port}/getVariable.jct`;
            }

            fetch(url, {
                cache: 'no-store'
                , method: "post"
                , credentials: "include"
                , headers: { "Content-Type": "application/json" }
                , body: JSON.stringify(params)
            })
                .then(res => {
                    localLogoutIntervalTime = sessionCounterLength;
                    /* 자동 로그아웃 세션 체크 */
                    var param = { "state": "Y" };
                    nc.nativeCall("", "JBNativeUIBR", "doNSessionTime", param);

                    clearInterval(logoutInterval);
                    logoutInterval = null;
                    alert.Closed("#" + id);
                    return res.json();
                })
                .then(res => { })
                .catch(error => { })
        }
    }

    const popupClose = () => {
        logoutPopupShow = false;
    }

    return (
        <>
            <StyledAlert id={id} >
                <div className="alertPopupContArea">
                    <CmpAlertTitle popTitle="자동 로그아웃 남은 시간" click={popupClose} id={id} />
                    <CmpAlertCont>
                        <div className='timeOutBoxArea'>
                            <p className='timeOutBox'>
                                <span className='count'>0</span>
                            </p>
                        </div>
                        <CmpInfoBox className="white" >
                            <CmpInfoli>고객님의 안전한 금융거래 보호를 위해 로그인 후 약 10분동안 이용이 없어 자동 로그아웃됩니다.</CmpInfoli>
                            <CmpInfoli>로그인 시간을 연장하시려면 로그인 연장 버튼을 터치하시기 바랍니다.</CmpInfoli>
                        </CmpInfoBox>
                    </CmpAlertCont>
                    <CmpAlertBtn>
                        <CmpButton label="로그아웃" styleType="gray" click={alertCancel} />
                        <CmpButton label="로그인연장" click={alertOk} />
                    </CmpAlertBtn>
                </div>
            </StyledAlert>
        </>
    )
};

export { CmpWrapAlertArea, CmpWrapCommonAlertArea, CmpWrapErrorAlertArea, CmpWrapLogoutInfoAlertArea };
