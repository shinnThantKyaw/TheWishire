import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * DELETE /api/wishes/[id]/media/[mediaId] — owner-only. Removes the
 * storage object first (best effort), then the row; a missing storage
 * object must not strand the row.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> },
) {
  const { id, mediaId } = await params;

  let user;
  try {
    user = await ensureUser();
  } catch {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  const wish = await prisma.wish.findUnique({ where: { id } });
  if (!wish || wish.userId !== user.id) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  const media = await prisma.wishMedia.findUnique({ where: { id: mediaId } });
  if (!media || media.wishId !== id) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  // Best-effort storage cleanup — public URL embeds the object path.
  if (media.filename) {
    try {
      const supabase = await createClient();
      await supabase.storage
        .from("wish-media")
        .remove([`${id}/${media.filename}`]);
    } catch (error) {
      console.warn("Storage cleanup failed:", error);
    }
  }

  await prisma.wishMedia.delete({ where: { id: mediaId } });
  return new NextResponse(null, { status: 204 });
}
