import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function Reminders() {
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: isHindi ? "दैनिक मानसिक प्रशिक्षण" : "Daily Mind Training",
      time: "09:00 AM",
      type: "Cognitive Exercise",
      active: true,
    },
    {
      id: 2,
      title: isHindi ? "मेमोरी समीक्षा" : "Memory Review",
      time: "06:00 PM",
      type: "Memory",
      active: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Cognitive Exercise");

  function addReminder(event) {
    event.preventDefault();

    if (!title.trim() || !time) {
      return;
    }

    const newReminder = {
      id: Date.now(),
      title: title.trim(),
      time,
      type,
      active: true,
    };

    setReminders((prev) => [
      ...prev,
      newReminder,
    ]);

    setTitle("");
    setTime("");
    setType("Cognitive Exercise");
    setShowForm(false);
  }

  function toggleReminder(id) {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              active: !reminder.active,
            }
          : reminder
      )
    );
  }

  function deleteReminder(id) {
    setReminders((prev) =>
      prev.filter(
        (reminder) => reminder.id !== id
      )
    );
  }

  function getReminderType(typeName) {
    const names = {
      "Cognitive Exercise": isHindi
        ? "संज्ञानात्मक व्यायाम"
        : "Cognitive Exercise",

      Memory: isHindi
        ? "मेमोरी"
        : "Memory",

      "Daily Routine": isHindi
        ? "दैनिक दिनचर्या"
        : "Daily Routine",

      "Medication Reminder": isHindi
        ? "दवा रिमाइंडर"
        : "Medication Reminder",

      Personal: isHindi
        ? "व्यक्तिगत"
        : "Personal",
    };

    return names[typeName] || typeName;
  }

  const text = {
    title: isHindi ? "स्मार्ट रिमाइंडर" : "SMART REMINDERS",

    heading: isHindi
      ? "अपनी दिनचर्या के साथ जुड़े रहें।"
      : "Stay on track with your routine.",

    description: isHindi
      ? "अपने मानसिक प्रशिक्षण, मेमोरी और दैनिक गतिविधियों के लिए महत्वपूर्ण रिमाइंडर सेट करें।"
      : "Set important reminders for your mental training, memory and daily activities.",

    add: isHindi ? "रिमाइंडर जोड़ें" : "Add Reminder",

    close: isHindi ? "बंद करें" : "Close",

    create: isHindi
      ? "नया रिमाइंडर बनाएँ"
      : "Create Reminder",

    reminderTitle: isHindi
      ? "रिमाइंडर का शीर्षक"
      : "Reminder Title",

    titlePlaceholder: isHindi
      ? "रिमाइंडर का नाम लिखें..."
      : "Enter reminder title...",

    time: isHindi ? "समय" : "Time",

    type: isHindi
      ? "रिमाइंडर का प्रकार"
      : "Reminder Type",

    save: isHindi
      ? "रिमाइंडर सेव करें"
      : "Save Reminder",

    disable: isHindi
      ? "रिमाइंडर बंद करें"
      : "Disable reminder",

    enable: isHindi
      ? "रिमाइंडर चालू करें"
      : "Enable reminder",

    delete: isHindi
      ? "रिमाइंडर हटाएँ"
      : "Delete reminder",
  };

  return (
    <div className="page">

      <div className="reminder-header">

        <div>
          <p className="small-title">
            {text.title}
          </p>

          <h1>
            {text.heading}
          </h1>

          <p className="description">
            {text.description}
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? text.close : text.add}
        </button>

      </div>

      {showForm && (
        <form
          className="reminder-form"
          onSubmit={addReminder}
        >

          <h2>
            {text.create}
          </h2>

          <div className="reminder-form-grid">

            <div>
              <label>
                {text.reminderTitle}
              </label>

              <input
                type="text"
                placeholder={text.titlePlaceholder}
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div>
              <label>
                {text.time}
              </label>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
              />
            </div>

          </div>

          <div>
            <label>
              {text.type}
            </label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="Cognitive Exercise">
                {getReminderType("Cognitive Exercise")}
              </option>

              <option value="Memory">
                {getReminderType("Memory")}
              </option>

              <option value="Daily Routine">
                {getReminderType("Daily Routine")}
              </option>

              <option value="Medication Reminder">
                {getReminderType("Medication Reminder")}
              </option>

              <option value="Personal">
                {getReminderType("Personal")}
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            {text.save}
          </button>

        </form>
      )}

      <div className="reminder-list">

        {reminders.map((reminder) => (

          <div
            className={
              reminder.active
                ? "reminder-card"
                : "reminder-card disabled"
            }
            key={reminder.id}
          >

            <div className="reminder-icon">
              ⏰
            </div>

            <div className="reminder-info">

              <span className="reminder-type">
                {getReminderType(reminder.type)}
              </span>

              <h3>
                {reminder.title}
              </h3>

              <strong>
                {reminder.time}
              </strong>

            </div>

            <div className="reminder-actions">

              <button
                className={
                  reminder.active
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  toggleReminder(reminder.id)
                }
                aria-label={
                  reminder.active
                    ? text.disable
                    : text.enable
                }
                title={
                  reminder.active
                    ? text.disable
                    : text.enable
                }
              >
                <span></span>
              </button>

              <button
                className="delete-reminder"
                onClick={() =>
                  deleteReminder(reminder.id)
                }
                aria-label={text.delete}
                title={text.delete}
              >
                ×
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Reminders;
