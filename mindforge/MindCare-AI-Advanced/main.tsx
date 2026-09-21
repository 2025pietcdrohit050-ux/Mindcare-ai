import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './layouts/AppLayout';

function Home() {
  return (
    <div className="min-h-full">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome to MindCare AI
        </h1>

        <p className="mt-3 text-slate-600">
          AI-Based Cognitive Gaming & Memory Assistance Platform
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-sky-50 p-5">
            <h2 className="font-semibold text-slate-800">Cognitive Games</h2>
            <p className="mt-2 text-sm text-slate-600">
              Improve memory, attention and recall.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-5">
            <h2 className="font-semibold text-slate-800">Memory Vault</h2>
            <p className="mt-2 text-sm text-slate-600">
              Keep important memories and personal information organized.
            </p>
          </div>

          <div className="rounded-xl bg-violet-50 p-5">
            <h2 className="font-semibold text-slate-800">Smart Reminders</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage daily reminders and activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);