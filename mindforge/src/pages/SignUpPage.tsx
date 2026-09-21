import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { BrainCircuit } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'caregiver'>('patient');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>('en');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    login(email, role);
    updateProfile({ name: name.trim(), preferredLanguage });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full p-8 shadow-xl border-slate-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Your MindMate Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Join our cognitive wellness community for daily memory training
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Create Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as 'patient' | 'caregiver')}
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              >
                <option value="patient">Individual / Patient</option>
                <option value="caregiver">Caregiver / Family</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value as 'en' | 'hi')}
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
            By signing up, you acknowledge that MindMate AI provides cognitive wellness stimulation and does not provide medical diagnoses.
          </p>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            Complete Registration
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-700 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};
