import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { BrainCircuit, Globe, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/common/Button';

export const PublicLayout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">MindMate</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Stronger Minds, Brighter Days</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-emerald-600' : 'hover:text-slate-900'}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-emerald-600' : 'hover:text-slate-900'}>
              About SIH Platform
            </NavLink>
            <NavLink to="/dashboard" className="hover:text-slate-900">
              Live Demo
            </NavLink>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t('navLogin')}
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Launch Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl text-white">MindMate AI</span>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
                Smart India Hackathon 2026 (Problem Statement SIH26003). An AI-based cognitive gaming, memory assistance, and caregiver collaboration ecosystem built for gentle cognitive wellness.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy-First & Dignified Senior-Friendly Architecture</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Platform Navigation
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Personal Dashboard</Link></li>
                <li><Link to="/games" className="hover:text-emerald-400 transition-colors">Cognitive Games</Link></li>
                <li><Link to="/vault" className="hover:text-emerald-400 transition-colors">Memory Vault</Link></li>
                <li><Link to="/progress" className="hover:text-emerald-400 transition-colors">Progress Analytics</Link></li>
                <li><Link to="/caregiver" className="hover:text-emerald-400 transition-colors">Caregiver Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Accessibility & Tech
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>React 19 + TypeScript</li>
                <li>Tailwind CSS Adaptive Styling</li>
                <li>High Contrast & Font Scaling</li>
                <li>Hindi & English Localization</li>
                <li>Dynamic Difficulty Engine</li>
              </ul>
            </div>
          </div>

          {/* Mandatory Medical Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center mb-8">
            <p className="text-xs text-slate-400 max-w-4xl mx-auto leading-relaxed">
              <strong className="text-slate-300">Cognitive Wellness Scope Notice: </strong>
              {t('medicalDisclaimer')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800 gap-4">
            <p>© 2026 MindMate AI. Smart India Hackathon Project SIH26003.</p>
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-slate-300">About & Architecture</Link>
              <Link to="/settings" className="hover:text-slate-300">Settings</Link>
              <Link to="/dashboard" className="hover:text-slate-300">Demo Mode</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
