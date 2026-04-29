import { badRequest } from "../utils/apiError.js";

const baseTokenMap = {
  usdc: "usdc",
  usdt: "usdt",
  wsol: "wsol",
  umbra: "umbra",
  other: "other",
} as const;

const transactionTypeMap = {
  income: "income",
  expense: "expense",
  transfer: "transfer",
} as const;

const transactionCategoryMap = {
  grant: "grant",
  payroll: "payroll",
  vendor: "vendor",
  ops: "ops",
  tax: "tax",
  treasury_transfer: "treasury_transfer",
  other: "other",
} as const;

const umbraOperationTypeMap = {
  registration: "registration",
  deposit: "deposit",
  withdraw: "withdraw",
  utxo_create: "utxo_create",
  utxo_claim: "utxo_claim",
  compliance_grant: "compliance_grant",
  compliance_revoke: "compliance_revoke",
  mock: "mock",
} as const;

const disclosureReasonMap = {
  audit: "audit",
  tax: "tax",
  grant_review: "grant_review",
  community_review: "community_review",
  internal_review: "internal_review",
  other: "other",
} as const;

const disclosureScopeMap = {
  single_transaction: "single_transaction",
  category: "category",
  date_range: "date_range",
  full_report: "full_report",
} as const;

const disclosureStatusMap = {
  approved: "approved",
  rejected: "rejected",
} as const;

const disclosureMethodMap = {
  viewing_key: "viewing_key",
  x25519_grant: "x25519_grant",
  mock: "mock",
} as const;

export function mapBaseToken(value: string) {
  return mapEnum(baseTokenMap, value, "Unsupported base token");
}

export function mapTransactionType(value: string) {
  return mapEnum(transactionTypeMap, value, "Unsupported transaction type");
}

export function mapTransactionCategory(value: string) {
  return mapEnum(transactionCategoryMap, value, "Unsupported transaction category");
}

export function mapUmbraOperationType(value: string) {
  return mapEnum(umbraOperationTypeMap, value, "Unsupported Umbra operation type");
}

export function mapDisclosureReason(value: string) {
  return mapEnum(disclosureReasonMap, value, "Unsupported disclosure reason");
}

export function mapDisclosureScope(value: string) {
  return mapEnum(disclosureScopeMap, value, "Unsupported disclosure scope");
}

export function mapDisclosureStatus(value: string) {
  return mapEnum(disclosureStatusMap, value, "Unsupported disclosure status");
}

export function mapDisclosureMethod(value: string) {
  return mapEnum(disclosureMethodMap, value, "Unsupported disclosure method");
}

function mapEnum<T extends Record<string, string>>(map: T, value: string, message: string): T[keyof T] {
  const mapped = map[value as keyof T];

  if (!mapped) {
    throw badRequest(message);
  }

  return mapped;
}
