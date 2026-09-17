"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface GiftOpeningScreenProps {
  onNext: () => void;
  onBack: () => void;
  recipientName?: string;
  occasion?: string;
  senderName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

/** Occasion-specific copy for the gift moment */
const OCCASION_COPY: Record<
  string,
  {
    heading: string;
    subheading: string;
    openPrompt: string;
    contents: Array<{ emoji: string; label: string }>;
  }
> = {
  birthday: {
    heading: "A Birthday Gift, Just for You",
    subheading:
      "Someone who cares about you picked out something special to celebrate your birthday.",
    openPrompt: "Tap to unwrap your gift",
    contents: [
      { emoji: "💌", label: "A Letter" },
      { emoji: "📸", label: "Memories" },
      { emoji: "🎵", label: "A Song" },
      { emoji: "💝", label: "A Wish" },
    ],
  },
  anniversary: {
    heading: "A Gift of Love",
    subheading:
      "Someone wanted to honor this beautiful journey you share with a personal surprise.",
    openPrompt: "Tap to open your gift",
    contents: [
      { emoji: "💌", label: "A Letter" },
      { emoji: "📸", label: "Our Story" },
      { emoji: "💕", label: "A Promise" },
      { emoji: "🌹", label: "A Rose" },
    ],
  },
  valentine: {
    heading: "A Little Token of Love",
    subheading:
      "In a world full of people, someone chose to make something just for you.",
    openPrompt: "Tap to receive your gift",
    contents: [
      { emoji: "💌", label: "A Love Note" },
      { emoji: "❤️", label: "A Heart" },
      { emoji: "🌹", label: "Roses" },
      { emoji: "✨", label: "A Wish" },
    ],
  },
  wedding: {
    heading: "A Gift for Your Special Day",
    subheading:
      "Two hearts, one beautiful journey. Someone wanted to celebrate this milestone with you.",
    openPrompt: "Tap to open your gift",
    contents: [
      { emoji: "💌", label: "A Toast" },
      { emoji: "💍", label: "Blessings" },
      { emoji: "📸", label: "Memories" },
      { emoji: "🥂", label: "Cheers" },
    ],
  },
  graduation: {
    heading: "A Gift for Your Achievement",
    subheading:
      "All that hard work paid off. Someone is incredibly proud and wanted you to know.",
    openPrompt: "Tap to open your gift",
    contents: [
      { emoji: "💌", label: "A Letter" },
      { emoji: "🎓", label: "Pride" },
      { emoji: "⭐", label: "A Wish" },
      { emoji: "📖", label: "Wisdom" },
    ],
  },
  friendship: {
    heading: "A Gift from the Heart",
    subheading:
      "True friends are rare. Someone wanted to say thank you for being exactly who you are.",
    openPrompt: "Tap to open your gift",
    contents: [
      { emoji: "💌", label: "A Note" },
      { emoji: "🤗", label: "A Hug" },
      { emoji: "📸", label: "Memories" },
      { emoji: "💛", label: "A Wish" },
    ],
  },
  "thank-you": {
    heading: "A Gift of Gratitude",
    subheading:
      "Someone wanted to express their thanks in a way that words alone can't capture.",
    openPrompt: "Tap to open your gift",
    contents: [
      { emoji: "💌", label: "A Note" },
      { emoji: "🙏", label: "Gratitude" },
      { emoji: "🌸", label: "Warmth" },
      { emoji: "✨", label: "A Wish" },
    ],
  },
};

const FALLBACK_COPY = {
  heading: "A Gift, Made with Love",
  subheading:
    "Someone wanted to make this moment a little more special — just for you.",
  openPrompt: "Tap to open your gift",
  contents: [
    { emoji: "💌", label: "A Letter" },
    { emoji: "📸", label: "Memories" },
    { emoji: "🎵", label: "A Song" },
    { emoji: "💝", label: "A Wish" },
  ],
};

/* ── Floating sparkle particle ─────────────────────────── */
const Sparkle = ({
  delay,
  x,
  size,
  color,
  duration,
}: {
  delay: number;
  x: number;
  size: number;
  color: string;
  duration: number;
}) => (
  <motion.div
    className="pointer-events-none absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      bottom: "-5%",
      background: `radial-gradient(circle, ${color}, transparent 70%)`,
    }}
    animate={{
      y: [0, -800],
      opacity: [0, 0.8, 0.8, 0],
      scale: [0.5, 1, 1, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

export const GiftOpeningScreen = ({
  onNext,
  recipientName,
  occasion,
  senderName,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: GiftOpeningScreenProps) => {
  const [opening, setOpening] = useState(false);
  const hasConfetti = useRef(false);
  const openingRef = useRef(false);

  const copy =
    OCCASION_COPY[occasion?.toLowerCase() ?? ""] ?? FALLBACK_COPY;

  // Pre-compute sparkle data (stable across renders — no Math.random in render)
  const sparkles = useMemo(
    () =>
      [12, 28, 45, 62, 78, 88, 35, 55].map((x, i) => ({
        x,
        size: 3 + (i % 3) * 2,
        color: i % 2 === 0 ? `${primaryColor}60` : `${secondaryColor}50`,
        delay: i * 1.2,
        duration: [7, 8.5, 9, 10, 7.5, 9.5, 8, 11][i],
      })),
    [primaryColor, secondaryColor],
  );

  const fireConfetti = useCallback(async () => {
    if (hasConfetti.current) return;
    hasConfetti.current = true;

    const confetti = (await import("canvas-confetti")).default;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 100,
    };

    confetti({ ...defaults, particleCount: 80, origin: { x: 0.5, y: 0.45 } });

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: 0.3, y: 0.5 },
        colors: [primaryColor, secondaryColor, "#FF80AB", "#FFB74D"],
      });
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: 0.7, y: 0.5 },
        colors: [primaryColor, secondaryColor, "#CE93D8", "#81D4FA"],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: 0.5, y: 0.3 },
        gravity: 0.8,
        scalar: 1.2,
      });
    }, 500);
  }, [primaryColor, secondaryColor]);

  const handleOpen = useCallback(() => {
    if (openingRef.current) return;
    openingRef.current = true;
    setOpening(true);
    fireConfetti();
  }, [fireConfetti]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12"
      style={{ backgroundColor }}
    >
      {/* ── Background atmosphere ──────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}30, transparent 68%)`,
            filter: "blur(35px)",
          }}
        />
        <div
          className="absolute -right-40 top-16 h-[480px] w-[480px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${primaryColor}20, transparent 68%)`,
            filter: "blur(45px)",
          }}
        />
        <div
          className="absolute -bottom-48 left-1/3 h-[500px] w-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}18, transparent 70%)`,
            filter: "blur(55px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.9), transparent 55%)`,
          }}
        />

        {/* Floating sparkle particles */}
        {sparkles.map((s, i) => (
          <Sparkle
            key={i}
            delay={s.delay}
            x={s.x}
            size={s.size}
            color={s.color}
            duration={s.duration}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex h-full w-full max-w-md flex-col items-center px-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ═══ TOP: Pre-open badge (absolute — never shifts the box) ═══ */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: opening ? 0 : 1, y: opening ? -10 : 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16"
          >
            {/* Sparkle connector */}
            <div className="mb-2 text-center">
              <span
                className="text-xs"
                style={{ color: primaryColor, opacity: 0.6 }}
              >
                ✦
              </span>
            </div>
            {/* Frosted glass pill badge */}
            <div
              className="rounded-full px-6 py-2.5 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))`,
                boxShadow: `0 4px 20px ${primaryColor}12, 0 1px 3px rgba(0,0,0,0.04)`,
                border: `1px solid rgba(255,255,255,0.5)`,
              }}
            >
              <p
                className="text-sm font-medium tracking-wide"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {senderName
                  ? `${senderName} has left you a gift`
                  : "You've received a gift"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ═══ BOTTOM: Box + content (box stays in same position always) ═══ */}
        <div className="flex-shrink-0 pb-8">
          {/* ── Gift Box Container ── */}
          <div
            className="relative mx-auto"
            style={{
              perspective: 400,
              transformStyle: "preserve-3d",
              width: 200,
              height: 180,
            }}
          >
            {/* Tap target */}
            {!opening && (
              <button
                onClick={handleOpen}
                className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent p-0"
                style={{ width: 200, height: 180 }}
                aria-label="Open the gift"
              />
            )}

            {/* Animated dashed orbit ring — tap prompt */}
            <AnimatePresence>
              {!opening && (
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ width: 232, height: 232, zIndex: 5 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {/* Rotating dashed circle */}
                  <div
                    className="h-full w-full rounded-full"
                    style={{
                      border: `2px dashed ${primaryColor}30`,
                      animation: "spin 12s linear infinite",
                    }}
                  />
                  {/* Pulsing glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `0 0 20px ${primaryColor}10, inset 0 0 20px ${primaryColor}05`,
                    }}
                    animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Outer glow pulse */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 260,
                height: 220,
                background: `radial-gradient(ellipse, ${primaryColor}15, transparent 70%)`,
              }}
              animate={
                opening
                  ? { opacity: 0, scale: 0.8 }
                  : { scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }
              }
              transition={{
                duration: opening ? 0.3 : 3,
                repeat: opening ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />

            {/* ── Items emerging from inside the box ── */}
            {opening &&
              copy.contents.map((item, i) => {
                const positions = [
                  { x: -75, y: -200, rotate: -12 },
                  { x: 75, y: -200, rotate: 12 },
                  { x: -48, y: -140, rotate: -5 },
                  { x: 48, y: -140, rotate: 5 },
                ];
                const pos = positions[i % positions.length];
                const tints = [
                  { bg: `${primaryColor}08`, border: `${primaryColor}18` },
                  { bg: `${secondaryColor}10`, border: `${secondaryColor}20` },
                  { bg: `${primaryColor}0a`, border: `${primaryColor}15` },
                  { bg: `${secondaryColor}08`, border: `${secondaryColor}18` },
                ];
                const tint = tints[i % tints.length];

                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 flex flex-col items-center"
                    style={{ marginLeft: -30, top: 90, zIndex: 10 }}
                    initial={{ x: 0, y: 20, scale: 0, opacity: 0, rotate: 0 }}
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      scale: [0, 1.15, 0.95, 1],
                      opacity: [0, 1, 1, 1],
                      rotate: pos.rotate,
                    }}
                    transition={{
                      duration: 0.9,
                      delay: 0.3 + i * 0.15,
                      ease: [0.34, 1.56, 0.64, 1],
                      scale: {
                        times: [0, 0.5, 0.75, 1],
                        duration: 0.9,
                        delay: 0.3 + i * 0.15,
                      },
                      opacity: {
                        times: [0, 0.2, 1, 1],
                        duration: 0.9,
                        delay: 0.3 + i * 0.15,
                      },
                    }}
                  >
                    <div
                      className="relative flex flex-col items-center overflow-hidden rounded-2xl px-3.5 py-3"
                      style={{
                        background: `linear-gradient(145deg, rgba(255,255,255,0.95), ${tint.bg})`,
                        boxShadow: `0 8px 24px ${primaryColor}12, 0 2px 8px rgba(0,0,0,0.05)`,
                        border: `1px solid ${tint.border}`,
                        width: 60,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
                        }}
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          duration: 0.6,
                          delay: 0.5 + i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative text-2xl leading-none">
                        {item.emoji}
                      </span>
                      <span
                        className="relative mt-1.5 text-center text-[9px] font-bold leading-tight tracking-wide whitespace-nowrap"
                        style={{ color: primaryColor }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

            {/* Light beam */}
            <AnimatePresence>
              {opening && (
                <motion.div
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: 130,
                    height: 220,
                    background: `linear-gradient(180deg, ${secondaryColor}50, ${primaryColor}30, transparent)`,
                    borderRadius: "40% 40% 0 0",
                    filter: "blur(14px)",
                  }}
                  initial={{ opacity: 0, scaleY: 0, y: 30 }}
                  animate={{ opacity: 1, scaleY: 1, y: -40 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Lid */}
            <motion.div
              className="relative mx-auto rounded-t-2xl"
              style={{
                width: 200,
                height: 36,
                background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 -2px 8px ${primaryColor}15, 0 4px 12px ${primaryColor}10`,
                transformOrigin: "bottom center",
                zIndex: 2,
              }}
              animate={
                opening
                  ? { rotateX: -70, opacity: 0 }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* Lid shine */}
              <div
                className="absolute inset-0 rounded-t-2xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)",
                }}
              />
              {/* Lid top highlight */}
              <div
                className="absolute left-0 top-0 h-px w-full rounded-t-2xl"
                style={{
                  background: `linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 50%, transparent 90%)`,
                }}
              />
              {/* Vertical ribbon on lid */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  width: 20,
                  height: "100%",
                  background: `linear-gradient(180deg, ${secondaryColor}90, ${secondaryColor}70)`,
                }}
              />
            </motion.div>

            {/* Body */}
            <div
              className="relative overflow-hidden rounded-b-2xl"
              style={{
                width: 200,
                height: 144,
                background: `linear-gradient(180deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}bb)`,
                boxShadow: `0 16px 40px ${primaryColor}30, 0 4px 12px ${primaryColor}15, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
            >
              {/* Opening light spill */}
              <AnimatePresence>
                {opening && (
                  <motion.div
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div
                      className="absolute left-1/2 top-0 -translate-x-1/2"
                      style={{
                        width: 110,
                        height: "100%",
                        background: `linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1), transparent)`,
                        filter: "blur(10px)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Left edge highlight */}
              <div
                className="absolute left-0 top-0 h-full w-px"
                style={{
                  background: `linear-gradient(180deg, rgba(255,255,255,0.2), transparent 60%)`,
                }}
              />
              {/* Right edge highlight */}
              <div
                className="absolute right-0 top-0 h-full w-px"
                style={{
                  background: `linear-gradient(180deg, rgba(255,255,255,0.12), transparent 60%)`,
                }}
              />
              {/* Vertical ribbon */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  width: 20,
                  height: "100%",
                  background: `linear-gradient(180deg, ${secondaryColor}80, ${secondaryColor}60)`,
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
                }}
              />
              {/* Horizontal ribbon */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2"
                style={{
                  width: "100%",
                  height: 18,
                  background: `linear-gradient(90deg, ${secondaryColor}60, ${secondaryColor}80, ${secondaryColor}60)`,
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.08)",
                }}
              />
              {/* Decorative dots — top-left */}
              <div
                className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full"
                style={{ background: `rgba(255,255,255,0.2)` }}
              />
              <div
                className="absolute left-7 top-6 h-1 w-1 rounded-full"
                style={{ background: `rgba(255,255,255,0.15)` }}
              />
              {/* Decorative dots — top-right */}
              <div
                className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full"
                style={{ background: `rgba(255,255,255,0.2)` }}
              />
              <div
                className="absolute right-7 top-6 h-1 w-1 rounded-full"
                style={{ background: `rgba(255,255,255,0.15)` }}
              />
            </div>

            {/* Bow */}
            <motion.div
              className="absolute -top-5 left-1/2 -translate-x-1/2"
              style={{ zIndex: 3 }}
              animate={
                opening
                  ? { opacity: 0, rotate: 25, scale: 0.3 }
                  : {}
              }
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 8,
                delay: 0.1,
              }}
            >
              <div className="relative">
                <div
                  className="absolute -left-5 -top-1.5 h-6 w-7 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor}, ${secondaryColor}cc)`,
                    transform: "rotate(-20deg)",
                    boxShadow: `inset 0 -2px 4px ${primaryColor}20`,
                  }}
                />
                <div
                  className="absolute -right-5 -top-1.5 h-6 w-7 rounded-full"
                  style={{
                    background: `linear-gradient(225deg, ${secondaryColor}, ${secondaryColor}cc)`,
                    transform: "rotate(20deg)",
                    boxShadow: `inset 0 -2px 4px ${primaryColor}20`,
                  }}
                />
                <div
                  className="relative z-10 mx-auto h-5 w-5 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${secondaryColor}, ${secondaryColor}aa)`,
                    boxShadow: `0 2px 6px ${primaryColor}25`,
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* ── Tap prompt text ── */}
          <AnimatePresence>
            {!opening && (
              <motion.p
                className="mt-5 text-xs font-medium italic tracking-wider"
                style={{ color: `${primaryColor}80` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                {copy.openPrompt}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Post-open content (below the box) ── */}
          <AnimatePresence>
            {opening && (
              <motion.div
                className="mt-8 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              >
                {/* Decorative divider */}
                <div className="mb-5 flex items-center gap-2.5">
                  <div
                    className="h-px w-8"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${primaryColor}40)`,
                    }}
                  />
                  <span className="text-xs" style={{ color: `${primaryColor}50` }}>
                    ✦
                  </span>
                  <div
                    className="h-px w-8"
                    style={{
                      background: `linear-gradient(90deg, ${primaryColor}40, transparent)`,
                    }}
                  />
                </div>

                {/* Main text */}
                <p
                  className="text-lg font-bold tracking-wide sm:text-xl"
                  style={{
                    fontFamily: "var(--wish-font-heading), Georgia, serif",
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Here are gifts for you!
                </p>

                {/* Sender */}
                {senderName && (
                  <p
                    className="mt-2 text-sm italic"
                    style={{
                      fontFamily: "var(--wish-font-heading), Georgia, serif",
                      color: foregroundColor,
                      opacity: 0.5,
                    }}
                  >
                    with love,{" "}
                    <span
                      style={{
                        color: primaryColor,
                        fontWeight: 600,
                        fontStyle: "normal",
                      }}
                    >
                      {senderName}
                    </span>
                  </p>
                )}

                {/* Button */}
                <motion.button
                  onClick={onNext}
                  className="mt-7 rounded-full px-10 py-3.5 text-sm font-semibold tracking-wide text-white"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: `0 8px 28px ${primaryColor}30, 0 2px 8px ${primaryColor}15`,
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See the gifts →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Keyframes for dashed ring rotation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
