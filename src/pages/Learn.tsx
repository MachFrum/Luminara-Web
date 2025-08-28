import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProblemHistory } from '../hooks/useProblemHistory';
import { ProblemEntry } from '../types';
import { ProblemPreview } from '../components/problems/ProblemPreview';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PulsingActionButton } from '../components/common/PulsingActionButton';
import { SubmitProblemModal } from '../components/problems/SubmitProblemModal';
import { submitProblem } from '../lib/api';
import { Search, RefreshCw, X, AlertTriangle, UploadCloud } from 'react-feather';

// Type for submissions that are waiting to be sent
interface PendingSubmission {
  id: string;
  text: string;
  fileName?: string;
  fileType?: string;
  fileBase64?: string; // File stored as a Base64 string
}

// Helper to convert a File to a Base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper to convert a Base64 string back to a File
const base64ToFile = (base64: string, filename: string, type: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime || type });
};

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
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Load pending submissions from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pendingSubmissions');
      if (saved) {
        setPendingSubmissions(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load pending submissions from localStorage", e);
    }
  }, []);

  const handleProblemSubmit = async (data: { text: string; file?: File }) => {
    try {
      await submitProblem(data);
      alert('Problem submitted successfully!');
      refetch(); // Refresh the history
    } catch (e) {
      console.error('Submission failed, saving for later.', e);
      const newPendingItem: PendingSubmission = {
        id: uuidv4(),
        text: data.text,
      };
      if (data.file) {
        newPendingItem.fileBase64 = await fileToBase64(data.file);
        newPendingItem.fileName = data.file.name;
        newPendingItem.fileType = data.file.type;
      }
      const updatedPending = [...pendingSubmissions, newPendingItem];
      setPendingSubmissions(updatedPending);
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedPending));
      alert('Could not connect to the server. Your submission has been saved and will be sent later.');
      // Re-throw to let the modal know the submission failed
      throw e;
    }
  };

  const handleRetry = async (pendingItem: PendingSubmission) => {
    setRetryingId(pendingItem.id);
    try {
      let file: File | undefined = undefined;
      if (pendingItem.fileBase64 && pendingItem.fileName && pendingItem.fileType) {
        file = base64ToFile(pendingItem.fileBase64, pendingItem.fileName, pendingItem.fileType);
      }
      await submitProblem({ text: pendingItem.text, file });
      
      // On success, remove from pending list
      const updatedPending = pendingSubmissions.filter(p => p.id !== pendingItem.id);
      setPendingSubmissions(updatedPending);
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedPending));
      alert('Submission successful!');
      refetch();
    } catch (e) {
      console.error('Retry failed', e);
      alert('Still couldn\'t connect. Please try again later.');
    } finally {
      setRetryingId(null);
    }
  };

  const openProblemModal = (problem: ProblemEntry) => setSelectedProblem(problem);
  const closeProblemModal = () => setSelectedProblem(null);

  return (
    <div className="bg-light-background dark:bg-dark-background min-h-screen">
      <header className="bg-gradient-to-br from-light-deepNavy to-light-accent dark:from-dark-deepNavy dark:to-dark-accent text-white p-6 rounded-b-3xl shadow-lg mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Learning History</h1>
        <p className="text-lg text-white/80 mt-1">
          {problems.length} problems solved
        </p>
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10" />
          <input
            type="text"
            placeholder="Search problems, topics, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/20 dark:bg-black/20 text-white placeholder-white/60 backdrop-blur-sm border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 pt-0">
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

        {/* Pending Submissions */} 
        {pendingSubmissions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-3">Pending Submissions</h2>
            <div className="space-y-3">
              {pendingSubmissions.map(item => (
                <div key={item.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-bold text-light-text dark:text-dark-text">Submission failed to send</p>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary truncate">{item.text}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRetry(item)}
                    disabled={retryingId === item.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-white text-sm font-semibold rounded-full hover:bg-yellow-600 transition-colors disabled:opacity-70"
                  >
                    {retryingId === item.id ? <LoadingSpinner size={16} /> : <UploadCloud size={16} />}
                    {retryingId === item.id ? 'Retrying...' : 'Retry'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Problems List */} 
        <div className="space-y-4">
          {loading && <div className="text-center"><LoadingSpinner size={40} /></div>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && problems.length === 0 && pendingSubmissions.length === 0 && (
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

      <PulsingActionButton onClick={() => setShowInputModal(true)} />

      {showInputModal && (
        <SubmitProblemModal 
          onClose={() => setShowInputModal(false)}
          onSubmit={handleProblemSubmit}
        />
      )}

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