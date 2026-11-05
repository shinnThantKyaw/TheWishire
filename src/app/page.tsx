import Link from "next/link";
import { Gift, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartCreatingButton } from "@/components/start-creating-button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-12 px-6 py-24 text-center">
        <div className="flex items-center gap-3 text-pink-600 dark:text-pink-400">
          <Gift className="h-8 w-8" />
          <span className="text-lg font-medium">Wishire</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Create{" "}
          <span className="text-pink-600 dark:text-pink-400">surprise</span>{" "}
          experiences that feel like gifts
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Build personalized, interactive surprise websites for birthdays and
          special occasions. Make someone you love feel like they&apos;re opening a
          special gift.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <StartCreatingButton />
          <Button size="lg" variant="outline" render={<Link href="/dashboard" />}>
            Go to Dashboard
          </Button>
        </div>

        <div className="mt-8 grid gap-6 text-left sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Heart className="mb-3 h-8 w-8 text-pink-500" />
            <h3 className="font-semibold">Emotional Experiences</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Not just a card — an interactive journey with animations and
              surprises at every step.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Gift className="mb-3 h-8 w-8 text-pink-500" />
            <h3 className="font-semibold">Unwrap Moments</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Gift boxes, cake interactions, ribbon reveals — each stage builds
              anticipation.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Sparkles className="mb-3 h-8 w-8 text-pink-500" />
            <h3 className="font-semibold">Shareable Links</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Publish and share via a unique link. No app download needed — works
              on any device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
