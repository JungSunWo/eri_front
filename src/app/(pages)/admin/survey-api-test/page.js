'use client'

import { surveyAPI } from '@/app/core/services/api';
import { CmpButton } from '@/app/shared/components/ui';
import { useState } from 'react';

export default function SurveyApiTestPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState('');

  // API 테스트 결과 로그
  const logTest = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResult(prev => `${prev}[${timestamp}] ${message}\n`);
  };

  // 1. 설문조사 목록 조회 테스트
  const testGetSurveyList = async () => {
    setLoading(true);
    logTest('=== 설문조사 목록 조회 테스트 시작 ===');

    try {
      const response = await surveyAPI.getSurveyList({
        page: 1,
        size: 10
      });

      logTest(`응답 성공: ${JSON.stringify(response, null, 2)}`);
      setSurveys(response.data || []);
    } catch (error) {
      logTest(`에러 발생: ${error.message}`);
      console.error('API 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. 설문조사 생성 테스트
  const testCreateSurvey = async () => {
    logTest('=== 설문조사 생성 테스트 시작 ===');

    const testSurvey = {
      surveyTtl: `테스트 설문조사 ${new Date().getTime()}`,
      surveyDesc: 'API 테스트용 설문조사입니다.',
      surveyTyCd: 'HEALTH_CHECK',
      surveyStsCd: 'DRAFT',
      surveySttDt: '2025-01-01',
      surveyEndDt: '2025-12-31',
      surveyDurMin: 15,
      anonymousYn: 'Y',
      duplicateYn: 'N',
      targetEmpTyCd: 'ALL'
    };

    try {
      const response = await surveyAPI.createSurvey(testSurvey);
      logTest(`생성 응답: ${JSON.stringify(response, null, 2)}`);

      if (response.success) {
        logTest(`설문조사 생성 성공: surveySeq = ${response.surveySeq}`);
        // 생성 후 목록 다시 조회
        setTimeout(testGetSurveyList, 1000);
      }
    } catch (error) {
      logTest(`생성 에러: ${error.message}`);
      console.error('생성 에러:', error);
    }
  };

  // 3. 설문조사 수정 테스트
  const testUpdateSurvey = async () => {
    if (surveys.length === 0) {
      logTest('수정할 설문조사가 없습니다. 먼저 설문조사를 생성해주세요.');
      return;
    }

    logTest('=== 설문조사 수정 테스트 시작 ===');

    const surveyToUpdate = surveys[0];
    const updateData = {
      surveyTtl: `${surveyToUpdate.surveyTtl} (수정됨)`,
      surveyDesc: 'API 테스트로 수정된 설문조사입니다.',
      surveyStsCd: 'ACTIVE'
    };

    try {
      const response = await surveyAPI.updateSurvey(surveyToUpdate.surveySeq, updateData);
      logTest(`수정 응답: ${JSON.stringify(response, null, 2)}`);

      if (response.success) {
        logTest('설문조사 수정 성공');
        // 수정 후 목록 다시 조회
        setTimeout(testGetSurveyList, 1000);
      }
    } catch (error) {
      logTest(`수정 에러: ${error.message}`);
      console.error('수정 에러:', error);
    }
  };

  // 4. 설문조사 삭제 테스트
  const testDeleteSurvey = async () => {
    if (surveys.length === 0) {
      logTest('삭제할 설문조사가 없습니다.');
      return;
    }

    logTest('=== 설문조사 삭제 테스트 시작 ===');

    const surveyToDelete = surveys[0];

    if (!window.confirm(`정말로 "${surveyToDelete.surveyTtl}" 설문조사를 삭제하시겠습니까?`)) {
      logTest('삭제가 취소되었습니다.');
      return;
    }

    try {
      const response = await surveyAPI.deleteSurvey(surveyToDelete.surveySeq);
      logTest(`삭제 응답: ${JSON.stringify(response, null, 2)}`);

      if (response.success) {
        logTest('설문조사 삭제 성공');
        // 삭제 후 목록 다시 조회
        setTimeout(testGetSurveyList, 1000);
      }
    } catch (error) {
      logTest(`삭제 에러: ${error.message}`);
      console.error('삭제 에러:', error);
    }
  };

  // 5. 설문조사 결과 조회 테스트
  const testGetSurveyResults = async () => {
    if (surveys.length === 0) {
      logTest('결과를 조회할 설문조사가 없습니다.');
      return;
    }

    logTest('=== 설문조사 결과 조회 테스트 시작 ===');

    const surveyToCheck = surveys[0];

    try {
      const response = await surveyAPI.getSurveyResults(surveyToCheck.surveySeq);
      logTest(`결과 조회 응답: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      logTest(`결과 조회 에러: ${error.message}`);
      console.error('결과 조회 에러:', error);
    }
  };

  // 6. 전체 테스트 실행
  const runAllTests = async () => {
    logTest('=== 전체 API 테스트 시작 ===');
    setTestResult('');

    await testGetSurveyList();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testCreateSurvey();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testUpdateSurvey();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testGetSurveyResults();
    await new Promise(resolve => setTimeout(resolve, 1000));

    logTest('=== 전체 테스트 완료 ===');
  };

  // 7. 로그 초기화
  const clearLog = () => {
    setTestResult('');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">📊 설문조사 API 테스트</h1>
        <p className="text-gray-600">백엔드 API 연동 테스트를 위한 페이지입니다.</p>
      </div>

      {/* 테스트 버튼들 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <CmpButton
          onClick={testGetSurveyList}
          styleType="primary"
          size="h40"
          label="목록 조회"
          disabled={loading}
        />
        <CmpButton
          onClick={testCreateSurvey}
          styleType="primary"
          size="h40"
          label="생성 테스트"
          disabled={loading}
        />
        <CmpButton
          onClick={testUpdateSurvey}
          styleType="secondary"
          size="h40"
          label="수정 테스트"
          disabled={loading}
        />
        <CmpButton
          onClick={testDeleteSurvey}
          styleType="secondary"
          size="h40"
          label="삭제 테스트"
          disabled={loading}
        />
        <CmpButton
          onClick={testGetSurveyResults}
          styleType="secondary"
          size="h40"
          label="결과 조회"
          disabled={loading}
        />
        <CmpButton
          onClick={runAllTests}
          styleType="primary"
          size="h40"
          label="전체 테스트"
          disabled={loading}
        />
        <CmpButton
          onClick={clearLog}
          styleType="secondary"
          size="h40"
          label="로그 초기화"
        />
      </div>

      {/* 현재 설문조사 목록 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📋 현재 설문조사 목록</h2>
        <div className="bg-white rounded-lg shadow p-4">
          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : surveys.length > 0 ? (
            <div className="space-y-2">
              {surveys.map((survey, index) => (
                <div key={survey.surveySeq || index} className="border-b pb-2">
                  <div className="font-medium">{survey.surveyTtl}</div>
                  <div className="text-sm text-gray-600">
                    상태: {survey.surveyStsCd} |
                    유형: {survey.surveyTyCd} |
                    응답수: {survey.responseCnt || 0}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">설문조사가 없습니다.</div>
          )}
        </div>
      </div>

      {/* 테스트 로그 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📝 테스트 로그</h2>
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap overflow-auto max-h-96">
            {testResult || '테스트를 실행하면 로그가 여기에 표시됩니다.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
