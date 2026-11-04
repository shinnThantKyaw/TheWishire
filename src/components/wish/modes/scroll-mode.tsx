"use client";

import { motion, useReducedMotion } from "motion/react";
import { copy } from "@/config/copy";
import type { MergedStage, GiftChapterConfig } from "@/types/wish";
import type { GiftSubScreen } from "@/types/experience";
import { LetterChapter } from "../chapters/letter-chapter";
import { PhotosChapter } from "../chapters/photos-chapter";
import { PoemChapter } from "../chapters/poem-chapter";
import { SongChapter } from "../chapters/song-chapter";
import { TimelineChapter } from "../chapters/timeline-chapter";
import { GiftChapter } from "../chapters/gift-chapter";
import { SCROLL_SECTIONS } from "./scroll-sections";

interface ScrollModeProps {
  stages: MergedStage[];
  giftConfig?: GiftChapterConfig;
  recipientName?: string;
  senderName?: string;
  recipientNickname?: string;
  senderNickname?: string;
  primaryColor: string;
  giftSubScreen: GiftSubScreen;
  onNextGiftSubScreen: () => void;
  /** Scroll sync: reports which chapter section is most visible. */
  onSectionVisible: (chapterIndex: 0 | 1 | 2 | 3 | 4 | 5) => void;
  onComplete: () => void;
}

/**
 * Scroll mode container.
 * All chapters render as stacked full-height sections in one continuous
 * scroll; the orchestrator's top progress bar tracks the visible section
 * via onSectionVisible → observeChapter. The gift chapter is an
 * interactive island (stateful sub-screens) before the closing card.
 */
export const ScrollMode = ({
  stages,
  giftConfig,
  recipientName = "",
  senderName = "",
  recipientNickname,
  senderNickname,
  primaryColor,
  giftSubScreen,
  onNextGiftSubScreen,
  onSectionVisible,
  onComplete,
}: ScrollModeProps) => {
  const reduceMotion = useReducedMotion();

  const findStage = (type: string) => stages.find((s) => s.type === type);
  const letterStage = findStage("letter");
  const photosStage = findStage("photos");
  const poemStage = findStage("poem");
  const songStage = findStage("song");
  const timelineStage = findStage("timeline");

  const renderSectionContent = (id: string) => {
    switch (id) {
      case "letter":
        return (
          <LetterChapter
            letter={letterStage?.content.letter}
            recipientName={recipientName}
            recipientNickname={recipientNickname}
            primaryColor={primaryColor}
          />
        );
      case "photos":
        return (
          <PhotosChapter
            photos={photosStage?.content.photos ?? []}
            videoUrl={photosStage?.content.videoUrl}
            senderName={senderName}
            recipientName={recipientName}
            senderNickname={senderNickname}
            recipientNickname={recipientNickname}
            primaryColor={primaryColor}
          />
        );
      case "poem":
        return (
          <PoemChapter
            poem={poemStage?.content.poem}
            recipientName={recipientName}
            recipientNickname={recipientNickname}
            primaryColor={primaryColor}
          />
        );
      case "song":
        return (
          <SongChapter
            song={songStage?.content.song}
            recipientName={recipientName}
            recipientNickname={recipientNickname}
            primaryColor={primaryColor}
          />
        );
      case "timeline":
        return (
          <TimelineChapter
            entries={timelineStage?.content.memoryTimeline ?? []}
            recipientName={recipientName}
            senderName={senderName}
            recipientNickname={recipientNickname}
            senderNickname={senderNickname}
            primaryColor={primaryColor}
          />
        );
      case "gift":
        return (
          <GiftChapter
            giftSubScreen={giftSubScreen}
            config={giftConfig}
            recipientName={recipientName}
            senderName={senderName}
            recipientNickname={recipientNickname}
            senderNickname={senderNickname}
            onNextSubScreen={onNextGiftSubScreen}
            primaryColor={primaryColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-col">
      {SCROLL_SECTIONS.map((section) => (
        <motion.section
          key={section.id}
          aria-label={section.id}
          className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-16"
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          onViewportEnter={() => onSectionVisible(section.chapterIndex)}
        >
          <div className="w-full">{renderSectionContent(section.id)}</div>
        </motion.section>
      ))}

      {/* ── Closing card ─────────────────────────── */}
      <section className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <motion.button
          onClick={onComplete}
          className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            boxShadow: `0 4px 16px ${primaryColor}40`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copy.modes.finishArrow}
        </motion.button>
      </section>
    </div>
  );
};
