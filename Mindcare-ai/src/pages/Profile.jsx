import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Profile() {
  const { language, changeLanguage } = useLanguage();
  const isHindi = language === "Hindi";

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

  const userName = user?.name || (isHindi ? "उपयोगकर्ता" : "User");
  const userEmail = user?.email || (isHindi ? "ईमेल उपलब्ध नहीं है" : "No email");
  const userPhone = user?.phone || (isHindi ? "फोन उपलब्ध नहीं है" : "No phone");

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  const text = {
    myProfile: isHindi ? "मेरी प्रोफ़ाइल" : "MY PROFILE",

    welcomeBack: isHindi
      ? "वापसी पर स्वागत है"
      : "Welcome back",

    manageProfile: isHindi
      ? "अपनी प्रोफ़ाइल, प्राथमिकताएँ और एक्सेसिबिलिटी सेटिंग्स प्रबंधित करें।"
      : "Manage your profile, preferences and accessibility settings.",

    personalInformation: isHindi
      ? "व्यक्तिगत जानकारी"
      : "Personal Information",

    basicProfile: isHindi
      ? "आपकी मूल प्रोफ़ाइल जानकारी।"
      : "Your basic profile information.",

    fullName: isHindi ? "पूरा नाम" : "Full Name",

    email: isHindi ? "ईमेल" : "Email",

    mobileNumber: isHindi
      ? "मोबाइल नंबर"
      : "Mobile Number",

    memberSince: isHindi
      ? "सदस्य बने"
      : "Member Since",

    notAvailable: isHindi
      ? "उपलब्ध नहीं"
      : "Not Available",

    preferences: isHindi
      ? "प्राथमिकताएँ"
      : "Preferences",

    customizeMindcare: isHindi
      ? "MindCare को अपनी सुविधा के अनुसार अनुकूलित करें।"
      : "Customize MindCare to suit your needs.",

    language: isHindi ? "भाषा" : "Language",

    chooseLanguage: isHindi
      ? "अपनी पसंदीदा भाषा चुनें।"
      : "Choose your preferred language.",

    largeText: isHindi
      ? "बड़ा टेक्स्ट"
      : "Large Text",

    easierToRead: isHindi
      ? "स्क्रीन पर टेक्स्ट को पढ़ना आसान बनाता है।"
      : "Makes text easier to read on the screen.",

    highContrast: isHindi
      ? "हाई कॉन्ट्रास्ट"
      : "High Contrast",

    increaseContrast: isHindi
      ? "टेक्स्ट और बैकग्राउंड के बीच कंट्रास्ट बढ़ाता है।"
      : "Increases contrast between text and background.",

    reducedMotion: isHindi
      ? "कम मोशन"
      : "Reduced Motion",

    reduceAnimations: isHindi
      ? "एनिमेशन और मूवमेंट को कम करता है।"
      : "Reduces animations and movement.",

    on: isHindi ? "चालू" : "On",

    off: isHindi ? "बंद" : "Off",

    privacySafety: isHindi
      ? "प्राइवेसी और सुरक्षा"
      : "Privacy & Safety",

    informationControl: isHindi
      ? "अपनी जानकारी और एक्सेस को नियंत्रित करें।"
      : "Control your information and access.",

    personalData: isHindi
      ? "व्यक्तिगत डेटा"
      : "Personal Data",

    personalDataText: isHindi
      ? "आपकी व्यक्तिगत जानकारी आपके MindCare खाते से जुड़ी रहती है।"
      : "Your personal information is associated with your MindCare account.",

    caregiverAccess: isHindi
      ? "केयरगिवर एक्सेस"
      : "Caregiver Access",

    caregiverAccessText: isHindi
      ? "केयरगिवर आपकी अनुमति के बाद ही आपके साझा किए गए डेटा तक पहुँच सकता है।"
      : "A caregiver can access your shared data only after your authorization.",

    cognitiveWellness: isHindi
      ? "कॉग्निटिव वेलनेस"
      : "Cognitive Wellness",

    cognitiveWellnessText: isHindi
      ? "MindCare संज्ञानात्मक प्रशिक्षण और मेमोरी सहायता के लिए बनाया गया है।"
      : "MindCare is designed for cognitive training and memory assistance.",

    helpSupport: isHindi
      ? "मदद और सहायता"
      : "Help & Support",

    helpDescription: isHindi
      ? "सहायता प्राप्त करें और कस्टमर केयर से संपर्क करें।"
      : "Get assistance and contact customer care.",

    customerCare: isHindi
      ? "कस्टमर केयर"
      : "Customer Care",

    account: isHindi ? "खाता" : "Account",

    manageAccount: isHindi
      ? "अपने खाते को प्रबंधित करें।"
      : "Manage your account.",

    logout: isHindi ? "लॉग आउट" : "Logout",
  };

  return (
    <div className="page profile-page">

      {/* PROFILE HEADER */}

      <div className="profile-header">

        <div className="profile-avatar">
          {initials}
        </div>

        <div>
          <p className="small-title">
            {text.myProfile}
          </p>

          <h1>
            {text.welcomeBack}, {userName}.
          </h1>

          <p className="description">
            {text.manageProfile}
          </p>
        </div>

      </div>


      {/* PERSONAL INFORMATION */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>👤</span>

          <div>
            <h2>
              {text.personalInformation}
            </h2>

            <p>
              {text.basicProfile}
            </p>
          </div>

        </div>


        <div className="profile-grid">

          <div className="profile-field">
            <label>
              {text.fullName}
            </label>

            <div>
              {userName}
            </div>
          </div>


          <div className="profile-field">
            <label>
              {text.email}
            </label>

            <div>
              {userEmail}
            </div>
          </div>


          <div className="profile-field">
            <label>
              {text.mobileNumber}
            </label>

            <div>
              {userPhone}
            </div>
          </div>


          <div className="profile-field">
            <label>
              {text.memberSince}
            </label>

            <div>
              {user?.id
                ? "September 2026"
                : text.notAvailable}
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
              {text.preferences}
            </h2>

            <p>
              {text.customizeMindcare}
            </p>
          </div>

        </div>


        {/* LANGUAGE */}

        <div className="setting-row">

          <div>
            <strong>
              {text.language}
            </strong>

            <p>
              {text.chooseLanguage}
            </p>
          </div>

          <select
            value={language}
            onChange={(event) =>
              changeLanguage(event.target.value)
            }
            aria-label={text.chooseLanguage}
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
              {text.largeText}
            </strong>

            <p>
              {text.easierToRead}
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
              ? text.on
              : text.off}
          </button>

        </div>


        {/* HIGH CONTRAST */}

        <div className="setting-row">

          <div>
            <strong>
              {text.highContrast}
            </strong>

            <p>
              {text.increaseContrast}
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
              ? text.on
              : text.off}
          </button>

        </div>


        {/* REDUCED MOTION */}

        <div className="setting-row">

          <div>
            <strong>
              {text.reducedMotion}
            </strong>

            <p>
              {text.reduceAnimations}
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
              ? text.on
              : text.off}
          </button>

        </div>

      </div>


      {/* PRIVACY */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>🔒</span>

          <div>
            <h2>
              {text.privacySafety}
            </h2>

            <p>
              {text.informationControl}
            </p>
          </div>

        </div>


        <div className="privacy-items">

          <div>
            <strong>
              🔐 {text.personalData}
            </strong>

            <p>
              {text.personalDataText}
            </p>
          </div>


          <div>
            <strong>
              👥 {text.caregiverAccess}
            </strong>

            <p>
              {text.caregiverAccessText}
            </p>
          </div>


          <div>
            <strong>
              🧠 {text.cognitiveWellness}
            </strong>

            <p>
              {text.cognitiveWellnessText}
            </p>
          </div>

        </div>

      </div>


      {/* HELP & SUPPORT */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>❓</span>

          <div>
            <h2>
              {text.helpSupport}
            </h2>

            <p>
              {text.helpDescription}
            </p>
          </div>

        </div>

        <a
          href="/help"
          className="profile-help-link"
        >
          🎧 {text.customerCare}
        </a>

      </div>


      {/* ACCOUNT */}

      <div className="settings-section">

        <div className="settings-heading">

          <span>🚪</span>

          <div>
            <h2>
              {text.account}
            </h2>

            <p>
              {text.manageAccount}
            </p>
          </div>

        </div>


        <button
          type="button"
          className="primary-btn"
          onClick={handleLogout}
        >
          {text.logout}
        </button>

      </div>

    </div>
  );
}

export default Profile;
