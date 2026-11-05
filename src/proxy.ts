import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 renamed Middleware → Proxy (same functionality).
 * Refreshes the Supabase auth session on every matched request so
 * Server Components and route handlers see a valid user.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Exclude Next internals and static assets (incl. /public files)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|mp4)$).*)",
  ],
};
