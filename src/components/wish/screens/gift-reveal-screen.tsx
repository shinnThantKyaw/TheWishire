"use client";

import { ScreenPlaceholder } from "./screen-placeholder";
import type { BoxOpenMethod } from "@/types/experience";

interface GiftRevealScreenProps {
  boxOpenMethod: BoxOpenMethod;
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
}

const OPEN_LABELS: Record<BoxOpenMethod, string> = {
  tap: "Tap to open 💝",
  "ribbon-cut": "Cut the ribbon to open 🎀",
  shake: "Shake to open 📱",
};

/**
 * Screen 4: Gift Reveal.
 * Premium gift box appears with music starting.
 *
 * In Phase 2.3, this will get:
 * - 3D gift box with idle float animation
 * - Open method variants (tap, ribbon-cut, shake)
 * - Music starts here
 * - Sparkle highlights on ribbon
 */
export const GiftRevealScreen = ({
  boxOpenMethod,
  onNext,
  onBack,
  primaryColor = "#E91E63",
}: GiftRevealScreenProps) => {
  return (
    <ScreenPlaceholder
      screenNumber={4}
      name="Gift Reveal"
      subtitle={OPEN_LABELS[boxOpenMethod]}
      emoji="🎁"
      onNext={onNext}
      onBack={onBack}
      canGoBack
      primaryColor={primaryColor}
    />
  );
};
