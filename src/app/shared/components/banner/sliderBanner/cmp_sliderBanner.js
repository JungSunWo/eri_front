'use client'

import { ConvertToDataAttributes } from '@/app/shared/utils/utils';
import Image from 'next/image';
import { useRef } from 'react';
import styled from 'styled-components';

// Import Swiper
import "swiper/css";
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper } from "swiper/react";

//스타일 지정
const SliderBannerArea = styled.div`
    margin-top:2.4rem;
    margin:${props => props['data-margin']};
    .bannercontrol{align-items:center;display:flex;justify-content:space-between;margin-bottom:0.8rem;}
    .bannercontrol.center{justify-content:center;}
    .cmp_indicator_dot{height:fit-content;margin-top:0;width:fit-content;}
`;

const SliderCard = styled.div`
    font-size:0;width:100%;
    .ad{align-items:center;border:1px solid #fff;border-radius:2px;color:#fff;display:inline-flex;font-size:1.2rem;font-weight:500;height:20px;justify-content:center;line-height:2rem;margin-bottom:0.8rem;padding:0 8px;width:fit-content;}
    .label{color:#fff;display:block;font-family:HGGGothicssi;font-size:1.4rem;font-weight:400;line-height:2.2rem;margin-bottom:0.2rem;}
    .text{color:#fff;display:block;font-family:HGGGothicssi;font-size:1.8rem;font-weight:400;line-height:2.6rem;}
    .bannercontrol{display:flex;font-size:0;justify-content:space-between;margin-bottom:0.8rem;width:100%;}
    .bannercontrol .cmp_indicator_dot{margin-top:0.5rem;width:auto;}
    .swiper-wrapper{box-shadow:var(--shadow2);}
    .right_icon_sliderBtn{border:1px solid #e1e3e5;border-radius:0.6rem;font-size:0;height:8rem;overflow:hidden;position:relative;text-align:left;width:100%;
        border-color:${props => props['data-bordercolor']};
        background-color:${props => props['data-backgroundcolor']};
    }


    .right_icon_sliderBtn .textSVG{left:2rem;position:absolute;top:50%;transform:translate(0, -50%);z-index:1;}
    .right_icon_sliderBtn .iconSVG{bottom:0;height:8rem;position:absolute;right:0;width:33.5rem;z-index:0;}
    .right_icon_sliderBanner_text{color:#fff;display:flex;flex-direction:column;left:2.4rem;position:absolute;top:50%;transform:translateY(-50%);z-index:1;}
    .right_icon_sliderBanner_text span{color:#fff;font-family:HGGGothicssi;font-size:14px;font-weight:400;line-height:2.2rem;display:block;letter-spacing:-0.1px;}
    .right_icon_sliderBanner_text b{color:#feb031;font-family:HGGGothicssi;font-size:14px;font-weight:400;line-height:2.2rem;display:block;letter-spacing:-0.1px;margin-top:0.2rem;}

    ${props => props['data-size'] === 'h134' && `
        .right_icon_sliderBtn{height:13.4rem;}
        .right_icon_sliderBtn .iconSVG{height:13.4rem;}
        .right_icon_sliderBanner_text b{display:inline;}
    `}

    ${props => props['data-size'] === 'h120' && `
        .right_icon_sliderBtn{height:12rem;}
        .right_icon_sliderBanner_text b{font-size:1.6rem;font-weight:bold;line-height:2.4rem}
        .right_icon_sliderBtn .iconSVG{height:12rem}
    `}


    @media (max-width: 340px){
        .right_icon_sliderBanner .right_icon_sliderBtn .textSVG{max-width:calc(100% - 5rem);}
    }
`;


// 컴포넌트 생성
const CmpSliderBanner = (props) => {

    const {id, children, customStyle} = props;

    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    //스와이프 옵션
    const SliderBannerSwiper = {
        slidesPerView: "auto",
        spaceBetween: 8,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        loop: true,
        pagination: {
            el: `#${id} .cmp_indicator_dot`,
            clickable: true,
            renderBullet: function (index, className) {
                return (
                    '<button type="button" class="' + className + '"><span class="hidden">' + (index + 1) + "번째 배너 이동</span></button>"
                );
            },
        },
    };

    const SliderBannerSwiperChange = () => {
        let SelectItem = document.querySelectorAll(`#${id} .swiper-slide`);
        let SelectDot  = document.querySelectorAll(`#${id} .cmp_indicator_dot .swiper-pagination-bullet`);

        setTimeout(() => {
            SelectItem.forEach(item => {
                item.setAttribute("aria-hidden", true);
            });

            SelectDot.forEach(item => {
                item.removeAttribute("title");
            });

            let activeItem = document.querySelector(`#${id} .swiper-slide.swiper-slide-active`)?.getAttribute("aria-hidden") ?? 'default';
            if(activeItem == "true"){
                document.querySelector(`#${id} .swiper-slide.swiper-slide-active`).setAttribute("aria-hidden", false);
            } else{
                console.log("데이터 아직 없음");
            }

            if(document.querySelector(`#${id} .cmp_indicator_dot .swiper-pagination-bullet.swiper-pagination-bullet-active`) != null){
                document.querySelector(`#${id} .cmp_indicator_dot .swiper-pagination-bullet.swiper-pagination-bullet-active`).setAttribute("title","선택됨");
            }
        }, 300);
    }

    const swiperRef = useRef(null);

    const handlePlayPause = (e) => {
        if( e.currentTarget ){
            const sliderBannerPlayBtn = e.currentTarget;
            if(sliderBannerPlayBtn.classList.contains("stop")){
                //console.log("재생");
                sliderBannerPlayBtn.classList.remove("stop", "ic_sld_16_play");
                sliderBannerPlayBtn.classList.add("ic_sld_16_stop");
                if(swiperRef.current) swiperRef.current.swiper.autoplay.start();
                sliderBannerPlayBtn.querySelector(".hidden").innerHTML = "정지";
            } else{
                //console.log("정지");
                sliderBannerPlayBtn.classList.add("stop", "ic_sld_16_play");
                sliderBannerPlayBtn.classList.remove("ic_sld_16_stop");
                if(swiperRef.current) swiperRef.current.swiper.autoplay.stop();
                sliderBannerPlayBtn.querySelector(".hidden").innerHTML = "재생";
            }
        }
    }

    return (
        <SliderBannerArea
            {...dataAttributes}
            id={id}
        >
            <div className="bannercontrol">
                <div className="cmp_indicator_dot"></div>
                <div className="right_btn">
                    {/* <button type="button" className="stopControl ic16 ic_sld_16_stop"> */}
                    <button type="button" className="stopControl ic16 ic_sld_16_stop" onClick={handlePlayPause}>
                        <span className="hidden">정지</span>
                    </button>
                </div>
            </div>
            <Swiper ref={swiperRef} pagination={true} modules={[Pagination, Autoplay]} {...SliderBannerSwiper} onSwiper={SliderBannerSwiperChange} onSlideChange={SliderBannerSwiperChange} >
                {children}
            </Swiper>
        </SliderBannerArea>
    );
};


const CmpSliderLink = (props) => {
    const {href, img, children, size, customStyle, click, type, bannertype} = props;

    // 커스텀 스타일 속성을 data- 속성으로 변환
    const dataAttributes = ConvertToDataAttributes(customStyle);

    return (
        <SliderCard
            {...dataAttributes}
            data-size={size}
            data-bannertype={bannertype}
        >
            <button type='button' className="right_icon_sliderBtn" data-type={type} onClick={click}>
                <div className="right_icon_sliderBanner_text">
                    {children}
                </div>

                {/* <!-- 배경포함 335 * 84  --> */}
                <Image src={`${img || `${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/right_icon_sliderBanner_ex2.svg`}`} width={335} height={size == "h120" ? 120 : 80} className="iconSVG" alt="" />

            </button>
        </SliderCard>
    );
};

export { CmpSliderBanner, CmpSliderLink, SliderBannerArea, SliderCard };
