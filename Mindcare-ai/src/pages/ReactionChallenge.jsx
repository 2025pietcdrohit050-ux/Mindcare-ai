import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";

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
  let basePoints = 120;

  if (difficulty === "Moderate") {
    basePoints = 140;
  }

  if (difficulty === "Hard") {
    basePoints = 160;
  }

  const speedPenalty = Math.floor(time / 20);

  const speedPoints = Math.max(
    20,
    basePoints - speedPenalty
  );

  const roundBonus = round * 2;

  return speedPoints + roundBonus;
}

function ReactionChallenge() {
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const tx = isHindi
    ? {
        cognitiveGame: "माइंडकेयर कॉग्निटिव गेम",
        chooseDifficulty: "कठिनाई चुनें",
        selectDifficulty: "Reaction Challenge शुरू करने से पहले कठिनाई स्तर चुनें।",
        easy: "आसान",
        moderate: "मध्यम",
        hard: "कठिन",
        attentionGame: "अटेंशन गेम",
        gameTitle: "Reaction Challenge",
        description: "सिग्नल का इंतज़ार करें और जितनी जल्दी हो सके प्रतिक्रिया दें।",
        changeDifficulty: "कठिनाई बदलें",
        difficultyLabel: "कठिनाई",
        roundLabel: "राउंड",
        scoreLabel: "स्कोर",
        bestTimeLabel: "सबसे अच्छा समय",
        wait: "इंतज़ार करें...",
        dontClick: "अभी क्लिक न करें",
        clickNow: "अभी क्लिक करें!",
        reactFast: "जितनी जल्दी हो सके प्रतिक्रिया दें",
        tooEarly: "बहुत जल्दी!",
        waitSignal: "क्लिक करने से पहले सिग्नल का इंतज़ार करें।",
        roundComplete: "राउंड पूरा!",
        points: "पॉइंट्स",
        excellent: "बहुत बढ़िया रिएक्शन!",
        great: "शानदार रिएक्शन! जारी रखें।",
        good: "अच्छा! थोड़ा और तेज़ प्रतिक्रिया देने की कोशिश करें।",
        practice: "अपनी स्पीड बेहतर करने के लिए अभ्यास करते रहें।",
        finish: "चैलेंज पूरा करें →",
        nextRound: "अगला राउंड →",
        bePatient: "धैर्य रखें!",
        waitThenReact: "सिग्नल आने तक इंतज़ार करें और फिर जितनी जल्दी हो सके प्रतिक्रिया दें।",
        tryAgain: "फिर से प्रयास करें",
        complete: "चैलेंज पूरा!",
        completed: "आपने सभी",
        rounds: "राउंड पूरे कर लिए।",
        finalScore: "अंतिम स्कोर",
        bestReaction: "सबसे अच्छा रिएक्शन",
        trainingTime: "ट्रेनिंग समय",
        saved: "आपका Reaction Challenge स्कोर और ट्रेनिंग समय MindCare प्रोग्रेस में सेव हो गया है।",
        playAgain: "फिर से खेलें",
      }
    : {
        cognitiveGame: "MINDCARE COGNITIVE GAME",
        chooseDifficulty: "Choose Your Difficulty",
        selectDifficulty: "Select a difficulty level before starting the Reaction Challenge.",
        easy: "Easy",
        moderate: "Moderate",
        hard: "Hard",
        attentionGame: "ATTENTION GAME",
        gameTitle: "Reaction Challenge",
        description: "Wait for the signal and react as quickly as possible.",
        changeDifficulty: "Change Difficulty",
        difficultyLabel: "Difficulty",
        roundLabel: "Round",
        scoreLabel: "Score",
        bestTimeLabel: "Best Time",
        wait: "Wait for it...",
        dontClick: "Don't click yet",
        clickNow: "CLICK NOW!",
        reactFast: "React as quickly as possible",
        tooEarly: "Too Early!",
        waitSignal: "Wait for the signal before clicking.",
        roundComplete: "Round complete!",
        points: "points",
        excellent: "Excellent reaction!",
        great: "Great reaction! Keep going.",
        good: "Good job! Try to react faster.",
        practice: "Keep practicing to improve your speed.",
        finish: "Finish Challenge →",
        nextRound: "Next Round →",
        bePatient: "Be patient!",
        waitThenReact: "Wait until the signal appears and then react as quickly as possible.",
        tryAgain: "Try Again",
        complete: "Challenge Complete!",
        completed: "You completed all",
        rounds: "rounds.",
        finalScore: "Final Score",
        bestReaction: "Best Reaction",
        trainingTime: "Training Time",
        saved: "Your Reaction Challenge score and training time have been saved to your MindCare progress.",
        playAgain: "Play Again",
      };

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
                startGame("Moderate")
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

  /*
    MAIN GAME
  */

  return (
    <div className="game-page">

      <div className="game-header">

        <div>

          <p className="small-title">
            {tx.attentionGame}
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
            {tx.difficultyLabel}
          </span>

          <strong>
            {difficulty}
          </strong>
        </div>

        <div>
          <span>
            {tx.roundLabel}
          </span>

          <strong>
            {round}/{totalRounds}
          </strong>
        </div>

        <div>
          <span>
            {tx.scoreLabel}
          </span>

          <strong>
            {score}
          </strong>
        </div>

        <div>
          <span>
            {tx.bestTimeLabel}
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
                  {tx.wait}
                </strong>

                <small>
                  {tx.dontClick}
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
                  {tx.clickNow}
                </strong>

                <small>
                  {tx.reactFast}
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
                  {tx.tooEarly}
                </strong>

                <small>
                  {tx.waitSignal}
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
                  {tx.roundComplete}
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

              {" "}{tx.points}

            </div>

            <p>
              {reactionTime < 250
                ? tx.excellent
                : reactionTime < 400
                ? tx.great
                : reactionTime < 600
                ? tx.good
                : tx.practice}
            </p>

            <button
              className="primary-btn"
              onClick={
                nextRound
              }
            >
              {round >=
              totalRounds
                ? tx.finish
                : tx.nextRound}
            </button>

          </div>

        )}

        {gameState ===
          "too-early" && (

          <div className="reaction-result">

            <h2>
              {tx.bePatient}
            </h2>

            <p>
              {tx.waitThenReact}
            </p>

            <button
              className="primary-btn"
              onClick={
                tryAgain
              }
            >
              {tx.tryAgain}
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
              {tx.complete}
            </h2>

            <p>
              {tx.completed}{" "}
              <strong>
                {totalRounds}
              </strong>{" "}
              {tx.rounds}
            </p>

            <p>
              {tx.finalScore}:{" "}
              <strong>
                {score}
              </strong>
            </p>

            <p>
              {tx.bestReaction}:{" "}
              <strong>
                {bestTime !== null
                  ? `${bestTime} ms`
                  : "--"}
              </strong>
            </p>

            <p>
              {tx.trainingTime}:{" "}
              <strong>
                {elapsedTime} seconds
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

export default ReactionChallenge;