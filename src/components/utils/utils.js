import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from 'react';

//br태그 치환
export const FormattedLabel = (label) => {
    if (label === undefined) {
        return null;
    }

    return label.split('<br/>').map((line, index, array) => (
        <React.Fragment key={index}>
            {line}
            {index !== array.length - 1 && <br />}
        </React.Fragment>
    ));
};


// 커스텀 스타일 속성을 data- 속성으로 변환
export const ConvertToDataAttributes = (styles) => {
    if (styles) {
        const convertedStyles = {};
        Object.keys(styles).forEach(key => {
            convertedStyles[`data-${key}`] = styles[key];
        });
        return convertedStyles;
    }
    return {};
};

//br태그 기준으로 태그 분리
export const FormatTextWithBr = (text) => {
    // <br/>로 나눠진 부분을 배열로 만듭니다.
    const parts = text.split('<br/>');

    // 각 부분을 <p> 태그로 래핑하고 반환합니다.
    const formattedText = parts.map((part, index) => (
        <span key={index} className={`text_${index}`} dangerouslySetInnerHTML={{ __html: part }} />
    ));

    return formattedText;
}

//페이지 이동시 컨텐츠 영역 초기화
export const ContAreaReset = () => {
    // (document.querySelector("#contents .sec") 관련 줄 전체 삭제)
}

//페이지 진입시 스크롤 모션
export const PageInitMotion = () => {
    //대상 선택
    const itemIndex = document.querySelectorAll("[data-scrollmotion=fadeIn]");
    if (itemIndex.length === 0) { return false }

    //대상 show/hide Item 분리
    const visibleItem = Array.from(itemIndex).filter((box) => {
        if (getComputedStyle(box).display !== "none") {
            box.setAttribute("data-scrollDisplay", "showEl");
        }
        else {
            box.setAttribute("data-scrollDisplay", "hideEl");
            box.removeAttribute("data-scrollmotion");
        }
    });

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch("[data-scrollDisplay=showEl]", {
        scroller: ".sec",
        onEnter: elements => {
            gsap.to(elements, {
                duration: 0.8,
                opacity: 1,
                y: 0,
                stagger: 0.3
            });
        },
        start: "top 95%",
        once: true
    });
}

export const TabChange = (showTab, hideTab) => {
    gsap.set(hideTab, { "position": "relative" });
    gsap.to(hideTab, {
        duration: 0.3,
        opacity: 0,
        top: "50px",
        ease: "power4.out",
        display: "none"
    });

    gsap.set(showTab, { opacity: 0, "top": "50px", "position": "relative" });
    gsap.to(showTab, {
        duration: 0.7,
        display: "block",
        opacity: 1,
        top: 0,
        delay: 0.3,
        ease: "power4.out"
    });
}

//금액 카운트 모션
//전계좌조회 html구조 참조후 작업
export const NumberCount = (obj, numheight) => {
    console.log(obj)
    let number = obj.innerText;
    obj.setAttribute("data-number", number);

    obj.innerHTML = "";

    let numChars = number.split(""),
        numArray = [],
        setOfNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    let xHtml = "";

    for (let i = 0; i < numChars.length; i++) {
        if (setOfNumbers.indexOf(parseInt(numChars[i], 10)) !== -1) {
            xHtml += '<b aria-hidden="true" class="digit' + numArray.length + '"><em aria-hidden="true">0</em><em aria-hidden="true">1</em><em aria-hidden="true">2</em><em aria-hidden="true">3</em><em aria-hidden="true">4</em><em aria-hidden="true">5</em><em aria-hidden="true">6</em><em aria-hidden="true">7</em><em aria-hidden="true">8</em><em aria-hidden="true">9</em></b>';
            numArray[numArray.length] = parseInt(numChars[i], 10);
        } else {
            xHtml += "<b aria-hidden='true'>" + numChars[i] + "</b>";
        }
    }
    obj.innerHTML = xHtml;

    let increment = numheight; //숫자영역 고정높이(숫자 1개씩 높이씩 올라가는 구조)

    let speed = 1;
    for (let i = 0; i < numArray.length; i++) {
        gsap.to(obj.querySelector(".digit" + i), {
            top: -(increment * numArray[i] * 0.1) + "rem",
            duration: speed,
            onComplete: () => {
                if ((numArray.length - 1) == i) {
                    obj.innerHTML = number;
                }
            }
        });
    }
}

//모션 관련 스크립트
export class Progress {
    constructor(el, option) {
        gsap.registerPlugin(ScrollTrigger);

        // el
        this.el = document.querySelector(el);
        this.trigger = this.el.closest('[data-js="progress__trigger"]');
        this.actionBar = this.el.querySelector('[data-js="progress__actionBar"]');
        this.accessibility = this.el.querySelector('[data-js="progress__accessibility"]');

        // option
        this.option = option;
        // init
        this.init();
    }
    init() {
        const self = this;
        // tooltip이 있다면 생성하기
        self.isTooltip() ? self.setTooltip() : null;
        // progress 세팅
        self.setProgress();
        // 애니메이션 재생
        self.startProgress();
    }
    isTooltip() {
        const self = this;
        return self.tooltipEl !== undefined ? true : false;
    }
    setTooltip() {
        const self = this;
        self.tooltipID = self.tooltipEl.getAttribute("data-uuid");

        self.tooltipClass = new Tooltip(`[data-uuid='${self.tooltipID}']`, {
            html: `${this.option.value}`,
            position: { y: -10 },
        });
    }
    setProgress() {
        const self = this;
        // 애니메이션 세팅
        gsap.set(self.actionBar, { width: `0%` });
        // [접근성] 퍼센트 value 세팅
        self.el.setAttribute("aria-valuenow", self.option.percent);
        self.accessibility.innerText = `${self.option.percent}%`;
    }
    startProgress() {
        const self = this;
        self.actionBarGsap = gsap.to(self.actionBar, {
            duration: 1,
            width: `${self.option.percent}%`,
            scrollTrigger: {
                trigger: "#contents .sec",
                start: "top 70%",
            },
            onComplete() {
                if (self.option.onComplete && typeof self.option.onComplete == "function") {
                    self.option.onComplete();
                }
            },
        });
        self.actionBarGsap.pause();
    }
}
