/**
 * @File Name      : cmp_toast.js
 * @File path      : src/components/toast/cmp_toast.js
 * @author         : 정선우
 * @Description    : 토스트 알림 컴포넌트
 *                   - 화면 상단에 잠깐 나타나는 알림 메시지
 *                   - 자동으로 사라지는 일시적 알림 기능
 *                   - 사용자에게 중요한 정보를 부드럽게 전달
 * @History        : 20250701  최초 신규
 **/

'use client'

import React from 'react';
import { StyledToast } from './cmp_toast_style';

/**
 * 토스트 알림 영역 컴포넌트
 * - 토스트 알림의 최상위 컨테이너 역할
 * - 화면 상단에 고정되어 표시되는 알림 영역
 * - 스타일링된 배경과 애니메이션 효과 제공
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.id - 토스트 영역의 고유 ID
 * @param {string} props.className - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 토스트 내부 컨텐츠
 * @returns {JSX.Element} 토스트 알림 영역 컴포넌트
 */
const CmpToastArea = (props) => {
    const {id, className, children} = props;
    return (
        <StyledToast id={id} className={className}>
            <div className="toastPopupContArea">
                {children}
            </div>
        </StyledToast>
    );
};

/**
 * 토스트 알림 컨텐츠 컴포넌트
 * - 토스트 알림에 표시될 메시지 텍스트를 담는 컴포넌트
 * - 알림 메시지의 스타일링과 레이아웃을 담당
 * - 사용자에게 전달할 정보를 명확하게 표시
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - 표시할 메시지 텍스트
 * @returns {JSX.Element} 토스트 알림 컨텐츠 컴포넌트
 */
const CmpToastCont = (props) => {
    const {children} = props;

    return (
        <p className="toastText">
            {children}
        </p>
    );
};

/**
 * 토스트 알림 버튼 영역 컴포넌트
 * - 토스트 알림에 포함될 버튼들을 그룹화하는 컴포넌트
 * - 확인, 취소 등의 액션 버튼을 배치하는 영역
 * - 사용자가 토스트 알림에 대한 반응을 할 수 있는 인터페이스 제공
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - 버튼 컴포넌트들
 * @returns {JSX.Element} 토스트 알림 버튼 영역 컴포넌트
 */
const CmpToastBtn = (props) => {
    const {children} = props;

    return (
        <div className="toastBtnArea">
            {children}
        </div>
    );
};

/**
 * 토스트 컴포넌트들을 외부로 내보내기
 * - CmpToastArea: 토스트 알림 영역 (최상위 컨테이너)
 * - CmpToastCont: 토스트 알림 컨텐츠 (메시지 텍스트)
 * - CmpToastBtn: 토스트 알림 버튼 영역 (액션 버튼들)
 */
export { CmpToastArea, CmpToastBtn, CmpToastCont };
