import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { resetRateLimits } from "@/lib/rate-limit";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wish: {
      findUnique: vi.fn(),
      update: vi.fn(),
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
const routeArgs = { params: Promise.resolve({ id: "w1" }) };

const validConfig = {
  stages: [{ type: "letter", enabled: true, config: {} }],
  content: { letter: "Hello" },
  settings: {
    intensity: "celebration",
    flowMode: "scroll",
    enableGiftBox: true,
    enableCake: true,
    enableRibbon: false,
    enableVoiceMessage: false,
    enableMusic: true,
    enablePoem: true,
    enableTimeline: true,
    enableGiftChallenge: true,
    enableSpinWheel: true,
  },
};

const baseWish = {
  id: "w1",
  userId: "owner-1",
  title: "For Julia",
  occasion: "birthday",
  templateId: "birthday-classic",
  recipientName: "ဂျူလီယာ",
  senderName: "ကိုသျှား",
  slug: "for-julia-abc123",
  published: false,
  publishedAt: null,
  config: validConfig,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-02T00:00:00Z"),
};

const makeRequest = (body?: unknown) =>
  new Request("http://localhost/api/wishes/w1/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

beforeEach(() => {
  vi.clearAllMocks();
  resetRateLimits();
  vi.mocked(ensureUser).mockResolvedValue(OWNER);
});

describe("POST /api/wishes/[id]/publish", () => {
  it("publishes a fully valid wish", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue(baseWish);
    vi.mocked(prisma.wish.update).mockResolvedValue({
      ...baseWish,
      published: true,
      publishedAt: new Date(),
    });

    const res = await POST(makeRequest(), routeArgs);

    expect(res.status).toBe(200);
    expect(prisma.wish.update).toHaveBeenCalledWith({
      where: { id: "w1" },
      data: expect.objectContaining({ published: true }),
    });
  });

  it("400s when the config fails full validation", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue({
      ...baseWish,
      config: { content: { letter: "hi" } }, // missing stages/settings
    });

    const res = await POST(makeRequest(), routeArgs);

    expect(res.status).toBe(400);
    expect(prisma.wish.update).not.toHaveBeenCalled();
  });

  it("404s for non-owners", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue({
      ...baseWish,
      userId: "intruder",
    });

    const res = await POST(makeRequest(), routeArgs);
    expect(res.status).toBe(404);
    expect(prisma.wish.update).not.toHaveBeenCalled();
  });

  it("unpublishes with {publish:false} without validation", async () => {
    vi.mocked(prisma.wish.findUnique).mockResolvedValue({
      ...baseWish,
      published: true,
      config: { broken: true },
    });
    vi.mocked(prisma.wish.update).mockResolvedValue({
      ...baseWish,
      published: false,
    });

    const res = await POST(makeRequest({ publish: false }), routeArgs);

    expect(res.status).toBe(200);
    expect(prisma.wish.update).toHaveBeenCalledWith({
      where: { id: "w1" },
      data: { published: false },
    });
  });
});
