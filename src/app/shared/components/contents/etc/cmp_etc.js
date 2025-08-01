'use client'

import styled, { css } from 'styled-components';

export const AnalysisIPInfoBox = styled.div`
    text-align:center;
    >div{margin-bottom:2rem}
    .t13{margin-bottom:1rem}
    .t16{margin:2rem 0 1.4rem 0}
    .t14{margin-bottom:0.2rem}
`;

/* 스마트 OTP 인증 */
export const SmartOTPArea = styled.div`
    padding-bottom:9.2rem;
    .loginOtp{margin-top:3.2rem}
    .loginOtp>.t14{margin-top:3.2rem}
    .loginOtp .loginOtp_btn{margin-top:1.6rem}
    .loginOtp .loginOtp_input{margin-top:1.6rem}
`;

export const OTPNUM = styled.div`
    padding:2.4rem 0;border-radius:0.6rem;background-color:var(--gray1);display:flex;align-items:center;justify-content:center;flex-direction:column;
    .loginOtp_NumTit{color:var(--gray8);font-size:1.4rem;font-weight:500;line-height:2.2rem;}
    .loginOtp_NumValue{color:var(--gray10);font-size:2.2rem;font-weight:700;line-height:3rem;letter-spacing:-0.02rem;}
`;


//BK앱 마케팅 센터 팝업
export const BkAppAlert = styled.div`
    .appLinkBanner{
        border-radius:2rem 2rem 0 0;
        width:100%;height:38rem;display:flex;flex-direction:column;text-align:left;padding:2.4rem;
        background:url(${process.env.NEXT_PUBLIC_PT_URL}/img/newEvent/files/20250604_0010.png) no-repeat right bottom/33.5rem auto, url(${process.env.NEXT_PUBLIC_PT_URL}/img/newEvent/files/20250604_0009.svg) no-repeat  left -0.5rem top -0.5rem, #fff;
        img{max-width:21.9rem;}
    }
    .btnOk{
        display:block;width:100%;padding:1.6rem 0;background-color:#fff;border-radius:0 0 2rem 2rem;margin-top:-0.2rem;
        .base{font-size:1.8rem;color:var(--blue5);font-weight:bold;}
    }

    .footBtn{
        margin-top:0.8rem;padding:0 1.1rem;
        display:flex;width:100%;
        justify-content:space-between;
        .nDayBtn{
            min-height:2.8rem;
            background:url(${process.env.NEXT_PUBLIC_PT_URL}/img/newEvent/files/20250604_0014.svg) no-repeat left top 0.1rem/2.8rem auto;padding-left:3.6rem;
            .base{font-size:1.8rem;font-weight:500;color:#fff;line-height:2.6rem;letter-spacing:-0.02rem;display:inline-block;}
        }
        .closedBtn{width:2.4rem;height:2.4rem;background:url(${process.env.NEXT_PUBLIC_PT_URL}/img/newEvent/files/20250604_0013.svg) no-repeat left top/2.4rem auto;}   
    }
`;

//쏙뱅크로고
export const StyledJBBankLoding = styled.div`
    height: calc(var(--vh, 1vh) * 100 - 7.2rem); background-color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 -2rem;
    .interimPage_logo { width: 7.8rem; height: 6.2rem; background: url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/interimPage_logo.svg) no-repeat center/100%; transform: translateY(-100%); }
`;

export const JBBankLoding = (props) => {
  const {id} = props;
  return (
    <StyledJBBankLoding id={id}>
      <div className="interimPage_logo"></div>
    </StyledJBBankLoding>
  )
}

