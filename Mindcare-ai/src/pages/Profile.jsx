import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Profile() {
  const { language, changeLanguage, t } = useLanguage();

  const [largeText, setLargeText] = useState(
    localStorage.getItem("mindcareLargeText") === "true"
  );

  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("mindcareHighContrast") === "true"
  );

  const [reducedMotion, setReducedMotion] = useState(
    localStorage.getItem("mindcareReducedMotion") === "true"
  );

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userName = user?.name || "User";
  const userEmail = user?.email || "No email";
  const userPhone = user?.phone || "No phone";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* ACCESSIBILITY SETTINGS */

  useEffect(() => {
    document.body.classList.toggle(
      "large-text-mode",
      largeText
    );

    document.body.classList.toggle(
      "high-contrast-mode",
      highContrast
    );

    document.body.classList.toggle(
      "reduced-motion-mode",
      reducedMotion
    );

    localStorage.setItem(
      "mindcareLargeText",
      largeText
    );

    localStorage.setItem(
      "mindcareHighContrast",
      highContrast
    );

    localStorage.setItem(
      "mindcareReducedMotion",
      reducedMotion
    );
  }, [largeText, highContrast, reducedMotion]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  }

  return (
    <div className="page profile-page">

      {/* PROFILE HEADER */}

      <div className="profile-header">

        <div className="profile-avatar">
          {initials}
        </div>

        <div>
          <p className="small-title">
            {t("myProfile")}
          </p>

          <h1>
            {t("welcomeBack")}, {userName}.
          </h1>

          <p className="description">
            {t("manageProfile")}
          </p>
        </div>

      </div>


      {/* PERSONAL INFORMATION */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>👤</span>

          <div>
            <h2>
              {t("personalInformation")}
            </h2>

            <p>
              {t("basicProfile")}
            </p>
          </div>

        </div>


        <div className="profile-grid">

          <div className="profile-field">
            <label>
              {t("fullName")}
            </label>

            <div>
              {userName}
            </div>
          </div>


          <div className="profile-field">
            <label>
              {t("email")}
            </label>

            <div>
              {userEmail}
            </div>
          </div>


          <div className="profile-field">
            <label>
              {t("mobileNumber")}
            </label>

            <div>
              {userPhone}
            </div>
          </div>


          <div className="profile-field">
            <label>
              {t("memberSince")}
            </label>

            <div>
              {user?.id
                ? "September 2026"
                : t("notAvailable")}
            </div>
          </div>

        </div>

      </div>


      {/* PREFERENCES */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>⚙️</span>

          <div>
            <h2>
              {t("preferences")}
            </h2>

            <p>
              {t("customizeMindcare")}
            </p>
          </div>

        </div>


        {/* LANGUAGE */}

        <div className="setting-row">

          <div>
            <strong>
              {t("language")}
            </strong>

            <p>
              {t("chooseLanguage")}
            </p>
          </div>

          <select
            value={language}
            onChange={(event) =>
              changeLanguage(event.target.value)
            }
            aria-label={t("chooseLanguage")}
          >
            <option value="English">
              English
            </option>

            <option value="Hindi">
              हिन्दी
            </option>
          </select>

        </div>


        {/* LARGE TEXT */}

        <div className="setting-row">

          <div>
            <strong>
              {t("largeText")}
            </strong>

            <p>
              {t("easierToRead")}
            </p>
          </div>

          <button
            type="button"
            className={
              largeText
                ? "settings-toggle on"
                : "settings-toggle"
            }
            onClick={() =>
              setLargeText((value) => !value)
            }
            aria-pressed={largeText}
          >
            {largeText
              ? t("on")
              : t("off")}
          </button>

        </div>


        {/* HIGH CONTRAST */}

        <div className="setting-row">

          <div>
            <strong>
              {t("highContrast")}
            </strong>

            <p>
              {t("increaseContrast")}
            </p>
          </div>

          <button
            type="button"
            className={
              highContrast
                ? "settings-toggle on"
                : "settings-toggle"
            }
            onClick={() =>
              setHighContrast((value) => !value)
            }
            aria-pressed={highContrast}
          >
            {highContrast
              ? t("on")
              : t("off")}
          </button>

        </div>


        {/* REDUCED MOTION */}

        <div className="setting-row">

          <div>
            <strong>
              {t("reducedMotion")}
            </strong>

            <p>
              {t("reduceAnimations")}
            </p>
          </div>

          <button
            type="button"
            className={
              reducedMotion
                ? "settings-toggle on"
                : "settings-toggle"
            }
            onClick={() =>
              setReducedMotion((value) => !value)
            }
            aria-pressed={reducedMotion}
          >
            {reducedMotion
              ? t("on")
              : t("off")}
          </button>

        </div>

      </div>


      {/* PRIVACY */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>🔒</span>

          <div>
            <h2>
              {t("privacySafety")}
            </h2>

            <p>
              {t("informationControl")}
            </p>
          </div>

        </div>


        <div className="privacy-items">

          <div>
            <strong>
              🔐 {t("personalData")}
            </strong>

            <p>
              {t("personalDataText")}
            </p>
          </div>


          <div>
            <strong>
              👥 {t("caregiverAccess")}
            </strong>

            <p>
              {t("caregiverAccessText")}
            </p>
          </div>


          <div>
            <strong>
              🧠 {t("cognitiveWellness")}
            </strong>

            <p>
              {t("cognitiveWellnessText")}
            </p>
          </div>

        </div>

      </div>


      {/* HELP & SUPPORT - MOVED UP */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>❓</span>

          <div>
            <h2>
              Help & Support
            </h2>

            <p>
              Get assistance and contact customer care.
            </p>
          </div>

        </div>

        <a
          href="/help"
          className="profile-help-link"
        >
          🎧 Customer Care
        </a>

      </div>


      {/* ACCOUNT */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>🚪</span>

          <div>
            <h2>
              {t("account")}
            </h2>

            <p>
              {t("manageAccount")}
            </p>
          </div>

        </div>


        <button
          type="button"
          className="primary-btn"
          onClick={handleLogout}
        >
          {t("logout")}
        </button>

      </div>

    </div>
  );
}

export default Profile;