import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";

function getSettings(difficulty) {
  if (difficulty === "Hard") {
    return {
      startingLevel: 3,
      displayTime: 2200,
    };
  }

  if (difficulty === "Moderate") {
    return {
      startingLevel: 2,
      displayTime: 2600,
    };
  }

  return {
    startingLevel: 1,
    displayTime: 3000,
  };
}

function createSequence(level) {
  const length = Math.min(
    2 + level,
    8
  );

  return Array.from(
    { length },
    () =>
      Math.floor(
        Math.random() * 9
      ) + 1
  );
}

function SequenceRecall() {
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const tx = isHindi
    ? {
        cognitiveGame: "माइंडकेयर कॉग्निटिव गेम",
        chooseDifficulty: "कठिनाई चुनें",
        selectDifficulty:
          "{tx.gameTitle} शुरू करने से पहले कठिनाई स्तर चुनें।",
        easy: "आसान",
        moderate: "मध्यम",
        hard: "कठिन",
        memoryGame: "मेमोरी गेम",
        gameTitle: "Sequence Recall",
        description:
          "नंबरों का सही क्रम याद रखें और फिर उसे कीबोर्ड से दोहराएँ।",
        changeDifficulty: "कठिनाई बदलें",
        difficulty: "कठिनाई",
        level: "लेवल",
        score: "स्कोर",
        time: "समय",
        remember: "क्रम याद रखें...",
        typeSequence: "कीबोर्ड का उपयोग करके क्रम टाइप करें।",
        enterAll: "पहले सभी {count} नंबर दर्ज करें।",
        excellent: "बहुत बढ़िया! Sequence की लंबाई बढ़ गई।",
        correct: "सही! इस लेवल पर {count} राउंड बाकी हैं।",
        incorrect: "गलत क्रम।",
        typeNumbers: "नंबर टाइप करें...",
        keyboardHint: "अपने कीबोर्ड से नंबर टाइप करें",
        submitHint: "सबमिट करने के लिए Enter दबाएँ",
        delete: "← डिलीट",
        submit: "Sequence सबमिट करें ✓",
        goodAttempt: "अच्छा प्रयास!",
        reached: "आप लेवल {level} तक पहुँचे और आपका स्कोर {score} रहा।",
        trainingTime: "ट्रेनिंग समय: {time} सेकंड",
        saved:
          "आपका {tx.gameTitle} स्कोर और ट्रेनिंग समय MindCare प्रोग्रेस में सेव हो गया है।",
        tryAgain: "फिर से प्रयास करें",
      }
    : {
        cognitiveGame: "MINDCARE COGNITIVE GAME",
        chooseDifficulty: "Choose Your Difficulty",
        selectDifficulty:
          "Select a difficulty level before starting Sequence Recall.",
        easy: "Easy",
        moderate: "Moderate",
        hard: "Hard",
        memoryGame: "MEMORY GAME",
        gameTitle: "Sequence Recall",
        description:
          "Remember the numbers in the correct order, then reproduce them using your keyboard.",
        changeDifficulty: "Change Difficulty",
        difficulty: "Difficulty",
        level: "Level",
        score: "Score",
        time: "Time",
        remember: "Remember the sequence...",
        typeSequence: "Type the sequence using your keyboard.",
        enterAll: "Enter all {count} numbers first.",
        excellent: "Excellent! Sequence length increased.",
        correct: "Correct! {count} rounds remaining at this level.",
        incorrect: "Incorrect sequence.",
        typeNumbers: "Type numbers...",
        keyboardHint: "Type numbers using your keyboard",
        submitHint: "Press Enter to submit",
        delete: "← Delete",
        submit: "Submit Sequence ✓",
        goodAttempt: "Good attempt!",
        reached: "You reached level {level} with a score of {score}.",
        trainingTime: "Training time: {time} seconds",
        saved:
          "Your Sequence Recall score and training time have been saved to your MindCare progress.",
        tryAgain: "Try Again",
      };

  const [difficulty, setDifficulty] =
    useState("");

  const [level, setLevel] =
    useState(1);

  const [levelRounds, setLevelRounds] =
    useState(0);

  const [sequence, setSequence] =
    useState([]);

  const [userSequence, setUserSequence] =
    useState([]);

  const [showSequence, setShowSequence] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [gameOver, setGameOver] =
    useState(false);

  const [scoreSaved, setScoreSaved] =
    useState(false);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [gameStarted, setGameStarted] =
    useState(false);

  const gameStartTime =
    useRef(Date.now());

  function startGame(
    selectedDifficulty
  ) {
    const settings =
      getSettings(
        selectedDifficulty
      );

    const startingLevel =
      settings.startingLevel;

    setDifficulty(
      selectedDifficulty
    );

    setLevel(
      startingLevel
    );

    setLevelRounds(0);

    setSequence(
      createSequence(
        startingLevel
      )
    );

    setUserSequence([]);

    setScore(0);

    setElapsedTime(0);

    setMessage(tx.remember);

    setShowSequence(true);

    setGameOver(false);

    setScoreSaved(false);

    setGameStarted(true);

    gameStartTime.current =
      Date.now();
  }

  useEffect(() => {
    if (
      !gameStarted ||
      gameOver
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        const seconds =
          Math.floor(
            (Date.now() -
              gameStartTime.current) /
              1000
          );

        setElapsedTime(
          seconds
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    gameStarted,
    gameOver,
  ]);

  useEffect(() => {
    if (
      !gameStarted ||
      !showSequence ||
      gameOver
    ) {
      return;
    }

    const settings =
      getSettings(
        difficulty
      );

    const displayTime =
      Math.max(
        1800,
        settings.displayTime -
          (level -
            settings.startingLevel) *
            100
      );

    const timer =
      setTimeout(() => {
        setShowSequence(false);

        setMessage(tx.typeSequence);
      }, displayTime);

    return () =>
      clearTimeout(timer);
  }, [
    gameStarted,
    showSequence,
    difficulty,
    level,
    gameOver,
  ]);

  function addNumber(number) {
    if (
      showSequence ||
      gameOver
    ) {
      return;
    }

    if (
      userSequence.length >=
      sequence.length
    ) {
      return;
    }

    setUserSequence(
      (prev) => [
        ...prev,
        number,
      ]
    );
  }

  function removeLastNumber() {
    if (
      showSequence ||
      gameOver
    ) {
      return;
    }

    setUserSequence(
      (prev) =>
        prev.slice(0, -1)
    );
  }

  function submitSequence() {
    if (
      showSequence ||
      gameOver
    ) {
      return;
    }

    if (
      userSequence.length !==
      sequence.length
    ) {
      setMessage(
        tx.enterAll.replace("{count}", sequence.length)
      );

      return;
    }

    const correct =
      userSequence.every(
        (value, index) =>
          value ===
          sequence[index]
      );

    if (correct) {
      const levelScore =
        level * 15;

      const newScore =
        score + levelScore;

      setScore(
        newScore
      );

      const nextRound =
        levelRounds + 1;

      if (
        nextRound >= 4
      ) {
        setMessage(tx.excellent);
      } else {
        setMessage(
          tx.correct.replace("{count}", 4 - nextRound)
        );
      }

      setTimeout(() => {
        let nextLevel =
          level;

        let nextLevelRounds =
          nextRound;

        if (
          nextRound >= 4
        ) {
          nextLevel =
            Math.min(
              level + 1,
              8
            );

          nextLevelRounds =
            0;
        }

        setLevel(
          nextLevel
        );

        setLevelRounds(
          nextLevelRounds
        );

        setSequence(
          createSequence(
            nextLevel
          )
        );

        setUserSequence([]);

        setShowSequence(
          true
        );
      }, 1000);

    } else {
      setMessage(tx.incorrect);

      setGameOver(
        true
      );
    }
  }

  useEffect(() => {
    function handleKeyboard(
      event
    ) {
      if (
        !gameStarted ||
        showSequence ||
        gameOver
      ) {
        return;
      }

      if (
        /^[1-9]$/.test(
          event.key
        )
      ) {
        addNumber(
          Number(event.key)
        );
      }

      if (
        event.key ===
        "Backspace"
      ) {
        removeLastNumber();
      }

      if (
        event.key ===
        "Enter"
      ) {
        submitSequence();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    gameStarted,
    showSequence,
    gameOver,
    userSequence,
    sequence,
  ]);

  async function saveScore() {
    const token =
      localStorage.getItem(
        "token"
      );

    if (
      !token ||
      scoreSaved
    ) {
      return;
    }

    const finalTime =
      Math.max(
        1,
        Math.floor(
          (Date.now() -
            gameStartTime.current) /
            1000
        )
      );

    try {
      const response =
        await fetch(
          "https://mindcare-ai-hesy.onrender.com/api/scores",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              game:
                "Sequence Recall",

              score,

              time:
                finalTime,

              difficulty,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Score save failed"
        );
      }

      setScoreSaved(
        true
      );

      console.log(
        "Sequence Recall score saved ✅",
        {
          score,
          time: finalTime,
          difficulty,
        }
      );

    } catch (error) {
      console.error(
        "Sequence Recall score save error:",
        error
      );
    }
  }

  useEffect(() => {
    if (gameOver) {
      saveScore();
    }
  }, [gameOver]);

  function restartGame() {
    setDifficulty("");

    setLevel(1);

    setLevelRounds(0);

    setSequence([]);

    setUserSequence([]);

    setScore(0);

    setElapsedTime(0);

    setMessage("");

    setShowSequence(false);

    setGameOver(false);

    setScoreSaved(false);

    setGameStarted(false);
  }

  if (!gameStarted) {
    return (
      <div className="game-page">

        <div className="game-complete">

          <div className="complete-icon">
            🧠
          </div>

          <p className="small-title">
            {tx.cognitiveGame}
          </p>

          <h2>
            {tx.chooseDifficulty}
          </h2>

          <p>
            {tx.selectDifficulty}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              maxWidth: "360px",
              margin:
                "20px auto 0",
            }}
          >

            <button
              className="primary-btn"
              onClick={() =>
                startGame("Easy")
              }
            >
              🟢 {tx.easy}
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                startGame(
                  "Moderate"
                )
              }
            >
              🟡 {tx.moderate}
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                startGame("Hard")
              }
            >
              🔴 {tx.hard}
            </button>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="game-page">

      <div className="game-header">

        <div>

          <p className="small-title">
            {tx.memoryGame}
          </p>

          <h1>
            {tx.gameTitle}
          </h1>

          <p className="description">
            {tx.description}
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={
            restartGame
          }
        >
          {tx.changeDifficulty}
        </button>

      </div>

      <div className="game-stats">

        <div>
          <span>
            {tx.difficulty}
          </span>

          <strong>
            {difficulty}
          </strong>
        </div>

        <div>
          <span>
            {tx.level}
          </span>

          <strong>
            {level}
          </strong>
        </div>

        <div>
          <span>
            {tx.score}
          </span>

          <strong>
            {score}
          </strong>
        </div>

        <div>
          <span>
            {tx.time}
          </span>

          <strong>
            {elapsedTime}s
          </strong>
        </div>

      </div>

      <div className="sequence-game">

        <div className="sequence-message">

          <span>
            {showSequence
              ? "👀"
              : "⌨️"}
          </span>

          <h2>
            {message}
          </h2>

        </div>

        <div className="sequence-display">

          {showSequence ? (

            sequence.map(
              (
                number,
                index
              ) => (
                <div
                  className="sequence-number"
                  key={index}
                >
                  {number}
                </div>
              )
            )

          ) : (

            <div className="typed-sequence">

              {userSequence.length >
              0
                ? userSequence.map(
                    (
                      number,
                      index
                    ) => (
                      <div
                        className="sequence-number"
                        key={index}
                      >
                        {number}
                      </div>
                    )
                  )
                : (
                  <div className="hidden-sequence">
                    {tx.typeNumbers}
                  </div>
                )}

            </div>

          )}

        </div>

        {!showSequence &&
          !gameOver && (
            <>

              <div className="keyboard-hint">

                <span>
                  ⌨️
                </span>

                Type numbers using
                your keyboard

                <strong>
                  1–9
                </strong>

                <span>
                  ·
                </span>

                Press{" "}
                <strong>
                  Enter
                </strong>{" "}
                to submit

              </div>

              <div className="number-grid">

                {[
                  1,2,3,4,5,
                  6,7,8,9
                ].map(
                  (number) => (
                    <button
                      key={number}
                      className="number-btn"
                      onClick={() =>
                        addNumber(
                          number
                        )
                      }
                    >
                      {number}
                    </button>
                  )
                )}

              </div>

              <div className="sequence-actions">

                <button
                  className="secondary-btn"
                  onClick={
                    removeLastNumber
                  }
                  disabled={
                    userSequence.length ===
                    0
                  }
                >
                  {tx.delete}
                </button>

                <button
                  className="primary-btn"
                  onClick={
                    submitSequence
                  }
                  disabled={
                    userSequence.length !==
                    sequence.length
                  }
                >
                  {tx.submit}
                </button>

              </div>

            </>
          )}

        {gameOver && (

          <div className="game-complete">

            <div className="complete-icon">
              🧠
            </div>

            <h2>
              {tx.goodAttempt}
            </h2>

            <p>
              {tx.reached
                .replace("{level}", level)
                .replace("{score}", score)}
            </p>

            <p>
              {tx.trainingTime.replace("{time}", elapsedTime)}
            </p>

            <p>
              {tx.saved}
            </p>

            <button
              className="primary-btn"
              onClick={
                restartGame
              }
            >
              {tx.tryAgain}
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default SequenceRecall;