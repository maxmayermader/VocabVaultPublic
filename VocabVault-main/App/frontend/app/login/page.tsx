// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { AuthContextType } from "@/src/lib/types/auth";
import Link from "next/link";
import { useTheme } from "next-themes";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth() as AuthContextType;
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-light dark:text-text-dark">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark placeholder-neutral-dark dark:placeholder-neutral-light text-text-light dark:text-text-dark rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-light dark:border-neutral-dark placeholder-neutral-dark dark:placeholder-neutral-light text-text-light dark:text-text-dark rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-primary text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="text-center">
            <Link
              href="/signup"
              className="font-medium text-secondary hover:text-secondary/80"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default LoginForm;
