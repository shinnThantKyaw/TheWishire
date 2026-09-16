// ─── Experience Phases ──────────────────────────────────
// Maps to the 11 screens of the recipient surprise experience.

/** Top-level phases of the experience. Each maps to one or more screens. */
export type ExperiencePhase =
  | "introduction" // Screen 1: Introduction + Unlock (context + ribbon cut)
  | "start" // Screen 2: Are You Ready?
  | "gift-reveal" // Screen 3: Gift Box appears
  | "gift-opening" // Screen 4: Box opens + materials launch
  | "chapters" // Screens 5-9: The main content experience
  | "closing"; // Screen 10: Final thank you + CTAs

/** The 5 chapters within the "chapters" phase (screens 6-10). */
export type ChapterIndex = 0 | 1 | 2 | 3 | 4;

export const CHAPTER_NAMES: Record<ChapterIndex, string> = {
  0: "letter",
  1: "photos",
  2: "poem",
  3: "timeline",
  4: "gift",
};

/** Sub-screens within the Gift chapter (screen 10). */
export type GiftSubScreen =
  | "challenge" // 10A: Pre-reveal gate (password/yes-no/action)
  | "main-gift" // 10B: Main gift reveal
  | "bonus-intro" // 10C: Bonus gifts introduction
  | "mini-game" // 10D: Spin wheel / lucky draw
  | "reward-result" // 10E: Won item + download ticket
  | "complete"; // Done with gift chapter

// ─── Flow Modes ─────────────────────────────────────────
// How the recipient navigates through the chapters (screen 6-10).

/**
 * Flow mode — creator's choice for how chapters are experienced.
 *
 * New values: "click-through" | "scroll" | "interactive"
 * Legacy values (mapped): "buttons" → "click-through", "tap-to-reveal" → "interactive"
 */
export type FlowMode =
  | "click-through"
  | "scroll"
  | "interactive"
  | "buttons" // Legacy alias for "click-through"
  | "tap-to-reveal"; // Legacy alias for "interactive"

/** Map legacy FlowMode values to their new equivalents. */
export const normalizeFlowMode = (mode: FlowMode): FlowMode => {
  switch (mode) {
    case "buttons":
      return "click-through";
    case "tap-to-reveal":
      return "interactive";
    default:
      return mode;
  }
};

// ─── Gate Types (Screen 2) ─────────────────────────────
/** The type of lock/unlock mechanism on the Surprise Unlock screen. */
export type GateType = "padlock" | "ribbon" | "wax-seal" | "chain";

// ─── Start Actions (Screen 3) ──────────────────────────
/** The interactive CTA on the Surprise Start / Are You Ready screen. */
export type StartAction =
  | { type: "candles"; count: number }
  | { type: "yes-no"; prompt: string }
  | { type: "password"; answer: string }
  | { type: "tap"; prompt: string };

// ─── Gift Box (Screen 4) ──────────────────────────────
/** How the recipient opens the gift box. */
export type BoxOpenMethod = "tap" | "ribbon-cut" | "shake";

// ─── Mini-Games (Screen 10D) ──────────────────────────
/** Type of mini-game for bonus gifts. */
export type MiniGameType = "spin-wheel" | "lucky-draw";

/** A single reward item that can be won from a mini-game. */
export interface RewardItem {
  id: string;
  label: string;
  emoji: string;
  description: string;
  probability: number;
}

/** Configuration for the mini-game in the gift chapter. */
export interface MiniGameConfig {
  type: MiniGameType;
  attempts: number;
  items: RewardItem[];
}

// ─── Material Themes (Interactive Mode) ────────────────
/** The visual theme set for materials in interactive mode. */
export type MaterialTheme =
  | "chocolates"
  | "flowers"
  | "stars"
  | "hearts"
  | "balloons"
  | "books"
  | "presents"
  | "butterflies"
  | "fireflies";

/** A single material that flies out of the gift box in interactive mode. */
export interface MaterialItem {
  theme: MaterialTheme;
  chapterIndex: ChapterIndex;
  label: string;
  emoji: string;
}

// ─── Phase Order ───────────────────────────────────────
/** The fixed order of experience phases for the slide-by-slide flow. */
export const PHASE_ORDER: ExperiencePhase[] = [
  "introduction",
  "start",
  "gift-opening",
  "chapters",
  "closing",
];

/** Get the next phase in the sequence, or null if at the end. */
export const getNextPhase = (current: ExperiencePhase): ExperiencePhase | null => {
  const index = PHASE_ORDER.indexOf(current);
  return index < PHASE_ORDER.length - 1 ? PHASE_ORDER[index + 1] : null;
};

/** Get the previous phase in the sequence, or null if at the start. */
export const getPrevPhase = (current: ExperiencePhase): ExperiencePhase | null => {
  const index = PHASE_ORDER.indexOf(current);
  return index > 0 ? PHASE_ORDER[index - 1] : null;
};