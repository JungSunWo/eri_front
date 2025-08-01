'use client';

import PageWrapper from '@/app/shared/layouts/PageWrapper';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PageWrapper
      title="자료실"
      subtitle="공지사항 상세"
      showCard={false}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link
            href="/resources/notice"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>

        {/* 404 에러 메시지 */}
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">공지사항을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              요청하신 공지사항이 존재하지 않거나 삭제되었을 수 있습니다.
              목록에서 다른 공지사항을 확인해보세요.
            </p>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resources/notice"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              공지사항 목록으로
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
