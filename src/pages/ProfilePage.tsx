
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { User, Award, Bell, Moon, Sun, HelpCircle, Settings, LogOut, ChevronRight } from 'lucide-react';
import { GuestBanner } from '../components/common/GuestBanner';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

// A basic Switch component to replace the React Native one
const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(16px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.border};
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const Switch = ({ checked, onChange }) => (
    <SwitchContainer>
        <SwitchInput type="checkbox" checked={checked} onChange={onChange} />
        <SwitchSlider />
    </SwitchContainer>
);


const ProfileContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
`;

const ProfileHeader = styled.div`
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.surface}, ${props => props.theme.colors.primaryDark});
  color: ${props => props.theme.colors.text};
  border-radius: 0 0 30px 30px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.sm};
  border: 3px solid ${props => props.theme.colors.primary};
`;

const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const GuestLabel = styled.p`
    color: ${props => props.theme.colors.warning};
    font-style: italic;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

const StatItem = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const SettingsGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const GroupTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};
  padding-bottom: ${props => props.theme.spacing.xs};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SettingsItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.sm};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const SettingsItemLeft = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
`;

const SettingsLabel = styled.span<{ danger?: boolean; premium?: boolean }>`
    color: ${props => 
        props.danger ? props.theme.colors.error :
        props.premium ? props.theme.colors.accent :
        props.theme.colors.text};
    font-weight: 500;
`;

const IconWrapper = styled.div<{ danger?: boolean; premium?: boolean }>`
    color: ${props => 
        props.danger ? props.theme.colors.error :
        props.premium ? props.theme.colors.accent :
        props.theme.colors.textSecondary};
`;

export const ProfilePage: React.FC = () => {
    const { user, logout, isGuest, exitGuestMode } = useAuth();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showGuestBanner, setShowGuestBanner] = useState(isGuest);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            logout();
            navigate('/auth/login');
        }
    };

    const handleGuestSignUp = () => {
        exitGuestMode();
        navigate('/auth/register');
    };

    const settingsGroups = [
        {
            title: "Account",
            items: [
                { icon: User, label: "Edit Profile", onPress: () => alert('Edit profile modal not implemented yet.') },
                { icon: Award, label: "Upgrade to Premium", onPress: () => alert('Premium upgrade not implemented yet.'), premium: true },
            ]
        },
        {
            title: "Preferences",
            items: [
                { icon: Bell, label: "Notifications", toggle: true, value: false, onToggle: () => alert('Notification settings not implemented yet.') },
                { icon: mode === 'light' ? Moon : Sun, label: "Dark Mode", toggle: true, value: mode === 'dark', onToggle: toggleTheme },
            ]
        },
        {
            title: "Support",
            items: [
                { icon: HelpCircle, label: "Help Center", onPress: () => {} },
                { icon: Settings, label: "App Settings", onPress: () => {} },
                { icon: LogOut, label: "Sign Out", onPress: handleLogout, danger: true },
            ]
        }
    ];

    return (
        <ProfileContainer>
            <ProfileHeader>
                <ProfileSection>
                    <Avatar>
                        {user?.firstName?.[0] || 'G'}{user?.lastName?.[0] || 'U'}
                    </Avatar>
                    <UserName>{user?.firstName || 'Guest'} {user?.lastName || 'User'}</UserName>
                    {isGuest ? (
                        <GuestLabel>Guest User</GuestLabel>
                    ) : (
                        <UserEmail>{user?.email}</UserEmail>
                    )}
                </ProfileSection>
                <StatsRow>
                    <StatItem>
                        <StatValue><AnimatedCounter targetValue={user?.problemsSolved || 0} /></StatValue>
                        <StatLabel>Problems Solved</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatValue><AnimatedCounter targetValue={user?.hoursLearned || 0} /></StatValue>
                        <StatLabel>Topics Learned</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatValue><AnimatedCounter targetValue={user?.streak || 0} /></StatValue>
                        <StatLabel>Day Streak</StatLabel>
                    </StatItem>
                </StatsRow>
            </ProfileHeader>

            <Content>
                {showGuestBanner && <GuestBanner onSignUpClick={handleGuestSignUp} onClose={() => setShowGuestBanner(false)} />}

                {settingsGroups.map((group) => (
                    <SettingsGroup key={group.title}>
                        <GroupTitle>{group.title}</GroupTitle>
                        {group.items.map(item => (
                            <SettingsItem key={item.label} onClick={'onPress' in item ? item.onPress : undefined} disabled={'toggle' in item}>
                                <SettingsItemLeft>
                                    <IconWrapper danger={'danger' in item && item.danger} premium={'premium' in item && item.premium}>
                                        <item.icon size={20} />
                                    </IconWrapper>
                                    <SettingsLabel danger={'danger' in item && item.danger} premium={'premium' in item && item.premium}>
                                        {item.label}
                                    </SettingsLabel>
                                </SettingsItemLeft>
                                {'toggle' in item ? (
                                    <Switch checked={item.value} onChange={item.onToggle} />
                                ) : (
                                    <ChevronRight size={20} />
                                )}
                            </SettingsItem>
                        ))}
                    </SettingsGroup>
                ))}
            </Content>
        </ProfileContainer>
    );
};
