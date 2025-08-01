'use client';

import { systemLogAPI } from '@/app/core/services/api';
import Board from '@/app/shared/components/Board';
import { CmpButton } from '@/app/shared/components/button/cmp_button';
import { CmpNoData } from '@/app/shared/components/etc/cmp_noData';
import { CmpInput, CmpSelect } from '@/app/shared/components/ui';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert } from '@/app/shared/utils/ui_com';
import { useEffect, useState } from 'react';

// 날짜 포맷팅 함수
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('ko-KR');
}

const LogManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 검색 및 필터 상태
  const [searchParams, setSearchParams] = useState({
    logLevel: '',
    logType: '',
    empId: '',
    errorCode: '',
    startDate: '',
    endDate: '',
    searchKeyword: ''
  });

  // 로그 레벨 옵션
  const logLevelOptions = [
    { value: '', label: '전체' },
    { value: 'ERROR', label: '오류' },
    { value: 'WARN', label: '경고' },
    { value: 'INFO', label: '정보' },
    { value: 'DEBUG', label: '디버그' }
  ];

  // 로그 타입 옵션
  const logTypeOptions = [
    { value: '', label: '전체' },
    { value: 'API', label: 'API' },
    { value: 'DATABASE', label: '데이터베이스' },
    { value: 'SECURITY', label: '보안' },
    { value: 'SYSTEM', label: '시스템' },
    { value: 'MESSENGER', label: '메신저' }
  ];

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadLogs();
  }, [currentPage]);

  // 로그 목록 로드
  const loadLogs = async () => {
    try {
      setLoading(true);
      console.log('API 호출 파라미터:', { page: currentPage, size: 20, ...searchParams });

      const response = await systemLogAPI.getList({
        page: currentPage,
        size: 20,
        ...searchParams
      });

      console.log('API 응답:', response);

      if (response && response.success) {
        setLogs(response.data.logs || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      } else {
        console.error('API 응답 실패:', response);
        alert.AlertOpen('오류', response?.message || '로그 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('로그 로드 오류:', error);
      alert.AlertOpen('오류', '로그 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색 파라미터 변경
  const handleSearchParamChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 검색 실행
  const handleSearch = () => {
    console.log('검색 버튼 클릭됨');
    console.log('현재 검색 파라미터:', searchParams);
    setCurrentPage(1);
    loadLogs();
  };

  // 검색 초기화
  const handleReset = () => {
    setSearchParams({
      logLevel: '',
      logType: '',
      empId: '',
      errorCode: '',
      startDate: '',
      endDate: '',
      searchKeyword: ''
    });
    setCurrentPage(1);
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 로그 삭제
  const handleDeleteLog = async (logSeq) => {
    if (!confirm('선택한 로그를 삭제하시겠습니까?')) return;

    try {
      const response = await systemLogAPI.deleteLog(logSeq);
      if (response.success) {
        alert.AlertOpen('성공', '로그가 삭제되었습니다.');
        loadLogs();
      } else {
        alert.AlertOpen('오류', '로그 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그 삭제 오류:', error);
      alert.AlertOpen('오류', '로그 삭제에 실패했습니다.');
    }
  };

  // 오래된 로그 삭제
  const handleDeleteOldLogs = async () => {
    const days = prompt('몇 일 이전의 로그를 삭제하시겠습니까? (기본값: 90일)', '90');
    if (!days) return;

    const daysNum = parseInt(days);
    if (isNaN(daysNum) || daysNum < 1) {
      alert.AlertOpen('경고', '유효한 일수를 입력해주세요.');
      return;
    }

    if (!confirm(`${daysNum}일 이전의 로그를 삭제하시겠습니까?`)) return;

    try {
      const response = await systemLogAPI.deleteOldLogs(daysNum);
      if (response.success) {
        alert.AlertOpen('성공', '오래된 로그가 삭제되었습니다.');
        loadLogs();
      } else {
        alert.AlertOpen('오류', '오래된 로그 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('오래된 로그 삭제 오류:', error);
      alert.AlertOpen('오류', '오래된 로그 삭제에 실패했습니다.');
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'logSeq',
      label: '번호',
      width: '80px'
    },
    {
      key: 'logLevel',
      label: '레벨',
      width: '100px'
    },
    {
      key: 'logType',
      label: '타입',
      width: '120px'
    },
    {
      key: 'logMessage',
      label: '메시지'
    },
    {
      key: 'empId',
      label: '사용자',
      width: '120px'
    },
    {
      key: 'className',
      label: '클래스',
      width: '200px'
    },
    {
      key: 'ipAddress',
      label: 'IP 주소',
      width: '120px'
    },
    {
      key: 'createdDate',
      label: '생성일시',
      width: '160px'
    },
    {
      key: 'actions',
      label: '작업',
      width: '100px'
    }
  ];

  // 로그 상세 보기
  const handleViewDetail = async (logSeq) => {
    try {
      const response = await systemLogAPI.getLogDetail(logSeq);
      if (response.success) {
        const log = response.data;
        const detailText = `
로그 상세 정보

번호: ${log.logSeq}
레벨: ${log.logLevel}
타입: ${log.logType}
메시지: ${log.logMessage}
상세: ${log.logDetail || '-'}
클래스: ${log.className}
메서드: ${log.methodName}
라인: ${log.lineNumber || '-'}
사용자: ${log.empId || '-'}
IP: ${log.ipAddress || '-'}
요청 URI: ${log.requestUri || '-'}
요청 메서드: ${log.requestMethod || '-'}
에러 코드: ${log.errorCode || '-'}
에러 카테고리: ${log.errorCategory || '-'}
생성일시: ${formatDate(log.createdDate)}

스택 트레이스:
${log.stackTrace || '-'}
        `;
        alert.AlertOpen('로그 상세 정보', detailText);
      } else {
        alert.AlertOpen('오류', '로그 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('로그 상세 조회 오류:', error);
      alert.AlertOpen('오류', '로그 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  // 로그 셀 렌더링 함수
  const renderLogCell = (row, col) => {
    if (col.key === 'logLevel') {
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row[col.key] === 'ERROR' ? 'text-red-600 bg-red-50' :
          row[col.key] === 'WARN' ? 'text-yellow-600 bg-yellow-50' :
            row[col.key] === 'INFO' ? 'text-blue-600 bg-blue-50' :
              row[col.key] === 'DEBUG' ? 'text-gray-600 bg-gray-50' :
                'text-gray-600 bg-gray-50'}`}>
          {row[col.key]}
        </span>
      );
    }
    if (col.key === 'logType') {
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row[col.key] === 'API' ? 'text-purple-600 bg-purple-50' :
          row[col.key] === 'DATABASE' ? 'text-orange-600 bg-orange-50' :
            row[col.key] === 'SECURITY' ? 'text-red-600 bg-red-50' :
              row[col.key] === 'SYSTEM' ? 'text-blue-600 bg-blue-50' :
                row[col.key] === 'MESSENGER' ? 'text-green-600 bg-green-50' :
                  'text-gray-600 bg-gray-50'}`}>
          {row[col.key]}
        </span>
      );
    }
    if (col.key === 'logMessage') {
      return (
        <div className="max-w-xs truncate" title={row[col.key]}>
          {row[col.key]}
        </div>
      );
    }
    if (col.key === 'empId') {
      return <span className="text-sm">{row[col.key] || '-'}</span>;
    }
    if (col.key === 'className') {
      return (
        <div className="max-w-xs truncate text-xs text-gray-600" title={row[col.key]}>
          {row[col.key]}
        </div>
      );
    }
    if (col.key === 'ipAddress') {
      return <span className="text-sm text-gray-600">{row[col.key] || '-'}</span>;
    }
    if (col.key === 'createdDate') {
      return <span className="text-sm text-gray-600">{formatDate(row[col.key])}</span>;
    }
    if (col.key === 'actions') {
      return (
        <div className="flex gap-1">
          <CmpButton
            size="sm"
            styleType="line"
            click={() => handleViewDetail(row.logSeq)}
            className="text-xs"
            label="상세"
          />
          <CmpButton
            size="sm"
            styleType="line"
            click={() => handleDeleteLog(row.logSeq)}
            className="text-xs text-red-600"
            label="삭제"
          />
        </div>
      );
    }
    return row[col.key]; // 기본 렌더링
  };

  return (
    <PageWrapper title="시스템 로그 관리">
      <div className="p-4">
        {/* 검색 섹션 */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <CmpSelect
              label="로그 레벨"
              value={searchParams.logLevel}
              onChange={(value) => handleSearchParamChange('logLevel', value)}
              options={logLevelOptions}
            />
            <CmpSelect
              label="로그 타입"
              value={searchParams.logType}
              onChange={(value) => handleSearchParamChange('logType', value)}
              options={logTypeOptions}
            />
            <CmpInput
              label="사용자 ID"
              value={searchParams.empId}
              onChange={(e) => handleSearchParamChange('empId', e.target.value)}
              placeholder="사용자 ID 입력"
            />
            <CmpInput
              label="에러 코드"
              value={searchParams.errorCode}
              onChange={(e) => handleSearchParamChange('errorCode', e.target.value)}
              placeholder="에러 코드 입력"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <CmpInput
              label="시작일"
              type="date"
              value={searchParams.startDate || ''}
              onChange={(e) => handleSearchParamChange('startDate', e.target.value)}
            />
            <CmpInput
              label="종료일"
              type="date"
              value={searchParams.endDate || ''}
              onChange={(e) => handleSearchParamChange('endDate', e.target.value)}
            />
            <CmpInput
              label="검색어"
              value={searchParams.searchKeyword}
              onChange={(e) => handleSearchParamChange('searchKeyword', e.target.value)}
              placeholder="메시지, 상세 내용 검색"
            />
          </div>

          <div className="flex gap-2 mb-6">
            <CmpButton styleType="primary" click={handleSearch} disabled={loading} label="검색" />
            <CmpButton styleType="line" click={handleReset} label="초기화" />
            <CmpButton styleType="line" click={handleDeleteOldLogs} label="오래된 로그 삭제" />
          </div>
        </div>

        {/* 로그 목록 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : logs.length === 0 ? (
            <CmpNoData message="조회된 로그가 없습니다." img="img_noData.svg" />
          ) : (
            <Board
              title="로그 목록"
              data={logs}
              columns={columns}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              renderCell={renderLogCell}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default LogManagementPage;
