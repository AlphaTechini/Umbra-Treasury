import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { addTreasuryTransaction, getDaoTransactions } from "../services/transactionService.js";
import { parseBody, parseParams } from "../utils/validate.js";

const daoIdParamsSchema = z.object({
  daoId: z.string().min(1),
});

const createTransactionSchema = z.object({
  createdByWalletAddress: z.string().min(1),
  type: z.enum(["income", "expense", "transfer"]),
  category: z.enum(["grant", "payroll", "vendor", "ops", "tax", "treasury_transfer", "other"]),
  token: z.string().min(1),
  amountHint: z.string().min(1).optional(),
  date: z.string().datetime(),
  publicCounterpartyLabel: z.string().min(1).optional(),
  publicMemo: z.string().min(1).optional(),
  encryptedPrivateMetadata: z.string().min(1).optional(),
  umbraOperationType: z.enum([
    "registration",
    "deposit",
    "withdraw",
    "utxo_create",
    "utxo_claim",
    "compliance_grant",
    "compliance_revoke",
    "mock",
  ]),
  umbraOperationRefs: z.record(z.string(), z.unknown()).default({}),
});

export async function registerTransactionRoutes(app: FastifyInstance): Promise<void> {
  app.post("/daos/:daoId/transactions", async (request, reply) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const body = parseBody(createTransactionSchema, request.body);
    const transaction = await addTreasuryTransaction(params.daoId, body);

    return reply.status(201).send({ transaction });
  });

  app.get("/daos/:daoId/transactions", async (request) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const transactions = await getDaoTransactions(params.daoId);

    return { transactions };
  });
}
