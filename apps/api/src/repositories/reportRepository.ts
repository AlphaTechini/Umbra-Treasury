import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { daos, disclosureRequests, reports } from "../db/schema.js";

export type CreateReportInput = {
  daoId: string;
  disclosureRequestId?: string | undefined;
  type: "public_summary" | "auditor_report" | "tax_estimate";
  source: "summary_only" | "umbra_compliance" | "mock";
  verificationStatus?: "unverified" | "verified" | "failed" | undefined;
  title: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  generatedById?: string | undefined;
  reportData: Record<string, unknown>;
};

export async function createReport(input: CreateReportInput) {
  const [report] = await db
    .insert(reports)
    .values({
      id: randomUUID(),
      daoId: input.daoId,
      type: input.type,
      source: input.source,
      verificationStatus: input.verificationStatus ?? "unverified",
      title: input.title,
      reportData: input.reportData,
      ...(input.disclosureRequestId ? { disclosureRequestId: input.disclosureRequestId } : {}),
      ...(input.startDate ? { startDate: input.startDate } : {}),
      ...(input.endDate ? { endDate: input.endDate } : {}),
      ...(input.generatedById ? { generatedById: input.generatedById } : {}),
    })
    .returning();

  if (!report) {
    throw new Error("Failed to create report");
  }

  return report;
}

export async function findReportById(id: string) {
  const [row] = await db
    .select({ report: reports, dao: daos, disclosureRequest: disclosureRequests })
    .from(reports)
    .innerJoin(daos, eq(reports.daoId, daos.id))
    .leftJoin(disclosureRequests, eq(reports.disclosureRequestId, disclosureRequests.id))
    .where(eq(reports.id, id))
    .limit(1);

  return row ? { ...row.report, dao: row.dao, disclosureRequest: row.disclosureRequest } : null;
}

export async function listReportsForDao(daoId: string) {
  return db.select().from(reports).where(eq(reports.daoId, daoId)).orderBy(desc(reports.generatedAt));
}
