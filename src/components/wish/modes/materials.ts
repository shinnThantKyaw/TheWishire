import { copy } from "@/config/copy";
import type { ChapterIndex } from "@/types/experience";

/** One tappable material on the interactive grid. */
export interface MaterialDescriptor {
  chapterIndex: ChapterIndex;
  emoji: string;
  /** Card label — sourced from copy.ts so i18n stays centralized. */
  label: string;
}

const EMOJI: Record<string, string> = {
  letter: "💌",
  photos: "📷",
  poem: "📖",
  song: "🎵",
  timeline: "⏰",
  gift: "🎁",
};

const LABELS = copy.modes.interactive.materials;

/**
 * The six materials (one per chapter) in chapter order — gift last so the
 * finale sits at the natural end of the grid.
 */
export const MATERIALS: MaterialDescriptor[] = (
  [
    ["letter", 0],
    ["photos", 1],
    ["poem", 2],
    ["song", 3],
    ["timeline", 4],
    ["gift", 5],
  ] as Array<[keyof typeof LABELS, ChapterIndex]>
).map(([id, chapterIndex]) => ({
  chapterIndex,
  emoji: EMOJI[id],
  label: LABELS[id],
}));
