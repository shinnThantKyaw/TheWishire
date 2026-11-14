import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser, ensureUserRow } from "@/lib/auth";
import { UpdateWishSchema } from "@/lib/validators";

/**
 * GET/PATCH/DELETE /api/wishes/[id] — owner-only wish access.
 * Non-owners get 404 (not 403) so wish IDs don't leak existence.
 * Config is stored as sent by the editor; the full WishConfigSchema
 * validation runs at publish time.
 */

const loadOwnedWish = async (id: string, userId: string) => {
  const wish = await prisma.wish.findUnique({
    where: { id },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });
  if (!wish || wish.userId !== userId) return null;
  return wish;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let user;
  try {
    user = await ensureUser();
  } catch {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  const wish = await loadOwnedWish(id, user.id);
  if (!wish) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  return NextResponse.json({ wish });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let user;
  try {
    user = await ensureUser();
    await ensureUserRow(user);
  } catch (error) {
    console.error("PATCH /api/wishes/[id] auth failure:", error);
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  const wish = await loadOwnedWish(id, user.id);
  if (!wish) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateWishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const updated = await prisma.wish.update({
    where: { id },
    data: {
      ...parsed.data,
      // Prisma's InputJsonValue needs an index signature at the boundary
      ...(parsed.data.config !== undefined
        ? { config: parsed.data.config as object }
        : {}),
    },
  });

  return NextResponse.json({ wish: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let user;
  try {
    user = await ensureUser();
  } catch {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  const wish = await loadOwnedWish(id, user.id);
  if (!wish) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  await prisma.wish.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
