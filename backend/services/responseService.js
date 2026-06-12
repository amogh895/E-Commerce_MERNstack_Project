import SupportIntent from "../models/SupportIntent.js";

const CONFIDENCE_THRESHOLD = 0.5;

export const getResponseForIntent = async (intentAnalysis) => {
  const { intent, score } = intentAnalysis;

  // If intent is low confidence or not detected, return fallback
  if (!intent || score < CONFIDENCE_THRESHOLD) {
    return {
      reply: "i cannot understand your question",
      intent: "fallback",
      confidence: score,
      suggestions: [
        "Refund status",
        "Payment issue",
        "Login issue",
        "Contact support"
      ]
    };
  }

  try {
    const supportDoc = await SupportIntent.findOne({ intent });
    if (supportDoc) {
      return {
        reply: supportDoc.response,
        intent: intent,
        confidence: score,
        category: supportDoc.category
      };
    }

    // Default if intent is trained but answer is missing in database
    return {
      reply: `I detected your intent as '${intent}', but I don't have a response configured for this in my database. Please contact support.`,
      intent: intent,
      confidence: score,
      suggestions: ["Contact support"]
    };
  } catch (error) {
    console.error("Error retrieving intent response:", error);
    throw error;
  }
};
