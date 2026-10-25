"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StageContainer } from "../stage-container";
import { copy } from "@/config/copy";
import type { AnimationConfig } from "@/types/template";

interface EnvelopeStageProps {
  prompt?: string;
  animation?: AnimationConfig;
  onAdvance: () => void;
}

/**
 * EnvelopeStage — the opening screen of the recipient experience.
 *
 * A realistic envelope with paper texture, wax seal, and a smooth
 * flip-open animation when tapped. The letter peeks out as the
 * envelope opens, creating a sense of anticipation.
 */
export const EnvelopeStage = ({
  prompt = copy.stages.envelope.prompt,
  animation,
  onAdvance,
}: EnvelopeStageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTap = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(onAdvance, 1400);
  };

  return (
    <StageContainer animation={animation} className="flex-col gap-10 px-6">
      {/* Floating decorative particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg"
            initial={{
              x: `${15 + i * 14}%`,
              y: "110%",
              opacity: 0,
            }}
            animate={{
              y: "-10%",
              opacity: [0, 0.4, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeOut",
            }}
          >
            {["✨", "💫", "⭐", "✨", "💫", "⭐"][i]}
          </motion.div>
        ))}
      </div>

      {/* Envelope */}
      <motion.button
        onClick={handleTap}
        className="group relative cursor-pointer focus:outline-none"
        whileHover={!isOpen ? { scale: 1.03, y: -4 } : undefined}
        whileTap={!isOpen ? { scale: 0.98 } : undefined}
        aria-label={copy.stages.envelope.aria}
      >
        <div className="relative h-52 w-72 sm:h-60 sm:w-80" style={{ perspective: "800px" }}>
          {/* Envelope shadow */}
          <motion.div
            className="absolute -bottom-3 left-4 right-4 h-6 rounded-full bg-black/10 blur-md"
            animate={isOpen ? { opacity: 0, scaleX: 0.5 } : { opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Envelope back */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #E8566D 0%, #D44560 50%, #C23450 100%)",
              boxShadow: "0 8px 32px rgba(233, 30, 99, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          />

          {/* Envelope flap (triangle) */}
          <motion.div
            className="absolute inset-x-0 top-0 origin-top"
            animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <svg
              viewBox="0 0 320 100"
              className="w-full"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            >
              <polygon
                points="0,0 160,95 320,0"
                fill="url(#flapGradient)"
              />
              <defs>
                <linearGradient id="flapGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F06292" />
                  <stop offset="100%" stopColor="#E8566D" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Envelope front face */}
          <div
            className="absolute inset-x-0 bottom-0 h-[65%] rounded-b-xl"
            style={{
              background: "linear-gradient(180deg, #E8566D 0%, #D44560 100%)",
              boxShadow: "inset 0 -2px 8px rgba(0,0,0,0.1)",
            }}
          />

          {/* Inner paper peek */}
          <motion.div
            className="absolute inset-x-5 top-4 rounded-lg sm:inset-x-6"
            style={{
              background: "linear-gradient(135deg, #FFFBF0 0%, #FFF8E8 100%)",
              height: "55%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            animate={isOpen ? { y: -60, opacity: 0 } : { y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Paper lines */}
            <div className="space-y-2.5 px-5 pt-5">
              {[85, 70, 90, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-[2px] rounded-full bg-gray-200"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Wax seal */}
          <motion.div
            className="absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2"
            animate={
              isOpen
                ? { scale: 1.3, opacity: 0, rotate: 20 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.4 }}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
              style={{
                background: "radial-gradient(circle at 35% 35%, #C62828 0%, #8E0000 100%)",
                boxShadow:
                  "0 4px 12px rgba(198, 40, 40, 0.5), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <span className="text-xl text-white/90">♥</span>
            </div>
          </motion.div>

          {/* Hover glow */}
          <div className="absolute -inset-3 rounded-2xl bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </motion.button>

      {/* Prompt text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p
          className="text-xl font-semibold sm:text-2xl"
          style={{
            color: "var(--wish-foreground, #1A1A2E)",
            fontFamily: "var(--wish-font-heading), Georgia, serif",
          }}
        >
          {prompt}
        </p>
      </motion.div>

      {/* Tap hint with pulse */}
      {!isOpen && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
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
            {copy.stages.envelope.tap}
          </p>
        </motion.div>
      )}
    </StageContainer>
  );
};
