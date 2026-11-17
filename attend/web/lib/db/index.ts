import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Dùng connection pooling (port 6543) cho Vercel serverless
// Mỗi function invocation tạo connection mới → transaction_mode=false
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,  // Supabase pooler (pgBouncer) không hỗ trợ prepared statements
});

export const db = drizzle(client, { schema });

export * from "./schema";
