import { createAccessLog } from "../repositories/accessLogRepository.js";
import {
  createDisclosureRequest,
  findDisclosureRequestById,
  listDisclosureRequestsForDao,
  reviewDisclosureRequest,
} from "../repositories/disclosureRequestRepository.js";
import { upsertUser } from "../repositories/userRepository.js";
import { badRequest, forbidden, notFound } from "../utils/apiError.js";
import { requireDaoById } from "./daoService.js";
import { mapDisclosureMethod, mapDisclosureReason, mapDisclosureScope, mapDisclosureStatus } from "./enumMappers.js";

export type CreateDisclosureRequestBody = {
  requesterName: string;
  requesterOrganization?: string | undefined;
  requesterContact?: string | undefined;
  reason: string;
  message?: string | undefined;
  requestedScope: string;
  transactionId?: string | undefined;
  category?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
};

export type ReviewDisclosureRequestBody = {
  reviewerWalletAddress: string;
  reviewerUsername?: string | undefined;
  status: string;
  disclosureMethod?: string | undefined;
};

export async function submitDisclosureRequest(daoId: string, input: CreateDisclosureRequestBody) {
  await requireDaoById(daoId);

  const request = await createDisclosureRequest({
    daoId,
    requesterName: input.requesterName,
    requesterOrganization: input.requesterOrganization,
    requesterContact: input.requesterContact,
    reason: mapDisclosureReason(input.reason),
    message: input.message,
    requestedScope: mapDisclosureScope(input.requestedScope),
    transactionId: input.transactionId,
    category: input.category,
    startDate: input.startDate ? new Date(input.startDate) : undefined,
    endDate: input.endDate ? new Date(input.endDate) : undefined,
  });

  await createAccessLog({
    daoId,
    actorLabel: input.requesterName,
    action: "disclosure_requested",
    targetType: "disclosure_request",
    targetId: request.id,
    metadata: {
      reason: input.reason,
      requestedScope: input.requestedScope,
    },
  });

  return request;
}

export async function getDaoDisclosureRequests(daoId: string) {
  await requireDaoById(daoId);
  return listDisclosureRequestsForDao(daoId);
}

export async function reviewDisclosure(daoId: string, requestId: string, input: ReviewDisclosureRequestBody) {
  const dao = await requireDaoById(daoId);
  const request = await findDisclosureRequestById(requestId);

  if (!request) {
    throw notFound("Disclosure request not found");
  }

  if (request.daoId !== daoId) {
    throw badRequest("Disclosure request does not belong to this DAO");
  }

  const reviewer = await upsertUser({
    walletAddress: input.reviewerWalletAddress,
    username: input.reviewerUsername,
  });

  if (reviewer.id !== dao.ownerId) {
    throw forbidden("Only the DAO owner can review disclosure requests");
  }

  const status = mapDisclosureStatus(input.status);
  const reviewed = await reviewDisclosureRequest({
    id: request.id,
    status,
    disclosureMethod: input.disclosureMethod ? mapDisclosureMethod(input.disclosureMethod) : undefined,
    reviewedById: reviewer.id,
  });

  await createAccessLog({
    daoId,
    actorId: reviewer.id,
    action: status === "approved" ? "disclosure_approved" : "disclosure_rejected",
    targetType: "disclosure_request",
    targetId: request.id,
    metadata: {
      disclosureMethod: input.disclosureMethod ?? null,
    },
  });

  return reviewed;
}

export async function requireDisclosureRequest(requestId: string) {
  const request = await findDisclosureRequestById(requestId);

  if (!request) {
    throw notFound("Disclosure request not found");
  }

  return request;
}
