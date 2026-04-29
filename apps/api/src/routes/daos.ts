import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createDaoWorkspace, getDaoBySlug } from "../services/daoService.js";
import { getPublicSummary } from "../services/summaryService.js";
import { parseBody, parseParams } from "../utils/validate.js";

const createDaoSchema = z.object({
  ownerWalletAddress: z.string().min(1),
  ownerUsername: z.string().min(1).optional(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  treasuryAddress: z.string().min(1).optional(),
  baseToken: z.enum(["usdc", "usdt", "wsol", "umbra", "other"]),
  description: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
});

const slugParamsSchema = z.object({
  slug: z.string().min(1),
});

const daoIdParamsSchema = z.object({
  daoId: z.string().min(1),
});

const publicSummaryReportSchema = z.object({
  generatedByWalletAddress: z.string().min(1).optional(),
});

export async function registerDaoRoutes(app: FastifyInstance): Promise<void> {
  app.post("/daos", async (request, reply) => {
    const body = parseBody(createDaoSchema, request.body);
    const dao = await createDaoWorkspace(body);

    return reply.status(201).send({ dao });
  });

  app.get("/daos/slug/:slug", async (request) => {
    const params = parseParams(slugParamsSchema, request.params);
    const dao = await getDaoBySlug(params.slug);

    return { dao };
  });

  app.get("/daos/:daoId/summary", async (request) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const summary = await getPublicSummary(params.daoId);

    return { summary };
  });

  app.post("/daos/:daoId/summary-report", async (request, reply) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const body = parseBody(publicSummaryReportSchema, request.body ?? {});
    const { generatePublicSummaryReport } = await import("../services/reportService.js");
    const report = await generatePublicSummaryReport(params.daoId, body);

    return reply.status(201).send({ report });
  });
}
