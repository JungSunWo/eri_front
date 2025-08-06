'use client';

import { authAPI } from '@/services/api';
import { usePageMoveStore } from '@/slices/pageMoveStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

// 전역 플래그로 뒤로가기/새로고침 실행 상태 관리
let globalIsGoingBack = false;
let globalIsRefreshing = false;

export default function PageMove() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/login');
  const moveTo = usePageMoveStore((state) => state.moveTo);
  const resetMoveTo = usePageMoveStore((state) => state.resetMoveTo);
  const refresh = usePageMoveStore((state) => state.refresh);
  const resetRefresh = usePageMoveStore((state) => state.resetRefresh);
  const goBack = usePageMoveStore((state) => state.goBack);
  const resetGoBack = usePageMoveStore((state) => state.resetGoBack);

  console.log('PageMove 렌더링:', { pathname, moveTo, refresh, goBack, isLoginPage });

  // 로컬 ref들
  const isGoingBack = useRef(false);
  const isRefreshing = useRef(false);

  useEffect(() => {
    console.log('PageMove - moveTo useEffect 실행:', { moveTo });
    if (!moveTo) return;
    if (moveTo === '/login') {
      router.replace(moveTo);
    } else {
      router.push(moveTo);
    }
    resetMoveTo();
  }, [moveTo, router]);

  useEffect(() => {
    console.log('PageMove - refresh useEffect 실행:', {
      refresh,
      globalIsRefreshing,
      isRefreshing: isRefreshing.current,
      timestamp: new Date().toISOString()
    });

    // 전역 플래그와 로컬 플래그 모두 체크
    if (refresh && !globalIsRefreshing && !isRefreshing.current) {
      // 모든 플래그 설정
      globalIsRefreshing = true;
      isRefreshing.current = true;

      // 상태 즉시 리셋
      resetRefresh();

      console.log('새로고침 실행:', new Date().toISOString());

      // window.location.reload() 사용하여 완전한 페이지 새로고침
      window.location.reload();

      // 플래그 리셋은 새로고침으로 인해 페이지가 다시 로드되므로 불필요
    }
  }, [refresh]);

  useEffect(() => {
    // 전역 플래그와 로컬 플래그 모두 체크
    if (goBack && !globalIsGoingBack && !isGoingBack.current) {
      // 모든 플래그 설정
      globalIsGoingBack = true;
      isGoingBack.current = true;

      // 상태 즉시 리셋
      resetGoBack();

      console.log('뒤로가기 실행:', new Date().toISOString());

      // 즉시 뒤로가기 실행 (setTimeout 제거)
      router.back();

      // 500ms 후 플래그 리셋
      setTimeout(() => {
        globalIsGoingBack = false;
        isGoingBack.current = false;
        console.log('뒤로가기 플래그 리셋:', new Date().toISOString());
      }, 500);
    }
  }, [goBack, router]);

  // 페이지 이동 시 로그인 상태 확인
  useEffect(() => {
    if (isLoginPage) return;
    const checkSession = async () => {
      try {
        const res = await authAPI.sessionStatus();
        if (!res || res.success === false) {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      }
    };
    checkSession();
  }, [pathname, isLoginPage, router]);

  return null;
}
