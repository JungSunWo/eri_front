'use client';

import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { useEffect, useState } from 'react';

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  // 직원 목록 조회
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee/list');
      const data = await response.json();

      if (data.success) {
        setEmployees(data.data);
      } else {
        setError(data.message || '직원 목록 조회에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 조건별 직원 검색
  const searchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchKeyword) params.append('searchKeyword', searchKeyword);
      if (selectedBranch) params.append('branchCd', selectedBranch);

      const response = await fetch(`/api/employee/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setEmployees(data.data);
      } else {
        setError(data.message || '직원 검색에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 직급 코드를 한글로 변환
  const getJobClassText = (jbclCd) => {
    const jobClassMap = {
      '1': '11급',
      '2': '22급',
      '3': '33급',
      '4': '44급',
      '5': '55급',
      '6': '66급',
      '9': '99급'
    };
    return jobClassMap[jbclCd] || jbclCd;
  };

  // 재직 여부를 한글로 변환
  const getEmploymentStatus = (hlofYn) => {
    return hlofYn === 'Y' ? '재직' : '퇴직';
  };

  // 성별을 한글로 변환
  const getGenderText = (gndrDcd) => {
    return gndrDcd === 'M' ? '남성' : gndrDcd === 'F' ? '여성' : '미지정';
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">직원 관리</h1>
          <p className="text-gray-600">ERI 시스템 직원 정보 관리</p>
        </div>

        {/* 검색 필터 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색어
              </label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="이름, ID, 이메일로 검색"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소속부점
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="0001">본점</option>
                <option value="0002">지점1</option>
                <option value="0003">지점2</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={searchEmployees}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                검색
              </button>
            </div>
          </div>
        </div>

        {/* 직원 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              직원 목록 ({employees.length}명)
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchEmployees}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ERI ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직원명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직급
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      소속부점
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      재직상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      입행일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.eriEmpId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.eriEmpId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.empNm || '미지정'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getJobClassText(employee.jbclCd)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.blngBrcd || '미지정'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.hlofYn === 'Y'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getEmploymentStatus(employee.hlofYn)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.ead || '미등록'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.etbnYmd ? new Date(employee.etbnYmd).toLocaleDateString('ko-KR') : '미등록'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {employees.length === 0 && !loading && !error && (
            <div className="p-6 text-center">
              <p className="text-gray-500">등록된 직원이 없습니다.</p>
            </div>
          )}
        </div>

        {/* DDL 구조 정보 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">데이터베이스 구조 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">주요 필드</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• EMP_ID: 실제 직원번호 (외부 시스템)</li>
                <li>• ERI_EMP_ID: ERI 시스템 내부 식별번호</li>
                <li>• EMP_NM: 직원명</li>
                <li>• JBCL_CD: 직급코드 (1:11급, 2:22급, ...)</li>
                <li>• BLNG_BRCD: 소속부점코드</li>
                <li>• HLOF_YN: 재직여부 (Y:재직, N:퇴직)</li>
                <li>• ETBN_YMD: 입행년월일</li>
                <li>• EAD: 이메일주소 (암호화)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">보안 특징</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• 별도 PostgreSQL 인스턴스 (포트 5433)</li>
                <li>• 이메일/전화번호 자동 암호화</li>
                <li>• 논리 삭제 (DEL_YN 플래그)</li>
                <li>• 이중 ID 시스템 (EMP_ID + ERI_EMP_ID)</li>
                <li>• 은행 데이터 사전 기반 표준화</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
