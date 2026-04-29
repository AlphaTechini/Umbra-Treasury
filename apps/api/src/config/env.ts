import { z } from "zod";

const localDatabaseHosts = new Set(["localhost", "127.0.0.1", "::1"]);

const envSchema = z
  .object({
    DATABASE_URL: z.string().url(),
    API_PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
    CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
    UMBRA_MODE: z.enum(["mock", "real"]).default("mock"),
  })
  .superRefine((value, context) => {
    const databaseUrl = new URL(value.DATABASE_URL);

    if (!localDatabaseHosts.has(databaseUrl.hostname) && databaseUrl.searchParams.get("sslmode") !== "require") {
      context.addIssue({
        code: "custom",
        path: ["DATABASE_URL"],
        message: "DATABASE_URL must include sslmode=require for non-local Postgres connections",
      });
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}

export const env = loadEnv();
