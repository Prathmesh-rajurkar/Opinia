import { Router } from "express";
import { db } from "../db/index.js";
import { ratings, stores } from "../db/schema.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";
import { eq, and } from "drizzle-orm";

const router = Router();

router.post(
  "/store/:storeId",
  authMiddleware,
  authorizeRoles("USER"),
  async (req, res) => {
    try {
      const { rating, review } = req.body;
      const { storeId } = req.params;

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }

      // check if user already rated this store
      const existing = await db
        .select()
        .from(ratings)
        .where(and(eq(ratings.userId, req.user.id), eq(ratings.storeId, storeId)));

      if (existing.length > 0) {
        // update rating
        const [updated] = await db
          .update(ratings)
          .set({ rating, review, updatedAt: new Date() })
          .where(and(eq(ratings.userId, req.user.id), eq(ratings.storeId, storeId)))
          .returning();

        return res.json({ message: "Rating updated", rating: updated });
      }

      // insert new rating
      const [newRating] = await db
        .insert(ratings)
        .values({
          userId: req.user.id,
          storeId,
          rating,
          review,
        })
        .returning();

      res.status(201).json({ message: "Rating submitted", rating: newRating });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit rating" });
    }
  }
);

/**
 * Get ratings for a store
 * Accessible by ADMIN and OWNER
 */
router.get(
  "/store/:storeId",
  authMiddleware,
  authorizeRoles("ADMIN", "OWNER"),
  async (req, res) => {
    try {
      const { storeId } = req.params;

      // If OWNER, make sure they only access their own store
      if (req.user.role === "OWNER") {
        const [store] = await db
          .select()
          .from(stores)
          .where(eq(stores.id, storeId));

        if (!store || store.ownerId !== req.user.id) {
          return res.status(403).json({ error: "Not your store" });
        }
      }

      const result = await db
        .select()
        .from(ratings)
        .where(eq(ratings.storeId, storeId));

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  }
);

router.get("/avg/:storeId", authMiddleware, async (req, res) => {
  try {
    const { storeId } = req.params;

    const result = await db
      .select({
        avg: sql`ROUND(AVG(${ratings.rating}), 2)`,
      })
      .from(ratings)
      .where(eq(ratings.storeId, storeId));

    res.json({ storeId, avg: result[0].avg || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
});

export default router;
