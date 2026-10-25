import { defineConfig } from "drizzle-kit";

// DATABASE_URL manda; SUPABASE_DB_URL es el respaldo (ver shared/pg-ssl.ts).
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
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
