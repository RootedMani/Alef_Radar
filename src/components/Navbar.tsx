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
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/60 dark:border-white/10 bg-white/45 dark:bg-zinc-950/45 backdrop-blur-2xl shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 text-left rtl:text-right group cursor-pointer select-none"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105 shrink-0">
                <Radar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-neutral-950 dark:text-white whitespace-nowrap">
                  {t.appName}
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-neutral-900/10 dark:bg-white/10 text-neutral-950 dark:text-white font-bold backdrop-blur-md border border-neutral-900/10 dark:border-white/15'
                  : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {t.navOverview}
            </button>

            <button
              onClick={() => setCurrentView('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'app'
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {t.navScanner}
            </button>

            <button
              onClick={() => setCurrentView('docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'docs'
                  ? 'bg-neutral-900/10 dark:bg-white/10 text-neutral-950 dark:text-white font-bold backdrop-blur-md border border-neutral-900/10 dark:border-white/15'
                  : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {t.navDocs}
            </button>
          </nav>

          {/* Utility Controls & Auth */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-neutral-200/80 dark:border-white/10 hover:border-neutral-400 dark:hover:border-zinc-500 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-neutral-800 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title={darkMode ? (language === 'fa' ? 'تغییر به حالت روشن' : 'Switch to Light Mode') : (language === 'fa' ? 'تغییر به حالت تاریک' : 'Switch to Dark Mode')}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-medium hidden sm:inline">
                    {language === 'fa' ? 'روشن' : 'Light'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700 shrink-0" />
                  <span className="text-[11px] font-medium hidden sm:inline">
                    {language === 'fa' ? 'تاریک' : 'Dark'}
                  </span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-xl p-0.5 border border-neutral-200/80 dark:border-white/10 text-[10px] sm:text-[11px] font-bold">
              <button
                type="button"
                onClick={() => onSetLanguage('en')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
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
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-sans ${
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
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:border-black dark:hover:border-white transition-all cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-zinc-100 leading-none truncate max-w-[80px] sm:max-w-[120px]">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <Settings className="w-3 h-3 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 rounded-xl text-neutral-500 dark:text-zinc-400 hover:text-red-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title={t.navSignOut}
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={onOpenAuth}
                  className="px-2 sm:px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.navSignIn}
                </button>

                <button
                  onClick={onOpenAuth}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-neutral-800 dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <span className="hidden sm:inline">{t.navGetStarted}</span>
                  <span className="sm:hidden">{language === 'fa' ? 'شروع' : 'Start'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-neutral-200/60 dark:border-white/10 px-2 py-1.5 bg-white/45 dark:bg-zinc-950/45 backdrop-blur-2xl">
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'landing'
              ? 'bg-neutral-900/10 dark:bg-white/10 text-neutral-950 dark:text-white font-bold shadow-2xs backdrop-blur-md'
              : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          {t.navOverview}
        </button>

        <button
          onClick={() => setCurrentView('app')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'app'
              ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-2xs'
              : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          {t.navScanner}
        </button>

        <button
          onClick={() => setCurrentView('docs')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'docs'
              ? 'bg-neutral-900/10 dark:bg-white/10 text-neutral-950 dark:text-white font-bold shadow-2xs backdrop-blur-md'
              : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          {t.navDocs}
        </button>
      </div>
    </header>
  );
};
