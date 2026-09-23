import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";

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
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const tx = isHindi
    ? {
        cognitiveGame: "माइंडकेयर कॉग्निटिव गेम",
        chooseDifficulty: "कठिनाई चुनें",
        selectDifficulty:
          "Word Recall शुरू करने से पहले कठिनाई स्तर चुनें।",
        easy: "आसान",
        moderate: "मध्यम",
        hard: "कठिन",
        memoryGame: "मेमोरी गेम",
        gameTitle: "Word Recall",
        description:
          "शब्दों के गायब होने से पहले उन्हें याद करें, फिर विकल्पों में से उन्हें पहचानें।",
        changeDifficulty: "कठिनाई बदलें",
        difficulty: "कठिनाई",
        level: "लेवल",
        score: "स्कोर",
        words: "शब्द",
        time: "समय",
        rememberWords: "इन शब्दों को याद रखें...",
        selectRemembered:
          "केवल वही शब्द चुनें जो आपको याद हैं।",
        selectFirst:
          "पहले वे शब्द चुनें जो आपको याद हैं।",
        perfect: "बहुत बढ़िया! +{points} पॉइंट्स",
        incorrect: "कुछ चुने गए शब्द गलत थे।",
        selectEvery:
          "पहले दिखाई दिए हर शब्द को चुनें।",
        checkAnswer: "उत्तर जांचें →",
        challengeComplete: "चैलेंज पूरा!",
        goodAttempt: "अच्छा प्रयास!",
        reachedLevel: "आप लेवल {level} तक पहुँचे।",
        finalScore: "अंतिम स्कोर",
        trainingTime: "ट्रेनिंग समय",
        difficultyLabel: "कठिनाई",
        saved:
          "आपका Word Recall स्कोर और ट्रेनिंग समय MindCare प्रोग्रेस में सेव हो गया है।",
        playAgain: "फिर से खेलें",
      }
    : {
        cognitiveGame: "{tx.cognitiveGame}",
        chooseDifficulty: "{tx.chooseDifficulty}",
        selectDifficulty:
          "Select a difficulty level before starting Word Recall.",
        easy: "Easy",
        moderate: "Moderate",
        hard: "Hard",
        memoryGame: "MEMORY GAME",
        gameTitle: "Word Recall",
        description:
          "Remember the words before they disappear, then identify them from the options.",
        changeDifficulty: "{tx.changeDifficulty}",
        difficulty: "Difficulty",
        level: "Level",
        score: "Score",
        words: "Words",
        time: "Time",
        rememberWords: tx.rememberWords,
        selectRemembered: tx.selectRemembered,
        selectFirst: tx.selectFirst,
        perfect: "Perfect! +{points} points",
        incorrect: tx.incorrect,
        selectEvery: "Select every word that appeared earlier.",
        checkAnswer: "{tx.checkAnswer}",
        challengeComplete: "Challenge Complete!",
        goodAttempt: "Good Attempt!",
        reachedLevel: "You reached level {level}.",
        finalScore: "Final Score",
        trainingTime: "Training Time",
        difficultyLabel: "Difficulty",
        saved:
          "Your Word Recall score and training time have been saved to your MindCare progress.",
        playAgain: "{tx.playAgain}",
      };

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
      tx.rememberWords
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
      tx.rememberWords
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
          tx.selectRemembered
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
        tx.selectFirst
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
        tx.perfect.replace("{points}", levelPoints)
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
          tx.rememberWords
        );
      }, 900);
    } else {
      setMessage(
        tx.incorrect
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
      tx.rememberWords
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
                startGame(
                  "Hard"
                )
              }
            >
              🔴 {tx.hard}
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
            {tx.memoryGame} ·{" "}
            {difficulty.toUpperCase()}
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
            {level}/8
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
            {tx.words}
          </span>

          <strong>
            {words.length}
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
                {tx.selectEvery}
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
                {tx.checkAnswer}
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
                ? tx.challengeComplete
                : tx.goodAttempt}
            </h2>

            <p>
              {tx.reachedLevel.replace("{level}", level)}
            </p>

            <p>
              {tx.finalScore}:{" "}
              <strong>
                {score}
              </strong>
            </p>

            <p>
              {tx.trainingTime}:{" "}
              <strong>
                {elapsedTime} seconds
              </strong>
            </p>

            <p>
              {tx.difficultyLabel}:{" "}
              <strong>
                {difficulty}
              </strong>
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
              {tx.playAgain}
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default WordRecall;