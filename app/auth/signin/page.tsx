'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error signing in:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Sign in to <span className="text-blue-600 dark:text-blue-400">Stock News Analyzer</span>
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Use your Google account to access real-time stock sentiment.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="text-2xl" />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </main>
  );
}
