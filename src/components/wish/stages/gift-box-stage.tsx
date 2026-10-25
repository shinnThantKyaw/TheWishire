"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StageContainer } from "../stage-container";
import { copy } from "@/config/copy";
import type { AnimationConfig } from "@/types/template";

interface GiftBoxStageProps {
  style?: string;
  animation?: AnimationConfig;
  onAdvance: () => void;
}

const CONFETTI_COLORS = ["#E91E63", "#F48FB1", "#FF80AB", "#FFD54F", "#69F0AE", "#40C4FF", "#B388FF"];

/**
 * GiftBoxStage — shows a wrapped gift box that the user taps to unwrap.
 *
 * Features a 3D-styled box with a ribbon, bow, and a satisfying
 * unwrap animation with confetti explosion.
 */
export const GiftBoxStage = ({
  animation,
  onAdvance,
}: GiftBoxStageProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleTap = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
      onAdvance();
    }, 1400);
  };

  return (
    <StageContainer animation={animation} className="flex-col gap-10 px-6">
      <AnimatePresence mode="wait">
        {!isOpened && (
          <motion.button
            key="gift-box"
            onClick={handleTap}
            className="group relative cursor-pointer focus:outline-none"
            whileHover={!isOpening ? { scale: 1.04, y: -6 } : undefined}
            whileTap={!isOpening ? { scale: 0.97 } : undefined}
            exit={{ opacity: 0, scale: 0.3, y: -80 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            aria-label={copy.stages.giftBox.aria}
          >
            <div className="relative h-64 w-56 sm:h-72 sm:w-64">
              {/* Box shadow */}
              <motion.div
                className="absolute -bottom-4 left-3 right-3 h-8 rounded-full bg-black/10 blur-lg"
                animate={isOpening ? { opacity: 0, scaleX: 0.3 } : {}}
                transition={{ duration: 0.5 }}
              />

              {/* Box body — 3D effect with front + side faces */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-44 rounded-b-2xl sm:h-52"
                style={{
                  background: "linear-gradient(180deg, #FF80AB 0%, #F06292 50%, #EC407A 100%)",
                  boxShadow: "0 8px 24px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -4px 12px rgba(0,0,0,0.1)",
                }}
                animate={isOpening ? { scaleY: 0.85, y: 15, opacity: 0.6 } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Box texture — subtle dots pattern */}
                <div
                  className="absolute inset-0 rounded-b-2xl opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                />
              </motion.div>

              {/* Box lid */}
              <motion.div
                className="absolute inset-x-[-6px] top-8 h-14 rounded-t-xl sm:top-4 sm:h-16"
                style={{
                  background: "linear-gradient(180deg, #F48FB1 0%, #EC407A 100%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
                animate={
                  isOpening
                    ? { y: -100, rotateZ: -12, opacity: 0, scale: 0.8 }
                    : {}
                }
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              />

              {/* Vertical ribbon */}
              <motion.div
                className="absolute bottom-0 left-1/2 h-44 w-5 -translate-x-1/2 rounded-full sm:h-52"
                style={{
                  background: "linear-gradient(90deg, #FFD54F 0%, #FFC107 50%, #FFB300 100%)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)",
                }}
                animate={isOpening ? { scaleX: 0, opacity: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.1 }}
              />

              {/* Horizontal ribbon */}
              <motion.div
                className="absolute left-0 right-0 h-5 rounded-full"
                style={{
                  top: "55%",
                  background: "linear-gradient(180deg, #FFD54F 0%, #FFC107 50%, #FFB300 100%)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)",
                }}
                animate={isOpening ? { scaleY: 0, opacity: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.15 }}
              />

              {/* Bow — two loops + center knot */}
              <motion.div
                className="absolute left-1/2 top-2 -translate-x-1/2 sm:top-0"
                animate={
                  isOpening
                    ? { y: -120, opacity: 0, scale: 0.4, rotate: 30 }
                    : {}
                }
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              >
                <div className="relative flex items-center gap-0.5">
                  {/* Left loop */}
                  <div
                    className="h-8 w-10 rounded-full sm:h-10 sm:w-12"
                    style={{
                      background: "linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)",
                      boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5)",
                      transform: "rotate(-15deg)",
                    }}
                  />
                  {/* Right loop */}
                  <div
                    className="h-8 w-10 rounded-full sm:h-10 sm:w-12"
                    style={{
                      background: "linear-gradient(225deg, #FFD54F 0%, #FFC107 100%)",
                      boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5)",
                      transform: "rotate(15deg)",
                    }}
                  />
                  {/* Center knot */}
                  <div
                    className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 40% 40%, #FFE082, #FFC107)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Confetti explosion */}
              {isOpening && (
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i / 24) * 360;
                    const distance = 80 + Math.random() * 120;
                    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
                    const size = 4 + Math.random() * 6;
                    const isCircle = i % 3 === 0;

                    return (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          width: size,
                          height: isCircle ? size : size * 2.5,
                          backgroundColor: color,
                          borderRadius: isCircle ? "50%" : "2px",
                        }}
                        initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                        animate={{
                          x: Math.cos((angle * Math.PI) / 180) * distance,
                          y: Math.sin((angle * Math.PI) / 180) * distance - 40,
                          opacity: [1, 1, 0],
                          rotate: Math.random() * 720 - 360,
                        }}
                        transition={{
                          duration: 1 + Math.random() * 0.5,
                          delay: 0.15 + i * 0.02,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hint */}
      {!isOpening && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--wish-primary, #E91E63)" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--wish-foreground, #1A1A2E)", opacity: 0.6 }}
          >
            {copy.stages.giftBox.tap}
          </p>
        </motion.div>
      )}
    </StageContainer>
  );
};
