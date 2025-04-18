'use client';

import Link from 'next/link';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  console.error(error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Something went wrong. Please try again later.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
