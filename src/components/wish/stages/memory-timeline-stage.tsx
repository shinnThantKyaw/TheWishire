"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { StageContainer, StaggeredContainer, RevealChild } from "../stage-container";
import { RevealWrapper } from "../reveal-wrapper";
import {
  HeartNode,
  MemoryCard,
  TimelineBackdrop,
  TimelineHeader,
  bodyFont,
} from "../timeline/timeline-visuals";
import { cn } from "@/lib/utils";
import { copy } from "@/config/copy";
import type { AnimationConfig } from "@/types/template";
import type { MemoryTimelineEntry, FlowMode } from "@/types/wish";

interface MemoryTimelineStageProps {
  entries: MemoryTimelineEntry[];
  flowMode?: FlowMode;
  animation?: AnimationConfig;
  onAdvance: () => void;
}

/**
 * MemoryTimelineStage — premium photo-less memory timeline.
 *
 * Rose backdrop, heart spine, alternating glass-paper MemoryCards.
 * Fits small 13" laptops (~1920×900 viewport) as well as mobile.
 *
 * "tap-to-reveal" wraps each row in RevealWrapper;
 * other modes cascade rows via StaggeredContainer.
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
  const primaryColor = "var(--wish-primary, #E91E63)";
  const foregroundColor = "var(--wish-foreground, #1A1A2E)";

  return (
    <StageContainer
      animation={animation}
      className="relative flex-col overflow-hidden"
    >
      <TimelineBackdrop primaryColor={primaryColor} />

      <div
        className="relative z-10 mx-auto w-full max-w-2xl px-4 sm:px-6"
        style={{
          paddingTop: "clamp(2rem, 8vh, 5rem)",
          paddingBottom: "clamp(4.5rem, 14vh, 7rem)",
        }}
      >
        <TimelineHeader
          eyebrow={copy.stages.timeline.eyebrow}
          titleLead={copy.stages.timeline.titleLead}
          titleAccent={copy.stages.timeline.titleAccent}
          subtitle={copy.stages.timeline.subtitleStory}
          primaryColor={primaryColor}
          foregroundColor={foregroundColor}
        />

        <div className="relative">
          {/* Spine — left on mobile, center on sm+ */}
          <motion.div
            aria-hidden
            className="absolute bottom-4 left-5 top-4 w-px sm:left-1/2 sm:-translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, transparent, ${primaryColor} 12%, ${primaryColor} 88%, transparent)`,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {isTapToReveal ? (
            <div className="space-y-8">
              {entries.map((entry, index) => (
                <TimelineRow
                  key={index}
                  entry={entry}
                  index={index}
                  primaryColor={primaryColor}
                  foregroundColor={foregroundColor}
                  isTapToReveal
                />
              ))}
            </div>
          ) : (
            <StaggeredContainer staggerDelay={0.15}>
              {entries.map((entry, index) => (
                <RevealChild key={index}>
                  <TimelineRow
                    entry={entry}
                    index={index}
                    primaryColor={primaryColor}
                    foregroundColor={foregroundColor}
                  />
                </RevealChild>
              ))}
            </StaggeredContainer>
          )}
        </div>

        {!isButtonMode && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + entries.length * 0.12 }}
          >
            <motion.button
              type="button"
              onClick={onAdvance}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-10 py-3.5 text-sm font-semibold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, var(--wish-accent, #FF80AB))`,
                boxShadow: `0 4px 16px ${primaryColor}44`,
                fontFamily: bodyFont,
              }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {copy.common.continue}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </motion.button>
          </motion.div>
        )}
      </div>
    </StageContainer>
  );
};

/** One alternating row: glass memory card + heart node on the spine. */
const TimelineRow = ({
  entry,
  index,
  primaryColor,
  foregroundColor,
  isTapToReveal = false,
}: {
  entry: MemoryTimelineEntry;
  index: number;
  primaryColor: string;
  foregroundColor: string;
  isTapToReveal?: boolean;
}) => {
  const isLeft = index % 2 === 0;
  const nodeDelay = 0.25 + index * 0.12;

  const row = (
    <div
      className={cn(
        "relative mb-8 flex sm:mb-10",
        isLeft ? "sm:justify-start" : "sm:justify-end",
      )}
    >
      <HeartNode primaryColor={primaryColor} delay={nodeDelay} />

      <div
        className={cn(
          "ml-12 w-[calc(100%-3.5rem)] sm:ml-0 sm:w-[calc(50%-2.5rem)]",
        )}
      >
        <MemoryCard
          entry={entry}
          index={index}
          primaryColor={primaryColor}
          foregroundColor={foregroundColor}
        />
      </div>
    </div>
  );

  if (isTapToReveal) {
    return (
      <RevealWrapper
        hint={`Reveal: ${entry.title}`}
        delay={index * 0.2}
        primaryColor={primaryColor}
      >
        {row}
      </RevealWrapper>
    );
  }

  return row;
};
