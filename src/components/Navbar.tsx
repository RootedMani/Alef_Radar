import React from 'react';
import { Radar, Sparkles, User as UserIcon, LogOut, Globe, FileText, Briefcase, Video, BookOpen, Layers } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeTab: 'radar' | 'profiles' | 'tech_docs' | 'business_plan' | 'pitch' | 'video';
  setActiveTab: (tab: 'radar' | 'profiles' | 'tech_docs' | 'business_plan' | 'pitch' | 'video') => void;
  isPersian: boolean;
  setIsPersian: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  activeTab,
  setActiveTab,
  isPersian,
  setIsPersian,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Contest Tag */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('radar')}
              className="flex items-center space-x-2.5 rtl:space-x-reverse text-left group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Radar className="w-5 h-5 animate-spin-slow" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="font-extrabold text-lg text-white tracking-tight">OpportunityRadar</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    buildX
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {isPersian ? 'کاشف مشتری بالقوه در جوامع آنلاین' : 'Agentic Community Customer Hunter'}
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'radar'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radar className="w-3.5 h-3.5" />
              <span>{isPersian ? 'رادار ایجنت' : 'Agent Radar'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'profiles'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isPersian ? 'پروفایل‌های محصول' : 'Product Profiles'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tech_docs')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'tech_docs'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isPersian ? 'معماری فنی (Technical)' : 'Tech Architecture'}</span>
            </button>

            <button
              onClick={() => setActiveTab('business_plan')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'business_plan'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isPersian ? 'طرح کسب‌وکار' : 'Business Plan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'pitch'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPersian ? 'پیچ سرمایه‌گذار' : 'Pitch Deck'}</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'video'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">{isPersian ? 'لینک ویدیو (.txt)' : 'Video Link (.txt)'}</span>
            </button>
          </nav>

          {/* Right Action: Language toggle + User auth */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Language switch */}
            <button
              onClick={() => setIsPersian(!isPersian)}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors"
              title="Toggle Language / تغییر زبان"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isPersian ? 'English' : 'فارسی'}</span>
            </button>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse pl-2 border-l border-slate-800 rtl:border-l-0 rtl:border-r rtl:pr-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900 border border-slate-800 py-1 px-2.5 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left rtl:text-right">
                    <p className="text-xs font-medium text-slate-200 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[110px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title={isPersian ? 'خروج از حساب' : 'Log out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{isPersian ? 'ورود / ثبت‌نام' : 'Sign In / Register'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
