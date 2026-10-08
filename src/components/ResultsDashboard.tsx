import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Filter,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  LayoutGrid,
  Kanban,
  Table as TableIcon,
  Flame,
  Clock,
  UserCheck
} from 'lucide-react';
import { MessageAnalysis, ProductProfile, RunSummary } from '../types';
import { Language, translations } from '../utils/i18n';

interface ResultsDashboardProps {
  summary: RunSummary;
  results: MessageAnalysis[];
  activeProfile: ProductProfile;
  onToggleReplyUsed: (messageId: string) => void;
  language?: Language;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  summary,
  results,
  activeProfile,
  onToggleReplyUsed,
  language = 'en',
}) => {
  const [filterDecision, setFilterDecision] = useState<'ALL' | 'ACT_NOW' | 'WATCH' | 'IGNORE'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'kanban' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const t = translations[language];
  const isRtl = language === 'fa';

  const handleCopyReply = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllActNow = () => {
    const actNowReplies = results
      .filter((r) => r.decision === 'ACT_NOW' && r.stage4?.suggestedReply)
      .map((r) => `[@${r.message.author} on ${r.message.platform} (${r.message.sourceCommunity})]\n${r.stage4?.suggestedReply}`)
      .join('\n\n---\n\n');

    if (actNowReplies) {
      navigator.clipboard.writeText(actNowReplies);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const filteredResults = results.filter((item) => {
    if (filterDecision !== 'ALL' && item.decision !== filterDecision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.message.text.toLowerCase().includes(q) ||
        item.message.author.toLowerCase().includes(q) ||
        item.message.sourceCommunity.toLowerCase().includes(q) ||
        (item.stage2?.detectedProblem && item.stage2.detectedProblem.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ summary, results }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opportunityradar-analysis-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportToCsv = () => {
    const headers = ['MessageID', 'Author', 'Platform', 'Community', 'Score', 'Decision', 'DetectedProblem', 'Urgency', 'SuggestedReply', 'CostUSD'];
    const rows = results.map((r) => [
      r.messageId,
      `"${r.message.author}"`,
      r.message.platform,
      `"${r.message.sourceCommunity.replace(/"/g, '""')}"`,
      r.totalOpportunityScore,
      r.decision,
      `"${(r.stage2?.detectedProblem || '').replace(/"/g, '""')}"`,
      r.stage2?.urgency || 'N/A',
      `"${(r.stage4?.suggestedReply || '').replace(/"/g, '""')}"`,
      r.totalCostUsd.toFixed(6)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `opportunityradar-leads-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
              {language === 'fa' ? 'مرحله ۳ // نتایج تحلیل و پیشنهادات' : 'STEP 3 // ANALYSIS RESULTS & OUTREACH'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-neutral-800 dark:text-zinc-200">
              {results.length} {language === 'fa' ? 'تحلیل‌شده' : 'Analyzed'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 dark:text-white mt-1">
            {t.resultsTitle}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">
            {language === 'fa' ? 'تطابق با پروفایل:' : 'Matched against profile:'}{' '}
            <span className="font-bold text-neutral-900 dark:text-zinc-200">{activeProfile.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {summary.stage4ActNow > 0 && (
            <button
              onClick={handleCopyAllActNow}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? (language === 'fa' ? 'تمام پاسخ‌ها کپی شد!' : 'All Replies Copied!') : (language === 'fa' ? `کپی ${summary.stage4ActNow} پاسخ طلایی` : `Copy ${summary.stage4ActNow} High-Fit Replies`)}</span>
            </button>
          )}

          <button
            onClick={exportToCsv}
            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-900 dark:text-zinc-100 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCsvBtn}</span>
          </button>

          <button
            onClick={exportToJson}
            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-600 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
            title="Download full JSON with audit logs"
          >
            <span>{t.exportJsonBtn}</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Act Now */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-950 dark:border-white shadow-sm ring-1 ring-neutral-950 dark:ring-white relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-zinc-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{t.highIntentLeads}</span>
            <Flame className="w-4 h-4 text-neutral-950 dark:text-white" />
          </div>
          <div className="text-3xl font-black text-neutral-950 dark:text-white font-mono flex items-baseline space-x-2 rtl:space-x-reverse">
            <span>{summary.stage4ActNow}</span>
            <span className="text-xs font-bold text-neutral-500 dark:text-zinc-400 font-sans">
              ({results.length > 0 ? Math.round((summary.stage4ActNow / results.length) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 dark:text-zinc-300 mt-1 font-semibold flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>{language === 'fa' ? 'پاسخ‌های آماده برای اقدام' : 'Outreach replies generated'}</span>
          </p>
        </div>

        {/* Metric 2: Watchlist */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-neutral-400 dark:text-zinc-500 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{t.watchNurture}</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 dark:text-white font-mono">
            {summary.stage3WeakWatch}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-zinc-400 mt-1">
            {language === 'fa' ? 'تناسب متوسط یا نیت اولیه' : 'Moderate fit or early intent'}
          </p>
        </div>

        {/* Metric 3: Filtered Noise */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-neutral-400 dark:text-zinc-500 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{t.noisePruned}</span>
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 dark:text-white font-mono">
            {summary.stage1FilteredOut + summary.stage2FilteredOut}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-zinc-400 mt-1">
            {language === 'fa' ? 'حذف‌شده در مراحل ۱ و ۲' : 'Dropped at cheap Stage 1 & 2'}
          </p>
        </div>

        {/* Metric 4: Cost Savings */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-neutral-400 dark:text-zinc-500 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{t.costSavedMetric}</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 dark:text-white font-mono">
            {summary.savingsPercentage}%
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-zinc-400 mt-1 font-mono">
            {language === 'fa' ? `کل هزینه: $${summary.totalCostUsd.toFixed(5)}` : `Spent $${summary.totalCostUsd.toFixed(5)} total`}
          </p>
        </div>
      </div>

      {/* CASCADE FUNNEL FALLOUT DIAGRAM */}
      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 transition-colors">
        <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-neutral-600 dark:text-zinc-300">
          <span>{language === 'fa' ? 'قیف کارایی آبشار ۴ مرحله‌ای ایجنت رادار' : '4-STAGE AGENT CASCADE EFFICIENCY FUNNEL'}</span>
          <span className="text-[11px] text-neutral-400 dark:text-zinc-500">
            {language === 'fa' ? 'مجموع توکن‌ها:' : 'Total Tokens:'} {summary.totalTokens.toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800">
            <div className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono uppercase">{language === 'fa' ? 'مرحله ۱: غربالگری' : 'Stage 1 Filter'}</div>
            <div className="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5">{results.length} {language === 'fa' ? 'ورودی' : 'Ingested'}</div>
            <div className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-0.5">{summary.stage1FilteredOut} {language === 'fa' ? 'هرزنامه حذف شد' : 'Noise Dropped'}</div>
          </div>
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800">
            <div className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono uppercase">{language === 'fa' ? 'مرحله ۲: سنجش نیت' : 'Stage 2 Intent'}</div>
            <div className="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5">{results.length - summary.stage1FilteredOut} {language === 'fa' ? 'عبور کرد' : 'Passed'}</div>
            <div className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-0.5">{summary.stage2FilteredOut} {language === 'fa' ? 'چت معمولی' : 'Trivia/Casual'}</div>
          </div>
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800">
            <div className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono uppercase">{language === 'fa' ? 'مرحله ۳: امتیاز تطابق' : 'Stage 3 Fit'}</div>
            <div className="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5">{summary.stage3WeakWatch + summary.stage4ActNow} {language === 'fa' ? 'امتیازدهی شد' : 'Scored'}</div>
            <div className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-0.5">{summary.stage3WeakWatch} {language === 'fa' ? 'پیگیری و رصد' : 'Nurture / Watch'}</div>
          </div>
          <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-xs">
            <div className="text-[10px] text-neutral-300 dark:text-neutral-700 font-mono uppercase">{language === 'fa' ? 'مرحله ۴: تولید پاسخ' : 'Stage 4 Reply'}</div>
            <div className="font-extrabold text-sm mt-0.5">{summary.stage4ActNow} {language === 'fa' ? 'اقدام فوری' : 'Act Now'}</div>
            <div className="text-[10px] text-emerald-400 dark:text-emerald-700 font-bold mt-0.5">{language === 'fa' ? 'پاسخ ارزش‌محور' : 'Value-First Tailored'}</div>
          </div>
        </div>
      </div>

      {/* FILTER, SEARCH, AND VIEW MODE TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs transition-colors">
        
        {/* Decision Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDecision('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'ALL'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'همه' : 'All'} ({results.length})
          </button>

          <button
            onClick={() => setFilterDecision('ACT_NOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'ACT_NOW'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'اقدام فوری' : 'Act Now'} ({summary.stage4ActNow})
          </button>

          <button
            onClick={() => setFilterDecision('WATCH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'WATCH'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'زیر نظر' : 'Watch'} ({summary.stage3WeakWatch})
          </button>

          <button
            onClick={() => setFilterDecision('IGNORE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'IGNORE'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'هرزنامه' : 'Noise'} ({summary.stage1FilteredOut + summary.stage2FilteredOut})
          </button>
        </div>

        {/* View Mode & Search */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="relative min-w-[200px]">
            <Search className={`w-3.5 h-3.5 absolute ${isRtl ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fa' ? 'جستجو در سرنخ‌ها...' : 'Search leads...'}
              className={`w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-700 rounded-xl py-1.5 ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 dark:placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white font-sans`}
            />
          </div>

          <div className="flex items-center bg-neutral-100 dark:bg-zinc-800 rounded-xl p-0.5 border border-neutral-200 dark:border-zinc-700">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs' : 'text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title={language === 'fa' ? 'نمای کارت‌ها' : 'Card View'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs' : 'text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title={language === 'fa' ? 'نمای کانبان خط‌لوله' : 'Kanban Pipeline View'}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-xs' : 'text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title={language === 'fa' ? 'نمای جدول' : 'Table View'}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="space-y-5">
          {filteredResults.map((item) => {
            const isActNow = item.decision === 'ACT_NOW';
            const isWatch = item.decision === 'WATCH';
            const isDiscarded = item.decision === 'IGNORE';
            const isAuditOpen = expandedAuditId === item.messageId;

            return (
              <div
                key={item.messageId}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isActNow
                    ? 'bg-white dark:bg-zinc-900 border-neutral-950 dark:border-white shadow-md ring-1 ring-neutral-950 dark:ring-white'
                    : isWatch
                    ? 'bg-white dark:bg-zinc-900 border-neutral-300 dark:border-zinc-700 shadow-xs'
                    : 'bg-neutral-50/70 dark:bg-zinc-950/40 border-neutral-200 dark:border-zinc-800 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Card Top Row */}
                <div className="p-6 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-xs">
                      <span className="font-extrabold text-neutral-950 dark:text-white text-sm">@{item.message.author}</span>
                      <span className="text-neutral-300 dark:text-zinc-700">•</span>
                      <span className="px-2 py-0.5 rounded-md border border-neutral-200 dark:border-zinc-700 bg-neutral-100 dark:bg-zinc-800 text-neutral-800 dark:text-zinc-200 font-sans text-[11px] font-bold">
                        {item.message.platform}
                      </span>
                      <span className="text-neutral-300 dark:text-zinc-700">•</span>
                      <span className="text-neutral-500 dark:text-zinc-400 font-sans text-xs truncate max-w-[240px]">
                        {item.message.sourceCommunity}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse self-start sm:self-auto">
                      {/* Score Indicator */}
                      <div className="px-3 py-1 rounded-xl border border-neutral-300 dark:border-zinc-700 font-mono text-xs font-bold text-neutral-900 dark:text-zinc-100 bg-neutral-50 dark:bg-zinc-800 flex items-center space-x-1.5 rtl:space-x-reverse">
                        <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-sans uppercase">{language === 'fa' ? 'امتیاز' : 'Score'}</span>
                        <span className="text-sm font-extrabold text-neutral-950 dark:text-white">{item.totalOpportunityScore}</span>
                        <span className="text-[10px] text-neutral-400 dark:text-zinc-500">/100</span>
                      </div>

                      {/* Decision Badge */}
                      <div
                        className={`px-3.5 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                          isActNow
                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                            : isWatch
                            ? 'border border-neutral-400 dark:border-zinc-600 text-neutral-800 dark:text-zinc-200 bg-neutral-100 dark:bg-zinc-800'
                            : 'border border-neutral-200 dark:border-zinc-700 text-neutral-400 dark:text-zinc-500 bg-neutral-100 dark:bg-zinc-900'
                        }`}
                      >
                        {isActNow ? (language === 'fa' ? '🔥 اقدام فوری' : '🔥 Act Now') : isWatch ? (language === 'fa' ? 'زیر نظر' : 'Watch') : (language === 'fa' ? 'هرزنامه' : 'Noise')}
                      </div>

                      {/* Micro-Cent Cost Badge */}
                      <div className="text-[10px] font-mono text-neutral-400 dark:text-zinc-500 px-2 py-1 rounded-md border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800">
                        ${item.totalCostUsd.toFixed(5)}
                      </div>
                    </div>
                  </div>

                  {/* Original Prospect Message */}
                  <div className="p-4 rounded-2xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/80 dark:bg-zinc-950/60 mb-4 text-left rtl:text-right">
                    <p className="text-xs sm:text-sm text-neutral-900 dark:text-zinc-100 leading-relaxed font-sans font-medium">
                      "{item.message.text}"
                    </p>
                    {item.message.threadContext && (
                      <p className="text-[11px] text-neutral-400 dark:text-zinc-500 mt-2 italic border-t border-neutral-200/80 dark:border-zinc-800 pt-2 font-sans">
                        {language === 'fa' ? 'زمینه گفتگو:' : 'Context:'} {item.message.threadContext}
                      </p>
                    )}
                  </div>

                  {/* Extracted Semantic Context Tags (if reached Stage 2) */}
                  {item.stage2 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                      {item.stage2.detectedProblem && (
                        <div className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-neutral-800 dark:text-zinc-200">
                          <strong className="text-neutral-500 dark:text-zinc-400 text-[10px] uppercase font-mono block">
                            {language === 'fa' ? 'نقطه درد شناسایی‌شده:' : 'Detected Pain Point:'}
                          </strong>
                          <span>{item.stage2.detectedProblem}</span>
                        </div>
                      )}

                      <div className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-neutral-800 dark:text-zinc-200">
                        <strong className="text-neutral-500 dark:text-zinc-400 text-[10px] uppercase font-mono block">
                          {language === 'fa' ? 'فوریت:' : 'Urgency:'}
                        </strong>
                        <span className={`font-bold ${item.stage2.urgency === 'HIGH' ? 'text-black dark:text-white' : 'text-neutral-700 dark:text-zinc-300'}`}>
                          {item.stage2.urgency}
                        </span>
                      </div>

                      {item.stage2.userSkillOrStatus && (
                        <div className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-neutral-800 dark:text-zinc-200">
                          <strong className="text-neutral-500 dark:text-zinc-400 text-[10px] uppercase font-mono block">
                            {language === 'fa' ? 'سطح کاربر:' : 'Prospect Level:'}
                          </strong>
                          <span>{item.stage2.userSkillOrStatus}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STAGE 4: VALUE-FIRST TAILORED OUTREACH REPLY */}
                  {item.stage4?.suggestedReply && (
                    <div className="p-5 rounded-2xl border border-neutral-950 dark:border-white bg-neutral-950 dark:bg-zinc-950 text-white space-y-3 mt-4 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Sparkles className="w-4 h-4 text-white" />
                          <span className="font-extrabold uppercase font-mono tracking-wider text-[11px]">
                            {language === 'fa' ? 'پیش‌نویس پاسخ تعاملی ارزش‌محور (آماده ارسال)' : 'Authentic Value-First Outreach Draft'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {/* Mark as Contacted Status */}
                          <button
                            onClick={() => onToggleReplyUsed(item.messageId)}
                            className={`flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              item.replyUsed
                                ? 'bg-emerald-500 text-white'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{item.replyUsed ? t.sentBtn : t.markSentBtn}</span>
                          </button>

                          {/* Copy Reply Button */}
                          <button
                            onClick={() => handleCopyReply(item.messageId, item.stage4?.suggestedReply || '')}
                            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 bg-white dark:bg-zinc-100 hover:bg-neutral-200 text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            {copiedId === item.messageId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{t.copiedBtn}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{t.copyReplyBtn}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Reply Text Quote */}
                      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs sm:text-sm leading-relaxed font-sans text-left rtl:text-right">
                        {item.stage4.suggestedReply}
                      </div>

                      {/* Anti-Spam Strategy Reason */}
                      {item.stage4.replyStrategy && (
                        <div className="text-[11px] text-neutral-400 flex items-center space-x-1.5 rtl:space-x-reverse font-mono">
                          <span className="text-white font-bold">{t.whyItWorks}:</span>
                          <span>{item.stage4.replyStrategy}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Discard Reason (if filtered early) */}
                  {isDiscarded && item.stage1?.discardReason && (
                    <div className="p-3 bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl text-xs text-neutral-600 dark:text-zinc-300 flex items-center space-x-2 rtl:space-x-reverse mt-2">
                      <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span><strong>{language === 'fa' ? 'علت حذف:' : 'Pruning Reason:'}</strong> {item.stage1.discardReason}</span>
                    </div>
                  )}
                </div>

                {/* Audit Drawer Toggle */}
                <div className="border-t border-neutral-100 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-950/40 px-6 py-2.5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setExpandedAuditId(isAuditOpen ? null : item.messageId)}
                    className="inline-flex items-center space-x-1 rtl:space-x-reverse text-neutral-500 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white font-bold transition-colors cursor-pointer"
                  >
                    <span>{isAuditOpen ? (language === 'fa' ? 'بستن تله‌متری خط‌لوله' : 'Hide Multi-Stage Telemetry') : (language === 'fa' ? 'مشاهده تله‌متری خط‌لوله' : 'Inspect Multi-Stage Telemetry')}</span>
                    {isAuditOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <span className="font-mono text-[11px] text-neutral-400 dark:text-zinc-500">
                    {language === 'fa' ? 'توکن‌ها:' : 'Tokens:'} {item.totalTokensUsed} (${item.totalCostUsd.toFixed(6)})
                  </span>
                </div>

                {/* Expanded Audit Details */}
                {isAuditOpen && (
                  <div className="border-t border-neutral-200 dark:border-zinc-800 p-6 bg-neutral-50 dark:bg-zinc-950 space-y-4 text-xs font-mono animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl">
                        <span className="font-bold text-neutral-950 dark:text-white block mb-1">{language === 'fa' ? 'مرحله ۱: فیلتر ارزان' : 'Stage 1: Cheap Filter'}</span>
                        <div>{language === 'fa' ? 'وضعیت:' : 'Passed:'} {item.stage1?.passed ? (language === 'fa' ? 'پذیرفته شد' : 'YES') : (language === 'fa' ? 'رد شد' : 'NO')}</div>
                        <div>{language === 'fa' ? 'امتیاز:' : 'Score:'} {item.stage1?.relevanceScore}/100</div>
                        <div>{language === 'fa' ? 'هزینه:' : 'Cost:'} ${item.stage1?.costUsd.toFixed(6)}</div>
                      </div>

                      <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl">
                        <span className="font-bold text-neutral-950 dark:text-white block mb-1">{language === 'fa' ? 'مرحله ۲: درک نیت' : 'Stage 2: Intent Understanding'}</span>
                        <div>{language === 'fa' ? 'نیت:' : 'Intent:'} {item.stage2?.intentType || 'N/A'}</div>
                        <div>
                          {language === 'fa' ? 'فوریت:' : 'Urgency:'}{' '}
                          {item.stage2?.urgency === 'HIGH' ? (language === 'fa' ? 'بالا (فوری)' : 'HIGH') : item.stage2?.urgency === 'MEDIUM' ? (language === 'fa' ? 'متوسط' : 'MEDIUM') : (item.stage2?.urgency || 'N/A')}
                        </div>
                        <div>{language === 'fa' ? 'هزینه:' : 'Cost:'} ${item.stage2?.costUsd.toFixed(6) || 0}</div>
                      </div>

                      <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl">
                        <span className="font-bold text-neutral-950 dark:text-white block mb-1">{language === 'fa' ? 'مرحله ۳: تناسب محصول' : 'Stage 3: Profile Fit'}</span>
                        <div>
                          {language === 'fa' ? 'سطح تطابق:' : 'Fit Level:'}{' '}
                          {item.stage3?.fitLevel === 'STRONG_FIT' ? (language === 'fa' ? 'تطابق قوی' : 'STRONG_FIT') : item.stage3?.fitLevel === 'WEAK_FIT' ? (language === 'fa' ? 'تطابق ضعیف' : 'WEAK_FIT') : (item.stage3?.fitLevel || 'N/A')}
                        </div>
                        <div>{language === 'fa' ? 'امتیاز:' : 'Score:'} {item.stage3?.opportunityScore || 0}/100</div>
                        <div>{language === 'fa' ? 'هزینه:' : 'Cost:'} ${item.stage3?.costUsd.toFixed(6) || 0}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Act Now */}
          <div className="bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-zinc-800">
              <span className="text-xs font-extrabold uppercase font-mono text-neutral-950 dark:text-white flex items-center space-x-1.5 rtl:space-x-reverse">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{language === 'fa' ? 'اقدام فوری' : 'Act Now'} ({results.filter((r) => r.decision === 'ACT_NOW').length})</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black">{language === 'fa' ? 'تعامل' : 'Outreach'}</span>
            </div>
            <div className="space-y-3">
              {results
                .filter((r) => r.decision === 'ACT_NOW')
                .map((item) => (
                  <div key={item.messageId} className="p-4 bg-white dark:bg-zinc-900 border border-neutral-950 dark:border-white rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-neutral-950 dark:text-white">@{item.message.author}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-zinc-800 font-bold">{item.totalOpportunityScore}/100</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-zinc-300 line-clamp-3 font-sans">{item.message.text}</p>
                    {item.stage4?.suggestedReply && (
                      <button
                        onClick={() => handleCopyReply(item.messageId, item.stage4?.suggestedReply || '')}
                        className="w-full py-1.5 bg-black dark:bg-white hover:opacity-90 text-white dark:text-black text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1 rtl:space-x-reverse"
                      >
                        {copiedId === item.messageId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === item.messageId ? t.copiedBtn : t.copyReplyBtn}</span>
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: Watchlist */}
          <div className="bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-zinc-800">
              <span className="text-xs font-extrabold uppercase font-mono text-neutral-700 dark:text-zinc-300 flex items-center space-x-1.5 rtl:space-x-reverse">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{language === 'fa' ? 'فهرست پیگیری' : 'Watchlist'} ({results.filter((r) => r.decision === 'WATCH').length})</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300">{language === 'fa' ? 'رصد' : 'Nurture'}</span>
            </div>
            <div className="space-y-3">
              {results
                .filter((r) => r.decision === 'WATCH')
                .map((item) => (
                  <div key={item.messageId} className="p-4 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-neutral-950 dark:text-white">@{item.message.author}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-zinc-800 font-bold">{item.totalOpportunityScore}/100</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-zinc-300 line-clamp-3 font-sans">{item.message.text}</p>
                    {item.stage2?.detectedProblem && (
                      <p className="text-[11px] text-neutral-500 dark:text-zinc-400 font-mono">{language === 'fa' ? 'نقطه درد:' : 'Problem:'} {item.stage2.detectedProblem}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Column 3: Discarded Noise */}
          <div className="bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-zinc-800">
              <span className="text-xs font-extrabold uppercase font-mono text-neutral-500 dark:text-zinc-400 flex items-center space-x-1.5 rtl:space-x-reverse">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <span>{language === 'fa' ? 'هرزنامه‌های حذف‌شده' : 'Pruned Noise'} ({results.filter((r) => r.decision === 'IGNORE').length})</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400">{language === 'fa' ? 'حذف‌شده' : 'Pruned'}</span>
            </div>
            <div className="space-y-3">
              {results
                .filter((r) => r.decision === 'IGNORE')
                .map((item) => (
                  <div key={item.messageId} className="p-3.5 bg-white/70 dark:bg-zinc-900/50 border border-neutral-200 dark:border-zinc-800 rounded-xl space-y-1.5 opacity-70">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-neutral-600 dark:text-zinc-300">@{item.message.author}</span>
                      <span className="text-[10px] text-neutral-400 dark:text-zinc-500">{item.message.platform}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-zinc-400 line-clamp-2 font-sans">{item.message.text}</p>
                    <div className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono">
                      {item.stage1?.discardReason || (language === 'fa' ? 'عدم ارتباط با محصول' : 'Low relevance')}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: DENSE TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="border border-neutral-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 dark:bg-zinc-950 border-b border-neutral-200 dark:border-zinc-800 text-[11px] font-mono text-neutral-500 dark:text-zinc-400 uppercase">
                  <th className="p-3.5 pl-4 rtl:pr-4 font-bold">{language === 'fa' ? 'فرستنده' : 'Author'}</th>
                  <th className="p-3.5 font-bold">{language === 'fa' ? 'پلتفرم' : 'Platform'}</th>
                  <th className="p-3.5 font-bold">{language === 'fa' ? 'متن پیام' : 'Message Content'}</th>
                  <th className="p-3.5 font-bold">{language === 'fa' ? 'امتیاز' : 'Score'}</th>
                  <th className="p-3.5 font-bold">{language === 'fa' ? 'تصمیم' : 'Decision'}</th>
                  <th className="p-3.5 font-bold">{language === 'fa' ? 'فوریت' : 'Urgency'}</th>
                  <th className="p-3.5 pr-4 rtl:pl-4 font-bold text-right rtl:text-left">{language === 'fa' ? 'عملیات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                {filteredResults.map((item) => (
                  <tr key={item.messageId} className="hover:bg-neutral-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5 pl-4 rtl:pr-4 font-mono font-bold text-neutral-950 dark:text-white whitespace-nowrap">
                      @{item.message.author}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded border border-neutral-200 dark:border-zinc-700 bg-neutral-100 dark:bg-zinc-800 text-[10px] font-bold text-neutral-800 dark:text-zinc-200">
                        {item.message.platform}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-md truncate text-neutral-800 dark:text-zinc-200">
                      {item.message.text}
                    </td>
                    <td className="p-3.5 font-mono font-bold whitespace-nowrap text-neutral-900 dark:text-white">
                      {item.totalOpportunityScore}/100
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          item.decision === 'ACT_NOW'
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : item.decision === 'WATCH'
                            ? 'border border-neutral-300 dark:border-zinc-600 text-neutral-800 dark:text-zinc-200'
                            : 'text-neutral-400 dark:text-zinc-500'
                        }`}
                      >
                        {item.decision === 'ACT_NOW'
                          ? (language === 'fa' ? 'اقدام فوری' : 'ACT NOW')
                          : item.decision === 'WATCH'
                          ? (language === 'fa' ? 'زیر نظر' : 'WATCH')
                          : (language === 'fa' ? 'هرزنامه' : 'NOISE')}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-neutral-600 dark:text-zinc-400 whitespace-nowrap">
                      {item.stage2?.urgency === 'HIGH'
                        ? (language === 'fa' ? 'فوری' : 'HIGH')
                        : item.stage2?.urgency === 'MEDIUM'
                        ? (language === 'fa' ? 'متوسط' : 'MEDIUM')
                        : (item.stage2?.urgency || '—')}
                    </td>
                    <td className="p-3.5 pr-4 rtl:pl-4 text-right rtl:text-left whitespace-nowrap">
                      {item.stage4?.suggestedReply ? (
                        <button
                          onClick={() => handleCopyReply(item.messageId, item.stage4?.suggestedReply || '')}
                          className="px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black font-bold text-[11px] rounded-lg hover:opacity-90 cursor-pointer inline-flex items-center space-x-1 rtl:space-x-reverse"
                        >
                          {copiedId === item.messageId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === item.messageId ? t.copiedBtn : t.copyReplyBtn}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 dark:text-zinc-600 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
