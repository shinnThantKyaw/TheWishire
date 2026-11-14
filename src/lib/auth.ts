import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/** Placeholder email for anonymous auth users (Prisma users.email is required + unique). */
const anonPlaceholderEmail = (id: string) => `${id}@anonymous.wishire.local`;

/**
 * Refresh-token / session states that mean "this session is truly dead"
 * (same classification supabase-js uses internally). Only these may be
 * replaced by a fresh anonymous session.
 */
const SESSION_GONE_CODES = new Set([
  "refresh_token_not_found",
  "refresh_token_already_used",
  "session_expired",
  "session_not_found",
  "invalid_grant",
]);

/**
 * True when getUser() failed because no valid session exists — safe to
 * sign in anonymously. Anything else (network blip, retryable fetch
 * failure, unexpected error) must NOT replace a live claimed session:
 * minting anon over it silently orphans the user's wishes.
 */
const isSessionGone = (error: unknown): boolean => {
  if (!error) return true;
  const e = error as { name?: string; code?: string };
  if (e.name === "AuthSessionMissingError") return true;
  return e.code !== undefined && SESSION_GONE_CODES.has(e.code);
};

/**
 * Session user for the current request, or null when signed out.
 * Safe in Server Components (read-only — never sets cookies).
 */
export const getSessionUser = async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * Model C entry point: returns the session user, signing in anonymously
 * when no session exists. Must run where cookies can be set (route
 * handler or server action) — Server Components cannot write cookies.
 */
export const ensureUser = async (): Promise<User> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (user) return user;

  // Mint an anonymous session only when the session is genuinely gone.
  // A transient getUser failure must not replace a live claimed session.
  if (!isSessionGone(error)) {
    throw error ?? new Error("Unable to verify session");
  }

  const { data, error: signInError } = await supabase.auth.signInAnonymously();
  if (signInError || !data.user) {
    throw new Error(signInError?.message ?? "Anonymous sign-in failed");
  }
  return data.user;
};

/**
 * Mirror the Supabase auth user into the Prisma users table — Wish.userId
 * has a FK to users.id, so every auth user needs a row before wishes can
 * be created. Keeps email in sync after an account claim.
 */
export const ensureUserRow = async (user: User): Promise<void> => {
  // Supabase serializes a missing email as "" (not null) for anonymous
  // users. `??` alone would write "" and violate users.email unique —
  // fall back to the placeholder for empty/whitespace-only emails too.
  const email = user.email?.trim() || anonPlaceholderEmail(user.id);
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email },
    create: { id: user.id, email },
  });
};
