import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { daos, disclosureRequests } from "../db/schema.js";

export type CreateDisclosureRequestInput = {
  daoId: string;
  requesterName: string;
  requesterOrganization?: string | undefined;
  requesterContact?: string | undefined;
  reason: "audit" | "tax" | "grant_review" | "community_review" | "internal_review" | "other";
  message?: string | undefined;
  requestedScope: "single_transaction" | "category" | "date_range" | "full_report";
  transactionId?: string | undefined;
  category?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
};

export async function createDisclosureRequest(input: CreateDisclosureRequestInput) {
  const now = new Date();
  const [request] = await db
    .insert(disclosureRequests)
    .values({
      id: randomUUID(),
      daoId: input.daoId,
      requesterName: input.requesterName,
      reason: input.reason,
      requestedScope: input.requestedScope,
      createdAt: now,
      updatedAt: now,
      ...(input.requesterOrganization ? { requesterOrganization: input.requesterOrganization } : {}),
      ...(input.requesterContact ? { requesterContact: input.requesterContact } : {}),
      ...(input.message ? { message: input.message } : {}),
      ...(input.transactionId ? { transactionId: input.transactionId } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.startDate ? { startDate: input.startDate } : {}),
      ...(input.endDate ? { endDate: input.endDate } : {}),
    })
    .returning();

  if (!request) {
    throw new Error("Failed to create disclosure request");
  }

  return request;
}

export async function findDisclosureRequestById(id: string) {
  const [row] = await db
    .select({ request: disclosureRequests, dao: daos })
    .from(disclosureRequests)
    .innerJoin(daos, eq(disclosureRequests.daoId, daos.id))
    .where(eq(disclosureRequests.id, id))
    .limit(1);

  return row ? { ...row.request, dao: row.dao } : null;
}

export async function listDisclosureRequestsForDao(daoId: string) {
  return db
    .select()
    .from(disclosureRequests)
    .where(eq(disclosureRequests.daoId, daoId))
    .orderBy(desc(disclosureRequests.createdAt));
}

export async function reviewDisclosureRequest(input: {
  id: string;
  status: "approved" | "rejected";
  disclosureMethod?: "viewing_key" | "x25519_grant" | "mock" | undefined;
  reviewedById: string;
}) {
  const [request] = await db
    .update(disclosureRequests)
    .set({
      status: input.status,
      reviewedById: input.reviewedById,
      reviewedAt: new Date(),
      updatedAt: new Date(),
      ...(input.disclosureMethod ? { disclosureMethod: input.disclosureMethod } : {}),
    })
    .where(eq(disclosureRequests.id, input.id))
    .returning();

  if (!request) {
    throw new Error("Failed to review disclosure request");
  }

  return request;
}

export async function fulfillDisclosureRequest(input: {
  id: string;
  fulfilledReportId: string;
}) {
  const [request] = await db
    .update(disclosureRequests)
    .set({
      status: "fulfilled",
      fulfilledReportId: input.fulfilledReportId,
      updatedAt: new Date(),
    })
    .where(eq(disclosureRequests.id, input.id))
    .returning();

  if (!request) {
    throw new Error("Failed to fulfill disclosure request");
  }

  return request;
}
