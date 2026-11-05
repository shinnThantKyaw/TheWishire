import type { ChapterIndex } from "@/types/experience";
import { TOTAL_CHAPTERS } from "@/types/experience";

// ─── State ──────────────────────────────────────────────

export interface InteractiveState {
  /** Material currently open in the overlay, or null when at the grid. */
  active: ChapterIndex | null;
  /**
   * Which materials count as opened. Index 5 (gift) only turns true on
   * "gift-finish" — opening the gift overlay is not finishing it.
   */
  opened: boolean[];
}

export type InteractiveAction =
  | { type: "open"; index: ChapterIndex }
  | { type: "close" }
  | { type: "gift-finish" };

export const initialInteractiveState: InteractiveState = {
  active: null,
  opened: Array.from({ length: TOTAL_CHAPTERS }, () => false),
};

// ─── Selectors ──────────────────────────────────────────

/** True once every material (chapters 0-4 + finished gift) is opened. */
export const allOpened = (state: InteractiveState): boolean =>
  state.opened.every(Boolean);

// ─── Reducer ────────────────────────────────────────────

export const interactiveReducer = (
  state: InteractiveState,
  action: InteractiveAction,
): InteractiveState => {
  switch (action.type) {
    case "open": {
      const opened = [...state.opened];
      // Gift opens its overlay but stays "unopened" until finished
      if (action.index !== TOTAL_CHAPTERS - 1) {
        opened[action.index] = true;
      }
      return { ...state, active: action.index, opened };
    }
    case "close":
      return { ...state, active: null };
    case "gift-finish": {
      const opened = [...state.opened];
      opened[TOTAL_CHAPTERS - 1] = true;
      return { ...state, opened };
    }
  }
};
