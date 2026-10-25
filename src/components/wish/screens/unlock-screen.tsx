"use client";

import { ScreenPlaceholder } from "./screen-placeholder";
import type { GateType } from "@/types/experience";
import { copy } from "@/config/copy";

interface UnlockScreenProps {
  gateType: GateType;
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
}

/**
 * Screen 2: Surprise Unlock.
 * Interactive lock/ribbon/seal that the recipient must interact with.
 *
 * In Phase 2.2, this will get:
 * - 4 gate variants (padlock, ribbon, wax-seal, chain)
 * - 3D CSS lock with interactive animations
 * - Dark mysterious background with ambient glow
 * - Auto-advance after unlock animation
 */
export const UnlockScreen = ({
  gateType,
  onNext,
  onBack,
  primaryColor = "#E91E63",
}: UnlockScreenProps) => {
  const gate = copy.unlock.gates[gateType];

  return (
    <ScreenPlaceholder
      screenNumber={2}
      name={copy.unlock.screenName}
      subtitle={gate.hint}
      emoji={gate.emoji}
      onNext={onNext}
      onBack={onBack}
      canGoBack
      primaryColor={primaryColor}
    />
  );
};
