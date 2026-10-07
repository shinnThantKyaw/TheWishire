import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ATTEMPTS,
  DEFAULT_MINI_GAME_ITEMS,
  bonusPointsFor,
  generateSerial,
  generateVerifyToken,
  pickWeightedIndex,
  signReward,
} from "@/lib/rewards";
import type { MiniGameConfig, RewardItem } from "@/types/experience";
import type { WishConfig } from "@/types/wish";

/**
 * POST /api/w/[slug]/spin — server-authoritative prize draw (GIFT-03).
 *
 * The winner is decided HERE with a weighted crypto RNG so a client
 * cannot choose its prize. Attempts are capped per ephemeral viewer
 * id (playerId); every win is persisted with a verify token + HMAC
 * signature backing the downloadable proof ticket.
 */

interface SpinRequestBody {
  playerId?: string;
}

const PLAYER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let body: SpinRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const playerId = body.playerId?.trim() ?? "";
  if (!PLAYER_ID_RE.test(playerId)) {
    return NextResponse.json({ error: "Invalid playerId" }, { status: 400 });
  }

  const wish = await prisma.wish.findUnique({
    where: { slug, published: true },
    select: { id: true, config: true },
  });
  if (!wish) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  const wishConfig = wish.config as unknown as WishConfig;
  const miniGame = wishConfig?.settings?.giftChapter?.miniGame as MiniGameConfig | undefined;
  const items: RewardItem[] =
    Array.isArray(miniGame?.items) && miniGame.items.length > 0
      ? miniGame.items
      : DEFAULT_MINI_GAME_ITEMS;
  const attempts =
    typeof miniGame?.attempts === "number" && miniGame.attempts > 0
      ? miniGame.attempts
      : DEFAULT_ATTEMPTS;

  const used = await prisma.rewardProof.count({
    where: { wishId: wish.id, playerId },
  });
  if (used >= attempts) {
    return NextResponse.json(
      { error: "No attempts left", remaining: 0 },
      { status: 403 },
    );
  }

  // Winner decided server-side — weighted, crypto RNG
  const winIndex = pickWeightedIndex(items);
  if (winIndex < 0) {
    return NextResponse.json({ error: "No prizes configured" }, { status: 500 });
  }
  const item = items[winIndex];

  const verifyToken = generateVerifyToken();
  const serial = generateSerial();
  const bonusPoints = bonusPointsFor(item.label);
  // wonAt fixed before signing so signature covers the stored timestamp exactly
  const wonAt = new Date();
  const signature = signReward(wish.id, verifyToken, item.label, wonAt);

  await prisma.rewardProof.create({
    data: {
      wishId: wish.id,
      playerId,
      rewardId: item.id,
      label: item.label,
      emoji: item.emoji,
      description: item.description,
      verifyToken,
      signature,
      serial,
      bonusPoints,
      wonAt,
    },
  });

  return NextResponse.json({
    item: { id: item.id, label: item.label, emoji: item.emoji, description: item.description },
    index: winIndex,
    proof: { verifyToken, signature, serial, bonusPoints, wonAt: wonAt.toISOString() },
    remaining: attempts - used - 1,
  });
}
