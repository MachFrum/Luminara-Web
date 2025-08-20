import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { ActivityChart } from '../components/common/ActivityChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getUserProgress } from '../lib/api'; // This function will be created next
import { Target, Trophy, Flame, Award, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ProgressContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
`;

const PageHeader = styled.div`
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.surface}, ${props => props.theme.colors.primaryDark});
  color: ${props => props.theme.colors.text};
  border-radius: 0 0 30px 30px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const HeaderSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface}40;
  border: 1px solid ${props => props.theme.colors.border}80;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const SeeAllButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const AchievementCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.lg};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
`;

const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;
`;

const ModalBody = styled.div`
  overflow-y: auto; max-height: 65vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserProgress();
        setProgressData(data);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();

    if (searchParams.get('showAchievements') === '1') {
      setShowAchievementsModal(true);
      searchParams.delete('showAchievements');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size={40} />
      </LoadingContainer>
    );
  }

  if (!progressData) {
    return <div>Failed to load progress data.</div>;
  }

  return (
    <ProgressContainer>
      <PageHeader>
        <HeaderTop>
          <div>
            <HeaderTitle>Your Progress</HeaderTitle>
            <HeaderSubtitle>Level {user?.level || 0} • {user?.rank || 'Beginner'}</HeaderSubtitle>
          </div>
        </HeaderTop>
        <StatsGrid>
          <StatCard><Trophy /><AnimatedCounter targetValue={progressData.stats.challengesSolved} /></StatCard>
          <StatCard><Target /><AnimatedCounter targetValue={progressData.stats.topicsLearned} /></StatCard>
          <StatCard><Flame /><AnimatedCounter targetValue={progressData.stats.goalsDone} /></StatCard>
        </StatsGrid>
      </PageHeader>

      <Content>
        <Section>
          <SectionHeader>
            <SectionTitle>Activity Overview</SectionTitle>
          </SectionHeader>
          <ActivityChart data={progressData.activities} />
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Recent Achievements</SectionTitle>
            <SeeAllButton onClick={() => setShowAchievementsModal(true)}>See All</SeeAllButton>
          </SectionHeader>
          <AchievementsGrid>
            {progressData.achievements.slice(0, 4).map((ach: any) => (
              <AchievementCard key={ach.id}>
                <Award />
                <div>
                  <strong>{ach.title}</strong>
                  <p>{ach.description}</p>
                </div>
              </AchievementCard>
            ))}
          </AchievementsGrid>
        </Section>
      </Content>

      <ModalOverlay isOpen={showAchievementsModal} onClick={() => setShowAchievementsModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <SectionTitle>All Achievements</SectionTitle>
            <button onClick={() => setShowAchievementsModal(false)}><X /></button>
          </ModalHeader>
          <ModalBody>
            {progressData.achievements.map((ach: any) => (
              <AchievementCard key={ach.id}>
                <Award />
                <div>
                  <strong>{ach.title}</strong>
                  <p>{ach.description}</p>
                  <p>{ach.progress}/{ach.maxProgress}</p>
                </div>
              </AchievementCard>
            ))}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </ProgressContainer>
  );
};