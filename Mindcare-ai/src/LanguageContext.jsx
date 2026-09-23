import { createContext, useContext, useState } from "react";

const translations = {
  English: {
    /* NAVBAR */

    home: "Home",
    games: "Games",
    memory: "Memory",
    progress: "Progress",
    reminders: "Reminders",
    caregiver: "Caregiver",
    aiCompanion: "AI Companion",
    leaderboard: "Leaderboard",
    profile: "Profile",
    logout: "Logout",
    admin: "Admin",
    login: "Login",

    /* PROFILE */

    myProfile: "MY PROFILE",
    welcomeBack: "Welcome back",
    manageProfile:
      "Manage your profile and personalize your MindCare experience.",

    personalInformation: "Personal Information",
    basicProfile: "Your basic profile information.",
    fullName: "Full Name",
    email: "Email",
    mobileNumber: "Mobile Number",
    memberSince: "Member Since",
    notAvailable: "Not available",

    preferences: "Preferences",
    customizeMindcare:
      "Customize how MindCare works for you.",

    language: "Language",
    chooseLanguage:
      "Choose your preferred language.",

    largeText: "Large Text",
    easierToRead:
      "Make text easier to read.",

    highContrast: "High Contrast",
    increaseContrast:
      "Increase visual contrast for accessibility.",

    reducedMotion: "Reduced Motion",
    reduceAnimations:
      "Reduce animations and visual movement.",

    privacySafety: "Privacy & Safety",
    informationControl:
      "Your information should remain under your control.",

    personalData: "Personal Data",
    personalDataText:
      "Your memories and activity data are intended for your personal MindCare experience.",

    caregiverAccess: "Caregiver Access",
    caregiverAccessText:
      "Caregiver access should only be available when you explicitly authorize it.",

    cognitiveWellness: "Cognitive Wellness",
    cognitiveWellnessText:
      "MindCare provides wellness and memory-support activities, not medical diagnosis.",

    account: "Account",
    manageAccount:
      "Manage your MindCare account and get support.",

    helpSupport: "Help & Support",

    on: "ON",
    off: "OFF",

    /* HOME DASHBOARD */

    personalDashboard: "PERSONAL DASHBOARD",

    hello: "Hello",

    cognitiveWellnessSpace:
      "Your personalized cognitive wellness space.",

    activeLearner: "Active Learner",
    startToday: "Start Today",

    gameCompleted: "game completed",
    gamesCompleted: "games completed",
    playFirstGame: "Play your first game",

    cognitiveScore: "Cognitive Score",
    todaysActivity: "Today's Activity",
    trainingTime: "Training Time",
    achievements: "Achievements",
    minutes: "min",

    trainingSummary: "TRAINING SUMMARY",
    yourActivity: "Your activity",

    activityHistoryText:
      "Keep building your personal cognitive activity history.",

    gamesPlayed: "Games Played",
    averageScore: "Average Score",

    aiInsight: "AI INSIGHT",

    startRecommendedExercise:
      "Start Recommended Exercise",

    yourProgress: "YOUR PROGRESS",

    dailyMindTraining:
      "Daily Mind Training",

    dailyTrainingDescription:
      "Complete cognitive activities to build your MindCare activity history.",

    memoryMatch: "Memory Match",
    visualMemory: "Visual memory",

    sequenceRecall: "Sequence Recall",
    recall: "Recall",

    reactionChallenge: "Reaction Challenge",
    attention: "Attention",

    wordRecall: "Word Recall",
    wordMemory: "Word memory",

    start: "Start",

    recentActivity: "RECENT ACTIVITY",
    latestGames: "Your latest games",

    noGamesPlayed: "No games played yet.",
    startFirstGame: "Start Your First Game",
    training: "Training",

    quickAccess: "QUICK ACCESS",
    whatWouldYouLike:
      "What would you like to do?",

    playGames: "Play Games",
    trainMemoryAttention:
      "Train memory and attention.",

    memoryVault: "Memory Vault",
    reviewMemories:
      "Review your important memories.",

    viewProgress: "View Progress",
    seeCognitiveActivity:
      "See your cognitive activity.",

    manageSmartReminders:
      "Manage your smart reminders.",

    /* HOME AI INSIGHTS */

    homeStartFirstTitle:
      "Start your first cognitive game.",

    homeStartFirstText:
      "Complete a cognitive activity so MindCare can build your personalized progress.",

    homeMemoryTitle:
      "Your visual memory training is underway.",

    homeMemoryText:
      "You have been practicing visual memory. Try different cognitive games to build a balanced training routine.",

    homeSequenceTitle:
      "Your recall training is underway.",

    homeSequenceText:
      "Sequence Recall is part of your activity history. Keep practicing regularly and explore other games too.",

    homeReactionTitle:
      "Your attention training is underway.",

    homeReactionText:
      "You have completed a reaction activity. Continue practicing attention and reaction speed.",

    homeWordTitle:
      "Your word memory training is underway.",

    homeWordText:
      "You have been practicing word recall. Try different games to exercise different cognitive skills.",

    homeGreatJobTitle:
      "Great job keeping your mind active.",

    homeGreatJobText:
      "Continue playing different cognitive games to build a broader activity history.",
  },

  Hindi: {
    /* NAVBAR */

    home: "होम",
    games: "गेम्स",
    memory: "मेमोरी",
    progress: "प्रगति",
    reminders: "रिमाइंडर",
    caregiver: "केयरगिवर",
    aiCompanion: "AI सहायक",
    leaderboard: "लीडरबोर्ड",
    profile: "प्रोफ़ाइल",
    logout: "लॉग आउट",
    admin: "एडमिन",
    login: "लॉगिन",

    /* PROFILE */

    myProfile: "मेरी प्रोफ़ाइल",
    welcomeBack: "वापसी पर स्वागत है",

    manageProfile:
      "अपनी प्रोफ़ाइल प्रबंधित करें और MindCare अनुभव को अपनी पसंद के अनुसार बनाएं।",

    personalInformation: "व्यक्तिगत जानकारी",
    basicProfile: "आपकी मूल प्रोफ़ाइल जानकारी।",

    fullName: "पूरा नाम",
    email: "ईमेल",
    mobileNumber: "मोबाइल नंबर",
    memberSince: "सदस्य बने",
    notAvailable: "उपलब्ध नहीं",

    preferences: "प्राथमिकताएँ",

    customizeMindcare:
      "MindCare आपके लिए कैसे काम करे, इसे अनुकूलित करें।",

    language: "भाषा",

    chooseLanguage:
      "अपनी पसंदीदा भाषा चुनें।",

    largeText: "बड़ा टेक्स्ट",

    easierToRead:
      "टेक्स्ट को पढ़ने में आसान बनाएं।",

    highContrast: "हाई कॉन्ट्रास्ट",

    increaseContrast:
      "सुलभता के लिए दृश्य कॉन्ट्रास्ट बढ़ाएं।",

    reducedMotion: "कम गति",

    reduceAnimations:
      "एनिमेशन और दृश्य गति को कम करें।",

    privacySafety:
      "गोपनीयता और सुरक्षा",

    informationControl:
      "आपकी जानकारी आपके नियंत्रण में रहनी चाहिए।",

    personalData: "व्यक्तिगत डेटा",

    personalDataText:
      "आपकी यादें और गतिविधि डेटा आपके व्यक्तिगत MindCare अनुभव के लिए हैं।",

    caregiverAccess:
      "केयरगिवर एक्सेस",

    caregiverAccessText:
      "केयरगिवर एक्सेस केवल आपकी स्पष्ट अनुमति के बाद उपलब्ध होना चाहिए।",

    cognitiveWellness:
      "संज्ञानात्मक स्वास्थ्य",

    cognitiveWellnessText:
      "MindCare स्वास्थ्य और मेमोरी-सपोर्ट गतिविधियाँ प्रदान करता है, चिकित्सा निदान नहीं।",

    account: "अकाउंट",

    manageAccount:
      "अपने MindCare अकाउंट को प्रबंधित करें और सहायता प्राप्त करें।",

    helpSupport:
      "सहायता और सपोर्ट",

    on: "चालू",
    off: "बंद",

    /* HOME DASHBOARD */

    personalDashboard:
      "व्यक्तिगत डैशबोर्ड",

    hello: "नमस्ते",

    cognitiveWellnessSpace:
      "आपका व्यक्तिगत संज्ञानात्मक स्वास्थ्य और वेलनेस स्पेस।",

    activeLearner:
      "सक्रिय लर्नर",

    startToday:
      "आज शुरू करें",

    gameCompleted:
      "गेम पूरा हुआ",

    gamesCompleted:
      "गेम पूरे हुए",

    playFirstGame:
      "अपना पहला गेम खेलें",

    cognitiveScore:
      "संज्ञानात्मक स्कोर",

    todaysActivity:
      "आज की गतिविधि",

    trainingTime:
      "ट्रेनिंग समय",

    achievements:
      "उपलब्धियाँ",

    minutes:
      "मिनट",

    trainingSummary:
      "ट्रेनिंग सारांश",

    yourActivity:
      "आपकी गतिविधि",

    activityHistoryText:
      "अपनी व्यक्तिगत संज्ञानात्मक गतिविधि का इतिहास बनाते रहें।",

    gamesPlayed:
      "खेले गए गेम",

    averageScore:
      "औसत स्कोर",

    aiInsight:
      "AI जानकारी",

    startRecommendedExercise:
      "सुझाया गया अभ्यास शुरू करें",

    yourProgress:
      "आपकी प्रगति",

    dailyMindTraining:
      "दैनिक माइंड ट्रेनिंग",

    dailyTrainingDescription:
      "अपनी MindCare गतिविधि का इतिहास बनाने के लिए संज्ञानात्मक गतिविधियाँ पूरी करें।",

    memoryMatch:
      "मेमोरी मैच",

    visualMemory:
      "विज़ुअल मेमोरी",

    sequenceRecall:
      "सीक्वेंस रिकॉल",

    recall:
      "याददाश्त",

    reactionChallenge:
      "रिएक्शन चैलेंज",

    attention:
      "ध्यान",

    wordRecall:
      "वर्ड रिकॉल",

    wordMemory:
      "शब्द मेमोरी",

    start:
      "शुरू करें",

    recentActivity:
      "हाल की गतिविधि",

    latestGames:
      "आपके नवीनतम गेम",

    noGamesPlayed:
      "अभी तक कोई गेम नहीं खेला गया।",

    startFirstGame:
      "अपना पहला गेम शुरू करें",

    training:
      "ट्रेनिंग",

    quickAccess:
      "त्वरित एक्सेस",

    whatWouldYouLike:
      "आप क्या करना चाहेंगे?",

    playGames:
      "गेम खेलें",

    trainMemoryAttention:
      "मेमोरी और ध्यान का अभ्यास करें।",

    memoryVault:
      "मेमोरी वॉल्ट",

    reviewMemories:
      "अपनी महत्वपूर्ण यादों को देखें।",

    viewProgress:
      "प्रगति देखें",

    seeCognitiveActivity:
      "अपनी संज्ञानात्मक गतिविधि देखें।",

    manageSmartReminders:
      "अपने स्मार्ट रिमाइंडर प्रबंधित करें।",

    /* HOME AI INSIGHTS */

    homeStartFirstTitle:
      "अपना पहला संज्ञानात्मक गेम शुरू करें।",

    homeStartFirstText:
      "एक संज्ञानात्मक गतिविधि पूरी करें ताकि MindCare आपकी व्यक्तिगत प्रगति तैयार कर सके।",

    homeMemoryTitle:
      "आपकी विज़ुअल मेमोरी ट्रेनिंग जारी है।",

    homeMemoryText:
      "आप विज़ुअल मेमोरी का अभ्यास कर रहे हैं। संतुलित ट्रेनिंग रूटीन बनाने के लिए अलग-अलग संज्ञानात्मक गेम आज़माएँ।",

    homeSequenceTitle:
      "आपकी रिकॉल ट्रेनिंग जारी है।",

    homeSequenceText:
      "सीक्वेंस रिकॉल आपकी गतिविधि का हिस्सा है। नियमित अभ्यास करते रहें और अन्य गेम भी आज़माएँ।",

    homeReactionTitle:
      "आपकी ध्यान और प्रतिक्रिया ट्रेनिंग जारी है।",

    homeReactionText:
      "आपने रिएक्शन गतिविधि पूरी की है। ध्यान और प्रतिक्रिया की गति का अभ्यास जारी रखें।",

    homeWordTitle:
      "आपकी शब्द मेमोरी ट्रेनिंग जारी है।",

    homeWordText:
      "आप वर्ड रिकॉल का अभ्यास कर रहे हैं। अलग-अलग संज्ञानात्मक क्षमताओं का अभ्यास करने के लिए अन्य गेम आज़माएँ।",

    homeGreatJobTitle:
      "अपने दिमाग को सक्रिय रखने के लिए बहुत अच्छा काम।",

    homeGreatJobText:
      "अपनी गतिविधि का बेहतर इतिहास बनाने के लिए अलग-अलग संज्ञानात्मक गेम खेलते रहें।",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("mindcareLanguage") || "English"
  );

  function changeLanguage(newLanguage) {
    setLanguage(newLanguage);
    localStorage.setItem(
      "mindcareLanguage",
      newLanguage
    );
  }

  function t(key) {
    return (
      translations[language]?.[key] ||
      translations.English[key] ||
      key
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}