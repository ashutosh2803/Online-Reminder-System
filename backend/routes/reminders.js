import express from "express";
import { createReminder, getReminders, deleteReminder, updateReminder } from "../controllers/reminderController.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createReminder);
router.get("/", verifyToken, getReminders);
router.delete("/:id", verifyToken, deleteReminder);
router.put("/:id", verifyToken, updateReminder);

export default router;