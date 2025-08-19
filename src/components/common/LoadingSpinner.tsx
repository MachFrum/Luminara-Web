import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTheme } from '../../contexts/ThemeContext';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size: number }>`
  display: inline-block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const Spinner = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  className 
}) => {
  return (
    <SpinnerContainer size={size} className={className}>
      <Spinner size={size} />
    </SpinnerContainer>
  );
};