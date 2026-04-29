import { listTransactionsForDao } from "../repositories/transactionRepository.js";
import { requireDaoById } from "./daoService.js";

type CategorySummary = {
  income: number;
  expenses: number;
  transfers: number;
  transactionCount: number;
};

export async function getPublicSummary(daoId: string) {
  const dao = await requireDaoById(daoId);
  const transactions = await listTransactionsForDao(daoId);

  const categoryBreakdown = new Map<string, CategorySummary>();
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalTransfers = 0;

  for (const transaction of transactions) {
    const amount = parseAmountHint(transaction.amountHint);
    const category = transaction.category;
    const current = categoryBreakdown.get(category) ?? {
      income: 0,
      expenses: 0,
      transfers: 0,
      transactionCount: 0,
    };

    current.transactionCount += 1;

    if (transaction.type === "income") {
      totalIncome += amount;
      current.income += amount;
    }

    if (transaction.type === "expense") {
      totalExpenses += amount;
      current.expenses += amount;
    }

    if (transaction.type === "transfer") {
      totalTransfers += amount;
      current.transfers += amount;
    }

    categoryBreakdown.set(category, current);
  }

  return {
    dao: {
      id: dao.id,
      name: dao.name,
      slug: dao.slug,
      baseToken: dao.baseToken,
      isPublic: dao.isPublic,
    },
    totals: {
      income: totalIncome,
      expenses: totalExpenses,
      transfers: totalTransfers,
      net: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    },
    categoryBreakdown: Object.fromEntries(categoryBreakdown),
    privacy: {
      source: "summary_only",
      verificationStatus: "unverified",
      note: "Summary uses public-safe transaction metadata and amount hints only.",
    },
  };
}

function parseAmountHint(value: string | null): number {
  if (!value) {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}
