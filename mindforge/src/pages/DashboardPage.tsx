import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { storageService } from '../utils/storage';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Brain,
  Gamepad2,
  Target,
  Sliders,
  Flame,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  FolderHeart,
  Award,
  Calendar,
  Zap,
} from 'lucide-react';
import type { MemoryItem, ReminderItem, GameSession } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);

  useEffect(() => {
    setMemories(storageService.getMemories().slice(0, 3));
    setReminders(storageService.getReminders().slice(0, 3));
    setSessions(storageService.getSessions());
  }, []);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetingMorning');
    if (hour < 17) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  const totalSessions = sessions.length;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions)
      : 88;

  const todayPlan = [
    {
      id: 'plan_1',
      title: 'Memory Match (Visual Focus)',
      category: 'Game',
      time: '10 Mins',
      completed: true,
      link: '/games/memory-match',
    },
    {
      id: 'plan_2',
      title: 'Personal Memory Vault Review',
      category: 'Memory',
      time: '5 Mins',
      completed: false,
      link: '/vault',
    },
    {
      id: 'plan_3',
      title: 'Sequence Memory Challenge',
      category: 'Game',
      time: '8 Mins',
      completed: false,
      link: '/games/sequence-memory',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dynamic Greeting & Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-emerald-400/25 text-emerald-100 border border-emerald-400/30">
              Personalized Wellness Space
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {getGreeting()}, {user.name}!
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-1 max-w-xl">
            {t('greetingSubtext')} Your 7-day consistency is nurturing neural agility.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-emerald-100 font-semibold block">Active Streak</span>
            <span className="text-2xl font-black text-white">{user.streakDays} Days</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('statCognitiveScore')}
          value={`${user.cognitiveScore}`}
          subtext="Target: 850 / 1000"
          icon={Brain}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          badge={{ text: '+15 this week', trend: 'up' }}
        />

        <StatCard
          label={t('statGamesCompleted')}
          value={totalSessions}
          subtext="Sessions logged"
          icon={Gamepad2}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
          badge={{ text: 'Active', trend: 'neutral' }}
        />

        <StatCard
          label={t('statAverageAccuracy')}
          value={`${avgAccuracy}%`}
          subtext="Consistent across games"
          icon={Target}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          badge={{ text: 'High', trend: 'up' }}
        />

        <StatCard
          label={t('statCurrentDifficulty')}
          value={user.baselineDifficulty.toUpperCase()}
          subtext={t('statAdaptiveNote')}
          icon={Sliders}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          badge={{ text: 'Adaptive', trend: 'neutral' }}
        />
      </div>

      {/* Two Column Section: Today's Plan & Recommended Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Cognitive Plan (2 cols) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('sectionDailyPlan')}</h2>
              <p className="text-xs text-slate-500">Curated mental stimulation routine for today</p>
            </div>
            <Badge variant="emerald">1 of 3 Completed</Badge>
          </div>

          <div className="space-y-3">
            {todayPlan.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/70 transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        item.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {item.category} • {item.time}
                    </span>
                  </div>
                </div>

                <Link to={item.link}>
                  <Button
                    variant={item.completed ? 'outline' : 'primary'}
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {item.completed ? 'Replay' : 'Start'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended Game Spotlight (1 col) */}
        <Card className="p-6 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {t('sectionRecommendedActivity')}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Memory Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Sharpen your visual recall and spatial memory with soothing nature and everyday symbol pairs.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Modality:</span>
                <span className="font-bold text-slate-800">Visual Memory</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Suggested Difficulty:</span>
                <span className="font-bold text-emerald-700">Balanced (Medium)</span>
              </div>
            </div>
          </div>

          <Link to="/games/memory-match">
            <Button variant="primary" size="md" className="w-full" rightIcon={<Zap className="w-4 h-4" />}>
              Play Now
            </Button>
          </Link>
        </Card>
      </div>

      {/* Bottom 3 Columns: Upcoming Reminders, Recent Memories, Caregiver Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reminders Snapshot */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              {t('sectionUpcomingReminders')}
            </h3>
            <Link to="/reminders" className="text-xs font-bold text-emerald-700 hover:underline">
              {t('actionViewAll')}
            </Link>
          </div>

          <div className="space-y-2.5">
            {reminders.map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">{r.title}</span>
                  <span className="text-emerald-700 font-semibold">{r.time}</span>
                </div>
                {r.description && <p className="text-slate-500 truncate">{r.description}</p>}
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Memories Snapshot */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-sky-600" />
              {t('sectionRecentMemories')}
            </h3>
            <Link to="/vault" className="text-xs font-bold text-emerald-700 hover:underline">
              {t('actionViewAll')}
            </Link>
          </div>

          <div className="space-y-2.5">
            {memories.map(m => (
              <Link key={m.id} to={`/vault/${m.id}`} className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 truncate">{m.title}</span>
                  <span className="text-slate-400 capitalize">{m.category}</span>
                </div>
                <p className="text-slate-500 truncate">{m.description}</p>
              </Link>
            ))}
          </div>
        </Card>

        {/* Caregiver Connection Status */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                {t('sectionCaregiverStatus')}
              </h3>
              <Badge variant="emerald">Connected</Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {t('caregiverConnectedNote')}
            </p>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 mb-4">
              <span className="text-xs text-purple-700 block font-semibold">Authorized Caregiver</span>
              <span className="text-sm font-bold text-purple-950">{user.caregiverName || 'Dr. Sunita Sharma'}</span>
            </div>
          </div>

          <Link to="/caregiver">
            <Button variant="outline" size="sm" className="w-full">
              Manage Caregiver Access
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
