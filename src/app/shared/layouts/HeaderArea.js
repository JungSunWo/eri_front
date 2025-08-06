'use client';

import { menuAPI } from '@/services/api';
import { useMenuStore } from '@/slices/menuStore';
import { usePageMoveStore } from '@/slices/pageMoveStore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HeaderArea() {
  const activeMenus = useMenuStore((state) => state.activeMenus);
  const setActiveMenus = useMenuStore((state) => state.setActiveMenus);
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const [showMainSelect, setShowMainSelect] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname.startsWith('/login');
  const isRootPage = pathname === '/';

  // 메뉴 데이터를 계층 구조로 변환하는 함수
  const buildMenuHierarchy = (menuList) => {
    const level1Menus = menuList.filter(menu => menu.mnuLvl === 1 && menu.mnuUseYn === 'Y');
    const level2Menus = menuList.filter(menu => menu.mnuLvl === 2 && menu.mnuUseYn === 'Y');

    // 1레벨 메뉴에 2레벨 메뉴를 children으로 추가
    const hierarchicalMenus = level1Menus.map(level1Menu => {
      const children = level2Menus
        .filter(level2Menu => level2Menu.pMnuCd === level1Menu.mnuCd)
        .sort((a, b) => a.mnuOrd - b.mnuOrd);

      return {
        ...level1Menu,
        children
      };
    }).sort((a, b) => a.mnuOrd - b.mnuOrd);

    return hierarchicalMenus;
  };

  // 메뉴 데이터 가져오기
  useEffect(() => {
    if (isLoginPage || isRootPage) {
      setActiveMenus([]);
      return;
    }
    if (activeMenus && activeMenus.length > 0) {
      return;
    }
    const fetchMenuList = async () => {
      try {
        const data = await menuAPI.getMenuList();
        const rawList = Array.isArray(data?.data) ? data.data : [];

        // 계층 구조로 변환
        const hierarchicalMenus = buildMenuHierarchy(rawList);

        // 관리자 메뉴 필터링 (임시로 모든 메뉴 표시, 나중에 사용자 권한에 따라 필터링)
        const filteredMenus = hierarchicalMenus;

        setActiveMenus(filteredMenus);
      } catch (error) {
        console.error('메뉴 API 호출 중 오류:', error);
        setActiveMenus([
          { mnuNm: '프로그램', mnuUrl: '/program', children: [] },
          { mnuNm: 'IBK마음건강검진', mnuUrl: '/health-check', children: [] },
          { mnuNm: '상담신청', mnuUrl: '/consultation', children: [] },
          { mnuNm: '자료실', mnuUrl: '/resources', children: [] },
          { mnuNm: '설정하기', mnuUrl: '/settings', children: [] }
        ]);
      }
    };
    fetchMenuList();
  }, [setActiveMenus, isLoginPage, isRootPage]);

  // 메뉴 클릭 핸들러
  const handleMenuClick = (menu) => {
    console.log('메뉴 클릭:', menu.mnuNm, menu.mnuUrl);

    // 메뉴 이름에 따른 페이지 이동
    switch (menu.mnuNm) {
      case '프로그램':
        setMoveTo('/program');
        break;
      case 'IBK마음건강검진':
        setMoveTo('/health-check');
        break;
      case '상담신청':
        setMoveTo('/consultation');
        break;
      case '자료실':
        setMoveTo('/resources');
        break;
      case '설정하기':
        setMoveTo('/settings');
        break;
      default:
        // URL이 있는 경우 해당 URL로 이동
        if (menu.mnuUrl && menu.mnuUrl !== '#') {
          router.push(menu.mnuUrl);
        } else {
          console.log('유효하지 않은 URL:', menu.mnuUrl);
        }
        break;
    }
  };

  if (isLoginPage || isRootPage) return null;

  return (
    <>
      <header className="w-full bg-white flex items-center justify-between px-4 py-3 shadow-sm rounded-t-3xl fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-3">
          <Image src="/ibk-logo.svg" alt="IBK 로고" width={32} height={32} />
          <span
            className="text-lg font-bold text-blue-700 cursor-pointer hover:underline whitespace-nowrap"
            onClick={() => setShowMainSelect(true)}
          >
            IBK 직원권익보호 포탈
          </span>
        </div>
        {/* 1레벨 메뉴 */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-4 text-gray-700 font-medium text-sm">
            {activeMenus && activeMenus.length > 0 ? (
              activeMenus.map((menu, idx) => (
                <li key={menu.mnuCd || idx}>
                  <button
                    type="button"
                    className={`font-bold whitespace-nowrap hover:text-blue-600 hover:underline cursor-pointer ${
                      menu.mnuNm === '상담신청' ? 'text-green-600' : ''
                    }`}
                    onClick={() => handleMenuClick(menu)}
                  >
                    {menu.mnuNm}
                  </button>
                </li>
              ))
            ) : (
              <>
                <li>
                  <button
                    className="hover:text-blue-700 cursor-pointer whitespace-nowrap"
                    onClick={() => setMoveTo('/program')}
                  >
                    프로그램
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-blue-700 cursor-pointer whitespace-nowrap"
                    onClick={() => setMoveTo('/health-check')}
                  >
                    IBK마음건강검진
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-green-700 cursor-pointer whitespace-nowrap"
                    onClick={() => setMoveTo('/consultation')}
                  >
                    상담신청
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-blue-700 cursor-pointer whitespace-nowrap"
                    onClick={() => setMoveTo('/resources')}
                  >
                    자료실
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-blue-700 cursor-pointer whitespace-nowrap"
                    onClick={() => setMoveTo('/settings')}
                  >
                    설정하기
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <button
            type="button"
            className="hover:underline bg-transparent border-none p-0 m-0 text-xs text-gray-600 cursor-pointer whitespace-nowrap"
            onClick={() => setMoveTo('/dashboard')}
            style={{ background: 'none', border: 'none' }}
          >
            마이페이지
          </button>
          <span>|</span>
          <button
            type="button"
            className="hover:underline bg-transparent border-none p-0 m-0 text-xs text-gray-600 cursor-pointer whitespace-nowrap"
            onClick={() => setMoveTo('/guide')}
            style={{ background: 'none', border: 'none' }}
          >
            가이드
          </button>
          <span>|</span>
          <button
            type="button"
            className="hover:underline bg-transparent border-none p-0 m-0 text-xs text-gray-600 cursor-pointer whitespace-nowrap"
            onClick={() => setMoveTo('/login')}
            style={{ background: 'none', border: 'none' }}
          >
            로그아웃 →
          </button>
        </div>
        {/* 메인 선택 모달 */}
        {showMainSelect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4">이동할 메인 유형을 선택하세요</h3>
              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => { setMoveTo('/main'); setShowMainSelect(false); }}
                >
                  메인
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => { setMoveTo('/main-btype'); setShowMainSelect(false); }}
                >
                  메인 B타입
                </button>
              </div>
              <button
                className="mt-6 text-gray-500 hover:underline"
                onClick={() => setShowMainSelect(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
