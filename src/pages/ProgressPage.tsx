
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

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
    <div className="bg-light-background dark:bg-dark-background min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-br from-light-deepNavy to-light-accent dark:from-dark-deepNavy dark:to-dark-accent text-white p-6 sm:p-8 rounded-b-[32px] shadow-lg mb-8">
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
          <StatCard icon={<Target />} label="Problems" value={progressData.stats.topicsLearned} color="#10B981" />
          <StatCard icon={<Heart />} label="Goals" value={progressData.stats.goalsDone} color="#EF4444" />
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Overview */}
          <SectionCard>
            <div className="p-6">
              <SectionHeader title="Activity Overview">
                <div className="bg-light-border dark:bg-dark-border p-1 rounded-full flex text-sm">
                  <button onClick={() => setSelectedPeriod('week')} className={`px-3 py-1 rounded-full ${selectedPeriod === 'week' ? 'bg-light-primary text-white dark:bg-dark-primary' : 'text-light-textSecondary dark:text-dark-textSecondary'}`}>Week</button>
                  <button onClick={() => setSelectedPeriod('month')} className={`px-3 py-1 rounded-full ${selectedPeriod === 'month' ? 'bg-light-primary text-white dark:bg-dark-primary' : 'text-light-textSecondary dark:text-dark-textSecondary'}`}>Month</button>
                </div>
              </SectionHeader>
              <ActivityChart data={progressData.activities} period={selectedPeriod} />
            </div>
          </SectionCard>

          {/* Topic Progress */}
          <SectionCard>
            <div className="p-6">
              <SectionHeader title="Topic Progress" />
              <div className="space-y-4">
                <SubjectCard subject={{id: 1, name: 'Mathematics', progress: 60, problems: 3, totalProblems: 5, color: '#3B82F6'}} />
              </div>
            </div>
          </SectionCard>

          {/* Current Goals */}
          <SectionCard>
            <div className="p-6">
              <SectionHeader title="Current Goals" />
              <div className="space-y-4">
                <GoalCard goal={{id: 1, title: 'Solve 10 algebra problems', description: 'Practice makes perfect', progress: 5, target: 10, color: '#10B981'}} />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-8">
          {/* Achievements */}
          <SectionCard>
            <div className="p-6">
              <SectionHeader title="Recent Achievements" onSeeAll={() => setShowAchievementsModal(true)} />
              <div className="space-y-4">
                <AchievementPill achievement={{id: 1, title: 'Problem Solver', description: 'Solve your first problem', progress: 1, maxProgress: 1, color: '#EF4444'}} />
              </div>
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
      {showAchievementsModal && <AchievementsModal achievements={[{id: 1, title: 'Problem Solver', description: 'Solve your first problem', progress: 1, maxProgress: 1, color: '#EF4444'}]} onClose={() => setShowAchievementsModal(false)} />}
    </div>
  );
};

// Helper Components
const ActivityChart: React.FC<{ data: any[], period: string }> = ({ data, period }) => {
  const weeklyData = [ { day: 'Mon', hours: 2 }, { day: 'Tue', hours: 3 }, { day: 'Wed', hours: 1 }, { day: 'Thu', hours: 4 }, { day: 'Fri', hours: 2 }, { day: 'Sat', hours: 5 }, { day: 'Sun', hours: 1 }, ];
  const monthlyData = [ { day: 'Week 1', hours: 10 }, { day: 'Week 2', hours: 15 }, { day: 'Week 3', hours: 8 }, { day: 'Week 4', hours: 12 }, ];
  const chartData = period === 'week' ? weeklyData : monthlyData;

  return (
    <div className="h-64 flex items-end justify-around p-4 bg-light-background dark:bg-dark-background rounded-lg">
      {chartData.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-8 bg-light-accent rounded-t-lg" style={{ height: `${item.hours * 20}px` }}></div>
          <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-2">{item.day}</span>
        </div>
      ))}
    </div>
  );
};

const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-md">{children}</div>
);

const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void; children?: React.ReactNode }> = ({ title, onSeeAll, children }) => (
  <div className="flex justify-between items-center mb-4 p-6 pb-0">
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
  <div className="flex items-center gap-4 p-4 bg-light-background dark:bg-dark-background rounded-full border-[1.5px] border-[#d9c4b0]">
    <ProgressRing progress={subject.progress} size={50} strokeWidth={5} color={subject.color} />
    <div className="flex-1">
      <p className="font-bold text-light-text dark:text-dark-text">{subject.name}</p>
      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{subject.problems}/{subject.totalProblems} problems</p>
    </div>
    <ChevronRight className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
  </div>
);

const GoalCard: React.FC<{ goal: any }> = ({ goal }) => (
  <div className="p-5 bg-light-background dark:bg-dark-background rounded-full border-[1.5px] border-[#d9c4b0]">
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
    <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-[45px] border-[1.5px] border-[#d9c4b0] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
      <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">  All Achievements</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border"><X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" /></button>
      </header>
      <div className="p-6 overflow-y-auto space-y-4">
        {achievements && Array.isArray(achievements) ? achievements.map((ach:any) => <AchievementPill key={ach.id} achievement={ach} />) : <p className="text-light-textSecondary dark:text-dark-textSecondary">No achievements yet.</p>}
      </div>
    </div>
  </div>
);

export default ProgressPage;
