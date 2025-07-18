/**
 * @File Name      : PageWrapper.js
 * @File path      : src/components/layout/PageWrapper.js
 * @author         : 정선우
 * @Description    : 페이지 래퍼 컴포넌트
 *                   - 페이지별 레이아웃 타입에 따른 동적 레이아웃 선택
 *                   - 헤더, LNB, 로그인 레이아웃 등 통합 관리
 *                   - 전역 팝업 및 페이지 이동 컴포넌트 포함
 *                   - 가이드 페이지 특별 처리
 * @History        : 20250701  최초 신규
 **/

'use client';

import GlobalPopups from '@/common/components/GlobalPopups';
import PageMove from '@/common/components/PageMove';
import { usePathname } from 'next/navigation';
import HeaderArea from './HeaderArea';
import LnbLayout from './LnbLayout';
import LoginLayout from './LoginLayout';
import PageLayout from './PageLayout';
import ScrollToTop from './ScrollToTop';

/**
 * 페이지 래퍼 컴포넌트
 * 페이지별 레이아웃 타입에 따라 적절한 레이아웃을 선택하고 적용
 * 모든 페이지의 공통 레이아웃 구조를 관리하며, 전역 컴포넌트들을 포함
 *
 * @param {React.ReactNode} children - 페이지 컨텐츠 (실제 페이지 컴포넌트)
 * @param {string} title - 페이지 제목 (브라우저 탭 및 헤더에 표시)
 * @param {string} subtitle - 페이지 부제목 (헤더 영역에 표시)
 * @param {string} layoutType - 레이아웃 타입 ('default', 'login')
 * @param {boolean} showCard - 카드 형태 표시 여부 (페이지 컨텐츠를 카드로 감쌀지 여부)
 * @param {string} className - 추가 CSS 클래스 (최상위 컨테이너에 적용)
 * @param {string} headerClassName - 헤더 CSS 클래스 (페이지 헤더 영역에 적용)
 * @param {string} bodyClassName - 바디 CSS 클래스 (페이지 본문 영역에 적용)
 * @param {Array} menuItems - LNB 메뉴 아이템 배열 (가이드 페이지에서 사용)
 * @returns {JSX.Element} 적절한 레이아웃이 적용된 페이지 컴포넌트
 */
const PageWrapper = ({
  children,
  title,
  subtitle,
  layoutType = 'default', // 'default', 'login'
  showCard = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  menuItems = [] // LNB 메뉴 아이템
}) => {
  /**
   * 현재 페이지 경로 확인
   * Next.js의 usePathname 훅을 사용하여 현재 페이지 경로를 가져옴
   */
  const pathname = usePathname();

  /**
   * 가이드 페이지 여부 확인
   * 가이드 페이지는 특별한 LNB 레이아웃을 사용
   */
  const isGuidePage = pathname === '/guide';

  /**
   * 가이드 페이지 특별 처리
   * 가이드 페이지인 경우 LNB 레이아웃을 사용하여 좌측 네비게이션 제공
   */
  if (isGuidePage) {
    return (
      <LnbLayout menuItems={menuItems} title={title}>
        <PageMove />
        {children}
        <GlobalPopups />
      </LnbLayout>
    );
  }

  /**
   * 레이아웃 타입에 따른 컴포넌트 선택
   * login 타입인 경우 LoginLayout, 그 외에는 PageLayout 사용
   */
  const LayoutComponent = layoutType === 'login' ? LoginLayout : PageLayout;

  return (
    <>
      {/* 로그인 페이지가 아닌 경우에만 헤더 표시 */}
      {layoutType !== 'login' && (
        <>
          <HeaderArea />
        </>
      )}

      {/* 선택된 레이아웃 컴포넌트로 페이지 래핑 */}
      <LayoutComponent
        title={title}
        subtitle={subtitle}
        showCard={showCard}
        className={className}
        headerClassName={headerClassName}
        bodyClassName={bodyClassName}
      >
        <PageMove />
        {children}
        <GlobalPopups />
        <ScrollToTop />
      </LayoutComponent>
    </>
  );
};

export default PageWrapper;
