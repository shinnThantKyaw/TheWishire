"use client";

import { motion } from "motion/react";
import { StageContainer } from "../stage-container";
import { copy } from "@/config/copy";
import type { AnimationConfig } from "@/types/template";

interface ClosingStageProps {
  senderName: string;
  style?: string;
  animation?: AnimationConfig;
}

/**
 * ClosingStage — the warm final screen of the experience.
 *
 * Features a radial glow effect, floating heart particles,
 * and a heartfelt closing message with the sender's name.
 */
export const ClosingStage = ({
  senderName,
  style = "warm-wishes",
  animation,
}: ClosingStageProps) => {
  return (
    <StageContainer animation={animation} className="flex-col gap-6 px-6">
      {/* Radial glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(233,30,99,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Floating hearts / sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => {
          const symbols = ["❤️", "💖", "✨", "💕", "⭐", "💗"];
          const symbol = symbols[i % symbols.length];
          const left = 5 + (i * 8) % 90;
          const delay = i * 0.5;
          const duration = 5 + (i % 3) * 1.5;

          return (
            <motion.div
              key={i}
              className="absolute text-lg sm:text-xl"
              style={{ left: `${left}%` }}
              initial={{ y: "110vh", opacity: 0, scale: 0.5 }}
              animate={{
                y: "-10vh",
                opacity: [0, 0.5, 0.6, 0.4, 0],
                scale: [0.5, 0.8, 1, 0.9, 0.6],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeOut",
              }}
            >
              {symbol}
            </motion.div>
          );
        })}
      </div>

      {/* Main message */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
      >
        <motion.p
          className="text-4xl font-bold sm:text-5xl"
          style={{
            color: "var(--wish-foreground, #1A1A2E)",
            fontFamily: "var(--wish-font-heading), Georgia, serif",
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {copy.stages.closing.withLove}
        </motion.p>
      </motion.div>

      {/* Sender attribution */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-pink-300" />
          <p
            className="text-lg"
            style={{ color: "var(--wish-foreground, #1A1A2E)", opacity: 0.7 }}
          >
            Made with love by{" "}
            <span className="font-semibold" style={{ opacity: 1 }}>
              {senderName}
            </span>
          </p>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-pink-300" />
        </div>
      </motion.div>

      {/* Wishire branding */}
      <motion.div
        className="relative z-10 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-xs tracking-widest uppercase text-pink-400/50">
          ✨ Wishire ✨
        </p>
      </motion.div>
    </StageContainer>
  );
};
