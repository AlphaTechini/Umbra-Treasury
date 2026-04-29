import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DbExecutor = Pick<typeof db, "insert" | "select" | "update">;

export async function runDbTransaction<T>(callback: (tx: DbExecutor) => Promise<T>): Promise<T> {
  return db.transaction((tx) => callback(tx));
}

export async function checkDbReady(): Promise<void> {
  await pool.query("select 1");
}

export async function disconnectDb(): Promise<void> {
  await pool.end();
}
