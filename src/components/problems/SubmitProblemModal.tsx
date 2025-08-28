
import React, { useState, useRef } from 'react';
import { X, Upload, Send } from 'react-feather';

interface SubmitProblemModalProps {
  onClose: () => void;
  onSubmit: (data: { text: string; file?: File }) => Promise<void>;
}

export const SubmitProblemModal: React.FC<SubmitProblemModalProps> = ({ onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!text.trim() && !file) {
      alert('Please enter some text or upload a file.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ text, file: file || undefined });
      onClose();
    } catch (error) {
      // Error is handled by the parent component's onSubmit logic
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-[30px] border-[1.5px] border-[#d9c4b0] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Submit a Problem</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
            <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your problem or ask a question..."
            className="w-full h-40 p-3 bg-light-background dark:bg-dark-background rounded-lg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-accent"
            disabled={isSubmitting}
          />

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf"
            />
            <button 
              onClick={triggerFileInput}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-light-surface dark:bg-dark-surface border-2 border-dashed border-light-border dark:border-dark-border rounded-lg text-light-textSecondary dark:text-dark-textSecondary hover:border-light-accent dark:hover:border-dark-accent transition-colors"
            >
              <Upload size={20} />
              <span>{file ? file.name : 'Upload a file (optional)'}</span>
            </button>
            {file && (
              <button onClick={() => setFile(null)} className="text-xs text-red-500 mt-1">
                Remove file
              </button>
            )}
          </div>
        </div>

        <footer className="p-4 border-t border-light-border dark:border-dark-border">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || (!text.trim() && !file)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-light-accent text-white rounded-full font-bold hover:bg-light-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Submit</span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};
