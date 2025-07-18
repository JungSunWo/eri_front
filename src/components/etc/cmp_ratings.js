'use client'
import React from 'react';
import styled, { css } from 'styled-components';
import {ConvertToDataAttributes} from './../utils/utils';

//스타일지정
const StyleRatings = styled.label`
    display:inline-block;
    input.cmp_ratings_input{height:2rem;position:relative;width:2rem;}
    input.cmp_ratings_input.size24{height:2.4rem;width:2.4rem;}
    input.cmp_ratings_input::after{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_ratingsLine_24.svg);background-position:center center;background-repeat:no-repeat;background-size:100% auto;content:"";display:block;height:100%;left:0;position:absolute;top:0;width:100%;}
    input.cmp_ratings_input:checked::after{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_rating_20_on.svg);}

    ${props => props['data-styletype'] === undefined && `
        input.cmp_ratings_input:disabled::after{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_rating_20_off_dis.svg);}
        input.cmp_ratings_input:disabled:checked:before{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_rating_20_on_dis.svg);}
    `};

    ${props => props['data-size'] === '24' && `
        input.cmp_ratings_input{width:2.4rem;height:2.4rem;}
    `};

    ${props => props['data-styletype'] === 'line' && `
        input.cmp_ratings_input::after{background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_ratingsLine_24.svg);}
        input.cmp_ratings_input:checked::after {background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_ratingsLine_24_on.svg);}
    `};

    //찜하기
    ${props => props['data-styletype'] === 'liked' && `
        input.cmp_ratings_input::after{background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_dibsOn_24_off.svg);}
        input.cmp_ratings_input:checked::after {background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_dibsOn_24_on.svg);}
    `};
    ${props => props['data-styletype'] === 'likedLine' && `
        input.cmp_ratings_input::after{background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_dibsOn_24_off_line.svg);}
        input.cmp_ratings_input:checked::after {background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_dibsOn_24_on.svg);}
    `};

    //북마크
    ${props => props['data-styletype'] === 'bookmark' && `
        input.cmp_ratings_input::after{background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_bookmark2_20_off.svg);}
        input.cmp_ratings_input:checked::after {background-image: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/cmp_bookMark_24_on.svg);}
    `};
`;

const RatingsGroup = styled.div`
    display:flex;margin-left:-0.35rem;width:calc(100% + 0.7rem);font-size:0;
    ${StyleRatings}{flex:1;margin:0 0.35rem;}
`;

//컴포넌트 생성
const CmpRatings = (props) => {
    const {id, size, styleType, customStyle, disabled, ratingsClick, hide, checked, title} = props;

    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    const printInput = () =>{
        
        if(hide === undefined){
            return(<input type="checkbox" disabled={disabled} className="cmp_ratings_input" onClick={ratingsClick} defaultChecked={checked} id={id} title={title} />)
        }else{
            return null;
        }
        
    }
    return (   
        <StyleRatings
            {...dataAttributes}
            
            data-size={size}
            data-styletype={styleType}
        >   
            {printInput()}
        </StyleRatings>
    );
}

const CmpSimpleBannerRatings = (props) => {
    const {id, size, styleType, customStyle, disabled, ratingsClick, hide, checked, title} = props;

    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    const printInput = () =>{
        
        if(hide === undefined){
            return(<input type="checkbox" disabled={disabled} className="cmp_ratings_input" onChange={ratingsClick} checked={checked} id={id} title={title} />)
        }else{
            return null;
        }
        
    }
    return (   
        <StyleRatings
            {...dataAttributes}
            
            data-size={size}
            data-styletype={styleType}
        >   
            {printInput()}
        </StyleRatings>
    );
}

export {CmpRatings, StyleRatings, RatingsGroup, CmpSimpleBannerRatings};
