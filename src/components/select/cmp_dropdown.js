'use client'
import React from 'react';
import styled, { css } from 'styled-components';
import {ConvertToDataAttributes} from '../utils/utils';

//버튼 스타일
const StyledDropDown = styled.button`
    position:relative;display:block;width:100%;height:auto;min-height:7.6rem;border-radius:0.6rem;border:1px solid var(--gray4);font-size:0;background-color:var(--white);text-align:left;padding:1.4rem 4.8rem 1.2rem 1.6rem;justify-content:unset;flex-direction:unset;align-items:unset;font-size:0;
    .guideText{display:inline-block;font-size:1.8rem;font-weight:500;line-height:2.6rem;letter-spacing:-0.2px;color:var(--gray7);padding-top:0.3rem;}
    .valData{position:relative;display:none;font-size:0;}
    .valData span{font-size:1.8rem;font-weight:500;line-height:2.6rem;color:var(--gray10);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .valData>i{position:absolute;left:0;top:0;width:2.4rem;height:2.4rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_logo_24_JB.svg);background-size:2.4rem auto; background-position:center center;}

    &.icon .valData{padding-left:3.2rem;}
    & .sub_valData{display:none;font-size:1.2rem;font-weight:400;line-height:2rem;color:var(--gray10);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    &::before{content:"";position:absolute;right:2rem;top:calc(50% - 0.8rem);display:block;width:1.6rem;height:1.6rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_dropdown_arrow.svg);background-position:center center;background-size:100% auto;transition:all 0.3s;}
    &.on{border-color:var(--blue4);}
    &.on .guideText{color:var(--jb-blue);}
    &.on::before{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_dropdown_arrow_on.svg);transform:rotate(180deg);}
    &:disabled{background-color:var(--gray1);}
    &:disabled .guideText{color:var(--gray6) !important}
    &:disabled .valData span{color:var(--gray6) !important}
    &:disabled .sub_valData{color:var(--gray6) !important}
    &.active .guideText {font-size:1.2rem;color:var(--gray8);margin-bottom:0.2rem;line-height:2rem;padding-top:0;}
    &.active .valData{display:block;}
    &.active .sub_valData{display:block;}
    &:disabled[data-status=readonly] .guideText{color:var(--gray8) !important}
    &:disabled[data-status=readonly] .valData span{color:var(--gray10) !important}
    &:disabled[data-status=readonly] .sub_valData{color:var(--gray10) !important}

    //계좌선택용
    &.account {padding:0;min-height:4.7rem;border:none;}
    &.account::before {display:none;}
    &.account .guideText {font-size:1.3rem;font-weight:400;color:var(--gray10);line-height:2rem;padding-top:0;}
    &.account .valData {display:block;margin-top:0.3rem;font-size:1.6rem;line-height:2.4rem;color:var(--gray10);}

    .realDataSet{display:none;}

    &.ub_calendar::before{top:calc(50% - 1.2rem);width:2.4rem;height:2.4rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_24_calendar.svg);transform:rotate(0) !important;}
    &.ub_calendar.on::before{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_24_calendar_on.svg);}
`;

export {StyledDropDown};
