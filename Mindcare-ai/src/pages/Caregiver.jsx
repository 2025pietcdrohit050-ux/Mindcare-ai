import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Caregiver() {
  const { language, t } = useLanguage();
  const isHindi = language === "Hindi";

  const text = {
    loading: isHindi ? "केयरगिवर डैशबोर्ड लोड हो रहा है..." : "Loading Caregiver Dashboard...",
    fetching: isHindi ? "अनुमति प्राप्त गतिविधि लाई जा रही है।" : "Fetching authorized activity.",
    accessTitle: isHindi ? "केयरगिवर एक्सेस" : "CAREGIVER ACCESS",
    privateDashboard: isHindi ? "प्राइवेट सपोर्ट डैशबोर्ड" : "Private Support Dashboard",
    accessDescription: isHindi
      ? "किसी केयरगिवर को अपनी ट्रेनिंग गतिविधि देखने की अनुमति दें।"
      : "Authorize a caregiver to view your training activity.",
    authorizationRequired: isHindi ? "अनुमति आवश्यक है" : "Authorization Required",
    authorizationInstructions: isHindi
      ? "केयरगिवर का email address दर्ज करें। एक्सेस केवल आपकी अनुमति के बाद दिया जाएगा।"
      : "Enter your caregiver's email address. Access is provided only after your authorization.",
    caregiverEmail: isHindi ? "केयरगिवर ईमेल" : "Caregiver Email",
    authorize: isHindi ? "केयरगिवर को अनुमति दें" : "Authorize Caregiver",
    revokeAnytime: isHindi ? "आप किसी भी समय एक्सेस वापस ले सकते हैं।" : "You can revoke access at any time.",
    dashboard: isHindi ? "केयरगिवर डैशबोर्ड" : "CAREGIVER DASHBOARD",
    overview: isHindi ? "वेलनेस ओवरव्यू" : "Wellness Overview",
    authorizedInfo: isHindi
      ? "यह जानकारी आपकी स्पष्ट अनुमति के आधार पर दिखाई जा रही है।"
      : "This information is shown based on your explicit authorization.",
    revoke: isHindi ? "एक्सेस वापस लें" : "Revoke Access",
    authorized: isHindi ? "केयरगिवर एक्सेस अधिकृत है" : "Caregiver Access Authorized",
    authorizedFor: isHindi ? "अधिकृत caregiver:" : "Authorized caregiver:",
    games: isHindi ? "पूरे किए गए गेम्स" : "Games Completed",
    average: isHindi ? "औसत स्कोर" : "Average Score",
    activeDays: isHindi ? "सक्रिय दिन" : "Active Days",
    trainingTime: isHindi ? "ट्रेनिंग समय" : "Training Time",
    minutes: isHindi ? "मिनट" : "minutes",
    recentActivity: isHindi ? "हाल की गतिविधि" : "RECENT ACTIVITY",
    trainingOverview: isHindi ? "ट्रेनिंग ओवरव्यू" : "Training Overview",
    noActivity: isHindi ? "अभी कोई गतिविधि नहीं है" : "No Activity Yet",
    completeActivity: isHindi
      ? "कॉग्निटिव गेम पूरा करने के बाद आपकी गतिविधि यहाँ दिखाई देगी।"
      : "Your activity will appear here after completing a cognitive game.",
    activitySummary: isHindi ? "गतिविधि सारांश" : "ACTIVITY SUMMARY",
    tracking: isHindi
      ? "MindCare आपकी cognitive training activity और scores को ट्रैक करता है।"
      : "MindCare tracks your cognitive training activity and scores.",
    startGame: isHindi
      ? "अपना पहला cognitive game शुरू करें।"
      : "Start your first cognitive game.",
    completed: isHindi ? "आपने" : "You have completed",
    activity: isHindi ? "गतिविधि" : "activity",
    activities: isHindi ? "गतिविधियाँ" : "activities",
    across: isHindi ? "इन" : "across",
    gameType: isHindi ? "गेम प्रकार" : "game type",
    gameTypes: isHindi ? "गेम प्रकारों" : "game types",
    privacy: isHindi ? "प्राइवेसी" : "PRIVACY",
    dataControl: isHindi ? "डेटा आपके नियंत्रण में है" : "Your Data Is Under Your Control",
    privacyDescription: isHindi
      ? "केयरगिवर एक्सेस केवल आपकी अनुमति से उपलब्ध है और आप इसे किसी भी समय वापस ले सकते हैं।"
      : "Caregiver access is available only with your permission and can be revoked at any time.",
    revokeAccess: isHindi ? "केयरगिवर एक्सेस वापस लें" : "Revoke Caregiver Access",
  };

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
            {text.loading}
          </h1>

          <p className="description">
            {text.fetching}
          </p>

        </div>

      ) : !authorized ? (

        <div className="caregiver-access">

          <div className="caregiver-icon">
            🔐
          </div>

          <p className="small-title">
            {text.accessTitle}
          </p>

          <h1>
            {text.privateDashboard}
          </h1>

          <p className="description">
            {text.accessDescription}
          </p>

          <div className="authorization-card">

            <h3>
              🔐 {text.authorizationRequired}
            </h3>

            <p>
              {text.authorizationInstructions}
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
              {text.authorize} →
            </button>

          </div>

          <div className="caregiver-privacy-note">
            🛡️ {text.revokeAnytime}
          </div>

        </div>

      ) : (

        <>
          <div className="caregiver-header">

            <div>

              <p className="small-title">
                {text.dashboard}
              </p>

              <h1>
                {userName}
                {text.overview}
              </h1>

              <p className="description">
                {text.authorizedInfo}
              </p>

            </div>

            <button
              className="secondary-btn"
              onClick={revokeAccess}
            >
              {text.revoke}
            </button>

          </div>


          <div className="caregiver-authorized-banner">

            <span>🔐</span>

            <div>

              <strong>
                {text.authorized}
              </strong>

              <small>
                {text.authorizedFor}{" "}
                {access?.caregiverEmail}
              </small>

            </div>

          </div>


          <div className="caregiver-stats">

            <div className="caregiver-stat">

              <span>🎮</span>

              <div>
                <small>
                  {text.games}
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
                  {text.average}
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
                  {text.activeDays}
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
                  {text.trainingTime}
                </small>

                <strong>
                  {totalMinutes}{" "}
                  {text.minutes}
                </strong>
              </div>

            </div>

          </div>


          <div className="caregiver-grid">

            <div className="caregiver-card">

              <div className="caregiver-card-heading">

                <div>

                  <span className="card-label">
                    {text.recentActivity}
                  </span>

                  <h2>
                    {text.trainingOverview}
                  </h2>

                </div>

              </div>


              {recentScores.length === 0 ? (

                <div className="caregiver-empty">

                  <span>🧠</span>

                  <h3>
                    {text.noActivity}
                  </h3>

                  <p>
                    {text.completeActivity}
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
                {text.activitySummary}
              </span>

              <h2>
                {text.trainingOverview}
              </h2>

              <p className="description">
                {text.tracking}
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
                      } ${text.across} ${gameTypes} ${
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
              {text.privacy}
            </span>

            <h2>
              {text.dataControl}
            </h2>

            <p className="description">
              {text.privacyDescription}
            </p>

            <button
              className="secondary-btn"
              onClick={revokeAccess}
            >
              {text.revokeAccess}
            </button>

          </div>
        </>

      )}

    </div>
  );
}

export default Caregiver;