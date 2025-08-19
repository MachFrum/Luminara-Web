import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Search, Filter, Plus } from 'lucide-react';
import { ProblemPreview } from '../components/problems/ProblemPreview';
import { PulsingActionButton } from '../components/common/PulsingActionButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useProblemHistory } from '../hooks/useProblemHistory';
import { ProblemEntry } from '../types';

const LearnContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} 3rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProblemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md} auto;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const EmptyDescription = styled.p`
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const EmptyAction = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
`;

const ProblemModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ProblemModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xl};
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius};
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

export const Learn: React.FC = () => {
  const {
    problems,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedSubject,
    setSelectedSubject,
    subjects,
  } = useProblemHistory();

  const [selectedProblem, setSelectedProblem] = useState<ProblemEntry | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const handleProblemClick = (problem: ProblemEntry) => {
    setSelectedProblem(problem);
  };

  const closeModal = () => {
    setSelectedProblem(null);
  };

  const handleNewProblem = () => {
    setShowSubmissionModal(true);
  };

  return (
    <LearnContainer>
      <Header>
        <Title>Learning Center</Title>
        <Subtitle>
          Explore your problem-solving journey and submit new challenges
        </Subtitle>
      </Header>

      <Controls>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search problems by title, tags, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FilterSelect
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </FilterSelect>
      </Controls>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner size={32} />
        </LoadingContainer>
      ) : error ? (
        <EmptyState>
          <EmptyIcon>
            <Filter size={40} />
          </EmptyIcon>
          <EmptyTitle>Error Loading Problems</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyState>
      ) : problems.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Plus size={40} />
          </EmptyIcon>
          <EmptyTitle>No Problems Found</EmptyTitle>
          <EmptyDescription>
            {searchTerm || selectedSubject !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by submitting your first problem!'}
          </EmptyDescription>
          {(!searchTerm && selectedSubject === 'all') && (
            <EmptyAction onClick={handleNewProblem}>
              Submit Your First Problem
            </EmptyAction>
          )}
        </EmptyState>
      ) : (
        <ProblemsGrid>
          {problems.map((problem) => (
            <ProblemPreview
              key={problem.id}
              problem={problem}
              onClick={handleProblemClick}
            />
          ))}
        </ProblemsGrid>
      )}

      <PulsingActionButton
        onClick={handleNewProblem}
        isActive={problems.length === 0}
      />

      {/* Problem Detail Modal */}
      <ProblemModal isOpen={!!selectedProblem} onClick={closeModal}>
        <ProblemModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{selectedProblem?.title}</ModalTitle>
            <CloseButton onClick={closeModal}>✕</CloseButton>
          </ModalHeader>
          {selectedProblem && (
            <div>
              <p><strong>Subject:</strong> {selectedProblem.subject}</p>
              <p><strong>Difficulty:</strong> {selectedProblem.difficulty}</p>
              <p><strong>Description:</strong> {selectedProblem.description}</p>
              {selectedProblem.solution && (
                <div>
                  <h4>Solution:</h4>
                  <p>{selectedProblem.solution}</p>
                </div>
              )}
              {selectedProblem.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong> {selectedProblem.tags.join(', ')}
                </div>
              )}
            </div>
          )}
        </ProblemModalContent>
      </ProblemModal>
    </LearnContainer>
  );
};