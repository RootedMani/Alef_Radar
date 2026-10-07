import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { loginUser, registerUser } from '../services/agentApi';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  isPersian: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  isPersian,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {isRegister
              ? isPersian
                ? 'ثبت‌نام در OpportunityRadar'
                : 'Create your Radar Account'
              : isPersian
              ? 'ورود به حساب کاربری'
              : 'Sign in to OpportunityRadar'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isPersian
              ? 'برای دسترسی به ایجنت هوشمند و تحلیل بدون محدودیت پیام‌ها'
              : 'Access the autonomous agent to detect high-value community leads'}
          </p>
        </div>

        {/* Quick 1-Click Demo Accounts for Judges */}
        <div className="mb-6 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
          <p className="text-[11px] font-semibold text-emerald-400 mb-2 flex items-center space-x-1 rtl:space-x-reverse">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {isPersian
                ? 'ورود سریع داوران مسابقه buildX (بدون نیاز به تایپ):'
                : 'Instant 1-Click Judge Access (buildX Contest):'}
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('contest@buildx.ir', 'buildx2026', 'buildX Judge')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg text-center transition-colors"
            >
              🎓 {isPersian ? 'حساب داور مسابقه' : 'buildX Judge'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('founder@opportunityradar.ai', 'radar123', 'Founder Account')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg text-center transition-colors"
            >
              🚀 {isPersian ? 'حساب بنیان‌گذار' : 'Founder Lead'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isPersian ? 'نام یا عنوان کسب‌وکار' : 'Full Name / Business Title'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isPersian ? 'مثلا: علی رضایی' : 'e.g. Alex Morgan'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isPersian ? 'آدرس ایمیل' : 'Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isPersian ? 'رمز عبور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all disabled:opacity-50"
          >
            <span>{loading ? (isPersian ? 'در حال پردازش...' : 'Processing...') : isRegister ? (isPersian ? 'ثبت‌نام و ورود' : 'Create Account') : (isPersian ? 'ورود به حساب' : 'Sign In')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isRegister
              ? isPersian
                ? 'قبلاً حساب ساخته‌اید؟ وارد شوید'
                : 'Already have an account? Sign in'
              : isPersian
              ? 'حساب کاربری ندارید؟ ثبت‌نام کنید'
              : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
};
