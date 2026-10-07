"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HeartCrack, RefreshCw, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/**
 * Wish page error boundary (Next.js App Router segment boundary).
 *
 * Matches the wish experience visual language: soft pink ambience,
 * glass card with corner ticks, lucide icons only. Primary action
 * uses retry() (re-fetches + re-renders, Next 16.3); secondary offers
 * a full reload.
 */
export default function WishError({ error, retry }: ErrorProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    console.error("Wish page error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 px-4 py-10 dark:from-[#1a0a12] dark:via-[#120810] dark:to-[#0a0508]">
      {/* Ambient pink glow — works in both themes */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(233,30,99,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Floating hearts — romantic ambience */}
      {!reduceMotion &&
        Array.from({ length: 5 }).map((_, i) => {
          const left = 12 + ((i * 17) % 76);
          const size = 10 + (i % 3) * 4;
          const delay = i * 1.1;
          const duration = 9 + (i % 3) * 2;
          return (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute bottom-0"
              style={{ left: `${left}%`, color: "#E91E63" }}
              initial={{ y: "5vh", opacity: 0 }}
              animate={{ y: "-105vh", opacity: [0, 0.14, 0.14, 0] }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <HeartCrack size={size} fill="currentColor" />
            </motion.span>
          );
        })}

      {/* Glass card */}
      <motion.div
        className="relative w-full max-w-md rounded-[28px] border border-pink-500/25 bg-white/75 px-8 py-12 text-center shadow-[0_25px_50px_-12px_rgba(233,30,99,0.18)] backdrop-blur-xl dark:border-pink-400/20 dark:bg-white/10"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Corner ticks — pink ink, matches wish overlays */}
        {[
          { top: 14, left: 14, rotate: 0 },
          { top: 14, right: 14, rotate: 90 },
          { bottom: 14, right: 14, rotate: 180 },
          { bottom: 14, left: 14, rotate: 270 },
        ].map((pos, i) => (
          <svg
            key={i}
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 18 18"
            className="pointer-events-none absolute"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rotate}deg)`,
              opacity: 0.5,
            }}
          >
            <path
              d="M2 2 L2 8 M2 2 L8 2"
              stroke="#E91E63"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ))}

        {/* Icon medallion — gentle float */}
        <motion.div
          className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_0_30px_rgba(233,30,99,0.35),inset_0_2px_4px_rgba(255,255,255,0.3)]"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={
            reduceMotion
              ? { scale: 1, opacity: 1 }
              : { scale: 1, opacity: 1, y: [0, -6, 0] }
          }
          transition={
            reduceMotion
              ? { duration: 0.4 }
              : {
                  scale: { delay: 0.15, type: "spring", stiffness: 200, damping: 14 },
                  opacity: { delay: 0.15, duration: 0.4 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                }
          }
        >
          <HeartCrack className="h-9 w-9 text-white" aria-hidden />
        </motion.div>

        {/* Eyebrow — flanked rules */}
        <motion.div
          className="mb-4 flex items-center justify-center gap-3"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className="h-px w-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(233,30,99,0.6))",
            }}
          />
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
            A little hiccup
          </p>
          <span
            className="h-px w-8"
            style={{
              background:
                "linear-gradient(90deg, rgba(233,30,99,0.6), transparent)",
            }}
          />
        </motion.div>

        <h1
          className="text-2xl font-bold text-pink-950 dark:text-pink-50 sm:text-3xl"
          style={{
            fontFamily:
              "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
          }}
        >
          Something went wrong
        </h1>

        <p className="mx-auto mt-3 max-w-[36ch] text-sm leading-relaxed text-pink-800/70 dark:text-pink-200/70">
          We couldn&apos;t load this wish. It might have been removed or the
          link may be incorrect.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => retry()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/40 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#120810]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-pink-500/30 px-7 py-3 text-sm font-semibold text-pink-700 transition-all hover:bg-pink-500/10 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 dark:border-pink-400/30 dark:text-pink-200 dark:hover:bg-pink-400/10 dark:focus-visible:ring-offset-[#120810]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Reload page
          </button>
        </div>

        {/* Digest reference — matches server logs, subtle */}
        {error.digest && (
          <p className="mt-6 font-mono text-[0.65rem] tracking-wide text-pink-900/35 dark:text-pink-100/35">
            Reference: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
