'use client';

import { alert, toast } from '@/common/ui_com';
import Board from '@/components/Board';
import PageWrapper from '@/components/layout/PageWrapper';
import { createCounselor, deleteCounselor, getCounselorList, getEmployeeList, updateCounselor } from '@/lib/api/counselorAPI';
import { useEffect, useState } from 'react';

export default function CounselorManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [counselorSearchKeyword, setCounselorSearchKeyword] = useState(''); // 상담사 검색 키워드
  const [counselorInfoClsf, setCounselorInfoClsf] = useState('PROFESSIONAL'); // 상담자정보구분코드
  const [editingCounselor, setEditingCounselor] = useState(null);
  const [editingCounselorInfoClsf, setEditingCounselorInfoClsf] = useState('PROFESSIONAL');

  // 직원 목록 페이징 상태
  const [employeePage, setEmployeePage] = useState(1);
  const [employeeTotalPages, setEmployeeTotalPages] = useState(1);
  const [employeeTotalElements, setEmployeeTotalElements] = useState(0);
  const [employeeSortKey, setEmployeeSortKey] = useState('');
  const [employeeSortOrder, setEmployeeSortOrder] = useState('asc');

  // 상담사 목록 페이징 상태
  const [counselorPage, setCounselorPage] = useState(1);
  const [counselorTotalPages, setCounselorTotalPages] = useState(1);
  const [counselorTotalElements, setCounselorTotalElements] = useState(0);
  const [counselorSortKey, setCounselorSortKey] = useState('');
  const [counselorSortOrder, setCounselorSortOrder] = useState('asc');

  // 직원 목록 조회
  const fetchEmployees = async (page = 1, sortKey = '', sortOrder = 'asc') => {
    try {
      setLoading(true);
      const params = {
        keyword: searchKeyword,
        page: page,
        size: 10, // 페이지당 10개씩
        sortBy: sortKey || undefined,
        sortDirection: sortKey ? sortOrder : undefined
      };
      const response = await getEmployeeList(params);
      if (response.success) {
        const data = response.data;
        setEmployees(data.content || data || []);
        setEmployeeTotalPages(data.totalPages || 1);
        setEmployeeTotalElements(data.totalElements || 0);
        setEmployeePage(page);
      } else {
        toast.callCommonToastOpen(response.message || '직원 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('직원 목록 조회 실패:', error);
      toast.callCommonToastOpen('직원 목록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상담사 목록 조회
  const fetchCounselors = async (page = 1, sortKey = '', sortOrder = 'asc') => {
    try {
      setLoading(true);
      const params = {
        keyword: counselorSearchKeyword, // 상담사 검색 키워드 추가
        page: page,
        size: 5, // 페이지당 5개씩
        sortBy: sortKey || undefined,
        sortDirection: sortKey ? sortOrder : undefined
      };
      const response = await getCounselorList(params);
      if (response.success) {
        const data = response.data;
        setCounselors(data.content || data || []);
        setCounselorTotalPages(data.totalPages || 1);
        setCounselorTotalElements(data.totalElements || 0);
        setCounselorPage(page);
      } else {
        toast.callCommonToastOpen(response.message || '상담사 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('상담사 목록 조회 실패:', error);
      toast.callCommonToastOpen('상담사 목록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 데이터 조회
  useEffect(() => {
    fetchEmployees();
    fetchCounselors();
  }, []);

  // 직원 검색 실행
  const handleSearch = () => {
    setEmployeePage(1); // 검색 시 첫 페이지로
    fetchEmployees(1, employeeSortKey, employeeSortOrder);
  };

  // 상담사 검색 실행
  const handleCounselorSearch = () => {
    setCounselorPage(1); // 검색 시 첫 페이지로
    fetchCounselors(1, counselorSortKey, counselorSortOrder);
  };

  // 직원 목록 페이징 처리
  const handleEmployeePageChange = (page) => {
    fetchEmployees(page, employeeSortKey, employeeSortOrder);
  };

  // 직원 목록 정렬 처리
  const handleEmployeeSortChange = (key, order) => {
    setEmployeeSortKey(key);
    setEmployeeSortOrder(order);
    fetchEmployees(employeePage, key, order);
  };

  // 상담사 목록 페이징 처리
  const handleCounselorPageChange = (page) => {
    fetchCounselors(page, counselorSortKey, counselorSortOrder);
  };

  // 상담사 목록 정렬 처리
  const handleCounselorSortChange = (key, order) => {
    setCounselorSortKey(key);
    setCounselorSortOrder(order);
    fetchCounselors(counselorPage, key, order);
  };

  // 직원 선택
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  // 상담사 등록
  const handleCounselorRegister = async () => {
    if (!selectedEmployee) {
      toast.callCommonToastOpen('등록할 직원을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const counselorData = {
        counselorEmpId: selectedEmployee.eriEmpId, // ERI직원번호로 저장
        eriEmpId: selectedEmployee.eriEmpId,
        counselorInfoClsfCd: counselorInfoClsf
        // regEmpId는 백엔드에서 세션의 EMP_ID를 사용
      };

      const response = await createCounselor(counselorData);
      if (response.success) {
        toast.callCommonToastOpen('상담사가 성공적으로 등록되었습니다.');
        // 폼 초기화
        setSelectedEmployee(null);
        setCounselorInfoClsf('PROFESSIONAL');
        // 목록 새로고침
        fetchEmployees(employeePage, employeeSortKey, employeeSortOrder);
        fetchCounselors(counselorPage, counselorSortKey, counselorSortOrder);
      } else {
        toast.callCommonToastOpen(response.message || '상담사 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('상담사 등록 실패:', error);
      toast.callCommonToastOpen('상담사 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상담사 수정 모드 시작
  const handleEditStart = (counselor) => {
    setEditingCounselor(counselor);
    setEditingCounselorInfoClsf(counselor.counselorInfoClsfCd || 'PROFESSIONAL');
  };

  // 상담사 수정 모드 취소
  const handleEditCancel = () => {
    setEditingCounselor(null);
    setEditingCounselorInfoClsf('PROFESSIONAL');
  };

  // 상담사 수정
  const handleCounselorUpdate = async () => {
    if (!editingCounselor) return;

    try {
      setLoading(true);
      const counselorData = {
        counselorInfoClsfCd: editingCounselorInfoClsf
        // updEmpId는 백엔드에서 세션의 EMP_ID를 사용
      };

      const response = await updateCounselor(editingCounselor.counselorEmpId, counselorData);
      if (response.success) {
        toast.callCommonToastOpen('상담사 정보가 성공적으로 수정되었습니다.');
        setEditingCounselor(null);
        setEditingCounselorInfoClsf('PROFESSIONAL');
        fetchCounselors(counselorPage, counselorSortKey, counselorSortOrder); // 목록 새로고침
      } else {
        toast.callCommonToastOpen(response.message || '상담사 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('상담사 수정 실패:', error);
      toast.callCommonToastOpen('상담사 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상담사 삭제
  const handleCounselorDelete = async (counselorEmpId) => {
    // 공통 confirm 사용
    alert.ConfirmOpen('상담사 삭제', '정말로 이 상담사를 삭제하시겠습니까?', {
      okLabel: '삭제',
      cancelLabel: '취소',
      okCallback: async () => {
        try {
          setLoading(true);
          const response = await deleteCounselor(counselorEmpId);
          if (response.success) {
            toast.callCommonToastOpen('상담사가 성공적으로 삭제되었습니다.');
            fetchCounselors(counselorPage, counselorSortKey, counselorSortOrder); // 목록 새로고침
          } else {
            toast.callCommonToastOpen(response.message || '상담사 삭제에 실패했습니다.');
          }
        } catch (error) {
          console.error('상담사 삭제 실패:', error);
          toast.callCommonToastOpen('상담사 삭제 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 상담사 목록 컬럼 정의
  const counselorColumns = [
    { key: 'counselorEmpId', label: 'ERI직원번호' },
    { key: 'empNm', label: '직원명' },
    { key: 'blngBrcd', label: '소속부점' },
    { key: 'jbttCd', label: '직위' },
    { key: 'jbclCd', label: '직급' },
    { key: 'counselorInfoClsfCd', label: '상담자정보구분' },
    { key: 'regDate', label: '등록일' },
    { key: 'actions', label: '작업', width: '120px' }
  ];

  // 직원 목록 컬럼 정의
  const employeeColumns = [
    { key: 'select', label: '선택', width: '60px' },
    { key: 'eriEmpId', label: 'ERI직원번호' },
    { key: 'empId', label: '직원번호' },
    { key: 'empNm', label: '직원명' },
    { key: 'blngBrcd', label: '소속부점' }
  ];

  // 상담사 목록 커스텀 렌더링
  const renderCounselorCell = (row, col) => {
    if (col.key === 'counselorInfoClsfCd') {
      if (editingCounselor?.counselorEmpId === row.counselorEmpId) {
        return (
          <select
            value={editingCounselorInfoClsf}
            onChange={(e) => setEditingCounselorInfoClsf(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PROFESSIONAL">전문상담사</option>
            <option value="GENERAL">일반상담사</option>
            <option value="INTERN">인턴</option>
          </select>
        );
      } else {
        const counselorTypeText = {
          'PROFESSIONAL': '전문상담사',
          'GENERAL': '일반상담사',
          'INTERN': '인턴'
        };
        const counselorTypeColor = {
          'PROFESSIONAL': 'bg-red-100 text-red-800',
          'GENERAL': 'bg-blue-100 text-blue-800',
          'INTERN': 'bg-green-100 text-green-800'
        };

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            counselorTypeColor[row.counselorInfoClsfCd] || 'bg-gray-100 text-gray-800'
          }`}>
            {counselorTypeText[row.counselorInfoClsfCd] || row.counselorInfoClsfCd || '-'}
          </span>
        );
      }
    }

    if (col.key === 'regDate') {
      return row.regDate ? new Date(row.regDate).toLocaleDateString() : '-';
    }

    if (col.key === 'jbclCd') {
      // 직급 코드를 텍스트로 변환
      const jbclText = {
        '1': '11급',
        '2': '22급',
        '3': '33급',
        '4': '44급',
        '5': '55급',
        '6': '66급',
        '9': '99급'
      };
      return jbclText[row.jbclCd] || row.jbclCd || '-';
    }

    if (col.key === 'empNm') {
      return row.empNm || '-';
    }

    if (col.key === 'blngBrcd') {
      return row.blngBrcd || '-';
    }

    if (col.key === 'jbttCd') {
      return row.jbttCd || '-';
    }

    if (col.key === 'actions') {
      if (editingCounselor?.counselorEmpId === row.counselorEmpId) {
        return (
          <div className="flex gap-2">
            <button
              onClick={handleCounselorUpdate}
              disabled={loading}
              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
            >
              저장
            </button>
            <button
              onClick={handleEditCancel}
              disabled={loading}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50"
            >
              취소
            </button>
          </div>
        );
      } else {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditStart(row)}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              수정
            </button>
            <button
              onClick={() => handleCounselorDelete(row.counselorEmpId)}
              disabled={loading}
              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        );
      }
    }

    return row[col.key] || '-';
  };

  // 직원 목록 커스텀 렌더링
  const renderEmployeeCell = (row, col) => {
    if (col.key === 'select') {
      return (
        <input
          type="radio"
          name="selectedEmployee"
          checked={selectedEmployee?.empId === row.empId}
          onChange={() => handleEmployeeSelect(row)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        />
      );
    }

    return row[col.key];
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">상담사 관리</h1>
            <p className="text-gray-600">
              상담사 등록 및 상담사 목록을 조회하고 관리합니다.
            </p>
          </div>

          {/* 상단 영역: 상담사 목록과 상담사 등록 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* 상담사 목록 */}
            <div className="xl:col-span-2">
              <Board
                title={`상담사 목록 (총 ${counselorTotalElements}명)`}
                actions={
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ERI직원번호, 직원명, 소속부점 검색"
                      value={counselorSearchKeyword}
                      onChange={(e) => setCounselorSearchKeyword(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleCounselorSearch()}
                    />
                    <button
                      onClick={handleCounselorSearch}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      검색
                    </button>
                  </div>
                }
                columns={counselorColumns}
                data={counselors}
                renderCell={renderCounselorCell}
                page={counselorPage}
                totalPages={counselorTotalPages}
                onPageChange={handleCounselorPageChange}
                sortKey={counselorSortKey}
                sortOrder={counselorSortOrder}
                onSortChange={handleCounselorSortChange}
                className="h-fit"
              />
            </div>

            {/* 상담사 등록 폼 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">상담사 등록</h2>

              {selectedEmployee ? (
                <div className="space-y-4">
                  {/* 선택된 직원 정보 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">선택된 직원</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">ERI직원번호:</span> {selectedEmployee.eriEmpId}</p>
                      <p><span className="font-medium">직원번호:</span> {selectedEmployee.empId}</p>
                      <p><span className="font-medium">직원명:</span> {selectedEmployee.empNm}</p>
                      <p><span className="font-medium">소속부점:</span> {selectedEmployee.blngBrcd}</p>
                      <p><span className="font-medium">직위:</span> {selectedEmployee.jbttCd}</p>
                      <p><span className="font-medium">직급:</span> {
                        selectedEmployee.jbclCd ? {
                          '1': '11급',
                          '2': '22급',
                          '3': '33급',
                          '4': '44급',
                          '5': '55급',
                          '6': '66급',
                          '9': '99급'
                        }[selectedEmployee.jbclCd] || selectedEmployee.jbclCd : '-'
                      }</p>
                      <p><span className="font-medium">소속팀:</span> {selectedEmployee.beteamCd || '-'}</p>
                    </div>
                  </div>

                  {/* 상담자정보구분 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상담자정보구분 *
                    </label>
                    <select
                      value={counselorInfoClsf}
                      onChange={(e) => setCounselorInfoClsf(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PROFESSIONAL">전문상담사</option>
                      <option value="GENERAL">일반상담사</option>
                      <option value="INTERN">인턴</option>
                    </select>
                  </div>

                  {/* 등록 버튼 */}
                  <button
                    onClick={handleCounselorRegister}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '등록 중...' : '상담사 등록'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500">하단에서 등록할 직원을 선택해주세요.</p>
                </div>
              )}
            </div>
          </div>

          {/* 하단 영역: 직원 목록 */}
          <div>
            <Board
              title={`직원 목록 (총 ${employeeTotalElements}명)`}
              actions={
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="직원명, 직원번호, ERI직원번호 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    검색
                  </button>
                </div>
              }
              columns={employeeColumns}
              data={employees}
              renderCell={renderEmployeeCell}
              onRowClick={handleEmployeeSelect}
              page={employeePage}
              totalPages={employeeTotalPages}
              onPageChange={handleEmployeePageChange}
              sortKey={employeeSortKey}
              sortOrder={employeeSortOrder}
              onSortChange={handleEmployeeSortChange}
              className="h-fit"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
