"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LetterChapterProps {
  letter?: string;
  photos: { id: string; url: string; type: "photo" }[];
  primaryColor?: string;
  foregroundColor?: string;
}

/**
 * LetterChapter — Chapter 1 of 5: "The Letter"
 *
 * A realistic envelope with a wax seal sits centered on screen.
 * Tap the envelope → flap flips open with a 3D rotation, the letter paper
 * slides upward and unfolds for reading.
 * "Fold back" tucks the letter back in and reseals.
 * The bottom nav (Back / Next) from ClickThrough handles advancement.
 */
export const LetterChapter = ({
  letter,
  photos,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
}: LetterChapterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
    // Allow time for spring animation to settle
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  if (!letter) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p style={{ color: foregroundColor, opacity: 0.4 }}>No letter yet</p>
      </div>
    );
  }

  const letterLines = letter.split("\n").filter((line) => line.trim());

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* ── Envelope container ────────────────────── */}
      <div className="relative w-full max-w-xs sm:max-w-sm">
        {/* ── Envelope wrapper with perspective ── */}
        <div
          className="relative mx-auto"
          style={{ perspective: 800, width: 280, height: 200 }}
        >
          {/* Tap target for closed state */}
          {!isOpen && (
            <button
              onClick={handleToggle}
              className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent p-0"
              style={{ width: 280, height: 200 }}
              aria-label="Open envelope"
            />
          )}

          {/* ── Shadow beneath envelope ── */}
          <motion.div
            className="absolute -bottom-3 left-5 right-5 h-4 rounded-full"
            style={{
              background: `radial-gradient(ellipse, ${foregroundColor}12, transparent 70%)`,
              filter: "blur(6px)",
            }}
            animate={
              isOpen
                ? { scaleX: 1.08, opacity: 0.5 }
                : { scaleX: 1, opacity: 1 }
            }
          />

          {/* ── Envelope back (body) ── */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl"
            style={{
              boxShadow: `0 6px 28px ${primaryColor}12, 0 2px 8px rgba(0,0,0,0.05)`,
            }}
          >
            {/* Paper texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Warm cream background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, #FDF6F0 0%, #F8EDE5 30%, #F3E4DA 60%, #EDDBD0 100%)",
              }}
            />
            {/* Inner border */}
            <div
              className="absolute inset-[3px] rounded-[9px]"
              style={{ border: `1px solid ${primaryColor}0d` }}
            />
          </div>

          {/* ── Diagonal crease lines ── */}
          <svg
            className="pointer-events-none absolute inset-0 z-[1]"
            viewBox="0 0 280 200"
            fill="none"
          >
            <line
              x1="0" y1="0" x2="140" y2="115"
              stroke={primaryColor}
              strokeWidth="0.5"
              opacity="0.07"
            />
            <line
              x1="280" y1="0" x2="140" y2="115"
              stroke={primaryColor}
              strokeWidth="0.5"
              opacity="0.07"
            />
          </svg>

          {/* ── Letter paper (inside envelope) ── */}
          <motion.div
            className="absolute left-3 right-3 z-[2] overflow-hidden rounded-lg"
            style={{
              top: 12,
              background:
                "linear-gradient(180deg, #FFFEFB 0%, #FFF9F2 40%, #FFF5EB 100%)",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.03)",
              transformOrigin: "bottom center",
            }}
            animate={{
              height: isOpen ? 190 : 115,
              top: isOpen ? -168 : 12,
            }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 17,
              mass: 0.8,
            }}
          >
            {/* Fold crease line (visible when closed) */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  className="absolute inset-x-0 z-10"
                  style={{ top: "55%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="h-px w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent 8%, ${primaryColor}0d 25%, ${primaryColor}10 50%, ${primaryColor}0d 75%, transparent 92%)`,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Letter content ── */}
            <div className="relative px-4 pt-3 pb-2 sm:px-5">
              {/* Flourish divider */}
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <div
                  className="h-px flex-1 max-w-[28px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${primaryColor}20)`,
                  }}
                />
                <span
                  style={{ color: primaryColor, opacity: 0.3, fontSize: 8 }}
                >
                  ✦
                </span>
                <div
                  className="h-px flex-1 max-w-[28px]"
                  style={{
                    background: `linear-gradient(90deg, ${primaryColor}20, transparent)`,
                  }}
                />
              </div>

              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                  >
                    {letterLines.map((line, i) => (
                      <motion.p
                        key={i}
                        className="text-center leading-relaxed"
                        style={{
                          color: "#4A3728",
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.25 + i * 0.05,
                          duration: 0.35,
                        }}
                      >
                        <span className="text-[10.5px] sm:text-[11px]">
                          {line || " "}
                        </span>
                      </motion.p>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Preview: "Dear …" + a few faint lines */}
                    <p
                      className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em]"
                      style={{
                        color: primaryColor,
                        opacity: 0.5,
                        fontFamily: "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      A letter for you
                    </p>
                    {[85, 68, 90, 50, 75].map((w, i) => (
                      <div
                        key={i}
                        className="mx-auto mb-1.5 h-[1.5px] rounded-full"
                        style={{
                          width: `${w}%`,
                          background: `linear-gradient(90deg, ${primaryColor}06, ${primaryColor}10, ${primaryColor}06)`,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Envelope flap (triangle) ── */}
          <motion.div
            className="absolute inset-x-0 top-0 z-[5] origin-top"
            animate={
              isOpen
                ? { rotateX: 180, opacity: 0 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <svg
              viewBox="0 0 280 88"
              className="w-full"
              style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.06))" }}
            >
              <defs>
                <linearGradient id="lcFlapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5E6DC" />
                  <stop offset="45%" stopColor="#F0DDD0" />
                  <stop offset="100%" stopColor="#EBD5C6" />
                </linearGradient>
              </defs>
              <polygon
                points="0,0 140,83 280,0"
                fill="url(#lcFlapGrad)"
              />
              {/* Highlight edges */}
              <line
                x1="8" y1="2" x2="140" y2="80"
                stroke="white" strokeWidth="0.5" opacity="0.35"
              />
              <line
                x1="272" y1="2" x2="140" y2="80"
                stroke="white" strokeWidth="0.5" opacity="0.25"
              />
            </svg>
          </motion.div>

          {/* ── Wax seal ── */}
          <motion.div
            className="absolute left-1/2 top-[20px] z-[6] -translate-x-1/2"
            animate={
              isOpen
                ? { scale: 1.15, opacity: 0, rotate: 12, y: -8 }
                : { scale: 1, opacity: 1, rotate: 0, y: 0 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${primaryColor}bb)`,
                boxShadow: `0 3px 10px ${primaryColor}35, inset 0 2px 3px rgba(255,255,255,0.25), inset 0 -2px 3px rgba(0,0,0,0.12)`,
              }}
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 24 22"
                fill="none"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          </motion.div>

          {/* ── Envelope front face (bottom V) ── */}
          <div
            className="absolute inset-x-0 bottom-0 z-[3] overflow-hidden"
            style={{ height: "55%", borderRadius: "0 0 12px 12px" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
              }}
            />
            {/* Left triangle */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 280 110"
            >
              <polygon points="0,0 140,110 0,110" fill="white" opacity="0.3" />
            </svg>
            {/* Right triangle */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 280 110"
            >
              <polygon
                points="280,0 140,110 280,110"
                fill="white"
                opacity="0.2"
              />
            </svg>
            {/* Top edge highlight */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${primaryColor}0f, transparent)`,
              }}
            />
          </div>
        </div>

        {/* ── Tap hint / Fold button ── */}
        <div className="mt-5 flex justify-center">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.button
                key="open"
                onClick={handleToggle}
                className="flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-medium backdrop-blur-sm"
                style={{
                  borderColor: `${primaryColor}25`,
                  color: primaryColor,
                  background: `rgba(255,255,255,0.5)`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Open the letter
              </motion.button>
            ) : (
              <motion.button
                key="close"
                onClick={handleToggle}
                className="flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-medium backdrop-blur-sm"
                style={{
                  borderColor: `${primaryColor}20`,
                  color: `${primaryColor}99`,
                  background: `rgba(255,255,255,0.4)`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Fold back
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Photos below letter ── */}
      {photos.length > 0 && (
        <motion.div
          className="mt-8 grid w-full max-w-sm grid-cols-2 gap-2 px-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {photos.slice(0, 4).map((photo) => (
            <div
              key={photo.id}
              className="aspect-square overflow-hidden rounded-xl"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt="Memory"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
