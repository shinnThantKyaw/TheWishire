"use client";

import { useRef, useState, useCallback } from "react";
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
    // Confetti + items fly out instantly — no delay
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
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-md flex-col items-center px-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ── Pre-opening state (box + lid) — fades out on open ── */}
        <motion.div
          className="flex flex-col items-center"
          animate={opening ? { opacity: 0, scale: 0.85, y: -30 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ pointerEvents: opening ? "none" : "auto" }}
        >
          {/* Hint text */}
          <motion.p
            className="mb-8 text-sm"
            style={{ color: foregroundColor, opacity: 0.5 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: opening ? 0 : 0.5, y: opening ? -10 : 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {senderName
              ? `${senderName} has left you a gift`
              : "You've received a gift"}
          </motion.p>

          {/* ── Gift Box ───────────────────────── */}
          <motion.button
            onClick={handleOpen}
            className="relative cursor-pointer border-0 bg-transparent p-0"
            whileHover={!opening ? { scale: 1.04 } : {}}
            whileTap={!opening ? { scale: 0.96 } : {}}
            aria-label="Open the gift"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: opening ? 0 : 1, y: opening ? -20 : 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            {/* Glow pulse behind box */}
            {!opening && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 240,
                  height: 200,
                  background: `radial-gradient(ellipse, ${primaryColor}18, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Light beam on open */}
            <AnimatePresence>
              {opening && (
                <motion.div
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: 120,
                    height: 180,
                    background: `linear-gradient(180deg, ${secondaryColor}50, ${primaryColor}30, transparent)`,
                    borderRadius: "40% 40% 0 0",
                    filter: "blur(12px)",
                  }}
                  initial={{ opacity: 0, scaleY: 0, y: 30 }}
                  animate={{ opacity: 1, scaleY: 1, y: -10 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            <motion.div
              animate={
                opening
                  ? { rotateX: -15, y: 8 }
                  : { y: [0, -5, 0] }
              }
              transition={
                opening
                  ? { duration: 0.35 }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              style={{ perspective: 400, transformStyle: "preserve-3d" }}
            >
              {/* Lid */}
              <motion.div
                className="relative mx-auto rounded-t-xl"
                style={{
                  width: 180,
                  height: 32,
                  background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor}dd)`,
                  boxShadow: `0 -2px 8px ${primaryColor}15`,
                  transformOrigin: "bottom center",
                  zIndex: 2,
                }}
                animate={
                  opening
                    ? { rotateX: -70, y: -40, opacity: 0 }
                    : { rotateX: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div
                  className="absolute inset-0 rounded-t-xl"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.25), transparent)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: 18,
                    height: "100%",
                    background: `linear-gradient(180deg, ${secondaryColor}90, ${secondaryColor}70)`,
                  }}
                />
              </motion.div>

              {/* Body */}
              <div
                className="relative rounded-b-xl"
                style={{
                  width: 180,
                  height: 130,
                  background: `linear-gradient(180deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}bb)`,
                  boxShadow: `0 12px 32px ${primaryColor}28, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
              >
                <AnimatePresence>
                  {opening && (
                    <motion.div
                      className="absolute inset-0 overflow-hidden rounded-b-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div
                        className="absolute left-1/2 top-0 -translate-x-1/2"
                        style={{
                          width: 100,
                          height: "100%",
                          background: `linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1), transparent)`,
                          filter: "blur(8px)",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: 18,
                    height: "100%",
                    background: `linear-gradient(180deg, ${secondaryColor}80, ${secondaryColor}60)`,
                    boxShadow: "inset 0 0 4px rgba(0,0,0,0.1)",
                  }}
                />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  style={{
                    width: "100%",
                    height: 16,
                    background: `linear-gradient(90deg, ${secondaryColor}60, ${secondaryColor}80, ${secondaryColor}60)`,
                    boxShadow: "inset 0 0 4px rgba(0,0,0,0.08)",
                  }}
                />
                <div
                  className="absolute left-0 top-0 h-full w-px"
                  style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.15), transparent)` }}
                />
                <div
                  className="absolute right-0 top-0 h-full w-px"
                  style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.1), transparent)` }}
                />
              </div>

              {/* Bow */}
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                style={{ zIndex: 3 }}
                animate={
                  opening
                    ? { y: -50, opacity: 0, rotate: 25, scale: 0.3 }
                    : {}
                }
                transition={{ type: "spring", stiffness: 120, damping: 8, delay: 0.15 }}
              >
                <div className="relative">
                  <div
                    className="absolute -left-4 -top-1 h-5 w-6 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${secondaryColor}, ${secondaryColor}cc)`,
                      transform: "rotate(-20deg)",
                      boxShadow: `inset 0 -2px 4px ${primaryColor}20`,
                    }}
                  />
                  <div
                    className="absolute -right-4 -top-1 h-5 w-6 rounded-full"
                    style={{
                      background: `linear-gradient(225deg, ${secondaryColor}, ${secondaryColor}cc)`,
                      transform: "rotate(20deg)",
                      boxShadow: `inset 0 -2px 4px ${primaryColor}20`,
                    }}
                  />
                  <div
                    className="relative z-10 mx-auto h-4 w-4 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${secondaryColor}, ${secondaryColor}aa)`,
                      boxShadow: `0 1px 4px ${primaryColor}25`,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.button>

          {/* Tap prompt */}
          <motion.p
            className="mt-8 text-sm font-medium"
            style={{ color: primaryColor }}
            animate={{ opacity: opening ? 0 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {copy.openPrompt}
            </motion.span>
          </motion.p>
        </motion.div>

        {/* ── Post-opening: items fly out + text (always rendered, hidden until open) ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 1 : 0 }}
          transition={{ duration: 0.3, delay: opening ? 0.05 : 0 }}
          style={{ pointerEvents: opening ? "auto" : "none" }}
        >
          {/* ── Flying items that launch from box center ─────── */}
          <div className="relative mb-4 h-[200px] w-full max-w-sm">
            {/* Ghost box at bottom center — the visual source */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={opening ? { opacity: 0.3, scale: 0.7, y: 8 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {/* Lid */}
              <div
                className="mx-auto rounded-t-xl"
                style={{
                  width: 140,
                  height: 22,
                  background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor}cc)`,
                }}
              />
              {/* Body */}
              <div
                className="relative rounded-b-xl"
                style={{
                  width: 140,
                  height: 80,
                  background: `linear-gradient(180deg, ${primaryColor}bb, ${primaryColor}99)`,
                  boxShadow: `0 6px 16px ${primaryColor}15`,
                }}
              >
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{ width: 14, height: "100%", background: `${secondaryColor}50` }}
                />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  style={{ width: "100%", height: 10, background: `${secondaryColor}50` }}
                />
              </div>
            </motion.div>

            {/* Items launching outward */}
            {copy.contents.map((item, i) => {
              // Wider spread, different heights to avoid label overlap
              const arcs = [
                { x: -110, y: -175, rotate: -15 },  // top-left, tallest
                { x: 110, y: -175, rotate: 15 },     // top-right, tallest
                { x: -70, y: -105, rotate: -8 },     // bottom-left
                { x: 70, y: -105, rotate: 8 },       // bottom-right
              ];
              const arc = arcs[i % arcs.length];

              return (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-full flex flex-col items-center"
                  style={{ marginLeft: -24 }}
                  initial={{ x: 0, y: 0, scale: 0.1, opacity: 0, rotate: 0 }}
                  animate={opening ? {
                    x: arc.x,
                    y: arc.y,
                    scale: 1,
                    opacity: 1,
                    rotate: arc.rotate,
                  } : { x: 0, y: 0, scale: 0.1, opacity: 0, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 8,
                    mass: 0.8,
                    delay: 0.08 + i * 0.1,
                  }}
                >
                  <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      boxShadow: `0 4px 14px ${primaryColor}18, 0 1px 4px rgba(0,0,0,0.05)`,
                      border: `1px solid rgba(255,255,255,0.7)`,
                    }}
                  >
                    {item.emoji}
                    {/* Small label badge inside the card, bottom-right */}
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-1.5 py-px text-[9px] font-semibold"
                      style={{
                        background: `${primaryColor}12`,
                        color: primaryColor,
                        border: `1px solid ${primaryColor}15`,
                        lineHeight: "14px",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Heading */}
          <motion.h1
            className="mb-2 text-2xl font-bold leading-tight sm:text-3xl"
            style={{
              fontFamily: "var(--wish-font-heading), Georgia, serif",
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={opening ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.5 }}
          >
            {copy.heading}
          </motion.h1>

          {/* Personalized subheading */}
          <motion.p
            className="mb-6 max-w-sm text-sm leading-relaxed"
            style={{ color: foregroundColor, opacity: 0.55 }}
            initial={{ opacity: 0 }}
            animate={opening ? { opacity: 0.55 } : { opacity: 0 }}
            transition={{ delay: 0.7 }}
          >
            {recipientName
              ? `Hey ${recipientName}, ${copy.subheading.charAt(0).toLowerCase() + copy.subheading.slice(1)}`
              : copy.subheading}
          </motion.p>

          {/* Sender attribution */}
          {senderName && (
            <motion.p
              className="mb-4 text-xs"
              style={{ color: foregroundColor, opacity: 0.35 }}
              initial={{ opacity: 0 }}
              animate={opening ? { opacity: 0.35 } : { opacity: 0 }}
              transition={{ delay: 0.9 }}
            >
              With love, from {senderName}
            </motion.p>
          )}

          {/* Continue button */}
          <motion.button
            onClick={onNext}
            className="rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              boxShadow: `0 6px 24px ${primaryColor}35`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={opening ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See your surprise →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
