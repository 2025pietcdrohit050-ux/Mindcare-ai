import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function Reminders() {
  const { t } = useLanguage();

  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Daily Mind Training",
      time: "09:00 AM",
      type: "Cognitive Exercise",
      active: true,
    },
    {
      id: 2,
      title: "Memory Review",
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
    const typeKeys = {
      "Cognitive Exercise": "cognitiveExercise",
      Memory: "memoryReminder",
      "Daily Routine": "dailyRoutine",
      "Medication Reminder": "medicationReminder",
      Personal: "personalReminder",
    };

    return t(typeKeys[typeName]);
  }

  return (
    <div className="page">

      <div className="reminder-header">

        <div>
          <p className="small-title">
            {t("smartReminders")}
          </p>

          <h1>
            {t("stayOnTrack")}
          </h1>

          <p className="description">
            {t("reminderDescription")}
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? t("close")
            : t("addReminder")}
        </button>

      </div>

      {showForm && (
        <form
          className="reminder-form"
          onSubmit={addReminder}
        >

          <h2>
            {t("createReminder")}
          </h2>

          <div className="reminder-form-grid">

            <div>
              <label>
                {t("reminderTitle")}
              </label>

              <input
                type="text"
                placeholder={t("reminderTitlePlaceholder")}
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div>
              <label>
                {t("time")}
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
              {t("reminderType")}
            </label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="Cognitive Exercise">
                {t("cognitiveExercise")}
              </option>

              <option value="Memory">
                {t("memoryReminder")}
              </option>

              <option value="Daily Routine">
                {t("dailyRoutine")}
              </option>

              <option value="Medication Reminder">
                {t("medicationReminder")}
              </option>

              <option value="Personal">
                {t("personalReminder")}
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            {t("saveReminder")}
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
                    ? t("disableReminder")
                    : t("enableReminder")
                }
              >
                <span></span>
              </button>

              <button
                className="delete-reminder"
                onClick={() =>
                  deleteReminder(reminder.id)
                }
                aria-label={t("deleteReminder")}
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