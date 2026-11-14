import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser, ensureUserRow } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { generateSlug } from "@/lib/slug";
import { CreateWishSchema } from "@/lib/validators";

/**
 * POST /api/wishes — create a draft wish (Model C: anonymous OK).
 * GET  /api/wishes — list the caller's wishes (summary rows).
 */

const CREATE_LIMIT = { max: 10, windowMs: 60 * 60 * 1000 };

export async function POST(req: Request) {
  let user;
  try {
    user = await ensureUser();
  } catch (error) {
    // TEMP diagnostic (prod 401 investigation) — revert after fix.
    return NextResponse.json(
      {
        error: "Auth unavailable",
        phase: "ensureUser",
        detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      },
      { status: 401 },
    );
  }
  try {
    await ensureUserRow(user);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Auth unavailable",
        phase: "ensureUserRow",
        detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      },
      { status: 401 },
    );
  }

  const limit = rateLimit(`wish-create:${user.id}`, CREATE_LIMIT.max, CREATE_LIMIT.windowMs);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many wishes created — try again later" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateWishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Slug assigned at draft creation so preview links work pre-publish
  // (4.11). Retry on the (unlikely) random-suffix collision.
  let wish;
  for (let attempt = 0; ; attempt++) {
    try {
      wish = await prisma.wish.create({
        data: {
          userId: user.id,
          title: parsed.data.title,
          occasion: parsed.data.occasion,
          templateId: parsed.data.templateId,
          recipientName: parsed.data.recipientName,
          senderName: parsed.data.senderName,
          slug: generateSlug(parsed.data.title),
          config: {},
        },
      });
      break;
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code !== "P2002" || attempt >= 2) throw error;
    }
  }

  return NextResponse.json({ wish }, { status: 201 });
}

export async function GET() {
  let user;
  try {
    user = await ensureUser();
  } catch {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  const wishes = await prisma.wish.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      occasion: true,
      templateId: true,
      published: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ wishes });
}
