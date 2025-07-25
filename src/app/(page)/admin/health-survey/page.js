'use client';

import { displayToast } from '@/common/com_util';
import { usePageMoveStore } from '@/common/store/pageMoveStore';
import PageWrapper from '@/components/layout/PageWrapper';
import { CmpButton, CmpInput, CmpSelect } from '@/components/ui';
import { surveyAPI } from '@/lib/api';
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
  const [loading, setLoading] = useState(true);
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

  // 설문조사 목록 조회
  const loadSurveys = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        size: 100
      };

      // null이 아닌 값만 파라미터에 추가
      if (searchKeyword && searchKeyword.trim() !== '') {
        params.searchKeyword = searchKeyword;
      }
      if (filterStatus && filterStatus !== 'ALL') {
        params.surveyStsCd = filterStatus;
      }
      if (filterType && filterType !== 'ALL') {
        params.surveyTyCd = filterType;
      }

      console.log('설문조사 목록 조회 파라미터:', params);
      const response = await surveyAPI.getSurveyList(params);
      console.log('설문조사 목록 응답:', response);

      if (response.success) {
        // 백엔드에서 PageResponseDto를 반환하므로 content 배열을 가져옴
        const surveyData = response.data?.content || response.data || [];
        console.log('설문조사 데이터:', surveyData);
        setSurveys(Array.isArray(surveyData) ? surveyData : []);
      } else {
        console.error('설문조사 목록 조회 실패:', response.message);
        displayToast('설문조사 목록을 불러오는데 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('설문조사 목록 조회 오류:', error);
      displayToast('설문조사 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 설문조사 삭제
  const deleteSurvey = async (surveySeq) => {
    if (!confirm('정말로 이 설문조사를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await surveyAPI.deleteSurvey(surveySeq);
      if (response.success) {
        displayToast('설문조사가 삭제되었습니다.', 'success');
        loadSurveys();
      } else {
        displayToast('설문조사 삭제에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('설문조사 삭제 오류:', error);
      displayToast('설문조사 삭제에 실패했습니다.', 'error');
    }
  };

  // 설문조사 결과 조회
  const loadSurveyResults = async (surveySeq) => {
    try {
      const response = await surveyAPI.getSurveyResults(surveySeq);
      if (response.success) {
        setSurveyResults(response.data);
        setShowResultModal(true);
      } else {
        displayToast('설문조사 결과를 불러오는데 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('설문조사 결과 조회 오류:', error);
      displayToast('설문조사 결과를 불러오는데 실패했습니다.', 'error');
    }
  };

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
    loadSurveys();
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

  useEffect(() => {
    loadSurveys();
  }, []);

  return (
    <PageWrapper>
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
                          >
                            <Eye className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => editSurvey(survey)}
                            variant="textSuccess"
                            size="sm"
                            title="수정"
                          >
                            <Edit className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => viewResults(survey)}
                            variant="textInfo"
                            size="sm"
                            title="결과보기"
                          >
                            <BarChartHorizontal className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => loadSurveyResults(survey.surveySeq)}
                            variant="text"
                            size="sm"
                            title="결과보기"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </CmpButton>
                          <CmpButton
                            onClick={() => deleteSurvey(survey.surveySeq)}
                            variant="textDanger"
                            size="sm"
                            title="삭제"
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
