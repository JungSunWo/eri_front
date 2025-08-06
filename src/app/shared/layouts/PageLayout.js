'use client';

import { useMenuStore } from '@/slices/menuStore';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 0;
  margin-top: 0; /* 상단 여백 제거 */
  transition: margin-top 0.3s ease; /* 부드러운 전환 효과 */

  /* 메뉴가 활성화되었을 때만 추가 여백 */
  &.menu-active {
    margin-top: 100px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

const CardTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
`;

const CardSubtitle = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  color: white;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const PageLayout = ({
  title,
  subtitle,
  children,
  showCard = true,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) => {
  // 메뉴 상태 감지
  const activeMenus = useMenuStore((state) => state.activeMenus);
  const isMenuActive = activeMenus && activeMenus.length > 0;

  // 디버깅을 위한 로그
  console.log('PageLayout - activeMenus:', activeMenus);
  console.log('PageLayout - isMenuActive:', isMenuActive);

  if (!showCard) {
    return (
      <PageContainer className={className}>
        <MainContent className={isMenuActive ? 'menu-active' : ''}>
          <Container>
            {children}
          </Container>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer className={className}>
      <MainContent className={isMenuActive ? 'menu-active' : ''}>
        <Container>
          <Card>
            <CardHeader className={headerClassName}>
              <CardTitle>{title}</CardTitle>
              {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
            </CardHeader>
            <CardBody className={bodyClassName}>
              {children}
            </CardBody>
          </Card>
        </Container>
      </MainContent>
    </PageContainer>
  );
};

export default PageLayout;
