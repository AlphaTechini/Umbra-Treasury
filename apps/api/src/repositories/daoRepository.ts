import { randomUUID } from "node:crypto";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { daos, users } from "../db/schema.js";

export type CreateDaoInput = {
  ownerId: string;
  name: string;
  slug: string;
  treasuryAddress?: string | undefined;
  baseToken: "usdc" | "usdt" | "wsol" | "umbra" | "other";
  description?: string | undefined;
  isPublic?: boolean | undefined;
};

export async function createDao(input: CreateDaoInput) {
  const now = new Date();
  const [dao] = await db
    .insert(daos)
    .values({
      id: randomUUID(),
      ownerId: input.ownerId,
      name: input.name,
      slug: input.slug,
      baseToken: input.baseToken,
      isPublic: input.isPublic ?? true,
      createdAt: now,
      updatedAt: now,
      ...(input.treasuryAddress ? { treasuryAddress: input.treasuryAddress } : {}),
      ...(input.description ? { description: input.description } : {}),
    })
    .returning();

  if (!dao) {
    throw new Error("Failed to create DAO");
  }

  return dao;
}

export async function findDaoById(id: string) {
  const [row] = await db
    .select({ dao: daos, owner: users })
    .from(daos)
    .innerJoin(users, eq(daos.ownerId, users.id))
    .where(eq(daos.id, id))
    .limit(1);

  return row ? { ...row.dao, owner: row.owner } : null;
}

export async function findDaoBySlug(slug: string) {
  const [row] = await db
    .select({ dao: daos, owner: users })
    .from(daos)
    .innerJoin(users, eq(daos.ownerId, users.id))
    .where(eq(daos.slug, slug))
    .limit(1);

  return row ? { ...row.dao, owner: row.owner } : null;
}

export async function findFirstDaoByOwnerWalletAddress(walletAddress: string) {
  const [row] = await db
    .select({ dao: daos, owner: users })
    .from(daos)
    .innerJoin(users, eq(daos.ownerId, users.id))
    .where(eq(users.walletAddress, walletAddress))
    .orderBy(asc(daos.createdAt))
    .limit(1);

  return row ? { ...row.dao, owner: row.owner } : null;
}
