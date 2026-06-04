import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Role-based validation
    if (role === "WarehouseAdmin") {
      const secretCode = process.env.ADMIN_CODE || "admin123";
      if (adminCode !== secretCode) {
        return res.status(400).json({ message: "Invalid Warehouse Admin Code" });
      }
    }

    const user = await User.create({
      name,
      email,
      password, // Plain text for simplicity/demo compatibility on windows
      role: role || "Customer"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(400).json({ message: `Access denied. You are registered as a ${user.role}.` });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    if (req.userRole !== "WarehouseAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const customers = await User.find({ role: "Customer" }).select("-password");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};