
/**
 * CmpCheckbox - 공통 체크박스 컴포넌트
 * props:
 * - checked: boolean (필수, 제어형)
 * - onChange: (e) => void (필수)
 * - label: string (선택, 체크박스 오른쪽에 표시)
 * - error: boolean (선택, 에러 스타일)
 * - helperText: string (선택, 하단 설명)
 * - disabled: boolean (선택)
 * - className: string (선택, wrapper div에 적용)
 * - inputClassName: string (선택, input에 적용)
 * - id: string (선택, 접근성)
 */
export default function CmpCheckbox({
  checked,
  onChange,
  label,
  error = false,
  helperText,
  disabled = false,
  className = '',
  inputClassName = '',
  id,
  ...props
}) {
  const checkboxId = id || `cmp-checkbox-${Math.random().toString(36).slice(2, 10)}`;
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={checkboxId} className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`w-5 h-5 accent-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''} ${inputClassName}`}
          {...props}
        />
        {label && <span className="text-base text-gray-800">{label}</span>}
      </label>
      {helperText && (
        <span className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>{helperText}</span>
      )}
    </div>
  );
}
