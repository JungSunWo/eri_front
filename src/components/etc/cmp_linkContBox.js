'use client'

import React from 'react';
import styled, { css } from 'styled-components';
import { FormattedLabel } from '../../utils/utils';
import Link from 'next/link';



const StyledLinkMore = styled.div`
    margin:0.4rem 2rem 0 2rem;padding:2rem 0 2rem 0;border-top:1px solid #f2f5f7;
    .linkContBox_viewMoreBtn{display:flex;width:100%;color:#175ec7;font-size:1.3rem;font-weight:500;line-height:2rem;align-items:center;justify-content:center;}
    .linkContBox_viewMoreIcon{width:1.6rem;height:1.6rem;display:block;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_16_downarrow.svg) no-repeat center/100%;margin-left:0.8rem}
    .linkContBox_viewMoreBtn[aria-expanded=true] .linkContBox_viewMoreIcon{transform:rotate(180deg);}
`;

const StyledLinkContBox = styled.div`
    background:var(--white);border:1px solid var(--gray4);border-radius:0.6rem;box-shadow:var(--shadow2);

    .linkContBox_link{display:block;width:100%;}
    .linkContBox_item{position:relative;}
    .linkContBox_item:last-child .linkContBox_head::after{display:none;}
    .linkContBox_head{align-items:center;display:flex;justify-content:space-between;margin:0 2rem;padding:2rem 0;padding-right:2rem;position:relative;}
    .linkContBox_head::after{background:var(--gray2);bottom:0;content:"";display:block;height:1px;left:0;position:absolute;width:100%;}
    .linkContBox_icon{align-items:center;display:inline-flex;height:1.6rem;justify-content:center;position:absolute;right:0;top:48%;transform:translateY(-50%);width:1.6rem;}
    .linkContBox_tit{color:var(--gray10);font-size:1.6rem;font-weight:500;line-height:1.25;}
    .linkContBox_point{color:var(--jb-blue);font-size:1.6rem;font-weight:500;line-height:2.4rem;}

    ${props => props['data-type'] === 'full' && `
        border:none;border-radius:0;box-shadow:none;
    `};

    ${props => props['data-type'] === 'type2' && `
        .linkContBox_box{margin:0 2rem;}
        .linkContBox_head{margin:0;}
    `};

    .linkContBox_body{padding: 2rem 0;}
    .linkContValues_list{display:flex;flex-direction:column;}
    .linkContValues_list>*:nth-of-type(n+2){margin-top:1rem;}
    .linkContValues_box{align-items:center;display:flex;justify-content:space-between;}
    .linkContValues_tit{color:var(--gray8);font-size:1.4rem;font-weight:500;line-height:2.2rem;}
    .linkContValues_value{color:var(--jb-blue);font-size:1.4rem;font-weight:500;line-height:2.2rem;}

    .contLink_list{display:flex;flex-direction:column;padding-bottom:2rem;}
    .contLink_list .linkContBox_item:nth-of-type(n+2){margin-top:1.6rem}
    .contLink_box{display:flex;align-items:center;justify-content:space-between;}    
    .contLink_titBox{display:inline-flex;flex-direction:column;text-align:left;}
    .contLink_tit{color:#6e7780;font-size:1.4rem;font-weight:500;line-height:2.2rem;}
    .contLink_tit.bold{color:#212529;}
    .contLink_amountBox{display:inline-flex;color:#212529;margin-top:0.2rem;}
    .contLink_amountBox.blue{color:#0565f0;}
    .contLink_amount{font-size:1.6rem;font-weight:700;line-height:2.4rem;}
    .contLink_unit{font-size:1.6rem;font-weight:400;line-height:2.4rem;margin-left:0.2rem;}
    .contLink_rights{display:inline-flex;align-items:center;}
    .contLink_percent{color:#0565f0;font-size:1.4rem;font-weight:500;line-height:2.2rem;margin-right:0.3rem;}
    .contLink_rightInfos{color:#8c959f;text-align:right;font-size:1.3rem;font-weight:400;line-height:2rem;}
`;

const CmpLinkContBox = (props) => {
    const {type, children, style, className} = props;

    return (
        <StyledLinkContBox data-type={type}>
            { type === "type2" ? (
                <div className={`${className ? className : ''} linkContBox_box type2`} style={style}>
                    {children}
                </div>
            ) : (
                <ul className={`${className ? className : ''} linkContBox_list`} style={style}>
                    {children}
                </ul>
            )}
        </StyledLinkContBox>
    );
};

const CmpLinkContBoxLi = (props) => {
    const {title, data, href, type, cardName, cardInfo, percent, click, dataValue} = props;

    const liClick = () => {
        click(dataValue);
    }
    return (
        <li className="linkContBox_item" onClick={liClick}>
            <div className="linkContBox_box">
                <button type='button' className="linkContBox_link">
                    {type === 'cardDtl' ? (
                        <div className="contLink_box">
                            <div className="contLink_titBox">
                                <span className="contLink_tit bold">{title}</span>
                                <div className="contLink_amountBox blue">
                                    <span className="contLink_amount">{data}</span>
                                    <span className="contLink_unit">원</span>
                                </div>
                                <span className="contLink_tit">{cardName}</span>
                            </div>
                            <div className="contLink_rights">
                                <div className="contLink_rightInfos">
                                    {FormattedLabel(cardInfo)}
                                </div>
                            </div>
                        </div>
                    ) : type === 'multiLink' ? (
                            <div className="contLink_box">
                                <div className="contLink_titBox">
                                    <span className="contLink_tit">{title}</span>
                                    {data && 
                                        <div className="contLink_amountBox">
                                            <span className="contLink_amount">{data}</span>
                                            <span className="contLink_unit">원</span>
                                        </div>
                                    }
                            </div>
                            <div className="contLink_rights">
                                <span className="contLink_percent">{percent}</span>
                                <i className="ic16 ic_line_16_forwardarrow"></i>
                            </div>
                        </div>
                    ) : (
                        <div className="linkContBox_head">
                            <span className="linkContBox_tit">{title}</span>
                            {data && <span className="linkContBox_point">{data}</span>}
                            <span className="linkContBox_icon">
                                <i className="ic16 ic_line_16_forwardarrow"></i>
                            </span>
                        </div>
                    )}
                </button>
            </div>
        </li>
    );
};


const CmpLinkContBoxHead = (props) => {
    const {title, data, href, click, dataValue} = props;

    const divClick = () => {
        click(dataValue);
    }
    
    return (
        <button type='button' className="linkContBox_link">
            <div className="linkContBox_head" onClick={divClick}>
                <span className="linkContBox_tit">{title}</span>
                <span className="linkContBox_icon">
                    <i className="ic16 ic_line_16_forwardarrow"></i>
                </span>
            </div>
        </button>
    );
};

const CmpLinkContBoxBody = (props) => {
    const {children} = props;
    return (
        <div className="linkContBox_body">
            <div className="linkContValues">
                <ul className="linkContValues_list">
                    {children}
                </ul>
            </div>
        </div>
    );
};

const CmpLinkContValuesItem = (props) => {
    const {title, data} = props;
    return (
        <li className="linkContValues_item">
            <div className="linkContValues_box">
                <span className="linkContValues_tit">{title}</span>
                <span className="linkContValues_value">{data}</span>
            </div>
        </li>
    );
};

const CmpLinkContMoreBtn = (props) => {
    const {msg, className, onClick, style} = props;
    return (
        <StyledLinkMore className={`${className ? className : ''} linkContBox_viewMore`} style={style}>
            <button type="button" className="linkContBox_viewMoreBtn" aria-expanded="false" onClick={onClick}>
                <span className="linkContBox_viewMoreBtnText">
                    {msg}
                </span>
                <i className="linkContBox_viewMoreIcon"></i>
            </button>
        </StyledLinkMore>
    );
};



export {CmpLinkContBox, StyledLinkContBox, CmpLinkContBoxLi, CmpLinkContBoxHead, CmpLinkContBoxBody, CmpLinkContValuesItem, CmpLinkContMoreBtn};

