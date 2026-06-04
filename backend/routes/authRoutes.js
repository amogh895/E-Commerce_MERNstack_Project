
import express from "express";
import { loginUser, registerUser, getCustomers } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/customers", auth, getCustomers);

export default router;