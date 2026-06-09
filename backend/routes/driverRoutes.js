import express from "express";
import { auth } from "../middleware/auth.js";
import Driver from "../models/Driver.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    const { name, phone, status } = req.body;

    const newDriver = await Driver.create({
      name,
      phone,
      status: status || "Available",
    });

    res.status(201).json(newDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    const { name, phone, status } = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDriver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.json(updatedDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    const deletedDriver = await Driver.findByIdAndDelete(
      req.params.id
    );

    if (!deletedDriver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.json({
      message: "Driver removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

 export default router;