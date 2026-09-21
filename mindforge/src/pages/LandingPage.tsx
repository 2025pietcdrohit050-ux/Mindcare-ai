import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  ShieldCheck,
  Heart,
  Gamepad2,
  FolderHeart,
  TrendingUp,
  Users,
  Sliders,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Cognitive Wellness Games',
      desc: 'Memory Match, Sequence Memory, Pattern Recognition, and Recall Challenges designed to gently stimulate neural pathways.',
      badge: '4 Playable Exercises',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      icon: FolderHeart,
      title: 'Personal Memory Vault',
      desc: 'Cherish family photos, friends, and special moments with customized recall quizzes that help preserve treasured memories.',
      badge: 'Interactive Review',
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      icon: Sparkles,
      title: 'Adaptive AI Engine',
      desc: 'Intelligently calibrates difficulty based on accuracy and pace, preventing frustration while maintaining engagement.',
      badge: 'Personalized Tuning',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      icon: TrendingUp,
      title: 'Progress & Visual Analytics',
      desc: 'Holistic wellness score tracking attention, recall, and consistency over weeks and months without medical jargon.',
      badge: 'Insightful Trends',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      icon: Users,
      title: 'Caregiver Collaboration',
      desc: 'Allows trusted family members and caregivers to celebrate milestones and track routine adherence with explicit privacy consent.',
      badge: 'Consent-First Sharing',
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      icon: Sliders,
      title: 'Universal Accessibility',
      desc: 'Designed with large text scaling, high-contrast modes, gentle audio chimes, and multilingual English/Hindi support.',
      badge: 'Senior-Friendly UI',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
  ];

  return (
    <div className="space-y-20 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Smart India Hackathon 2026 • Problem Statement SIH26003</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Train your memory. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              Strengthen your mind.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            MindMate AI brings together adaptive cognitive exercises, a secure personal memory vault, and collaborative caregiver insights into a comforting, senior-friendly experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-emerald-600/25" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Your Cognitive Journey
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore How It Works
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs sm:text-sm text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No diagnostic claims
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hindi & English support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Senior accessible design
            </span>
          </div>
        </div>

        {/* Hero Preview Interactive Banner */}
        <div className="mt-12 p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-100 to-slate-200/60 border border-slate-200 shadow-xl max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">MindMate AI Dashboard Preview</h3>
                  <p className="text-sm text-slate-500">Personalized cognitive wellness for every stage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Adaptive AI Active
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  7-Day Streak
                </span>
              </div>
            </div>

            {/* Quick Feature highlights row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">Cognitive Score</span>
                <span className="text-3xl font-black text-slate-900">820</span>
                <span className="text-xs text-emerald-600 font-semibold block mt-1">↑ +14 points this week</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">Exercise Accuracy</span>
                <span className="text-3xl font-black text-emerald-700">92%</span>
                <span className="text-xs text-slate-500 font-medium block mt-1">Balanced pace & low mistakes</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">Treasured Memories</span>
                <span className="text-3xl font-black text-slate-900">5 Entries</span>
                <span className="text-xs text-slate-500 font-medium block mt-1">Family, travel & routines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">
            Designed for Dignified, Lifelong Cognitive Health
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Every feature in MindMate AI is built around cognitive comfort, gentle reinforcement, and meaningful personal connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hover className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4 Games Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
              Four Core Cognitive Modalities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Genuinely Playable, Scientifically Structured Games
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              No static placeholders or fake play buttons. Every game is genuinely playable, dynamically tracking mistakes, timing, and cognitive accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-xs font-bold text-emerald-300 block mb-1">Game 01</span>
              <h4 className="font-extrabold text-base mb-2">Memory Match</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Card pairing grids designed to exercise spatial orientation and visual memory.
              </p>
              <Link to="/games/memory-match" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <span>Play Match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-xs font-bold text-sky-300 block mb-1">Game 02</span>
              <h4 className="font-extrabold text-base mb-2">Sequence Memory</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Follow auditory and luminous Simon-style pads to stretch short-term sequence recall.
              </p>
              <Link to="/games/sequence-memory" className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1">
                <span>Play Sequence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-xs font-bold text-purple-300 block mb-1">Game 03</span>
              <h4 className="font-extrabold text-base mb-2">Pattern Recognition</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Identify geometric logic and missing shapes with clear step-by-step reasoning.
              </p>
              <Link to="/games/pattern-recognition" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <span>Play Pattern</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-xs font-bold text-amber-300 block mb-1">Game 04</span>
              <h4 className="font-extrabold text-base mb-2">Recall Challenge</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Flash observation followed by targeted questions on everyday stories and scenes.
              </p>
              <Link to="/games/recall-challenge" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span>Play Recall</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50 border border-emerald-200/80 shadow-md">
          <h2 className="text-3xl font-black text-slate-900 mb-3">
            Start Your Cognitive Journey Today
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Experience our full SIH 2026 demonstration with pre-loaded realistic data, interactive cognitive games, and assistive accessibility tools.
          </p>
          <Link to="/dashboard">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Explore MindMate AI Demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
