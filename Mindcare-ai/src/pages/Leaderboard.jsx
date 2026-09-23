import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Leaderboard() {
  const { language } = useLanguage();
  const isHindi = language === "Hindi";

  const [period, setPeriod] = useState("weekly");
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    "https://mindcare-ai-hesy.onrender.com";

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/scores/leaderboard?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isHindi
              ? "लीडरबोर्ड लोड नहीं हो सका"
              : "Failed to load leaderboard")
        );
      }

      setLeaderboard(data.leaderboard || []);
      setCurrentUser(data.currentUser || null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [period, language]);

  const text = {
    community: isHindi ? "समुदाय" : "COMMUNITY",

    heading: isHindi
      ? "लीडरबोर्ड 🏆"
      : "Leaderboard 🏆",

    description: isHindi
      ? "देखें कि आपकी संज्ञानात्मक प्रशिक्षण प्रगति अन्य MindCare उपयोगकर्ताओं की तुलना में कैसी है।"
      : "See how your cognitive training progress compares with other MindCare users.",

    daily: isHindi ? "दैनिक" : "Daily",

    weekly: isHindi ? "साप्ताहिक" : "Weekly",

    allTime: isHindi ? "सभी समय" : "All Time",

    yourRank: isHindi ? "आपकी रैंक" : "Your Rank",

    totalScore: isHindi ? "कुल स्कोर" : "Total Score",

    gamesPlayed: isHindi
      ? "खेले गए गेम"
      : "Games Played",

    todaysLeaders: isHindi
      ? "आज के शीर्ष खिलाड़ी"
      : "Today's Leaders",

    weeklyLeaders: isHindi
      ? "साप्ताहिक शीर्ष खिलाड़ी"
      : "Weekly Leaders",

    allTimeLeaders: isHindi
      ? "सभी समय के शीर्ष खिलाड़ी"
      : "All Time Leaders",

    scoreBasis: isHindi
      ? "कुल संज्ञानात्मक गेम स्कोर के आधार पर"
      : "Based on total cognitive game score",

    loading: isHindi
      ? "लीडरबोर्ड लोड हो रहा है..."
      : "Loading leaderboard...",

    noScores: isHindi
      ? "अभी कोई स्कोर उपलब्ध नहीं है।"
      : "No scores available yet.",

    playToAppear: isHindi
      ? "लीडरबोर्ड पर आने के लिए कोई गेम खेलें!"
      : "Play a game to appear on the leaderboard!",

    point: isHindi ? "पॉइंट" : "point",

    points: isHindi ? "पॉइंट्स" : "points",

    game: isHindi ? "गेम" : "game",

    games: isHindi ? "गेम्स" : "games",
  };

  const getPeriodHeading = () => {
    if (period === "daily") {
      return text.todaysLeaders;
    }

    if (period === "weekly") {
      return text.weeklyLeaders;
    }

    return text.allTimeLeaders;
  };

  return (
    <div className="leaderboard-page">

      <div className="leaderboard-header">

        <div>
          <p className="leaderboard-label">
            {text.community}
          </p>

          <h1>
            {text.heading}
          </h1>

          <p>
            {text.description}
          </p>
        </div>

      </div>


      {/* PERIOD TABS */}

      <div className="leaderboard-tabs">

        <button
          className={
            period === "daily"
              ? "active"
              : ""
          }
          onClick={() => setPeriod("daily")}
        >
          {text.daily}
        </button>

        <button
          className={
            period === "weekly"
              ? "active"
              : ""
          }
          onClick={() => setPeriod("weekly")}
        >
          {text.weekly}
        </button>

        <button
          className={
            period === "all"
              ? "active"
              : ""
          }
          onClick={() => setPeriod("all")}
        >
          {text.allTime}
        </button>

      </div>


      {/* CURRENT USER */}

      {currentUser && (
        <div className="my-rank-card">

          <div>
            <span>
              {text.yourRank}
            </span>

            <strong>
              #{currentUser.rank}
            </strong>
          </div>

          <div>
            <span>
              {text.totalScore}
            </span>

            <strong>
              {currentUser.totalScore}
            </strong>
          </div>

          <div>
            <span>
              {text.gamesPlayed}
            </span>

            <strong>
              {currentUser.gamesPlayed}
            </strong>
          </div>

        </div>
      )}


      {/* LEADERBOARD */}

      <div className="leaderboard-card">

        <div className="leaderboard-card-header">

          <div>

            <h2>
              {getPeriodHeading()}
            </h2>

            <p>
              {text.scoreBasis}
            </p>

          </div>

        </div>


        {loading && (
          <div className="leaderboard-message">
            {text.loading}
          </div>
        )}


        {error && !loading && (
          <div className="leaderboard-message error">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          leaderboard.length === 0 && (
            <div className="leaderboard-message">

              {text.noScores}

              <br />

              {text.playToAppear}

            </div>
          )}


        {!loading &&
          !error &&
          leaderboard.length > 0 && (

            <div className="leaderboard-list">

              {leaderboard.map((player) => (

                <div
                  className={`leaderboard-row ${
                    player.userId ===
                    currentUser?.userId
                      ? "current-player"
                      : ""
                  }`}
                  key={player.userId}
                >

                  <div className="player-rank">

                    {player.rank === 1
                      ? "🥇"
                      : player.rank === 2
                      ? "🥈"
                      : player.rank === 3
                      ? "🥉"
                      : `#${player.rank}`}

                  </div>


                  <div className="player-info">

                    <strong>
                      {player.name}
                    </strong>

                    <span>
                      {player.gamesPlayed}{" "}

                      {player.gamesPlayed === 1
                        ? text.game
                        : text.games}

                    </span>

                  </div>


                  <div className="player-score">

                    <strong>
                      {player.totalScore}
                    </strong>

                    <span>
                      {player.totalScore === 1
                        ? text.point
                        : text.points}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </div>
  );
}

export default Leaderboard;
