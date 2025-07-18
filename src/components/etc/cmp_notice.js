"use client";
import { util } from "@/common/com_util";
import storage from "@/common/storage";
import CommonModal from '@/components/ui/CommonModal';
import useNotice from "@/store/useNotice";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";


const customStyles = {
    overlay: {
        position: "fixed",
        width: "100%",
        height: "100%",
        left: "0",
        top: "0",
        backgroundColor: "rgba(33, 37, 41, 0.70)",
        zIndex: "3000"
    },
    content: {
        position: "relative",
        width: "calc(100% - 4rem)",
        left: "2rem",
        top: "50%",
        transform: "translate(0,-50%)",
        borderRadius: "1.6rem",
        overflow: "hidden",
        backgroundColor: "#fff",
        WebkitOverflowScrolling: 'touch',
        padding: '0px',
        border: "none",
        height: "auto",
    }
};

const CmpModalPopupCont = styled.div`
    .modalTitleArea{padding:5.6rem 2rem 1.1rem 2rem;background-color:var(--white);position:relative;z-index:1;}
    .modalTitleArea>p{font-size:1.8rem;line-height:2.6rem;letter-spacing:-0.2px;color:var(--gray10);text-align:center;font-weight:700;}
    .modalContArea{padding:0 2rem 3.2rem 2rem;text-align:center;font-size:1.4rem;font-weight:500;line-height:-0.1px;color:var(--gray8);word-break:keep-all;background-color:var(--white);margin-top:-0.2rem;position:relative;z-index:1;}

    .modalCk{margin-top:2rem;display:block}
    .modalCk input[type=checkbox]{position:relative;width:2rem;height:2rem;display:inline-block;background-color:var(--white);border-radius:50%;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_checkbox.svg);background-repeat:no-repeat;background-position:cetner center;background-size:100% auto;}
    .modalCk input[type=checkbox]:checked{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_checkbox_checked.svg);}
    .modalCk input[type=checkbox]:disabled{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_checkbox_dis.svg);}
    .modalCk input[type=checkbox]:disabled:checked{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_checkbox_checked_dis.svg);}
    .modalCk .base{display:inline-block;vertical-align:middle;font-size:1.4rem;line-height:2.2rem;font-weight:500;margin-left:0.4rem;color:var(--gray10)}

    .modalBtnArea{border-radius:0 0 1.6rem 1.6rem;overflow:hidden;display:flex;margin-top:-0.1rem;position:relative;z-index:1;}
    .modalBtn{display:block;width:100%;min-height:5.2rem;background-color:var(--jb-blue);padding:0.3rem 1.2rem 0 1.2rem;text-align:center;justify-content:unset;flex-direction:unset;align-items:unset;transition:background-color 0.3s;font-size:0;vertical-align:middle;}
    .modalBtn .base{display:inline-block;width:100%;font-size:1.6rem;line-height:2.4rem;font-weight:700;color:var(--white);letter-spacing:-0.1px;}

    .modalPopupClosed{position:absolute;left:0.8rem;top:0.8rem;width:4rem;height:4rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_20_close.svg);background-repeat:no-repeat;background-size:2rem auto;text-indent:-9999px;background-position:center center;z-index:3;}
`;

const CmpNotice = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [noticeData, setNoticeData] = useState(null);
    // const { ntcSvcFlag, ntcMenuFlag, setNtcMenuFlag, setNtcSvcFlag, serviceNotice, menuNotice } = useNotice();
    const { serviceNotice, menuNotice } = useNotice();
    const pathName = usePathname();
    const vPathName = util.strReplaceAll(pathName, "/", "");//.replaceAll("/", "");
    const storageName = "SVCNTC_";// vPathName + "_NOTICE_";
    const { getItem, setItem, removeItem } = storage();


    useEffect(() => {
        if (isGetVar) {
            if (typeof tglNtcModal.rmItem !== "undefined") {
                tglNtcModal.rmItem();
            }

            if (serviceNotice.length > 0) {
                serviceNotice.map((item, idx) => {
                    if (vPathName === item["WEB_SRVC_ID"]) {
                        if (!tglNtcModal.getItem(storageName + item["NOTN_KEY"])) {
                            setNoticeData(item);
                            openModal();
                        }
                    }
                });
            }
        }
    }, [isGetVar]);

    // 메뉴별 공지사항
    /*
    useEffect(() => {
        if (ntcMenuFlag) {
            if (noticeData != null) {
                setNoticeData(null);
            }

             if (menuNotice.length > 0) {
                 menuNotice.map((item, idx) => {
                     if (vPathName === item["WEB_SRVC_ID"]) {
                         // setNoticeData(item);
                     }
                 });
             }
            setNtcMenuFlag(false);
        }
    }, [ntcMenuFlag]);
    */

    /* 추후 사용 시 변경 예정
    const ebcibSrvcmMR002 = () => {
        fnFetch(
            "EBCIB_SRVCM_M_R002",
            (res) => {
                wsvcNoticeData = res;
                console.log(`EBCIB_SRVCM_M_R002 =>`, wsvcNoticeData);
                setNoticeData(res);


            },
            {
                params: {
                    OS_INFO_CTNT: _APPTYPE_ === "A" ? "Android" : "IOS",
                    MEL_NM: _APPMODEL_,
                    WEB_SRVC_DVCD: SVCDVCD === "SMB" ? "1" : "2",
                    WEB_SRVC_ID: vPathName
                },
                header: {},
            },
            (err) => {}    // 오류처리 하지 않음
        );
    }
    */

    /* 추후 사용 시 변경 예정
    const drawNoticeModal = () => {
        console.log(`drawNoticeModal Paint`);
        fnFetch(
            "EBCIB_SRVCM_M_R002",
            (res) => {
                wsvcNoticeData = res;
                console.log(`EBCIB_SRVCM_M_R002 =>`, wsvcNoticeData);
                setNoticeData(res);


            },
            {
                params: {
                    OS_INFO_CTNT: _APPTYPE_ === "A" ? "Android" : "IOS",
                    MEL_NM: _APPMODEL_,
                    WEB_SRVC_DVCD: SVCDVCD === "SMB" ? "1" : "2",
                    WEB_SRVC_ID: vPathName
                },
                header: {},
            },
            (err) => {
                closeModal();
                return (
                    <></>
                )
            }    // 오류처리 하지 않음
        );
    }
    */

    const tglNtcModal = {
        setItem: function (name, exp, isChecked) {
            let date = new Date();
            date = date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

            /*
                local: 등록된 item key 설정한 일수 만큼 다시보지않기 공지사항 비활성화
                session: 등록된 item key 브라우저세션 유지 시간동안에만 공지사항 비황성화
             */
            setItem(name, date, isChecked ? "local" : "session");
        },
        getItem: function (name) {    // 다시보지 않기 localStorage Data Check
            let date = new Date();
            date = date.setTime(date.getTime());

            let item = getItem(name, "local");

            if (item == null) {
                item = getItem(name, "session");
            }

            return parseInt(util.null2void(item, "0")) > date;
        },
        rmItem: function () {
            // - 불필요한 공지사항 storage 삭제
            if (typeof window !== 'undefined') {
                for (let [key, value] of Object.entries(window["localStorage"])) {
                    if (key.indexOf(storageName) > -1) {
                        if (!this.getItem(key)) {
                            removeItem(key);
                        }
                    }
                }
            }
        }
    }


    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const fnBtnConfirm = (e) => {
        e.preventDefault();

        let checkBox = window.document.getElementsByName("noticeChk")[0];

        if (typeof checkBox !== "undefined") {
            tglNtcModal.setItem(
                storageName + checkBox.getAttribute("data-key"),
                checkBox.getAttribute("data-value"),
                checkBox.checked
            );
        }
        closeModal();
    }

    const ModalTit = () => {
        if (util.null2void(noticeData) !== "") {
            return (
                <div className="modalTitleArea">
                    <p>{noticeData.CMKN_TITL}</p>
                </div>
            );
        } else {
            return (
                <></>
            );
        }
    }

    const ContentHtml = () => {
        if (noticeData !== null && typeof noticeData.CMKN_CTNT !== "undefined") {
            let htmlStr = (util.null2void(noticeData.CMKN_CTNT) !== "") ? util.unescapeHtml(noticeData.CMKN_CTNT) : "";
            return (
                <>
                    <div dangerouslySetInnerHTML={{
                        __html: `${htmlStr}`
                    }}></div>
                </>
            )
        } else {
            return (
                <></>
            )
        }
    }

    const CheckBoxHtml = () => {
        if (noticeData !== null && util.null2void(noticeData.NOTN_KEY) !== "") {
            let notnKey = util.null2void(noticeData.NOTN_KEY);
            let notnTrm = util.null2void(noticeData.NOTN_TRM);

            return (
                <label className='modalCk' htmlFor="noticeChk">
                    <input type='checkbox' id="noticeChk" name="noticeChk" data-key={notnKey} data-value={notnTrm} />
                    <span className="base">{noticeData.NOTN_TRM}일간 보지 않기</span>
                </label>
            );
        } else {
            return (
                <></>
            )
        }
    }

    /* 추후 활용 검토
    const popCont = (obj) => {
        console.log(`popCont 실행 언제하는지 확인용도`);
        console.log(`popCont wsvcNoticeData => `, wsvcNoticeData);
        console.log(`popCont noticeData =>`, noticeData);
        console.log(obj);
        console.log(`tyoeof obj => `, typeof obj);

        if (util.null2void(noticeData) !== "" && (typeof noticeData.CMKN_CTNT !== "undefined" && noticeData.CMKN_CTNT != null)) {
            // let nothKey = util.null2void(noticeData.NOTH_KEY);
            // let nothTrm = util.null2void(noticeData.NOTN_TRM)
            // let cmknCtnt = util.unescapeHtml(noticeData.CMKN_CTNT);

            // let data = typeof obj !== "object" ? JSON.parse(obj) : obj;
            // console.log(`popCont 실행 => `);
            // console.log(`popCont obj => `, data);
            // console.log(`NOTICEDATA`);
            // console.log(noticeData);
            let CMKN_CTNT = util.null2void(noticeData.CMKN_CTNT) !== "" ? util.unescapeHtml(noticeData.CMKN_CTNT) : "";    // item.CMKN_CTNT =
            // let CMKN_CTNT = "";


            // setModalIsOpen(true);
            setNoticeData(null);
            return (
                {CMKN_CTNT}
            )



            // openModal();

        } else {
            setModalIsOpen(false);
            return (<></>);
        }
    }
    */

    return (
        <CommonModal
            isOpen={modalIsOpen}
            onClose={closeModal}
            title="공지사항"
            width="max-w-xl"
        >
            <CmpModalPopupCont>
                <ModalTit />
                <div className="modalContArea">
                    <ContentHtml />
                    <CheckBoxHtml />
                </div>
                <div className="modalBtnArea">
                    <button className="modalBtn" onClick={fnBtnConfirm}><span className="base">확인</span></button>
                </div>
                <button type="button" className="modalPopupClosed" onClick={fnBtnConfirm}><span className="hidden">닫기</span></button>
            </CmpModalPopupCont>
        </CommonModal>
    );
}


export default CmpNotice;
