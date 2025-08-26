
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { User, Award, Bell, Moon, Sun, HelpCircle, Settings, LogOut, ChevronRight } from 'react-feather';
import { GuestBanner } from '../components/common/GuestBanner';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

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
    const { user, logout, isGuest, exitGuestMode } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showGuestBanner, setShowGuestBanner] = useState(isGuest);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
                { icon: Bell, label: "Notifications", toggle: true, value: notificationsEnabled, onToggle: () => setNotificationsEnabled(!notificationsEnabled) },
                { icon: theme === 'light' ? Moon : Sun, label: "Dark Mode", toggle: true, value: theme === 'dark', onToggle: toggleTheme },
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
        <div className="bg-light-background dark:bg-dark-background min-h-screen">
            {/* Header */}
            <header className="bg-gradient-to-br from-light-surface to-light-charcoal dark:from-dark-surface dark:to-dark-charcoal p-6 sm:p-8 rounded-b-3xl shadow-lg">
                <div className="text-center text-light-primary dark:text-dark-primary">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full bg-light-accent/20 text-light-accent flex items-center justify-center text-4xl font-bold border-4 border-light-accent">
                            {user?.firstName?.[0] || 'G'}{user?.lastName?.[0] || 'U'}
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-light-surface dark:border-dark-surface"></div>
                    </div>
                    <h1 className="text-2xl font-bold">{user?.firstName || 'Guest'} {user?.lastName || 'User'}</h1>
                    {isGuest ? (
                        <p className="text-yellow-500">Guest User</p>
                    ) : (
                        <p className="text-light-textSecondary dark:text-dark-textSecondary">{user?.email}</p>
                    )}
                    <p className="text-sm text-light-accent font-semibold mt-1">Level {user?.level || 1} • {user?.rank || 'Beginner'}</p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center text-light-primary dark:text-dark-primary">
                    <div>
                        <p className="text-2xl font-bold"><AnimatedCounter targetValue={user?.problemsSolved || 0} /></p>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Problems Solved</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold"><AnimatedCounter targetValue={user?.topicsLearned || 0} /></p>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Topics Learned</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold"><AnimatedCounter targetValue={user?.streak || 0} /></p>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Day Streak</p>
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
                {showGuestBanner && <GuestBanner onSignUpClick={handleGuestSignUp} onClose={() => setShowGuestBanner(false)} />}

                <div className="max-w-3xl mx-auto space-y-8">
                    {settingsGroups.map((group) => (
                        <section key={group.title}>
                            <h2 className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider mb-3 px-2">{group.title}</h2>
                            <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-md">
                                {group.items.map((item, index) => (
                                    <button 
                                        key={item.label} 
                                        onClick={'onPress' in item ? item.onPress : undefined} 
                                        disabled={'toggle' in item}
                                        className={`w-full flex items-center p-4 text-left transition-colors duration-200 ${index !== 0 ? 'border-t border-light-border dark:border-dark-border' : ''} ${'toggle' in item ? '' : 'hover:bg-light-background dark:hover:bg-dark-background'}`}>
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
        </div>
    );
};

export default ProfilePage;
