import { useState, useCallback, useMemo } from "react";
import type {
  ExperiencePhase,
  ChapterIndex,
  GiftSubScreen,
  FlowMode,
} from "@/types/experience";
import { PHASE_ORDER, getNextPhase, getPrevPhase } from "@/types/experience";

// ─── State Shape ────────────────────────────────────────

export interface ExperienceState {
  /** Current top-level phase. */
  phase: ExperiencePhase;
  /** Current chapter index (only meaningful when phase === "chapters"). */
  chapterIndex: ChapterIndex;
  /** Current sub-screen within the gift chapter (only meaningful when chapterIndex === 4). */
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
  /** Advance within the gift chapter sub-screens. */
  nextGiftSubScreen: () => void;
  /** Restart the entire experience. */
  restart: () => void;
}

// ─── Gift Sub-Screen Order ─────────────────────────────

const GIFT_SUB_ORDER: GiftSubScreen[] = [
  "challenge",
  "main-gift",
  "bonus-intro",
  "mini-game",
  "reward-result",
  "complete",
];

const getNextGiftSubScreen = (current: GiftSubScreen): GiftSubScreen | null => {
  const index = GIFT_SUB_ORDER.indexOf(current);
  return index < GIFT_SUB_ORDER.length - 1 ? GIFT_SUB_ORDER[index + 1] : null;
};

// ─── Progress Calculation ──────────────────────────────

/**
 * Calculates overall progress (0-1) based on current position.
 *
 * Phase weights (total = 1.0):
 *   introduction: 0-0.10  (includes unlock)
 *   start:        0.10-0.20
 *   gift-reveal:  0.20-0.30
 *   gift-opening: 0.30-0.40
 *   chapters:     0.40-0.90 (each chapter = 0.10)
 *   closing:      0.90-1.00
 */
const calculateProgress = (
  phase: ExperiencePhase,
  chapterIndex: ChapterIndex,
  giftSubScreen: GiftSubScreen,
): number => {
  const phaseIndex = PHASE_ORDER.indexOf(phase);

  // Before chapters: 0.10 per phase
  if (phase !== "chapters") {
    return phaseIndex * 0.1;
  }

  // Within chapters: 0.40 + (chapter * 0.10) + gift sub-progress
  const chapterBase = 0.4 + chapterIndex * 0.1;

  // Gift chapter (index 4) has sub-progress
  if (chapterIndex === 4) {
    const giftIndex = GIFT_SUB_ORDER.indexOf(giftSubScreen);
    const giftFraction = giftIndex / (GIFT_SUB_ORDER.length - 1);
    return 0.4 + 4 * 0.1 + giftFraction * 0.1;
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
      if (chapterIndex < 4) {
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
          setChapterIndex(4);
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
      nextGiftSubScreen,
      restart,
    }),
    [next, back, goToPhase, goToChapter, nextGiftSubScreen, restart],
  );

  return { state, actions };
};
