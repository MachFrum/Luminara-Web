import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../lib/aws/cognito';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const isAuthenticated = !!user && !isGuest;

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('No authenticated user found');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const user = await authService.signIn(email, password);
      setUser(user);
      setIsGuest(false);
      
      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signUp(firstName, lastName, email, password);
      setUser(user);
      setIsGuest(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setIsGuest(false);
      localStorage.removeItem('rememberUser');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  const enterGuestMode = () => {
    setIsGuest(true);
    setUser({
      id: 'guest',
      email: '',
      firstName: 'Guest',
      lastName: 'User',
      level: 1,
      rank: 'Beginner',
      totalPoints: 0,
      streak: 0,
      hoursLearned: 0,
      problemsSolved: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    });
  };

  const exitGuestMode = () => {
    setIsGuest(false);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user to update');
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Here you would typically make an API call to update the user profile
    // await authService.updateProfile(updates);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isGuest,
    login,
    register,
    logout,
    resetPassword,
    enterGuestMode,
    exitGuestMode,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};