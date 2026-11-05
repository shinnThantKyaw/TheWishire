import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GiftChallengeConfig, WishConfig } from "@/types/wish";

/**
 * POST /api/w/[slug]/challenge — server-authoritative gift-challenge
 * validation (Wave 2).
 *
 * Two challenge kinds:
 * - multiple-choice: the client submits its chosen index; the correct
 *   index lives ONLY in the DB config, so a tampered client cannot read
 *   or hardcode the answer.
 * - heart-catch: the client reports hearts caught and elapsed time; the
 *   server re-checks both against the configured N/T (a client that
 *   skips the game entirely fails the elapsed-time floor).
 *
 * No persistent attempt counter — wrong answers simply retry, matching
 * the legacy PIN gate behavior.
 */

interface MultipleChoiceBody {
  type: "multiple-choice";
  answerIndex: number;
}

interface HeartCatchBody {
  type: "heart-catch";
  caught: number;
  /** Wall-clock ms from game start to the winning catch. */
  elapsedMs: number;
}

type ChallengeBody = MultipleChoiceBody | HeartCatchBody;

/** Reject claims faster than this — no human catches N hearts instantly. */
const MIN_HEART_CATCH_MS = 1000;
/** Reaction grace over the configured limit (timer ticks + render delay). */
const HEART_CATCH_GRACE_MS = 500;

const parseBody = (raw: unknown): ChallengeBody | null => {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;
  if (body.type === "multiple-choice") {
    if (typeof body.answerIndex !== "number" || !Number.isInteger(body.answerIndex)) {
      return null;
    }
    return { type: "multiple-choice", answerIndex: body.answerIndex };
  }
  if (body.type === "heart-catch") {
    if (typeof body.caught !== "number" || !Number.isInteger(body.caught)) return null;
    if (typeof body.elapsedMs !== "number" || !Number.isFinite(body.elapsedMs)) return null;
    return { type: "heart-catch", caught: body.caught, elapsedMs: body.elapsedMs };
  }
  return null;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const body = parseBody(raw);
  if (!body) {
    return NextResponse.json({ error: "Invalid challenge payload" }, { status: 400 });
  }

  const wish = await prisma.wish.findUnique({
    where: { slug, published: true },
    select: { config: true },
  });
  if (!wish) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  const wishConfig = wish.config as unknown as WishConfig;
  const challenge = wishConfig?.settings?.giftChapter
    ?.challenge as GiftChallengeConfig | undefined;

  if (!challenge || challenge.type !== body.type) {
    return NextResponse.json(
      { ok: false, error: "Challenge not configured" },
      { status: 409 },
    );
  }

  if (body.type === "multiple-choice") {
    const valid =
      challenge.type === "multiple-choice" &&
      challenge.correctIndex === body.answerIndex;
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Wrong answer" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  // heart-catch
  if (challenge.type !== "heart-catch") {
    return NextResponse.json({ ok: false, error: "Challenge not configured" }, { status: 409 });
  }
  const limitMs = challenge.timeLimitSeconds * 1000;
  const valid =
    body.caught >= challenge.heartsToCatch &&
    body.elapsedMs >= MIN_HEART_CATCH_MS &&
    body.elapsedMs <= limitMs + HEART_CATCH_GRACE_MS;
  if (!valid) {
    return NextResponse.json({ ok: false, error: "Run failed validation" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
