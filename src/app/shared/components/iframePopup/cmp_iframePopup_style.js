import styled, { css } from 'styled-components';

//팝업영역
export const StyledIframeFullPopupBase = css`
    display:none;position:fixed;width:100%;height:100%;left:0;top:0;background-color:rgba(33, 37, 41, 0.70);z-index:2000;
    .bottomSheetContArea{position:absolute;left:0;bottom:-70%;transition:all 0.5s;width:100%;opacity:0;height:100%;}
    &.on .bottomSheetContArea{bottom:0;opacity:1}
    .innerCont{position:relative;width:100%;background-color: var(--white);padding:0 2rem;overflow:hidden;height:calc(var(--vh, 1vh) * 100);}
    .bottomSheetCont{width:100%;}
    .bottomSheetCont .innerScroll{max-height:calc(var(--vh, 1vh) * 100 - 5.2rem);overflow-y:auto;min-height:calc(var(--vh, 1vh) * 100 - 5.2rem);}

    //타이틀 영역
    .bottomSheetTitle{position:relative;width:100%;text-align:center;padding:2.1rem 2.8rem 1.8rem 2.8rem;min-height:5.2rem}
    .bottomSheetTitle>p{font-size:1.8rem;font-weight:700;line-height:2.6rem;letter-spacing:-0.2px;color:var(--gray10);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .bottomSheetTitle .bottomSheetClosed{position:absolute;left:-1.2rem;top:calc(50% - 2rem);width:4rem;height:4rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_20_close.svg);background-repeat:no-repeat;background-size:2rem auto;text-indent:-9999px;background-position:center center;}
    .bottomSheetTitle .fileDown{position:absolute;right:-1.2rem;top:calc(50% - 2rem);width:4rem;height:4rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_16_download.svg);background-repeat:no-repeat;background-size:2rem auto;text-indent:-9999px;background-position:center center;}

    .pdfView{width:100%;border:1px solid var(--gray4);margin:20px 0;border-radius:0.6rem}
`;


export const StyledIframeFullPopup = styled.div`
    ${StyledIframeFullPopupBase};

    ${props => props['data-poptype'] === 'html' && `
        .bottomSheetCont .innerScroll{padding-bottom:2rem;padding-top:2rem;}
        .bottomSheetCont .innerHtmlArea{padding:0.4rem 0 3.2rem 0;}
    `};
`;