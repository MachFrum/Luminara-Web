import React from 'react';
import styled from '@emotion/styled';

const RingContainer = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RingSvg = styled.svg<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  transform: rotate(-90deg);
`;

const RingBackground = styled.circle`
  fill: transparent;
  stroke: ${props => props.theme.colors.border};
  stroke-width: 3;
`;

const RingProgress = styled.circle<{ progress: number; circumference: number }>`
  fill: transparent;
  stroke: ${props => props.theme.colors.primary};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: ${props => props.circumference};
  stroke-dashoffset: ${props => props.circumference * (1 - props.progress / 100)};
  transition: stroke-dashoffset 0.5s ease;
`;

const RingContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ProgressText = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ProgressLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

interface ProgressRingProps {
  progress: number;
  size?: number;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  showPercentage = true,
  label,
  className,
}) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <RingContainer size={size} className={className}>
      <RingSvg size={size}>
        <RingBackground
          cx={center}
          cy={center}
          r={radius}
        />
        <RingProgress
          cx={center}
          cy={center}
          r={radius}
          progress={progress}
          circumference={circumference}
        />
      </RingSvg>
      <RingContent>
        {showPercentage && (
          <ProgressText>{Math.round(progress)}%</ProgressText>
        )}
        {label && (
          <ProgressLabel>{label}</ProgressLabel>
        )}
      </RingContent>
    </RingContainer>
  );
};