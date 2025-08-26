
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GuestBanner } from '../components/common/GuestBanner';
import { BookOpen, TrendingUp, Target, Clock, Star, Zap, Award, Plus, ChevronRight, Cpu } from 'react-feather';
import { getDashboardData } from '../lib/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const quickActions = [
  { id: '1', title: 'Start Learning', description: 'Ask a question or solve a problem.', icon: Cpu, color: 'text-light-accent', route: '/learn' },
  { id: '2', title: 'View Progress', description: 'Track your learning journey.', icon: TrendingUp, color: 'text-light-accent', route: '/progress' },
  { id: '3', title: 'Challenges', description: 'Tackle challenging questions.', icon: Plus, color: 'text-light-accent', route: '/groups' },
  { id: '4', title: 'Achievements', description: 'View your achievements.', icon: Award, color: 'text-light-accent', route: '/achievements' },
];

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'hard': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const Dashboard: React.FC = () => {
  const { user, isGuest, exitGuestMode } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleGuestSignUp = () => {
    exitGuestMode();
    navigate('/auth/register');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size={40} /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-light-background dark:bg-dark-background min-h-screen">
      {isGuest && <GuestBanner onSignUpClick={handleGuestSignUp} onClose={() => {}} />}

      {/* Header */}
      <header className="mb-8">
        <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary">{getGreeting()}, {user?.firstName || 'Learner'} 👋</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-light-text dark:text-dark-text mt-1">Ready to learn something new?</h1>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-2xl shadow-md flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-light-accent" />
          <div>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">{user?.problemsSolved || 0}</p>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Problems</p>
          </div>
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-2xl shadow-md flex items-center gap-4">
          <Clock className="w-8 h-8 text-light-accent" />
          <div>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">{user?.hoursLearned || 0}</p>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Hours</p>
          </div>
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-2xl shadow-md flex items-center gap-4">
          <Zap className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">{user?.streak || 0}</p>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map(action => (
                <button key={action.id} onClick={() => navigate(action.route)} className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl shadow-md text-left hover:scale-105 transition-transform">
                  <action.icon className={`w-8 h-8 ${action.color} mb-3`} />
                  <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{action.title}</h3>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{action.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {dashboardData?.recentProblems?.map((activity: any) => (
                <div key={activity.id} className="bg-light-surface dark:bg-dark-surface p-4 rounded-2xl shadow-md flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-light-text dark:text-dark-text">{activity.title}</h3>
                    <p className="text-sm text-light-accent">{activity.subject}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">{new Date(activity.submittedAt).toLocaleDateString()}</p>
                      <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getDifficultyClass(activity.difficulty)}`}>{activity.difficulty}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Achievements Progress */}
          <section>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Recent Achievements</h2>
            <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl shadow-md space-y-6">
              {dashboardData?.achievements?.map((achievement: any) => (
                <div key={achievement.id}>
                  <div className="flex items-center gap-4">
                    <Award className="w-8 h-8 text-light-accent" />
                    <div>
                      <h3 className="font-bold text-light-text dark:text-dark-text">{achievement.title}</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2.5">
                      <div className="bg-light-accent h-2.5 rounded-full" style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}></div>
                    </div>
                    <p className="text-right text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">{achievement.progress}/{achievement.maxProgress}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Motivational Quote */}
          <section>
            <div className="bg-gradient-to-br from-light-deepNavy to-light-accent p-6 rounded-2xl shadow-lg text-white">
              <Star className="w-10 h-10 text-yellow-300 mb-4" />
              <p className="italic text-lg mb-4">"The beautiful thing about learning is that no one can take it away from you."</p>
              <p className="font-bold text-right">— B.B. King</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
