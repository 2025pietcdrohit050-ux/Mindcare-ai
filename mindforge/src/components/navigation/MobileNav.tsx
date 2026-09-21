import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, FolderHeart, TrendingUp, Bell } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const MobileNav: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    { to: '/vault', label: 'Vault', icon: FolderHeart },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-semibold transition-all ${
                isActive
                  ? 'text-emerald-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
