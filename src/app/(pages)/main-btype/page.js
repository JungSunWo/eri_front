'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import { CmpButton } from '@/app/shared/components/button/cmp_button';
import { useState } from 'react';

import PageWrapper from '@/app/shared/layouts/PageWrapper';
import Image from 'next/image';

export default function MainBTypePage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

  // State variables
  const [mainBTypeData, setMainBTypeData] = useState({
    programList: [
      { date: '2024.10.05', status: '완료' },
      { date: '2025.01.10', status: '신청' },
      { date: '2025.01.10', status: '신청' },
    ],
    counselList: [
      { date: '2024.10.05', status: '완료' },
      { date: '2025.01.10', status: '신청' },
      { date: '2025.01.10', status: '신청' },
    ],
    recommendList: [
      '[찾아가는 상담실] 나의 스트레스 지수와 자기돌봄 방법을 알아보...',
      '[리더십 케어] 마음을 품은 리더 - 공감과 배려를 통한 리더의 기 ...',
    ],
    runningList: [
      '[찾아가는 상담실] 나의 스트레스 지수와 자기 돌봄 방법',
      '[힐링 세미나] 스트레스 해소부터 정신 건강까지! 힐링',
      '[경력개발 코칭] 커리어 액셀러레이터 - 경력개발 기술',
      '[리더십 케어] 마음을 품은 리더 - 공감과 배려를 통한 리더의 기 ...',
    ],
    noticeList: [
      "[공지] '직원권익보호' 시스템 신규 오픈 이벤트 참여하세요!",
      '2025년 새해 복 많이 받으세요!'
    ]
  });

  const [loading, setLoading] = useState(false);

  // Functions
  const handleProgramApplication = () => {
    console.log('Program application');
    setMoveTo('/program-application');
  };

  const handlePastPrograms = () => {
    console.log('Past programs');
    setMoveTo('/past-programs');
  };

  const handleHabitChallenge = () => {
    console.log('Habit challenge');
    setMoveTo('/habit-challenge');
  };

  const handleConsultation = () => {
    console.log('Consultation');
    setMoveTo('/consultation');
  };

  const handleBadges = () => {
    console.log('Badges');
    setMoveTo('/badges');
  };

  const handleCollections = () => {
    console.log('Collections');
    setMoveTo('/collections');
  };

  const handleMentalHealthCheck = () => {
    console.log('Mental health check');
    setMoveTo('/mental-health-check');
  };

  const handleChallenge = () => {
    console.log('Challenge');
    setMoveTo('/challenge');
  };

  const handleBoard = () => {
    console.log('Board');
    setMoveTo('/board');
  };

  const toastClose = () => {
    console.log('Toast closed');
  };

  // Draw functions
  const drawMainContent = () => {
    return (
      <main className="flex-1 px-8 py-8">
        <div className="flex flex-row gap-8">
          {/* 좌측 일러스트/명언 */}
          <div className="flex flex-col items-center justify-start w-1/5 min-w-[180px]">
            <div className="mb-6">
              <Image src="/main-illustration.svg" alt="명언 일러스트" width={120} height={120} />
            </div>
            <div className="text-2xl font-bold text-gray-800 text-center mb-2">
              "나는 날마다 모든 면에서 점점 좋아지고 있다"
            </div>
            <div className="text-sm text-gray-500 text-center mb-8">에밀 쿠에</div>
          </div>

          {/* 중앙 카드형 정보 */}
          <div className="flex-1 grid grid-cols-3 gap-6">
            <div className="bg-blue-400 rounded-xl p-4 text-white shadow-md col-span-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">프로그램 신청</span>
                <span className="font-bold text-lg">11건</span>
              </div>
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr><th className="text-left">신청일자</th><th className="text-left">진행 상태</th></tr>
                </thead>
                <tbody>
                  {mainBTypeData.programList.map((row, i) => (
                    <tr key={i}><td>{row.date}</td><td>{row.status}</td></tr>
                  ))}
                </tbody>
              </table>
              <CmpButton label="신청하기" click={handleProgramApplication} />
            </div>

            <div className="bg-pink-300 rounded-xl p-4 text-white shadow-md col-span-1 flex flex-col justify-between">
              <span className="font-bold mb-2">과거 프로그램 이력</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
              <CmpButton label="보기" click={handlePastPrograms} />
            </div>

            <div className="bg-emerald-400 rounded-xl p-4 text-white shadow-md col-span-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">습관형성 챌린지</span>
                <span className="text-xl">⚙️</span>
              </div>
              <div className="bg-white rounded-lg p-3 text-gray-800 mt-2">
                <div className="font-bold mb-1">May 2025</div>
                <div className="text-xs text-gray-500 mb-2">2025.05.01</div>
                <div className="text-xs">개인 목표 설정 하루 1가지 감사한 일 기록하기<br />그룹 목표 설정 텀블러 사용하기</div>
              </div>
              <CmpButton label="참여하기" click={handleHabitChallenge} />
            </div>

            <div className="bg-indigo-300 rounded-xl p-4 text-white shadow-md col-span-1">
              <span className="font-bold">상담 신청</span>
              <div className="flex flex-row gap-2 mt-2">
                <div className="bg-white text-indigo-700 rounded px-2 py-1 text-xs font-bold">오프라인</div>
                <div className="bg-white text-indigo-700 rounded px-2 py-1 text-xs font-bold">비대면</div>
              </div>
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr><th className="text-left">신청일자</th><th className="text-left">진행 상태</th></tr>
                </thead>
                <tbody>
                  {mainBTypeData.counselList.map((row, i) => (
                    <tr key={i}><td>{row.date}</td><td>{row.status}</td></tr>
                  ))}
                </tbody>
              </table>
              <CmpButton label="신청하기" click={handleConsultation} />
            </div>

            <div className="bg-blue-200 rounded-xl p-4 text-white shadow-md col-span-1 flex flex-col justify-between">
              <span className="font-bold mb-2">보유 배지 현황</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-4xl">🎖️</span>
              </div>
              <CmpButton label="보기" click={handleBadges} />
            </div>

            <div className="bg-orange-300 rounded-xl p-4 text-white shadow-md col-span-1 flex flex-col justify-between">
              <span className="font-bold mb-2">나의 수집 현황</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <CmpButton label="보기" click={handleCollections} />
            </div>
          </div>

          {/* 우측 리스트 */}
          <div className="w-1/4 min-w-[260px] flex flex-col gap-6">
            <div>
              <div className="font-bold text-lg mb-2">맞춤 프로그램 추천</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {mainBTypeData.recommendList.map((txt, i) => <li key={i}>{txt}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-bold text-lg mb-2">운영 프로그램 현황</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {mainBTypeData.runningList.map((txt, i) => <li key={i}>{txt}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-bold text-lg mb-2">공지사항</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {mainBTypeData.noticeList.map((txt, i) => <li key={i}>{txt}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  };

  const drawFooter = () => {
    return (
      <footer className="w-full bg-green-500 py-3 flex justify-center space-x-8 text-white text-sm rounded-b-3xl">
        <div className="flex flex-col items-center cursor-pointer" onClick={handleConsultation}>
          <span className="text-2xl">💬</span>상담신청
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={handleMentalHealthCheck}>
          <span className="text-2xl">🧠</span>마음검진 하기
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={handleChallenge}>
          <span className="text-2xl">🏆</span>마음챌린지
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={handleBoard}>
          <span className="text-2xl">📋</span>게시판
        </div>
      </footer>
    );
  };

  const toasts = [
    {
      id: 'mainBTypeToast',
      message: '메인 B타입 페이지 기능이 실행되었습니다.',
      type: 'success',
      onClose: toastClose
    }
  ];

  return (
    <>
      <PageWrapper
        title="IBK 직원권익보호 포탈"
        subtitle="메인 B타입 - 종합 대시보드"
        showCard={false}
      >
        {drawMainContent()}
        {drawFooter()}
      </PageWrapper>
    </>
  );
}
