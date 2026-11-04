"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { copy, interpolate } from "@/config/copy";
import type { StartAction } from "@/types/experience";

interface StartScreenProps {
  recipientName: string;
  /** Casual name for sender-voice copy; falls back to recipientName. */
  recipientNickname?: string;
  startAction: StartAction;
  onNext: () => void;
  onBack: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

/**
 * Screen 2: Are You Ready?
 * Occasion-specific interactive CTA.
 */
export const StartScreen = ({
  recipientName,
  recipientNickname = recipientName,
  startAction,
  onNext,
  onBack,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: StartScreenProps) => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
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
        <svg className="absolute inset-0 h-full w-full opacity-[0.025]">
          <filter id="startGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#startGrain)" />
        </svg>
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-md flex-col items-center px-5 py-8 text-center sm:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ── Greeting Card ─────────────────────── */}
        <motion.div
          className="w-full max-w-sm overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Gradient border */}
          <div
            className="rounded-2xl p-[1px]"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}30, ${secondaryColor}20, ${primaryColor}15)`,
            }}
          >
            <div
              className="rounded-2xl px-6 py-5 text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {/* Greeting */}
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                <span
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {interpolate(copy.start.hey, { recipientNickname })}
                </span>
              </h1>

              {/* Heart divider */}
              <div className="my-3 flex items-center justify-center gap-3">
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${primaryColor}20, transparent)`,
                  }}
                />
                <span style={{ color: primaryColor, fontSize: 10, opacity: 0.5 }}>❤️</span>
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${primaryColor}20, transparent)`,
                  }}
                />
              </div>

              {/* Sender message */}
              <p className="text-sm leading-relaxed opacity-70">
                {interpolate(copy.start.birthdayGreeting, { recipientNickname })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Occasion-specific interaction */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {startAction.type === "candles" && (
            <CakeCandles
              count={startAction.count}
              onComplete={onNext}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              foregroundColor={foregroundColor}
            />
          )}
          {startAction.type === "yes-no" && (
            <YesNoPrompt
              prompt={startAction.prompt}
              onYes={onNext}
              primaryColor={primaryColor}
              foregroundColor={foregroundColor}
            />
          )}
          {startAction.type === "password" && (
            <PasswordPrompt
              answer={startAction.answer}
              onComplete={onNext}
              primaryColor={primaryColor}
              foregroundColor={foregroundColor}
            />
          )}
          {startAction.type === "tap" && (
            <TapPrompt
              prompt={startAction.prompt}
              onComplete={onNext}
              primaryColor={primaryColor}
              foregroundColor={foregroundColor}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

// ─── Cake with Tappable Candles ─────────────────────────

/** Sprinkle positions for decoration */
const SPRINKLES = [
  { x: 12, y: 14, color: "#FFD54F", rotate: 30 },
  { x: 35, y: 8, color: "#F48FB1", rotate: -20 },
  { x: 58, y: 16, color: "#81D4FA", rotate: 45 },
  { x: 82, y: 10, color: "#A5D6A7", rotate: -35 },
  { x: 105, y: 15, color: "#CE93D8", rotate: 15 },
  { x: 22, y: 32, color: "#FFAB91", rotate: -45 },
  { x: 72, y: 30, color: "#FFD54F", rotate: 25 },
  { x: 95, y: 34, color: "#80CBC4", rotate: -10 },
];

const CakeCandles = ({
  count,
  onComplete,
  primaryColor,
  secondaryColor,
  foregroundColor,
}: {
  count: number;
  onComplete: () => void;
  primaryColor: string;
  secondaryColor: string;
  foregroundColor: string;
}) => {
  const [lit, setLit] = useState<number[]>([]);

  const toggleCandle = useCallback(
    (index: number) => {
      if (lit.includes(index)) return;
      const next = [...lit, index];
      setLit(next);
      if (next.length >= count) {
        setTimeout(onComplete, 1400);
      }
    },
    [lit, count, onComplete],
  );

  const allLit = lit.length >= count;

  return (
    <div className="flex flex-col items-center">
      {/* Cake */}
      <div className="relative flex flex-col items-center">
        {/* Candle glow (ambient when any are lit) */}
        {lit.length > 0 && (
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 220,
              height: 130,
              background: `radial-gradient(ellipse, rgba(255,200,60,0.15), transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* Candles row */}
        <div className="relative z-10 mb-0 flex justify-center gap-4 sm:gap-5">
          {Array.from({ length: count }, (_, i) => {
            const isLit = lit.includes(i);
            return (
              <motion.button
                key={i}
                onClick={() => toggleCandle(i)}
                className="flex flex-col items-center border-0 bg-transparent p-0 cursor-pointer"
                whileTap={{ scale: 0.9 }}
                aria-label={`Candle ${i + 1}`}
              >
                {/* Flame */}
                <AnimatePresence>
                  {isLit ? (
                    <motion.div
                      className="mb-0.5"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 250, damping: 12 }}
                    >
                      {/* Outer glow */}
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          width: 22,
                          height: 22,
                          background: `radial-gradient(circle, rgba(255,200,60,0.3), transparent)`,
                        }}
                      />
                      {/* Flame shape */}
                      <motion.div
                        animate={{
                          scaleY: [1, 1.18, 0.9, 1.1, 1],
                          scaleX: [1, 0.85, 1.1, 0.9, 1],
                        }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: 10,
                          height: 16,
                          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                          background:
                            "radial-gradient(ellipse at 50% 55%, #FFF9C4, #FFD54F 35%, #FF9800 70%, #E65100)",
                          boxShadow:
                            "0 0 8px #FF980060, 0 0 20px #FF980020, 0 -2px 6px #FFEB3B40",
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="mb-0.5 h-2.5 w-2.5 rounded-full"
                      style={{ background: `${primaryColor}25` }}
                    />
                  )}
                </AnimatePresence>
                {/* Candle stick */}
                <div
                  className="rounded-sm"
                  style={{
                    width: 5,
                    height: 20,
                    background: `linear-gradient(180deg, #fff8e1, ${secondaryColor}cc, ${secondaryColor})`,
                    boxShadow: `inset -1px 0 0 rgba(0,0,0,0.05), 0 1px 3px ${primaryColor}10`,
                  }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* ── Top tier (smallest) ──────────────── */}
        <div className="relative" style={{ width: 120, height: 44 }}>
          {/* Frosting */}
          <div
            className="absolute -top-2 left-0 right-0 h-4 rounded-t-2xl"
            style={{
              background: `linear-gradient(180deg, #fff, ${secondaryColor}90)`,
              boxShadow: `0 2px 6px ${primaryColor}10`,
            }}
          />
          {/* Drips */}
          {[12, 30, 50, 70, 90].map((x, i) => (
            <div
              key={`tdrip-${i}`}
              className="absolute rounded-b-full"
              style={{
                left: x,
                top: -2,
                width: 6,
                height: 7 + (i % 3) * 4,
                background: `linear-gradient(180deg, ${secondaryColor}90, ${secondaryColor}50)`,
              }}
            />
          ))}
          {/* Body */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-lg rounded-t-lg"
            style={{
              height: 40,
              background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor}dd)`,
              boxShadow: `inset 0 -3px 6px ${primaryColor}20, inset 0 2px 4px rgba(255,255,255,0.2)`,
            }}
          >
            <div
              className="absolute left-0 right-0"
              style={{ top: "45%", height: 2, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)` }}
            />
          </div>
        </div>

        {/* ── Middle tier ──────────────────────── */}
        <div className="relative" style={{ width: 170, height: 48 }}>
          {/* Frosting */}
          <div
            className="absolute -top-1.5 left-0 right-0 h-3.5"
            style={{
              background: `linear-gradient(180deg, #fff, ${secondaryColor}80)`,
              borderRadius: "4px 4px 0 0",
            }}
          />
          {/* Drips */}
          {[10, 32, 55, 78, 100, 122, 145].map((x, i) => (
            <div
              key={`mdrip-${i}`}
              className="absolute rounded-b-full"
              style={{
                left: x,
                top: -1,
                width: 5,
                height: 6 + (i % 4) * 3,
                background: `linear-gradient(180deg, ${secondaryColor}80, ${secondaryColor}40)`,
              }}
            />
          ))}
          {/* Body */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-xl"
            style={{
              height: 44,
              background: `linear-gradient(180deg, ${primaryColor}cc, ${primaryColor}aa)`,
              boxShadow: `inset 0 -3px 6px ${primaryColor}18, inset 0 2px 4px rgba(255,255,255,0.15)`,
            }}
          >
            {/* Sprinkles on middle tier */}
            {SPRINKLES.map((s, i) => (
              <div
                key={`sprinkle-${i}`}
                className="absolute rounded-full"
                style={{
                  left: s.x,
                  top: s.y,
                  width: 4,
                  height: 4,
                  backgroundColor: s.color,
                  transform: `rotate(${s.rotate}deg)`,
                  opacity: 0.7,
                }}
              />
            ))}
            <div
              className="absolute left-0 right-0"
              style={{ top: "40%", height: 2, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)` }}
            />
            <div
              className="absolute left-0 right-0"
              style={{ top: "70%", height: 2, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` }}
            />
          </div>
        </div>

        {/* ── Bottom tier (largest) ─────────────── */}
        <div className="relative" style={{ width: 220, height: 52 }}>
          {/* Frosting */}
          <div
            className="absolute -top-1.5 left-0 right-0 h-3.5"
            style={{
              background: `linear-gradient(180deg, #fff, ${secondaryColor}75)`,
              borderRadius: "4px 4px 0 0",
            }}
          />
          {/* Drips */}
          {[8, 28, 50, 72, 95, 118, 140, 162, 185].map((x, i) => (
            <div
              key={`bdrip-${i}`}
              className="absolute rounded-b-full"
              style={{
                left: x,
                top: -1,
                width: 5,
                height: 5 + (i % 5) * 3,
                background: `linear-gradient(180deg, ${secondaryColor}75, ${secondaryColor}35)`,
              }}
            />
          ))}
          {/* Body */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-2xl"
            style={{
              height: 48,
              background: `linear-gradient(180deg, ${primaryColor}bb, ${primaryColor}99)`,
              boxShadow: `0 8px 24px ${primaryColor}18, inset 0 2px 4px rgba(255,255,255,0.12)`,
            }}
          >
            <div
              className="absolute left-0 right-0"
              style={{ top: "30%", height: 2, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)` }}
            />
            <div
              className="absolute left-0 right-0"
              style={{ top: "55%", height: 2, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` }}
            />
            <div
              className="absolute left-0 right-0"
              style={{ top: "80%", height: 2, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)` }}
            />
            {/* Bottom edge shadow */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(180deg, transparent, rgba(0,0,0,0.06))` }}
            />
          </div>
        </div>

        {/* Plate */}
        <div
          className="rounded-full"
          style={{
            width: 250,
            height: 10,
            background: "linear-gradient(180deg, #f5f5f5, #e0e0e0, #bdbdbd)",
            boxShadow: "0 3px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        />
        {/* Plate shadow */}
        <div
          className="mt-1 rounded-full"
          style={{
            width: 200,
            height: 6,
            background: `radial-gradient(ellipse, ${primaryColor}10, transparent)`,
          }}
        />
      </div>

      {/* Tap guide */}
      <AnimatePresence>
        {!allLit && (
          <motion.p
            className="mt-3 text-xs"
            style={{ color: foregroundColor, opacity: 0.4 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
          >
            {interpolate(copy.start.candlesGuide, { lit: lit.length, count })}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {allLit && (
          <motion.div
            className="mt-5 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <p className="text-xl font-bold" style={{ color: primaryColor }}>
              {copy.start.candlesSuccess}
            </p>
            <p
              className="mt-1 text-xs"
              style={{ color: foregroundColor, opacity: 0.5 }}
            >
              {copy.start.getReady}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Yes / No Prompt ────────────────────────────────────

const YesNoPrompt = ({
  prompt,
  onYes,
  primaryColor,
  foregroundColor,
}: {
  prompt: string;
  onYes: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  const [wrongCount, setWrongCount] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-4xl">💕</div>

      <motion.p
        className="mb-8 max-w-xs text-base"
        style={{
          color: foregroundColor,
          opacity: 0.8,
        }}
        animate={
          wrongCount > 0
            ? { x: [-8, 8, -6, 6, 0] }
            : {}
        }
        transition={{ duration: 0.4 }}
        key={wrongCount}
      >
        {prompt}
      </motion.p>

      <div className="flex gap-4">
        <motion.button
          onClick={onYes}
          className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
            boxShadow: `0 4px 16px ${primaryColor}30`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Yes, I'm ready! 😍
        </motion.button>

        <motion.button
          onClick={() => setWrongCount((c) => c + 1)}
          className="rounded-full px-6 py-3 text-sm font-medium"
          style={{
            background: `${foregroundColor}08`,
            color: foregroundColor,
            opacity: 0.5,
            border: `1px solid ${foregroundColor}15`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Not yet...
        </motion.button>
      </div>

      {wrongCount > 0 && (
        <motion.p
          className="mt-4 text-xs"
          style={{ color: primaryColor, opacity: 0.6 }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 0.6, y: 0 }}
        >
          Wrong answer! Try again 💕
        </motion.p>
      )}
    </div>
  );
};

// ─── Password Prompt ────────────────────────────────────

const PasswordPrompt = ({
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

  const handleSubmit = () => {
    if (input.toLowerCase().trim() === answer.toLowerCase().trim()) {
      onComplete();
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-4xl">🔐</div>

      <p
        className="mb-6 text-sm"
        style={{ color: foregroundColor, opacity: 0.6 }}
      >
        Type the secret code to continue
      </p>

      <motion.div
        animate={error ? { x: [-8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter code..."
          className="w-56 rounded-full border px-5 py-3 text-center text-sm outline-none"
          style={{
            borderColor: error ? "#ef4444" : `${primaryColor}30`,
            background: "rgba(255,255,255,0.6)",
            color: foregroundColor,
          }}
        />
      </motion.div>

      <motion.button
        onClick={handleSubmit}
        className="mt-4 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          boxShadow: `0 4px 16px ${primaryColor}30`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Unlock ✨
      </motion.button>

      {error && (
        <motion.p
          className="mt-3 text-xs"
          style={{ color: "#ef4444" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Wrong code — try again!
        </motion.p>
      )}
    </div>
  );
};

// ─── Tap Prompt ─────────────────────────────────────────

const TapPrompt = ({
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
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-4xl">🎁</div>

      <p
        className="mb-8 max-w-xs text-base"
        style={{
          color: foregroundColor,
          opacity: 0.8,
        }}
      >
        {prompt}
      </p>

      <motion.button
        onClick={onComplete}
        className="rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          boxShadow: `0 6px 24px ${primaryColor}35`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let's go! 🎉
      </motion.button>
    </div>
  );
};
