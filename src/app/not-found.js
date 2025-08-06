'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function NotFound() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  console.log('NotFound 페이지 렌더링:', {
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    timestamp: new Date().toISOString()
  });

  // 무한 리다이렉트 방지
  useEffect(() => {
    if (hasRedirected.current) {
      console.log('NotFound - 이미 리다이렉트됨, 추가 리다이렉트 방지');
      return;
    }

    // 404 페이지에서 404로 다시 리다이렉트되는 것을 방지
    const currentPath = window.location.pathname;
    if (currentPath.includes('404') || currentPath.includes('not-found')) {
      console.log('NotFound - 404 페이지에서 404로 리다이렉트 방지');
      hasRedirected.current = true;
      return;
    }

    // 즉시 홈으로 이동 (무한 리프레시 방지)
    console.log('NotFound - 즉시 홈으로 이동');
    hasRedirected.current = true;
    window.location.href = '/';
  }, []);

  const handleGoBack = () => {
    console.log('NotFound - 뒤로가기 버튼 클릭');
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      router.back();
    }
  };

  const handleGoHome = () => {
    console.log('NotFound - 홈으로 이동 버튼 클릭');
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">페이지를 찾을 수 없습니다</h2>
        <p className="text-lg text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
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
  );
}
