'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { Activity, BookOpen, Brain, Heart, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DiagnosisPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const [psychologicalTests, setPsychologicalTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 간편심리검사 데이터 (실제로는 API에서 가져올 데이터)
  useEffect(() => {
    // 시뮬레이션된 API 호출
    const fetchPsychologicalTests = async () => {
      setLoading(true);
      try {
        // 실제 API 호출로 대체
        // const response = await psychologicalTestAPI.getTestList();

        // 임시 데이터
        const mockTests = [
          {
            id: 1,
            name: '우울증 검사',
            description: '우울증 정도를 측정하는 간편한 검사입니다.',
            duration: '5분',
            questions: 20,
            icon: <Heart className="w-6 h-6" />,
            color: 'bg-red-100 text-red-600'
          },
          {
            id: 2,
            name: '불안증 검사',
            description: '불안 수준을 평가하는 검사입니다.',
            duration: '3분',
            questions: 15,
            icon: <Activity className="w-6 h-6" />,
            color: 'bg-yellow-100 text-yellow-600'
          },
          {
            id: 3,
            name: '스트레스 검사',
            description: '현재 스트레스 수준을 측정합니다.',
            duration: '4분',
            questions: 18,
            icon: <TrendingUp className="w-6 h-6" />,
            color: 'bg-orange-100 text-orange-600'
          },
          {
            id: 4,
            name: '대인관계 검사',
            description: '대인관계 패턴을 분석합니다.',
            duration: '6분',
            questions: 25,
            icon: <Users className="w-6 h-6" />,
            color: 'bg-blue-100 text-blue-600'
          },
          {
            id: 5,
            name: '자존감 검사',
            description: '자존감 수준을 평가합니다.',
            duration: '4분',
            questions: 20,
            icon: <Brain className="w-6 h-6" />,
            color: 'bg-purple-100 text-purple-600'
          },
          {
            id: 6,
            name: '직무스트레스 검사',
            description: '직무 관련 스트레스를 측정합니다.',
            duration: '5분',
            questions: 22,
            icon: <BookOpen className="w-6 h-6" />,
            color: 'bg-green-100 text-green-600'
          }
        ];

        setPsychologicalTests(mockTests);
      } catch (error) {
        console.error('심리검사 목록 조회 실패:', error);
        setPsychologicalTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologicalTests();
  }, []);

  const handleHealthCheckClick = () => {
    setMoveTo('/health-check');
  };

  const handlePsychologicalTestClick = (test) => {
    console.log('심리검사 선택:', test.name);
    // 실제로는 검사 페이지로 이동
    setMoveTo(`/diagnosis/test/${test.id}`);
  };

  return (
    <PageWrapper title="진단 및 검사">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">진단 및 검사</h1>
          <p className="text-gray-600 text-lg">원하시는 검사 유형을 선택해주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 마음건강검진 */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="p-4 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">마음건강검진</h3>
              <p className="text-gray-600 mb-6">
                종합적인 마음건강 상태를 점검하고 전문적인 분석 결과를 제공받을 수 있습니다.
              </p>
              <button
                onClick={handleHealthCheckClick}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                마음건강검진 시작하기
              </button>
            </div>
          </div>

          {/* 간편심리검사 */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="p-4 rounded-full bg-green-100 text-green-600 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">간편심리검사</h3>
              <p className="text-gray-600">
                특정 영역에 대한 간편한 심리검사를 선택하여 빠르게 결과를 확인할 수 있습니다.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">검사 목록을 불러오는 중...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {psychologicalTests.map((test) => (
                  <button
                    key={test.id}
                    onClick={() => handlePsychologicalTestClick(test)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-full ${test.color} mr-3`}>
                        {test.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{test.name}</h4>
                        <p className="text-xs text-gray-500">{test.duration} • {test.questions}문항</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {test.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">검사 안내</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>모든 검사는 익명으로 진행되며 개인정보가 보호됩니다.</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>검사 결과는 참고용이며, 전문가 상담을 권장합니다.</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>검사 중단 시 언제든지 다시 시작할 수 있습니다.</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
