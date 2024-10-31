'use client';
import Link from 'next/link';
import  ProtectedRoute  from '@/components/ProtectedRoutes';
import StatsComponent from '@/components/Stats/statsComp';

export default function Home() {
  console.log("Home Page");
  return (
    <ProtectedRoute>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatsComponent
          wordsProgress={10}
          wordGoal={20}
          currentStreak={5}
          totalVocabulary={100}
          bestStreak={10}
          totalWordSets={5}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Link href="/practice" className="bg-primary text-white p-4 rounded text-center">
          Practice
        </Link>
        <Link href="/translate" className="bg-primary text-white p-4 rounded text-center">
          Translate
        </Link>
        <Link href="/word-sets" className="bg-primary text-white p-4 rounded text-center">
          Word Sets
        </Link>
      </div>
    </div>
    </ProtectedRoute>
  );
}