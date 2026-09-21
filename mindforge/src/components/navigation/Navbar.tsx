import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import {
  Globe,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Gamepad2,
  FolderHeart,
  TrendingUp,
  Award,
  Bell,
  Users,
  Settings,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const {
    textScale,
    setTextScale,
    highContrast,
    setHighContrast,
    soundEnabled,
    setSoundEnabled,
  } = useAccessibility();
  const { resetAllDemoData } = useAuth();
  const { addToast } = useToast();

  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResetDemo = () => {
    resetAllDemoData();
    addToast('Demo data restored to initial state for presentation.', 'info');
  };

  const navLinks = [
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/games', label: t('navGames'), icon: Gamepad2 },
    { to: '/vault', label: t('navMemoryVault'), icon: FolderHeart },
    { to: '/progress', label: t('navProgress'), icon: TrendingUp },
    { to: '/achievements', label: t('navAchievements'), icon: Award },
    { to: '/reminders', label: t('navReminders'), icon: Bell },
    { to: '/caregiver', label: t('navCaregiver'), icon: Users },
    { to: '/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Brand & Menu button */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">MindMate AI</span>
        </Link>
      </div>

      {/* Desktop breadcrumb / tagline */}
      <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5" />
          SIH 2026 Innovation Edition
        </span>
      </div>

      {/* Right Controls: Accessibility, Language, Demo Reset */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetDemo}
          title="Reset Demo Data"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Demo Reset</span>
        </button>

        {/* Language Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            aria-label="Switch language between English and Hindi"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>
        </div>

        {/* Accessibility Panel Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsAccessOpen(!isAccessOpen)}
            aria-label="Accessibility options"
            aria-expanded={isAccessOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Accessibility</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Accessibility Dropdown Popover */}
          {isAccessOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Comfort & Assistive Tools
                </span>
                <button
                  onClick={() => setIsAccessOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Text Size Scaling */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {t('textScale')}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setTextScale('normal')}
                    className={`py-1.5 rounded-lg transition-all ${
                      textScale === 'normal' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setTextScale('large')}
                    className={`py-1.5 rounded-lg transition-all ${
                      textScale === 'large' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    115%
                  </button>
                  <button
                    onClick={() => setTextScale('xl')}
                    className={`py-1.5 rounded-lg transition-all ${
                      textScale === 'xl' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    130%
                  </button>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">{t('highContrast')}</span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  role="switch"
                  aria-checked={highContrast}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    highContrast ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    } top-1 absolute`}
                  />
                </button>
              </div>

              {/* Sound Audio Cues Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                  Sound Cues
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  role="switch"
                  aria-checked={soundEnabled}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    soundEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    } top-1 absolute`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-white z-50 lg:hidden p-6 overflow-y-auto">
          <nav className="space-y-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 text-current" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
