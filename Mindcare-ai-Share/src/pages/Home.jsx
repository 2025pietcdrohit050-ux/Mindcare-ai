import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userName =
    user?.name || "Friend";

  const token =
    localStorage.getItem("token");

  const [scores, setScores] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const response =
          await fetch(
            "https://mindcare-ai-hesy.onrender.com/api/scores",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch scores"
          );
        }

        const data =
          await response.json();

        setScores(
          data.scores || []
        );
      } catch (error) {
        console.error(
          "Score fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchScores();
    } else {
      setLoading(false);
    }
  }, [token]);

  /*
    BASIC STATS
  */

  const gamesPlayed =
    scores.length;

  const bestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map(
            (item) => item.score || 0
          )
        )
      : 0;

  const totalTime =
    scores.reduce(
      (total, item) =>
        total + (item.time || 0),
      0
    );

  const totalMinutes =
    Math.floor(
      totalTime / 60
    );

  /*
    TODAY'S ACTIVITY
  */

  const today =
    new Date().toDateString();

  const completedToday =
    scores.filter((item) => {
      if (!item.createdAt) {
        return false;
      }

      return (
        new Date(
          item.createdAt
        ).toDateString() === today
      );
    }).length;

  const todayActivity =
    Math.min(
      Math.round(
        (completedToday / 4) *
          100
      ),
      100
    );

  /*
    AVERAGE SCORE
  */

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, item) =>
              total +
              (item.score || 0),
            0
          ) /
            scores.length
        )
      : 0;

  /*
    BEST GAME
  */

  const bestGame =
    scores.length > 0
      ? scores.reduce(
          (best, current) =>
            (current.score || 0) >
            (best.score || 0)
              ? current
              : best
        )
      : null;

  /*
    UNIQUE GAMES
  */

  const gameNames =
    new Set(
      scores.map(
        (item) => item.game
      )
    );

  /*
    ACHIEVEMENTS
  */

  const achievements = Math.min(
    gameNames.size +
      Math.floor(
        gamesPlayed / 5
      ),
    8
  );

  /*
    COGNITIVE SCORE
  */

  const cognitiveScore =
    averageScore;

  /*
    RECENT ACTIVITY
  */

  const recentScores =
    [...scores]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      )
      .slice(0, 5);

  /*
    AI INSIGHT
  */

  let aiTitle =
    "Start your first cognitive game.";

  let aiText =
    "Complete a cognitive activity so MindCare can build your personalized progress.";

  if (scores.length > 0) {
    if (
      bestGame?.game ===
      "Memory Match"
    ) {
      aiTitle =
        "Your visual memory training is underway.";

      aiText =
        "You have been practicing visual memory. Try different cognitive games to build a balanced training routine.";
    } else if (
      bestGame?.game ===
      "Sequence Recall"
    ) {
      aiTitle =
        "Your recall training is underway.";

      aiText =
        "Sequence Recall is part of your activity history. Keep practicing regularly and explore other games too.";
    } else if (
      bestGame?.game ===
      "Reaction Challenge"
    ) {
      aiTitle =
        "Your attention training is underway.";

      aiText =
        "You have completed a reaction activity. Continue practicing attention and reaction speed.";
    } else if (
      bestGame?.game ===
      "Word Recall"
    ) {
      aiTitle =
        "Your word memory training is underway.";

      aiText =
        "You have been practicing word recall. Try different games to exercise different cognitive skills.";
    } else {
      aiTitle =
        "Great job keeping your mind active.";

      aiText =
        "Continue playing different cognitive games to build a broader activity history.";
    }
  }

  /*
    RECOMMENDED GAME
  */

  let recommendedGame =
    "/games";

  if (
    bestGame?.game ===
    "Memory Match"
  ) {
    recommendedGame =
      "/games/memory-match";
  } else if (
    bestGame?.game ===
    "Sequence Recall"
  ) {
    recommendedGame =
      "/games/sequence-recall";
  } else if (
    bestGame?.game ===
    "Reaction Challenge"
  ) {
    recommendedGame =
      "/games/reaction-challenge";
  } else if (
    bestGame?.game ===
    "Word Recall"
  ) {
    recommendedGame =
      "/games/word-recall";
  }

  /*
    GAME NAME HELPER
  */

  function getGameIcon(game) {
    if (
      game ===
      "Memory Match"
    ) {
      return "🧩";
    }

    if (
      game ===
      "Sequence Recall"
    ) {
      return "🔢";
    }

    if (
      game ===
      "Reaction Challenge"
    ) {
      return "⚡";
    }

    if (
      game ===
      "Word Recall"
    ) {
      return "📝";
    }

    return "🎮";
  }

  /*
    DATE FORMAT
  */

  function formatDate(date) {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  }

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <p className="small-title">
            PERSONAL DASHBOARD
          </p>

          <h1>
            Good morning,{" "}
            {userName} 👋
          </h1>

          <p className="dashboard-subtitle">
            Your personalized
            cognitive wellness space.
          </p>

        </div>

        <div className="daily-badge">

          <span>
            🔥
          </span>

          <div>

            <strong>
              {gamesPlayed > 0
                ? "Active Learner"
                : "Start Today"}
            </strong>

            <small>
              {gamesPlayed > 0
                ? `${gamesPlayed} game${
                    gamesPlayed > 1
                      ? "s"
                      : ""
                  } completed`
                : "Play your first game"}
            </small>

          </div>

        </div>

      </div>

      {/* MAIN STATS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat">

          <div className="stat-icon purple">
            🧠
          </div>

          <div>
            <span>
              Cognitive Score
            </span>

            <strong>
              {loading
                ? "..."
                : cognitiveScore}
            </strong>
          </div>

        </div>

        <div className="dashboard-stat">

          <div className="stat-icon green">
            🎯
          </div>

          <div>
            <span>
              Today's Activity
            </span>

            <strong>
              {loading
                ? "..."
                : `${todayActivity}%`}
            </strong>
          </div>

        </div>

        <div className="dashboard-stat">

          <div className="stat-icon peach">
            ⏱️
          </div>

          <div>
            <span>
              Training Time
            </span>

            <strong>
              {loading
                ? "..."
                : `${totalMinutes} min`}
            </strong>
          </div>

        </div>

        <div className="dashboard-stat">

          <div className="stat-icon lavender">
            🏆
          </div>

          <div>
            <span>
              Achievements
            </span>

            <strong>
              {loading
                ? "..."
                : `${achievements}/8`}
            </strong>
          </div>

        </div>

      </div>

      {/* SECONDARY SUMMARY */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >

        <div className="training-card">

          <span className="card-label">
            TRAINING SUMMARY
          </span>

          <h2>
            Your activity
          </h2>

          <p className="card-description">
            Keep building your
            personal cognitive
            activity history.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "12px",
              marginTop: "20px",
            }}
          >

            <div>
              <small>
                Games Played
              </small>

              <h3
                style={{
                  margin:
                    "5px 0 0",
                }}
              >
                {gamesPlayed}
              </h3>
            </div>

            <div>
              <small>
                Average Score
              </small>

              <h3
                style={{
                  margin:
                    "5px 0 0",
                }}
              >
                {averageScore}
              </h3>
            </div>

          </div>

        </div>

        <div className="insight-card">

          <div className="insight-icon">
            ✨
          </div>

          <span className="card-label">
            AI INSIGHT
          </span>

          <h2>
            {aiTitle}
          </h2>

          <p>
            {aiText}
          </p>

          <Link
            to={
              recommendedGame
            }
            className="primary-btn"
          >
            Start Recommended Exercise →
          </Link>

        </div>

      </div>

      {/* DAILY TRAINING */}

      <div className="dashboard-main">

        <div className="training-card">

          <div className="card-heading">

            <div>

              <span className="card-label">
                YOUR PROGRESS
              </span>

              <h2>
                Daily Mind Training
              </h2>

            </div>

            <span className="completion">
              {completedToday} / 4
            </span>

          </div>

          <p className="card-description">
            Complete cognitive
            activities to build
            your MindCare activity
            history.
          </p>

          <div className="training-progress">

            <div
              className="training-progress-fill"
              style={{
                width: `${Math.min(
                  (completedToday /
                    4) *
                    100,
                  100
                )}%`,
              }}
            ></div>

          </div>

          <div className="training-list">

            {/* MEMORY MATCH */}

            <div className="training-item">

              <div className="training-icon">
                🧩
              </div>

              <div className="training-info">

                <strong>
                  Memory Match
                </strong>

                <span>
                  Visual memory · 5 min
                </span>

              </div>

              <Link
                to="/games/memory-match"
                className="start-small"
              >
                Start
              </Link>

            </div>

            {/* SEQUENCE */}

            <div className="training-item">

              <div className="training-icon green-bg">
                🔢
              </div>

              <div className="training-info">

                <strong>
                  Sequence Recall
                </strong>

                <span>
                  Recall · 5 min
                </span>

              </div>

              <Link
                to="/games/sequence-recall"
                className="start-small"
              >
                Start
              </Link>

            </div>

            {/* REACTION */}

            <div className="training-item">

              <div className="training-icon peach-bg">
                ⚡
              </div>

              <div className="training-info">

                <strong>
                  Reaction Challenge
                </strong>

                <span>
                  Attention · 3 min
                </span>

              </div>

              <Link
                to="/games/reaction-challenge"
                className="start-small"
              >
                Start
              </Link>

            </div>

            {/* WORD RECALL */}

            <div className="training-item">

              <div
                className="training-icon"
                style={{
                  background:
                    "#f0e9fb",
                }}
              >
                📝
              </div>

              <div className="training-info">

                <strong>
                  Word Recall
                </strong>

                <span>
                  Word memory · 5 min
                </span>

              </div>

              <Link
                to="/games/word-recall"
                className="start-small"
              >
                Start
              </Link>

            </div>

          </div>

        </div>

        {/* RECENT ACTIVITY */}

        <div className="training-card">

          <span className="card-label">
            RECENT ACTIVITY
          </span>

          <h2>
            Your latest games
          </h2>

          {recentScores.length ===
          0 ? (

            <div
              style={{
                padding:
                  "30px 5px",
                textAlign:
                  "center",
                color:
                  "#817786",
              }}
            >

              <div
                style={{
                  fontSize:
                    "35px",
                  marginBottom:
                    "10px",
                }}
              >
                🎮
              </div>

              <p>
                No games played yet.
              </p>

              <Link
                to="/games"
                className="primary-btn"
              >
                Start Your First Game
              </Link>

            </div>

          ) : (

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "12px",
                marginTop:
                  "18px",
              }}
            >

              {recentScores.map(
                (item, index) => (

                  <div
                    key={
                      item._id ||
                      index
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                      padding:
                        "12px",
                      borderRadius:
                        "14px",
                      background:
                        "#faf8fc",
                    }}
                  >

                    <div
                      style={{
                        width:
                          "40px",
                        height:
                          "40px",
                        borderRadius:
                          "12px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        background:
                          "#eee7fb",
                        fontSize:
                          "19px",
                      }}
                    >
                      {getGameIcon(
                        item.game
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                      }}
                    >

                      <strong>
                        {item.game}
                      </strong>

                      <small
                        style={{
                          display:
                            "block",
                          marginTop:
                            "3px",
                          color:
                            "#817786",
                        }}
                      >
                        {item.difficulty ||
                          "Training"}{" "}
                        ·{" "}
                        {formatDate(
                          item.createdAt
                        )}
                      </small>

                    </div>

                    <strong
                      style={{
                        color:
                          "#74539f",
                      }}
                    >
                      {item.score}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* QUICK ACCESS */}

      <section className="quick-section">

        <div className="section-title-row">

          <div>

            <span className="card-label">
              QUICK ACCESS
            </span>

            <h2>
              What would you like
              to do?
            </h2>

          </div>

        </div>

        <div className="quick-grid">

          <Link
            to="/games"
            className="quick-card"
          >
            <span>
              🎮
            </span>

            <h3>
              Play Games
            </h3>

            <p>
              Train memory and
              attention.
            </p>

          </Link>

          <Link
            to="/memory"
            className="quick-card"
          >
            <span>
              🧠
            </span>

            <h3>
              Memory Vault
            </h3>

            <p>
              Review your
              important memories.
            </p>

          </Link>

          <Link
            to="/progress"
            className="quick-card"
          >
            <span>
              📊
            </span>

            <h3>
              View Progress
            </h3>

            <p>
              See your cognitive
              activity.
            </p>

          </Link>

          <Link
            to="/reminders"
            className="quick-card"
          >
            <span>
              ⏰
            </span>

            <h3>
              Reminders
            </h3>

            <p>
              Manage your smart
              reminders.
            </p>

          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;