"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { copy } from "@/config/copy";

interface RevealWrapperProps {
  children: React.ReactNode;
  hint?: string;
  delay?: number;
  primaryColor?: string;
}

/**
 * RevealWrapper — wraps a child element for tap-to-reveal interaction.
 *
 * The child starts hidden (opacity 0, slightly scaled) with a pulsing hint.
 * On tap, it reveals with a spring animation. Once revealed, stays visible.
 */
export const RevealWrapper = ({
  children,
  hint = copy.reveal.default,
  delay = 0,
  primaryColor = "#E91E63",
}: RevealWrapperProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="relative">
      {isRevealed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsRevealed(true)}
          className="w-full cursor-pointer text-left focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Ghost preview — blurred hint of the content */}
          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: 80 }}>
            <div className="blur-sm opacity-30">{children}</div>

            {/* Tap hint overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg"
                style={{ backgroundColor: primaryColor }}
                animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {hint}
              </motion.div>
            </div>
          </div>
        </motion.button>
      )}
    </div>
  );
};
