import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Cpu,
  Briefcase,
  Sparkles,
  Video,
  Code,
  DollarSign
} from 'lucide-react';
import { technicalDocs, businessPlanDocs, investorPitchDeck, submissionVideoGuide } from '../data/docsContent';

interface DocsModalProps {
  viewMode: 'tech_docs' | 'business_plan' | 'pitch' | 'video';
  onClose: () => void;
  isPersian: boolean;
}

export const DocsModal: React.FC<DocsModalProps> = ({ viewMode, onClose, isPersian }) => {
  const [copiedTxt, setCopiedTxt] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const downloadVideoTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([submissionVideoGuide.txtFileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'opportunityradar_video_link.txt';
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  const copyVideoTxt = () => {
    navigator.clipboard.writeText(submissionVideoGuide.txtFileContent);
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      {/* ================= TECHNICAL DOCS ================= */}
      {viewMode === 'tech_docs' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Architecture & Agent Graph
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
              {isPersian ? technicalDocs.faTitle : technicalDocs.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
              {isPersian ? technicalDocs.faSummary : technicalDocs.summary}
            </p>
          </div>

          {/* LangGraph-Style State Machine Diagram */}
          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3 flex items-center space-x-2 rtl:space-x-reverse">
              <Code className="w-4 h-4" />
              <span>Agentic State Graph (LangGraph Paradigm)</span>
            </h3>

            <div className="font-mono text-xs text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-950 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-x-auto leading-relaxed">
              {`[State Graph Node Flow]:
INPUT: CommunityMessageFeed (Reddit / Telegram / X / Discord)
   │
   ▼
[Stage 1: cheap_relevance_filter] ─── (Relevance < 40 / Spam) ───► [EARLY_EXIT: IGNORE]
   │ (Tokens: ~80 | Cost: $0.000010)                                 (Cost saved: 88%)
   ▼ (Relevance >= 40)
[Stage 2: context_understanding]
   │ (Extract: problem, intent, urgency, skill, constraints)
   ▼ (Tokens: ~300 | Cost: $0.000045)
[Stage 3: product_fit_evaluator]
   │ (Compare user pain against ProductProfile)
   ├─────────────────────────────────────────────────┐
   ▼ (Score 0-49: NO_FIT)      ▼ (Score 50-74: WEAK_FIT)   ▼ (Score 75-100: STRONG_FIT)
[ACTION: IGNORE]            [ACTION: WATCH]             [Stage 4: reply_generator]
                                                           │ (Tokens: ~480 | Cost: $0.000095)
                                                           ▼
                                                        [OUTPUT: Act Now Lead + Reply]`}
            </div>
          </div>

          {/* Detailed Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {technicalDocs.stages.map((st) => (
              <div key={st.stage} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono text-neutral-900 dark:text-white">STAGE 0{st.stage}</span>
                  <span className="text-[10px] font-mono text-neutral-500 bg-white dark:bg-neutral-950 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
                    {st.costPerMsg}
                  </span>
                </div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">{st.name}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {isPersian ? st.faObjective : st.objective}
                </p>
                <div className="text-[11px] text-neutral-500 font-mono pt-1.5 border-t border-neutral-200 dark:border-neutral-800">
                  Exit rule: {st.decisionRules}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Model Proof */}
          <div className="p-5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-2 uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
              <DollarSign className="w-4 h-4" />
              <span>Cost Awareness Mathematical Proof</span>
            </h3>
            <pre className="text-xs font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
              {technicalDocs.costEfficiencyModel.trim()}
            </pre>
          </div>
        </div>
      )}

      {/* ================= BUSINESS PLAN ================= */}
      {viewMode === 'business_plan' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">
              GTM & Unit Economics
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
              {isPersian ? businessPlanDocs.faTitle : businessPlanDocs.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
              {isPersian ? businessPlanDocs.faExecutiveSummary : businessPlanDocs.executiveSummary}
            </p>
          </div>

          {/* Market Sizing TAM / SAM / SOM */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
              <div className="text-[10px] text-neutral-500 uppercase font-mono font-bold">TAM</div>
              <div className="text-lg font-black text-neutral-900 dark:text-white font-mono mt-1">$18.4 Billion</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Global Social Intelligence</div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
              <div className="text-[10px] text-neutral-500 uppercase font-mono font-bold">SAM</div>
              <div className="text-lg font-black text-neutral-900 dark:text-white font-mono mt-1">$3.2 Billion</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Bootcamps, DTC, SaaS</div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
              <div className="text-[10px] text-neutral-500 uppercase font-mono font-bold">SOM</div>
              <div className="text-lg font-black text-neutral-900 dark:text-white font-mono mt-1">$48 Million</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Initial 3-Year Focus</div>
            </div>
          </div>

          {/* Problem vs Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">Problem Validation</h4>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {businessPlanDocs.problemValidation.map((p, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span>—</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">OpportunityRadar Advantage</h4>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {businessPlanDocs.valueProposition.map((v, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span>✓</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-3">
            <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">Monetization & SaaS Pricing Tiers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {businessPlanDocs.revenueModel.map((tier, idx) => (
                <div key={idx} className="p-3.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                  <div className="font-bold text-xs text-neutral-900 dark:text-white">{tier.tier}</div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">{tier.features}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= PITCH DECK ================= */}
      {viewMode === 'pitch' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Investor Deck
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {isPersian ? investorPitchDeck.faTitle : investorPitchDeck.title}
              </h2>
            </div>

            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              {investorPitchDeck.slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    activeSlide === idx
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                      : 'border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Slide */}
          <div className="min-h-[260px] p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1">
                SLIDE {investorPitchDeck.slides[activeSlide].slideNumber} / {investorPitchDeck.slides.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {investorPitchDeck.slides[activeSlide].title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-1 mb-5">
                {investorPitchDeck.slides[activeSlide].subtitle}
              </p>

              <ul className="space-y-3">
                {investorPitchDeck.slides[activeSlide].bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start space-x-2.5 rtl:space-x-reverse text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white mt-2 shrink-0" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-6">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide(activeSlide - 1)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-bold text-neutral-700 dark:text-neutral-300 disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>

              <button
                disabled={activeSlide === investorPitchDeck.slides.length - 1}
                onClick={() => setActiveSlide(activeSlide + 1)}
                className="px-4 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-bold disabled:opacity-30 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIDEO LINK TXT ================= */}
      {viewMode === 'video' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Contest Submission Video
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
              {isPersian ? submissionVideoGuide.faVideoTitle : submissionVideoGuide.videoTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {isPersian
                ? 'فایل txt حاوی لینک ویدیوی معرفی و تست کارکردی سیستم برای داوران مسابقه buildX'
                : '1-click downloadable .txt file containing the 5-minute video demonstration link.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={downloadVideoTxt}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isPersian ? 'دانلود فایل txt لینک ویدیو (.txt)' : 'Download video_link.txt'}</span>
            </button>

            <button
              onClick={copyVideoTxt}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-all cursor-pointer"
            >
              {copiedTxt ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isPersian ? 'متن فایل کپی شد!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isPersian ? 'کپی متن فایل txt' : 'Copy Content'}</span>
                </>
              )}
            </button>
          </div>

          {/* File Preview */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-xs text-neutral-800 dark:text-neutral-200">
            <div className="text-[10px] text-neutral-500 uppercase font-bold mb-2 pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span>File Content: opportunityradar_video_link.txt</span>
              <span>buildX submission ready</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{submissionVideoGuide.txtFileContent}</pre>
          </div>

          {/* Video Script Timing */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3">
            <h4 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">
              {isPersian ? 'زمان‌بندی ویدیوی ۵ دقیقه‌ای' : '5-Minute Demonstration Breakdown'}
            </h4>
            <div className="space-y-2">
              {submissionVideoGuide.scriptStructure.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="font-mono font-bold shrink-0 text-neutral-900 dark:text-white">{item.minute}</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
