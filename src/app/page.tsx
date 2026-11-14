import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Gamepad2,
  Gift,
  Heart,
  Home as HomeIcon,
  Link2,
  PenLine,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartCreatingButton } from "@/components/start-creating-button";

/** Romantic display face from root layout (--font-playfair = Playfair Display). */
const displayFont = {
  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
} as const;

const audiences = [
  {
    icon: Heart,
    title: "For partners",
    description:
      "Anniversaries, birthdays, Valentine's Day — make the moment feel handmade, not bought.",
  },
  {
    icon: Users,
    title: "For friends",
    description:
      "Birthdays, farewells, shared memories — turn your inside jokes into a journey they can open.",
  },
  {
    icon: HomeIcon,
    title: "For family",
    description:
      "Parents, siblings, kids — celebrate from anywhere in the world as if you were there.",
  },
];

const steps = [
  {
    icon: Sparkles,
    title: "Start creating",
    description:
      "Hit the button — no account needed. Your draft is ready in seconds.",
  },
  {
    icon: PenLine,
    title: "Tell your story",
    description:
      "Write a letter, add photos, a timeline of memories, and their favorite song.",
  },
  {
    icon: Gamepad2,
    title: "Add a surprise gate",
    description:
      "Lock the gift behind a passcode, a quiz, or a little game they have to win.",
  },
  {
    icon: Share2,
    title: "Publish & share",
    description:
      "Get a unique link and QR code. They open it on any device — no app to install.",
  },
];

const features = [
  {
    icon: Heart,
    title: "Emotional experiences",
    description:
      "Not just a card — an interactive journey with animations and surprises at every step.",
  },
  {
    icon: Gift,
    title: "Unwrap moments",
    description:
      "Gift boxes, challenges, and spin wheels — every stage builds anticipation before the reveal.",
  },
  {
    icon: Link2,
    title: "Shareable links",
    description:
      "Publish and share via a unique link with a QR code. Works on any device, instantly.",
  },
];

const trustPoints = [
  "No sign-up to start",
  "No app download",
  "Preview before you share",
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Wishire home">
            <Image
              src="/Logo/Logo.png"
              alt=""
              width={500}
              height={500}
              className="h-8 w-8"
            />
            <span
              style={displayFont}
              className="text-lg font-semibold text-rose-600 dark:text-rose-400"
            >
              Wishire
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            <a
              href="#how"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              render={<Link href="/dashboard" />}
              className="hidden sm:inline-flex"
            >
              Dashboard
            </Button>
            <StartCreatingButton
              className="flex"
              buttonClassName="min-h-11 px-4"
            />
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-background to-background dark:from-rose-950/25 dark:via-background dark:to-background">
          <div className="mx-auto max-w-4xl px-4 pt-10 pb-14 text-center sm:pt-14 sm:pb-20">
            <Image
              src="/Logo/LogoWithText.png"
              alt="Wishire — surprise gift box with a letter"
              width={1254}
              height={1254}
              priority
              className="mx-auto mb-6 h-36 w-auto sm:h-44 lg:h-52"
            />
            <h1
              style={displayFont}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Create{" "}
              <span className="text-rose-600 dark:text-rose-400">surprise</span>{" "}
              experiences that feel like gifts
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Wishire turns your words, photos, and memories into an animated
              wish website — a personal, interactive gift your loved one opens
              with a single link.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <StartCreatingButton buttonClassName="h-12 px-6 text-base" />
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/dashboard" />}
                className="h-12 px-6 text-base"
              >
                Go to Dashboard
              </Button>
            </div>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-1.5">
                  <Check
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What is Wishire ───────────────────────────── */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
              What is Wishire
            </p>
            <h2
              id="about-heading"
              style={displayFont}
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              A gift that lives in a link
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Wishire is a platform for creating personalized, interactive wish
              websites for birthdays, anniversaries, and every celebration in
              between. Instead of a plain message, you send an experience:
              animated chapters, photos, memories, music, and little challenges
              — all wrapped into one beautiful page made just for them.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Built for anyone who wants to say something meaningful — and make
              opening it feel as special as the words inside.
            </p>
          </div>
        </section>

        {/* ── Who it's for ───────────────────────────────── */}
        <section
          id="for-who"
          aria-labelledby="for-who-heading"
          className="scroll-mt-20 bg-muted/40 px-4 py-16 dark:bg-muted/15 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                Who it&apos;s for
              </p>
              <h2
                id="for-who-heading"
                style={displayFont}
                className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Made for the people you care about
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {audiences.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-full bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                    <Icon aria-hidden className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────── */}
        <section
          id="how"
          aria-labelledby="how-heading"
          className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                How it works
              </p>
              <h2
                id="how-heading"
                style={displayFont}
                className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                From idea to link in four steps
              </h2>
            </div>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, description }, index) => (
                <li key={title} className="relative">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex rounded-full bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span
                        style={displayFont}
                        className="text-sm font-semibold text-rose-600/70 dark:text-rose-400/70"
                        aria-hidden
                      >
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────── */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="scroll-mt-20 bg-muted/40 px-4 py-16 dark:bg-muted/15 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                Features
              </p>
              <h2
                id="features-heading"
                style={displayFont}
                className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Everything a good surprise needs
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-full bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                    <Icon aria-hidden className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────── */}
        <section
          aria-labelledby="cta-heading"
          className="bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-14 text-center sm:px-6 sm:py-16"
        >
          <div className="mx-auto max-w-2xl">
            <h2
              id="cta-heading"
              style={displayFont}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Ready to make someone&apos;s day?
            </h2>
            <p className="mt-3 text-base text-rose-100 sm:text-lg">
              Start building now — your first surprise is only minutes away.
            </p>
            <div className="mt-7 flex justify-center">
              <StartCreatingButton
                buttonClassName="h-12 bg-white px-6 text-base text-rose-700 hover:bg-rose-50 dark:bg-white dark:text-rose-700"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/Logo/Logo.png"
                alt=""
                width={500}
                height={500}
                className="h-7 w-7"
              />
              <span
                style={displayFont}
                className="text-base font-semibold text-rose-600 dark:text-rose-400"
              >
                Wishire
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Personalized, interactive surprise websites for the people you
              love.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#how"
                  className="transition-colors hover:text-foreground"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="transition-colors hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Account">
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="transition-colors hover:text-foreground"
                >
                  Create account
                </Link>
              </li>
              <li>
                <StartCreatingButton buttonClassName="min-h-11 px-3">
                  <span className="inline-flex items-center gap-1.5">
                    Start creating
                    <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </span>
                </StartCreatingButton>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-border/60 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wishire. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
