'use client';

import React from 'react';
import styled from 'styled-components';
import { CmpButton } from '@/components/button/cmp_button';

// Styled components
const Card = styled.div`
  background: ${props => props.bgColor || '#f8f9fa'};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid ${props => props.borderColor || '#e9ecef'};
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.textColor || '#495057'};
`;

const CardValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.valueColor || '#007bff'};
`;

const CardContent = styled.div`
  flex: 1;
  margin-bottom: 1rem;
`;

const CardFooter = styled.div`
  margin-top: auto;
`;

const InfoCard = ({
  title,
  value,
  children,
  buttonText,
  onButtonClick,
  bgColor,
  borderColor,
  textColor,
  valueColor,
  className = '',
  showButton = true
}) => {
  return (
    <Card 
      bgColor={bgColor} 
      borderColor={borderColor}
      className={className}
    >
      <CardHeader>
        <CardTitle textColor={textColor}>{title}</CardTitle>
        {value && <CardValue valueColor={valueColor}>{value}</CardValue>}
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
      
      {showButton && buttonText && (
        <CardFooter>
          <CmpButton 
            label={buttonText} 
            click={onButtonClick}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default InfoCard; 