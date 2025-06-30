import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import reminderRoutes from "./routes/reminders.js";

dotenv.config();

const app = express();

// Set up CORS to allow requests only from your frontend's URL
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: frontendURL }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);

// Connect to MongoDB without starting a listener, Vercel handles this
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully for Vercel deployment."))
  .catch((err) => console.error(err));

// Export the app for Vercel's serverless environment
export default app;