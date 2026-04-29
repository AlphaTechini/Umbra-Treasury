import type { FastifyInstance } from "fastify";
import { checkDbReady } from "../db/client.js";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({
    status: "ok",
  }));

  app.get("/ready", async (request, reply) => {
    try {
      await checkDbReady();
      return { status: "ready" };
    } catch (error) {
      request.log.error(error);
      return reply.status(503).send({ status: "not_ready" });
    }
  });
}
