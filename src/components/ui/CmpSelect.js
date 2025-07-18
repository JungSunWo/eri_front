'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef(null);

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

  // 선택된 옵션의 라벨 찾기
  useEffect(() => {
    const selectedOption = options.find(option =>
      typeof option === 'object' ? option.value === value : option === value
    );
    setSelectedLabel(
      typeof selectedOption === 'object' ? selectedOption.label : selectedOption || ''
    );
  }, [value, options]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 옵션 선택 처리
  const handleOptionClick = (option) => {
    const optionValue = typeof option === 'object' ? option.value : option;
    const optionLabel = typeof option === 'object' ? option.label : option;

    onChange(optionValue);
    setSelectedLabel(optionLabel);
    setIsOpen(false);
  };

  // 키보드 네비게이션
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${wrapperClassName} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        ref={selectRef}
        className={`
          relative cursor-pointer
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${errorClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          rounded-md transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-opacity-50
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between">
          <span className={`${selectedLabel ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedLabel || placeholder}
          </span>
          <div className="flex-shrink-0 ml-2">
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* 드롭다운 옵션 */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">옵션이 없습니다</div>
            ) : (
              options.map((option, index) => {
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                const isSelected = optionValue === value;

                return (
                  <div
                    key={index}
                    className={`
                      px-3 py-2 cursor-pointer text-sm
                      ${isSelected
                        ? 'bg-blue-100 text-blue-900'
                        : 'hover:bg-gray-100 text-gray-900'
                      }
                      ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    onClick={() => !disabled && handleOptionClick(option)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {optionLabel}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default CmpSelect;
