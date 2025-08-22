import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Mail, Key, AlertCircle } from 'lucide-react';
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

export const ConfirmSignUpPage: React.FC = () => {
  const { confirmSignUp } = useAuth(); // We will add this to AuthContext
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Pre-fill email from navigation state if available
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !code) {
      setError('Please enter your email and the verification code.');
      return;
    }

    setIsLoading(true);
    try {
      await confirmSignUp(email, code);
      // On success, redirect to login page with a success message
      navigate('/auth/login', { state: { successMessage: 'Your account has been verified! You can now log in.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Verify Your Account</FormTitle>
        <FormSubtitle>
          We've sent a verification code to your email. Please enter it below.
        </FormSubtitle>

        {error && (
          <ErrorMessage>
            <AlertCircle size={16} />
            {error}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </InputContainer>
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size={20} /> : 'Verify Account'}
        </SubmitButton>

        <Links>
          <StyledLink to="/auth/login">Back to Login</StyledLink>
        </Links>
      </FormContainer>
    </AuthLayout>
  );
};
