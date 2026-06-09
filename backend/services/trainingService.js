import { trainNLP } from "./nlpService.js";

export const trainModel = async () => {
  try {
    await trainNLP();
    return { success: true, message: "Model trained successfully." };
  } catch (error) {
    console.error("NLP training failed:", error);
    return { success: false, error: error.message };
  }
};
