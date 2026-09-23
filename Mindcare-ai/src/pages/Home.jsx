import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const recommendedGames = [
  {
    name: "Memory Match",
    icon: "🧠",
    title: "Your memory training is underway.",
    description:
      "Practice visual memory and matching skills with a quick memory activity.",
    path: "/games/memory-match",
  },
  {
    name: "Sequence Recall",
    icon: "🔢",
    title: "Your recall training is underway.",
    description:
      "Challenge yourself to remember and reproduce sequences accurately.",
    path: "/games/sequence-recall",
  },
  {
    name: "Reaction Challenge",
    icon: "⚡",
    title: "Your attention training is underway.",
    description:
      "Continue practicing attention and reaction speed.",
    path: "/games/reaction-challenge",
  },
  {
    name: "Word Recall",
    icon: "📝",
    title: "Your word recall training is underway.",
    description:
      "Strengthen your word memory with a short recall exercise.",
    path: "/games/word-recall",
  },
];

function Home() {
  const navigate = useNavigate();

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

  const [recommendedGame, setRecommendedGame] =
    useState(() => {
      const randomIndex = Math.floor(
        Math.random() * recommendedGames.length
      );

      return recommendedGames[randomIndex];
    });

  function startRandomGame() {
    const lastGame =
      sessionStorage.getItem("mindcareLastRandomGame");

    let availableGames = recommendedGames.filter(
      (game) => game.path !== lastGame
    );

    if (availableGames.length === 0) {
      availableGames = recommendedGames;
    }

    const randomIndex = Math.floor(
      Math.random() * availableGames.length
    );

    const nextGame = availableGames[randomIndex];

    setRecommendedGame(nextGame);

    sessionStorage.setItem(
      "mindcareLastRandomGame",
      nextGame.path
    );

    navigate(nextGame.path);
  }

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
        (completedToday / 4) * 100
      ),
      100
    );

  /*
    CURRENT STREAK
  */

  const activeDates =
    new Set(
      scores
        .filter(
          (item) => item.createdAt
        )
        .map((item) =>
          new Date(
            item.createdAt
          ).toDateString()
        )
    );

  let currentStreak = 0;

  const streakDate =
    new Date();

  while (
    activeDates.has(
      streakDate.toDateString()
    )
  ) {
    currentStreak++;

    streakDate.setDate(
      streakDate.getDate() - 1
    );
  }

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

  const achievements =
    Math.min(
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
            Hello, {userName} 👋
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
                ? currentStreak > 0
                  ? `🔥 ${currentStreak} day streak · ${gamesPlayed} game${
                      gamesPlayed > 1
                        ? "s"
                        : ""
                    } completed`
                  : `${gamesPlayed} game${
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
                Best Score
              </small>

              <h3
                style={{
                  margin:
                    "5px 0 0",
                }}
              >
                {bestScore}
              </h3>

            </div>

            <div>

              <small>
                Current Streak
              </small>

              <h3
                style={{
                  margin:
                    "5px 0 0",
                }}
              >
                🔥 {currentStreak} day
                {currentStreak !== 1
                  ? "s"
                  : ""}
              </h3>

            </div>

            <div>

              <small>
                Today's Games
              </small>

              <h3
                style={{
                  margin:
                    "5px 0 0",
                }}
              >
                {completedToday}
              </h3>

            </div>

          </div>

        </div>


        {/* RANDOM AI INSIGHT */}

        <div className="training-card">

          <span className="card-label">
            AI INSIGHT
          </span>

          <div
            style={{
              fontSize: "42px",
              marginTop: "16px",
            }}
          >
            {recommendedGame.icon}
          </div>

          <h2>
            {recommendedGame.title}
          </h2>

          <p className="card-description">
            {recommendedGame.description}
          </p>

          <button
            type="button"
            onClick={startRandomGame}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: "20px",
              padding: "16px 20px",
              borderRadius: "16px",
              background: "#7956ad",
              color: "#fff",
              border: "none",
              fontSize: "17px",
              fontWeight: "700",
              textAlign: "center",
              boxSizing: "border-box",
              cursor: "pointer",
            }}
          >
            🎲 Start a Random Game →
          </button>

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

        {recentScores.length === 0 ? (

          <p className="card-description">
            No games completed yet.
          </p>

        ) : (

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "12px",
              marginTop: "18px",
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
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    padding:
                      "12px 14px",
                    background:
                      "#faf9fd",
                    borderRadius:
                      "12px",
                  }}
                >

                  <div>

                    <strong>
                      {item.game}
                    </strong>

                    <small
                      style={{
                        display:
                          "block",
                        color:
                          "#888",
                        marginTop:
                          "3px",
                      }}
                    >
                      {formatDate(
                        item.createdAt
                      )}
                    </small>

                  </div>

                  <strong>
                    {item.score}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* QUICK ACTIONS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "18px",
          marginTop: "24px",
        }}
      >

        <Link
          to="/games"
          className="training-card"
          style={{
            textDecoration:
              "none",
          }}
        >

          <span className="card-label">
            COGNITIVE TRAINING
          </span>

          <h2>
            Play Games 🧠
          </h2>

          <p className="card-description">
            Challenge your memory,
            attention and recall.
          </p>

        </Link>


        <Link
          to="/memory"
          className="training-card"
          style={{
            textDecoration:
              "none",
          }}
        >

          <span className="card-label">
            MEMORY VAULT
          </span>

          <h2>
            My Memories 💭
          </h2>

          <p className="card-description">
            Keep important memories
            and personal notes safe.
          </p>

        </Link>


        <Link
          to="/progress"
          className="training-card"
          style={{
            textDecoration:
              "none",
          }}
        >

          <span className="card-label">
            PROGRESS
          </span>

          <h2>
            View Progress 📊
          </h2>

          <p className="card-description">
            Review your cognitive
            activity and progress.
          </p>

        </Link>

      </div>

    </div>
  );
}

export default Home;