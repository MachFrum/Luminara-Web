
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'react-feather';
import { User } from '../../types';

interface EditProfileModalProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (profileData: Partial<User>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    avatar: '',
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
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
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
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-[40px] border-[1.5px] border-[#d9c4b0] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Edit Profile</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-light-border dark:hover:bg-dark-border">
            <X className="w-6 h-6 text-light-textSecondary dark:text-dark-textSecondary" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-4 hide-scrollbar">
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-[30px] bg-light-surface dark:bg-dark-surface flex items-center justify-center text-4xl font-bold border-2 border-light-border dark:border-dark-border overflow-hidden"
                onClick={handleAvatarClick}
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  `${user?.firstName?.[0] || 'G'}${user?.lastName?.[0] || 'U'}`
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <button 
                className="absolute bottom-0 right-0 bg-light-accent text-white p-2 rounded-full"
                onClick={handleAvatarClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </button>
            </div>
          </div>
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
