import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  generateMockDisclosureReport,
  generateUmbraComplianceReport,
  getDaoReports,
  getReport,
} from "../services/reportService.js";
import { parseBody, parseParams } from "../utils/validate.js";

const daoIdParamsSchema = z.object({
  daoId: z.string().min(1),
});

const reportIdParamsSchema = z.object({
  reportId: z.string().min(1),
});

const requestIdParamsSchema = z.object({
  requestId: z.string().min(1),
});

const generateMockReportSchema = z.object({
  generatedByWalletAddress: z.string().min(1),
  generatedByUsername: z.string().min(1).optional(),
});

const generateUmbraComplianceReportSchema = z.object({
  generatedByWalletAddress: z.string().min(1),
  generatedByUsername: z.string().min(1).optional(),
  providerReference: z.string().min(1),
  verificationStatus: z.enum(["verified", "unverified", "failed"]).optional(),
  grantTransactionSignature: z.string().min(1).optional(),
  grantAccountAddress: z.string().min(1).optional(),
  granterX25519PublicKey: z.string().min(1).optional(),
  receiverX25519PublicKey: z.string().min(1).optional(),
  nonce: z.string().min(1).optional(),
  operationRefs: z.record(z.string(), z.unknown()).default({}),
  notes: z.array(z.string().min(1)).optional(),
});

export async function registerReportRoutes(app: FastifyInstance): Promise<void> {
  app.post("/disclosure-requests/:requestId/mock-report", async (request, reply) => {
    const params = parseParams(requestIdParamsSchema, request.params);
    const body = parseBody(generateMockReportSchema, request.body);
    const report = await generateMockDisclosureReport(params.requestId, body);

    return reply.status(201).send({ report });
  });

  app.post("/disclosure-requests/:requestId/umbra-report", async (request, reply) => {
    const params = parseParams(requestIdParamsSchema, request.params);
    const body = parseBody(generateUmbraComplianceReportSchema, request.body);
    const report = await generateUmbraComplianceReport(params.requestId, body);

    return reply.status(201).send({ report });
  });

  app.get("/daos/:daoId/reports", async (request) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const reports = await getDaoReports(params.daoId);

    return { reports };
  });

  app.get("/reports/:reportId", async (request) => {
    const params = parseParams(reportIdParamsSchema, request.params);
    const report = await getReport(params.reportId);

    return { report };
  });
}
