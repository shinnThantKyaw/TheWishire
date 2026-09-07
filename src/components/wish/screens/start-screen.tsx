"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { StartAction } from "@/types/experience";

interface StartScreenProps {
  recipientName: string;
  senderName: string;
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
  senderName,
  startAction,
  onNext,
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
  foregroundColor = "#1A1A2E",
}: StartScreenProps) => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12"
      style={{ backgroundColor }}
    >
      {/* Soft gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}08 0%, transparent 60%)`,
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Greeting */}
        <motion.h1
          className="text-2xl font-bold leading-tight"
          style={{
            fontFamily: "var(--wish-font-heading), Playfair Display, serif",
            color: foregroundColor,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Hey {recipientName}!
        </motion.h1>

        <motion.p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: foregroundColor, opacity: 0.65 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {senderName} prepared something special for you
        </motion.p>

        {/* Occasion-specific interaction */}
        <motion.div
          className="mt-8"
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
        setTimeout(onComplete, 1200);
      }
    },
    [lit, count, onComplete],
  );

  const allLit = lit.length >= count;

  return (
    <div className="flex flex-col items-center">
      <p
        className="mb-6 text-sm"
        style={{ color: foregroundColor, opacity: 0.5 }}
      >
        Tap each candle to light it ({lit.length}/{count})
      </p>

      {/* Cake */}
      <div className="relative">
        {/* Top tier */}
        <div
          className="relative mx-auto rounded-t-lg"
          style={{
            width: 80,
            height: 40,
            background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor}dd)`,
            boxShadow: `inset 0 -3px 6px ${primaryColor}30, 0 2px 8px ${primaryColor}15`,
          }}
        >
          {/* Frosting drips */}
          <div
            className="absolute -top-1 left-0 right-0 h-3 rounded-t-lg"
            style={{
              background: `linear-gradient(180deg, white, ${secondaryColor}80)`,
            }}
          />
          {/* Candles */}
          <div className="absolute -top-7 left-0 right-0 flex justify-center gap-3">
            {Array.from({ length: count }, (_, i) => {
              const isLit = lit.includes(i);
              return (
                <motion.button
                  key={i}
                  onClick={() => toggleCandle(i)}
                  className="flex flex-col items-center border-0 bg-transparent p-0"
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
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          animate={{
                            scaleY: [1, 1.15, 0.95, 1],
                            scaleX: [1, 0.9, 1.05, 1],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            width: 8,
                            height: 12,
                            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                            background:
                              "radial-gradient(ellipse at 50% 60%, #FFEB3B, #FF9800)",
                            boxShadow: "0 0 8px #FF980060",
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="mb-0.5 h-2 w-2 rounded-full"
                        style={{ background: `${primaryColor}30` }}
                      />
                    )}
                  </AnimatePresence>
                  {/* Candle stick */}
                  <div
                    className="rounded-sm"
                    style={{
                      width: 4,
                      height: 16,
                      background: `linear-gradient(180deg, white, ${secondaryColor})`,
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom tier */}
        <div
          className="rounded-b-xl"
          style={{
            width: 120,
            height: 50,
            marginLeft: -20,
            background: `linear-gradient(180deg, ${primaryColor}cc, ${primaryColor})`,
            boxShadow: `0 6px 20px ${primaryColor}25`,
          }}
        >
          <div
            className="h-3 rounded-b-xl"
            style={{
              background: `linear-gradient(180deg, white, ${secondaryColor}60)`,
            }}
          />
        </div>

        {/* Plate */}
        <div
          className="mx-auto -mt-1 rounded-full"
          style={{
            width: 140,
            height: 8,
            background: "linear-gradient(180deg, #e0e0e0, #bdbdbd)",
          }}
        />
      </div>

      {/* Success */}
      <AnimatePresence>
        {allLit && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-lg font-bold" style={{ color: primaryColor }}>
              🎉 Happy Birthday!
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
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
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
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
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
