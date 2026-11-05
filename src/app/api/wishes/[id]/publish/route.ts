import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { WishConfigSchema, CreateWishSchema } from "@/lib/validators";

/**
 * POST /api/wishes/[id]/publish — flips published true (or back false
 * with { publish: false }). Publish runs the FULL WishConfigSchema +
 * basics validation — drafts stay loose, nothing broken reaches
 * recipients. Slug already exists from draft creation (4.12).
 */

const PUBLISH_LIMIT = { max: 20, windowMs: 60 * 60 * 1000 };

interface PublishBody {
  publish?: boolean;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let user;
  try {
    user = await ensureUser();
  } catch {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  const limit = rateLimit(`wish-publish:${user.id}`, PUBLISH_LIMIT.max, PUBLISH_LIMIT.windowMs);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many publish actions" }, { status: 429 });
  }

  let body: PublishBody = {};
  try {
    body = (await req.json()) as PublishBody;
  } catch {
    // empty body = publish
  }
  const wantPublish = body.publish !== false;

  const wish = await prisma.wish.findUnique({ where: { id } });
  if (!wish || wish.userId !== user.id) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  if (!wantPublish) {
    const updated = await prisma.wish.update({
      where: { id },
      data: { published: false },
    });
    return NextResponse.json({ wish: updated });
  }

  // ── Full validation before anything reaches recipients ──
  const basics = CreateWishSchema.safeParse({
    title: wish.title,
    occasion: wish.occasion,
    templateId: wish.templateId,
    recipientName: wish.recipientName,
    senderName: wish.senderName,
  });
  if (!basics.success) {
    return NextResponse.json(
      { error: "Basics incomplete", issues: basics.error.issues },
      { status: 400 },
    );
  }

  const config = WishConfigSchema.safeParse(wish.config);
  if (!config.success) {
    return NextResponse.json(
      { error: "Config incomplete — finish the builder steps", issues: config.error.issues },
      { status: 400 },
    );
  }

  if (!wish.slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const updated = await prisma.wish.update({
    where: { id },
    data: { published: true, publishedAt: wish.publishedAt ?? new Date() },
  });

  return NextResponse.json({ wish: updated });
}
