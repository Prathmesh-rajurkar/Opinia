import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}

async function runMigration(){
    try {
        const sql=neon(process.env.NEON_DB_URL);
        const db = drizzle(sql);

        await migrate(db, { migrationsFolder: "./drizzle" });
        console.log("Database migration completed successfully.");
        
    } catch (error) {
        console.log("Error during migration:", error);
        process.exit(1);
    }
}

runMigration().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});