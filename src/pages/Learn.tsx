import React, { useState } from 'react';
import { useProblemHistory } from '../hooks/useProblemHistory';
import { ProblemEntry } from '../types';
import { ProblemPreview } from '../components/problems/ProblemPreview';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PulsingActionButton } from '../components/common/PulsingActionButton';
import { Search, RefreshCw, X } from 'react-feather';

export const Learn: React.FC = () => {
  const {
    problems,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetch,
  } = useProblemHistory();

  const [selectedProblem, setSelectedProblem] = useState<ProblemEntry | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);

  const openProblemModal = (problem: ProblemEntry) => setSelectedProblem(problem);
  const closeProblemModal = () => setSelectedProblem(null);
  const openInputModal = () => setShowInputModal(true);
  const closeInputModal = () => setShowInputModal(false);

  return (
    <div className="bg-light-background dark:bg-dark-background min-h-screen">
      {/* Header */}
      <header className="bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xl p-6 rounded-b-3xl shadow-lg mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-light-text dark:text-dark-text">Learning History</h1>
        <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary mt-1">
          {problems.length} problems solved
        </p>
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary z-10" />
          <input
            type="text"
            placeholder="Search problems, topics, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-full text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent"
          />
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 pt-0">
        {/* Controls */}
        <div className="mb-6">
          <button 
            onClick={() => refetch()} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-full text-light-accent hover:bg-light-accent hover:text-white dark:hover:bg-light-accent dark:hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size={20} /> : <RefreshCw className="w-5 h-5" />}
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {loading && <div className="text-center"><LoadingSpinner size={40} /></div>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && problems.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">No problems found</h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary mt-2">
                {searchTerm ? 'Try adjusting your search terms' : 'Start solving problems to see them here'}
              </p>
            </div>
          )}
          {!loading && !error && problems.map((problem) => (
            <ProblemPreview
              key={problem.id}
              problem={problem}
              onClick={() => openProblemModal(problem)}
            />
          ))}
        </div>
      </main>

      {/* FAB */}
      <PulsingActionButton onClick={openInputModal} />

      {/* Input Modal */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-[30px] border-[1.5px] border-[#d9c4b0] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Submit a Problem</h2>
              <button onClick={closeInputModal} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
                <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
              </button>
            </header>
            <div className="p-6 overflow-y-auto">
              {/* Add your input form here */}
              <p className="text-light-text dark:text-dark-text">Input form will go here.</p>
            </div>
          </div>
        </div>
      )}

      {/* Problem Details Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={closeProblemModal}>
          <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-[30px] border-[1.5px] border-[#d9c4b0] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text">{selectedProblem.title}</h2>
              <button onClick={closeProblemModal} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
                <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
              </button>
            </header>
            <div className="p-6 overflow-y-auto text-light-text dark:text-dark-text">
              <p><strong className="text-light-accent">Topic:</strong> {selectedProblem.topic}</p>
              <p><strong className="text-light-accent">Tags:</strong> {selectedProblem.tags.join(', ')}</p>
              <div className="mt-4">
                <h3 className="font-bold text-lg mb-2">Solution:</h3>
                <p>{selectedProblem.solution || 'No solution available.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;