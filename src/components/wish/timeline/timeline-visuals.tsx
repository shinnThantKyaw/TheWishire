"use client";

import { motion, useReducedMotion } from "motion/react";
import { Heart } from "lucide-react";
import type { MemoryTimelineEntry } from "@/types/wish";

/**
 * Shared visual primitives for Memory Timeline chapter/stage.
 * Premium photo-less design: rose atmosphere, heart spine,
 * glass-paper memory cards with script numerals.
 */

/** Font stacks: template theme font first, then globally loaded faces. */
export const headingFont =
  "var(--wish-font-heading), var(--font-playfair), 'Playfair Display', Georgia, serif";
export const bodyFont =
  "var(--wish-font-body), Inter, var(--font-geist-sans), system-ui, sans-serif";
export const scriptFont =
  "var(--font-script), 'Segoe Script', 'Apple Chancery', 'Snell Roundhand', cursive";

/** Soft floating petals for romantic atmosphere. Decorative only. */
const PETALS = [
  { top: "6%", left: "4%", size: 12, delay: 0, duration: 8 },
  { top: "18%", right: "6%", size: 14, delay: 1.2, duration: 9 },
  { top: "42%", left: "2%", size: 10, delay: 0.6, duration: 7.5 },
  { top: "58%", right: "3%", size: 13, delay: 2, duration: 8.5 },
  { top: "78%", left: "8%", size: 11, delay: 1.5, duration: 7 },
  { top: "88%", right: "10%", size: 12, delay: 0.3, duration: 9.5 },
];

/**
 * TimelineBackdrop — layered rose glows + optional floating petals.
 * Sits behind chapter content; never intercepts pointer events.
 */
export const TimelineBackdrop = ({
  primaryColor,
}: {
  primaryColor: string;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 85% 45% at 50% 0%, ${primaryColor}18, transparent 70%)`,
            `radial-gradient(ellipse 55% 40% at 100% 100%, ${primaryColor}12, transparent 60%)`,
            `radial-gradient(ellipse 50% 35% at 0% 75%, ${primaryColor}0e, transparent 55%)`,
          ].join(", "),
        }}
      />

      {!reduceMotion &&
        PETALS.map((petal, i) => (
          <motion.div
            key={i}
            className="absolute rounded-[50%_50%_50%_0]"
            style={{
              top: petal.top,
              left: petal.left,
              right: petal.right,
              width: petal.size,
              height: petal.size * 1.35,
              backgroundColor: primaryColor,
              opacity: 0.18,
              rotate: "45deg",
            }}
            animate={{
              y: [0, -18, 0],
              rotate: [45, 60, 45],
              opacity: [0.14, 0.22, 0.14],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
};

interface TimelineHeaderProps {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  subtitle?: string;
  primaryColor: string;
  foregroundColor: string;
}

/**
 * TimelineHeader — chapter label, two-tone serif title, italic subtitle,
 * heart ornament divider. Invitation-style hierarchy.
 */
export const TimelineHeader = ({
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  primaryColor,
  foregroundColor,
}: TimelineHeaderProps) => (
  <motion.header
    className="relative z-10 mb-10 text-center sm:mb-14"
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 180, damping: 22 }}
  >
    <p
      className="text-[0.68rem] font-medium tracking-[0.32em] uppercase"
      style={{ color: primaryColor, fontFamily: bodyFont }}
    >
      {eyebrow}
    </p>

    <h2
      className="mt-3 text-3xl leading-tight sm:text-4xl md:text-[2.75rem]"
      style={{ fontFamily: headingFont, color: foregroundColor }}
    >
      {titleLead}{" "}
      <span style={{ color: primaryColor, fontStyle: "italic" }}>
        {titleAccent}
      </span>
    </h2>

    {subtitle && (
      <p
        className="mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base"
        style={{
          color: foregroundColor,
          opacity: 0.55,
          fontFamily: bodyFont,
        }}
      >
        {subtitle}
      </p>
    )}

    <div className="mt-7 flex items-center justify-center gap-3">
      <span
        className="h-px w-14 sm:w-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}77)`,
        }}
      />
      <Heart
        className="h-3 w-3"
        style={{ color: primaryColor, fill: primaryColor }}
        aria-hidden
      />
      <span
        className="h-px w-14 sm:w-20"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}77, transparent)`,
        }}
      />
    </div>
  </motion.header>
);

/**
 * HeartNode — filled heart badge on the timeline spine.
 * Spring-pop animation delays with row index.
 */
export const HeartNode = ({
  primaryColor,
  delay = 0,
}: {
  primaryColor: string;
  delay?: number;
}) => (
  <motion.div
    className="absolute top-8 left-5 z-10 -translate-x-1/2 sm:top-1/2 sm:left-1/2 sm:-translate-y-1/2"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 320, damping: 14, delay }}
  >
    <motion.div
      className="flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8"
      style={{
        backgroundColor: primaryColor,
        boxShadow: `0 0 0 4px ${primaryColor}22, 0 4px 12px ${primaryColor}44`,
      }}
      whileHover={{ scale: 1.1 }}
    >
      <Heart
        className="h-3 w-3 sm:h-3.5 sm:w-3.5"
        style={{ color: "#fff", fill: "#fff" }}
        aria-hidden
      />
    </motion.div>
  </motion.div>
);

/** Extract a 4-digit year from a date string for the watermark, if present. */
const extractYear = (date: string): string | null => {
  const match = date.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
};

interface MemoryCardProps {
  entry: MemoryTimelineEntry;
  index: number;
  primaryColor: string;
  foregroundColor: string;
}

/**
 * MemoryCard — premium glass-paper memory card.
 *
 * No photos. Romance comes from script numeral, hairline ornaments,
 * year watermark, and invitation-style typography.
 */
export const MemoryCard = ({
  entry,
  index,
  primaryColor,
  foregroundColor,
}: MemoryCardProps) => {
  const year = extractYear(entry.date);
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      className="relative w-full overflow-hidden rounded-2xl px-6 py-7 sm:px-8 sm:py-8"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.62) 55%, rgba(255,255,255,0.48) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: [
          `0 0 0 1px ${primaryColor}20`,
          `0 0 0 1px rgba(255,255,255,0.45) inset`,
          `0 1px 0 rgba(255,255,255,0.85) inset`,
          `0 28px 56px -28px ${foregroundColor}40`,
          `0 4px 14px ${foregroundColor}0f`,
        ].join(", "),
      }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: "spring", stiffness: 150, damping: 22 }}
      whileHover={{ y: -5 }}
    >
      {/* Year watermark — editorial depth */}
      {year && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -bottom-4 text-[5.5rem] leading-none font-bold select-none sm:text-[7rem]"
          style={{
            fontFamily: headingFont,
            color: primaryColor,
            opacity: 0.06,
          }}
        >
          {year}
        </span>
      )}

      {/* Top hairline accent */}
      <div
        aria-hidden
        className="absolute top-0 right-0 left-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}55, transparent)`,
        }}
      />

      <div className="relative">
        {/* Script numeral + micro ornament */}
        <div className="flex items-center gap-3">
          <span
            className="text-3xl leading-none sm:text-4xl"
            style={{
              fontFamily: scriptFont,
              color: primaryColor,
            }}
          >
            {numeral}
          </span>
          <span
            aria-hidden
            className="h-px flex-1"
            style={{
              background: `linear-gradient(90deg, ${primaryColor}44, transparent)`,
            }}
          />
          <Heart
            className="h-3 w-3 shrink-0 opacity-70"
            style={{ color: primaryColor, fill: primaryColor }}
            aria-hidden
          />
        </div>

        {/* Date */}
        <p
          className="mt-5 text-[0.68rem] font-medium tracking-[0.28em] uppercase"
          style={{ color: primaryColor, fontFamily: bodyFont }}
        >
          {entry.date}
        </p>

        {/* Title */}
        <h3
          className="mt-2 text-xl leading-snug sm:text-2xl"
          style={{ fontFamily: headingFont, color: foregroundColor }}
        >
          {entry.title}
        </h3>

        {/* Description */}
        {entry.description && (
          <p
            className="mt-3 text-sm leading-loose sm:text-[0.95rem]"
            style={{
              color: foregroundColor,
              opacity: 0.62,
              fontFamily: bodyFont,
            }}
          >
            {entry.description}
          </p>
        )}

        {/* Bottom ornament */}
        <div
          aria-hidden
          className="mt-6 flex items-center gap-2"
        >
          <span
            className="h-px w-8"
            style={{ background: `${primaryColor}33` }}
          />
          <span
            className="h-1 w-1 rounded-full"
            style={{ backgroundColor: `${primaryColor}55` }}
          />
          <span
            className="h-px flex-1"
            style={{
              background: `linear-gradient(90deg, ${primaryColor}22, transparent)`,
            }}
          />
        </div>
      </div>
    </motion.article>
  );
};
