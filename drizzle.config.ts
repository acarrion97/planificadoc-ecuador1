import { defineConfig } from "drizzle-kit";

// SUPABASE_DB_URL tiene prioridad; DATABASE_URL es el respaldo (ver shared/pg-ssl.ts).
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
