import React, { useState } from 'react';
import { X } from 'react-feather';
import { setGoal } from '../../lib/api';

interface SetGoalModalProps {
  onClose: () => void;
  onSave: (goal: any) => void;
}

export const SetGoalModal: React.FC<SetGoalModalProps> = ({ onClose, onSave }) => {
  const [goalName, setGoalName] = useState('');
  const [goalObjective, setGoalObjective] = useState('');
  const [progress, setProgress] = useState('');
  const [duration, setDuration] = useState('days');

  const handleSave = async () => {
    // Basic validation
    if (!goalName || !goalObjective || !progress) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const goalData = {
        name: goalName,
        objective: goalObjective,
        progress: parseInt(progress, 10),
        duration,
      };
      await setGoal(goalData);
      onSave(goalData);
      onClose();
    } catch (error) {
      alert('Failed to save goal. Please try again.');
      console.error('Error saving goal:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Set Your Own Goal</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
            <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
          <form>
            <div className="mb-4">
              <label htmlFor="goalName" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-1">Goal Name</label>
              <input
                type="text"
                id="goalName"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full px-3 py-2 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="goalObjective" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-1">Goal Objective</label>
              <input
                type="text"
                id="goalObjective"
                value={goalObjective}
                onChange={(e) => setGoalObjective(e.target.value)}
                className="w-full px-3 py-2 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="progress" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-1">Progress</label>
              <input
                type="number"
                id="progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="w-full px-3 py-2 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-1">Duration</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent"
              >
                <option value="mins">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-light-accent text-white rounded-full hover:bg-light-accent/80 transition-colors"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
