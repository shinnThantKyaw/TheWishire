"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MergedStage, CharacterGifConfig, DecorationConfig, FlowMode } from "@/types/wish";
import type { ThemeConfig } from "@/types/template";
import {
  EnvelopeStage,
  GiftBoxStage,
  CakeStage,
  MainContentStage,
  MemoryTimelineStage,
  ClosingStage,
} from "./stages";
import { FancyFactsStage } from "./stages/fancy-facts-stage";
import { MusicPlayer } from "./music-player";
import { CharacterGif } from "./character-gif";
import { Decorations } from "./decorations";
import { NavigationControls } from "./navigation-controls";

interface WishExperienceProps {
  stages: MergedStage[];
  theme: ThemeConfig;
  senderName: string;
  recipientName: string;
  flowMode?: FlowMode;
  musicUrl?: string;
  characterGif?: CharacterGifConfig;
  decorations?: DecorationConfig;
}

/** Converts theme colors to CSS custom properties on the root container */
const themeToCSSVars = (theme: ThemeConfig): React.CSSProperties =>
  ({
    "--wish-primary": theme.colors.primary,
    "--wish-secondary": theme.colors.secondary,
    "--wish-accent": theme.colors.accent,
    "--wish-background": theme.colors.background,
    "--wish-foreground": theme.colors.foreground,
    "--wish-font-heading": theme.fonts.heading,
    "--wish-font-body": theme.fonts.body,
  }) as React.CSSProperties;

/**
 * WishExperience — the main orchestrator for the recipient wish viewing flow.
 *
 * Supports three flow modes:
 * - "scroll" (default): stages advance on tap/click, content scrolls within stages
 * - "buttons": prev/next navigation controls at bottom, stages advance via buttons
 * - "tap-to-reveal": elements within stages start hidden, tap each to reveal
 */
export const WishExperience = ({
  stages,
  theme,
  senderName,
  recipientName,
  flowMode = "scroll",
  musicUrl,
  characterGif,
  decorations,
}: WishExperienceProps) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const currentStage = stages[currentStageIndex];
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === stages.length - 1;
  const showProgress = stages.length > 1;
  const isButtonMode = flowMode === "buttons";

  const handleAdvance = useCallback(() => {
    setCurrentStageIndex((prev) => Math.min(prev + 1, stages.length - 1));
  }, [stages.length]);

  const handlePrev = useCallback(() => {
    setCurrentStageIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStageIndex(0);
  }, []);

  if (!currentStage) return null;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        ...themeToCSSVars(theme),
        backgroundColor: theme.colors.background,
        fontFamily: `var(--wish-font-body), Inter, sans-serif`,
      }}
    >
      {/* ── Overlays ────────────────────────────────── */}

      {/* Background music */}
      {musicUrl && <MusicPlayer src={musicUrl} hasBottomNav={isButtonMode} />}

      {/* Character GIF */}
      {characterGif && <CharacterGif {...characterGif} />}

      {/* Floating decorations */}
      {decorations && decorations.elements.length > 0 && (
        <Decorations config={decorations} />
      )}

      {/* ── Header ──────────────────────────────────── */}

      {/* Progress dots (scroll & tap-to-reveal) or progress bar (buttons) */}
      {showProgress && !isButtonMode && (
        <div className="fixed left-0 right-0 top-6 z-50 flex justify-center gap-2">
          {stages.map((stage, index) => {
            const isActive = index === currentStageIndex;
            const isPast = index < currentStageIndex;

            return (
              <motion.div
                key={`${stage.type}-${index}`}
                className="h-2 rounded-full"
                animate={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isPast || isActive
                    ? theme.colors.primary
                    : theme.colors.secondary,
                  opacity: isPast ? 0.5 : isActive ? 1 : 0.25,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            );
          })}
        </div>
      )}

      {/* Progress bar for button mode */}
      {isButtonMode && showProgress && (
        <div className="fixed left-0 right-0 top-0 z-50">
          <div className="h-1 w-full" style={{ backgroundColor: `${theme.colors.secondary}30` }}>
            <motion.div
              className="h-full"
              style={{ backgroundColor: theme.colors.primary }}
              animate={{
                width: `${((currentStageIndex + 1) / stages.length) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
        </div>
      )}

      {/* Recipient name */}
      <div className="fixed left-0 right-0 top-14 z-40 text-center">
        <p
          className="text-sm font-medium"
          style={{ color: theme.colors.foreground, opacity: 0.45 }}
        >
          For {recipientName}
        </p>
      </div>

      {/* ── Stage content ───────────────────────────── */}

      <AnimatePresence mode="wait">
        <StageRenderer
          key={currentStage.type}
          stage={currentStage}
          senderName={senderName}
          flowMode={flowMode}
          onAdvance={handleAdvance}
        />
      </AnimatePresence>

      {/* ── Bottom controls ─────────────────────────── */}

      {/* Button mode: navigation controls */}
      {isButtonMode && !isLastStage && (
        <NavigationControls
          onPrev={handlePrev}
          onNext={handleAdvance}
          isFirst={isFirstStage}
          isLast={isLastStage}
          primaryColor={theme.colors.primary}
        />
      )}

      {/* Restart button (scroll & tap-to-reveal modes, on last stage) */}
      {!isButtonMode && isLastStage && (
        <motion.button
          onClick={handleRestart}
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full px-6 py-2.5 text-xs font-medium backdrop-blur-sm"
          style={{
            backgroundColor: `${theme.colors.primary}15`,
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.primary}30`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↺ Watch again
        </motion.button>
      )}
    </div>
  );
};

/**
 * StageRenderer — maps a MergedStage to the appropriate stage component.
 * Receives flowMode so stages can adjust their internal layout.
 */
const StageRenderer = ({
  stage,
  senderName,
  flowMode,
  onAdvance,
}: {
  stage: MergedStage;
  senderName: string;
  flowMode: FlowMode;
  onAdvance: () => void;
}) => {
  switch (stage.type) {
    case "envelope":
      return (
        <EnvelopeStage
          prompt={stage.props.prompt as string | undefined}
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "gift-box":
      return (
        <GiftBoxStage
          style={stage.props.style as string | undefined}
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "cake":
      return (
        <CakeStage
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "main-content":
    case "letter":
      return (
        <MainContentStage
          letter={stage.content.letter}
          poem={stage.content.poem}
          photos={stage.content.photos}
          showLetter={(stage.props.showLetter as boolean) ?? true}
          showPhotos={(stage.props.showPhotos as boolean) ?? true}
          flowMode={flowMode}
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "poem-display":
      return (
        <MainContentStage
          poem={stage.content.poem}
          photos={[]}
          showLetter={false}
          showPhotos={false}
          flowMode={flowMode}
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "photo-gallery":
      return (
        <MainContentStage
          photos={stage.content.photos}
          showLetter={false}
          showPhotos={true}
          flowMode={flowMode}
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "memory-timeline":
      return (
        <MemoryTimelineStage
          entries={stage.content.memoryTimeline ?? []}
          flowMode={flowMode}
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "fancy-facts":
      return (
        <FancyFactsStage
          flowMode={flowMode}
          animation={stage.animation}
          onAdvance={onAdvance}
        />
      );

    case "closing":
      return (
        <ClosingStage
          senderName={senderName}
          style={stage.props.style as string | undefined}
          animation={stage.animation}
        />
      );

    // Stages not yet implemented — render a skip placeholder
    case "ribbon":
    case "video-player":
    case "voice-message":
    case "music-player":
    case "gift-challenge":
    case "spin-wheel":
    default:
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <p className="text-4xl">🚧</p>
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: "var(--wish-foreground, #1A1A2E)", opacity: 0.6 }}
            >
              This stage is coming soon
            </p>
            <motion.button
              onClick={onAdvance}
              className="mt-6 rounded-full px-8 py-3 text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, var(--wish-primary, #E91E63), var(--wish-accent, #FF80AB))",
                boxShadow: "0 4px 16px rgba(233, 30, 99, 0.3)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skip →
            </motion.button>
          </motion.div>
        </div>
      );
  }
};
