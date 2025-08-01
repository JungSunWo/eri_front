'use client'

import React from 'react';
import styled, { css } from 'styled-components';
import { CmpSelect, StyleSelect } from '../../select/cmp_select';


export const StyledtermsBox = styled.label`
    display:flex;position:relative;width:100%;padding:2.5rem 1.6rem;min-height:7.6rem;background-color:var(--white);border:1px solid var(--gray4);border-radius:0.6rem;box-shadow:var(--shadow2);
    ${StyleSelect}{flex-shrink:0}
    .base{position:relative;display:inline-block;font-size:1.8rem;font-weight:500;line-height:2.6rem;letter-spacing:-0.2px;color:var(--gray10);z-index:1;}
    p{position:relative;z-index:1;margin-top:0.8rem;}
    .termBox_textBox{display:inline-flex;flex-direction:column;margin-left:1.2rem}
    &.accodian{padding-right:4.5rem}

    ${props => props['data-type'] === 'full' && `
        border:none;justify-content:center;align-items:cetner;
        i{content:"";position:absolute;left:0;top:0;width:100%;height:100%;display:block;background-color:var(--white);border:1px solid var(--gray4);border-radius:0.6rem;z-index:0;}\
        ${StyleSelect}{position:relative; z-index:1;}
        ${StyleSelect}:checked{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_checkmark_s26_white.svg);background-color:transparent;}
        ${StyleSelect}:checked ~ .termBox_textBox .base{color:var(--white);}
        ${StyleSelect}:checked ~ .termBox_textBox i{background-color:var(--jb-blue);border-color:var(--jb-blue);}
    `};
`;

export const CmpTermsBox = (props) => {
    const {children, id, style, className, title, description, checkType, name, type, defaultChecked, click} = props;

    return (
        <StyledtermsBox id={id} style={style} data-type={type} className={className}>
            <CmpSelect type="checkbox" styleType={checkType} name={name} defaultChecked={defaultChecked} click={click}/>
            <div className='termBox_textBox'>
                <span className="base">{title}</span><i></i>

                {description && 
                    <p className="t12 jb-blue">
                        {description}
                    </p>
                }
            </div>
        </StyledtermsBox>
    );
};

export const StyledTermsItem = styled.label`
    display:flex;position:relative;width:100%;text-align:left;
    .base{position:relative;width:100%;display:block;font-size:1.6rem;font-weight:500;color:var(--gray10);line-height:2.4rem;letter-spacing:-0.1px;padding:0rem 3rem 0rem 1.8rem;}
    .base::before{content:"";position:absolute;right:0rem;top:0.3rem;display:block;width:2rem;height:2rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_arrow_20_gray.svg) no-repeat center center/100% auto;z-index:1;transform:rotate(180deg);transition:transform 0.3s;}
    ${StyleSelect}{flex-shrink:0}
    &.myd_term_item .base{color:#6e7780;padding-left:0.8rem;font-size:1.4rem;}
    &.myd_term_item.no-arrow .base::before{display:none}
    ${props => props['data-size'] === 'small' && `
        .base{font-size:1.3rem;line-height:2rem;font-width:400;padding-left:0rem;}
    `};
`;

export const CmpTermsItem = (props) => {
    const {id, style, className, title, name, size, click} = props;

    return (
        <StyledTermsItem id={id} style={style} className={className} data-size={size}>
            <CmpSelect type="checkbox" styleType="checkmark" name={name} click={click}/>
            <span className="base">{title}</span>
        </StyledTermsItem>
    );
};

export const StyledTermsOption = styled.label`
    display:inline-block;font-size:0;
    ${StyleSelect}{vertical-align:middle;}
    .base{display:inline-block;font-size:1.2rem;line-height:2rem;font-weight:500;letter-spacing:-0.1px;color:var(--gray10);margin-left:0.2rem;vertical-align:middle;padding-top:0.2rem;}
`;

export const CmpTermsOption = (props) => {
    const {id, style, className, title, name, click} = props;

    return (
        <StyledTermsOption id={id} style={style} className={className}>
            <CmpSelect type="checkbox" styleType="checkmark" name={name} click={click}/>
            <span className="base">{title}</span>
        </StyledTermsOption>
    );
};


export const AccodianTermsArea = styled.div`
    width:100%;height:auto;display:block;background-color:var(--white);border:1px solid var(--gray4);border-radius:0.6rem;box-shadow:var(--shadow2);
    ${StyledtermsBox}{box-shadow:none;border:none;}
    /* i::before{content:"";position:absolute;right:2rem;top:2.8rem;display:block;width:2rem;height:2rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_arrow_20_gray.svg) no-repeat center center/100% auto;z-index:1;transform:rotate(90deg);transition:transform 0.3s;} */
    /* ${StyleSelect}:checked ~ i::before{transform:rotate(270deg);} */


    .termsList{padding:0 2rem 0rem 1.6rem;overflow:hidden;}
    .termsList::after{content:"";display:block;width:100%;height:2.4rem;}

    ${StyledTermsItem}:nth-of-type(n+2){margin-top:2.4rem}
    .termsOption{padding:0 1rem 0 3.8rem;margin-top:1.2rem;}

    ${StyledTermsOption}{margin-right:0.8rem}
    ${StyledTermsOption}:last-of-type{margin-right:0;}

    &.popupInner{border:none;box-shadow:none;}
    &.popupInner ${StyledtermsBox}{box-shadow:var(--shadow2);border:1px solid var(--gray4);margin-bottom:2.4rem}
`;

export const TerAccoPanel_box = styled.div`
   & > *:not(:first-child){margin-top:1.6rem}
`;

