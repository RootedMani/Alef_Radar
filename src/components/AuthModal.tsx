import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { loginUser, registerUser } from '../services/agentApi';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(email, password, name);
        onAuthSuccess(res.user);
      } else {
        const res = await loginUser(email, password);
        onAuthSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setName(demoName);
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(demoEmail, demoPass);
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white mb-3 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-neutral-950">
            {isRegister ? 'Create Your Free Account' : 'Sign In to OpportunityRadar'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isRegister
              ? 'Start hunting genuine customer leads in community conversations.'
              : 'Welcome back. Access your product profiles and agent scanner.'}
          </p>
        </div>

        {/* 1-Click Quick Demo Accounts for Contest Evaluators */}
        <div className="mb-6 p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl">
          <p className="text-[11px] font-bold text-neutral-700 mb-2 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
            <span>1-Click Evaluator Access (No typing needed):</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('contest@buildx.ir', 'buildx2026', 'buildX Evaluator')}
              className="py-2 px-2.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-bold rounded-xl text-center transition-colors cursor-pointer shadow-2xs"
            >
              🎓 buildX Judge
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('founder@opportunityradar.ai', 'radar123', 'Growth Founder')}
              className="py-2 px-2.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-bold rounded-xl text-center transition-colors cursor-pointer shadow-2xs"
            >
              🚀 Founder Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Full Name or Company
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white font-extrabold text-xs rounded-xl hover:bg-neutral-800 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <span>
              {loading
                ? 'Processing...'
                : isRegister
                ? 'Create Free Account'
                : 'Sign In to Account'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Switch Between Register and Login */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            {isRegister
              ? 'Already registered? Sign in here'
              : "Don't have an account yet? Create one for free"}
          </button>
        </div>
      </div>
    </div>
  );
};
