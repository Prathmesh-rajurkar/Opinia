import { Router } from "express";
import { db } from "../db/index.js";
import { users, stores, ratings } from "../db/schema.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";
import { like, eq } from "drizzle-orm";

const router = Router();

/**
 * DASHBOARD STATS
 * Total users, stores, ratings
 * ADMIN only
 */
router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const totalUsers = (await db.select().from(users)).length;
      const totalStores = (await db.select().from(stores)).length;
      const totalRatings = (await db.select().from(ratings)).length;

      res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  }
);

/**
 * LIST STORES with filters
 * ADMIN only
 */
router.get(
  "/stores",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { name, email, address } = req.query;
      let query = db.select().from(stores);

      if (name) query = query.where(like(stores.name, `%${name}%`));
      if (email) query = query.where(like(stores.email, `%${email}%`));
      if (address) query = query.where(like(stores.address, `%${address}%`));

      const result = await query;
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  }
);

/**
 * LIST USERS with filters
 * ADMIN only
 */
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { name, email, address, role } = req.query;
      let query = db.select().from(users);

      if (name) query = query.where(like(users.name, `%${name}%`));
      if (email) query = query.where(like(users.email, `%${email}%`));
      if (address) query = query.where(like(users.address, `%${address}%`));
      if (role) query = query.where(eq(users.role, role.toUpperCase()));

      const result = await query;
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);

/**
 * VIEW USER DETAILS
 * ADMIN only
 */
router.get(
  "/users/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (!user) return res.status(404).json({ error: "User not found" });

      // if Store Owner → also fetch store ratings
      if (user.role === "OWNER") {
        const ownerStores = await db
          .select()
          .from(stores)
          .where(eq(stores.ownerId, user.id));

        return res.json({ ...user, ownerStores });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  }
);

export default router;
