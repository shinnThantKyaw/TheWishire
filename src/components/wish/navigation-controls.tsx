"use client";

import { motion } from "motion/react";

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  primaryColor: string;
}

/**
 * NavigationControls — prev/next buttons for the "buttons" flow mode.
 *
 * Fixed at the bottom of the screen with a clean, minimal design.
 * Shows a progress bar between the buttons.
 */
export const NavigationControls = ({
  onPrev,
  onNext,
  isFirst,
  isLast,
  primaryColor,
}: NavigationControlsProps) => {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(255,255,255,0.8)",
        borderTop: "1px solid rgba(0,0,0,0.05)",
      }}
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Prev button */}
      <motion.button
        onClick={onPrev}
        disabled={isFirst}
        className="flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all disabled:opacity-30"
        style={{
          border: `1.5px solid ${primaryColor}40`,
          color: primaryColor,
        }}
        whileHover={!isFirst ? { scale: 1.05 } : undefined}
        whileTap={!isFirst ? { scale: 0.95 } : undefined}
      >
        <span className="text-base">←</span>
        Back
      </motion.button>

      {/* Next / Continue button */}
      <motion.button
        onClick={onNext}
        className="flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-md"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLast ? "Finish 🎉" : "Next"}
        {!isLast && <span className="text-base">→</span>}
      </motion.button>
    </motion.div>
  );
};
