import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import storeRoutes from "./routes/store.js";
import rateRoutes from "./routes/rating.js";
import adminRoutes from "./routes/admin.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings",rateRoutes);
app.use("/api/admin", adminRoutes);
// Health check
app.get("/", (req, res) => {
  res.json({ message: "Opinia API running ✅" });
});

export default app;
