import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import { initNLP } from "./services/nlpService.js";

dotenv.config();

const app = express();

// connect database
connectDB();

<<<<<<< HEAD
// Initialize NLP manager (training if necessary)
initNLP();

=======
>>>>>>> 776c22cd1ee3508fd2b20b1b3f0a726c018c929c
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://e-commerce-mer-nstack-project.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/chat", chatbotRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
