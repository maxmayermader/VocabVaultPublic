"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { CardSet as WordSet } from "@/src/lib/types/practice";
import { getAllCardSets } from "@/src/lib/apiUtils/practice/api";
import { createWordSet } from "@/src/lib/apiUtils/WordSet/WordSet";
import { Card, CardSet } from "@/src/lib/types/practice";
import CreateWordSetModal from "@/components/WordSets/CreateWordSetModal";

export default function WordSetsPage() {
  const [featuredWordSets, setFeaturedWordSets] = useState<WordSet[]>([]);
  const [searchWordSets, setSearchWordSets] = useState<WordSet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [newWordSet, setNewWordSet] = useState<Partial<WordSet>>({});
  const [newWordSet, setNewWordSet] = useState<Partial<CardSet>>({ card_data: [] });
  // const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | { id: string; source: string; target: string; definition: string; pos: string; pronunciation: string }>(() => ({ id: "", source: "", target: "", definition: "", pos: "", pronunciation: "" }));

  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedWordSets();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchSearchWordSets();
    } else {
      setSearchWordSets([]);
    }
  }, [searchTerm]);

  const fetchFeaturedWordSets = async () => {
    try {
      const data = await getAllCardSets();
      console.log(data);
      setFeaturedWordSets(data);
    } catch (error) {
      console.error("Error fetching featured word sets:", error);
    }
  };

  const fetchSearchWordSets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/word-sets?search=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch word sets");
      }
      const data = await response.json();
      setSearchWordSets(data);
    } catch (error) {
      console.error("Error fetching word sets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = () => {
    if (currentCard && currentCard.source && currentCard.target) {
      setNewWordSet((prev) => ({
        ...prev,
        card_data: [...(prev.card_data || []), currentCard],
      }));
      setCurrentCard({ id: "", source: "", target: "", definition: "", pos: "", pronunciation: "" });
    }
  };

  const handleCreateWordSet = async (wordSet: WordSet) => {
    try {
      await createWordSet(wordSet, user?.username || "");
      setIsCreateModalOpen(false);
      // Optionally refresh the word sets list
      fetchFeaturedWordSets();
    } catch (error) {
      console.error("Error creating word set:", error);
    }
  };

  const renderWordSets = (sets: WordSet[], title: string) => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sets.map(
          (set) =>
            (!set.private || set.created_by === user?.id) && (
              <Link href={`/practice?wordSetId=${set.id}`} key={set.id}>
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer">
                  <h3 className="text-xl font-semibold">{set.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {set.length} words
                  </p>
                </div>
              </Link>
            )
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Word Sets</h1>
      <input
        type="text"
        placeholder="Search word sets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {user && user.is_superuser && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-4 rounded mb-4 dark:bg-secondary/80 dark:hover:bg-secondary"
        >
          Create Word Set
        </button>
      )}

      {isLoading && <p>Loading...</p>}

      {searchTerm &&
        searchWordSets.length > 0 &&
        renderWordSets(searchWordSets, "Search Results")}

      {!searchTerm && renderWordSets(featuredWordSets, "Featured Word Sets")}

      {isCreateModalOpen && (
        <CreateWordSetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateWordSet={handleCreateWordSet}
        />
      )}
    </div>
  );
}
