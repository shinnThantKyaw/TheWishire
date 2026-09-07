"use client";

import { ScreenPlaceholder } from "../screens/screen-placeholder";
import type { PoemSelection } from "@/types/wish";

interface PoemChapterProps {
  poem?: PoemSelection;
  primaryColor?: string;
}

/**
 * Screen 8: Poem Chapter.
 * Beautiful typographic layout with line-by-line animation.
 *
 * In Phase 2.4, this will get:
 * - Centered typography with generous line-height
 * - Line-by-line fade-in animation
 * - Decorative quotation marks
 * - Author attribution
 */
export const PoemChapter = ({
  poem,
  primaryColor = "#E91E63",
}: PoemChapterProps) => {
  return (
    <ScreenPlaceholder
      screenNumber={8}
      name="Poem"
      subtitle={poem ? `"${poem.title}" by ${poem.author}` : "No poem provided"}
      emoji="📖"
      primaryColor={primaryColor}
    />
  );
};
