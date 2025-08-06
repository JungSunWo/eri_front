'use client';

import CmpButton from '../button/cmp_button';
import { CmpNoData } from '../etc/cmp_noData';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  page = 1,
  totalPages = 1,
  onPageChange,
  rowKey = 'id',
  emptyMsg = '데이터가 없습니다.',
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg shadow">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} className="px-4 py-2 text-left">{col.header}</th>
          ))}
          {(onEdit || onDelete) && <th className="px-4 py-2">작업</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}>
              <CmpNoData msg={emptyMsg} img="img_noData.svg" />
            </td>
          </tr>
        ) : (
          data.map(row => (
            <tr key={row[rowKey] || Math.random()}>
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-2">
                  {onEdit && (
                    <CmpButton
                      label="편집"
                      styleType="secondary"
                      size="sm"
                      click={() => onEdit(row)}
                      className="mr-2"
                    />
                  )}
                  {onDelete && (
                    <CmpButton
                      label="삭제"
                      styleType="danger"
                      size="sm"
                      click={() => onDelete(row)}
                    />
                  )}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
    {totalPages > 1 && onPageChange && (
      <div className="flex justify-center mt-4">
        <CmpButton
          label="이전"
          styleType="secondary"
          size="sm"
          disabled={page <= 1}
          click={() => onPageChange(page - 1)}
          className="mx-1"
        />
        <span className="px-3 py-1 mx-1">{page} / {totalPages}</span>
        <CmpButton
          label="다음"
          styleType="secondary"
          size="sm"
          disabled={page >= totalPages}
          click={() => onPageChange(page + 1)}
          className="mx-1"
        />
      </div>
    )}
  </div>
);

export default DataTable;
