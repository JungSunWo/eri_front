'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import CmpButton from '@/app/shared/components/button/cmp_button';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { toast } from '@/app/shared/utils/ui_com';
import { useState } from 'react';

export default function PsychologicalConsultationPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    testType: '',
    preferredDate: '',
    description: ''
  });

  const testTypes = [
    { value: 'personality', label: '성격검사 (MMPI-2)' },
    { value: 'depression', label: '우울증검사 (BDI)' },
    { value: 'anxiety', label: '불안검사 (BAI)' },
    { value: 'stress', label: '스트레스검사' },
    { value: 'career', label: '진로적성검사' },
    { value: 'intelligence', label: '지능검사 (K-WAIS)' },
    { value: 'memory', label: '기억력검사' },
    { value: 'attention', label: '주의력검사' },
    { value: 'comprehensive', label: '종합심리검사' }
  ];

  const genderOptions = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // 필수 필드 검증
    if (!formData.name || !formData.phone || !formData.testType || !formData.preferredDate) {
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

    // 나이 검증
    if (formData.age) {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 1 || age > 120) {
        toast.callCommonToastOpen('올바른 나이를 입력해주세요.');
        return;
      }
    }

    // 심리검사 신청 처리
    try {
      // TODO: API 호출
      console.log('심리검사 신청:', formData);

      toast.callCommonToastOpen('심리검사 신청이 완료되었습니다. 검사 일정을 조율하여 연락드리겠습니다.');
      setMoveTo('/consultation/selection');
    } catch (error) {
      toast.callCommonToastOpen('심리검사 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleBack = () => {
    setMoveTo('/consultation/selection');
  };

  return (
    <PageWrapper title="심리검사 및 해석상담 신청">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">심리검사 및 해석상담 신청</h2>
            <p className="text-gray-600">
              전문적인 심리검사를 통해 현재 상태를 객관적으로 파악하고, 검사 결과에 따른 전문 상담을 받아보세요.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나이
                </label>
                <CmpInput
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="나이를 입력하세요"
                  type="number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성별
                </label>
                <CmpSelect
                  value={formData.gender}
                  onChange={(value) => handleInputChange('gender', value)}
                  options={genderOptions}
                  placeholder="성별을 선택하세요"
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

            {/* 검사 정보 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                희망 검사 유형 <span className="text-red-500">*</span>
              </label>
              <CmpSelect
                value={formData.testType}
                onChange={(value) => handleInputChange('testType', value)}
                options={testTypes}
                placeholder="검사 유형을 선택하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                희망 검사 날짜 <span className="text-red-500">*</span>
              </label>
              <CmpInput
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검사 목적 및 상담 내용
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="검사를 받고 싶은 이유나 상담하고 싶은 내용을 자유롭게 작성해주세요"
              />
            </div>

            {/* 안내사항 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">검사 안내사항</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 검사 시간은 검사 유형에 따라 30분~2시간 정도 소요됩니다.</li>
                <li>• 검사 결과는 1주일 내에 전문가 해석상담을 통해 제공됩니다.</li>
                <li>• 검사 전 충분한 휴식을 취하고 정상적인 컨디션을 유지해주세요.</li>
                <li>• 검사 결과는 개인정보보호법에 따라 안전하게 관리됩니다.</li>
              </ul>
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
              label="심리검사 신청"
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
