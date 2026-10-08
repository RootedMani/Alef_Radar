import React from 'react';
import {
  Radar,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  Globe,
  Settings,
  CreditCard
} from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../utils/i18n';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  currentView: 'landing' | 'app' | 'docs';
  setCurrentView: (view: 'landing' | 'app' | 'docs') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  currentView,
  setCurrentView,
  darkMode,
  onToggleDarkMode,
  language,
  onSetLanguage,
}) => {
  const t = translations[language];
  const isRtl = language === 'fa';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 rtl:space-x-reverse text-left rtl:text-right group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
                <Radar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white">
                    {t.appName}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-800 dark:text-zinc-200 border border-neutral-200 dark:border-zinc-700">
                    {t.aiAgentBadge}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-950 dark:text-white font-bold'
                  : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-900'
              }`}
            >
              {t.navOverview}
            </button>

            <button
              onClick={() => setCurrentView('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'app'
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-900'
              }`}
            >
              {t.navScanner}
            </button>

            <button
              onClick={() => setCurrentView('docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'docs'
                  ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-950 dark:text-white font-bold'
                  : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-900'
              }`}
            >
              {t.navDocs}
            </button>
          </nav>

          {/* Utility Controls & Auth */}
          <div className="flex items-center gap-2">
            
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-600 bg-neutral-50 dark:bg-zinc-900 text-neutral-800 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title={darkMode ? (language === 'fa' ? 'تغییر به حالت روشن' : 'Switch to Light Mode') : (language === 'fa' ? 'تغییر به حالت تاریک' : 'Switch to Dark Mode')}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-medium hidden sm:inline">
                    {language === 'fa' ? 'روشن' : 'Light'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="text-[11px] font-medium hidden sm:inline">
                    {language === 'fa' ? 'تاریک' : 'Dark'}
                  </span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-neutral-100 dark:bg-zinc-900 rounded-xl p-0.5 border border-neutral-200 dark:border-zinc-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => onSetLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-2xs font-extrabold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onSetLanguage('fa')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-sans ${
                  language === 'fa'
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-2xs font-extrabold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                فا
              </button>
            </div>

            {/* User Profile or Auth */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 hover:border-black dark:hover:border-white transition-all cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-zinc-100 leading-none truncate max-w-[120px]">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <Settings className="w-3 h-3 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-neutral-500 dark:text-zinc-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                  title={t.navSignOut}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.navSignIn}
                </button>

                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-neutral-800 dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs"
                >
                  {t.navGetStarted}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
