"use client";

import { motion } from "motion/react";
import { StageContainer, StaggeredContainer, RevealChild } from "../stage-container";
import type { AnimationConfig } from "@/types/template";
import type { FlowMode } from "@/types/wish";

interface FancyFactsStageProps {
  flowMode?: FlowMode;
  animation?: AnimationConfig;
  onAdvance: () => void;
}

/** Birthday fun facts data */
const FUN_FACTS = [
  {
    category: "Zodiac",
    emoji: "♈",
    title: "Born under a lucky star",
    detail: "Your zodiac sign reveals hidden strengths — curiosity, creativity, and a heart that never stops dreaming.",
    color: "#7C4DFF",
    bg: "linear-gradient(135deg, #EDE7F6, #D1C4E9)",
  },
  {
    category: "Birthstone",
    emoji: "💎",
    title: "Diamond — April's gem",
    detail: "Symbol of eternal love and inner strength. Like you — unbreakable, brilliant, and one of a kind.",
    color: "#00BCD4",
    bg: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
  },
  {
    category: "Birth Flower",
    emoji: "🌸",
    title: "Sweet Pea & Daisy",
    detail: "Delicate, joyful, and full of life — just like the memories we've shared together.",
    color: "#E91E63",
    bg: "linear-gradient(135deg, #FCE4EC, #F8BBD0)",
  },
  {
    category: "Fun Fact",
    emoji: "🎂",
    title: "Birthday number meaning",
    detail: "The 25th birthday is known as the 'Silver Jubilee' — a milestone marking a quarter century of making the world brighter.",
    color: "#FF9800",
    bg: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
  },
  {
    category: "Lucky Color",
    emoji: "🎨",
    title: "Rose Gold & Lavender",
    detail: "These colors represent warmth, grace, and a touch of magic — your birthday palette for the year ahead.",
    color: "#9C27B0",
    bg: "linear-gradient(135deg, #F3E5F5, #E1BEE7)",
  },
  {
    category: "Birthday Wish",
    emoji: "🌟",
    title: "Make it count",
    detail: "They say the first birthday wish whispered while blowing out candles always comes true. So make it a good one.",
    color: "#FF5722",
    bg: "linear-gradient(135deg, #FBE9E7, #FFCCBC)",
  },
];

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
            Fun facts, lucky charms, and birthday magic
          </p>
        </motion.div>

        {/* Facts grid */}
        <StaggeredContainer className="grid gap-4 sm:grid-cols-2" staggerDelay={0.1}>
          {FUN_FACTS.map((fact, index) => (
            <RevealChild key={index}>
              <motion.div
                className="group relative overflow-hidden rounded-2xl p-6"
                style={{ background: fact.bg }}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Category badge */}
                <div
                  className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${fact.color}18`,
                    color: fact.color,
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
                    {fact.emoji}
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
                  {fact.emoji}
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
              Continue
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
