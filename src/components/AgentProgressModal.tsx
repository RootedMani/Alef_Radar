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
}) => {
  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((currentMessageIndex + 1) / totalMessages) * 100));

  const stages = [
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
              <Radar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-950">
                Agent Cascade in Progress
              </h3>
              <p className="text-xs text-neutral-500">
                Processing message {currentMessageIndex + 1} of {totalMessages}...
              </p>
            </div>
          </div>

          <div className="font-mono text-xs font-bold px-2 py-0.5 rounded border border-neutral-300 bg-neutral-100 text-neutral-800">
            {progressPercent}% Complete
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-1.5 mb-6 overflow-hidden border border-neutral-200">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-300"
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
                className={`p-3.5 rounded-xl border transition-all text-left ${
                  isCurrent
                    ? 'border-neutral-950 bg-neutral-50 shadow-xs ring-1 ring-neutral-950'
                    : isCompleted
                    ? 'border-neutral-200 bg-neutral-50/50 text-neutral-500'
                    : 'border-neutral-200/60 bg-transparent opacity-40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 font-bold text-xs text-neutral-950">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{st.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                  )}
                  {isCompleted && (
                    <Check className="w-3.5 h-3.5 text-neutral-950 stroke-[2.5]" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Minimalist Telemetry Grid */}
        <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 text-center font-mono">
          <div>
            <div className="text-[10px] uppercase text-neutral-400 font-bold">Tokens Used</div>
            <div className="text-xs font-black text-neutral-950 mt-0.5">
              {runningTokens.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-neutral-400 font-bold">Inference Cost</div>
            <div className="text-xs font-black text-neutral-950 mt-0.5">
              ${runningCost.toFixed(5)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-neutral-400 font-bold">Early Pruned</div>
            <div className="text-xs font-black text-neutral-950 mt-0.5">
              {discardedCount} msgs
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-neutral-400 mt-4 font-mono">
          // Cost-aware engine halts chatter early to prevent wasteful LLM token inference.
        </p>
      </div>
    </div>
  );
};
