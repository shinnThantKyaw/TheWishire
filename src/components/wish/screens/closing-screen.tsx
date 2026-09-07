"use client";

import { motion } from "motion/react";

interface ClosingScreenProps {
  senderName: string;
  onRestart: () => void;
  primaryColor?: string;
}

/**
 * Screen 11: Closing.
 * Thank you message + "Experience Again" + "Create Your Own" buttons.
 *
 * In Phase 2.6, this will get:
 * - Warm gradient background with floating particles
 * - Staggered entrance animation
 * - Wishire branding
 * - Hover glow effects on buttons
 * - Music fade out
 */
export const ClosingScreen = ({
  senderName,
  onRestart,
  primaryColor = "#E91E63",
}: ClosingScreenProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Screen badge */}
        <div
          className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
        >
          Screen 11
        </div>

        {/* Thank you message */}
        <div className="mb-4 text-5xl">💜</div>

        <h2
          className="text-xl font-bold leading-relaxed"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          }}
        >
          Thank you for being
          <br />
          part of this special moment.
        </h2>

        {/* Branding */}
        <p className="mt-4 text-sm" style={{ opacity: 0.5 }}>
          Made with love by{" "}
          <span className="font-bold" style={{ color: primaryColor }}>
            Wishire
          </span>
        </p>

        {/* Divider */}
        <div
          className="mx-auto my-6 h-px w-16"
          style={{ backgroundColor: `${primaryColor}30` }}
        />

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onRestart}
            className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              boxShadow: `0 4px 16px ${primaryColor}40`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✨ Experience Again
          </motion.button>

          <motion.a
            href="/"
            className="rounded-full border px-6 py-3 text-sm font-semibold no-underline"
            style={{
              borderColor: `${primaryColor}40`,
              color: primaryColor,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎁 Create Your Own Wish
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};
