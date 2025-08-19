import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Plus } from 'lucide-react';

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const ActionButton = styled.button<{ $isActive?: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.large};
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.large}, 0 0 20px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${props => props.$isActive && `
    animation: ${pulse} 2s infinite;
  `}

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

interface PulsingActionButtonProps {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

export const PulsingActionButton: React.FC<PulsingActionButtonProps> = ({
  onClick,
  isActive = false,
  className,
}) => {
  return (
    <ActionButton 
      onClick={onClick} 
      $isActive={isActive}
      className={className}
      aria-label="Add new problem"
    >
      <Plus size={24} />
    </ActionButton>
  );
};