import React from 'react';
import { Type, Contrast, Zap, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AccessibilityPanel({ onClose }: { onClose: () => void }) {
  const { state, updateUser } = useApp();
  const prefs = state.user.accessibilityPrefs;
  const toggle = (key: keyof typeof prefs) => {
    updateUser({ accessibilityPrefs: { ...prefs, [key]: !prefs[key] } });
  };
  return (
    <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="font-semibold text-slate-800 text-sm">Accessibility</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={14} /></button>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {[
          { key: 'largeText' as const, label: 'Large Text', desc: 'Increase font size throughout', icon: <Type size={16} /> },
          { key: 'highContrast' as const, label: 'High Contrast', desc: 'Improve text visibility', icon: <Contrast size={16} /> },
          { key: 'reducedMotion' as const, label: 'Reduced Motion', desc: 'Minimize animations', icon: <Zap size={16} /> },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-500">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`w-11 h-6 rounded-full transition-colors relative ${prefs[item.key] ? 'bg-sky-500' : 'bg-slate-200'}`}
              role="switch" aria-checked={prefs[item.key]}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
