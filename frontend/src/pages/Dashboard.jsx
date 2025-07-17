import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function Dashboard() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", time: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDateInvalid, setIsDateInvalid] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", time: "" });
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReminders();
    } catch {
      setError("Could not delete reminder.");
    }
  };

  const handleEditClick = (reminder) => {
    setEditId(reminder._id);
    setEditForm({
      title: reminder.title,
      description: reminder.description,
      time: new Date(reminder.time).toISOString().slice(0, 16),
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`/api/reminders/${id}`,
        { ...editForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      fetchReminders();
    } catch {
      setError("Could not update reminder.");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
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
      <ul className="reminders-list">
        {reminders.map((r) => {
          const isExpired = new Date(r.time) < Date.now();
          return (
            <li
              key={r._id}
              className={`reminder-card${isExpired ? ' expired' : ''}`}
            >
              {editId === r._id ? (
                <>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditInputChange}
                    style={{ marginRight: 4 }}
                  />
                  <input
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    style={{ marginRight: 4 }}
                  />
                  <input
                    name="time"
                    type="datetime-local"
                    value={editForm.time}
                    onChange={handleEditInputChange}
                    style={{ marginRight: 4 }}
                  />
                  <button onClick={() => handleEditSave(r._id)}>Save</button>
                  <button onClick={handleEditCancel} style={{ marginLeft: 4 }}>Cancel</button>
                </>
              ) : (
                <>
                  {r.title} - {new Date(r.time).toLocaleString()} <br />
                  {r.description}
                  <button onClick={() => handleEditClick(r)} style={{ marginLeft: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(r._id)} style={{ marginLeft: 4 }}>Delete</button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
