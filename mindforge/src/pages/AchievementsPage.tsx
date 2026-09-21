import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import {
  Award,
  Trophy,
  Sparkles,
  Flame,
  Brain,
  Eye,
  Layers,
  FolderHeart,
  Calendar,
  Users,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import type { Achievement } from '../types';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(storageService.getAchievements());
  }, []);

  const unlockedCount = achievements.filter(a => !!a.unlockedAt).length;

  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-6 h-6 ${isUnlocked ? 'text-emerald-700' : 'text-slate-400'}` };
    switch (iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Eye': return <Eye {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'FolderHeart': return <FolderHeart {...props} />;
      case 'Calendar': return <Calendar {...props} />;
      case 'Users': return <Users {...props} />;
      default: return <Trophy {...props} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Award className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Milestones & Achievements
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Celebrating consistent training, working memory triumphs, and positive daily habits.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
          <Trophy className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-emerald-900">
            {unlockedCount} of {achievements.length} Badges Unlocked
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(ach => {
          const isUnlocked = !!ach.unlockedAt;

          return (
            <Card
              key={ach.id}
              hover
              className={`p-6 flex flex-col justify-between transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-white to-emerald-50/40 border-emerald-200/80 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${
                      isUnlocked
                        ? 'bg-emerald-100/80 border-emerald-300'
                        : 'bg-slate-200/80 border-slate-300'
                    }`}
                  >
                    {isUnlocked ? (
                      getIcon(ach.icon, true)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <Badge variant={isUnlocked ? 'emerald' : 'slate'} size="sm">
                    {isUnlocked ? 'UNLOCKED' : 'IN PROGRESS'}
                  </Badge>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-1.5">{ach.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{ach.description}</p>
              </div>

              <div>
                {/* Progress Bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Progress</span>
                    <span>{ach.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isUnlocked ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${ach.progress}%` }}
                    />
                  </div>
                </div>

                {/* Unlock date or Status */}
                {isUnlocked && ach.unlockedAt ? (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked on {ach.unlockedAt}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Keep exercising to unlock</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
