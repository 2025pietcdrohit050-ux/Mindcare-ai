import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Brain, LayoutDashboard, Gamepad2, BookHeart, Bell, BarChart2, Users, User, Shield, LogOut, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/games', icon: <Gamepad2 size={18} />, label: 'Cognitive Games' },
  { to: '/memory-vault', icon: <BookHeart size={18} />, label: 'Memory Vault' },
  { to: '/reminders', icon: <Bell size={18} />, label: 'Reminders' },
  { to: '/progress', icon: <BarChart2 size={18} />, label: 'Progress' },
  { to: '/caregiver', icon: <Users size={18} />, label: 'Caregiver' },
  { to: '/profile', icon: <User size={18} />, label: 'Profile' },
  { to: '/privacy', icon: <Shield size={18} />, label: 'Privacy' },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full z-40 w-64 bg-white border-r border-slate-100 shadow-lg flex flex-col transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">MindCare AI</span>
              <p className="text-xs text-slate-400">SIH26003</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-100"><X size={16} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-colors ${
                  isActive ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
