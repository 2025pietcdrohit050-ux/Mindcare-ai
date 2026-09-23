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
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const [memories, setMemories] = useState([
    {
      id: 1,
      title: isHindi ? "परिवार" : "Family",
      text: isHindi
        ? "मेरे परिवार के महत्वपूर्ण लोग।"
        : "Important people in my family.",
      category: "People",
    },
    {
      id: 2,
      title: isHindi ? "पसंदीदा जगह" : "Favorite Place",
      text: isHindi
        ? "एक ऐसी जगह जो मेरे लिए खास है।"
        : "A place that is special to me.",
      category: "Places",
    },
    {
      id: 3,
      title: isHindi ? "दैनिक दिनचर्या" : "Daily Routine",
      text: isHindi
        ? "सुबह पढ़ाई और शाम की सैर।"
        : "Morning study and evening walk.",
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

    setMemories((prev) => [newMemory, ...prev]);

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
          (memory) => memory.category === activeCategory
        );

  function getCategoryName(categoryName) {
    const names = {
      People: isHindi ? "लोग" : "People",
      Places: isHindi ? "स्थान" : "Places",
      Events: isHindi ? "घटनाएँ" : "Events",
      Notes: isHindi ? "नोट्स" : "Notes",
      Routines: isHindi ? "रूटीन" : "Routines",
      "Favorite Things": isHindi
        ? "पसंदीदा चीज़ें"
        : "Favorite Things",
    };

    return names[categoryName] || categoryName;
  }

  const labels = {
    vault: isHindi ? "मेमोरी वॉल्ट" : "MEMORY VAULT",
    heading: isHindi
      ? "महत्वपूर्ण चीज़ें सुरक्षित रखें जिन्हें आप याद रखना चाहते हैं।"
      : "Keep important things safe that you want to remember.",
    description: isHindi
      ? "व्यक्तिगत यादों, नोट्स और महत्वपूर्ण जानकारी को एक जगह रखें।"
      : "Keep personal memories, notes and important information in one place.",
    addMemory: isHindi ? "मेमोरी जोड़ें" : "Add Memory",
    close: isHindi ? "बंद करें" : "Close",
    addNew: isHindi ? "नई मेमोरी जोड़ें" : "Add New Memory",
    title: isHindi ? "शीर्षक" : "Title",
    category: isHindi ? "श्रेणी" : "Category",
    memory: isHindi ? "मेमोरी" : "Memory",
    titlePlaceholder: isHindi
      ? "मेमोरी का शीर्षक लिखें..."
      : "Enter memory title...",
    textPlaceholder: isHindi
      ? "अपनी मेमोरी या महत्वपूर्ण जानकारी लिखें..."
      : "Write your memory or important information...",
    save: isHindi ? "मेमोरी सेव करें" : "Save Memory",
    all: isHindi ? "सभी" : "All",
    noMemories: isHindi
      ? "अभी कोई मेमोरी नहीं है"
      : "No memories yet",
    addToCategory: isHindi
      ? "इस श्रेणी में मेमोरी जोड़ने के लिए ऊपर दिए गए बटन का उपयोग करें।"
      : "Use the button above to add a memory to this category.",
    delete: isHindi ? "मेमोरी हटाएँ" : "Delete memory",
  };

  return (
    <div className="page">

      <div className="memory-header">

        <div>
          <p className="small-title">
            {labels.vault}
          </p>

          <h1>
            {labels.heading}
          </h1>

          <p className="description">
            {labels.description}
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? labels.close : labels.addMemory}
        </button>

      </div>

      {showForm && (
        <form
          className="memory-form"
          onSubmit={addMemory}
        >

          <h2>
            {labels.addNew}
          </h2>

          <div className="memory-form-grid">

            <div>
              <label>
                {labels.title}
              </label>

              <input
                type="text"
                placeholder={labels.titlePlaceholder}
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div>
              <label>
                {labels.category}
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
              {labels.memory}
            </label>

            <textarea
              placeholder={labels.textPlaceholder}
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
            {labels.save}
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
          onClick={() => setActiveCategory("All")}
        >
          🧠 {labels.all}
        </button>

        {categories.map((item) => (
          <button
            key={item}
            className={
              activeCategory === item
                ? "memory-category active"
                : "memory-category"
            }
            onClick={() => setActiveCategory(item)}
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
              {labels.noMemories}
            </h2>

            <p>
              {labels.addToCategory}
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
                  onClick={() => deleteMemory(memory.id)}
                  aria-label={labels.delete}
                  title={labels.delete}
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
