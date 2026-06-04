import express from "express";
import { auth } from "../middleware/auth.js";
import Driver from "../models/Driver.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Allow admin to add/modify drivers directly as well
router.post("/", auth, async (req, res) => {
  try {
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const { name, phone, status } = req.body;
    const newDriver = await Driver.create({ name, phone, status });
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
