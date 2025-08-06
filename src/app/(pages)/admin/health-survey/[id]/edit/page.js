'use client';

import { surveyAPI } from '@/app/core/services/api';
import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import { CmpButton, CmpInput, CmpSelect, CmpTextarea } from '@/app/shared/components/ui';
import { useMutation, useQuery } from '@/app/shared/hooks/useQuery';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { alert, toast } from '@/app/shared/utils/ui_com';
import {
  ArrowLeft,
  Edit,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function EditSurveyPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const params = useParams();
  const surveySeq = params.id;

  // 상태 관리
  const [saving, setSaving] = useState(false);

  // 폼 데이터
  const [surveyForm, setSurveyForm] = useState({
    surveyTtl: '',
    surveyDesc: '',
    surveyTyCd: 'HEALTH_CHECK',
    surveyStsCd: 'DRAFT',
    surveySttDt: '',
    surveyEndDt: '',
    surveyDurMin: 15,
    anonymousYn: 'N',
    duplicateYn: 'N',
    maxResponseCnt: null,
    targetEmpTyCd: 'ALL'
  });

  // 질문 데이터
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionTtl: '',
    questionDesc: '',
    questionTyCd: 'SINGLE_CHOICE',
    questionOrd: 1,
    requiredYn: 'Y',
    choices: [
      { choiceTtl: '', choiceOrd: 1, choiceScore: 10 },
      { choiceTtl: '', choiceOrd: 2, choiceScore: 10 },
      { choiceTtl: '', choiceOrd: 3, choiceScore: 10 },
      { choiceTtl: '', choiceOrd: 4, choiceScore: 10 },
      { choiceTtl: '', choiceOrd: 5, choiceScore: 10 }
    ]
  });

  // 질문 유형 옵션
  const questionTypeOptions = [
    { value: 'SINGLE_CHOICE', label: '단일선택' },
    { value: 'MULTIPLE_CHOICE', label: '다중선택' }
  ];

  // 설문조사 상태 옵션
  const surveyStatusOptions = [
    { value: 'DRAFT', label: '임시저장' },
    { value: 'ACTIVE', label: '진행중' },
    { value: 'PAUSED', label: '일시중지' },
    { value: 'COMPLETED', label: '완료' },
    { value: 'CLOSED', label: '종료' }
  ];

  // 설문조사 유형 옵션
  const surveyTypeOptions = [
    { value: 'HEALTH_CHECK', label: '건강검진' },
    { value: 'SATISFACTION', label: '만족도조사' },
    { value: 'OPINION', label: '의견조사' },
    { value: 'OTHER', label: '기타' }
  ];

  // 설문조사 상세 조회 쿼리
  const {
    data: surveyData,
    isLoading: surveyLoading,
    error: surveyError,
    refetch: refetchSurvey
  } = useQuery(
    ['survey-detail', surveySeq],
    () => surveyAPI.getSurveyDetail(surveySeq),
    {
      cacheTime: 5 * 60 * 1000, // 5분 캐시
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: !!surveySeq
    }
  );

  // 설문조사 수정 뮤테이션
  const {
    mutate: updateSurveyMutation,
    isLoading: updateSurveyLoading,
    error: updateSurveyError
  } = useMutation(
    'update-survey',
    (surveyData) => surveyAPI.updateSurvey(surveySeq, surveyData),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.callCommonToastOpen('설문조사가 성공적으로 수정되었습니다.');
          setMoveTo(`/admin/health-survey/${surveySeq}`);
        } else {
          toast.callCommonToastOpen(response.message || '설문조사 수정에 실패했습니다.');
        }
      },
      onError: (error) => {
        console.error('설문조사 수정 실패:', error);
        toast.callCommonToastOpen('설문조사 수정 중 오류가 발생했습니다.');
      }
    }
  );

  // 데이터 설정
  useEffect(() => {
    if (surveyData?.success) {
      const survey = surveyData.data;

      // 폼 데이터 설정
      setSurveyForm({
        surveyTtl: survey.surveyTtl,
        surveyDesc: survey.surveyDesc || '',
        surveyTyCd: survey.surveyTyCd,
        surveyStsCd: survey.surveyStsCd || 'DRAFT',
        surveySttDt: survey.surveySttDt ? survey.surveySttDt.split('T')[0] : '',
        surveyEndDt: survey.surveyEndDt ? survey.surveyEndDt.split('T')[0] : '',
        surveyDurMin: survey.surveyDurMin || 15,
        anonymousYn: survey.anonymousYn || 'N',
        duplicateYn: survey.duplicateYn || 'N',
        maxResponseCnt: survey.maxResponseCnt,
        targetEmpTyCd: survey.targetEmpTyCd || 'ALL'
      });

      // 질문 데이터 설정
      setQuestions(survey.questions || []);
    } else if (surveyData && !surveyData.success) {
      console.error('설문조사 상세 조회 실패:', surveyData.message);
      toast.callCommonToastOpen('설문조사 정보를 불러오는데 실패했습니다.');
      setMoveTo('/admin/health-survey');
    }
  }, [surveyData, setMoveTo]);

  // 설문조사 수정
  const updateSurvey = () => {
    if (!surveyForm.surveyTtl.trim()) {
      toast.callCommonToastOpen('설문 제목을 입력해주세요.');
      return;
    }

    // 질문별 선택지 검증
    const invalidQuestions = questions.filter(q =>
      q.choices.filter(choice => !choice.choiceTtl.trim()).length > 0
    );

    if (invalidQuestions.length > 0) {
      toast.callCommonToastOpen('모든 질문의 선택지를 입력해주세요.');
      return;
    }

    const surveyData = {
      ...surveyForm,
      questions: questions
    };

    updateSurveyMutation(surveyData);
  };

  // 질문 추가
  const addQuestion = () => {
    if (!currentQuestion.questionTtl.trim()) {
      toast.callCommonToastOpen('질문 제목을 입력해주세요.');
      return;
    }

    if (currentQuestion.questionTyCd === 'MULTIPLE_CHOICE') {
      const emptyChoices = currentQuestion.choices.filter(choice => !choice.choiceTtl.trim());
      if (emptyChoices.length > 0) {
        toast.callCommonToastOpen('모든 선택지를 입력해주세요.');
        return;
      }
    }

    setQuestions([...questions, { ...currentQuestion, questionSeq: Date.now() }]);
    setCurrentQuestion({
      questionTtl: '',
      questionTyCd: 'SINGLE_CHOICE',
      choices: [
        { choiceTtl: '', choiceSeq: 1 },
        { choiceTtl: '', choiceSeq: 2 }
      ]
    });
  };

  // 질문 삭제
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    // 순서 재정렬
    const reorderedQuestions = newQuestions.map((q, i) => ({
      ...q,
      questionOrd: i + 1
    }));
    setQuestions(reorderedQuestions);
  };

  // 질문 수정 상태 관리
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const questionTitleRef = useRef(null);

  // 질문 수정
  const editQuestion = (index) => {
    console.log('질문 수정 시작:', index);
    setEditingQuestionIndex(index);
    setCurrentQuestion({
      ...questions[index],
      choices: [...questions[index].choices] // 선택지 복사
    });
    setIsEditingQuestion(true);

    // 다음 렌더링 후 포커스 이동
    setTimeout(() => {
      console.log('포커스 이동 시도:', questionTitleRef.current);
      if (questionTitleRef.current) {
        questionTitleRef.current.focus();
        console.log('포커스 이동 완료');
      } else {
        console.log('ref가 null입니다');
      }
    }, 100);
  };

  // 질문 수정 취소
  const cancelEditQuestion = () => {
    setIsEditingQuestion(false);
    setEditingQuestionIndex(null);
    // 원래 질문 데이터로 복원
    if (editingQuestionIndex !== null) {
      setQuestions(questions.map((q, i) => (i === editingQuestionIndex ? questions[editingQuestionIndex] : q)));
    }
  };

  // 질문 수정 저장
  const saveEditQuestion = () => {
    if (currentQuestion.questionTtl.trim() === '') {
      toast.callCommonToastOpen('질문 제목을 입력해주세요.');
      return;
    }

    const updatedQuestions = questions.map(q =>
      q.questionSeq === currentQuestion.questionSeq ? currentQuestion : q
    );
    setQuestions(updatedQuestions);
    setIsEditingQuestion(false);
    setEditingQuestionIndex(null);

    // 새 질문 입력 폼 초기화
    setCurrentQuestion({
      questionTtl: '',
      questionDesc: '',
      questionTyCd: 'SINGLE_CHOICE',
      questionOrd: questions.length + 1,
      requiredYn: 'Y',
      choices: [
        { choiceTtl: '', choiceOrd: 1, choiceScore: 10 },
        { choiceTtl: '', choiceOrd: 2, choiceScore: 10 },
        { choiceTtl: '', choiceOrd: 3, choiceScore: 10 },
        { choiceTtl: '', choiceOrd: 4, choiceScore: 10 },
        { choiceTtl: '', choiceOrd: 5, choiceScore: 10 }
      ]
    });

    toast.callCommonToastOpen('질문이 수정되었습니다.');
  };

  // 선택지 업데이트
  const updateChoice = (index, field, value) => {
    const updatedChoices = [...currentQuestion.choices];
    updatedChoices[index] = { ...updatedChoices[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, choices: updatedChoices });
  };

  // 뒤로가기
  const goBack = () => {
    if (questions.length > 0 || surveyForm.surveyTtl.trim()) {
      alert.ConfirmOpen('페이지 이동', '작성 중인 내용이 있습니다. 정말로 나가시겠습니까?', {
        okLabel: '나가기',
        cancelLabel: '취소',
        okCallback: () => {
          setMoveTo('/admin/health-survey');
        }
      });
    } else {
      setMoveTo('/admin/health-survey');
    }
  };

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

  // 로딩 상태 통합
  const loading = surveyLoading || updateSurveyLoading;

  if (surveyLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-2 text-gray-600">로딩 중...</p>
        </div>
      </PageWrapper>
    );
  }

  if (surveyError) {
    return (
      <PageWrapper>
        <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-800 mb-1">오류가 발생했습니다:</div>
          <div className="text-sm text-red-600">
            설문조사 상세 조회: {getErrorMessage(surveyError)}
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">설문조사를 불러오는데 실패했습니다.</p>
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
      {/* 에러 메시지 표시 */}
      {updateSurveyError && (
        <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-800 mb-1">오류가 발생했습니다:</div>
          <div className="text-sm text-red-600">
            설문조사 수정: {getErrorMessage(updateSurveyError)}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CmpButton
              onClick={goBack}
              variant="text"
              size="md"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </CmpButton>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">설문조사 수정</h1>
              <p className="text-gray-600 mt-1">설문조사 정보를 수정합니다.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <CmpButton
              onClick={goBack}
              variant="secondary"
              size="md"
              disabled={loading}
            >
              취소
            </CmpButton>
            <CmpButton
              onClick={updateSurvey}
              variant="primary"
              size="md"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateSurveyLoading ? '저장 중...' : '저장'}
            </CmpButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 설문 기본 정보 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">설문 기본 정보</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설문 제목 *
                </label>
                <CmpInput
                  value={surveyForm.surveyTtl}
                  onChange={(e) => setSurveyForm({ ...surveyForm, surveyTtl: e.target.value })}
                  placeholder="설문 제목을 입력하세요"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설문 설명
                </label>
                <CmpTextarea
                  value={surveyForm.surveyDesc}
                  onChange={(e) => setSurveyForm({ ...surveyForm, surveyDesc: e.target.value })}
                  rows={3}
                  placeholder="설문에 대한 설명을 입력하세요"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설문 유형 *
                  </label>
                  <CmpSelect
                    value={surveyForm.surveyTyCd}
                    onChange={(e) => setSurveyForm({ ...surveyForm, surveyTyCd: e.target.value })}
                    options={surveyTypeOptions}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설문 상태
                  </label>
                  <CmpSelect
                    value={surveyForm.surveyStsCd}
                    onChange={(value) => setSurveyForm({ ...surveyForm, surveyStsCd: value })}
                    options={surveyStatusOptions}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예상 소요시간 (분)
                </label>
                <CmpInput
                  type="number"
                  value={surveyForm.surveyDurMin}
                  onChange={(e) => setSurveyForm({ ...surveyForm, surveyDurMin: parseInt(e.target.value) || 15 })}
                  min="1"
                  max="120"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <CmpInput
                    type="date"
                    value={surveyForm.surveySttDt}
                    onChange={(e) => setSurveyForm({ ...surveyForm, surveySttDt: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <CmpInput
                    type="date"
                    value={surveyForm.surveyEndDt}
                    onChange={(e) => setSurveyForm({ ...surveyForm, surveyEndDt: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    옵션
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={surveyForm.anonymousYn === 'Y'}
                        onChange={(e) => setSurveyForm({ ...surveyForm, anonymousYn: e.target.checked ? 'Y' : 'N' })}
                        className="mr-2"
                        disabled={loading}
                      />
                      익명 응답
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={surveyForm.duplicateYn === 'Y'}
                        onChange={(e) => setSurveyForm({ ...surveyForm, duplicateYn: e.target.checked ? 'Y' : 'N' })}
                        className="mr-2"
                        disabled={loading}
                      />
                      중복 응답 허용
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 응답 수
                  </label>
                  <CmpInput
                    type="number"
                    value={surveyForm.maxResponseCnt || ''}
                    onChange={(e) => setSurveyForm({ ...surveyForm, maxResponseCnt: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="제한 없음"
                    min="1"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 질문 관리 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              질문 관리 ({questions.length}/18)
            </h2>

            {/* 등록된 질문 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">등록된 질문</h3>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{index + 1}. {question.questionTtl}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {questionTypeOptions.find(opt => opt.value === question.questionTyCd)?.label || question.questionTyCd}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <CmpButton
                        onClick={() => editQuestion(index)}
                        variant="text"
                        size="sm"
                        title="수정"
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </CmpButton>
                      <CmpButton
                        onClick={() => removeQuestion(index)}
                        variant="textDanger"
                        size="sm"
                        title="삭제"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </CmpButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 질문 수정 모드 */}
            {isEditingQuestion && (
              console.log('질문 수정 모드 렌더링:', isEditingQuestion, editingQuestionIndex),
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-yellow-800">질문 수정</h3>
                  <CmpButton
                    onClick={cancelEditQuestion}
                    variant="text"
                    size="sm"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </CmpButton>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      질문 제목 *
                    </label>
                    <CmpInput
                      ref={questionTitleRef}
                      value={currentQuestion.questionTtl}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionTtl: e.target.value })}
                      placeholder="질문을 입력하세요"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      질문 설명
                    </label>
                    <CmpTextarea
                      value={currentQuestion.questionDesc}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionDesc: e.target.value })}
                      rows={2}
                      placeholder="질문에 대한 추가 설명"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        질문 유형
                      </label>
                      <CmpSelect
                        value={currentQuestion.questionTyCd}
                        onChange={(value) => setCurrentQuestion({ ...currentQuestion, questionTyCd: value })}
                        options={questionTypeOptions}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        필수 여부
                      </label>
                      <CmpSelect
                        value={currentQuestion.requiredYn}
                        onChange={(value) => setCurrentQuestion({ ...currentQuestion, requiredYn: value })}
                        options={[
                          { value: 'Y', label: '필수' },
                          { value: 'N', label: '선택' }
                        ]}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* 선택지 수정 */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      선택지
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.choices.map((choice, choiceIndex) => (
                        <div key={choiceIndex} className="flex items-center space-x-2">
                          <CmpInput
                            value={choice.choiceTtl}
                            onChange={(e) => updateChoice(choiceIndex, 'choiceTtl', e.target.value)}
                            placeholder={`선택지 ${choiceIndex + 1}`}
                            className="flex-1"
                            disabled={loading}
                          />
                          <CmpInput
                            type="number"
                            value={choice.choiceScore}
                            onChange={(e) => updateChoice(choiceIndex, 'choiceScore', parseInt(e.target.value) || 0)}
                            placeholder="점수"
                            className="w-20"
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <CmpButton onClick={cancelEditQuestion} variant="secondary" size="sm" disabled={loading}>취소</CmpButton>
                    <CmpButton onClick={saveEditQuestion} variant="primary" size="sm" disabled={loading}>수정 완료</CmpButton>
                  </div>
                </div>
              </div>
            )}

            {/* 새 질문 추가 */}
            {!isEditingQuestion && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">새 질문 추가</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      질문 제목 *
                    </label>
                    <CmpInput
                      value={currentQuestion.questionTtl}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionTtl: e.target.value })}
                      placeholder="질문을 입력하세요"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      질문 설명
                    </label>
                    <CmpTextarea
                      value={currentQuestion.questionDesc}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionDesc: e.target.value })}
                      rows={2}
                      placeholder="질문에 대한 추가 설명"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        질문 유형
                      </label>
                      <CmpSelect
                        value={currentQuestion.questionTyCd}
                        onChange={(value) => setCurrentQuestion({ ...currentQuestion, questionTyCd: value })}
                        options={questionTypeOptions}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        필수 여부
                      </label>
                      <CmpSelect
                        value={currentQuestion.requiredYn}
                        onChange={(value) => setCurrentQuestion({ ...currentQuestion, requiredYn: value })}
                        options={[
                          { value: 'Y', label: '필수' },
                          { value: 'N', label: '선택' }
                        ]}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* 선택지 */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      선택지 (5개)
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.choices.map((choice, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CmpInput
                            value={choice.choiceTtl}
                            onChange={(e) => updateChoice(index, 'choiceTtl', e.target.value)}
                            placeholder={`선택지 ${index + 1}`}
                            className="flex-1"
                            disabled={loading}
                          />
                          <CmpInput
                            type="number"
                            value={choice.choiceScore}
                            onChange={(e) => updateChoice(index, 'choiceScore', parseInt(e.target.value) || 1)}
                            placeholder="점수"
                            className="w-16"
                            min="1"
                            max="10"
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <CmpButton
                    onClick={addQuestion}
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={questions.length >= 18 || loading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    질문 추가
                  </CmpButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
