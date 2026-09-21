import React, { useState } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useNavigate } from 'react-router-dom';

export function VoiceAssistant({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const commands = [
    { patterns: ['reminder', 'reminders', 'याद'], action: () => navigate('/reminders'), response: 'Opening your reminders.' },
    { patterns: ['memory game', 'memory match', 'खेल'], action: () => navigate('/games'), response: 'Opening the games hub. Select a game to play.' },
    { patterns: ['progress', 'analytics', 'score'], action: () => navigate('/progress'), response: 'Opening your progress and analytics.' },
    { patterns: ['memory book', 'memory vault', 'vault', 'यादें'], action: () => navigate('/memory-vault'), response: 'Opening your Memory Vault.' },
    { patterns: ['caregiver', 'doctor view'], action: () => navigate('/caregiver'), response: 'Opening the caregiver dashboard.' },
    { patterns: ['dashboard', 'home', 'मुख्य'], action: () => navigate('/dashboard'), response: 'Going to the patient dashboard.' },
    { patterns: ['next reminder', 'what is my next'], action: () => navigate('/reminders'), response: 'Let me show you your upcoming reminders.' },
    { patterns: ['profile', 'settings'], action: () => navigate('/profile'), response: 'Opening your profile settings.' },
  ];

  const { listening, transcript, response, supported, startListening, stopListening } = useVoiceAssistant(commands);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">MindCare Voice Assistant</h2>
          <p className="text-sm text-slate-500 mt-1">Speak a command in English or Hindi</p>
        </div>

        {!supported ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
            Voice recognition is not supported in this browser. Please try Chrome or Edge for the best experience.
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center cursor-pointer transition-all ${
                listening ? 'border-sky-400 bg-sky-50 scale-110 animate-pulse' : 'border-slate-200 bg-slate-50 hover:border-sky-300'
              }`} onClick={listening ? stopListening : startListening}>
                {listening ? <MicOff size={32} className="text-sky-500" /> : <Mic size={32} className="text-slate-400" />}
              </div>
              <p className="text-sm text-slate-500 mt-3">{listening ? 'Listening... Click to stop' : 'Click to speak'}</p>
            </div>
            {transcript && (
              <div className="bg-slate-50 rounded-xl p-3 mb-3 text-sm text-slate-600">
                <span className="text-xs text-slate-400 block mb-1">You said:</span>
                "{transcript}"
              </div>
            )}
            {response && (
              <div className="bg-sky-50 rounded-xl p-3 text-sm text-sky-700 flex items-start gap-2">
                <Volume2 size={16} className="mt-0.5 shrink-0" />
                {response}
              </div>
            )}
            <div className="mt-4 text-left">
              <p className="text-xs font-medium text-slate-500 mb-2">Try saying:</p>
              <div className="flex flex-wrap gap-2">
                {['Show my reminders', 'Start memory game', 'Show my progress', 'Open memory vault', 'Go to dashboard'].map(s => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{s}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
