import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { upsert: vi.fn() } },
}));

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, ensureUser, ensureUserRow } from "./auth";

const mockAuth = (overrides: Partial<Record<string, unknown>> = {}) => {
  const auth = {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInAnonymously: vi.fn().mockResolvedValue({
      data: { user: { id: "anon-1", email: null } },
      error: null,
    }),
    ...overrides,
  };
  vi.mocked(createClient).mockResolvedValue({ auth } as never);
  return auth;
};

const ANON_USER = { id: "u-1", email: null } as never;
const CLAIMED_USER = { id: "u-1", email: "me@example.com" } as never;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSessionUser", () => {
  it("returns the session user when present", async () => {
    const auth = mockAuth({
      getUser: vi.fn().mockResolvedValue({ data: { user: CLAIMED_USER }, error: null }),
    });
    await expect(getSessionUser()).resolves.toEqual(CLAIMED_USER);
    expect(auth.signInAnonymously).not.toHaveBeenCalled();
  });

  it("returns null when signed out without creating a session", async () => {
    const auth = mockAuth();
    await expect(getSessionUser()).resolves.toBeNull();
    expect(auth.signInAnonymously).not.toHaveBeenCalled();
  });
});

describe("ensureUser", () => {
  it("returns an existing session user", async () => {
    const auth = mockAuth({
      getUser: vi.fn().mockResolvedValue({ data: { user: CLAIMED_USER }, error: null }),
    });
    await expect(ensureUser()).resolves.toEqual(CLAIMED_USER);
    expect(auth.signInAnonymously).not.toHaveBeenCalled();
  });

  it("signs in anonymously when no session exists", async () => {
    const auth = mockAuth();
    const user = await ensureUser();
    expect(auth.signInAnonymously).toHaveBeenCalledTimes(1);
    expect(user).toEqual({ id: "anon-1", email: null });
  });

  it("throws when anonymous sign-in fails (provider disabled)", async () => {
    mockAuth({
      signInAnonymously: vi.fn().mockResolvedValue({
        data: { user: null },
        error: new Error("Anonymous sign-ins are disabled"),
      }),
    });
    await expect(ensureUser()).rejects.toThrow("Anonymous sign-ins are disabled");
  });
});

describe("ensureUserRow", () => {
  it("upserts a placeholder email for anonymous users", async () => {
    await ensureUserRow(ANON_USER);
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { id: "u-1" },
      update: { email: "u-1@anonymous.wishire.local" },
      create: { id: "u-1", email: "u-1@anonymous.wishire.local" },
    });
  });

  it("syncs the real email after an account claim", async () => {
    await ensureUserRow(CLAIMED_USER);
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { id: "u-1" },
      update: { email: "me@example.com" },
      create: { id: "u-1", email: "me@example.com" },
    });
  });
});
