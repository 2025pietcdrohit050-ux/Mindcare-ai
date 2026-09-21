import React from 'react';
import { Card } from '../components/common/Card';
import { ShieldCheck, Award, Brain, Layers, Cpu, Users, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Smart India Hackathon 2026
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 mb-3">
          About MindMate AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Problem Statement SIH26003: AI-Based Cognitive Gaming and Memory Assistance Platform
        </p>
      </div>

      {/* Problem Statement & Mission */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-emerald-600" />
          The Vision & Problem Statement
        </h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
          As individuals age, maintaining cognitive agility, episodic memory, and emotional connection becomes vital to overall quality of life. Traditional brain-training games often suffer from two extremes: they are either childish and frustratingly complex, or static and uninspiring.
        </p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
          <strong>MindMate AI ("Stronger Minds, Brighter Days")</strong> bridges this gap. By marrying real, scientifically grounded cognitive gaming with personal memory preservation (Memory Vault) and dignified caregiver collaboration, the platform creates an encouraging daily sanctuary for older adults and their families.
        </p>
      </Card>

      {/* Mandatory Medical Scope Notice */}
      <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200/80">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-amber-900 text-base mb-1">
              Ethical AI & Cognitive Wellness Scope
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              MindMate AI is strictly designed for cognitive training, wellness, mental stimulation, and personal memory assistance. It does not diagnose, treat, or claim to cure dementia, Alzheimer's disease, or any neurological disease. All metric evaluations are framed positively around personal improvement and brain wellness.
            </p>
          </div>
        </div>
      </div>

      {/* Key Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1.5">Adaptive Difficulty Scaling</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A dedicated algorithmic service (<code>adaptiveDifficultyService</code>) evaluates session accuracy, mistake counts, and pacing trends to adjust difficulty gently without abrupt jumps.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1.5">Consent-First Caregiver Portal</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Caregivers can review exercise completion and daily wellness trends using a unique connection code, while private memories remain shielded unless explicitly shared.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1.5">Modular Cloud-Ready Architecture</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Clean TypeScript interfaces for authentication, storage, and AI allow external cloud databases (Firebase, Supabase) and LLMs (Gemini 2.0) to be plugged in effortlessly.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1.5">Accessible & Multilingual</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Full English and Hindi (हिन्दी) bilingual support, large font scalers (up to 130%), high-contrast accessibility themes, and comfortable audio tones.
          </p>
        </Card>
      </div>

      <div className="text-center pt-6">
        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            Experience the Live Application
          </Button>
        </Link>
      </div>
    </div>
  );
};
