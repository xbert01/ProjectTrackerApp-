'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    );
  }

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
    >
      Sign in
    </button>
  );
}
