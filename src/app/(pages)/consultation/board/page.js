'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import CmpButton from '@/app/shared/components/button/cmp_button';
import CmpInput from '@/app/shared/components/ui/CmpInput';
import CmpSelect from '@/app/shared/components/ui/CmpSelect';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { toast } from '@/app/shared/utils/ui_com';
import { useState } from 'react';

export default function BoardConsultationPage() {
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    isAnonymous: false,
    contactInfo: ''
  });

  const categories = [
    { value: 'personal', label: '개인상담' },
    { value: 'relationship', label: '대인관계' },
    { value: 'family', label: '가족문제' },
    { value: 'career', label: '진로/직장' },
    { value: 'stress', label: '스트레스' },
    { value: 'emotion', label: '정서문제' },
    { value: 'study', label: '학업문제' },
    { value: 'other', label: '기타' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // 필수 필드 검증
    if (!formData.title || !formData.category || !formData.content) {
      toast.callCommonToastOpen('제목, 카테고리, 내용을 모두 입력해주세요.');
      return;
    }

    // 제목 길이 검증
    if (formData.title.length < 5) {
      toast.callCommonToastOpen('제목을 5자 이상 입력해주세요.');
      return;
    }

    // 내용 길이 검증
    if (formData.content.length < 20) {
      toast.callCommonToastOpen('내용을 20자 이상 입력해주세요.');
      return;
    }

    // 게시판 상담 글 작성 처리
    try {
      // TODO: API 호출
      console.log('게시판 상담 글 작성:', formData);

      toast.callCommonToastOpen('상담 글이 등록되었습니다. 전문가 확인 후 답변을 드리겠습니다.');
      setMoveTo('/consultation/selection');
    } catch (error) {
      toast.callCommonToastOpen('글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleBack = () => {
    setMoveTo('/consultation/selection');
  };

  return (
    <PageWrapper title="게시판 상담">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">게시판 상담</h2>
            <p className="text-gray-600">
              언제 어디서나 편하게 상담을 남겨주세요. 남겨 주신 내용은 전문가가 확인 후 신속하고 정확하게 답변 해 드립니다.
            </p>
          </div>

          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <CmpInput
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="상담 제목을 입력하세요"
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <CmpSelect
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                options={categories}
                placeholder="카테고리를 선택하세요"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상담 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="8"
                placeholder="상담하고 싶은 내용을 자세히 작성해주세요. 구체적인 상황과 감정을 포함하여 작성하시면 더 정확한 답변을 받으실 수 있습니다."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.length}/1000자
              </p>
            </div>

            {/* 연락처 정보 (선택사항) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 정보 (선택사항)
              </label>
              <CmpInput
                value={formData.contactInfo}
                onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                placeholder="이메일 또는 전화번호 (개인정보 보호를 위해 답변 시에만 사용됩니다)"
              />
            </div>

            {/* 익명 설정 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                익명으로 작성하기
              </label>
            </div>

            {/* 안내사항 */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">게시판 상담 안내사항</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 작성하신 내용은 전문가가 검토 후 답변을 드립니다.</li>
                <li>• 답변은 보통 1-2일 내에 게시됩니다.</li>
                <li>• 개인정보가 포함된 내용은 익명으로 작성하시거나 연락처 정보를 별도로 남겨주세요.</li>
                <li>• 긴급한 상황이라면 전문가 상담이나 카카오톡 오픈채팅을 이용해주세요.</li>
                <li>• 상담 내용은 개인정보보호법에 따라 안전하게 관리됩니다.</li>
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
              label="상담글 작성"
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
