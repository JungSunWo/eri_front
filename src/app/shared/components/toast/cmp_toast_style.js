import styled, { css } from 'styled-components';

//팝업영역
export const StyledToastBase = css`
    display:none;position:fixed;left:0;bottom:2rem;width:100%;transform:translate(0, 5rem);transition:transform 0.5s, opacity 0.5s;opacity:0;z-index:2001;
    &.on{display:block;transform:translate(0, 0rem);opacity:1;}
    .bottomBtnArea ~ &.on{transform:translate(0, -6.2rem);}

    .toastPopupContArea{display:flex;justify-content:space-between;width:calc(100% - 4rem);margin-left:2rem;border-radius:0.6rem;background-color:rgba(33, 37, 41, 0.70);box-shadow:var(--shadow2);padding:1.4rem 1.8rem 1.2rem 1.8rem;align-items:center;}
    .toastPopupContArea .toastText{font-size:1.4rem;color:#fff;font-weight:500;line-height:2.2rem;letter-spacing:-0.1px;text-align:left;}
    .toastPopupContArea .toastBtnArea{flex-shrink:0;-webkit-flex-shrink:0;}
    .toastPopupContArea .toastBtn{padding:0.6rem 1.2rem;vertical-align:middle;}
    .toastPopupContArea .toastBtn .base{display:inline-block;font-size:1.4rem;line-height:2.2rem;font-weight:700;letter-spacing:-0.1px;color:var(--blue4);}
    &.twoBtn .toastPopupContArea{display:block;}
    &.twoBtn .toastPopupContArea .toastBtnArea{text-align:right;margin-top:0.4rem;margin-right:-1.8rem;}
`;

export const StyledToast = styled.div`
    ${StyledToastBase}
`;
