"use client";

import { usePageMoveStore } from '@/common/store/pageMoveStore';
import { CmpButton } from '@/components/button/cmp_button';
import { CmpSection, CmpSectionBody, CmpSectionHead } from '@/components/contents/cmp_section/cmp_section';
import { useState } from 'react';

import Calendar from '@/components/Calendar';
import PageWrapper from '@/components/layout/PageWrapper';

function DonutChart() {
  // 단순 SVG 도넛 차트 (데모용)
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle r="70" cx="90" cy="90" fill="transparent" stroke="#e5e7eb" strokeWidth="24" />
      <circle r="70" cx="90" cy="90" fill="transparent" stroke="#a5b4fc" strokeWidth="24" strokeDasharray="110 330" strokeDashoffset="0" />
      <circle r="70" cx="90" cy="90" fill="transparent" stroke="#f472b6" strokeWidth="24" strokeDasharray="80 360" strokeDashoffset="110" />
      <circle r="70" cx="90" cy="90" fill="transparent" stroke="#34d399" strokeWidth="24" strokeDasharray="60 360" strokeDashoffset="190" />
      <circle r="70" cx="90" cy="90" fill="transparent" stroke="#fbbf24" strokeWidth="24" strokeDasharray="50 360" strokeDashoffset="250" />
      <circle r="70" cx="90" cy="90" fill="transparent" stroke="#60a5fa" strokeWidth="24" strokeDasharray="60 360" strokeDashoffset="300" />
    </svg>
  );
}

export default function AdminPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

  // State variables
  const [adminData, setAdminData] = useState({
    applications: 11,
    programs: 5,
    consultations: 1,
    statistics: {
      mentalHealth: 25,
      harassment: 20,
      conflict: 15,
      customerService: 12,
      violation: 10,
      maladaptation: 8,
      relationships: 10
    }
  });

  const [loading, setLoading] = useState(false);

  // Functions
  const handleApplicationApproval = (id) => {
    console.log('Application approval:', id);
    toast.Open('#adminToast');
  };

  const handleProgramManagement = () => {
    console.log('Program management');
    setMove('/program-management');
  };

  const handleScheduleManagement = () => {
    console.log('Schedule management');
    setMove('/schedule-management');
  };

  const handleStatisticsView = () => {
    console.log('Statistics view');
    setMove('/statistics');
  };

  const handleConsultationStatus = () => {
    console.log('Consultation status');
    setMove('/consultation-status');
  };

  const toastClose = () => {
    console.log('Toast closed');
  };

  // Draw functions
  const drawApplicationCard = () => {
    return (
      <CmpSection>
        <CmpSectionHead>
          <h2 className="cmp_section_tit">신청 내역 조회/승인</h2>
        </CmpSectionHead>
        <CmpSectionBody>
          <div className="bg-blue-100 rounded-2xl p-6 flex flex-col shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-blue-700">신청 내역 조회/승인</span>
              <span className="text-2xl font-extrabold text-blue-500">{adminData.applications}건</span>
            </div>
            <table className="w-full text-sm mb-2">
              <thead>
                <tr className="text-blue-600">
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
            <CmpButton label="승인 처리" click={handleApplicationApproval} />
          </div>
        </CmpSectionBody>
      </CmpSection>
    );
  };

  const drawProgramCard = () => {
    return (
      <CmpSection>
        <CmpSectionHead>
          <h2 className="cmp_section_tit">프로그램 등록/운영/관리</h2>
        </CmpSectionHead>
        <CmpSectionBody>
          <div className="bg-pink-100 rounded-2xl p-6 flex flex-col shadow items-center justify-center">
            <div className="font-bold text-lg text-pink-700 mb-2">프로그램 등록/운영/관리</div>
            <div className="text-5xl text-pink-300">📄</div>
            <CmpButton label="프로그램 관리" click={handleProgramManagement} />
          </div>
        </CmpSectionBody>
      </CmpSection>
    );
  };

  const drawScheduleCard = () => {
    return (
      <CmpSection>
        <CmpSectionHead>
          <h2 className="cmp_section_tit">일정관리</h2>
        </CmpSectionHead>
        <CmpSectionBody>
          <div className="bg-green-100 rounded-2xl p-6 flex flex-col shadow">
            <div className="font-bold text-lg text-green-700 mb-2">일정관리</div>
            <Calendar year={2025} month={5} />
            <div className="mt-4 space-y-2">
              <div className="bg-white rounded-lg p-3 shadow flex flex-col">
                <span className="text-xs text-gray-500">2025.05.01</span>
                <span className="text-pink-600 font-bold text-xs">개인 목표 성공</span> <span className="text-blue-600 font-bold text-xs">그룹 목표 성공</span>
                <span className="text-xs">하루 1가지 감사한 일 기록하기 팀원과 소통하기</span>
              </div>
              <div className="bg-white rounded-lg p-3 shadow flex flex-col">
                <span className="text-xs text-gray-500">2025.05.03</span>
                <span className="text-pink-600 font-bold text-xs">개인 목표 성공</span> <span className="text-blue-600 font-bold text-xs">그룹 목표 성공</span>
                <span className="text-xs">하루 1가지 감사한 일 기록하기 팀원과 소통하기</span>
              </div>
            </div>
            <CmpButton label="일정 관리" click={handleScheduleManagement} />
          </div>
        </CmpSectionBody>
      </CmpSection>
    );
  };

  const drawStatisticsCard = () => {
    return (
      <CmpSection>
        <CmpSectionHead>
          <h2 className="cmp_section_tit">통계보고서 조회</h2>
        </CmpSectionHead>
        <CmpSectionBody>
          <div className="bg-gray-100 rounded-2xl p-6 flex flex-col shadow items-center">
            <div className="font-bold text-lg text-gray-700 mb-2">통계보고서 조회</div>
            <div className="mb-2">고충 주제별 현황</div>
            <DonutChart />
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
              <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-blue-400 mr-1"></span>정신건강</span>
              <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-pink-400 mr-1"></span>직장내 괴롭힘</span>
              <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-green-400 mr-1"></span>상하갈등</span>
              <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>고객응대 직원보호</span>
              <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-purple-400 mr-1"></span>규정위반</span>
              <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-cyan-400 mr-1"></span>업무 부적응</span>
              <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-gray-400 mr-1"></span>대인관계</span>
            </div>
            <CmpButton label="통계 보기" click={handleStatisticsView} />
          </div>
        </CmpSectionBody>
      </CmpSection>
    );
  };

  const drawConsultationCard = () => {
    return (
      <CmpSection>
        <CmpSectionHead>
          <h2 className="cmp_section_tit">상담 현황</h2>
        </CmpSectionHead>
        <CmpSectionBody>
          <div className="bg-purple-100 rounded-2xl p-6 flex flex-col shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-purple-700">상담 현황</span>
              <span className="text-2xl font-extrabold text-purple-500">{adminData.consultations}건</span>
            </div>
            <table className="w-full text-sm mb-2">
              <thead>
                <tr className="text-purple-600">
                  <th className="text-left">상담일자</th>
                  <th className="text-left">상담직원</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>2025.01.10</td><td>김가연</td></tr>
                <tr><td>2025.01.10</td><td>김가연</td></tr>
              </tbody>
            </table>
            <CmpButton label="상담 현황" click={handleConsultationStatus} />
          </div>
        </CmpSectionBody>
      </CmpSection>
    );
  };

  const drawBottomLists = () => {
    return (
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <CmpSection>
          <CmpSectionHead>
            <h2 className="cmp_section_tit">맞춤 프로그램 추천</h2>
          </CmpSectionHead>
          <CmpSectionBody>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>[찾아가는 상담] 나의 스트레스 자수와 자기 돌봄 방법...</li>
              <li>[리더십 케어] 마음을 품은 리더 - 공감과 배려를 품은 리더의 가치...</li>
            </ul>
          </CmpSectionBody>
        </CmpSection>
        <CmpSection>
          <CmpSectionHead>
            <h2 className="cmp_section_tit">운영 프로그램 현황</h2>
          </CmpSectionHead>
          <CmpSectionBody>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>[찾아가는 상담] 나의 스트레스 자수와 자기 돌봄 방법...</li>
              <li>[컨설 세미나] 스트레스 해소부터 정신 건강까지...</li>
              <li>[집단개발 과정] 자기역량관리와 관련 개발 기술...</li>
              <li>[리더십 케어] 마음을 품은 리더 - 공감과 배려를 품은 리더의 가치...</li>
            </ul>
          </CmpSectionBody>
        </CmpSection>
        <CmpSection>
          <CmpSectionHead>
            <h2 className="cmp_section_tit">공지사항</h2>
          </CmpSectionHead>
          <CmpSectionBody>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>[공지] "직원권익보호" 시스템 신규 오픈 이벤트 참여하세요!</li>
              <li>2025년 새해 복 많이 받으세요!</li>
            </ul>
          </CmpSectionBody>
        </CmpSection>
      </div>
    );
  };

  const toasts = [
    {
      id: 'adminToast',
      message: '관리자 기능이 실행되었습니다.',
      type: 'success',
      onClose: toastClose
    }
  ];

  return (
    <PageWrapper
      title="관리자 대시보드"
      subtitle="IBK 직원권익보호 포탈 관리 시스템"
      toasts={toasts}
    >
      <div className="d-grid gap-4 mb-4" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
        {drawApplicationCard()}
        {drawProgramCard()}
        {drawScheduleCard()}
        {drawStatisticsCard()}
        {drawConsultationCard()}
      </div>
      {drawBottomLists()}
    </PageWrapper>
  );
}
