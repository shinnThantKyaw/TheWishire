import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { getTemplate } from "@/templates/registry";
import { mergeWishWithTemplate } from "@/lib/wish-merge";
import { ExperienceOrchestrator } from "@/components/wish/experience-orchestrator";
import { copy, interpolate } from "@/config/copy";
import type { WishConfig } from "@/types/wish";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wish = await prisma.wish.findUnique({
    where: { slug, published: true },
    select: { title: true, senderName: true, recipientName: true },
  });

  if (!wish) {
    return { title: copy.route.notFoundTitle };
  }

  return {
    title: interpolate(copy.route.metaTitle, {
      title: wish.title,
      sender: wish.senderName,
      recipient: wish.recipientName,
    }),
    description: interpolate(copy.route.metaDescription, { sender: wish.senderName }),
  };
}

export default async function WishPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;

  const wish = await prisma.wish.findUnique({
    where: { slug },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });

  // Drafts are invisible except to their owner via ?preview=1 (4.11).
  let isPreview = false;
  if (wish && !wish.published) {
    if (preview !== "1") {
      notFound();
    }
    const user = await getSessionUser();
    if (!user || user.id !== wish.userId) {
      notFound();
    }
    isPreview = true;
  }

  if (!wish) {
    notFound();
  }

  const config = wish.config as unknown as WishConfig;
  const template = getTemplate(wish.templateId);

  if (!template) {
    notFound();
  }

  // Merge template structure with wish content into render-ready stages
  const stages = mergeWishWithTemplate(config, template, wish.media);

  return (
    <>
      {isPreview && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-amber-950">
          Preview — this wish isn&apos;t published yet.
        </div>
      )}
      <ExperienceOrchestrator
        stages={stages}
        theme={template.theme}
        senderName={wish.senderName}
        recipientName={wish.recipientName}
        senderNickname={config.senderNickname}
        recipientNickname={config.recipientNickname}
        occasion={wish.occasion}
        flowMode={config.settings.flowMode}
        musicUrl={config.content.musicUrl}
        characterGif={config.content.characterGif}
        decorations={config.content.decorations}
        startAction={config.settings.startAction}
        giftConfig={config.settings.giftChapter}
      />
    </>
  );
}
