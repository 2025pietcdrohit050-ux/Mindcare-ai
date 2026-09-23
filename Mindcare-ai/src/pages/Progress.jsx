import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../LanguageContext";

function getGameIcon(game) {
  if (game === "Memory Match") return "🧩";
  if (game === "Sequence Recall") return "🔢";
  if (game === "Reaction Challenge") return "⚡";
  if (game === "Word Recall") return "🔤";

  return "🧠";
}

function getDateKey(date) {
  const d = new Date(date);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getLastSevenDays() {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    days.push(date);
  }

  return days;
}

function calculateStreak(scores) {
  if (scores.length === 0) {
    return {
      current: 0,
      best: 0,
    };
  }

  const uniqueDates = [
    ...new Set(
      scores.map((item) => getDateKey(item.createdAt))
    ),
  ];

  const dateSet = new Set(uniqueDates);

  let current = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayKey = getDateKey(today);

  if (dateSet.has(todayKey)) {
    current = 1;

    const checkDate = new Date(today);

    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);

      const key = getDateKey(checkDate);

      if (!dateSet.has(key)) {
        break;
      }

      current++;
    }
  }

  const sortedDates = uniqueDates
    .map((date) => new Date(date))
    .sort((a, b) => a - b);

  let best = sortedDates.length > 0 ? 1 : 0;
  let running = sortedDates.length > 0 ? 1 : 0;

  for (let i = 1; i < sortedDates.length; i++) {
    const difference =
      (sortedDates[i] - sortedDates[i - 1]) /
      (1000 * 60 * 60 * 24);

    if (difference === 1) {
      running++;
      best = Math.max(best, running);
    } else {
      running = 1;
    }
  }

  return {
    current,
    best,
  };
}

function Progress() {
  const { t, language } = useLanguage();

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

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
          throw new Error("Failed to fetch progress data");
        }

        const data = await response.json();

        setScores(data.scores || []);
      } catch (error) {
        console.error("Progress fetch error:", error);
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

  const gamesCompleted = scores.length;

  const totalTime = scores.reduce(
    (total, item) => total + Number(item.time || 0),
    0
  );

  const totalMinutes = Math.floor(totalTime / 60);

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, item) =>
              total + Number(item.score || 0),
            0
          ) / scores.length
        )
      : 0;

  const bestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map((item) =>
            Number(item.score || 0)
          )
        )
      : 0;

  const streak = calculateStreak(scores);

  const lastSevenDays = getLastSevenDays();

  const dailyData = lastSevenDays.map((date) => {
    const dateKey = getDateKey(date);

    const dayScores = scores.filter(
      (item) =>
        getDateKey(item.createdAt) === dateKey
    );

    const average =
      dayScores.length > 0
        ? Math.round(
            dayScores.reduce(
              (total, item) =>
                total + Number(item.score || 0),
              0
            ) / dayScores.length
          )
        : 0;

    return {
      date,
      label: date.toLocaleDateString(language === "Hindi" ? "hi-IN" : "en-US", {
        weekday: "short",
      }),
      games: dayScores.length,
      average,
    };
  });

  const maximumDailyScore = Math.max(
    ...dailyData.map((item) => item.average),
    1
  );

  const gameStats = useMemo(() => {
    const grouped = {};

    scores.forEach((item) => {
      if (!grouped[item.game]) {
        grouped[item.game] = [];
      }

      grouped[item.game].push(item);
    });

    return Object.entries(grouped).map(
      ([game, gameScores]) => {
        const average = Math.round(
          gameScores.reduce(
            (total, item) =>
              total + Number(item.score || 0),
            0
          ) / gameScores.length
        );

        const best = Math.max(
          ...gameScores.map((item) =>
            Number(item.score || 0)
          )
        );

        const relativePerformance =
          best > 0
            ? Math.round((average / best) * 100)
            : 0;

        return {
          game,
          count: gameScores.length,
          average,
          best,
          relativePerformance,
        };
      }
    );
  }, [scores]);

  const memoryGames = scores.filter(
    (item) =>
      item.game === "Memory Match" ||
      item.game === "Sequence Recall" ||
      item.game === "Word Recall"
  ).length;

  const attentionGames = scores.filter(
    (item) =>
      item.game === "Reaction Challenge"
  ).length;

  const achievements = [
    {
      icon: "🎮",
      title: t("firstGame"),
      description: t("firstGameDescription"),
      unlocked: gamesCompleted >= 1,
    },
    {
      icon: "🧠",
      title: t("memoryExplorer"),
      description: t("memoryExplorerDescription"),
      unlocked: memoryGames >= 5,
    },
    {
      icon: "🎯",
      title: t("focusBuilder"),
      description: t("focusBuilderDescription"),
      unlocked: attentionGames >= 5,
    },
    {
      icon: "🔥",
      title: t("sevenDayStreak"),
      description: t("sevenDayStreakDescription"),
      unlocked: streak.best >= 7,
    },
    {
      icon: "🏆",
      title: t("tenGames"),
      description: t("tenGamesDescription"),
      unlocked: gamesCompleted >= 10,
    },
    {
      icon: "🚀",
      title: t("twentyFiveGames"),
      description: t("twentyFiveGamesDescription"),
      unlocked: gamesCompleted >= 25,
    },
  ];

  function getGameName(game) {
    if (game === "Memory Match") {
      return t("memoryMatch");
    }

    if (game === "Sequence Recall") {
      return t("sequenceRecall");
    }

    if (game === "Reaction Challenge") {
      return t("reactionChallenge");
    }

    if (game === "Word Recall") {
      return t("wordRecall");
    }

    return game;
  }

  return (
    <div className="page">

      <p className="small-title">
        {t("progressAnalytics")}
      </p>

      <div className="progress-header">
        <div>
          <h1>
            {t("trackCognitiveJourney")}
          </h1>

          <p className="description">
            {t("reviewActivityScores")}
          </p>
        </div>

        <div className="progress-period">
          {t("lastSevenDays")}
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="progress-stats">

        <div className="progress-stat-card">

          <span className="progress-stat-icon">
            🧠
          </span>

          <div>
            <span>
              {t("averageGameScore")}
            </span>

            <strong>
              {loading ? "..." : averageScore}
            </strong>

            <small>
              {t("best")}:{" "}
              {loading ? "..." : bestScore}
            </small>
          </div>

        </div>


        <div className="progress-stat-card">

          <span className="progress-stat-icon green">
            🎯
          </span>

          <div>
            <span>
              {t("gamesCompleted")}
            </span>

            <strong>
              {loading ? "..." : gamesCompleted}
            </strong>

            <small>
              {t("acrossGameTypes", {
                count: gameStats.length,
              })}
            </small>
          </div>

        </div>


        <div className="progress-stat-card">

          <span className="progress-stat-icon peach">
            ⏱️
          </span>

          <div>
            <span>
              {t("trainingTime")}
            </span>

            <strong>
              {loading
                ? "..."
                : `${totalMinutes} ${t("minutes")}`}
            </strong>

            <small>
              {t("recordedGameTime")}
            </small>
          </div>

        </div>


        <div className="progress-stat-card">

          <span className="progress-stat-icon lavender">
            🔥
          </span>

          <div>
            <span>
              {t("currentStreak")}
            </span>

            <strong>
              {loading
                ? "..."
                : `${streak.current} ${t("days")}`}
            </strong>

            <small>
              {t("personalBest")}:{" "}
              {streak.best} {t("days")}
            </small>
          </div>

        </div>

      </div>


      {/* MAIN ANALYTICS */}

      <div className="progress-main">

        {/* DAILY ACTIVITY */}

        <div className="progress-chart-card">

          <div className="progress-card-header">

            <div>

              <span className="card-label">
                {t("dailyActivity")}
              </span>

              <h2>
                {t("lastSevenDays")}
              </h2>

            </div>

            <strong className="chart-score">
              {gamesCompleted}
            </strong>

          </div>


          {scores.length === 0 ? (

            <div className="progress-empty">

              <span>📊</span>

              <h3>
                {t("noActivityYet")}
              </h3>

              <p>
                {t("completeGameToStartProgress")}
              </p>

            </div>

          ) : (

            <div className="real-chart">

              {dailyData.map((item) => {

                const height =
                  item.average > 0
                    ? Math.max(
                        8,
                        Math.round(
                          (item.average /
                            maximumDailyScore) *
                            100
                        )
                      )
                    : 3;

                return (

                  <div
                    className="real-chart-column"
                    key={getDateKey(item.date)}
                  >

                    <div className="real-chart-score">
                      {item.average > 0
                        ? item.average
                        : "—"}
                    </div>

                    <div className="real-chart-track">

                      <div
                        className="real-chart-bar"
                        style={{
                          height: `${height}%`,
                        }}
                      ></div>

                    </div>

                    <div className="real-chart-day">
                      {item.label}
                    </div>

                    <div className="real-chart-games">
                      {item.games}{" "}
                      {item.games === 1
                        ? t("game")
                        : t("games")}
                    </div>

                  </div>

                );
              })}

            </div>

          )}

          {scores.length > 0 && (

            <p className="chart-note">
              {t("dailyValuesNote")}
            </p>

          )}

        </div>


        {/* GAME PERFORMANCE */}

        <div className="game-performance-card">

          <span className="card-label">
            {t("gamePerformance")}
          </span>

          <h2>
            {t("activityBreakdown")}
          </h2>


          {gameStats.length === 0 ? (

            <div className="progress-empty small">

              <span>🧠</span>

              <p>
                {t("gamePerformanceEmpty")}
              </p>

            </div>

          ) : (

            gameStats.map((item) => (

              <div
                className="performance-item"
                key={item.game}
              >

                <div>

                  <span>
                    {getGameIcon(item.game)}{" "}
                    {getGameName(item.game)}
                  </span>

                  <strong>
                    {item.average}
                  </strong>

                </div>

                <div className="performance-bar">

                  <div
                    className="performance-fill"
                    style={{
                      width: `${item.relativePerformance}%`,
                    }}
                  ></div>

                </div>

                <small className="performance-meta">
                  {item.count}{" "}
                  {item.count === 1
                    ? t("game")
                    : t("games")}{" "}
                  · {t("bestScore")} {item.best}
                </small>

              </div>

            ))

          )}

        </div>

      </div>


      {/* ACHIEVEMENTS */}

      <section className="achievements-section">

        <div>

          <span className="card-label">
            {t("achievements")}
          </span>

          <h2>
            {t("yourMilestones")}
          </h2>

        </div>

        <div className="achievement-grid">

          {achievements.map((achievement) => (

            <div
              className={
                achievement.unlocked
                  ? "achievement-card unlocked"
                  : "achievement-card locked"
              }
              key={achievement.title}
            >

              <span>
                {achievement.icon}
              </span>

              <div>

                <h3>
                  {achievement.title}
                </h3>

                <p>
                  {achievement.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Progress;