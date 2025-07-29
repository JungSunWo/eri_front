'use client';

import { useMenuStore } from '@/common/store/menuStore';
import { usePageMoveStore } from '@/common/store/pageMoveStore';
import { menuAPI } from '@/lib/api';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HeaderArea() {
  const activeMenus = useMenuStore((state) => state.activeMenus);
  const setActiveMenus = useMenuStore((state) => state.setActiveMenus);
  const setMoveTo = usePageMoveStore((state) => state.setMoveTo);
  const [showMainSelect, setShowMainSelect] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

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
          { mnuNm: '프로그램', mnuUrl: '#', children: [] },
          { mnuNm: 'IBK마음건강검진', mnuUrl: '#', children: [] },
          { mnuNm: '상담신청', mnuUrl: '#', children: [] },
          { mnuNm: '자료실', mnuUrl: '#', children: [] },
          { mnuNm: '설정하기', mnuUrl: '#', children: [] }
        ]);
      }
    };
    fetchMenuList();
  }, [setActiveMenus, isLoginPage, isRootPage]);

  if (isLoginPage || isRootPage) return null;

  return (
    <>
      <header className="w-full bg-white flex items-center justify-between px-8 py-4 shadow-sm rounded-t-3xl fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-4">
          <Image src="/ibk-logo.svg" alt="IBK 로고" width={40} height={40} />
          <span
            className="text-xl font-bold text-blue-700 cursor-pointer hover:underline"
            onClick={() => setShowMainSelect(true)}
          >
            IBK 직원권익보호 포탈
          </span>
        </div>
        {/* 1레벨 메뉴 */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-8 text-gray-700 font-medium text-base">
            {activeMenus && activeMenus.length > 0 ? (
              activeMenus.map((menu, idx) => (
                <li key={menu.mnuCd || idx}>
                  <button
                    type="button"
                    className={`font-bold ${activeMenu === idx ? 'text-blue-600 underline' : ''} ${
                      menu.mnuNm === '상담 페이지' ? 'text-green-600' :
                      menu.mnuNm === '관리자 페이지' ? 'text-blue-600' : ''
                    }`}
                    onClick={() => setActiveMenu(idx)}
                  >
                    {menu.mnuNm}
                  </button>
                </li>
              ))
            ) : (
              <>
                <li><span className="hover:text-blue-700 cursor-pointer">프로그램</span></li>
                <li><span className="hover:text-blue-700 cursor-pointer">IBK마음건강검진</span></li>
                <li><span className="hover:text-green-700 cursor-pointer">상담 페이지</span></li>
                <li><span className="hover:text-blue-700 cursor-pointer">자료실</span></li>
                <li><span className="hover:text-blue-700 cursor-pointer">설정하기</span></li>
              </>
            )}
          </ul>
        </nav>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <button
            type="button"
            className="hover:underline bg-transparent border-none p-0 m-0 text-sm text-gray-600 cursor-pointer"
            onClick={() => setMoveTo('/dashboard')}
            style={{ background: 'none', border: 'none' }}
          >
            마이페이지
          </button>
          <span>|</span>
          <button
            type="button"
            className="hover:underline bg-transparent border-none p-0 m-0 text-sm text-gray-600 cursor-pointer"
            onClick={() => setMoveTo('/guide')}
            style={{ background: 'none', border: 'none' }}
          >
            가이드
          </button>
          <span>|</span>
          <button
            type="button"
            className="hover:underline bg-transparent border-none p-0 m-0 text-sm text-gray-600 cursor-pointer"
            onClick={() => setMoveTo('/login')}
            style={{ background: 'none', border: 'none' }}
          >
            로그아웃 →
          </button>
        </div>
        {/* 2레벨 메뉴 팝업 */}
        {activeMenu !== null && activeMenus && activeMenus[activeMenu] && (
          <div className="fixed left-0 right-0 top-full mt-2 bg-white border-2 border-blue-500 rounded-xl shadow-lg p-6 z-40" style={{ minWidth: '900px', top: 'var(--header-height)' }}>
            <div className="flex justify-end mb-2">
              <button className="text-blue-600 font-bold" onClick={() => setActiveMenu(null)}>✕ 닫기</button>
            </div>
            <div className="grid grid-cols-5 gap-8">
              {activeMenus.map((menu, idx) => (
                <div key={menu.mnuCd}>
                  <div className="font-bold mb-2">{menu.mnuNm}</div>
                  <ul>
                    {menu.children && menu.children.length > 0 ? (
                      menu.children.map((sub, subIdx) => (
                        <li
                          key={sub.mnuCd}
                          className={`mb-1 cursor-pointer ${activeMenu === idx && subIdx === 0 ? 'text-blue-600 underline' : 'text-gray-500'}`}
                          onClick={() => {
                            if (sub.mnuUrl) {
                              router.push(sub.mnuUrl);
                              setActiveMenu(null);
                            }
                          }}
                        >
                          {sub.mnuNm}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 mb-1">서브메뉴 없음</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
            {/* 상담 페이지 메뉴가 활성화된 경우 하단에 상담 신청 현황 표시 */}
            {activeMenus[activeMenu] && activeMenus[activeMenu].mnuNm === '상담 페이지' && (
              <div className="mt-4 text-center">
                <span className="text-green-600 underline font-bold">상담 신청 현황</span>
              </div>
            )}
          </div>
        )}
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
