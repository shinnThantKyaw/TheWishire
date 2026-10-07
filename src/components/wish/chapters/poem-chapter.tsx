"use client";

import { motion, useReducedMotion } from "motion/react";
import type { PoemSelection } from "@/types/wish";

interface PoemChapterProps {
    poem?: PoemSelection;
    primaryColor?: string;
    foregroundColor?: string;
}

/**
 * Screen 7: Poem Chapter — Premium Literary Edition.
 *
 * Inspired by illuminated manuscripts and luxury stationery:
 * - Ivory parchment base with subtle paper grain
 * - App-theme accents only (primaryColor) — no off-palette ink
 * - Myanmar-appropriate typography (Padauk, no italic, generous line-height)
 * - Slow, dignified line-by-line reveal
 * - Minimal competing effects — poem stays the hero
 */
export const PoemChapter = ({
    poem,
    primaryColor = "#E91E63",
    foregroundColor = "#1A1A2E",
}: PoemChapterProps) => {
    const reduceMotion = useReducedMotion();

    if (!poem) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <p style={{ color: foregroundColor, opacity: 0.4 }}>No poem yet</p>
            </div>
        );
    }

    const lines = poem.text.split("\n").filter((l) => l.trim());
    const baseDelay = reduceMotion ? 0 : 0.5;
    const lineStagger = reduceMotion ? 0 : 0.28;
    const afterLines = baseDelay + lines.length * lineStagger;

    // One shared accent gradient — identical for both quotes, no bright/light mismatch
    const quoteGradient = `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}99 50%, ${primaryColor}55 100%)`;
    const quoteTextClip = {
        background: quoteGradient,
        WebkitBackgroundClip: "text" as const,
        WebkitTextFillColor: "transparent" as const,
        backgroundClip: "text" as const,
    };

    return (
        <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 sm:px-6"
            style={{
                background: `
                    radial-gradient(ellipse 90% 70% at 50% 0%, ${primaryColor}0D 0%, transparent 50%),
                    radial-gradient(ellipse 80% 60% at 50% 100%, ${primaryColor}08 0%, transparent 50%),
                    linear-gradient(180deg, #FDFAF6 0%, #F7F1EA 100%)
                `,
            }}
        >
            {/* Subtle paper grain texture */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: "256px 256px",
                }}
            />

            {/* Ambient accent glow — subtle, not competing */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${primaryColor}0A 0%, transparent 60%)`,
                }}
                animate={
                    reduceMotion
                        ? { opacity: 0.6 }
                        : { scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }
                }
                transition={{
                    duration: reduceMotion ? 0 : 16,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Few floating particles — elegant, not busy */}
            {Array.from({ length: 6 }).map((_, i) => {
                const size = 2 + (i % 2);
                const left = 20 + ((i * 12) % 60);
                const top = 30 + ((i * 17) % 40);
                const duration = 16 + (i % 3) * 4;
                const delay = i * 0.8;
                return (
                    <motion.span
                        key={i}
                        aria-hidden
                        className="pointer-events-none absolute rounded-full"
                        style={{
                            width: size,
                            height: size,
                            left: `${left}%`,
                            top: `${top}%`,
                            background: primaryColor,
                            boxShadow: `0 0 8px ${primaryColor}40`,
                        }}
                        initial={reduceMotion ? false : { opacity: 0, y: 0 }}
                        animate={
                            reduceMotion
                                ? { opacity: 0.25 }
                                : { opacity: [0, 0.4, 0], y: [0, -40, -80] }
                        }
                        transition={{
                            duration: reduceMotion ? 0 : duration,
                            delay: reduceMotion ? 0 : delay,
                            repeat: reduceMotion ? 0 : Infinity,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}

            {/* Main manuscript card */}
            <motion.div
                className="relative w-full max-w-xl"
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Outer shadow for depth */}
                <div
                    aria-hidden
                    className="absolute -inset-1 rounded-[40px] opacity-60"
                    style={{
                        boxShadow: `
                            0 25px 50px -12px rgba(30, 20, 10, 0.15),
                            0 0 0 1px ${primaryColor}15
                        `,
                    }}
                />

                {/* Outer border — thin accent line */}
                <div
                    aria-hidden
                    className="absolute inset-0 rounded-[40px] border"
                    style={{
                        borderColor: `${primaryColor}30`,
                    }}
                />

                {/* Card — ivory parchment */}
                <div
                    className="relative overflow-hidden rounded-[38px] px-8 py-12 sm:px-14 sm:py-14"
                    style={{
                        background: `
                            linear-gradient(145deg, #FEFCF8 0%, #FAF6EE 40%, #F5EFE6 100%)
                        `,
                        boxShadow: `
                            inset 0 2px 4px rgba(255, 255, 255, 0.8),
                            inset 0 -2px 4px rgba(0, 0, 0, 0.02),
                            0 1px 2px rgba(0, 0, 0, 0.03)
                        `,
                    }}
                >
                    {/* Inner border — slightly thicker, manuscript style */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[10px] rounded-[30px] border"
                        style={{
                            borderColor: `${primaryColor}20`,
                            borderStyle: "solid",
                        }}
                    />

                    {/* Inner inner border — fine accent line */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[14px] rounded-[26px] border"
                        style={{
                            borderColor: `${primaryColor}12`,
                            borderStyle: "solid",
                        }}
                    />

                    {/* Ornamental corner flourishes — manuscript style */}
                    {[
                        { top: 22, left: 22, right: undefined, bottom: undefined, rotate: 0 },
                        { top: 22, right: 22, left: undefined, bottom: undefined, rotate: 90 },
                        { bottom: 22, right: 22, top: undefined, left: undefined, rotate: 180 },
                        { bottom: 22, left: 22, top: undefined, right: undefined, rotate: 270 },
                    ].map((pos, i) => (
                        <motion.svg
                            key={i}
                            aria-hidden
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            className="pointer-events-none absolute"
                            style={{
                                top: pos.top,
                                left: pos.left,
                                right: pos.right,
                                bottom: pos.bottom,
                                transform: `rotate(${pos.rotate}deg)`,
                            }}
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 0.6, scale: 1 }}
                            transition={{
                                delay: reduceMotion ? 0 : 0.6 + i * 0.15,
                                duration: reduceMotion ? 0 : 1,
                            }}
                        >
                            {/* Manuscript corner flourish */}
                            <path
                                d="M4 4 L4 14 M4 4 L14 4"
                                stroke={primaryColor}
                                strokeWidth="1"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <circle cx="4" cy="4" r="2" fill={primaryColor} opacity="0.8" />
                            <circle cx="8" cy="8" r="0.8" fill={primaryColor} opacity="0.5" />
                        </motion.svg>
                    ))}

                    {/* ─── Content ─── */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Eyebrow label — refined */}
                        <motion.div
                            className="mb-8 flex items-center gap-4"
                            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: reduceMotion ? 0 : 0.4, duration: reduceMotion ? 0 : 1 }}
                        >
                            <span
                                className="h-px w-8"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${primaryColor}60)`,
                                }}
                            />
                            <span
                                className="text-[0.65rem] font-medium uppercase"
                                style={{
                                    color: primaryColor,
                                    letterSpacing: "0.4em",
                                    fontFamily: "'Padauk', Georgia, serif",
                                    opacity: 0.8,
                                }}
                            >
                                ကဗျာ
                            </span>
                            <span
                                className="h-px w-8"
                                style={{
                                    background: `linear-gradient(90deg, ${primaryColor}60, transparent)`,
                                }}
                            />
                        </motion.div>

                        {/* Opening quotation mark — accent gradient */}
                        <motion.div
                            className="relative mb-1 select-none"
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: reduceMotion ? 0 : 0.55,
                                duration: reduceMotion ? 0 : 1.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <span
                                className="block leading-[0.75]"
                                style={{
                                    fontFamily: "Georgia, 'Times New Roman', serif",
                                    fontSize: "clamp(3.25rem, 8vw, 4.25rem)",
                                    ...quoteTextClip,
                                }}
                            >
                                &ldquo;
                            </span>
                        </motion.div>

                        {/* Accent rule under quote — refined */}
                        <motion.div
                            className="mb-8 h-px w-20"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${primaryColor}80, transparent)`,
                            }}
                            initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{
                                delay: reduceMotion ? 0 : 0.8,
                                duration: reduceMotion ? 0 : 1.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        />

                        {/* Poem lines — Myanmar-appropriate typography */}
                        <div className="flex flex-col items-center gap-2">
                            {lines.map((line, i) => (
                                <motion.p
                                    key={i}
                                    className="relative px-2 text-center"
                                    style={{
                                        fontFamily: "'Padauk', 'Noto Sans Myanmar', Georgia, serif",
                                        fontWeight: 400,
                                        fontSize: "clamp(1.05rem, 3.8vw, 1.3rem)",
                                        lineHeight: 1.9,
                                        letterSpacing: "0.02em",
                                        color: foregroundColor,
                                        // Subtle emboss effect
                                        textShadow: "0 1px 0 rgba(255, 255, 255, 0.6)",
                                    }}
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { opacity: 0, y: 16, filter: "blur(4px)" }
                                    }
                                    animate={{ opacity: 0.95, y: 0, filter: "blur(0px)" }}
                                    transition={{
                                        delay: baseDelay + i * lineStagger,
                                        duration: reduceMotion ? 0 : 1.1,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    {line}
                                </motion.p>
                            ))}
                        </div>

                        {/* Closing quotation mark — identical gradient, mirrors opening exactly */}
                        <motion.div
                            className="relative mt-1 select-none"
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: afterLines,
                                duration: reduceMotion ? 0 : 1.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <span
                                className="block leading-[0.75]"
                                style={{
                                    fontFamily: "Georgia, 'Times New Roman', serif",
                                    fontSize: "clamp(3.25rem, 8vw, 4.25rem)",
                                    ...quoteTextClip,
                                }}
                            >
                                &rdquo;
                            </span>
                        </motion.div>

                        {/* Decorative divider — diamond with accent rules */}
                        <motion.div
                            className="my-8 flex w-full items-center justify-center gap-4"
                            initial={reduceMotion ? false : { opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{
                                delay: reduceMotion ? 0 : afterLines + 0.4,
                                duration: reduceMotion ? 0 : 1.1,
                            }}
                        >
                            <span
                                className="h-px flex-1 max-w-[100px]"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${primaryColor}50)`,
                                }}
                            />
                            <motion.span
                                className="block h-2 w-2 rotate-45"
                                style={{
                                    background: primaryColor,
                                    boxShadow: `0 0 6px ${primaryColor}40`,
                                }}
                                animate={
                                    reduceMotion
                                        ? { rotate: 45 }
                                        : { rotate: [45, 135, 45], scale: [1, 1.15, 1] }
                                }
                                transition={{
                                    duration: reduceMotion ? 0 : 5,
                                    repeat: reduceMotion ? 0 : Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <span
                                className="h-px flex-1 max-w-[100px]"
                                style={{
                                    background: `linear-gradient(90deg, ${primaryColor}50, transparent)`,
                                }}
                            />
                        </motion.div>

                        {/* Title & Author — refined presentation */}
                        <motion.div
                            className="flex flex-col items-center"
                            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: reduceMotion ? 0 : afterLines + 0.7,
                                duration: reduceMotion ? 0 : 1,
                            }}
                        >
                            {poem.title?.trim() && (
                                <p
                                    className="mb-2 text-center text-[0.95rem]"
                                    style={{
                                        color: foregroundColor,
                                        opacity: 0.8,
                                        letterSpacing: "0.08em",
                                        fontFamily: "'Padauk', Georgia, serif",
                                    }}
                                >
                                    {poem.title}
                                </p>
                            )}

                            {poem.author && (
                                <p
                                    className="text-[0.8rem]"
                                    style={{
                                        color: foregroundColor,
                                        opacity: 0.55,
                                        letterSpacing: "0.06em",
                                        fontFamily: "'Padauk', Georgia, serif",
                                    }}
                                >
                                    <span style={{ color: primaryColor, opacity: 0.9 }}>—</span>{" "}
                                    {poem.author}
                                </p>
                            )}
                        </motion.div>

                        {/* Bottom flourish — elegant dots */}
                        <motion.div
                            className="mt-8 flex items-center gap-2.5"
                            initial={reduceMotion ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                delay: reduceMotion ? 0 : afterLines + 1.0,
                                duration: reduceMotion ? 0 : 1.2,
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="block rounded-full"
                                    style={{
                                        width: i === 1 ? 4 : 2.5,
                                        height: i === 1 ? 4 : 2.5,
                                        background: primaryColor,
                                        opacity: 0.6,
                                        boxShadow: `0 0 4px ${primaryColor}40`,
                                    }}
                                    animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 0.7, 0.3] }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 3,
                                        repeat: reduceMotion ? 0 : Infinity,
                                        delay: reduceMotion ? 0 : i * 0.4,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Soft accent glow beneath card */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-2/3 -translate-x-1/2 rounded-full blur-2xl"
                    style={{ background: `${primaryColor}15` }}
                />
            </motion.div>
        </div>
    );
};
