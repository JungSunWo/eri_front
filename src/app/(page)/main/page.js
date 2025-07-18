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

import { usePageMoveStore } from '@/common/store/pageMoveStore';
import { CmpButton } from '@/components/button/cmp_button';
import { useState } from 'react';

import PageWrapper from '@/components/layout/PageWrapper';
import Image from 'next/image';

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
    setMoveTo('/consultation');
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
        <div className="mt-12 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4">
            {mainData.title}
          </h1>
          <p className="text-lg md:text-xl text-yellow-600 font-semibold">
            {mainData.subtitle}
          </p>
        </div>

        {/* 메인 일러스트 이미지 */}
        <div className="flex justify-center mb-8">
          <Image
            src="/main-illustration.svg"
            alt="메인 일러스트"
            width={400}
            height={300}
            className="rounded-2xl shadow-md"
          />
        </div>

        {/* 주요 기능 버튼들 - 그리드 레이아웃 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {mainData.features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              {/* 기능 아이콘 */}
              <div className="text-3xl mb-2">{feature.icon}</div>
              {/* 기능 제목 */}
              <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
              {/* 기능 설명 */}
              <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
              {/* 바로가기 버튼 */}
              <CmpButton
                label="바로가기"
                click={() => {
                  // 인덱스에 따른 페이지 이동 처리
                  switch (index) {
                    case 0: handleMentalHealthCheck(); break;
                    case 1: handleConsultation(); break;
                    case 2: handleChallenge(); break;
                    case 3: handleResources(); break;
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* 추가 기능 버튼들 */}
        <div className="flex gap-4 mt-8">
          <CmpButton
            label="대시보드"
            click={handleDashboard}
            styleType="primary"
          />
          <CmpButton
            label="설정"
            click={handleSettings}
            styleType="secondary"
          />
        </div>
      </main>
    );
  };

  return (
    <PageWrapper
      title="IBK 직원권익보호 포탈"
      subtitle="건강한 마음, IBK 마음 건강검진"
      showCard={false}
    >
      {drawMainContent()}
    </PageWrapper>
  );
}
