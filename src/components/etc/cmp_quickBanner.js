'use client'

import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { ConvertToDataAttributes } from '../../utils/utils';
import Link from 'next/link';
import Image from 'next/image';

//스타일 지정
const StyledQuickBannerArea = styled.div`
    font-size:0;margin-top:-1rem;width:100%;
    .quickBtn{position:relative;margin-top:2.4rem;padding:0 0.8rem;text-align:center;width:25%;vertical-align:top;display:inline-block}
    .quickBtn img{display:inline-block;height:3.2rem;width:3.2rem;}
    .quickBtn .base{color:var(--gray10);display:block;font-size:1.3rem;line-height:2rem;margin-top:0.8rem;}

    .quickBtn .quickDel{position:absolute;width:1.5rem;height:1.5rem;left:calc(50% + 1rem);top:0;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_16_minus.svg) no-repeat center center/1.6rem auto}

    .innerContScroll{width:100%;}
    .innerContScroll.yScroll{width:calc(100% + 2rem);}
    .innerContScroll.yScroll .quickBtn{margin-right:1.6rem;margin-top:0;min-width:0rem;padding:1rem 0;width:auto;}
    .innerContScroll.yScroll .quickBtn > img{display:none;}
    .innerContScroll.yScroll .quickBtn .base{font-weight:500;margin-top:0;}
    &.topFix .innerContScroll{animation:topFix 0.5s forwards;background-color:var(--white);left:0;margin-top:0;padding:0 2rem;position:fixed;top:-10rem;z-index:20;}

    @media (max-width: 350px){
        .quickBtn{width:33.333%;}
    }
    @keyframes topFix {
        from {top:-10rem;}
        to {top:5.2rem;}
    }
    .quick_icon_scroll_linkBanner.edit{position:relative;font-size:0;width:100%}
    .quick_icon_scroll_linkBanner.edit div.quickBtn{position:absolute;margin-top:0;padding:1.2rem 0 1.4rem 0;border-radius:0.8rem;opacity:1 !important}
    .quick_icon_scroll_linkBanner.edit .quickBtn .vibration{animation: vibration .3s infinite;}
    .quick_icon_scroll_linkBanner.edit .quickBtn.chice{background-color:var(--gray1);border-radius:0.8rem;}


    .quick_icon_scroll_linkBanner.add div.quickBtn{margin-top:0;padding:1.2rem 0 1.4rem 0;border-radius:0.8rem;transform:inherit !important;z-index:1 !important;}
    .quick_icon_scroll_linkBanner.add div.quickBtn .quickDel{display:none;}
    @keyframes vibration {
        from {transform: rotate(2deg);}
        50% {transform: rotate(-2deg);}
        100% {transform: rotate(2deg);}
    }

    .quickMenuLine{margin:2rem 0;padding-top:2.4rem;border-top:1px solid var(--gray4);}
`;

//퀵배너 영역
const CmpQuickBannerArea = (props) => {
    useEffect(() => {
        //scroll 이벤트
        const el = document.querySelector(`.${StyledQuickBannerArea.styledComponentId}`);
        const position = el.offsetTop + el.clientHeight - 52;
        //el.style.height = el.clientHeight +"px";
        const quick_icon_scroll_linkBanner = () =>{
            const scroll = Math.ceil(document.querySelector("#contents .sec").scrollTop);
            if(position < scroll){
                el.style.height = el.clientHeight +"px";
                el.classList.add("topFix");
                el.querySelector(".innerContScroll").classList.add("yScroll");
            } 
            else{
                el.style.height = null;
                el.classList.remove("topFix");
                el.querySelector(".innerContScroll").classList.remove("yScroll");
            }
        }
        document.querySelector("#contents .sec").addEventListener("scroll", quick_icon_scroll_linkBanner);
        /*
        return () => {
            if (typeof document.querySelector("#contents .sec") !== "undefined") {
                document.querySelector("#contents .sec").removeEventListener("scroll", quick_icon_scroll_linkBanner);
            }
        };
        */
    }, []);

    const {id, children, customStyle} = props;
    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    return (
        <StyledQuickBannerArea
            // 타입
            {...dataAttributes}
            id={id}
        >
            <div className="innerContScroll">
                {children}
            </div>
        </StyledQuickBannerArea>
    );
};

//퀵배너
const CmpQuickBtn = (props) => {
    const {img, href, text, className, customStyle, itemkey, click} = props;
    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    return (
        <button type='button' className={`quickBtn ${className}`} onClick={click}>
            <Image src={`${img || `${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_vsl_32_fortune.svg`}`} alt="" width={32} height={32} priority={true} itemkey={itemkey}/>
            <span className="base">{text}</span>
        </button>      
    );
};

//퀵배너 편집
const CmpQuickChangeMode = (props) => {
    const {img, href, text, className, customStyle, value, seq, itemkey} = props;
    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    return (
        <div className={`quickBtn ${className}`} value={value} seq={seq}>
            <div className='vibration'>
                <Image src={`${img || `${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_vsl_32_fortune.svg`}`} alt="" width={32} height={32} priority={true} itemkey={itemkey}/>
                <span className="base">{text}</span>
            </div>

            <button type='button' className='quickDel'><span className='hidden'>빼기</span></button>
        </div>      
    );
};

//맞춤설정 버튼
const CmpQuickBtnEdit = (props) => {
    const {text, title, customStyle, onClick} = props;
    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    return (
        <button type="button" className="quickBtn" onClick={onClick} title={title}>
            <Image src={`${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_vsl_32_setting.svg`} alt="" width={32} height={32} priority={true} />
            <span className="base">{text}</span>
        </button>      
    );
};

export {CmpQuickBannerArea, CmpQuickBtn, CmpQuickBtnEdit, CmpQuickChangeMode, StyledQuickBannerArea};
