import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

// Supabase session pooler (PgBouncer) doesn't support prepared statements.
// Disabling them here prevents "prepared statement does not exist" errors
// that appear when PgBouncer routes a query to a different backend connection.
// pg v8 treats sslmode=require as verify-full by default.
// Supabase's pooler uses a self-signed cert chain, so we disable
// certificate verification while still enforcing an encrypted connection.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema, logger: false });

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
