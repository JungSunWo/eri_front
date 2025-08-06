'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import Calendar from '@/app/shared/components/Calendar';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { toast } from '@/app/shared/utils/ui_com';
import { useState } from 'react';

export default function ExpertConsultationPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('14:00'); // 기본값을 14:00으로 설정
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '14:00', // 기본값을 14:00으로 설정
    description: '',
    isAnonymous: true,
    attachments: []
  });

  const timeSlots = [
    { value: '10:00', label: '10시 00분' },
    { value: '12:00', label: '12시 00분' },
    { value: '14:00', label: '14시 00분' },
    { value: '16:00', label: '16시 00분' },
    { value: '18:00', label: '18시 00분' },
    { value: '20:00', label: '20시 00분' }
  ];

  // 예약 가능한 날짜 이벤트 (예시)
  const calendarEvents = [
    { date: '2025-08-04', title: '', type: 'event' },
    { date: '2025-08-05', title: '', type: 'event' },
    { date: '2025-08-06', title: '', type: 'event' },
    { date: '2025-08-07', title: '', type: 'event' },
    { date: '2025-08-08', title: '', type: 'event' },
    { date: '2025-08-11', title: '', type: 'event' },
    { date: '2025-08-12', title: '', type: 'event' },
    { date: '2025-08-13', title: '', type: 'event' },
    { date: '2025-08-14', title: '', type: 'event' },
    { date: '2025-08-15', title: '', type: 'event' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // 시간 선택 초기화
    const formattedDate = date.toISOString().split('T')[0];
    handleInputChange('preferredDate', formattedDate);
    handleInputChange('preferredTime', ''); // formData의 시간도 초기화
  };

  const handleSubmit = () => {
    if (!formData.preferredDate || !formData.preferredTime) {
      toast.callCommonToastOpen('날짜와 시간을 선택해주세요.');
      return;
    }

    try {
      console.log('전문가 상담 신청:', formData);
      toast.callCommonToastOpen('상담 신청이 완료되었습니다. 관리자 승인 후 연락드리겠습니다.');
      setMoveTo('/consultation/selection');
    } catch (error) {
      toast.callCommonToastOpen('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleBack = () => {
    setMoveTo('/consultation/selection');
  };

  return (
    <PageWrapper title="전문가 상담">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">전문가 상담</h2>

              {/* 프로세스 플로우 */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center mr-3 bg-white">
                    <div className="relative">
                      {/* 첫 번째 채팅 버블 */}
                      <div className="w-4 h-3 bg-white border border-gray-400 rounded-lg relative">
                        <div className="absolute top-1 left-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="absolute top-1 left-3 w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                      {/* 두 번째 채팅 버블 (뒤에 위치) */}
                      <div className="w-3 h-2.5 bg-white border border-gray-400 rounded-lg absolute -bottom-1 -right-1">
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                        <div className="absolute top-0.5 left-1.5 w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">상담신청</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-500">상담신청완료</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-500">관리자 승인</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-500">상담진행</span>
                </div>
              </div>

              {/* 마음챙김레터 바로가기 */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-xl">💬</span>
                    </div>
                    <span className="text-sm text-blue-600">마음챙김레터 바로가기 &gt;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3 space-y-6">
            {/* STEP 1: 날짜/시간 선택 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* STEP 제목 */}
                <div className="lg:col-span-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600 mr-3">STEP</span>
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border border-white">
                      1
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">날짜/시간 선택</div>
                </div>

                {/* STEP 내용 */}
                <div className="lg:col-span-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 캘린더 */}
                    <div>
                      <Calendar
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        events={calendarEvents}
                        showEvents={true}
                        showLegend={false}
                        size="medium"
                      />
                    </div>

                    {/* 시간대 선택 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">시간대 선택</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            onClick={() => {
                              setSelectedTime(slot.value);
                              handleInputChange('preferredTime', slot.value);
                            }}
                            className={`relative w-full p-4 text-sm rounded-full border-2 transition-all duration-200 flex items-center justify-between ${
                              selectedTime === slot.value
                                ? 'bg-blue-50 text-blue-600 border-blue-500 shadow-sm'
                                : slot.value === '10:00'
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                            }`}
                            disabled={slot.value === '10:00'}
                          >
                            <span className="font-medium">{slot.label}</span>
                            {selectedTime === slot.value && (
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* 선택된 시간 표시 */}
                      {selectedDate && selectedTime && (
                        <div className="mt-4 p-3 bg-gray-50 rounded border">
                          <span className="text-sm text-gray-600">· 상담요청시간</span>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {selectedDate.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })} {selectedTime}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: 상담 내용 작성 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* STEP 제목 */}
                <div className="lg:col-span-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600 mr-3">STEP</span>
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border border-white">
                      2
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">상담 내용 작성</div>
                </div>

                {/* STEP 내용 */}
                <div className="lg:col-span-4">
                  {/* 익명요청여부 */}
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                        className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">익명으로 상담요청</span>
                    </label>
                  </div>

                  {/* 상담내용 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      · 상담내용
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      상담내용 입력은 필수는 아닙니다! 이야기 하고 싶으신 내용이 있다면 자유롭게 작성해 주세요
                    </p>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="상담하고 싶은 내용을 자유롭게 작성해주세요"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {formData.description.length} / 5000 (글자수)
                    </div>
                  </div>

                  {/* 파일첨부 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">· 파일첨부</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="파일 경로"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 flex items-center">
                        <span className="mr-1">📁</span>
                        + 파일첨부
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">(엑셀파일, 한글파일, 이미지파일)</p>

                    {/* 첨부된 파일 목록 */}
                    {formData.attachments.length > 0 && (
                      <div className="space-y-2">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <button
                              onClick={() => {
                                const newAttachments = formData.attachments.filter((_, i) => i !== index);
                                handleInputChange('attachments', newAttachments);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 상담 예약 버튼 */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedDate || !selectedTime}
                className={`w-full max-w-md py-3 px-6 rounded-full text-lg font-semibold transition-colors flex items-center justify-center ${
                  selectedDate && selectedTime
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="mr-2">📅</span>
                상담예약
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
