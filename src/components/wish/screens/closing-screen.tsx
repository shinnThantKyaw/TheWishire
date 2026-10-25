"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { copy, interpolate } from "@/config/copy";

interface ClosingScreenProps {
  senderName: string;
  recipientName?: string;
  occasion?: string;
  onRestart: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

/** Occasion-aware finale headline (merged from the old gift "complete" screen). */
const finaleHeadline = (occasion: string, name?: string): string => {
  const n = name?.trim();
  const headline =
    copy.closing.headlines[
      occasion.toLowerCase() as keyof typeof copy.closing.headlines
    ] ?? copy.closing.headlines.fallback;
  return n ? interpolate(headline.withName, { name: n }) : headline.plain;
};

/**
 * Screen 12: Closing — the merged finale.
 * Absorbed the gift chapter's "The End" goodbye card: occasion headline,
 * thank-you message, cinema "The End" card + confetti — then the CTAs
 * (Experience Again / Create Your Own). One end screen, not two.
 */
export const ClosingScreen = ({
  senderName,
  recipientName,
  occasion = "",
  onRestart,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: ClosingScreenProps) => {
  const reduceMotion = useReducedMotion();

  // Floating emoji particles
  const particles = useMemo(
    () =>
      Array.from({ length: reduceMotion ? 0 : 10 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 6 + Math.random() * 8,
        dur: 4 + Math.random() * 3,
        delay: Math.random() * 2,
        emoji: ["💜", "✨", "💫", "💕", "⭐"][i % 5],
      })),
    [reduceMotion],
  );

  // Golden confetti rain (from the old goodbye finale)
  const confetti = useMemo(
    () =>
      Array.from({ length: reduceMotion ? 0 : 30 }).map((_, i) => ({
        id: i,
        x: 3 + ((i * 13) % 94),
        delay: (i % 12) * 0.3,
        duration: 3.5 + (i % 5) * 0.6,
        size: 4 + (i % 4) * 2,
        color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? primaryColor : secondaryColor,
        drift: ((i % 7) - 3) * 8,
      })),
    [reduceMotion, primaryColor, secondaryColor],
  );

  // Twinkling stars
  const stars = useMemo(
    () =>
      Array.from({ length: reduceMotion ? 0 : 8 }).map((_, i) => ({
        id: i,
        x: 5 + ((i * 17) % 90),
        y: 8 + ((i * 23) % 60),
        delay: i * 0.4,
        size: 8 + (i % 3) * 4,
      })),
    [reduceMotion],
  );

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ backgroundColor }}
      role="status"
      aria-live="polite"
    >
      {/* Falling confetti rain */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute top-0"
            style={{
              left: `${c.x}%`,
              width: c.size,
              height: c.size * 1.6,
              backgroundColor: c.color,
              borderRadius: "1px",
            }}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{
              y: "105dvh",
              x: c.drift,
              opacity: [0, 1, 1, 0],
              rotate: 540,
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
          />
        ))}
      </div>

      {/* Twinkling stars */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {stars.map((s) => (
          <motion.span
            key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.size, color: "#FFD700" }}
            animate={reduceMotion ? {} : { opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.2, delay: s.delay, repeat: Infinity }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* Floating emoji particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none fixed text-sm"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Pulsing heart */}
        <motion.div
          className="mb-5 text-5xl sm:text-6xl"
          animate={reduceMotion ? {} : { scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          💖
        </motion.div>

        {/* Occasion-aware headline */}
        <h2
          className="mb-3 text-2xl font-bold leading-tight sm:text-3xl"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            color: foregroundColor,
          }}
        >
          {finaleHeadline(occasion, recipientName)}
        </h2>

        {/* Decorative divider */}
        <div className="mb-4 flex items-center gap-2" aria-hidden="true">
          <span className="h-px w-10" style={{ background: `${primaryColor}50` }} />
          <span className="text-sm" style={{ color: primaryColor }}>
            ❤
          </span>
          <span className="h-px w-10" style={{ background: `${primaryColor}50` }} />
        </div>

        {/* Thank-you message */}
        <p
          className="mb-5 max-w-sm text-sm leading-relaxed sm:text-base"
          style={{ color: foregroundColor, opacity: 0.7 }}
        >
          {copy.closing.thankYou}
        </p>

        {/* THE END cinema card */}
        <motion.div
          className="mb-6 rounded-lg px-6 py-3"
          style={{
            border: `1px solid ${primaryColor}30`,
            background: `${primaryColor}08`,
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.35em]"
            style={{ color: primaryColor }}
          >
            {copy.closing.theEnd}
          </p>
        </motion.div>

        {/* Branding — sender attribution from old closing + Wishire mark */}
        <p
          className="text-xs"
          style={{ color: foregroundColor, opacity: 0.45 }}
        >
          {senderName && (
            <>
              {copy.closing.withLoveFrom}{" "}
              <span className="font-bold not-italic" style={{ color: primaryColor }}>
                {senderName}
              </span>
              <br />
            </>
          )}
          {copy.closing.madeWithLoveBy}{" "}
          <span className="font-bold" style={{ color: primaryColor }}>
            Wishire
          </span>
        </p>

        {/* Divider */}
        <div
          className="mx-auto my-6 h-px"
          style={{
            width: 50,
            background: `linear-gradient(90deg, transparent, ${primaryColor}30, transparent)`,
          }}
        />

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onRestart}
            className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              boxShadow: `0 4px 16px ${primaryColor}30`,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {copy.closing.experienceAgain}
          </motion.button>

          <motion.a
            href="/"
            className="rounded-full border px-8 py-3 text-sm font-semibold no-underline"
            style={{
              borderColor: `${primaryColor}30`,
              color: primaryColor,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {copy.closing.createOwn}
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};
