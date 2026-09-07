export default function WishLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pink-50 dark:bg-pink-950/20">
      {/* Animated envelope */}
      <div className="relative mb-8">
        <div className="h-24 w-32 animate-bounce rounded-lg border-2 border-pink-300 bg-white shadow-lg dark:border-pink-700 dark:bg-pink-900/50">
          <div className="mx-auto mt-2 h-0 w-0 border-l-[64px] border-r-[64px] border-t-[40px] border-l-transparent border-r-transparent border-t-pink-200 dark:border-t-pink-800" />
        </div>
      </div>

      {/* Loading text */}
      <p className="animate-pulse text-lg font-medium text-pink-600 dark:text-pink-400">
        Unwrapping your surprise...
      </p>

      {/* Progress dots */}
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 animate-pulse rounded-full bg-pink-400 dark:bg-pink-500"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
