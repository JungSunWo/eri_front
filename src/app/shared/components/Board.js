'use client';

import { useMemo } from 'react';
import { CmpNoData } from './etc/cmp_noData';

/**
 * Board 컴포넌트
 * props:
 * - title: 상단 제목
 * - actions: 우측 상단 액션 요소(버튼 등)
 * - columns: [{ key, label }] 형태의 컬럼 정보 (정렬 지원)
 * - data: [{ ... }] 형태의 행 데이터
 * - page: 현재 페이지
 * - totalPages: 전체 페이지 수
 * - onPageChange: 페이지 변경 함수
 * - sortKey: 정렬 기준 컬럼 key
 * - sortOrder: 'asc' | 'desc'
 * - onSortChange: (key, order) => void
 * - onRowClick: (row) => void (행 클릭 시 호출)
 * - className, style: 추가 스타일
 * - renderCell: (row, col) => ReactNode (셀 커스텀 렌더)
 */
export default function Board({
  title,
  actions,
  columns = [],
  data = [],
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  sortKey = '',
  sortOrder = 'asc',
  onSortChange = () => {},
  onRowClick,
  className = '',
  style = {},
  renderCell,
}) {
  // 정렬된 데이터
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      let v1 = a[sortKey];
      let v2 = b[sortKey];
      // 날짜 문자열 정렬 지원
      if (typeof v1 === 'string' && typeof v2 === 'string' && v1.match(/^\d{4}-\d{2}-\d{2}T/)) {
        v1 = new Date(v1);
        v2 = new Date(v2);
      }
      if (v1 == null) return 1;
      if (v2 == null) return -1;
      if (v1 === v2) return 0;
      if (sortOrder === 'asc') return v1 > v2 ? 1 : -1;
      return v1 < v2 ? 1 : -1;
    });
    return arr;
  }, [data, sortKey, sortOrder]);

  // 컬럼 클릭 핸들러
  const handleSort = (key) => {
    if (!key) return;
    let order = 'asc';
    if (sortKey === key && sortOrder === 'asc') order = 'desc';
    onSortChange(key, order);
  };

  // 페이징 렌더
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="px-2 py-1 rounded border"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'border'}`}
            onClick={() => onPageChange(i + 1)}
            disabled={page === i + 1}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-2 py-1 rounded border"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  // 정렬 아이콘
  const sortIcon = (key) => {
    if (sortKey !== key) return <span className="ml-1 text-gray-300">↕</span>;
    return sortOrder === 'asc'
      ? <span className="ml-1 text-blue-600">▲</span>
      : <span className="ml-1 text-blue-600">▼</span>;
  };

  return (
    <div className={`bg-white rounded-xl shadow p-6 mb-6 ${className}`} style={style}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="py-2 px-2 border cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                  {sortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <CmpNoData msg="데이터가 없습니다." img="img_noData.svg" />
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={onRowClick ? 'hover:bg-blue-50 cursor-pointer' : ''}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map(col => (
                    <td key={col.key} className="py-2 px-2 border" style={col.width ? { width: col.width } : {}}>
                      {renderCell ? renderCell(row, col) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}
