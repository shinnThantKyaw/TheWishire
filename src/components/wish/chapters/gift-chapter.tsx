"use client";

import { ScreenPlaceholder } from "../screens/screen-placeholder";
import type { GiftSubScreen } from "@/types/experience";
import type { GiftChapterConfig } from "@/types/wish";

interface GiftChapterProps {
  giftSubScreen: GiftSubScreen;
  config?: GiftChapterConfig;
  onNextSubScreen: () => void;
  primaryColor?: string;
}

const SUB_SCREEN_INFO: Record<GiftSubScreen, { emoji: string; name: string; subtitle: string }> = {
  challenge: {
    emoji: "🔐",
    name: "Gift Challenge",
    subtitle: "Complete the challenge to open your gift",
  },
  "main-gift": {
    emoji: "🎁",
    name: "Main Gift",
    subtitle: "The special gift from the creator",
  },
  "bonus-intro": {
    emoji: "🎉",
    name: "Bonus Gifts",
    subtitle: "More surprises await!",
  },
  "mini-game": {
    emoji: "🎰",
    name: "Mini Game",
    subtitle: "Spin the wheel or pick a card",
  },
  "reward-result": {
    emoji: "🏆",
    name: "Reward Result",
    subtitle: "You won something!",
  },
  complete: {
    emoji: "✅",
    name: "Gifts Complete",
    subtitle: "All gifts revealed",
  },
};

/**
 * Screen 10: Gift Chapter.
 * Multi-stage sub-experience: challenge → main gift → bonus games → rewards.
 *
 * In Phase 2.5, each sub-screen will get its own component:
 * - gift-gate.tsx (challenge)
 * - main-gift-reveal.tsx (photos + message)
 * - bonus-intro.tsx (intro text)
 * - spin-wheel.tsx / lucky-draw.tsx (mini-game)
 * - reward-result.tsx (won item + ticket download)
 */
export const GiftChapter = ({
  giftSubScreen,
  onNextSubScreen,
  primaryColor = "#E91E63",
}: GiftChapterProps) => {
  const info = SUB_SCREEN_INFO[giftSubScreen];

  return (
    <ScreenPlaceholder
      screenNumber={10}
      name={info.name}
      subtitle={info.subtitle}
      emoji={info.emoji}
      onNext={giftSubScreen !== "complete" ? onNextSubScreen : undefined}
      primaryColor={primaryColor}
    />
  );
};
