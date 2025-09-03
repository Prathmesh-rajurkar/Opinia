import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const sql = neon(process.env.NEON_DB_URL);

export const db = drizzle(sql, {
  schema: schema,
});

export {sql};