// components/GoalSettingComponent.tsx
import React, { useState } from 'react';

interface GoalSettingProps {
  currentGoal: number;
  onSaveGoal: (goal: number) => void;
  onClose: () => void;
}

const GoalSettingComponent: React.FC<GoalSettingProps> = ({ currentGoal, onSaveGoal, onClose }) => {
  const [newGoal, setNewGoal] = useState(currentGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoal(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Set Your Daily Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="goalInput" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Words to practice daily:
            </label>
            <input
              type="number"
              id="goalInput"
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-light dark:border-neutral-dark rounded-md text-text-light dark:text-text-dark hover:bg-neutral-light dark:hover:bg-neutral-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalSettingComponent;