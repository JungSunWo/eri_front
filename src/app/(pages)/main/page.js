/**
 * @File Name      : page.js
 * @File path      : src/app/(page)/main/page.js
 * @author         : 정선우
 * @Description    : 메인 페이지 컴포넌트
 *                   - 직원권익보호 포탈의 메인 화면
 *                   - 마음 건강검진, 상담 서비스, 챌린지 프로그램, 자료실 등 주요 기능 접근
 *                   - 대시보드 및 설정 페이지로의 이동 기능
 * @History        : 20250701  최초 신규
 **/

'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import { CmpButton } from '@/app/shared/components/button/cmp_button';
import ConsultationButton from '@/app/shared/components/ConsultationButton';
import { useState } from 'react';

import PageWrapper from '@/app/shared/layouts/PageWrapper';

/**
 * 메인 페이지 컴포넌트
 * 직원권익보호 포탈의 메인 화면으로 주요 기능들에 대한 접근을 제공
 * @returns {JSX.Element} 메인 페이지 UI
 */
export default function MainPage() {
  // 페이지 이동을 위한 전역 상태 관리
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

  // 메인 페이지 데이터 상태
  const [mainData, setMainData] = useState({
    title: "건강한 마음, IBK 마음 건강검진",
    subtitle: "스마일 IBK직원권익의 보호",
    features: [
      { icon: "🧠", title: "마음 건강검진", description: "정신 건강 상태를 체계적으로 진단" },
      { icon: "💬", title: "상담 서비스", description: "전문가와의 1:1 상담 지원" },
      { icon: "🏆", title: "챌린지 프로그램", description: "건강한 습관 형성 도전" },
      { icon: "📋", title: "자료실", description: "정신 건강 관련 유용한 정보" }
    ]
  });

  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  /**
   * 마음 건강검진 페이지로 이동
   */
  const handleMentalHealthCheck = () => {
    console.log('Mental health check');
    setMoveTo('/mental-health-check');
  };

  /**
   * 상담 서비스 페이지로 이동
   */
  const handleConsultation = () => {
    console.log('Consultation');
    setMoveTo('/consultation/selection');
  };

  /**
   * 챌린지 프로그램 페이지로 이동
   */
  const handleChallenge = () => {
    console.log('Challenge');
    setMoveTo('/challenge');
  };

  /**
   * 자료실 페이지로 이동
   */
  const handleResources = () => {
    console.log('Resources');
    setMoveTo('/resources');
  };

  /**
   * 대시보드 페이지로 이동
   */
  const handleDashboard = () => {
    console.log('Dashboard');
    setMoveTo('/dashboard');
  };

  /**
   * 설정 페이지로 이동
   */
  const handleSettings = () => {
    console.log('Settings');
    setMoveTo('/settings');
  };

  /**
   * 메인 컨텐츠 UI 렌더링
   * @returns {JSX.Element} 메인 컨텐츠 컴포넌트
   */
  const drawMainContent = () => {
    return (
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-12">
        {/* 메인 타이틀 및 서브타이틀 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{mainData.title}</h1>
          <p className="text-xl text-gray-600">{mainData.subtitle}</p>
        </div>

        {/* 상담신청 버튼 */}
        <div className="mb-8">
          <ConsultationButton
            variant="success"
            size="lg"
            className="text-lg px-8 py-4"
          >
            💬 상담 신청하기
          </ConsultationButton>
        </div>

        {/* 주요 기능 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          {mainData.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                switch (index) {
                  case 0:
                    handleMentalHealthCheck();
                    break;
                  case 1:
                    handleConsultation();
                    break;
                  case 2:
                    handleChallenge();
                    break;
                  case 3:
                    handleResources();
                    break;
                  default:
                    break;
                }
              }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* 추가 액션 버튼들 */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <CmpButton
            onClick={handleDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            📊 대시보드
          </CmpButton>
          <CmpButton
            onClick={handleSettings}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            ⚙️ 설정
          </CmpButton>
        </div>
      </main>
    );
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {drawMainContent()}
      </div>
    </PageWrapper>
  );
}
