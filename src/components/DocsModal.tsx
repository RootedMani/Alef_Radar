import React, { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  Sparkles,
  Video,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* ================= TECHNICAL DOCS ================= */}
      {viewMode === 'tech_docs' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2">
              <Cpu className="w-4 h-4" />
              <span>buildX Technical Specification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {isPersian ? technicalDocs.faTitle : technicalDocs.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {isPersian ? technicalDocs.faSummary : technicalDocs.summary}
            </p>
          </div>

          {/* LangGraph-Style State Machine Diagram */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center space-x-2 rtl:space-x-reverse">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Agentic Directed State Graph (LangGraph Paradigm)</span>
            </h3>

            <div className="font-mono text-xs text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800/80 overflow-x-auto leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicalDocs.stages.map((st) => (
              <div key={st.stage} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs">Stage {st.stage}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {st.costPerMsg}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{st.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isPersian ? st.faObjective : st.objective}
                </p>
                <div className="text-[11px] text-cyan-400 font-mono pt-1 border-t border-slate-800/60">
                  Exit rule: {st.decisionRules}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Model Proof */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-emerald-950/30 border border-emerald-500/30">
            <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center space-x-2 rtl:space-x-reverse">
              <DollarSign className="w-4 h-4" />
              <span>Cost Awareness Mathematical Proof</span>
            </h3>
            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {technicalDocs.costEfficiencyModel.trim()}
            </pre>
          </div>
        </div>
      )}

      {/* ================= BUSINESS PLAN ================= */}
      {viewMode === 'business_plan' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-2">
              <Briefcase className="w-4 h-4" />
              <span>buildX Business Plan & Go-To-Market</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {isPersian ? businessPlanDocs.faTitle : businessPlanDocs.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {isPersian ? businessPlanDocs.faExecutiveSummary : businessPlanDocs.executiveSummary}
            </p>
          </div>

          {/* Market Sizing TAM / SAM / SOM */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-slate-500 uppercase font-bold">TAM (Total Addressable)</div>
              <div className="text-lg font-extrabold text-white font-mono mt-1">$18.4 Billion</div>
              <div className="text-[10px] text-slate-400 mt-1">Global Social Intelligence Market</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-emerald-500 uppercase font-bold">SAM (Serviceable)</div>
              <div className="text-lg font-extrabold text-emerald-400 font-mono mt-1">$3.2 Billion</div>
              <div className="text-[10px] text-slate-400 mt-1">Bootcamps, SaaS, DTC & Agencies</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-cyan-500 uppercase font-bold">SOM (Obtainable)</div>
              <div className="text-lg font-extrabold text-cyan-400 font-mono mt-1">$48 Million</div>
              <div className="text-[10px] text-slate-400 mt-1">Initial 3-Year Target in MENA/Global</div>
            </div>
          </div>

          {/* Value Props & Problem Validation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider">Problem Validation</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {businessPlanDocs.problemValidation.map((p, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="text-rose-500 mt-0.5">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">OpportunityRadar Solution</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {businessPlanDocs.valueProposition.map((v, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Monetization & SaaS Pricing Tiers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {businessPlanDocs.revenueModel.map((tier, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="font-bold text-emerald-400 text-xs">{tier.tier}</div>
                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{tier.features}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= PITCH DECK ================= */}
      {viewMode === 'pitch' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Investor Presentation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
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
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Slide Display */}
          <div className="min-h-[260px] p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest mb-1">
                SLIDE {investorPitchDeck.slides[activeSlide].slideNumber} OF {investorPitchDeck.slides.length}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {investorPitchDeck.slides[activeSlide].title}
              </h3>
              <p className="text-sm font-medium text-cyan-300 mt-1 mb-5">
                {investorPitchDeck.slides[activeSlide].subtitle}
              </p>

              <ul className="space-y-3">
                {investorPitchDeck.slides[activeSlide].bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start space-x-2.5 rtl:space-x-reverse text-xs sm:text-sm text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide(activeSlide - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-30"
              >
                Previous Slide
              </button>

              <button
                disabled={activeSlide === investorPitchDeck.slides.length - 1}
                onClick={() => setActiveSlide(activeSlide + 1)}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 disabled:opacity-30"
              >
                Next Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIDEO LINK & SUBMISSION PACKAGE ================= */}
      {viewMode === 'video' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
              <Video className="w-4 h-4" />
              <span>buildX Contest Deliverables Package</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {isPersian ? submissionVideoGuide.faVideoTitle : submissionVideoGuide.videoTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isPersian
                ? 'فایل txt حاوی تنها لینک ویدیوی ۵ دقیقه‌ای معرفی و تست کارکردی سیستم برای داوران مسابقه buildX'
                : 'Downloadable .txt file containing the 5-minute video presentation link required by the contest rules.'}
            </p>
          </div>

          {/* 1-Click Download and Copy Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={downloadVideoTxt}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isPersian ? 'دانلود فایل txt لینک ویدیو (.txt)' : 'Download video_link.txt File'}</span>
            </button>

            <button
              onClick={copyVideoTxt}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
            >
              {copiedTxt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isPersian ? 'متن فایل کپی شد!' : 'Copied to Clipboard!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isPersian ? 'کپی متن فایل txt' : 'Copy .txt Content'}</span>
                </>
              )}
            </button>
          </div>

          {/* Preview of the .txt File */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
            <div className="text-[11px] text-slate-500 uppercase font-bold mb-2 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>File Content Preview: opportunityradar_video_link.txt</span>
              <span className="text-emerald-400">Ready for submission zip</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{submissionVideoGuide.txtFileContent}</pre>
          </div>

          {/* Video Script Timing Roadmap */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {isPersian ? 'زمان‌بندی ویدیوی ۵ دقیقه‌ای معرفی محصول' : '5-Minute Demonstration Script Breakdown'}
            </h4>
            <div className="space-y-2">
              {submissionVideoGuide.scriptStructure.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg bg-slate-900 text-xs">
                  <span className="font-mono text-amber-400 font-bold shrink-0">{item.minute}</span>
                  <span className="text-slate-300">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
