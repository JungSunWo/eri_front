'use client';

import empNameCache from '@/common/empNameCache';
import EmpNameDisplay, { EmpNameWithTooltip, SimpleEmpName } from '@/components/EmpNameDisplay';
import { CmpButton } from '@/components/button/cmp_button';
import { CmpSection, CmpSectionBody } from '@/components/contents/cmp_section/cmp_section';
import PageWrapper from '@/components/layout/PageWrapper';
import { authAPI } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function EmpNameDemoPage() {
  const [testEmpIds, setTestEmpIds] = useState([
    'EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005',
    'INVALID_ID', '', null, undefined
  ]);
  const [newEmpId, setNewEmpId] = useState('');
  const [cacheStatus, setCacheStatus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 캐시 상태 업데이트
    const updateCacheStatus = () => {
      setCacheStatus(empNameCache.getStatus());
    };

    updateCacheStatus();

    // 캐시 상태를 주기적으로 업데이트
    const interval = setInterval(updateCacheStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // 캐시 수동 초기화
  const handleRefreshCache = async () => {
    setLoading(true);
    try {
      const employeeCache = await authAPI.getEmployeeCache();
      empNameCache.initialize(employeeCache);
      console.log('직원 캐시 수동 초기화 완료:', empNameCache.getSize(), '명');
    } catch (error) {
      console.error('직원 캐시 초기화 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 테스트 직원ID 추가
  const handleAddTestEmpId = () => {
    if (newEmpId.trim()) {
      setTestEmpIds(prev => [...prev, newEmpId.trim()]);
      setNewEmpId('');
    }
  };

  // 테스트 직원ID 제거
  const handleRemoveTestEmpId = (index) => {
    setTestEmpIds(prev => prev.filter((_, i) => i !== index));
  };

  // 캐시 비우기
  const handleClearCache = () => {
    empNameCache.clear();
  };

  return (
    <PageWrapper
      title="직원명 표시 데모"
      subtitle="직원ID를 직원명으로 변환하는 기능 테스트"
    >
      <CmpSection>
        <CmpSectionBody>
          <div className="space-y-6">
            {/* 캐시 상태 정보 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">캐시 상태</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">초기화 여부:</span>
                  <span className={`ml-2 ${cacheStatus.isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                    {cacheStatus.isInitialized ? '초기화됨' : '초기화 안됨'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">캐시 크기:</span>
                  <span className="ml-2 text-blue-600">{cacheStatus.size}명</span>
                </div>
                <div>
                  <span className="font-medium">데이터 존재:</span>
                  <span className={`ml-2 ${cacheStatus.hasData ? 'text-green-600' : 'text-red-600'}`}>
                    {cacheStatus.hasData ? '있음' : '없음'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">상태:</span>
                  <span className={`ml-2 ${cacheStatus.isInitialized && cacheStatus.hasData ? 'text-green-600' : 'text-yellow-600'}`}>
                    {cacheStatus.isInitialized && cacheStatus.hasData ? '정상' : '대기중'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <CmpButton
                  label={loading ? "로딩중..." : "캐시 새로고침"}
                  onClick={handleRefreshCache}
                  disabled={loading}
                  className="text-sm"
                />
                <CmpButton
                  label="캐시 비우기"
                  onClick={handleClearCache}
                  className="text-sm bg-red-600 hover:bg-red-700"
                />
              </div>
            </div>

            {/* 테스트 직원ID 관리 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">테스트 직원ID 관리</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newEmpId}
                  onChange={(e) => setNewEmpId(e.target.value)}
                  placeholder="테스트할 직원ID 입력"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTestEmpId()}
                />
                <CmpButton
                  label="추가"
                  onClick={handleAddTestEmpId}
                  className="text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {testEmpIds.map((empId, index) => (
                  <div key={index} className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
                    <span className="text-sm">{empId || '(빈 값)'}</span>
                    <button
                      onClick={() => handleRemoveTestEmpId(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 직원명 표시 테스트 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">직원명 표시 테스트</h3>

              {/* 기본 표시 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">기본 표시 (EmpNameDisplay)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testEmpIds.map((empId, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm text-gray-800">{empId || '(빈 값)'}</span>
                      <span className="text-sm font-medium text-gray-600">→</span>
                      <EmpNameDisplay empId={empId} className="text-sm font-medium" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ID와 함께 표시 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">ID와 함께 표시 (showId=true)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testEmpIds.map((empId, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm text-gray-800">{empId || '(빈 값)'}</span>
                      <span className="text-sm font-medium text-gray-600">→</span>
                      <EmpNameDisplay
                        empId={empId}
                        showId={true}
                        className="text-sm font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 간단한 표시 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">간단한 표시 (SimpleEmpName)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testEmpIds.map((empId, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm text-gray-800">{empId || '(빈 값)'}</span>
                      <span className="text-sm font-medium text-gray-600">→</span>
                      <SimpleEmpName empId={empId} className="text-sm font-medium" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 툴팁 표시 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">툴팁 표시 (EmpNameWithTooltip)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testEmpIds.map((empId, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm text-gray-800">{empId || '(빈 값)'}</span>
                      <span className="text-sm font-medium text-gray-600">→</span>
                      <EmpNameWithTooltip empId={empId} className="text-sm font-medium" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 사용법 안내 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">사용법 안내</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>• <strong>기본 사용:</strong> &lt;EmpNameDisplay empId="EMP001" /&gt;</p>
                <p>• <strong>ID와 함께 표시:</strong> &lt;EmpNameDisplay empId="EMP001" showId={true} /&gt;</p>
                <p>• <strong>간단한 표시:</strong> &lt;SimpleEmpName empId="EMP001" /&gt;</p>
                <p>• <strong>툴팁 표시:</strong> &lt;EmpNameWithTooltip empId="EMP001" /&gt;</p>
                <p>• <strong>직접 캐시 사용:</strong> empNameCache.getEmpName("EMP001")</p>
              </div>
            </div>
          </div>
        </CmpSectionBody>
      </CmpSection>
    </PageWrapper>
  );
}
