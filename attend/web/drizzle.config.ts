import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Chỉ manage public schema, không touch auth/storage của Supabase
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
