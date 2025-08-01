'use client'

import { util } from "@/app/shared/utils/com_util";
import { FullPopup, toast } from '@/app/shared/utils/ui_com';
import React from 'react';
import { StyledIframeFullPopup } from './cmp_iframePopup_style';

//바텀시트
const CmpIframeFpArea = (props) => {
    const { id, className, popType, children } = props;

    const renderChildren = () => {
        return React.Children.map(props.children, (child) => {
            return React.cloneElement(child, {
                id: id,
            });
        });
    };

    const addedChildren = renderChildren;

    const divClick = (e) => {

        if (e.target.classList.contains("CmpBottomSheetArea")) {
            FullPopup.Closed("#" + id);
        }

    }

    return (
        <StyledIframeFullPopup id={id} className={`CmpBottomSheetArea ${className}`} data-poptype={popType} onClick={divClick}>
            <div className="bottomSheetContArea">
                <div className="innerCont">
                    <>{addedChildren()}</>
                </div>
            </div>
        </StyledIframeFullPopup>
    );
};

//바텀시트 타이틀
const CmpIframeFpTitle = (props) => {
    const { popTitle, id, click, downOrshare } = props;

    const buttonClick = (e) => {
        FullPopup.Closed("#" + id);
        if (click !== undefined) {
            click();
        }
    }

    const buttonDownClick = (e) => {

        let targetId = document.querySelector("#" + id + " .pdfViewArea > button").getAttribute("data-callbackid");

        console.log("id:" + id);
        console.log("targetId:" + targetId);
        let fimeName = document.querySelector("#" + targetId + " LI[aria-selected=true] span").textContent;
        console.log("fimeName:" + fimeName);

        let pdfEnData;

        try {
            pdfEnData = document.querySelector("#" + id + " iframe").contentDocument.querySelector("#pdfEn").value;
        } catch (e) {
            console.log("file not find");
            pdfEnData = "";//로컬 or iframe 못잡음
        }

        console.log("pdfEnData:" + pdfEnData);

        if (pdfEnData === "") {
            return;
        }

        // 공유하기
        // base64 인코딩 native로 전달
        let param = {
            contents: pdfEnData,
            type: "pdf_file",
            isOpenShared: "",
            fileName: fimeName    //fileName에 .pdf 생략
        };

        if (downOrshare === undefined || downOrshare !== "S") {
            param.isOpenShared = "N";
        } else {
            param.isOpenShared = "Y";
        }
        console.log("param:" + JSON.stringify(param));
        let callback_c = function (data) {
            if (data["RESULT_CODE"] === "0000") {
                // 다운로드인경우 2021.07.26 일단 주석처리
                if (downOrshare === undefined || downOrshare !== "S") {

                    var os = util.getMobileOS();
                    if (os == "ios") {
                        toast.callCommonToastOpen("파일/나의 iPhone/JB뱅크 위치에 " + fimeName + ".pdf 다운로드가 정상적으로 완료되었습니다");
                    } else {
                        toast.callCommonToastOpen("내파일/내장 메모리/Download 위치에 " + fimeName + ".pdf 다운로드가 정상적으로 완료되었습니다")
                    }

                }
            }

        }
        console.log("native call start~!!!");
        nc.nativeCall(callback_c, "JBNativeUIBR", "doNOpenShared", param);
    }

    return (
        <div className="bottomSheetTitle">
            <button type="button" className="bottomSheetClosed" onClick={buttonClick}><span className="hidden">닫기</span></button>
            <p>{popTitle}</p>
            <button type="button" className="fileDown" onClick={buttonDownClick}><span className="hidden">다운로드</span></button>
        </div>
    );
};

//바텀시트 컨텐츠
const CmpIframeFpCont = (props) => {
    const { children } = props;

    return (
        <div className="bottomSheetCont">
            <div className="innerScroll">
                {children}
            </div>
        </div>
    );
};

export { CmpIframeFpArea, CmpIframeFpCont, CmpIframeFpTitle };
