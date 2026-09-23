import { useState } from "react";
import { useLanguage } from "../LanguageContext";

const categories = [
  "People",
  "Places",
  "Events",
  "Notes",
  "Routines",
  "Favorite Things",
];

function Memory() {
  const { t } = useLanguage();

  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "Family",
      text: "Important people in my family.",
      category: "People",
    },
    {
      id: 2,
      title: "Favorite Place",
      text: "A place that is special to me.",
      category: "Places",
    },
    {
      id: 3,
      title: "Daily Routine",
      text: "Morning study and evening walk.",
      category: "Routines",
    },
  ]);

  const [activeCategory, setActiveCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("People");

  function addMemory(event) {
    event.preventDefault();

    if (!title.trim() || !text.trim()) {
      return;
    }

    const newMemory = {
      id: Date.now(),
      title: title.trim(),
      text: text.trim(),
      category,
    };

    setMemories((prev) => [
      newMemory,
      ...prev,
    ]);

    setTitle("");
    setText("");
    setCategory("People");
    setShowForm(false);
  }

  function deleteMemory(id) {
    setMemories((prev) =>
      prev.filter((memory) => memory.id !== id)
    );
  }

  const filteredMemories =
    activeCategory === "All"
      ? memories
      : memories.filter(
          (memory) =>
            memory.category === activeCategory
        );

  function getCategoryName(categoryName) {
    const categoryKeys = {
      People: "memoryPeople",
      Places: "memoryPlaces",
      Events: "memoryEvents",
      Notes: "memoryNotes",
      Routines: "memoryRoutines",
      "Favorite Things": "memoryFavoriteThings",
    };

    return t(categoryKeys[categoryName]);
  }

  return (
    <div className="page">

      <div className="memory-header">

        <div>
          <p className="small-title">
            {t("memoryVaultTitle")}
          </p>

          <h1>
            {t("memoryKeepThings")}
          </h1>

          <p className="description">
            {t("memoryDescription")}
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? t("close")
            : t("addMemory")}
        </button>

      </div>

      {showForm && (

        <form
          className="memory-form"
          onSubmit={addMemory}
        >

          <h2>
            {t("addNewMemory")}
          </h2>

          <div className="memory-form-grid">

            <div>
              <label>
                {t("title")}
              </label>

              <input
                type="text"
                placeholder={t("memoryTitlePlaceholder")}
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div>
              <label>
                {t("category")}
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {getCategoryName(item)}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div>
            <label>
              {t("memory")}
            </label>

            <textarea
              placeholder={t("memoryTextPlaceholder")}
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            {t("saveMemory")}
          </button>

        </form>
      )}

      <div className="memory-categories">

        <button
          className={
            activeCategory === "All"
              ? "memory-category active"
              : "memory-category"
          }
          onClick={() =>
            setActiveCategory("All")
          }
        >
          🧠 {t("all")}
        </button>

        {categories.map((item) => (

          <button
            key={item}
            className={
              activeCategory === item
                ? "memory-category active"
                : "memory-category"
            }
            onClick={() =>
              setActiveCategory(item)
            }
          >
            {getCategoryName(item)}
          </button>

        ))}

      </div>

      <div className="memory-grid">

        {filteredMemories.length === 0 ? (

          <div className="empty-memory">

            <span>🧠</span>

            <h2>
              {t("noMemories")}
            </h2>

            <p>
              {t("addMemoryToCategory")}
            </p>

          </div>

        ) : (

          filteredMemories.map((memory) => (

            <div
              className="vault-memory-card"
              key={memory.id}
            >

              <div className="memory-card-top">

                <span className="memory-category-label">
                  {getCategoryName(memory.category)}
                </span>

                <button
                  className="delete-memory"
                  onClick={() =>
                    deleteMemory(memory.id)
                  }
                  aria-label={t("deleteMemory")}
                >
                  ×
                </button>

              </div>

              <h3>
                {memory.title}
              </h3>

              <p>
                {memory.text}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Memory;