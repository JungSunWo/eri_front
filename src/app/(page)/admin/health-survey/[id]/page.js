'use client';

import { usePageMoveStore } from '@/common/store/pageMoveStore';
import { toast } from '@/common/ui_com';
import PageWrapper from '@/components/layout/PageWrapper';
import { CmpButton } from '@/components/ui';
import { surveyAPI } from '@/lib/api';
import {
    AlertCircle,
    ArrowLeft,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    FileText,
    Users,
    XCircle
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SurveyDetailPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const params = useParams();
  const surveySeq = params.id;

  // 상태 관리
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 설문조사 상세 조회
  const loadSurveyDetail = async () => {
    setLoading(true);
    try {
      console.log('설문조사 상세 조회 시작: surveySeq =', surveySeq);
      const response = await surveyAPI.getSurveyDetail(surveySeq);
      console.log('설문조사 상세 조회 응답:', response);

      if (response.success) {
        setSurvey(response.data);
        setQuestions(response.data.questions || []);
        console.log('설문조사 데이터 설정 완료:', response.data);
      } else {
        console.error('설문조사 상세 조회 실패:', response.message);
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

  // 설문조사 수정
  const editSurvey = () => {
    setMoveTo(`/admin/health-survey/${surveySeq}/edit`);
  };

  // 설문조사 결과 조회
  const viewResults = () => {
    setMoveTo(`/admin/health-survey/${surveySeq}/results`);
  };

  // 뒤로가기
  const goBack = () => {
    setMoveTo('/admin/health-survey');
  };

  // 상태 아이콘 반환
  const getStatusIcon = (status) => {
    switch (status) {
      case 'DRAFT':
        return <FileText className="w-4 h-4" />;
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      case 'ARCHIVED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // 상태 배지 색상 반환
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'ARCHIVED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 설문 유형 라벨 반환
  const getSurveyTypeLabel = (type) => {
    const typeMap = {
      'HEALTH_CHECK': '건강검진',
      'SATISFACTION': '만족도조사',
      'ETC': '기타'
    };
    return typeMap[type] || type;
  };

  // 상태 라벨 반환
  const getStatusLabel = (status) => {
    const statusMap = {
      'DRAFT': '작성중',
      'ACTIVE': '진행중',
      'CLOSED': '종료',
      'ARCHIVED': '보관'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    if (surveySeq) {
      loadSurveyDetail();
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

  if (!survey) {
    return (
      <PageWrapper>
        <div className="text-center py-8">
          <p className="text-gray-500">설문조사를 찾을 수 없습니다.</p>
          <CmpButton
            onClick={goBack}
            variant="primary"
            size="md"
            className="mt-4"
          >
            목록으로 돌아가기
          </CmpButton>
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
              <h1 className="text-2xl font-bold text-gray-900">{survey.surveyTtl}</h1>
              <p className="text-gray-600 mt-1">설문조사 상세 정보</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <CmpButton
              onClick={editSurvey}
              variant="success"
              size="md"
            >
              <Edit className="w-4 h-4 mr-2" />
              수정
            </CmpButton>
            <CmpButton
              onClick={viewResults}
              variant="info"
              size="md"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              결과보기
            </CmpButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 설문 기본 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">설문 정보</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(survey.surveyStsCd)}`}>
                    {getStatusIcon(survey.surveyStsCd)}
                    <span className="ml-1">{getStatusLabel(survey.surveyStsCd)}</span>
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getSurveyTypeLabel(survey.surveyTyCd)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  <p className="text-sm text-gray-900">
                    {survey.surveyDesc || '설명이 없습니다.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기간</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {formatDate(survey.surveySttDt)} ~ {formatDate(survey.surveyEndDt)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">소요시간</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    {survey.surveyDurMin}분
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">응답 현황</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    {survey.responseCnt || 0}명
                    {survey.responseRate && (
                      <span className="ml-1 text-gray-500">
                        ({survey.responseRate}%)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">옵션</label>
                  <div className="space-y-1 text-sm text-gray-900">
                    <div>익명 응답: {survey.anonymousYn === 'Y' ? '예' : '아니오'}</div>
                    <div>중복 응답: {survey.duplicateYn === 'Y' ? '허용' : '불허'}</div>
                    {survey.maxResponseCnt && (
                      <div>최대 응답 수: {survey.maxResponseCnt}명</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">등록 정보</label>
                  <div className="text-sm text-gray-900">
                    <div>등록일: {formatDate(survey.regDt)}</div>
                    {survey.modDt && (
                      <div>수정일: {formatDate(survey.modDt)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 질문 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  질문 목록 ({questions.length}개)
                </h2>
              </div>

              {questions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  등록된 질문이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {questions.map((question, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {question.questionOrd}. {question.questionTtl}
                          </h3>
                          {question.questionDesc && (
                            <p className="text-sm text-gray-600 mt-1">
                              {question.questionDesc}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {question.questionTyCd === 'SINGLE_CHOICE' ? '단일선택' : '다중선택'}
                          </span>
                          {question.requiredYn === 'Y' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              필수
                            </span>
                          )}
                        </div>
                      </div>

                      {question.choices && question.choices.length > 0 && (
                        <div className="space-y-2">
                          {question.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center mr-3">
                                  {choice.choiceOrd}
                                </span>
                                <span className="text-sm text-gray-900">
                                  {choice.choiceTtl}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {choice.choiceScore && (
                                  <span className="text-xs text-gray-500">
                                    점수: {choice.choiceScore}
                                  </span>
                                )}
                                {choice.choiceValue && (
                                  <span className="text-xs text-gray-500">
                                    값: {choice.choiceValue}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
