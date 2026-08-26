import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // v1: No auth — just pass through.
  // Phase 2+: Add Supabase session refresh here.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (static files)
     * - favicon.ico (favicon)
     * - public files (images, etc.)
     * - /w/* (recipient experience — always public)
     * - /api/health (health check)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/health|w/).*)",
  ],
};
