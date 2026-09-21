import React from 'react';
import { Bell, X, Check, Clock, AlertTriangle, MessageCircle, Zap } from 'lucide-react';
import type { Notification } from '../types';
import { useApp } from '../context/AppContext';

const typeIcons: Record<Notification['type'], React.ReactNode> = {
  reminder: <Clock size={14} className="text-sky-500" />,
  missed: <AlertTriangle size={14} className="text-amber-500" />,
  challenge: <Zap size={14} className="text-violet-500" />,
  caregiver: <MessageCircle size={14} className="text-teal-500" />,
  system: <Bell size={14} className="text-slate-500" />,
};

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { state, markNotificationRead } = useApp();
  const unread = state.notifications.filter(n => !n.read).length;
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-700" />
          <span className="font-semibold text-slate-800 text-sm">Notifications</span>
          {unread > 0 && <span className="bg-sky-500 text-white text-xs rounded-full px-1.5 py-0.5">{unread}</span>}
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={14} /></button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {state.notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">No notifications</div>
        ) : (
          state.notifications.map(n => (
            <div
              key={n.id}
              className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-sky-50/50' : ''}`}
              onClick={() => markNotificationRead(n.id)}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5">{typeIcons[n.type]}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${n.read ? 'text-slate-600' : 'text-slate-800'}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-sky-500 rounded-full mt-1.5 shrink-0" />}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-2">
        <button className="text-xs text-sky-600 hover:text-sky-700 font-medium">Mark all as read</button>
      </div>
    </div>
  );
}
