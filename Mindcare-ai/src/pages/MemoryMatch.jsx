import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

const cardValues = [
  "🧠",
  "🎯",
  "🌟",
  "🍀",
  "🚀",
  "🎨",
  "🎵",
  "⚡",
];

function shuffleCards(values) {
  const pairValues = [...values, ...values];

  return pairValues
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      matched: false,
    }));
}

function getCardsForDifficulty(difficulty) {
  if (difficulty === "Hard") {
    return cardValues.slice(0, 7);
  }

  if (difficulty === "Moderate") {
    return cardValues.slice(0, 5);
  }

  return cardValues.slice(0, 3);
}

function MemoryMatch() {
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const tx = isHindi
    ? {
        gameTitle: "मेमोरी मैच",
        cognitiveGame: "माइंडकेयर कॉग्निटिव गेम",
        chooseDifficulty: "कठिनाई चुनें",
        selectDifficulty:
          "मेमोरी मैच शुरू करने से पहले कठिनाई स्तर चुनें।",
        easy: "आसान",
        moderate: "मध्यम",
        hard: "कठिन",
        memoryGame: "मेमोरी गेम",
        description:
          "सभी जोड़ियों को मिलाकर संज्ञानात्मक मेमोरी चुनौती पूरी करें।",
        changeDifficulty: "कठिनाई बदलें",
        difficulty: "कठिनाई",
        moves: "चालें",
        time: "समय",
        pairs: "जोड़ियाँ",
        excellent: "बहुत बढ़िया!",
        completed:
          "आपने यह मेमोरी मैच चुनौती पूरी कर ली।",
        scoreSaved:
          "आपका स्कोर MindCare प्रगति में सेव हो गया है।",
        playAgain: "फिर से खेलें",
      }
    : {
        gameTitle: "Memory Match",
        cognitiveGame: "MindCare Cognitive Game",
        chooseDifficulty: "Choose Difficulty",
        selectDifficulty:
          "Select a difficulty level before starting your Memory Match challenge.",
        easy: "Easy",
        moderate: "Moderate",
        hard: "Hard",
        memoryGame: "Memory Game",
        description:
          "Match all pairs and complete the cognitive memory challenge.",
        changeDifficulty: "Change Difficulty",
        difficulty: "Difficulty",
        moves: "Moves",
        time: "Time",
        pairs: "Pairs",
        excellent: "Excellent!",
        completed:
          "You completed the Memory Match challenge.",
        scoreSaved:
          "Your score has been saved to your MindCare progress.",
        playAgain: "Play Again",
      };

  const [difficulty, setDifficulty] = useState("");
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  function startGame(selectedDifficulty) {
    const values =
      getCardsForDifficulty(
        selectedDifficulty
      );

    setDifficulty(selectedDifficulty);
    setCards(shuffleCards(values));
    setSelected([]);
    setMoves(0);
    setTime(0);
    setScoreSaved(false);
    setGameStarted(true);
  }

  useEffect(() => {
    if (
      !gameStarted ||
      cards.length === 0
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setTime(
          (prev) => prev + 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    gameStarted,
    cards.length,
  ]);

  useEffect(() => {
    if (selected.length !== 2) {
      return;
    }

    const first = cards.find(
      (card) =>
        card.id === selected[0]
    );

    const second = cards.find(
      (card) =>
        card.id === selected[1]
    );

    if (!first || !second) {
      return;
    }

    setMoves(
      (prev) => prev + 1
    );

    if (
      first.value ===
      second.value
    ) {
      setTimeout(() => {
        setCards(
          (prev) =>
            prev.map((card) =>
              selected.includes(
                card.id
              )
                ? {
                    ...card,
                    matched: true,
                  }
                : card
            )
        );

        setSelected([]);
      }, 400);
    } else {
      setTimeout(() => {
        setSelected([]);
      }, 900);
    }
  }, [
    selected,
    cards,
  ]);

  async function saveScore(
    finalMoves,
    finalTime
  ) {
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

    const pairCount =
      cards.length / 2;

    const baseScore =
      difficulty === "Hard"
        ? 260
        : difficulty ===
          "Moderate"
        ? 230
        : 200;

    const score =
      Math.max(
        baseScore -
          finalMoves * 7 -
          finalTime * 2 +
          pairCount * 5,
        10
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
                "Memory Match",
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
        "{tx.gameTitle} score saved ✅"
      );
    } catch (error) {
      console.error(
        "Score save error:",
        error
      );
    }
  }

  const completed =
    cards.length > 0 &&
    cards.every(
      (card) => card.matched
    );

  useEffect(() => {
    if (
      completed &&
      !scoreSaved &&
      cards.length > 0
    ) {
      saveScore(
        moves,
        time
      );
    }
  }, [
    completed,
    scoreSaved,
    moves,
    time,
    cards.length,
    difficulty,
  ]);

  function handleCardClick(
    index
  ) {
    if (
      selected.length === 2
    ) {
      return;
    }

    if (
      selected.includes(
        cards[index]?.id
      )
    ) {
      return;
    }

    const card =
      cards[index];

    if (
      !card ||
      card.matched
    ) {
      return;
    }

    setSelected(
      (prev) => [
        ...prev,
        card.id,
      ]
    );
  }

  function restartGame() {
    setDifficulty("");
    setCards([]);
    setSelected([]);
    setMoves(0);
    setTime(0);
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

  const pairCount =
    cards.length / 2;

  const matchedPairs =
    cards.filter(
      (card) =>
        card.matched
    ).length / 2;

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
            {tx.moves}
          </span>

          <strong>
            {moves}
          </strong>
        </div>

        <div>
          <span>
            {tx.time}
          </span>

          <strong>
            {time}s
          </strong>
        </div>

        <div>
          <span>
            {tx.pairs}
          </span>

          <strong>
            {matchedPairs}/
            {pairCount}
          </strong>
        </div>

      </div>

      {completed ? (

        <div className="game-complete">

          <div className="complete-icon">
            🎉
          </div>

          <h2>
            {tx.excellent}
          </h2>

          <p>
            {tx.completed}{" "}
            <strong>
              {difficulty}
            </strong>{" "}
            {tx.gameTitle} challenge in{" "}
            <strong>
              {moves}
            </strong>{" "}
            moves and{" "}
            <strong>
              {time}
            </strong>{" "}
            seconds.
          </p>

          <p>
            {tx.scoreSaved}
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

      ) : (

        <div
          className="memory-board"
          style={{
            gridTemplateColumns:
              "repeat(4, 1fr)",
          }}
        >

          {cards.map(
            (card, index) => {

              const isOpen =
                selected.includes(
                  card.id
                ) ||
                card.matched;

              return (
                <button
                  key={
                    card.id
                  }
                  className={`memory-card ${
                    isOpen
                      ? "open"
                      : ""
                  } ${
                    card.matched
                      ? "matched"
                      : ""
                  }`}
                  onClick={() =>
                    handleCardClick(
                      index
                    )
                  }
                >
                  {isOpen
                    ? card.value
                    : "?"}
                </button>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}

export default MemoryMatch;