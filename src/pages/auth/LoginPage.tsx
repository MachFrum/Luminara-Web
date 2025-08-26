
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'react-feather';

export const LoginPage: React.FC = () => {
  const { login, continueAsGuest, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const newFieldErrors: { [key: string]: string } = {};
    if (!email) {
      newFieldErrors.email = 'Email is required';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newFieldErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newFieldErrors.password = 'Password is required';
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) {
      return;
    }

    try {
      await login({ email, password, rememberMe });
      navigate('/');
    } catch (err) {
      // Error is handled by the auth context and displayed
    }
  };

  const handleGuestAccess = async () => {
    try {
      await continueAsGuest();
      navigate('/');
    } catch (err) {
      // Handle guest access error if necessary
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#483757] via-[#d9c4b0] to-[#110c47] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/80 mt-2">Sign in to continue your learning journey</p>
        </header>

        <main className="bg-white/95 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-500/20 text-red-500 text-sm font-semibold p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded" />
                Remember me
              </label>
              <Link to="/auth/forgot-password" className="text-sm font-medium text-light-accent hover:underline">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-light-accent text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-light-accent/90 transition-colors disabled:opacity-70">
              {isLoading ? <LoadingSpinner size={24} /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>

            <button type="button" onClick={handleGuestAccess} disabled={isLoading} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Continue as Guest
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Don't have an account? <Link to="/auth/register" className="font-medium text-light-accent hover:underline">Sign Up</Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
