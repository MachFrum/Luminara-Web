import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { 
  BookOpen, 
  BarChart3, 
  Trophy, 
  Target,
  TrendingUp,
  Clock,
  Calendar,
  Award,
  Flame,
  Brain
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { ProgressRing } from '../components/common/ProgressRing';
import { GuestBanner } from '../components/common/GuestBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getDashboardData } from '../lib/api';
import { ProblemEntry, Achievement } from '../types';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const WelcomeText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtext = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionCard = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ActionIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.sm} auto;
`;

const ActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const ActionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 0.875rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecentActivitySection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ActivityItem = styled.div`
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ProgressSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
`;

const ProgressContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ProgressText = styled.div`
  flex: 1;
`;

const ProgressLevel = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ProgressRank = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const AchievementsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
`;

const AchievementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const AchievementItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const AchievementIcon = styled.div<{ unlocked: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.unlocked ? props.theme.colors.warning : props.theme.colors.border};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.unlocked ? 1 : 0.5};
`;

const AchievementContent = styled.div`
  flex: 1;
`;

const AchievementTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const AchievementProgress = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const MotivationalQuote = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
`;

const QuoteText = styled.blockquote`
  font-size: 1.125rem;
  font-style: italic;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  line-height: 1.5;
`;

const QuoteAuthor = styled.cite`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
`;

export const Dashboard: React.FC = () => {
  const { user, isGuest, exitGuestMode } = useAuth();
  const navigate = useNavigate();
  const [showGuestBanner, setShowGuestBanner] = useState(isGuest);
  const [recentProblems, setRecentProblems] = useState<ProblemEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getDashboardData();
        setRecentProblems(data.recentProblems || []);
        setAchievements(data.achievements || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGuestSignUp = () => {
    exitGuestMode();
    navigate('/auth/register');
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      title: 'Start Learning',
      description: 'Submit a new problem',
      icon: BookOpen,
      color: '#3B82F6',
      action: () => navigate('/learn'),
    },
    {
      title: 'View Progress',
      description: 'Check your analytics',
      icon: BarChart3,
      color: '#14B8A6',
      action: () => navigate('/progress'),
    },
    {
      title: 'Achievements',
      description: 'See your badges',
      icon: Trophy,
      color: '#F97316',
      action: () => navigate('/progress#achievements'),
    },
    {
      title: 'Profile Settings',
      description: 'Update your account',
      icon: Target,
      color: '#8B5CF6',
      action: () => navigate('/profile'),
    },
  ];

  if (loading) {
      return (
          <LoadingContainer>
              <LoadingSpinner size={40} />
          </LoadingContainer>
      );
  }

  return (
    <DashboardContainer>
      {showGuestBanner && (
        <GuestBanner
          onSignUpClick={handleGuestSignUp}
          onClose={() => setShowGuestBanner(false)}
        />
      )}
      
      <WelcomeSection>
        <WelcomeText>
          {getCurrentTimeGreeting()}, {user?.firstName || 'Guest'}! 👋
        </WelcomeText>
        <WelcomeSubtext>
          Ready to tackle some challenging problems today?
        </WelcomeSubtext>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#3B82F6">
            <Brain size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>
              <AnimatedCounter targetValue={user?.problemsSolved || 0} />
            </StatValue>
            <StatLabel>Problems Solved</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#14B8A6">
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>
              <AnimatedCounter targetValue={user?.hoursLearned || 0} suffix="h" />
            </StatValue>
            <StatLabel>Hours Learned</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#F97316">
            <Flame size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>
              <AnimatedCounter targetValue={user?.streak || 0} />
            </StatValue>
            <StatLabel>Day Streak</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#8B5CF6">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>
              <AnimatedCounter targetValue={user?.totalPoints || 0} />
            </StatValue>
            <StatLabel>Total Points</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <QuickActionsGrid>
        {quickActions.map((action, index) => (
          <ActionCard key={index} onClick={action.action}>
            <ActionIcon color={action.color}>
              <action.icon size={20} />
            </ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActionsGrid>

      <ContentGrid>
        <RecentActivitySection>
          <SectionTitle>Recent Activity</SectionTitle>
          <ActivityList>
            {recentProblems.length > 0 ? (
              recentProblems.map((problem) => (
                <ActivityItem key={problem.id}>
                  <ActivityTitle>{problem.title}</ActivityTitle>
                  <ActivityMeta>
                    <Calendar size={14} />
                    {new Date(problem.submittedAt).toLocaleDateString()}
                    <span>•</span>
                    <span>{problem.subject}</span>
                    <span>•</span>
                    <span className={`difficulty-${problem.difficulty}`}>
                      {problem.difficulty}
                    </span>
                  </ActivityMeta>
                </ActivityItem>
              ))
            ) : (
              <ActivityItem>
                <ActivityTitle>No recent activity</ActivityTitle>
                <ActivityMeta>
                  Start solving problems to see your activity here
                </ActivityMeta>
              </ActivityItem>
            )}
          </ActivityList>
        </RecentActivitySection>

        <SidebarSection>
          <ProgressSection>
            <SectionTitle>Your Progress</SectionTitle>
            <ProgressContent>
              <ProgressRing
                progress={(user?.level || 1) * 20}
                size={80}
                showPercentage={false}
                label="Level"
              />
              <ProgressText>
                <ProgressLevel>Level {user?.level || 1}</ProgressLevel>
                <ProgressRank>{user?.rank || 'Beginner'}</ProgressRank>
              </ProgressText>
            </ProgressContent>
          </ProgressSection>

          <AchievementsSection>
            <SectionTitle>Achievements</SectionTitle>
            <AchievementsList>
              {achievements.map((achievement) => (
                <AchievementItem key={achievement.id}>
                  <AchievementIcon unlocked={!!achievement.unlockedAt}>
                    <Award size={20} />
                  </AchievementIcon>
                  <AchievementContent>
                    <AchievementTitle>{achievement.title}</AchievementTitle>
                    <AchievementProgress>
                      {achievement.progress}/{achievement.maxProgress}
                    </AchievementProgress>
                  </AchievementContent>
                </AchievementItem>
              ))}
            </AchievementsList>
          </AchievementsSection>

          <MotivationalQuote>
            <QuoteText>
              "The expert in anything was once a beginner."
            </QuoteText>
            <QuoteAuthor>— Helen Hayes</QuoteAuthor>
          </MotivationalQuote>
        </SidebarSection>
      </ContentGrid>
    </DashboardContainer>
  );
};