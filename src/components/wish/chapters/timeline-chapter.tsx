"use client";

import { ScreenPlaceholder } from "../screens/screen-placeholder";
import type { MemoryTimelineEntry } from "@/types/wish";

interface TimelineChapterProps {
  entries: MemoryTimelineEntry[];
  primaryColor?: string;
}

/**
 * Screen 9: Memory Timeline Chapter.
 * Vertical timeline with animated line drawing and staggered cards.
 *
 * In Phase 2.4, this will get:
 * - Animated vertical timeline line
 * - Cards with dates, titles, descriptions
 * - Optional photos per card
 * - Staggered cascade entrance
 */
export const TimelineChapter = ({
  entries,
  primaryColor = "#E91E63",
}: TimelineChapterProps) => {
  return (
    <ScreenPlaceholder
      screenNumber={9}
      name="Memory Timeline"
      subtitle={`${entries.length} moment${entries.length !== 1 ? "s" : ""} in your journey`}
      emoji="⏰"
      primaryColor={primaryColor}
    />
  );
};
