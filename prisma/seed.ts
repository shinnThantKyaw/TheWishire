import { Prisma, PrismaClient } from "@prisma/client";
import { buildWishConfig, TEST_PHOTOS, TEST_WISHES } from "./seed-config";

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
 * Shared content/settings live in ./seed-config.ts (pure data, test-covered
 * by seed-config.test.ts).
 *
 * Creates 4 wishes with the same content but different layout modes:
 *   1. /w/happy-birthday-sarah  — original (scroll)
 *   2. /w/demo-scroll           — scroll layout
 *   3. /w/demo-pages            — pages layout (button nav)
 *   4. /w/demo-interactive      — interactive (tap-to-reveal)
 */

const TEST_USER_EMAIL = "test@wishire.dev";

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
    // WishConfig is a plain interface; Prisma's InputJsonValue needs an index
    // signature only object literals get, so cast at the persistence boundary.
    const config = buildWishConfig(wishDef.flowMode) as unknown as Prisma.InputJsonValue;

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
