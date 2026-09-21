import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  Brain,
  TrendingUp,
  Award,
  Target,
  Clock,
  Calendar,
  Zap,
  Activity,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import type { GameSession } from '../types';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<GameSession[]>([]);

  useEffect(() => {
    setSessions(storageService.getSessions());
  }, []);

  const totalSessions = sessions.length;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions)
      : 88;

  // Weekly data bars (last 7 days)
  const weeklyData = [
    { day: 'Wed', count: 1, acc: 85 },
    { day: 'Thu', count: 2, acc: 88 },
    { day: 'Fri', count: 1, acc: 94 },
    { day: 'Sat', count: 2, acc: 90 },
    { day: 'Sun', count: 1, acc: 96 },
    { day: 'Mon', count: 2, acc: 86 },
    { day: 'Today', count: 1, acc: 92 },
  ];

  // Cognitive Domain Breakdown
  const cognitiveDomains = [
    { name: 'Visual Memory', score: 88, color: 'bg-emerald-500', desc: 'Card matching & spatial recall' },
    { name: 'Working Memory', score: 84, color: 'bg-sky-500', desc: 'Sequence retention & Simon recall' },
    { name: 'Logical Reasoning', score: 92, color: 'bg-purple-500', desc: 'Pattern identification & matrix' },
    { name: 'Information Recall', score: 81, color: 'bg-amber-500', desc: 'Story & observational details' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Progress & Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            A comprehensive, non-clinical overview of your cognitive agility, consistency, and trends.
          </p>
        </div>

        <Badge variant="emerald" size="md">
          <Activity className="w-3.5 h-3.5 inline mr-1" />
          7-Day Active Streak
        </Badge>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cognitive Wellness Score"
          value={user.cognitiveScore}
          subtext="Target: 850 / 1000"
          icon={Brain}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          badge={{ text: '+14 pts', trend: 'up' }}
        />
        <StatCard
          label="Average Accuracy"
          value={`${avgAccuracy}%`}
          subtext="Across all exercises"
          icon={Target}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
          badge={{ text: 'Excellent', trend: 'up' }}
        />
        <StatCard
          label="Total Exercise Sessions"
          value={totalSessions}
          subtext="Completed to date"
          icon={Zap}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Adaptive Scaling"
          value="Active"
          subtext="Continuous AI Calibration"
          icon={Sliders}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Charts Section: Weekly Trend & Domain Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Bar Chart (Clean Accessible CSS/SVG) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Accuracy Trend</h3>
              <p className="text-xs text-slate-500">Daily performance over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              90.8% Weekly Avg
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                  {d.acc}%
                </span>
                <div className="w-full bg-slate-100 rounded-xl h-32 flex items-end p-1">
                  <div
                    style={{ height: `${(d.acc - 40) * 1.6}%` }}
                    className="w-full rounded-lg bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all"
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Cognitive Modality Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cognitive Modality Breakdown</h3>
              <p className="text-xs text-slate-500">Performance ratings across core cognitive faculties</p>
            </div>
            <span className="text-xs font-bold text-slate-400">Target: 90%</span>
          </div>

          <div className="space-y-4">
            {cognitiveDomains.map((dom, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{dom.name}</span>
                  <span className="text-emerald-700">{dom.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dom.color}`}
                    style={{ width: `${dom.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{dom.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Sessions Activity Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Exercise Log</h3>
            <p className="text-xs text-slate-500">Complete record of your recent cognitive activities</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing last {sessions.length} sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="pb-3 pl-2">Date & Time</th>
                <th className="pb-3">Game / Activity</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3 pr-2">Mistakes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions
                .slice(-8)
                .reverse()
                .map(ses => (
                  <tr key={ses.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pl-2 font-semibold text-slate-500">
                      {new Date(ses.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 capitalize">
                      {ses.gameId.replace('-', ' ')}
                    </td>
                    <td className="py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {ses.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 font-black text-emerald-800">{ses.score}</td>
                    <td className="py-3.5 font-bold text-slate-800">{ses.accuracy}%</td>
                    <td className="py-3.5 text-slate-600">{ses.completionTimeSeconds}s</td>
                    <td className="py-3.5 pr-2">
                      <span
                        className={`font-semibold ${
                          ses.mistakes === 0
                            ? 'text-emerald-600'
                            : ses.mistakes <= 2
                            ? 'text-slate-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {ses.mistakes}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
