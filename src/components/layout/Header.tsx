import React from 'react';
import { Menu, X } from 'react-feather';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, title }) => {
  return (
    <header className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text shadow-md">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-light-text dark:text-dark-text"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg lg:text-xl font-semibold">{title}</h1>
        </div>
        {/* Add any other header content here, like user menu, notifications, etc. */}
      </div>
    </header>
  );
};
