import React from 'react';
import styled from '@emotion/styled';
import { UserPlus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BannerContainer = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${props => props.theme.shadows.small};
  position: relative;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const BannerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
`;

const BannerText = styled.div`
  flex: 1;
`;

const BannerTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const BannerDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
`;

const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SignUpButton = styled.button`
  background: white;
  color: ${props => props.theme.colors.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface GuestBannerProps {
  onSignUpClick: () => void;
  onClose: () => void;
}

export const GuestBanner: React.FC<GuestBannerProps> = ({
  onSignUpClick,
  onClose,
}) => {
  return (
    <BannerContainer>
      <BannerContent>
        <BannerIcon>
          <UserPlus size={20} />
        </BannerIcon>
        <BannerText>
          <BannerTitle>You're in Guest Mode</BannerTitle>
          <BannerDescription>
            Sign up to save your progress and unlock all features
          </BannerDescription>
        </BannerText>
      </BannerContent>
      <BannerActions>
        <SignUpButton onClick={onSignUpClick}>
          Sign Up Free
        </SignUpButton>
        <CloseButton onClick={onClose} aria-label="Close banner">
          <X size={16} />
        </CloseButton>
      </BannerActions>
    </BannerContainer>
  );
};