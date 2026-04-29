import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { ApiError } from "./utils/apiError.js";
import { registerAccessLogRoutes } from "./routes/accessLogs.js";
import { registerDaoRoutes } from "./routes/daos.js";
import { registerDisclosureRoutes } from "./routes/disclosureRequests.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerReportRoutes } from "./routes/reports.js";
import { registerTransactionRoutes } from "./routes/transactions.js";
import { registerUserRoutes } from "./routes/users.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ApiError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({ error: "Invalid request payload" });
    }

    app.log.error(error);
    return reply.status(500).send({ error: "Internal server error" });
  });

  await registerHealthRoutes(app);
  await registerUserRoutes(app);
  await registerDaoRoutes(app);
  await registerTransactionRoutes(app);
  await registerDisclosureRoutes(app);
  await registerReportRoutes(app);
  await registerAccessLogRoutes(app);

  return app;
}
