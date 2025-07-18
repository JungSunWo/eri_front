/**
 * @File Name      : page.js
 * @File path      : src/app/page.js
 * @Description    : 루트 경로(/) 접근 시 자동으로 로그인 페이지로 리다이렉트하는 컴포넌트
 *                   사용자가 메인 페이지에 접근하면 자동으로 로그인 페이지로 이동
 * @History        : 20250701  최초 신규
 **/

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 홈 페이지 컴포넌트
 * 루트 경로 접근 시 자동으로 로그인 페이지로 리다이렉트
 * @returns {null} 렌더링되는 UI 없음 (리다이렉트만 수행)
 */
export default function Home() {
  const router = useRouter();

  // 컴포넌트 마운트 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  return null;
}
