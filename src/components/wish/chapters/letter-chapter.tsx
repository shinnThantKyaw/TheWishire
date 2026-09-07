"use client";

import { motion } from "motion/react";

interface LetterChapterProps {
  letter?: string;
  photos: { id: string; url: string; type: "photo" }[];
  primaryColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 5: Letter Chapter.
 * Paper-textured card with letter text and optional photos.
 */
export const LetterChapter = ({
  letter,
  photos,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
}: LetterChapterProps) => {
  if (!letter) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p style={{ color: foregroundColor, opacity: 0.4 }}>No letter yet</p>
      </div>
    );
  }

  const paragraphs = letter.split("\n").filter((p) => p.trim());

  return (
    <div className="min-h-screen px-4 py-16">
      <motion.div
        className="mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Paper card */}
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8"
          style={{
            background: "linear-gradient(135deg, #fdf6e3, #faf0e2, #f5e6c8)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          {/* Paper texture lines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                transparent,
                transparent 31px,
                rgba(0,0,0,0.03) 31px,
                rgba(0,0,0,0.03) 32px
              )`,
            }}
          />

          {/* Seal */}
          <motion.div
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-sm"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${primaryColor}bb)`,
              boxShadow: `0 2px 8px ${primaryColor}30`,
              color: "white",
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            💌
          </motion.div>

          {/* Letter text */}
          <div className="relative z-10">
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                className="mb-3 text-sm leading-relaxed"
                style={{
                  color: "#3e2723",
                  fontFamily: "var(--wish-font-body), Inter, sans-serif",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Photos below letter */}
        {photos.length > 0 && (
          <motion.div
            className="mt-6 grid grid-cols-2 gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {photos.slice(0, 4).map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-xl"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
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
      </motion.div>
    </div>
  );
};
