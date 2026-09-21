import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { ToastContainer } from './components/common/Toast';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

// User Dashboard Pages
import { DashboardPage } from './pages/DashboardPage';
import { GamesHubPage } from './pages/GamesHubPage';
import { GamePlayerPage } from './pages/GamePlayerPage';
import { MemoryVaultPage } from './pages/MemoryVaultPage';
import { MemoryDetailPage } from './pages/MemoryDetailPage';
import { ProgressPage } from './pages/ProgressPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { RemindersPage } from './pages/RemindersPage';
import { CaregiverPage } from './pages/CaregiverPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                </Route>

                {/* Authenticated / User Dashboard Routes */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/games" element={<GamesHubPage />} />
                  <Route path="/games/:gameId" element={<GamePlayerPage />} />
                  <Route path="/vault" element={<MemoryVaultPage />} />
                  <Route path="/vault/:id" element={<MemoryDetailPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/reminders" element={<RemindersPage />} />
                  <Route path="/caregiver" element={<CaregiverPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Fallback */}
                <Route element={<PublicLayout />}>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default App;
