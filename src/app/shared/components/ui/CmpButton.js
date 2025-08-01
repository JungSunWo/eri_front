/**
 * @File Name      : CmpButton.js
 * @File path      : src/components/ui/CmpButton.js
 * @Description    : Tailwind CSS 기반 공통 버튼 컴포넌트
 *                   - 다양한 스타일 타입과 사이즈 지원
 *                   - 아이콘 및 커스텀 스타일 적용 가능
 *                   - disabled 상태 지원
 * @History        : 20250116  최초 신규
 **/

'use client'

import React from 'react';

/**
 * 버튼 스타일 타입별 클래스 정의
 */
const buttonStyles = {
  // 기본 스타일
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900',
  info: 'bg-sky-600 hover:bg-sky-700 text-white',

  // 아웃라인 스타일
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
  outlinePrimary: 'border border-blue-600 bg-white hover:bg-blue-50 text-blue-600',
  outlineSuccess: 'border border-green-600 bg-white hover:bg-green-50 text-green-600',
  outlineDanger: 'border border-red-600 bg-white hover:bg-red-50 text-red-600',

  // 텍스트 스타일
  text: 'bg-transparent hover:bg-gray-100 text-gray-700',
  textPrimary: 'bg-transparent hover:bg-blue-50 text-blue-600',
  textSuccess: 'bg-transparent hover:bg-green-50 text-green-600',
  textDanger: 'bg-transparent hover:bg-red-50 text-red-600',

  // 특수 스타일
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  link: 'bg-transparent hover:underline text-blue-600',
};

/**
 * 버튼 사이즈별 클래스 정의
 */
const buttonSizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

/**
 * 공통 버튼 컴포넌트
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - 버튼 내용
 * @param {string} props.variant - 버튼 스타일 타입 (primary, secondary, success, danger, warning, info, outline, text, ghost, link)
 * @param {string} props.size - 버튼 크기 (xs, sm, md, lg, xl)
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.className - 추가 CSS 클래스
 * @param {Function} props.onClick - 클릭 이벤트 핸들러
 * @param {string} props.type - 버튼 타입 (button, submit, reset)
 * @param {string} props.id - 버튼 ID
 * @param {string} props.name - 버튼 name 속성
 * @param {Object} props.rest - 기타 HTML 속성들
 * @returns {JSX.Element} 버튼 컴포넌트
 */
const CmpButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  id,
  name,
  ...rest
}) => {
  // 기본 클래스
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  // 스타일 클래스
  const styleClasses = buttonStyles[variant] || buttonStyles.primary;

  // 사이즈 클래스
  const sizeClasses = buttonSizes[size] || buttonSizes.md;

  // 비활성화 클래스
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  // 포커스 링 클래스
  const focusClasses = variant.startsWith('outline') || variant.startsWith('text') || variant === 'ghost' || variant === 'link'
    ? 'focus:ring-gray-500'
    : variant === 'primary'
    ? 'focus:ring-blue-500'
    : variant === 'secondary'
    ? 'focus:ring-gray-500'
    : variant === 'success'
    ? 'focus:ring-green-500'
    : variant === 'danger'
    ? 'focus:ring-red-500'
    : variant === 'warning'
    ? 'focus:ring-yellow-500'
    : variant === 'info'
    ? 'focus:ring-sky-500'
    : 'focus:ring-gray-500';

  // 전체 클래스 조합
  const combinedClasses = `${baseClasses} ${styleClasses} ${sizeClasses} ${disabledClasses} ${focusClasses} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      id={id}
      name={name}
      className={combinedClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CmpButton;
