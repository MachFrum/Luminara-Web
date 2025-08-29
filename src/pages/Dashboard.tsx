import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GuestBanner } from '../components/common/GuestBanner';
import { BookOpen, TrendingUp, Target, Clock, Star, Zap, Award, Plus, ChevronRight, Cpu, User } from 'react-feather'; // Added User
import { SetGoalModal } from '../components/common/SetGoalModal';
import { ChallengesModal, ChallengeData } from '../components/common/ChallengesModal';
import { getDashboardData, startChallenge } from '../lib/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  route: string;
  onClick?: () => void;
}

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
  const { user, isGuest, exitGuestMode, isProfileComplete } = useAuth(); // Added isProfileComplete
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSetGoalModal, setShowSetGoalModal] = useState(false);
  const [showChallengesModal, setShowChallengesModal] = useState(false);

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Start Learning', description: 'Ask a question or solve a problem.', icon: Cpu, color: 'text-light-accent', route: '/learn' },
    { id: '3', title: 'Challenges', description: 'Tackle challenging questions.', icon: Plus, color: 'text-light-accent', route: '#', onClick: () => setShowChallengesModal(true) },
    { id: '5', title: 'Set Goal', description: 'Define your learning objectives.', icon: Target, color: 'text-light-accent', route: '#', onClick: () => setShowSetGoalModal(true) },
  ];

  const profileAction: QuickAction = { // Added
    id: 'profile',
    title: 'Complete Profile',
    description: 'Fill in your mandatory profile details.',
    icon: User,
    color: 'text-light-accent',
    route: '/profile',
  };

  const achievementsAction: QuickAction = { // Added
    id: '4',
    title: 'Achievements',
    description: 'View your achievements.',
    icon: Award,
    color: 'text-light-accent',
    route: '/achievements',
  };

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

  const handleStartChallenge = async (challengeData: ChallengeData) => {
    try {
      await startChallenge(challengeData);
      alert('Challenge started successfully! You will be notified when it is ready.');
    } catch (err) {
      alert('Failed to start challenge. Please try again later.');
      throw err; // Re-throw to allow modal to handle its state
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size={40} /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-light-background dark:bg-dark-background min-h-screen">
      {isGuest && <GuestBanner onSignUpClick={handleGuestSignUp} onClose={() => {}} />}

      {/* Header Section */}
      <div className="bg-gradient-to-br from-light-deepNavy to-light-accent dark:from-dark-deepNavy dark:to-dark-accent text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 rounded-b-[32px] shadow-lg mb-8">
        <header className="mb-8 text-center">
          <p className="text-xl text-white/80">{getGreeting()}, {user?.firstName || 'Learner'} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Ready to learn something new?</h1>
        </header>
        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/30 rounded-[35px] p-5">
          <div className="flex flex-col sm:flex-row sm:justify-around items-center space-y-4 sm:space-y-0">
            <div className="flex items-center justify-center gap-4">
              <BookOpen className="w-8 h-8 text-white" />
              <div>
                <p className="text-2xl font-bold text-white">{user?.problemsSolved || 0}</p>
                <p className="text-sm text-white/80">Problems</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-white/30"></div>

            <div className="flex items-center justify-center gap-4">
              <Clock className="w-8 h-8 text-white" />
              <div>
                <p className="text-2xl font-bold text-white">{user?.hoursLearned || 0}</p>
                <p className="text-sm text-white/80">Hours</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-white/30"></div>

            <div className="flex items-center justify-center gap-4">
              <Zap className="w-8 h-8 text-white" />
              <div>
                <p className="text-2xl font-bold text-white">{user?.streak || 0}</p>
                <p className="text-sm text-white/80">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 pt-0">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <section>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map(action => (
                  <button key={action.id} onClick={() => action.onClick ? action.onClick() : navigate(action.route)} className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl p-6 rounded-[60px] border-[1.5px] border-[#d9c4b0] shadow-md text-left hover:scale-105 transition-transform flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-3xl flex items-center justify-center mb-3 bg-light-surface dark:bg-dark-surface shadow-md">
                      <action.icon className={`w-8 h-8 ${action.color}`} />
                    </div>
                    <h3 className="font-bold text-lg text-light-text dark:text-dark-text text-center">{action.title}</h3>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center">{action.description}</p>
                  </button>
                ))}
                {isProfileComplete ? (
                  <button key={achievementsAction.id} onClick={() => achievementsAction.onClick ? achievementsAction.onClick() : navigate(achievementsAction.route)} className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl p-6 rounded-[60px] border-[1.5px] border-[#d9c4b0] shadow-md text-left hover:scale-105 transition-transform flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-3xl flex items-center justify-center mb-3 bg-light-surface dark:bg-dark-surface shadow-md">
                      <achievementsAction.icon className={`w-8 h-8 ${achievementsAction.color}`} />
                    </div>
                    <h3 className="font-bold text-lg text-light-text dark:text-dark-text text-center">{achievementsAction.title}</h3>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center">{achievementsAction.description}</p>
                  </button>
                ) : (
                  <button key={profileAction.id} onClick={() => profileAction.onClick ? profileAction.onClick() : navigate(profileAction.route)} className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl p-6 rounded-[60px] border-[1.5px] border-[#d9c4b0] shadow-md text-left hover:scale-105 transition-transform flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-3xl flex items-center justify-center mb-3 bg-light-surface dark:bg-dark-surface shadow-md">
                      <profileAction.icon className={`w-8 h-8 ${profileAction.color}`} />
                    </div>
                    <h3 className="font-bold text-lg text-light-text dark:text-dark-text text-center">{profileAction.title}</h3>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center">{profileAction.description}</p>
                  </button>
                )}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {dashboardData?.recentProblems?.map((activity: any) => (
                  <div key={activity.id} className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl p-4 rounded-[45px] border-[1.5px] border-[#d9c4b0] shadow-md flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{activity.title}</h3>
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
              <div className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl p-6 rounded-[60px] border-[1.5px] border-[#d9c4b0] shadow-md space-y-6">
                {dashboardData?.achievements?.map((achievement: any) => (
                  <div key={achievement.id}>
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-3xl flex items-center justify-center mr-4 bg-light-surface dark:bg-dark-surface shadow-md">
                        <Award className="w-8 h-8 text-light-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{achievement.title}</h3>
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
              <div className="bg-gradient-to-br from-light-deepNavy/30 to-light-accent/30 backdrop-blur-xl p-6 rounded-[25px] border-[1.5px] border-[#d9c4b0] shadow-lg text-white">
                <Star className="w-10 h-10 text-yellow-300 mb-4" />
                <p className="italic text-lg mb-4">"The beautiful thing about learning is that no one can take it away from you."</p>
                <p className="font-bold text-right">— B.B. King</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {showSetGoalModal && (
        <SetGoalModal
          onClose={() => setShowSetGoalModal(false)}
          onSave={(goal) => {
            console.log('Goal saved:', goal);
            setShowSetGoalModal(false);
            navigate('/progress');
          }}
        />
      )}

      {showChallengesModal && (
        <ChallengesModal
          onClose={() => setShowChallengesModal(false)}
          onSubmit={handleStartChallenge}
        />
      )}
    </div>
  );
};

export default Dashboard;