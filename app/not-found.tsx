// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-6 py-12">
      <div className="text-center animate-fadeIn">
        <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300"
        >
          Go Back Home
        </Link>
      </div>

      <div className="mt-16 opacity-80">
        <img
          src="/404-illustration.svg"
          alt="Page not found"
          className="w-72 md:w-96"
        />
      </div>
    </div>
  );
}
