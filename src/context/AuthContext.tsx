'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  isManager: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isManager: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        isManager: session.user.isManager || false,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isManager: user?.isManager || false,
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
