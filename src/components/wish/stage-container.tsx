"use client";

import { motion, type Variants } from "motion/react";
import type { AnimationConfig } from "@/types/template";
import { cn } from "@/lib/utils";

interface StageContainerProps {
  animation?: AnimationConfig;
  children: React.ReactNode;
  className?: string;
}

/**
 * Maps AnimationConfig type to Motion variants with spring physics
 * for more natural, delightful movement.
 */
const animationVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 50, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -30, filter: "blur(6px)" },
  },
  "slide-up": {
    initial: { opacity: 0, y: 80, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -50, filter: "blur(8px)" },
  },
  "slide-down": {
    initial: { opacity: 0, y: -80, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: 50, filter: "blur(8px)" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.6, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
  },
  "zoom-in": {
    initial: { opacity: 0, scale: 0, rotate: -5 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0, rotate: 5 },
  },
  confetti: {
    initial: { opacity: 0, scale: 0.5, rotate: -15, y: 30 },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0 },
    exit: { opacity: 0, scale: 0.5, rotate: 15, y: -30 },
  },
};

/** Spring transition config for natural-feeling motion */
const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

/** Default animation when none is specified */
const DEFAULT_ANIMATION: AnimationConfig = {
  type: "fade",
  duration: 0.6,
};

/**
 * StageContainer wraps stage content with polished Motion animations.
 * Uses spring physics for natural movement and blur for smooth depth transitions.
 */
export const StageContainer = ({
  animation = DEFAULT_ANIMATION,
  children,
  className,
}: StageContainerProps) => {
  const variant = animationVariants[animation.type] ?? animationVariants.fade;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variant}
      transition={{
        ...springTransition,
        duration: animation.duration ?? 0.6,
        delay: animation.delay ?? 0,
      }}
      className={cn(
        "flex min-h-screen items-center justify-center",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggeredContainer — reveals children one by one with a cascade effect.
 * Used inside stages that have multiple elements to reveal sequentially.
 */
export const StaggeredContainer = ({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** Reveal child — used with StaggeredContainer for cascade animations */
export const RevealChild = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", stiffness: 200, damping: 20 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
