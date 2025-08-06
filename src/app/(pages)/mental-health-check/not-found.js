"use client";

import PageWrapper from '@/layouts/PageWrapper';
import { useRouter } from 'next/navigation';

export default function MentalHealthCheckNotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <PageWrapper
      title="404"
      subtitle="정신건강 체크 페이지를 찾을 수 없습니다"
      showCard={false}
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">정신건강 체크 페이지를 찾을 수 없습니다</h2>
          <p className="text-lg text-gray-600 mb-8">
            요청하신 정신건강 체크 페이지가 존재하지 않거나 아직 준비 중입니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              이전 페이지로
            </button>
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
