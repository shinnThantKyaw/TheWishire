"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { DecorationConfig } from "@/types/wish";

const ELEMENT_EMOJIS: Record<string, string[]> = {
  flowers: ["🌸", "🌺", "🌷", "🌻", "🌹"],
  sparkles: ["✨", "💫", "⭐", "🌟"],
  confetti: ["🎊", "🎉", "🎈", "🎀"],
  balloons: ["🎈", "🪅", "🎁"],
  stars: ["⭐", "🌟", "✨", "💫"],
  hearts: ["❤️", "💖", "💕", "💗", "💘"],
};

const DENSITY_COUNT: Record<DecorationConfig["density"], number> = {
  light: 10,
  medium: 18,
  heavy: 28,
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
      const left = (i * 37 + 13) % 95; // pseudo-random spread
      const delay = (i * 0.7) % 5;
      const duration = 6 + (i % 4) * 2;
      const size = 14 + (i % 3) * 4;

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
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0.7, 0.5, 0],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * 30, 0],
            rotate: [0, p.id % 2 === 0 ? 360 : -360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
};
