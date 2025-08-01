'use client';

import { useEffect, useState } from 'react';

/**
 * 직원ID와 직원명을 받아서 표시하는 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.empId - 직원ID
 * @param {string} props.empName - 직원명 (백엔드에서 받은 값)
 * @param {string} props.fallback - 직원명이 없을 때 표시할 텍스트 (기본값: 직원ID)
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.showId - 직원ID도 함께 표시할지 여부 (기본값: false)
 * @param {string} props.separator - 직원명과 ID 사이 구분자 (기본값: ' ')
 * @param {boolean} props.loading - 로딩 상태 표시 여부 (기본값: false)
 */
export default function EmpNameDisplay({
  empId,
  empName,
  fallback,
  className = '',
  showId = false,
  separator = ' ',
  loading = false
}) {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!empId) {
      setDisplayName('');
      return;
    }

    // 백엔드에서 받은 직원명이 있으면 사용, 없으면 fallback 또는 직원ID 사용
    const name = empName || fallback || empId;
    setDisplayName(name);
  }, [empId, empName, fallback]);

  // 로딩 상태 표시
  if (loading) {
    return (
      <span className={`inline-block animate-pulse bg-gray-200 rounded ${className}`}>
        <span className="invisible">{empId || '로딩중...'}</span>
      </span>
    );
  }

  // 직원ID가 없는 경우
  if (!empId) {
    return <span className={className}>-</span>;
  }

  // 직원명과 ID를 함께 표시하는 경우
  if (showId) {
    return (
      <span className={className}>
        {displayName}
        {displayName !== empId && (
          <>
            {separator}
            <span className="text-gray-500 text-sm">({empId})</span>
          </>
        )}
      </span>
    );
  }

  // 직원명만 표시하는 경우
  return <span className={className}>{displayName}</span>;
}

/**
 * 직원명을 표시하는 간단한 버전 (성능 최적화)
 *
 * @param {Object} props
 * @param {string} props.empId - 직원ID
 * @param {string} props.empName - 직원명 (백엔드에서 받은 값)
 * @param {string} props.className - 추가 CSS 클래스
 */
export function SimpleEmpName({ empId, empName, className = '' }) {
  if (!empId) return <span className={className}>-</span>;

  const displayName = empName || empId;
  return <span className={className}>{displayName}</span>;
}

/**
 * 직원명을 표시하는 툴팁 버전
 *
 * @param {Object} props
 * @param {string} props.empId - 직원ID
 * @param {string} props.empName - 직원명 (백엔드에서 받은 값)
 * @param {string} props.className - 추가 CSS 클래스
 * @param {string} props.tooltipClassName - 툴팁 CSS 클래스
 */
export function EmpNameWithTooltip({ empId, empName, className = '', tooltipClassName = '' }) {
  if (!empId) return <span className={className}>-</span>;

  const displayName = empName || empId;
  const showTooltip = displayName !== empId; // 직원명이 있는 경우에만 툴팁 표시

  return (
    <span
      className={`${className} ${showTooltip ? 'cursor-help' : ''}`}
      title={showTooltip ? `직원ID: ${empId}` : undefined}
    >
      {displayName}
    </span>
  );
}
