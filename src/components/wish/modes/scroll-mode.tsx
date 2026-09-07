"use client";

import type { MergedStage } from "@/types/wish";

interface ScrollModeProps {
  stages: MergedStage[];
  primaryColor: string;
  onComplete: () => void;
}

/**
 * Scroll mode container.
 * All chapters rendered as full-width sections in a continuous scroll.
 *
 * In Phase 2.6, this will get:
 * - Scroll-triggered animations via useInView
 * - Sticky progress bar
 * - Parallax effects between sections
 * - Background gradient transitions
 */
export const ScrollMode = ({ stages, primaryColor, onComplete }: ScrollModeProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
        style={{
          backgroundColor: `${primaryColor}15`,
          color: primaryColor,
        }}
      >
        Scroll Mode
      </div>
      <p className="mt-4 text-center text-sm" style={{ opacity: 0.6 }}>
        Continuous scroll with all chapters visible.
        <br />
        Coming in Phase 2.6.
      </p>
      <button
        onClick={onComplete}
        className="mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
        }}
      >
        Skip to Closing →
      </button>
    </div>
  );
};
