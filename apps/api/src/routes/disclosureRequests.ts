import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  getDaoDisclosureRequests,
  reviewDisclosure,
  submitDisclosureRequest,
} from "../services/disclosureService.js";
import { parseBody, parseParams } from "../utils/validate.js";

const daoIdParamsSchema = z.object({
  daoId: z.string().min(1),
});

const reviewParamsSchema = z.object({
  daoId: z.string().min(1),
  requestId: z.string().min(1),
});

const createDisclosureSchema = z.object({
  requesterName: z.string().min(1),
  requesterOrganization: z.string().min(1).optional(),
  requesterContact: z.string().min(1).optional(),
  reason: z.enum(["audit", "tax", "grant_review", "community_review", "internal_review", "other"]),
  message: z.string().min(1).optional(),
  requestedScope: z.enum(["single_transaction", "category", "date_range", "full_report"]),
  transactionId: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const reviewDisclosureSchema = z.object({
  reviewerWalletAddress: z.string().min(1),
  reviewerUsername: z.string().min(1).optional(),
  status: z.enum(["approved", "rejected"]),
  disclosureMethod: z.enum(["viewing_key", "x25519_grant", "mock"]).optional(),
});

export async function registerDisclosureRoutes(app: FastifyInstance): Promise<void> {
  app.post("/daos/:daoId/disclosure-requests", async (request, reply) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const body = parseBody(createDisclosureSchema, request.body);
    const disclosureRequest = await submitDisclosureRequest(params.daoId, body);

    return reply.status(201).send({ disclosureRequest });
  });

  app.get("/daos/:daoId/disclosure-requests", async (request) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const disclosureRequests = await getDaoDisclosureRequests(params.daoId);

    return { disclosureRequests };
  });

  app.patch("/daos/:daoId/disclosure-requests/:requestId/review", async (request) => {
    const params = parseParams(reviewParamsSchema, request.params);
    const body = parseBody(reviewDisclosureSchema, request.body);
    const disclosureRequest = await reviewDisclosure(params.daoId, params.requestId, body);

    return { disclosureRequest };
  });
}
