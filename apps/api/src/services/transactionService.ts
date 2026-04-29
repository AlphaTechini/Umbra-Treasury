import { createAccessLog } from "../repositories/accessLogRepository.js";
import { createTransaction, listTransactionsForDao } from "../repositories/transactionRepository.js";
import { upsertUser } from "../repositories/userRepository.js";
import { forbidden } from "../utils/apiError.js";
import { type WalletAuthorization, verifyWalletAuthorization } from "../utils/walletAuthorization.js";
import { mapTransactionCategory, mapTransactionType, mapUmbraOperationType } from "./enumMappers.js";
import { requireDaoById } from "./daoService.js";

export type CreateTreasuryTransactionRequest = {
  createdByWalletAddress: string;
  walletAuthorization: WalletAuthorization;
  type: string;
  category: string;
  token: string;
  amountHint?: string | undefined;
  date: string;
  publicCounterpartyLabel?: string | undefined;
  publicMemo?: string | undefined;
  encryptedPrivateMetadata?: string | undefined;
  umbraOperationType: string;
  umbraOperationRefs: Record<string, unknown>;
};

export async function addTreasuryTransaction(daoId: string, input: CreateTreasuryTransactionRequest) {
  verifyWalletAuthorization(input.walletAuthorization, {
    action: "treasury_transaction:create",
    walletAddress: input.createdByWalletAddress,
    daoId,
  });

  const dao = await requireDaoById(daoId);

  const creator = await upsertUser({
    walletAddress: input.createdByWalletAddress,
  });

  if (creator.id !== dao.ownerId) {
    throw forbidden("Only the DAO owner can add treasury transactions");
  }

  const transaction = await createTransaction({
    daoId,
    createdById: creator.id,
    type: mapTransactionType(input.type),
    category: mapTransactionCategory(input.category),
    token: input.token,
    amountHint: input.amountHint,
    date: new Date(input.date),
    publicCounterpartyLabel: input.publicCounterpartyLabel,
    publicMemo: input.publicMemo,
    encryptedPrivateMetadata: input.encryptedPrivateMetadata,
    umbraOperationType: mapUmbraOperationType(input.umbraOperationType),
    umbraOperationRefs: input.umbraOperationRefs,
  });

  await createAccessLog({
    daoId,
    actorId: creator.id,
    action: "transaction_added",
    targetType: "transaction",
    targetId: transaction.id,
    metadata: {
      category: input.category,
      type: input.type,
      umbraOperationType: input.umbraOperationType,
    },
  });

  return transaction;
}

export async function getDaoTransactions(daoId: string) {
  await requireDaoById(daoId);
  return listTransactionsForDao(daoId);
}
