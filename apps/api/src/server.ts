import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { disconnectDb } from "./db/client.js";

const app = await buildApp();

const shutdown = async (): Promise<void> => {
  await app.close();
  await disconnectDb();
};

process.on("SIGINT", () => {
  void shutdown().then(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().then(() => process.exit(0));
});

await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
