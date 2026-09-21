import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  FolderHeart,
  TrendingUp,
  Award,
  Bell,
  Users,
  User,
  Settings,
  BrainCircuit,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user, switchRole, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/games', label: t('navGames'), icon: Gamepad2, badge: '4 Games' },
    { to: '/vault', label: t('navMemoryVault'), icon: FolderHeart },
    { to: '/progress', label: t('navProgress'), icon: TrendingUp },
    { to: '/achievements', label: t('navAchievements'), icon: Award },
    { to: '/reminders', label: t('navReminders'), icon: Bell },
    { to: '/caregiver', label: t('navCaregiver'), icon: Users },
  ];

  const bottomItems = [
    { to: '/profile', label: t('navProfile'), icon: User },
    { to: '/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/80 min-h-screen p-4 justify-between select-none">
      <div>
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3 px-3 py-4 mb-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">MindMate</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight">Stronger Minds, Brighter Days</p>
          </div>
        </Link>

        {/* Role Indicator / Mode Switch */}
        <div className="mx-2 mb-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Active View:
            </span>
            <span className="font-bold text-slate-900 capitalize">{user.role}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-200/60 rounded-xl text-xs font-semibold">
            <button
              onClick={() => switchRole('patient')}
              className={`py-1 rounded-lg transition-all ${
                user.role === 'patient'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => switchRole('caregiver')}
              className={`py-1 rounded-lg transition-all ${
                user.role === 'caregiver'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Caregiver
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-current shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="pt-4 border-t border-slate-100 space-y-1">
        {bottomItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 text-current" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* User Card & Logout */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 mt-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title={t('navLogout')}
            aria-label={t('navLogout')}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
