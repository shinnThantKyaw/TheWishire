"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface GiftRevealScreenProps {
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 3: Gift Reveal.
 * Premium 3D gift box with idle animation. Tap to open.
 */
export const GiftRevealScreen = ({
  onNext,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: GiftRevealScreenProps) => {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onNext, 1400);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12"
      style={{ backgroundColor }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${primaryColor}10 0%, transparent 60%)`,
        }}
      />

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="mb-8 text-sm"
          style={{ color: foregroundColor, opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          Something special awaits...
        </motion.p>

        {/* ── 3D Gift Box ───────────────────────── */}
        <motion.button
          onClick={handleOpen}
          className="relative mx-auto cursor-pointer border-0 bg-transparent p-0"
          whileHover={!opening ? { scale: 1.05 } : {}}
          whileTap={!opening ? { scale: 0.95 } : {}}
          aria-label="Open the gift"
        >
          <motion.div
            animate={
              opening
                ? { rotateX: -20, y: 10 }
                : { y: [0, -6, 0] }
            }
            transition={
              opening
                ? { duration: 0.4 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
            style={{ perspective: 400, transformStyle: "preserve-3d" }}
          >
            {/* Lid */}
            <motion.div
              className="relative mx-auto rounded-t-xl"
              style={{
                width: 160,
                height: 28,
                background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 -2px 8px ${primaryColor}15`,
                transformOrigin: "bottom center",
              }}
              animate={
                opening
                  ? { rotateX: -60, y: -30, opacity: 0 }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Lid shine */}
              <div
                className="absolute inset-0 rounded-t-xl"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.2), transparent)",
                }}
              />
            </motion.div>

            {/* Body */}
            <div
              className="relative rounded-b-xl"
              style={{
                width: 160,
                height: 110,
                background: `linear-gradient(180deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}bb)`,
                boxShadow: `0 8px 24px ${primaryColor}30, inset 0 1px 0 rgba(255,255,255,0.15)`,
              }}
            >
              {/* Vertical ribbon */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  width: 16,
                  height: "100%",
                  background: `linear-gradient(180deg, ${secondaryColor}80, ${secondaryColor}60)`,
                  boxShadow: "inset 0 0 4px rgba(0,0,0,0.1)",
                }}
              />
              {/* Horizontal ribbon */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2"
                style={{
                  width: "100%",
                  height: 14,
                  background: `linear-gradient(90deg, ${secondaryColor}60, ${secondaryColor}80, ${secondaryColor}60)`,
                  boxShadow: "inset 0 0 4px rgba(0,0,0,0.08)",
                }}
              />
            </div>

            {/* Bow on top */}
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={
                opening
                  ? { y: -40, opacity: 0, rotate: 30, scale: 0.4 }
                  : {}
              }
              transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
            >
              <div className="relative">
                <div
                  className="absolute -left-3 top-0 h-4 w-5 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor}, ${secondaryColor}cc)`,
                    transform: "rotate(-20deg)",
                  }}
                />
                <div
                  className="absolute -right-3 top-0 h-4 w-5 rounded-full"
                  style={{
                    background: `linear-gradient(225deg, ${secondaryColor}, ${secondaryColor}cc)`,
                    transform: "rotate(20deg)",
                  }}
                />
                <div
                  className="relative z-10 mx-auto h-3.5 w-3.5 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${secondaryColor}, ${secondaryColor}aa)`,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.button>

        {/* Tap prompt */}
        <AnimatePresence>
          {!opening && (
            <motion.p
              className="mt-8 text-sm font-medium"
              style={{ color: primaryColor, opacity: 0.7 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Tap to open 💝
              </motion.span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Opening celebration */}
        <AnimatePresence>
          {opening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <p className="text-lg font-bold" style={{ color: primaryColor }}>
                🎉
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
