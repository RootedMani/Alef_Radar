import React from 'react';
import { Radar, User as UserIcon, LogOut, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  currentView: 'landing' | 'app' | 'docs';
  setCurrentView: (view: 'landing' | 'app' | 'docs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  currentView,
  setCurrentView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
                <Radar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-neutral-950">
                    OpportunityRadar
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border border-neutral-300 text-neutral-600">
                    buildX
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-neutral-100 text-neutral-950 font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentView('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'app'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              Radar Scanner
            </button>

            <button
              onClick={() => setCurrentView('docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'docs'
                  ? 'bg-neutral-100 text-neutral-950 font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              Documentation & Pitch
            </button>
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50">
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 leading-none">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
