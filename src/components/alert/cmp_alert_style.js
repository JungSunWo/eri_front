import styled, { css } from 'styled-components';

import { StyledAccordionCard } from '../contents/accordioncard/cmp_accordionCard';
import { StyledInfoBox } from '../contents/infobox/cmp_infobox';
import { StyledButton } from './../button/cmp_button';

//팝업영역
export const StyledAlertBase = css`
    display:none;position:fixed;width:100%;height:100%;left:0;top:0;background-color:rgba(33, 37, 41, 0.70);z-index:3000;
    .alertPopupContArea{position:absolute;width:calc(100% - 4rem);left:2rem;top:50%;transform:translate(0,-50%);border-radius:1.6rem;overflow:hidden;background-color:#fff;}
    .alertPopupContArea::before{content:"";display:block;width:100%;height:auto;background-color:#fff;position:absolute;left:0;top:0;z-index:0;}
    .alertPopupContArea .alertPopupClosed{position:absolute;left:0.8rem;top:0.8rem;width:4rem;height:4rem;background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_20_close.svg);background-repeat:no-repeat;background-size:2rem auto;text-indent:-9999px;background-position:center center;z-index:3;}
    .alertPopupContArea .popTitleArea{padding:5.6rem 2rem 1.1rem 2rem;background-color:var(--white);position:relative;z-index:1;}
    .alertPopupContArea .popTitleArea>p{font-size:1.8rem;line-height:2.6rem;letter-spacing:-0.2px;color:#111;text-align:center;font-weight:700;}
    .alertPopupContArea .popContArea{padding:0 2rem 3.2rem 2rem;text-align:center;font-size:1.4rem;font-weight:500;line-height:-0.1px;color:#111;word-break:keep-all;background-color:var(--white);margin-top:-0.2rem;position:relative;z-index:1;}
    .alertPopupContArea .popBtnArea{border-radius:0 0 1.6rem 1.6rem;overflow:hidden;display:flex;margin-top:-0.1rem;position:relative;z-index:1;}
    .alertPopupContArea .popBtnArea ${StyledButton}{border-radius:0;flex:1;}

    .alert_subTit{color:#6e7780;text-align:center;font-size:1.4rem;font-weight:500;line-height:2.2rem;}
    .alert_icon{height:12rem;margin:0 auto;margin-bottom:0.8rem;width:12rem;}
    .alert_iconImg{height:100%;object-fit:contain;width:100%;}
    ${StyledInfoBox}{text-align:left;margin-top:2.4rem}

    ${StyledAccordionCard}{margin-top:2.4rem}
    ${StyledAccordionCard} ${StyledInfoBox}{margin-top:0;}

    .error_callcenter{align-items:center;display:flex;justify-content:center;margin-top:1.6rem;}
    .callCenterTit{align-items:center;display:inline-flex;}
    .callCenterTit_icon{background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/callCenterTit_icon.svg) no-repeat center/100%;display:block;height:1.6rem;width:1.6rem;}
    .callCenterTit_text{color:#6e7780;font-size:1.3rem;font-weight:500;line-height:2rem;}
    .callCenterTit_tel{text-decoration:underline !important;}

    //로그아웃
    &.logoutPop .alertPopupContArea{border-radius:1.6rem 1.6rem 0 0}
    &.logoutPop .alertPopupContArea::before{display:none}
    &.logoutPop .right_icon_sliderBtn{margin-top:2rem;}

    //푸시
    .alert_content{margin-top:2.4rem;text-align:left;}
    .pushNoti{width:100%;background-color:var(--gray2);border-radius:16px;padding:0.4rem 20px;}
    .pushNoti .pushNoti_item{padding:1.8rem 0;border-bottom:1px solid var(--gray4);}
    .pushNoti .pushNoti_item:last-child{border-bottom:none;}
    .pushNoti .pushNoti_box{padding:0 0.4rem;display:flex;justify-content:flex-start;align-items:center;}
    .pushNoti .pushNoti_tit{font-size:1.3rem;font-weight:500;line-height:2rem;color:var(--gray10);}
    .pushNoti .pushNoti_switch{margin-left:auto;}

    //타임아웃
    .timeOutBoxArea{padding-top:1.6rem;}
    .timeOutBox{width:100%;background-color:#f2f5f7;border-radius:0.6rem;padding:1.4rem;}
    .timeOutBox .count{display:block;text-align:center;color:#0565f0;font-size:1.6rem;line-height:2.4rem;}


    //마케팅팝업 내용 리셋
    //마케팅 전용 팝업 html로 스타일 작업
    &.marketingPop{
        .alertPopupContArea{overflow:visible;
            &:before{background-color:transparent;}
            .popContArea{padding:0;background-color:transparent;}
        }
    }

    &.on {
        display: block !important;
    }
`;

export const StyledAlert = styled.div`
    ${StyledAlertBase}
`;
