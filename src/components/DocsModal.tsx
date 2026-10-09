import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code,
  DollarSign
} from 'lucide-react';
import {
  technicalDocs,
  businessPlanDocs,
  investorPitchDeck,
  submissionVideoGuide,
  technicalDocsFa,
  businessPlanDocsFa,
  investorPitchDeckFa,
  submissionVideoGuideFa,
} from '../data/docsContent';
import { Language } from '../utils/i18n';

interface DocsModalProps {
  initialTab?: 'tech' | 'business' | 'pitch' | 'video';
  onBackToApp?: () => void;
  language?: Language;
}

export const DocsModal: React.FC<DocsModalProps> = ({ initialTab = 'tech', onBackToApp, language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'tech' | 'business' | 'pitch' | 'video'>(initialTab);
  const [copiedTxt, setCopiedTxt] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const isRtl = language === 'fa';

  const currentTechDocs = language === 'fa' ? technicalDocsFa : technicalDocs;
  const currentBusinessDocs = language === 'fa' ? businessPlanDocsFa : businessPlanDocs;
  const currentPitchDeck = language === 'fa' ? investorPitchDeckFa : investorPitchDeck;
  const currentVideoGuide = language === 'fa' ? submissionVideoGuideFa : submissionVideoGuide;

  const downloadVideoTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([currentVideoGuide.txtFileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'opportunityradar_video_link.txt';
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  const copyVideoTxt = () => {
    navigator.clipboard.writeText(currentVideoGuide.txtFileContent);
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200/80 dark:border-white/10 gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
            {language === 'fa' ? 'معماری سیستم و مشخصات محصول' : 'SYSTEM ARCHITECTURE & PRODUCT SPECS'}
          </div>
          <h2 className="text-2xl font-black text-neutral-950 dark:text-white mt-1">
            {language === 'fa' ? 'مستندات فنی و ارائه سرمایه‌گذاری' : 'Documentation & Investor Pitch'}
          </h2>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100/70 dark:bg-zinc-800/70 backdrop-blur-md rounded-xl border border-neutral-200/80 dark:border-white/10">
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tech' ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'مشخصات فنی' : 'Technical Specs'}
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'business' ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'طرح تجاری' : 'Business Plan'}
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pitch' ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'ارائه سرمایه‌گذاری' : 'Pitch Deck'}
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'video' ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'لینک ویدیو (.txt)' : 'Video Link (.txt)'}
          </button>
        </div>
      </div>

      {/* ================= TECHNICAL DOCS ================= */}
      {activeTab === 'tech' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-neutral-950 dark:text-white">
              {currentTechDocs.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 mt-2 leading-relaxed">
              {currentTechDocs.summary}
            </p>
          </div>

          {/* LangGraph ASCII Diagram */}
          <div className="p-5 rounded-2xl glass-card">
            <h4 className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wider mb-3 flex items-center space-x-2 rtl:space-x-reverse">
              <Code className="w-4 h-4" />
              <span>{language === 'fa' ? 'گراف حالت ایجنتی (الگوی استدلالی LangGraph)' : 'Agentic State Graph (LangGraph Paradigm)'}</span>
            </h4>

            <div className="font-mono text-xs text-neutral-800 dark:text-zinc-200 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs p-4 rounded-xl border border-neutral-200/80 dark:border-white/10 overflow-x-auto leading-relaxed" dir="ltr">
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

          {/* Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentTechDocs.stages.map((st) => (
              <div key={st.stage} className="p-4 rounded-xl glass-card space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono text-neutral-950 dark:text-white">
                    {language === 'fa' ? `مرحله ۰${st.stage}` : `STAGE 0${st.stage}`}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-600 dark:text-zinc-400 bg-white/80 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-neutral-200/80 dark:border-white/10">
                    {st.costPerMsg}
                  </span>
                </div>
                <h5 className="font-bold text-neutral-950 dark:text-white text-sm">{st.name}</h5>
                <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
                  {st.objective}
                </p>
                <div className="text-[11px] text-neutral-500 dark:text-zinc-400 font-mono pt-1.5 border-t border-neutral-200/60 dark:border-white/10">
                  {language === 'fa' ? 'شرط تصمیم: ' : 'Exit rule: '} {st.decisionRules}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Proof */}
          <div className="p-5 rounded-2xl glass-card">
            <h4 className="text-xs font-bold text-neutral-950 dark:text-white mb-2 uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
              <DollarSign className="w-4 h-4" />
              <span>{language === 'fa' ? 'اثبات ریاضی بهینگی هزینه و مصرف توکن' : 'Cost Awareness Mathematical Proof'}</span>
            </h4>
            <pre className="text-xs font-mono text-neutral-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed" dir={language === 'fa' ? 'rtl' : 'ltr'}>
              {currentTechDocs.costEfficiencyModel.trim()}
            </pre>
          </div>
        </div>
      )}

      {/* ================= BUSINESS PLAN ================= */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-neutral-950 dark:text-white">
              {currentBusinessDocs.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 mt-2 leading-relaxed">
              {currentBusinessDocs.executiveSummary}
            </p>
          </div>

          {/* Market Sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 glass-card rounded-xl text-center">
              <div className="text-[10px] text-neutral-500 dark:text-zinc-400 uppercase font-mono font-bold">TAM</div>
              <div className="text-lg font-black text-neutral-950 dark:text-white font-mono mt-1">
                {language === 'fa' ? '۱۸.۴ میلیارد دلار' : '$18.4 Billion'}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-0.5">
                {language === 'fa' ? 'شنود جهانی رسانه‌های اجتماعی' : 'Global Social Listening'}
              </div>
            </div>

            <div className="p-4 glass-card rounded-xl text-center">
              <div className="text-[10px] text-neutral-500 dark:text-zinc-400 uppercase font-mono font-bold">SAM</div>
              <div className="text-lg font-black text-neutral-950 dark:text-white font-mono mt-1">
                {language === 'fa' ? '۳.۲ میلیارد دلار' : '$3.2 Billion'}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-0.5">
                {language === 'fa' ? 'بوت‌کمپ‌ها، ساس و برندهای DTC' : 'Bootcamps, SaaS, DTC'}
              </div>
            </div>

            <div className="p-4 glass-card rounded-xl text-center">
              <div className="text-[10px] text-neutral-500 dark:text-zinc-400 uppercase font-mono font-bold">SOM</div>
              <div className="text-lg font-black text-neutral-950 dark:text-white font-mono mt-1">
                {language === 'fa' ? '۴۸ میلیون دلار' : '$48 Million'}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-0.5">
                {language === 'fa' ? 'تمرکز اولیه ۳ سال نخست' : 'Initial 3-Year Focus'}
              </div>
            </div>
          </div>

          {/* Problem vs Value Proposition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl glass-card space-y-2">
              <h5 className="font-bold text-neutral-950 dark:text-white text-xs uppercase tracking-wider">
                {language === 'fa' ? 'اعتبارسنجی مسئله' : 'Problem Validation'}
              </h5>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-zinc-400">
                {currentBusinessDocs.problemValidation.map((p, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span>—</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl glass-card space-y-2">
              <h5 className="font-bold text-neutral-950 dark:text-white text-xs uppercase tracking-wider">
                {language === 'fa' ? 'مزیت رقابتی الف رادار' : 'Alef Radar Advantage'}
              </h5>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-zinc-400">
                {currentBusinessDocs.valueProposition.map((v, i) => (
                  <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span>✓</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="p-5 rounded-2xl glass-card space-y-3">
            <h5 className="font-bold text-neutral-950 dark:text-white text-xs uppercase tracking-wider">
              {language === 'fa' ? 'مدل درآمدی و پلن‌های قیمت‌گذاری SaaS' : 'Monetization & SaaS Pricing Tiers'}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentBusinessDocs.revenueModel.map((tier, idx) => (
                <div key={idx} className="p-3.5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs border border-neutral-200/80 dark:border-white/10 rounded-xl">
                  <div className="font-bold text-xs text-neutral-950 dark:text-white">{tier.tier}</div>
                  <p className="text-[11px] text-neutral-600 dark:text-zinc-400 mt-2 leading-relaxed">{tier.features}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= PITCH DECK ================= */}
      {activeTab === 'pitch' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200/80 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-black text-neutral-950 dark:text-white">
                {currentPitchDeck.title}
              </h3>
            </div>

            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              {currentPitchDeck.slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSlide === idx
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs font-bold'
                      : 'border border-neutral-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-800/60 text-neutral-600 dark:text-zinc-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Slide Display */}
          <div className="min-h-[260px] p-6 sm:p-8 rounded-2xl glass-card flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                {language === 'fa'
                  ? `اسلاید ${currentPitchDeck.slides[activeSlide].slideNumber} از ${currentPitchDeck.slides.length}`
                  : `SLIDE ${currentPitchDeck.slides[activeSlide].slideNumber} / ${currentPitchDeck.slides.length}`}
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
                {currentPitchDeck.slides[activeSlide].title}
              </h4>
              <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-zinc-400 mt-1 mb-5">
                {currentPitchDeck.slides[activeSlide].subtitle}
              </p>

              <ul className="space-y-3">
                {currentPitchDeck.slides[activeSlide].bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start space-x-2.5 rtl:space-x-reverse text-xs sm:text-sm text-neutral-700 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-white mt-2 shrink-0" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-neutral-200/80 dark:border-white/10 mt-6">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide(activeSlide - 1)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 text-xs font-bold text-neutral-700 dark:text-zinc-200 disabled:opacity-30 cursor-pointer shadow-xs"
              >
                {language === 'fa' ? 'اسلاید قبلی' : 'Previous'}
              </button>

              <button
                disabled={activeSlide === currentPitchDeck.slides.length - 1}
                onClick={() => setActiveSlide(activeSlide + 1)}
                className="px-4 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold disabled:opacity-30 cursor-pointer shadow-xs"
              >
                {language === 'fa' ? 'اسلاید بعدی' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIDEO LINK TXT ================= */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-neutral-950 dark:text-white">
              {currentVideoGuide.videoTitle}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 mt-1">
              {language === 'fa'
                ? 'فایل متنی قابل دانلود شامل مشخصات سناریو و لینک ویدیوی معرفی ۵ دقیقه‌ای برای مسابقه buildX.'
                : 'Downloadable .txt file containing the 5-minute video demonstration link required for buildX contest submission.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={downloadVideoTxt}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs shadow-xs hover:opacity-90 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'fa' ? 'دانلود فایل video_link.txt' : 'Download video_link.txt File'}</span>
            </button>

            <button
              onClick={copyVideoTxt}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 text-neutral-800 dark:text-zinc-200 text-xs font-bold hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              {copiedTxt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'fa' ? 'کپی شد!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{language === 'fa' ? 'کپی محتوای فایل' : 'Copy File Content'}</span>
                </>
              )}
            </button>
          </div>

          {/* Text Preview */}
          <div className="p-4 rounded-2xl glass-card font-mono text-xs text-neutral-800 dark:text-zinc-200" dir={language === 'fa' ? 'rtl' : 'ltr'}>
            <div className="text-[10px] text-neutral-400 dark:text-zinc-500 uppercase font-bold mb-2 pb-2 border-b border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
              <span>{language === 'fa' ? 'محتوای فایل: opportunityradar_video_link.txt' : 'File Content: opportunityradar_video_link.txt'}</span>
              <span>{language === 'fa' ? 'آماده برای ارسال در ZIP' : 'Ready for Submission ZIP'}</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{currentVideoGuide.txtFileContent}</pre>
          </div>

          {/* Script Breakdown */}
          <div className="p-5 rounded-2xl glass-card space-y-3">
            <h4 className="font-bold text-neutral-950 dark:text-white text-xs uppercase tracking-wider">
              {language === 'fa' ? 'برنامه زمان‌بندی ویدیوی دموی ۵ دقیقه‌ای' : '5-Minute Video Walkthrough Roadmap'}
            </h4>
            <div className="space-y-2">
              {currentVideoGuide.scriptStructure.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 rtl:space-x-reverse p-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs border border-neutral-200/80 dark:border-white/10 text-xs">
                  <span className="font-mono font-bold shrink-0 text-neutral-950 dark:text-white">{item.minute}</span>
                  <span className="text-neutral-600 dark:text-zinc-400">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
