import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CmpTextarea({
  value: propValue = '',
  onChange: propOnChange,
  label,
  helperText,
  error = false,
  clearable = true,
  placeholder = '입력하세요',
  rows = 12,
  maxLength,
  leftIcon,
  rightIcon,
  className = '', // textarea에 적용
  wrapperClassName = '', // 최상위 div에 적용
  style,
  ...props
}) {
  const [value, setValue] = useState(propValue);

  useEffect(() => {
    setValue(propValue ?? '');
  }, [propValue]);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (propOnChange) propOnChange(e);
  };

  const handleClear = () => {
    setValue('');
    if (propOnChange) propOnChange({ target: { value: '' } });
  };

  // 기본 스타일 (로그인 input과 유사, rounded-none)
  const baseTextareaStyle =
    'w-full min-h-[300px] px-4 py-2 border border-gray-300 rounded-none bg-white text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 resize-none';

  return (
    <div className={`w-full ${wrapperClassName}`} style={style}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={`flex items-start border rounded-none px-3 py-1 bg-white shadow-sm transition-colors
          ${error ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-blue-500'}
        `}
      >
        {leftIcon && <span className="mr-2 mt-2 flex-shrink-0">{leftIcon}</span>}
        <textarea
          className={`${baseTextareaStyle} flex-1 outline-none bg-transparent rounded-none ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          rows={rows}
          maxLength={maxLength}
          {...props}
        />
        {rightIcon && <span className="ml-2 mt-2 flex-shrink-0">{rightIcon}</span>}
        {clearable && value && (
          <button
            type="button"
            className="ml-2 mt-2 text-gray-400 hover:text-gray-700"
            onClick={handleClear}
            aria-label="입력 지우기"
            tabIndex={-1}
          >
            <X size={18} />
          </button>
        )}
      </div>
      {helperText && (
        <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>{helperText}</p>
      )}
    </div>
  );
}
