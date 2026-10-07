import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_ATTEMPTS } from "@/lib/rewards";
import type { MiniGameConfig } from "@/types/experience";
import type { WishConfig } from "@/types/wish";

/**
 * GET /api/w/[slug]/rewards?playerId=… — restore a viewer's won proofs (GIFT-03).
 *
 * Runs on gift-chapter mount so refresh/mid-game recovery shows the real
 * wallet: server-side proof rows are authoritative, not client React state.
 */

const PLAYER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const playerId = new URL(req.url).searchParams.get("playerId") ?? "";

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
  const attempts =
    typeof miniGame?.attempts === "number" && miniGame.attempts > 0
      ? miniGame.attempts
      : DEFAULT_ATTEMPTS;

  const rows = await prisma.rewardProof.findMany({
    where: { wishId: wish.id, playerId },
    orderBy: { wonAt: "asc" },
    select: {
      rewardId: true,
      label: true,
      emoji: true,
      description: true,
      verifyToken: true,
      signature: true,
      serial: true,
      bonusPoints: true,
      wonAt: true,
    },
  });

  return NextResponse.json({
    won: rows.map((r) => ({
      item: {
        id: r.rewardId,
        label: r.label,
        emoji: r.emoji,
        description: r.description,
        probability: 0,
      },
      proof: {
        verifyToken: r.verifyToken,
        signature: r.signature,
        serial: r.serial,
        bonusPoints: r.bonusPoints,
        wonAt: r.wonAt.toISOString(),
      },
    })),
    remaining: Math.max(0, attempts - rows.length),
    attempts,
  });
}
