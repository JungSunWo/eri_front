import styled, { css } from 'styled-components';

//팝업영역
export const StyledBottomSheetsBase = css`
    display:none;position:fixed;width:100%;height:100%;left:0;top:0;
    background-color:rgba(33, 37, 41, 0.50); /* slightly lighter overlay */
    backdrop-filter: blur(4px); /* background blur */
    z-index:2000;
    .bottomSheetContArea{
        position:absolute;left:0;bottom:-100%;transition:bottom 0.4s cubic-bezier(0.4,0,0.2,1);
        width:100%;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.10);
        border-radius:2.2rem 2.2rem 0 0;
        overflow:hidden;
    }
    &.on .bottomSheetContArea{bottom:0;}
    .innerCont{
        position:relative;width:100%;background-color: var(--white);
        padding:2.4rem 2.4rem 2rem 2.4rem;
        border-radius:2.2rem 2.2rem 0 0;
        overflow:hidden;
        min-height:10rem;
    }
    .bottomSheetCont{width:100%;}
    .bottomSheetCont .innerScroll{
        max-height:calc(var(--vh, 1vh) * 80 - 6.6rem);
        overflow-y:auto;overflow-x:hidden;
    }
    .bottomSheetTitle{
        position:relative;width:100%;text-align:center;
        padding:2.2rem 2.8rem 2rem 2.8rem;
        border-bottom:1px solid var(--gray4);
        font-size:2.1rem;font-weight:800;line-height:2.8rem;letter-spacing:-0.2px;color:var(--gray10);
        background:rgba(255,255,255,0.95);
        border-radius:2.2rem 2.2rem 0 0;
        box-shadow:0 2px 8px rgba(0,0,0,0.03);
    }
    .bottomSheetTitle>p{
        font-size:2.1rem;font-weight:800;line-height:2.8rem;letter-spacing:-0.2px;color:var(--gray10);
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .bottomSheetTitle .bottomSheetClosed{
        position:absolute;left:1.2rem;top:50%;transform:translateY(-50%);
        width:3.6rem;height:3.6rem;
        background:#f5f6fa url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_20_close.svg) no-repeat center center;
        background-size:2rem auto;
        border-radius:50%;
        border:1.5px solid var(--gray3);
        box-shadow:0 2px 8px rgba(0,0,0,0.04);
        cursor:pointer;
        transition:background 0.2s,border 0.2s;
    }
    .bottomSheetTitle .bottomSheetClosed:hover,
    .bottomSheetTitle .bottomSheetClosed:focus{
        background:#e0e4ef url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_20_close.svg) no-repeat center center;
        border-color:var(--gray5);
    }
    .btnArea{display:flex;flex-direction:column;justify-content:center;align-items:center;}
    .btnArea>*:nth-child(n+2){margin-top:1rem;}
    .actionSheet_dropDown_list{
        width:100%;font-size:0;padding-bottom:1.2rem;
        display:flex;flex-direction:column;gap:1.2rem;
    }
    .actionSheet_dropDown_list .item{
        display:block;
        background:rgba(245,246,250,0.98);
        box-shadow:0 2px 8px rgba(0,0,0,0.04);
        border-radius:1.2rem;
        padding:1.6rem 2rem;
        margin:0;
        font-size:1.7rem;
        font-weight:500;
        color:var(--gray10);
        transition:box-shadow 0.18s,transform 0.18s,background 0.18s;
        cursor:pointer;
        position:relative;
    }
    .actionSheet_dropDown_list .item:hover,
    .actionSheet_dropDown_list .item:focus{
        background:var(--blue2);
        color:var(--jb-blue);
        box-shadow:0 4px 16px rgba(0,0,0,0.08);
        transform:translateY(-2px) scale(1.02);
    }
    .actionSheet_dropDown_list .item[aria-selected="true"]{
        background:var(--jb-blue);
        color:#fff;
        font-weight:700;
        box-shadow:0 6px 24px rgba(0,0,0,0.10);
    }
    .actionSheet_dropDown_list .item.disabled{
        opacity:0.5;pointer-events:none;
    }
    .actionSheet_dropDown_list .item .first_info>span{
        display:block;font-size:1.8rem;font-weight:600;color:inherit;letter-spacing:-0.2px;line-height:2.5rem;
    }
    .actionSheet_dropDown_list .item .description{
        font-size:1.35rem;font-weight:400;color:var(--gray7);letter-spacing:-0.1px;line-height:2.1rem;margin-top:0.5rem;
    }
    .actionSheet_dropDown_list .item[aria-selected="true"] .first_info>span{
        color:#fff;
    }
    .actionSheet_dropDown_list .item .errorMsg{
        position:absolute;right:2rem;top:50%;transform:translateY(-50%);font-size:1.4rem;line-height:2.2rem;font-weight:500;letter-spacing:-0.1px;color:var(--danger);}
    .actionSheet_dropDown_list .item .first_info.linkType{
        display:flex;align-items:center;gap:0.6rem;padding-right:2.2rem;position:relative;
    }
    .actionSheet_dropDown_list .item .first_info.linkType:after{
        content:'';
        display:inline-block;
        width:1.2rem;height:1.2rem;
        margin-left:0.4rem;
        background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_arrow_16_gray.svg) no-repeat center center/1.2rem auto;
        opacity:0.7;
    }
    @media (max-width: 600px) {
        .actionSheet_dropDown_list .item{
            padding:1.2rem 1.2rem;
            font-size:1.5rem;
        }
        .actionSheet_dropDown_list{
            gap:0.7rem;
        }
    }
`;

//캘린더
export const StyledBottomSheetsCalendar = css`
    .calendarArea{
        width:100%;height:auto;margin-top:2.8rem;
        background:rgba(255,255,255,0.98);
        border-radius:1.6rem;
        box-shadow:0 4px 24px rgba(0,0,0,0.08);
        padding:2rem 1.2rem 2.4rem 1.2rem;
    }
    .controlsArea{
        position:relative;width:100%;font-size:0;padding-bottom:2.8rem;border-bottom:1px solid var(--gray4);
        display:flex;align-items:center;justify-content:space-between;
    }
    .yearMonthChage{
        font-size:0;text-align:center;display:flex;align-items:center;gap:1.2rem;
    }
    .yearMonthChage button{
        width:3.2rem;height:3.2rem;border-radius:50%;background:var(--gray2);border:none;display:flex;align-items:center;justify-content:center;transition:background 0.18s;cursor:pointer;position:relative;
    }
    .yearMonthChage .prevM:before{
        content:'';display:block;width:1.2rem;height:1.2rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_arrow_16_gray.svg) no-repeat center center/1.2rem auto;transform:rotate(180deg);}
    .yearMonthChage .nextM:before{
        content:'';display:block;width:1.2rem;height:1.2rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_arrow_16_gray.svg) no-repeat center center/1.2rem auto;}
    .yearMonthChage button:disabled{opacity:0.5}
    .yearMonthChage .ic20{display:none;}
    .date{
        display:inline-block;padding:0 0.8rem;font-size:1.7rem;font-weight:700;line-height:2.4rem;letter-spacing:-0.1px;color:var(--gray10);vertical-align:middle;
    }
    .today{
        position:static;right:0;top:0;z-index:2;background-color:var(--blue2);min-height:2.8rem;width:auto;display:inline-block;padding:0.3rem 1.2rem 0 1.2rem;border-radius:0.8rem;text-align:center;transition:background-color 0.3s;font-size:1.3rem;font-weight:700;color:var(--jb-blue);margin-left:auto;
    }
    .monthArea{
        width:100%;padding:2.2rem 0 2.2rem 0;min-height:37.8rem;
        background:rgba(245,246,250,0.98);
        border-radius:1.2rem;
        box-shadow:0 2px 8px rgba(0,0,0,0.03);
    }
    thead th{
        text-align:center;font-size:1.25rem;font-weight:600;line-height:2.2rem;padding:0.6rem 0;letter-spacing:0.02em;
    }
    thead th:first-child{color:var(--danger);}
    thead th:last-child{color:#3578e5;}
    tbody td{
        font-size:0;text-align:center;padding:0.2rem;
    }
    .dayBtn{
        position:relative;display:inline-block;width:3.6rem;height:3.6rem;border-radius:50%;background:none;border:none;outline:none;transition:background 0.18s,box-shadow 0.18s,transform 0.18s;cursor:pointer;
    }
    .dayBtn .base{
        position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:inline-block;text-align:center;font-size:1.3rem;line-height:2.2rem;color:var(--gray10);letter-spacing:-0.1px;z-index:3;font-weight:500;
    }
    .dayBtn.selectDay,.dayBtn.selectToday{
        background:var(--jb-blue);
        box-shadow:0 2px 8px rgba(0,0,0,0.10);
        animation:pop 0.22s cubic-bezier(0.4,0,0.2,1);
    }
    .dayBtn.selectDay .base,.dayBtn.selectToday .base{
        color:#fff;font-weight:700;
    }
    .dayBtn.todayMark{
        border:2px solid var(--jb-blue);
        background:var(--blue2);
        animation:pop 0.22s cubic-bezier(0.4,0,0.2,1);
    }
    .dayBtn.todayMark .base{
        color:var(--jb-blue);font-weight:700;
    }
    .dayBtn:hover:not(:disabled),.dayBtn:focus:not(:disabled){
        background:var(--blue2);
        box-shadow:0 4px 16px rgba(0,0,0,0.08);
        transform:scale(1.08);
    }
    .dayBtn:disabled .base{opacity:0.4}
    .dayBtn.otherMonth .base{color:var(--gray4);}
    @keyframes pop{
        0%{transform:scale(0.7);}
        80%{transform:scale(1.12);}
        100%{transform:scale(1);}
    }
    @media (max-width: 600px) {
        .calendarArea{
            padding:1.2rem 0.2rem 1.6rem 0.2rem;
        }
        .monthArea{
            padding:1.2rem 0 1.2rem 0;
        }
        .dayBtn{
            width:2.8rem;height:2.8rem;
        }
        .dayBtn .base{
            font-size:1.1rem;
        }
    }
`;

//드롭다운
export const StyledBottomSheetsDropDown = css`
    .actionSheet_dropDown_list{width:100%;font-size:0;padding-bottom:1.2rem;}
    .actionSheet_dropDown_list .item{width:100%;position:relative;width:100%;display:block;padding:2.4rem 0 2.2rem;text-align:left;}
    .actionSheet_dropDown_list .item.disabled::before{display:none !important; }
    .actionSheet_dropDown_list .item.disabled .first_info>span{color:var(--gray5);}
    .actionSheet_dropDown_list .item.disabled .description{color:var(--gray5);}
    .actionSheet_dropDown_list .item + .item{border-top:1px solid var(--gray2);}
    .actionSheet_dropDown_list .item .first_info{font-size:0;}
    .actionSheet_dropDown_list .item .first_info>span{display:block;font-size:1.8rem;font-weight:500;color:var(--gray10);letter-spacing:-0.2px;line-height:2.6rem;}
    .actionSheet_dropDown_list .item .first_info.iconType{position:relative;padding-left:3.2rem;}
    .actionSheet_dropDown_list .item .first_info.iconType .ic24{position:absolute;left:0;top:-0.1rem}
    .actionSheet_dropDown_list .item .first_info.linkType{padding-right:3rem;display:block;width:100%;text-align:left;}
    .actionSheet_dropDown_list .item .first_info.linkType .ic16{position:absolute;right:0;top:calc(50% - 0.8rem);}
    .actionSheet_dropDown_list .item .first_info.accountType{display:flex;justify-content:space-between;padding-right:2.4rem;width:100%;}
    .actionSheet_dropDown_list .item .first_info.accountType .price{font-weight:500;color:var(--gray9);flex-shrink:0;-webkit-flex-shrink:0;padding-left:2rem;align-items:center;display:inline-flex;}
    .actionSheet_dropDown_list .item .first_info.accountType .price>i{font-weight:400;margin-left:0.4rem;}
    .actionSheet_dropDown_list .item .first_info.accountType .ic16{position:absolute;right:0;top:calc(50% - 0.8rem);}
    .actionSheet_dropDown_list .item .errorMsg{position:absolute;right:0;top:50%;transform:translate(0,-50%);font-size:1.4rem;line-height:2.2rem;font-weight:500;letter-spacing:-0.1px;color:var(--danger);}
    .actionSheet_dropDown_list .item .description{font-size:1.3rem;font-weight:400;color:var(--gray8);letter-spacing:-0.1px;line-height:2rem;}
    .actionSheet_dropDown_list .item:not(.link)[aria-selected="true"]::before{content:"";position:absolute;right:0.4rem;top:calc(50% - 1.2rem);display:block;width:2rem;height:2rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/checkmark.svg);background-size:100% auto;background-repeat:no-repeat;background-position:center center;}
`;

export const StyledBottomSheetsMainPop = css`
    .innerCont{padding:0;background-color:rgba(255,255,255,0)}
    .popBtnArea{width:100%;height:6rem;background-color:#fff;display:flex;justify-content:space-between;align-items:center;}
    .popBtnArea>button{height:6rem;width:auto;background-color:#fff;padding:0 2rem}
    .popBtnArea>button .base{font-size:1.6rem;color:#363c42;letter-spacing:0;}

    .pagNav{position:absolute;right:1.6rem;top:2rem;text-align:right;display:inline-block;font-size:0;z-index:11;}
    .pagNav .numberPage{}
    .pagNav .pageNumber{background-color:rgba(0,0,0,0.4);border-radius:1rem;overflow:hidden;padding:0rem 0.3rem;height:2rem;font-size:0;z-index:1;display:inline-block;vertical-align:middle;padding-top:0.4rem}
    .pagNav .pageNumber>p{font-size:0;display:inline-block;vertical-align:middle;}
    .pagNav .pageNumber>p>span{display:inline-block;font-size:1.1rem;line-height:1rem;color:#fff;}
    .pagNav .pageNumber>p>.cut{width:1.2rem;height:1.2rem;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/contents/prod_mall_slider_cut.png) no-repeat center center/1.2rem auto;}
    .pagNav .pageNumber button{width:1.2rem;height:1.2rem;display:inline-block;vertical-align:middle;}
    .pagNav .pageNumber button>span{display:inline-block;}
    .pagNav .pageNumber button.btn_prev{background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/contents/prod_mall_slider_prev.png) no-repeat center center/1.2rem auto}
    .pagNav .pageNumber button.btn_next{background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/contents/prod_mall_slider_next.png) no-repeat center center/1.2rem auto}
    .pagNav .btn_stop{display:inline-block;vertical-align:middle;background:rgba(0,0,0,0.4) url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/contents/icon_popStop.png) no-repeat center center/1.2rem auto;border-radius:50%;overflow:hidden;width:1.8rem;height:1.8rem;font-size:0;z-index:2;margin-left:0.4rem}
    .pagNav .btn_stop.play{background:rgba(0,0,0,0.4) url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/contents/icon_popPlay.png) no-repeat center center/1.2rem auto;}



    //팝업 샘플
    .eventPopup{width:100%;height:26.0rem;}
    .eventPopup{padding:3.6rem 2.8rem 2.4rem 2.8rem;position:relative;background:#0050c1;z-index:2;}
    .eventPopup .imgBox{position:absolute;right:0;bottom:0;width:100%;height:27rem;background-size:cover;z-index:-1;background-repeat:no-repeat;}
    .eventPopup .eventDump_txt1,
    .eventPopup .eventDump_txt2{text-align:left;}
    .eventPopup .eventDump_txt1{color:#fff;position:relative;font-family:'HGGGothicssi';font-size:1.8rem;line-height:2.6rem;letter-spacing:-0.02rem;;font-weight:800;/*text-shadow:1px 1px 3px rgba(0, 0, 0, 0.2)*/}
    .eventPopup span.ln{width:100%;display:inline-block;font-size:inherit;line-height:inherit;}
    .eventPopup .eventDump_txt2{position: relative; z-index: 1; color:#433e35; position:relative;margin-top:0.8rem;font-family:'HGGGothicssi';font-weight:900;font-size:2.8rem;line-height:3.6rem;letter-spacing:-0.02rem;}
    .eventPopup .eventDump_txt2 .ln .n2{font-size:2.8rem;line-height:3.6rem;color:#6ddcff;display:inline-block;width:100%;}
    .eventPopup .eventDump_txt2 .ln .o2{font-size:2.8rem;line-height:3.6rem;color:#fff;display:inline-block;width:100%;}
    .eventPopup .linkBtn1{background-color:#6ddcff;display:inline-block;padding:0 2rem;height:3.8rem;border-radius:1.9rem;position: relative;z-index:2;position:absolute;left:2.8rem;bottom:2.4rem}
    .eventPopup .linkBtn1 .base{color:#0050c1;font-family:'HGGGothicssi';font-size:1.6rem;line-height:3.6rem;letter-spacing:0;font-weight:600;}
`;


export const StyledBottomSheets = styled.div`
    ${StyledBottomSheetsBase};

    ${props => props['data-poptype'] === 'html' && `
        .bottomSheetCont .innerScroll{padding-bottom:2rem;padding-top:2rem;}
        .bottomSheetCont .innerHtmlArea{padding:0.4rem 0 3.2rem 0;}
    `};

    //캘린더
    ${props => props['data-poptype'] === 'calendar' && StyledBottomSheetsCalendar};
    //드롭다운
    ${props => props['data-poptype'] === 'dropDown' && StyledBottomSheetsDropDown};
    //메인팝업
    ${props => props['data-poptype'] === 'mainPop' && StyledBottomSheetsMainPop};
`;
