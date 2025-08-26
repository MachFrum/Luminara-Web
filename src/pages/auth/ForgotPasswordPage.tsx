import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Mail, Send, ArrowLeft } from 'react-feather';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validateEmail(email)) {
      return;
    }

    try {
      await requestPasswordReset(email);
      setEmailSent(true);
    } catch (err) {
      // Error is handled by the auth context and displayed
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c19be5ff] to-[#1d0d28ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <Link to="/auth/login" className="absolute top-8 left-8 text-white/80 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Reset Password</h1>
          <p className="text-white/80 mt-2">
            {emailSent ? `We've sent instructions to ${email}` : "Enter your email to get reset instructions"}
          </p>
        </header>

        <main className="bg-white/95 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {emailSent ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Check Your Email</h2>
              <div className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2 text-gray-600 dark:text-gray-300">
                <p>1. Check your email inbox for a message from us.</p>
                <p>2. Click the reset link in the email.</p>
                <p>3. Create a new, secure password.</p>
                <p>4. Sign in with your new password.</p>
              </div>
              <button onClick={() => setEmailSent(false)} className="mt-6 text-sm text-light-accent hover:underline">
                Didn't receive the email? Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 text-red-500 text-sm font-semibold p-3 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`}
                  />
                </div>
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-light-accent text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-light-accent/90 transition-colors disabled:opacity-70">
                {isLoading ? <LoadingSpinner size={24} /> : <>Send Reset Instructions <Send className="w-5 h-5" /></>}
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                Remember your password? <Link to="/auth/login" className="font-medium text-light-accent hover:underline">Sign In</Link>
              </p>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;