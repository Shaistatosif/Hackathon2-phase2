/**
 * Authentication hook for components
 */
'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    refreshAuth,
  } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      await storeLogin(email, password);
      router.push('/dashboard');
    },
    [storeLogin, router]
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      await storeRegister(email, password, name);
      router.push('/dashboard');
    },
    [storeRegister, router]
  );

  const logout = useCallback(() => {
    storeLogout();
    router.push('/login');
  }, [storeLogout, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };
}

/**
 * Hook to protect routes - redirects to login if not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useRedirectAuthenticated() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
