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
    return cardValues;
  }

  if (difficulty === "Moderate") {
    return cardValues.slice(0, 7);
  }

  return cardValues.slice(0, 6);
}

function MemoryMatch() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiReason, setAiReason] = useState("");

  /* ================================
     GET ADAPTIVE DIFFICULTY
  ================================= */

  async function loadAdaptiveDifficulty() {
    const token = localStorage.getItem("token");

    if (!token) {
      startGame("Easy");
      return;
    }

    try {
      const response = await fetch(
        "https://mindcare-ai-hesy.onrender.com/api/scores/adaptive/Memory%20Match",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Adaptive difficulty request failed");
      }

      const data = await response.json();

      const selectedDifficulty = data.difficulty || "Easy";

      setDifficulty(selectedDifficulty);
      setAiReason(data.reason || "");

      startGame(selectedDifficulty);
    } catch (error) {
      console.error(
        "Adaptive difficulty error:",
        error
      );

      startGame("Easy");
    }
  }

  /* ================================
     START GAME
  ================================= */

  function startGame(selectedDifficulty) {
    const values = getCardsForDifficulty(
      selectedDifficulty
    );

    setCards(shuffleCards(values));
    setSelected([]);
    setMoves(0);
    setTime(0);
    setScoreSaved(false);
    setLoading(false);
  }

  /* ================================
     LOAD AI DIFFICULTY
  ================================= */

  useEffect(() => {
    loadAdaptiveDifficulty();
  }, []);

  /* ================================
     TIMER
  ================================= */

  useEffect(() => {
    if (loading || cards.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, cards.length]);

  /* ================================
     CARD MATCHING
  ================================= */

  useEffect(() => {
    if (selected.length !== 2) return;

    const first = cards.find(
      (card) => card.id === selected[0]
    );

    const second = cards.find(
      (card) => card.id === selected[1]
    );

    if (!first || !second) return;

    setMoves((prev) => prev + 1);

    if (first.value === second.value) {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            selected.includes(card.id)
              ? { ...card, matched: true }
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
  }, [selected, cards]);

  /* ================================
     SAVE SCORE
  ================================= */

  async function saveScore(finalMoves, finalTime) {
    const token = localStorage.getItem("token");

    if (!token || scoreSaved) return;

    const pairCount = cards.length / 2;

    const baseScore =
      difficulty === "Hard"
        ? 260
        : difficulty === "Moderate"
        ? 230
        : 200;

    const score = Math.max(
      baseScore -
        finalMoves * 7 -
        finalTime * 2 +
        pairCount * 5,
      10
    );

    try {
      const response = await fetch(
        "https://mindcare-ai-hesy.onrender.com/api/scores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            game: "Memory Match",
            score,
            time: finalTime,
            difficulty,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Score save failed");
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

  /* ================================
     CHECK COMPLETION
  ================================= */

  const completed =
    cards.length > 0 &&
    cards.every((card) => card.matched);

  useEffect(() => {
    if (
      completed &&
      !scoreSaved &&
      cards.length > 0
    ) {
      saveScore(moves, time);
    }
  }, [
    completed,
    scoreSaved,
    moves,
    time,
    cards.length,
    difficulty,
  ]);

  /* ================================
     CARD CLICK
  ================================= */

  function handleCardClick(index) {
    if (selected.length === 2) return;
    if (selected.includes(index)) return;

    const card = cards[index];

    if (!card || card.matched) return;

    setSelected((prev) => [
      ...prev,
      card.id,
    ]);
  }

  /* ================================
     RESTART
  ================================= */

  function restartGame() {
    setLoading(true);
    loadAdaptiveDifficulty();
  }

  /* ================================
     LOADING SCREEN
  ================================= */

  if (loading) {
    return (
      <div className="game-page">

        <div className="game-complete">

          <div className="complete-icon">
            🧠
          </div>

          <h2>
            AI is preparing your challenge...
          </h2>

          <p>
            MindCare is checking your recent
            performance and selecting a suitable
            difficulty level.
          </p>

        </div>

      </div>
    );
  }

  const pairCount = cards.length / 2;

  const matchedPairs =
    cards.filter(
      (card) => card.matched
    ).length / 2;

  return (
    <div className="game-page">

      {/* GAME HEADER */}

      <div className="game-header">

        <div>

          <p className="small-title">
            MEMORY GAME · AI ADAPTIVE
          </p>

          <h1>
            Memory Match
          </h1>

          <p className="description">
            Match all pairs. MindCare AI
            automatically adjusts the challenge
            according to your recent performance.
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={restartGame}
        >
          Restart
        </button>

      </div>


      {/* AI INSIGHT */}

      {aiReason && (
        <div
          className="ai-insight"
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "14px",
            background: "#f7f2fc",
            border: "1px solid #e9def5",
            color: "#624b78",
          }}
        >
          🧠 <strong>MindCare AI:</strong>{" "}
          {aiReason}
        </div>
      )}


      {/* GAME STATS */}

      <div className="game-stats">

        <div>
          <span>AI Difficulty</span>
          <strong>
            {difficulty}
          </strong>
        </div>

        <div>
          <span>Moves</span>
          <strong>
            {moves}
          </strong>
        </div>

        <div>
          <span>Time</span>
          <strong>
            {time}s
          </strong>
        </div>

        <div>
          <span>Pairs</span>
          <strong>
            {matchedPairs}/{pairCount}
          </strong>
        </div>

      </div>


      {/* COMPLETED */}

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
            onClick={restartGame}
          >
            Play Again
          </button>

        </div>

      ) : (

        /* MEMORY BOARD */

        <div
          className="memory-board"
          style={{
            gridTemplateColumns:
              "repeat(4, 1fr)",
          }}
        >

          {cards.map((card, index) => {

            const isOpen =
              selected.includes(card.id) ||
              card.matched;

            return (

              <button
                key={card.id}
                className={`memory-card ${
                  isOpen ? "open" : ""
                } ${
                  card.matched
                    ? "matched"
                    : ""
                }`}
                onClick={() =>
                  handleCardClick(index)
                }
              >
                {isOpen
                  ? card.value
                  : "?"}
              </button>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default MemoryMatch;