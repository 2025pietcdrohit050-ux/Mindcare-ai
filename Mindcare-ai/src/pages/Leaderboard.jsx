import { useEffect, useState } from "react";

function Leaderboard() {
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
          data.message || "Failed to load leaderboard"
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
  }, [period]);

  return (
    <div className="leaderboard-page">

      <div className="leaderboard-header">
        <div>
          <p className="leaderboard-label">
            COMMUNITY
          </p>

          <h1>Leaderboard 🏆</h1>

          <p>
            See how your cognitive training progress
            compares with other MindCare users.
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
          Daily
        </button>

        <button
          className={
            period === "weekly"
              ? "active"
              : ""
          }
          onClick={() => setPeriod("weekly")}
        >
          Weekly
        </button>

        <button
          className={
            period === "all"
              ? "active"
              : ""
          }
          onClick={() => setPeriod("all")}
        >
          All Time
        </button>

      </div>


      {/* CURRENT USER */}

      {currentUser && (
        <div className="my-rank-card">

          <div>
            <span>Your Rank</span>

            <strong>
              #{currentUser.rank}
            </strong>
          </div>

          <div>
            <span>Total Score</span>

            <strong>
              {currentUser.totalScore}
            </strong>
          </div>

          <div>
            <span>Games Played</span>

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
              {period === "daily"
                ? "Today's Leaders"
                : period === "weekly"
                ? "Weekly Leaders"
                : "All Time Leaders"}
            </h2>

            <p>
              Based on total cognitive game score
            </p>
          </div>
        </div>


        {loading && (
          <div className="leaderboard-message">
            Loading leaderboard...
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
              No scores available yet.
              <br />
              Play a game to appear on the leaderboard!
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
                        ? "game"
                        : "games"}
                    </span>

                  </div>


                  <div className="player-score">

                    <strong>
                      {player.totalScore}
                    </strong>

                    <span>
                      points
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