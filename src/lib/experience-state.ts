import { useState, useCallback, useMemo } from "react";
import type {
  ExperiencePhase,
  ChapterIndex,
  GiftSubScreen,
  FlowMode,
} from "@/types/experience";
import { getNextPhase, getPrevPhase, TOTAL_CHAPTERS, GIFT_CHAPTER_INDEX } from "@/types/experience";

// ─── State Shape ────────────────────────────────────────

export interface ExperienceState {
  /** Current top-level phase. */
  phase: ExperiencePhase;
  /** Current chapter index (only meaningful when phase === "chapters"). */
  chapterIndex: ChapterIndex;
  /** Current sub-screen within the gift chapter (only meaningful when chapterIndex === GIFT_CHAPTER_INDEX). */
  giftSubScreen: GiftSubScreen;
  /** The flow mode chosen by the creator. */
  flowMode: FlowMode;
  /** Whether the user can go back from the current position. */
  canGoBack: boolean;
  /** Whether the user can go forward from the current position. */
  canGoForward: boolean;
  /** Overall progress 0-1 for progress bar. */
  progress: number;
}

// ─── Navigation Actions ────────────────────────────────

export interface ExperienceActions {
  /** Advance to the next screen. */
  next: () => void;
  /** Go back to the previous screen. */
  back: () => void;
  /** Jump to a specific phase. */
  goToPhase: (phase: ExperiencePhase) => void;
  /** Jump to a specific chapter (sets phase to "chapters"). */
  goToChapter: (index: ChapterIndex) => void;
  /**
   * Scroll-position sync: record which chapter is most visible without
   * resetting giftSubScreen (unlike goToChapter) — scrolling away from the
   * gift island must not wipe spin-wheel/wallet state.
   */
  observeChapter: (index: ChapterIndex) => void;
  /** Advance within the gift chapter sub-screens. */
  nextGiftSubScreen: () => void;
  /** Restart the entire experience. */
  restart: () => void;
}

// ─── Gift Sub-Screen Order ─────────────────────────────

// "complete" intentionally absent: after the last reward the flow goes
// straight to the closing screen (finale + CTAs live there now)
const GIFT_SUB_ORDER: GiftSubScreen[] = [
  "challenge",
  "main-gift",
  "bonus-intro",
  "mini-game",
  "reward-result",
];

const getNextGiftSubScreen = (current: GiftSubScreen): GiftSubScreen | null => {
  const index = GIFT_SUB_ORDER.indexOf(current);
  return index < GIFT_SUB_ORDER.length - 1 ? GIFT_SUB_ORDER[index + 1] : null;
};

// ─── Progress Calculation ──────────────────────────────

/**
 * Calculates overall progress (0-1) based on current position.
 *
 * The progress bar is only rendered during the "chapters" phase, so
 * chapters span the full range: each chapter = 1 / TOTAL_CHAPTERS,
 * and the gift chapter subdivides its slice across its sub-screens
 * (last sub-screen = 1.0). Earlier phases report 0, closing reports 1.
 */
const calculateProgress = (
  phase: ExperiencePhase,
  chapterIndex: ChapterIndex,
  giftSubScreen: GiftSubScreen,
): number => {
  // Closing = finished
  if (phase === "closing") {
    return 1;
  }

  // Before chapters: bar hidden
  if (phase !== "chapters") {
    return 0;
  }

  const slice = 1 / TOTAL_CHAPTERS;
  const chapterBase = chapterIndex * slice;

  // Gift chapter has sub-progress
  if (chapterIndex === GIFT_CHAPTER_INDEX) {
    const giftIndex = GIFT_SUB_ORDER.indexOf(giftSubScreen);
    const giftFraction = giftIndex / (GIFT_SUB_ORDER.length - 1);
    return chapterBase + giftFraction * slice;
  }

  return chapterBase;
};

// ─── The Hook ──────────────────────────────────────────

/**
 * React hook that manages the experience state machine.
 *
 * Usage:
 * ```tsx
 * const { state, actions } = useExperienceState("click-through");
 * // state.phase === "introduction"
 * // actions.next() → advances to "unlock"
 * ```
 */
export const useExperienceState = (flowMode: FlowMode = "click-through") => {
  const [phase, setPhase] = useState<ExperiencePhase>("introduction");
  const [chapterIndex, setChapterIndex] = useState<ChapterIndex>(0);
  const [giftSubScreen, setGiftSubScreen] = useState<GiftSubScreen>("challenge");

  const next = useCallback(() => {
    if (phase === "chapters") {
      // Within chapters phase, advance to next chapter or closing
      if (chapterIndex < GIFT_CHAPTER_INDEX) {
        setChapterIndex((prev) => (prev + 1) as ChapterIndex);
        setGiftSubScreen("challenge"); // Reset gift sub-screen for new chapter
      } else {
        // Last chapter done → closing
        setPhase("closing");
      }
    } else {
      // Advance to next phase
      const nextPhase = getNextPhase(phase);
      if (nextPhase) {
        setPhase(nextPhase);
      }
    }
  }, [phase, chapterIndex]);

  const back = useCallback(() => {
    if (phase === "chapters") {
      if (chapterIndex > 0) {
        setChapterIndex((prev) => (prev - 1) as ChapterIndex);
      } else {
        // First chapter → go back to gift-opening
        setPhase("gift-opening");
      }
    } else {
      const prevPhase = getPrevPhase(phase);
      if (prevPhase) {
        setPhase(prevPhase);
        // If going back to chapters, reset to last chapter
        if (prevPhase === "chapters") {
          setChapterIndex(GIFT_CHAPTER_INDEX);
        }
      }
    }
  }, [phase, chapterIndex]);

  const goToPhase = useCallback((target: ExperiencePhase) => {
    setPhase(target);
  }, []);

  const goToChapter = useCallback((index: ChapterIndex) => {
    setPhase("chapters");
    setChapterIndex(index);
    setGiftSubScreen("challenge");
  }, []);

  const observeChapter = useCallback((index: ChapterIndex) => {
    setPhase("chapters");
    setChapterIndex(index);
  }, []);

  const nextGiftSubScreen = useCallback(() => {
    const nextSub = getNextGiftSubScreen(giftSubScreen);
    if (nextSub) {
      setGiftSubScreen(nextSub);
    } else {
      // Gift chapter complete → advance to next chapter or closing
      next();
    }
  }, [giftSubScreen, next]);

  const restart = useCallback(() => {
    setPhase("introduction");
    setChapterIndex(0);
    setGiftSubScreen("challenge");
  }, []);

  const state: ExperienceState = useMemo(
    () => ({
      phase,
      chapterIndex,
      giftSubScreen,
      flowMode,
      canGoBack:
        phase !== "introduction" &&
        !(phase === "chapters" && chapterIndex === 0 && giftSubScreen === "challenge"),
      canGoForward: phase !== "closing",
      progress: calculateProgress(phase, chapterIndex, giftSubScreen),
    }),
    [phase, chapterIndex, giftSubScreen, flowMode],
  );

  const actions: ExperienceActions = useMemo(
    () => ({
      next,
      back,
      goToPhase,
      goToChapter,
      observeChapter,
      nextGiftSubScreen,
      restart,
    }),
    [next, back, goToPhase, goToChapter, observeChapter, nextGiftSubScreen, restart],
  );

  return { state, actions };
};
