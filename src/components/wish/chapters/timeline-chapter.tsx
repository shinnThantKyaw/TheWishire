"use client";

import { motion } from "motion/react";
import type { MemoryTimelineEntry } from "@/types/wish";

interface TimelineChapterProps {
  entries: MemoryTimelineEntry[];
  primaryColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 8: Memory Timeline Chapter.
 * Vertical timeline with animated line drawing and staggered cards.
 */
export const TimelineChapter = ({
  entries,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
}: TimelineChapterProps) => {
  if (entries.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p style={{ color: foregroundColor, opacity: 0.4 }}>
          No memories yet
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-md">
        {/* Title */}
        <motion.h2
          className="mb-8 text-center text-xl font-bold"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            color: foregroundColor,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Our Journey Together 💕
        </motion.h2>

        {/* Timeline */}
        <div className="relative pl-8">
          {/* Animated line */}
          <motion.div
            className="absolute left-3 top-0 bottom-0 w-0.5"
            style={{
              background: `linear-gradient(180deg, ${primaryColor}, ${primaryColor}60, transparent)`,
            }}
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Cards */}
          <div className="space-y-6">
            {entries.map((entry, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              >
                {/* Dot */}
                <motion.div
                  className="absolute -left-5 top-2 h-3 w-3 rounded-full"
                  style={{
                    background: primaryColor,
                    boxShadow: `0 0 0 3px ${primaryColor}20`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3 + i * 0.2,
                    type: "spring",
                    stiffness: 300,
                  }}
                />

                {/* Card */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    border: `1px solid ${primaryColor}10`,
                  }}
                >
                  {/* Date badge */}
                  <span
                    className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `${primaryColor}10`,
                      color: primaryColor,
                    }}
                  >
                    {entry.date}
                  </span>

                  <h3
                    className="mt-1 text-sm font-bold"
                    style={{ color: foregroundColor }}
                  >
                    {entry.title}
                  </h3>

                  {entry.description && (
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{ color: foregroundColor, opacity: 0.6 }}
                    >
                      {entry.description}
                    </p>
                  )}

                  {entry.photoUrl && (
                    <img
                      src={entry.photoUrl}
                      alt={entry.title}
                      className="mt-2 h-32 w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
