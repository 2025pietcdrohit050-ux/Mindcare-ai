import { useEffect, useRef, useState } from "react";

const wordBank = [
  "Apple",
  "River",
  "Chair",
  "Moon",
  "Tiger",
  "Book",
  "Garden",
  "Cloud",
  "Bottle",
  "Star",
  "Train",
  "Flower",
  "House",
  "Ocean",
  "Camera",
  "Laptop",
  "Coffee",
  "Mountain",
  "Bridge",
  "Pencil",
  "Window",
  "Forest",
  "Guitar",
  "School",
  "Doctor",
  "Rocket",
  "Orange",
  "Mirror",
  "Rabbit",
  "Village",
  "Bicycle",
  "Castle",
  "Beach",
  "Planet",
  "Clock",
  "Umbrella",
  "Football",
  "Candle",
  "Library",
  "Airport",
  "Butterfly",
  "Keyboard",
  "Phone",
  "Tree",
  "Table",
  "Sun",
  "Rainbow",
  "Horse",
  "Pillow",
  "Temple",
  "Bus",
  "Car",
  "Map",
  "Leaf",
  "Drum",
  "Crown",
  "Ship",
  "Pen",
  "Lion",
  "Parrot",
  "Pizza",
  "Notebook",
  "Globe",
];

const uniqueWordBank = [...new Set(wordBank)];

function shuffle(array) {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}

function getSettings(difficulty) {
  if (difficulty === "Hard") {
    return {
      wordCount: 7,
      displayTime: 3500,
    };
  }

  if (difficulty === "Moderate") {
    return {
      wordCount: 5,
      displayTime: 4500,
    };
  }

  return {
    wordCount: 3,
    displayTime: 6000,
  };
}

function getWordCount(difficulty, level) {
  const settings =
    getSettings(difficulty);

  return Math.min(
    settings.wordCount +
      Math.floor((level - 1) / 2),
    10
  );
}

function getDisplayTime(
  difficulty,
  level,
  wordCount
) {
  const settings =
    getSettings(difficulty);

  let baseTime =
    settings.displayTime +
    wordCount * 250;

  if (difficulty === "Easy") {
    baseTime =
      baseTime -
      (level - 1) * 100;
  }

  if (difficulty === "Moderate") {
    baseTime =
      baseTime -
      (level - 1) * 150;
  }

  if (difficulty === "Hard") {
    baseTime =
      baseTime -
      (level - 1) * 200;
  }

  return Math.max(
    2500,
    baseTime
  );
}

function createRound(
  wordCount,
  usedWords
) {
  const available =
    uniqueWordBank.filter(
      (word) =>
        !usedWords.includes(word)
    );

  let sourceWords =
    available;

  if (
    sourceWords.length <
    wordCount
  ) {
    sourceWords =
      uniqueWordBank;
  }

  const newWords =
    shuffle(sourceWords).slice(
      0,
      wordCount
    );

  const distractorPool =
    uniqueWordBank.filter(
      (word) =>
        !newWords.includes(word)
    );

  const distractors =
    shuffle(
      distractorPool
    ).slice(
      0,
      wordCount
    );

  return {
    words: newWords,
    options: shuffle([
      ...newWords,
      ...distractors,
    ]),
  };
}

function WordRecall() {
  const [difficulty, setDifficulty] =
    useState("");

  const [gameStarted, setGameStarted] =
    useState(false);

  const usedWords = useRef([]);

  const gameStartTime =
    useRef(Date.now());

  const [words, setWords] =
    useState([]);

  const [options, setOptions] =
    useState([]);

  const [selectedWords, setSelectedWords] =
    useState([]);

  const [showWords, setShowWords] =
    useState(false);

  const [level, setLevel] =
    useState(1);

  const [score, setScore] =
    useState(0);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [message, setMessage] =
    useState(
      "Remember these words..."
    );

  const [gameOver, setGameOver] =
    useState(false);

  const [scoreSaved, setScoreSaved] =
    useState(false);

  const settings =
    getSettings(difficulty);

  /*
    START GAME
  */

  function startGame(
    selectedDifficulty
  ) {
    const firstWordCount =
      getWordCount(
        selectedDifficulty,
        1
      );

    const firstRound =
      createRound(
        firstWordCount,
        []
      );

    setDifficulty(
      selectedDifficulty
    );

    setGameStarted(true);

    usedWords.current =
      firstRound.words;

    setWords(
      firstRound.words
    );

    setOptions(
      firstRound.options
    );

    setSelectedWords([]);

    setLevel(1);

    setScore(0);

    setElapsedTime(0);

    setShowWords(true);

    setGameOver(false);

    setScoreSaved(false);

    setMessage(
      "Remember these words..."
    );

    gameStartTime.current =
      Date.now();
  }

  /*
    GAME TIMER
  */

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const timer =
      setInterval(() => {
        if (!gameOver) {
          const seconds =
            Math.floor(
              (Date.now() -
                gameStartTime.current) /
                1000
            );

          setElapsedTime(
            seconds
          );
        }
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    gameStarted,
    gameOver,
  ]);

  /*
    WORD DISPLAY TIMER
  */

  useEffect(() => {
    if (
      !gameStarted ||
      !showWords ||
      gameOver
    ) {
      return;
    }

    const displayTime =
      getDisplayTime(
        difficulty,
        level,
        words.length
      );

    const timer =
      setTimeout(() => {
        setShowWords(false);

        setMessage(
          "Select only the words you remember."
        );
      }, displayTime);

    return () =>
      clearTimeout(timer);
  }, [
    gameStarted,
    difficulty,
    level,
    words,
    showWords,
    gameOver,
  ]);

  /*
    WORD CLICK
  */

  function handleWordClick(word) {
    if (
      showWords ||
      gameOver
    ) {
      return;
    }

    if (
      selectedWords.includes(word)
    ) {
      setSelectedWords(
        (prev) =>
          prev.filter(
            (item) =>
              item !== word
          )
      );
    } else {
      setSelectedWords(
        (prev) => [
          ...prev,
          word,
        ]
      );
    }
  }

  /*
    CHECK ANSWER
  */

  function checkAnswer() {
    if (
      selectedWords.length === 0
    ) {
      setMessage(
        "Select the words you remember first."
      );

      return;
    }

    const correct =
      selectedWords.length ===
        words.length &&
      selectedWords.every(
        (word) =>
          words.includes(word)
      );

    if (correct) {
      const levelPoints =
        level * 20 +
        words.length * 5;

      setScore(
        (prev) =>
          prev + levelPoints
      );

      setMessage(
        `Perfect! +${levelPoints} points`
      );

      setTimeout(() => {
        const nextLevel =
          level + 1;

        if (
          nextLevel > 8
        ) {
          setGameOver(true);
          return;
        }

        const nextWordCount =
          getWordCount(
            difficulty,
            nextLevel
          );

        const nextRound =
          createRound(
            nextWordCount,
            usedWords.current
          );

        usedWords.current = [
          ...usedWords.current,
          ...nextRound.words,
        ];

        setWords(
          nextRound.words
        );

        setOptions(
          nextRound.options
        );

        setSelectedWords([]);

        setLevel(
          nextLevel
        );

        setShowWords(true);

        setMessage(
          "Remember these words..."
        );
      }, 900);
    } else {
      setMessage(
        "Some selected words were incorrect."
      );

      setGameOver(true);
    }
  }

  /*
    RESTART
  */

  function restartGame() {
    setDifficulty("");

    setGameStarted(false);

    usedWords.current = [];

    setWords([]);

    setOptions([]);

    setSelectedWords([]);

    setLevel(1);

    setScore(0);

    setElapsedTime(0);

    setShowWords(false);

    setGameOver(false);

    setScoreSaved(false);

    setMessage(
      "Remember these words..."
    );
  }

  /*
    SAVE SCORE
  */

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
                "Word Recall",

              score,

              time: finalTime,

              difficulty,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Word Recall score save failed"
        );
      }

      setScoreSaved(true);

      console.log(
        "Word Recall score saved ✅",
        {
          score,
          time: finalTime,
          difficulty,
        }
      );
    } catch (error) {
      console.error(
        "Word Recall score save error:",
        error
      );
    }
  }

  /*
    SAVE WHEN GAME ENDS
  */

  useEffect(() => {
    if (
      gameOver &&
      difficulty
    ) {
      saveScore();
    }
  }, [
    gameOver,
    difficulty,
  ]);

  /*
    DIFFICULTY SELECTION
  */

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
            Select a difficulty level
            before starting Word Recall.
          </p>

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap: "12px",

              width: "100%",

              maxWidth:
                "360px",

              margin:
                "20px auto 0",
            }}
          >

            <button
              className="primary-btn"
              onClick={() =>
                startGame(
                  "Easy"
                )
              }
            >
              🟢 Easy
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                startGame(
                  "Moderate"
                )
              }
            >
              🟡 Moderate
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                startGame(
                  "Hard"
                )
              }
            >
              🔴 Hard
            </button>

          </div>

        </div>

      </div>
    );
  }

  /*
    MAIN GAME
  */

  return (
    <div className="game-page">

      <div className="game-header">

        <div>

          <p className="small-title">
            MEMORY GAME ·{" "}
            {difficulty.toUpperCase()}
          </p>

          <h1>
            Word Recall
          </h1>

          <p className="description">
            Remember the words before
            they disappear, then identify
            them from the options.
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={
            restartGame
          }
        >
          Change Difficulty
        </button>

      </div>

      <div className="game-stats">

        <div>
          <span>
            Difficulty
          </span>

          <strong>
            {difficulty}
          </strong>
        </div>

        <div>
          <span>
            Level
          </span>

          <strong>
            {level}/8
          </strong>
        </div>

        <div>
          <span>
            Score
          </span>

          <strong>
            {score}
          </strong>
        </div>

        <div>
          <span>
            Words
          </span>

          <strong>
            {words.length}
          </strong>
        </div>

        <div>
          <span>
            Time
          </span>

          <strong>
            {elapsedTime}s
          </strong>
        </div>

      </div>

      <div className="word-game">

        <div className="word-message">

          <span>
            {showWords
              ? "👀"
              : "🧠"}
          </span>

          <h2>
            {message}
          </h2>

        </div>

        {showWords &&
          !gameOver && (

            <div className="word-display">

              {words.map(
                (word) => (
                  <div
                    className="word-card"
                    key={word}
                  >
                    {word}
                  </div>
                )
              )}

            </div>

          )}

        {!showWords &&
          !gameOver && (

            <>

              <p className="word-instruction">
                Select every word that
                appeared earlier.
              </p>

              <div className="word-options">

                {options.map(
                  (word) => (

                    <button
                      key={word}
                      className={
                        selectedWords.includes(
                          word
                        )
                          ? "word-option selected"
                          : "word-option"
                      }
                      onClick={() =>
                        handleWordClick(
                          word
                        )
                      }
                    >
                      {word}
                    </button>

                  )
                )}

              </div>

              <button
                className="primary-btn"
                onClick={
                  checkAnswer
                }
              >
                Check Answer →
              </button>

            </>

          )}

        {gameOver && (

          <div className="game-complete">

            <div className="complete-icon">
              {level >= 8
                ? "🏆"
                : "🧠"}
            </div>

            <h2>
              {level >= 8
                ? "Challenge Complete!"
                : "Good Attempt!"}
            </h2>

            <p>
              You reached level{" "}
              <strong>
                {level}
              </strong>.
            </p>

            <p>
              Final Score:{" "}
              <strong>
                {score}
              </strong>
            </p>

            <p>
              Training Time:{" "}
              <strong>
                {elapsedTime} seconds
              </strong>
            </p>

            <p>
              Difficulty:{" "}
              <strong>
                {difficulty}
              </strong>
            </p>

            <p>
              Your Word Recall score
              and training time have
              been saved to your
              MindCare progress.
            </p>

            <button
              className="primary-btn"
              onClick={
                restartGame
              }
            >
              Play Again
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default WordRecall;