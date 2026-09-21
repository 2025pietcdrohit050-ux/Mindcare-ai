import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { BrainCircuit, Sparkles, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password');
      return;
    }
    login(email, 'patient');
    navigate('/dashboard');
  };

  const handleQuickDemoLogin = (role: 'patient' | 'caregiver') => {
    if (role === 'patient') {
      login('aarav.sharma@example.com', 'patient');
    } else {
      login('dr.sunita@example.com', 'caregiver');
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 shadow-xl border-slate-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to MindMate AI</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Sign in to access your personalized cognitive plan and memory vault
          </p>
        </div>

        {/* Quick Demo Login Presets for Hackathon Judges */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hackathon Quick-Sign In:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('patient')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('caregiver')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-800 text-xs font-bold border border-slate-200 hover:border-sky-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span>Demo Caregiver</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            Sign In to MindMate AI
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-700 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </Card>
    </div>
  );
};
