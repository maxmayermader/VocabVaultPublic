// components/StatsComponent.tsx
import React from 'react';

interface StatsProps {
  wordsProgress: number;
  wordGoal: number;
  currentStreak: number;
  totalVocabulary: number;
  bestStreak: number;
  totalWordSets: number;
}

const StatsComponent: React.FC<StatsProps> = ({
  wordsProgress,
  wordGoal,
  currentStreak,
  totalVocabulary,
  bestStreak,
  totalWordSets,
}) => {
  return (
    <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-light dark:bg-neutral-dark p-4 rounded">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Daily Progress</h3>
          <p className="text-2xl font-bold text-primary">{wordsProgress}/{wordGoal} words</p>
        </div>
        <div className="bg-neutral-light dark:bg-neutral-dark p-4 rounded">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Current Streak</h3>
          <p className="text-2xl font-bold text-secondary">{currentStreak} days</p>
        </div>
        <div className="bg-neutral-light dark:bg-neutral-dark p-4 rounded">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Total Vocabulary</h3>
          <p className="text-2xl font-bold text-accent">{totalVocabulary} words</p>
        </div>
        <div className="bg-neutral-light dark:bg-neutral-dark p-4 rounded">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Best Streak</h3>
          <p className="text-2xl font-bold text-secondary">{bestStreak} days</p>
        </div>
        <div className="bg-neutral-light dark:bg-neutral-dark p-4 rounded col-span-2">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Total Word Sets</h3>
          <p className="text-2xl font-bold text-primary">{totalWordSets} sets</p>
        </div>
      </div>
    </div>
  );
};

export default StatsComponent;