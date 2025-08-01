'use client';

import React from 'react';
import styled from 'styled-components';

// Styled components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-width: 28rem;
  width: 100%;
  overflow: hidden;
`;

const LoginHeader = styled.div`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
`;

const LoginTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
`;

const LoginSubtitle = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  color: white;
`;

const LoginBody = styled.div`
  padding: 2rem 1.5rem;
`;

const LoginLayout = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) => {
  return (
    <LoginContainer className={className}>
      <LoginCard>
        <LoginHeader className={headerClassName}>
          <LoginTitle>{title}</LoginTitle>
          {subtitle && <LoginSubtitle>{subtitle}</LoginSubtitle>}
        </LoginHeader>
        <LoginBody className={bodyClassName}>
          {children}
        </LoginBody>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginLayout; 