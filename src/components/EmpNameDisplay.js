'use client';

import empNameCache from '@/common/empNameCache';
import { useEffect, useState } from 'react';

/**
 * 직원ID를 받아서 직원명을 표시하는 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.empId - 직원ID
 * @param {string} props.fallback - 캐시에 없을 때 표시할 텍스트 (기본값: 직원ID)
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.showId - 직원ID도 함께 표시할지 여부 (기본값: false)
 * @param {string} props.separator - 직원명과 ID 사이 구분자 (기본값: ' ')
 * @param {boolean} props.loading - 로딩 상태 표시 여부 (기본값: false)
 */
export default function EmpNameDisplay({
  empId,
  fallback,
  className = '',
  showId = false,
  separator = ' ',
  loading = false
}) {
  const [empName, setEmpName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!empId) {
      setEmpName('');
      return;
    }

    // 캐시가 초기화되지 않았으면 로딩 상태로 표시
    if (!empNameCache.isCacheInitialized()) {
      setIsLoading(true);
      setEmpName(fallback || empId);
      return;
    }

    setIsLoading(false);
    const name = empNameCache.getEmpName(empId);
    setEmpName(name);
  }, [empId, fallback]);

  // 로딩 상태 표시
  if (loading || isLoading) {
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
        {empName}
        {empName !== empId && (
          <>
            {separator}
            <span className="text-gray-500 text-sm">({empId})</span>
          </>
        )}
      </span>
    );
  }

  // 직원명만 표시하는 경우
  return <span className={className}>{empName}</span>;
}

/**
 * 직원명을 표시하는 간단한 버전 (성능 최적화)
 *
 * @param {Object} props
 * @param {string} props.empId - 직원ID
 * @param {string} props.className - 추가 CSS 클래스
 */
export function SimpleEmpName({ empId, className = '' }) {
  if (!empId) return <span className={className}>-</span>;

  const empName = empNameCache.getEmpName(empId);
  return <span className={className}>{empName}</span>;
}

/**
 * 직원명을 표시하는 툴팁 버전
 *
 * @param {Object} props
 * @param {string} props.empId - 직원ID
 * @param {string} props.className - 추가 CSS 클래스
 * @param {string} props.tooltipClassName - 툴팁 CSS 클래스
 */
export function EmpNameWithTooltip({ empId, className = '', tooltipClassName = '' }) {
  if (!empId) return <span className={className}>-</span>;

  const empName = empNameCache.getEmpName(empId);
  const showTooltip = empName !== empId; // 캐시에 있는 경우에만 툴팁 표시

  return (
    <span
      className={`${className} ${showTooltip ? 'cursor-help' : ''}`}
      title={showTooltip ? `직원ID: ${empId}` : undefined}
    >
      {empName}
    </span>
  );
}
