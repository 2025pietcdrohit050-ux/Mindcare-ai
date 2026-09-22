import { useEffect, useRef, useState } from "react";

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
  const length = Math.min(2 + level, 8);

  return Array.from(
    { length },
    () => Math.floor(Math.random() * 9) + 1
  );
}

function SequenceRecall() {
  const [difficulty, setDifficulty] = useState("");
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [showSequence, setShowSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const gameStartTime = useRef(Date.now());

  function startGame(selectedDifficulty) {
    const settings = getSettings(selectedDifficulty);
    const startingLevel = settings.startingLevel;

    setDifficulty(selectedDifficulty);
    setLevel(startingLevel);
    setSequence(createSequence(startingLevel));
    setUserSequence([]);
    setScore(0);
    setElapsedTime(0);
    setMessage("Remember the sequence...");
    setShowSequence(true);
    setGameOver(false);
    setScoreSaved(false);
    setGameStarted(true);

    gameStartTime.current = Date.now();
  }

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    const timer = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - gameStartTime.current) / 1000
      );

      setElapsedTime(seconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || !showSequence || gameOver) {
      return;
    }

    const settings = getSettings(difficulty);

    const displayTime = Math.max(
      1800,
      settings.displayTime - (level - settings.startingLevel) * 100
    );

    const timer = setTimeout(() => {
      setShowSequence(false);
      setMessage(
        "Type the sequence using your keyboard."
      );
    }, displayTime);

    return () => clearTimeout(timer);
  }, [
    gameStarted,
    showSequence,
    difficulty,
    level,
    gameOver,
  ]);

  function addNumber(number) {
    if (showSequence || gameOver) {
      return;
    }

    if (userSequence.length >= sequence.length) {
      return;
    }

    setUserSequence((prev) => [
      ...prev,
      number,
    ]);
  }

  function removeLastNumber() {
    if (showSequence || gameOver) {
      return;
    }

    setUserSequence((prev) =>
      prev.slice(0, -1)
    );
  }

  function submitSequence() {
    if (showSequence || gameOver) {
      return;
    }

    if (userSequence.length !== sequence.length) {
      setMessage(
        `Enter all ${sequence.length} numbers first.`
      );
      return;
    }

    const correct = userSequence.every(
      (value, index) =>
        value === sequence[index]
    );

    if (correct) {
      const levelScore =
        level * 15;

      const newScore =
        score + levelScore;

      setScore(newScore);

      setMessage(
        "Correct! Get ready for the next level."
      );

      setTimeout(() => {
        const nextLevel =
          Math.min(level + 1, 8);

        setLevel(nextLevel);
        setSequence(
          createSequence(nextLevel)
        );
        setUserSequence([]);
        setShowSequence(true);
      }, 1000);
    } else {
      setMessage(
        "Incorrect sequence."
      );
      setGameOver(true);
    }
  }

  useEffect(() => {
    function handleKeyboard(event) {
      if (
        !gameStarted ||
        showSequence ||
        gameOver
      ) {
        return;
      }

      if (/^[1-9]$/.test(event.key)) {
        addNumber(
          Number(event.key)
        );
      }

      if (event.key === "Backspace") {
        removeLastNumber();
      }

      if (event.key === "Enter") {
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
      localStorage.getItem("token");

    if (!token || scoreSaved) {
      return;
    }

    const finalTime = Math.max(
      1,
      Math.floor(
        (Date.now() -
          gameStartTime.current) /
          1000
      )
    );

    try {
      const response = await fetch(
        "https://mindcare-ai-hesy.onrender.com/api/scores",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            game: "Sequence Recall",
            score,
            time: finalTime,
            difficulty,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Score save failed"
        );
      }

      setScoreSaved(true);

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
            MINDCARE COGNITIVE GAME
          </p>

          <h2>
            Choose Your Difficulty
          </h2>

          <p>
            Select a difficulty level before
            starting Sequence Recall.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              maxWidth: "360px",
              margin: "20px auto 0",
            }}
          >

            <button
              className="primary-btn"
              onClick={() =>
                startGame("Easy")
              }
            >
              🟢 Easy
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                startGame("Moderate")
              }
            >
              🟡 Moderate
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                startGame("Hard")
              }
            >
              🔴 Hard
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
            MEMORY GAME
          </p>

          <h1>
            Sequence Recall
          </h1>

          <p className="description">
            Remember the numbers in the
            correct order, then reproduce
            them using your keyboard.
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={restartGame}
        >
          Change Difficulty
        </button>

      </div>

      <div className="game-stats">

        <div>
          <span>Difficulty</span>
          <strong>
            {difficulty}
          </strong>
        </div>

        <div>
          <span>Level</span>
          <strong>
            {level}
          </strong>
        </div>

        <div>
          <span>Score</span>
          <strong>
            {score}
          </strong>
        </div>

        <div>
          <span>Time</span>
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
              (number, index) => (
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

              {userSequence.length > 0
                ? userSequence.map(
                    (number, index) => (
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
                    Type numbers...
                  </div>
                )}

            </div>

          )}

        </div>

        {!showSequence &&
          !gameOver && (
            <>

              <div className="keyboard-hint">

                <span>⌨️</span>

                Type numbers using
                your keyboard

                <strong>
                  1–9
                </strong>

                <span>·</span>

                Press{" "}
                <strong>
                  Enter
                </strong>{" "}
                to submit

              </div>

              <div className="number-grid">

                {[1,2,3,4,5,6,7,8,9].map(
                  (number) => (
                    <button
                      key={number}
                      className="number-btn"
                      onClick={() =>
                        addNumber(number)
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
                  ← Delete
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
                  Submit Sequence ✓
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
              Good attempt!
            </h2>

            <p>
              You reached level{" "}
              <strong>
                {level}
              </strong>{" "}
              with a score of{" "}
              <strong>
                {score}
              </strong>.
            </p>

            <p>
              Training time:{" "}
              <strong>
                {elapsedTime} seconds
              </strong>
            </p>

            <p>
              Your Sequence Recall score
              and training time have been
              saved to your MindCare
              progress.
            </p>

            <button
              className="primary-btn"
              onClick={restartGame}
            >
              Try Again
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default SequenceRecall;