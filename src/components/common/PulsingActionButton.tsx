
import React from 'react';
import { Plus } from 'react-feather';

interface PulsingActionButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const PulsingActionButton: React.FC<PulsingActionButtonProps> = ({ onClick, isActive = false }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Add new problem"
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-light-accent to-green-400 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50 ${isActive ? 'animate-pulse' : ''}`}>
      <Plus className="w-8 h-8" />
    </button>
  );
};
