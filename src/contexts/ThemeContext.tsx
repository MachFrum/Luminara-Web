import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { Theme, ThemeMode } from '../types';
import { lightTheme, darkTheme } from '../theme';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as ThemeMode) || 'light';
  });

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [theme]);

  const value = {
    theme,
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={theme}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};