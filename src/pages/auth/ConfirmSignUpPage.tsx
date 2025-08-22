import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Mail, Key, AlertCircle, CheckCircle } from 'lucide-react';
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

const Message = styled.div<{ isSuccess?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.isSuccess ? props.theme.colors.success : props.theme.colors.error};
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

const ResendContainer = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.md};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
    text-decoration: none;
  }
`;

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
    <AuthLayout>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Verify Your Account</FormTitle>
        <FormSubtitle>
          We've sent a verification code to your email. Please enter it below.
        </FormSubtitle>

        {error && <Message><AlertCircle size={16} />{error}</Message>}
        {successMessage && <Message isSuccess><CheckCircle size={16} />{successMessage}</Message>}

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
              disabled={isLoading || isResending}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <InputLabel htmlFor="code">Verification Code</InputLabel>
          <InputContainer>
            <InputIcon>
              <Key size={20} />
            </InputIcon>
            <Input
              id="code"
              type="text"
              placeholder="Enter the 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading || isResending}
            />
          </InputContainer>
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading || isResending}>
          {isLoading ? <LoadingSpinner size={20} /> : 'Verify Account'}
        </SubmitButton>

        <ResendContainer>
          Didn't receive a code?{' '}
          <ResendButton type="button" onClick={handleResendCode} disabled={isResending}>
            {isResending ? 'Sending...' : 'Resend Code'}
          </ResendButton>
        </ResendContainer>

        <Links>
          <StyledLink to="/auth/login">Back to Login</StyledLink>
        </Links>
      </FormContainer>
    </AuthLayout>
  );
};
