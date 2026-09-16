"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useExperienceState } from "@/lib/experience-state";
import { normalizeFlowMode } from "@/types/experience";
import type { FlowMode, StartAction } from "@/types/experience";
import type { ThemeConfig } from "@/types/template";
import type { MergedStage, GiftChapterConfig, CharacterGifConfig, DecorationConfig } from "@/types/wish";

// ── Screens ──
import { IntroductionScreen } from "./screens/introduction-screen";
import { StartScreen } from "./screens/start-screen";
import { GiftRevealScreen } from "./screens/gift-reveal-screen";
import { GiftOpeningScreen } from "./screens/gift-opening-screen";
import { ClosingScreen } from "./screens/closing-screen";

// ── Modes ──
import { ClickThrough } from "./modes/click-through";
import { ScrollMode } from "./modes/scroll-mode";
import { InteractiveMode } from "./modes/interactive-mode";

// ── Overlays ──
import { MusicPlayer } from "./music-player";
import { CharacterGif } from "./character-gif";
import { Decorations } from "./decorations";

// ─── Props ──────────────────────────────────────────────

interface ExperienceOrchestratorProps {
  /** Render-ready stages from mergeWishWithTemplate. */
  stages: MergedStage[];
  /** Theme configuration from the template. */
  theme: ThemeConfig;
  /** Creator's name (shown in closing). */
  senderName: string;
  /** Recipient's name (shown in introduction, etc.). */
  recipientName: string;
  /** The occasion (birthday, anniversary, etc.). */
  occasion: string;
  /** How chapters are navigated. */
  flowMode: FlowMode;
  /** Background music URL. */
  musicUrl?: string;
  /** Character GIF overlay config. */
  characterGif?: CharacterGifConfig;
  /** Floating decoration config. */
  decorations?: DecorationConfig;
  /** Start action for Screen 2. Defaults to tap. */
  startAction?: StartAction;
  /** Gift chapter configuration for Screen 10. */
  giftConfig?: GiftChapterConfig;
}

// ─── Theme Helpers ──────────────────────────────────────

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

// ─── Default Actions ───────────────────────────────────

const getDefaultStartAction = (occasion: string): StartAction => {
  switch (occasion) {
    case "birthday":
      return { type: "candles", count: 3 };
    case "anniversary":
    case "valentine":
      return { type: "yes-no", prompt: "Are you ready to see your surprise? 💕" };
    default:
      return { type: "tap", prompt: "Tap to reveal your surprise! 🎁" };
  }
};

// ─── Component ──────────────────────────────────────────

/**
 * ExperienceOrchestrator — the main client-side component for the recipient
 * surprise experience. Manages the 11-screen flow via a hierarchical state
 * machine and renders the correct screen/mode for each phase.
 *
 * This replaces the old WishExperience component.
 */
export const ExperienceOrchestrator = ({
  stages,
  theme,
  senderName,
  recipientName,
  occasion,
  flowMode = "click-through",
  musicUrl,
  characterGif,
  decorations,
  startAction,
  giftConfig,
}: ExperienceOrchestratorProps) => {
  // Normalize legacy flowMode values ("buttons" → "click-through", "tap-to-reveal" → "interactive")
  const normalizedFlowMode = normalizeFlowMode(flowMode);
  const { state, actions } = useExperienceState(normalizedFlowMode);
  const primaryColor = theme.colors.primary;

  // Resolve defaults
  const resolvedStartAction = useMemo(
    () => startAction ?? getDefaultStartAction(occasion),
    [startAction, occasion],
  );

  // ── Render current screen ───────────────────────

  const renderScreen = () => {
    switch (state.phase) {
      // ── Common Beginning (Screens 1-5) ──

      case "introduction":
        return (
          <IntroductionScreen
            recipientName={recipientName}
            senderName={senderName}
            occasion={occasion}
            onNext={actions.next}
            primaryColor={theme.colors.primary}
            secondaryColor={theme.colors.secondary}
            backgroundColor={theme.colors.background}
            foregroundColor={theme.colors.foreground}
          />
        );

      case "start":
        return (
          <StartScreen
            recipientName={recipientName}
            senderName={senderName}
            startAction={resolvedStartAction}
            onNext={actions.next}
            onBack={actions.back}
            primaryColor={theme.colors.primary}
            secondaryColor={theme.colors.secondary}
            backgroundColor={theme.colors.background}
            foregroundColor={theme.colors.foreground}
          />
        );

      case "gift-reveal":
        return (
          <GiftRevealScreen
            onNext={actions.next}
            onBack={actions.back}
            primaryColor={theme.colors.primary}
            secondaryColor={theme.colors.secondary}
            backgroundColor={theme.colors.background}
            foregroundColor={theme.colors.foreground}
          />
        );

      case "gift-opening":
        return (
          <GiftOpeningScreen
            onNext={actions.next}
            onBack={actions.back}
            recipientName={recipientName}
            occasion={occasion}
            senderName={senderName}
            primaryColor={theme.colors.primary}
            secondaryColor={theme.colors.secondary}
            backgroundColor={theme.colors.background}
            foregroundColor={theme.colors.foreground}
          />
        );

      // ── Chapters (Screens 6-10) ──

      case "chapters":
        switch (normalizedFlowMode) {
          case "click-through":
            return (
              <ClickThrough
                chapterIndex={state.chapterIndex}
                giftSubScreen={state.giftSubScreen}
                stages={stages}
                giftConfig={giftConfig}
                primaryColor={primaryColor}
                onNext={actions.next}
                onBack={actions.back}
                onNextGiftSubScreen={actions.nextGiftSubScreen}
              />
            );
          case "scroll":
            return (
              <ScrollMode
                stages={stages}
                primaryColor={primaryColor}
                onComplete={actions.next}
              />
            );
          case "interactive":
            return (
              <InteractiveMode
                stages={stages}
                primaryColor={primaryColor}
                onComplete={actions.next}
              />
            );
        }
        break;

      // ── Closing (Screen 11) ──

      case "closing":
        return (
          <ClosingScreen
            senderName={senderName}
            onRestart={actions.restart}
            primaryColor={theme.colors.primary}
            secondaryColor={theme.colors.secondary}
            backgroundColor={theme.colors.background}
            foregroundColor={theme.colors.foreground}
          />
        );
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        ...themeToCSSVars(theme),
        backgroundColor: theme.colors.background,
        fontFamily: `var(--wish-font-body), Inter, sans-serif`,
      }}
    >
      {/* ── Overlays ──────────────────────────────── */}
      {musicUrl && (
        <MusicPlayer
          src={musicUrl}
          startPlaying={state.phase !== "introduction"}
          hasBottomNav={state.phase === "chapters" && normalizedFlowMode === "click-through"}
        />
      )}
      {characterGif && state.phase !== "introduction" && (
        <CharacterGif {...characterGif} />
      )}
      {decorations && decorations.elements.length > 0 && state.phase !== "introduction" && (
        <Decorations config={decorations} />
      )}

      {/* ── Progress Bar (all phases) ─────────────── */}
      <div className="fixed left-0 right-0 top-0 z-50">
        <div
          className="h-1 w-full"
          style={{ backgroundColor: `${theme.colors.secondary}30` }}
        >
          <motion.div
            className="h-full"
            style={{ backgroundColor: theme.colors.primary }}
            animate={{ width: `${state.progress * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      {/* ── Screen Content ────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${state.phase}-${state.chapterIndex}-${state.giftSubScreen}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-screen w-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
