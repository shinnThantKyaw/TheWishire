"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface IntroductionScreenProps {
  recipientName: string;
  senderName: string;
  occasion: string;
  onNext: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 1: Introduction + Ribbon Cut.
 *
 * Premium glassmorphism card with a beautiful CSS ribbon
 * and animated scissors. Tap scissors to cut the ribbon.
 */
export const IntroductionScreen = ({
  recipientName,
  senderName,
  occasion,
  onNext,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: IntroductionScreenProps) => {
  const [cutting, setCutting] = useState(false);
  const [cutDone, setCutDone] = useState(false);

  const handleCut = () => {
    if (cutting || cutDone) return;
    setCutting(true);
    setTimeout(() => {
      setCutDone(true);
      setTimeout(onNext, 1200);
    }, 800);
  };

  const occ =
    {
      birthday: { emoji: "🎂", label: "Birthday" },
      anniversary: { emoji: "💕", label: "Anniversary" },
      valentine: { emoji: "❤️", label: "Valentine's" },
      wedding: { emoji: "💒", label: "Wedding" },
      graduation: { emoji: "🎓", label: "Graduation" },
      friendship: { emoji: "🤝", label: "Friendship" },
      "thank-you": { emoji: "🙏", label: "Thank You" },
    }[occasion] ?? { emoji: "🎁", label: "Special" };

  // Stable particles
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 8 + Math.random() * 84,
        y: 5 + Math.random() * 90,
        size: 4 + Math.random() * 6,
        dur: 5 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    [],
  );

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12"
      style={{ backgroundColor }}
    >
      {/* ── Floating color orbs ─────────────────── */}
      <motion.div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 320,
          height: 320,
          top: "-8%",
          left: "-15%",
          background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 280,
          height: 280,
          bottom: "5%",
          right: "-10%",
          background: `radial-gradient(circle, ${secondaryColor}20 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
        animate={{ x: [0, -30, 25, 0], y: [0, 20, -25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Soft background particles ───────────── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none fixed rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: `${primaryColor}12`,
          }}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      {/* ── Glow behind card ─────────────────────── */}
      <motion.div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: "70%",
          height: "45%",
          top: "27%",
          left: "15%",
          background: `radial-gradient(ellipse, ${primaryColor}10 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Glass Card ───────────────────────────── */}
      <motion.div
        className="relative z-10 w-full max-w-sm"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-10 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/3"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              transform: "skewX(-12deg)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "400%" }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
          />

          {/* ── Content ──────────────────────────── */}

          {/* Occasion tag */}
          <motion.div
            className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide"
            style={{ backgroundColor: `${primaryColor}10`, color: primaryColor, border: `1px solid ${primaryColor}18` }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {occ.emoji} {occ.label} Surprise
          </motion.div>

          {/* Logo */}
          <motion.div
            className="mb-5 flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <motion.img
              src="/Logo/Logo.png"
              alt="Wishire"
              className="h-16 w-16 rounded-2xl object-contain"
              style={{ boxShadow: `0 4px 16px ${primaryColor}20` }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Greeting — gradient text */}
          <motion.h1
            className="text-3xl font-bold leading-tight"
            style={{
              fontFamily: "var(--wish-font-heading), Playfair Display, serif",
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${primaryColor}dd)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 2px 4px ${primaryColor}18)`,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Hey {recipientName}!
          </motion.h1>

          {/* Explanation */}
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <p className="text-sm leading-relaxed" style={{ color: foregroundColor, opacity: 0.7 }}>
              <span className="font-semibold" style={{ color: primaryColor }}>{senderName}</span>{" "}
              prepared a special{" "}
              <span className="font-medium lowercase">{occ.label}</span>{" "}
              surprise — just for you.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="mx-auto my-6 h-px"
            style={{ width: 60, background: `linear-gradient(90deg, transparent, ${primaryColor}30, transparent)` }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />

          {/* ── Premium Ribbon + Scissors ─────────── */}
          <AnimatePresence mode="wait">
            {!cutDone ? (
              <motion.div
                key="ribbon"
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <PremiumRibbon
                  cutting={cutting}
                  primaryColor={primaryColor}
                  foregroundColor={foregroundColor}
                  onCut={handleCut}
                />
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                {/* Celebration particles */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="pointer-events-none fixed text-base"
                    style={{ left: "50%", top: "50%" }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: (Math.random() - 0.5) * 180,
                      y: (Math.random() - 0.5) * 180,
                      opacity: 0,
                      scale: 0.3,
                    }}
                    transition={{ duration: 0.8, delay: i * 0.04 }}
                  >
                    {["✨", "🎉", "💫", "⭐", "🎊"][i % 5]}
                  </motion.div>
                ))}
                <div className="text-5xl">🎉</div>
                <p className="mt-3 text-lg font-bold" style={{ color: primaryColor }}>
                  Unlocked!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Premium Ribbon + Scissors ──────────────────────────

const PremiumRibbon = ({
  cutting,
  primaryColor,
  foregroundColor,
  onCut,
}: {
  cutting: boolean;
  primaryColor: string;
  foregroundColor: string;
  onCut: () => void;
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* ── CSS Bow ──────────────────────────────── */}
      <motion.div
        className="relative mb-0"
        style={{ width: 80, height: 40 }}
        animate={
          cutting
            ? { y: -50, opacity: 0, rotate: 25, scale: 0.3 }
            : { y: 0, opacity: 1, rotate: 0, scale: 1 }
        }
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 8,
          delay: cutting ? 0.3 : 0,
        }}
      >
        {/* Left loop */}
        <div
          className="absolute rounded-full"
          style={{
            left: 6,
            top: 4,
            width: 26,
            height: 20,
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            transform: "rotate(-18deg)",
            boxShadow: `inset 0 -2px 6px ${primaryColor}50, inset 0 2px 3px rgba(255,255,255,0.2), 0 2px 6px ${primaryColor}20`,
          }}
        />
        {/* Right loop */}
        <div
          className="absolute rounded-full"
          style={{
            right: 6,
            top: 4,
            width: 26,
            height: 20,
            background: `linear-gradient(225deg, ${primaryColor}, ${primaryColor}cc)`,
            transform: "rotate(18deg)",
            boxShadow: `inset 0 -2px 6px ${primaryColor}50, inset 0 2px 3px rgba(255,255,255,0.2), 0 2px 6px ${primaryColor}20`,
          }}
        />
        {/* Center knot */}
        <div
          className="absolute left-1/2 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${primaryColor}99)`,
            boxShadow: `0 2px 8px ${primaryColor}40, inset 0 1px 2px rgba(255,255,255,0.3)`,
          }}
        />
        {/* Left tail */}
        <div
          className="absolute rounded-b-full"
          style={{
            left: 18,
            top: 18,
            width: 6,
            height: 22,
            background: `linear-gradient(180deg, ${primaryColor}, ${primaryColor}70)`,
            transform: "rotate(-12deg)",
            transformOrigin: "top center",
            boxShadow: `inset -1px 0 2px rgba(255,255,255,0.15)`,
          }}
        />
        {/* Right tail */}
        <div
          className="absolute rounded-b-full"
          style={{
            right: 18,
            top: 18,
            width: 6,
            height: 22,
            background: `linear-gradient(180deg, ${primaryColor}dd, ${primaryColor}60)`,
            transform: "rotate(12deg)",
            transformOrigin: "top center",
            boxShadow: `inset 1px 0 2px rgba(255,255,255,0.15)`,
          }}
        />
      </motion.div>

      {/* ── Ribbon Strip (two halves) ──────────── */}
      <div className="relative my-1" style={{ width: 200, height: 20 }}>
        {/* Left half */}
        <motion.div
          className="absolute left-0 top-0 overflow-hidden"
          style={{
            width: "50%",
            height: "100%",
            borderRadius: "3px 0 0 3px",
            background: `linear-gradient(180deg, ${primaryColor}ee, ${primaryColor}, ${primaryColor}dd)`,
            boxShadow: `0 3px 10px ${primaryColor}25, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)`,
          }}
          animate={
            cutting
              ? { x: -70, rotate: -15, opacity: 0, y: 25 }
              : { x: 0, rotate: 0, opacity: 1, y: 0 }
          }
          transition={{ type: "spring", stiffness: 100, damping: 8, delay: cutting ? 0.45 : 0 }}
        >
          {/* Satin weave texture */}
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 3px)`,
            }}
          />
          {/* Shine */}
          <motion.div
            className="absolute inset-y-0 w-1/3"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
            animate={{ x: [-60, 100] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Right half */}
        <motion.div
          className="absolute right-0 top-0 overflow-hidden"
          style={{
            width: "50%",
            height: "100%",
            borderRadius: "0 3px 3px 0",
            background: `linear-gradient(180deg, ${primaryColor}dd, ${primaryColor}cc, ${primaryColor}bb)`,
            boxShadow: `0 3px 10px ${primaryColor}25, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.1)`,
          }}
          animate={
            cutting
              ? { x: 70, rotate: 15, opacity: 0, y: 25 }
              : { x: 0, rotate: 0, opacity: 1, y: 0 }
          }
          transition={{ type: "spring", stiffness: 100, damping: 8, delay: cutting ? 0.48 : 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 3px)`,
            }}
          />
        </motion.div>

        {/* ── Animated Scissors ─────────────────── */}
        <AnimatePresence>
          {cutting && (
            <motion.div
              className="absolute top-1/2 z-30"
              style={{ translateY: "-50%", fontSize: 28 }}
              initial={{ left: -15, opacity: 0, rotate: 0 }}
              animate={{ left: "50%", opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -10 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.span
                className="inline-block origin-bottom"
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 0.12, repeat: Infinity }}
              >
                ✂️
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Cut sparkles ──────────────────────── */}
        <AnimatePresence>
          {cutting &&
            [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="pointer-events-none absolute left-1/2 top-1/2 text-xs"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 120,
                  y: (Math.random() - 0.5) * 70 - 15,
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.03 }}
              >
                {["✨", "⭐", "💫"][i % 3]}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* ── Cut Button ──────────────────────────── */}
      <motion.button
        onClick={onCut}
        disabled={cutting}
        className="mt-5 flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg disabled:opacity-0"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          boxShadow: `0 6px 24px ${primaryColor}35`,
        }}
        whileHover={{ scale: 1.04, boxShadow: `0 8px 28px ${primaryColor}50` }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="text-base">✂️</span>
        Cut the ribbon
      </motion.button>

      <motion.p
        className="mt-2.5 text-xs"
        style={{ color: foregroundColor, opacity: 0.3 }}
        animate={cutting ? { opacity: 0 } : {}}
      >
        to unwrap your surprise
      </motion.p>
    </div>
  );
};
