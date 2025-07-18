import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { StyledButton } from '@/components/button/cmp_button';
import { StyledPageTitle, PageHeadline } from '@/components/title/cmp_PageTitle_style';

export const Div_Cmp_button_3btn = styled.div`
    ${StyledButton} ~ ${StyledButton} {margin-top: 1.6rem;}
`;


//하단 고정 버튼
export const BottomBtnArea = styled.div`
    align-items:center;bottom:0;display:flex;flex-direction:column;left:0;padding:2.1rem 2rem 2rem 2rem;position:fixed;right:0;z-index:20;
    background:linear-gradient(
        to bottom,
        rgba(255,255,255, 0.3) 0%,
        rgba(255,255,255, 0.7) 10%,
        rgba(255,255,255, 1) 20%,
        rgba(255,255,255, 1) 100%
    );
    ${StyledButton} ~ ${StyledButton} {margin-top: 2.4rem;}

    &.row{flex-direction:inherit;}
    &.row ${StyledButton}{flex-basis:50%;margin:0 0.5rem;flex-grow:1;}
    &.ratro-3-7 ${StyledButton}:nth-of-type(1){flex-basis:30%;}
    &.ratro-3-7 ${StyledButton}:nth-of-type(2){flex-basis:70%;}
    &.ratro-4-6 ${StyledButton}:nth-of-type(1){flex-basis:40%;}
    &.ratro-4-6 ${StyledButton}:nth-of-type(2){flex-basis:60%;}
`;
export const CmpBottomBtnArea = (props) => {
    useEffect(() => {
        // const bottomBtnArea = document.querySelector(".bottomBtnArea");
        // if (bottomBtnArea !== null) {
        //     const secEl = document.querySelector("#contents .sec");
        //     secEl.style.paddingBottom = `${bottomBtnArea.offsetHeight}px`;
        // }
    });

    const {id, className, title, children} = props;
    return (
        <BottomBtnArea id={id} className={`bottomBtnArea ${className}`}>
            {children}
        </BottomBtnArea>
    );
};

//계좌상세팝업 과목명 그룹
export const GroupProdDtlPopTitle = styled.div`
   ${StyledPageTitle}{margin-top:1.6rem;margin-bottom:3.2rem}
   ${StyledPageTitle} .pageDescription{margin-top:0.4rem;}
`;

//계좌상세 정보 항목 그룹
export const GroupProdDtl = styled.div`
    margin-bottom:3.2rem;
    ${PageHeadline}{margin-bottom:1.6rem}
    .t14{margin-top:0.8rem}
`;