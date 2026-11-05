import Link from "next/link";
import { Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";
import { ClaimBanner } from "@/components/auth/claim-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Gift className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            <span>Wishire</span>
          </Link>
          <div className="flex items-center gap-3">
            {!user && (
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
            )}
            <Button size="sm" render={<Link href="/dashboard/create" />}>
              <Plus className="mr-1 h-4 w-4" />
              New Wish
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ClaimBanner />
        {children}
      </main>
    </div>
  );
}
