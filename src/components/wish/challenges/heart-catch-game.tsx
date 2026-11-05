"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { copy, interpolate } from "@/config/copy";

interface HeartCatchGameProps {
  heartsToCatch: number;
  timeLimitSeconds: number;
  spawnIntervalMs?: number;
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}

interface FallingHeart {
  id: number;
  /** Horizontal position (%) across the play area. */
  leftPct: number;
}

type Phase = "intro" | "playing" | "validating" | "success" | "failed";

/** How long one heart takes to cross the play area (ms). */
const FALL_DURATION_MS = 4200;
const DEFAULT_SPAWN_INTERVAL_MS = 900;

/**
 * Heart-catch challenge gate (Wave 2.3/2.4).
 *
 * Mobile-first: hearts fall through a fixed play area, tap/click to
 * catch. Catch N within T seconds, then the result is re-validated by
 * the server (elapsed time + count) before the gate opens. The elapsed
 * floor on the server rejects instant fake submissions; the game itself
 * is casual UX, not an anti-cheat boundary.
 */
export const HeartCatchGame = ({
  heartsToCatch,
  timeLimitSeconds,
  spawnIntervalMs = DEFAULT_SPAWN_INTERVAL_MS,
  onComplete,
  primaryColor,
  foregroundColor,
}: HeartCatchGameProps) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);

  const nextHeartIdRef = useRef(0);
  const startedAtRef = useRef(0);
  const caughtRef = useRef(0);
  const phaseRef = useRef<Phase>("intro");

  // Keep phase in a ref so timer callbacks can bail out after a win.
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const startGame = useCallback(() => {
    setCaught(0);
    caughtRef.current = 0;
    setTimeLeft(timeLimitSeconds);
    setHearts([]);
    startedAtRef.current = Date.now();
    phaseRef.current = "playing";
    setPhase("playing");
  }, [timeLimitSeconds]);

  // Spawn hearts while playing.
  useEffect(() => {
    if (phase !== "playing") return;
    const spawn = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: nextHeartIdRef.current++,
          leftPct: 6 + Math.random() * 78,
        },
      ]);
    }, spawnIntervalMs);
    return () => clearInterval(spawn);
  }, [phase, spawnIntervalMs]);

  // Countdown while playing.
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (phaseRef.current === "playing") {
            phaseRef.current = "failed";
            setPhase("failed");
            setHearts([]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [phase]);

  const validateWin = useCallback(async () => {
    phaseRef.current = "validating";
    setPhase("validating");
    const elapsedMs = Date.now() - startedAtRef.current;
    try {
      const slug = window.location.pathname.split("/")[2] ?? "";
      const res = await fetch(`/api/w/${slug}/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "heart-catch", caught: caughtRef.current, elapsedMs }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (res.ok && data.ok) {
        phaseRef.current = "success";
        setPhase("success");
        setHearts([]);
        setTimeout(onComplete, 900);
      } else {
        phaseRef.current = "failed";
        setPhase("failed");
        setHearts([]);
      }
    } catch {
      phaseRef.current = "failed";
      setPhase("failed");
      setHearts([]);
    }
  }, [onComplete]);

  const catchHeart = useCallback(
    (id: number) => {
      if (phaseRef.current !== "playing") return;
      setHearts((prev) => prev.filter((h) => h.id !== id));
      // Ref-based count: no side effects inside a state updater (StrictMode
      // would double-invoke it and fire validateWin twice).
      const next = caughtRef.current + 1;
      caughtRef.current = next;
      setCaught(next);
      if (next >= heartsToCatch) {
        void validateWin();
      }
    },
    [heartsToCatch, validateWin],
  );

  // Remove hearts that fall past the play area (missed).
  const handleFallComplete = useCallback((id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const introCopy = interpolate(copy.challenges.heartCatch.intro, {
    hearts: heartsToCatch,
    seconds: timeLimitSeconds,
  });

  return (
    <div className="mt-6 flex w-full max-w-sm flex-col items-center px-4">
      {/* ── HUD ─────────────────────────────────── */}
      <div
        className="mb-3 flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold"
        style={{ backgroundColor: `${primaryColor}12`, color: foregroundColor }}
      >
        <span>{interpolate(copy.challenges.heartCatch.progress, { caught, hearts: heartsToCatch })}</span>
        {phase !== "intro" && (
          <span aria-live="polite">
            {interpolate(copy.challenges.heartCatch.timeLeft, { seconds: timeLeft })}
          </span>
        )}
      </div>

      {/* ── Intro / result overlays ─────────────── */}
      {phase === "intro" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm" style={{ color: foregroundColor, opacity: 0.75 }}>
            {introCopy}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              boxShadow: `0 4px 16px ${primaryColor}30`,
            }}
          >
            {copy.challenges.heartCatch.start}
          </button>
        </div>
      )}

      {phase === "failed" && (
        <div className="flex flex-col items-center gap-4" role="status">
          <p className="text-center text-sm font-medium" style={{ color: "#ef4444" }}>
            {copy.challenges.heartCatch.timeUp}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
          >
            {copy.challenges.heartCatch.start}
          </button>
        </div>
      )}

      {phase === "success" && (
        <p className="text-center text-base font-bold" style={{ color: "#22c55e" }} role="status">
          {copy.challenges.heartCatch.success}
        </p>
      )}

      {phase === "validating" && (
        <p className="text-center text-xs" style={{ color: foregroundColor, opacity: 0.6 }}>
          {copy.challenges.checking}
        </p>
      )}

      {/* ── Play area ───────────────────────────── */}
      {(phase === "playing" || phase === "validating" || phase === "success") && (
        <div
          className="relative h-[45vh] max-h-[380px] min-h-[240px] w-full overflow-hidden rounded-2xl border"
          style={{
            borderColor: `${primaryColor}30`,
            backgroundColor: `${primaryColor}06`,
            touchAction: "manipulation",
          }}
          aria-label={introCopy}
        >
          {hearts.map((heart) => (
            <motion.button
              key={heart.id}
              type="button"
              aria-label="❤️"
              onClick={() => catchHeart(heart.id)}
              className="absolute flex h-14 w-14 items-center justify-center text-4xl focus-visible:outline-2"
              style={{ left: `${heart.leftPct}%`, outlineColor: primaryColor }}
              initial={{ top: "-12%", opacity: 0 }}
              animate={{ top: "112%", opacity: 1 }}
              transition={{ duration: FALL_DURATION_MS / 1000, ease: "linear", opacity: { duration: 0.2 } }}
              onAnimationComplete={() => handleFallComplete(heart.id)}
              whileTap={{ scale: 1.3 }}
            >
              ❤️
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
