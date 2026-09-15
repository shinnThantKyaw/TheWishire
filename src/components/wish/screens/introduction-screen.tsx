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

    /** Large drifting gradient orbs — computed with current theme colors */
    const orbs = [
        { left: -8, top: -5, w: 520, h: 480, color: secondaryColor, opacity: 0.45, dur: 22, dx: 30, dy: 20 },
        { left: 70, top: -8, w: 460, h: 420, color: primaryColor, opacity: 0.38, dur: 26, dx: -25, dy: 18 },
        { left: 15, top: 65, w: 500, h: 460, color: secondaryColor, opacity: 0.30, dur: 24, dx: 20, dy: -22 },
        { left: 60, top: 55, w: 400, h: 380, color: primaryColor, opacity: 0.25, dur: 28, dx: -18, dy: -15 },
        { left: 35, top: 25, w: 350, h: 340, color: secondaryColor, opacity: 0.18, dur: 20, dx: 15, dy: 25 },
    ];
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
            {/* ── Premium Background ────────────────── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Base warm gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(160deg, ${backgroundColor} 0%, ${secondaryColor}08 40%, ${primaryColor}06 70%, ${backgroundColor} 100%)`,
                    }}
                />

                {/* Large drifting gradient orbs — the hero effect */}
                {orbs.map((orb, i) => (
                    <motion.div
                        key={`orb-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${orb.left}%`,
                            top: `${orb.top}%`,
                            width: orb.w,
                            height: orb.h,
                            background: `radial-gradient(circle, ${orb.color}${Math.round(orb.opacity * 255).toString(16).padStart(2, "0")}, transparent 70%)`,
                            filter: "blur(60px)",
                        }}
                        animate={{
                            x: [0, orb.dx, -orb.dx * 0.5, 0],
                            y: [0, orb.dy, -orb.dy * 0.6, 0],
                            scale: [1, 1.08, 0.95, 1],
                        }}
                        transition={{
                            duration: orb.dur,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Soft white light from top */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(255,255,255,0.85), transparent 65%)",
                    }}
                />

                {/* Subtle warm glow bottom-right */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at 80% 90%, ${secondaryColor}12, transparent 40%)`,
                    }}
                />

                {/* SVG noise texture — print-quality grain */}
                <svg className="absolute inset-0 h-full w-full opacity-[0.035]">
                    <filter id="wishireGrain">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.65"
                            numOctaves="3"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#wishireGrain)" />
                </svg>

                {/* Twinkling sparkle dots */}
                {SPARKLE_DOTS.map((s, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${s.left}%`,
                            top: `${s.top}%`,
                            width: s.size,
                            height: s.size,
                            backgroundColor: i % 3 === 0 ? primaryColor : secondaryColor,
                        }}
                        animate={{
                            opacity: [0.1, 0.7, 0.1],
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
                {/* Logo */}
                <motion.img
                    src="/Logo/LogoWithText.png"
                    alt="Wishire"
                    className="mb-6 h-auto w-36 select-none sm:w-44"
                    draggable={false}
                    initial={{ opacity: 0, scale: 0.85, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 180 }}
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
                    <Sparkles size={13} style={{ color: primaryColor, opacity: 0.5 }} />
                    <div
                        className="h-1.5 w-1.5 rotate-45"
                        style={{ backgroundColor: `${primaryColor}40` }}
                    />
                    <div
                        className="h-px w-8"
                        style={{ backgroundColor: `${primaryColor}25` }}
                    />
                </motion.div>

                {/* ── Greeting ─────────────────────────── */}
                <motion.h1
                    className="text-3xl font-semibold tracking-tight sm:text-4xl"
                    style={{ color: foregroundColor }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Hey {recipientName}!{" "}
                    <span aria-hidden="true">{currentOccasion.emoji}</span>
                </motion.h1>

                {/* ── Glass Card ───────────────────────── */}
                <motion.div
                    className="mt-5 w-full max-w-md overflow-hidden rounded-2xl sm:p-6"
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
                                backgroundColor: "rgba(255,255,255,0.75)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
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
                        <div className="relative flex h-20 w-64 items-center justify-center sm:w-72">
                            {/* Left ribbon half */}
                            <motion.div
                                className="absolute left-0 top-1/2 h-3 w-[42%] origin-left rounded-l-sm"
                                style={{
                                    background: `linear-gradient(180deg, ${primaryColor}ee, ${primaryColor}, ${primaryColor}dd)`,
                                    boxShadow: `0 2px 8px ${primaryColor}20, inset 0 1px 0 rgba(255,255,255,0.3)`,
                                    translateY: "-50%",
                                }}
                                animate={
                                    cutting
                                        ? { x: -60, rotate: -12, opacity: 0 }
                                        : { x: 0, rotate: 0, opacity: 1 }
                                }
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />

                            {/* Right ribbon half */}
                            <motion.div
                                className="absolute right-0 top-1/2 h-3 w-[42%] origin-right rounded-r-sm"
                                style={{
                                    background: `linear-gradient(180deg, ${primaryColor}dd, ${primaryColor}cc, ${primaryColor}bb)`,
                                    boxShadow: `0 2px 8px ${primaryColor}20, inset 0 1px 0 rgba(255,255,255,0.25)`,
                                    translateY: "-50%",
                                }}
                                animate={
                                    cutting
                                        ? { x: 60, rotate: 12, opacity: 0 }
                                        : { x: 0, rotate: 0, opacity: 1 }
                                }
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />

                            {/* Glow pulse behind ribbon */}
                            {!cutDone && (
                                <motion.div
                                    className="absolute left-1/2 top-1/2 h-8 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{
                                        background: `radial-gradient(ellipse, ${primaryColor}20, transparent)`,
                                    }}
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            )}

                            {/* Cut glow line */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                    backgroundColor: "white",
                                    boxShadow: `0 0 12px 3px ${primaryColor}60`,
                                }}
                                animate={
                                    cutting
                                        ? { opacity: [0, 1, 0], scaleY: [0.5, 1.8, 0.5] }
                                        : { opacity: 0 }
                                }
                                transition={{ duration: 0.6, delay: 0.2 }}
                            />

                            {/* Left bow */}
                            <motion.div
                                className="absolute left-[18%] top-[22%]"
                                style={{ width: 32, height: 24 }}
                                animate={
                                    cutDone
                                        ? { y: -40, opacity: 0, scale: 0.3, rotate: -25 }
                                        : { y: 0, opacity: 1, scale: 1, rotate: 0 }
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 10,
                                    delay: cutDone ? 0.2 : 0,
                                }}
                            >
                                <div
                                    className="absolute left-0 top-0 h-5 w-4 rounded-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(-20deg)",
                                    }}
                                />

                                <div
                                    className="absolute right-0 top-0 h-5 w-4 rounded-full"
                                    style={{
                                        background: `linear-gradient(225deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(20deg)",
                                    }}
                                />

                                <div
                                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{ backgroundColor: primaryColor }}
                                />
                            </motion.div>

                            {/* Right bow */}
                            <motion.div
                                className="absolute right-[18%] top-[22%]"
                                style={{ width: 32, height: 24 }}
                                animate={
                                    cutDone
                                        ? { y: -40, opacity: 0, scale: 0.3, rotate: 25 }
                                        : { y: 0, opacity: 1, scale: 1, rotate: 0 }
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 10,
                                    delay: cutDone ? 0.25 : 0,
                                }}
                            >
                                <div
                                    className="absolute left-0 top-0 h-5 w-4 rounded-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(-20deg)",
                                    }}
                                />

                                <div
                                    className="absolute right-0 top-0 h-5 w-4 rounded-full"
                                    style={{
                                        background: `linear-gradient(225deg, ${secondaryColor}, ${primaryColor})`,
                                        transform: "rotate(20deg)",
                                    }}
                                />

                                <div
                                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{ backgroundColor: primaryColor }}
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
                                    boxShadow: `0 8px 30px ${primaryColor}40`,
                                }}
                                animate={
                                    cutting
                                        ? {
                                              x: "280%",
                                              rotate: [0, -15, 15, 0],
                                              scale: [1, 1.15, 0.9, 1],
                                          }
                                        : { scale: [1, 1.06, 1] }
                                }
                                transition={{
                                    duration: cutting ? 0.5 : 2.2,
                                    repeat: cutting ? 0 : Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Scissors
                                    size={24}
                                    className="text-white"
                                    style={{
                                        transition: "transform 0.2s",
                                        transform: cutting
                                            ? "rotate(90deg)"
                                            : "rotate(0deg)",
                                    }}
                                />
                            </motion.button>
                        </div>

                        {/* Action prompt */}
                        <motion.div
                            className="mt-1 flex items-center gap-1.5"
                            animate={{ opacity: cutDone ? 0 : cutting ? 0.4 : 0.55 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sparkles size={12} style={{ color: primaryColor }} />

                            <p
                                className="text-xs font-medium"
                                style={{ color: foregroundColor }}
                            >
                                {cutting
                                    ? "Opening your surprise..."
                                    : "Tap the scissors to unwrap your surprise"}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
