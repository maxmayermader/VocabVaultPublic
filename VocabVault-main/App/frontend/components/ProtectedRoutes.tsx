// app/components/ProtectedRoute.tsx
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { AuthContextType } from '@/src/lib/types/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, loadUser } = useAuth() as AuthContextType;
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      loadUser();
    }
  }, [isAuthenticated, loading, loadUser]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;