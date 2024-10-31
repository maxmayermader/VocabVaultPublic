// app/practice/page.tsx
'use client'
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ProtectedRoute from "@/components/ProtectedRoutes";
// import Pra?cticePageContent from "#/src/components/Practice/practicePage";
// const PracticePageContent = dynamic(() => import('@/src/components/Practice/practicePage'), {
//   ssr: false,
// });
import PracticePageContent from "@/components/Practice/practicePage";


export default function PracticePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <PracticePageContent />
      </ProtectedRoute>
    </Suspense>
  );
}