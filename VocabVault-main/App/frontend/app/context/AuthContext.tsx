'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useRouter } from 'next/navigation';
import { User, AuthContextType } from '@/src/lib/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_URL,
  withCredentials: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const router = useRouter();

  const loadUser = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get('/api/auth/user');
      if (res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/api/auth/login', { username, password });
      if (res.data.success) {
        await loadUser();
        router.push('/');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      setError('Authentication failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/api/auth/register', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      if (res.data.success) {
        return true;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setError('Registration failed');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    loadUser,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};