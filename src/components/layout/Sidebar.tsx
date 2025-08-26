
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  BarChart2,
  User,
  Settings,
  Moon,
  Sun,
  LogOut,
  Zap,
} from 'react-feather';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navItems = [
    { to: '/', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/learn', icon: <BookOpen size={20} />, text: 'Learn' },
    { to: '/progress', icon: <BarChart2 size={20} />, text: 'Progress' },
    { to: '/profile', icon: <User size={20} />, text: 'Profile' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text w-64 lg:w-72 transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="bg-light-accent text-white p-2 rounded-full">
                <Zap size={24} />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold">Luminara</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-light-accent text-white'
                      : 'hover:bg-light-background dark:hover:bg-dark-background'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.text}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-light-border dark:border-dark-border space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-light-background dark:hover:bg-dark-background transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="font-medium">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-light-error dark:text-dark-error hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
