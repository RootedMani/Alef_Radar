import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Check, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black mb-3 font-bold shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
            {isRegister
              ? isPersian
                ? 'ثبت‌نام در OpportunityRadar'
                : 'Create Radar Account'
              : isPersian
              ? 'ورود به حساب کاربری'
              : 'Sign in to OpportunityRadar'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isPersian
              ? 'دسترسی کامل به ایجنت شناسایی مشتریان بالقوه'
              : 'Autonomous agent customer lead hunter for online communities'}
          </p>
        </div>

        {/* Quick 1-Click Demo Accounts for Judges */}
        <div className="mb-6 p-3.5 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            {isPersian
              ? 'ورود سریع داوران مسابقه buildX (بدون تایپ):'
              : '1-Click Quick Access (buildX Evaluators):'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('contest@buildx.ir', 'buildx2026', 'buildX Judge')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
            >
              {isPersian ? 'حساب داور مسابقه' : 'buildX Judge'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('founder@opportunityradar.ai', 'radar123', 'Founder Account')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
            >
              {isPersian ? 'حساب بنیان‌گذار' : 'Founder Account'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white text-xs">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isPersian ? 'نام یا عنوان کسب‌وکار' : 'Full Name / Business Title'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isPersian ? 'مثلاً: علی رضایی' : 'e.g. Alex Morgan'}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {isPersian ? 'آدرس ایمیل' : 'Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {isPersian ? 'رمز عبور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs rounded-xl shadow-sm hover:opacity-90 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>
              {loading
                ? isPersian
                  ? 'در حال پردازش...'
                  : 'Processing...'
                : isRegister
                ? isPersian
                  ? 'ثبت‌نام و ورود'
                  : 'Create Account'
                : isPersian
                ? 'ورود به حساب'
                : 'Sign In'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
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
            className="text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            {isRegister
              ? isPersian
                ? 'قبلاً حساب ساخته‌اید؟ وارد شوید'
                : 'Already have an account? Sign in'
              : isPersian
              ? 'حساب ندارید؟ ثبت‌نام کنید'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
