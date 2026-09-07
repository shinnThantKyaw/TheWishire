"use client";

import { ScreenPlaceholder } from "../screens/screen-placeholder";

interface LetterChapterProps {
  letter?: string;
  primaryColor?: string;
}

/**
 * Screen 6: Letter Chapter.
 * Paper-textured card with fold/unfold and typewriter animation.
 *
 * In Phase 2.4, this will get:
 * - Paper-textured card with CSS noise texture
 * - Wax seal icon at top
 * - Typewriter text animation
 * - Optional photo grid below letter
 */
export const LetterChapter = ({
  letter,
  primaryColor = "#E91E63",
}: LetterChapterProps) => {
  return (
    <ScreenPlaceholder
      screenNumber={6}
      name="Letter"
      subtitle={letter ? "A personal message for you" : "No letter provided"}
      emoji="💌"
      primaryColor={primaryColor}
    />
  );
};
