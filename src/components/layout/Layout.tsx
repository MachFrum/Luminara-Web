import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const getTitleFromPath = (path: string) => {
  switch (path) {
    case '/':
      return 'Dashboard';
    case '/learn':
      return 'Learn';
    case '/progress':
      return 'Progress';
    case '/profile':
      return 'Profile';
    default:
      return 'Luminara';
  }
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <div className="bg-light-background dark:bg-dark-background min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72 transition-all duration-300">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title={title}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
