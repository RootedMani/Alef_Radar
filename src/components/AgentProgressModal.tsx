import React from 'react';
import { Radar, Filter, Brain, Target, MessageSquare, Check } from 'lucide-react';
import { Language } from '../utils/i18n';

interface AgentProgressModalProps {
  isOpen: boolean;
  totalMessages: number;
  currentMessageIndex: number;
  currentStageNumber: 1 | 2 | 3 | 4;
  runningTokens: number;
  runningCost: number;
  discardedCount: number;
  actNowCount: number;
  language?: Language;
}

export const AgentProgressModal: React.FC<AgentProgressModalProps> = ({
  isOpen,
  totalMessages,
  currentMessageIndex,
  currentStageNumber,
  runningTokens,
  runningCost,
  discardedCount,
  actNowCount,
  language = 'en',
}) => {
  if (!isOpen) return null;

  const isRtl = language === 'fa';
  const progressPercent = Math.min(100, Math.round(((currentMessageIndex + 1) / totalMessages) * 100));

  const stages = language === 'fa' ? [
    {
      step: 1,
      title: 'مرحله ۱: غربالگری اولیه ارزان',
      desc: 'غربالگری فوری واژگانی و هرزنامه (~۸۰ توکن)',
      icon: Filter,
    },
    {
      step: 2,
      title: 'مرحله ۲: تحلیل بستر و نیت',
      desc: 'استخراج نیت خریدار، فوریت و سطح نیاز',
      icon: Brain,
    },
    {
      step: 3,
      title: 'مرحله ۳: سنجش تطابق با محصول',
      desc: 'انطباق دوطرفه با مشخصات و امتیازدهی (۰ تا ۱۰۰)',
      icon: Target,
    },
    {
      step: 4,
      title: 'مرحله ۴: تولید پاسخ اختصاصی',
      desc: 'نگارش پاسخ ارزش‌محور و طبیعی بدون اسپم',
      icon: MessageSquare,
    },
  ] : [
    {
      step: 1,
      title: 'Stage 1: Cheap Relevance Filter',
      desc: 'Instant lexical & anti-spam triage (~80 tokens)',
      icon: Filter,
    },
    {
      step: 2,
      title: 'Stage 2: Context Analysis',
      desc: 'Extracting buyer intent, skill level & urgency',
      icon: Brain,
    },
    {
      step: 3,
      title: 'Stage 3: Fit Evaluation',
      desc: 'Bilateral profile matching & scoring (0–100)',
      icon: Target,
    },
    {
      step: 4,
      title: 'Stage 4: Reply Generation',
      desc: 'Composing authentic value-first tailored response',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shrink-0">
              <Radar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">
                {language === 'fa' ? 'آبشار ایجنت در حال پردازش' : 'Agent Cascade in Progress'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400">
                {language === 'fa'
                  ? `در حال پردازش پیام ${currentMessageIndex + 1} از ${totalMessages}...`
                  : `Processing message ${currentMessageIndex + 1} of ${totalMessages}...`}
              </p>
            </div>
          </div>

          <div className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-zinc-700 bg-neutral-100 dark:bg-zinc-800 text-neutral-800 dark:text-zinc-200 shrink-0">
            {language === 'fa' ? `${progressPercent}٪ تکمیل شد` : `${progressPercent}% Complete`}
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-neutral-100 dark:bg-zinc-800 rounded-full h-1.5 mb-6 overflow-hidden border border-neutral-200 dark:border-zinc-700">
          <div
            className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
          {stages.map((st) => {
            const isCurrent = currentStageNumber === st.step;
            const isCompleted = currentStageNumber > st.step;
            const Icon = st.icon;

            return (
              <div
                key={st.step}
                className={`p-3.5 rounded-xl border transition-all text-left rtl:text-right ${
                  isCurrent
                    ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-zinc-800/80 shadow-xs ring-1 ring-neutral-950 dark:ring-white'
                    : isCompleted
                    ? 'border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 text-neutral-500 dark:text-zinc-400'
                    : 'border-neutral-200/60 dark:border-zinc-800/60 bg-transparent opacity-40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse font-bold text-xs text-neutral-950 dark:text-white">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{st.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse shrink-0" />
                  )}
                  {isCompleted && (
                    <Check className="w-3.5 h-3.5 text-neutral-950 dark:text-white stroke-[2.5] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-zinc-400 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Minimalist Telemetry Grid */}
        <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950/60 text-center font-mono">
          <div>
            <div className="text-[10px] uppercase text-neutral-400 dark:text-zinc-500 font-bold">
              {language === 'fa' ? 'توکن مصرفی' : 'Tokens Used'}
            </div>
            <div className="text-xs font-black text-neutral-950 dark:text-white mt-0.5">
              {runningTokens.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-neutral-400 dark:text-zinc-500 font-bold">
              {language === 'fa' ? 'هزینه پردازش' : 'Inference Cost'}
            </div>
            <div className="text-xs font-black text-neutral-950 dark:text-white mt-0.5">
              ${runningCost.toFixed(5)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-neutral-400 dark:text-zinc-500 font-bold">
              {language === 'fa' ? 'حذف اولیه' : 'Early Pruned'}
            </div>
            <div className="text-xs font-black text-neutral-950 dark:text-white mt-0.5">
              {discardedCount} {language === 'fa' ? 'پیام' : 'msgs'}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-neutral-400 dark:text-zinc-500 mt-4 font-mono">
          {language === 'fa'
            ? '// موتور بهینه‌ساز هزینه، پیام‌های نامربوط را در مراحل اولیه متوقف می‌کند.'
            : '// Cost-aware engine halts chatter early to prevent wasteful LLM token inference.'}
        </p>
      </div>
    </div>
  );
};
