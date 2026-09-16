"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Scissors, Sparkles, Heart } from "lucide-react";

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

type OccasionConfig = {
    emoji: string;
    label: string;
    celebrationText: string;
    description: string;
};

const OCCASIONS: Record<string, OccasionConfig> = {
    birthday: {
        emoji: "🎂",
        label: "Birthday",
        celebrationText: "your birthday",
        description:
            "Someone who cares about you deeply wanted to take a moment to celebrate the day you were born — and everything you bring to the world.",
    },
    anniversary: {
        emoji: "💕",
        label: "Anniversary",
        celebrationText: "your anniversary",
        description:
            "Love is worth celebrating, and someone wanted to remind you just how much this journey together means to them.",
    },
    valentine: {
        emoji: "❤️",
        label: "Valentine's Day",
        celebrationText: "Valentine's Day",
        description:
            "In a world full of people, someone chose to write their feelings just for you. This is a little token of love, made with heart.",
    },
    wedding: {
        emoji: "💍",
        label: "Wedding",
        celebrationText: "your special day",
        description:
            "Two hearts, one beautiful journey. Someone wanted to celebrate this incredible milestone with a personal touch.",
    },
    graduation: {
        emoji: "🎓",
        label: "Graduation",
        celebrationText: "your graduation",
        description:
            "All those late nights, hard work, and determination have paid off. Someone is incredibly proud of you and wanted you to know.",
    },
    friendship: {
        emoji: "🤝",
        label: "Friendship",
        celebrationText: "our friendship",
        description:
            "True friends are rare and precious. Someone wanted to take a moment to say thank you for being exactly who you are.",
    },
    "thank-you": {
        emoji: "💌",
        label: "Thank You",
        celebrationText: "this special moment",
        description:
            "Gratitude is one of the most beautiful feelings, and someone wanted to express theirs in a way that words alone can't capture.",
    },
};

/** Small twinkling sparkle dots */
const SPARKLE_DOTS = [
    { left: 15, top: 18, size: 3, delay: 0, duration: 3.2 },
    { left: 82, top: 14, size: 2, delay: 0.8, duration: 2.8 },
    { left: 20, top: 82, size: 2.5, delay: 1.6, duration: 3.5 },
    { left: 78, top: 80, size: 3, delay: 0.3, duration: 2.6 },
    { left: 55, top: 8, size: 2, delay: 2.1, duration: 3.8 },
    { left: 8, top: 50, size: 2.5, delay: 1.2, duration: 3.0 },
    { left: 92, top: 48, size: 2, delay: 0.6, duration: 3.4 },
    { left: 35, top: 93, size: 3, delay: 1.8, duration: 2.9 },
    { left: 65, top: 91, size: 2, delay: 2.4, duration: 3.1 },
];

export const IntroductionScreen = ({
    recipientName,
    senderName,
    occasion,
    onNext,
    primaryColor = "#f43f5e",
    secondaryColor = "#fb7185",
    backgroundColor = "#fff1f2",
    foregroundColor = "#4c0519",
}: IntroductionScreenProps) => {
    const [cutting, setCutting] = useState(false);
    const [cutDone, setCutDone] = useState(false);

    const nextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentOccasion =
        OCCASIONS[occasion.toLowerCase()] ?? {
            emoji: "🎁",
            label: "Special Moment",
            celebrationText: "this special moment",
            description:
                "Someone wanted to create a little moment of joy, just for you. Take your time and enjoy what comes next.",
        };

    const handleCut = () => {
        if (cutting || cutDone) return;

        setCutting(true);

        cutTimeoutRef.current = setTimeout(() => {
            setCutDone(true);

            nextTimeoutRef.current = setTimeout(() => {
                onNext();
            }, 800);
        }, 850);
    };

    useEffect(() => {
        return () => {
            if (cutTimeoutRef.current) {
                clearTimeout(cutTimeoutRef.current);
            }

            if (nextTimeoutRef.current) {
                clearTimeout(nextTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
            style={{ backgroundColor }}
        >
            {/* ── Premium Background ───────────────────────────── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Soft base gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(
                                ellipse at 50% 0%,
                                rgba(255,255,255,0.95) 0%,
                                transparent 55%
                            ),
                            linear-gradient(
                                145deg,
                                ${backgroundColor} 0%,
                                ${secondaryColor}12 45%,
                                ${primaryColor}0c 75%,
                                ${backgroundColor} 100%
                            )
                        `,
                    }}
                />

                {/* Large dreamy color washes */}
                <motion.div
                    className="absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${secondaryColor}35, transparent 68%)`,
                        filter: "blur(35px)",
                    }}
                    animate={{
                        x: [0, 35, -15, 0],
                        y: [0, 25, 45, 0],
                        scale: [1, 1.08, 0.96, 1],
                    }}
                    transition={{
                        duration: 24,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute -right-40 top-16 h-[480px] w-[480px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${primaryColor}25, transparent 68%)`,
                        filter: "blur(45px)",
                    }}
                    animate={{
                        x: [0, -30, 15, 0],
                        y: [0, 35, -20, 0],
                        scale: [1, 0.94, 1.08, 1],
                    }}
                    transition={{
                        duration: 28,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute -bottom-48 left-1/3 h-[500px] w-[500px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${secondaryColor}20, transparent 70%)`,
                        filter: "blur(55px)",
                    }}
                    animate={{
                        x: [0, -25, 25, 0],
                        y: [0, -30, 15, 0],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Subtle spotlight behind the content */}
                <div
                    className="absolute left-1/2 top-[38%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                        background: `radial-gradient(circle, rgba(255,255,255,0.65), transparent 68%)`,
                    }}
                />

                {/* Fine decorative rings */}
                <div
                    className="absolute left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                    style={{ borderColor: `${primaryColor}0d` }}
                />

                <div
                    className="absolute left-1/2 top-[38%] h-[580px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                    style={{ borderColor: `${secondaryColor}0b` }}
                />

                {/* Soft grain */}
                <svg className="absolute inset-0 h-full w-full opacity-[0.025]">
                    <filter id="wishireGrain">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.7"
                            numOctaves="3"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#wishireGrain)" />
                </svg>

                {/* Twinkling stars */}
                {SPARKLE_DOTS.map((s, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${s.left}%`,
                            top: `${s.top}%`,
                            width: s.size,
                            height: s.size,
                            backgroundColor:
                                i % 3 === 0 ? primaryColor : secondaryColor,
                            boxShadow: `0 0 12px ${primaryColor}45`,
                        }}
                        animate={{
                            opacity: [0.15, 0.8, 0.15],
                            scale: [1, 1.8, 1],
                        }}
                        transition={{
                            duration: s.duration,
                            delay: s.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* ── Content ──────────────────────────────── */}
            <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-5 py-8 text-center sm:px-8">
                {/* ── Logo ─────────────────────────────────────────── */}
                <motion.img
                    src="/Logo/LogoWithText.png"
                    alt="Wishire"
                    className="mb-7 h-auto w-36 select-none sm:w-44"
                    draggable={false}
                    initial={{ opacity: 0, scale: 0.85, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        type: "spring",
                        stiffness: 180,
                    }}
                />

                {/* ── Ornamental Divider ───────────────── */}
                <motion.div
                    className="mb-3 flex items-center gap-2.5"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div
                        className="h-px w-8"
                        style={{ backgroundColor: `${primaryColor}25` }}
                    />
                    <div
                        className="h-1.5 w-1.5 rotate-45"
                        style={{ backgroundColor: `${primaryColor}40` }}
                    />
                    <Sparkles
                        size={13}
                        style={{ color: primaryColor, opacity: 0.5 }}
                    />
                    <div
                        className="h-1.5 w-1.5 rotate-45"
                        style={{ backgroundColor: `${primaryColor}40` }}
                    />
                    <div
                        className="h-px w-8"
                        style={{ backgroundColor: `${primaryColor}25` }}
                    />
                </motion.div>

                {/* ── Personalized Greeting Badge ─────────────────── */}
                <motion.div
                    className="relative mb-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                >
                    <div
                        className="relative inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm"
                        style={{
                            backgroundColor: `${primaryColor}0d`,
                            borderColor: `${primaryColor}25`,
                        }}
                    >
                        <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                            style={{
                                backgroundColor: `${primaryColor}18`,
                                color: primaryColor,
                            }}
                        >
                            ✨
                        </span>

                        <span
                            className="text-sm font-medium tracking-wide"
                            style={{ color: primaryColor }}
                        >
                            Hey {recipientName}!
                        </span>

                        <span aria-hidden="true">{currentOccasion.emoji}</span>
                    </div>
                </motion.div>

                {/* ── Greeting Subtitle ────────────────────────────── */}
                <motion.p
                    className="mb-1 max-w-sm text-sm leading-relaxed"
                    style={{ color: foregroundColor, opacity: 0.62 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.62 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Someone made something special just for you.
                </motion.p>

                {/* ── Glass Card ───────────────────────── */}
                <motion.div
                    className="mt-3 w-full max-w-md overflow-hidden rounded-2xl sm:p-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    {/* Animated gradient border wrapper */}
                    <div
                        className="rounded-2xl p-[1px]"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}30, ${secondaryColor}20, ${primaryColor}10, ${secondaryColor}25)`,
                        }}
                    >
                        <div
                            className="rounded-2xl px-5 py-5 sm:px-6"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.82)",
                                backdropFilter: "blur(24px)",
                                WebkitBackdropFilter: "blur(24px)",
                                boxShadow: `0 8px 32px ${primaryColor}12, 0 2px 8px rgba(0,0,0,0.06)`,
                                border: `1px solid rgba(255,255,255,0.6)`,
                            }}
                        >
                            {/* Sender highlight */}
                            <p className="text-sm leading-relaxed opacity-75">
                                <span
                                    className="font-semibold"
                                    style={{ color: primaryColor }}
                                >
                                    {senderName}
                                </span>{" "}
                                prepared a special surprise for you to celebrate{" "}
                                {currentOccasion.celebrationText}.
                            </p>

                            {/* Decorative divider */}
                            <div className="my-3.5 flex items-center justify-center gap-3">
                                <div
                                    className="h-px flex-1"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${primaryColor}20, transparent)`,
                                    }}
                                />

                                <Heart
                                    size={11}
                                    style={{ color: primaryColor }}
                                    fill={`${primaryColor}35`}
                                />

                                <div
                                    className="h-px flex-1"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${primaryColor}20, transparent)`,
                                    }}
                                />
                            </div>

                            {/* Emotional description */}
                            <p className="text-[13px] leading-relaxed opacity-55">
                                {currentOccasion.description}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Quote ────────────────────────────── */}
                <motion.p
                    className="mt-4 max-w-xs text-[13px] italic opacity-40"
                    style={{ color: foregroundColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 0.3, delay: 0.65 }}
                >
                    &ldquo;The best things in life are the people you love, the places
                    you&rsquo;ve been, and the memories you&rsquo;ve made along the
                    way.&rdquo;
                </motion.p>

                {/* ── Ribbon + Scissors ────────────────── */}
                <motion.div
                    className="mt-auto pt-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.8 }}
                >
                    <div className="relative flex flex-col items-center">


                        {/* Ribbon container */}
                        <div className="relative flex h-28 w-72 items-center justify-center sm:w-80">
                            {/* Glow pulse behind ribbon */}
                            {!cutDone && (
                                <motion.div
                                    className="absolute left-1/2 top-1/2 h-12 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{
                                        background: `radial-gradient(ellipse, ${primaryColor}18, transparent)`,
                                    }}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            )}

                            {/* Left ribbon half */}
                            <motion.div
                                className="absolute left-0 top-1/2 h-4 w-[44%] origin-left rounded-l-sm"
                                style={{
                                    background: `linear-gradient(180deg, ${primaryColor}f0, ${primaryColor}, ${primaryColor}e0)`,
                                    boxShadow: `0 3px 12px ${primaryColor}25, inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.08)`,
                                    translateY: "-50%",
                                }}
                                animate={
                                    cutting
                                        ? { x: -70, rotate: -18, opacity: 0, y: 20 }
                                        : { x: 0, rotate: 0, opacity: 1, y: 0 }
                                }
                                transition={{ duration: 0.55, ease: "easeOut" }}
                            >
                                {/* Satin sheen */}
                                <div
                                    className="absolute inset-0 rounded-l-sm"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 40%, rgba(255,255,255,0.1) 100%)",
                                    }}
                                />
                            </motion.div>

                            {/* Right ribbon half */}
                            <motion.div
                                className="absolute right-0 top-1/2 h-4 w-[44%] origin-right rounded-r-sm"
                                style={{
                                    background: `linear-gradient(180deg, ${primaryColor}e0, ${primaryColor}dd, ${primaryColor}cc)`,
                                    boxShadow: `0 3px 12px ${primaryColor}25, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.08)`,
                                    translateY: "-50%",
                                }}
                                animate={
                                    cutting
                                        ? { x: 70, rotate: 18, opacity: 0, y: 20 }
                                        : { x: 0, rotate: 0, opacity: 1, y: 0 }
                                }
                                transition={{ duration: 0.55, ease: "easeOut" }}
                            >
                                <div
                                    className="absolute inset-0 rounded-r-sm"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)",
                                    }}
                                />
                            </motion.div>

                            {/* Cut flash line */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                    backgroundColor: "white",
                                    boxShadow: `0 0 16px 4px ${primaryColor}50, 0 0 30px 8px ${primaryColor}20`,
                                }}
                                animate={
                                    cutting
                                        ? { opacity: [0, 1, 0], scaleY: [0.3, 2, 0.3] }
                                        : { opacity: 0 }
                                }
                                transition={{ duration: 0.5, delay: 0.15 }}
                            />

                            {/* Left bow */}
                            <motion.div
                                className="absolute left-[14%] top-[18%]"
                                style={{ width: 44, height: 34 }}
                                animate={
                                    cutDone
                                        ? { y: -50, opacity: 0, scale: 0.2, rotate: -35 }
                                        : { y: 0, opacity: 1, scale: 1, rotate: 0 }
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 8,
                                    delay: cutDone ? 0.15 : 0,
                                }}
                            >
                                {/* Left loop */}
                                <div
                                    className="absolute left-0 top-1 h-7 w-6 rounded-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(-22deg)",
                                        boxShadow: `inset 0 -2px 4px ${primaryColor}40, 0 2px 4px ${primaryColor}15`,
                                    }}
                                />
                                {/* Right loop */}
                                <div
                                    className="absolute right-0 top-1 h-7 w-6 rounded-full"
                                    style={{
                                        background: `linear-gradient(225deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(22deg)",
                                        boxShadow: `inset 0 -2px 4px ${primaryColor}40, 0 2px 4px ${primaryColor}15`,
                                    }}
                                />
                                {/* Center knot */}
                                <div
                                    className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${primaryColor}cc)`,
                                        boxShadow: `0 1px 3px ${primaryColor}30`,
                                    }}
                                />
                            </motion.div>

                            {/* Right bow */}
                            <motion.div
                                className="absolute right-[14%] top-[18%]"
                                style={{ width: 44, height: 34 }}
                                animate={
                                    cutDone
                                        ? { y: -50, opacity: 0, scale: 0.2, rotate: 35 }
                                        : { y: 0, opacity: 1, scale: 1, rotate: 0 }
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 8,
                                    delay: cutDone ? 0.2 : 0,
                                }}
                            >
                                <div
                                    className="absolute left-0 top-1 h-7 w-6 rounded-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(-22deg)",
                                        boxShadow: `inset 0 -2px 4px ${primaryColor}40, 0 2px 4px ${primaryColor}15`,
                                    }}
                                />
                                <div
                                    className="absolute right-0 top-1 h-7 w-6 rounded-full"
                                    style={{
                                        background: `linear-gradient(225deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(22deg)",
                                        boxShadow: `inset 0 -2px 4px ${primaryColor}40, 0 2px 4px ${primaryColor}15`,
                                    }}
                                />
                                <div
                                    className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${primaryColor}cc)`,
                                        boxShadow: `0 1px 3px ${primaryColor}30`,
                                    }}
                                />
                            </motion.div>

                            {/* Scissors button */}
                            <motion.button
                                type="button"
                                onClick={handleCut}
                                disabled={cutting}
                                aria-label="Cut the ribbon to open your surprise"
                                className="relative z-20 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[3px] border-white shadow-lg transition-all focus:outline-none focus:ring-4 disabled:cursor-default"
                                style={{
                                    backgroundColor: primaryColor,
                                    boxShadow: `0 8px 32px ${primaryColor}45, 0 2px 8px ${primaryColor}20`,
                                }}
                                animate={
                                    cutting
                                        ? {
                                              rotate: [0, -20, 20, 0],
                                              scale: [1, 1.2, 0.85, 1],
                                              opacity: [1, 1, 0],
                                          }
                                        : { scale: [1, 1.08, 1] }
                                }
                                transition={{
                                    duration: cutting ? 0.55 : 2,
                                    repeat: cutting ? 0 : Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Scissors
                                    size={24}
                                    className="text-white"
                                    style={{
                                        transition: "transform 0.15s",
                                        transform: cutting
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                    }}
                                />
                            </motion.button>
                        </div>

                        {/* Action prompt  */}
                        <motion.div
                            className="mb-3 flex items-center gap-1.5"
                            animate={{ opacity: cutDone ? 0 : cutting ? 0.4 : 0.6 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sparkles size={12} style={{ color: primaryColor }} />

                            <p
                                className="text-xs font-medium"
                                style={{ color: foregroundColor }}
                            >
                                {cutting
                                    ? "Opening your surprise..."
                                    : "Cut the ribbon to unwrap your surprise"}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
