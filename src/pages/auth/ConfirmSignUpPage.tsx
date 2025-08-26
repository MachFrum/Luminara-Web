import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Mail, Key, CheckCircle, AlertCircle } from 'react-feather';

export const ConfirmSignUpPage: React.FC = () => {
  const { confirmSignUp, resendSignUpCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !code) {
      setError('Please enter your email and the verification code.');
      return;
    }

    setIsLoading(true);
    try {
      await confirmSignUp(email, code);
      navigate('/auth/login', { state: { successMessage: 'Your account has been verified! You can now log in.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError('Please enter your email before resending.');
      return;
    }

    setIsResending(true);
    try {
      await resendSignUpCode(email);
      setSuccessMessage('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#483757] via-[#d9c4b0] to-[#110c47] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Verify Your Account</h1>
          <p className="text-white/80 mt-2">We've sent a verification code to your email. Please enter it below.</p>
        </header>

        <main className="bg-white/95 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-500 text-sm font-semibold p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/20 text-green-600 text-sm font-semibold p-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> {successMessage}
              </div>
            )}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isResending}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter the 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading || isResending}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading || isResending} className="w-full bg-light-accent text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-light-accent/90 transition-colors disabled:opacity-70">
              {isLoading ? <LoadingSpinner size={24} /> : 'Verify Account'}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-300">Didn't receive a code? </span>
              <button type="button" onClick={handleResendCode} disabled={isResending} className="font-medium text-light-accent hover:underline disabled:text-gray-400 disabled:cursor-not-allowed">
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              <Link to="/auth/login" className="font-medium text-light-accent hover:underline">Back to Login</Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ConfirmSignUpPage;