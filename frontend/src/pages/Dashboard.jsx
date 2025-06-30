import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", time: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/reminders", { headers: { Authorization: token } }).then(res => {
      setReminders(res.data);
    });
  }, []);

  const createReminder = async () => {
    await axios.post("/api/reminders", form, {
      headers: { Authorization: token },
    });
    alert("Reminder created and email scheduled!");
  };

  return (
    <div>
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="datetime-local" onChange={(e) => setForm({ ...form, time: e.target.value })} />
      <button onClick={createReminder}>Create</button>
      <ul>
        {reminders.map((r) => (
          <li key={r._id}>{r.title} - {new Date(r.time).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
