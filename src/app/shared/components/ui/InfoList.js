'use client';

import React from 'react';
import styled from 'styled-components';

// Styled components
const ListContainer = styled.div`
  margin-bottom: 1rem;
`;

const ListTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: ${props => props.titleColor || '#495057'};
`;

const List = styled.ul`
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0;
`;

const ListItem = styled.li`
  font-size: 0.875rem;
  color: ${props => props.textColor || '#6c757d'};
  margin-bottom: 0.5rem;
  line-height: 1.4;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: #6c757d;
  font-style: italic;
`;

const InfoList = ({
  title,
  items = [],
  titleColor,
  textColor,
  className = '',
  emptyMessage = '데이터가 없습니다.'
}) => {
  return (
    <ListContainer className={className}>
      <ListTitle titleColor={titleColor}>{title}</ListTitle>
      {items.length > 0 ? (
        <List>
          {items.map((item, index) => (
            <ListItem key={index} textColor={textColor}>
              {item}
            </ListItem>
          ))}
        </List>
      ) : (
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      )}
    </ListContainer>
  );
};

export default InfoList; 