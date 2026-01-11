'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, initializeAuth } from '@/lib/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for Zustand to rehydrate from localStorage
    if (hasHydrated) {
      // Ensure token is synced with API client
      initializeAuth();
      setIsReady(true);
    }
  }, [hasHydrated]);

  // Show loading spinner until hydration is complete
  // This prevents API calls from happening before the token is set
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C1C1C]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
