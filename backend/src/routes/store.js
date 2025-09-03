import { Router } from "express";
import { db } from "../db/index.js";
import { stores } from "../db/schema.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * CREATE STORE
 * Allowed: ADMIN, OWNER
 */
router.post(
  "/create",
  authMiddleware,
  authorizeRoles("OWNER", "ADMIN"),
  async (req, res) => {
    try {
      const { name, email, address } = req.body;

      if (!name || !email || !address) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const [store] = await db
        .insert(stores)
        .values({
          name,
          email,
          address,
          ownerId: req.user.id, // logged-in OWNER/ADMIN as owner
        })
        .returning();

      res.status(201).json({ message: "Store created", store });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create store" });
    }
  }
);

/**
 * GET ALL STORES
 * Allowed: USER, OWNER, ADMIN
 */
router.get(
  "/",
  authMiddleware,
  authorizeRoles("USER", "OWNER", "ADMIN"),
  async (req, res) => {
    try {
      const result = await db.select().from(stores);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  }
);


router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "OWNER"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // If OWNER → check store ownership
      if (req.user.role === "OWNER") {
        const [store] = await db
          .select()
          .from(stores)
          .where(eq(stores.id, id));

        if (!store || store.ownerId !== req.user.id) {
          return res.status(403).json({ error: "Not your store" });
        }
      }

      const deleted = await db
        .delete(stores)
        .where(eq(stores.id, id))
        .returning();

      if (deleted.length === 0) {
        return res.status(404).json({ error: "Store not found" });
      }

      res.json({ message: "Store deleted", store: deleted[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete store" });
    }
  }
);

export default router;
