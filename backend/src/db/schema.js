import { pgTable, uuid, varchar, text, timestamp, integer, pgEnum, unique } from "drizzle-orm/pg-core";

// user roles enum
export const userRole = pgEnum("role", ["ADMIN", "USER", "OWNER"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 60 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    address: varchar("address", { length: 400 }),
    role: userRole("role").default("USER").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stores = pgTable("stores", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 60 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    address: varchar("address", { length: 400 }).notNull(),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
    rating: integer("rating").notNull().check("rating_check", sql => sql`rating >= 1 AND rating <= 5`),
    review: text("review"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    userStoreUnique: unique().on(table.userId, table.storeId), // user can rate store only once
}));
