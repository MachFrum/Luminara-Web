import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Mail, Send, AlertCircle, ArrowLeft } from 'lucide-react';
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

const SuccessContainer = styled.div`
    text-align: center;
`;

export const ForgotPasswordPage: React.FC = () => {
    const { resetPassword, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            return;
        }

        try {
            await resetPassword(email);
            setEmailSent(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
        }
    };

    if (emailSent) {
        return (
            <AuthLayout>
                <SuccessContainer>
                    <Mail size={48} className="mx-auto text-green-500" />
                    <FormTitle>Check Your Email</FormTitle>
                    <FormSubtitle>
                        We've sent password reset instructions to {email}.
                    </FormSubtitle>
                    <StyledLink to="/auth/login">
                        <ArrowLeft size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Back to Sign In
                    </StyledLink>
                </SuccessContainer>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Reset Password</FormTitle>
                <FormSubtitle>
                    Enter your email and we'll send you instructions to reset your password.
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
                        <InputIcon><Mail size={20} /></InputIcon>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            hasError={!!error}
                            disabled={isLoading}
                        />
                    </InputContainer>
                </InputGroup>

                <SubmitButton type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size={20} /> : <><Send size={16} /> Send Reset Instructions</>}
                </SubmitButton>

                <Links>
                    <StyledLink to="/auth/login">Back to Sign In</StyledLink>
                </Links>
            </FormContainer>
        </AuthLayout>
    );
};
