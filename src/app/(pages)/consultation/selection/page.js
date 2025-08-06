'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConsultationSelectionPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState('expert');

  // URL 파라미터에서 상담 유형 읽기
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    console.log('URL 파라미터 확인:', typeFromUrl);

    if (typeFromUrl) {
      console.log('URL에서 받은 상담 유형:', typeFromUrl);
      console.log('유효한 상담 유형인지 확인:', consultationTypes.find(type => type.id === typeFromUrl));

      // 유효한 상담 유형인지 확인
      const validType = consultationTypes.find(type => type.id === typeFromUrl);
      if (validType) {
        console.log('유효한 상담 유형이므로 선택 상태로 설정:', typeFromUrl);
        setSelectedType(typeFromUrl);
      } else {
        console.log('유효하지 않은 상담 유형:', typeFromUrl);
      }
    } else {
      console.log('URL 파라미터가 없음, 기본값 사용');
    }
  }, [searchParams]);

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
      id: 'kakao-open',
      title: '카카오톡 오픈채팅 상담',
      description: '긴급한 상담이 필요한 경우 아래 QR을 통해 오픈채팅을 요청해 주세요.',
      process: 'QR 스캔 -> 채팅방 입장 -> 실시간 상담'
    }
  ];

  const handleConsultationSelect = (typeId) => {
    console.log('라디오 버튼 선택됨:', typeId);
    console.log('이전 선택 상태:', selectedType);
    setSelectedType(typeId);
    console.log('새로운 선택 상태로 설정됨:', typeId);
  };

  const handleReservation = () => {
    console.log('신청하기 버튼 클릭됨, 선택된 상담 유형:', selectedType);

    // 선택된 상담 유형에 따라 해당 페이지로 이동
    switch (selectedType) {
      case 'expert':
        console.log('전문가 상담 페이지로 이동');
        setMoveTo('/consultation/expert');
        break;
      case 'psychological':
        console.log('심리검사 및 해석상담 페이지로 이동');
        setMoveTo('/consultation/psychological');
        break;
      case 'board':
        console.log('게시판 상담 페이지로 이동');
        setMoveTo('/consultation/board');
        break;
      case 'kakao-open':
        console.log('카카오톡 오픈채팅 상담 페이지로 이동');
        setMoveTo('/consultation/kakao-open');
        break;
      default:
        console.log('알 수 없는 상담 유형:', selectedType);
        break;
    }
  };

  const selectedConsultation = consultationTypes.find(type => type.id === selectedType);

  return (
    <PageWrapper title="상담 선택하기">
      <div className="max-w-4xl mx-auto p-6">
        {/* 디버깅 정보 */}
        <div className="mb-4 p-2 bg-yellow-100 text-sm">
          현재 선택된 상담 유형: {selectedType} ({selectedConsultation?.title})
        </div>
                 {/* 상담 유형 선택 (라디오 버튼) */}
         <div className="mb-8">
           <div className="flex space-x-8">
                           {consultationTypes.map((type) => {
                const isSelected = selectedType === type.id;
                console.log(`라디오 버튼 렌더링 - ${type.id}: 선택됨=${isSelected}`);

                return (
                  <label
                    key={type.id}
                    className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                                     <input
                      type="radio"
                      name="consultationType"
                      value={type.id}
                      checked={isSelected}
                      onChange={() => handleConsultationSelect(type.id)}
                      className="mr-3"
                    />
                    <span className={`font-medium ${
                      isSelected ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {type.title}
                    </span>
                  </label>
                );
              })}
           </div>
         </div>

        {/* 설명 및 프로세스 안내 영역 */}
        <div className="mb-8">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              설명 및 프로세스 안내
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedConsultation?.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedConsultation?.description}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">진행 과정</h4>
                <p className="text-sm text-gray-600">
                  {selectedConsultation?.process}
                </p>
              </div>
            </div>
          </div>
        </div>

                 {/* 신청하기 버튼 */}
         <div className="text-center">
           <button
             onClick={handleReservation}
             disabled={!selectedType}
             className={`font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 w-full max-w-md ${
               selectedType
                 ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
             }`}
           >
             신청하기
           </button>
         </div>
      </div>
    </PageWrapper>
  );
}
