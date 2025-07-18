'use client'

import React from 'react';
import styled, { css } from 'styled-components';
import { FormattedLabel, ConvertToDataAttributes } from './../../utils/utils';
import gsap from 'gsap';

const StyledInfoBox = styled.div`
    background:var(--gray2);border-radius:6px;padding:2rem;
    margin-top: ${props => props['data-margin-top']};
    .infoBox_title{color:var(--gray9);display:block;font-size:1.4rem;font-weight:700;line-height:2.2rem;margin-bottom:0.8rem;}
    .infoBox_item{position:relative;}
    .infoBox_item:nth-of-type(n+2){margin-top:0.8rem}
    .infoBox_item::after{background-color:var(--gray5);border-radius:100%;content:"";display:block;height:4px;left:0;position:absolute;top:0.7rem;width:4px;}
    .infoBox_item.spaceBetween {display:flex;align-items:center;justify-content:space-between;}
    .infoBox_item.spaceBetween::after{display:none;}

    .infoBox_cate{font-size:1.4rem;font-weight:500;color:var(--gray8);line-height:2.2rem}
    .infoBox_cate.small{font-size:1.3rem;font-weight:400;}
    .infoBox_value{font-size:1.4rem;font-weight:500;color:var(--gray10);line-height:2.2rem}
    .infoBox_value.small{font-size:1.3rem;font-weight:400;}

    .infoBox_list{display:flex;flex-direction:column;}
    .infoBox_text{color:var(--gray8);display:block;font-size:1.3rem;font-weight:400;line-height:2rem;padding-left:1.2rem;}

    .infoBox_toggle{align-items:center;display:flex;justify-content:center;margin-top:1.6rem;width:100%;}
    .infoBox_toggleText{color:#6e7780;font-size:1.3rem;font-weight:500;line-height:2rem;margin-right:0.8rem}
    .infoBox_toggleIcon{background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/infoToggle.svg) no-repeat center/100%;display:block;height:1.6rem;width:1.6rem;transition:all 0.3s;}
    .infoBox_toggle[aria-expanded=true] .infoBox_toggleIcon{transform:rotate(180deg);}

    //&.hide{display:none}
    &.toggle{border:1px solid #e1e3e5}
    &.toggle .infoBox_title{color:#212529;font-weight:500;margin-bottom:1.6rem;}
    .white{background-color:#fff;padding:0;overflow:hidden;margin:0;}
    .white .infoBox_list{padding:2rem;}

    &.white{background-color:#fff;padding:0;overflow:hidden;}
    &.white .infoBox_list{padding:0rem;}
    
    display:${props => props['data-display']};
`;

const CmpInfoBox = (props) => {
    const {id, className, title, children, customStyle} = props;

    const togglePanel = (event) => {
        const showPanel = event.currentTarget;
        const infoBox = showPanel.previousElementSibling; 
        
        if (infoBox) {
            if (infoBox.classList.contains("hide")) {
                infoBox.classList.remove("hide");
                showPanel.setAttribute("aria-expanded", false);
                showPanel.setAttribute("title", "상세설명 닫기");
                gsap.to(showPanel, { "margin-top": '0px', duration: 0.5 });
                gsap.to(infoBox, { height: '0px', display: 'none', duration: 0.3 });
            } else {
                infoBox.classList.add("hide");
                showPanel.setAttribute("aria-expanded", true);
                showPanel.setAttribute("title", "상세설명 열기");
                gsap.set(infoBox, { height: 'auto', display: 'block' });
                gsap.from(infoBox, { height: '0px', duration: 0.3 });
                gsap.to(showPanel, { "margin-top": '1.6rem', duration: 0.3 });
            }
        }
    };

    return (
        <StyledInfoBox id={id} className={className} {...ConvertToDataAttributes(customStyle)}>
            
            {title && <span className="infoBox_title">{FormattedLabel(title)}</span>}
            
            {className === 'toggle' ? (
                <>
                    <StyledInfoBox className='white' style={{"display" : "none"}}>
                        <ul className="infoBox_list">
                            {children}
                        </ul>
                    </StyledInfoBox>

                    <button type="button" className="infoBox_toggle" aria-expanded="false" title="상세설명 열기" onClick={togglePanel}>
                        <span className="infoBox_toggleText">상세보기</span>
                        <i className="infoBox_toggleIcon"></i>
                    </button>
                </>
            ) : className === 'gray_box' ? (
                <>
                    <div className="infoBox_area">
                        {children}
                    </div>
                </>
            ) : (
                <ul className="infoBox_list">
                    {children}
                </ul>
            )}
                
        </StyledInfoBox>

      
    );
};

const CmpInfoli = (props) => {
    const {id, className, children} = props;
    return (
        <li id={id} className={`infoBox_item ${className}`}>
            
            {className === 'spaceBetween' ? (
                <>
                    {children}
                </>
            ) : (
                <span className="infoBox_text">{children}</span>
            )}
        </li>

        
    );
};


const StyledolListCont = styled.div`
    .olListCont_list{display:flex;flex-direction:column;
        .olListCont_item{position:relative;padding-bottom:3.2rem;
            &::after{content:"";display:block;position:absolute;width:2px;height:calc(100% - 3.2rem);background-color:var(--gray4);left:1rem;top:3.2rem;z-index:0;}
            
            .olListCont_box{display:flex;align-items:center;
                .olListCont_num{width:2.4rem;height:2.4rem;flex-shrink:0;border-radius:100%;background-color:#000; display:inline-flex;align-items:center;justify-content:center;color:var(--white);font-size:1.3rem;font-weight:700;line-height:2.4rem;margin-right:0.8rem;z-index:1;position:relative}
                .olListCont_text{color:var(--gray10);font-size:1.6rem;font-weight:700;line-height:2.4rem;letter-spacing:-0.01rem;display:block;text-align:left;}
            }
            button.olListCont_box{position:relative;padding-right:2.4rem;width:100%;
                &::after{ content:"";display:block;position:absolute;width:2rem;height:2rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/accordionCard_icon.svg) no-repeat center/100%;transform:rotate(-90deg);top:calc(50% - 1rem);right:0;transition:all 0.2s;}
                &[aria-expanded=true]::after {transform:rotate(90deg); }
            }
            

            .olListCont_panel{padding-left:3.2rem;overflow:hidden;}

            &:nth-child(1) .olListCont_num { background-color: var(--content01); }
            &:nth-child(2) .olListCont_num { background-color: var(--content02); }
            &:nth-child(3) .olListCont_num { background-color: var(--content03); }
            &:nth-child(4) .olListCont_num { background-color: var(--content04); }
            &:nth-child(5) .olListCont_num { background-color: var(--content05); }
            &:nth-child(6) .olListCont_num { background-color: var(--content06); }
            &:nth-child(7) .olListCont_num { background-color: var(--content07); }
            &:nth-child(8) .olListCont_num { background-color: var(--content08); }
            &:nth-child(9) .olListCont_num { background-color: var(--content09); }
            &:nth-child(10) .olListCont_num { background-color: var(--content10); }

            &:last-of-type::after{display:none;}
            &:nth-of-type(n+2){margin-top:0.8rem;}
            /* &:last-of-type{padding-bottom:0;} */
            &.subText{padding-bottom:2.4rem;
                .olListCont_box{margin-bottom:0.8rem}
            }
        }
    }
`;

const CmpOlList = (props) =>{
    const {children, style} = props;
    return (
        <StyledolListCont style={style}>
            <ol className="olListCont_list">
                {children}
            </ol>
        </StyledolListCont>
    );
}

const CmpOlListLi = (props) =>{
    const {className, number, title, text, type} = props;

    const togglePanel = (event) => {
        const showPanel = event.currentTarget;
        const infoBox = showPanel.nextElementSibling; 

        if (infoBox) {
            if (infoBox.classList.contains("hide")) {
                infoBox.classList.remove("hide");
                showPanel.setAttribute("aria-expanded", false);
                showPanel.setAttribute("title", "상세설명 닫기");
                gsap.set(infoBox, { height: 'auto', display: 'block' });
                gsap.from(infoBox, { height: '0px', duration: 0.2 });
            } else {
                infoBox.classList.add("hide");
                showPanel.setAttribute("aria-expanded", true);
                showPanel.setAttribute("title", "상세설명 열기");
                gsap.to(infoBox, { height: '0px', display: 'none', duration: 0.2 });
            }
        }
    };


    return (
        <>  
            <li className={`olListCont_item ${text ? 'subText' : ''}`}>

                {type === 'accordion' ? (
                    <button type='button' className="olListCont_box" onClick={togglePanel}>
                        <span className="olListCont_num">{number}</span>
                        <span className="olListCont_text">{FormattedLabel(title)}</span>
                    </button>
                ) : (
                    <div className="olListCont_box">
                        <span className="olListCont_num">{number}</span>
                        <span className="olListCont_text">{FormattedLabel(title)}</span>
                    </div>
                )}
                

                {text && <div className="olListCont_panel">{FormattedLabel(text)}</div>}
            </li>
        </>
    );
}

export {CmpInfoBox, CmpInfoli, StyledInfoBox, CmpOlList, CmpOlListLi};

