"use client";

import { ScreenPlaceholder } from "./screen-placeholder";
import type { GateType } from "@/types/experience";

interface UnlockScreenProps {
  gateType: GateType;
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
}

const GATE_LABELS: Record<GateType, { emoji: string; hint: string }> = {
  padlock: { emoji: "🔒", hint: "Tap to unlock" },
  ribbon: { emoji: "🎀", hint: "Cut the ribbon" },
  "wax-seal": { emoji: "🔮", hint: "Break the seal" },
  chain: { emoji: "⛓️", hint: "Break the chain" },
};

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
  const gate = GATE_LABELS[gateType];

  return (
    <ScreenPlaceholder
      screenNumber={2}
      name="Surprise Unlock"
      subtitle={gate.hint}
      emoji={gate.emoji}
      onNext={onNext}
      onBack={onBack}
      canGoBack
      primaryColor={primaryColor}
    />
  );
};
