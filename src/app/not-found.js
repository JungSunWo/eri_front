"use client";

import PageWrapper from '@/app/shared/layouts/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper
      title="404"
      subtitle="페이지를 찾을 수 없습니다"
      showCard={false}
    >
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404 - 페이지를 찾을 수 없습니다</h1>
        <p className="text-lg text-gray-600">요청하신 페이지가 존재하지 않습니다.</p>
      </div>
    </PageWrapper>
  );
}
