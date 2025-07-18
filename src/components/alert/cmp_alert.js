/**
 * @File Name      : cmp_alert.js
 * @File path      : src/components/alert/cmp_alert.js
 * @author         : 정선우
 * @Description    : 알림 팝업 컴포넌트
 *                   - 모달 형태의 알림창 및 확인 다이얼로그
 *                   - 타이틀, 컨텐츠, 버튼 영역으로 구성된 구조화된 알림
 *                   - 콜센터 연락처 및 푸시 알림 설정 기능 포함
 * @History        : 20250701  최초 신규
 **/

'use client'

import { alert } from '@/common/ui_com';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CmpSwitch } from '../select/cmp_switch';
import { FormattedLabel } from '../utils/utils';
import { StyledAlert } from './cmp_alert_style';

/**
 * 알림 팝업 영역 컴포넌트
 * - 알림 팝업의 최상위 컨테이너 역할
 * - 모달 형태로 화면 중앙에 표시되는 알림 창
 * - 자식 컴포넌트들에게 ID를 전달하여 팝업 제어 기능 제공
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.id - 알림 팝업의 고유 ID
 * @param {string} props.className - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 알림 내부 컨텐츠
 * @returns {JSX.Element} 알림 팝업 영역 컴포넌트
 */
const CmpAlertArea = (props) => {
    const { id, className, children } = props;

    /**
     * 자식 컴포넌트들에게 ID를 전달하는 렌더링 함수
     * - 모든 자식 컴포넌트가 동일한 팝업 ID를 공유하도록 함
     * - 팝업 제어 시 일관된 ID 사용을 보장
     */
    const renderChildren = () => {
        return React.Children.map(props.children, (child) => {
            return React.cloneElement(child, {
                id: id,
            });
        });
    };

    const addedChildren = renderChildren;
    return (
        <StyledAlert id={id} className={className}>
            <div className="alertPopupContArea">
                <>{addedChildren()}</>
            </div>
        </StyledAlert>
    );
};

/**
 * 알림 팝업 타이틀 컴포넌트
 * - 알림 팝업의 제목과 닫기 버튼을 포함하는 헤더 영역
 * - 이미지 아이콘과 HTML 태그가 포함된 제목 텍스트 지원
 * - 닫기 버튼 숨김 옵션 및 커스텀 클릭 이벤트 지원
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.popTitle - 팝업 제목 (HTML 태그 지원)
 * @param {string} props.img - 제목 옆에 표시할 이미지 경로
 * @param {string} props.id - 팝업 ID (닫기 기능에 사용)
 * @param {boolean} props.buttonHide - 닫기 버튼 숨김 여부
 * @param {Function} props.click - 닫기 버튼 클릭 시 실행할 콜백 함수
 * @returns {JSX.Element} 알림 팝업 타이틀 컴포넌트
 */
const CmpAlertTitle = (props) => {
    const { popTitle, img, id, buttonHide, click } = props;

    /**
     * 닫기 버튼 클릭 이벤트 핸들러
     * - 팝업을 닫고 추가 콜백 함수 실행
     * @param {Event} e - 클릭 이벤트 객체
     */
    const buttonClick = (e) => {
        console.log('닫기 버튼 클릭, id:', id);
        alert.Closed("#" + id);
        if (click !== undefined) {
            click(e);
        }
    }

    /**
     * 닫기 버튼 렌더링 함수
     * - buttonHide 속성에 따라 버튼 표시/숨김 결정
     * - 접근성을 위한 aria-label 속성 포함
     */
    const drawButton = () => {
        if (buttonHide !== undefined) {
            return null;
        } else {
            return (
                <button
                    type="button"
                    className="absolute right-4 top-4 text-black text-2xl focus:outline-none z-50"
                    aria-label="닫기"
                    onClick={buttonClick}
                >
                    ×
                </button>
            );
        }
    }
    return (
        <div className="relative">
            {drawButton()}
            <div className="popTitleArea">
                {img &&
                    <div className="alert_icon">
                        <Image src={img} alt="" className="alert_iconImg" width={120} height={120} />
                    </div>
                }
                <p>{FormattedLabel(popTitle)}</p>
            </div>
        </div>
    );
};

/**
 * 알림 팝업 컨텐츠 컴포넌트
 * - 알림 팝업의 메인 컨텐츠를 담는 영역
 * - 텍스트, 이미지, 폼 요소 등 다양한 컨텐츠 지원
 * - 스크롤이 필요한 긴 컨텐츠도 적절히 처리
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - 표시할 컨텐츠
 * @returns {JSX.Element} 알림 팝업 컨텐츠 컴포넌트
 */
const CmpAlertCont = (props) => {
    const { children } = props;

    return (
        <div className="popContArea">
            {children}
        </div>
    );
};

/**
 * 알림 팝업 버튼 영역 컴포넌트
 * - 알림 팝업의 하단 버튼들을 그룹화하는 영역
 * - 확인, 취소, 기타 액션 버튼들을 배치하는 컨테이너
 * - 버튼들의 일관된 레이아웃과 스타일링 제공
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - 버튼 컴포넌트들
 * @returns {JSX.Element} 알림 팝업 버튼 영역 컴포넌트
 */
const CmpAlertBtn = (props) => {
    const { children } = props;

    return (
        <div className="popBtnArea">
            {children}
        </div>
    );
};

/**
 * 콜센터 연락처 컴포넌트
 * - 에러 발생 시 사용자가 연락할 수 있는 콜센터 정보 표시
 * - 전화번호를 클릭하면 바로 전화 연결 가능
 * - 아이콘과 함께 시각적으로 구분되는 디자인
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.title - 콜센터 제목 (예: "고객센터")
 * @param {string} props.tel - 전화번호 (tel: 링크로 연결)
 * @returns {JSX.Element} 콜센터 연락처 컴포넌트
 */
const CmpAlertCall = (props) => {
    const { title, tel } = props;

    return (
        <div className="error_callcenter">
            <div className="callCenterTit">
                <i className="callCenterTit_icon"></i>
                <span className="callCenterTit_text"> {title} <Link href={`tel:${tel}`} className="callCenterTit_tel">{tel}</Link> </span>
            </div>
        </div>
    );
};

/**
 * 푸시 알림 설정 컴포넌트
 * - 사용자의 푸시 알림 설정을 관리하는 컨테이너
 * - 여러 알림 항목들을 리스트 형태로 표시
 * - 각 항목별로 개별 스위치 토글 기능 제공
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - 푸시 알림 항목들
 * @param {Object} props.style - 추가 인라인 스타일
 * @returns {JSX.Element} 푸시 알림 설정 컴포넌트
 */
const CmpPushNoti = (props) => {
    const { children, style } = props;

    return (
        <div className="alert_content" style={style}>
            <div className="pushNoti">
                <ul className="pushNoti_list">
                    {children}
                </ul>
            </div>
        </div>
    );
};

/**
 * 푸시 알림 항목 컴포넌트
 * - 개별 푸시 알림 설정을 나타내는 리스트 아이템
 * - 제목과 스위치 토글을 포함한 설정 항목
 * - 각 항목별로 독립적인 알림 설정 가능
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.title - 알림 항목 제목
 * @param {string} props.id - 항목 고유 ID
 * @param {boolean} props.checked - 스위치 초기 상태 (체크 여부)
 * @returns {JSX.Element} 푸시 알림 항목 컴포넌트
 */
const CmpPushNotiItem = (props) => {
    const { title, id, checked } = props;

    return (
        <li className="pushNoti_item" id={id}>
            <div className="pushNoti_box">
                <span className="pushNoti_tit">{title}</span>
                <div className="pushNoti_switch">
                    <CmpSwitch size="h24" title={title} checked={checked} />
                </div>
            </div>
        </li>
    );
};

/**
 * 알림 컴포넌트들을 외부로 내보내기
 * - CmpAlertArea: 알림 팝업 영역 (최상위 컨테이너)
 * - CmpAlertTitle: 알림 팝업 타이틀 (제목 및 닫기 버튼)
 * - CmpAlertCont: 알림 팝업 컨텐츠 (메인 내용)
 * - CmpAlertBtn: 알림 팝업 버튼 영역 (액션 버튼들)
 * - CmpAlertCall: 콜센터 연락처 (전화 연결)
 * - CmpPushNoti: 푸시 알림 설정 (컨테이너)
 * - CmpPushNotiItem: 푸시 알림 항목 (개별 설정)
 */
export { CmpAlertArea, CmpAlertBtn, CmpAlertCall, CmpAlertCont, CmpAlertTitle, CmpPushNoti, CmpPushNotiItem };
