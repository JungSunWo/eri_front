'use client';

import React from 'react';
import styled from 'styled-components';

// Styled components
const SectionContainer = styled.div`
  margin-bottom: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const SectionHead = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #495057;
  
  &.cmp_section_tit {
    font-size: 1.25rem;
    font-weight: 600;
    color: #495057;
  }
`;

const SectionBody = styled.div`
  padding: 1.5rem;
`;

// CmpSection 컴포넌트
export const CmpSection = ({ children, className = '', ...props }) => {
  return (
    <SectionContainer className={className} {...props}>
      {children}
    </SectionContainer>
  );
};

// CmpSectionHead 컴포넌트
export const CmpSectionHead = ({ children, className = '', ...props }) => {
  return (
    <SectionHead className={className} {...props}>
      {children}
    </SectionHead>
  );
};

// CmpSectionBody 컴포넌트
export const CmpSectionBody = ({ children, className = '', ...props }) => {
  return (
    <SectionBody className={className} {...props}>
      {children}
    </SectionBody>
  );
};

// 기본 export
export default CmpSection; 