import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDaoAccessLogs } from "../services/accessLogService.js";
import { parseParams } from "../utils/validate.js";

const daoIdParamsSchema = z.object({
  daoId: z.string().min(1),
});

export async function registerAccessLogRoutes(app: FastifyInstance): Promise<void> {
  app.get("/daos/:daoId/access-logs", async (request) => {
    const params = parseParams(daoIdParamsSchema, request.params);
    const accessLogs = await getDaoAccessLogs(params.daoId);

    return { accessLogs };
  });
}
