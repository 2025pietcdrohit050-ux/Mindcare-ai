import React from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { storageService } from '../utils/storage';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Settings,
  Sliders,
  Globe,
  RotateCcw,
  Download,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    textScale,
    setTextScale,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    soundEnabled,
    setSoundEnabled,
  } = useAccessibility();

  const { language, setLanguage, t } = useLanguage();
  const { resetAllDemoData } = useAuth();
  const { addToast } = useToast();

  const handleReset = () => {
    if (confirm('Restore default hackathon demo data? All temporary sessions and memories will reset to baseline.')) {
      resetAllDemoData();
      addToast('Demo data restored to default', 'success');
    }
  };

  const handleExport = () => {
    const data = {
      profile: storageService.getUserProfile(),
      memories: storageService.getMemories(),
      reminders: storageService.getReminders(),
      sessions: storageService.getSessions(),
      achievements: storageService.getAchievements(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmate_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup JSON exported successfully', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <Settings className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Settings & Universal Accessibility
          </h1>
        </div>
        <p className="text-sm text-slate-600">
          Tailor typography sizes, visual contrast, audio feedback, and data privacy.
        </p>
      </div>

      {/* Accessibility Controls */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Accessibility & Visual Comfort</h2>
        </div>

        <div className="space-y-6">
          {/* Font Scaling */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800">{t('textScale')}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Active: {textScale === 'normal' ? '100% Standard' : textScale === 'large' ? '115% Large' : '130% Extra Large'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setTextScale('normal')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  textScale === 'normal' ? 'bg-white shadow-xs text-emerald-700 font-extrabold' : 'text-slate-600'
                }`}
              >
                100% Standard
              </button>
              <button
                onClick={() => setTextScale('large')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  textScale === 'large' ? 'bg-white shadow-xs text-emerald-700 font-extrabold' : 'text-slate-600'
                }`}
              >
                115% Large
              </button>
              <button
                onClick={() => setTextScale('xl')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  textScale === 'xl' ? 'bg-white shadow-xs text-emerald-700 font-extrabold' : 'text-slate-600'
                }`}
              >
                130% Extra Large
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div>
              <span className="text-sm font-bold text-slate-800 block">{t('highContrast')}</span>
              <span className="text-xs text-slate-500">
                Enhance edge clarity and contrast for optimal legibility.
              </span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                highContrast ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div>
              <span className="text-sm font-bold text-slate-800 block">{t('reducedMotion')}</span>
              <span className="text-xs text-slate-500">
                Minimize card transitions and animations for motion sensitivity.
              </span>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                reducedMotion ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute`}
              />
            </button>
          </div>

          {/* Sound Cues */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                Audio Feedback & Chimes
              </span>
              <span className="text-xs text-slate-500">
                Gentle tone frequencies for card matches, sequence cues, and reminder bells.
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                soundEnabled ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Language Preferences */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
          <Globe className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Regional Language Selection</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border-2 text-left font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-base block">English (US / IN)</span>
            <span className="text-xs font-normal text-slate-500">Default interface language</span>
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`p-4 rounded-2xl border-2 text-left font-bold transition-all cursor-pointer ${
              language === 'hi'
                ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-base block">हिन्दी (Hindi)</span>
            <span className="text-xs font-normal text-slate-500">राष्ट्रीय भाषा इंटरफ़ेस</span>
          </button>
        </div>
      </Card>

      {/* Demo Mode & Data Export */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Hackathon Presentation & Data Tools</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          For judge evaluation or fresh testing, you can reset the entire sandbox to initial demo state or download an offline JSON backup.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleReset}
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Restore Seed Demo Data
          </Button>
          <Button
            onClick={handleExport}
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Backup JSON
          </Button>
        </div>
      </Card>

      {/* Privacy Notice */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200/80 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-slate-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Privacy & Security Commitment:</strong> All personal memories, daily schedules, and game accuracy statistics are maintained locally in your browser's private state. No personal data is transmitted without explicit authorization.
        </div>
      </div>
    </div>
  );
};
