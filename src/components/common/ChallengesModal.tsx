
import React, { useState } from 'react';
import { X, Zap, Book, BarChart2, Hash } from 'react-feather';
import { ChallengeData } from '../../types';

interface ChallengesModalProps {
  onClose: () => void;
  onSubmit: (challengeData: ChallengeData) => void;
}

export const ChallengesModal: React.FC<ChallengesModalProps> = ({ onClose, onSubmit }) => {
  const [challengeName, setChallengeName] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({ name: challengeName, topic, level, questionCount });
      onClose();
    } catch (error) {
      console.error("Failed to submit challenge", error);
      // Parent component will show an alert
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 dark:bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Create a Challenge</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
            <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* Challenge Name */}
          <div>
            <label className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary flex items-center gap-2 mb-1">
              <Zap size={16} />
              Challenge Name
            </label>
            <input 
              type="text"
              value={challengeName}
              onChange={(e) => setChallengeName(e.target.value)}
              placeholder='e.g., Algebra Fundamentals'
              className="w-full p-2 bg-light-background dark:bg-dark-background rounded-md border border-light-border dark:border-dark-border"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary flex items-center gap-2 mb-1">
              <Book size={16} />
              Topic
            </label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='e.g., Quadratic Equations'
              className="w-full p-2 bg-light-background dark:bg-dark-background rounded-md border border-light-border dark:border-dark-border"
            />
          </div>

          {/* Level */}
          <div>
            <label className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary flex items-center gap-2 mb-1">
              <BarChart2 size={16} />
              Level
            </label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full p-2 bg-light-background dark:bg-dark-background rounded-md border border-light-border dark:border-dark-border"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary flex items-center gap-2 mb-1">
              <Hash size={16} />
              Number of Questions
            </label>
            <input 
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10) || 1)}
              min="1"
              max="50"
              className="w-full p-2 bg-light-background dark:bg-dark-background rounded-md border border-light-border dark:border-dark-border"
            />
          </div>
        </div>

        <footer className="p-4 border-t border-light-border dark:border-dark-border">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !challengeName.trim() || !topic.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-light-accent text-white rounded-full font-bold hover:bg-light-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Starting...' : 'Start Challenge'}
          </button>
        </footer>
      </div>
    </div>
  );
};
