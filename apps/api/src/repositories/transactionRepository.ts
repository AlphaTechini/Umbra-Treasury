import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { treasuryTransactions } from "../db/schema.js";

export type CreateTransactionInput = {
  daoId: string;
  createdById: string;
  type: "income" | "expense" | "transfer";
  category: "grant" | "payroll" | "vendor" | "ops" | "tax" | "treasury_transfer" | "other";
  token: string;
  amountHint?: string | undefined;
  date: Date;
  publicCounterpartyLabel?: string | undefined;
  publicMemo?: string | undefined;
  encryptedPrivateMetadata?: string | undefined;
  umbraOperationType:
    | "registration"
    | "deposit"
    | "withdraw"
    | "utxo_create"
    | "utxo_claim"
    | "compliance_grant"
    | "compliance_revoke"
    | "mock";
  umbraOperationRefs: Record<string, unknown>;
};

export async function createTransaction(input: CreateTransactionInput) {
  const now = new Date();
  const [transaction] = await db
    .insert(treasuryTransactions)
    .values({
      id: randomUUID(),
      daoId: input.daoId,
      createdById: input.createdById,
      type: input.type,
      category: input.category,
      token: input.token,
      date: input.date,
      umbraOperationType: input.umbraOperationType,
      umbraOperationRefs: input.umbraOperationRefs,
      createdAt: now,
      updatedAt: now,
      ...(input.amountHint ? { amountHint: input.amountHint } : {}),
      ...(input.publicCounterpartyLabel ? { publicCounterpartyLabel: input.publicCounterpartyLabel } : {}),
      ...(input.publicMemo ? { publicMemo: input.publicMemo } : {}),
      ...(input.encryptedPrivateMetadata ? { encryptedPrivateMetadata: input.encryptedPrivateMetadata } : {}),
    })
    .returning();

  if (!transaction) {
    throw new Error("Failed to create treasury transaction");
  }

  return transaction;
}

export async function listTransactionsForDao(daoId: string) {
  return db
    .select()
    .from(treasuryTransactions)
    .where(eq(treasuryTransactions.daoId, daoId))
    .orderBy(desc(treasuryTransactions.date));
}
