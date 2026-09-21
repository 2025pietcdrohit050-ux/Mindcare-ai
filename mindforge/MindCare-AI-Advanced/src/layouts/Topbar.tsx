import React, { useState } from 'react';
import { Menu, Bell, Accessibility, Globe, Mic } from 'lucide-react';
import { NotificationPanel } from '../components/NotificationPanel';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { useApp } from '../context/AppContext';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { state, updateUser } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const unread = state.notifications.filter(n => !n.read).length;

  const toggleLang = () => {
    updateUser({ language: state.user.language === 'en' ? 'hi' : 'en' });
  };

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-20">
      <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden">
        <Menu size={20} />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 relative">
        {/* Language toggle */}
        <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors">
          <Globe size={15} />
          {state.user.language === 'en' ? 'EN' : 'HI'}
        </button>

        {/* Voice */}
        <button onClick={() => setShowVoice(true)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" aria-label="Voice Assistant">
          <Mic size={18} />
        </button>

        {/* Accessibility */}
        <div className="relative">
          <button onClick={() => { setShowA11y(!showA11y); setShowNotifs(false); }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" aria-label="Accessibility">
            <Accessibility size={18} />
          </button>
          {showA11y && <AccessibilityPanel onClose={() => setShowA11y(false)} />}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotifs(!showNotifs); setShowA11y(false); }} className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" aria-label="Notifications">
            <Bell size={18} />
            {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-sky-500 text-white text-xs rounded-full flex items-center justify-center leading-none">{unread}</span>}
          </button>
          {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
          RS
        </div>
      </div>

      {showVoice && <VoiceAssistant onClose={() => setShowVoice(false)} />}
    </header>
  );
}
