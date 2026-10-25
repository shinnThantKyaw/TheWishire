"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import {
  HeartNode,
  MemoryCard,
  TimelineBackdrop,
  TimelineHeader,
} from "../timeline/timeline-visuals";
import { cn } from "@/lib/utils";
import { copy } from "@/config/copy";
import type { MemoryTimelineEntry } from "@/types/wish";

interface TimelineChapterProps {
  entries: MemoryTimelineEntry[];
  primaryColor?: string;
  foregroundColor?: string;
  /** e.g. "Chapter 04" — shown as the timeline eyebrow */
  chapterLabel?: string;
}

/**
 * TimelineChapter — click-through memory timeline chapter.
 *
 * Premium photo-less design shared with MemoryTimelineStage:
 * rose backdrop, heart spine, alternating glass-paper MemoryCards.
 * Extra bottom padding for the fixed click-through nav.
 */
export const TimelineChapter = ({
  entries,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
  chapterLabel = copy.chapters.timeline.chapterLabel,
}: TimelineChapterProps) => {
  if (entries.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
        <Heart
          className="h-8 w-8 opacity-30"
          style={{ color: foregroundColor }}
          aria-hidden
        />
        <p className="text-sm" style={{ color: foregroundColor, opacity: 0.45 }}>
          {copy.chapters.timeline.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden">
      <TimelineBackdrop primaryColor={primaryColor} />

      <div
        className="relative z-10 mx-auto w-full max-w-2xl px-4 sm:px-6"
        style={{
          paddingTop: "clamp(1.5rem, 6vh, 3.5rem)",
          paddingBottom: "clamp(5rem, 16vh, 8rem)",
        }}
      >
        <TimelineHeader
          eyebrow={chapterLabel}
          titleLead={copy.stages.timeline.titleLead}
          titleAccent={copy.stages.timeline.titleAccent}
          subtitle={copy.stages.timeline.subtitleMine}
          primaryColor={primaryColor}
          foregroundColor={foregroundColor}
        />

        <div className="relative">
          <motion.div
            aria-hidden
            className="absolute bottom-2 left-5 top-2 w-px sm:left-1/2 sm:-translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, transparent, ${primaryColor} 10%, ${primaryColor} 90%, transparent)`,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="space-y-6">
            {entries.map((entry, index) => (
              <TimelineRow
                key={index}
                entry={entry}
                index={index}
                primaryColor={primaryColor}
                foregroundColor={foregroundColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Alternating row shared with MemoryTimelineStage. */
const TimelineRow = ({
  entry,
  index,
  primaryColor,
  foregroundColor,
}: {
  entry: MemoryTimelineEntry;
  index: number;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const isLeft = index % 2 === 0;
  const nodeDelay = 0.25 + index * 0.12;

  return (
    <div
      className={cn(
        "relative flex",
        isLeft ? "sm:justify-start" : "sm:justify-end",
      )}
    >
      <HeartNode primaryColor={primaryColor} delay={nodeDelay} />

      <div className="ml-12 w-[calc(100%-3.5rem)] sm:ml-0 sm:w-[calc(50%-2.5rem)]">
        <MemoryCard
          entry={entry}
          index={index}
          primaryColor={primaryColor}
          foregroundColor={foregroundColor}
        />
      </div>
    </div>
  );
};
