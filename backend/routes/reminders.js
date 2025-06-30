import express from "express";
import { createReminder, getReminders } from "../controllers/reminderController.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createReminder);
router.get("/", verifyToken, getReminders);

export default router;