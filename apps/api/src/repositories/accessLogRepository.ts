import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db, type DbExecutor } from "../db/client.js";
import { accessLogs, users } from "../db/schema.js";

export type CreateAccessLogInput = {
  daoId: string;
  actorId?: string | undefined;
  actorLabel?: string | undefined;
  action:
    | "dao_created"
    | "transaction_added"
    | "disclosure_requested"
    | "disclosure_approved"
    | "disclosure_rejected"
    | "compliance_grant_issued"
    | "compliance_grant_revoked"
    | "report_generated"
    | "mock_disclosure_generated";
  targetType: "dao" | "transaction" | "disclosure_request" | "report" | "umbra_operation";
  targetId: string;
  metadata?: Record<string, unknown> | undefined;
};

export async function createAccessLog(input: CreateAccessLogInput, executor: DbExecutor = db) {
  const [accessLog] = await executor
    .insert(accessLogs)
    .values({
      id: randomUUID(),
      daoId: input.daoId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      ...(input.actorId ? { actorId: input.actorId } : {}),
      ...(input.actorLabel ? { actorLabel: input.actorLabel } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
    })
    .returning();

  if (!accessLog) {
    throw new Error("Failed to create access log");
  }

  return accessLog;
}

export async function listAccessLogsForDao(daoId: string) {
  const rows = await db
    .select({ accessLog: accessLogs, actor: users })
    .from(accessLogs)
    .leftJoin(users, eq(accessLogs.actorId, users.id))
    .where(eq(accessLogs.daoId, daoId))
    .orderBy(desc(accessLogs.createdAt));

  return rows.map((row) => ({ ...row.accessLog, actor: row.actor }));
}
