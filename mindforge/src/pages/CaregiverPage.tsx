import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { storageService } from '../utils/storage';
import { useToast } from '../hooks/useToast';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Users,
  ShieldCheck,
  Key,
  Copy,
  Check,
  TrendingUp,
  Brain,
  FolderHeart,
  EyeOff,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import type { GameSession, MemoryItem, ReminderItem } from '../types';

export const CaregiverPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [inviteCode] = useState('MIND-8421-CARE');
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [sharedMemories, setSharedMemories] = useState<MemoryItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  // Permissions state
  const [allowProgressSharing, setAllowProgressSharing] = useState(true);
  const [allowRemindersSharing, setAllowRemindersSharing] = useState(true);

  useEffect(() => {
    setSessions(storageService.getSessions());
    // Only fetch memories with isCaregiverShared === true!
    const allMem = storageService.getMemories();
    setSharedMemories(allMem.filter(m => m.isCaregiverShared));
    setReminders(storageService.getReminders());
  }, []);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    addToast('Caregiver invitation code copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const avgAccuracy =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length)
      : 88;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Users className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Caregiver Collaboration Portal
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            A secure bridge enabling family members and physicians to support wellness with dignity.
          </p>
        </div>

        <Badge variant="emerald" size="md">
          <ShieldCheck className="w-4 h-4 inline mr-1" />
          Consent-First Privacy Protocol
        </Badge>
      </div>

      {/* Invite Code & Connection Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Caregiver Profile Card */}
        <Card className="p-6 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Connected Guardian
            </span>
            <Badge variant="emerald">Connected</Badge>
          </div>

          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-xs">
              S
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {user.caregiverName || 'Dr. Sunita Sharma'}
              </h3>
              <span className="text-xs text-slate-500">Daughter & Healthcare Contact</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Authorized to review training consistency, game accuracy scores, and shared memory albums.
          </p>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized Today
            </span>
          </div>
        </Card>

        {/* Invite Code Sharing */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Caregiver Invitation Key</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Share this unique secure code with your loved one or doctor. When they sign in using the Caregiver View, this code links your authorized wellness summary to their device.
            </p>

            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-2xl border border-slate-200 max-w-md mb-4">
              <span className="font-mono text-base sm:text-lg font-black tracking-wider text-slate-800 flex-1 pl-2">
                {inviteCode}
              </span>
              <Button
                onClick={copyInviteCode}
                variant="primary"
                size="sm"
                leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied' : 'Copy Code'}
              </Button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Guarantee:</strong> Entries in your Memory Vault marked private remain completely shielded from caregivers.
            </span>
          </div>
        </Card>
      </div>

      {/* Authorized Caregiver Live Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Caregiver Snapshot Preview</h3>
            <p className="text-xs text-slate-500">
              Information currently authorized for caregiver view
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
            Patient: {user.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Weekly Streak</span>
            <span className="text-2xl font-black text-slate-900">{user.streakDays} Consecutive Days</span>
            <span className="text-xs text-emerald-600 block mt-1">Consistent routine</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Average Accuracy</span>
            <span className="text-2xl font-black text-emerald-800">{avgAccuracy}%</span>
            <span className="text-xs text-slate-500 block mt-1">Calibrated at Medium</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Shared Memories</span>
            <span className="text-2xl font-black text-slate-900">{sharedMemories.length} Entries</span>
            <span className="text-xs text-slate-500 block mt-1">Available for discussion</span>
          </div>
        </div>

        {/* Shared Memories Mini-List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Memories Explicitly Shared With Caregiver ({sharedMemories.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sharedMemories.map(m => (
              <div key={m.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
                <span className="font-bold text-slate-800 block mb-1 truncate">{m.title}</span>
                <span className="text-slate-400 capitalize block mb-2">{m.category}</span>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  ✓ Authorized for caregiver conversation
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
