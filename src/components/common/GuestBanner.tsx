
import React from 'react';
import { UserPlus, X } from 'react-feather';

interface GuestBannerProps {
  onSignUpClick: () => void;
  onClose: () => void;
}

export const GuestBanner: React.FC<GuestBannerProps> = ({ onSignUpClick, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-light-deepNavy to-light-accent text-white p-4 rounded-lg shadow-lg flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white/20 rounded-full">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">You're in Guest Mode</h3>
          <p className="text-sm opacity-90">Sign up to save your progress and unlock all features.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onSignUpClick} className="bg-white text-light-deepNavy font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          Sign Up Free
        </button>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
