
/**
 * CmpRadio - 공통 라디오버튼 컴포넌트
 * props (단일):
 * - checked: boolean (필수, 제어형)
 * - onChange: (e) => void (필수)
 * - label: string (선택, 라디오 오른쪽에 표시)
 * - error: boolean (선택, 에러 스타일)
 * - helperText: string (선택, 하단 설명)
 * - disabled: boolean (선택)
 * - className: string (선택, wrapper div에 적용)
 * - inputClassName: string (선택, input에 적용)
 * - id: string (선택, 접근성)
 *
 * props (그룹):
 * - name: string (필수, 그룹명)
 * - value: string (필수, 현재 선택된 값)
 * - options: [{value, label, disabled?}]
 * - onChange: (value) => void
 * - direction: 'row' | 'col' (default: row)
 * - ...기타 단일 props
 */
export function CmpRadio({
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
  const radioId = id || `cmp-radio-${Math.random().toString(36).slice(2, 10)}`;
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={radioId} className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <input
          id={radioId}
          type="radio"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`w-5 h-5 accent-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''} ${inputClassName}`}
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

export function CmpRadioGroup({
  name,
  value,
  options = [],
  onChange,
  direction = 'row',
  error = false,
  helperText,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`flex flex-${direction} gap-4 ${className}`}>
      {options.map(opt => (
        <label key={opt.value} className={`inline-flex items-center gap-2 cursor-pointer select-none ${opt.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            disabled={opt.disabled}
            className={`w-5 h-5 accent-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''} ${inputClassName}`}
            {...props}
          />
          <span className="text-base text-gray-800">{opt.label}</span>
        </label>
      ))}
      {helperText && (
        <span className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>{helperText}</span>
      )}
    </div>
  );
}
