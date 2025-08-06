'use client';

import PageWrapper from '@/layouts/PageWrapper';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResourcesPage() {
    const router = useRouter();

    useEffect(() => {
        // 기본적으로 공지사항 페이지로 리다이렉트
        router.replace('/resources/notice');
    }, [router]);

    return (
        <PageWrapper>
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">리소스 페이지로 이동 중...</p>
                </div>
            </div>
        </PageWrapper>
    );
}
