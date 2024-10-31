// src/components/WordSets/CreateWordSetModal.tsx

import React, { useState } from 'react';
import { CardSet as WordSet, Card } from "@/src/lib/types/practice";

interface CreateWordSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWordSet: (wordSet: WordSet) => void;
}

type PartialWordSet = {
  title: string;
  language: string;
  card_data: Card[];
};

type PartialCard = Omit<Card, 'id'>;

const CreateWordSetModal: React.FC<CreateWordSetModalProps> = ({ isOpen, onClose, onCreateWordSet }) => {
  const [newWordSet, setNewWordSet] = useState<PartialWordSet>({
    title: '',
    language: '',
    card_data: [],
  });
  const [currentCard, setCurrentCard] = useState<PartialCard>({
    source: '',
    target: '',
    definition: '',
    pos: '',
    pronunciation: '',
  });

  const handleAddCard = () => {
    if (currentCard.source && currentCard.target) {
      const newCard: Card = {
        ...currentCard,
        id: Date.now().toString(), // Generate a temporary ID
      };
      setNewWordSet(prev => ({
        ...prev,
        card_data: [...prev.card_data, newCard],
      }));
      setCurrentCard({ source: '', target: '', definition: '', pos: '', pronunciation: '' });
    }
  };

  const handleCreateWordSet = () => {
    if (newWordSet.title && newWordSet.language && newWordSet.card_data.length > 0) {
      onCreateWordSet(newWordSet as WordSet);
      setNewWordSet({ title: '', language: '', card_data: [] });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Create Word Set</h2>
        <input
          type="text"
          placeholder="Title"
          value={newWordSet.title}
          onChange={(e) => setNewWordSet(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 mb-4 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Target Language"
          value={newWordSet.language}
          onChange={(e) => setNewWordSet(prev => ({ ...prev, language: e.target.value }))}
          className="w-full p-2 mb-4 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <h3 className="text-xl font-semibold mb-2 dark:text-white">Add Cards</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <input
            type="text"
            placeholder="Source"
            value={currentCard.source}
            onChange={(e) => setCurrentCard(prev => ({ ...prev, source: e.target.value }))}
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Target"
            value={currentCard.target}
            onChange={(e) => setCurrentCard(prev => ({ ...prev, target: e.target.value }))}
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Definition"
            value={currentCard.definition}
            onChange={(e) => setCurrentCard(prev => ({ ...prev, definition: e.target.value }))}
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Part of Speech"
            value={currentCard.pos}
            onChange={(e) => setCurrentCard(prev => ({ ...prev, pos: e.target.value }))}
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Pronunciation"
            value={currentCard.pronunciation}
            onChange={(e) => setCurrentCard(prev => ({ ...prev, pronunciation: e.target.value }))}
            className="p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={handleAddCard}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add Card
        </button>
        <div className="mb-4">
          <h4 className="font-semibold dark:text-white">Added Cards:</h4>
          <ul className="dark:text-gray-300">
            {newWordSet.card_data.map((card, index) => (
              <li key={card.id}>{card.source} - {card.target}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateWordSet}
            className="bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-4 rounded dark:bg-secondary/80 dark:hover:bg-secondary"
          >
            Create Word Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWordSetModal;