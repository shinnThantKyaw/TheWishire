import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wish: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

const findUnique = vi.mocked(prisma.wish.findUnique);

const makeRequest = (body: unknown) =>
  new Request("http://localhost/api/w/demo-scroll/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const params = { params: Promise.resolve({ slug: "demo-scroll" }) };

// Route selects only { config }; partial row cast keeps the mock readable.
const withGiftChapter = (challenge: unknown) =>
  ({
    config: {
      settings: { giftChapter: { challenge } },
    },
  }) as never;

const MC_CHALLENGE = {
  type: "multiple-choice",
  question: "Q?",
  options: ["A", "B", "C"],
  correctIndex: 1,
};

const HEART_CHALLENGE = {
  type: "heart-catch",
  heartsToCatch: 8,
  timeLimitSeconds: 15,
};

beforeEach(() => {
  findUnique.mockReset();
});

describe("POST /api/w/[slug]/challenge — multiple choice", () => {
  it("404s for an unknown or unpublished wish", async () => {
    findUnique.mockResolvedValue(null);
    const res = await POST(
      makeRequest({ type: "multiple-choice", answerIndex: 1 }),
      params,
    );
    expect(res.status).toBe(404);
  });

  it("accepts the correct answer index", async () => {
    findUnique.mockResolvedValue(withGiftChapter(MC_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "multiple-choice", answerIndex: 1 }),
      params,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("rejects a wrong answer index", async () => {
    findUnique.mockResolvedValue(withGiftChapter(MC_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "multiple-choice", answerIndex: 2 }),
      params,
    );
    expect(res.status).toBe(400);
    expect((await res.json()).ok).toBe(false);
  });

  it("409s when the wish has no multiple-choice challenge configured", async () => {
    findUnique.mockResolvedValue(withGiftChapter(HEART_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "multiple-choice", answerIndex: 1 }),
      params,
    );
    expect(res.status).toBe(409);
  });

  it("400s on a non-integer answer index", async () => {
    findUnique.mockResolvedValue(withGiftChapter(MC_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "multiple-choice", answerIndex: 1.5 }),
      params,
    );
    expect(res.status).toBe(400);
  });
});

describe("POST /api/w/[slug]/challenge — heart catch", () => {
  it("accepts a run that caught enough hearts within the limit", async () => {
    findUnique.mockResolvedValue(withGiftChapter(HEART_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "heart-catch", caught: 8, elapsedMs: 9000 }),
      params,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("rejects when too few hearts were caught", async () => {
    findUnique.mockResolvedValue(withGiftChapter(HEART_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "heart-catch", caught: 5, elapsedMs: 9000 }),
      params,
    );
    expect(res.status).toBe(400);
  });

  it("rejects a run slower than the configured limit (+grace)", async () => {
    findUnique.mockResolvedValue(withGiftChapter(HEART_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "heart-catch", caught: 8, elapsedMs: 20000 }),
      params,
    );
    expect(res.status).toBe(400);
  });

  it("rejects an instant fake submission under the elapsed floor", async () => {
    findUnique.mockResolvedValue(withGiftChapter(HEART_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "heart-catch", caught: 8, elapsedMs: 200 }),
      params,
    );
    expect(res.status).toBe(400);
  });

  it("409s when the configured challenge is a different type", async () => {
    findUnique.mockResolvedValue(withGiftChapter(MC_CHALLENGE));
    const res = await POST(
      makeRequest({ type: "heart-catch", caught: 8, elapsedMs: 9000 }),
      params,
    );
    expect(res.status).toBe(409);
  });
});

describe("POST /api/w/[slug]/challenge — payload guards", () => {
  it("400s on invalid JSON", async () => {
    const res = await POST(
      new Request("http://localhost/x", { method: "POST", body: "not-json" }),
      params,
    );
    expect(res.status).toBe(400);
  });

  it("400s on an unknown challenge type", async () => {
    findUnique.mockResolvedValue(withGiftChapter(MC_CHALLENGE));
    const res = await POST(makeRequest({ type: "teleport" }), params);
    expect(res.status).toBe(400);
    expect(findUnique).not.toHaveBeenCalled();
  });
});
