import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/templates/registry";
import { mergeWishWithTemplate } from "@/lib/wish-merge";
import { ExperienceOrchestrator } from "@/components/wish/experience-orchestrator";
import { copy, interpolate } from "@/config/copy";
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
  const template = getTemplate(wish.templateId);

  if (!template) {
    notFound();
  }

  // Merge template structure with wish content into render-ready stages
  const stages = mergeWishWithTemplate(config, template, wish.media);

  return (
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
  );
}
