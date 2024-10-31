// src/components/Practice/PracticePageContent.tsx

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  fetchUserCardSet,
  updateProgress,
  fetchCard,
  getTemporaryCardSet,
} from "@/src/lib/apiUtils/practice/api";
import { FaVolumeUp } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { Card, CardSet } from "@/src/lib/types/practice";

export default function PracticePageContent() {
  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardSetLength, setCardSetLength] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [wordSetID, setWordSetID] = useState("");

  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  async function loadCardSet() {
    if (user) {
      try {
        let fetchedCardSet: CardSet;
        console.log("Loading card set with wordSetID:", wordSetID);
        if (wordSetID === "") {
          console.log("Fetching temporary card set");
          fetchedCardSet = await getTemporaryCardSet(-1, user.username);
        } else {
          console.log("Fetching user card set");
          fetchedCardSet = await fetchUserCardSet(wordSetID);
        }
        console.log("Fetched card set:", fetchedCardSet);
        setCardSetLength(fetchedCardSet.card_data.length);
        setCardSet(fetchedCardSet);
        setLoading(false);
      } catch (err) {
        console.log("Error loading card set:", err);
        setError("Failed to load card set");
      }
    }
  }

  useEffect(() => {
    if (searchParams) {
      const givenWordSetID = searchParams.get("wordSetId");
      console.log("Given wordSetID:", givenWordSetID);
      setWordSetID(givenWordSetID || "");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // Handle unauthenticated state if needed
    } else if (isAuthenticated) {
      loadCardSet();
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    async function loadCard() {
      if (!cardSet) return;
      console.log("cardSet prog", cardSet.card_data[currentCardIndex]);
      try {
        if (!loading && cardSet && user) {
          console.log("index", currentCardIndex);
          console.log("cards data", cardSet.card_data[currentCardIndex]);
          const cardData = cardSet.card_data[currentCardIndex];
          const cardID: string =
            typeof cardData === "object" && cardData !== null
              ? cardData.id
              : (cardData as string);
          const { card, progress } = await fetchCard(cardID, user.username);
          console.log("card", card);
          setCurrentCard(card);
          setProgress(progress);
          setIsFlipped(false); // Reset flip state for new card
        }
      } catch (error) {
        setError("Failed to load card");
      }
    }
    loadCard();
  }, [cardSet, currentCardIndex, loading, user]);

  const handleFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  const handleResponse = async (known: boolean) => {
    if (!isAuthenticated || !cardSet || !currentCard || !user) {
      setError("User not authenticated or card set not loaded");
      return;
    }

    try {
      let prog = progress;
      if (known && prog < 5) {
        prog++;
        await updateProgress(currentCard.id, user.username, prog);
      } else if (!known && prog > 0) {
        prog--;
        await updateProgress(currentCard.id, user.username, prog);
      }

      if (currentCardIndex < cardSetLength - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // End of practice session
        setError("Practice session completed!");
      }
    } catch (err) {
      console.error("Error updating progress:", err);
      setError("Failed to update progress");
    }
  };

  const handleSpeak = (pronunciationUrl: string | null) => {
    if (pronunciationUrl) {
      const audio = new Audio(
        `${process.env.NEXT_PUBLIC_API_URL}/${pronunciationUrl}`
      );
      audio.play();
    } else {
      console.log("No pronunciation available");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading || !cardSet || !currentCard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Practice: {cardSet.title}</h1>
      <div className="relative w-96 h-64" onClick={handleFlip}>
        <div className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="relative w-full h-full p-4">
            <div className="absolute top-2 right-2 w-16 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${(progress / 5) * 100}%` }}
              ></div>
            </div>
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out"
              style={{ transform: isFlipped ? 'translateY(-10%)' : 'translateY(0)' }}
            >
              <p className="text-3xl font-bold text-center">{currentCard.target}</p>
            </div>
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out"
              style={{ transform: isFlipped ? 'translateY(10%)' : 'translateY(90%)' }}
            >
              <p className="text-3xl font-bold text-center">{currentCard.source}</p>
            </div>
            <button
              className="absolute bottom-2 right-2 text-2xl text-blue-500 z-10"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleSpeak(currentCard.pronunciation);
              }}
            >
              <FaVolumeUp />
            </button>
          </div>
        </div>
      </div>
      {isFlipped && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => handleResponse(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {"I didn't know"}
          </button>
          <button
            onClick={() => handleResponse(true)}
            className="bg-accent text-white px-4 py-2 rounded"
          >
            I knew it
          </button>
        </div>
      )}
      <div className="mt-4">
        Card {currentCardIndex + 1} of {cardSetLength}
      </div>
    </div>
  );
}