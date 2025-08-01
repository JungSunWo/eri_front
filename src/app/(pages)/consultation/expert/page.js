'use client';

import { setMoveTo } from '@/app/core/slices/pageMoveStore';
import CmpButton from '@/app/shared/components/button/cmp_button';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { toast } from '@/app/shared/utils/ui_com';
import { useState } from 'react';

export default function ExpertConsultationPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: '',
    description: ''
  });

  const consultationTypes = [
    { value: 'personal', label: '개인상담' },
    { value: 'couple', label: '부부상담' },
    { value: 'family', label: '가족상담' },
    { value: 'career', label: '진로상담' },
    { value: 'stress', label: '스트레스 관리' },
    { value: 'depression', label: '우울증 상담' },
    { value: 'anxiety', label: '불안증 상담' },
    { value: 'other', label: '기타' }
  ];

  const timeSlots = [
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // 필수 필드 검증
    if (!formData.name || !formData.phone || !formData.preferredDate || !formData.consultationType) {
      toast.callCommonToastOpen('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 전화번호 형식 검증
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.callCommonToastOpen('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
      return;
    }

    // 이메일 형식 검증 (선택사항이지만 입력된 경우)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.callCommonToastOpen('올바른 이메일 형식을 입력해주세요.');
        return;
      }
    }

    // 상담 신청 처리
    try {
      // TODO: API 호출
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
    <PageWrapper title="전문가 상담 신청">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">전문가 상담 신청</h2>
            <p className="text-gray-600">
              전문 상담가와 함께 문제를 해결해보세요. 신청 후 관리자 승인을 거쳐 상담이 진행됩니다.
            </p>
          </div>

          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <CmpInput
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <CmpInput
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <CmpInput
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            {/* 상담 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상담 유형 <span className="text-red-500">*</span>
                </label>
                <CmpSelect
                  value={formData.consultationType}
                  onChange={(value) => handleInputChange('consultationType', value)}
                  options={consultationTypes}
                  placeholder="상담 유형을 선택하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  희망 날짜 <span className="text-red-500">*</span>
                </label>
                <CmpInput
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                희망 시간
              </label>
              <CmpSelect
                value={formData.preferredTime}
                onChange={(value) => handleInputChange('preferredTime', value)}
                options={timeSlots}
                placeholder="희망 시간을 선택하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상담 내용
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="상담하고 싶은 내용을 자유롭게 작성해주세요"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4 mt-8">
            <CmpButton
              label="이전"
              styleType="secondary"
              click={handleBack}
              className="flex-1"
            />
            <CmpButton
              label="상담 신청"
              styleType="primary"
              click={handleSubmit}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
