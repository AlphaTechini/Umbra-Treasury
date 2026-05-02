import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: "./apps/api/.env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./apps/api/src/db/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
