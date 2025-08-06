'use client';

import { surveyAPI } from '@/app/core/services/api';
import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import { CmpButton, CmpInput, CmpSelect } from '@/app/shared/components/ui';
import { useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert, toast } from '@/app/shared/utils/ui_com';
import {
  AlertCircle,
  BarChart3,
  BarChartHorizontal,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HealthCheckManagementPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

  // 상태 관리
  const [surveys, setSurveys] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyResults, setSurveyResults] = useState(null);

  // 검색 및 필터
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  // 옵션 데이터
  const surveyTypeOptions = [
    { value: 'HEALTH_CHECK', label: '건강검진' },
    { value: 'SATISFACTION', label: '만족도조사' },
    { value: 'ETC', label: '기타' }
  ];

  const surveyStatusOptions = [
    { value: 'DRAFT', label: '작성중' },
    { value: 'ACTIVE', label: '진행중' },
    { value: 'CLOSED', label: '종료' },
    { value: 'ARCHIVED', label: '보관' }
  ];

  const filterStatusOptions = [
    { value: 'ALL', label: '전체' },
    { value: 'DRAFT', label: '작성중' },
    { value: 'ACTIVE', label: '진행중' },
    { value: 'CLOSED', label: '종료' },
    { value: 'ARCHIVED', label: '보관' }
  ];

  const filterTypeOptions = [
    { value: 'ALL', label: '전체' },
    { value: 'HEALTH_CHECK', label: '건강검진' },
    { value: 'SATISFACTION', label: '만족도조사' },
    { value: 'ETC', label: '기타' }
  ];

  // Query parameters
  const surveyQueryParams = {
    page: 1,
    size: 100,
    ...(searchKeyword && searchKeyword.trim() !== '' && { searchKeyword }),
    ...(filterStatus && filterStatus !== 'ALL' && { surveyStsCd: filterStatus }),
    ...(filterType && filterType !== 'ALL' && { surveyTyCd: filterType })
  };

  // 설문조사 목록 조회 쿼리
  const {
    data: surveyData,
    isLoading: surveyLoading,
    error: surveyError,
    refetch: refetchSurveys
  } = useQuery(
    ['survey-list', surveyQueryParams],
    () => surveyAPI.getSurveyList(surveyQueryParams),
    {
      cacheTime: 2 * 60 * 1000, // 2분 캐시
      retry: 3,
      refetchOnWindowFocus: false
    }
  );

  // 설문조사 삭제 뮤테이션
  const {
    mutate: deleteSurveyMutation,
    isLoading: deleteSurveyLoading,
    error: deleteSurveyError
  } = useMutation(
    'delete-survey',
    (surveySeq) => surveyAPI.deleteSurvey(surveySeq),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('설문조사가 성공적으로 삭제되었습니다.');
          refetchSurveys();
        } else {
          toast.callCommonToastOpen(response.message || '설문조사 삭제에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('설문조사 삭제 실패:', error);
        toast.callCommonToastOpen('설문조사 삭제 중 오류가 발생했습니다.');
      },
      invalidateQueries: [['survey-list']]
    }
  );

  // 설문조사 결과 조회 뮤테이션
  const {
    mutate: getSurveyResultsMutation,
    isLoading: getSurveyResultsLoading,
    error: getSurveyResultsError
  } = useMutation(
    'get-survey-results',
    (surveySeq) => surveyAPI.getSurveyResults(surveySeq),
    {
      onSuccess: (response) => {
        if (response.success) {
          setSurveyResults(response.data);
          setShowResultModal(true);
        } else {
          toast.callCommonToastOpen('설문조사 결과를 불러오는데 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('설문조사 결과 조회 실패:', error);
        toast.callCommonToastOpen('설문조사 결과를 불러오는데 실패했습니다.');
      }
    }
  );

  // 데이터 설정
  useEffect(() => {
    if (surveyData?.success) {
      const surveyList = surveyData.data?.content || surveyData.data || [];
      setSurveys(Array.isArray(surveyList) ? surveyList : []);
    }
  }, [surveyData]);

  // 설문조사 상세보기
  const viewSurvey = (survey) => {
    setMoveTo(`/admin/health-survey/${survey.surveySeq}`);
  };

  // 설문조사 수정
  const editSurvey = (survey) => {
    setMoveTo(`/admin/health-survey/${survey.surveySeq}/edit`);
  };

  const viewResults = (survey) => {
    setMoveTo(`/admin/health-survey/${survey.surveySeq}/results`);
  };

  // 새 설문조사 등록
  const createSurvey = () => {
    setMoveTo('/admin/health-survey/create');
  };

  // 검색 실행
  const handleSearch = () => {
    // Query will automatically refetch when parameters change
  };

  // 설문조사 삭제
  const deleteSurvey = (surveySeq) => {
    alert.ConfirmOpen('설문조사 삭제', '정말로 이 설문조사를 삭제하시겠습니까?', {
      okLabel: '삭제',
      cancelLabel: '취소',
      okCallback: () => {
        deleteSurveyMutation(surveySeq);
      }
    });
  };

  // 설문조사 결과 조회
  const loadSurveyResults = (surveySeq) => {
    getSurveyResultsMutation(surveySeq);
  };

  // 로딩 상태 통합
  const loading = surveyLoading || deleteSurveyLoading || getSurveyResultsLoading;

  // 에러 메시지 생성 함수
  const getErrorMessage = (error) => {
    if (!error) return '';

    if (typeof error === 'string') {
      return error;
    }

    if (error.type === 'response') {
      return `서버 오류 (${error.status}): ${error.message}`;
    } else if (error.type === 'network') {
      return '네트워크 연결 오류가 발생했습니다.';
    } else if (error.type === 'request') {
      return `요청 오류: ${error.message}`;
    }

    return error.message || '알 수 없는 오류가 발생했습니다.';
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
    const option = surveyTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  // 상태 라벨 반환
  const getStatusLabel = (status) => {
    const option = surveyStatusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <PageWrapper>
      {/* 에러 메시지 표시 */}
      {(surveyError || deleteSurveyError || getSurveyResultsError) && (
        <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-800 mb-1">오류가 발생했습니다:</div>
          <div className="text-sm text-red-600">
            {surveyError && <div>설문조사 목록: {getErrorMessage(surveyError)}</div>}
            {deleteSurveyError && <div>설문조사 삭제: {getErrorMessage(deleteSurveyError)}</div>}
            {getSurveyResultsError && <div>설문조사 결과 조회: {getErrorMessage(getSurveyResultsError)}</div>}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">건강검진 설문조사 관리</h1>
            <p className="text-gray-600 mt-1">건강검진 설문조사를 생성하고 관리합니다.</p>
          </div>
          <CmpButton
            onClick={() => setMoveTo('/admin/health-survey/create')}
            variant="primary"
            size="md"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            새 설문조사 등록
          </CmpButton>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <CmpInput
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="설문 제목 검색"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
            </div>
            <div>
              <CmpSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={filterStatusOptions}
              />
            </div>
            <div>
              <CmpSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={filterTypeOptions}
              />
            </div>
            <div>
              <CmpButton
                onClick={handleSearch}
                variant="primary"
                size="md"
                className="w-full"
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                검색
              </CmpButton>
            </div>
          </div>
        </div>

        {/* 설문조사 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">설문조사 목록</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : !surveys || surveys.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              등록된 설문조사가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      설문 제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      유형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      기간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      응답수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surveys && surveys.map((survey) => (
                    <tr key={survey.surveySeq} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {survey.surveyTtl}
                        </div>
                        {survey.surveyDesc && (
                          <div className="text-sm text-gray-500 mt-1">
                            {survey.surveyDesc}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getSurveyTypeLabel(survey.surveyTyCd)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(survey.surveyStsCd)}`}>
                          {getStatusIcon(survey.surveyStsCd)}
                          <span className="ml-1">{getStatusLabel(survey.surveyStsCd)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(survey.surveySttDt)} ~ {formatDate(survey.surveyEndDt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {survey.responseCnt || 0}명
                          {survey.responseRate && (
                            <span className="ml-1 text-gray-500">
                              ({survey.responseRate}%)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(survey.regDt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <CmpButton
                            onClick={() => viewSurvey(survey)}
                            variant="textPrimary"
                            size="sm"
                            title="상세보기"
                            disabled={loading}
                          >
                            <Eye className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => editSurvey(survey)}
                            variant="textSuccess"
                            size="sm"
                            title="수정"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => viewResults(survey)}
                            variant="textInfo"
                            size="sm"
                            title="결과보기"
                            disabled={loading}
                          >
                            <BarChartHorizontal className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => loadSurveyResults(survey.surveySeq)}
                            variant="text"
                            size="sm"
                            title="결과보기"
                            disabled={loading}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => deleteSurvey(survey.surveySeq)}
                            variant="textDanger"
                            size="sm"
                            title="삭제"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </CmpButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
