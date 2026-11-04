import { GIFT_CHAPTER_INDEX, TOTAL_CHAPTERS } from "@/types/experience";
import type { ChapterIndex } from "@/types/experience";

/** One stacked section of scroll mode. */
export interface ScrollSection {
  /** Stable DOM/test id. */
  id: string;
  /** Chapter this section represents (drives progress sync). */
  chapterIndex: ChapterIndex;
  /** MergedStage type whose content feeds the chapter (absent for gift). */
  stageType?: string;
  /** True for the gift chapter (rendered as an interactive island). */
  isGift: boolean;
}

/**
 * Reading order of scroll mode — letter → photos → poem → song → timeline →
 * gift. Gift is last so finishing the island sits at the natural end of the
 * page, right above the closing card.
 */
export const SCROLL_SECTIONS: ScrollSection[] = [
  { id: "letter", chapterIndex: 0, stageType: "letter", isGift: false },
  { id: "photos", chapterIndex: 1, stageType: "photos", isGift: false },
  { id: "poem", chapterIndex: 2, stageType: "poem", isGift: false },
  { id: "song", chapterIndex: 3, stageType: "song", isGift: false },
  { id: "timeline", chapterIndex: 4, stageType: "timeline", isGift: false },
  { id: "gift", chapterIndex: GIFT_CHAPTER_INDEX, isGift: true },
];

// Sanity: TOTAL_CHAPTERS must match the descriptor list — the progress bar
// math (1/TOTAL_CHAPTERS per chapter) assumes they line up.
if (SCROLL_SECTIONS.length !== TOTAL_CHAPTERS) {
  throw new Error(
    `SCROLL_SECTIONS length ${SCROLL_SECTIONS.length} !== TOTAL_CHAPTERS ${TOTAL_CHAPTERS}`,
  );
}
