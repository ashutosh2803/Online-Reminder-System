import Reminder from "../models/Reminder.js";
import sendEmail from "../utils/sendEmail.js";

export const createReminder = async (req, res) => {
  try {
    const { title, description, time } = req.body;

    if (!title || !description || !time) {
      return res.status(400).json({ msg: "Please fill out all fields." });
    }

    if (new Date(time).getTime() <= Date.now()) {
      return res.status(400).json({ msg: "Reminder time must be in the future." });
    }

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

export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found." });
    }
    res.json({ msg: "Reminder deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { title, description, time } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (time !== undefined) update.time = time;
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      update,
      { new: true }
    );
    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found." });
    }
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
