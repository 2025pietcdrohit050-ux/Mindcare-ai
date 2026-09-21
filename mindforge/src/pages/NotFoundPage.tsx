import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { BrainCircuit, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
        <BrainCircuit className="w-10 h-10" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-3">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        The page or cognitive exercise you were looking for doesn't exist or has moved.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/dashboard">
          <Button variant="primary" size="lg" leftIcon={<Home className="w-4 h-4" />}>
            Go to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
