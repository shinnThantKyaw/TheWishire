import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "./route";
import { resetRateLimits } from "@/lib/rate-limit";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wish: {
      create: vi.fn(),
      findMany: vi.fn(),
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

const USER = { id: "user-1", email: null } as never;

const jsonRequest = (body: unknown) =>
  new Request("http://localhost/api/wishes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const VALID_CREATE = {
  title: "For Julia",
  occasion: "birthday",
  templateId: "birthday-classic",
  recipientName: "ဂျူလီယာ",
  senderName: "ကိုသျှား",
};

beforeEach(() => {
  vi.clearAllMocks();
  resetRateLimits();
  vi.mocked(ensureUser).mockResolvedValue(USER);
});

describe("POST /api/wishes", () => {
  it("creates a draft wish for the session user", async () => {
    vi.mocked(prisma.wish.create).mockResolvedValue({
      id: "w1",
      ...VALID_CREATE,
      userId: "user-1",
      config: {},
      published: false,
      slug: null,
      publishedAt: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-02T00:00:00Z"),
    });

    const res = await POST(jsonRequest(VALID_CREATE));

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.wish.id).toBe("w1");
    expect(prisma.wish.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user-1", title: "For Julia" }),
    });
  });

  it("400s on validation failure", async () => {
    const res = await POST(jsonRequest({ title: "" }));
    expect(res.status).toBe(400);
    expect(prisma.wish.create).not.toHaveBeenCalled();
  });

  it("401s when auth is unavailable", async () => {
    vi.mocked(ensureUser).mockRejectedValue(new Error("no provider"));
    const res = await POST(jsonRequest(VALID_CREATE));
    expect(res.status).toBe(401);
  });

  it("429s after the per-user hourly create limit", async () => {
    vi.mocked(prisma.wish.create).mockResolvedValue({
      id: "w1",
      ...VALID_CREATE,
      userId: "user-1",
      config: {},
      published: false,
      slug: null,
      publishedAt: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-02T00:00:00Z"),
    });
    for (let i = 0; i < 10; i++) {
      const res = await POST(jsonRequest(VALID_CREATE));
      expect(res.status).toBe(201);
    }
    const res = await POST(jsonRequest(VALID_CREATE));
    expect(res.status).toBe(429);
  });
});

describe("GET /api/wishes", () => {
  it("lists only the caller's wishes as summaries", async () => {
    vi.mocked(prisma.wish.findMany).mockResolvedValue([
      {
        id: "w1",
        title: "A",
        occasion: "birthday",
        templateId: "birthday-classic",
        recipientName: "R",
        senderName: "S",
        userId: "user-1",
        config: {},
        published: false,
        slug: null,
        publishedAt: null,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-02T00:00:00Z"),
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(prisma.wish.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
    const data = await res.json();
    expect(data.wishes).toHaveLength(1);
  });
});
