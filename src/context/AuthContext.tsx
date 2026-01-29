'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { storage, generateId } from '@/lib/storage';

// Mock user for testing (auth disabled)
const MOCK_USER: User = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  image: undefined,
  isManager: true,
  createdAt: new Date().toISOString(),
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isManager: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initUser() {
      // Store mock user in localStorage
      const existingUser = await storage.users.getByEmail(MOCK_USER.email);
      if (!existingUser) {
        await storage.users.create(MOCK_USER);
      }
      setIsLoading(false);
    }

    initUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: MOCK_USER,
        isLoading,
        isManager: MOCK_USER.isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
