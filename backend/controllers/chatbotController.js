import { classifyMessage } from "../services/nlpService.js";
import { getResponseForIntent } from "../services/responseService.js";

/**
 * Handle incoming user chat messages.
 * Detect intent using NLP.js and retrieve the appropriate support answer from MongoDB.
 */
export const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        error: "Validation Error",
        message: "Message is required and must be a non-empty string."
      });
    }

    // 1. Detect intent and confidence score
    const intentAnalysis = await classifyMessage(message);

    // 2. Fetch response from database mapping
    const result = await getResponseForIntent(intentAnalysis);

    // 3. Return the response
    return res.status(200).json({
      reply: result.reply,
      intent: result.intent,
      confidence: result.confidence,
      suggestions: result.suggestions || []
    });
  } catch (error) {
    console.error("Error in chatbot controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your message. Please try again later."
    });
  }
};
