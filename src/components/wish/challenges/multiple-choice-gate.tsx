"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { copy } from "@/config/copy";

interface MultipleChoiceGateProps {
  question: string;
  /** 2-4 options. The correct index is deliberately NOT a prop — the
   *  answer is validated server-side (POST /api/w/[slug]/challenge). */
  options: string[];
  onComplete: () => void;
  primaryColor: string;
  foregroundColor: string;
}

type Status = "idle" | "checking" | "wrong" | "correct" | "error";

/**
 * Multiple-choice challenge gate (Wave 2.1/2.2).
 *
 * The client only ever sees the question and options; it submits the
 * picked index to the server, which compares it against the correct
 * index stored in the wish config. Wrong answers shake and retry;
 * network failures show a retryable error instead of failing closed
 * (matching the legacy PIN gate's retry behavior).
 */
export const MultipleChoiceGate = ({
  question,
  options,
  onComplete,
  primaryColor,
  foregroundColor,
}: MultipleChoiceGateProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  // Ignore stale responses after unmount / repeated clicks
  const requestIdRef = useRef(0);

  const submit = useCallback(
    async (answerIndex: number) => {
      if (status === "checking" || status === "correct") return;
      const requestId = ++requestIdRef.current;
      setSelected(answerIndex);
      setStatus("checking");

      try {
        const slug = window.location.pathname.split("/")[2] ?? "";
        const res = await fetch(`/api/w/${slug}/challenge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "multiple-choice", answerIndex }),
        });
        if (requestId !== requestIdRef.current) return;
        const data = (await res.json()) as { ok?: boolean };
        if (res.ok && data.ok) {
          setStatus("correct");
          setTimeout(onComplete, 700);
        } else {
          setStatus("wrong");
          setTimeout(() => {
            if (requestId === requestIdRef.current) setStatus("idle");
          }, 1600);
        }
      } catch {
        if (requestId !== requestIdRef.current) return;
        setStatus("error");
        setTimeout(() => {
          if (requestId === requestIdRef.current) setStatus("idle");
        }, 2400);
      }
    },
    [status, onComplete],
  );

  const shake =
    (status === "wrong" || status === "error") && !prefersReducedMotion
      ? { x: [-8, 8, -6, 6, 0] }
      : {};

  const statusLine =
    status === "checking"
      ? copy.challenges.checking
      : status === "wrong"
        ? copy.challenges.multipleChoice.wrong
        : status === "error"
          ? copy.challenges.networkError
          : status === "correct"
            ? copy.challenges.multipleChoice.correct
            : null;

  return (
    <motion.div
      className="mt-6 flex w-full max-w-sm flex-col items-center px-4"
      animate={shake}
      transition={{ duration: 0.4 }}
      role="group"
      aria-label={question}
    >
      <p
        className="mb-4 text-center text-base font-semibold leading-relaxed"
        style={{ color: foregroundColor }}
      >
        {question}
      </p>

      <div className="flex w-full flex-col gap-2.5">
        {options.map((option, index) => {
          const isCorrectPick = status === "correct" && selected === index;
          const isWrongPick = status === "wrong" && selected === index;
          return (
            <button
              key={option}
              type="button"
              onClick={() => submit(index)}
              disabled={status === "checking" || status === "correct"}
              className="rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors disabled:opacity-70"
              style={{
                borderColor: isCorrectPick
                  ? "#22c55e"
                  : isWrongPick
                    ? "#ef4444"
                    : `${primaryColor}40`,
                backgroundColor: isCorrectPick
                  ? "#22c55e15"
                  : isWrongPick
                    ? "#ef444415"
                    : `${primaryColor}08`,
                color: foregroundColor,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p
        className="mt-3 min-h-5 text-center text-xs font-medium"
        role="status"
        aria-live="polite"
        style={{
          color:
            status === "wrong" || status === "error"
              ? "#ef4444"
              : status === "correct"
                ? "#22c55e"
                : foregroundColor,
          opacity: statusLine ? 1 : 0,
        }}
      >
        {statusLine ?? "‎"}
      </p>
    </motion.div>
  );
};
