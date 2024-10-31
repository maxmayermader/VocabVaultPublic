'use client';

import { useState } from 'react';
import { translateWord } from '@/src/lib/apiUtils/translate/translate';
import { useAuth } from "../context/AuthContext";

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const {user, isAuthenticated} = useAuth();

  const handleTranslate = async () => {
    // Implement translation logic here
    if (isAuthenticated && user && inputText !== '') {
      const translation = await translateWord(user.username, inputText);
      setOutputText(translation);
    }  
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Translate</h1>
      <div className="flex flex-col space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 p-2 border rounded"
          placeholder="Enter text to translate"
        />
        <button
          onClick={handleTranslate}
          className="bg-primary text-white font-bold py-2 px-4 rounded"
        >
          Translate
        </button>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow min-h-[8rem]">
          <h2 className="text-xl font-semibold mb-2">Translation</h2>
          <p>{outputText}</p>
        </div>
      </div>
    </div>
  );
}