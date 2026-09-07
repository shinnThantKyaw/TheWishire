"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface GiftOpeningScreenProps {
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 4: Gift Opening.
 * THE peak moment — confetti burst, materials fly out.
 */
export const GiftOpeningScreen = ({
  onNext,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: GiftOpeningScreenProps) => {
  const hasTriggered = useRef(false);

  // Fire confetti on mount
  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    const fire = async () => {
      const confetti = (await import("canvas-confetti")).default;

      // Multi-layered burst
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 100,
      };

      confetti({ ...defaults, particleCount: 80, origin: { x: 0.5, y: 0.5 } });

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: 0.3, y: 0.5 },
          colors: [primaryColor, secondaryColor, "#FF80AB", "#FFB74D"],
        });
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: 0.7, y: 0.5 },
          colors: [primaryColor, secondaryColor, "#CE93D8", "#81D4FA"],
        });
      }, 200);

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 40,
          origin: { x: 0.5, y: 0.3 },
          gravity: 0.8,
          scalar: 1.2,
        });
      }, 400);
    };

    fire();

    // Auto-advance after celebration
    const timer = setTimeout(onNext, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Materials that fly out
  const materials = [
    { emoji: "💌", label: "Letter", delay: 0.3 },
    { emoji: "📷", label: "Photos", delay: 0.45 },
    { emoji: "📖", label: "Poem", delay: 0.6 },
    { emoji: "⏰", label: "Memories", delay: 0.75 },
    { emoji: "🎁", label: "Gift", delay: 0.9 },
  ];

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12"
      style={{ backgroundColor }}
    >
      {/* Celebration glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${primaryColor}15 0%, transparent 60%)`,
        }}
      />

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Opening text */}
        <motion.h1
          className="mb-2 text-3xl font-bold"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          Your Surprise! 🎉
        </motion.h1>

        <motion.p
          className="mb-10 text-sm"
          style={{ color: foregroundColor, opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          Something special is waiting for you...
        </motion.p>

        {/* Materials flying out */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {materials.map((mat, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 60, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: mat.delay,
              }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  boxShadow: `0 4px 16px ${primaryColor}15, 0 1px 4px rgba(0,0,0,0.05)`,
                  border: `1px solid ${primaryColor}10`,
                }}
              >
                {mat.emoji}
              </div>
              <span
                className="mt-1.5 text-xs font-medium"
                style={{ color: foregroundColor, opacity: 0.4 }}
              >
                {mat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
