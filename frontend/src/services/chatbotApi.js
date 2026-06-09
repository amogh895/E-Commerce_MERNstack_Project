import axios from "axios";
import { API_URL } from "../config";

/**
 * Send a message to the chatbot backend API.
 * @param {string} message - The message text from the user.
 * @returns {Promise<object>} The reply and suggestions from the backend.
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/api/chat`, { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    throw error;
  }
};
