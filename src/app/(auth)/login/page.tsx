'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Auth disabled for testing - redirect to dashboard
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Project Tracker
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
