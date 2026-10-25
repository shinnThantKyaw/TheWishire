"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StageContainer } from "../stage-container";
import { copy, interpolate } from "@/config/copy";
import type { AnimationConfig } from "@/types/template";

interface CakeStageProps {
  animation?: AnimationConfig;
  onAdvance: () => void;
}

const CANDLE_COUNT = 5;

/**
 * CakeStage — shows a beautiful birthday cake with glowing candles.
 *
 * Tap each candle individually to blow it out.
 * After all 5 are out, a celebration message appears.
 */
export const CakeStage = ({
  animation,
  onAdvance,
}: CakeStageProps) => {
  const [blownCandles, setBlownCandles] = useState<Set<number>>(() => new Set());
  const [allBlown, setAllBlown] = useState(false);

  const handleTapCandle = useCallback(
    (index: number) => {
      if (allBlown || blownCandles.has(index)) return;

      const next = new Set(blownCandles);
      next.add(index);
      setBlownCandles(next);

      // If this was the last candle, show celebration then advance
      if (next.size === CANDLE_COUNT) {
        setTimeout(() => {
          setAllBlown(true);
          setTimeout(onAdvance, 1400);
        }, 500);
      }
    },
    [allBlown, blownCandles, onAdvance],
  );

  return (
    <StageContainer animation={animation} className="flex-col gap-8 px-6">
      <div className="relative h-72 w-56 sm:h-80 sm:w-64">
        {/* Cake shadow */}
        <div className="absolute -bottom-4 left-2 right-2 h-6 rounded-full bg-black/8 blur-md" />

        {/* Cake base — bottom tier */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 rounded-b-3xl"
          style={{
            background: "linear-gradient(180deg, #EC407A 0%, #D81B60 100%)",
            boxShadow: "0 6px 20px rgba(216, 27, 96, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <svg className="absolute -top-3 left-0 w-full" viewBox="0 0 200 16" preserveAspectRatio="none">
            <path d="M0,8 Q10,16 20,8 Q30,0 40,8 Q50,16 60,8 Q70,0 80,8 Q90,16 100,8 Q110,0 120,8 Q130,16 140,8 Q150,0 160,8 Q170,16 180,8 Q190,0 200,8 L200,0 L0,0 Z"
              fill="#FFE0EC" />
          </svg>
        </div>

        {/* Middle tier */}
        <div
          className="absolute inset-x-4 bottom-24 h-16 rounded-t-lg"
          style={{
            background: "linear-gradient(180deg, #F48FB1 0%, #F06292 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          <svg className="absolute -top-3 left-0 w-full" viewBox="0 0 168 16" preserveAspectRatio="none">
            <path d="M0,8 Q8,16 16,8 Q24,0 32,8 Q40,16 48,8 Q56,0 64,8 Q72,16 80,8 Q88,0 96,8 Q104,16 112,8 Q120,0 128,8 Q136,16 144,8 Q152,0 160,8 L168,8 L168,0 L0,0 Z"
              fill="#FFE0EC" />
          </svg>
        </div>

        {/* Top tier */}
        <div
          className="absolute inset-x-8 bottom-40 h-12 rounded-t-lg"
          style={{
            background: "linear-gradient(180deg, #FF80AB 0%, #FF4081 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          <svg className="absolute -top-3 left-0 w-full" viewBox="0 0 136 16" preserveAspectRatio="none">
            <path d="M0,8 Q7,16 13,8 Q20,0 27,8 Q34,16 41,8 Q48,0 55,8 Q62,16 69,8 Q76,0 83,8 Q90,16 97,8 Q104,0 111,8 Q118,16 125,8 Q132,0 136,8 L136,0 L0,0 Z"
              fill="#FFE0EC" />
          </svg>
        </div>

        {/* Plate */}
        <div
          className="absolute inset-x-[-12px] bottom-[-6px] h-4 rounded-full"
          style={{
            background: "linear-gradient(180deg, #F5F5F5, #E0E0E0)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />

        {/* Candles — each is a separate tappable button */}
        <div className="absolute inset-x-8 bottom-52 flex justify-around sm:inset-x-10">
          {Array.from({ length: CANDLE_COUNT }).map((_, i) => {
            const isBlown = blownCandles.has(i);

            return (
              <motion.button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTapCandle(i);
                }}
                className="relative flex cursor-pointer flex-col items-center focus:outline-none"
                whileHover={!isBlown && !allBlown ? { scale: 1.15, y: -4 } : undefined}
                whileTap={!isBlown && !allBlown ? { scale: 0.9 } : undefined}
                aria-label={
                  isBlown
                    ? interpolate(copy.stages.cake.candleBlownAria, { n: i + 1 })
                    : interpolate(copy.stages.cake.candleBlowAria, { n: i + 1 })
                }
              >
                {/* Flame */}
                <AnimatePresence>
                  {!isBlown && (
                    <motion.div
                      className="relative mb-0.5"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 2.5,
                        y: -20,
                        filter: "blur(4px)",
                        transition: { duration: 0.35, ease: "easeOut" },
                      }}
                    >
                      {/* Outer glow */}
                      <motion.div
                        className="absolute -inset-2 rounded-full"
                        style={{
                          background: "radial-gradient(circle, rgba(255,193,7,0.4) 0%, transparent 70%)",
                        }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5 + i * 0.2, repeat: Infinity }}
                      />
                      {/* Flame body */}
                      <motion.div
                        className="relative h-5 w-3 rounded-full"
                        style={{
                          background: "linear-gradient(0deg, #FF6F00 0%, #FFC107 40%, #FFF9C4 100%)",
                          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                          boxShadow: "0 0 8px rgba(255,152,0,0.6)",
                        }}
                        animate={{
                          scaleY: [1, 1.15, 0.95, 1.1, 1],
                          scaleX: [1, 0.9, 1.05, 0.95, 1],
                          y: [0, -1, 1, -0.5, 0],
                        }}
                        transition={{
                          duration: 1.2 + i * 0.15,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Candle stick */}
                <div
                  className="h-7 w-2 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, ${
                      i % 2 === 0 ? "#FF80AB, #EC407A" : "#F48FB1, #F06292"
                    })`,
                    boxShadow: "inset 1px 0 2px rgba(255,255,255,0.3)",
                  }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Spark particles when a candle blows out */}
        {Array.from(blownCandles).map((candleIndex) => (
          <div key={`sparks-${candleIndex}`} className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, j) => (
              <motion.div
                key={j}
                className="absolute"
                style={{
                  left: `${15 + candleIndex * (70 / CANDLE_COUNT)}%`,
                  top: "33%",
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 70,
                  y: -10 - Math.random() * 50,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.2,
                  delay: j * 0.03,
                  ease: "easeOut",
                }}
              >
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: ["#FFC107", "#FF9800", "#FFEB3B", "#FFF176"][j % 4],
                    boxShadow: "0 0 4px rgba(255,193,7,0.8)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        {!allBlown ? (
          <motion.div
            key="wish"
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="text-2xl font-bold"
              style={{
                color: "var(--wish-foreground, #1A1A2E)",
                fontFamily: "var(--wish-font-heading), Georgia, serif",
              }}
            >
              {copy.stages.cake.makeWish}
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--wish-foreground, #1A1A2E)", opacity: 0.5 }}
            >
              Tap each candle to blow them out ({CANDLE_COUNT - blownCandles.size} left)
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="celebrate"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <p
              className="text-3xl font-bold"
              style={{
                color: "var(--wish-foreground, #1A1A2E)",
                fontFamily: "var(--wish-font-heading), Georgia, serif",
              }}
            >
              {copy.stages.cake.happyBirthday}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </StageContainer>
  );
};
