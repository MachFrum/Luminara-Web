import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight } from 'react-feather';

export const RegisterPage: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string, currentData: typeof formData) => {
    const newErrors = { ...fieldErrors };
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) newErrors[field] = 'This field is required';
        else if (value.trim().length < 2) newErrors[field] = 'Must be at least 2 characters';
        else delete newErrors[field];
        break;
      case 'email':
        if (!value) newErrors.email = 'Email is required';
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) newErrors.email = 'Please enter a valid email';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value)) newErrors.password = 'Password must be 8+ characters with 1 uppercase letter and 1 number';
        else delete newErrors.password;
        break;
      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm your password';
        else if (value !== currentData.password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;
      default: break;
    }
    setFieldErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    validateField(name, value, newFormData);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    let isValid = true;
    Object.keys(formData).forEach(key => {
        validateField(key, formData[key as keyof typeof formData], formData);
        if(fieldErrors[key]) isValid = false;
    });

    if (!isValid) return;

    try {
      await register(formData);
      navigate('/auth/confirm-signup', { state: { email: formData.email } });
    } catch (err) {
      // Error is handled by the auth context and displayed
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#483757] via-[#d9c4b0] to-[#110c47] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Create Account</h1>
          <p className="text-white/80 mt-2">Join us and start your learning adventure</p>
        </header>

        <main className="bg-white/95 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-500/20 text-red-500 text-sm font-semibold p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`} />
                </div>
                {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
              </div>
              <div className="w-full">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`} />
                </div>
                {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`} />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className={`w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2"><Eye className="w-5 h-5 text-gray-400" /></button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className={`w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-light-accent'}`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2"><Eye className="w-5 h-5 text-gray-400" /></button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="font-semibold">Password must contain:</p>
              <ul className="list-disc list-inside ml-2">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
              </ul>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-light-accent text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-light-accent/90 transition-colors disabled:opacity-70">
              {isLoading ? <LoadingSpinner size={24} /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account? <Link to="/auth/login" className="font-medium text-light-accent hover:underline">Sign In</Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RegisterPage;