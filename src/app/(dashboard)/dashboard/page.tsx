import { Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  // TODO: Fetch user's wishes from database
  const wishes: never[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Wishes</h1>
        <p className="text-muted-foreground">
          Create and manage your surprise experiences
        </p>
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
            <Button render={<Link href="/dashboard/create" />}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Wish
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Wish cards will be rendered here */}
        </div>
      )}
    </div>
  );
}
