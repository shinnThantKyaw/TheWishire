"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StageContainer, StaggeredContainer, RevealChild } from "../stage-container";
import { RevealWrapper } from "../reveal-wrapper";
import { copy } from "@/config/copy";
import type { AnimationConfig } from "@/types/template";
import type { PoemSelection, FlowMode } from "@/types/wish";

interface MainContentStageProps {
  letter?: string;
  poem?: PoemSelection;
  photos: { id: string; url: string; type: "photo" }[];
  showLetter?: boolean;
  showPhotos?: boolean;
  flowMode?: FlowMode;
  animation?: AnimationConfig;
  onAdvance: () => void;
}

/**
 * MainContentStage — the heart of the wish experience.
 *
 * Displays the personalized letter on a paper-textured card,
 * photos in a beautiful grid, and optional poem with elegant typography.
 *
 * Flow modes:
 * - "scroll": everything renders at once, user scrolls
 * - "buttons": same layout but no Continue button (parent provides nav)
 * - "tap-to-reveal": each element starts hidden, tap to reveal
 */
export const MainContentStage = ({
  letter,
  poem,
  photos,
  showLetter = true,
  showPhotos = true,
  flowMode = "scroll",
  animation,
  onAdvance,
}: MainContentStageProps) => {
  const [letterOpen, setLetterOpen] = useState(false);
  const hasLetter = showLetter && letter;
  const hasPhotos = showPhotos && photos.length > 0;
  const hasPoem = poem;
  const isTapToReveal = flowMode === "tap-to-reveal";
  const isButtonMode = flowMode === "buttons";

  return (
    <StageContainer animation={animation} className="flex-col px-4 sm:px-6">
      <StaggeredContainer
        className="mx-auto w-full max-w-2xl space-y-8 py-12"
        staggerDelay={0.12}
      >
        {/* ── Letter card with fold/unfold ─────────── */}
        {hasLetter && (
          <RevealChild>
            <LetterCard
              letter={letter}
              isOpen={letterOpen}
              onToggle={() => setLetterOpen(!letterOpen)}
              isTapToReveal={isTapToReveal}
            />
          </RevealChild>
        )}

        {/* ── Poem ──────────────────────────────────── */}
        {hasPoem && (
          isTapToReveal ? (
            <RevealWrapper hint={copy.reveal.poem}>
              <PoemCard poem={poem} />
            </RevealWrapper>
          ) : (
            <RevealChild>
              <PoemCard poem={poem} />
            </RevealChild>
          )
        )}

        {/* ── Photo grid ────────────────────────────── */}
        {hasPhotos && (
          isTapToReveal ? (
            <RevealWrapper hint={copy.reveal.photos}>
              <PhotoGrid photos={photos} />
            </RevealWrapper>
          ) : (
            <RevealChild>
              <PhotoGrid photos={photos} />
            </RevealChild>
          )
        )}

        {/* ── Continue button (only in scroll mode) ─── */}
        {!isButtonMode && (
          <RevealChild>
            <div className="pt-6 text-center">
              <motion.button
                onClick={onAdvance}
                className="relative overflow-hidden rounded-full px-10 py-3.5 text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, var(--wish-primary, #E91E63), var(--wish-accent, #FF80AB))",
                  boxShadow: "0 4px 16px rgba(233, 30, 99, 0.3)",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {copy.common.continue}
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
          </RevealChild>
        )}
      </StaggeredContainer>
    </StageContainer>
  );
};

// ── Sub-components ────────────────────────────────────

/** Foldable letter card */
const LetterCard = ({
  letter,
  isOpen,
  onToggle,
  isTapToReveal,
}: {
  letter: string;
  isOpen: boolean;
  onToggle: () => void;
  isTapToReveal: boolean;
}) => {
  const letterContent = (
    <div
      className="relative overflow-hidden rounded-2xl p-8 sm:p-10"
      style={{
        background: "linear-gradient(135deg, #FFFBF0 0%, #FFF8E8 50%, #FFF5E0 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Left accent line */}
      <div
        className="absolute left-0 top-6 bottom-6 w-1 rounded-full"
        style={{ backgroundColor: "var(--wish-primary, #E91E63)" }}
      />

      {/* Foldable letter */}
      <motion.div
        animate={{
          height: isOpen ? "auto" : 100,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="overflow-hidden"
      >
        <p
          className="relative whitespace-pre-wrap text-lg leading-relaxed sm:text-xl"
          style={{
            color: "#3E2723",
            fontFamily: "var(--wish-font-body), Georgia, serif",
          }}
        >
          {letter}
        </p>
      </motion.div>

      {/* Fold / unfold toggle */}
      <motion.button
        onClick={onToggle}
        className="mt-3 flex w-full items-center justify-center gap-1 text-xs font-medium"
        style={{ color: "var(--wish-primary, #E91E63)", opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 0.97 }}
      >
        {isOpen ? (
          <>
            {copy.stages.mainContent.foldLetter}
            <motion.span animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              ▲
            </motion.span>
          </>
        ) : (
          <>
            {copy.stages.mainContent.openLetter}
            <motion.span animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
              ▼
            </motion.span>
          </>
        )}
      </motion.button>
    </div>
  );

  if (isTapToReveal) {
    return (
      <RevealWrapper hint={copy.reveal.letter}>
        {letterContent}
      </RevealWrapper>
    );
  }

  return letterContent;
};

/** Poem card */
const PoemCard = ({ poem }: { poem: PoemSelection }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-8 text-center sm:p-10"
    style={{
      background: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)",
      boxShadow: "0 4px 20px rgba(233, 30, 99, 0.08)",
    }}
  >
    <p
      className="whitespace-pre-wrap text-lg italic leading-relaxed sm:text-xl"
      style={{
        color: "#4A148C",
        fontFamily: "var(--wish-font-heading), Georgia, serif",
      }}
    >
      {poem.text}
    </p>
    <div className="mt-5 flex items-center justify-center gap-2">
      <div className="h-px w-8 bg-purple-300" />
      <p className="text-sm font-medium text-purple-400">
        {poem.author}
      </p>
      <div className="h-px w-8 bg-purple-300" />
    </div>
  </div>
);

/** Photo grid */
const PhotoGrid = ({
  photos,
}: {
  photos: { id: string; url: string; type: "photo" }[];
}) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {photos.map((photo, index) => (
      <motion.div
        key={photo.id}
        className="group relative overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.5 + index * 0.1,
        }}
        whileHover={{ scale: 1.02 }}
      >
        <div
          className="h-52 overflow-hidden sm:h-60"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={`Memory ${index + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.div>
    ))}
  </div>
);
