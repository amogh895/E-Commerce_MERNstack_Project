import express from "express";
import { auth } from "../middleware/auth.js";
import Query from "../models/Query.js";

const router = express.Router();

// Public: Submit query message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields (name, email, message) are required." });
    }
    const newQuery = await Query.create({ name, email, message });
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin-Only: Get all queries
router.get("/", auth, async (req, res) => {
  try {
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const queries = await Query.find({}).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
