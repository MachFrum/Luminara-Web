import React from 'react';
import styled from '@emotion/styled';
import { Calendar, Clock, Tag, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { ProblemEntry } from '../../types';
import { format } from 'date-fns';

const PreviewCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StatusIndicator = styled.div<{ status: 'solved' | 'pending' | 'failed' }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => {
    switch (props.status) {
      case 'solved': return props.theme.colors.success;
      case 'pending': return props.theme.colors.warning;
      case 'failed': return props.theme.colors.error;
      default: return props.theme.colors.border;
    }
  }};
`;

const ProblemHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProblemTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

const StatusIcon = styled.div<{ status: 'solved' | 'pending' | 'failed' }>`
  color: ${props => {
    switch (props.status) {
      case 'solved': return props.theme.colors.success;
      case 'pending': return props.theme.colors.warning;
      case 'failed': return props.theme.colors.error;
      default: return props.theme.colors.textSecondary;
    }
  }};
  flex-shrink: 0;
`;

const ProblemDescription = styled.p`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProblemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DifficultyBadge = styled.span<{ difficulty: 'easy' | 'medium' | 'hard' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.difficulty) {
      case 'easy': return props.theme.colors.success + '20';
      case 'medium': return props.theme.colors.warning + '20';
      case 'hard': return props.theme.colors.error + '20';
      default: return props.theme.colors.textSecondary + '20';
    }
  }};
  color: ${props => {
    switch (props.difficulty) {
      case 'easy': return props.theme.colors.success;
      case 'medium': return props.theme.colors.warning;
      case 'hard': return props.theme.colors.error;
      default: return props.theme.colors.textSecondary;
    }
  }};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const TagChip = styled.span`
  padding: 0.125rem 0.375rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const getStatusIcon = (status: ProblemEntry['status']) => {
  switch (status) {
    case 'solved':
      return <CheckCircle size={20} />;
    case 'pending':
      return <Loader size={20} />;
    case 'failed':
      return <AlertCircle size={20} />;
    default:
      return null;
  }
};

interface ProblemPreviewProps {
  problem: ProblemEntry;
  onClick: (problem: ProblemEntry) => void;
}

export const ProblemPreview: React.FC<ProblemPreviewProps> = ({
  problem,
  onClick,
}) => {
  return (
    <PreviewCard onClick={() => onClick(problem)}>
      <StatusIndicator status={problem.status} />
      
      <ProblemHeader>
        <ProblemTitle>{problem.title}</ProblemTitle>
        <StatusIcon status={problem.status}>
          {getStatusIcon(problem.status)}
        </StatusIcon>
      </ProblemHeader>
      
      <ProblemDescription>
        {problem.description}
      </ProblemDescription>
      
      <ProblemMeta>
        <MetaItem>
          <Calendar size={14} />
          {format(new Date(problem.submittedAt), 'MMM dd, yyyy')}
        </MetaItem>
        
        {problem.solvedAt && (
          <MetaItem>
            <Clock size={14} />
            Solved {format(new Date(problem.solvedAt), 'HH:mm')}
          </MetaItem>
        )}
        
        <MetaItem>
          <Tag size={14} />
          {problem.subject}
        </MetaItem>
        
        <DifficultyBadge difficulty={problem.difficulty}>
          {problem.difficulty}
        </DifficultyBadge>
      </ProblemMeta>
      
      {problem.tags.length > 0 && (
        <TagsContainer>
          {problem.tags.map((tag, index) => (
            <TagChip key={index}>{tag}</TagChip>
          ))}
        </TagsContainer>
      )}
    </PreviewCard>
  );
};