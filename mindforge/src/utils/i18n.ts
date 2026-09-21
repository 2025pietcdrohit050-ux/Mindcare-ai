export type SupportedLanguage = 'en' | 'hi';

export const translations = {
  en: {
    // Brand
    brandName: 'MindMate AI',
    brandTagline: 'Stronger Minds, Brighter Days',
    slogan: 'Cognitive Wellness & Memory Assistance',

    // Navigation
    navDashboard: 'Dashboard',
    navGames: 'Play Games',
    navMemoryVault: 'Memory Vault',
    navProgress: 'Progress & Analytics',
    navAchievements: 'Achievements',
    navReminders: 'Reminders',
    navCaregiver: 'Caregiver Portal',
    navProfile: 'My Profile',
    navSettings: 'Settings & Accessibility',
    navAbout: 'About Platform',
    navLogin: 'Sign In',
    navSignUp: 'Get Started',
    navLogout: 'Sign Out',

    // Greetings
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    greetingSubtext: 'Ready for today’s personalized brain wellness exercise?',

    // Accessibility & UI Controls
    textScale: 'Text Size',
    highContrast: 'High Contrast',
    reducedMotion: 'Reduced Motion',
    languageSelect: 'Language',
    languageEnglish: 'English',
    languageHindi: 'हिन्दी (Hindi)',

    // Common Actions
    actionPlay: 'Play Game',
    actionPlayNow: 'Play Now',
    actionContinue: 'Continue',
    actionAddMemory: 'Add New Memory',
    actionAddReminder: 'New Reminder',
    actionSave: 'Save Changes',
    actionCancel: 'Cancel',
    actionDelete: 'Delete',
    actionEdit: 'Edit',
    actionReview: 'Review Memories',
    actionClose: 'Close',
    actionBack: 'Go Back',
    actionViewAll: 'View All',
    actionTryAgain: 'Play Again',

    // Dashboard Stats
    statCognitiveScore: 'Cognitive Score',
    statGamesCompleted: 'Games Completed',
    statAverageAccuracy: 'Average Accuracy',
    statCurrentDifficulty: 'Current Difficulty',
    statDailyStreak: 'Daily Streak',
    statDays: 'days',
    statAdaptiveNote: 'Automatically calibrated by AI',

    // Dashboard Sections
    sectionDailyPlan: "Today's Cognitive Plan",
    sectionWeeklyTrend: 'Weekly Performance Trend',
    sectionRecommendedActivity: 'Recommended For You',
    sectionUpcomingReminders: 'Upcoming Reminders',
    sectionRecentMemories: 'Recent Memory Vault Entries',
    sectionAchievements: 'Milestones & Badges',
    sectionCaregiverStatus: 'Caregiver Connection',
    caregiverConnectedNote: 'Your authorized caregiver can view your wellness progress.',

    // Games
    gameMemoryMatch: 'Memory Match',
    gameMemoryMatchDesc: 'Flip and match pairs to sharpen visual recall and spatial memory.',
    gameSequenceMemory: 'Sequence Memory',
    gameSequenceMemoryDesc: 'Watch the sequence of glowing lights and repeat it accurately.',
    gamePatternRecognition: 'Pattern Recognition',
    gamePatternRecognitionDesc: 'Identify the missing link in visual and geometric sequences.',
    gameRecallChallenge: 'Recall Challenge',
    gameRecallChallengeDesc: 'Observe information flashcards and answer recall questions.',

    difficultyEasy: 'Gentle (Easy)',
    difficultyMedium: 'Balanced (Medium)',
    difficultyHard: 'Stimulating (Challenging)',
    difficultyAdaptive: 'Adaptive AI Mode',

    // Memory Vault
    catFamily: 'Family',
    catFriends: 'Friends',
    catPeople: 'Important People',
    catPlaces: 'Places',
    catEvents: 'Special Events',
    catNotes: 'Personal Notes',
    memoryEmptyTitle: 'Your Memory Vault is Ready',
    memoryEmptyDesc: 'Preserve cherished moments, familiar faces, and special places to review anytime.',
    memoryCardView: 'Cards',
    memoryTimelineView: 'Timeline',
    memoryReviewMode: 'Start Memory Review Quiz',

    // AI Companion
    aiCompanionTitle: 'MindMate AI Companion',
    aiCompanionSubtitle: 'Here to encourage, assist, and guide your daily exercises',
    aiPlaceholder: 'Ask a question or request a game recommendation...',
    aiSuggested1: 'What game should I play today?',
    aiSuggested2: 'How does my cognitive score look?',
    aiSuggested3: 'Help me review family memories',
    aiSuggested4: 'Share an encouraging thought',

    // Caregiver
    caregiverTitle: 'Caregiver Collaboration Portal',
    caregiverSubtitle: 'Safe, privacy-first wellness tracking for loved ones and support circles',
    caregiverInviteCode: 'Your Caregiver Connection Code',
    caregiverPrivacyNote: 'Personal memory notes marked private are never displayed to caregivers without explicit consent.',

    // Disclaimer
    medicalDisclaimer: 'MindMate AI is a cognitive wellness and memory support tool designed for positive mental stimulation. It is not intended to diagnose, treat, or cure dementia, Alzheimer’s disease, or any medical disorder.',
  },
  hi: {
    // Brand
    brandName: 'माइंडमेट AI (MindMate)',
    brandTagline: 'सशक्त मस्तिष्क, उज्ज्वल दिन',
    slogan: 'संज्ञानात्मक कल्याण एवं स्मृति सहायता मंच',

    // Navigation
    navDashboard: 'डैशबोर्ड',
    navGames: 'खेल खेलें',
    navMemoryVault: 'मेमोरी वॉल्ट (स्मृतियां)',
    navProgress: 'प्रगति एवं विश्लेषण',
    navAchievements: 'उपलब्धियां',
    navReminders: 'अनुस्मारक (रिमाइंडर)',
    navCaregiver: 'देखभालकर्ता पोर्टल',
    navProfile: 'मेरी प्रोफाइल',
    navSettings: 'सेटिंग्स एवं सुगमता',
    navAbout: 'मंच के बारे में',
    navLogin: 'साइन इन',
    navSignUp: 'शुरू करें',
    navLogout: 'साइन आउट',

    // Greetings
    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    greetingSubtext: 'क्या आप आज के व्यक्तिगत मस्तिष्क कल्याण अभ्यास के लिए तैयार हैं?',

    // Accessibility & UI Controls
    textScale: 'अक्षर का आकार',
    highContrast: 'उच्च कंट्रास्ट (High Contrast)',
    reducedMotion: 'कम हलचल (Reduced Motion)',
    languageSelect: 'भाषा',
    languageEnglish: 'English',
    languageHindi: 'हिन्दी (Hindi)',

    // Common Actions
    actionPlay: 'खेलें',
    actionPlayNow: 'अभी खेलें',
    actionContinue: 'आगे बढ़ें',
    actionAddMemory: 'नई स्मृति जोड़ें',
    actionAddReminder: 'नया रिमाइंडर',
    actionSave: 'सहेजें',
    actionCancel: 'रद्द करें',
    actionDelete: 'हटाएं',
    actionEdit: 'संपादित करें',
    actionReview: 'स्मृति समीक्षा',
    actionClose: 'बंद करें',
    actionBack: 'पीछे जाएं',
    actionViewAll: 'सभी देखें',
    actionTryAgain: 'पुनः प्रयास करें',

    // Dashboard Stats
    statCognitiveScore: 'संज्ञानात्मक स्कोर',
    statGamesCompleted: 'पूर्ण किए गए खेल',
    statAverageAccuracy: 'औसत सटीकता',
    statCurrentDifficulty: 'वर्तमान कठिनाई',
    statDailyStreak: 'दैनिक स्ट्रीक',
    statDays: 'दिन',
    statAdaptiveNote: 'AI द्वारा स्वतः समायोजित',

    // Dashboard Sections
    sectionDailyPlan: 'आज की कल्याण योजना',
    sectionWeeklyTrend: 'साप्ताहिक प्रदर्शन रुझान',
    sectionRecommendedActivity: 'आपके लिए अनुशंसित',
    sectionUpcomingReminders: 'आगामी रिमाइंडर',
    sectionRecentMemories: 'हाल की सुरक्षित स्मृतियां',
    sectionAchievements: 'मील के पत्थर और बैज',
    sectionCaregiverStatus: 'देखभालकर्ता कनेक्शन',
    caregiverConnectedNote: 'आपके अधिकृत देखभालकर्ता आपकी भलाई की प्रगति देख सकते हैं।',

    // Games
    gameMemoryMatch: 'मेमोरी मैच (कार्ड मिलान)',
    gameMemoryMatchDesc: 'दृश्य स्मृति और स्थानिक सजगता को तेज करने के लिए कार्ड जोड़ें।',
    gameSequenceMemory: 'अनुक्रम स्मृति (सीक्वेंस)',
    gameSequenceMemoryDesc: 'चमकती रोशनी के क्रम को ध्यान से देखें और सही ढंग से दोहराएं।',
    gamePatternRecognition: 'पैटर्न पहचान',
    gamePatternRecognitionDesc: 'दृश्य और ज्यामितीय अनुक्रमों में अगला सही पैटर्न पहचानें।',
    gameRecallChallenge: 'स्मरण चुनौती (रिकॉल)',
    gameRecallChallengeDesc: 'कार्ड पर दी गई जानकारी को ध्यान से देखें और प्रश्नों के उत्तर दें।',

    difficultyEasy: 'सहज (आसान)',
    difficultyMedium: 'संतुलित (मध्यम)',
    difficultyHard: 'उत्तेजक (कठिन)',
    difficultyAdaptive: 'अनुकूली AI मोड',

    // Memory Vault
    catFamily: 'परिवार',
    catFriends: 'मित्र',
    catPeople: 'महत्वपूर्ण लोग',
    catPlaces: 'स्थान',
    catEvents: 'विशेष अवसर',
    catNotes: 'व्यक्तिगत नोट्स',
    memoryEmptyTitle: 'आपकी मेमोरी वॉल्ट तैयार है',
    memoryEmptyDesc: 'अनमोल क्षणों, परिचित चेहरों और खास जगहों को सहेजें ताकि कभी भी समीक्षा कर सकें।',
    memoryCardView: 'कार्ड दृश्य',
    memoryTimelineView: 'समयरेखा (टाइमलाइन)',
    memoryReviewMode: 'स्मृति समीक्षा प्रश्नोत्तरी शुरू करें',

    // AI Companion
    aiCompanionTitle: 'माइंडमेट AI साथी',
    aiCompanionSubtitle: 'आपके दैनिक अभ्यासों में प्रोत्साहन, मार्गदर्शन और सहायता के लिए',
    aiPlaceholder: 'कोई प्रश्न पूछें या खेल का सुझाव मांगें...',
    aiSuggested1: 'आज मुझे कौन सा खेल खेलना चाहिए?',
    aiSuggested2: 'मेरा संज्ञानात्मक स्कोर कैसा है?',
    aiSuggested3: 'पारिवारिक यादों की समीक्षा में मदद करें',
    aiSuggested4: 'एक सकारात्मक प्रेरक विचार साझा करें',

    // Caregiver
    caregiverTitle: 'देखभालकर्ता सहयोग पोर्टल',
    caregiverSubtitle: 'अपनों और पारिवारिक सहायता चक्र के लिए सुरक्षित कल्याण ट्रैकिंग',
    caregiverInviteCode: 'आपका देखभालकर्ता कनेक्शन कोड',
    caregiverPrivacyNote: 'निजी चिह्नित स्मृतियां बिना स्पष्ट सहमति के देखभालकर्ता को नहीं दिखाई जाती हैं।',

    // Disclaimer
    medicalDisclaimer: 'माइंडमेट AI एक मानसिक कल्याण एवं स्मृति सहायता मंच है जिसे सकारात्मक मानसिक उत्तेजना के लिए तैयार किया गया है। यह डिमेंशिया या अल्जाइमर जैसे किसी भी चिकित्सीय विकार के निदान, उपचार या इलाज के लिए नहीं है।',
  },
};
