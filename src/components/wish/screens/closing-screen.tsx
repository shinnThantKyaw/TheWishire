"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

interface ClosingScreenProps {
  senderName: string;
  onRestart: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 10: Closing.
 * Thank you message + CTA buttons.
 */
export const ClosingScreen = ({
  senderName,
  onRestart,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: ClosingScreenProps) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 6 + Math.random() * 8,
        dur: 4 + Math.random() * 3,
        delay: Math.random() * 2,
        emoji: ["💜", "✨", "💫", "💕", "⭐"][i % 5],
      })),
    [],
  );

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ backgroundColor }}
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none fixed text-sm"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Heart */}
        <motion.div
          className="mb-6 text-5xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          💜
        </motion.div>

        {/* Thank you */}
        <h2
          className="text-xl font-bold leading-relaxed"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            color: foregroundColor,
          }}
        >
          Thank you for being
          <br />
          part of this special moment.
        </h2>

        {/* Branding */}
        <p className="mt-5 text-sm" style={{ color: foregroundColor, opacity: 0.45 }}>
          Made with love by{" "}
          <span className="font-bold" style={{ color: primaryColor }}>
            Wishire
          </span>
        </p>

        {/* Divider */}
        <div
          className="mx-auto my-7 h-px"
          style={{
            width: 50,
            background: `linear-gradient(90deg, transparent, ${primaryColor}30, transparent)`,
          }}
        />

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onRestart}
            className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              boxShadow: `0 4px 16px ${primaryColor}30`,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            ✨ Experience Again
          </motion.button>

          <motion.a
            href="/"
            className="rounded-full border px-8 py-3 text-sm font-semibold no-underline"
            style={{
              borderColor: `${primaryColor}30`,
              color: primaryColor,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            🎁 Create Your Own Wish
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};
