'use client';

import { usePageMoveStore } from '@/app/core/slices/pageMoveStore';
import PageWrapper from '@/app/shared/layouts/PageWrapper';
import { BookOpen, MessageCircle } from 'lucide-react';

const ConsultationPage = () => {
    const setMoveTo = usePageMoveStore((state) => state.setMoveTo);

    const handleConsultationClick = () => {
        setMoveTo('/consultation/selection');
    };

    const handleProgramClick = () => {
        setMoveTo('/program');
    };

    return (
        <PageWrapper title="상담 및 프로그램">
            <div className="max-w-4xl mx-auto p-6">
                {/* 헤더 */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">상담 및 프로그램</h1>
                    <p className="text-gray-600 text-lg">원하시는 서비스를 선택해주세요.</p>
                </div>

                {/* 버튼 영역 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {/* 상담 버튼 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-center">
                            <div className="p-4 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">상담</h3>
                            <p className="text-gray-600 mb-6">
                                전문 상담사와 1:1 맞춤 상담을 통해 개인적인 심리 상태를 점검하고 해결 방안을 제시받을 수 있습니다.
                            </p>
                            <button
                                onClick={handleConsultationClick}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                상담 신청하기
                            </button>
                        </div>
                    </div>

                    {/* 프로그램 버튼 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-center">
                            <div className="p-4 rounded-full bg-green-100 text-green-600 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">프로그램</h3>
                            <p className="text-gray-600 mb-6">
                                다양한 심리 프로그램과 교육 과정을 통해 체계적인 심리 관리와 성장을 도와드립니다.
                            </p>
                            <button
                                onClick={handleProgramClick}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                프로그램 보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ConsultationPage;
