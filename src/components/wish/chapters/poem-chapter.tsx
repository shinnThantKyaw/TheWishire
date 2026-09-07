"use client";

import { motion } from "motion/react";
import type { PoemSelection } from "@/types/wish";

interface PoemChapterProps {
  poem?: PoemSelection;
  primaryColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 7: Poem Chapter.
 * Beautiful typography with line-by-line reveal.
 */
export const PoemChapter = ({
  poem,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
}: PoemChapterProps) => {
  if (!poem) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p style={{ color: foregroundColor, opacity: 0.4 }}>No poem yet</p>
      </div>
    );
  }

  const lines = poem.text.split("\n").filter((l) => l.trim());

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        {/* Opening quote mark */}
        <motion.div
          className="mb-4 text-5xl leading-none"
          style={{
            fontFamily: "Georgia, serif",
            color: primaryColor,
            opacity: 0.2,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.2 }}
        >
          &ldquo;
        </motion.div>

        {/* Poem lines */}
        <div className="space-y-1">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              className="text-base leading-loose"
              style={{
                fontFamily: "var(--wish-font-heading), Playfair Display, serif",
                fontStyle: "italic",
                color: foregroundColor,
                opacity: 0.85,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="mx-auto my-6 h-px"
          style={{
            width: 40,
            background: `linear-gradient(90deg, transparent, ${primaryColor}40, transparent)`,
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4 + lines.length * 0.15 + 0.2 }}
        />

        {/* Title + Author */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + lines.length * 0.15 + 0.3 }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: primaryColor, opacity: 0.7 }}
          >
            {poem.title}
          </p>
          {poem.author && (
            <p
              className="mt-1 text-xs italic"
              style={{ color: foregroundColor, opacity: 0.4 }}
            >
              — {poem.author}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
