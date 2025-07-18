/**
 * @File Name      : CmpInput.js
 * @File path      : src/components/ui/CmpInput.js
 * @author         : 정선우
 * @Description    : 공통 입력 컴포넌트
 *                   - 다양한 입력 타입과 제한 패턴 지원
 *                   - 좌/우 아이콘, 라벨, 헬퍼 텍스트 지원
 *                   - 비밀번호 표시/숨김, 입력값 지우기 기능
 *                   - 에러 상태 및 필수 입력 표시 기능
 * @History        : 20250701  최초 신규
 **/

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 입력 제한 정규식 매핑
 * 각 입력 타입별로 허용되는 문자 패턴을 정의
 * 사용자가 입력할 수 있는 문자를 제한하여 데이터 정합성 보장
 */
const inputTypePatterns = {
    eng: /^[A-Za-z]*$/, // 영문만 (대소문자)
    kor: /^[가-힣]*$/, // 한글만 (완성형 한글)
    num: /^[0-9]*$/, // 숫자만 (0-9)
    engnum: /^[A-Za-z0-9]*$/, // 영문+숫자 (알파벳과 숫자 조합)
    korengnum: /^[A-Za-z가-힣0-9]*$/, // 한글+영문+숫자 (한글, 알파벳, 숫자 조합)
    all: /^.*$/, // 제한 없음 (모든 문자 허용)
};

/**
 * 공통 입력 컴포넌트
 * 다양한 입력 타입과 제한 패턴을 지원하는 통합 입력 컴포넌트
 * 텍스트, 비밀번호, 이메일 등 다양한 input 타입을 지원하며
 * 입력 제한, 아이콘, 라벨, 에러 처리 등의 기능을 제공
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.value - 입력값 (제어 컴포넌트)
 * @param {Function} props.onChange - 값 변경 이벤트 핸들러
 * @param {string} props.inputType - 입력 제한 타입 ('eng', 'kor', 'num', 'engnum', 'korengnum', 'all', 'custom')
 * @param {RegExp} props.allowedPattern - 커스텀 정규식 (inputType이 'custom'일 때 사용)
 * @param {React.ReactNode} props.leftIcon - 왼쪽 아이콘 (검색, 사용자 등)
 * @param {React.ReactNode} props.rightIcon - 오른쪽 아이콘 (달력, 화살표 등)
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.helperText - 도움말 텍스트 (입력 가이드, 에러 메시지 등)
 * @param {boolean} props.error - 에러 상태 여부 (빨간색 테두리 및 텍스트)
 * @param {boolean} props.clearable - 입력값 지우기 버튼 표시 여부
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {string} props.className - 추가 CSS 클래스 (input 태그에 적용)
 * @param {string} props.inputClassName - input 태그 CSS 클래스
 * @param {string} props.wrapperClassName - 최상위 div CSS 클래스
 * @param {Object} props.style - 인라인 스타일
 * @param {string} props.type - input 타입 (text, password, email 등)
 * @returns {JSX.Element} 입력 컴포넌트
 */
export default function CmpInput({
    value: propValue = '',
    onChange: propOnChange,
    inputType = 'all', // eng, kor, num, engnum, korengnum, all, custom
    allowedPattern, // custom 정규식 (RegExp)
    leftIcon,
    rightIcon,
    label,
    helperText,
    error = false,
    clearable = true,
    placeholder = '입력하세요',
    className = '', // input에 적용
    inputClassName = '',
    wrapperClassName = '', // 최상위 div에 적용
    style,
    type = 'text',
    ...props
}) {
    // 내부 상태 관리
    const [value, setValue] = useState(propValue);        // 입력값 상태
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김 상태

    /**
     * 외부 value prop 변경 시 내부 상태 동기화
     * 제어 컴포넌트로 사용할 때 외부에서 전달된 값과 내부 상태를 일치시킴
     */
    useEffect(() => {
        setValue(propValue ?? '');
    }, [propValue]);

    /**
     * 입력 제한 처리 (text 타입에만 적용)
     * 정규식 패턴에 따라 허용되지 않는 문자를 필터링하여 제거
     * @param {string} val - 입력된 값
     * @returns {string} 필터링된 값
     */
    const filterValue = (val) => {
        if (type !== 'text') return val; // text 타입이 아닌 경우 필터링하지 않음

        let pattern;
        if (inputType === 'custom' && allowedPattern instanceof RegExp) {
            pattern = allowedPattern; // 커스텀 정규식 사용
        } else {
            pattern = inputTypePatterns[inputType] || inputTypePatterns.all; // 미리 정의된 패턴 사용
        }

        // 한 글자씩 검사하여 허용된 문자만 남김
        return val.split('').filter((ch) => pattern.test(ch)).join('');
    };

    /**
     * 입력값 변경 처리
     * 입력 제한 적용 후 내부 상태 업데이트 및 외부 콜백 호출
     * @param {Event} e - 입력 이벤트
     */
    const handleChange = (e) => {
        let v = e.target.value;
        v = filterValue(v); // 입력 제한 적용
        setValue(v); // 내부 상태 업데이트
        if (propOnChange) propOnChange({ ...e, target: { ...e.target, value: v } }); // 외부 콜백 호출
    };

    /**
     * 입력값 지우기 처리
     * 입력값을 초기화하고 외부 콜백 호출
     */
    const handleClear = () => {
        setValue(''); // 내부 상태 초기화
        if (propOnChange) propOnChange({ target: { value: '' } }); // 외부 콜백 호출
    };

    // 기본 스타일 (로그인 직원번호 입력란 기준)
    // text 타입은 로그인 페이지 스타일, 나머지는 일반 스타일 적용
    const baseInputStyle = type === 'text'
        ? 'w-full h-12 px-4 border border-gray-300 rounded-none bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400'
        : 'w-full px-3 py-2 border border-gray-300 rounded bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400';

    // 실제 input type 결정 (비밀번호 표시/숨김 처리)
    const inputTypeFinal = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`${wrapperClassName}`} style={style}>
            {/* 라벨 영역 */}
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>} {/* 필수 입력 표시 */}
                </label>
            )}

            {/* 입력 영역 */}
            <div
                className={`flex items-center rounded-none px-3 py-1 bg-white shadow-sm transition-colors`}
            >
                {/* 왼쪽 아이콘 */}
                {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}

                {/* 입력 필드 */}
                <input
                    type={inputTypeFinal}
                    className={`${baseInputStyle} flex-1 outline-none bg-transparent rounded-none ${className} ${inputClassName}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    {...props}
                />

                {/* 비밀번호 표시/숨김 버튼 */}
                {type === 'password' && (
                    <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-gray-700"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                    >
                        {showPassword ? (
                            // 눈을 가린 아이콘 (비밀번호 숨김 상태)
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 15.477 7.113 19.5 12 19.5c1.658 0 3.237-.356 4.646-.99m3.374-2.14A10.45 10.45 0 0022.066 12c-1.292-3.477-5.179-7.5-10.066-7.5-1.07 0-2.104.144-3.09.41" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                            </svg>
                        ) : (
                            // 눈 아이콘 (비밀번호 표시 상태)
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-1.192.214-2.333.611-3.388C4.226 5.477 8.113 1.5 12 1.5c3.887 0 7.774 3.977 9.139 7.112.397 1.055.611 2.196.611 3.388s-.214 2.333-.611 3.388C19.774 18.523 15.887 22.5 12 22.5c-3.887 0-7.774-3.977-9.139-7.112A10.45 10.45 0 012.25 12z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                )}

                {/* 오른쪽 아이콘 */}
                {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}

                {/* 입력값 지우기 버튼 */}
                {clearable && value && (
                    <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-gray-700"
                        onClick={handleClear}
                        aria-label="입력 지우기"
                        tabIndex={-1}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* 도움말 텍스트 */}
            {helperText && (
                <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>{helperText}</p>
            )}
        </div>
    );
}
