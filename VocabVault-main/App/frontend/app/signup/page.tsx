// app/signup/page.tsx
'use client'

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthContextType } from '@/src/lib/types/auth';
import Link from 'next/link';
import { useTheme } from 'next-themes';


interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
}

interface UserPreferences {
  targetLanguage: string;
  dailyGoal: string;
  vocabularyGoal: string;
}


// New Modal component
const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ isOpen, onClose, onSave }) => {
  const [targetLanguage, setTargetLanguage] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [vocabularyGoal, setVocabularyGoal] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Set Your Preferences</h2>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select Target Language</option>
          <option value="ES">Spanish</option>
          <option value="FR">French</option>
          <option value="DE">German</option>
          {/* Add more language options as needed */}
        </select>
        <input
          type="number"
          value={dailyGoal}
          onChange={(e) => setDailyGoal(e.target.value)}
          placeholder="Daily Goal (Number of Words Practiced)"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          value={vocabularyGoal}
          onChange={(e) => setVocabularyGoal(e.target.value)}
          placeholder="Vocabulary Goal (How Many Words You Want to Learn)"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={() => onSave({ targetLanguage, dailyGoal, vocabularyGoal })}
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary/80"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const { register, login, error } = useAuth() as AuthContextType;
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(username, email, password, firstName, lastName);
    if (success) {
      setShowModal(true);
    }
  };

  const handleSavePreferences = async (preferences:any) => {
    // Here you would typically send these preferences to your backend
    console.log('Saving preferences:', preferences);
    // Close the modal
    setShowModal(false);
    // Log the user in and redirect to the dashboard
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-light dark:text-text-dark">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark placeholder-neutral-dark dark:placeholder-neutral-light text-text-light dark:text-text-dark rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark placeholder-neutral-dark dark:placeholder-neutral-light text-text-light dark:text-text-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark placeholder-neutral-dark dark:placeholder-neutral-light text-text-light dark:text-text-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark placeholder-neutral-dark dark:placeholder-neutral-light text-text-light dark:text-text-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark placeholder-neutral-dark dark:placeholder-neutral-light text-text-light dark:text-text-dark rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-primary text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/login" className="font-medium text-secondary hover:text-secondary/80">
            Already have an account? Sign in
          </Link>
        </div>
      </div>

      <UserPreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePreferences}
      />
    </div>
  );
}

export default SignupPage;