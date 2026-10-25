"use client";

import { motion } from "motion/react";

import { copy, interpolate } from "@/config/copy";

interface ScreenPlaceholderProps {
  screenNumber: number;
  name: string;
  subtitle: string;
  emoji: string;
  onNext?: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  primaryColor?: string;
  children?: React.ReactNode;
}

/**
 * Shared placeholder for all screens during Phase 2.1 (skeleton).
 * Each screen shows its number, name, and navigation buttons.
 * Will be replaced with real content in later phases.
 */
export const ScreenPlaceholder = ({
  screenNumber,
  name,
  subtitle,
  emoji,
  onNext,
  onBack,
  canGoBack = false,
  primaryColor = "#E91E63",
  children,
}: ScreenPlaceholderProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Screen number badge */}
        <div
          className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
        >
          {interpolate(copy.screenPlaceholder.screen, { n: screenNumber })}
        </div>

        {/* Emoji */}
        <div className="mb-4 text-5xl">{emoji}</div>

        {/* Title */}
        <h2
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          }}
        >
          {name}
        </h2>

        {/* Subtitle */}
        <p
          className="mt-2 max-w-xs text-sm leading-relaxed"
          style={{ opacity: 0.6 }}
        >
          {subtitle}
        </p>

        {/* Optional children content (for custom placeholder content) */}
        {children && <div className="mt-6">{children}</div>}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center gap-3">
          {canGoBack && onBack && (
            <motion.button
              onClick={onBack}
              className="rounded-full border px-5 py-2.5 text-sm font-medium"
              style={{
                borderColor: `${primaryColor}30`,
                color: primaryColor,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copy.screenPlaceholder.back}
            </motion.button>
          )}

          {onNext && (
            <motion.button
              onClick={onNext}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                boxShadow: `0 4px 16px ${primaryColor}40`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copy.common.nextArrow}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
