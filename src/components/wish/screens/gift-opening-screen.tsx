"use client";

import { ScreenPlaceholder } from "./screen-placeholder";

interface GiftOpeningScreenProps {
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
}

/**
 * Screen 5: Gift Box Opening.
 * THE peak moment — box opens with confetti, materials fly out.
 *
 * In Phase 2.3, this will get:
 * - Lid flies off with 3D rotation
 * - MASSIVE confetti burst (canvas-confetti)
 * - 5 material items spring out with physics
 * - Music volume increases
 * - Auto-transition to chapters after materials settle
 */
export const GiftOpeningScreen = ({
  onNext,
  onBack,
  primaryColor = "#E91E63",
}: GiftOpeningScreenProps) => {
  return (
    <ScreenPlaceholder
      screenNumber={5}
      name="Gift Box Opening"
      subtitle="The box opens with a celebration burst!"
      emoji="🎊"
      onNext={onNext}
      onBack={onBack}
      canGoBack
      primaryColor={primaryColor}
    />
  );
};
