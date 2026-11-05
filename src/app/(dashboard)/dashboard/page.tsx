import Link from "next/link";
import { Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WishList, type WishSummary } from "@/components/dashboard/wish-list";
import { StartCreatingButton } from "@/components/start-creating-button";

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <CardContent className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
            <Gift className="h-8 w-8 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <CardTitle>You&apos;re signed out</CardTitle>
            <CardDescription className="mt-1">
              Start a wish — we&apos;ll open a guest session for you, no
              password needed.
            </CardDescription>
          </div>
          <div className="flex justify-center">
            <StartCreatingButton />
          </div>
          <p className="text-sm text-muted-foreground">
            Have an account?{" "}
            <Link href="/login" className="text-pink-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const rows = await prisma.wish.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      occasion: true,
      published: true,
      slug: true,
      updatedAt: true,
    },
  });

  const wishes: WishSummary[] = rows.map((r) => ({
    ...r,
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Wishes</h1>
          <p className="text-muted-foreground">
            Create and manage your surprise experiences
          </p>
        </div>
        <Button render={<Link href="/dashboard/create" />}>
          <Plus className="mr-2 h-4 w-4" />
          New Wish
        </Button>
      </div>

      {wishes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <CardContent className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
              <Gift className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <CardTitle>No wishes yet</CardTitle>
              <CardDescription className="mt-1">
                Create your first surprise experience to get started
              </CardDescription>
            </div>
            <div className="flex justify-center">
              <StartCreatingButton />
            </div>
          </CardContent>
        </Card>
      ) : (
        <WishList wishes={wishes} />
      )}
    </div>
  );
}
