"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { GiftSubScreen } from "@/types/experience";
import type { GiftChapterConfig } from "@/types/wish";

interface GiftChapterProps {
  giftSubScreen: GiftSubScreen;
  config?: GiftChapterConfig;
  onNextSubScreen: () => void;
  primaryColor?: string;
  foregroundColor?: string;
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
}: GiftChapterProps) => {
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
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
        {giftSubScreen === "reward-result" && (
          <RewardResult
            key="reward-result"
            onComplete={onNextSubScreen}
            primaryColor={primaryColor}
            foregroundColor={foregroundColor}
          />
        )}
        {giftSubScreen === "complete" && (
          <motion.div
            key="complete"
            className="flex min-h-[50vh] items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm" style={{ color: foregroundColor, opacity: 0.4 }}>
              All gifts revealed ✨
            </p>
          </motion.div>
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
  return (
    <motion.div
      className="flex flex-col items-center py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <div className="mb-4 text-4xl">🎁</div>
      <h3
        className="mb-4 text-lg font-bold"
        style={{
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          color: foregroundColor,
        }}
      >
        Here is your gift!
      </h3>

      {/* Gift photos */}
      <div className="mb-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 w-20 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}40)`,
              boxShadow: `0 2px 8px ${primaryColor}15`,
            }}
          />
        ))}
      </div>

      {config?.mainGiftMessage && (
        <p
          className="mb-6 max-w-xs text-center text-sm italic"
          style={{ color: foregroundColor, opacity: 0.7 }}
        >
          &ldquo;{config.mainGiftMessage}&rdquo;
        </p>
      )}

      <motion.button
        onClick={onComplete}
        className="rounded-full px-6 py-2.5 text-sm font-semibold text-white"
        style={{
          background: primaryColor,
          boxShadow: `0 4px 12px ${primaryColor}30`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue →
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
  const attempts = config?.miniGame?.attempts ?? 3;

  return (
    <motion.div
      className="flex flex-col items-center py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <motion.div
        className="mb-4 text-4xl"
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        🎉
      </motion.div>
      <h3
        className="mb-2 text-lg font-bold"
        style={{
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          color: foregroundColor,
        }}
      >
        But wait, there&apos;s more!
      </h3>
      <p className="mb-1 text-sm" style={{ color: foregroundColor, opacity: 0.6 }}>
        Here are some more surprises for you!
      </p>
      <p className="mb-6 text-sm font-medium" style={{ color: primaryColor }}>
        🍀 You have {attempts} chances to win!
      </p>

      <motion.button
        onClick={onComplete}
        className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          boxShadow: `0 4px 16px ${primaryColor}30`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let&apos;s Play! 🎰
      </motion.button>
    </motion.div>
  );
};

// ─── Mini Game (Spin Wheel) ─────────────────────────────

const MiniGame = ({
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
  const items = config?.miniGame?.items ?? [
    { id: "1", label: "Love Note", emoji: "💌", description: "A sweet note", probability: 25 },
    { id: "2", label: "Flowers", emoji: "🌸", description: "Virtual flowers", probability: 25 },
    { id: "3", label: "Chocolate", emoji: "🍫", description: "Sweet treat", probability: 25 },
    { id: "4", label: "Star Gift", emoji: "⭐", description: "Special prize", probability: 25 },
  ];
  const attempts = config?.miniGame?.attempts ?? 3;
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [remaining, setRemaining] = useState(attempts);
  const [winner, setWinner] = useState<string | null>(null);

  const colors = ["#E91E63", "#9C27B0", "#2196F3", "#4CAF50", "#FF9800", "#00BCD4"];

  const spin = useCallback(() => {
    if (spinning || remaining <= 0) return;
    setSpinning(true);
    setWinner(null);

    const winIndex = Math.floor(Math.random() * items.length);
    const segmentAngle = 360 / items.length;
    const targetAngle = 360 - winIndex * segmentAngle - segmentAngle / 2;
    const totalRotation = rotation + 1440 + targetAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setWinner(items[winIndex].label);
      setRemaining((r) => r - 1);
      setSpinning(false);
    }, 4000);
  }, [spinning, remaining, rotation, items]);

  return (
    <motion.div
      className="flex flex-col items-center py-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <p className="mb-4 text-sm font-medium" style={{ color: primaryColor }}>
        🍀 Chances: {remaining}
      </p>

      {/* Wheel */}
      <div className="relative mb-6">
        <div
          className="h-48 w-48 overflow-hidden rounded-full"
          style={{
            boxShadow: `0 4px 20px ${primaryColor}25`,
            border: `3px solid ${primaryColor}30`,
          }}
        >
          <motion.div
            className="h-full w-full"
            style={{
              background: `conic-gradient(${items
                .map(
                  (item, i) =>
                    `${colors[i % colors.length]} ${i * (360 / items.length)}deg ${(i + 1) * (360 / items.length)}deg`,
                )
                .join(", ")})`,
              transform: `rotate(${rotation}deg)`,
            }}
            animate={spinning ? {} : {}}
            transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
          />
        </div>

        {/* Pointer */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: `14px solid ${primaryColor}`,
          }}
        />

        {/* Center */}
        <div
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{
            background: primaryColor,
            boxShadow: `0 2px 8px ${primaryColor}40`,
          }}
        >
          🎰
        </div>
      </div>

      {/* Spin button */}
      <motion.button
        onClick={spin}
        disabled={spinning || remaining <= 0}
        className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
          boxShadow: `0 4px 16px ${primaryColor}30`,
        }}
        whileHover={!spinning ? { scale: 1.05 } : {}}
        whileTap={!spinning ? { scale: 0.95 } : {}}
      >
        {spinning ? "Spinning..." : remaining <= 0 ? "No chances left" : "SPIN! 🎡"}
      </motion.button>

      {/* Winner */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm font-bold" style={{ color: primaryColor }}>
              🎉 You won: {winner}!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue when done */}
      {remaining <= 0 && !spinning && (
        <motion.button
          onClick={onComplete}
          className="mt-4 rounded-full px-6 py-2 text-sm font-semibold text-white"
          style={{ background: primaryColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          See my rewards →
        </motion.button>
      )}
    </motion.div>
  );
};

// ─── Reward Result ──────────────────────────────────────

const RewardResult = ({
  onComplete,
  primaryColor,
  foregroundColor,
}: {
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}) => {
  return (
    <motion.div
      className="flex flex-col items-center py-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <motion.div
        className="mb-4 text-5xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: 2 }}
      >
        🏆
      </motion.div>
      <h3
        className="mb-2 text-lg font-bold"
        style={{
          fontFamily: "var(--wish-font-heading), Playfair Display, serif",
          color: foregroundColor,
        }}
      >
        Congratulations!
      </h3>
      <p className="mb-6 text-sm" style={{ color: foregroundColor, opacity: 0.6 }}>
        You&apos;ve received all your rewards!
      </p>

      <motion.button
        onClick={onComplete}
        className="rounded-full px-6 py-2.5 text-sm font-semibold text-white"
        style={{
          background: primaryColor,
          boxShadow: `0 4px 12px ${primaryColor}30`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue →
      </motion.button>
    </motion.div>
  );
};
