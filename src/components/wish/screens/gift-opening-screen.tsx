"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

import { copy, giftOpeningOccasionCopy, interpolate } from "@/config/copy";

interface GiftOpeningScreenProps {
  onNext: () => void;
  onBack: () => void;
  recipientName?: string;
  occasion?: string;
  senderName?: string;
  /** Casual names for sender-voice copy; fall back to the full names. */
  recipientNickname?: string;
  senderNickname?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

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
  recipientNickname = recipientName ?? "",
  senderNickname = senderName ?? "",
  primaryColor = "#E91E63",
  secondaryColor = "#F48FB1",
  backgroundColor = "#FFF0F5",
}: GiftOpeningScreenProps) => {
  const [opening, setOpening] = useState(false);
  const hasConfetti = useRef(false);
  const openingRef = useRef(false);

  const copyForOccasion = giftOpeningOccasionCopy(occasion?.toLowerCase() ?? "");

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
      className="relative h-screen overflow-hidden"
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

      {/* ══════════════════════════════════════════════════
          LAYER 1: Pre-open text (absolute top — no layout shift)
          ══════════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
        <motion.div
          className="mt-16 text-center sm:mt-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: opening ? 0 : 1, y: opening ? -12 : 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Decorative sparkle */}
          <div className="mb-3">
            <span
              className="text-sm"
              style={{ color: primaryColor, opacity: 0.5 }}
            >
              ✦
            </span>
          </div>
          {/* Frosted glass pill */}
          <div
            className="mx-auto max-w-[320px] rounded-2xl px-5 py-2.5 backdrop-blur-md sm:max-w-[380px]"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.4))`,
              boxShadow: `0 4px 24px ${primaryColor}12, 0 1px 4px rgba(0,0,0,0.04)`,
              border: `1px solid rgba(255,255,255,0.6)`,
            }}
          >
            <p
              className="text-sm font-semibold leading-relaxed tracking-wide"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {senderName && recipientName
                ? interpolate(copy.giftOpening.boxIntro, { recipientNickname, senderNickname })
                : copy.giftOpening.received}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════
          LAYER 2: Gift box (absolute center — NEVER moves)
          ══════════════════════════════════════════════════ */}
      <div
        className="absolute mt-14 inset-x-0 z-10"
        style={{ top: "42%", transform: "translateY(-50%)" }}
      >
        <div className="flex justify-center px-5">
          <div
            className="relative"
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
                aria-label={copy.giftOpening.openAria}
              />
            )}

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
                  : { scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }
              }
              transition={{
                duration: opening ? 0.4 : 3.5,
                repeat: opening ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />

            {/* ── Items emerging from inside the box ── */}
            {opening &&
              copyForOccasion.contents.map((item, i) => {
                const positions = [
                  { x: -75, y: -210, rotate: -12 },
                  { x: 75, y: -210, rotate: 12 },
                  { x: -48, y: -150, rotate: -5 },
                  { x: 48, y: -150, rotate: 5 },
                  { x: -118, y: -138, rotate: -20 },
                  { x: 118, y: -138, rotate: 20 },
                ];
                const pos = positions[i % positions.length];
                const tints = [
                  { bg: `${primaryColor}08`, border: `${primaryColor}18` },
                  { bg: `${secondaryColor}10`, border: `${secondaryColor}20` },
                  { bg: `${primaryColor}0a`, border: `${primaryColor}15` },
                  { bg: `${secondaryColor}08`, border: `${secondaryColor}18` },
                  { bg: `${primaryColor}0c`, border: `${primaryColor}1a` },
                  { bg: `${secondaryColor}0c`, border: `${secondaryColor}1c` },
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
                      duration: 1.1,
                      delay: 0.4 + i * 0.18,
                      ease: [0.34, 1.56, 0.64, 1],
                      scale: {
                        times: [0, 0.5, 0.75, 1],
                        duration: 1.1,
                        delay: 0.4 + i * 0.18,
                      },
                      opacity: {
                        times: [0, 0.2, 1, 1],
                        duration: 1.1,
                        delay: 0.4 + i * 0.18,
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
                          duration: 0.7,
                          delay: 0.6 + i * 0.18,
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
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Lid — slides right, leans against the side of the box */}
            <motion.div
              className="absolute rounded-t-2xl"
              style={{
                width: 200,
                height: 36,
                background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 -2px 8px ${primaryColor}15, 0 4px 12px ${primaryColor}10`,
                transformOrigin: "left bottom",
                left: 0,
                top: 0,
                zIndex: 2,
              }}
              animate={
                opening
                  ? { x: 178, y: -44, rotateZ: 67, opacity: 1 }
                  : { x: 0, y: 0, rotateZ: 0, opacity: 1 }
              }
              transition={{
                duration: 1.2,
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

              {/* ── Bow — inside lid, moves with it ── */}
              <motion.div
                className="absolute -top-5 left-1/2 -translate-x-1/2"
                style={{ zIndex: 3 }}
                initial={{}}
                animate={
                  opening
                    ? { rotate: -10, scale: 0.85 }
                    : {}
                }
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 10,
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
            </motion.div>

            {/* Body */}
            <div
              className="relative overflow-hidden rounded-b-2xl"
              style={{
                width: 200,
                height: 144,
                top:35,
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

              {/* Gift tag — stays visible after opening */}
              {senderName && (
                <motion.div
                  className="absolute left-1/2 z-20"
                  style={{ top: 30, translate: "-50% 0", rotate: "5deg" }}
                  initial={{ opacity: 0, y: -10, rotate: 15 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.7,
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                  }}
                >
                  {/* String connecting to the bow */}
                  <div
                    className="absolute left-1/2 -top-4 h-4 -translate-x-1/2"
                    style={{
                      width: 1,
                      background: `linear-gradient(180deg, ${secondaryColor}, ${secondaryColor}60)`,
                    }}
                  />
                  {/* Tag body — cream paper cardstock */}
                  <div
                    className="relative overflow-hidden rounded-[3px] px-3 py-2"
                    style={{
                      background: "linear-gradient(160deg, #FFFBF0 0%, #F7E8CE 50%, #EDDBB5 100%)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                      minWidth: 52,
                    }}
                  >
                    {/* Subtle paper texture */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 3px)",
                      }}
                    />
                    {/* Punched hole at top center */}
                    <div
                      className="absolute left-1/2 top-1.5 h-[5px] w-[5px] -translate-x-1/2 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${primaryColor}20, transparent)`,
                        boxShadow: `inset 0 0.5px 1.5px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.08)`,
                      }}
                    />
                    {/* "from" in small elegant caps */}
                    <p
                      className="mt-1 text-center text-[7px] uppercase tracking-[0.1em]"
                      style={{
                        color: "#A09078",
                        fontFamily: "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {copy.giftOpening.fromTag}
                    </p>
                    {/* Sender name */}
                    <p
                      className="text-center text-[10px] font-bold leading-tight"
                      style={{
                        color: "#5C4A30",
                        fontFamily: "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {senderName}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tap instruction (directly below the box) ── */}
      <AnimatePresence>
        {!opening && (
          <motion.div
            className="absolute mt-14 inset-x-0 z-20 flex flex-col items-center"
            style={{ top: "calc(var(--gift-box-top, 42%) + 100px)" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          >
            {/* Gentle floating container */}
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Upward chevron pointing at the box */}
              <motion.svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                className="mb-1"
                animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -2, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  d="M1 9L8 2L15 9"
                  stroke={primaryColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
              </motion.svg>
              {/* Text */}
              <p
                className="text-xs font-medium italic tracking-wide"
                style={{ color: primaryColor, opacity: 0.7 }}
              >
                {copy.common.tapToOpen}
              </p>
              {/* Animated underline */}
              <motion.div
                className="mt-1 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}50, transparent)` }}
                animate={{ width: [20, 40, 20], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          LAYER 3: Post-open text + button (absolute — no layout shift)
          ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="absolute inset-x-0 z-20 flex flex-col items-center px-6 "
            style={{ bottom: "var(--gift-post-bottom, 100px)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7, ease: "easeOut" }}
          >
            {/* Decorative divider */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-px w-10"
                style={{
                  background: `linear-gradient(90deg, transparent, ${primaryColor}35)`,
                }}
              />
              <span
                className="text-xs"
                style={{ color: `${primaryColor}45` }}
              >
                ✦
              </span>
              <div
                className="h-px w-10"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor}35, transparent)`,
                }}
              />
            </div>

            {/* Main heading */}
            <p
              className="text-center text-xl font-bold tracking-wide sm:text-2xl"
              style={{
                fontFamily: "var(--wish-font-heading), Georgia, serif",
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {interpolate(copy.giftOpening.giftsForYou, {
                recipientNickname,
              })}
            </p>

            {/* Button */}
            <motion.button
              onClick={onNext}
              className="mt-8 rounded-full px-10 py-3.5 text-sm font-semibold tracking-wide text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 8px 28px ${primaryColor}30, 0 2px 8px ${primaryColor}15`,
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copy.giftOpening.seeGifts}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyframes for dashed ring rotation */}
      <style>{`
        :root {
          --gift-post-bottom: 60px;
        }
         @media (max-width: 768px) {
    :root {
      --gift-post-bottom: 60px;
    }
  }

  @media (max-width: 480px) {
    :root {
      --gift-post-bottom: 100px;
    }
  }
      `}</style>
    </div>
  );
};
