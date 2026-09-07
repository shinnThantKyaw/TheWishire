"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WishError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Wish page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pink-50 px-6 dark:bg-pink-950/20">
      <div className="text-center">
        <p className="text-5xl">🎈</p>
        <h1 className="mt-6 text-2xl font-bold text-pink-900 dark:text-pink-100">
          Oops! Something went wrong
        </h1>
        <p className="mt-3 text-pink-600/80 dark:text-pink-400/80">
          We couldn&apos;t load this wish. It might have been removed or the
          link may be incorrect.
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-full bg-pink-600 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-pink-700 hover:shadow-lg active:scale-95"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
