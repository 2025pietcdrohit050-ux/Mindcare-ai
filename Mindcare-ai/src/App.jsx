import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import "./pages/AdminDashboard.css";
import { LanguageProvider, useLanguage } from "./LanguageContext";

import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Memory from "./pages/Memory";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import MemoryMatch from "./pages/MemoryMatch";
import SequenceRecall from "./pages/SequenceRecall";
import ReactionChallenge from "./pages/ReactionChallenge";
import WordRecall from "./pages/WordRecall";
import Caregiver from "./pages/Caregiver";
import AICompanion from "./pages/AICompanion";
import Login from "./pages/Login";
import Help from "./pages/HelpPage";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";

function AppContent() {
  const { t } = useLanguage();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userName = user?.name || "User";

  const isAdmin =
    isLoggedIn &&
    user?.email?.toLowerCase() ===
      "2025pietcdrohit050@poornima.org";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    window.location.href = "/login";
  }

  return (
    <BrowserRouter>
      <div className="app">

        <header className="navbar">

          <Link to="/" className="logo">
            <span>🧠</span>
            <h2>MindCare</h2>
          </Link>

          {isLoggedIn && (
            <nav>
              <Link to="/">{t("home")}</Link>
              <Link to="/games">{t("games")}</Link>
              <Link to="/memory">{t("memory")}</Link>
              <Link to="/progress">{t("progress")}</Link>
              <Link to="/reminders">{t("reminders")}</Link>
              <Link to="/caregiver">{t("caregiver")}</Link>
              <Link to="/ai-companion">{t("aiCompanion")}</Link>
              <Link to="/leaderboard">{t("leaderboard")}</Link>
            </nav>
          )}

          <div className="navbar-actions">

            {isLoggedIn ? (
              <>
                <span className="navbar-user">
                  👋 {userName}
                </span>

               {isAdmin && (
  <Link to="/admin" className="admin-nav-btn">
    🛡️ {t("admin")}
  </Link>
)}

                <Link to="/profile" className="profile-btn">
                  {t("profile")}
                </Link>

                <button
                  type="button"
                  className="profile-btn"
                  onClick={handleLogout}
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link to="/login" className="profile-btn">
                {t("login") || "Login"}
              </Link>
            )}

          </div>

        </header>

        <main className="home">

          <Routes>

            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games"
              element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              }
            />

            <Route
              path="/memory"
              element={
                <ProtectedRoute>
                  <Memory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/caregiver"
              element={
                <ProtectedRoute>
                  <Caregiver />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai-companion"
              element={
                <ProtectedRoute>
                  <AICompanion />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/memory-match"
              element={
                <ProtectedRoute>
                  <MemoryMatch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/sequence-recall"
              element={
                <ProtectedRoute>
                  <SequenceRecall />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/reaction-challenge"
              element={
                <ProtectedRoute>
                  <ReactionChallenge />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/word-recall"
              element={
                <ProtectedRoute>
                  <WordRecall />
                </ProtectedRoute>
              }
            />

            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;