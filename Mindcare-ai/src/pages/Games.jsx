import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Games() {
  const { t } = useLanguage();

  return (
    <div className="page">

      <p className="small-title">
        {t("cognitiveGames")}
      </p>

      <h1>
        {t("trainMindThroughPlay")}
      </h1>

      <p className="description">
        {t("chooseActivity")}
      </p>

      <div className="page-card-grid">

        {/* MEMORY MATCH */}
        <div className="page-card">
          <span>🧩</span>

          <h3>
            {t("memoryMatch")}
          </h3>

          <p>
            {t("memoryMatchDescription")}
          </p>

          <Link
            to="/games/memory-match"
            className="primary-btn"
          >
            {t("playGame")} →
          </Link>
        </div>

        {/* SEQUENCE RECALL */}
        <div className="page-card">
          <span>🔢</span>

          <h3>
            {t("sequenceRecall")}
          </h3>

          <p>
            {t("sequenceRecallDescription")}
          </p>

          <Link
            to="/games/sequence-recall"
            className="primary-btn"
          >
            {t("playGame")} →
          </Link>
        </div>

        {/* REACTION CHALLENGE */}
        <div className="page-card">
          <span>⚡</span>

          <h3>
            {t("reactionChallenge")}
          </h3>

          <p>
            {t("reactionChallengeDescription")}
          </p>

          <Link
            to="/games/reaction-challenge"
            className="primary-btn"
          >
            {t("playGame")} →
          </Link>
        </div>

        {/* WORD RECALL */}
        <div className="page-card">
          <span>🔤</span>

          <h3>
            {t("wordRecall")}
          </h3>

          <p>
            {t("wordRecallDescription")}
          </p>

          <Link
            to="/games/word-recall"
            className="primary-btn"
          >
            {t("playGame")} →
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Games;
