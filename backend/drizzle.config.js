import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// dotenv.config({path: '.env'});

if (!process.env.NEON_DB_URL) {
    throw new Error("NEON_DB_URL is not defined in the environment variables.");
}

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.NEON_DB_URL,
    },
    migrations: {
        table: "__drizzle_migrations",
        schema: "public",
    },
    verbose: true,
    strict: true,
});