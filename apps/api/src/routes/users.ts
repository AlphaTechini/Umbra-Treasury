import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getOrCreateUser, getUserByWalletAddress } from "../services/userService.js";
import { parseBody, parseParams } from "../utils/validate.js";

const createUserSchema = z.object({
  walletAddress: z.string().min(1),
  username: z.string().min(1).optional(),
});

const walletParamsSchema = z.object({
  walletAddress: z.string().min(1),
});

export async function registerUserRoutes(app: FastifyInstance): Promise<void> {
  app.post("/users", async (request, reply) => {
    const body = parseBody(createUserSchema, request.body);
    const user = await getOrCreateUser(body);

    return reply.status(201).send({ user });
  });

  app.get("/users/wallet/:walletAddress", async (request) => {
    const params = parseParams(walletParamsSchema, request.params);
    const user = await getUserByWalletAddress(params.walletAddress);

    return { user };
  });
}
