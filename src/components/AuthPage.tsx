import React, { useState } from 'react';
import {
  Radar,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  Check,
  Copy,
  Sparkles,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset, resetPasswordWithCode } from '../services/agentApi';
import { User } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onBackToApp: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onBackToApp,
}) => {
  const { t, isRtl, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Show / Hide Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot / Reset Password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-neutral-200 dark:bg-neutral-800' };
    if (pass.length < 6) return { score: 1, label: t.auth.strength.weak, color: 'bg-red-500' };
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);
    const passedCount = [hasLetters, hasNumbers, hasSpecial].filter(Boolean).length;
    
    if (pass.length >= 8 && passedCount >= 2) {
      return { score: 3, label: t.auth.strength.strong, color: 'bg-emerald-500' };
    }
    return { score: 2, label: t.auth.strength.medium, color: 'bg-amber-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validations
    if (!email.trim() || !email.includes('@')) {
      setError(t.auth.validation.emailRequired);
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError(t.auth.validation.nameRequired);
        return;
      }
      if (!password || password.length < 6) {
        setError(t.auth.validation.passwordRequired);
        return;
      }
      if (password !== confirmPassword) {
        setError(t.auth.validation.passwordMismatch);
        return;
      }
      if (!agreeTerms) {
        setError(t.auth.validation.termsRequired);
        return;
      }
    }

    if (mode === 'login') {
      if (!password) {
        setError(t.auth.validation.passwordRequired);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await registerUser(email, password, name);
        onAuthSuccess(res.user);
      } else if (mode === 'login') {
        const res = await loginUser(email, password);
        onAuthSuccess(res.user);
      } else if (mode === 'forgot') {
        const res = await requestPasswordReset(resetEmail);
        setGeneratedCode(res.resetCode);
        setResetCode(res.resetCode);
        setMode('reset');
        setSuccessMessage(`${t.auth.resetHeading}: ${res.resetCode}`);
      } else if (mode === 'reset') {
        if (!resetCode.trim()) {
          setError(t.auth.validation.codeRequired);
          setLoading(false);
          return;
        }
        await resetPasswordWithCode(resetEmail, resetCode, newPassword);
        setSuccessMessage(t.auth.resetConfirmBtn);
        setEmail(resetEmail);
        setPassword(newPassword);
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
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
    <div className="w-full min-h-screen flex flex-col justify-between bg-neutral-100/70 dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      
      {/* Top Header Bar */}
      <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-1.5 cursor-pointer group text-left rtl:text-right"
        >
          <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105 shrink-0">
            <Radar className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white">
              {t.brand.name}
            </span>
          </div>
        </button>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
            title="Change language / تغییر زبان"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'English' : 'فارسی'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
            title={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Back button */}
          <button
            onClick={onBackToApp}
            className="hidden sm:inline-flex items-center space-x-1 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t.workspace.backOverview}</span>
          </button>
        </div>
      </header>

      {/* Main Centered Authentication Card Section */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-all">
          
          {/* Top Logo & Title */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-black dark:bg-white text-white dark:text-black mb-2.5 shadow-md">
              {mode === 'forgot' || mode === 'reset' ? (
                <KeyRound className="w-5 h-5 stroke-[2.2]" />
              ) : mode === 'signup' ? (
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Lock className="w-5 h-5 stroke-[2.2]" />
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              {mode === 'login' && t.auth.loginHeading}
              {mode === 'signup' && t.auth.registerHeading}
              {mode === 'forgot' && t.auth.forgotHeading}
              {mode === 'reset' && t.auth.resetHeading}
            </h1>
          </div>

          {/* Login / Sign Up Tab Switcher */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl mb-5 border border-neutral-200/70 dark:border-neutral-700/60">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#1a1b22] text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {t.nav.signIn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-[#1a1b22] text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {t.auth.signUpBtn}
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* SIGN UP: Name */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.auth.nameLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* LOGIN & SIGN UP: Email */}
            {(mode === 'login' || mode === 'signup') && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* LOGIN & SIGN UP: Password with Toggle */}
            {(mode === 'login' || mode === 'signup') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {t.auth.passwordLabel}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email || '');
                        setError(null);
                        setSuccessMessage(null);
                        setMode('forgot');
                      }}
                      className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {t.auth.forgotPasswordLink}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-10 rtl:pl-10 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* SIGN UP: Real-Time Password Strength Indicator */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      <span>{t.auth.strength.label}</span>
                      <span className="font-bold">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SIGN UP: Confirm Password */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.auth.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-10 rtl:pl-10 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Checkboxes: Remember Me (Login) / Terms (Sign Up) */}
            {mode === 'login' && (
              <div className="flex items-center gap-2 py-0.5">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-black dark:text-white focus:ring-black cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-neutral-700 dark:text-neutral-300 select-none cursor-pointer">
                  {t.auth.rememberMe}
                </label>
              </div>
            )}

            {mode === 'signup' && (
              <div className="flex items-start gap-2 py-0.5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 border-neutral-300 dark:border-neutral-700 text-black dark:text-white focus:ring-black cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-[11px] text-neutral-700 dark:text-neutral-300 select-none cursor-pointer leading-tight">
                  {t.auth.termsAgreement}
                </label>
              </div>
            )}

            {/* FORGOT PASSWORD: Request Code */}
            {mode === 'forgot' && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* RESET PASSWORD: Code and New Password */}
            {mode === 'reset' && (
              <div className="space-y-3">
                {generatedCode && (
                  <div className="p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono block">Verification Code</span>
                      <span className="text-base font-black text-neutral-950 dark:text-white font-mono tracking-wider">{generatedCode}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      {codeCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{codeCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="e.g. 583921"
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 px-3 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.auth.resetHeading}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 px-3 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs sm:text-sm rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md mt-3"
            >
              <span>
                {loading
                  ? t.auth.processing
                  : mode === 'signup'
                  ? t.auth.signUpBtn
                  : mode === 'login'
                  ? t.auth.signInBtn
                  : mode === 'forgot'
                  ? t.auth.resetRequestBtn
                  : t.auth.resetConfirmBtn}
              </span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-4 text-center text-xs text-neutral-600 dark:text-neutral-400">
            {mode === 'login' ? (
              <p className="flex items-center justify-center gap-1.5">
                <span>{t.auth.noAccount}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-neutral-950 dark:text-white hover:underline cursor-pointer"
                >
                  {t.auth.signUpBtn}
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p className="flex items-center justify-center gap-1.5">
                <span>{t.auth.hasAccount}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-neutral-950 dark:text-white hover:underline cursor-pointer"
                >
                  {t.auth.signInBtn}
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{t.auth.backToSignIn}</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-4 text-center text-[11px] font-mono text-neutral-500 dark:text-neutral-500 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <span>{t.brand.name} // {t.footer.rights}</span>
      </footer>
    </div>
  );
};
