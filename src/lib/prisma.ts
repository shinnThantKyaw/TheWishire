import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Use DIRECT_URL to bypass Supabase's PgBouncer pooler.
 * PgBouncer doesn't support prepared statements, which causes
 * "prepared statement already exists" errors with Prisma.
 *
 * If DIRECT_URL is not set, falls back to DATABASE_URL.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
