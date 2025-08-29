import React, { useState } from 'react';
import { Edit, History, CheckCircle, XCircle, X } from 'react-feather';
import { useNavigate } from 'react-router-dom';

export const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);
  const [activeTab, setActiveTab] = useState('new');

  const handleCorrectWithAI = () => {
    // Mock AI correction for now
    setCorrectedText(journalEntry.toUpperCase()); // Simple transformation for demo
    setShowCorrection(true);
  };

  const handleAcceptChanges = () => {
    setJournalEntry(correctedText);
    setShowCorrection(false);
  };

  const handleKeepOriginal = () => {
    setShowCorrection(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-light-background dark:bg-dark-background min-h-screen">
      <header className="bg-light-surface dark:bg-dark-surface p-4 rounded-t-2xl border-b border-light-border dark:border-dark-border">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Journal</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('new')} 
              className={`px-4 py-2 rounded-full text-sm font-semibold border-[1.5px] border-transparent ${activeTab === 'new' ? 'bg-light-accent text-white border-light-accent' : 'bg-transparent text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-background dark:hover:bg-dark-background hover:border-[#d9c4b0]'}`}>
              New Entry
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`px-4 py-2 rounded-full text-sm font-semibold border-[1.5px] border-transparent ${activeTab === 'history' ? 'bg-light-accent text-white border-light-accent' : 'bg-transparent text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-background dark:hover:bg-dark-background hover:border-[#d9c4b0]'}`}>
              History
            </button>
            <button 
              onClick={handleCorrectWithAI} 
              className="px-4 py-2 rounded-full text-sm font-semibold bg-light-success text-white border-[1.5px] border-light-success hover:bg-light-success/80 transition-colors">
              Edit with AI
            </button>
          </div>
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
            <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
          </button>
        </div>
      </header>

      <div className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl rounded-b-3xl border-[1.5px] border-[#d9c4b0] shadow-md p-4 flex flex-grow">
        {activeTab === 'new' && (
          <div className={`flex-1 ${showCorrection ? 'w-1/2 pr-2' : 'w-full'}`}>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full h-full p-4 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent resize-none"
            />
          </div>
        )}

        {showCorrection && (
          <div className="w-1/2 pl-2">
            <div className="h-full p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg overflow-y-auto">
              <h3 className="font-bold text-lg mb-2">AI Correction:</h3>
              <p>{correctedText}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={handleAcceptChanges} className="px-4 py-2 bg-light-accent text-white rounded-full text-sm border-[1.5px] border-light-accent hover:bg-light-accent/80 transition-colors">
                  <CheckCircle size={16} className="inline-block mr-1" /> Accept
                </button>
                <button onClick={handleKeepOriginal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full text-sm border-[1.5px] border-gray-300 hover:bg-gray-400 transition-colors">
                  <XCircle size={16} className="inline-block mr-1" /> Keep Original
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="w-full p-4">
            <h2 className="text-xl font-bold mb-4">History</h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">No journal entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;