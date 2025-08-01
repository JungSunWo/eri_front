'use client';

const CmpSelect = ({
  value,
  onChange,
  options = [],
  placeholder = '선택하세요',
  disabled = false,
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'default', // 'default', 'outline', 'filled'
  error = false,
  required = false,
  label,
  helperText,
  wrapperClassName = '',
  children,
  ...props
}) => {

  // 사이즈별 클래스
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  // 변형별 클래스
  const variantClasses = {
    default: 'border border-gray-300 bg-white',
    outline: 'border-2 border-gray-300 bg-transparent',
    filled: 'border border-gray-300 bg-gray-50'
  };

    // 에러 상태 클래스
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className={`relative ${wrapperClassName} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => {
          // e.target.value가 존재하는지 확인
          if (e && e.target && e.target.value !== undefined) {
            // e.target.value를 직접 전달 (기존 코드와 호환)
            onChange(e.target.value);
          } else {
            // 안전한 fallback
            onChange(e);
          }
        }}
        disabled={disabled}
        className={`
          w-full
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${errorClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          rounded-md transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          text-gray-900
        `}
        {...props}
      >
        {options.length > 0 ? (
          // options prop을 사용하는 경우
          options.map((option, index) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            return (
              <option key={index} value={optionValue}>
                {optionLabel}
              </option>
            );
          })
        ) : (
          // children으로 전달된 option 태그를 사용하는 경우
          children
        )}
      </select>

      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default CmpSelect;
