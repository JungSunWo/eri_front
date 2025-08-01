'use client'
import { useUIStatus } from "@/app/core/slices/uiStatusStore";
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CmpButton } from '../../button/cmp_button';


const StyledBottomNavigation = styled.div`
    position:fixed;z-index:1000;
    .cmp_bottomnavigation_nav{background-color:var(--white);bottom:0;box-shadow:var(--shadow3);font-size:0;height:7.2rem;left:0;padding-bottom:1rem;position:fixed;width:100%;z-index:999;transition:bottom 0.5s;
        &.elBottom{bottom:-7.5rem;}
    }
    .cmp_bottomnavigation_dim{background-color:rgba(33, 37, 41, 0.7);display:none;height:100vh;left:0;opacity:0;position:fixed;top:0;width:100vw;}

    .cmp_bottomnavigation_element_area{column-gap:2rem;display:grid;grid-template-columns:repeat(5, 1fr);justify-content:space-between;padding:0 1.2rem;row-gap:1.6rem;transition:all 0.35s;width:100%;padding-top:0.6rem;
        .cmp_bottomnavigation_element{align-items:center;border-radius:0.8rem;display:inline-flex;flex-direction:column;height:7.2rem;justify-content:flex-start;
            &:nth-child(n+6){visibility:hidden;}
            &:disabled{background-color:var(--gray1);border:none !important;}

            .ic24{width:4.4rem;height:4.4rem;background-size:2.4rem}
            .base{position:relative;overflow:hidden;width:4.4rem;height:2rem;color:var(--gray7);display:block;font-size:1.1rem;font-weight:400;line-height:1.6rem;margin-top:0.2rem;text-align:center;
                i{width:4.4rem;font-size:inherit;font-weight:inherit;line-height:inherit;color:inherit;position:absolute;left:4.4rem;text-align:center;
                    &:nth-of-type(1){left:0;}
                }
            }

            &.on .base{color:var(--jb-blue);}
            &.on .ic_sld_24_money{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_money_blue.svg);}
            &.on .ic_sld_24_life{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_life_blue.svg);}
            &.on .ic_sld_24_shoppingbag{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_shoppingbag_blue.svg);}
            &.on .ic_sld_24_card{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_card_blue.svg);}
            &.on .ic_sld_24_menu{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_menu_blue.svg);}
            &.on .ic_sld_24_home{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_home_blue.svg);}
            &.on .ic_sld_24_stock{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_stock_blue.svg);}
            &.on .ic_sld_24_security{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_security_blue.svg);}
            &.on .ic_sld_24_health{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_health_blue.svg);}
            &.on .ic_sld_24_papermoney{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_papermoney_blue.svg);}
            &.on .ic_sld_24_wallet{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_wallet_blue.svg);}
            &.on .ic_sld_24_chatbot{background-image:url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_sld_24_chatbot_blue.svg);}

            //move아이콘
            .moveIcon{
                position:relative;width:4.4rem;height:4.4rem;border-radius:50%;overflow:hidden;background-color:var(--gray3);
                .ic24{position:absolute;left:4.4rem;top:0;width:4.4rem;height:4.4rem;flex-shrink:0;background-size:2.8rem;
                    &:nth-of-type(1){left:0;}
                }
            }
        }
    }

    .cmp_bottomnavigation_edit .cmp_bottomnavigation_element_area{font-size:0;height:auto;margin-left:-1rem;padding:0;width:calc(100% + 2rem);}
    .cmp_bottomnavigation_edit .cmp_bottomnavigation_element_area .cmp_bottomnavigation_element{border:1px dashed var(--gray5);margin:1.6rem 1rem 0 1rem;width:calc(20% - 2rem);}
    .cmp_bottomnavigation_info{position:absolute;top:-9rem;left:50%;transform:translateX(-50%);display:none;align-items:center;gap:1.6rem;flex-direction:column;opacity:0;visibility:hidden;pointer-events:none;transition:opacity 0.35s;}
    .cmp_bottomnavigation_infoText{color:var(--white);display:block;text-align:center;font-size:1.3rem;font-weight:400;line-height:2rem;}
    .cmp_bottomnavigation_infoClose{width:2.4rem;height:2.4rem;background-color:var(--white);border-radius:100%;}

    .cmp_bottomnavigation_confirm{display:none;padding:3.2rem 2rem 2rem 2rem;}
    .action_handler{background-color:transparent;display:none;height:2rem;left:0;position:absolute;top:0;width:100%;}
    .action_handler::after{background-color:var(--gray4);border-radius:10rem;content:"";display:block;height:0.4rem;left:calc(50% - 2.4rem);position:absolute;top:0.8rem;width:4.8rem;}
`;




const CmpBottomNavigation = (props) => {
    const { id, children, hide } = props;
    const CmpBottomNavigationRef = useRef(null);
    useEffect(() => {
        if (document.querySelectorAll("#CmpBottomNavigation").length == "1" && document.querySelector("#CmpBottomNavigation").style.visibility != "hidden") {
            document.querySelector("#contents .sec").style.paddingBottom = "7.2rem";
        } else {
            document.querySelector("#contents .sec").style.removeProperty("padding-bottom");
        }

        let BodyScroll = Math.ceil(document.querySelector("#contents .sec").scrollTop);
        const navScroll = () => {
            const thisScroll = Math.ceil(document.querySelector("#contents .sec").scrollTop);

            useUIStatus.setState({ ZS_scrollTop: thisScroll });

            if (document.querySelector("#CmpBottomNavigation") !== null) {

                if (thisScroll > BodyScroll) {
                    //console.log("스크롤 다운");
                    //console.log(thisScroll)
                    if (thisScroll > 100) {
                        document.querySelector("#CmpBottomNavigation .cmp_bottomnavigation_nav").classList.add("elBottom")
                        document.querySelector("#CmpBottomNavigation").setAttribute("aria-hidden", "true");
                    }
                }
                else {
                    //console.log("스크롤 업");
                    document.querySelector("#CmpBottomNavigation .cmp_bottomnavigation_nav").classList.remove("elBottom");
                    document.querySelector("#CmpBottomNavigation").setAttribute("aria-hidden", "false");
                }

                BodyScroll = thisScroll;

            }

        }

        if (CmpBottomNavigationRef.current) {
            document.querySelector("#contents .sec").addEventListener("scroll", navScroll);
        }
        return () => {
            if (CmpBottomNavigationRef.current) {
                document.querySelector("#contents .sec").removeEventListener("scroll", navScroll);
            }
        };
    });

    const getHide = () => {
        if (hide !== undefined && hide) {
            return "hidden"
        } else {
            return "visible"
        }
    }

    return (
        <StyledBottomNavigation id={id} style={{ visibility: getHide() }} ref={CmpBottomNavigationRef}>
            <div className="cmp_bottomnavigation_dim" ></div>
            <div className="cmp_bottomnavigation_nav" aria-expanded="false">
                <div className="cmp_bottomnavigation_info">
                    <span className="cmp_bottomnavigation_infoText">
                        아이콘을 끌어서<br />
                        순서를 변경할 수 있어요
                    </span>
                    <button className="cmp_bottomnavigation_infoClose">
                        <span className="hidden">메뉴 선택 팝업 닫기</span>
                    </button>
                </div>

                <button className="action_handler">
                    <span className="hidden">메뉴 선택 팝업 열기</span>
                </button>

                <div className="cmp_bottomnavigation_element_area">
                    {children}
                </div>

                <div className="cmp_bottomnavigation_confirm">
                    <CmpButton label="완료" />
                </div>
            </div>
        </StyledBottomNavigation>
    );
};

const CmpMoveIcon = () => {
    const CmpMoveIconRef = useRef(null);

    const tlRef = useRef(null);
    const isInitialized = useRef(false);

    const AddAni = () => {

        if (isInitialized.current) {
            return;
        }

        const time = 0.5;
        const items1 = document.querySelectorAll(".moveIcon .ic24");
        const items2 = document.querySelectorAll(".base .loop");

        const tl = gsap.timeline({ repeat: -1, defaults: { duration: time, ease: "power2.inOut" } });

        items1.forEach((item, index) => {
            const nextItem = items1[(index + 1) % items1.length];
            const nextText = items2[(index + 1) % items2.length];
            const currText = items2[index];

            tl.to([item, currText], {
                left: 0, duration: time,
                onStart: () => {
                    items1.forEach(el => el.setAttribute("area-hidden", "true"));
                    items2.forEach(el => el.setAttribute("area-hidden", "true"));

                    item.setAttribute("area-hidden", "false");
                    currText.setAttribute("area-hidden", "false");
                }
            })
                .to([item, currText], { left: 0, duration: 1, delay: 0.8 })
                .to([item, currText], { left: "-4.4rem", duration: time })
                .set([item, currText], { left: "4.4rem" })
                .to([nextItem, nextText], { left: 0, duration: time }, `-=${time}`);
        });

        tlRef.current = tl;
        isInitialized.current = true;
    };

    const pauseAni = () => {
        if (tlRef.current) tlRef.current.pause();
    }

    const resumeAni = () => {
        if (tlRef.current) tlRef.current.resume();
    }

    useEffect(() => {
        if (CmpMoveIconRef.current) {
            AddAni();
            resumeAni();
        }

        return () => {
            pauseAni();
        };
    });

    return (
        <>
            <div className="moveIcon" ref={CmpMoveIconRef}>
                <i className="ic24 move1"></i>
                <i className="ic24 move7"></i>
                <i className="ic24 move3"></i>
                <i className="ic24 move4"></i>
                <i className="ic24 move5"></i>
                <i className="ic24 move6"></i>
                <i className="ic24 move2"></i>
            </div>

            <span className="base">
                <i className="loop">운세</i>
                <i className="loop">앱테크</i>
                <i className="loop">맛집</i>
                <i className="loop">생활혜택</i>
                <i className="loop">건강</i>
                <i className="loop">만보기</i>
                <i className="loop">핫플</i>
            </span>
        </>
    );
};
export { CmpBottomNavigation, CmpMoveIcon };
