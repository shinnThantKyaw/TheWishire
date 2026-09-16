"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { DecorationConfig } from "@/types/wish";

const ELEMENT_EMOJIS: Record<string, string[]> = {
  flowers: ["🌸", "🌸", "🌸", "🌸", "🌸"],
  sparkles: ["❤️", "❤️", "❤️", "❤️"],
  confetti: ["❤️", "🌸", "❤️", "🌸"],
  balloons: ["❤️", "❤️", "❤️", "❤️"],
  stars: ["❤️", "❤️", "❤️", "❤️"],
  hearts: ["❤️", "❤️", "❤️", "❤️", "❤️"],
};

const DENSITY_COUNT: Record<DecorationConfig["density"], number> = {
  light: 6,
  medium: 10,
  heavy: 16,
};

interface DecorationsProps {
  config: DecorationConfig;
}

/**
 * Decorations — floating decorative particles overlaid on the experience.
 *
 * Renders emoji particles that drift, float, and fade across the screen.
 * Non-interactive overlay that adds visual richness.
 */
export const Decorations = ({ config }: DecorationsProps) => {
  const particles = useMemo(() => {
    const count = DENSITY_COUNT[config.density];
    const allEmojis = config.elements.flatMap((el) => ELEMENT_EMOJIS[el] ?? []);

    return Array.from({ length: count }, (_, i) => {
      const emoji = allEmojis[i % allEmojis.length];
      const left = (i * 31 + 7) % 90;
      const delay = (i * 1.8) % 8;
      const duration = 12 + (i % 3) * 5;
      const size = 12 + (i % 3) * 3;

      return { id: i, emoji, left, delay, duration, size };
    });
  }, [config]);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
          }}
          initial={{ y: "105vh", opacity: 0 }}
          animate={{
            y: "-15vh",
            opacity: [0, 0.3, 0.4, 0.3, 0],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * 20, (p.id % 2 === 0 ? -1 : 1) * 10, 0],
            rotate: [0, p.id % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
};
