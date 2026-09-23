import { useEffect, useRef, useState } from "react";

function getSettings(difficulty) {
  if (difficulty === "Hard") {
    return {
      minWait: 500,
      maxWait: 2200,
      totalRounds: 12,
    };
  }

  if (difficulty === "Moderate") {
    return {
      minWait: 700,
      maxWait: 3000,
      totalRounds: 10,
    };
  }

  return {
    minWait: 900,
    maxWait: 4000,
    totalRounds: 8,
  };
}

function getWaitTime(difficulty, round) {
  const settings = getSettings(difficulty);

  const minimum = Math.max(
    settings.minWait,
    settings.minWait - round * 30
  );

  const maximum = Math.max(
    minimum + 500,
    settings.maxWait - round * 80
  );

  return (
    Math.floor(
      Math.random() *
        (maximum - minimum + 1)
    ) + minimum
  );
}

function calculatePoints(time, round, difficulty) {
  let basePoints = 1200;

  if (difficulty === "Moderate") {
    basePoints = 1400;
  }

  if (difficulty === "Hard") {
    basePoints = 1600;
  }

  const speedPoints = Math.max(
    10,
    Math.floor(
      basePoints - time * 1.5
    )
  );

  const roundBonus = round * 10;

  return speedPoints + roundBonus;
}

function ReactionChallenge() {
  const [difficulty, setDifficulty] =
    useState("");

  const [gameStarted, setGameStarted] =
    useState(false);

  const [gameState, setGameState] =
    useState("waiting");

  const [startTime, setStartTime] =
    useState(null);

  const [reactionTime, setReactionTime] =
    useState(null);

  const [bestTime, setBestTime] =
    useState(null);

  const [round, setRound] =
    useState(1);

  const [score, setScore] =
    useState(0);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [scoreSaved, setScoreSaved] =
    useState(false);

  const gameStartTime =
    useRef(Date.now());

  const settings =
    getSettings(difficulty);

  const totalRounds =
    settings.totalRounds;

  /*
    START GAME
  */

  function startGame(selectedDifficulty) {
    const selectedSettings =
      getSettings(selectedDifficulty);

    setDifficulty(
      selectedDifficulty
    );

    setGameStarted(true);
    setGameState("waiting");
    setStartTime(null);
    setReactionTime(null);
    setBestTime(null);
    setRound(1);
    setScore(0);
    setElapsedTime(0);
    setScoreSaved(false);

    gameStartTime.current =
      Date.now();
  }

  /*
    TOTAL GAME TIMER
  */

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const timer = setInterval(() => {
      if (gameState !== "finished") {
        const seconds = Math.floor(
          (Date.now() -
            gameStartTime.current) /
            1000
        );

        setElapsedTime(seconds);
      }
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    gameStarted,
    gameState,
  ]);

  /*
    WAIT FOR SIGNAL
  */

  useEffect(() => {
    if (
      !gameStarted ||
      gameState !== "waiting"
    ) {
      return;
    }

    const delay =
      getWaitTime(
        difficulty,
        round
      );

    const timer = setTimeout(() => {
      setStartTime(Date.now());
      setGameState("ready");
    }, delay);

    return () =>
      clearTimeout(timer);
  }, [
    gameStarted,
    gameState,
    round,
    difficulty,
  ]);

  /*
    CLICK HANDLER
  */

  function handleClick() {
    if (gameState === "waiting") {
      setGameState("too-early");
      return;
    }

    if (gameState !== "ready") {
      return;
    }

    const time =
      Date.now() - startTime;

    setReactionTime(time);

    if (
      bestTime === null ||
      time < bestTime
    ) {
      setBestTime(time);
    }

    const points =
      calculatePoints(
        time,
        round,
        difficulty
      );

    setScore(
      (prev) => prev + points
    );

    setGameState("result");
  }

  /*
    NEXT ROUND
  */

  function nextRound() {
    if (round >= totalRounds) {
      setGameState("finished");
      return;
    }

    setRound(
      (prev) => prev + 1
    );

    setGameState("waiting");
    setReactionTime(null);
  }

  /*
    TRY AGAIN AFTER TOO EARLY
  */

  function tryAgain() {
    setReactionTime(null);
    setGameState("waiting");
  }

  /*
    SAVE SCORE
  */

  async function saveScore() {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token || scoreSaved) {
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
                "Reaction Challenge",

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
        "Reaction Challenge score saved ✅",
        {
          score,
          trainingTime:
            finalTime,
          bestReaction:
            bestTime,
          difficulty,
        }
      );
    } catch (error) {
      console.error(
        "Reaction Challenge score save error:",
        error
      );
    }
  }

  /*
    SAVE WHEN GAME FINISHES
  */

  useEffect(() => {
    if (
      gameState === "finished"
    ) {
      saveScore();
    }
  }, [gameState]);

  /*
    RESTART / CHANGE DIFFICULTY
  */

  function restartGame() {
    setDifficulty("");
    setGameStarted(false);

    setGameState("waiting");

    setStartTime(null);

    setReactionTime(null);

    setBestTime(null);

    setRound(1);

    setScore(0);

    setElapsedTime(0);

    setScoreSaved(false);
  }

  /*
    DIFFICULTY SELECTION SCREEN
  */

  if (!gameStarted) {
    return (
      <div className="game-page">

        <div className="game-complete">

          <div className="complete-icon">
            ⚡
          </div>

          <p className="small-title">
            MINDCARE COGNITIVE GAME
          </p>

          <h2>
            Choose Your Difficulty
          </h2>

          <p>
            Select a difficulty level
            before starting the
            Reaction Challenge.
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

  /*
    MAIN GAME
  */

  return (
    <div className="game-page">

      <div className="game-header">

        <div>

          <p className="small-title">
            ATTENTION GAME
          </p>

          <h1>
            Reaction Challenge
          </h1>

          <p className="description">
            Wait for the signal and
            react as quickly as
            possible.
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
            Round
          </span>

          <strong>
            {round}/{totalRounds}
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
            Best Time
          </span>

          <strong>
            {bestTime !== null
              ? `${bestTime} ms`
              : "--"}
          </strong>
        </div>

      </div>

      <div className="reaction-game">

        {gameState !==
          "finished" && (

          <button
            className={`reaction-zone ${gameState}`}
            onClick={
              handleClick
            }
          >

            {gameState ===
              "waiting" && (
              <>
                <span className="reaction-icon">
                  👀
                </span>

                <strong>
                  Wait for it...
                </strong>

                <small>
                  Don't click yet
                </small>
              </>
            )}

            {gameState ===
              "ready" && (
              <>
                <span className="reaction-icon">
                  ⚡
                </span>

                <strong>
                  CLICK NOW!
                </strong>

                <small>
                  React as quickly
                  as possible
                </small>
              </>
            )}

            {gameState ===
              "too-early" && (
              <>
                <span className="reaction-icon">
                  ❌
                </span>

                <strong>
                  Too Early!
                </strong>

                <small>
                  Wait for the
                  signal before
                  clicking.
                </small>
              </>
            )}

            {gameState ===
              "result" && (
              <>
                <span className="reaction-icon">
                  🎯
                </span>

                <strong>
                  {reactionTime} ms
                </strong>

                <small>
                  Round complete!
                </small>
              </>
            )}

          </button>

        )}

        {gameState ===
          "result" && (

          <div className="reaction-result">

            <h2>
              {reactionTime} ms
            </h2>

            <div className="reaction-score">

              +
              {calculatePoints(
                reactionTime,
                round,
                difficulty
              )}

              {" "}points

            </div>

            <p>
              {reactionTime <
              250
                ? "Excellent reaction!"
                : reactionTime <
                  400
                ? "Great reaction! Keep going."
                : reactionTime <
                  600
                ? "Good job! Try to react faster."
                : "Keep practicing to improve your speed."}
            </p>

            <button
              className="primary-btn"
              onClick={
                nextRound
              }
            >
              {round >=
              totalRounds
                ? "Finish Challenge →"
                : "Next Round →"}
            </button>

          </div>

        )}

        {gameState ===
          "too-early" && (

          <div className="reaction-result">

            <h2>
              Be patient!
            </h2>

            <p>
              Wait until the signal
              appears and then
              react as quickly as
              possible.
            </p>

            <button
              className="primary-btn"
              onClick={
                tryAgain
              }
            >
              Try Again
            </button>

          </div>

        )}

        {gameState ===
          "finished" && (

          <div className="game-complete">

            <div className="complete-icon">
              🏆
            </div>

            <h2>
              Challenge Complete!
            </h2>

            <p>
              You completed all{" "}
              <strong>
                {totalRounds}
              </strong>{" "}
              rounds.
            </p>

            <p>
              Final Score:{" "}
              <strong>
                {score}
              </strong>
            </p>

            <p>
              Best Reaction:{" "}
              <strong>
                {bestTime !== null
                  ? `${bestTime} ms`
                  : "--"}
              </strong>
            </p>

            <p>
              Training Time:{" "}
              <strong>
                {elapsedTime} seconds
              </strong>
            </p>

            <p>
              Your Reaction Challenge
              score and training time
              have been saved to your
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

export default ReactionChallenge;