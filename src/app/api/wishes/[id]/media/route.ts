import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import {
  MAX_FILE_BYTES,
  MAX_MEDIA_PER_WISH,
  MAX_PHOTOS,
  MAX_VIDEOS,
} from "@/lib/media-limits";

/**
 * POST /api/wishes/[id]/media — register an uploaded storage object as
 * a WishMedia row (upload itself happens client-side via supabase-js).
 * The URL must point at our own wish-media bucket — arbitrary URLs are
 * rejected so the recipient page can't be turned into a link farm.
 */

interface MediaBody {
  type: "photo" | "video";
  url: string;
  filename: string;
  sizeBytes: number;
  sortOrder?: number;
}

const UPLOAD_LIMIT = { max: 60, windowMs: 60 * 60 * 1000 };

const storageUrlPrefix = () =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public/wish-media/`;

const parseBody = (raw: unknown): MediaBody | null => {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;
  if (body.type !== "photo" && body.type !== "video") return null;
  if (typeof body.url !== "string" || !body.url.startsWith(storageUrlPrefix())) return null;
  if (typeof body.filename !== "string" || !body.filename || body.filename.length > 200) return null;
  if (typeof body.sizeBytes !== "number" || body.sizeBytes < 0 || body.sizeBytes > MAX_FILE_BYTES) {
    return null;
  }
  if (body.sortOrder !== undefined && (typeof body.sortOrder !== "number" || !Number.isInteger(body.sortOrder))) {
    return null;
  }
  return {
    type: body.type,
    url: body.url,
    filename: body.filename,
    sizeBytes: body.sizeBytes,
    sortOrder: body.sortOrder,
  };
};

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

  const limit = rateLimit(`media-upload:${user.id}`, UPLOAD_LIMIT.max, UPLOAD_LIMIT.windowMs);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many uploads — try later" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const body = parseBody(raw);
  if (!body) {
    return NextResponse.json({ error: "Invalid media payload" }, { status: 400 });
  }

  const wish = await prisma.wish.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!wish || wish.userId !== user.id) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  const sameType = wish.media.filter((m) => m.type === body.type).length;
  const quota =
    body.type === "photo" ? sameType < MAX_PHOTOS : sameType < MAX_VIDEOS;
  if (!quota || wish.media.length >= MAX_MEDIA_PER_WISH) {
    return NextResponse.json({ error: "Media limit reached for this wish" }, { status: 409 });
  }

  const media = await prisma.wishMedia.create({
    data: {
      wishId: id,
      type: body.type,
      url: body.url,
      filename: body.filename,
      sizeBytes: body.sizeBytes,
      sortOrder: body.sortOrder ?? wish.media.length,
    },
  });

  return NextResponse.json({ media }, { status: 201 });
}
