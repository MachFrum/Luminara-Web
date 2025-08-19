import React from 'react';
import styled from '@emotion/styled';
import { GraduationCap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BrandSection = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
`;

const BrandTagline = styled.p`
  font-size: 1.25rem;
  text-align: center;
  opacity: 0.9;
  line-height: 1.5;
  max-width: 400px;
`;

const ContentSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <BrandSection>
        <BackgroundPattern />
        <BrandLogo>
          <LogoIcon>
            <GraduationCap size={30} />
          </LogoIcon>
          <BrandName>Luminara</BrandName>
        </BrandLogo>
        <BrandTagline>
          AI-powered learning platform that transforms how you understand and solve problems
        </BrandTagline>
      </BrandSection>
      
      <ContentSection>
        <ContentContainer>
          {children}
        </ContentContainer>
      </ContentSection>
    </LayoutContainer>
  );
};