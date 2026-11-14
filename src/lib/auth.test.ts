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

  it("signs in anonymously when supabase reports a missing session", async () => {
    const auth = mockAuth({
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: Object.assign(new Error("Auth session missing!"), {
          name: "AuthSessionMissingError",
          code: "AuthSessionMissingError",
        }),
      }),
    });
    const user = await ensureUser();
    expect(auth.signInAnonymously).toHaveBeenCalledTimes(1);
    expect(user).toEqual({ id: "anon-1", email: null });
  });

  it("signs in anonymously when the refresh token is dead", async () => {
    const auth = mockAuth({
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: Object.assign(new Error("Invalid Refresh Token: Refresh Token Not Found"), {
          name: "AuthApiError",
          code: "refresh_token_not_found",
        }),
      }),
    });
    await expect(ensureUser()).resolves.toEqual({ id: "anon-1", email: null });
    expect(auth.signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it("does NOT replace a live session on a transient getUser failure", async () => {
    // A network blip must not mint an anonymous session over the user's
    // claimed session — that silently orphans their wishes (preview 404).
    const auth = mockAuth({
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: Object.assign(new TypeError("fetch failed"), {
          name: "AuthRetryableFetchError",
        }),
      }),
    });
    await expect(ensureUser()).rejects.toThrow();
    expect(auth.signInAnonymously).not.toHaveBeenCalled();
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

  it("treats an empty-string email as anonymous (Supabase sends \"\")", async () => {
    // Real anonymous Supabase users come through with email: "" (not null).
    // Writing "" hits the users.email unique constraint (one '' row already
    // exists) and every save 401s — so "" must fall back to the placeholder.
    const EMPTY_EMAIL_USER = { id: "u-2", email: "" } as never;
    await ensureUserRow(EMPTY_EMAIL_USER);
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { id: "u-2" },
      update: { email: "u-2@anonymous.wishire.local" },
      create: { id: "u-2", email: "u-2@anonymous.wishire.local" },
    });
  });

  it("trims whitespace-only emails to the placeholder too", async () => {
    const WS_USER = { id: "u-3", email: "   " } as never;
    await ensureUserRow(WS_USER);
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { id: "u-3" },
      update: { email: "u-3@anonymous.wishire.local" },
      create: { id: "u-3", email: "u-3@anonymous.wishire.local" },
    });
  });
});
