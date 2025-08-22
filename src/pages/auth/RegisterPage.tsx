import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Mail, Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react';
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

const NameRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

export const RegisterPage: React.FC = () => {
    const { register, isLoading } = useAuth();
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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (name: string, value: string, currentFormData = formData) => {
        let error = '';
        switch (name) {
            case 'firstName':
                if (!value.trim()) error = 'First name is required';
                else if (value.trim().length < 2) error = 'Must be at least 2 characters';
                break;
            case 'lastName':
                if (!value.trim()) error = 'Last name is required';
                else if (value.trim().length < 2) error = 'Must be at least 2 characters';
                break;
            case 'email':
                if (!value) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
                break;
            case 'password':
                if (!value) error = 'Password is required';
                else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value)) {
                    error = 'Password must be 8+ characters with an uppercase letter and a number.';
                }
                break;
            case 'confirmPassword':
                if (!value) error = 'Please confirm your password';
                else if (value !== currentFormData.password) error = 'Passwords do not match';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        
        const error = validateField(name, value, newFormData);
        setErrors(prev => ({ ...prev, [name]: error }));

        if (name === 'password' && newFormData.confirmPassword) {
            const confirmError = validateField('confirmPassword', newFormData.confirmPassword, newFormData);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let newErrors: { [key: string]: string } = {};
        let isValid = true;

        for (const key in formData) {
            const error = validateField(key, formData[key as keyof typeof formData]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                await register(formData.firstName, formData.lastName, formData.email, formData.password);
                navigate('/auth/confirm-signup', { state: { email: formData.email } });
            } catch (error) {
                setErrors({ general: error instanceof Error ? error.message : 'Registration failed' });
            }
        }
    };

    return (
        <AuthLayout>
            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Create Account</FormTitle>
                <FormSubtitle>Join us and start your learning adventure</FormSubtitle>

                {errors.general && (
                    <ErrorMessage>
                        <AlertCircle size={16} />
                        {errors.general}
                    </ErrorMessage>
                )}

                <NameRow>
                    <InputGroup style={{ flex: 1 }}>
                        <InputLabel htmlFor="firstName">First Name</InputLabel>
                        <InputContainer>
                            <InputIcon><User size={20} /></InputIcon>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                hasError={!!errors.firstName}
                                disabled={isLoading}
                            />
                        </InputContainer>
                        {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup style={{ flex: 1 }}>
                        <InputLabel htmlFor="lastName">Last Name</InputLabel>
                        <InputContainer>
                            <InputIcon><User size={20} /></InputIcon>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                hasError={!!errors.lastName}
                                disabled={isLoading}
                            />
                        </InputContainer>
                        {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                    </InputGroup>
                </NameRow>

                <InputGroup>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <InputContainer>
                        <InputIcon><Mail size={20} /></InputIcon>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            hasError={!!errors.email}
                            disabled={isLoading}
                        />
                    </InputContainer>
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputContainer>
                        <InputIcon><Lock size={20} /></InputIcon>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            hasError={!!errors.password}
                            disabled={isLoading}
                        />
                        <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </PasswordToggle>
                    </InputContainer>
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                    <InputContainer>
                        <InputIcon><Lock size={20} /></InputIcon>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            hasError={!!errors.confirmPassword}
                            disabled={isLoading}
                        />
                        <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </PasswordToggle>
                    </InputContainer>
                    {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                </InputGroup>

                <SubmitButton type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size={20} /> : 'Create Account'}
                </SubmitButton>

                <Links>
                    <StyledLink to="/auth/login">Already have an account? Sign In</StyledLink>
                </Links>
            </FormContainer>
        </AuthLayout>
    );
};
