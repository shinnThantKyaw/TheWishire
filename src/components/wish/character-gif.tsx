"use client";

import { motion } from "motion/react";
import type { CharacterGifConfig } from "@/types/wish";

const positionClasses: Record<CharacterGifConfig["position"], string> = {
  "bottom-left": "bottom-20 left-4 sm:left-8",
  "bottom-right": "bottom-20 right-4 sm:right-8",
  "center-bottom": "bottom-20 left-1/2 -translate-x-1/2",
};

/**
 * CharacterGif — displays an animated character GIF as a floating overlay.
 *
 * The character gently sways/bounces to add life to the experience.
 * Non-interactive (pointer-events-none) so it doesn't block user taps.
 */
export const CharacterGif = ({ src, position, alt = "Character" }: CharacterGifConfig) => {
  return (
    <motion.div
      className={`pointer-events-none fixed z-30 ${positionClasses[position]}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="h-28 w-28 object-contain sm:h-36 sm:w-36"
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
        }}
        animate={{
          y: [0, -8, 0, -4, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
