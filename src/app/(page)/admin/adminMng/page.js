'use client';

import { toast } from '@/components/toast/cmp_toast';
import { createAdmin, getEmployeeList } from '@/lib/api/adminAPI';
import { useEffect, useState } from 'react';

export default function AdminManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [adminLevel, setAdminLevel] = useState('ADMIN'); // ADMIN, SUPER_ADMIN
  const [adminDesc, setAdminDesc] = useState('');

  // 직원 목록 조회
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        searchKeyword: searchKeyword,
        page: 1,
        size: 50
      };
      const response = await getEmployeeList(params);
      if (response.success) {
        setEmployees(response.data.content || response.data || []);
      } else {
        toast.error(response.message || '직원 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('직원 목록 조회 실패:', error);
      toast.error('직원 목록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 직원 목록 조회
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 검색 실행
  const handleSearch = () => {
    fetchEmployees();
  };

  // 직원 선택
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  // 관리자 등록
  const handleAdminRegister = async () => {
    if (!selectedEmployee) {
      toast.error('등록할 직원을 선택해주세요.');
      return;
    }

    if (!adminDesc.trim()) {
      toast.error('관리자 설명을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const adminData = {
        empId: selectedEmployee.empId,
        eriEmpId: selectedEmployee.eriEmpId,
        adminLevel: adminLevel,
        adminDesc: adminDesc.trim(),
        regEmpId: selectedEmployee.empId // 등록자 ID
      };

      const response = await createAdmin(adminData);
      if (response.success) {
        toast.success('관리자가 성공적으로 등록되었습니다.');
        // 폼 초기화
        setSelectedEmployee(null);
        setAdminLevel('ADMIN');
        setAdminDesc('');
        // 직원 목록 새로고침
        fetchEmployees();
      } else {
        toast.error(response.message || '관리자 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('관리자 등록 실패:', error);
      toast.error('관리자 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자 등록</h1>
          <p className="text-gray-600">
            TB_EMP_LST 테이블의 직원 정보를 TB_ADMIN_LST 테이블에 관리자로 등록합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 직원 목록 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">직원 목록</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="직원명 또는 직원번호 검색"
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
            </div>

            {/* 직원 목록 테이블 */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      선택
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직원번호
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직원명
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      소속부점
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직위
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-4 text-center text-gray-500">
                        로딩 중...
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-4 text-center text-gray-500">
                        직원 정보가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => (
                      <tr
                        key={employee.empId}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedEmployee?.empId === employee.empId ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <td className="px-3 py-4 whitespace-nowrap">
                          <input
                            type="radio"
                            name="selectedEmployee"
                            checked={selectedEmployee?.empId === employee.empId}
                            onChange={() => handleEmployeeSelect(employee)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.empId}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.empNm}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.blngBrcd}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.jbttCd}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 관리자 등록 폼 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">관리자 등록</h2>

            {selectedEmployee ? (
              <div className="space-y-4">
                {/* 선택된 직원 정보 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">선택된 직원</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">직원번호:</span> {selectedEmployee.empId}</p>
                    <p><span className="font-medium">직원명:</span> {selectedEmployee.empNm}</p>
                    <p><span className="font-medium">소속부점:</span> {selectedEmployee.blngBrcd}</p>
                    <p><span className="font-medium">직위:</span> {selectedEmployee.jbttCd}</p>
                  </div>
                </div>

                {/* 관리자 레벨 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    관리자 레벨 *
                  </label>
                  <select
                    value={adminLevel}
                    onChange={(e) => setAdminLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">일반 관리자</option>
                    <option value="SUPER_ADMIN">최고 관리자</option>
                  </select>
                </div>

                {/* 관리자 설명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    관리자 설명 *
                  </label>
                  <textarea
                    value={adminDesc}
                    onChange={(e) => setAdminDesc(e.target.value)}
                    placeholder="관리자 등록 사유나 설명을 입력하세요"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 등록 버튼 */}
                <button
                  onClick={handleAdminRegister}
                  disabled={loading || !adminDesc.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '등록 중...' : '관리자 등록'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-500">왼쪽에서 등록할 직원을 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
