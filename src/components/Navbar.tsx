import React from 'react';
import { Radar, User as UserIcon, LogOut, Globe, Sun, Moon, Layers, BookOpen, Briefcase, Sparkles, Video } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeTab: 'radar' | 'profiles' | 'tech_docs' | 'business_plan' | 'pitch' | 'video';
  setActiveTab: (tab: 'radar' | 'profiles' | 'tech_docs' | 'business_plan' | 'pitch' | 'video') => void;
  isPersian: boolean;
  setIsPersian: (val: boolean) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  activeTab,
  setActiveTab,
  isPersian,
  setIsPersian,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('radar')}
              className="flex items-center space-x-2.5 rtl:space-x-reverse text-left rtl:text-right group"
            >
              <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
                <Radar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                    OpportunityRadar
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
                    buildX
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  {isPersian ? 'کاشف مشتری بالقوه در جوامع آنلاین' : 'Community Lead Detection Agent'}
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Items (Clean Minimalist Pills) */}
          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'radar'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <span>{isPersian ? 'رادار ایجنت' : 'Agent Radar'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'profiles'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <span>{isPersian ? 'پروفایل‌ها' : 'Profiles'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tech_docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tech_docs'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <span>{isPersian ? 'معماری فنی' : 'Tech Specs'}</span>
            </button>

            <button
              onClick={() => setActiveTab('business_plan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'business_plan'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <span>{isPersian ? 'بیزینس‌پلن' : 'Business Plan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pitch'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <span>{isPersian ? 'ارائه سرمایه‌گذار' : 'Pitch Deck'}</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'video'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <span>{isPersian ? 'لینک ویدیو (.txt)' : 'Video Link'}</span>
            </button>
          </nav>

          {/* Right Controls: Theme Toggle, Language Toggle, User Auth */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setIsPersian(!isPersian)}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isPersian ? 'EN' : 'FA'}</span>
            </button>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse pl-1 border-l border-neutral-200 dark:border-neutral-800 rtl:border-l-0 rtl:border-r rtl:pr-1">
                <div className="flex items-center space-x-2 rtl:space-x-reverse px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                  <div className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left rtl:text-right">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-none truncate max-w-[100px]">
                      {user.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                  title={isPersian ? 'خروج' : 'Log out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-sm transition-transform hover:opacity-90 active:scale-95"
              >
                {isPersian ? 'ورود / ثبت‌نام' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
