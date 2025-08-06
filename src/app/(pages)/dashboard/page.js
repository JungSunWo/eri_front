/**
 * @File Name      : page.js
 * @File path      : src/app/(page)/dashboard/page.js
 * @author         : 정선우
 * @Description    : 대시보드 페이지 컴포넌트
 *                   - 직원권익보호 포탈의 종합 대시보드 화면
 *                   - 프로그램/상담 신청 현황, 목표 달성 현황, 캘린더 등 종합 정보 제공
 *                   - 맞춤 프로그램 추천, 운영 프로그램 현황, 공지사항 표시
 * @History        : 20250701  최초 신규
 **/

"use client";

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import CmpButton from '@/app/shared/components/button/cmp_button';
import { useState } from 'react';

import Calendar from '@/app/shared/components/Calendar';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import Image from 'next/image';

/**
 * 대시보드 페이지 컴포넌트
 * 직원권익보호 포탈의 종합 대시보드로 사용자의 활동 현황과 추천 정보를 제공
 * @returns {JSX.Element} 대시보드 페이지 UI
 */
export default function DashboardPage() {
  // 페이지 이동을 위한 전역 상태 관리
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

  // 대시보드 데이터 상태
  const [dashboardData, setDashboardData] = useState({
    programApplications: 11,    // 프로그램 신청 건수
    consultationApplications: 1, // 상담 신청 건수
    goals: [                    // 이번 달 목표 달성 현황
      { date: '2025.05.30', personal: '성공', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.29', personal: '성공', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.28', personal: '미달성', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.20', personal: '성공', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.19', personal: '미달성', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.14', personal: '성공', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.13', personal: '성공', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.10', personal: '미달성', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' },
      { date: '2025.05.02', personal: '성공', group: '성공', content: '하루 1가지 감사한 일 기록하기 팀원과 소통하기' }
    ]
  });

  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  /**
   * 프로그램 신청 페이지로 이동
   */
  const handleProgramApplication = () => {
    console.log('Program application');
    setMoveTo('/program-application');
  };

  /**
   * 상담 신청 페이지로 이동
   */
  const handleConsultationApplication = () => {
    console.log('Consultation application');
    setMoveTo('/consultation-application');
  };

  /**
   * 과거 프로그램 이력 페이지로 이동
   */
  const handlePastPrograms = () => {
    console.log('Past programs');
    setMoveTo('/past-programs');
  };

  /**
   * 보유 배지 현황 페이지로 이동
   */
  const handleBadges = () => {
    console.log('Badges');
    setMoveTo('/badges');
  };

  /**
   * 나의 수집 현황 페이지로 이동
   */
  const handleCollections = () => {
    console.log('Collections');
    setMoveTo('/collections');
  };

  /**
   * 토스트 닫기 처리
   */
  const toastClose = () => {
    console.log('Toast closed');
  };

  /**
   * 상단 섹션 UI 렌더링
   * - 인용구, 일러스트, 프로그램/상담 신청 현황, 추천 정보 등
   * @returns {JSX.Element} 상단 섹션 컴포넌트
   */
  const drawTopSection = () => {
    return (
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow p-8 flex flex-col md:flex-row gap-8 mb-8">
        {/* 인용구 + 일러스트 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-center mb-6">
            <span className="text-orange-400 text-6xl">"</span>
            <span className="inline-block align-middle">나는 날마다 모든 면에서<br />점점 좋아지고 있다.</span>
            <span className="text-orange-400 text-6xl">"</span>
          </div>
          <Image src="/main-illustration.svg" alt="일러스트" width={320} height={240} className="mx-auto mb-2" />
        </div>

        {/* 프로그램/상담 신청 현황 및 정보 영역 */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-4 mb-2">
            {/* 프로그램 신청 카드 */}
            <div className="flex-1 bg-orange-50 rounded-xl p-4 shadow border border-orange-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-orange-700">프로그램 신청</span>
                <span className="text-2xl font-extrabold text-orange-500">{dashboardData.programApplications}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-orange-600">
                    <th className="text-left">신청일자</th>
                    <th className="text-left">진행 상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>2024.10.05</td><td>완료</td></tr>
                  <tr><td>2025.01.10</td><td>신청</td></tr>
                  <tr><td>2025.01.10</td><td>신청</td></tr>
                </tbody>
              </table>
              <CmpButton label="프로그램 신청" click={handleProgramApplication} />
            </div>

            {/* 상담 신청 카드 */}
            <div className="flex-1 bg-green-50 rounded-xl p-4 shadow border border-green-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-green-700">상담 신청</span>
                <span className="text-2xl font-extrabold text-green-500">{dashboardData.consultationApplications}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-green-600">
                    <th className="text-left">신청일자</th>
                    <th className="text-left">진행 상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>2024.10.05</td><td>완료</td></tr>
                  <tr><td>2025.01.10</td><td>신청</td></tr>
                  <tr><td>2025.01.10</td><td>신청</td></tr>
                </tbody>
              </table>
              <CmpButton label="상담 신청" click={handleConsultationApplication} />
            </div>
          </div>

          {/* 추천/운영/공지 정보 영역 */}
          <div className="flex gap-4">
            {/* 맞춤 프로그램 추천 */}
            <div className="flex-1">
              <div className="font-bold mb-1">맞춤 프로그램 추천</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>[찾아가는 상담] 나의 스트레스 자수와 자기 돌봄 방법</li>
                <li>[리더십 케어] 마음을 품은 리더 - 공감과 배려를 품은 리더의 가치</li>
              </ul>
            </div>

            {/* 운영 프로그램 현황 */}
            <div className="flex-1">
              <div className="font-bold mb-1">운영 프로그램 현황</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>[찾아가는 상담] 나의 스트레스 자수와 자기 돌봄 방법</li>
                <li>[컨설 세미나] 스트레스 해소부터 정신 건강까지</li>
                <li>[집단개발 과정] 자기역량관리와 관련 개발 기술</li>
                <li>[리더십 케어] 마음을 품은 리더 - 공감과 배려를 품은 리더의 가치</li>
              </ul>
            </div>

            {/* 공지사항 */}
            <div className="flex-1">
              <div className="font-bold mb-1">공지사항</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>[공지] "직원권익보호" 시스템 신규 오픈 이벤트 참여하세요!</li>
                <li>2025년 새해 복 많이 받으세요!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * 하단 섹션 UI 렌더링
   * - 캘린더, 이번 달 목표, 카드형 정보 등
   * @returns {JSX.Element} 하단 섹션 컴포넌트
   */
  const drawBottomSection = () => {
    return (
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* 캘린더 영역 */}
        <div className="mt-6 w-full flex justify-center">
          <Calendar year={2025} month={5} />
        </div>

        {/* 이번 달 목표 달성 현황 */}
        <div className="bg-white rounded-2xl shadow p-6 flex-1">
          <div className="font-bold mb-2">이번 달 목표</div>
          <ul className="text-sm space-y-1">
            {dashboardData.goals.map((goal, index) => (
              <li key={index}>
                <span className="font-bold text-gray-800">{goal.date}</span>
                <span className={`font-bold ${goal.personal === '성공' ? 'text-green-600' : 'text-pink-600'}`}>
                  개인 목표 {goal.personal === '성공' ? '달성' : '미달성'}
                </span>
                {goal.content}
                <span className="text-blue-600 font-bold">그룹 목표 성공</span>
                팀원과 소통하기
              </li>
            ))}
          </ul>
        </div>

        {/* 카드형 정보 영역 */}
        <div className="flex flex-col gap-4 flex-1 min-w-[220px]">
          {/* 과거 프로그램 이력 카드 */}
          <div className="bg-gradient-to-r from-green-200 to-green-100 rounded-xl p-4 flex items-center gap-4 shadow">
            <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center text-2xl">🕒</div>
            <div>
              <div className="font-bold text-green-800">과거 프로그램 이력</div>
            </div>
            <CmpButton label="보기" click={handlePastPrograms} />
          </div>

          {/* 보유 배지 현황 카드 */}
          <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl p-4 flex items-center gap-4 shadow">
            <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-2xl">🏅</div>
            <div>
              <div className="font-bold text-blue-800">보유 배지 현황</div>
            </div>
            <CmpButton label="보기" click={handleBadges} />
          </div>

          {/* 나의 수집 현황 카드 */}
          <div className="bg-gradient-to-r from-cyan-200 to-cyan-100 rounded-xl p-4 flex items-center gap-4 shadow">
            <div className="w-12 h-12 bg-cyan-300 rounded-full flex items-center justify-center text-2xl">📥</div>
            <div>
              <div className="font-bold text-cyan-800">나의 수집 현황</div>
            </div>
            <CmpButton label="보기" click={handleCollections} />
          </div>
        </div>
      </div>
    );
  };

  // 토스트 알림 설정
  const toasts = [
    {
      id: 'dashboardToast',
      message: '대시보드 기능이 실행되었습니다.',
      type: 'success',
      onClose: toastClose
    }
  ];

  return (
    <PageWrapper
      title="IBK 직원권익보호 포탈"
      subtitle="종합 대시보드"
      showCard={false}
    >
      {drawTopSection()}
      {drawBottomSection()}
    </PageWrapper>
  );
}
