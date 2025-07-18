'use client'
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import {StyleCommonSwitch} from './cmp_switch_style';
import {ConvertToDataAttributes} from '../utils/utils';

//스타일지정
const StyleSwitch = styled.label`
    ${StyleCommonSwitch}
`;

//컴포넌트 생성
const CmpSwitch = forwardRef((props, ref) => {
    const {size, label, styleType, customStyle, click, checked, disabled, title} = props;

    // 커스텀 스타일 속성을 data- 속성으로 변환 
    const dataAttributes = ConvertToDataAttributes(customStyle);

    const checkboxClick = (e) => {
        if(click!== undefined){
            click(e.currentTarget);
        }
    }
    return (   
        <StyleSwitch
            data-styletype={styleType}
            data-size={size}
            {...ConvertToDataAttributes(customStyle)}
            
        >
            <input type="checkbox" ref={ref} onClick={checkboxClick} title={title} defaultChecked={checked} disabled={disabled}/>
            {label && (
                <span className="base">{label}</span>
            )}
            
            {styleType === 'text' && (
                <>
                    <span className="on">on</span>
                    <span className="off">off</span>
                </>
            )}
        </StyleSwitch>
    );
});

export {CmpSwitch, StyleSwitch};
