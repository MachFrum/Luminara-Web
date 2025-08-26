
import React from 'react';
import { Calendar, Clock, Tag, CheckCircle, AlertCircle, Loader } from 'react-feather';
import { ProblemEntry } from '../../types';
import { format } from 'date-fns';

const getStatusIcon = (status: ProblemEntry['status']) => {
  switch (status) {
    case 'solved':
      return <CheckCircle size={20} className="text-green-500" />;
    case 'pending':
      return <Loader size={20} className="text-yellow-500 animate-spin" />;
    case 'failed':
      return <AlertCircle size={20} className="text-red-500" />;
    default:
      return null;
  }
};

const getDifficultyClass = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
        case 'easy': return 'bg-green-100 text-green-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'hard': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

interface ProblemPreviewProps {
  problem: ProblemEntry;
  onClick: (problem: ProblemEntry) => void;
}

export const ProblemPreview: React.FC<ProblemPreviewProps> = ({ problem, onClick }) => {
  return (
    <div onClick={() => onClick(problem)} className="bg-light-surface dark:bg-dark-surface p-4 sm:p-5 rounded-2xl shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out relative overflow-hidden border border-light-border dark:border-dark-border">
        <div className={`absolute top-0 left-0 h-1 w-full ${problem.status === 'solved' ? 'bg-green-500' : problem.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        <div className="flex justify-between items-start gap-4">
            <h3 className="font-bold text-lg text-light-text dark:text-dark-text mb-2">{problem.title}</h3>
            {getStatusIcon(problem.status)}
        </div>
        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-4 line-clamp-2">{problem.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-light-textSecondary dark:text-dark-textSecondary">
            <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{format(new Date(problem.submittedAt), 'MMM dd, yyyy')}</span>
            </div>
            {problem.solvedAt &&
                <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Solved {format(new Date(problem.solvedAt), 'HH:mm')}</span>
                </div>
            }
            <div className="flex items-center gap-1.5">
                <Tag size={14} />
                <span>{problem.subject}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full font-medium ${getDifficultyClass(problem.difficulty)}`}>
                {problem.difficulty}
            </span>
        </div>
        {problem.tags.length > 0 &&
            <div className="mt-3 flex flex-wrap gap-1.5">
                {problem.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">{tag}</span>
                ))}
            </div>
        }
    </div>
  );
};
