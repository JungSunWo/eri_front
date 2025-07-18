import { css } from 'styled-components';
import { StyledButton, StyledLink } from './cmp_button';

// 파스텔톤 컬러 변수
const pastelBlue = '#dbeafe'; // 연파랑
const pastelPurple = '#ede9fe'; // 연보라
const pastelMint = '#d1fae5'; // 연민트
const pastelYellow = '#fef9c3'; // 연노랑
const pastelPink = '#fce7f3'; // 연핑크
const pastelGray = '#f3f4f6'; // 연그레이

// styleType별 색상 스타일 추가
export const primary = css`
  background-color: #2563eb;
  .base { color: #fff; }
`;
export const success = css`
  background-color: #22c55e;
  .base { color: #fff; }
`;
export const info = css`
  background-color: #0ea5e9;
  .base { color: #fff; }
`;
export const warning = css`
  background-color: #facc15;
  .base { color: #78350f; }
`;
export const danger = css`
  background-color: #ef4444;
  .base { color: #fff; }
`;

//버튼 공통베이스 스타일
export const ButtonBaseStyles = css`
    display:inline-flex;min-height:5.2rem;background-color:${pastelPurple};border-radius:0.6rem;padding:0.3rem 1.2rem 0 1.2rem;text-align:center;justify-content:unset;flex-direction:unset;align-items:unset;transition:background-color 0.3s;font-size:0;vertical-align:middle;
    .base{display:inline-block;width:100%;font-size:1.6rem;line-height:2.4rem;font-weight:700;color:#5b21b6;letter-spacing:-0.1px;}
    &:disabled, &[disabled] {background-color: ${pastelGray};}
    &:disabled .base, &[disabled] .base {color: #a1a1aa}
`;

//그레이 테마
export const gray = css`
    background-color:${pastelGray};
    .base{color:#6b7280;}
    &:disabled, &[disabled] {background-color: ${pastelGray};}
    &:disabled .base, &[disabled] .base {color: #a1a1aa}
`;

//라이트블루 테마
export const lightblue = css`
    background-color:${pastelBlue};
    .base{color:#2563eb}
    &:disabled, &[disabled] {background-color:${pastelGray};}
    &:disabled .base, &[disabled] .base {color:#a1a1aa}
`;

//라인버튼
export const line = css`
    display: inline-block;width:auto;background-color:${pastelGray};border:1px solid #c7d2fe;
    .base{color:#6b7280}
    &:disabled, &[disabled] {background-color: ${pastelGray};border-color:#e5e7eb;}
    &:disabled .base, &[disabled] .base {color:#a1a1aa !important;}
`;

//라인블루
export const lineBlue = css`
    background-color:${pastelBlue};border:1px solid #a5b4fc;
    .base{color: #2563eb}
    &:disabled, &[disabled] {background-color:${pastelGray};border-color:#e5e7eb;}
    &:disabled .base, &[disabled] .base {color:#a1a1aa;}
`;

//라인블루
export const blueLine = css`
    background-color:var(--white);border:1px solid #5697f0;
    .base{color:#175ec7}
`;

//텍스트버튼
export const text = css`
    min-height:3.4rem;display:inline-block;background-color:rgba(255, 255, 255, 0);width:auto;padding:0.3rem 1.2rem 0 1.2rem;
    .base{font-size:1.4rem;color:var(--blue6)}
    &:disabled, &[disabled] {background-color:rgba(255, 255, 255, 0);}
    &:disabled .base, &[disabled] .base {color:var(--blue3)}
`;

//텍스트 블루 언더라인
export const textUnLine = css`
    min-height:3.4rem;display:inline-block;background-color:rgba(255, 255, 255, 0);width:auto;padding:0.6rem 0 0.8rem 0;border-bottom:1px solid var(--blue6);border-radius:0;
    .base{font-size:1.4rem;color:var(--blue6)}
    &:disabled, &[disabled] {background-color:rgba(255, 255, 255, 0);}
    &:disabled .base, &[disabled] .base {color:var(--blue3)}
`;

//텍스트 화살표버튼
export const textArrow = css`
    min-height:3.4rem;display:inline-block;background-color:rgba(255, 255, 255, 0);width:auto;padding:0.3rem 0.8rem 0 1.2rem;white-space:nowrap;
    .base{font-size:1.4rem;color:var(--gray8);font-weight:500;width:auto;vertical-align:middle;}
    .ic12 {margin: 0 0 0.3rem 0.4rem;}
    &:disabled, &[disabled]{background-color:rgba(255, 255, 255, 0);}
    &:disabled .base, &[disabled] .base {color:var(--gray4)}
`;

//검색
export const search = css`
    background-color:var(--white);border:1px solid var(--gray4);gap:0.2rem;display:flex;justify-content:center;align-items:center;
    .base{color:var(--gray8);display:inline-block;width:auto;vertical-align:middle}
`;

//소트
export const sort = css`
    width:4rem;height:2.4rem;border-radius:1.8rem;border:1px solid #e1e3e5;display:inline-flex;align-items:center;justify-content:center;background-color:#fff;padding:0;min-height:auto;
    &::after{content:"";position:relative;display:block;width:1.6rem;height:1.6rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/sortBtn.svg) no-repeat center/100%;}
    .base{position:absolute;top:0;left:0;width:1px;height:1px;margin:1px;border:none;overflow:hidden;clip:rect(0, 0, 0, 0)}
`;

//높이 28
export const h28 = css`
    min-height:2.8rem;width:auto;display:inline-block;padding:0.3rem 1.2rem 0 1.2rem;border-radius:0.4rem;
    .base{font-size:1.3rem;line-height:2rem;}
`;

//높이 40
export const h40 = css`
    min-height: 3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    .base{font-size:1.2rem;line-height:1.8rem;display:inline-block;width:auto;text-align:center;vertical-align:middle;}
`;

//높이 76
export const h76 = css`
    min-height:7.6rem;width:auto;display:inline-block;
`;

//============================================================================================================
//버튼 타입별 케이스 정의
export const StyleCommonButton = css`
    /* 기본 베이스 스타일 */
    ${ButtonBaseStyles}

    /* styleType별 색상 분기 */
    ${props => props['data-styletype'] === 'primary' && primary};
    ${props => props['data-styletype'] === 'success' && success};
    ${props => props['data-styletype'] === 'info' && info};
    ${props => props['data-styletype'] === 'warning' && warning};
    ${props => props['data-styletype'] === 'danger' && danger};

    /* 컴포넌트 type 스타일 */
    ${props => props['data-styletype'] === 'lightblue' && lightblue};
    ${props => props['data-styletype'] === 'gray' && gray};
    ${props => props['data-styletype'] === 'line' && line};
    ${props => props['data-styletype'] === 'lineBlue' && lineBlue};
    ${props => props['data-styletype'] === 'text' && text};
    ${props => props['data-styletype'] === 'textArrow' && textArrow};
    ${props => props['data-styletype'] === 'textUnLine' && textUnLine};
    ${props => props['data-styletype'] === 'search' && search};
    ${props => props['data-styletype'] === 'sort' && sort};
    ${props => props['data-styletype'] === 'blueLine' && blueLine};



    /* 컴포넌트 사이즈별 */
    ${props => props['data-size'] === 'h28' && h28};
    ${props => props['data-size'] === 'h76' && h76};
    ${props => props['data-size'] === 'h40' && h40};

    /* 가로 스타일 */
    ${props => props['data-width'] !== undefined && `
        width: ${props['data-width']};
    `}

    /* 세로 스타일 */
    ${props => props['data-height'] !== undefined && `
        min-height: ${props['data-height']};
    `}

    /* block 스타일 */
    ${props => props['data-display'] !== undefined && `
        display: ${props['data-display']};
    `}

    /* 그외 커스텀 가능한 스타일 정의 */
    background-color: ${props => props['data-backgroundcolor']};
    ${props => props['data-bordercolor'] && `border: 1px solid ${props['data-bordercolor']};`}

    .base{
        color: ${props => props['data-color']};
        font-size: ${props => props['data-fontsize']};
    }
`;

//그룹 타이별 스타일
export const ButtondivGroupStyled = css`
    display:flex;margin-left:-0.35rem;width:calc(100% + 0.7rem);font-size:0;

    /* 타입별 스타일 */
    ${props => props['data-styletype'] === 'half' && `
        ${StyledButton}, ${StyledLink}{flex:1;margin:0 0.35rem;}
    `}

    ${props => props['data-styletype'] === 'rightPoint' && `
        ${StyledButton}:nth-of-type(1){flex:inherit !important;width:5.2rem;height:5.2rem;margin:0 0.35rem;}
        ${StyledButton}:nth-of-type(2){flex:1;margin:0 0.35rem !important;}
    `}
`;
