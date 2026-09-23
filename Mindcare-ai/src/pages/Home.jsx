import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Home() {
  const { t } = useLanguage();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userName = user?.name || "Friend";
  const token = localStorage.getItem("token");

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch(
          "https://mindcare-ai-hesy.onrender.com/api/scores",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }

        const data = await response.json();
        setScores(data.scores || []);
      } catch (error) {
        console.error("Score fetch error:", error);
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

  const gamesPlayed = scores.length;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores.map((item) => item.score || 0))
      : 0;

  const totalTime = scores.reduce(
    (total, item) => total + (item.time || 0),
    0
  );

  const totalMinutes = Math.floor(totalTime / 60);

  const today = new Date().toDateString();

  const completedToday = scores.filter((item) => {
    if (!item.createdAt) return false;

    return (
      new Date(item.createdAt).toDateString() === today
    );
  }).length;

  const todayActivity = Math.min(
    Math.round((completedToday / 4) * 100),
    100
  );

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, item) => total + (item.score || 0),
            0
          ) / scores.length
        )
      : 0;

  const bestGame =
    scores.length > 0
      ? scores.reduce((best, current) =>
          (current.score || 0) > (best.score || 0)
            ? current
            : best
        )
      : null;

  const gameNames = new Set(
    scores.map((item) => item.game)
  );

  const achievements = Math.min(
    gameNames.size + Math.floor(gamesPlayed / 5),
    8
  );

  const cognitiveScore = averageScore;

  const recentScores = [...scores]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  let aiTitle = t("homeStartFirstTitle");
  let aiText = t("homeStartFirstText");

  if (scores.length > 0) {
    if (bestGame?.game === "Memory Match") {
      aiTitle = t("homeMemoryTitle");
      aiText = t("homeMemoryText");
    } else if (bestGame?.game === "Sequence Recall") {
      aiTitle = t("homeSequenceTitle");
      aiText = t("homeSequenceText");
    } else if (bestGame?.game === "Reaction Challenge") {
      aiTitle = t("homeReactionTitle");
      aiText = t("homeReactionText");
    } else if (bestGame?.game === "Word Recall") {
      aiTitle = t("homeWordTitle");
      aiText = t("homeWordText");
    } else {
      aiTitle = t("homeGreatJobTitle");
      aiText = t("homeGreatJobText");
    }
  }

  let recommendedGame = "/games";

  if (bestGame?.game === "Memory Match") {
    recommendedGame = "/games/memory-match";
  } else if (bestGame?.game === "Sequence Recall") {
    recommendedGame = "/games/sequence-recall";
  } else if (bestGame?.game === "Reaction Challenge") {
    recommendedGame = "/games/reaction-challenge";
  } else if (bestGame?.game === "Word Recall") {
    recommendedGame = "/games/word-recall";
  }

  function getGameIcon(game) {
    if (game === "Memory Match") return "🧩";
    if (game === "Sequence Recall") return "🔢";
    if (game === "Reaction Challenge") return "⚡";
    if (game === "Word Recall") return "📝";

    return "🎮";
  }

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
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
            {t("personalDashboard")}
          </p>

          <h1>
            {t("hello")}, {userName} 👋
          </h1>

          <p className="dashboard-subtitle">
            {t("cognitiveWellnessSpace")}
          </p>
        </div>

        <div className="daily-badge">

          <span>🔥</span>

          <div>
            <strong>
              {gamesPlayed > 0
                ? t("activeLearner")
                : t("startToday")}
            </strong>

            <small>
              {gamesPlayed > 0
                ? `${gamesPlayed} ${
                    gamesPlayed > 1
                      ? t("gamesCompleted")
                      : t("gameCompleted")
                  }`
                : t("playFirstGame")}
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
              {t("cognitiveScore")}
            </span>

            <strong>
              {loading ? "..." : cognitiveScore}
            </strong>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon green">
            🎯
          </div>

          <div>
            <span>
              {t("todaysActivity")}
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
              {t("trainingTime")}
            </span>

            <strong>
              {loading
                ? "..."
                : `${totalMinutes} ${t("minutes")}`}
            </strong>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon lavender">
            🏆
          </div>

          <div>
            <span>
              {t("achievements")}
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
            {t("trainingSummary")}
          </span>

          <h2>
            {t("yourActivity")}
          </h2>

          <p className="card-description">
            {t("activityHistoryText")}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "20px",
            }}
          >

            <div>
              <small>
                {t("gamesPlayed")}
              </small>

              <h3 style={{ margin: "5px 0 0" }}>
                {gamesPlayed}
              </h3>
            </div>

            <div>
              <small>
                {t("averageScore")}
              </small>

              <h3 style={{ margin: "5px 0 0" }}>
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
            {t("aiInsight")}
          </span>

          <h2>
            {aiTitle}
          </h2>

          <p>
            {aiText}
          </p>

          <Link
            to={recommendedGame}
            className="primary-btn"
          >
            {t("startRecommendedExercise")} →
          </Link>

        </div>

      </div>


      {/* DAILY TRAINING */}

      <div className="dashboard-main">

        <div className="training-card">

          <div className="card-heading">

            <div>

              <span className="card-label">
                {t("yourProgress")}
              </span>

              <h2>
                {t("dailyMindTraining")}
              </h2>

            </div>

            <span className="completion">
              {completedToday} / 4
            </span>

          </div>

          <p className="card-description">
            {t("dailyTrainingDescription")}
          </p>

          <div className="training-progress">

            <div
              className="training-progress-fill"
              style={{
                width: `${Math.min(
                  (completedToday / 4) * 100,
                  100
                )}%`,
              }}
            ></div>

          </div>


          <div className="training-list">

            <div className="training-item">

              <div className="training-icon">
                🧩
              </div>

              <div className="training-info">

                <strong>
                  {t("memoryMatch")}
                </strong>

                <span>
                  {t("visualMemory")} · 5 {t("minutes")}
                </span>

              </div>

              <Link
                to="/games/memory-match"
                className="start-small"
              >
                {t("start")}
              </Link>

            </div>


            <div className="training-item">

              <div className="training-icon green-bg">
                🔢
              </div>

              <div className="training-info">

                <strong>
                  {t("sequenceRecall")}
                </strong>

                <span>
                  {t("recall")} · 5 {t("minutes")}
                </span>

              </div>

              <Link
                to="/games/sequence-recall"
                className="start-small"
              >
                {t("start")}
              </Link>

            </div>


            <div className="training-item">

              <div className="training-icon peach-bg">
                ⚡
              </div>

              <div className="training-info">

                <strong>
                  {t("reactionChallenge")}
                </strong>

                <span>
                  {t("attention")} · 3 {t("minutes")}
                </span>

              </div>

              <Link
                to="/games/reaction-challenge"
                className="start-small"
              >
                {t("start")}
              </Link>

            </div>


            <div className="training-item">

              <div
                className="training-icon"
                style={{
                  background: "#f0e9fb",
                }}
              >
                📝
              </div>

              <div className="training-info">

                <strong>
                  {t("wordRecall")}
                </strong>

                <span>
                  {t("wordMemory")} · 5 {t("minutes")}
                </span>

              </div>

              <Link
                to="/games/word-recall"
                className="start-small"
              >
                {t("start")}
              </Link>

            </div>

          </div>

        </div>


        {/* RECENT ACTIVITY */}

        <div className="training-card">

          <span className="card-label">
            {t("recentActivity")}
          </span>

          <h2>
            {t("latestGames")}
          </h2>

          {recentScores.length === 0 ? (

            <div
              style={{
                padding: "30px 5px",
                textAlign: "center",
                color: "#817786",
              }}
            >

              <div
                style={{
                  fontSize: "35px",
                  marginBottom: "10px",
                }}
              >
                🎮
              </div>

              <p>
                {t("noGamesPlayed")}
              </p>

              <Link
                to="/games"
                className="primary-btn"
              >
                {t("startFirstGame")}
              </Link>

            </div>

          ) : (

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "18px",
              }}
            >

              {recentScores.map(
                (item, index) => (

                  <div
                    key={item._id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "14px",
                      background: "#faf8fc",
                    }}
                  >

                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#eee7fb",
                        fontSize: "19px",
                      }}
                    >
                      {getGameIcon(item.game)}
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
                          display: "block",
                          marginTop: "3px",
                          color: "#817786",
                        }}
                      >
                        {item.difficulty || t("training")}{" "}
                        ·{" "}
                        {formatDate(item.createdAt)}
                      </small>

                    </div>

                    <strong
                      style={{
                        color: "#74539f",
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
              {t("quickAccess")}
            </span>

            <h2>
              {t("whatWouldYouLike")}
            </h2>

          </div>

        </div>


        <div className="quick-grid">

          <Link
            to="/games"
            className="quick-card"
          >
            <span>🎮</span>

            <h3>
              {t("playGames")}
            </h3>

            <p>
              {t("trainMemoryAttention")}
            </p>
          </Link>


          <Link
            to="/memory"
            className="quick-card"
          >
            <span>🧠</span>

            <h3>
              {t("memoryVault")}
            </h3>

            <p>
              {t("reviewMemories")}
            </p>
          </Link>


          <Link
            to="/progress"
            className="quick-card"
          >
            <span>📊</span>

            <h3>
              {t("viewProgress")}
            </h3>

            <p>
              {t("seeCognitiveActivity")}
            </p>
          </Link>


          <Link
            to="/reminders"
            className="quick-card"
          >
            <span>⏰</span>

            <h3>
              {t("reminders")}
            </h3>

            <p>
              {t("manageSmartReminders")}
            </p>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;