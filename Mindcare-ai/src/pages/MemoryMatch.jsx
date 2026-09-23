import { useEffect, useState } from "react";

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
        "Memory Match score saved ✅"
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
            MINDCARE COGNITIVE GAME
          </p>

          <h2>
            Choose Your Difficulty
          </h2>

          <p>
            Select a difficulty level before starting
            your Memory Match challenge.
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
            MEMORY GAME
          </p>

          <h1>
            Memory Match
          </h1>

          <p className="description">
            Match all pairs and complete the
            cognitive memory challenge.
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
            Moves
          </span>

          <strong>
            {moves}
          </strong>
        </div>

        <div>
          <span>
            Time
          </span>

          <strong>
            {time}s
          </strong>
        </div>

        <div>
          <span>
            Pairs
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
            Excellent work!
          </h2>

          <p>
            You completed the{" "}
            <strong>
              {difficulty}
            </strong>{" "}
            Memory Match challenge in{" "}
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
            Your score has been saved to your
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