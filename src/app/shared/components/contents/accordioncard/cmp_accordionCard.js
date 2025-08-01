'use client'

import { CmpTooltipDraw } from '@/app/shared/components/tooltip/cmp_tooltip';
import { ConvertToDataAttributes } from '@/app/shared/utils/utils';
import gsap from 'gsap';
import styled from 'styled-components';

const StyledAccordionCard = styled.div`
    border:1px solid var(--gray4);border-radius:0.6rem;box-shadow:var(--shadow2);
    margin-top: ${props => props['data-margin-top']};

    .accordionCard_head{padding:0 2rem;}
    .accordionCard_head[data-type=info]{}
    .accordionCard_head[data-type=info] .accordionCard_trigger{align-items:center;display:flex;padding:1.2rem 0;position:relative;width:100%;}
    .accordionCard_head[data-type=info] .accordion_title{align-items:center;color:var(--gray9);display:inline-flex;font-size:1.4rem;font-weight:500;line-height:2.2rem;}
    .accordionCard_head[data-type=info] .accordion_title .ic16{margin-right:0.4rem}
    .accordionCard_head[data-type=info] .accordion_icon{display:block;height:2rem;position:absolute;right:2px;top:50%;transform:translateY(-50%) rotate(-90deg);transition:transform 0.35s;width:2rem;}
    .accordionCard_head[data-type=info] .accordion_panel[hidden]{display:none;}
    .accordionCard_head[data-type=info] .accordionCard_trigger[aria-expanded=true] .accordion_icon{transform:translateY(-50%) rotate(90deg);}

    .accordionCard_trigger{align-items:center;cursor:pointer;display:flex;justify-content:space-between;width:100%;position:relative;padding-right:1.6rem;}
    .accordionCard_icon{position:absolute;right:0rem;top:0;width:100%;height:100%;z-index:0;}
    .accordionCard_icon::before{content:'';position:absolute;display:block;right:0%;top:calc(50% - 0.8rem);background:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/accordionCard_icon.svg) no-repeat center/100%;height:1.6rem;;transform:rotate(90deg);width:1.6rem;transition:transform 0.3s}
    .accordionCard_trigger[aria-expanded=true] .accordionCard_icon::before{transform:rotate(-90deg);}
    .accordionCard_trigger .accordionCard_icon[aria-expanded=true]::before{transform:rotate(-90deg);}
    .accordionCard_titBox{align-items:center;display:flex;flex-grow:1;justify-content:space-between;padding:2.4rem 0;margin-right:0.4rem;}
    .accordionCard_leftArea{align-items:center;display:inline-flex;}
    .accordionCard_leftArea>*:nth-child(n+2){margin-left:0.4rem}
    .accordionCard_tit{color:#212529;font-size:1.8rem;font-weight:700;letter-spacing:-0.02rem;line-height:2.6rem;}
    .accordionCard_subTit{color:#6e7780;font-size:1.3rem;font-weight:400;line-height:2rem;}
    .accordionCard_rightArea, .accordionCard_priceBox{align-items:center;display:inline-flex;}
    .accordionCard_price{color:#212529;font-size:1.6rem;font-weight:700;line-height:2.4rem;}
    .accordionCard_unit{color:#212529;font-size:1.6rem;font-weight:400;line-height:2.4rem;margin-left:0.2rem;}
    .accordionCard_blueValue{color:#0565f0;font-size:1.6rem;font-weight:500;line-height:2.4rem;}
    /* .accordionCard_panel{padding:0 2.4rem 2.4rem 2.4rem;display:none;overflow:hidden} */
    .accordionCard_panel{padding:0;display:none;overflow:hidden}
    .accordionCard_panel .accordionCard_panelBox{padding:0 2.4rem 2.4rem 2.4rem;}
    /* .accordionCard_panel.open{display:block} */
    .accordionCard.line .accordionCard_trigger{border-bottom:1px solid var(--gray2);}

    .accordionCard_trigger .tooltipPop .tooltipBtn + [data-type="info"]{margin-left: 2rem;width:calc(100vw - 8rem)}

    &.line .accordionCard_item{position:relative}
    &.line .accordionCard_item::after{content:"";display:block;width:calc(100% - 4.8rem);background-color:var(--gray2);height:1px;position:absolute;left:2.4rem;bottom:0}
    &.line .accordionCard_item:last-of-type::after{display:none;}

    &[data-type=info]{border:none;box-shadow:none;}
    &[data-type=info] .accordionCard_panelBox{padding:0}
    &[data-type=info] .accordionCard_head,
    &[data-type=info] .accordionCard_panel{padding:0;}

    &.topLine .accordionCard_item{position:relative;}
    &.topLine .accordionCard_item::after{content:"";display:block;position:absolute;width:100%;height:1px;background-color:var(--gray2);top:0;left:0;}

`;

const CmpAccordionCard = (props) => {
    const {id, className, children, type, customStyle, style} = props;

    return (
        <StyledAccordionCard id={id} data-type={type} className={className} {...ConvertToDataAttributes(customStyle)} style={style}>
            <ul className="accordionCard_list">
                {children}
            </ul>
        </StyledAccordionCard>
    );
};

const CmpAccordionCardTitle = (props) => {
    const {id, title, description, price, value, panelStatus, type, tooltip, tooltipIcon, toolitpId, showByDefault, position, className} = props;

     //아코디언 이벤트
    const togglePanel = (event) => {
        const parentsEl = event.currentTarget.closest('li');
        const showPanel = parentsEl.querySelector('.accordionCard_panel');

        if(!event.target.classList.contains("tooltipBtn")){
            if(showPanel.classList.contains("open")){
                event.currentTarget.setAttribute("aria-expanded", false);
                showPanel.classList.remove("open");
                gsap.to(showPanel, { height: '0px', display: 'none', duration: 0.3 });
            } else{
                let TargetScrollMove = null;
                if(type == "info"){
                    TargetScrollMove = event.currentTarget.closest(`.${StyledAccordionCard.styledComponentId}`).offsetTop - 52;
                }

                showPanel.classList.add("open");
                event.currentTarget.setAttribute("aria-expanded", true);
                gsap.set(showPanel, { height: 'auto', display: 'block' });
                gsap.from(showPanel, { height: '0px', duration: 0.3,
                    onComplete : function(){
                        if(TargetScrollMove != null){
                            gsap.to("#contents .sec", 0.2, {scrollTop : TargetScrollMove})
                        }
                    }
                });
            }
        }
    };

    return (
        <div className="accordionCard_head" data-type={type}>

            {type === 'info' ? (
                <button id={id} type="button" className="accordionCard_trigger" onClick={togglePanel} aria-expanded={`${panelStatus !== "none" ? "true" : "false"}`}>
                    <span className="accordion_title">
                        <i className="ic16 ic_16_sld_warning_gray"></i>
                        <span dangerouslySetInnerHTML={{ __html: title }} />
                    </span>
                    <span className="accordion_icon">
                        <i className="ic20 ic_arrow_20"></i>
                    </span>
                </button>
            ) : (
                <div id={id} className="accordionCard_trigger">
                    <div className="accordionCard_titBox">
                        {type === 'info2' ? (
                            <div className="accordionCard_leftArea">
                                <span className="accordionCard_tit" dangerouslySetInnerHTML={{ __html: title }} />
                                {description && <span className="accordionCard_subTit">{description}</span>}

                                {tooltip &&
                                    <CmpTooltipDraw className="box_margin" type="info" msg={tooltip} toolitpId={toolitpId} showByDefault={showByDefault} position={position}>
                                        <button type='button' className={`tooltipBtn ${tooltipIcon}`}>
                                            <i className={tooltipIcon}>툴팁 열기</i>
                                        </button>
                                    </CmpTooltipDraw>
                                }
                            </div>
                        ):(
                            <div className="accordionCard_leftArea">
                                <span className="accordionCard_tit" dangerouslySetInnerHTML={{ __html: title }} />
                                {description && <span className="accordionCard_subTit">{description}</span>}

                                {tooltip &&
                                    <CmpTooltipDraw msg={tooltip} toolitpId={toolitpId} showByDefault={showByDefault}>
                                        <button type='button' className={`tooltipBtn ${tooltipIcon}`}>
                                            <i className={tooltipIcon}>툴팁 열기</i>
                                        </button>
                                    </CmpTooltipDraw>
                                }
                            </div>
                        )}
                        <div className="accordionCard_rightArea">

                            {price &&
                                <div className="accordionCard_priceBox">
                                    <span className="accordionCard_price">{price}</span>
                                    <span className="accordionCard_unit">원</span>
                                </div>
                            }

                            {value &&
                                <span className="accordionCard_blueValue">{value}</span>
                            }
                        </div>
                    </div>
                    <i className="accordionCard_icon" role="button" onClick={togglePanel} aria-expanded={`${panelStatus !== "none" ? "true" : "false"}`}></i>
                </div>
            )}
        </div>
    );
};

const CmpAccordionCardBody = (props) => {
    const {panelStatus, children} = props;

    return (
        <div className={`accordionCard_panel ${panelStatus !== "none" ? "open" : ""}`} style={{ display: panelStatus === "none" ? "none" : "block" }}>
            <div className="accordionCard_panelBox">
                {children}
            </div>
        </div>
    );
};

const CmpAccordionCardItem = (props) => {
    const {panel, className, children} = props;
    return (
        <li className={`accordionCard_item ${className}`}>
            {children}
        </li>
    );
};


export { CmpAccordionCard, CmpAccordionCardBody, CmpAccordionCardItem, CmpAccordionCardTitle, StyledAccordionCard };
