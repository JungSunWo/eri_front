'use client';

import { usePageMoveStore } from '@/common/store/pageMoveStore';
import { toast } from '@/common/ui_com';
import PageWrapper from '@/components/layout/PageWrapper';
import { CmpButton } from '@/components/ui';
import { surveyAPI } from '@/lib/api';
import {
    ArrowLeft,
    BarChart3,
    Download,
    TrendingUp,
    Users
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SurveyResultsPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const params = useParams();
  const surveySeq = params.id;

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState(null);
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({
    totalResponses: 0,
    responseRate: 0,
    averageScore: 0,
    questionStats: []
  });

  // 설문조사 상세 조회
  const loadSurveyDetail = async () => {
    setLoading(true);
    try {
      const response = await surveyAPI.getSurveyDetail(surveySeq);
      if (response.success) {
        setSurvey(response.data);
      } else {
        toast.callCommonToastOpen('설문조사 정보를 불러오는데 실패했습니다.');
        setMoveTo('/admin/health-survey');
      }
    } catch (error) {
      console.error('설문조사 상세 조회 오류:', error);
      toast.callCommonToastOpen('설문조사 정보를 불러오는데 실패했습니다.');
      setMoveTo('/admin/health-survey');
    } finally {
      setLoading(false);
    }
  };

  // 설문조사 결과 조회
  const loadSurveyResults = async () => {
    try {
      const response = await surveyAPI.getSurveyResults(surveySeq);
      if (response.success) {
        console.log('설문조사 결과 응답:', response.data);
        setResults(response.data.responses || []);
        setStatistics(response.data.statistics || {
          totalResponses: 0,
          responseRate: 0,
          averageScore: 0,
          questionStats: []
        });
      } else {
        toast.callCommonToastOpen('설문조사 결과를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('설문조사 결과 조회 오류:', error);
      toast.callCommonToastOpen('설문조사 결과를 불러오는데 실패했습니다.');
    }
  };

  // 뒤로가기
  const goBack = () => {
    setMoveTo('/admin/health-survey');
  };

  // 결과 내보내기
  const exportResults = () => {
    // TODO: 결과 내보내기 기능 구현
    toast.callCommonToastOpen('결과 내보내기 기능은 준비 중입니다.');
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (surveySeq) {
      loadSurveyDetail();
      loadSurveyResults();
    }
  }, [surveySeq]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-2 text-gray-600">로딩 중...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CmpButton
              onClick={goBack}
              variant="text"
              size="md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </CmpButton>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">설문조사 결과</h1>
              <p className="text-gray-600 mt-1">설문조사 응답 결과를 확인합니다.</p>
            </div>
          </div>
          <CmpButton
            onClick={exportResults}
            variant="secondary"
            size="md"
          >
            <Download className="w-4 h-4 mr-2" />
            결과 내보내기
          </CmpButton>
        </div>

        {/* 설문조사 정보 */}
        {survey && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">설문조사 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">설문 제목</label>
                <p className="mt-1 text-sm text-gray-900">{survey.surveyTtl}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">설문 기간</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(survey.surveySttDt)} ~ {formatDate(survey.surveyEndDt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">예상 소요시간</label>
                <p className="mt-1 text-sm text-gray-900">{survey.surveyDurMin}분</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">설문 상태</label>
                <p className="mt-1 text-sm text-gray-900">{survey.surveyStsCd}</p>
              </div>
            </div>
          </div>
        )}

        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">총 응답수</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalResponses}명</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">응답률</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.responseRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">평균 점수</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.averageScore.toFixed(1)}점</p>
              </div>
            </div>
          </div>
        </div>

        {/* 질문별 통계 */}
        {survey && survey.questions && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">질문별 통계</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {survey.questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {index + 1}. {question.questionTtl}
                      </h3>
                      {question.questionDesc && (
                        <p className="text-sm text-gray-600 mt-1">{question.questionDesc}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span>유형: {question.questionTyCd === 'SINGLE_CHOICE' ? '단일선택' : '다중선택'}</span>
                        <span>필수: {question.requiredYn === 'Y' ? '예' : '아니오'}</span>
                      </div>
                    </div>

                    {/* 선택지별 통계 */}
                    {question.choices && (
                      <div className="space-y-3">
                        {question.choices.map((choice, choiceIndex) => {
                          const choiceStats = statistics.questionStats?.find(
                            stat => stat.questionSeq === question.questionSeq &&
                                   stat.choiceSeq === choice.choiceSeq
                          );
                          const responseCount = choiceStats?.responseCount || 0;
                          const percentage = statistics.totalResponses > 0
                            ? ((responseCount / statistics.totalResponses) * 100).toFixed(1)
                            : 0;

                          return (
                            <div key={choiceIndex} className="flex items-center space-x-4">
                              <div className="flex-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-900">{choice.choiceTtl}</span>
                                  <span className="text-gray-600">{responseCount}명 ({percentage}%)</span>
                                </div>
                                <div className="mt-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 w-16 text-right">
                                {choice.choiceScore}점
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 응답 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">응답 목록</h2>
          </div>
          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                아직 응답이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((response, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          응답 #{response.responseSeq}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatDate(response.regDt)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        총점: {response.totalScore || 0}점
                      </div>
                    </div>

                    {/* 응답 내용 */}
                    <div className="space-y-2">
                      {response.answers && response.answers.map((answer, answerIndex) => (
                        <div key={answerIndex} className="text-sm">
                          <span className="font-medium text-gray-700">
                            Q{answer.questionSeq}.
                          </span>
                          <span className="text-gray-900">{answer.answerText || answer.selectedChoices?.join(', ')}</span>
                          {answer.score && (
                            <span className="ml-2 text-gray-500">({answer.score}점)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
