
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { ActivityChart } from '../components/common/ActivityChart';
import { ProgressRing } from '../components/common/ProgressRing';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Target, Heart, Award, X, TrendingUp, ChevronRight, Zap } from 'react-feather';
import { getUserProgress } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const loadProgressData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProgress();
      setProgressData(data);
    } catch (err) {
      setError('Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size={40} /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={loadProgressData}
          className="px-4 py-2 bg-light-accent text-white rounded-full hover:bg-light-accent/80 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-light-background dark:bg-dark-background min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-br from-light-deepNavy to-light-accent dark:from-dark-deepNavy dark:to-dark-accent text-white p-6 sm:p-8 rounded-[30px] shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Your Progress</h1>
            <p className="text-white/80 mt-1">Level {progressData.stats.level} • {progressData.stats.rank}</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full">
            <Zap className="w-5 h-5" />
            <span className="font-bold">{progressData.stats.totalPoints}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<Award />} label="Challenges" value={progressData.stats.challengesSolved} color="#3B82F6" />
          <StatCard icon={<Target />} label="Topics" value={progressData.stats.topicsLearned} color="#10B981" />
          <StatCard icon={<Heart />} label="Goals" value={progressData.stats.goalsDone} color="#EF4444" />
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Overview */}
          <SectionCard>
            <SectionHeader title="Activity Overview">
              <div className="bg-light-border dark:bg-dark-border p-1 rounded-full flex text-sm">
                <button onClick={() => setSelectedPeriod('week')} className={`px-3 py-1 rounded-full ${selectedPeriod === 'week' ? 'bg-light-primary text-white dark:bg-dark-primary' : 'text-light-textSecondary dark:text-dark-textSecondary'}`}>Week</button>
                <button onClick={() => setSelectedPeriod('month')} className={`px-3 py-1 rounded-full ${selectedPeriod === 'month' ? 'bg-light-primary text-white dark:bg-dark-primary' : 'text-light-textSecondary dark:text-dark-textSecondary'}`}>Month</button>
              </div>
            </SectionHeader>
            <ActivityChart data={progressData.activities} />
          </SectionCard>

          {/* Topic Progress */}
          <SectionCard>
            <SectionHeader title="Topic Progress" />
            <div className="space-y-4">
              {progressData.subjects && Array.isArray(progressData.subjects) ? progressData.subjects.map((subject:any) => <SubjectCard key={subject.id} subject={subject} />) : <div className="text-center py-8">
    <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary mb-4">Solve your first problem to see your progress here!</p>
    <button onClick={() => navigate('/learn')} className="px-6 py-2 bg-light-accent text-white rounded-full hover:bg-light-accent/80 transition-colors">Start Learning</button>
</div>}
            </div>
          </SectionCard>

          {/* Current Goals */}
          <SectionCard>
            <SectionHeader title="Current Goals" />
            <div className="space-y-4">
              {progressData.goals && Array.isArray(progressData.goals) ? progressData.goals.map((goal:any) => <GoalCard key={goal.id} goal={goal} />) : <p className="text-light-textSecondary dark:text-dark-textSecondary">No current goals.</p>}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-8">
          {/* Achievements */}
          <SectionCard>
            <SectionHeader title="Recent Achievements" onSeeAll={() => setShowAchievementsModal(true)} />
            <div className="space-y-4">
              {progressData.achievements && Array.isArray(progressData.achievements) ? progressData.achievements.slice(0, 3).map((ach:any) => <AchievementPill key={ach.id} achievement={ach} />) : <p className="text-light-textSecondary dark:text-dark-textSecondary">No recent achievements.</p>}
            </div>
          </SectionCard>

          {/* Learning Insights */}
          <div className="bg-gradient-to-br from-light-deepNavy to-light-accent p-6 rounded-2xl shadow-lg text-white">
            <TrendingUp className="w-8 h-8 mb-4" />
            <h3 className="font-bold text-lg mb-2">You're on Fire! 🔥</h3>
            <p className="text-sm">Your problem-solving speed has improved by 40% this week. Keep challenging yourself!</p>
          </div>
        </div>
      </div>

      {/* Achievements Modal */}
      {showAchievementsModal && progressData.achievements && Array.isArray(progressData.achievements) && <AchievementsModal achievements={progressData.achievements} onClose={() => setShowAchievementsModal(false)} />}
    </div>
  );
};

// Helper Components
const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl shadow-md">{children}</div>
);

const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void; children?: React.ReactNode }> = ({ title, onSeeAll, children }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-light-text dark:text-dark-text">{title}</h2>
    {onSeeAll && <button onClick={onSeeAll} className="text-sm font-semibold text-light-accent">See All</button>}
    {children}
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-gradient-to-br from-white/20 to-white/5 dark:from-black/20 dark:to-black/5 p-4 rounded-xl flex items-center gap-4 backdrop-blur-sm">
    <div className="p-2 rounded-full" style={{ backgroundColor: `${color}33`, color }}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white"><AnimatedCounter targetValue={value} /></p>
      <p className="text-sm text-white/80">{label}</p>
    </div>
  </div>
);

const SubjectCard: React.FC<{ subject: any }> = ({ subject }) => (
  <div className="flex items-center gap-4 p-4 bg-light-background dark:bg-dark-background rounded-[40px] border-[1.5px] border-[#d9c4b0]">
    <ProgressRing progress={subject.progress} size={50} strokeWidth={5} color={subject.color} />
    <div className="flex-1">
      <p className="font-bold text-light-text dark:text-dark-text">{subject.name}</p>
      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{subject.problems}/{subject.totalProblems} problems</p>
    </div>
    <ChevronRight className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
  </div>
);

const GoalCard: React.FC<{ goal: any }> = ({ goal }) => (
  <div className="p-5 bg-light-background dark:bg-dark-background rounded-[40px] border-[1.5px] border-[#d9c4b0]">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-full bg-light-accent/20 text-light-accent"><Target className="w-5 h-5" /></div>
      <div>
        <p className="font-bold text-light-text dark:text-dark-text">{goal.title}</p>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{goal.description}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
        <div className="h-2 rounded-full" style={{ width: `${(goal.progress / goal.target) * 100}%`, backgroundColor: goal.color }}></div>
      </div>
      <p className="text-sm font-semibold text-light-text dark:text-dark-text">{goal.progress}/{goal.target}</p>
    </div>
  </div>
);

const AchievementPill: React.FC<{ achievement: any }> = ({ achievement }) => (
    <div className="flex items-center gap-4 p-3 bg-gradient-to-br from-light-surface/60 to-light-accent/20 dark:from-dark-surface/60 dark:to-dark-accent/20 rounded-full border border-light-border dark:border-dark-border">
        <div className="p-2 rounded-full" style={{ backgroundColor: `${achievement.color}33`, color: achievement.color }}><Award className="w-5 h-5" /></div>
        <div className="flex-1">
            <p className="font-bold text-sm text-light-text dark:text-dark-text">{achievement.title}</p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">{achievement.description}</p>
        </div>
        <div className="text-xs font-semibold text-light-text dark:text-dark-text">{achievement.progress}/{achievement.maxProgress}</div>
    </div>
);

const AchievementsModal: React.FC<{ achievements: any[]; onClose: () => void }> = ({ achievements, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-[50px] border-[1.5px] border-[#d9c4b0] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
      <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">All Achievements</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border"><X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" /></button>
      </header>
      <div className="p-6 overflow-y-auto space-y-4">
        {achievements && Array.isArray(achievements) ? achievements.map((ach:any) => <AchievementPill key={ach.id} achievement={ach} />) : <p className="text-light-textSecondary dark:text-dark-textSecondary">No achievements yet.</p>}
      </div>
    </div>
  </div>
);

export default ProgressPage;
