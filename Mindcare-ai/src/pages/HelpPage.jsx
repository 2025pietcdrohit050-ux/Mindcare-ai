import { useState } from "react";

function HelpPage() {
  const [open, setOpen] = useState(null);

  const [category, setCategory] = useState("General");
  const [game, setGame] = useState("");
  const [rating, setRating] = useState(5);
  const [difficulty, setDifficulty] = useState("Moderate");
  const [message, setMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");

  const faqs = [
    {
      question: "How do I start a cognitive game?",
      answer:
        "Open the Games section, choose a game and press Start Game. Your score and training time are saved automatically after completion.",
    },
    {
      question: "How does Memory Vault work?",
      answer:
        "Memory Vault helps you store personal memories such as people, places, events, routines and notes.",
    },
    {
      question: "How do I use AI Companion?",
      answer:
        "Open AI Companion and type your question or message. MindCare AI provides friendly cognitive wellness support.",
    },
    {
      question: "How do reminders work?",
      answer:
        "Open Reminders to create and manage reminders for activities such as daily cognitive training and memory review.",
    },
    {
      question: "How does Caregiver access work?",
      answer:
        "You can authorize a caregiver using their email address. Authorized caregiver access is designed to help review your training activity with your permission.",
    },
    {
      question: "Is MindCare AI a medical diagnosis system?",
      answer:
        "No. MindCare AI is designed for cognitive wellness, memory support and brain-training activities. It is not a medical diagnosis or treatment system.",
    },
  ];

  async function submitFeedback(event) {
    event.preventDefault();

    setFeedbackStatus("");

    const token = localStorage.getItem("token");

    if (!token) {
      setFeedbackStatus("Please login before submitting feedback.");
      return;
    }

    if (!message.trim()) {
      setFeedbackStatus("Please write your feedback.");
      return;
    }

    try {
      const response = await fetch(
        "https://mindcare-ai-hesy.onrender.com/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            game: game || null,
            rating,
            difficulty: game ? difficulty : null,
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Feedback submission failed"
        );
      }

      setFeedbackStatus("success");

      setCategory("General");
      setGame("");
      setRating(5);
      setDifficulty("Moderate");
      setMessage("");
    } catch (error) {
      console.error(error);

      setFeedbackStatus(
        "Feedback submit nahi ho pa raha. Please try again."
      );
    }
  }

  function submitAnotherFeedback() {
    setFeedbackStatus("");
    setCategory("General");
    setGame("");
    setRating(5);
    setDifficulty("Moderate");
    setMessage("");
  }

  return (
    <section className="help-page">

      {/* HELP HERO */}
      <div className="help-hero">
        <div className="help-icon">❓</div>

        <div>
          <span className="section-label">
            HELP & SUPPORT
          </span>

          <h1>How can we help you?</h1>

          <p>
            Learn how MindCare works, find answers to common
            questions, or contact our support team.
          </p>
        </div>
      </div>


      {/* GETTING STARTED */}
      <div className="help-section">

        <h2>Getting Started</h2>

        <div className="help-grid">

          <div className="help-card">
            <span>🎮</span>
            <h3>Cognitive Games</h3>
            <p>
              Play memory, attention, reaction and recall games
              to practice different cognitive skills.
            </p>
          </div>

          <div className="help-card">
            <span>🧠</span>
            <h3>Memory Vault</h3>
            <p>
              Store and review important personal memories,
              notes, people, places and routines.
            </p>
          </div>

          <div className="help-card">
            <span>🤖</span>
            <h3>AI Companion</h3>
            <p>
              Talk with MindCare AI for friendly guidance
              and cognitive wellness support.
            </p>
          </div>

          <div className="help-card">
            <span>🔔</span>
            <h3>Reminders</h3>
            <p>
              Create reminders for training sessions,
              memory review and daily activities.
            </p>
          </div>

          <div className="help-card">
            <span>👥</span>
            <h3>Caregiver</h3>
            <p>
              Authorize a caregiver to help monitor your
              training activity with your permission.
            </p>
          </div>

          <div className="help-card">
            <span>📊</span>
            <h3>Progress</h3>
            <p>
              View your game activity, scores, training time
              and performance trends.
            </p>
          </div>

        </div>
      </div>


      {/* FAQ */}
      <div className="help-section">

        <h2>Frequently Asked Questions</h2>

        <div className="faq-list">

          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>

              <button
                type="button"
                className="faq-question"
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
              >
                <span>{faq.question}</span>

                <span>
                  {open === index ? "−" : "+"}
                </span>
              </button>

              {open === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}

            </div>
          ))}

        </div>
      </div>


      {/* FEEDBACK */}
      <div className="feedback-card">

        {feedbackStatus === "success" ? (

          /* SUCCESS SCREEN */
          <div className="feedback-success">

            <div className="feedback-success-icon">
              ✓
            </div>

            <span className="section-label">
              FEEDBACK RECEIVED
            </span>

            <h2>
              Thank you for your feedback! 💜
            </h2>

            <p>
              Your feedback has been submitted successfully.
              It helps us improve the MindCare AI experience.
            </p>

            <div className="feedback-success-note">
              ⭐ Your response has been recorded securely.
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={submitAnotherFeedback}
            >
              Submit Another Feedback
            </button>

          </div>

        ) : (

          /* FEEDBACK FORM */
          <>
            <div className="feedback-header">

              <div className="feedback-icon">
                💬
              </div>

              <div>
                <span className="section-label">
                  YOUR FEEDBACK
                </span>

                <h2>
                  Tell us about your experience
                </h2>

                <p>
                  Your feedback helps us improve MindCare.
                </p>
              </div>

            </div>


            <form
              className="feedback-form"
              onSubmit={submitFeedback}
            >

              {/* CATEGORY */}
              <div className="feedback-field">

                <label>
                  What would you like to give feedback about?
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option>General</option>
                  <option>Games</option>
                  <option>AI Companion</option>
                  <option>Memory Vault</option>
                  <option>Reminders</option>
                  <option>Caregiver</option>
                  <option>Progress</option>
                  <option>Technical Issue</option>
                  <option>Other</option>
                </select>

              </div>


              {/* GAME */}
              <div className="feedback-field">

                <label>
                  Which game did you like?
                </label>

                <select
                  value={game}
                  onChange={(event) =>
                    setGame(event.target.value)
                  }
                >
                  <option value="">
                    Not related to a game
                  </option>

                  <option value="Memory Match">
                    Memory Match
                  </option>

                  <option value="Sequence Recall">
                    Sequence Recall
                  </option>

                  <option value="Reaction Challenge">
                    Reaction Challenge
                  </option>

                  <option value="Word Recall">
                    Word Recall
                  </option>
                </select>

              </div>


              {/* DIFFICULTY */}
              {game && (
                <div className="feedback-field">

                  <label>
                    How was the game difficulty?
                  </label>

                  <select
                    value={difficulty}
                    onChange={(event) =>
                      setDifficulty(event.target.value)
                    }
                  >
                    <option>Too Easy</option>
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Difficult</option>
                    <option>Too Difficult</option>
                  </select>

                </div>
              )}


              {/* RATING */}
              <div className="feedback-field">

                <label>
                  Rate your experience
                </label>

                <div className="rating-buttons">

                  {[1, 2, 3, 4, 5].map((number) => (
                    <button
                      key={number}
                      type="button"
                      className={
                        rating >= number
                          ? `rating-star active rating-${rating}`
                          : "rating-star"
                      }
                      onClick={() => setRating(number)}
                    >
                      ★
                    </button>
                  ))}

                </div>

                <p className="rating-text">
                  {rating === 1 && "Very Poor"}
                  {rating === 2 && "Poor"}
                  {rating === 3 && "Okay"}
                  {rating === 4 && "Good"}
                  {rating === 5 && "Excellent"}
                </p>

              </div>


              {/* MESSAGE */}
              <div className="feedback-field">

                <label>
                  Your feedback
                </label>

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Tell us what you liked or what we can improve..."
                  rows="5"
                />

              </div>


              {/* ERROR */}
              {feedbackStatus && (
                <div className="feedback-status">
                  {feedbackStatus}
                </div>
              )}


              <button
                type="submit"
                className="primary-btn feedback-submit"
              >
                Submit Feedback
              </button>

            </form>
          </>
        )}

      </div>


      {/* CUSTOMER CARE */}
      <div className="support-card">

        <div className="support-icon">
          🆘
        </div>

        <div className="support-content">

          <span className="section-label">
            CUSTOMER CARE
          </span>

          <h2>Still need help?</h2>

          <p>
            Our support team can help you with account,
            games, reminders, caregiver access and other
            MindCare features.
          </p>


          <div className="support-contact-info">

            <div className="support-contact-item">

              <span>📧</span>

              <div>
                <small>Email Support</small>

                <strong>
                  2025pietcdrohit050@poornima.org
                </strong>
              </div>

            </div>


            <div className="support-contact-item">

              <span>📞</span>

              <div>
                <small>Customer Care</small>

                <strong>
                  8290956110
                </strong>
              </div>

            </div>

          </div>


          <div className="support-actions">

            <a
              href="mailto:2025pietcdrohit050@poornima.org"
              className="support-btn"
            >
              📧 Email Support
            </a>

            <a
              href="tel:8290956110"
              className="support-btn secondary"
            >
              📞 Call Support
            </a>

          </div>

        </div>

      </div>


      {/* PRIVACY */}
      <div className="help-privacy">
        🔐 <strong>Your privacy matters.</strong> Only share
        personal information with support when necessary.
      </div>

    </section>
  );
}

export default HelpPage;