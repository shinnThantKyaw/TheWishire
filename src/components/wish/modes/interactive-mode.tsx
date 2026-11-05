"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/config/copy";
import type { MergedStage, GiftChapterConfig } from "@/types/wish";
import type { ChapterIndex, GiftSubScreen } from "@/types/experience";
import { LetterChapter } from "../chapters/letter-chapter";
import { PhotosChapter } from "../chapters/photos-chapter";
import { PoemChapter } from "../chapters/poem-chapter";
import { SongChapter } from "../chapters/song-chapter";
import { TimelineChapter } from "../chapters/timeline-chapter";
import { GiftChapter } from "../chapters/gift-chapter";
import { MATERIALS } from "./materials";
import {
  initialInteractiveState,
  interactiveReducer,
  allOpened,
} from "@/lib/interactive-state";
import { isFinalGiftSubScreen } from "@/lib/experience-state";

interface InteractiveModeProps {
  stages: MergedStage[];
  giftConfig?: GiftChapterConfig;
  recipientName?: string;
  senderName?: string;
  recipientNickname?: string;
  senderNickname?: string;
  primaryColor: string;
  giftSubScreen: GiftSubScreen;
  onNextGiftSubScreen: () => void;
  /** Progress sync: records the just-opened material for the orchestrator bar. */
  observeChapter: (index: ChapterIndex) => void;
  onComplete: () => void;
}

/**
 * Interactive mode container.
 *
 * The grid of MATERIALS is the hub; tapping a card opens a full-screen
 * overlay rendering that chapter. Opened materials keep a golden glow.
 * The overlay stays mounted (visibility-toggled) once a material has been
 * visited, so gift-chapter state (PIN attempts, spin-wheel rewards)
 * survives close/reopen. Gift counts as opened only on gift-finish; when
 * every material is opened the flow auto-advances to closing.
 */
export const InteractiveMode = ({
  stages,
  giftConfig,
  recipientName = "",
  senderName = "",
  recipientNickname,
  senderNickname,
  primaryColor,
  giftSubScreen,
  onNextGiftSubScreen,
  observeChapter,
  onComplete,
}: InteractiveModeProps) => {
  const [state, dispatch] = useReducer(interactiveReducer, initialInteractiveState);

  // Materials visited at least once stay rendered inside the overlay
  // (hidden when inactive) so chapter-local state is never unmounted.
  const [visited, setVisited] = useState<boolean[]>(() =>
    Array.from({ length: MATERIALS.length }, () => false),
  );

  // Guards the all-opened effect against re-firing before unmount.
  const completedRef = useRef(false);

  const findStage = (type: string) => stages.find((s) => s.type === type);
  const letterStage = findStage("letter");
  const photosStage = findStage("photos");
  const poemStage = findStage("poem");
  const songStage = findStage("song");
  const timelineStage = findStage("timeline");

  const handleOpen = (index: ChapterIndex) => {
    dispatch({ type: "open", index });
    setVisited((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
    observeChapter(index);
  };

  const handleGiftNext = () => {
    if (isFinalGiftSubScreen(giftSubScreen)) {
      // Reward screen continue → gift done: mark opened, return to grid.
      // The all-opened effect below advances to closing if everything
      // else is opened too.
      dispatch({ type: "gift-finish" });
      dispatch({ type: "close" });
    } else {
      onNextGiftSubScreen();
    }
  };

  // All materials opened (gift included) → auto-advance to closing.
  useEffect(() => {
    if (allOpened(state) && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [state, onComplete]);

  // Escape closes the overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.active !== null) {
        dispatch({ type: "close" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.active]);

  const renderChapterContent = (index: ChapterIndex) => {
    switch (index) {
      case 0:
        return (
          <LetterChapter
            letter={letterStage?.content.letter}
            recipientName={recipientName}
            recipientNickname={recipientNickname}
            primaryColor={primaryColor}
          />
        );
      case 1:
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
      case 2:
        return (
          <PoemChapter
            poem={poemStage?.content.poem}
            recipientName={recipientName}
            recipientNickname={recipientNickname}
            primaryColor={primaryColor}
          />
        );
      case 3:
        return (
          <SongChapter
            song={songStage?.content.song}
            recipientName={recipientName}
            recipientNickname={recipientNickname}
            primaryColor={primaryColor}
          />
        );
      case 4:
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
      case 5:
        return (
          <GiftChapter
            giftSubScreen={giftSubScreen}
            config={giftConfig}
            recipientName={recipientName}
            senderName={senderName}
            recipientNickname={recipientNickname}
            senderNickname={senderNickname}
            onNextSubScreen={handleGiftNext}
            primaryColor={primaryColor}
          />
        );
      default:
        return null;
    }
  };

  const overlayOpen = state.active !== null;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 py-12">
      {/* ── Grid (inert while overlay is open) ─────── */}
      <div
        className="flex flex-col items-center gap-5"
        inert={overlayOpen}
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
        >
          {copy.modes.interactive.title}
        </span>
        <p className="text-center text-sm" style={{ opacity: 0.6 }}>
          {copy.modes.interactive.description}
        </p>

        <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-lg sm:grid-cols-3">
          {MATERIALS.map((material) => {
            const isOpened = state.opened[material.chapterIndex];
            return (
              <button
                key={material.chapterIndex}
                type="button"
                onClick={() => handleOpen(material.chapterIndex)}
                aria-pressed={isOpened}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-2xl border px-4 py-5 transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2",
                  isOpened && "border-amber-400/70",
                )}
                style={{
                  backgroundColor: `${primaryColor}10`,
                  borderColor: isOpened ? undefined : `${primaryColor}20`,
                  boxShadow: isOpened
                    ? "0 0 16px rgba(245, 158, 11, 0.45)"
                    : undefined,
                  outlineColor: primaryColor,
                }}
              >
                <span className="text-3xl" aria-hidden>
                  {material.emoji}
                </span>
                <span className="text-sm font-medium">{material.label}</span>
                {isOpened && (
                  <span
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-amber-950"
                    aria-hidden
                  >
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          }}
        >
          {copy.modes.skipToClosing}
        </button>
      </div>

      {/* ── Overlay: stays mounted after first visit ── */}
      {visited.some(Boolean) && (
        <div
          className={cn(
            "fixed inset-0 z-[35] overflow-y-auto transition-[opacity,visibility] duration-300",
            overlayOpen ? "visible opacity-100" : "invisible opacity-0",
          )}
          style={{ backgroundColor: "var(--wish-background)" }}
          aria-hidden={!overlayOpen}
          inert={!overlayOpen}
        >
          <div className="sticky top-0 z-10 flex justify-end p-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "close" })}
              aria-label={copy.modes.interactive.closeAria}
              className="rounded-full p-2.5 shadow-md transition-transform hover:scale-110"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {MATERIALS.map((material) =>
            visited[material.chapterIndex] ? (
              <div
                key={material.chapterIndex}
                className={cn(
                  state.active === material.chapterIndex ? "block" : "hidden",
                )}
              >
                {renderChapterContent(material.chapterIndex)}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
};
