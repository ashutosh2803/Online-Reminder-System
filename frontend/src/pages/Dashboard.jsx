import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function Dashboard() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", time: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDateInvalid, setIsDateInvalid] = useState(false);
  const token = localStorage.getItem("token");

  const fetchReminders = useCallback(async () => {
    try {
      const res = await axios.get("/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data);
    } catch {
      setError("Could not fetch reminders.");
    }
  }, [token]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const createReminder = async () => {
    // Frontend validation
    const newFieldErrors = {};
    if (!form.title) newFieldErrors.title = true;
    if (!form.description) newFieldErrors.description = true;
    if (!form.time) newFieldErrors.time = true;

    if (Object.keys(newFieldErrors).length > 0) {
      setError("Please fill out all required fields.");
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      setError("");
      setIsDateInvalid(false);
      setFieldErrors({});
      await axios.post("/api/reminders", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReminders();
      setForm({ title: "", description: "", time: "" }); // Reset form
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Could not create reminder.";
      setError(errorMsg);
      if (errorMsg.includes("future")) {
        setIsDateInvalid(true);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: false });
    }
    if (name === 'time') {
      setIsDateInvalid(false);
    }
  };

  return (
    <div>
      <h2>Set Reminder</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        style={fieldErrors.title ? { border: '2px solid red', borderRadius: '5px' } : {}}
        onChange={handleInputChange}
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        style={fieldErrors.description ? { border: '2px solid red', borderRadius: '5px' } : {}}
        onChange={handleInputChange}
      />
      <input
        name="time"
        type="datetime-local"
        value={form.time}
        style={isDateInvalid || fieldErrors.time ? { border: '2px solid red', borderRadius: '5px' } : {}}
        onChange={handleInputChange}
      />
      <button onClick={createReminder}>Create</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {reminders.map((r) => (
          <li key={r._id}>
            {r.title} - {new Date(r.time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
