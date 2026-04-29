import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";

export type UpsertUserInput = {
  walletAddress: string;
  username?: string | undefined;
};

export async function upsertUser(input: UpsertUserInput) {
  const now = new Date();
  const [user] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      walletAddress: input.walletAddress,
      createdAt: now,
      updatedAt: now,
      ...(input.username ? { username: input.username } : {}),
    })
    .onConflictDoUpdate({
      target: users.walletAddress,
      set: {
        updatedAt: now,
        ...(input.username ? { username: input.username } : {}),
      },
    })
    .returning();

  if (!user) {
    throw new Error("Failed to upsert user");
  }

  return user;
}

export async function findUserByWalletAddress(walletAddress: string) {
  const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
  return user ?? null;
}
