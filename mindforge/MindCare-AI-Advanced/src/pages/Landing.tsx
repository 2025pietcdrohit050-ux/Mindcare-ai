import React, { useState } from 'react';
import { Brain, Star, Shield, Zap, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<'patient' | 'caregiver'>('patient');
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(activeTab);
    navigate('/dashboard');
  };

  const handleDemo = () => {
    login('demo');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-800">MindCare AI</span>
            <p className="text-xs text-slate-400">SIH Problem: SIH26003</p>
          </div>
        </div>
        <button
          onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Globe size={14} /> {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:py-0 lg:px-16">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <Zap size={12} /> AI-Powered Cognitive Wellness Platform
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
              {lang === 'en' ? 'Better Memory.' : 'बेहतर याददाश्त.'}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-500">
                {lang === 'en' ? 'Brighter Days.' : 'उज्जवल दिन.'}
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {lang === 'en'
                ? 'MindCare AI combines cognitive games, personalized exercises, and smart reminders to support daily memory wellness — all on your device, privately.'
                : 'MindCare AI संज्ञानात्मक खेल, व्यक्तिगत अभ्यास और स्मार्ट रिमाइंडर के साथ दैनिक स्मृति स्वास्थ्य का समर्थन करता है।'
              }
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: <Brain size={16} />, text: lang === 'en' ? '6 Cognitive Games' : '6 संज्ञानात्मक खेल' },
                { icon: <Shield size={16} />, text: lang === 'en' ? '100% Private' : '100% निजी' },
                { icon: <Star size={16} />, text: lang === 'en' ? 'AI-Personalized' : 'AI-व्यक्तिगत' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-sky-500">{f.icon}</span>{f.text}
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              <strong>Disclaimer:</strong> MindCare AI is a cognitive wellness and assistance platform. It does not diagnose or treat medical conditions.
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex items-center justify-center px-8 py-12 lg:px-16">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{lang === 'en' ? 'Sign In' : 'साइन इन करें'}</h2>

            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
              {(['patient', 'caregiver'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab ? 'bg-white shadow text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {tab === 'patient' ? (lang === 'en' ? 'Patient' : 'रोगी') : (lang === 'en' ? 'Caregiver' : 'देखभालकर्ता')}
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder={lang === 'en' ? 'Patient ID (e.g. RS001)' : 'रोगी आईडी'}
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all"
              />
              <input
                type="password"
                placeholder={lang === 'en' ? 'Password' : 'पासवर्ड'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mb-3"
            >
              {lang === 'en' ? 'Sign In' : 'साइन इन'} <ChevronRight size={16} />
            </button>

            <button
              onClick={handleDemo}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              🎯 {lang === 'en' ? 'Try Demo Mode' : 'डेमो मोड आज़माएं'}
            </button>

            <p className="text-xs text-center text-slate-400 mt-4">
              Demo: Use Ramesh Sharma's account with pre-filled data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
