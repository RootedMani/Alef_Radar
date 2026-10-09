import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2, KeyRound, ArrowLeft, Copy, Check } from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset, resetPasswordWithCode } from '../services/agentApi';
import { User } from '../types';
import { Language } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  language?: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language = 'en',
}) => {
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  
  // Login / Register fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Forgot / Reset fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRtl = language === 'fa';
  const SubmitArrow = isRtl ? ArrowLeft : ArrowRight;
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (authView === 'register') {
        const res = await registerUser(email, password, name);
        onAuthSuccess(res.user);
        onClose();
      } else if (authView === 'login') {
        const res = await loginUser(email, password);
        onAuthSuccess(res.user);
        onClose();
      } else if (authView === 'forgot') {
        const res = await requestPasswordReset(resetEmail);
        setGeneratedCode(res.resetCode);
        setResetCode(res.resetCode);
        setAuthView('reset');
        setSuccessMessage(
          res.emailDelivered
            ? (language === 'fa'
                ? `کد تأیید به ایمیل شما ارسال شد (کد مستقیم: ${res.resetCode}). رمز عبور جدید خود را وارد کنید.`
                : `Verification code sent to your email (Direct code: ${res.resetCode}). Enter your new password below.`)
            : (language === 'fa'
                ? `کد تأیید رایگان و فوری صادر شد: ${res.resetCode}. بدون نیاز به سرویس‌های ایمیل پولی.`
                : `Free instant verification code generated: ${res.resetCode}. Zero cost & no third-party email account required!`)
        );
      } else if (authView === 'reset') {
        await resetPasswordWithCode(resetEmail, resetCode, newPassword);
        setSuccessMessage(
          language === 'fa'
            ? 'رمز عبور با موفقیت به‌روزرسانی شد! اکنون می‌توانید وارد شوید.'
            : 'Password successfully updated! You can now log in.'
        );
        setEmail(resetEmail);
        setPassword(newPassword);
        setAuthView('login');
      }
    } catch (err: any) {
      setError(err.message || (language === 'fa' ? 'عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.' : 'Operation failed. Please try again.'));
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

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${isRtl ? 'left-5' : 'right-5'} p-1.5 rounded-lg text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black mb-3 shadow-xs">
            {authView === 'forgot' || authView === 'reset' ? (
              <KeyRound className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </div>
          <h2 className="text-xl font-black text-neutral-950 dark:text-white">
            {authView === 'register' && (language === 'fa' ? 'ایجاد حساب کاربری' : 'Create Your Account')}
            {authView === 'login' && (language === 'fa' ? 'ورود به الف رادار' : 'Sign In to Alef Radar')}
            {authView === 'forgot' && (language === 'fa' ? 'بازیابی رمز عبور فراموش‌شده' : 'Reset Forgotten Password')}
            {authView === 'reset' && (language === 'fa' ? 'تعیین رمز عبور جدید' : 'Set New Password')}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">
            {authView === 'register' && (language === 'fa' ? 'دسترسی کامل به اسکنر رادار و ایجاد پروفایل‌های سفارشی.' : 'Persistent account with full access to scanner and custom profiles.')}
            {authView === 'login' && (language === 'fa' ? 'دسترسی به میز کار، جریان‌های جامعه و تنظیمات ایجنت.' : 'Access your workspace, lead streams, and detection settings.')}
            {authView === 'forgot' && (language === 'fa' ? 'ایمیل ثبت‌نامی خود را وارد کنید تا کد تأیید ۶ رقمی صادر شود.' : "Enter your registered email and we'll generate your verification code.")}
            {authView === 'reset' && (language === 'fa' ? 'کد تأیید ۶ رقمی را تایید کرده و رمز عبور جدید انتخاب کنید.' : 'Verify your 6-digit code and choose a new password.')}
          </p>
        </div>

        {/* Sub-Tabs for Login / Register */}
        {(authView === 'login' || authView === 'register') && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100/70 dark:bg-zinc-800/60 backdrop-blur-md rounded-xl mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthView('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authView === 'login'
                  ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {language === 'fa' ? 'ورود' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthView('register');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authView === 'register'
                  ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {language === 'fa' ? 'ثبت‌نام رایگان' : 'Create Account'}
            </button>
          </div>
        )}

        {/* 1-Click Quick Demo Accounts for Testing */}
        {(authView === 'login' || authView === 'register') && (
          <div className="mb-5 p-3 glass-card rounded-2xl">
            <p className="text-[11px] font-bold text-neutral-600 dark:text-zinc-300 mb-2 flex items-center space-x-1.5 rtl:space-x-reverse">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
              <span>{language === 'fa' ? 'حساب‌های آزمایشی آماده با ۱ کلیک:' : 'One-Click Test Accounts:'}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('founder@opportunityradar.ai', 'radar123', 'سارا (بنیان‌گذار)')}
                className="py-1.5 px-2 bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 border border-neutral-200/80 dark:border-white/10 text-neutral-900 dark:text-zinc-100 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer shadow-2xs backdrop-blur-xs"
              >
                {language === 'fa' ? 'سارا (بنیان‌گذار)' : 'Sarah (Founder)'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alex@growthscale.io', 'brandnewpassword123', 'الکس (مدیر رشد)')}
                className="py-1.5 px-2 bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 border border-neutral-200/80 dark:border-white/10 text-neutral-900 dark:text-zinc-100 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer shadow-2xs backdrop-blur-xs"
              >
                {language === 'fa' ? 'الکس (مدیر رشد)' : 'Alex (Growth)'}
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-neutral-200/70 dark:border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({
                    id: `guest-${Date.now()}`,
                    email: 'guest@opportunityradar.ai',
                    name: language === 'fa' ? 'کاربر مهمان' : 'Guest Explorer',
                    role: 'Visitor',
                    createdAt: new Date().toISOString()
                  });
                  onClose();
                }}
                className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                {language === 'fa' ? (
                  <>یا ادامه به عنوان <span className="underline font-bold text-neutral-800 dark:text-zinc-200">کاربر مهمان</span> (بدون نیاز به ثبت‌نام) ←</>
                ) : (
                  <>Or continue as <span className="underline font-bold text-neutral-800 dark:text-zinc-200">Guest Explorer</span> (No sign-in required) →</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success or Error Feedback */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-neutral-100 dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 rounded-xl text-neutral-900 dark:text-zinc-100 text-xs font-medium">
            {successMessage}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* REGISTER: Name Field */}
          {authView === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">
                {language === 'fa' ? 'نام کامل یا نام شرکت' : 'Full Name or Company'}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-neutral-400`}>
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: رضا صادقی' : 'e.g. Alex Rivera'}
                  className={`w-full glass-input rounded-xl py-2 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                />
              </div>
            </div>
          )}

          {/* LOGIN / REGISTER: Email Field */}
          {(authView === 'login' || authView === 'register') && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">
                {language === 'fa' ? 'آدرس ایمیل' : 'Email Address'}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-neutral-400`}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  dir="ltr"
                  className={`w-full glass-input rounded-xl py-2 ${isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-mono`}
                />
              </div>
            </div>
          )}

          {/* LOGIN / REGISTER: Password Field */}
          {(authView === 'login' || authView === 'register') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700 dark:text-zinc-300">
                  {language === 'fa' ? 'رمز عبور' : 'Password'}
                </label>
                {authView === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email || '');
                      setError(null);
                      setSuccessMessage(null);
                      setAuthView('forgot');
                    }}
                    className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'fa' ? 'فراموشی رمز عبور؟' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-neutral-400`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className={`w-full glass-input rounded-xl py-2 ${isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                />
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD: Email Request Field */}
          {authView === 'forgot' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{language === 'fa' ? 'بازیابی ۱۰۰٪ رایگان و آنی: بدون نیاز به سرویس‌های ایمیل پولی.' : '100% Free Instant Recovery: Works instantly without any paid email service!'}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">
                  {language === 'fa' ? 'ایمیل حساب کاربری' : 'Registered Email Address'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-neutral-400`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@company.com"
                    dir="ltr"
                    className={`w-full glass-input rounded-xl py-2 ${isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-mono`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* RESET PASSWORD: Code & New Password Fields */}
          {authView === 'reset' && (
            <>
              {generatedCode && (
                <div className="p-3 glass-card rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 dark:text-zinc-400 uppercase font-mono block">
                      {language === 'fa' ? 'کد تأیید بازیابی' : 'Verification Code'}
                    </span>
                    <span className="text-sm font-black text-neutral-950 dark:text-white font-mono tracking-wider">{generatedCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-[11px] font-semibold text-neutral-700 dark:text-zinc-300 cursor-pointer shadow-xs"
                  >
                    {codeCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{codeCopied ? (language === 'fa' ? 'کپی شد' : 'Copied') : (language === 'fa' ? 'کپی' : 'Copy')}</span>
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">
                  {language === 'fa' ? 'کد تأیید ۶ رقمی' : '6-Digit Verification Code'}
                </label>
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 849201"
                  dir="ltr"
                  className="w-full glass-input rounded-xl py-2 px-3 text-xs font-mono text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">
                  {language === 'fa' ? 'رمز عبور جدید' : 'Choose New Password'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-neutral-400`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={language === 'fa' ? 'رمز عبور امن جدید' : 'New secure password'}
                    dir="ltr"
                    className={`w-full glass-input rounded-xl py-2 ${isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs rounded-xl hover:opacity-90 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all disabled:opacity-50 cursor-pointer shadow-xs mt-2"
          >
            <span>
              {loading
                ? (language === 'fa' ? 'در حال پردازش...' : 'Processing...')
                : authView === 'register'
                ? (language === 'fa' ? 'ایجاد حساب کاربری رایگان' : 'Create Free Account')
                : authView === 'login'
                ? (language === 'fa' ? 'ورود به حساب کاربری' : 'Sign In to Account')
                : authView === 'forgot'
                ? (language === 'fa' ? 'ارسال کد بازیابی' : 'Send Verification Code')
                : (language === 'fa' ? 'ذخیره رمز عبور جدید' : 'Save New Password')}
            </span>
            <SubmitArrow className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Bottom Switcher Links */}
        <div className="mt-4 text-center text-xs">
          {(authView === 'forgot' || authView === 'reset') && (
            <button
              type="button"
              onClick={() => {
                setAuthView('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className="inline-flex items-center space-x-1 rtl:space-x-reverse font-semibold text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <BackArrow className="w-3 h-3" />
              <span>{language === 'fa' ? 'بازگشت به فرم ورود' : 'Back to Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
