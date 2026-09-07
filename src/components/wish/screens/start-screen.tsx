"use client";

import { ScreenPlaceholder } from "./screen-placeholder";
import type { StartAction } from "@/types/experience";

interface StartScreenProps {
  recipientName: string;
  senderName: string;
  startAction: StartAction;
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
}

/**
 * Screen 3: Surprise Start / Are You Ready.
 * Occasion-specific CTA page.
 *
 * In Phase 2.3, this will get:
 * - Birthday: interactive cake with tappable candles
 * - Anniversary: Yes/No buttons with playful feedback
 * - General: password input or tap prompt
 * - Warmer background tones
 */
export const StartScreen = ({
  recipientName,
  senderName,
  startAction,
  onNext,
  onBack,
  primaryColor = "#E91E63",
}: StartScreenProps) => {
  const subtitle = (() => {
    switch (startAction.type) {
      case "candles":
        return `Light the ${startAction.count} candles to start celebrating!`;
      case "yes-no":
        return startAction.prompt;
      case "password":
        return "Type the secret code to continue";
      case "tap":
        return startAction.prompt;
    }
  })();

  return (
    <ScreenPlaceholder
      screenNumber={3}
      name={`Hey ${recipientName}!`}
      subtitle={subtitle}
      emoji={
        startAction.type === "candles"
          ? "🎂"
          : startAction.type === "yes-no"
            ? "💕"
            : "🎁"
      }
      onNext={onNext}
      onBack={onBack}
      canGoBack
      primaryColor={primaryColor}
    />
  );
};
