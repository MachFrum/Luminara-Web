
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { ProgressRing } from '../components/common/ProgressRing';
import { ActivityChart } from '../components/common/ActivityChart';
import { Target, Trophy, Flame, Award, TrendingUp, ChevronRight, X } from 'lucide-react';
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

// Mock Data (as in mobile file)
const mockProgressData = {
    stats: { challengesSolved: 38, topicsLearned: 23, goalsDone: 11, totalPoints: 462, level: 12, rank: 'Learning Explorer' },
    activities: Array(7).fill(0).map((_, i) => ({ date: `2025-01-${15+i}`, problems: Math.floor(Math.random() * 8) + 1, minutes: Math.floor(Math.random() * 60) + 15, completed: true })),
    achievements: [
        { id: '1', title: 'Problem Solver', description: 'Solved 50 problems', progress: 50, maxProgress: 50, unlockedAt: '2025-01-20' },
        { id: '2', title: 'Streak Master', description: '7 days in a row', progress: 7, maxProgress: 7, unlockedAt: '2025-01-21' },
        { id: '3', title: 'Quick Learner', description: 'Completed 5 topics', progress: 5, maxProgress: 5, unlockedAt: '2025-01-19' },
        { id: '4', title: 'Dedicated Student', description: '42 hours learned', progress: 42, maxProgress: 50, unlockedAt: '2025-01-18' },
        { id: '5', title: 'AWS Certified', description: 'Passed AWS Solutions Architect Exam', progress: 1, maxProgress: 1, unlockedAt: '2025-02-01' },
    ],
};

export const ProgressPage: React.FC = () => {
    const { user } = useAuth();
    const [showAchievementsModal, setShowAchievementsModal] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('showAchievements') === '1') {
            setShowAchievementsModal(true);
            // Optional: remove the query param after opening the modal
            searchParams.delete('showAchievements');
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

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
                    <StatCard><Trophy /><AnimatedCounter targetValue={mockProgressData.stats.challengesSolved} /></StatCard>
                    <StatCard><Target /><AnimatedCounter targetValue={mockProgressData.stats.topicsLearned} /></StatCard>
                    <StatCard><Flame /><AnimatedCounter targetValue={mockProgressData.stats.goalsDone} /></StatCard>
                </StatsGrid>
            </PageHeader>

            <Content>
                <Section>
                    <SectionHeader>
                        <SectionTitle>Activity Overview</SectionTitle>
                    </SectionHeader>
                    <ActivityChart data={mockProgressData.activities} />
                </Section>

                <Section>
                    <SectionHeader>
                        <SectionTitle>Recent Achievements</SectionTitle>
                        <SeeAllButton onClick={() => setShowAchievementsModal(true)}>See All</SeeAllButton>
                    </SectionHeader>
                    <AchievementsGrid>
                        {mockProgressData.achievements.slice(0, 4).map(ach => (
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
                        {mockProgressData.achievements.map(ach => (
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
