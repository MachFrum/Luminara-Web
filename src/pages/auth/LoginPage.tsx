import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} 3rem;
  border: 1px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.disabled ? props.theme.colors.textLight : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const GuestButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: ${props => props.theme.spacing.md} 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
`;

const DividerText = styled.span`
  background: ${props => props.theme.colors.background};
  padding: 0 ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${props => props.theme.spacing.xs};
`;

const Links = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg};
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LinkSeparator = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 ${props => props.theme.spacing.sm};
`;

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { login, enterGuestMode, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const handleGuestAccess = () => {
    enterGuestMode();
    navigate('/');
  };

  return (
    <AuthLayout>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Welcome Back</FormTitle>
        <FormSubtitle>
          Sign in to your account to continue learning
        </FormSubtitle>

        {errors.general && (
          <ErrorMessage>
            <AlertCircle size={16} />
            {errors.general}
          </ErrorMessage>
        )}

        <InputGroup>
          <InputLabel htmlFor="email">Email</InputLabel>
          <InputContainer>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hasError={!!errors.email}
              disabled={isLoading}
            />
          </InputContainer>
          {errors.email && (
            <ErrorMessage>
              <AlertCircle size={16} />
              {errors.email}
            </ErrorMessage>
          )}
        </InputGroup>

        <InputGroup>
          <InputLabel htmlFor="password">Password</InputLabel>
          <InputContainer>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={!!errors.password}
              disabled={isLoading}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputContainer>
          {errors.password && (
            <ErrorMessage>
              <AlertCircle size={16} />
              {errors.password}
            </ErrorMessage>
          )}
        </InputGroup>

        <CheckboxContainer>
          <Checkbox
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <CheckboxLabel htmlFor="remember">
            Remember me
          </CheckboxLabel>
        </CheckboxContainer>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size={20} /> : 'Sign In'}
        </SubmitButton>

        <Divider>
          <DividerText>or</DividerText>
        </Divider>

        <GuestButton type="button" onClick={handleGuestAccess}>
          Continue as Guest
        </GuestButton>

        <Links>
          <StyledLink to="/auth/register">Create an account</StyledLink>
          <LinkSeparator>•</LinkSeparator>
          <StyledLink to="/auth/forgot-password">Forgot password?</StyledLink>
        </Links>
      </FormContainer>
    </AuthLayout>
  );
};