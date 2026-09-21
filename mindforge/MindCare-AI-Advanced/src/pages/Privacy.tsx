import React from 'react';
import { Shield, Lock, Eye, Trash2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Privacy() {
  const { resetToDemo } = useApp();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Privacy & Data</h1>
          <p className="text-slate-500 text-sm">How MindCare AI handles your information.</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { icon: <Lock size={18} className="text-sky-600" />, title: 'Local Storage Only', body: 'All your data — memories, reminders, game results, and preferences — is stored exclusively on your device using browser localStorage. No data is transmitted to any server in this demo version.' },
          { icon: <Eye size={18} className="text-teal-600" />, title: 'No Medical Diagnosis', body: 'MindCare AI is a cognitive wellness and activity platform. It does not diagnose, treat, or assess any medical condition including dementia, Alzheimer\'s disease, or any neurological disorder. All insights are wellness activity observations only.' },
          { icon: <Shield size={18} className="text-violet-600" />, title: 'You Control Your Data', body: 'You can add, edit, and delete all your memories, reminders, and notes at any time. You can also reset all data to the demo state using the button below.' },
          { icon: <AlertCircle size={18} className="text-amber-600" />, title: 'Caregiver Access (Production Note)', body: 'In a production deployment, caregiver access would require explicit authorization from the patient and be mediated through a secure backend with role-based access control. In this demo, caregiver access is simulated locally.' },
          { icon: <Trash2 size={18} className="text-rose-600" />, title: 'Demo Data', body: 'This application is initialized with realistic demo data for Ramesh Sharma. This data is clearly labeled as DEMO DATA and is intended for demonstration purposes only.' },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              {item.icon}
              <h3 className="font-semibold text-slate-800">{item.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-rose-50 border border-rose-200 rounded-2xl p-5">
        <h3 className="font-semibold text-rose-700 mb-2">Reset to Demo Data</h3>
        <p className="text-sm text-rose-600 mb-4">This will erase all your changes and restore the original demo data for Ramesh Sharma.</p>
        <button onClick={resetToDemo} className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
          Reset All Data
        </button>
      </div>
    </div>
  );
}
