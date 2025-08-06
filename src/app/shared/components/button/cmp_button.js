/**
 * @File Name      : cmp_button.js
 * @File path      : src/components/button/cmp_button.js
 * @author         : 정선우
 * @Description    : 공통 버튼 컴포넌트
 *                   - 버튼과 링크 형태를 지원하는 통합 컴포넌트
 *                   - 다양한 스타일 타입과 사이즈 지원
 *                   - 아이콘 및 커스텀 스타일 적용 가능
 *                   - HTML 태그가 포함된 라벨 텍스트 지원
 * @History        : 20250701  최초 신규
 **/

'use client'

import { ConvertToDataAttributes, FormattedLabel } from '@/app/shared/utils/utils';
import styled from 'styled-components';
import { ButtondivGroupStyled, StyleCommonButton } from './cmp_button_style';

/**
 * 버튼 스타일 컴포넌트
 * disabled 속성을 지원하는 styled-components 버튼
 * 공통 스타일을 적용하고 disabled 상태에 따른 스타일 변경 지원
 */
const StyledButton = styled.button.attrs(props => ({
    disabled: props.disabled,
}))`
    ${StyleCommonButton}
`;

/**
 * 링크 스타일 컴포넌트
 * 버튼과 동일한 스타일을 적용한 a 태그
 * 버튼처럼 보이지만 실제로는 링크로 동작
 */
const StyledLink = styled.a`
    ${StyleCommonButton}
    display:flex;justify-content:center;align-items:center;
`;

/**
 * 버튼 그룹 스타일 컴포넌트
 * 여러 버튼을 그룹화할 때 사용
 * 버튼들 사이의 간격과 정렬을 일관되게 관리
 */
const ButtonGroup = styled.div`
    ${ButtondivGroupStyled}
`;

/**
 * 공통 버튼 컴포넌트
 * 버튼과 링크 형태를 모두 지원하는 통합 컴포넌트
 * 다양한 스타일과 크기를 지원하며, 아이콘과 커스텀 스타일 적용 가능
 * HTML 태그가 포함된 라벨 텍스트를 지원하여 복잡한 버튼 텍스트 표현 가능
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.label - 버튼 텍스트 (HTML 태그 지원, <br> 태그는 실제 줄바꿈으로 변환)
 * @param {boolean} props.disabled - 비활성화 여부 (true 시 클릭 불가 및 시각적 비활성화)
 * @param {string} props.href - 링크 URL (있으면 a 태그로 렌더링, 없으면 button 태그)
 * @param {string} props.styleType - 버튼 스타일 타입 (primary, secondary, danger 등)
 * @param {string} props.size - 버튼 크기 (기본값: 'h40', h32, h48 등)
 * @param {string} props.spanClassName - span 태그의 CSS 클래스 (라벨 텍스트 스타일링)
 * @param {string} props.iconName - 아이콘 클래스명 (버튼 우측에 아이콘 표시)
 * @param {Object} props.customStyle - 커스텀 스타일 객체 (data-* 속성으로 변환)
 * @param {Function} props.click - 클릭 이벤트 핸들러
 * @param {string} props.id - 버튼 ID
 * @param {string} props.name - 버튼 name 속성 (폼 제출 시 사용)
 * @param {string} props.type - 버튼 타입 (button, submit, reset, 링크일 때는 무시)
 * @param {string} props.className - 추가 CSS 클래스
 * @returns {JSX.Element} 버튼 또는 링크 컴포넌트
 */
const CmpButton = (props) => {
    const {
        label,
        disabled,
        href,
        styleType,
        size = 'h40', // default size is h40
        spanClassName,
        iconName,
        customStyle,
        click,
        id,
        name,
        type
    } = props;

    /**
     * 라벨 텍스트에서 <br> 태그를 실제 줄바꿈으로 변환
     * HTML 태그가 포함된 라벨을 안전하게 렌더링
     */
    const formattedLabel = FormattedLabel(label);

    /**
     * href가 있으면 링크, 없으면 버튼으로 렌더링
     * 동일한 스타일을 적용하되 태그만 다르게 사용
     */
    const StyledComponent = href ? StyledLink : StyledButton;
    const isButton = !href;

    return (
        <StyledComponent
            {...(isButton ? { type } : {})}
            {...(isButton ? { disabled } : {})}
            {...(href ? { href } : {})}
            {...(click ? { onClick: click } : {})}
            {...(id ? { id } : {})}
            {...(name ? { name } : {})}
            data-styletype={styleType}
            data-size={size}
            {...ConvertToDataAttributes(customStyle)}
            className={props.className}
            suppressHydrationWarning={true}
        >
            <span className={spanClassName || "base"}>
                {formattedLabel}
            </span>
            {iconName && <span className={iconName}></span>}
        </StyledComponent>
    );
};

/**
 * 컴포넌트 및 스타일 컴포넌트들을 외부로 내보내기
 * - ButtonGroup: 버튼 그룹화용 컴포넌트
 * - CmpButton: 메인 버튼 컴포넌트
 * - StyledButton: 버튼 스타일 컴포넌트 (직접 사용 가능)
 * - StyledLink: 링크 스타일 컴포넌트 (직접 사용 가능)
 */
export { ButtonGroup, StyledButton, StyledLink };
export default CmpButton;
