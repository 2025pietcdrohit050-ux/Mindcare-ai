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
    question: isHindi ? "मैं मानसिक क्षमता वाला गेम कैसे शुरू करूँ?" : "How do I start a cognitive game?",
    answer: isHindi ? "गेम वाला भाग खोलें, कोई गेम चुनें और गेम शुरू करें बटन दबाएँ। गेम पूरा होने के बाद आपका अंक और प्रशिक्षण समय अपने आप सुरक्षित हो जाता है।" : "Open the Games section, choose a game and press Start Game. Your score and training time are saved automatically after completion.",
  },
  {
    question: isHindi ? "स्मृति वॉल्ट कैसे काम करता है?" : "How does Memory Vault work?",
    answer: isHindi ? "स्मृति वॉल्ट आपको लोगों, स्थानों, घटनाओं, दिनचर्याओं और नोट्स जैसी व्यक्तिगत यादों को सुरक्षित रखने में मदद करता है।" : "Memory Vault helps you store personal memories such as people, places, events, routines and notes.",
  },
  {
    question: isHindi ? "एआई सहायक का उपयोग कैसे करें?" : "How do I use AI Companion?",
    answer: isHindi ? "एआई सहायक खोलें और अपना सवाल या संदेश लिखें। माइंडकेयर एआई मित्रवत मानसिक क्षमता और स्मृति सहायता प्रदान करता है।" : "Open AI Companion and type your question or message. MindCare AI provides friendly cognitive wellness support.",
  },
  {
    question: isHindi ? "रिमाइंडर कैसे काम करते हैं?" : "How do reminders work?",
    answer: isHindi ? "रिमाइंडर खोलकर दैनिक मानसिक क्षमता अभ्यास और स्मृति समीक्षा जैसी गतिविधियों के लिए रिमाइंडर बनाएँ और व्यवस्थित करें।" : "Open Reminders to create and manage reminders for activities such as daily cognitive training and memory review.",
  },
  {
    question: isHindi ? "देखभालकर्ता की अनुमति कैसे काम करती है?" : "How does Caregiver access work?",
    answer: isHindi ? "आप देखभालकर्ता के ईमेल पते का उपयोग करके उसे अनुमति दे सकते हैं। अनुमति प्राप्त देखभालकर्ता आपकी अनुमति से आपकी प्रशिक्षण गतिविधि देख सकता है।" : "You can authorize a caregiver using their email address. Authorized caregiver access is designed to help review your training activity with your permission.",
  },
  {
    question: isHindi ? "क्या माइंडकेयर एआई चिकित्सीय जांच की व्यवस्था है?" : "Is MindCare AI a medical diagnosis system?",
    answer: isHindi ? "नहीं। माइंडकेयर एआई मानसिक क्षमता, स्मृति सहायता और मस्तिष्क अभ्यास जैसी गतिविधियों के लिए बनाया गया है। यह चिकित्सीय जांच या उपचार की व्यवस्था नहीं है।" : "No. MindCare AI is designed for cognitive wellness, memory support and brain-training activities. It is not a medical diagnosis or treatment system.",
  },
];

  const categoryLabels = {
  General: isHindi ? "सामान्य" : "General",
  Games: isHindi ? "गेम" : "Games",
  "AI Companion": isHindi ? "एआई सहायक" : "AI Companion",
  "Memory Vault": isHindi ? "स्मृति वॉल्ट" : "Memory Vault",
  Reminders: isHindi ? "रिमाइंडर" : "Reminders",
  Caregiver: isHindi ? "देखभालकर्ता" : "Caregiver",
  Progress: isHindi ? "प्रगति" : "Progress",
  "Technical Issue": isHindi ? "तकनीकी समस्या" : "Technical Issue",
  Other: isHindi ? "अन्य" : "Other",
};

  const gameLabels = {
  "": isHindi ? "गेम से संबंधित नहीं" : "Not related to a game",
  "Memory Match": isHindi ? "स्मृति मिलान" : "Memory Match",
  "Sequence Recall": isHindi ? "क्रम स्मरण" : "Sequence Recall",
  "Reaction Challenge": isHindi ? "प्रतिक्रिया चुनौती" : "Reaction Challenge",
  "Word Recall": isHindi ? "शब्द स्मरण" : "Word Recall",
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
          ? "प्रतिक्रिया भेजने से पहले कृपया प्रवेश करें।"
          : "Please login before submitting feedback."
      );
      return;
    }

    if (!message.trim()) {
      setFeedbackStatus(
        isHindi
          ? "कृपया अपनी प्रतिक्रिया लिखें।"
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
              ? "प्रतिक्रिया भेजी नहीं जा सकी"
              : "Feedback submission failed")
        );
      }

      setFeedbackStatus(
        isHindi
          ? "धन्यवाद! आपकी प्रतिक्रिया सफलतापूर्वक भेज दी गई। ❤️"
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
          ? "प्रतिक्रिया भेजी नहीं जा रही है। कृपया फिर से कोशिश करें।"
          : "Feedback submit nahi ho pa raha. Please try again."
      );
    }
  }

  const text = {
  helpSupport: isHindi ? "मदद और सहायता" : "HELP & SUPPORT",
  heroTitle: isHindi ? "हम आपकी कैसे मदद कर सकते हैं?" : "How can we help you?",
  heroDescription: isHindi ? "जानें कि माइंडकेयर कैसे काम करता है, सामान्य सवालों के जवाब पाएँ या हमारी सहायता टीम से संपर्क करें।" : "Learn how MindCare works, find answers to common questions, or contact our support team.",
  customerCare: isHindi ? "ग्राहक सहायता" : "CUSTOMER CARE",
  stillNeedHelp: isHindi ? "अभी भी मदद चाहिए?" : "Still need help?",
  supportDescription: isHindi ? "हमारी सहायता टीम खाते, गेम, रिमाइंडर, देखभालकर्ता की अनुमति और माइंडकेयर की अन्य सुविधाओं में आपकी मदद कर सकती है।" : "Our support team can help you with account, games, reminders, caregiver access and other MindCare features.",
  emailSupport: isHindi ? "ईमेल सहायता" : "Email Support",
  customerCareLabel: isHindi ? "ग्राहक सहायता" : "Customer Care",
  callSupport: isHindi ? "फोन सहायता" : "Call Support",
  gettingStarted: isHindi ? "शुरुआत कैसे करें" : "Getting Started",
  cognitiveGames: isHindi ? "मानसिक क्षमता वाले गेम" : "Cognitive Games",
  cognitiveGamesText: isHindi ? "अलग-अलग मानसिक क्षमताओं का अभ्यास करने के लिए स्मृति, ध्यान, प्रतिक्रिया और याददाश्त वाले गेम खेलें।" : "Play memory, attention, reaction and recall games to practice different cognitive skills.",
  memoryVault: isHindi ? "स्मृति वॉल्ट" : "Memory Vault",
  memoryVaultText: isHindi ? "महत्वपूर्ण व्यक्तिगत यादों, नोट्स, लोगों, स्थानों और दिनचर्याओं को सुरक्षित रखें और दोबारा देखें।" : "Store and review important personal memories, notes, people, places and routines.",
  aiCompanion: isHindi ? "एआई सहायक" : "AI Companion",
  aiCompanionText: isHindi ? "मित्रवत मार्गदर्शन और मानसिक क्षमता सहायता के लिए माइंडकेयर एआई से बात करें।" : "Talk with MindCare AI for friendly guidance and cognitive wellness support.",
  reminders: isHindi ? "रिमाइंडर" : "Reminders",
  remindersText: isHindi ? "प्रशिक्षण सत्र, स्मृति समीक्षा और दैनिक गतिविधियों के लिए रिमाइंडर बनाएँ।" : "Create reminders for training sessions, memory review and daily activities.",
  caregiver: isHindi ? "देखभालकर्ता" : "Caregiver",
  caregiverText: isHindi ? "अपनी अनुमति से प्रशिक्षण गतिविधि देखने में मदद के लिए देखभालकर्ता को अनुमति दें।" : "Authorize a caregiver to help monitor your training activity with your permission.",
  progress: isHindi ? "प्रगति" : "Progress",
  progressText: isHindi ? "अपनी गेम गतिविधि, अंक, प्रशिक्षण समय और प्रदर्शन में हुए बदलाव देखें।" : "View your game activity, scores, training time and performance trends.",
  faq: isHindi ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions",
  feedback: isHindi ? "आपकी प्रतिक्रिया" : "YOUR FEEDBACK",
  feedbackTitle: isHindi ? "अपने अनुभव के बारे में बताएँ" : "Tell us about your experience",
  feedbackDescription: isHindi ? "आपकी प्रतिक्रिया हमें माइंडकेयर को बेहतर बनाने में मदद करती है।" : "Your feedback helps us improve MindCare.",
  feedbackAbout: isHindi ? "आप किस बारे में प्रतिक्रिया देना चाहते हैं?" : "What would you like to give feedback about?",
  likedGame: isHindi ? "आपको कौन सा गेम पसंद आया?" : "Which game did you like?",
  gameDifficulty: isHindi ? "गेम का कठिनाई स्तर कैसा था?" : "How was the game difficulty?",
  rateExperience: isHindi ? "अपने अनुभव को अंक दें" : "Rate your experience",
  feedbackText: isHindi ? "आपकी प्रतिक्रिया" : "Your feedback",
  feedbackPlaceholder: isHindi ? "बताएँ कि आपको क्या पसंद आया या हम क्या बेहतर कर सकते हैं..." : "Tell us what you liked or what we can improve...",
  submitFeedback: isHindi ? "प्रतिक्रिया भेजें" : "Submit Feedback",
  veryPoor: isHindi ? "बहुत खराब" : "Very Poor",
  poor: isHindi ? "खराब" : "Poor",
  okay: isHindi ? "ठीक" : "Okay",
  good: isHindi ? "अच्छा" : "Good",
  excellent: isHindi ? "बहुत अच्छा" : "Excellent",
  privacyTitle: isHindi ? "आपकी निजता महत्वपूर्ण है।" : "Your privacy matters.",
  privacyText: isHindi ? "सहायता टीम के साथ व्यक्तिगत जानकारी केवल आवश्यकता होने पर ही साझा करें।" : "Only share personal information with support when necessary.",
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
