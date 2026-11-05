import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "./route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wish: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));
vi.mock("@/lib/auth", () => ({
  ensureUser: vi.fn(),
  ensureUserRow: vi.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";

const OWNER = { id: "owner-1", email: null } as never;
const OWNED_WISH = {
  id: "w1",
  userId: "owner-1",
  title: "For Julia",
  occasion: "birthday",
  templateId: "birthday-classic",
  recipientName: "ဂျူလီယာ",
  senderName: "ကိုသျှား",
  config: {},
  published: false,
  slug: null,
  publishedAt: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-02T00:00:00Z"),
};

const routeArgs = { params: Promise.resolve({ id: "w1" }) };

const jsonRequest = (method: string, body?: unknown) =>
  new Request("http://localhost/api/wishes/w1", {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(ensureUser).mockResolvedValue(OWNER);
});

describe("GET /api/wishes/[id]", () => {
  it("returns the owner's wish", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue(OWNED_WISH);
    const res = await GET(jsonRequest("GET"), routeArgs);
    expect(res.status).toBe(200);
    expect((await res.json()).wish.id).toBe("w1");
  });

  it("404s for a wish the caller doesn't own", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue({ ...OWNED_WISH, userId: "someone-else" });
    const res = await GET(jsonRequest("GET"), routeArgs);
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/wishes/[id]", () => {
  it("updates owned fields and config", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue(OWNED_WISH);
    vi.mocked(prisma.wish.update).mockResolvedValue({ ...OWNED_WISH, title: "Updated" });

    const res = await PATCH(
      jsonRequest("PATCH", {
        title: "Updated",
        config: { content: { letter: "Hello" } },
      }),
      routeArgs,
    );

    expect(res.status).toBe(200);
    expect(prisma.wish.update).toHaveBeenCalledWith({
      where: { id: "w1" },
      data: expect.objectContaining({
        title: "Updated",
        config: { content: { letter: "Hello" } },
      }),
    });
  });

  it("400s on invalid partial data", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue(OWNED_WISH);
    const res = await PATCH(jsonRequest("PATCH", { title: "" }), routeArgs);
    expect(res.status).toBe(400);
    expect(prisma.wish.update).not.toHaveBeenCalled();
  });

  it("404s for non-owners", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue({ ...OWNED_WISH, userId: "intruder" });
    const res = await PATCH(jsonRequest("PATCH", { title: "Hacked" }), routeArgs);
    expect(res.status).toBe(404);
    expect(prisma.wish.update).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/wishes/[id]", () => {
  it("deletes an owned wish with 204", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue(OWNED_WISH);
    vi.mocked(prisma.wish.delete).mockResolvedValue(OWNED_WISH);
    const res = await DELETE(jsonRequest("DELETE"), routeArgs);
    expect(res.status).toBe(204);
    expect(prisma.wish.delete).toHaveBeenCalledWith({ where: { id: "w1" } });
  });

  it("404s for non-owners without deleting", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue({ ...OWNED_WISH, userId: "intruder" });
    const res = await DELETE(jsonRequest("DELETE"), routeArgs);
    expect(res.status).toBe(404);
    expect(prisma.wish.delete).not.toHaveBeenCalled();
  });
});
