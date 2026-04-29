import { createAccessLog } from "../repositories/accessLogRepository.js";
import { fulfillDisclosureRequest } from "../repositories/disclosureRequestRepository.js";
import { createReport, findReportById, listReportsForDao } from "../repositories/reportRepository.js";
import { listTransactionsForDao } from "../repositories/transactionRepository.js";
import { upsertUser } from "../repositories/userRepository.js";
import { runDbTransaction } from "../db/client.js";
import { createUmbraProvider } from "../providers/providerFactory.js";
import { badRequest, forbidden, notFound } from "../utils/apiError.js";
import { type WalletAuthorization, verifyWalletAuthorization } from "../utils/walletAuthorization.js";
import { getPublicSummary } from "./summaryService.js";
import { requireDisclosureRequest } from "./disclosureService.js";

export type GenerateUmbraComplianceReportInput = {
  generatedByWalletAddress: string;
  walletAuthorization: WalletAuthorization;
  generatedByUsername?: string | undefined;
  grantTransactionSignature?: string | undefined;
  grantAccountAddress?: string | undefined;
  nonce?: string | undefined;
  operationRefs: Record<string, unknown>;
  notes?: string[] | undefined;
};

export type GenerateMockDisclosureReportInput = {
  generatedByWalletAddress: string;
  walletAuthorization: WalletAuthorization;
  generatedByUsername?: string | undefined;
};

export async function generateMockDisclosureReport(
  requestId: string,
  input: GenerateMockDisclosureReportInput,
) {
  verifyWalletAuthorization(input.walletAuthorization, {
    action: "report:mock:create",
    walletAddress: input.generatedByWalletAddress,
    requestId,
  });

  const request = await requireDisclosureRequest(requestId);

  if (request.status !== "approved") {
    throw forbidden("Disclosure request must be approved before report generation");
  }

  const generator = await upsertUser({
    walletAddress: input.generatedByWalletAddress,
    username: input.generatedByUsername,
  });

  if (generator.id !== request.dao.ownerId) {
    throw forbidden("Only the DAO owner can generate disclosure reports");
  }

  const provider = createUmbraProvider();
  const grant = await provider.issueDisclosureGrant({
    daoId: request.daoId,
    disclosureRequestId: request.id,
    requesterName: request.requesterName,
    scope: request.requestedScope,
  });

  const scopedTransactions = await getScopedTransactionsForDisclosure(request);

  return runDbTransaction(async (tx) => {
    const report = await createReport(
      {
        daoId: request.daoId,
        disclosureRequestId: request.id,
        type: request.reason === "tax" ? "tax_estimate" : "auditor_report",
        source: "mock",
        verificationStatus: "unverified",
        title: `${request.requesterName} disclosure report`,
        startDate: request.startDate ?? undefined,
        endDate: request.endDate ?? undefined,
        generatedById: generator.id,
        reportData: {
          source: grant.source,
          verificationStatus: grant.verificationStatus,
          providerReference: grant.providerReference,
          notes: grant.notes,
          requestedScope: request.requestedScope,
          transactionCount: scopedTransactions.length,
          transactions: scopedTransactions.map((transaction: (typeof scopedTransactions)[number]) => ({
            id: transaction.id,
            type: transaction.type,
            category: transaction.category,
            token: transaction.token,
            amountHint: transaction.amountHint,
            date: transaction.date.toISOString(),
            publicCounterpartyLabel: transaction.publicCounterpartyLabel,
            publicMemo: transaction.publicMemo,
            umbraOperationType: transaction.umbraOperationType,
            privacyStatus: transaction.privacyStatus,
          })),
        },
      },
      tx,
    );

    await fulfillDisclosureRequest(
      {
        id: request.id,
        fulfilledReportId: report.id,
      },
      tx,
    );

    await createAccessLog(
      {
        daoId: request.daoId,
        actorId: generator.id,
        action: "mock_disclosure_generated",
        targetType: "report",
        targetId: report.id,
        metadata: {
          disclosureRequestId: request.id,
          providerReference: grant.providerReference,
        },
      },
      tx,
    );

    return report;
  });
}

export async function generateUmbraComplianceReport(
  requestId: string,
  input: GenerateUmbraComplianceReportInput,
) {
  verifyWalletAuthorization(input.walletAuthorization, {
    action: "report:umbra:create",
    walletAddress: input.generatedByWalletAddress,
    requestId,
  });

  const request = await requireDisclosureRequest(requestId);

  if (request.status !== "approved") {
    throw forbidden("Disclosure request must be approved before report generation");
  }

  if (request.disclosureMethod && request.disclosureMethod !== "x25519_grant") {
    throw forbidden("Disclosure request was not approved for an Umbra X25519 compliance grant");
  }

  const generator = await upsertUser({
    walletAddress: input.generatedByWalletAddress,
    username: input.generatedByUsername,
  });

  if (generator.id !== request.dao.ownerId) {
    throw forbidden("Only the DAO owner can generate disclosure reports");
  }

  const scopedTransactions = await getScopedTransactionsForDisclosure(request);
  const verificationStatus = "unverified";
  const providerReference = getUmbraProviderReference(input);

  return runDbTransaction(async (tx) => {
    await createAccessLog(
      {
        daoId: request.daoId,
        actorId: generator.id,
        action: "compliance_grant_issued",
        targetType: "umbra_operation",
        targetId: providerReference,
        metadata: {
          disclosureRequestId: request.id,
          grantTransactionSignature: input.grantTransactionSignature ?? null,
          grantAccountAddress: input.grantAccountAddress ?? null,
          operationRefs: input.operationRefs,
        },
      },
      tx,
    );

    const report = await createReport(
      {
        daoId: request.daoId,
        disclosureRequestId: request.id,
        type: request.reason === "tax" ? "tax_estimate" : "auditor_report",
        source: "umbra_compliance",
        verificationStatus,
        title: `${request.requesterName} Umbra compliance report`,
        startDate: request.startDate ?? undefined,
        endDate: request.endDate ?? undefined,
        generatedById: generator.id,
        reportData: {
          source: "umbra_compliance",
          verificationStatus,
          providerReference,
          grantTransactionSignature: input.grantTransactionSignature ?? null,
          grantAccountAddress: input.grantAccountAddress ?? null,
          nonce: input.nonce ?? null,
          operationRefs: input.operationRefs,
          notes: input.notes ?? [],
          requestedScope: request.requestedScope,
          transactionCount: scopedTransactions.length,
          transactions: scopedTransactions.map((transaction: (typeof scopedTransactions)[number]) => ({
            id: transaction.id,
            type: transaction.type,
            category: transaction.category,
            token: transaction.token,
            amountHint: transaction.amountHint,
            date: transaction.date.toISOString(),
            publicCounterpartyLabel: transaction.publicCounterpartyLabel,
            publicMemo: transaction.publicMemo,
            umbraOperationType: transaction.umbraOperationType,
            privacyStatus: transaction.privacyStatus,
          })),
        },
      },
      tx,
    );

    await fulfillDisclosureRequest(
      {
        id: request.id,
        fulfilledReportId: report.id,
      },
      tx,
    );

    await createAccessLog(
      {
        daoId: request.daoId,
        actorId: generator.id,
        action: "report_generated",
        targetType: "report",
        targetId: report.id,
        metadata: {
          disclosureRequestId: request.id,
          source: "umbra_compliance",
          providerReference,
          verificationStatus,
        },
      },
      tx,
    );

    return report;
  });
}

function getUmbraProviderReference(input: GenerateUmbraComplianceReportInput): string {
  if (input.grantAccountAddress) {
    return `umbra-compliance-grant:${input.grantAccountAddress}`;
  }

  if (input.grantTransactionSignature) {
    return `umbra-compliance-tx:${input.grantTransactionSignature}`;
  }

  throw badRequest("grantTransactionSignature or grantAccountAddress is required");
}

export async function generatePublicSummaryReport(
  daoId: string,
  input: { generatedByWalletAddress?: string | undefined },
) {
  const summary = await getPublicSummary(daoId);
  const generator = input.generatedByWalletAddress
    ? await upsertUser({ walletAddress: input.generatedByWalletAddress })
    : null;

  const report = await createReport({
    daoId,
    type: "public_summary",
    source: "summary_only",
    verificationStatus: "unverified",
    title: `${summary.dao.name} public summary`,
    generatedById: generator?.id,
    reportData: summary,
  });

  await createAccessLog({
    daoId,
    actorId: generator?.id,
    action: "report_generated",
    targetType: "report",
    targetId: report.id,
    metadata: { source: "summary_only" },
  });

  return report;
}

export async function getReport(reportId: string) {
  const report = await findReportById(reportId);

  if (!report) {
    throw notFound("Report not found");
  }

  return report;
}

export async function getDaoReports(daoId: string) {
  if (!daoId) {
    throw badRequest("DAO id is required");
  }

  return listReportsForDao(daoId);
}

type DisclosureRequestWithDao = Awaited<ReturnType<typeof requireDisclosureRequest>>;

async function getScopedTransactionsForDisclosure(request: DisclosureRequestWithDao) {
  const transactions = await listTransactionsForDao(request.daoId);

  return transactions.filter((transaction: (typeof transactions)[number]) => {
    if (request.requestedScope === "single_transaction") {
      return transaction.id === request.transactionId;
    }

    if (request.requestedScope === "category") {
      return transaction.category.toLowerCase() === request.category?.toLowerCase();
    }

    if (request.requestedScope === "date_range") {
      const afterStart = request.startDate ? transaction.date >= request.startDate : true;
      const beforeEnd = request.endDate ? transaction.date <= request.endDate : true;
      return afterStart && beforeEnd;
    }

    return true;
  });
}
