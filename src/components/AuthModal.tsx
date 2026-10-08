import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2, KeyRound, ArrowLeft, Copy, Check } from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset, resetPasswordWithCode } from '../services/agentApi';
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
        setSuccessMessage(`Reset code generated: ${res.resetCode}. Enter a new password below.`);
      } else if (authView === 'reset') {
        await resetPasswordWithCode(resetEmail, resetCode, newPassword);
        setSuccessMessage('Password successfully updated! You can now log in.');
        setEmail(resetEmail);
        setPassword(newPassword);
        setAuthView('login');
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white mb-3 shadow-xs">
            {authView === 'forgot' || authView === 'reset' ? (
              <KeyRound className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </div>
          <h2 className="text-xl font-black text-neutral-950">
            {authView === 'register' && 'Create Your Account'}
            {authView === 'login' && 'Sign In to Alef Radar'}
            {authView === 'forgot' && 'Reset Forgotten Password'}
            {authView === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {authView === 'register' && 'Persistent account with full access to scanner and custom profiles.'}
            {authView === 'login' && 'Access your workspace, lead streams, and detection settings.'}
            {authView === 'forgot' && "Enter your registered email and we'll generate your verification code."}
            {authView === 'reset' && 'Verify your 6-digit code and choose a new password.'}
          </p>
        </div>

        {/* Sub-Tabs for Login / Register */}
        {(authView === 'login' || authView === 'register') && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthView('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authView === 'login' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthView('register');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authView === 'register' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* 1-Click Quick Demo Accounts for Testing */}
        {(authView === 'login' || authView === 'register') && (
          <div className="mb-5 p-3 bg-neutral-50 border border-neutral-200 rounded-2xl">
            <p className="text-[11px] font-bold text-neutral-600 mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
              <span>One-Click Test Accounts:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('founder@opportunityradar.ai', 'radar123', 'Sarah Jenkins')}
                className="py-1.5 px-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer shadow-2xs"
              >
                Sarah (Founder)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alex@growthscale.io', 'brandnewpassword123', 'Alex Rivera')}
                className="py-1.5 px-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer shadow-2xs"
              >
                Alex (Growth)
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-neutral-200/70 text-center">
              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({
                    id: `guest-${Date.now()}`,
                    email: 'guest@opportunityradar.ai',
                    name: 'Guest Explorer',
                    role: 'Visitor',
                    createdAt: new Date().toISOString()
                  });
                  onClose();
                }}
                className="text-[11px] font-semibold text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Or continue as <span className="underline font-bold text-neutral-800">Guest Explorer</span> (No sign-in required) →
              </button>
            </div>
          </div>
        )}

        {/* Success or Error Feedback */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-neutral-100 border border-neutral-300 rounded-xl text-neutral-900 text-xs font-medium">
            {successMessage}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* REGISTER: Name Field */}
          {authView === 'register' && (
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

          {/* LOGIN / REGISTER: Email Field */}
          {(authView === 'login' || authView === 'register') && (
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
                  placeholder="name@company.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          )}

          {/* LOGIN / REGISTER: Password Field */}
          {(authView === 'login' || authView === 'register') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700">
                  Password
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
                    className="text-[11px] font-semibold text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
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
          )}

          {/* FORGOT PASSWORD: Email Request Field */}
          {authView === 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          )}

          {/* RESET PASSWORD: Code & New Password Fields */}
          {authView === 'reset' && (
            <>
              {generatedCode && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">Verification Code</span>
                    <span className="text-sm font-black text-neutral-950 font-mono tracking-wider">{generatedCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white border border-neutral-200 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 cursor-pointer"
                  >
                    {codeCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{codeCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 849201"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Choose New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New secure password"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-black text-white font-extrabold text-xs rounded-xl hover:bg-neutral-800 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs mt-2"
          >
            <span>
              {loading
                ? 'Processing...'
                : authView === 'register'
                ? 'Create Free Account'
                : authView === 'login'
                ? 'Sign In to Account'
                : authView === 'forgot'
                ? 'Send Verification Code'
                : 'Save New Password'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
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
              className="inline-flex items-center space-x-1 font-semibold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
