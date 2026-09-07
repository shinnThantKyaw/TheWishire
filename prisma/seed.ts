import { PrismaClient } from "@prisma/client";

// Use direct connection for seeding (bypasses PgBouncer pooler)
const prisma = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

/**
 * Seed script — creates test wishes for development.
 *
 * Usage (from Windows PowerShell):
 *   npx tsx prisma/seed.ts
 *
 * Creates 4 wishes with the same content but different layout modes:
 *   1. /w/happy-birthday-sarah  — original (scroll)
 *   2. /w/demo-scroll           — scroll layout
 *   3. /w/demo-pages            — pages layout (button nav)
 *   4. /w/demo-interactive      — interactive (tap-to-reveal)
 */

const TEST_USER_EMAIL = "test@wishire.dev";

const SHARED_CONTENT = {
  letter: `Dear Sarah,

Happy 25th Birthday! 🎂

I can't believe it's been 10 years since we met in that college dorm hallway. Remember when we stayed up until 3am talking about our dreams? Look at us now — you're out there changing the world, one patient at a time.

You've always been the person everyone turns to when things get tough. Your kindness isn't just a trait — it's a superpower. And today, on your birthday, I want you to know how much you mean to me and everyone around you.

Here's to 25 more years of laughter, adventure, and memories together.

With all my love,
Alex ❤️`,
  poem: {
    id: "birthday-wish-1",
    title: "A Birthday Wish",
    author: "Unknown",
    text: "May your day be filled with sunshine,\nAnd your year with joy untold,\nMay each dream you've ever wished for,\nCome to you as you grow old.",
  },
  memoryTimeline: [
    {
      date: "September 2016",
      title: "The Day We Met",
      description:
        "Freshman dorm hallway. You were carrying too many boxes and I offered to help. Best decision ever.",
    },
    {
      date: "March 2018",
      title: "Road Trip to the Coast",
      description:
        "12 hours in a car, one broken GPS, and the best sunset we've ever seen. Worth every wrong turn.",
    },
    {
      date: "December 2020",
      title: "You Got Into Nursing School",
      description:
        "The scream when you opened that acceptance letter still echoes in my head. I knew you'd make it.",
    },
    {
      date: "June 2023",
      title: "Your First Day as a Nurse",
      description:
        "Watching you walk into that hospital in your scrubs, I've never been prouder of anyone.",
    },
  ],
  musicUrl: "/music/birthday-song.mp3",
  characterGif: {
    src: "/gifs/musician-cat.gif",
    position: "bottom-right" as const,
    alt: "Cute cat playing guitar",
  },
  decorations: {
    elements: ["sparkles", "hearts", "flowers"] as const,
    density: "medium" as const,
  },
};

const SHARED_SETTINGS_BASE = {
  enableGiftBox: true,
  enableCake: true,
  enableRibbon: false,
  enableVoiceMessage: false,
  enableMusic: true,
  enablePoem: true,
  enableTimeline: true,
  enableGiftChallenge: false,
  enableSpinWheel: false,
} as const;

const SHARED_STAGES = [
  { type: "envelope", enabled: true, config: {} },
  { type: "gift-box", enabled: true, config: {} },
  { type: "cake", enabled: true, config: {} },
  { type: "main-content", enabled: true, config: {} },
  { type: "poem-display", enabled: true, config: {} },
  { type: "memory-timeline", enabled: true, config: {} },
  { type: "fancy-facts", enabled: true, config: {} },
  { type: "closing", enabled: true, config: {} },
];

const TEST_PHOTOS = [
  { url: "/images/photo-1.jpg", sortOrder: 0 },
  { url: "/images/photo-2.jpg", sortOrder: 1 },
  { url: "/images/photo-3.jpg", sortOrder: 2 },
  { url: "/images/photo-4.jpg", sortOrder: 3 },
];

/** All 4 test wishes — same content, different layout modes */
const TEST_WISHES = [
  {
    slug: "happy-birthday-sarah",
    title: "Happy Birthday, Sarah!",
    flowMode: "scroll" as const,
    label: "Scroll layout (original)",
  },
  {
    slug: "demo-scroll",
    title: "Demo — Scroll Layout",
    flowMode: "scroll" as const,
    label: "Scroll layout (demo)",
  },
  {
    slug: "demo-pages",
    title: "Demo — Pages Layout",
    flowMode: "buttons" as const,
    label: "Pages layout (button navigation)",
  },
  {
    slug: "demo-interactive",
    title: "Demo — Interactive Layout",
    flowMode: "tap-to-reveal" as const,
    label: "Interactive layout (tap-to-reveal)",
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Create or find test user
  const user = await prisma.user.upsert({
    where: { email: TEST_USER_EMAIL },
    update: {},
    create: { email: TEST_USER_EMAIL },
  });
  console.log(`✅ User: ${user.email} (${user.id})`);

  // 2. Create all 4 wishes
  for (const wishDef of TEST_WISHES) {
    const config = {
      stages: SHARED_STAGES,
      content: SHARED_CONTENT,
      settings: {
        ...SHARED_SETTINGS_BASE,
        intensity: "celebration" as const,
        flowMode: wishDef.flowMode,
      },
    };

    const wish = await prisma.wish.upsert({
      where: { slug: wishDef.slug },
      update: {
        title: wishDef.title,
        recipientName: "Sarah",
        senderName: "Alex",
        templateId: "birthday-classic",
        occasion: "birthday",
        config,
        published: true,
        publishedAt: new Date(),
      },
      create: {
        userId: user.id,
        title: wishDef.title,
        recipientName: "Sarah",
        senderName: "Alex",
        templateId: "birthday-classic",
        occasion: "birthday",
        config,
        published: true,
        slug: wishDef.slug,
        publishedAt: new Date(),
      },
    });

    // Clear and recreate media for this wish
    await prisma.wishMedia.deleteMany({ where: { wishId: wish.id } });
    await Promise.all(
      TEST_PHOTOS.map((photo) =>
        prisma.wishMedia.create({
          data: {
            wishId: wish.id,
            type: "photo",
            url: photo.url,
            filename: `photo-${photo.sortOrder}.jpg`,
            sizeBytes: 0,
            sortOrder: photo.sortOrder,
          },
        })
      )
    );

    console.log(`✅ ${wishDef.label}`);
    console.log(`   /w/${wish.slug}`);
  }

  console.log("\n🎉 Seed complete!");
  console.log(`\n👉 Test all 4 layouts:`);
  console.log(`   http://localhost:3000/w/happy-birthday-sarah  (original)`);
  console.log(`   http://localhost:3000/w/demo-scroll           (scroll)`);
  console.log(`   http://localhost:3000/w/demo-pages            (pages)`);
  console.log(`   http://localhost:3000/w/demo-interactive      (interactive)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
