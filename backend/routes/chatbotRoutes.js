import express from "express";
import { handleChatMessage } from "../controllers/chatbotController.js";
import { trainModel } from "../services/trainingService.js";

const router = express.Router();

// Route for chat messaging
router.post("/", handleChatMessage);

// Route for triggering model retraining manually
router.post("/train", async (req, res) => {
  try {
    const result = await trainModel();
    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
