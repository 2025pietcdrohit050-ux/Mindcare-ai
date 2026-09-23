import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function HelpPage() {
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const [open, setOpen] = useState(null);
  const [category, setCategory] = useState("General");
  const [game, setGame] = useState("");
  const [rating, setRating] = useState(5);
  const [difficulty, setDifficulty] = useState("Moderate");
  const [message, setMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");

  const faqs = [
    {
      question: isHindi
        ? "मैं कॉग्निटिव गेम कैसे शुरू करूँ?"
        : "How do I start a cognitive game?",
      answer: isHindi
        ? "Games सेक्शन खोलें, कोई गेम चुनें और Start Game दबाएँ। गेम पूरा होने के बाद आपका स्कोर और ट्रेनिंग समय अपने आप सेव हो जाता है।"
        : "Open the Games section, choose a game and press Start Game. Your score and training time are saved automatically after completion.",
    },
    {
      question: isHindi
        ? "Memory Vault कैसे काम करता है?"
        : "How does Memory Vault work?",
      answer: isHindi
        ? "Memory Vault आपको लोगों, स्थानों, घटनाओं, रूटीन और नोट्स जैसी व्यक्तिगत यादों को सेव करने में मदद करता है।"
        : "Memory Vault helps you store personal memories such as people, places, events, routines and notes.",
    },
    {
      question: isHindi
        ? "AI Companion का उपयोग कैसे करें?"
        : "How do I use AI Companion?",
      answer: isHindi
        ? "AI Companion खोलें और अपना सवाल या मैसेज लिखें। MindCare AI दोस्ताना cognitive wellness support प्रदान करता है।"
        : "Open AI Companion and type your question or message. MindCare AI provides friendly cognitive wellness support.",
    },
    {
      question: isHindi
        ? "Reminders कैसे काम करते हैं?"
        : "How do reminders work?",
      answer: isHindi
        ? "Reminders खोलकर daily cognitive training और memory review जैसी गतिविधियों के लिए reminders बनाएँ और manage करें।"
        : "Open Reminders to create and manage reminders for activities such as daily cognitive training and memory review.",
    },
    {
      question: isHindi
        ? "Caregiver access कैसे काम करता है?"
        : "How does Caregiver access work?",
      answer: isHindi
        ? "आप caregiver के email address का उपयोग करके उसे authorize कर सकते हैं। Authorized caregiver आपकी अनुमति से आपकी training activity देख सकता है।"
        : "You can authorize a caregiver using their email address. Authorized caregiver access is designed to help review your training activity with your permission.",
    },
    {
      question: isHindi
        ? "क्या MindCare AI medical diagnosis system है?"
        : "Is MindCare AI a medical diagnosis system?",
      answer: isHindi
        ? "नहीं। MindCare AI cognitive wellness, memory support और brain-training activities के लिए बनाया गया है। यह medical diagnosis या treatment system नहीं है।"
        : "No. MindCare AI is designed for cognitive wellness, memory support and brain-training activities. It is not a medical diagnosis or treatment system.",
    },
  ];

  const categoryLabels = {
    General: isHindi ? "सामान्य" : "General",
    Games: isHindi ? "गेम्स" : "Games",
    "AI Companion": "AI Companion",
    "Memory Vault": "Memory Vault",
    Reminders: isHindi ? "रिमाइंडर" : "Reminders",
    Caregiver: isHindi ? "केयरगिवर" : "Caregiver",
    Progress: isHindi ? "प्रोग्रेस" : "Progress",
    "Technical Issue": isHindi ? "तकनीकी समस्या" : "Technical Issue",
    Other: isHindi ? "अन्य" : "Other",
  };

  const gameLabels = {
    "": isHindi ? "गेम से संबंधित नहीं" : "Not related to a game",
    "Memory Match": "Memory Match",
    "Sequence Recall": "Sequence Recall",
    "Reaction Challenge": "Reaction Challenge",
    "Word Recall": "Word Recall",
  };

  const difficultyLabels = {
    "Too Easy": isHindi ? "बहुत आसान" : "Too Easy",
    Easy: isHindi ? "आसान" : "Easy",
    Moderate: isHindi ? "मध्यम" : "Moderate",
    Difficult: isHindi ? "कठिन" : "Difficult",
    "Too Difficult": isHindi ? "बहुत कठिन" : "Too Difficult",
  };

  async function submitFeedback(event) {
    event.preventDefault();
    setFeedbackStatus("");

    const token = localStorage.getItem("token");

    if (!token) {
      setFeedbackStatus(
        isHindi
          ? "Feedback भेजने से पहले कृपया login करें।"
          : "Please login before submitting feedback."
      );
      return;
    }

    if (!message.trim()) {
      setFeedbackStatus(
        isHindi
          ? "कृपया अपना feedback लिखें।"
          : "Please write your feedback."
      );
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
          data.message ||
            (isHindi
              ? "Feedback submit नहीं हो सका"
              : "Feedback submission failed")
        );
      }

      setFeedbackStatus(
        isHindi
          ? "धन्यवाद! आपका feedback सफलतापूर्वक submit हो गया। ❤️"
          : "Thank you! Your feedback has been submitted successfully. ❤️"
      );

      setCategory("General");
      setGame("");
      setRating(5);
      setDifficulty("Moderate");
      setMessage("");
    } catch (error) {
      console.error(error);

      setFeedbackStatus(
        isHindi
          ? "Feedback submit नहीं हो पा रहा। कृपया फिर से कोशिश करें।"
          : "Feedback submit nahi ho pa raha. Please try again."
      );
    }
  }

  const text = {
    helpSupport: isHindi ? "मदद और सहायता" : "HELP & SUPPORT",
    heroTitle: isHindi
      ? "हम आपकी कैसे मदद कर सकते हैं?"
      : "How can we help you?",
    heroDescription: isHindi
      ? "जानें कि MindCare कैसे काम करता है, सामान्य सवालों के जवाब पाएँ या हमारी support team से संपर्क करें।"
      : "Learn how MindCare works, find answers to common questions, or contact our support team.",

    customerCare: isHindi ? "कस्टमर केयर" : "CUSTOMER CARE",
    stillNeedHelp: isHindi
      ? "अभी भी मदद चाहिए?"
      : "Still need help?",
    supportDescription: isHindi
      ? "हमारी support team account, games, reminders, caregiver access और अन्य MindCare features में आपकी मदद कर सकती है।"
      : "Our support team can help you with account, games, reminders, caregiver access and other MindCare features.",
    emailSupport: isHindi ? "ईमेल सहायता" : "Email Support",
    customerCareLabel: isHindi ? "कस्टमर केयर" : "Customer Care",
    callSupport: isHindi ? "कॉल सहायता" : "Call Support",

    gettingStarted: isHindi ? "शुरुआत कैसे करें" : "Getting Started",
    cognitiveGames: isHindi ? "कॉग्निटिव गेम्स" : "Cognitive Games",
    cognitiveGamesText: isHindi
      ? "अलग-अलग cognitive skills का अभ्यास करने के लिए memory, attention, reaction और recall games खेलें।"
      : "Play memory, attention, reaction and recall games to practice different cognitive skills.",
    memoryVault: "Memory Vault",
    memoryVaultText: isHindi
      ? "महत्वपूर्ण personal memories, notes, people, places और routines को store और review करें।"
      : "Store and review important personal memories, notes, people, places and routines.",
    aiCompanion: "AI Companion",
    aiCompanionText: isHindi
      ? "Friendly guidance और cognitive wellness support के लिए MindCare AI से बात करें।"
      : "Talk with MindCare AI for friendly guidance and cognitive wellness support.",
    reminders: isHindi ? "रिमाइंडर" : "Reminders",
    remindersText: isHindi
      ? "Training sessions, memory review और daily activities के लिए reminders बनाएँ।"
      : "Create reminders for training sessions, memory review and daily activities.",
    caregiver: isHindi ? "केयरगिवर" : "Caregiver",
    caregiverText: isHindi
      ? "अपनी अनुमति से training activity को monitor करने में मदद के लिए caregiver को authorize करें।"
      : "Authorize a caregiver to help monitor your training activity with your permission.",
    progress: isHindi ? "प्रोग्रेस" : "Progress",
    progressText: isHindi
      ? "अपनी game activity, scores, training time और performance trends देखें।"
      : "View your game activity, scores, training time and performance trends.",

    faq: isHindi
      ? "अक्सर पूछे जाने वाले सवाल"
      : "Frequently Asked Questions",

    feedback: isHindi ? "आपका feedback" : "YOUR FEEDBACK",
    feedbackTitle: isHindi
      ? "अपने अनुभव के बारे में बताएँ"
      : "Tell us about your experience",
    feedbackDescription: isHindi
      ? "आपका feedback हमें MindCare को बेहतर बनाने में मदद करता है।"
      : "Your feedback helps us improve MindCare.",
    feedbackAbout: isHindi
      ? "आप किस बारे में feedback देना चाहते हैं?"
      : "What would you like to give feedback about?",
    likedGame: isHindi
      ? "आपको कौन सा गेम पसंद आया?"
      : "Which game did you like?",
    gameDifficulty: isHindi
      ? "गेम की difficulty कैसी थी?"
      : "How was the game difficulty?",
    rateExperience: isHindi
      ? "अपने अनुभव को रेट करें"
      : "Rate your experience",
    feedbackText: isHindi ? "आपका feedback" : "Your feedback",
    feedbackPlaceholder: isHindi
      ? "बताएँ कि आपको क्या पसंद आया या हम क्या बेहतर कर सकते हैं..."
      : "Tell us what you liked or what we can improve...",
    submitFeedback: isHindi
      ? "Feedback भेजें"
      : "Submit Feedback",

    veryPoor: isHindi ? "बहुत खराब" : "Very Poor",
    poor: isHindi ? "खराब" : "Poor",
    okay: isHindi ? "ठीक" : "Okay",
    good: isHindi ? "अच्छा" : "Good",
    excellent: isHindi ? "बहुत अच्छा" : "Excellent",

    privacyTitle: isHindi
      ? "आपकी privacy महत्वपूर्ण है।"
      : "Your privacy matters.",
    privacyText: isHindi
      ? "Support team के साथ personal information केवल जरूरत होने पर ही साझा करें।"
      : "Only share personal information with support when necessary.",
  };

  const ratingText =
    rating === 1
      ? text.veryPoor
      : rating === 2
      ? text.poor
      : rating === 3
      ? text.okay
      : rating === 4
      ? text.good
      : text.excellent;

  return (
    <section className="help-page">

      {/* HELP HERO */}

      <div className="help-hero">

        <div className="help-icon">
          ❓
        </div>

        <div>
          <span className="section-label">
            {text.helpSupport}
          </span>

          <h1>
            {text.heroTitle}
          </h1>

          <p>
            {text.heroDescription}
          </p>
        </div>

      </div>


      {/* CUSTOMER CARE */}

      <div className="support-card">

        <div className="support-icon">
          🆘
        </div>

        <div className="support-content">

          <span className="section-label">
            {text.customerCare}
          </span>

          <h2>
            {text.stillNeedHelp}
          </h2>

          <p>
            {text.supportDescription}
          </p>

          <div className="support-contact-info">

            <div className="support-contact-item">
              <span>📧</span>

              <div>
                <small>
                  {text.emailSupport}
                </small>

                <strong>
                  2025pietcdrohit050@poornima.org
                </strong>
              </div>
            </div>

            <div className="support-contact-item">
              <span>📞</span>

              <div>
                <small>
                  {text.customerCareLabel}
                </small>

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
              📧 {text.emailSupport}
            </a>

            <a
              href="tel:8290956110"
              className="support-btn secondary"
            >
              📞 {text.callSupport}
            </a>

          </div>

        </div>

      </div>


      {/* GETTING STARTED */}

      <div className="help-section">

        <h2>
          {text.gettingStarted}
        </h2>

        <div className="help-grid">

          <div className="help-card">
            <span>🎮</span>

            <h3>
              {text.cognitiveGames}
            </h3>

            <p>
              {text.cognitiveGamesText}
            </p>
          </div>

          <div className="help-card">
            <span>🧠</span>

            <h3>
              {text.memoryVault}
            </h3>

            <p>
              {text.memoryVaultText}
            </p>
          </div>

          <div className="help-card">
            <span>🤖</span>

            <h3>
              {text.aiCompanion}
            </h3>

            <p>
              {text.aiCompanionText}
            </p>
          </div>

          <div className="help-card">
            <span>🔔</span>

            <h3>
              {text.reminders}
            </h3>

            <p>
              {text.remindersText}
            </p>
          </div>

          <div className="help-card">
            <span>👥</span>

            <h3>
              {text.caregiver}
            </h3>

            <p>
              {text.caregiverText}
            </p>
          </div>

          <div className="help-card">
            <span>📊</span>

            <h3>
              {text.progress}
            </h3>

            <p>
              {text.progressText}
            </p>
          </div>

        </div>

      </div>


      {/* FAQ */}

      <div className="help-section">

        <h2>
          {text.faq}
        </h2>

        <div className="faq-list">

          {faqs.map((faq, index) => (

            <div
              className="faq-item"
              key={index}
            >

              <button
                type="button"
                className="faq-question"
                onClick={() =>
                  setOpen(
                    open === index
                      ? null
                      : index
                  )
                }
              >

                <span>
                  {faq.question}
                </span>

                <span>
                  {open === index
                    ? "−"
                    : "+"}
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

        <div className="feedback-header">

          <div className="feedback-icon">
            💬
          </div>

          <div>

            <span className="section-label">
              {text.feedback}
            </span>

            <h2>
              {text.feedbackTitle}
            </h2>

            <p>
              {text.feedbackDescription}
            </p>

          </div>

        </div>


        <form
          className="feedback-form"
          onSubmit={submitFeedback}
        >

          <div className="feedback-field">

            <label>
              {text.feedbackAbout}
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >

              {Object.keys(categoryLabels).map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {categoryLabels[item]}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="feedback-field">

            <label>
              {text.likedGame}
            </label>

            <select
              value={game}
              onChange={(event) =>
                setGame(event.target.value)
              }
            >

              {Object.keys(gameLabels).map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {gameLabels[item]}
                  </option>
                )
              )}

            </select>

          </div>


          {game && (
            <div className="feedback-field">

              <label>
                {text.gameDifficulty}
              </label>

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value)
                }
              >

                {Object.keys(difficultyLabels).map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {difficultyLabels[item]}
                    </option>
                  )
                )}

              </select>

            </div>
          )}


          <div className="feedback-field">

            <label>
              {text.rateExperience}
            </label>

            <div className="rating-buttons">

              {[1, 2, 3, 4, 5].map(
                (number) => (

                  <button
                    key={number}
                    type="button"
                    className={
                      rating >= number
                        ? "rating-star active"
                        : "rating-star"
                    }
                    onClick={() =>
                      setRating(number)
                    }
                    aria-label={`${number}/5`}
                  >
                    ★
                  </button>

                )
              )}

            </div>

            <p className="rating-text">
              {ratingText}
            </p>

          </div>


          <div className="feedback-field">

            <label>
              {text.feedbackText}
            </label>

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder={text.feedbackPlaceholder}
              rows="5"
            />

          </div>


          {feedbackStatus && (
            <div className="feedback-status">
              {feedbackStatus}
            </div>
          )}


          <button
            type="submit"
            className="primary-btn feedback-submit"
          >
            {text.submitFeedback}
          </button>

        </form>

      </div>


      {/* PRIVACY */}

      <div className="help-privacy">

        🔐{" "}

        <strong>
          {text.privacyTitle}
        </strong>{" "}

        {text.privacyText}

      </div>

    </section>
  );
}

export default HelpPage;
