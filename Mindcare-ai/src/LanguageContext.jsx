import { createContext, useContext, useState } from "react";

const translations = {
  English: {
    /* ================= NAVBAR ================= */

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

    /* ================= PROFILE ================= */

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

    /* ================= HOME ================= */

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
    dailyMindTraining: "Daily Mind Training",
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

    /* ================= GAMES ================= */

    cognitiveGames: "COGNITIVE GAMES",
    trainMindThroughPlay:
      "Train your mind through engaging activities.",
    chooseActivity: "Choose an Activity",

    memoryMatchDescription:
      "Test and improve your visual memory by matching pairs.",
    sequenceRecallDescription:
      "Remember and reproduce the sequence shown to you.",
    reactionChallengeDescription:
      "Test your attention and reaction speed.",
    wordRecallDescription:
      "Remember the words shown and recall them correctly.",
    playGame: "Play Game",

    /* ================= MEMORY ================= */

    memoryVaultTitle: "MEMORY VAULT",
    memoryKeepThings:
      "Keep important things you want to remember.",
    memoryDescription:
      "Store personal memories, notes and important information in one place.",

    close: "Close",
    addMemory: "Add Memory",
    addNewMemory: "Add New Memory",

    title: "Title",
    memoryTitlePlaceholder:
      "Enter memory title",

    category: "Category",
    memory: "Memory",
    memoryTextPlaceholder:
      "Write something you want to remember...",

    saveMemory: "Save Memory",

    all: "All",
    noMemories: "No memories found.",
    addMemoryToCategory:
      "Add a memory to this category.",
    deleteMemory: "Delete Memory",

    memoryPeople: "People",
    memoryPlaces: "Places",
    memoryEvents: "Events",
    memoryNotes: "Notes",
    memoryRoutines: "Routines",
    memoryFavoriteThings: "Favorite Things",

    /* ================= PROGRESS ================= */

    progressAnalytics: "PROGRESS & ANALYTICS",
    trackCognitiveJourney:
      "Track your cognitive activity and personal progress.",
    reviewActivityScores:
      "Review your activity, scores and achievements.",

    lastSevenDays: "Last 7 Days",
    averageGameScore: "Average Game Score",
    best: "Best",
    gamesCompleted: "Games Completed",
    acrossGameTypes: "Across game types",

    trainingTime: "Training Time",
    recordedGameTime: "Recorded game time",
    currentStreak: "Current Streak",
    days: "days",
    personalBest: "Personal Best",

    dailyActivity: "Daily Activity",
    noActivityYet: "No activity yet.",
    completeGameToStartProgress:
      "Complete a game to start building your progress.",

    game: "Game",
    games: "Games",
    dailyValuesNote:
      "Daily values are based on your recorded game activity.",

    gamePerformance: "Game Performance",
    activityBreakdown: "Activity Breakdown",
    gamePerformanceEmpty:
      "Play some games to see your performance here.",
    bestScore: "Best Score",

    achievements: "Achievements",
    yourMilestones: "Your Milestones",

    firstGame: "First Game",
    firstGameDescription:
      "Complete your first cognitive game.",

    memoryExplorer: "Memory Explorer",
    memoryExplorerDescription:
      "Practice your memory through cognitive activities.",

    focusBuilder: "Focus Builder",
    focusBuilderDescription:
      "Complete attention and reaction activities.",

    sevenDayStreak: "7 Day Streak",
    sevenDayStreakDescription:
      "Stay active for seven consecutive days.",

    tenGames: "10 Games",
    tenGamesDescription:
      "Complete ten cognitive games.",

    twentyFiveGames: "25 Games",
    twentyFiveGamesDescription:
      "Complete twenty-five cognitive games.",

    /* ================= REMINDERS ================= */

    smartReminders: "SMART REMINDERS",
    stayOnTrack:
      "Stay on track with your daily activities.",
    reminderDescription:
      "Create reminders for cognitive exercises, routines and personal activities.",

    addReminder: "Add Reminder",
    createReminder: "Create Reminder",

    reminderTitle: "Reminder Title",
    reminderTitlePlaceholder:
      "Enter reminder title",

    time: "Time",
    reminderType: "Reminder Type",

    cognitiveExercise: "Cognitive Exercise",
    memoryReminder: "Memory Reminder",
    dailyRoutine: "Daily Routine",
    medicationReminder: "Medication Reminder",
    personalReminder: "Personal Reminder",

    saveReminder: "Save Reminder",
    disableReminder: "Disable Reminder",
    enableReminder: "Enable Reminder",
    deleteReminder: "Delete Reminder",

    /* ================= CAREGIVER ================= */

    enterCaregiverEmail:
      "Enter caregiver email",
    authorizationFailed:
      "Authorization failed.",
    backendConnectionError:
      "Unable to connect to the backend.",
    revokeAccessFailed:
      "Failed to revoke caregiver access.",

    caregiverAccessTitle:
      "CAREGIVER ACCESS",
    privateSupportDashboard:
      "Private support dashboard",
    caregiverAccessDescription:
      "Give a trusted caregiver access to selected activity information only when you authorize it.",

    authorizationRequired:
      "Authorization Required",
    authorizationInstructions:
      "Enter the email address of the caregiver you want to authorize.",
    authorizeCaregiver:
      "Authorize Caregiver",
    revokeAnytime:
      "You can revoke access at any time.",

    caregiverDashboard:
      "Caregiver Dashboard",
    wellnessOverview:
      "Wellness Overview",
    authorizedActivityInfo:
      "Authorized Activity Information",
    revokeAccess:
      "Revoke Access",

    caregiverAccessAuthorized:
      "Caregiver access is authorized.",
    authorizedFor:
      "Authorized for",

    activeDays: "Active Days",

    recentActivity: "Recent Activity",
    trainingOverview: "Training Overview",
    noActivityYet: "No activity yet.",
    completeGameActivity:
      "Complete a game to create activity.",

    activitySummary: "Activity Summary",
    mindcareTrackingDescription:
      "MindCare tracks cognitive activity to help you review your personal wellness journey.",

    startCognitiveGame:
      "Start Cognitive Game",

    completedPrefix: "Completed",
    activity: "activity",
    activities: "activities",
    across: "across",
    gameType: "game type",
    gameTypes: "game types",

    privacy: "Privacy",
    dataUnderControl:
      "Your data remains under your control.",
    caregiverPrivacyDescription:
      "Caregiver access is available only after explicit authorization.",

    revokeCaregiverAccess:
      "Revoke Caregiver Access",

    /* ================= COMMON ================= */

    loadingCaregiverDashboard:
      "Loading caregiver dashboard...",
  },

  Hindi: {
    /* ================= NAVBAR ================= */

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

    /* ================= PROFILE ================= */

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

    privacySafety: "गोपनीयता और सुरक्षा",
    informationControl:
      "आपकी जानकारी आपके नियंत्रण में रहनी चाहिए।",
    personalData: "व्यक्तिगत डेटा",
    personalDataText:
      "आपकी यादें और गतिविधि डेटा आपके व्यक्तिगत MindCare अनुभव के लिए हैं।",
    caregiverAccess: "केयरगिवर एक्सेस",
    caregiverAccessText:
      "केयरगिवर एक्सेस केवल आपकी स्पष्ट अनुमति के बाद उपलब्ध होना चाहिए।",
    cognitiveWellness: "संज्ञानात्मक स्वास्थ्य",
    cognitiveWellnessText:
      "MindCare स्वास्थ्य और मेमोरी-सपोर्ट गतिविधियाँ प्रदान करता है, चिकित्सा निदान नहीं।",

    account: "अकाउंट",
    manageAccount:
      "अपने MindCare अकाउंट को प्रबंधित करें और सहायता प्राप्त करें।",
    helpSupport: "सहायता और सपोर्ट",

    on: "चालू",
    off: "बंद",

    /* ================= HOME ================= */

    personalDashboard: "व्यक्तिगत डैशबोर्ड",
    hello: "नमस्ते",
    cognitiveWellnessSpace:
      "आपका व्यक्तिगत संज्ञानात्मक वेलनेस स्पेस।",
    activeLearner: "सक्रिय लर्नर",
    startToday: "आज शुरू करें",
    gameCompleted: "गेम पूरा हुआ",
    gamesCompleted: "गेम पूरे हुए",
    playFirstGame: "अपना पहला गेम खेलें",

    cognitiveScore: "संज्ञानात्मक स्कोर",
    todaysActivity: "आज की गतिविधि",
    trainingTime: "ट्रेनिंग समय",
    achievements: "उपलब्धियाँ",
    minutes: "मिनट",

    trainingSummary: "ट्रेनिंग सारांश",
    yourActivity: "आपकी गतिविधि",
    activityHistoryText:
      "अपनी व्यक्तिगत संज्ञानात्मक गतिविधि का इतिहास बनाते रहें।",
    gamesPlayed: "खेले गए गेम",
    averageScore: "औसत स्कोर",

    aiInsight: "AI जानकारी",
    startRecommendedExercise:
      "सुझाया गया अभ्यास शुरू करें",

    yourProgress: "आपकी प्रगति",
    dailyMindTraining: "दैनिक माइंड ट्रेनिंग",
    dailyTrainingDescription:
      "अपनी MindCare गतिविधि का इतिहास बनाने के लिए संज्ञानात्मक गतिविधियाँ पूरी करें।",

    memoryMatch: "मेमोरी मैच",
    visualMemory: "विज़ुअल मेमोरी",
    sequenceRecall: "सीक्वेंस रिकॉल",
    recall: "याददाश्त",
    reactionChallenge: "रिएक्शन चैलेंज",
    attention: "ध्यान",
    wordRecall: "वर्ड रिकॉल",
    wordMemory: "शब्द मेमोरी",
    start: "शुरू करें",

    recentActivity: "हाल की गतिविधि",
    latestGames: "आपके नवीनतम गेम",
    noGamesPlayed: "अभी तक कोई गेम नहीं खेला गया।",
    startFirstGame: "अपना पहला गेम शुरू करें",
    training: "ट्रेनिंग",

    quickAccess: "त्वरित एक्सेस",
    whatWouldYouLike:
      "आप क्या करना चाहेंगे?",
    playGames: "गेम खेलें",
    trainMemoryAttention:
      "मेमोरी और ध्यान का अभ्यास करें।",
    memoryVault: "मेमोरी वॉल्ट",
    reviewMemories:
      "अपनी महत्वपूर्ण यादों को देखें।",
    viewProgress: "प्रगति देखें",
    seeCognitiveActivity:
      "अपनी संज्ञानात्मक गतिविधि देखें।",
    manageSmartReminders:
      "अपने स्मार्ट रिमाइंडर प्रबंधित करें।",

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

    /* ================= GAMES ================= */

    cognitiveGames: "संज्ञानात्मक गेम्स",
    trainMindThroughPlay:
      "रोचक गतिविधियों के माध्यम से अपने दिमाग का अभ्यास करें।",
    chooseActivity: "एक गतिविधि चुनें",

    memoryMatchDescription:
      "जोड़े मिलाकर अपनी विज़ुअल मेमोरी का अभ्यास करें।",
    sequenceRecallDescription:
      "दिखाए गए क्रम को याद करें और दोबारा बनाएं।",
    reactionChallengeDescription:
      "अपने ध्यान और प्रतिक्रिया की गति का अभ्यास करें।",
    wordRecallDescription:
      "दिखाए गए शब्दों को याद करें और सही तरीके से दोहराएँ।",
    playGame: "गेम खेलें",

    /* ================= MEMORY ================= */

    memoryVaultTitle: "मेमोरी वॉल्ट",
    memoryKeepThings:
      "महत्वपूर्ण चीज़ें सुरक्षित रखें जिन्हें आप याद रखना चाहते हैं।",
    memoryDescription:
      "व्यक्तिगत यादों, नोट्स और महत्वपूर्ण जानकारी को एक जगह रखें।",

    close: "बंद करें",
    addMemory: "मेमोरी जोड़ें",
    addNewMemory: "नई मेमोरी जोड़ें",

    title: "शीर्षक",
    memoryTitlePlaceholder:
      "मेमोरी का शीर्षक दर्ज करें",

    category: "श्रेणी",
    memory: "मेमोरी",
    memoryTextPlaceholder:
      "वह जानकारी लिखें जिसे आप याद रखना चाहते हैं...",

    saveMemory: "मेमोरी सेव करें",

    all: "सभी",
    noMemories: "कोई मेमोरी नहीं मिली।",
    addMemoryToCategory:
      "इस श्रेणी में एक मेमोरी जोड़ें।",
    deleteMemory: "मेमोरी हटाएँ",

    memoryPeople: "लोग",
    memoryPlaces: "स्थान",
    memoryEvents: "घटनाएँ",
    memoryNotes: "नोट्स",
    memoryRoutines: "रूटीन",
    memoryFavoriteThings: "पसंदीदा चीज़ें",

    /* ================= PROGRESS ================= */

    progressAnalytics: "प्रगति और एनालिटिक्स",
    trackCognitiveJourney:
      "अपनी संज्ञानात्मक गतिविधि और व्यक्तिगत प्रगति को ट्रैक करें।",
    reviewActivityScores:
      "अपनी गतिविधि, स्कोर और उपलब्धियों को देखें।",

    lastSevenDays: "पिछले 7 दिन",
    averageGameScore: "औसत गेम स्कोर",
    best: "सर्वश्रेष्ठ",
    gamesCompleted: "पूरे किए गए गेम",
    acrossGameTypes: "सभी गेम प्रकारों में",

    trainingTime: "ट्रेनिंग समय",
    recordedGameTime: "रिकॉर्ड किया गया गेम समय",
    currentStreak: "वर्तमान स्ट्रीक",
    days: "दिन",
    personalBest: "व्यक्तिगत सर्वश्रेष्ठ",

    dailyActivity: "दैनिक गतिविधि",
    noActivityYet: "अभी कोई गतिविधि नहीं है।",
    completeGameToStartProgress:
      "अपनी प्रगति शुरू करने के लिए एक गेम पूरा करें।",

    game: "गेम",
    games: "गेम्स",
    dailyValuesNote:
      "दैनिक आँकड़े आपके रिकॉर्ड किए गए गेम गतिविधि पर आधारित हैं।",

    gamePerformance: "गेम प्रदर्शन",
    activityBreakdown: "गतिविधि विवरण",
    gamePerformanceEmpty:
      "अपना प्रदर्शन देखने के लिए कुछ गेम खेलें।",
    bestScore: "सर्वश्रेष्ठ स्कोर",

    achievements: "उपलब्धियाँ",
    yourMilestones: "आपकी उपलब्धियाँ",

    firstGame: "पहला गेम",
    firstGameDescription:
      "अपना पहला संज्ञानात्मक गेम पूरा करें।",

    memoryExplorer: "मेमोरी एक्सप्लोरर",
    memoryExplorerDescription:
      "संज्ञानात्मक गतिविधियों के माध्यम से अपनी मेमोरी का अभ्यास करें।",

    focusBuilder: "फोकस बिल्डर",
    focusBuilderDescription:
      "ध्यान और प्रतिक्रिया गतिविधियाँ पूरी करें।",

    sevenDayStreak: "7 दिन की स्ट्रीक",
    sevenDayStreakDescription:
      "लगातार सात दिनों तक सक्रिय रहें।",

    tenGames: "10 गेम्स",
    tenGamesDescription:
      "दस संज्ञानात्मक गेम पूरे करें।",

    twentyFiveGames: "25 गेम्स",
    twentyFiveGamesDescription:
      "पच्चीस संज्ञानात्मक गेम पूरे करें।",

    /* ================= REMINDERS ================= */

    smartReminders: "स्मार्ट रिमाइंडर",
    stayOnTrack:
      "अपनी दैनिक गतिविधियों के साथ जुड़े रहें।",
    reminderDescription:
      "संज्ञानात्मक अभ्यास, रूटीन और व्यक्तिगत गतिविधियों के लिए रिमाइंडर बनाएं।",

    addReminder: "रिमाइंडर जोड़ें",
    createReminder: "रिमाइंडर बनाएं",

    reminderTitle: "रिमाइंडर शीर्षक",
    reminderTitlePlaceholder:
      "रिमाइंडर का शीर्षक दर्ज करें",

    time: "समय",
    reminderType: "रिमाइंडर प्रकार",

    cognitiveExercise: "संज्ञानात्मक अभ्यास",
    memoryReminder: "मेमोरी रिमाइंडर",
    dailyRoutine: "दैनिक रूटीन",
    medicationReminder: "दवा रिमाइंडर",
    personalReminder: "व्यक्तिगत रिमाइंडर",

    saveReminder: "रिमाइंडर सेव करें",
    disableReminder: "रिमाइंडर बंद करें",
    enableReminder: "रिमाइंडर चालू करें",
    deleteReminder: "रिमाइंडर हटाएँ",

    /* ================= CAREGIVER ================= */

    enterCaregiverEmail:
      "केयरगिवर का ईमेल दर्ज करें",
    authorizationFailed:
      "अनुमति देने में समस्या हुई।",
    backendConnectionError:
      "बैकएंड से कनेक्ट नहीं हो पाया।",
    revokeAccessFailed:
      "केयरगिवर एक्सेस हटाने में समस्या हुई।",

    caregiverAccessTitle:
      "केयरगिवर एक्सेस",
    privateSupportDashboard:
      "निजी सपोर्ट डैशबोर्ड",
    caregiverAccessDescription:
      "केवल आपकी अनुमति के बाद किसी भरोसेमंद केयरगिवर को चुनी हुई गतिविधि जानकारी का एक्सेस दें।",

    authorizationRequired:
      "अनुमति आवश्यक है",
    authorizationInstructions:
      "जिस केयरगिवर को आप अनुमति देना चाहते हैं उसका ईमेल दर्ज करें।",
    authorizeCaregiver:
      "केयरगिवर को अनुमति दें",
    revokeAnytime:
      "आप किसी भी समय एक्सेस हटा सकते हैं।",

    caregiverDashboard:
      "केयरगिवर डैशबोर्ड",
    wellnessOverview:
      "वेलनेस ओवरव्यू",
    authorizedActivityInfo:
      "अनुमत गतिविधि जानकारी",
    revokeAccess:
      "एक्सेस हटाएँ",

    caregiverAccessAuthorized:
      "केयरगिवर एक्सेस अधिकृत है।",
    authorizedFor:
      "इसके लिए अधिकृत",

    activeDays: "सक्रिय दिन",

    recentActivity: "हाल की गतिविधि",
    trainingOverview: "ट्रेनिंग ओवरव्यू",
    noActivityYet: "अभी कोई गतिविधि नहीं है।",
    completeGameActivity:
      "गतिविधि बनाने के लिए एक गेम पूरा करें।",

    activitySummary: "गतिविधि सारांश",
    mindcareTrackingDescription:
      "MindCare आपकी व्यक्तिगत वेलनेस यात्रा की समीक्षा में सहायता के लिए संज्ञानात्मक गतिविधि को ट्रैक करता है।",

    startCognitiveGame:
      "संज्ञानात्मक गेम शुरू करें",

    completedPrefix: "पूरा किया",
    activity: "गतिविधि",
    activities: "गतिविधियाँ",
    across: "में",
    gameType: "गेम प्रकार",
    gameTypes: "गेम प्रकार",

    privacy: "गोपनीयता",
    dataUnderControl:
      "आपका डेटा आपके नियंत्रण में रहता है।",
    caregiverPrivacyDescription:
      "केयरगिवर एक्सेस केवल आपकी स्पष्ट अनुमति के बाद उपलब्ध होता है।",

    revokeCaregiverAccess:
      "केयरगिवर एक्सेस हटाएँ",

    loadingCaregiverDashboard:
      "केयरगिवर डैशबोर्ड लोड हो रहा है...",
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