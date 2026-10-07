"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Clover, Download, Gamepad2, Gift, Heart, LockOpen, Play, Sparkle, Sparkles } from "lucide-react";
import type { GiftSubScreen, SpinProof, WonReward } from "@/types/experience";
import type { GiftChapterConfig } from "@/types/wish";
import { DEFAULT_ATTEMPTS, DEFAULT_MINI_GAME_ITEMS } from "@/lib/rewards-shared";
import { downloadRewardTicketPng } from "@/lib/reward-ticket";

interface GiftChapterProps {
  giftSubScreen: GiftSubScreen;
  config?: GiftChapterConfig;
  onNextSubScreen: () => void;
  primaryColor?: string;
  foregroundColor?: string;
  recipientName?: string;
}

/**
 * Screen 9: Gift Chapter.
 * Multi-stage: challenge → main gift → bonus intro → mini-game → reward result
 */
export const GiftChapter = ({
  giftSubScreen,
  config,
  onNextSubScreen,
  primaryColor = "#E91E63",
  foregroundColor = "#1A1A2E",
  recipientName,
}: GiftChapterProps) => {
  // Track every prize won on the spin wheel → shown on reward-result tickets
  const [wonItems, setWonItems] = useState<WonReward[]>([]);

  const handleWin = useCallback((won: WonReward) => {
    setWonItems((prev) => [...prev, won]);
  }, []);

  return (
    <div className="min-h-screen px-4 py-12">
      <AnimatePresence mode="wait">
        {giftSubScreen === "challenge" && (
          <GiftGate
            key="challenge"
            config={config}
            onComplete={onNextSubScreen}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
        {giftSubScreen === "main-gift" && (
          <MainGiftReveal
            key="main-gift"
            config={config}
            onComplete={onNextSubScreen}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
        {giftSubScreen === "bonus-intro" && (
          <BonusIntro
            key="bonus-intro"
            config={config}
            onComplete={onNextSubScreen}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
        {giftSubScreen === "mini-game" && (
          <MiniGame
            key="mini-game"
            config={config}
            onComplete={onNextSubScreen}
            onWin={handleWin}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
        {giftSubScreen === "reward-result" && (
          <RewardResult
            key="reward-result"
            wonItems={wonItems}
            onComplete={onNextSubScreen}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
        {giftSubScreen === "complete" && (
          <GoodbyeScreen
            key="complete"
            recipientName={recipientName}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Gift Gate (Challenge) ──────────────────────────────

const GiftGate = ({
  config,
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  config?: GiftChapterConfig;
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const gate = config?.gateAction ?? { type: "tap" as const, prompt: "Tap to open your gift! 🎁" };
  const [done, setDone] = useState(false);

  const handleComplete = () => {
    setDone(true);
    setTimeout(onComplete, 800);
  };

  return (
    <motion.div
      className="flex flex-col items-center py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <div className="mb-4 text-4xl">🎁</div>
      <h3
        className="mb-2 text-lg font-bold"
        style={{
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          color: foregroundColor,
        }}
      >
        Here is a special surprise gift for you!
      </h3>

      {gate.type === "password" && (
        <PasswordGate answer={gate.answer} onComplete={handleComplete} primaryColor={primaryColor} foregroundColor={foregroundColor} />
      )}
      {gate.type === "pin" && (
        <PinGate pin={gate.pin} hint={gate.hint} onComplete={handleComplete} primaryColor={primaryColor} foregroundColor={foregroundColor} />
      )}
      {gate.type === "yes-no" && (
        <YesNoGate prompt={gate.prompt} onComplete={handleComplete} primaryColor={primaryColor} foregroundColor={foregroundColor} />
      )}
      {gate.type === "tap" && (
        <motion.button
          onClick={handleComplete}
          className="mt-4 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            boxShadow: `0 4px 16px ${primaryColor}30`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {gate.prompt}
        </motion.button>
      )}
    </motion.div>
  );
};

// ─── PIN Gate ───────────────────────────────────────────

const PinGate = ({
  pin,
  hint,
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  pin: string;
  hint: string;
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const submit = useCallback(() => {
    if (input === pin) {
      setSuccess(true);
      setSubmitting(true);
      // Overlay animation takes ~3s, then fade out
      setTimeout(onComplete, 3200);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setInput("");
    }
  }, [input, pin, onComplete]);

  const handleDigit = (digit: string) => {
    if (input.length >= 4 || success || submitting) return;
    const next = input + digit;
    setInput(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === pin) {
          setSuccess(true);
          setSubmitting(true);
          setTimeout(onComplete, 3200);
        } else {
          setError(true);
          setTimeout(() => setError(false), 500);
          setInput("");
        }
      }, 150);
    }
  };

  const handleBackspace = () => {
    if (success || submitting) return;
    setInput((prev) => prev.slice(0, -1));
  };

  return (
    <motion.div
      className="mt-6 flex flex-col items-center"
      animate={error && !prefersReducedMotion ? { x: [-8, 8, -6, 6, 0] } : {}}
      role="region"
      aria-label="PIN challenge"
    >
      {/* Hint card */}
      <motion.div
        className="mb-6 rounded-2xl px-5 py-3"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}08)`,
          border: `1px solid ${primaryColor}20`,
        }}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs uppercase tracking-wider" style={{ color: primaryColor, opacity: 0.7 }}>
          Hint
        </p>
        <p className="mt-1 text-sm font-medium italic" style={{ color: foregroundColor }}>
          {hint} 💕
        </p>
      </motion.div>

      {/* PIN display */}
      <div className="mb-6 flex gap-3" role="group" aria-label="PIN entry display">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="flex h-14 w-12 items-center justify-center rounded-xl text-2xl font-bold"
            style={{
              background: input[i]
                ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`
                : `${foregroundColor}08`,
              border: `2px solid ${input[i] ? primaryColor : `${foregroundColor}15`}`,
              color: input[i] ? "white" : `${foregroundColor}30`,
              boxShadow: input[i] ? `0 4px 12px ${primaryColor}30` : "none",
            }}
            animate={
              error && !prefersReducedMotion
                ? { borderColor: "#ef4444", scale: [1, 1.05, 1] }
                : success && !prefersReducedMotion
                  ? { borderColor: "#10b981", scale: [1, 1.1, 1] }
                  : {}
            }
            transition={{ duration: 0.3 }}
            aria-label={`Digit ${i + 1}: ${input[i] ? "filled" : "empty"}`}
          >
            {input[i] ? "●" : "·"}
          </motion.div>
        ))}
      </div>

      {/* Numeric keypad */}
      <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Numeric keypad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <motion.button
            key={digit}
            onClick={() => handleDigit(digit)}
            disabled={success || submitting}
            className="h-14 w-16 rounded-xl text-lg font-semibold transition-colors"
            style={{
              background: `${foregroundColor}06`,
              color: foregroundColor,
              border: `1px solid ${foregroundColor}10`,
            }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05, background: `${primaryColor}15` }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
            aria-label={`Digit ${digit}`}
          >
            {digit}
          </motion.button>
        ))}
        <div className="h-14 w-16" />
        <motion.button
          onClick={() => handleDigit("0")}
          disabled={success || submitting}
          className="h-14 w-16 rounded-xl text-lg font-semibold transition-colors"
          style={{
            background: `${foregroundColor}06`,
            color: foregroundColor,
            border: `1px solid ${foregroundColor}10`,
          }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05, background: `${primaryColor}15` }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
          aria-label="Digit 0"
        >
          0
        </motion.button>
        <motion.button
          onClick={handleBackspace}
          disabled={success || submitting}
          className="h-14 w-16 rounded-xl text-lg font-semibold transition-colors"
          style={{
            background: `${foregroundColor}06`,
            color: foregroundColor,
            border: `1px solid ${foregroundColor}10`,
          }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05, background: `${foregroundColor}12` }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
          aria-label="Backspace"
        >
          ←
        </motion.button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-4 text-xs font-medium"
            style={{ color: "#ef4444" }}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
          >
            Wrong PIN! Try again 💔
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success overlay — 3s dramatic reveal */}
      <AnimatePresence>
        {success && (
          <PinSuccessOverlay
            pin={pin}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── PIN Success Overlay (3s dramatic reveal) ──────────

const PinSuccessOverlay = ({
  pin,
  primaryColor,
  foregroundColor,
  prefersReducedMotion,
}: {
  pin: string;
  primaryColor: string;
  foregroundColor: string;
  prefersReducedMotion: boolean;
}) => {
  // Confetti burst behind overlay
  const burst = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 16 : 50 }).map((_, i, arr) => ({
        id: i,
        angle: (i / arr.length) * 360 + (i % 7) * 3,
        distance: 80 + (i % 6) * 35,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 3 + (i % 4) * 2,
        delay: 0.3 + i * 0.02,
        duration: 1.8 + (i % 3) * 0.4,
      })),
    [prefersReducedMotion],
  );

  // Sparkle rain — white cores with pink glow, app theme
  const sparkleRain = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 6 : 18 }).map((_, i) => ({
        id: i,
        x: 5 + ((i * 11) % 90),
        delay: i * 0.12,
        duration: 2 + (i % 3) * 0.5,
        size: 2 + (i % 3) * 1.5,
      })),
    [prefersReducedMotion],
  );

  // Ambient floating hearts — romantic drift, none under reduced motion
  const hearts = useMemo(
    () =>
      prefersReducedMotion
        ? []
        : Array.from({ length: 7 }).map((_, i) => ({
            id: i,
            x: 10 + ((i * 13) % 80),
            size: 10 + (i % 3) * 4,
            opacity: 0.12 + (i % 3) * 0.07,
            delay: i * 0.9,
            duration: 8 + (i % 3) * 2,
          })),
    [prefersReducedMotion],
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="status"
      aria-live="polite"
      aria-label="PIN correct"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${primaryColor}30 0%, rgba(0,0,0,0.75) 100%)`,
          backdropFilter: "blur(8px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Radial light rays */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "150vmax",
            height: "150vmax",
            background: `conic-gradient(from 0deg, transparent 0deg, ${primaryColor}15 10deg, transparent 20deg, ${primaryColor}10 30deg, transparent 40deg, ${primaryColor}18 50deg, transparent 60deg, ${primaryColor}12 70deg, transparent 80deg, ${primaryColor}15 90deg, transparent 100deg, ${primaryColor}10 110deg, transparent 120deg, ${primaryColor}14 130deg, transparent 140deg, ${primaryColor}12 150deg, transparent 160deg, ${primaryColor}16 170deg, transparent 180deg, ${primaryColor}10 190deg, transparent 200deg, ${primaryColor}14 210deg, transparent 220deg, ${primaryColor}12 230deg, transparent 240deg, ${primaryColor}16 250deg, transparent 260deg, ${primaryColor}10 270deg, transparent 280deg, ${primaryColor}14 290deg, transparent 300deg, ${primaryColor}12 310deg, transparent 320deg, ${primaryColor}15 330deg, transparent 340deg, ${primaryColor}10 350deg, transparent 360deg)`,
            opacity: 0.6,
          }}
          initial={{ rotate: 0, scale: 0.3, opacity: 0 }}
          animate={{ rotate: 360, scale: 1, opacity: 0.6 }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.2, delay: 0.2 },
            opacity: { duration: 1 },
          }}
        />
      )}

      {/* Confetti burst */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {burst.map((p) => (
          <motion.div
            key={p.id}
            className="absolute left-1/2 top-1/2"
            style={{
              width: p.size,
              height: p.size * 1.8,
              backgroundColor: p.color,
              borderRadius: "2px",
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
            animate={{
              x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
              opacity: [0, 1, 1, 0],
              rotate: 360 + Math.random() * 720,
              scale: [0, 1.2, 1, 0.8],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
      </div>

      {/* Sparkle rain — white cores, pink glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {sparkleRain.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: "-5%",
              width: s.size,
              height: s.size,
              background: `radial-gradient(circle, #FFFFFF 0%, ${primaryColor} 100%)`,
              boxShadow: `0 0 6px #FFFFFF, 0 0 12px ${primaryColor}`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Ambient floating hearts */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            className="absolute bottom-0"
            style={{ left: `${h.x}%` }}
            initial={{ y: "5vh", opacity: 0, rotate: -8 }}
            animate={{
              y: "-105vh",
              opacity: [0, h.opacity, h.opacity, 0],
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Heart
              className="text-white"
              size={h.size}
              fill={primaryColor}
              style={{ filter: `drop-shadow(0 0 6px ${primaryColor}80)` }}
            />
          </motion.div>
        ))}
      </div>

      {/* Center content — glass card */}
      <motion.div
        className="relative z-10 flex w-full max-w-md flex-col items-center rounded-[32px] border px-8 py-10 sm:px-12"
        style={{
          borderColor: `${primaryColor}40`,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, " +
            `${primaryColor}14 100%)`,
          backdropFilter: "blur(16px)",
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px ${primaryColor}25, inset 0 1px 0 rgba(255,255,255,0.25)`,
        }}
        initial={{ scale: prefersReducedMotion ? 1 : 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 15 }}
      >
        {/* Corner ticks — manuscript-style, pink ink */}
        {[
          { top: 14, left: 14, rotate: 0 },
          { top: 14, right: 14, rotate: 90 },
          { bottom: 14, right: 14, rotate: 180 },
          { bottom: 14, left: 14, rotate: 270 },
        ].map((pos, i) => (
          <svg
            key={i}
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 18 18"
            className="pointer-events-none absolute"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rotate}deg)`,
              opacity: 0.55,
            }}
          >
            <path
              d="M2 2 L2 8 M2 2 L8 2"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ))}

        {/* "The answer is" — flanked by accent rules */}
        <motion.div
          className="mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span
            className="h-px w-8 sm:w-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${primaryColor})`,
            }}
          />
          <p
            className="text-[0.7rem] font-medium uppercase tracking-[0.3em]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            The answer is
          </p>
          <span
            className="h-px w-8 sm:w-12"
            style={{
              background: `linear-gradient(90deg, ${primaryColor}, transparent)`,
            }}
          />
        </motion.div>

        {/* PIN digits — dramatic one-by-one reveal, glass tiles */}
        <div className="mb-6 flex gap-2.5 sm:gap-3" role="presentation">
          {pin.split("").map((digit, i) => (
            <motion.div
              key={i}
              className="flex h-14 w-12 items-center justify-center rounded-2xl text-2xl font-black sm:h-16 sm:w-14 sm:text-3xl"
              style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.20), ${primaryColor}40)`,
                color: "white",
                textShadow: `0 1px 2px ${primaryColor}60`,
                boxShadow: `0 0 20px ${primaryColor}50, inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 12px rgba(0,0,0,0.3)`,
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(6px)",
              }}
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0,
                rotateY: prefersReducedMotion ? 0 : 90,
              }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                delay: 0.7 + i * 0.25,
                type: "spring",
                stiffness: 200,
                damping: 12,
              }}
            >
              {digit}
            </motion.div>
          ))}
        </div>

        {/* Seal medallion — check core, pulse rings, rotating dashed ring */}
        <motion.div
          className="relative mb-5 flex h-16 w-16 items-center justify-center"
          initial={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0,
          }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.65,
            type: "spring",
            stiffness: 220,
            damping: 14,
          }}
        >
          {/* Pulse rings */}
          {!prefersReducedMotion &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: `${primaryColor}80` }}
                animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: 1.8 + i * 1.1,
                  ease: "easeOut",
                }}
              />
            ))}

          {/* Rotating dashed ring */}
          {!prefersReducedMotion && (
            <motion.svg
              aria-hidden
              className="absolute -inset-1.5"
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="2"
                strokeDasharray="4 9"
                strokeLinecap="round"
              />
            </motion.svg>
          )}

          {/* Core */}
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: `linear-gradient(145deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 60%, black))`,
              boxShadow: `0 0 30px ${primaryColor}90, inset 0 2px 4px rgba(255,255,255,0.35), 0 6px 16px rgba(0,0,0,0.35)`,
            }}
          >
            <Check className="h-8 w-8 text-white" strokeWidth={3} aria-hidden />
          </div>
        </motion.div>

        {/* "correct!" */}
        <motion.p
          className="font-black"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            fontSize: "clamp(2.25rem, 6vw, 3rem)",
            background: `linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 60%, white) 0%, ${primaryColor} 45%, color-mix(in srgb, ${primaryColor} 70%, black) 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 2px 10px ${primaryColor}80)`,
          }}
          initial={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.3,
          }}
          animate={{ opacity: 1, scale: [0.3, 1.3, 1] }}
          transition={{
            delay: 1.8,
            duration: 0.6,
            times: [0, 0.6, 1],
          }}
        >
          correct!
        </motion.p>

        {/* Hand-drawn flourish underline */}
        <motion.svg
          width="150"
          height="16"
          viewBox="0 0 150 16"
          className="mt-1"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.05 }}
        >
          <motion.path
            d="M5 11 C 40 3, 110 3, 145 11"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.05, duration: 0.8, ease: "easeInOut" }}
          />
        </motion.svg>

        {/* Sparkle accents around correct */}
        {!prefersReducedMotion && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 360;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "62%",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    boxShadow: `0 0 8px #FFFFFF, 0 0 16px ${primaryColor}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos((angle * Math.PI) / 180) * 70,
                    y: Math.sin((angle * Math.PI) / 180) * 70,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    delay: 2.1 + i * 0.05,
                    duration: 0.8,
                  }}
                />
              );
            })}
          </>
        )}

        {/* "Unlocked" badge — app-theme glass pill */}
        <motion.div
          className="mt-6 flex items-center gap-2 rounded-full border px-5 py-2"
          style={{
            borderColor: `${primaryColor}60`,
            background: `linear-gradient(135deg, ${primaryColor}26, ${primaryColor}12)`,
            backdropFilter: "blur(8px)",
            boxShadow: `0 0 24px ${primaryColor}40, inset 0 1px 0 rgba(255,255,255,0.25)`,
          }}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, type: "spring", stiffness: 180, damping: 16 }}
        >
          <LockOpen className="h-4 w-4 text-white" aria-hidden />
          <p className="text-sm font-semibold tracking-wide text-white">Unlocked!</p>
        </motion.div>

        {/* Gift teaser — anticipation for next screen */}
        <motion.p
          className="mt-3 flex items-center gap-1.5 text-xs text-white/65 sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7, duration: 0.8 }}
        >
          <Gift className="h-3.5 w-3.5" style={{ color: primaryColor }} aria-hidden />
          Your gift is waiting…
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const PasswordGate = ({
  answer,
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  answer: string;
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (input.toLowerCase().trim() === answer.toLowerCase().trim()) {
      onComplete();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div
      className="mt-4 flex flex-col items-center"
      animate={error ? { x: [-6, 6, -4, 4, 0] } : {}}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Enter code..."
        className="mb-3 w-48 rounded-full border px-4 py-2.5 text-center text-sm outline-none"
        style={{
          borderColor: error ? "#ef4444" : `${primaryColor}30`,
          background: "rgba(255,255,255,0.6)",
          color: foregroundColor,
        }}
      />
      <button
        onClick={submit}
        className="rounded-full px-6 py-2 text-xs font-semibold text-white"
        style={{ background: primaryColor }}
      >
        Unlock ✨
      </button>
      {error && (
        <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>
          Wrong code!
        </p>
      )}
    </motion.div>
  );
};

const YesNoGate = ({
  prompt,
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  prompt: string;
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const [wrong, setWrong] = useState(false);

  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="mb-4 text-sm" style={{ color: foregroundColor, opacity: 0.6 }}>
        {prompt}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onComplete}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          style={{ background: primaryColor }}
        >
          Yes! 😍
        </button>
        <button
          onClick={() => setWrong(true)}
          className="rounded-full px-5 py-2.5 text-sm"
          style={{
            background: `${foregroundColor}08`,
            color: foregroundColor,
            opacity: 0.5,
          }}
        >
          No...
        </button>
      </div>
      {wrong && (
        <motion.p
          className="mt-3 text-xs"
          style={{ color: primaryColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        >
          Wrong answer! Try again 💕
        </motion.p>
      )}
    </div>
  );
};

// ─── Main Gift Reveal ───────────────────────────────────

const CONFETTI_COLORS = ["#E91E63", "#F48FB1", "#FF80AB", "#FFD54F", "#69F0AE", "#40C4FF", "#B388FF"];

const MainGiftReveal = ({
  config,
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  config?: GiftChapterConfig;
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const giftPhoto = config?.mainGiftPhotoIds?.[0] ?? "/Gift.jpg";
  const message = config?.mainGiftMessage;
  const [continuing, setContinuing] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Pre-compute celebration particles (stable across renders)
  const confettiWave1 = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 10 : 30 }).map((_, i, arr) => ({
        id: i,
        angle: (i / arr.length) * 360,
        distance: 80 + (i % 5) * 25,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 3 + (i % 4) * 2,
        delay: 0.2 + i * 0.02,
        duration: 1.8 + (i % 3) * 0.4,
      })),
    [prefersReducedMotion],
  );

  const confettiWave2 = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 8 : 25 }).map((_, i, arr) => ({
        id: i,
        angle: (i / arr.length) * 360 + 15,
        distance: 120 + (i % 6) * 30,
        color: CONFETTI_COLORS[(i + 3) % CONFETTI_COLORS.length],
        size: 4 + (i % 3) * 2,
        delay: 0.8 + i * 0.025,
        duration: 2 + (i % 4) * 0.3,
      })),
    [prefersReducedMotion],
  );

  const goldSparkles = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 5 : 14 }).map((_, i) => ({
        id: i,
        x: 8 + ((i * 13) % 85),
        delay: 0.5 + i * 0.15,
        duration: 2.5 + (i % 3) * 0.5,
        size: 2 + (i % 3) * 1.5,
      })),
    [prefersReducedMotion],
  );

  const floatingHearts = useMemo(
    () =>
      // Reduced motion: fewer hearts, no infinite loop
      Array.from({ length: prefersReducedMotion ? 3 : 6 }).map((_, i) => ({
        id: i,
        x: 10 + (i * 14) % 80,
        delay: i * 0.8,
        duration: 4 + (i % 3),
        size: 14 + (i % 3) * 4,
      })),
    [prefersReducedMotion],
  );

  const handleContinue = () => {
    setContinuing(true);
    onComplete();
  };

  return (
    <motion.div
      className="flex flex-col items-center py-6"
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Radial light rays behind gift */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "120vmax",
            height: "120vmax",
            background: `conic-gradient(from 0deg, transparent 0deg, ${primaryColor}12 15deg, transparent 30deg, ${primaryColor}10 45deg, transparent 60deg, ${primaryColor}14 75deg, transparent 90deg, ${primaryColor}10 105deg, transparent 120deg, ${primaryColor}12 135deg, transparent 150deg, ${primaryColor}10 165deg, transparent 180deg, ${primaryColor}14 195deg, transparent 210deg, ${primaryColor}10 225deg, transparent 240deg, ${primaryColor}12 255deg, transparent 270deg, ${primaryColor}10 285deg, transparent 300deg, ${primaryColor}14 315deg, transparent 330deg, ${primaryColor}12 345deg, transparent 360deg)`,
            opacity: 0.4,
          }}
          initial={{ rotate: 0, scale: 0.3, opacity: 0 }}
          animate={{ rotate: 360, scale: 1, opacity: 0.4 }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, delay: 0.3 },
            opacity: { duration: 1 },
          }}
        />
      )}

      {/* Celebration confetti — wave 1 */}
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {confettiWave1.map((p) => (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-1/3"
              style={{
                width: p.size,
                height: p.size * 1.8,
                backgroundColor: p.color,
                borderRadius: "2px",
              }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance + 80,
                opacity: [1, 1, 0],
                rotate: Math.random() * 720 - 360,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration confetti — wave 2 */}
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {confettiWave2.map((p) => (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-1/4"
              style={{
                width: p.size,
                height: p.size * 1.6,
                backgroundColor: p.color,
                borderRadius: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance + 120,
                opacity: [0, 1, 1, 0],
                scale: [0, 1.3, 1, 0.6],
                rotate: 360 + Math.random() * 540,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>
      )}

      {/* Golden sparkle rain */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {goldSparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: "-5%",
              width: s.size,
              height: s.size,
              background: "radial-gradient(circle, #FFD700 0%, #FFA500 100%)",
              boxShadow: "0 0 6px #FFD700, 0 0 12px #FFA500",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: prefersReducedMotion ? 0 : 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating hearts background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            className="absolute"
            style={{ left: `${h.x}%`, bottom: "-5%" }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -600, opacity: [0, 0.6, 0.6, 0] }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: "linear",
            }}
          >
            <span style={{ fontSize: h.size }}>💕</span>
          </motion.div>
        ))}
      </div>

      {/* Heading */}
      <motion.h3
        className="mb-2 text-xl font-bold"
        style={{
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}aa)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        🎁 Your Special Gift
      </motion.h3>

      {/* Gift photo with decorative frame */}
      <motion.div
        className="relative mb-6 mt-4"
        initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.8, rotate: prefersReducedMotion ? 0 : -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 12 }}
      >
        {/* Pulsing outer glow */}
        <motion.div
          className="absolute -inset-6 rounded-3xl blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}50, ${primaryColor}30, ${primaryColor}40)`,
          }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.5 }
              : {
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Decorative corner accents */}
        <motion.div
          className="absolute -left-2 -top-2 h-8 w-8 border-l-2 border-t-2 rounded-tl-lg"
          style={{ borderColor: primaryColor }}
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10, y: prefersReducedMotion ? 0 : -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.6 }}
        />
        <motion.div
          className="absolute -right-2 -top-2 h-8 w-8 border-r-2 border-t-2 rounded-tr-lg"
          style={{ borderColor: primaryColor }}
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 10, y: prefersReducedMotion ? 0 : -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.7 }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 rounded-bl-lg"
          style={{ borderColor: primaryColor }}
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.8 }}
        />
        <motion.div
          className="absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 rounded-br-lg"
          style={{ borderColor: primaryColor }}
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 10, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.9 }}
        />

        {/* Photo container - responsive */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            width: "min(260px, 70vw)",
            height: "min(260px, 70vw)",
            border: `3px solid ${primaryColor}50`,
            boxShadow: `0 12px 40px ${primaryColor}30, 0 4px 12px ${primaryColor}20, inset 0 0 20px ${primaryColor}10`,
          }}
        >
          <img
            src={giftPhoto}
            alt="Your special gift"
            className="h-full w-full object-cover"
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
            }}
            loading="lazy"
            width={260}
            height={260}
          />

          {/* Shine sweep animation */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 1.2,
                delay: 0.8,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Enhanced sparkle overlay */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${15 + ((i * 10) % 70)}%`,
                    top: `${15 + ((i * 13) % 70)}%`,
                    width: i % 3 === 0 ? 3 : 2,
                    height: i % 3 === 0 ? 3 : 2,
                    background: i % 4 === 0 ? "#FFD700" : "#FFFFFF",
                    boxShadow: i % 4 === 0 ? "0 0 4px #FFD700" : "0 0 4px #FFFFFF",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.4, 0.5],
                  }}
                  transition={{
                    duration: 1.2 + (i % 3) * 0.3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Ribbon on frame — pulsing */}
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            boxShadow: `0 4px 12px ${primaryColor}40`,
          }}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10, scale: prefersReducedMotion ? 1 : 0.8 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            boxShadow: prefersReducedMotion
              ? `0 4px 12px ${primaryColor}40`
              : [
                  `0 4px 12px ${primaryColor}40`,
                  `0 6px 20px ${primaryColor}70`,
                  `0 4px 12px ${primaryColor}40`,
                ],
          }}
          transition={{
            delay: 1,
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          Just for You ✨
        </motion.div>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.p
          className="mb-6 max-w-xs px-4 text-center text-sm italic leading-relaxed"
          style={{ color: foregroundColor, opacity: 0.75 }}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          &ldquo;{message}&rdquo;
        </motion.p>
      )}

      {/* Continue button */}
      <motion.button
        onClick={handleContinue}
        disabled={continuing}
        className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-70"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          boxShadow: `0 6px 20px ${primaryColor}40`,
        }}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={!prefersReducedMotion && !continuing ? { scale: 1.05, boxShadow: `0 8px 28px ${primaryColor}50` } : {}}
        whileTap={!prefersReducedMotion && !continuing ? { scale: 0.95 } : {}}
      >
        {continuing ? "Opening..." : "Continue →"}
      </motion.button>
    </motion.div>
  );
};

// ─── Bonus Intro ────────────────────────────────────────

const BonusIntro = ({
  config,
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  config?: GiftChapterConfig;
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const attempts = config?.miniGame?.attempts ?? 3;

  // Rising sparkle particles — celebratory teaser, none under reduced motion
  const sparkles = useMemo(
    () =>
      prefersReducedMotion
        ? []
        : Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            x: 12 + ((i * 15) % 76),
            size: 8 + (i % 3) * 3,
            opacity: 0.15 + (i % 3) * 0.08,
            delay: i * 0.7,
            duration: 7 + (i % 3) * 2,
          })),
    [prefersReducedMotion],
  );

  return (
    <motion.div
      className="relative flex flex-col items-center py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Ambient glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 60%)`,
        }}
      />

      {/* Rising sparkles */}
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          aria-hidden
          className="pointer-events-none absolute bottom-0"
          style={{ left: `${s.x}%`, color: primaryColor }}
          initial={{ y: "5vh", opacity: 0 }}
          animate={{ y: "-90vh", opacity: [0, s.opacity, s.opacity, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkle size={s.size} fill="currentColor" />
        </motion.span>
      ))}

      {/* Glass card */}
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center rounded-[28px] border px-8 py-10 text-center backdrop-blur-md"
        style={{
          borderColor: `${primaryColor}30`,
          background: `linear-gradient(160deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.35) 50%, ${primaryColor}12 100%)`,
          boxShadow: `0 20px 40px -12px ${primaryColor}25, inset 0 1px 0 rgba(255,255,255,0.4)`,
        }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Corner ticks — chapter motif */}
        {[
          { top: 14, left: 14, rotate: 0 },
          { top: 14, right: 14, rotate: 90 },
          { bottom: 14, right: 14, rotate: 180 },
          { bottom: 14, left: 14, rotate: 270 },
        ].map((pos, i) => (
          <svg
            key={i}
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 18 18"
            className="pointer-events-none absolute"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rotate}deg)`,
              opacity: 0.5,
            }}
          >
            <path
              d="M2 2 L2 8 M2 2 L8 2"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ))}

        {/* Gamepad medallion — spring entrance + gentle float */}
        <motion.div
          className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(145deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 60%, black))`,
            boxShadow: `0 0 30px ${primaryColor}50, inset 0 2px 4px rgba(255,255,255,0.35), 0 6px 16px rgba(0,0,0,0.15)`,
          }}
          initial={prefersReducedMotion ? false : { scale: 0.5, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { scale: 1, opacity: 1 }
              : { scale: 1, opacity: 1, y: [0, -6, 0] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.4 }
              : {
                  scale: { delay: 0.15, type: "spring", stiffness: 200, damping: 13 },
                  opacity: { delay: 0.15, duration: 0.4 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
                }
          }
        >
          <Gamepad2 className="h-9 w-9 text-white" aria-hidden />
        </motion.div>

        {/* Eyebrow — flanked rules */}
        <motion.div
          className="mb-4 flex items-center gap-3"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span
            className="h-px w-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${primaryColor}80)`,
            }}
          />
          <p
            className="text-[0.65rem] font-medium uppercase"
            style={{ color: primaryColor, letterSpacing: "0.3em" }}
          >
            Bonus round
          </p>
          <span
            className="h-px w-6"
            style={{
              background: `linear-gradient(90deg, ${primaryColor}80, transparent)`,
            }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h3
          className="mb-2 text-xl font-bold sm:text-2xl"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            color: foregroundColor,
          }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          But wait, there&apos;s more!
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          className="mb-5 text-sm"
          style={{ color: foregroundColor, opacity: 0.6 }}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          Here are some more surprises for you!
        </motion.p>

        {/* Attempts chip — glass pill with clover */}
        <motion.div
          className="mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2"
          style={{
            borderColor: `${primaryColor}40`,
            background: `${primaryColor}15`,
          }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Clover className="h-4 w-4" style={{ color: primaryColor }} aria-hidden />
          <p className="text-sm font-medium" style={{ color: primaryColor }}>
            You have {attempts} chances to win!
          </p>
        </motion.div>

        {/* CTA — Let's Play */}
        <motion.button
          onClick={onComplete}
          className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full px-10 py-3.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--btn-ring)]"
          style={
            {
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              boxShadow: `0 4px 20px ${primaryColor}45, inset 0 1px 0 rgba(255,255,255,0.25)`,
              "--btn-ring": primaryColor,
            } as CSSProperties
          }
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="h-4 w-4 fill-current" aria-hidden />
          Let&apos;s Play!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─── Mini Game (Real-World Spin Wheel) ────────────────────

const MiniGame = ({
  config,
  onComplete,
  onWin,
  primaryColor,
  foregroundColor,
}: {
  config?: GiftChapterConfig;
  onComplete: () => void;
  onWin: (won: WonReward) => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const items = config?.miniGame?.items ?? DEFAULT_MINI_GAME_ITEMS;
  const attempts = config?.miniGame?.attempts ?? DEFAULT_ATTEMPTS;
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [remaining, setRemaining] = useState(attempts);
  const [winner, setWinner] = useState<WonReward | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [spinError, setSpinError] = useState<string | null>(null);

  // Ephemeral viewer id — caps attempts per anonymous viewer server-side
  const playerIdRef = useRef<string>("");
  if (typeof window !== "undefined" && !playerIdRef.current) {
    let id = sessionStorage.getItem("wish_player_id");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("wish_player_id", id);
    }
    playerIdRef.current = id;
  }

  // Carnival palette — vibrant, high-contrast segments
  const segmentColors = useMemo(
    () => [
      "#FF6B6B", // Coral Red
      "#4ECDC4", // Teal
      "#FFE66D", // Yellow
      "#95E1D3", // Mint
      "#F38181", // Salmon
      "#AA96DA", // Lavender
      "#FCBAD3", // Pink
      "#A8D8EA", // Sky
    ],
    [],
  );

  // SVG geometry
  const wheelSize = 280; // Design size (responsive via CSS)
  const radius = 120;
  const center = 140;
  const segmentAngle = 360 / items.length;

  // Generate SVG path for each segment
  const segments = useMemo(() => {
    return items.map((item, i) => {
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;

      // Label position (center of segment, slightly inward)
      const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
      const labelRadius = radius * 0.62;
      const labelX = center + labelRadius * Math.cos(midAngle);
      const labelY = center + labelRadius * Math.sin(midAngle);
      const labelRotation = (i + 0.5) * segmentAngle;

      return {
        item,
        path: `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`,
        color: segmentColors[i % segmentColors.length],
        labelX,
        labelY,
        labelRotation,
      };
    });
  }, [items, segmentAngle, center, radius, segmentColors]);

  // Pegs around outer rim (like real wheel of fortune)
  const pegs = useMemo(() => {
    return items.map((_, i) => {
      const angle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
      const pegRadius = radius + 12;
      return {
        x: center + pegRadius * Math.cos(angle),
        y: center + pegRadius * Math.sin(angle),
      };
    });
  }, [items, segmentAngle, center, radius]);

  // Server-authoritative spin: winner decided in API (weighted crypto RNG),
  // client only animates the wheel to the returned segment (GIFT-03).
  const spin = useCallback(async () => {
    if (spinning || remaining <= 0) return;
    setSpinning(true);
    setWinner(null);
    setShowConfetti(false);
    setSpinError(null);

    const wishSlug = window.location.pathname.split("/")[2] ?? "";
    try {
      const res = await fetch(`/api/w/${wishSlug}/spin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: playerIdRef.current }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setSpinError(data.error ?? "Something went wrong — try again");
        if (res.status === 403) setRemaining(0);
        setSpinning(false);
        return;
      }

      const data = (await res.json()) as {
        item: { id: string; label: string; emoji: string; description: string };
        index: number;
        proof: SpinProof;
        remaining: number;
      };

      // Animate wheel to the SERVER-decided segment.
      // Segment i center sits at (i + 0.5) * segmentAngle clockwise from top,
      // so wheel must end at R ≡ 360 − center angle (mod 360).
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const jitter = (arr[0] / 2 ** 32 - 0.5) * segmentAngle * 0.7;
      const targetMod = ((((360 - (data.index + 0.5) * segmentAngle + jitter) % 360) + 360) % 360);
      const currentMod = (((rotation % 360) + 360) % 360);
      let delta = targetMod - currentMod;
      if (delta < 0) delta += 360;
      const fullTurns = 5 + Math.floor((arr[0] % 2)); // 5–6 full turns
      setRotation(rotation + fullTurns * 360 + delta);

      const spinDuration = prefersReducedMotion ? 50 : 4500;
      setTimeout(() => {
        const won: WonReward = {
          item: {
            id: data.item.id,
            label: data.item.label,
            emoji: data.item.emoji,
            description: data.item.description,
            probability: 0,
          },
          proof: data.proof,
        };
        setWinner(won);
        setRemaining(data.remaining);
        setSpinning(false);
        setShowConfetti(true);
        onWin(won);
      }, spinDuration);
    } catch {
      setSpinError("Network error — check your connection and try again");
      setSpinning(false);
    }
  }, [spinning, remaining, rotation, segmentAngle, prefersReducedMotion, onWin]);

  // Reset confetti after showing (useEffect — side effects don't belong in useMemo)
  useEffect(() => {
    if (showConfetti && winner) {
      const timer = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, winner]);

  return (
    <motion.div
      className="flex flex-col items-center px-4 py-8 sm:py-12"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Chances chip — glass pill */}
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 sm:mb-8"
        style={{
          borderColor: `${primaryColor}40`,
          background: `${primaryColor}15`,
        }}
      >
        <Clover className="h-4 w-4" style={{ color: primaryColor }} aria-hidden />
        <p className="text-sm font-semibold" style={{ color: primaryColor }}>
          {remaining} {remaining === 1 ? "chance" : "chances"} left
        </p>
      </div>

      {/* Wheel container with outer rim */}
      <div className="relative mb-8 sm:mb-12">
        {/* Outer decorative rim — rose chrome, app theme */}
        <div
          className="absolute -inset-4 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${primaryColor}, #ffffff, ${primaryColor}cc, #f8d7e3, ${primaryColor}aa, #ffffff, ${primaryColor})`,
            boxShadow: `0 8px 32px ${primaryColor}40, 0 0 0 4px ${primaryColor}20`,
            opacity: 0.9,
          }}
        />
        <div
          className="absolute -inset-2 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, #1A1A2E, #2D2D44, #1A1A2E, #2D2D44, #1A1A2E)`,
          }}
        />

        {/* Main wheel with SVG */}
        <div
          className="relative h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] md:h-[280px] md:w-[280px]"
          style={{
            borderRadius: "50%",
            boxShadow: `0 4px 20px ${primaryColor}30, inset 0 0 20px rgba(0,0,0,0.1)`,
          }}
        >
          <motion.svg
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            className="h-full w-full"
            style={{ overflow: "visible" }}
            animate={{ rotate: rotation }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 4.5,
                    // Strong deceleration — fast launch, long coast to stop (real wheel feel)
                    ease: [0.1, 0.62, 0.05, 1],
                  }
            }
          >
            {/* Segment fills */}
            {segments.map((seg, i) => (
              <path
                key={i}
                d={seg.path}
                fill={seg.color}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
            ))}

            {/* Pegs around rim — pearl with pink glow */}
            {pegs.map((peg, i) => (
              <circle
                key={i}
                cx={peg.x}
                cy={peg.y}
                r="4"
                fill="#FFFFFF"
                stroke={primaryColor}
                strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 0 3px ${primaryColor}80)` }}
              />
            ))}

            {/* Labels */}
            {segments.map((seg, i) => (
              <g
                key={i}
                transform={`translate(${seg.labelX}, ${seg.labelY}) rotate(${seg.labelRotation})`}
              >
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    paintOrder: "stroke",
                    stroke: "rgba(0,0,0,0.3)",
                    strokeWidth: "3px",
                  }}
                >
                  {seg.item.emoji}
                </text>
                <text
                  y="18"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                    paintOrder: "stroke",
                    stroke: "rgba(0,0,0,0.4)",
                    strokeWidth: "2px",
                  }}
                >
                  {seg.item.label.length > 8
                    ? `${seg.item.label.slice(0, 7)}…`
                    : seg.item.label}
                </text>
              </g>
            ))}
          </motion.svg>

          {/* Center hub — pink chrome, Sparkles mark */}
          <div
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-20 sm:w-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${primaryColor}dd, ${primaryColor}99)`,
              boxShadow: `0 4px 16px ${primaryColor}60, inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 4px 8px rgba(255,255,255,0.3)`,
              border: "4px solid rgba(255,255,255,0.85)",
            }}
          >
            <div className="flex flex-col items-center">
              <Sparkles className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden />
              <div className="text-[8px] font-bold uppercase tracking-wide text-white/90 sm:text-[9px]">
                Spin
              </div>
            </div>
          </div>
        </div>

        {/* Pointer at top — teardrop in theme pink; wiggles while wheel spins */}
        <motion.div
          className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 sm:-top-3"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}
          animate={
            spinning && !prefersReducedMotion
              ? { rotate: [0, -10, 8, -6, 4, 0] }
              : { rotate: 0 }
          }
          transition={
            spinning && !prefersReducedMotion
              ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        >
          <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden>
            <path
              d="M14 35 L4.5 10 C 8 2, 20 2, 23.5 10 Z"
              fill={primaryColor}
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="14" cy="7" r="3.5" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </motion.div>
      </div>

      {/* Spin button */}
      <motion.button
        onClick={spin}
        disabled={spinning || remaining <= 0}
        className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--btn-ring)] sm:px-10 sm:py-3.5 sm:text-base"
        style={
          {
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            boxShadow: `0 4px 20px ${primaryColor}45, inset 0 1px 0 rgba(255,255,255,0.25)`,
            border: "2px solid rgba(255,255,255,0.2)",
            "--btn-ring": primaryColor,
          } as CSSProperties
        }
        whileHover={!spinning ? { scale: 1.05, y: -2 } : {}}
        whileTap={!spinning ? { scale: 0.95 } : {}}
      >
        {spinning ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-flex"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
            </motion.span>
            Spinning…
          </>
        ) : remaining <= 0 ? (
          "No chances left"
        ) : (
          <>
            <Sparkles className="h-4 w-4" aria-hidden />
            SPIN!
          </>
        )}
      </motion.button>

      {/* Spin error — role=alert, near the control that failed */}
      {spinError && (
        <p
          role="alert"
          className="mt-3 text-center text-xs font-medium"
          style={{ color: "#ef4444" }}
        >
          {spinError}
        </p>
      )}

      {/* Winner announcement — glass card + confetti */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="relative mt-8 max-w-xs text-center sm:mt-10"
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            aria-live="polite"
          >
            {/* Confetti burst */}
            {showConfetti && !prefersReducedMotion && (
              <div className="pointer-events-none absolute -inset-10 overflow-visible" aria-hidden="true">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: 4 + (i % 3) * 2,
                      height: 6 + (i % 4) * 2,
                      backgroundColor: segmentColors[i % segmentColors.length],
                      borderRadius: "1px",
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      x: Math.cos((i / 32) * Math.PI * 2) * (50 + (i % 5) * 14),
                      y: Math.sin((i / 32) * Math.PI * 2) * (50 + (i % 5) * 14) + 20,
                      opacity: [1, 1, 0],
                      rotate: 360,
                    }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                ))}
              </div>
            )}

            <div
              className="relative rounded-2xl border px-6 py-5 backdrop-blur-md"
              style={{
                borderColor: `${primaryColor}40`,
                background: `linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.45) 55%, ${primaryColor}14 100%)`,
                boxShadow: `0 16px 32px -10px ${primaryColor}35, inset 0 1px 0 rgba(255,255,255,0.4)`,
              }}
            >
              <p
                className="text-[0.65rem] font-medium uppercase"
                style={{ color: primaryColor, letterSpacing: "0.3em" }}
              >
                You won!
              </p>
              <p className="mt-2 text-4xl" aria-hidden="true">
                {winner.item.emoji}
              </p>
              <p
                className="mt-1 text-lg font-bold"
                style={{
                  color: foregroundColor,
                  fontFamily: "var(--wish-font-heading), Playfair Display, serif",
                }}
              >
                {winner.item.label}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: foregroundColor, opacity: 0.6 }}>
                {winner.item.description}
              </p>

              {/* Download non-forgeable proof ticket (GIFT-03) */}
              <motion.button
                onClick={() =>
                  downloadRewardTicketPng({
                    item: winner.item,
                    proof: winner.proof,
                    primaryColor,
                    wishSlug: window.location.pathname.split("/")[2] ?? "",
                  })
                }
                className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--btn-ring)]"
                style={
                  {
                    borderColor: `${primaryColor}60`,
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                    boxShadow: `0 4px 14px ${primaryColor}40`,
                    "--btn-ring": primaryColor,
                  } as CSSProperties
                }
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                Download proof ticket
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue when done */}
      {remaining <= 0 && !spinning && (
        <motion.button
          onClick={onComplete}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--btn-ring)] sm:mt-8 sm:text-base"
          style={
            {
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              boxShadow: `0 4px 16px ${primaryColor}35`,
              "--btn-ring": primaryColor,
            } as CSSProperties
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
        >
          See my rewards
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
        </motion.button>
      )}
    </motion.div>
  );
};

// ─── Reward Result (Prize Ticket Wallet) ──────────────────
// Real-world reference: carnival redemption tickets + cinema
// admission stubs — cream paper, perforated stub, serial
// number, red "REDEEMED" rubber stamp.

const PAPER_COLORS = {
  paper: "#F5E6C8",
  paperDark: "#EBD9B5",
  sepia: "#D4A574",
  ink: "#5C4033",
};

const PrizeTicket = ({
  won,
  index,
  primaryColor,
}: {
  won: WonReward;
  index: number;
  primaryColor: string;
}) => {
  const { item, proof } = won;
  // Alternate slight tilts so the stack feels hand-dealt
  const tilt = index % 2 === 0 ? -1.2 : 1.4;

  return (
    <motion.div
      className="relative w-full max-w-sm"
      style={{ transform: `rotate(${tilt}deg)` }}
      initial={{ opacity: 0, y: 24, rotate: tilt * 3 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{
        delay: 0.15 + index * 0.18,
        type: "spring",
        stiffness: 180,
        damping: 18,
      }}
    >
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${PAPER_COLORS.paper} 0%, ${PAPER_COLORS.paperDark} 100%)`,
          border: `2px solid ${PAPER_COLORS.sepia}`,
          boxShadow: "0 6px 20px rgba(92, 64, 51, 0.25)",
        }}
      >
        {/* Ticket body — left side */}
        <div className="flex">
          <div className="flex-1 p-4 pr-3">
            {/* Header bar */}
            <div
              className="-mx-4 -mt-4 mb-3 px-4 py-1.5"
              style={{ background: primaryColor }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                🎟️ Prize Ticket
              </p>
            </div>

            {/* Prize content */}
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden="true">
                {item.emoji}
              </span>
              <div className="min-w-0">
                <p
                  className="truncate text-base font-bold"
                  style={{
                    color: PAPER_COLORS.ink,
                    fontFamily: "var(--wish-font-heading), Playfair Display, serif",
                  }}
                >
                  {item.label}
                </p>
                <p
                  className="mt-0.5 text-xs"
                  style={{ color: PAPER_COLORS.ink, opacity: 0.7 }}
                >
                  {item.description}
                </p>
              </div>
            </div>

            {/* Points row — server-issued */}
            <p
              className="mt-3 text-[11px] font-bold uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
              {proof.bonusPoints} Bonus Points
            </p>

            {/* Download PNG proof (GIFT-03) */}
            <button
              onClick={() =>
                downloadRewardTicketPng({
                  item,
                  proof,
                  primaryColor,
                  wishSlug: window.location.pathname.split("/")[2] ?? "",
                })
              }
              className="mt-2.5 inline-flex min-h-[32px] items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[color:var(--btn-ring)]"
              style={
                {
                  borderColor: primaryColor,
                  color: primaryColor,
                  "--btn-ring": primaryColor,
                } as CSSProperties
              }
            >
              <Download className="h-3 w-3" aria-hidden />
              Download PNG
            </button>
          </div>

          {/* Perforated divider + stub */}
          <div className="relative w-20 shrink-0 sm:w-24">
            {/* Dashed perforation line */}
            <div
              className="absolute left-0 top-2 bottom-2 border-l-2 border-dashed"
              style={{ borderColor: `${PAPER_COLORS.ink}55` }}
              aria-hidden="true"
            />
            {/* Notch holes at top & bottom of perforation */}
            <div
              className="absolute -left-2 -top-2 h-4 w-4 rounded-full"
              style={{ background: "var(--wish-bg, #fffaf3)" }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full"
              style={{ background: "var(--wish-bg, #fffaf3)" }}
              aria-hidden="true"
            />

            {/* Stub content — real serial + verify code */}
            <div className="flex h-full flex-col items-center justify-center gap-1 px-2 py-3">
              <p
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: PAPER_COLORS.ink, opacity: 0.6 }}
              >
                No.
              </p>
              <p
                className="text-[10px] font-bold tabular-nums"
                style={{ color: PAPER_COLORS.ink }}
              >
                {proof.serial}
              </p>
              <p
                className="mt-1 text-[8px] font-semibold uppercase tracking-wider"
                style={{ color: PAPER_COLORS.ink, opacity: 0.5 }}
              >
                Scan QR to verify
              </p>
            </div>
          </div>
        </div>

        {/* REDEEMED rubber stamp */}
        <div
          className="pointer-events-none absolute right-3 bottom-2 select-none"
          style={{ transform: "rotate(-14deg)" }}
          aria-hidden="true"
        >
          <p
            className="rounded border-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]"
            style={{
              color: "#DC2626",
              borderColor: "#DC2626",
              opacity: 0.55,
            }}
          >
            Redeemed
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const RewardResult = ({
  wonItems,
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  wonItems: WonReward[];
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const tickets = wonItems;

  return (
    <motion.div
      className="flex flex-col items-center px-2 py-8 sm:py-12"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Header */}
      <motion.div
        className="mb-2 text-5xl"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        🎪
      </motion.div>
      <h3
        className="mb-2 text-xl font-bold sm:text-2xl"
        style={{
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          color: foregroundColor,
        }}
      >
        Prize Booth
      </h3>
      <p
        className="mb-8 max-w-[36ch] text-center text-sm sm:mb-10"
        style={{ color: foregroundColor, opacity: 0.6 }}
      >
        {tickets.length > 0
          ? `You won ${tickets.length} ${tickets.length === 1 ? "prize" : "prizes"}! Download your proof tickets and send them to claim your rewards.`
          : "All your prizes are redeemed!"}
      </p>

      {/* Ticket stack */}
      <div className="flex w-full max-w-sm flex-col gap-4">
        {tickets.map((won, i) => (
          <PrizeTicket
            key={`${won.proof.verifyToken}-${i}`}
            won={won}
            index={i}
            primaryColor={primaryColor}
          />
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        className="mt-8 max-w-[40ch] text-center text-xs italic"
        style={{ color: foregroundColor, opacity: 0.45 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 0.15 + tickets.length * 0.18 }}
      >
        ✨ Each ticket has a QR code — your sender can scan it to verify it&apos;s real.
      </motion.p>

      {/* Continue */}
      <motion.button
        onClick={onComplete}
        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--btn-ring)] sm:mt-8 sm:px-10 sm:text-base"
        style={
          {
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            boxShadow: `0 4px 16px ${primaryColor}30`,
            "--btn-ring": primaryColor,
          } as CSSProperties
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue
        <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
      </motion.button>
    </motion.div>
  );
};

// ─── Goodbye Screen (Finale) ─────────────────────────────
// Real-world reference: cinema "The End" card + curtain-call
// finale — golden confetti, warm thank-you, soft fade-out.

const GoodbyeScreen = ({
  recipientName,
  primaryColor,
  foregroundColor,
}: {
  recipientName?: string;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Falling golden + primary confetti rain
  const confetti = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 12 : 36 }).map((_, i) => ({
        id: i,
        x: 3 + ((i * 13) % 94),
        delay: (i % 12) * 0.25,
        duration: 3.5 + (i % 5) * 0.6,
        size: 4 + (i % 4) * 2,
        color:
          i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? primaryColor : "#FFA500",
        drift: ((i % 7) - 3) * 8,
      })),
    [prefersReducedMotion, primaryColor],
  );

  // Twinkling stars
  const stars = useMemo(
    () =>
      Array.from({ length: prefersReducedMotion ? 4 : 10 }).map((_, i) => ({
        id: i,
        x: 5 + ((i * 17) % 90),
        y: 8 + ((i * 23) % 70),
        delay: i * 0.4,
        size: 8 + (i % 3) * 4,
      })),
    [prefersReducedMotion],
  );

  return (
    <motion.div
      className="relative flex min-h-[80dvh] flex-col items-center justify-center overflow-hidden px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      role="status"
      aria-live="polite"
    >
      {/* Falling confetti */}
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
            className="absolute text-yellow-400"
            style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.size }}
            animate={prefersReducedMotion ? {} : { opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.2, delay: s.delay, repeat: Infinity }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* Center card */}
      <motion.div
        className="relative z-10 flex max-w-md flex-col items-center text-center"
        initial={{ scale: prefersReducedMotion ? 1 : 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 140, damping: 16 }}
      >
        {/* Heart icon with pulse */}
        <motion.div
          className="mb-4 text-5xl sm:text-6xl"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          💖
        </motion.div>

        {/* Headline */}
        <h2
          className="mb-3 text-2xl font-bold leading-tight sm:text-3xl"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            color: foregroundColor,
          }}
        >
          {recipientName ? `Happy Birthday, ${recipientName}!` : "Happy Birthday!"}
        </h2>

        {/* Decorative divider */}
        <div className="mb-4 flex items-center gap-2" aria-hidden="true">
          <span className="h-px w-10" style={{ background: `${primaryColor}50` }} />
          <span className="text-sm" style={{ color: primaryColor }}>❤</span>
          <span className="h-px w-10" style={{ background: `${primaryColor}50` }} />
        </div>

        {/* Thank-you message */}
        <p
          className="mb-6 text-sm leading-relaxed sm:text-base"
          style={{ color: foregroundColor, opacity: 0.7 }}
        >
          Thank you for being part of this beautiful journey. Every chapter
          was written with love — just for you. May all your wishes come true!
        </p>

        {/* THE END cinema card */}
        <motion.div
          className="mb-6 rounded-lg px-6 py-3"
          style={{
            border: `1px solid ${primaryColor}30`,
            background: `${primaryColor}08`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.35em]"
            style={{ color: primaryColor }}
          >
            The End
          </p>
        </motion.div>

        {/* Attribution */}
        <motion.p
          className="text-xs"
          style={{ color: foregroundColor, opacity: 0.4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2 }}
        >
          Made with ❤️ — see you next year ✨
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
