"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ChapterIndex, GiftSubScreen } from "@/types/experience";
import { CHAPTER_NAMES } from "@/types/experience";
import { LetterChapter } from "../chapters/letter-chapter";
import { PhotosChapter } from "../chapters/photos-chapter";
import { PoemChapter } from "../chapters/poem-chapter";
import { TimelineChapter } from "../chapters/timeline-chapter";
import { GiftChapter } from "../chapters/gift-chapter";
import type { MergedStage } from "@/types/wish";
import type { GiftChapterConfig } from "@/types/wish";

interface ClickThroughProps {
  chapterIndex: ChapterIndex;
  giftSubScreen: GiftSubScreen;
  stages: MergedStage[];
  giftConfig?: GiftChapterConfig;
  primaryColor: string;
  onNext: () => void;
  onBack: () => void;
  onNextGiftSubScreen: () => void;
}

const TOTAL_CHAPTERS = 5;

/**
 * Click-through mode container (Screen 6-10).
 * Renders one chapter at a time with Next/Back navigation.
 *
 * In Phase 2.4, this will get:
 * - AnimatePresence slide transitions between chapters
 * - Keyboard arrow support
 * - Smooth slide left/right animations
 */
export const ClickThrough = ({
  chapterIndex,
  giftSubScreen,
  stages,
  giftConfig,
  primaryColor,
  onNext,
  onBack,
  onNextGiftSubScreen,
}: ClickThroughProps) => {
  const isFirstChapter = chapterIndex === 0;
  const isLastChapter = chapterIndex === 4;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft" && !isFirstChapter) onBack();
    },
    [onNext, onBack, isFirstChapter],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Find stage content by type
  const findStage = (type: string) => stages.find((s) => s.type === type);
  const letterStage = findStage("letter");
  const photosStage = findStage("photos");
  const poemStage = findStage("poem");
  const timelineStage = findStage("timeline");

  const chapterNames = Object.values(CHAPTER_NAMES);

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Progress Dots ────────────────────────── */}
      <div className="fixed left-0 right-0 top-6 z-50 flex justify-center gap-2">
        {chapterNames.map((_, index) => {
          const isActive = index === chapterIndex;
          const isPast = index < chapterIndex;

          return (
            <motion.div
              key={index}
              className="h-2 rounded-full"
              animate={{
                width: isActive ? 24 : 8,
                backgroundColor: isPast || isActive ? primaryColor : `${primaryColor}40`,
                opacity: isPast ? 0.5 : isActive ? 1 : 0.3,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          );
        })}
      </div>

      {/* ── Chapter Content ──────────────────────── */}
      <div className="flex-1 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapterIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {chapterIndex === 0 && (
              <LetterChapter
                letter={letterStage?.content.letter}
                primaryColor={primaryColor}
              />
            )}
            {chapterIndex === 1 && (
              <PhotosChapter
                photos={photosStage?.content.photos ?? []}
                videoUrl={photosStage?.content.videoUrl}
                primaryColor={primaryColor}
              />
            )}
            {chapterIndex === 2 && (
              <PoemChapter
                poem={poemStage?.content.poem}
                primaryColor={primaryColor}
              />
            )}
            {chapterIndex === 3 && (
              <TimelineChapter
                entries={timelineStage?.content.memoryTimeline ?? []}
                primaryColor={primaryColor}
              />
            )}
            {chapterIndex === 4 && (
              <GiftChapter
                giftSubScreen={giftSubScreen}
                config={giftConfig}
                onNextSubScreen={onNextGiftSubScreen}
                primaryColor={primaryColor}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation ────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t px-4 py-3 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          borderColor: `${primaryColor}15`,
        }}
      >
        {/* Back button */}
        <motion.button
          onClick={onBack}
          disabled={isFirstChapter && giftSubScreen === "challenge"}
          className="rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-30"
          style={{
            borderColor: `${primaryColor}30`,
            color: primaryColor,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>

        {/* Chapter counter */}
        <span className="text-xs font-medium" style={{ opacity: 0.5 }}>
          {chapterIndex + 1}/{TOTAL_CHAPTERS}
        </span>

        {/* Next button */}
        <motion.button
          onClick={isLastChapter ? onNext : onNext}
          className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            boxShadow: `0 4px 16px ${primaryColor}40`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLastChapter ? "Finish →" : "Next →"}
        </motion.button>
      </div>
    </div>
  );
};
