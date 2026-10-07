import React, { useEffect, useState } from 'react';
import { Radar, Filter, Brain, Target, MessageSquare, DollarSign, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

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
      title: isPersian ? 'مرحله ۱: فیلتر ارزان' : 'Stage 1: Cheap Filter',
      desc: isPersian ? 'حذف نویز، هرزنامه‌ها و پیام‌های نامرتبط با حداقل توکن' : 'Lexical & anti-spam triage (~80 tokens)',
      icon: Filter,
      color: 'from-blue-500 to-cyan-500',
      activeColor: 'border-cyan-400 bg-cyan-500/10 text-cyan-400',
    },
    {
      step: 2,
      title: isPersian ? 'مرحله ۲: درک زمینه' : 'Stage 2: Context Analysis',
      desc: isPersian ? 'استخراج قصد خرید، سطح مهارت و فوریت کاربر' : 'Deep problem, intent & constraint extraction',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      activeColor: 'border-purple-400 bg-purple-500/10 text-purple-400',
    },
    {
      step: 3,
      title: isPersian ? 'مرحله ۳: ارزیابی تناسب' : 'Stage 3: Fit Evaluation',
      desc: isPersian ? 'مقایسه با پروفایل محصول و امتیازدهی ۰ تا ۱۰۰' : 'Product profile matching & decision scoring',
      icon: Target,
      color: 'from-amber-500 to-orange-500',
      activeColor: 'border-amber-400 bg-amber-500/10 text-amber-400',
    },
    {
      step: 4,
      title: isPersian ? 'مرحله ۴: تولید پاسخ' : 'Stage 4: Reply Generation',
      desc: isPersian ? 'تولید پاسخ هوشمند و بدون اسپم برای فرصت‌های قوی' : 'Personalized authentic value-first response',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-500',
      activeColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow ambient circle */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Radar className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {isPersian ? 'اجرای پایپ‌لاین ایجنتیک OpportunityRadar' : 'OpportunityRadar Agent in Action'}
              </h3>
              <p className="text-xs text-slate-400">
                {isPersian
                  ? `در حال پردازش پیام ${currentMessageIndex + 1} از ${totalMessages}`
                  : `Processing message ${currentMessageIndex + 1} of ${totalMessages}...`}
              </p>
            </div>
          </div>

          <div className="text-right rtl:text-left font-mono">
            <span className="text-xs text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Multi-Stage Cascade Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {stages.map((st) => {
            const isCurrent = currentStageNumber === st.step;
            const isCompleted = currentStageNumber > st.step;
            const Icon = st.icon;

            return (
              <div
                key={st.step}
                className={`p-3.5 rounded-2xl border transition-all relative ${
                  isCurrent
                    ? `${st.activeColor} ring-1 ring-current shadow-lg`
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                    : 'bg-slate-950/30 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{st.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Cost Awareness & Telemetry Metrics Panel */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">
              {isPersian ? 'توکن‌های مصرف‌شده' : 'Tokens Used'}
            </div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
              {runningTokens.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">
              {isPersian ? 'هزینه فعلی اجرای ایجنت' : 'Accumulated Cost'}
            </div>
            <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
              ${runningCost.toFixed(5)}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">
              {isPersian ? 'نویز حذف‌شده زودهنگام' : 'Early Discarded'}
            </div>
            <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">
              {discardedCount} {isPersian ? 'پیام' : 'msgs'}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-4">
          {isPersian
            ? '💡 سیستم آگاه از هزینه: پیام‌های فاقد ارزش در مرحله اول متوقف می‌شوند تا هزینه بیهوده LLM پرداخت نشود.'
            : '💡 Cost-aware design: Non-relevant messages are halted at Stage 1, eliminating 80%+ of unnecessary LLM inference.'}
        </p>
      </div>
    </div>
  );
};
