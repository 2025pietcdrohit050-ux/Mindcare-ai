import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../context/AppContext';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useApp();
  const { largeText, highContrast } = state.user.accessibilityPrefs;

  useEffect(() => {
    document.documentElement.classList.toggle('text-lg-mode', largeText);
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [largeText, highContrast]);

  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
        <Topbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
