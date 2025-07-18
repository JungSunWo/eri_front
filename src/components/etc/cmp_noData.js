'use client'

import Image from 'next/image';
import styled from 'styled-components';
import { FormattedLabel } from '../utils/utils';

const StyledNoData = styled.div`
    .errcmMsg .errcmCon{margin-top:6rem;display:flex;flex-direction:column;justify-content:center;align-items:center;}
    .errcmMsg .t14,
    .errcmMsg .t18G{text-align:center;margin-top:0.8rem;}
    .errcmMsg_subMsg{
        font-size : 1.4rem;
        font-weight : 500;
        line-height : 2.2rem;
        margin-top : 0.8rem;
    }
    &.mt0 .errcmMsg .errcmCon{margin-top: 0;}
    &.mt0 .errcmMsg .errcmCon p{font-size: 1.5rem;}


    .alertNodata{padding:8.8rem 0 3rem 0;background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_64_warning_gray.svg) no-repeat top center/6.4rem auto;margin-top:4.8rem;
        .msg{text-align:center;font-size:1.6rem;line-height:2.4rem;color:var(--gray8);}
    }
`;

const CmpNoData = (props) => {
    const {className, id, msg, img, style, subMsg, type } = props;
    return (
        <StyledNoData id={id} className={className} style={style}>
            {type == 'warning' ? (
                <div className="alertNodata">
                    <p className="msg">
                        {FormattedLabel(msg)}
                    </p>
                </div>
            ) : (
                <div className="errcmMsg">
                    <div className="errcmCon">
                        <Image src={`${process.env.NEXT_PUBLIC_PT_URL}image/contents/${img || "img_notCertificate.svg"}`} alt="" width={120} height={120} className="svgIcon" priority={true} />
                        <p className="t18G">{FormattedLabel(msg)}</p>
                        {subMsg !== undefined ? (
                            <span className='errcmMsg_subMsg'>{subMsg}</span>
                        ) : null}
                    </div>
                </div>
            )}
        </StyledNoData>
    );
};

const StyledErrorAlert = styled.div`
    width:100%;text-align:center;margin-top:5.6rem;
    >img{width:4rem;margin-bottom:1.6rem;}
    >p{font-size:1.4rem;line-height:2.2rem;letter-spacing:-0.1px;color:var(--gray7);font-weight:500;}
`;

const CmpErrorAlert = (props) => {
    const {className, id, msg, img, style} = props;
    return (
        <StyledErrorAlert id={id} className={className} style={style}>
            <Image src={`${img || `${process.env.NEXT_PUBLIC_PT_URL}/image/common/ic_sld_64_warning.svg`}`} width={40} height={40}/>
            <p>{msg}</p>
        </StyledErrorAlert>
    );
};

const StyledComplet = styled.div`
    position:relative;margin-top:2.8rem;padding-top:7.8rem;text-align:center;
    &:before{content:'';display:block;position:absolute;top:0;left:50%;width:6.4rem;height:6.4rem;background-repeat:no-repeat;background-position:0 0;background-size:6.4rem auto;transform:translateX(-50%);background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ico_completion.png)}
    b{font-size: 2.2rem;line-height:3rem;color:var(--gray10);font-weight:bold;word-break:keep-all;letter-spacing:-0.2px;font-weight:bold;display:block;}
    .t14{margin-top:1.4rem;}
`;

const CmpComplet = (props) => {
    const {className, id, msg, submsg, style} = props;
    return (
        <StyledComplet id={id} className={className} style={style}>
            <b>{FormattedLabel(msg)}</b>
            {submsg && <p className="t14">{FormattedLabel(submsg)}</p>}
        </StyledComplet>
    );
};

export { CmpComplet, CmpErrorAlert, CmpNoData, StyledComplet, StyledNoData };
