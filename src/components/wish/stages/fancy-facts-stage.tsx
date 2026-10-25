"use client";

import { motion } from "motion/react";
import { StageContainer, StaggeredContainer, RevealChild } from "../stage-container";
import { copy } from "@/config/copy";
import type { AnimationConfig } from "@/types/template";
import type { FlowMode } from "@/types/wish";

interface FancyFactsStageProps {
  flowMode?: FlowMode;
  animation?: AnimationConfig;
  onAdvance: () => void;
}

/** Design tokens (emoji, accent color, card gradient) keyed by fact id. */
const FACT_DESIGN: Record<string, { emoji: string; color: string; bg: string }> = {
  zodiac: {
    emoji: "♈",
    color: "#7C4DFF",
    bg: "linear-gradient(135deg, #EDE7F6, #D1C4E9)",
  },
  birthstone: {
    emoji: "💎",
    color: "#00BCD4",
    bg: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
  },
  birthFlower: {
    emoji: "🌸",
    color: "#E91E63",
    bg: "linear-gradient(135deg, #FCE4EC, #F8BBD0)",
  },
  funFact: {
    emoji: "🎂",
    color: "#FF9800",
    bg: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
  },
  luckyColor: {
    emoji: "🎨",
    color: "#9C27B0",
    bg: "linear-gradient(135deg, #F3E5F5, #E1BEE7)",
  },
  birthdayWish: {
    emoji: "🌟",
    color: "#FF5722",
    bg: "linear-gradient(135deg, #FBE9E7, #FFCCBC)",
  },
};

/**
 * FancyFactsStage — displays zodiac, birthstone, flowers, and fun birthday facts
 * in a beautiful card grid with staggered reveal animations.
 */
export const FancyFactsStage = ({
  flowMode = "scroll",
  animation,
  onAdvance,
}: FancyFactsStageProps) => {
  const isButtonMode = flowMode === "buttons";

  return (
    <StageContainer animation={animation} className="flex-col px-4 sm:px-6">
      <div className="mx-auto w-full max-w-2xl py-12">
        {/* Title */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{
              color: "var(--wish-foreground, #1A1A2E)",
              fontFamily: "var(--wish-font-heading), Georgia, serif",
            }}
          >
            ✨ A Little About You ✨
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--wish-foreground, #1A1A2E)", opacity: 0.5 }}
          >
            {copy.facts.subtitle}
          </p>
        </motion.div>

        {/* Facts grid */}
        <StaggeredContainer className="grid gap-4 sm:grid-cols-2" staggerDelay={0.1}>
          {copy.facts.sample.map((fact, index) => (
            <RevealChild key={fact.id}>
              <motion.div
                className="group relative overflow-hidden rounded-2xl p-6"
                style={{ background: FACT_DESIGN[fact.id].bg }}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Category badge */}
                <div
                  className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${FACT_DESIGN[fact.id].color}18`,
                    color: FACT_DESIGN[fact.id].color,
                  }}
                >
                  {fact.category}
                </div>

                {/* Emoji + Title */}
                <div className="flex items-start gap-3">
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {FACT_DESIGN[fact.id].emoji}
                  </motion.span>
                  <div>
                    <h3
                      className="text-base font-bold"
                      style={{
                        color: "#3E2723",
                        fontFamily: "var(--wish-font-heading), Georgia, serif",
                      }}
                    >
                      {fact.title}
                    </h3>
                    <p
                      className="mt-1.5 text-sm leading-relaxed"
                      style={{ color: "#5D4037", opacity: 0.85 }}
                    >
                      {fact.detail}
                    </p>
                  </div>
                </div>

                {/* Decorative corner sparkle */}
                <div
                  className="absolute -bottom-2 -right-2 text-4xl opacity-10"
                  style={{ transform: "rotate(15deg)" }}
                >
                  {FACT_DESIGN[fact.id].emoji}
                </div>
              </motion.div>
            </RevealChild>
          ))}
        </StaggeredContainer>

        {/* Continue button */}
        {!isButtonMode && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={onAdvance}
              className="relative overflow-hidden rounded-full px-10 py-3.5 text-sm font-semibold text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--wish-primary, #E91E63), var(--wish-accent, #FF80AB))",
                boxShadow: "0 4px 16px rgba(233, 30, 99, 0.3)",
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {copy.common.continue}
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </StageContainer>
  );
};
