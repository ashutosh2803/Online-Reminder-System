import Reminder from "../models/Reminder.js";
import sendEmail from "../utils/sendEmail.js";

export const createReminder = async (req, res) => {
  try {
    const { title, description, time } = req.body;
    const reminder = await Reminder.create({
      title,
      description,
      time,
      userId: req.userId,
    });

    const delay = new Date(time).getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => sendEmail(req.userEmail, title, description), delay);
    }

    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
