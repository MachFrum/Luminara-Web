
import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';
import { User } from '../../types';

interface EditProfileModalProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (profileData: Partial<User>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    preferredUsername: '',
    age: '',
    country: '',
    language: '',
    school: '',
    grade: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: (user as any).middleName || '', // Assuming these might not be in User type yet
        preferredUsername: (user as any).preferredUsername || '',
        age: (user as any).age || '',
        country: (user as any).country || '',
        language: (user as any).language || '',
        school: (user as any).school || '',
        grade: (user as any).grade || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { firstName, lastName, preferredUsername, age } = formData;
    if (!firstName || !lastName || !preferredUsername || !age) {
      alert('Please fill out all mandatory fields: First Name, Last Name, Preferred Username, and Age.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label: string, name: keyof typeof formData, placeholder: string, mandatory = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-1">
        {label} {mandatory && <span className="text-red-500">*</span>}
      </label>
      <input
        type={name === 'age' ? 'number' : 'text'}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 bg-light-background dark:bg-dark-background rounded-md border border-light-border dark:border-dark-border"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/30 dark:bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Edit Profile</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
            <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('First Name', 'firstName', 'Your first name', true)}
            {renderField('Last Name', 'lastName', 'Your last name', true)}
          </div>
          {renderField('Middle Name', 'middleName', 'Optional')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('Preferred Username', 'preferredUsername', 'e.g., learner123', true)}
            {renderField('Age', 'age', 'Your age', true)}
          </div>
          <hr className="border-light-border dark:border-dark-border" />
          {renderField('Country', 'country', 'e.g., United States')}
          {renderField('Language', 'language', 'e.g., English')}
          {renderField('School/Work', 'school', 'e.g., University of Knowledge')}
          {renderField('Class/Grade', 'grade', 'e.g., 12th Grade')}
        </div>

        <footer className="p-4 border-t border-light-border dark:border-dark-border">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-light-accent text-white rounded-full font-bold hover:bg-light-accent/80 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </footer>
      </div>
    </div>
  );
};
