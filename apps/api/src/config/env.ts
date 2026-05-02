import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.string().url(),
    API_PORT: z.coerce.number().int().min(1).max(65_535).default(3007),
    CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
    UMBRA_MODE: z.enum(["mock", "real"]).default("mock"),
  });

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}

export const env = loadEnv();
