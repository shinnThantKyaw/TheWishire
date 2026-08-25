import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { WishConfig } from "@/types/wish";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wish = await prisma.wish.findUnique({
    where: { slug, published: true },
    select: { title: true, senderName: true, recipientName: true },
  });

  if (!wish) {
    return { title: "Wish not found" };
  }

  return {
    title: `${wish.title} — from ${wish.senderName} to ${wish.recipientName}`,
    description: `${wish.senderName} made you a special surprise!`,
  };
}

export default async function WishPage({ params }: Props) {
  const { slug } = await params;

  const wish = await prisma.wish.findUnique({
    where: { slug, published: true },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });

  if (!wish) {
    notFound();
  }

  const config = wish.config as unknown as WishConfig;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{wish.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          From <span className="font-medium text-foreground">{wish.senderName}</span> to{" "}
          <span className="font-medium text-foreground">{wish.recipientName}</span>
        </p>

        {/* TODO: Replace with template renderer and stage machine */}
        <div className="mt-12 space-y-8">
          {config.content.letter && (
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{config.content.letter}</p>
            </div>
          )}

          {wish.media.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {wish.media.map((media: { id: string; url: string }) => (
                <div key={media.id} className="overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={media.url}
                    alt={`Photo from ${wish.senderName}`}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
