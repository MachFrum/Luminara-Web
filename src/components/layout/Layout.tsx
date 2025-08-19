import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const MobileHeader = styled.header`
  display: none;
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    background: ${props => props.theme.colors.surface};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <Overlay isOpen={sidebarOpen} onClick={closeSidebar} />
      
      <MainContent>
        <MobileHeader>
          <MenuButton onClick={toggleSidebar}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </MenuButton>
        </MobileHeader>
        
        {children}
      </MainContent>
    </LayoutContainer>
  );
};