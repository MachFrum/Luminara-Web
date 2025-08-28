import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../lib/aws/cognito';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  isProfileComplete: boolean; // Added
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendSignUpCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false); // Added

  const isAuthenticated = !!user && !isGuest;

  // Helper to check if mandatory profile fields are filled
  const checkProfileCompletion = (currentUser: User | null) => {
    if (!currentUser) return false;
    const { firstName, lastName, preferredUsername, age } = currentUser;
    return !!firstName && !!lastName && !!preferredUsername && !!age;
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const profileCompleted = checkProfileCompletion(currentUser);
        setUser({ ...currentUser, isProfileComplete: profileCompleted });
        setIsProfileComplete(profileCompleted);
      } else {
        setUser(null);
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.log('No authenticated user found');
      setUser(null);
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      const user = await authService.signIn(email, password);
      const profileCompleted = checkProfileCompletion(user); // Check on login
      setUser({ ...user, isProfileComplete: profileCompleted });
      setIsProfileComplete(profileCompleted);
      setIsGuest(false);

      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during login.');
      throw err; // Re-throw to allow LoginPage to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signUp(firstName, lastName, email, password);
      // After sign-up, the user is in an unconfirmed state.
      // They need to confirm their email before they can sign in.
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    await authService.confirmSignUp(email, code);
  };

  const resendSignUpCode = async (email: string) => {
    await authService.resendSignUpCode(email);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setIsGuest(false);
      setIsProfileComplete(false); // Reset on logout
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
    setIsProfileComplete(true); // Guests don't have a profile to complete
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
      isProfileComplete: true, // Guests are considered complete
    });
  };

  const exitGuestMode = () => {
    setIsGuest(false);
    setIsProfileComplete(false); // Reset on exit guest mode
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user to update');

    const updatedUser = { ...user, ...updates };
    const profileCompleted = checkProfileCompletion(updatedUser);
    setUser({ ...updatedUser, isProfileComplete: profileCompleted });
    setIsProfileComplete(profileCompleted);

    // Here you would typically make an API call to update the user profile
    // await authService.updateProfile(updates);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isGuest,
    isProfileComplete, // Added
    login,
    register,
    confirmSignUp,
    resendSignUpCode,
    logout,
    resetPassword,
    enterGuestMode,
    exitGuestMode,
    updateProfile,
    error,
    clearError,
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
