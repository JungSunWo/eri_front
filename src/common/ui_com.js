/**
 * @File Name      : ui_com.js
 * @File path      : src/common/ui_com.js
 * @author         : 정선우
 * @Description    : 공통 UI 컴포넌트 및 유틸리티 함수들을 정의
 *                   - 바텀시트, 토스트, 알림창 등 팝업 컴포넌트
 *                   - 스크롤 락/언락 기능
 *                   - 접근성 관련 함수들
 *                   - GSAP 애니메이션을 활용한 부드러운 UI 효과
 * @History        : 20250701  최초 신규
 **/

import { util } from "@/common/com_util";
import gsap from "gsap";

/**
 * 본문 스크롤 초기화 방지 객체
 * - 모바일에서 팝업 열릴 때 배경 스크롤을 막는 기능
 * - 팝업 닫힐 때 원래 스크롤 위치로 복원
 * - 모바일 환경에서 팝업 사용성을 향상시키는 핵심 기능
 */
const lockBody = {
    val: {
        mobileBodyLock: "N",						// 모바일 body 스크롤 락 여부 (Y/N)
        contWrap: '#contents',						// 컨텐츠 영역 선택자
        LockScrollTop: "", 						// 스크롤 락 시도시 현재 스크롤 값 저장
    },

    /**
     * 스크롤 락 기능
     * - 현재 스크롤 위치를 저장하고 body 스크롤을 비활성화
     * - 팝업이 열릴 때 배경 스크롤을 방지하여 사용성 향상
     */
    lock: function () {
        // 현재 스크롤 위치 저장 및 컨텐츠 영역 위치 조정
        if (window.pageYOffset) {
            lockBody.val.LockScrollTop = window.pageYOffset;
            document.querySelector(lockBody.val.contWrap).style.top = - (lockBody.val.LockScrollTop) + "px";
        }

        // HTML과 Body 요소의 스크롤 비활성화
        document.querySelector("html").style.height = "100%";
        document.querySelector("html").style.overflow = "hidden";

        document.querySelector("body").style.height = "100%";
        document.querySelector("body").style.overflow = "hidden";

        lockBody.val.mobileBodyLock = "Y";
    },

    /**
     * 스크롤 언락 기능
     * - 저장된 스크롤 위치로 복원하고 body 스크롤을 활성화
     * - 팝업이 닫힐 때 원래 스크롤 위치로 복원
     */
    unlock: function () {
        // HTML과 Body 요소의 스크롤 활성화
        document.querySelector("html").style.height = "";
        document.querySelector("html").style.overflow = "";
        document.querySelector("body").style.height = "";
        document.querySelector("body").style.overflow = "";

        // 컨텐츠 영역 위치 복원
        document.querySelector(lockBody.val.contWrap).style.top = "";

        // 저장된 스크롤 위치로 복원
        window.scrollTo(0, lockBody.val.LockScrollTop);
        window.setTimeout(function () {
            lockBody.val.LockScrollTop = null;
        }, 0);
        lockBody.val.mobileBodyLock = "N";
    }
}

/**
 * 바텀시트 이벤트 스크립트
 * - 모바일에서 하단에서 올라오는 팝업 형태의 UI 컴포넌트
 * - GSAP 애니메이션을 사용한 부드러운 등장 효과
 * - 접근성 고려한 포커스 관리 및 ARIA 속성 처리
 */
const bottomSheet = {
    /**
     * 바텀시트 열기
     * - 바텀시트를 화면 하단에서 부드럽게 올라오는 애니메이션과 함께 표시
     * - 내부 컨텐츠에 순차적 애니메이션 적용
     * - 접근성을 위한 포커스 관리 및 ARIA 속성 처리
     * @param {string} PopID - 바텀시트 요소의 ID (예: '#bottomSheet')
     */
    Open: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('bottomSheet: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }

        // 바텀시트 표시 및 활성화
        el.style.display = "block";
        setTimeout(function () {
            el.classList.add("on");
        }, 100);

        // 하단 버튼 영역이 있는 경우 스크롤 영역 조정
        const bottomBtnArea = document.querySelector(`${PopID} .bottomBtnArea`);
        if (bottomBtnArea !== null) {
            const secEl = document.querySelector(`${PopID} .innerScroll`);
            secEl.style.paddingBottom = `${bottomBtnArea.offsetHeight}px`;
        }

        // 내부 컨텐츠 아이템들에 순차적 애니메이션 적용
        const PopContItem = document.querySelectorAll(`${PopID} .innerScroll>*`);
        PopContItem.forEach((el, index) => {
            gsap.set(el, { opacity: 0, "top": "100px", "position": "relative" });
            gsap.to(el, {
                duration: 0.7,
                opacity: 1,
                top: 0,
                delay: 0.3 + index * 0.1, // 순차적 지연 효과
                ease: "power4.out"
            });
        });

        // 드롭다운 리스트 아이템들에 애니메이션 적용
        const DropDownListItem = document.querySelectorAll(`${PopID} .actionSheet_dropDown_list`);
        if (DropDownListItem.length !== 0) {
            gsap.set(`${PopID} .actionSheet_dropDown_list .item`, { opacity: 0, "top": "100px" });
            const item = document.querySelectorAll(`${PopID} .actionSheet_dropDown_list .item`);
            item.forEach((el, index) => {
                gsap.to(el, {
                    duration: 0.7,
                    opacity: 1,
                    top: 0,
                    delay: 0.3 + index * 0.1,
                    ease: "power4.out"
                });
            });
        }

        // 접근성 코드 - 포커스 관리
        if (event instanceof PointerEvent || event instanceof MouseEvent) {
            let button = event.target;
            button.classList.add("on");
            button.setAttribute("data-retrunFocus", "Y");
            button.setAttribute("tabindex", "0");
        }

        // 접근성 코드 취합(팝업 중첩이슈처리)
        addAriaHidden(PopID);
    },

    /**
     * 바텀시트 닫기
     * - 바텀시트를 부드럽게 닫고 원래 포커스 위치로 복원
     * - 콜백 함수 지원으로 닫기 완료 후 추가 작업 가능
     * @param {string} PopID - 바텀시트 요소의 ID
     * @param {Function} callback - 닫기 완료 후 실행할 콜백 함수 (선택사항)
     */
    Closed: (PopID, callback) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('bottomSheet.Closed: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }

        if (callback !== undefined && typeof callback === 'function') {
            // 콜백이 있는 경우 Promise를 사용하여 비동기 처리
            new Promise(function (resolve, reject) {
                el.classList.remove("on");
                el.removeAttribute("data-show");

                setTimeout(function () {
                    if (el) {
                        el.style.display = "none";
                    }

                    // 포커스 복원 처리
                    const retrunFocusElement = document.querySelector("[data-retrunFocus=Y]");
                    if (retrunFocusElement) {
                        retrunFocusElement.classList.remove("on");
                        retrunFocusElement.focus();
                    }

                    const retrunFocusElements = document.querySelectorAll("[data-retrunFocus]");
                    retrunFocusElements.forEach(element => element.removeAttribute("data-retrunFocus"));

                    const innerCont = el?.querySelector(".innerCont");
                    if (innerCont) {
                        innerCont.style.top = "0px";
                    }

                    popLengthCk();
                    resolve()
                }, 300);

            }).then(function (dat) {
                // ARIA 속성 정리
                const hiddenElements = document.querySelectorAll("[data-hidden=hidden]");
                hiddenElements.forEach(element => {
                    element.removeAttribute("data-hidden");
                    element.removeAttribute("aria-hidden");
                });

                callback();
            })

        } else {
            // 콜백이 없는 경우 동기 처리
            el.classList.remove("on");

            setTimeout(function () {
                if (el) {
                    el.style.display = "none";
                }

                // 포커스 복원 처리
                const retrunFocusElement = document.querySelector("[data-retrunFocus=Y]");
                if (retrunFocusElement) {
                    retrunFocusElement.classList.remove("on");
                    retrunFocusElement.focus();
                }

                const retrunFocusElements = document.querySelectorAll("[data-retrunFocus]");
                retrunFocusElements.forEach(element => element.removeAttribute("data-retrunFocus"));

                const innerCont = el?.querySelector(".innerCont");
                if (innerCont) {
                    innerCont.style.top = "0px";
                }

                popLengthCk();

            }, 300);

            // ARIA 속성 정리
            const hiddenElements = document.querySelectorAll("[data-hidden=hidden]");
            hiddenElements.forEach(element => {
                element.removeAttribute("data-hidden");
                element.removeAttribute("aria-hidden");
            });
        }
    },

    /**
     * 터치 시간 체크
     * - 현재 시간을 HHMMSS 형식으로 반환
     * - 터치 이벤트의 시간 기록에 사용
     * @returns {string} 현재 시간 (HHMMSS 형식)
     */
    timeCheck: () => {
        const time = new Date();
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');
        const TimeData = hours + minutes + seconds;

        return TimeData;
    },

    /**
     * 선택된 키 값 가져오기
     * - 바텀시트에서 선택된 항목의 키 값을 반환
     * @param {string} PopID - 바텀시트 요소의 ID
     * @returns {string} 선택된 아이템의 data-value 값
     */
    getSelectedKey: (PopID) => {
        let selectedItem = document.querySelector("#" + PopID + " LI[aria-selected=true]");
        if (selectedItem !== null) {
            return selectedItem.getAttribute("data-value");
        } else {
            return "";
        }
    }
}

/**
 * 토스트 알림 객체
 * - 화면 하단에 잠깐 나타났다 사라지는 알림 메시지
 */
const toast = {
    /**
     * 토스트 열기
     * @param {string} PopID - 토스트 요소의 ID
     */
    Open: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('toast: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }
        el.style.display = "block";

        setTimeout(function () {
            el.classList.add("on");
        }, 100);

        // 접근성 코드 취합(팝업 중첩이슈처리)
        addAriaHidden(PopID, "toast");

        if ((document.querySelector(PopID + " .toastBtnArea") === null)) {
            setTimeout(() => {
                toast.Closed(PopID);
            }, 3000);
        }

    },
    Closed: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('toast.Closed: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }
        el.classList.remove("on");
        el.removeAttribute("data-show");

        setTimeout(function () {
            if (el) {
                el.style.display = "none";
            }

            // "[data-retrunFocus=Y]" 속성을 가진 요소의 "on" 클래스를 제거하고 포커스를 설정
            const retrunFocusElement = document.querySelector("[data-retrunFocus=Y]");
            if (retrunFocusElement) {
                retrunFocusElement.classList.remove("on");
                retrunFocusElement.focus();
            }

            // "data-retrunFocus" 속성을 가진 모든 요소에서 "data-retrunFocus" 속성을 제거
            const retrunFocusElements = document.querySelectorAll("[data-retrunFocus]");
            retrunFocusElements.forEach(element => element.removeAttribute("data-retrunFocus"));

            const htmlBody = document.querySelector("html, body");
            if (htmlBody) {
                htmlBody.classList.remove("bodyScrollHidden");
            }

        }, 500);

        // "[data-hidden=hidden]" 속성을 가진 모든 요소에서 "data-hidden"과 "aria-hidden" 속성을 제거
        const hiddenElements = document.querySelectorAll("[data-hidden=hidden]");
        hiddenElements.forEach(element => {
            element.removeAttribute("data-hidden");
            element.removeAttribute("aria-hidden");
        });
    },
    callCommonToastOpen: (toastTitle, option) => {

        let PopID = "#commonToast";

        // 현재 포커스된 요소 저장
        const currentFocus = document.activeElement;
        if (currentFocus) {
            currentFocus.setAttribute("data-previous-focus", "true");
        }

        document.querySelector(PopID + " .toastText").textContent = toastTitle;

        let toastType;

        if (option !== undefined && option.showOk === "Y" && option.showCancel === "Y") {
            toastType = "twoButton";
        } else if (option !== undefined && option.showOk === "Y") {
            toastType = "oneButton";
        } else {
            toastType = "zeroButton";
        }

        document.querySelector(PopID + " .toastBtnArea").style.display = "block";

        if (toastType === "twoButton") {
            document.querySelector(PopID).classList.add("twoBtn");
        } else {
            document.querySelector(PopID).classList.remove("twoBtn");
        }

        if (toastType === "twoButton") {

            let button0 = document.querySelectorAll(PopID + " .toastBtnArea button")[0];//취소
            let button1 = document.querySelectorAll(PopID + " .toastBtnArea button")[1];//확인

            let cloneButton0 = button0.cloneNode(true);
            let cloneButton1 = button1.cloneNode(true);

            button0.parentNode.replaceChild(cloneButton0, button0);
            button1.parentNode.replaceChild(cloneButton1, button1);

            document.querySelectorAll(PopID + " .toastBtnArea button")[0].addEventListener("click", handleToastCancelClick);
            document.querySelectorAll(PopID + " .toastBtnArea button")[1].addEventListener("click", handleToastOkClick);

            function handleToastCancelClick(e) {
                if (option !== undefined && option.cancelCallback !== undefined) {
                    option.cancelCallback();
                }
                toast.Closed(PopID);
            }

            function handleToastOkClick(e) {
                if (option !== undefined && option.okCallback !== undefined) {
                    option.okCallback();
                }
                toast.Closed(PopID);
            }

            if (option !== undefined && option.cancelLabel !== undefined) {
                document.querySelectorAll(PopID + " .toastBtnArea button")[0].querySelector("span").innerHTML = option.cancelLabel;
            } else {
                document.querySelectorAll(PopID + " .toastBtnArea button")[0].querySelector("span").innerHTML = "취소";
            }

            if (option !== undefined && option.okLabel !== undefined) {
                document.querySelectorAll(PopID + " .toastBtnArea button")[1].querySelector("span").innerHTML = option.okLabel;
            } else {
                document.querySelectorAll(PopID + " .toastBtnArea button")[1].querySelector("span").innerHTML = "확인";
            }

            document.querySelectorAll(PopID + " .toastBtnArea button")[0].style.display = "";
            document.querySelectorAll(PopID + " .toastBtnArea button")[1].style.display = "";


        } else if (toastType === "oneButton") {

            let button0 = document.querySelectorAll(PopID + " .toastBtnArea button")[0];//취소
            let button1 = document.querySelectorAll(PopID + " .toastBtnArea button")[1];//확인

            button0.style.display = "none";

            let cloneButton1 = button1.cloneNode(true);

            button1.parentNode.replaceChild(cloneButton1, button1);

            document.querySelectorAll(PopID + " .toastBtnArea button")[1].addEventListener("click", handleToastOkClick);

            function handleToastOkClick(e) {
                if (option !== undefined && option.okCallback !== undefined) {
                    option.okCallback();
                }
                toast.Closed(PopID);
            }

            if (option !== undefined && option.okLabel !== undefined) {
                document.querySelectorAll(PopID + " .toastBtnArea button")[1].querySelector("span").innerHTML = option.okLabel;
            } else {
                document.querySelectorAll(PopID + " .toastBtnArea button")[1].querySelector("span").innerHTML = "확인";
            }

            document.querySelectorAll(PopID + " .toastBtnArea button")[1].style.display = "";

        } else {
            document.querySelector(PopID + " .toastBtnArea").style.display = "none";
        }

        document.querySelector(PopID).style.display = "block";

        setTimeout(function () {
            document.querySelector(PopID).classList.add("on");
        }, 100);

        // if (event.target != undefined) {
        //     event.target.classList.add("on");
        //     event.target.setAttribute("data-retrunFocus", "Y");
        //     event.target.setAttribute("tabindex", "0");
        // }

        //접근성 코드 취합(팝업 중첩이슈처리)
        addAriaHidden(PopID, "toast");

        if (document.querySelector(PopID + " .toastBtnArea").style.display === "none") {
            setTimeout(() => {
                toast.Closed(PopID);
            }, 3000);
        }
    },

    //닫기
    Closed: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('toast.Closed: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }

        el.classList.remove("on");
        el.removeAttribute("data-show");

        setTimeout(function () {
            if (el) {
                el.style.display = "none";
            }

            // 원래 포커스로 돌아가기
            const previousFocus = document.querySelector("[data-previous-focus=true]");
            if (previousFocus) {
                previousFocus.removeAttribute("data-previous-focus");
                previousFocus.focus();
            }

            // "[data-hidden=hidden]" 속성을 가진 모든 요소에서 "data-hidden"과 "aria-hidden" 속성을 제거
            const hiddenElements = document.querySelectorAll("[data-hidden=hidden]");
            hiddenElements.forEach(element => {
                element.removeAttribute("data-hidden");
                element.removeAttribute("aria-hidden");
            });
        }, 300);
    }
}

const alert = {
    //열기
    Open: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('alert: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }
        el.style.display = "block";

        gsap.set(`${PopID} .alertPopupContArea`, { opacity: 0, "top": "calc(50% + 100px)" });
        gsap.to(`${PopID} .alertPopupContArea`, {
            duration: 0.5,
            opacity: 1,
            top: "50%",
            ease: "power3.out"
        });


        if (event instanceof PointerEvent || event instanceof MouseEvent) {
            let button = event.target;
            button.classList.add("on");
            button.setAttribute("data-retrunFocus", "Y");
            button.setAttribute("tabindex", "0");
        }


        //접근성 코드 취합(팝업 중첩이슈처리)
        addAriaHidden(PopID);
    },

    //닫기
    Closed: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('alert.Closed: 해당 id의 팝업이 없습니다:', PopID);
            return;
        }
        el.style.display = "none";
        el.removeAttribute("data-show");

        //show처리된 팝업 체크
        let popShowItem = Array.from(document.querySelectorAll("[data-show='true']"));
        if (popShowItem.length > 0) {
            let ClosedZindexItem = popShowItem.reduce((highest, current) => {
                const currentZindex = parseInt(getComputedStyle(current).zIndex, 10) || 0;
                const highetZindex = parseInt(getComputedStyle(highest).zIndex, 10) || 0;
                return currentZindex > highetZindex ? current : highest;
            }, popShowItem[0]);
            let ClosedRetrunPopID = ClosedZindexItem;
            console.log(ClosedRetrunPopID)

            addAriaHidden(`#${ClosedRetrunPopID.id}`);
        }
        else {
            // "[data-retrunFocus=Y]" 속성을 가진 요소의 "on" 클래스를 제거하고 포커스를 설정
            const retrunFocusElement = document.querySelector("[data-retrunFocus=Y]");
            if (retrunFocusElement) {
                retrunFocusElement.classList.remove("on");
                retrunFocusElement.focus();
            }

            const retrunFocusElements = document.querySelectorAll("[data-retrunFocus]");
            retrunFocusElements.forEach(element => element.removeAttribute("data-retrunFocus"));

            // "[data-hidden=hidden]" 속성을 가진 모든 요소에서 "data-hidden"과 "aria-hidden" 속성을 제거
            const hiddenElements = document.querySelectorAll("[data-hidden=hidden]");
            hiddenElements.forEach(element => {
                element.removeAttribute("data-hidden");
                element.removeAttribute("aria-hidden");
            });

            popLengthCk();
        }
    },
    AlertOpen: (popTitle, popCont, option) => {

        let PopID = "#commonAlert";
        const popTitleArea = document.querySelector(PopID + " .popTitleArea");
        if (popTitleArea) {
            popTitleArea.innerHTML = "<p>" + popTitle + "</p>";
        }

        const popContArea = document.querySelector(PopID + " .popContArea");
        if (popContArea) {
            popContArea.innerHTML = popCont;
        }

        const popBtnArea = document.querySelector(PopID + " .popBtnArea button");
        if (popBtnArea) {
            let clonebutton = popBtnArea.cloneNode(true);
            popBtnArea.parentNode.replaceChild(clonebutton, popBtnArea);
            document.querySelector(PopID + " .popBtnArea button").addEventListener("click", handleAlertOkClick);
        }

        function handleAlertClosedClick(e) {
            alert.Closed(PopID);
        }

        function handleAlertOkClick(e) {
            if (option !== undefined && option.okCallback !== undefined) {
                option.okCallback();
            }
            alert.Closed(PopID);
        }

        if (option !== undefined && option.okLabel !== undefined) {
            const btnSpan = document.querySelector(PopID + " .popBtnArea button span");
            if (btnSpan) btnSpan.textContent = option.okLabel;
        } else {
            const btnSpan = document.querySelector(PopID + " .popBtnArea button span");
            if (btnSpan) btnSpan.textContent = "확인";
        }

        const leftTopBtn = document.querySelector(PopID + " .alertPopupContArea button");
        if (option !== undefined && option.hideLeftTopButton !== undefined && option.hideLeftTopButton === "Y") {
            if (leftTopBtn) leftTopBtn.style.display = "none";
        } else {
            if (leftTopBtn) leftTopBtn.style.display = "block";
        }

        // 팝업이 보이도록 alert.Open 사용
        alert.Open(PopID);

    },
    ConfirmOpen: (popTitle, popCont, option) => {

        let PopID = "#commonConfirm";

        //유효한 배너가 존재하지 않을경우 처리
        if (document.querySelector(PopID + ' [data-bannertype="logout"]') !== null) {
            document.querySelector(PopID + ' [data-bannertype="logout"]').style.display = "none";
        }

        if (document.querySelector(PopID + ' [data-bannertype="appExit"]') !== null) {
            document.querySelector(PopID + ' [data-bannertype="appExit"]').style.display = "none";
        }

        if (option !== undefined && option.confirmType !== undefined) {
            if (document.querySelector(PopID + ' [data-bannertype="logout"]') !== null || document.querySelector(PopID + ' [data-bannertype="appExit"]') !== null) {
                document.querySelector(PopID).classList.add("logoutPop");
            }

            if (option.confirmType === "logout") {
                if (document.querySelector(PopID + ' [data-bannertype="logout"]') !== null) {
                    document.querySelector(PopID + ' [data-bannertype="logout"]').style.display = "block";
                }

            } else if (option.confirmType === "appExit") {
                if (document.querySelector(PopID + ' [data-bannertype="appExit"]') !== null) {
                    document.querySelector(PopID + ' [data-bannertype="appExit"]').style.display = "block";
                }
            }

        } else {
            document.querySelector(PopID).classList.remove("logoutPop");
        }

        const popTitleArea = document.querySelector(PopID + " .popTitleArea");
        if (popTitleArea) {
            popTitleArea.innerHTML = "<p>" + popTitle + "</p>";
        }

        const popContArea = document.querySelector(PopID + " .popContArea");
        if (popContArea) {
            popContArea.innerHTML = popCont;
        }

        const alertButton0 = document.querySelectorAll(PopID + " .popBtnArea button")[0];
        if (alertButton0) {
            let clonebutton0 = alertButton0.cloneNode(true);
            alertButton0.parentNode.replaceChild(clonebutton0, alertButton0);
            document.querySelectorAll(PopID + " .popBtnArea button")[0].addEventListener("click", handleAlertCancelClick);
        }

        const alertButton1 = document.querySelectorAll(PopID + " .popBtnArea button")[1];
        if (alertButton1) {
            let clonebutton1 = alertButton1.cloneNode(true);
            alertButton1.parentNode.replaceChild(clonebutton1, alertButton1);
            document.querySelectorAll(PopID + " .popBtnArea button")[1].addEventListener("click", handleAlertOkClick);
        }

        function handleAlertCancelClick(e) {
            if (option !== undefined && option.cancelCallback !== undefined) {
                option.cancelCallback();
            }
            alert.Closed(PopID);
        }

        function handleAlertOkClick(e) {
            if (option !== undefined && option.okCallback !== undefined) {
                option.okCallback();
            }
            alert.Closed(PopID);
        }
        if (option !== undefined && option.cancelLabel !== undefined) {
            const btnSpan0 = document.querySelectorAll(PopID + " .popBtnArea button")[0]?.querySelector("span");
            if (btnSpan0) btnSpan0.innerHTML = option.cancelLabel;
        } else {
            const btnSpan0 = document.querySelectorAll(PopID + " .popBtnArea button")[0]?.querySelector("span");
            if (btnSpan0) btnSpan0.innerHTML = "취소";
        }

        if (option !== undefined && option.okLabel !== undefined) {
            const btnSpan1 = document.querySelectorAll(PopID + " .popBtnArea button")[1]?.querySelector("span");
            if (btnSpan1) btnSpan1.innerHTML = option.okLabel;
        } else {
            const btnSpan1 = document.querySelectorAll(PopID + " .popBtnArea button")[1]?.querySelector("span");
            if (btnSpan1) btnSpan1.innerHTML = "확인";
        }

        const leftTopBtn = document.querySelector(PopID + " .alertPopupContArea button");
        if (option !== undefined && option.hideLeftTopButton !== undefined && option.hideLeftTopButton === "Y") {
            if (leftTopBtn) leftTopBtn.style.display = "none";
        } else {
            if (leftTopBtn) leftTopBtn.style.display = "block";
        }

        // 팝업이 보이도록 alert.Open 사용
        alert.Open(PopID);

        // ...이하 기존 코드 유지...
    },
    ErrorAlert: (popTitle, popContArray, okCallback) => {

        let PopID = "#commonErrorAlert";

        if (document.querySelector(PopID).style.display === "block") {
            return;
        }

        const popTitleAreaP = document.querySelector(PopID + " .popTitleArea P");
        if (popTitleAreaP) popTitleAreaP.innerHTML = popTitle;

        const popContAreaP = document.querySelector(PopID + " .popContArea P");
        if (popContAreaP) popContAreaP.innerHTML = util.strReplaceAll(popContArray[0].ERR_CTNT, "\\n", "<br/>");

        const infoBoxList = document.querySelector(PopID + " [data-type=info] .infoBox_list");
        if (infoBoxList) {
            let errorTag = "";
            let errDvcd = popContArray[0].INBN_ERR_DVCD;
            let errCd = popContArray[0].INBN_ERR_CD;
            let infoBox_listHtml = "";
            if (errDvcd !== "" || errCd !== "") {
                errorTag = "오류코드 : ";
                if (errDvcd !== "" && errCd === "") {
                    errorTag = errorTag + errDvcd;
                } else if (errDvcd === "" && errCd !== "") {
                    errorTag = errorTag + errCd;
                } else {
                    errorTag = errorTag + errDvcd + "_" + errCd;
                }
            }
            infoBox_listHtml += '<li class="infoBox_item"><span class="infoBox_text">' + errorTag + '</span></li>';
            infoBox_listHtml += '<li class="infoBox_item"><span class="infoBox_text">Service: ' + popContArray[0].SRVC_ID + '</span></li>';
            infoBoxList.innerHTML = infoBox_listHtml;
        }

        const alertPopupClosed = document.querySelector(PopID + " .alertPopupClosed");
        if (alertPopupClosed) {
            let cloneClosed = alertPopupClosed.cloneNode(true);
            alertPopupClosed.parentNode.replaceChild(cloneClosed, alertPopupClosed);
            document.querySelector(PopID + " .alertPopupClosed").addEventListener("click", handleAlertClosedClick);
        }

        const alertButton0 = document.querySelectorAll(PopID + " .popBtnArea button")[0];
        if (alertButton0) {
            let clonebutton0 = alertButton0.cloneNode(true);
            alertButton0.parentNode.replaceChild(clonebutton0, alertButton0);
            document.querySelectorAll(PopID + " .popBtnArea button")[0].addEventListener("click", handleAlertClosedClick);
        }

        function handleAlertClosedClick(e) {
            if (okCallback !== undefined) {
                okCallback();
            }

            let accordionTrigger = document.querySelector(".accordionCard_trigger");
            if (accordionTrigger && accordionTrigger.getAttribute("aria-expanded") === "true") {
                accordionTrigger.click();
            }

            alert.Closed(PopID);
        }

        // 팝업이 보이도록 alert.Open 사용
        alert.Open(PopID);

        // ...이하 기존 코드 유지...
    },
    callCommonLogoutInfoAlert: (second) => {

        let PopID = "#commonLogoutInfo";

        document.querySelector(PopID + " .count").textContent = "0";

        if (document.querySelector(PopID).style.display === "none" || document.querySelector(PopID).style.display === "") {

            document.querySelector(PopID).style.display = "block";

            gsap.set(`${PopID} .alertPopupContArea`, { opacity: 0, "top": "calc(50% + 100px)" });
            gsap.to(`${PopID} .alertPopupContArea`, {
                duration: 0.5,
                opacity: 1,
                top: "50%",
                ease: "power3.out"
            });

            //접근성 코드 취합(팝업 중첩이슈처리)
            addAriaHidden(PopID);
        }

        document.querySelector(PopID + " .count").textContent = second;
    },
    //return boolean
    commonConfirmOpened: () => {
        return alert.commonPopupOpened("#commonConfirm");
    },
    //return boolean
    commonAlertOpened: () => {
        return alert.commonPopupOpened("#commonAlert");
    },
    //return boolean
    commonPopupOpened: (PopID) => {

        let currentDisplay = document.querySelector(PopID).style.display;
        if ("block" === currentDisplay) {
            return true;
        } else {
            return false;
        }

    },
    commonConfirmClose: () => {
        alert.Closed("#commonConfirm");
    },
    commonAlertClose: () => {
        alert.Closed("#commonAlert");
    },
}

const FullPopup = {
    //열기
    Open: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('FullPopup/BottomSheet: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }
        el.style.display = "block";
        setTimeout(function () {
            el.classList.add("on");
        }, 100);

        // Only declare bottomBtnArea once
        const bottomBtnArea = document.querySelector(`${PopID} .bottomBtnArea`);
        if (bottomBtnArea !== null) {
            const secEl = document.querySelector(`${PopID} .innerScroll`);
            secEl.style.paddingBottom = `${bottomBtnArea.offsetHeight}px`;
        }

        const PopContItem = document.querySelectorAll(`${PopID} .innerScroll>*`);
        PopContItem.forEach((el, index) => {
            gsap.set(el, { opacity: 0, "top": "100px", "position": "relative" });

            setTimeout(() => {
                gsap.to(el, {
                    duration: 1,
                    opacity: 1,
                    top: 0,
                    delay: 0.3 + index * 0.1, // 인덱스에 따라 지연 시간을 적용하여 순차적으로 등장
                    ease: "power4.out",
                });
            }, 100);
        });

        setTimeout(function () {
            el.classList.add("on");
            if (bottomBtnArea !== null) {
                const secEl = document.querySelector(`${PopID} .innerScroll`);
                secEl.style.paddingBottom = `${bottomBtnArea.offsetHeight}px`;
            }
        }, 100);

        //접근성 코드
        if (typeof event !== 'undefined' && (event instanceof PointerEvent || event instanceof MouseEvent)) {
            let button = event.target;
            button.classList.add("on");
            button.setAttribute("data-retrunFocus", "Y");
            button.setAttribute("tabindex", "0");
        }

        //접근성 코드 취합(팝업 중첩이슈처리)
        addAriaHidden(PopID);

    },

    //닫기
    Closed: (PopID) => {
        const el = document.querySelector(PopID);
        if (!el) {
            console.warn('FullPopup.Closed: 해당 id의 DOM이 없습니다:', PopID);
            return;
        }
        el.classList.remove("on");
        el.removeAttribute("data-show");

        gsap.to(PopID, {
            duration: 0.4,
            opacity: 0,
            delay: 0.2,
            ease: "power4.out",
        });

        setTimeout(function () {

            if (el) {
                el.style.display = "none";
            }

            // "[data-retrunFocus=Y]" 속성을 가진 요소의 "on" 클래스를 제거하고 포커스를 설정
            const retrunFocusElement = document.querySelector("[data-retrunFocus=Y]");
            if (retrunFocusElement) {
                retrunFocusElement.classList.remove("on");
                retrunFocusElement.focus();
            }

            const retrunFocusElements = document.querySelectorAll("[data-retrunFocus]");
            retrunFocusElements.forEach(element => element.removeAttribute("data-retrunFocus"));

            const innerCont = el?.querySelector(".innerCont");
            if (innerCont) {
                innerCont.style.top = "0px";
            }
            //document.querySelector("html, body").classList.remove("bodyScrollHidden");
            //lockBody.unlock();
            if (el) {
                gsap.set(PopID, { opacity: 1 });
            }
            popLengthCk();
        }, 700);

        // "[data-hidden=hidden]" 속성을 가진 모든 요소에서 "data-hidden"과 "aria-hidden" 속성을 제거
        const hiddenElements = document.querySelectorAll("[data-hidden=hidden]");
        hiddenElements.forEach(element => {
            element.removeAttribute("data-hidden");
            element.removeAttribute("aria-hidden");
        });
    },
}

const popLengthCk = () => {
    let CmpBottomSheetAreaEl = document.querySelectorAll(".CmpBottomSheetArea, .alertPopupArea");
    let blockCount = 0;

    CmpBottomSheetAreaEl.forEach(function (element) {
        var styles = window.getComputedStyle(element);
        if (styles.display === "block") {
            blockCount++;
        }
    });


    console.log(blockCount);
}

//접근성 포커스 공통 함수
const addAriaHidden = (PopID, type) => {
    let focusDelay = 300;
    let popIDElement = document.querySelector(PopID);

    let popZindex = 3000 + document.querySelectorAll("[data-show='true']").length;

    popIDElement.style.zIndex = popZindex;

    //토스트팝업
    if (type == "toast") {
        popIDElement.querySelector(".toastText").setAttribute("data-pop-focus", "first");
        focusDelay = 600;
    }
    else {
        // 첫번째, 마지막 타겟 셋팅시 예외상태 추가
        let TargetState = "[data-hidden=hidden], [style*='display:none'], [style*='display: none'], [style*='display :none'], [style*='display : none']";

        // 팝업 내에 첫번째, 마지막 타겟 지정
        let focusElements = popIDElement.querySelectorAll("a, button, input, select");
        let focusableElements = Array.from(focusElements).filter(function (element) {
            return !element.matches(TargetState);
        });

        if (focusableElements.length > 0) {
            focusableElements[0].setAttribute("data-pop-focus", "first");
        }
    }

    document.querySelector(PopID).setAttribute("data-show", true);

    // body 요소의 모든 자식 요소에 대해 aria-hidden과 data-hidden 속성을 추가합니다.
    let ariaElements = document.querySelectorAll("body *:not(popuparea)");
    let popElement = document.querySelector(PopID);

    //중첩팝업시 예외처리
    //메인팝업이 실행은 마지막에 되지만 z-index 가 alert 보다 낮아서 접근성처리시 포커스가 접근이 불가함
    let popShowItem = Array.from(document.querySelectorAll("[data-show='true']")).filter(pop => pop.id !== "mainPop");
    if (popShowItem.length > 0) {
        if (PopID == "#mainPop") {
            console.log("메인팝업");

            let popZindexItem = popShowItem.reduce((highest, current) => {
                const currentZindex = parseInt(getComputedStyle(current).zIndex, 10) || 0;
                const highetZindex = parseInt(getComputedStyle(highest).zIndex, 10) || 0;

                return currentZindex > highetZindex ? current : highest;
            }, popShowItem[0]);

            popElement = popZindexItem;
            console.log(popElement)
        }
    }

    ariaElements.forEach(element => {
        // 포커스된 요소나 그 조상 요소에는 aria-hidden을 적용하지 않음
        const isFocused = element === document.activeElement || element.contains(document.activeElement);
        const hasFocus = element.matches(':focus') || element.querySelector(':focus');

        if (element !== popElement && !popElement.contains(element) && !isFocused && !hasFocus) {
            element.setAttribute("aria-hidden", "true");
            element.setAttribute("data-hidden", "hidden");
        }
        else {
            element.removeAttribute("data-hidden");
            element.removeAttribute("aria-hidden");
        }
    });

    //HTML의 깊이를 확인하여 aria-hidden 속성을 삭제합니다.
    let targetHtml = popElement;
    let endClass = targetHtml.parentElement.tagName;
    let i = 0;

    while (endClass !== "HTML" && i < 20) {
        targetHtml.removeAttribute("data-hidden");
        targetHtml.removeAttribute("aria-hidden");

        targetHtml = targetHtml.parentElement;
        endClass = targetHtml.parentElement.tagName;
        i++;
    }

    setTimeout(function () {
        let firstFocusElement = popIDElement.querySelector("[data-pop-focus=first]");
        if (firstFocusElement) {
            firstFocusElement.focus();
        }
    }, focusDelay);
}




export { FullPopup, alert, bottomSheet, toast };
