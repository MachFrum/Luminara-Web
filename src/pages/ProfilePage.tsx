
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Award, Bell, Moon, Sun, HelpCircle, Settings, LogOut, ChevronRight } from 'react-feather';
import { GuestBanner } from '../components/common/GuestBanner';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { EditProfileModal } from '../components/common/EditProfileModal';
import { updateUserProfile } from '../lib/api';
import { User } from '../types';

const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`${checked ? 'bg-light-accent' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-light-accent focus:ring-offset-2`}
  >
    <span
      aria-hidden="true"
      className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);

export const ProfilePage: React.FC = () => {
    const { user, logout, isGuest, exitGuestMode, updateProfile: updateUserInContext } = useAuth();
    const { theme, toggleTheme, mode } = useTheme();
    const navigate = useNavigate();
    const [showGuestBanner, setShowGuestBanner] = useState(isGuest);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [darkModeEnabled, setDarkModeEnabled] = useState(mode === 'dark');

    useEffect(() => {
        setDarkModeEnabled(mode === 'dark');
    }, [mode]);

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

    const handleUpdateProfile = async (profileData: Partial<User>) => {
        try {
            await updateUserProfile(profileData);
            updateUserInContext(profileData); // Update local context immediately
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('An error occurred while updating your profile.');
            throw error; // Re-throw to keep modal in submitting state if needed
        }
    };

    const settingsGroups = useMemo(() => [
        {
            title: "Account",
            items: [
                { icon: UserIcon, label: "Edit Profile", onPress: () => setShowEditProfileModal(true) },
                { icon: Award, label: "Upgrade to Premium", onPress: () => alert('Premium upgrade not implemented yet.'), premium: true },
            ]
        },
        {
            title: "Preferences",
            items: [
                { icon: Bell, label: "Notifications", toggle: true, value: notificationsEnabled, onToggle: () => setNotificationsEnabled(!notificationsEnabled) },
                { icon: theme === 'light' ? Moon : Sun, label: "Dark Mode", toggle: true, value: darkModeEnabled, onToggle: toggleTheme },
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
    ], [theme, notificationsEnabled, toggleTheme, handleLogout, darkModeEnabled]);

    return (
        <div className="bg-light-background dark:bg-dark-background min-h-screen">
            {/* Header */}
            <header className="bg-gradient-to-br from-light-deepNavy to-light-accent dark:from-dark-deepNavy dark:to-dark-accent text-white p-6 sm:p-8 rounded-b-[30px] shadow-lg">
                <div className="text-center">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-3 border-white/50">
                            {user?.firstName?.[0] || 'G'}{user?.lastName?.[0] || 'U'}
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-light-deepNavy"></div>
                    </div>
                    <h1 className="text-2xl font-bold">{user?.firstName || 'Guest'} {user?.lastName || 'User'}</h1>
                    {isGuest ? (
                        <p className="text-yellow-400">Guest User</p>
                    ) : (
                        <p className="text-white/80">{user?.email}</p>
                    )}
                    <p className="text-sm text-white font-semibold mt-1">Level {user?.level || 1} • {user?.rank || 'Beginner'}</p>
                </div>
                
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
                {showGuestBanner && <GuestBanner onSignUpClick={handleGuestSignUp} onClose={() => setShowGuestBanner(false)} />}

                <div className="max-w-3xl mx-auto space-y-8">
                    {settingsGroups.map((group) => (
                        <section key={group.title}>
                            <h2 className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider mb-3 px-2">{group.title}</h2>
                            <div className="space-y-3">
                                {group.items.map((item) => (
                                    <button 
                                        key={item.label} 
                                        onClick={'onPress' in item ? item.onPress : undefined} 
                                        className={`w-full flex items-center p-4 text-left transition-all duration-200 bg-light-surface dark:bg-dark-surface rounded-[40px] border border-[#d9c4b0] shadow-md hover:shadow-lg hover:scale-105`}>
                                        <div className={`p-2 rounded-full mr-4 ${item.danger ? 'bg-red-500/20 text-red-500' : item.premium ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className={`flex-1 font-medium ${item.danger ? 'text-red-500' : item.premium ? 'text-yellow-500' : 'text-light-text dark:text-dark-text'}`}>
                                            {item.label}
                                        </span>
                                        {'toggle' in item ? (
                                            <Switch checked={item.value} onChange={item.onToggle} />
                                        ) : (
                                            <ChevronRight size={20} className="text-light-textSecondary dark:text-dark-textSecondary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <footer className="text-center mt-12 text-light-textSecondary dark:text-dark-textSecondary text-sm">
                    <p>Luminara Learn v1.0.0</p>
                    <p className="italic">Illuminating the path to understanding</p>
                </footer>
            </main>

            {showEditProfileModal && (
                <EditProfileModal 
                    user={user}
                    onClose={() => setShowEditProfileModal(false)}
                    onSubmit={handleUpdateProfile}
                />
            )}
        </div>
    );
};

export default ProfilePage;
