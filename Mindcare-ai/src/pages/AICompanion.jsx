import {
  useState,
  useEffect,
  useRef,
} from "react";

import { useLanguage } from "../LanguageContext";

function AICompanion() {
  const {
    language: globalLanguage,
    changeLanguage: changeGlobalLanguage,
  } = useLanguage();

  const [language, setLanguage] =
    useState(
      globalLanguage || "English"
    );

  const [messages, setMessages] =
    useState([
      {
        sender: "ai",
        text:
          "Hello 👋 I'm MindCare AI. How can I help you today?",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(true);

  /*
    VOICE REFERENCES
  */

  const recognitionRef =
    useRef(null);

  const shouldListenRef =
    useRef(false);


  /*
    SYNC LANGUAGE
  */

  useEffect(() => {
    setLanguage(
      globalLanguage || "English"
    );
  }, [globalLanguage]);


  /*
    CHECK VOICE SUPPORT
  */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);


  /*
    CLEANUP VOICE WHEN PAGE CHANGES
  */

  useEffect(() => {
    return () => {
      shouldListenRef.current =
        false;

      if (
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log(
            "Voice cleanup:",
            error
          );
        }
      }
    };
  }, []);


  /*
    LANGUAGE CHANGE
  */

  function changeLanguage(
    selectedLanguage
  ) {
    /*
      Stop voice before changing
      language.
    */

    shouldListenRef.current =
      false;

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(
          "Voice stop:",
          error
        );
      }
    }

    setIsListening(false);

    setLanguage(
      selectedLanguage
    );

    changeGlobalLanguage(selectedLanguage);

    setInput("");

    if (
      selectedLanguage ===
      "Hindi"
    ) {
      setMessages([
        {
          sender: "ai",
          text:
            "नमस्ते 👋 मैं MindCare AI हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
        },
      ]);
    } else {
      setMessages([
        {
          sender: "ai",
          text:
            "Hello 👋 I'm MindCare AI. How can I help you today?",
        },
      ]);
    }
  }


  /*
    VOICE INPUT
    TAP ONCE = START
    TAP AGAIN = STOP
  */

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === "Hindi"
          ? "आपके browser में voice input support नहीं है। Chrome browser का उपयोग करें।"
          : "Voice input is not supported in your browser. Please use Chrome."
      );

      return;
    }


    /*
      If already listening,
      stop it.
    */

    if (isListening) {
      shouldListenRef.current =
        false;

      if (
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log(
            "Voice stop:",
            error
          );
        }
      }

      setIsListening(false);

      return;
    }


    /*
      Create recognition
    */

    const recognition =
      new SpeechRecognition();

    recognitionRef.current =
      recognition;

    shouldListenRef.current =
      true;


    /*
      LANGUAGE
    */

    recognition.lang =
      language === "Hindi"
        ? "hi-IN"
        : "en-IN";


    /*
      IMPORTANT
    */

    recognition.continuous =
      true;

    recognition.interimResults =
      true;

    recognition.maxAlternatives =
      1;


    /*
      START
    */

    recognition.onstart = () => {
      setIsListening(true);
    };


    /*
      RESULT
    */

    recognition.onresult = (
      event
    ) => {
      let finalText = "";

      for (
        let i =
          event.resultIndex;
        i <
        event.results.length;
        i++
      ) {
        if (
          event.results[i]
            .isFinal
        ) {
          finalText +=
            event.results[i][0]
              .transcript;
        }
      }

      if (
        finalText.trim()
      ) {
        setInput(
          (previous) =>
            previous
              ? `${previous} ${finalText.trim()}`
              : finalText.trim()
        );
      }
    };


    /*
      ERROR
    */

    recognition.onerror = (
      event
    ) => {
      console.error(
        "Voice recognition error:",
        event.error
      );


      /*
        Permission denied
      */

      if (
        event.error ===
          "not-allowed" ||
        event.error ===
          "service-not-allowed"
      ) {
        shouldListenRef.current =
          false;

        setIsListening(false);

        alert(
          language === "Hindi"
            ? "Microphone permission allow करें।"
            : "Please allow microphone permission."
        );

        return;
      }


      /*
        No speech / temporary
        network errors should not
        permanently stop the UI.
      */

      if (
        event.error ===
          "no-speech" ||
        event.error ===
          "audio-capture" ||
        event.error ===
          "network"
      ) {
        if (
          shouldListenRef.current
        ) {
          setIsListening(true);
        }
      }
    };


    /*
      END
    */

    recognition.onend = () => {

      /*
        If user pressed STOP,
        don't restart.
      */

      if (
        !shouldListenRef.current
      ) {
        setIsListening(false);

        if (
          recognitionRef.current ===
          recognition
        ) {
          recognitionRef.current =
            null;
        }

        return;
      }


      /*
        Chrome/mobile can stop
        recognition automatically
        after a short silence.

        Restart automatically.
      */

      setTimeout(() => {
        if (
          shouldListenRef.current
        ) {
          try {
            recognition.start();
            setIsListening(true);
          } catch (error) {
            console.log(
              "Voice restart:",
              error
            );
          }
        }
      }, 300);
    };


    /*
      START RECOGNITION
    */

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Recognition start error:",
        error
      );

      shouldListenRef.current =
        false;

      setIsListening(false);
    }
  }


  /*
    TEXT TO SPEECH
  */

  function speakText(text) {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        text
      );

    speech.lang =
      language === "Hindi"
        ? "hi-IN"
        : "en-IN";

    speech.rate = 0.9;

    speech.pitch = 1;

    window.speechSynthesis.speak(
      speech
    );
  }


  /*
    SEND MESSAGE
  */

  async function sendMessage(
    event
  ) {
    event.preventDefault();

    if (
      !input.trim() ||
      loading
    ) {
      return;
    }

    /*
      Stop voice when sending
      the message.
    */

    shouldListenRef.current =
      false;

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(
          "Voice stop:",
          error
        );
      }
    }

    setIsListening(false);

    const userText =
      input.trim();

    const userMessage = {
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    setLoading(true);

    try {
      const languageInstruction =
        language === "Hindi"
          ? `The user has selected Hindi language.

Reply only in simple, natural Hindi using Devanagari script.

Keep the response friendly, simple and easy to understand.

Do not use complicated medical terms.

This is a cognitive wellness and memory support application. Do not diagnose medical conditions or provide medical treatment.

User message:
${userText}`
          : `The user has selected English language.

Reply only in simple, natural English.

Keep the response friendly, simple and easy to understand.

Do not use complicated medical terms.

This is a cognitive wellness and memory support application. Do not diagnose medical conditions or provide medical treatment.

User message:
${userText}`;

      const response =
        await fetch(
          "https://mindcare-ai-hesy.onrender.com/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message:
                languageInstruction,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Backend request failed"
        );
      }

      const data =
        await response.json();

      const aiMessage = {
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      speakText(
        data.reply
      );

    } catch (error) {
      console.error(error);

      const errorMessage =
        language === "Hindi"
          ? "अभी MindCare AI से कनेक्शन नहीं हो पा रहा है। कृपया दोबारा कोशिश करें।"
          : "MindCare AI cannot connect right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);

      speakText(
        errorMessage
      );

    } finally {
      setLoading(false);
    }
  }


  /*
    QUICK PROMPTS
  */

  const quickPrompts =
    language === "Hindi"
      ? [
          {
            icon: "🧠",
            label:
              "याददाश्त अभ्यास",
            prompt:
              "मुझे याददाश्त का एक आसान अभ्यास बताइए।",
          },
          {
            icon: "⏰",
            label:
              "मेरी दिनचर्या",
            prompt:
              "मेरी रोज़ की दिनचर्या बेहतर बनाने में मदद कीजिए।",
          },
          {
            icon: "🎯",
            label:
              "ध्यान अभ्यास",
            prompt:
              "मुझे ध्यान बढ़ाने के लिए एक आसान गतिविधि बताइए।",
          },
          {
            icon: "📊",
            label:
              "मेरी प्रगति",
            prompt:
              "मुझे अपनी cognitive training progress बेहतर करने के सुझाव दीजिए।",
          },
        ]
      : [
          {
            icon: "🧠",
            label:
              "Memory exercise",
            prompt:
              "Give me a simple memory exercise.",
          },
          {
            icon: "⏰",
            label:
              "My routine",
            prompt:
              "Help me improve my daily routine.",
          },
          {
            icon: "🎯",
            label:
              "Focus activity",
            prompt:
              "Give me a simple activity to improve my focus.",
          },
          {
            icon: "📊",
            label:
              "My progress",
            prompt:
              "Give me suggestions to improve my cognitive training progress.",
          },
        ];


  return (
    <div className="page ai-page">

      {/* HEADER */}

      <div className="ai-header">

        <div className="ai-avatar">
          🤖
        </div>

        <div>

          <p className="small-title">
            {language === "Hindi"
              ? "AI सहायक"
              : "AI COMPANION"}
          </p>

          <h1>
            {language === "Hindi"
              ? "MindCare AI से बात करें।"
              : "Talk with MindCare AI."}
          </h1>

          <p className="description">
            {language === "Hindi"
              ? "याददाश्त, रोज़ की दिनचर्या और मानसिक अभ्यास के लिए आपका मित्रवत AI साथी।"
              : "A friendly companion for memory support, daily routines and cognitive wellness activities."}
          </p>

        </div>

      </div>


      {/* LANGUAGE */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >

        <div>

          <p
            style={{
              margin:
                "0 0 5px",
              fontWeight: "700",
            }}
          >
            🌐{" "}
            {language === "Hindi"
              ? "भाषा चुनें"
              : "Select Language"}
          </p>

          <span
            style={{
              fontSize: "13px",
              color: "#777",
            }}
          >
            {language === "Hindi"
              ? "AI के लिए अपनी पसंदीदा भाषा चुनें"
              : "Choose your preferred AI language"}
          </span>

        </div>


        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button
            type="button"
            className={
              language ===
              "English"
                ? "primary-btn"
                : "secondary-btn"
            }
            onClick={() =>
              changeLanguage(
                "English"
              )
            }
          >
            🇬🇧 English
          </button>


          <button
            type="button"
            className={
              language ===
              "Hindi"
                ? "primary-btn"
                : "secondary-btn"
            }
            onClick={() =>
              changeLanguage(
                "Hindi"
              )
            }
          >
            🇮🇳 हिंदी
          </button>

        </div>

      </div>


      {/* CHAT */}

      <div className="ai-chat-card">

        <div className="ai-status">

          <span className="status-dot"></span>

          {language === "Hindi"
            ? "MindCare AI तैयार है"
            : "MindCare AI is ready"}

        </div>


        <div className="ai-messages">

          {messages.map(
            (message, index) => (

              <div
                key={index}
                className={
                  message.sender ===
                  "user"
                    ? "ai-message user-message"
                    : "ai-message"
                }
              >

                <div className="message-avatar">
                  {message.sender ===
                  "user"
                    ? "👤"
                    : "🤖"}
                </div>


                <div
                  className="message-bubble"
                  style={{
                    position:
                      "relative",
                  }}
                >

                  {message.text}


                  {message.sender ===
                    "ai" && (

                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          message.text
                        )
                      }
                      title={
                        language ===
                        "Hindi"
                          ? "सुनें"
                          : "Listen"
                      }
                      style={{
                        marginLeft:
                          "10px",
                        border:
                          "none",
                        background:
                          "transparent",
                        cursor:
                          "pointer",
                        fontSize:
                          "16px",
                      }}
                    >
                      🔊
                    </button>

                  )}

                </div>

              </div>

            )
          )}


          {loading && (

            <div className="ai-message">

              <div className="message-avatar">
                🤖
              </div>

              <div className="message-bubble">

                {language === "Hindi"
                  ? "सोच रहा हूँ..."
                  : "Thinking..."}

              </div>

            </div>

          )}

        </div>


        {/* INPUT */}

        <form
          className="ai-input-area"
          onSubmit={sendMessage}
        >

          <button
            type="button"
            className="voice-btn"
            onClick={
              startVoiceInput
            }
            disabled={
              !speechSupported
            }
            title={
              isListening
                ? language ===
                  "Hindi"
                  ? "सुनना बंद करें"
                  : "Stop listening"
                : language ===
                  "Hindi"
                ? "वॉइस इनपुट शुरू करें"
                : "Start voice input"
            }
            style={{
              background:
                isListening
                  ? "#e9dafa"
                  : "",
            }}
          >

            {isListening
              ? "🔴"
              : "🎤"}

          </button>


          <input
            type="text"
            placeholder={
              language ===
              "Hindi"
                ? "अपना संदेश लिखें या 🎤 दबाकर बोलें..."
                : "Type your message or press 🎤 to speak..."
            }
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
          />


          <button
            type="submit"
            className="send-btn"
            disabled={loading}
          >
            ➤
          </button>

        </form>


        {/* VOICE STATUS */}

        {isListening && (

          <div
            style={{
              textAlign:
                "center",
              padding:
                "10px",
              color:
                "#74539f",
              fontSize:
                "13px",
              fontWeight:
                "600",
            }}
          >

            🎤{" "}

            {language ===
            "Hindi"
              ? "सुन रहा हूँ... बोलिए"
              : "Listening... Speak now"}

          </div>

        )}

      </div>


      {/* QUICK PROMPTS */}

      <div className="ai-suggestions">

        <span className="card-label">

          {language === "Hindi"
            ? "त्वरित सुझाव"
            : "QUICK PROMPTS"}

        </span>


        <div className="ai-prompt-grid">

          {quickPrompts.map(
            (item, index) => (

              <button
                type="button"
                key={index}
                onClick={() =>
                  setInput(
                    item.prompt
                  )
                }
              >
                {item.icon}{" "}
                {item.label}
              </button>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default AICompanion;