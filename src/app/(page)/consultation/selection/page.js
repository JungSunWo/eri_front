'use client';

import { setMoveTo } from '@/common/store/pageMoveStore';
import CmpButton from '@/components/button/cmp_button';
import PageWrapper from '@/components/layout/PageWrapper';
import { useState } from 'react';

export default function ConsultationSelectionPage() {
  const [selectedType, setSelectedType] = useState('expert');

  const consultationTypes = [
    {
      id: 'expert',
      title: '전문가 상담',
      description: '혼자 고민하지 마세요. 전문 상담가가 진심을 담아 함께 이야기 나누고 해결의 실마리를 찾아드립니다. 지금 마음의 문을 열어보세요.',
      process: '상담신청 -> 신청완료 -> 상담 관리자 승인 -> 상담진행 -> 상담완료'
    },
    {
      id: 'psychological',
      title: '심리검사 및 해석상담',
      description: '심리검사를 통해 현재의 정서 상태, 성격 특성, 대인관계 등 다양한 심리적 요소를 객관적으로 파악합니다. 검사 결과에 따른 전문 상담을 통해 자기이해를 높이고 해결 방향을 모색합니다.',
      process: '심리검사 신청 -> 검사 실시 -> 결과 분석 -> 전문가 해석상담 -> 상담완료'
    },
    {
      id: 'board',
      title: '게시판 상담',
      description: '언제 어디서나 편하게 상담을 남겨주세요. 남겨 주신 내용은 전문가가 확인 후 신속하고 정확하게 답변 해 드립니다. 비대면으로도 충분히 도움을 드릴 수 있습니다.',
      process: '상담글 작성 -> 상담사 확인 후 답글 게재'
    },
    {
      id: 'kakao',
      title: '카카오톡 오픈채팅 상담',
      description: '긴급한 상담이 필요한 경우 아래 QR을 통해 오픈채팅을 요청해 주세요.',
      process: 'QR 스캔 -> 채팅방 입장 -> 실시간 상담'
    }
  ];

  const handleConsultationSelect = (typeId) => {
    setSelectedType(typeId);
  };

  const handleReservation = () => {
    // 선택된 상담 유형에 따라 해당 페이지로 이동
    switch (selectedType) {
      case 'expert':
        setMoveTo('/consultation/expert');
        break;
      case 'psychological':
        setMoveTo('/consultation/psychological');
        break;
      case 'board':
        setMoveTo('/consultation/board');
        break;
      case 'kakao':
        setMoveTo('/consultation/kakao');
        break;
      default:
        break;
    }
  };

  const selectedConsultation = consultationTypes.find(type => type.id === selectedType);

  return (
    <PageWrapper title="상담 선택하기">
      <div className="flex h-full">
        {/* 왼쪽 상담 유형 선택 */}
        <div className="w-1/3 p-6 border-r border-gray-200">
          <div className="space-y-4">
            {consultationTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedType === type.id
                    ? 'bg-gray-100 border-2 border-blue-500'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleConsultationSelect(type.id)}
              >
                <h3 className="font-semibold text-gray-900">{type.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 상세 정보 */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col">
            {/* 설명 영역 */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedConsultation?.title}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedConsultation?.description}
                </p>
              </div>

              {/* 프로세스 영역 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">진행 과정</h3>
                <p className="text-sm text-gray-600">
                  {selectedConsultation?.process}
                </p>
              </div>
            </div>

            {/* 예약 버튼 */}
            <div className="mt-6">
              <CmpButton
                label="상담예약"
                styleType="primary"
                click={handleReservation}
                className="w-full py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
