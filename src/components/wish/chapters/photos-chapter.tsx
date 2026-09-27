"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";

interface PhotosChapterProps {
    photos: { id: string; url: string; type: "photo" }[];
    videoUrl?: string;
    primaryColor?: string;
    foregroundColor?: string;
}

type PageDirection = "next" | "previous" | null;

const ease = [0.4, 0, 0.2, 1] as const;
const easeSettle = [0.16, 1, 0.3, 1] as const;
/* Slower, smoother paper motion */
const easePaper = [0.32, 0.72, 0.18, 1] as const;
const FLIP_MS = 1150;

export const PhotosChapter = ({
                                  photos,
                                  videoUrl,
                                  primaryColor = "#E91E63",
                                  foregroundColor = "#1A1A2E",
                              }: PhotosChapterProps) => {
    const [isClosed, setIsClosed] = useState(true);
    const [isOpening, setIsOpening] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState<PageDirection>(null);
    const [isTurning, setIsTurning] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    const spreads = useMemo(() => {
        const result: {
            left?: (typeof photos)[number];
            right?: (typeof photos)[number];
            leftIndex?: number;
            rightIndex?: number;
        }[] = [];
        for (let i = 0; i < photos.length; i += 2) {
            result.push({
                left: photos[i],
                leftIndex: i,
                right: photos[i + 1],
                rightIndex: i + 1 < photos.length ? i + 1 : undefined,
            });
        }
        return result;
    }, [photos]);

    const totalViews = isDesktop ? spreads.length : photos.length;

    const clampPage = useCallback(
        (n: number) => Math.max(0, Math.min(n, Math.max(0, totalViews - 1))),
        [totalViews]
    );

    useEffect(() => {
        setCurrentPage((p) => clampPage(p));
    }, [clampPage]);

    const openAlbum = useCallback(() => {
        if (isOpening || !isClosed) return;
        setIsOpening(true);
        window.setTimeout(() => {
            setIsClosed(false);
            setIsOpening(false);
        }, 850);
    }, [isClosed, isOpening]);

    const closeAlbum = useCallback(() => {
        if (isTurning || isOpening) return;
        setIsClosed(true);
        setCurrentPage(0);
        setDirection(null);
    }, [isOpening, isTurning]);

    const goNext = useCallback(() => {
        if (isClosed || isOpening || isTurning) return;
        if (currentPage >= totalViews - 1) return;
        setIsTurning(true);
        setDirection("next");
        window.setTimeout(() => {
            setCurrentPage((v) => v + 1);
            setDirection(null);
            setIsTurning(false);
        }, FLIP_MS);
    }, [currentPage, isClosed, isOpening, isTurning, totalViews]);

    const goPrev = useCallback(() => {
        if (isClosed || isOpening || isTurning) return;
        if (currentPage <= 0) return;
        setIsTurning(true);
        setDirection("previous");
        window.setTimeout(() => {
            setCurrentPage((v) => v - 1);
            setDirection(null);
            setIsTurning(false);
        }, FLIP_MS);
    }, [currentPage, isClosed, isOpening, isTurning]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (isClosed) return;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                goNext();
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                goPrev();
            }
            if (e.key === "Escape") {
                e.preventDefault();
                closeAlbum();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeAlbum, goNext, goPrev, isClosed]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
        touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        const endX = e.changedTouches[0]?.clientX ?? 0;
        const endY = e.changedTouches[0]?.clientY ?? 0;

        const dx =
            touchStartX.current !== null ? endX - touchStartX.current : 0;
        const dy =
            touchStartY.current !== null ? endY - touchStartY.current : 0;

        touchStartX.current = null;
        touchStartY.current = null;

        if (!isDesktop) {
            if (Math.abs(dy) < 40 && Math.abs(dx) < 40) return;
            if (Math.abs(dy) >= Math.abs(dx)) {
                if (dy < 0) goNext();
                else goPrev();
            } else {
                if (dx < 0) goNext();
                else goPrev();
            }
        } else {
            if (Math.abs(dx) < 45) return;
            if (dx < 0) goNext();
            else goPrev();
        }
    };

    if (!photos?.length && !videoUrl) return null;

    const mobilePhoto = photos[currentPage];
    const desktopSpread = spreads[currentPage];

    return (
        <section
            className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20"
            style={{ color: foregroundColor }}
        >
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl sm:top-20"
                    style={{ background: `${primaryColor}12` }}
                />
                <div
                    className="absolute -left-10 top-1/2 h-56 w-56 rounded-full blur-3xl"
                    style={{ background: `${primaryColor}08` }}
                />
                <div
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                        backgroundImage: `radial-gradient(${primaryColor}18 0.7px, transparent 0.7px)`,
                        backgroundSize: "22px 22px",
                    }}
                />
            </div>

            {/* Header */}
            <div className="relative z-10 mx-auto mb-8 max-w-xl text-center sm:mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: easeSettle }}
                >
          <span
              className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.35em]"
              style={{ color: primaryColor }}
          >
            Chapter 02
          </span>
                    <h2
                        className="text-3xl font-semibold sm:text-4xl"
                        style={{
                            fontFamily:
                                "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                        }}
                    >
                        Our Memories
                    </h2>
                    <p
                        className="mx-auto mt-3 max-w-md text-sm leading-6"
                        style={{ color: foregroundColor, opacity: 0.56 }}
                    >
                        A little collection of moments I never want to forget.
                    </p>
                </motion.div>
            </div>

            {/* Closed album */}
            <AnimatePresence mode="wait">
                {isClosed && !isOpening && (
                    <motion.div
                        key="closed"
                        className="relative z-10 mx-auto w-full max-w-[280px] sm:max-w-sm"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 15 }}
                        transition={{ duration: 0.5, ease: easeSettle }}
                    >
                        <button
                            type="button"
                            onClick={openAlbum}
                            aria-label="Open memory album"
                            className="group relative block w-full cursor-pointer border-0 bg-transparent p-0"
                        >
                            <div
                                className="absolute -bottom-6 left-8 right-8 h-12 rounded-full blur-2xl"
                                style={{ background: `${foregroundColor}30` }}
                            />

                            <div
                                className="absolute inset-x-4 bottom-3 top-4 rounded-[16px]"
                                style={{
                                    background: "#ede0d5",
                                    transform: "rotate(2.2deg)",
                                    boxShadow: "0 12px 24px -12px rgba(0,0,0,.18)",
                                }}
                            />
                            <div
                                className="absolute inset-x-2 bottom-2 top-2 rounded-[16px]"
                                style={{
                                    background: "#f6ece2",
                                    transform: "rotate(-1.4deg)",
                                }}
                            />

                            <motion.div
                                className="relative aspect-[3/4] overflow-hidden rounded-[18px]"
                                whileHover={{ y: -6, rotate: -1 }}
                                whileTap={{ scale: 0.985 }}
                                transition={{ duration: 0.35, ease: easeSettle }}
                                style={{
                                    background: `linear-gradient(140deg, ${primaryColor}, ${primaryColor}CC 60%, ${primaryColor}AA)`,
                                    boxShadow: `0 30px 60px -25px ${foregroundColor}60, inset 0 0 0 1px rgba(255,255,255,.22), inset 0 -8px 24px rgba(0,0,0,.15)`,
                                }}
                            >
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
                                    style={{
                                        backgroundImage: `radial-gradient(circle at 30% 30%, white 0.5px, transparent 1.2px), radial-gradient(circle at 70% 70%, white 0.5px, transparent 1.2px)`,
                                        backgroundSize: "14px 14px, 20px 20px",
                                    }}
                                />
                                <div
                                    className="pointer-events-none absolute inset-3 rounded-[14px] border"
                                    style={{ borderColor: "rgba(255,255,255,.35)" }}
                                />
                                <div
                                    className="pointer-events-none absolute inset-5 rounded-[11px] border"
                                    style={{ borderColor: "rgba(255,255,255,.12)" }}
                                />

                                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-white">
                  <span className="mb-3 text-[9px] uppercase tracking-[0.45em] opacity-75">
                    A collection of
                  </span>
                                    <h3
                                        className="text-center text-4xl italic leading-tight sm:text-5xl"
                                        style={{
                                            fontFamily:
                                                "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                        }}
                                    >
                                        Our
                                        <br />
                                        Memories
                                    </h3>
                                    <div
                                        className="my-5 h-px w-14"
                                        style={{ background: "rgba(255,255,255,.5)" }}
                                    />
                                    <span className="text-[10px] tracking-[0.3em] opacity-85">
                    A STORY WORTH KEEPING
                  </span>
                                </div>

                                {photos[0] && (
                                    <motion.div
                                        className="absolute -bottom-2 -right-2 rotate-[8deg] overflow-hidden rounded-sm border-[5px] border-white bg-white shadow-2xl"
                                        style={{ width: "5.5rem", height: "7rem" }}
                                        animate={{ rotate: [8, 6, 8], y: [0, -3, 0] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <img
                                            src={photos[0].url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.div>
                                )}

                                <motion.div
                                    className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.22em]"
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{
                                        duration: 2.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    style={{
                                        background: "rgba(255,255,255,.16)",
                                        border: "1px solid rgba(255,255,255,.22)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    Tap to open
                                </motion.div>
                            </motion.div>
                        </button>
                    </motion.div>
                )}

                {isOpening && (
                    <motion.div
                        key="opening"
                        className="relative z-10 mx-auto w-full max-w-3xl"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AlbumOpeningAnimation
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Open book */}
            {!isClosed && !isOpening && photos.length > 0 && (
                <motion.div
                    className="relative z-10 mx-auto w-full max-w-4xl"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: easeSettle }}
                >
                    <div
                        className="absolute -bottom-6 left-[10%] right-[10%] h-14 rounded-full blur-3xl"
                        style={{ background: `${foregroundColor}35` }}
                    />

                    <div
                        className="relative rounded-[20px] p-2 sm:rounded-[22px] sm:p-3"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}22, #d8c8b8 50%, ${primaryColor}18)`,
                            boxShadow: `0 40px 80px -35px ${foregroundColor}60, 0 0 0 1px ${primaryColor}22`,
                        }}
                    >
                        <div
                            className="pointer-events-none absolute inset-x-2 bottom-1 top-2 rounded-[16px]"
                            style={{
                                background: "#e5d6c8",
                                transform: "translateY(6px) translateX(2px)",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute inset-x-2 bottom-1 top-2 rounded-[16px]"
                            style={{
                                background: "#f2e7db",
                                transform: "translateY(3px) translateX(1px)",
                            }}
                        />

                        <div
                            className="relative overflow-hidden rounded-[16px]"
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                            style={{
                                background: "#fdfaf4",
                                perspective: isDesktop ? 2600 : 1400,
                                /* Hinge at the TOP for the mobile roll (page lifts up from bottom) */
                                perspectiveOrigin: isDesktop
                                    ? "50% 50%"
                                    : "50% 0%",
                            }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 z-[60] opacity-[0.06]"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 20% 20%, ${foregroundColor} 0.5px, transparent 0.7px)`,
                                    backgroundSize: "11px 11px",
                                }}
                            />

                            {isDesktop ? (
                                <DesktopSpread
                                    spread={desktopSpread}
                                    spreadIndex={currentPage}
                                    primaryColor={primaryColor}
                                    foregroundColor={foregroundColor}
                                />
                            ) : (
                                <MobilePage
                                    photo={mobilePhoto}
                                    photoIndex={currentPage}
                                    total={photos.length}
                                    primaryColor={primaryColor}
                                    foregroundColor={foregroundColor}
                                />
                            )}

                            {direction && (
                                <PageFlip
                                    direction={direction}
                                    isDesktop={isDesktop}
                                    currentPhoto={
                                        isDesktop
                                            ? direction === "next"
                                                ? desktopSpread?.right
                                                : desktopSpread?.left
                                            : mobilePhoto
                                    }
                                    currentPhotoIndex={
                                        isDesktop
                                            ? direction === "next"
                                                ? desktopSpread?.rightIndex
                                                : desktopSpread?.leftIndex
                                            : currentPage
                                    }
                                    nextPhoto={
                                        isDesktop
                                            ? direction === "next"
                                                ? spreads[currentPage + 1]?.left
                                                : spreads[currentPage - 1]?.right
                                            : direction === "next"
                                                ? photos[currentPage + 1]
                                                : photos[currentPage - 1]
                                    }
                                    nextPhotoIndex={
                                        isDesktop
                                            ? direction === "next"
                                                ? spreads[currentPage + 1]?.leftIndex
                                                : spreads[currentPage - 1]?.rightIndex
                                            : direction === "next"
                                                ? currentPage + 1
                                                : currentPage - 1
                                    }
                                    total={photos.length}
                                    primaryColor={primaryColor}
                                    foregroundColor={foregroundColor}
                                />
                            )}

                            {isDesktop && (
                                <>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-1/2 z-[55] w-10 -translate-x-1/2"
                                        style={{
                                            background: `linear-gradient(90deg, transparent, rgba(40,25,15,.14) 30%, rgba(40,25,15,.05) 50%, rgba(40,25,15,.14) 70%, transparent)`,
                                        }}
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-y-4 left-1/2 z-[56] w-px -translate-x-1/2"
                                        style={{ background: "rgba(60,40,30,.16)" }}
                                    />
                                </>
                            )}

                            <button
                                type="button"
                                aria-label="Previous page"
                                onClick={goPrev}
                                disabled={currentPage === 0 || isTurning}
                                className="absolute inset-y-0 left-0 z-[70] w-1/4 cursor-w-resize border-0 bg-transparent disabled:cursor-default sm:w-1/3"
                            />
                            <button
                                type="button"
                                aria-label="Next page"
                                onClick={goNext}
                                disabled={currentPage === totalViews - 1 || isTurning}
                                className="absolute inset-y-0 right-0 z-[70] w-1/4 cursor-e-resize border-0 bg-transparent disabled:cursor-default sm:w-1/3"
                            />

                            {!isTurning && currentPage < totalViews - 1 && (
                                <motion.div
                                    className="pointer-events-none absolute bottom-4 left-1/2 z-[75] flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] md:right-4 md:left-auto md:translate-x-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.55 }}
                                    transition={{ delay: 1 }}
                                    style={{
                                        background: "rgba(255,255,255,.8)",
                                        color: foregroundColor,
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    Swipe
                                    <span className="text-sm md:hidden">↑</span>
                                    <span className="hidden text-sm md:inline">→</span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 px-2 sm:mt-6 sm:px-4">
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={currentPage === 0 || isTurning}
                            className="group flex items-center gap-1.5 rounded-full border-0 bg-transparent px-3 py-2 text-xs transition disabled:opacity-20"
                            style={{ color: foregroundColor }}
                        >
              <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        <div className="flex flex-col items-center">
              <span
                  className="text-[9px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: foregroundColor, opacity: 0.42 }}
              >
                Our Memories
              </span>
                            <span
                                className="mt-0.5 text-xs"
                                style={{ color: foregroundColor, opacity: 0.6 }}
                            >
                {currentPage + 1} / {totalViews}
              </span>
                        </div>

                        <button
                            type="button"
                            onClick={goNext}
                            disabled={currentPage === totalViews - 1 || isTurning}
                            className="group flex items-center gap-1.5 rounded-full border-0 bg-transparent px-3 py-2 text-xs transition disabled:opacity-20"
                            style={{ color: foregroundColor }}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
                        </button>
                    </div>

                    <div className="mt-5 text-center">
                        <button
                            type="button"
                            onClick={closeAlbum}
                            disabled={isTurning}
                            className="border-0 bg-transparent text-[9px] font-medium uppercase tracking-[0.28em] transition hover:opacity-70 disabled:opacity-20"
                            style={{ color: foregroundColor, opacity: 0.4 }}
                        >
                            Close album
                        </button>
                    </div>
                </motion.div>
            )}

            {videoUrl && !isClosed && !isOpening && (
                <motion.div
                    className="relative z-10 mx-auto mt-16 max-w-3xl"
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.7, ease: easeSettle }}
                >
                    <div className="mb-6 text-center">
            <span
                className="text-[9px] font-semibold uppercase tracking-[0.35em]"
                style={{ color: primaryColor }}
            >
              Moving Memory
            </span>
                        <h3
                            className="mt-2 text-2xl sm:text-3xl"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                            }}
                        >
                            A Moment That Came Alive
                        </h3>
                    </div>

                    <div
                        className="relative mx-auto max-w-2xl rotate-[-1deg] p-3 pb-10 sm:p-5 sm:pb-12"
                        style={{
                            background: "#fffdf9",
                            boxShadow: `0 25px 45px -20px ${foregroundColor}40, 0 1px 2px ${foregroundColor}12`,
                        }}
                    >
                        <div
                            className="absolute -top-3 left-1/2 z-10 h-8 w-24 -translate-x-1/2 rotate-2 opacity-80"
                            style={{ background: `${primaryColor}35` }}
                        />
                        <div className="aspect-video overflow-hidden bg-black">
                            <video
                                src={videoUrl}
                                controls
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <p
                            className="absolute bottom-2 left-0 right-0 text-center text-xs italic"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                color: foregroundColor,
                                opacity: 0.52,
                            }}
                        >
                            one of those moments worth keeping
                        </p>
                    </div>
                </motion.div>
            )}
        </section>
    );
};

/* =============================================================
   MOBILE PAGE
============================================================= */

interface MobilePageProps {
    photo: { id: string; url: string; type: "photo" };
    photoIndex: number;
    total: number;
    primaryColor: string;
    foregroundColor: string;
}

const MobilePage = ({
                        photo,
                        photoIndex,
                        total,
                        primaryColor,
                        foregroundColor,
                    }: MobilePageProps) => {
    return (
        <div
            className="relative flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12"
            style={{
                background:
                    "radial-gradient(120% 100% at 50% 0%, #fffdf9, #fdfaf4 60%, #f7f0e6)",
            }}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24"
                style={{
                    background: `linear-gradient(180deg, ${primaryColor}08, transparent)`,
                }}
            />

            <motion.div
                key={photo.id}
                className="relative w-full max-w-[min(92%,420px)]"
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: easeSettle }}
            >
                <div
                    className="absolute -inset-x-4 -bottom-6 top-8 rounded-full blur-2xl"
                    style={{ background: `${foregroundColor}30` }}
                />

                <div
                    className="relative rounded-[6px] bg-white p-2.5 pb-14 sm:p-3.5 sm:pb-16"
                    style={{
                        boxShadow: `0 20px 40px -20px ${foregroundColor}55, 0 2px 6px ${foregroundColor}15, inset 0 0 0 1px rgba(0,0,0,.03)`,
                        transform: "rotate(-0.8deg)",
                    }}
                >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-neutral-100">
                        <img
                            src={photo.url}
                            alt={`Memory ${photoIndex + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            draggable={false}
                        />
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: `linear-gradient(125deg, rgba(255,255,255,.14) 0%, transparent 40%, transparent 70%, rgba(0,0,0,.08) 100%)`,
                            }}
                        />
                    </div>

                    <div
                        className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-4 sm:bottom-4"
                        style={{ color: foregroundColor }}
                    >
            <span
                className="h-px w-6"
                style={{ background: `${foregroundColor}25` }}
            />
                        <span
                            className="text-[11px] italic sm:text-xs"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                opacity: 0.62,
                            }}
                        >
              Memory #{photoIndex + 1}
            </span>
                        <span
                            className="h-px w-6"
                            style={{ background: `${foregroundColor}25` }}
                        />
                    </div>
                </div>
            </motion.div>

            <div className="relative z-10 mt-8 flex items-center gap-1.5 sm:mt-10">
                {Array.from({ length: total }).map((_, i) => (
                    <span
                        key={i}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{
                            width: i === photoIndex ? "18px" : "6px",
                            background:
                                i === photoIndex ? primaryColor : `${foregroundColor}22`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

/* =============================================================
   DESKTOP SPREAD
============================================================= */

interface DesktopSpreadProps {
    spread?: {
        left?: { id: string; url: string; type: "photo" };
        right?: { id: string; url: string; type: "photo" };
        leftIndex?: number;
        rightIndex?: number;
    };
    spreadIndex: number;
    primaryColor: string;
    foregroundColor: string;
}

const DesktopSpread = ({
                           spread,
                           spreadIndex,
                           primaryColor,
                           foregroundColor,
                       }: DesktopSpreadProps) => {
    return (
        <div
            className="relative grid min-h-[460px] grid-cols-2 sm:min-h-[520px]"
            style={{ background: "#fdfaf4" }}
        >
            <DesktopPage
                photo={spread?.left}
                photoIndex={spread?.leftIndex}
                side="left"
                primaryColor={primaryColor}
                foregroundColor={foregroundColor}
            />
            <DesktopPage
                photo={spread?.right}
                photoIndex={spread?.rightIndex}
                side="right"
                primaryColor={primaryColor}
                foregroundColor={foregroundColor}
            />

            <div
                className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 text-[8px] uppercase tracking-[0.3em]"
                style={{ color: foregroundColor, opacity: 0.28 }}
            >
                {spreadIndex === 0 ? "The beginning" : `Memory ${spreadIndex + 1}`}
            </div>
        </div>
    );
};

interface DesktopPageProps {
    photo?: { id: string; url: string; type: "photo" };
    photoIndex?: number;
    side: "left" | "right";
    primaryColor: string;
    foregroundColor: string;
}

const DesktopPage = ({
                         photo,
                         photoIndex,
                         side,
                         primaryColor,
                         foregroundColor,
                     }: DesktopPageProps) => {
    const bg =
        side === "left"
            ? "radial-gradient(140% 100% at 0% 0%, #fffdf9, #fdfaf4)"
            : "radial-gradient(140% 100% at 100% 0%, #fffdf9, #fdfaf4)";

    if (!photo) {
        return (
            <div
                className="relative flex items-center justify-center overflow-hidden px-6 py-10"
                style={{ background: bg }}
            >
                <div
                    className="text-center"
                    style={{ color: foregroundColor, opacity: 0.3 }}
                >
                    <div className="mb-2 text-3xl" style={{ color: primaryColor }}>
                        ♡
                    </div>
                    <p
                        className="text-xs italic"
                        style={{
                            fontFamily:
                                "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                        }}
                    >
                        More memories to come...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative flex items-center justify-center overflow-hidden px-6 py-10"
            style={{ background: bg }}
        >
            <motion.div
                key={photo.id}
                className="relative w-full max-w-[300px]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeSettle }}
            >
                <div
                    className="absolute -inset-x-3 -bottom-4 top-6 rounded-full blur-2xl"
                    style={{ background: `${foregroundColor}28` }}
                />

                <div
                    className="relative rounded-[5px] bg-white p-2.5 pb-11"
                    style={{
                        boxShadow: `0 18px 35px -18px ${foregroundColor}55, 0 1px 3px ${foregroundColor}12`,
                        transform: side === "left" ? "rotate(-1deg)" : "rotate(1deg)",
                    }}
                >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-neutral-100">
                        <img
                            src={photo.url}
                            alt={`Memory ${(photoIndex ?? 0) + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            draggable={false}
                        />
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: `linear-gradient(125deg, rgba(255,255,255,.12) 0%, transparent 40%, transparent 70%, rgba(0,0,0,.08) 100%)`,
                            }}
                        />
                    </div>

                    <div
                        className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-2"
                        style={{ color: foregroundColor }}
                    >
            <span
                className="h-px w-5"
                style={{ background: `${foregroundColor}25` }}
            />
                        <span
                            className="text-[10px] italic"
                            style={{
                                fontFamily:
                                    "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                                opacity: 0.6,
                            }}
                        >
              Memory #{(photoIndex ?? 0) + 1}
            </span>
                        <span
                            className="h-px w-5"
                            style={{ background: `${foregroundColor}25` }}
                        />
                    </div>
                </div>
            </motion.div>

            <span
                className="absolute bottom-4 text-[9px] tracking-[0.28em]"
                style={{
                    [side === "left" ? "left" : "right"]: "18px",
                    color: foregroundColor,
                    opacity: 0.28,
                }}
            >
        {String((photoIndex ?? 0) + 1).padStart(2, "0")}
      </span>
        </div>
    );
};

/* =============================================================
   PAGE FLIP — vertical (bottom → up) on mobile, horizontal on desktop
============================================================= */

interface PageFlipProps {
    direction: "next" | "previous";
    isDesktop: boolean;
    currentPhoto?: { id: string; url: string; type: "photo" };
    currentPhotoIndex?: number;
    nextPhoto?: { id: string; url: string; type: "photo" };
    nextPhotoIndex?: number;
    total: number;
    primaryColor: string;
    foregroundColor: string;
}

const PageFlip = ({
                      direction,
                      isDesktop,
                      currentPhoto,
                      currentPhotoIndex,
                      nextPhoto,
                      nextPhotoIndex,
                      total,
                      primaryColor,
                      foregroundColor,
                  }: PageFlipProps) => {
    const isNext = direction === "next";
    const durationSec = FLIP_MS / 1000;

    /**
     * Mobile: vertical roll with hinge at the TOP edge.
     *   - `next` rotates +180° (bottom edge lifts up, swings over the top)
     *   - `previous` rotates -180° (reverse)
     * Desktop: classic horizontal flip around the spine.
     */
    const axis = isDesktop ? "rotateY" : "rotateX";
    const targetRotation = isDesktop
        ? isNext
            ? -180
            : 180
        : isNext
            ? 180
            : -180;

    const originStyle: React.CSSProperties = isDesktop
        ? isNext
            ? { right: 0, transformOrigin: "left center" }
            : { left: 0, transformOrigin: "right center" }
        : {
            inset: 0,
            // Hinge at TOP → page lifts up from the bottom edge
            transformOrigin: "center top",
        };

    const containerClass = isDesktop
        ? `absolute inset-y-0 z-50 w-1/2 ${isNext ? "right-0" : "left-0"}`
        : "absolute inset-0 z-50";

    /* --- Shading ---
     * Desktop keeps left/right gradients. Mobile rolls vertically:
     * during the lift the page darkens near the bottom (which is rising),
     * and lightens near the top; the back face does the inverse.
     */
    const frontShade = isDesktop
        ? isNext
            ? "linear-gradient(90deg, transparent 40%, rgba(30,20,15,.4))"
            : "linear-gradient(270deg, transparent 40%, rgba(30,20,15,.4))"
        : isNext
            ? "linear-gradient(0deg, rgba(30,20,15,.5), transparent 55%)"
            : "linear-gradient(180deg, rgba(30,20,15,.5), transparent 55%)";

    const backShade = isDesktop
        ? isNext
            ? "linear-gradient(270deg, transparent 40%, rgba(30,20,15,.4))"
            : "linear-gradient(90deg, transparent 40%, rgba(30,20,15,.4))"
        : isNext
            ? "linear-gradient(180deg, rgba(30,20,15,.45), transparent 55%)"
            : "linear-gradient(0deg, rgba(30,20,15,.45), transparent 55%)";

    const frontSide: "left" | "right" = isDesktop
        ? isNext
            ? "right"
            : "left"
        : "left";

    const backSide: "left" | "right" = isDesktop
        ? isNext
            ? "left"
            : "right"
        : "right";

    return (
        <motion.div
            className={containerClass}
            initial={{ [axis]: 0 }}
            animate={{ [axis]: targetRotation }}
            transition={{
                duration: durationSec,
                /* Slow start, gentle middle, long soft settle — paper weight */
                ease: easePaper,
            }}
            style={{
                ...originStyle,
                transformStyle: "preserve-3d",
                willChange: "transform",
            }}
        >
            {/* Front face */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    background: "#fdfaf4",
                    backfaceVisibility: "hidden",
                    boxShadow: isDesktop
                        ? isNext
                            ? "-16px 0 40px rgba(30,20,15,.18)"
                            : "16px 0 40px rgba(30,20,15,.18)"
                        : "0 22px 40px rgba(30,20,15,.2)",
                }}
            >
                {currentPhoto ? (
                    isDesktop ? (
                        <DesktopPage
                            photo={currentPhoto}
                            photoIndex={currentPhotoIndex}
                            side={frontSide}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    ) : (
                        <MobilePage
                            photo={currentPhoto}
                            photoIndex={currentPhotoIndex ?? 0}
                            total={total}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    )
                ) : null}

                <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0.55] }}
                    transition={{
                        duration: durationSec,
                        ease: easePaper,
                        times: [0, 0.5, 1],
                    }}
                    style={{ background: frontShade }}
                />
            </div>

            {/* Back face */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    background: "#fdfaf4",
                    transform: isDesktop ? "rotateY(180deg)" : "rotateX(180deg)",
                    backfaceVisibility: "hidden",
                }}
            >
                {nextPhoto ? (
                    isDesktop ? (
                        <DesktopPage
                            photo={nextPhoto}
                            photoIndex={nextPhotoIndex}
                            side={backSide}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    ) : (
                        <MobilePage
                            photo={nextPhoto}
                            photoIndex={nextPhotoIndex ?? 0}
                            total={total}
                            primaryColor={primaryColor}
                            foregroundColor={foregroundColor}
                        />
                    )
                ) : (
                    <EmptyTurnPage
                        primaryColor={primaryColor}
                        foregroundColor={foregroundColor}
                    />
                )}

                <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: [0.55, 0.25, 0] }}
                    transition={{
                        duration: durationSec,
                        ease: easePaper,
                        times: [0, 0.55, 1],
                    }}
                    style={{ background: backShade }}
                />
            </div>

            {/* Paper thickness — sits on the hinge edge */}
            <div
                className="pointer-events-none absolute"
                style={
                    isDesktop
                        ? {
                            top: 0,
                            bottom: 0,
                            width: 10,
                            [isNext ? "left" : "right"]: 0,
                            background: isNext
                                ? "linear-gradient(90deg, rgba(80,50,35,.18), transparent)"
                                : "linear-gradient(270deg, rgba(80,50,35,.18), transparent)",
                        }
                        : {
                            left: 0,
                            right: 0,
                            height: 12,
                            /* Hinge is at the top now */
                            top: 0,
                            background: isNext
                                ? "linear-gradient(180deg, rgba(80,50,35,.18), transparent)"
                                : "linear-gradient(0deg, rgba(80,50,35,.18), transparent)",
                        }
                }
            />
        </motion.div>
    );
};

/* =============================================================
   ALBUM OPENING
============================================================= */

interface AlbumOpeningAnimationProps {
    primaryColor: string;
    foregroundColor: string;
}

const AlbumOpeningAnimation = ({
                                   primaryColor,
                                   foregroundColor,
                               }: AlbumOpeningAnimationProps) => {
    return (
        <div
            className="relative mx-auto aspect-[1.55/1] w-full"
            style={{ perspective: 2200 }}
        >
            <div
                className="absolute inset-0 rounded-[18px]"
                style={{
                    background: primaryColor,
                    boxShadow: "0 35px 70px rgba(20,10,10,.30)",
                }}
            />
            <motion.div
                className="absolute inset-y-2 left-2 w-[calc(50%-6px)] origin-right rounded-l-[15px]"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -105 }}
                transition={{ duration: 1, ease: easeSettle }}
                style={{
                    background: "#fdfaf4",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                }}
            />
            <motion.div
                className="absolute inset-y-2 right-2 w-[calc(50%-6px)] origin-left rounded-r-[15px]"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 105 }}
                transition={{ duration: 1, delay: 0.05, ease: easeSettle }}
                style={{
                    background: "#fdfaf4",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                }}
            />
            <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-40 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 1] }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ background: `${primaryColor}35` }}
            />
            <motion.div
                className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.4em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 1 }}
                style={{ color: foregroundColor }}
            >
                Our memories
            </motion.div>
        </div>
    );
};

/* =============================================================
   EMPTY TURN PAGE
============================================================= */

interface EmptyTurnPageProps {
    primaryColor: string;
    foregroundColor: string;
}

const EmptyTurnPage = ({
                           primaryColor,
                           foregroundColor,
                       }: EmptyTurnPageProps) => {
    return (
        <div
            className="flex h-full items-center justify-center"
            style={{ background: "#fdfaf4" }}
        >
            <div
                className="text-center"
                style={{ color: foregroundColor, opacity: 0.25 }}
            >
                <div className="mb-2 text-3xl" style={{ color: primaryColor }}>
                    ♡
                </div>
                <p
                    className="text-xs italic"
                    style={{
                        fontFamily:
                            "var(--wish-font-heading), 'Playfair Display', Georgia, serif",
                    }}
                >
                    More memories...
                </p>
            </div>
        </div>
    );
};