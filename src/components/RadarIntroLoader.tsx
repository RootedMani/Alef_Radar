import React, { useState, useEffect } from 'react';
import { Radar } from 'lucide-react';

interface RadarIntroLoaderProps {
  onComplete: () => void;
  darkMode: boolean;
}

export const RadarIntroLoader: React.FC<RadarIntroLoaderProps> = ({ onComplete, darkMode }) => {
  const [stage, setStage] = useState<'entering' | 'scanning' | 'revealing' | 'done'>('entering');
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Radar spins into the viewport (0ms to 900ms)
    const t1 = setTimeout(() => {
      setStage('scanning');
    }, 900);

    // Stage 2: Target acquired & lock (900ms to 2000ms)
    const t2 = setTimeout(() => {
      setStage('revealing');
      setFadingOut(true);
    }, 2000);

    // Stage 3: Smooth dissolve into the workspace
    const t3 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  if (stage === 'done') return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex items-center justify-center select-none transition-opacity duration-600 ease-out cursor-pointer ${
        fadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      } ${darkMode ? 'bg-zinc-950 text-white' : 'bg-neutral-50 text-neutral-950'}`}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '600ms',
      }}
    >
      {/* Background ambient radial glow */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          darkMode
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_70%)]'
            : 'bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(255,255,255,0)_70%)]'
        }`}
      />

      {/* Main Radar Container */}
      <div className="relative flex flex-col items-center justify-center p-8 max-w-sm w-full text-center">
        {/* Radar Rings & Rotating Sweep */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          {/* Sonar Pulse Wave 1 */}
          <div
            className={`absolute inset-0 rounded-full border ${
              darkMode ? 'border-white/30' : 'border-black/30'
            } animate-radar-pulse-wave`}
            style={{ animationDelay: '0s' }}
          />
          {/* Sonar Pulse Wave 2 */}
          <div
            className={`absolute inset-0 rounded-full border ${
              darkMode ? 'border-white/20' : 'border-black/20'
            } animate-radar-pulse-wave`}
            style={{ animationDelay: '0.8s' }}
          />

          {/* Outer Concentric Target Rings */}
          <div
            className={`absolute inset-0 rounded-full border ${
              darkMode ? 'border-white/20' : 'border-black/15'
            }`}
          />
          <div
            className={`absolute inset-6 sm:inset-7 rounded-full border border-dashed ${
              darkMode ? 'border-white/25' : 'border-black/20'
            }`}
          />
          <div
            className={`absolute inset-12 sm:inset-14 rounded-full border ${
              darkMode ? 'border-white/30' : 'border-black/25'
            }`}
          />
          <div
            className={`absolute inset-18 sm:inset-20 rounded-full border ${
              darkMode ? 'border-white/40' : 'border-black/30'
            }`}
          />

          {/* Crosshair Grids */}
          <div
            className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 ${
              darkMode ? 'bg-white/20' : 'bg-black/15'
            }`}
          />
          <div
            className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${
              darkMode ? 'bg-white/20' : 'bg-black/15'
            }`}
          />

          {/* Diagonal Guides */}
          <div
            className={`absolute inset-x-4 top-1/2 h-px -translate-y-1/2 rotate-45 ${
              darkMode ? 'bg-white/10' : 'bg-black/10'
            }`}
          />
          <div
            className={`absolute inset-x-4 top-1/2 h-px -translate-y-1/2 -rotate-45 ${
              darkMode ? 'bg-white/10' : 'bg-black/10'
            }`}
          />

          {/* Rotating Radar Sweep Cone */}
          <div
            className="absolute inset-2 rounded-full animate-radar-sweep pointer-events-none"
            style={{
              background: darkMode
                ? 'conic-gradient(from 0deg, rgba(255,255,255,0.4) 0deg, rgba(255,255,255,0.05) 55deg, transparent 75deg)'
                : 'conic-gradient(from 0deg, rgba(0,0,0,0.3) 0deg, rgba(0,0,0,0.04) 55deg, transparent 75deg)',
            }}
          />

          {/* Central Spinning Logo that Zooms In */}
          <div className="relative z-10 animate-radar-spin-entrance flex items-center justify-center">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-2xl border transition-transform duration-500 ${
                darkMode
                  ? 'bg-white text-black border-white/40 shadow-white/10'
                  : 'bg-black text-white border-black/40 shadow-black/20'
              }`}
            >
              <Radar className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.4] animate-pulse" />
            </div>
          </div>

          {/* Radar Blip Dots */}
          <div
            className={`absolute top-9 right-11 w-2 h-2 rounded-full animate-ping ${
              darkMode ? 'bg-white' : 'bg-black'
            }`}
            style={{ animationDuration: '1.6s' }}
          />
          <div
            className={`absolute bottom-12 left-10 w-1.5 h-1.5 rounded-full ${
              darkMode ? 'bg-white/80' : 'bg-black/80'
            } animate-pulse`}
          />
        </div>

        {/* Radar Coordinates / Subtle Status Indicator */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-xs tracking-widest uppercase opacity-75 font-semibold">
            <span
              className={`w-2 h-2 rounded-full inline-block animate-ping ${
                darkMode ? 'bg-white' : 'bg-black'
              }`}
            />
            <span className="font-bold">RADAR // SCAN</span>
          </div>

          <div
            className={`mt-2 font-mono text-[10px] tracking-wider px-3 py-1 rounded-full border ${
              darkMode
                ? 'border-white/15 bg-white/5 text-white/70'
                : 'border-black/15 bg-black/5 text-black/70'
            }`}
          >
            SYS.INIT // TARGETING LEADS
          </div>
        </div>
      </div>
    </div>
  );
};
