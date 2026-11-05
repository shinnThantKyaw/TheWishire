import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/** Placeholder email for anonymous auth users (Prisma users.email is required + unique). */
const anonPlaceholderEmail = (id: string) => `${id}@anonymous.wishire.local`;

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
  } = await supabase.auth.getUser();
  if (user) return user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    throw new Error(error?.message ?? "Anonymous sign-in failed");
  }
  return data.user;
};

/**
 * Mirror the Supabase auth user into the Prisma users table — Wish.userId
 * has a FK to users.id, so every auth user needs a row before wishes can
 * be created. Keeps email in sync after an account claim.
 */
export const ensureUserRow = async (user: User): Promise<void> => {
  const email = user.email ?? anonPlaceholderEmail(user.id);
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email },
    create: { id: user.id, email },
  });
};
