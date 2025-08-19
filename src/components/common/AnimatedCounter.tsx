import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const CounterText = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  transition: color 0.3s ease;
`;

interface AnimatedCounterProps {
  targetValue: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(startValue + (targetValue - startValue) * easeOutCubic);
      
      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return (
    <CounterText className={className}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </CounterText>
  );
};