'use client'

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import gsap from 'gsap';
import { FormattedLabel } from '../utils/utils';

export const TooltipInfo = css`
    display:flex;border-radius:0.6rem;border-radius:6px;border:1px solid var(--blue3);background:var(--blue1);padding:1.6rem 3.6rem 1.6rem 2rem;color:var(--gray9);font-size:1.4rem;font-weight:500;line-height:2.2rem;bottom:auto;
    width:calc(100vw - 4rem);left:0%;transform:translate(0%,0);
    &::after{display:none}
    .tooltip_box{width:100%;display:block;text-align:left}
    .ub_tooltip_btn{width:1.6rem;height:1.6rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ub_tooltipClose.svg) no-repeat center/100%;flex-shrink:0;margin-left:2rem;position:absolute;right:1.2rem;top:1.2rem}
    
`;

const StyledTooltip = styled.div`
    background:var(--blue7);border-radius:2rem;color:var(--white);font-size:1.3rem;font-weight:500;line-height:2rem;padding:0.6rem 1.2rem 0.4rem 1.2rem;position:absolute;width:max-content;z-index:21;
    left:50%;transform:translate(-50%,0);
    &::after{border-bottom:8px solid transparent;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid var(--blue7);content:"";display:block;left:50%;position:absolute;top:100%;transform:translateX(-50%);}

    .tooltip_box{display:inline-flex;}
    .tooltip_html{text-align:start;}
    .ub_tooltip_btn{width:1.2rem;height:1.2rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/tooltipClose.svg) no-repeat center/100%;flex-shrink:0;position:relative;top:0.3rem;margin-left:0.8rem;}

    ${props => props['data-type'] === 'info' && TooltipInfo};
`;

const StyledTooltipArea = styled.div`
    position:relative;width:auto;height:auto;min-width:auto;max-width:max-content;display:inline-block;font-size:0;z-index:1;
    ${StyledTooltip}{opacity:0;display:none;top:auto;bottom:100%;}
`;


//툴팁
const CmpTooltip = (props) => {
    const {msg, style, type} = props;

    return (

        <StyledTooltip style={style} data-type={type}>
            <div className="tooltip_box">
                <span className="tooltip_html">{FormattedLabel(msg)}</span>
            </div>
        </StyledTooltip>
    );
};

//툴팁 컨트롤
const CmpTooltipDraw = (props) => {
    const [isOn, setOn] = useState(props.showByDefault);
    const {msg, style : additionalStyle, children, position, className, DomStyle, toolitpId, type, align, pointTarget, width} = props;

    const handleToggle = (event) => {
        setOn(!isOn);
        animateTooltip(!isOn, event);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        handleToggle(event);
    };

    const animateTooltip = (show, event) => {
        const tooltip = document.querySelector(`[data-toolitpid=${toolitpId}] ${StyledTooltip}`);
    
        if (show) {
            const setPosition = document.querySelector(`[data-toolitpid=${toolitpId}]`).getBoundingClientRect();
            const scrollBodyPadding = parseInt(window.getComputedStyle(document.querySelector(".sec")).getPropertyValue("padding-left"), 10);

            //디자인 스타일 기준 값 저장
            if (type == "info"){
                gsap.set(tooltip, { left: -(setPosition.left-scrollBodyPadding) +"px" });
            }

            //버튼 기준 상단/하단 조정
            if (position == "bottom"){
                gsap.set(tooltip, {"top":"calc(100% + 5px)", "bottom":"auto"});
            }

            if (align == "left"){
                //console.log(pointTarget);
                let PointPosition   = pointTarget == undefined ? scrollBodyPadding : tooltip.closest(`.${pointTarget}`).getBoundingClientRect().left;
                let repeat          = pointTarget == undefined ? 2 : 1;
                let customWidth     = width == undefined ? "calc(100vw - 4rem)" : width;
                let WidthComparison = width == undefined ? window.innerWidth : parseInt(width, 10) * 10;

                if(WidthComparison > (window.innerWidth - scrollBodyPadding * 2)){
                    //console.log("설정한 넓이보다 화면이 작다");
                    customWidth = `calc(100vw - ${tooltip.closest(`.${pointTarget}`).getBoundingClientRect().left + scrollBodyPadding * repeat}px)`;
                }

                gsap.set(tooltip, { left: -(setPosition.left-PointPosition) +"px", width:customWidth});
            }

            if (align == "right"){
                let PointPosition   = pointTarget == undefined 
                                    ? 
                                        -(window.innerWidth - setPosition.left - setPosition.width - scrollBodyPadding)
                                    :
                                        -(window.innerWidth - setPosition.left - setPosition.width - (window.innerWidth - document.querySelector(`.${pointTarget}`).getBoundingClientRect().right));

                let customWidth     = width == undefined ? "calc(100vw - 4rem)" : width;
                if(pointTarget){
                    customWidth = `calc(100vw - ${(window.innerWidth - tooltip.closest(`.${pointTarget}`).getBoundingClientRect().right) + scrollBodyPadding}px)`;
                } 
                if(width){
                    customWidth = width;
                    if(parseInt(width, 10) * 10 > (window.innerWidth - scrollBodyPadding - (window.innerWidth - tooltip.closest(`.${pointTarget}`).getBoundingClientRect().right) )){
                        //console.log("화면보다 크다");
                        customWidth = `calc(100vw - ${(window.innerWidth - tooltip.closest(`.${pointTarget}`).getBoundingClientRect().right) + scrollBodyPadding}px)`;
                    }
                }

                gsap.set(tooltip, { left:"auto", right:`${PointPosition}px`, width:customWidth});
            }

            //툴팁 스타일 커스텀
            gsap.to(tooltip, { opacity: 1,display: "block", duration: 0.2 });
        } 
        else {
            gsap.to(tooltip, { opacity: 0, display: "none", duration: 0.2 });
        }
    };

    useEffect(()=>{
        if(isOn){
            const tooltip = document.querySelector(`[data-toolitpid=${toolitpId}] ${StyledTooltip}`);
            const setPosition = document.querySelector(`[data-toolitpid=${toolitpId}]`).getBoundingClientRect();
            const scrollBodyPadding = parseInt(window.getComputedStyle(document.querySelector(".sec")).getPropertyValue("padding-left"), 10);

            if (type == "info"){
                gsap.set(tooltip, { left: -(setPosition.left-scrollBodyPadding) +"px" });
            }

            if(position == "bottom"){
                gsap.set(tooltip, { opacity: 1, display: "block"});
            }
            else {
                gsap.set(tooltip, { opacity: 1, display: "block"});
            }
        }
    }, []);

    return (
        <StyledTooltipArea className='tooltipPop' data-position={position} style={DomStyle} data-toolitpid={toolitpId}>
            {/* <p>{isOn ? 'On' : 'Off'}</p>     */}
            {React.cloneElement(children, { onClick: handleToggle })}

            <StyledTooltip
                style={{
                    ...additionalStyle
                }}
                data-type={type}
            >
                <div className="tooltip_box">
                    <span className="tooltip_html">{FormattedLabel(msg)}</span>

                    <button type="button" className="ub_tooltip_btn" onClick={handleClose}><span className="hidden">닫기</span></button>
                </div>
            </StyledTooltip>
        </StyledTooltipArea>
    );
};


export {CmpTooltip, StyledTooltip, CmpTooltipDraw, StyledTooltipArea};

