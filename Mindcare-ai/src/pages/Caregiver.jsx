import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Caregiver() {
  const { t } = useLanguage();

  const [authorized, setAuthorized] = useState(false);
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [access, setAccess] = useState(null);

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const userName = user?.name || "User";

  useEffect(() => {
    async function loadCaregiverData() {
      try {
        const accessResponse = await fetch(
          "https://mindcare-ai-hesy.onrender.com/api/caregiver/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const accessData = await accessResponse.json();

        setAuthorized(accessData.authorized);
        setAccess(accessData.access);

        const scoreResponse = await fetch(
          "https://mindcare-ai-hesy.onrender.com/api/scores",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const scoreData = await scoreResponse.json();

        setScores(scoreData.scores || []);
      } catch (error) {
        console.error(
          "Caregiver data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadCaregiverData();
    } else {
      setLoading(false);
    }
  }, [token]);

  async function authorizeCaregiver() {
    if (!caregiverEmail.trim()) {
      alert(t("enterCaregiverEmail"));
      return;
    }

    try {
      const response = await fetch(
        "https://mindcare-ai-hesy.onrender.com/api/caregiver/authorize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            caregiverEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || t("authorizationFailed")
        );
        return;
      }

      setAuthorized(true);
      setAccess(data.access);
    } catch (error) {
      console.error(error);
      alert(t("backendConnectionError"));
    }
  }

  async function revokeAccess() {
    try {
      const response = await fetch(
        "https://mindcare-ai-hesy.onrender.com/api/caregiver/revoke",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || t("revokeAccessFailed")
        );
        return;
      }

      setAuthorized(false);
      setAccess(null);
      setCaregiverEmail("");
    } catch (error) {
      console.error(error);
      alert(t("backendConnectionError"));
    }
  }

  const gamesCompleted = scores.length;

  const totalTime = scores.reduce(
    (total, item) =>
      total + (item.time || 0),
    0
  );

  const totalMinutes = Math.floor(
    totalTime / 60
  );

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, item) =>
              total + item.score,
            0
          ) / scores.length
        )
      : 0;

  const uniqueGameNames = new Set(
    scores.map((item) => item.game)
  );

  const gameTypes = uniqueGameNames.size;

  const activityDates = [
    ...new Set(
      scores.map((item) =>
        new Date(
          item.createdAt
        ).toDateString()
      )
    ),
  ];

  const currentStreak =
    activityDates.length > 0
      ? Math.min(activityDates.length, 7)
      : 0;

  const recentScores = scores.slice(0, 5);

  function getGameIcon(game) {
    if (game === "Memory Match") {
      return "🧩";
    }

    if (game === "Sequence Recall") {
      return "🔢";
    }

    if (game === "Reaction Challenge") {
      return "⚡";
    }

    if (game === "Word Recall") {
      return "🔤";
    }

    return "🧠";
  }

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

      {loading ? (

        <div className="caregiver-access">

          <div className="caregiver-icon">
            👥
          </div>

          <h1>
            {t("loadingCaregiverDashboard")}
          </h1>

          <p className="description">
            {t("fetchingAuthorizedActivity")}
          </p>

        </div>

      ) : !authorized ? (

        <div className="caregiver-access">

          <div className="caregiver-icon">
            🔐
          </div>

          <p className="small-title">
            {t("caregiverAccessTitle")}
          </p>

          <h1>
            {t("privateSupportDashboard")}
          </h1>

          <p className="description">
            {t("caregiverAccessDescription")}
          </p>

          <div className="authorization-card">

            <h3>
              🔐 {t("authorizationRequired")}
            </h3>

            <p>
              {t("authorizationInstructions")}
            </p>

            <input
              type="email"
              value={caregiverEmail}
              onChange={(event) =>
                setCaregiverEmail(
                  event.target.value
                )
              }
              placeholder="caregiver@example.com"
              className="caregiver-input"
            />

            <button
              className="primary-btn"
              onClick={authorizeCaregiver}
            >
              {t("authorizeCaregiver")} →
            </button>

          </div>

          <div className="caregiver-privacy-note">
            🛡️ {t("revokeAnytime")}
          </div>

        </div>

      ) : (

        <>
          <div className="caregiver-header">

            <div>

              <p className="small-title">
                {t("caregiverDashboard")}
              </p>

              <h1>
                {userName}
                {t("wellnessOverview")}
              </h1>

              <p className="description">
                {t("authorizedActivityInfo")}
              </p>

            </div>

            <button
              className="secondary-btn"
              onClick={revokeAccess}
            >
              {t("revokeAccess")}
            </button>

          </div>


          <div className="caregiver-authorized-banner">

            <span>🔐</span>

            <div>

              <strong>
                {t("caregiverAccessAuthorized")}
              </strong>

              <small>
                {t("authorizedFor")}{" "}
                {access?.caregiverEmail}
              </small>

            </div>

          </div>


          <div className="caregiver-stats">

            <div className="caregiver-stat">

              <span>🎮</span>

              <div>
                <small>
                  {t("gamesCompleted")}
                </small>

                <strong>
                  {gamesCompleted}
                </strong>
              </div>

            </div>


            <div className="caregiver-stat">

              <span>🧠</span>

              <div>
                <small>
                  {t("averageScore")}
                </small>

                <strong>
                  {averageScore}
                </strong>
              </div>

            </div>


            <div className="caregiver-stat">

              <span>🔥</span>

              <div>
                <small>
                  {t("activeDays")}
                </small>

                <strong>
                  {currentStreak}
                </strong>
              </div>

            </div>


            <div className="caregiver-stat">

              <span>⏱️</span>

              <div>
                <small>
                  {t("trainingTime")}
                </small>

                <strong>
                  {totalMinutes}{" "}
                  {t("minutes")}
                </strong>
              </div>

            </div>

          </div>


          <div className="caregiver-grid">

            <div className="caregiver-card">

              <div className="caregiver-card-heading">

                <div>

                  <span className="card-label">
                    {t("recentActivity")}
                  </span>

                  <h2>
                    {t("trainingOverview")}
                  </h2>

                </div>

              </div>


              {recentScores.length === 0 ? (

                <div className="caregiver-empty">

                  <span>🧠</span>

                  <h3>
                    {t("noActivityYet")}
                  </h3>

                  <p>
                    {t("completeGameActivity")}
                  </p>

                </div>

              ) : (

                recentScores.map((item) => (

                  <div
                    className="activity-row"
                    key={item._id}
                  >

                    <span>
                      {getGameIcon(item.game)}
                    </span>

                    <div>

                      <strong>
                        {getGameName(item.game)}
                      </strong>

                      <small>
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}{" "}
                        ·{" "}
                        {item.difficulty}
                      </small>

                    </div>

                    <b>
                      {item.score}
                    </b>

                  </div>

                ))

              )}

            </div>


            <div className="caregiver-card">

              <span className="card-label">
                {t("activitySummary")}
              </span>

              <h2>
                {t("trainingOverview")}
              </h2>

              <p className="description">
                {t("mindcareTrackingDescription")}
              </p>


              <div className="caregiver-insight">

                <span>✨</span>

                <p>
                  {gamesCompleted === 0
                    ? t("startCognitiveGame")
                    : `${t("completedPrefix")} ${gamesCompleted} ${
                        gamesCompleted === 1
                          ? t("activity")
                          : t("activities")
                      } ${t("across")} ${gameTypes} ${
                        gameTypes === 1
                          ? t("gameType")
                          : t("gameTypes")
                      }.`}
                </p>

              </div>

            </div>

          </div>


          <div className="caregiver-card privacy-card">

            <span className="card-label">
              {t("privacy")}
            </span>

            <h2>
              {t("dataUnderControl")}
            </h2>

            <p className="description">
              {t("caregiverPrivacyDescription")}
            </p>

            <button
              className="secondary-btn"
              onClick={revokeAccess}
            >
              {t("revokeCaregiverAccess")}
            </button>

          </div>
        </>

      )}

    </div>
  );
}

export default Caregiver;