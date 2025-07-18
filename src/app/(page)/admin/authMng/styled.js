import styled from 'styled-components';

export const TabContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

export const TabContent = styled.div`
  padding: 2rem;
`;

export const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: end;
  flex-wrap: wrap;
`;

export const ActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ModalContent = styled.div`
  padding: 1.5rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormRow = styled.div`
  margin-bottom: 1rem;
`;

export const PermissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case '활성': return '#d4edda';
      case '비활성': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case '활성': return '#155724';
      case '비활성': return '#721c24';
      default: return '#495057';
    }
  }};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #6b7280;
`;

