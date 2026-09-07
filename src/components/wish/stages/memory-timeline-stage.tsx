"use client";

import { motion } from "motion/react";
import { StageContainer, StaggeredContainer, RevealChild } from "../stage-container";
import { RevealWrapper } from "../reveal-wrapper";
import type { AnimationConfig } from "@/types/template";
import type { MemoryTimelineEntry, FlowMode } from "@/types/wish";

interface MemoryTimelineStageProps {
  entries: MemoryTimelineEntry[];
  flowMode?: FlowMode;
  animation?: AnimationConfig;
  onAdvance: () => void;
}

/**
 * MemoryTimelineStage — displays shared memories on an elegant timeline.
 *
 * In "tap-to-reveal" mode, each timeline card starts hidden.
 * In other modes, cards cascade in via stagger animation.
 */
export const MemoryTimelineStage = ({
  entries,
  flowMode = "scroll",
  animation,
  onAdvance,
}: MemoryTimelineStageProps) => {
  if (entries.length === 0) return null;

  const isTapToReveal = flowMode === "tap-to-reveal";
  const isButtonMode = flowMode === "buttons";

  return (
    <StageContainer animation={animation} className="flex-col px-4 sm:px-6">
      <div className="mx-auto w-full max-w-lg py-12">
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
            Our Memories
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--wish-foreground, #1A1A2E)", opacity: 0.5 }}
          >
            ✨ A journey through our moments together
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical line */}
          <motion.div
            className="absolute bottom-0 left-5 top-0 w-px sm:left-1/2 sm:-translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, transparent, var(--wish-primary, #E91E63), transparent)",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {isTapToReveal ? (
            /* Tap-to-reveal: each card wrapped individually */
            <div className="space-y-10">
              {entries.map((entry, index) => (
                <TimelineCard
                  key={index}
                  entry={entry}
                  index={index}
                  isTapToReveal
                />
              ))}
            </div>
          ) : (
            /* Scroll / buttons: staggered cascade */
            <StaggeredContainer staggerDelay={0.15}>
              {entries.map((entry, index) => (
                <RevealChild key={index}>
                  <TimelineCard entry={entry} index={index} />
                </RevealChild>
              ))}
            </StaggeredContainer>
          )}
        </div>

        {/* Continue button (scroll & tap-to-reveal only) */}
        {!isButtonMode && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + entries.length * 0.15 }}
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

/** Single timeline card */
const TimelineCard = ({
  entry,
  index,
  isTapToReveal = false,
}: {
  entry: MemoryTimelineEntry;
  index: number;
  isTapToReveal?: boolean;
}) => {
  const isLeft = index % 2 === 0;

  const card = (
    <div
      className={`relative mb-10 flex items-start ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Dot on the line */}
      <motion.div
        className="absolute left-5 z-10 -translate-x-1/2 sm:left-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: 0.3 + index * 0.15,
        }}
      >
        <div
          className="h-3.5 w-3.5 rounded-full border-[3px] border-white"
          style={{
            backgroundColor: "var(--wish-primary, #E91E63)",
            boxShadow: "0 0 0 4px rgba(233, 30, 99, 0.15), 0 2px 8px rgba(233, 30, 99, 0.3)",
          }}
        />
      </motion.div>

      {/* Card */}
      <div
        className={`ml-12 w-[calc(100%-3.5rem)] sm:ml-0 sm:w-[calc(50%-2rem)] ${
          isLeft ? "sm:mr-auto sm:pr-10" : "sm:ml-auto sm:pl-10"
        }`}
      >
        <div
          className="overflow-hidden rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, #FFFBF0 0%, #FFF8E8 100%)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {/* Date badge */}
          <div
            className="mb-2.5 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: "rgba(233, 30, 99, 0.08)",
              color: "var(--wish-primary, #E91E63)",
            }}
          >
            {entry.date}
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold"
            style={{
              color: "#3E2723",
              fontFamily: "var(--wish-font-heading), Georgia, serif",
            }}
          >
            {entry.title}
          </h3>

          {/* Description */}
          {entry.description && (
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "#5D4037", opacity: 0.85 }}
            >
              {entry.description}
            </p>
          )}

          {/* Photo */}
          {entry.photoUrl && (
            <div className="mt-3 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.photoUrl}
                alt={entry.title}
                className="h-36 w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isTapToReveal) {
    return (
      <RevealWrapper hint={`Reveal: ${entry.title} ✨`} delay={index * 0.2}>
        {card}
      </RevealWrapper>
    );
  }

  return card;
};
