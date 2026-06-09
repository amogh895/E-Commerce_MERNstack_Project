import mongoose from "mongoose";
import dotenv from "dotenv";
import SupportIntent from "../models/SupportIntent.js";

dotenv.config();

const initialIntents = [
  {
    intent: "refund",
    response: "To request a refund, please send your order ID to our support desk. Refunds are processed back to the original payment method within 5-7 business days.",
    category: "Refunds"
  },
  {
    intent: "payment_issue",
    response: "If your payment was declined, please verify your billing details. In case money was deducted but order was not placed, it will be automatically refunded within 24 hours.",
    category: "Payments"
  },
  {
    intent: "login_issue",
    response: "If you cannot login, click the 'Forgot Password' link on the login page to reset it. If your account is locked, please contact support to verify your details.",
    category: "Authentication"
  },
  {
    intent: "technical_problem",
    response: "We are sorry you are facing technical issues. Try clearing your browser cache and cookies, or try using an incognito window. If the issue persists, contact us with details/screenshots.",
    category: "Technical Support"
  },
  {
    intent: "contact_support",
    response: "You can reach our customer support team via email at support@electronify.com or call us at 1-800-555-0199 between 9 AM and 6 PM EST.",
    category: "Contact"
  },
  {
    intent: "pricing",
    response: "All product prices shown are inclusive of GST. Shipping costs are calculated at checkout based on your delivery address.",
    category: "Pricing"
  },
  {
    intent: "service_information",
    response: "Electronify is a leading MERN-stack e-commerce marketplace specializing in premium electronic devices like laptops, audio devices, mobiles, and accessories.",
    category: "General Info"
  },
  {
    intent: "account_issue",
    response: "You can update your personal information, delivery addresses, and view order history from your Account Settings after logging in.",
    category: "Account Management"
  }
];

const seedIntents = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://admin:admin123@cluster0.1b0zm6r.mongodb.net/ecommerce";
    console.log("Connecting to database for seeding...");
    await mongoose.connect(mongoUri);

    console.log("Connected. Clearing old support intents...");
    await SupportIntent.deleteMany({});

    console.log("Seeding support intents...");
    await SupportIntent.insertMany(initialIntents);
    console.log("Seeding complete. Support intents added successfully.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding support data:", error);
    process.exit(1);
  }
};

seedIntents();
