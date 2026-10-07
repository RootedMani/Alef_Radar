import React from 'react';
import { Radar, Filter, Brain, Target, MessageSquare, Check } from 'lucide-react';

interface AgentProgressModalProps {
  isOpen: boolean;
  totalMessages: number;
  currentMessageIndex: number;
  currentStageNumber: 1 | 2 | 3 | 4;
  runningTokens: number;
  runningCost: number;
  discardedCount: number;
  actNowCount: number;
  isPersian: boolean;
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
  isPersian,
}) => {
  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((currentMessageIndex + 1) / totalMessages) * 100));

  const stages = [
    {
      step: 1,
      title: isPersian ? 'مرحله ۱: غربالگری ارزان' : 'Stage 1: Cheap Filter',
      desc: isPersian ? 'حذف نویز و هرزنامه‌ها با کمترین توکن' : 'Lexical & anti-spam triage (~80 tokens)',
      icon: Filter,
    },
    {
      step: 2,
      title: isPersian ? 'مرحله ۲: درک زمینه و نیت' : 'Stage 2: Context Analysis',
      desc: isPersian ? 'استخراج قصد خرید، مهارت و فوریت کاربر' : 'Pain points, intent & constraint extraction',
      icon: Brain,
    },
    {
      step: 3,
      title: isPersian ? 'مرحله ۳: ارزیابی تناسب' : 'Stage 3: Fit Evaluation',
      desc: isPersian ? 'مقایسه با پروفایل و امتیازدهی ۰ تا ۱۰۰' : 'Product profile matching & decision scoring',
      icon: Target,
    },
    {
      step: 4,
      title: isPersian ? 'مرحله ۴: تولید پاسخ' : 'Stage 4: Reply Generation',
      desc: isPersian ? 'تولید پاسخ هوشمند برای فرصت‌های قوی' : 'Authentic value-first tailored response',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
              <Radar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                {isPersian ? 'پایپ‌لاین ایجنت در حال اجرا' : 'OpportunityRadar Agent Pipeline'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {isPersian
                  ? `در حال پردازش پیام ${currentMessageIndex + 1} از ${totalMessages}`
                  : `Processing message ${currentMessageIndex + 1} of ${totalMessages}...`}
              </p>
            </div>
          </div>

          <div className="font-mono text-xs font-bold px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
            {progressPercent}%
          </div>
        </div>

        {/* Minimalist Progress Track */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 mb-6 overflow-hidden">
          <div
            className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
          {stages.map((st) => {
            const isCurrent = currentStageNumber === st.step;
            const isCompleted = currentStageNumber > st.step;
            const Icon = st.icon;

            return (
              <div
                key={st.step}
                className={`p-3 rounded-xl border transition-all text-left rtl:text-right ${
                  isCurrent
                    ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-900 shadow-sm'
                    : isCompleted
                    ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400'
                    : 'border-neutral-200/60 dark:border-neutral-900 bg-transparent opacity-40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse font-bold text-xs text-neutral-900 dark:text-white">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{st.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                  )}
                  {isCompleted && (
                    <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white stroke-[2.5]" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Cost Awareness Minimal Telemetry */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-center font-mono">
          <div>
            <div className="text-[10px] uppercase text-neutral-400 font-semibold">Tokens</div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">
              {runningTokens.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-neutral-400 font-semibold">Cost (USD)</div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">
              ${runningCost.toFixed(5)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-neutral-400 font-semibold">Early Discarded</div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">
              {discardedCount}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-neutral-500 dark:text-neutral-400 mt-4 font-mono">
          {isPersian
            ? '// سیستم آگاه از هزینه: حذف زودهنگام نویزها مانع از هدررفت توکن‌های LLM می‌شود.'
            : '// Cost-Aware Architecture: Halting noise early saves downstream LLM tokens.'}
        </p>
      </div>
    </div>
  );
};
