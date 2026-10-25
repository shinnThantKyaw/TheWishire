"use client";

import { copy } from "@/config/copy";
import type { MergedStage } from "@/types/wish";

interface InteractiveModeProps {
  stages: MergedStage[];
  primaryColor: string;
  onComplete: () => void;
}

/**
 * Interactive mode container.
 * Materials fly out of the box; tap each to open its chapter.
 *
 * In Phase 2.6, this will get:
 * - 5 material items displayed as themed objects
 * - Tap to zoom/open chapter content
 * - Opened materials get golden glow tracking
 * - Auto-transition to closing after all 5 opened
 */
export const InteractiveMode = ({ stages, primaryColor, onComplete }: InteractiveModeProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
        style={{
          backgroundColor: `${primaryColor}15`,
          color: primaryColor,
        }}
      >
        {copy.modes.interactive.title}
      </div>
      <p className="mt-4 text-center text-sm" style={{ opacity: 0.6 }}>
        {copy.modes.interactive.description}
        <br />
        {copy.modes.interactive.coming}
      </p>

      {/* Placeholder material items */}
      <div className="mt-6 flex gap-3">
        {["💌", "📷", "📖", "⏰", "🎁"].map((emoji, i) => (
          <div
            key={i}
            className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
            style={{
              backgroundColor: `${primaryColor}10`,
              border: `1px solid ${primaryColor}20`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
        }}
      >
        {copy.modes.skipToClosing}
      </button>
    </div>
  );
};
