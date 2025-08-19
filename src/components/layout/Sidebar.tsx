import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  User, 
  Settings, 
  GraduationCap,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const SidebarContainer = styled.aside`
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  
  @media (max-width: 1024px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing.md} 0;
`;

const NavSection = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
    margin-bottom: ${props => props.theme.spacing.md};
    padding-bottom: ${props => props.theme.spacing.md};
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0 1.5rem 1.5rem 0;
  margin-right: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
  
  &.active {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
    border-right: 3px solid ${props => props.theme.colors.primary};
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0 1.5rem 1.5rem 0;
  margin-right: ${props => props.theme.spacing.sm};
  text-align: left;
  width: calc(100% - ${props => props.theme.spacing.sm});
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const NavText = styled.span`
  font-size: 0.95rem;
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { toggleTheme, mode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <SidebarContainer className={isOpen ? 'open' : ''}>
      <SidebarHeader>
        <Logo>
          <LogoIcon>
            <GraduationCap size={20} />
          </LogoIcon>
          <LogoText>Luminara</LogoText>
        </Logo>
      </SidebarHeader>
      
      <Navigation>
        <NavSection>
          <NavItem to="/" onClick={onClose}>
            <Home size={20} />
            <NavText>Dashboard</NavText>
          </NavItem>
          
          <NavItem to="/learn" onClick={onClose}>
            <BookOpen size={20} />
            <NavText>Learn</NavText>
          </NavItem>
          
          <NavItem to="/progress" onClick={onClose}>
            <BarChart3 size={20} />
            <NavText>Progress</NavText>
          </NavItem>
          
          <NavItem to="/profile" onClick={onClose}>
            <User size={20} />
            <NavText>Profile</NavText>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <NavButton onClick={toggleTheme}>
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <NavText>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</NavText>
          </NavButton>
          
          <NavButton onClick={handleLogout}>
            <LogOut size={20} />
            <NavText>Sign Out</NavText>
          </NavButton>
        </NavSection>
      </Navigation>
    </SidebarContainer>
  );
};