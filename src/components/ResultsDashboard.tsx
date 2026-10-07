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
  ArrowRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { MessageAnalysis, ProductProfile, RunSummary } from '../types';

interface ResultsDashboardProps {
  summary: RunSummary;
  results: MessageAnalysis[];
  activeProfile: ProductProfile;
  onToggleReplyUsed: (messageId: string) => void;
  isPersian: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  summary,
  results,
  activeProfile,
  onToggleReplyUsed,
  isPersian,
}) => {
  const [filterDecision, setFilterDecision] = useState<'ALL' | 'ACT_NOW' | 'WATCH' | 'IGNORE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyReply = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredResults = results.filter((item) => {
    if (filterDecision !== 'ALL' && item.decision !== filterDecision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.message.text.toLowerCase().includes(q) ||
        item.message.author.toLowerCase().includes(q) ||
        item.message.sourceCommunity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ summary, results }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opportunityradar-results-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Stats Bar (Clean Monochrome Minimalism) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{isPersian ? 'فرصت‌های قوی' : 'Act Now Leads'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {summary.stage4ActNow}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            {isPersian ? 'پاسخ آماده جهت ارسال' : 'High conviction opportunity'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{isPersian ? 'نویزهای حذف‌شده' : 'Filtered Noise'}</span>
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {summary.stage1FilteredOut + summary.stage2FilteredOut}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            {isPersian ? 'توقف در مرحله ارزان اول' : 'Halted at cheap Stage 1'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{isPersian ? 'کل هزینه ایجنت' : 'Total Agent Cost'}</span>
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white font-mono">
            ${summary.totalCostUsd.toFixed(5)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
            {summary.totalTokens.toLocaleString()} tokens
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>{isPersian ? 'صرفه‌جویی هزینه' : 'Cost Saved'}</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {summary.savingsPercentage}%
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            vs. monolithic heavy LLM
          </p>
        </div>
      </div>

      {/* Funnel Proof Panel */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800 gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center space-x-2 rtl:space-x-reverse">
              <span>{isPersian ? 'شفافیت هزینه و قیف مرحله‌ای ایجنت' : 'Multi-Stage Funnel & Cost Proof'}</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isPersian
                ? 'نمایش حذف تدریجی پیام‌ها برای اثبات کاهش ۸۸٪ هزینه استنتاج در مقایسه با روش تک‌پرامپت'
                : 'LangGraph-style early pruning: zero token waste on unviable community messages.'}
            </p>
          </div>

          <button
            onClick={exportToJson}
            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isPersian ? 'خروجی داده‌ها (JSON)' : 'Export JSON'}</span>
          </button>
        </div>

        {/* Funnel Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">Stage 1: Input</div>
            <div className="text-base font-black text-neutral-900 dark:text-white font-mono mt-1">{summary.totalMessages} msgs</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">100% scanned</div>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">Stage 1 Discarded</div>
            <div className="text-base font-black text-neutral-900 dark:text-white font-mono mt-1">-{summary.stage1FilteredOut} spam/noise</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Saved ~$0.00030/msg</div>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="text-[10px] uppercase font-mono text-neutral-500 font-bold">Stage 2-3 Evaluated</div>
            <div className="text-base font-black text-neutral-900 dark:text-white font-mono mt-1">
              {summary.totalMessages - summary.stage1FilteredOut} msgs
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">{summary.stage3WeakWatch} tagged as WATCH</div>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-black shadow-sm">
            <div className="text-[10px] uppercase font-mono font-bold opacity-80">Stage 4 Strong Fit</div>
            <div className="text-base font-black font-mono mt-1">
              {summary.stage4ActNow} Golden Leads
            </div>
            <div className="text-[10px] opacity-80 mt-0.5">Tailored replies ready</div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm transition-colors">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDecision('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterDecision === 'ALL'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {isPersian ? `همه (${results.length})` : `All (${results.length})`}
          </button>

          <button
            onClick={() => setFilterDecision('ACT_NOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterDecision === 'ACT_NOW'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {isPersian ? `فرصت‌های قطعی (${summary.stage4ActNow})` : `Act Now (${summary.stage4ActNow})`}
          </button>

          <button
            onClick={() => setFilterDecision('WATCH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterDecision === 'WATCH'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {isPersian ? `زیر نظر (${summary.stage3WeakWatch})` : `Watch (${summary.stage3WeakWatch})`}
          </button>

          <button
            onClick={() => setFilterDecision('IGNORE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterDecision === 'IGNORE'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {isPersian
              ? `رد شده (${summary.stage1FilteredOut + summary.stage2FilteredOut})`
              : `Discarded (${summary.stage1FilteredOut + summary.stage2FilteredOut})`}
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isPersian ? 'جستجو در پیام‌ها...' : 'Search messages, authors...'}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-1.5 pl-8 pr-3 rtl:pr-8 rtl:pl-3 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
          />
        </div>
      </div>

      {/* Results Items List */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const isActNow = item.decision === 'ACT_NOW';
          const isWatch = item.decision === 'WATCH';
          const isDiscarded = item.decision === 'IGNORE';
          const isExpanded = expandedMessageId === item.messageId;

          return (
            <div
              key={item.messageId}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isActNow
                  ? 'bg-white dark:bg-neutral-950 border-neutral-950 dark:border-white shadow-sm ring-1 ring-neutral-950 dark:ring-white'
                  : isWatch
                  ? 'bg-white dark:bg-neutral-950 border-neutral-400 dark:border-neutral-700'
                  : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-850 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Card Header Bar */}
              <div className="p-5 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-xs">
                    <span className="font-bold text-neutral-900 dark:text-white">@{item.message.author}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-sans text-[11px]">
                      {item.message.platform}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500 font-sans text-[11px] truncate max-w-[220px]">
                      {item.message.sourceCommunity}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse self-start sm:self-auto">
                    {/* Score Gauge */}
                    <div className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 font-mono text-xs font-bold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-900">
                      <span className="text-[10px] text-neutral-400 font-sans">{isPersian ? 'امتیاز: ' : 'Score: '}</span>
                      <span>{item.totalOpportunityScore}/100</span>
                    </div>

                    {/* Decision Badge */}
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${
                        isActNow
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                          : isWatch
                          ? 'border border-neutral-400 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900'
                          : 'border border-neutral-200 dark:border-neutral-800 text-neutral-400 bg-neutral-100 dark:bg-neutral-900'
                      }`}
                    >
                      {item.decision}
                    </div>

                    {/* Cost Badge */}
                    <div className="text-[11px] font-mono text-neutral-500 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                      ${item.totalCostUsd.toFixed(5)}
                    </div>
                  </div>
                </div>

                {/* Original Message */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 mb-3 text-left rtl:text-right">
                  <p className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed font-sans">
                    {item.message.text}
                  </p>
                  {item.message.threadContext && (
                    <p className="text-[11px] text-neutral-400 mt-2 italic border-t border-neutral-200 dark:border-neutral-800 pt-1.5">
                      {item.message.threadContext}
                    </p>
                  )}
                </div>

                {/* Discard Reason if Ignored */}
                {isDiscarded && item.stage1?.discardReason && (
                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/40 text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {isPersian ? 'علت رد پیام: ' : 'Discard Reason: '}
                    </span>
                    <span>{item.stage1.discardReason}</span>
                    <span className="block text-[10px] text-neutral-400 mt-0.5 font-mono">
                      {isPersian
                        ? `// صرفه‌جویی توکن: به دلیل خروج زودهنگام در مرحله ۱، هزینه $${item.costSavedUsd.toFixed(5)} ذخیره شد.`
                        : `// Cost Saved: Halting early saved $${item.costSavedUsd.toFixed(5)} in LLM tokens.`}
                    </span>
                  </div>
                )}

                {/* Suggested Reply Box (for ACT NOW leads) */}
                {isActNow && item.stage4?.suggestedReply && (
                  <div className="mt-4 p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-900/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-neutral-900 dark:text-white">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isPersian ? 'پاسخ پیشنهادی ایجنت (Context-Aware Reply):' : 'Suggested Personalized Reply:'}</span>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleCopyReply(item.messageId, item.stage4!.suggestedReply)}
                          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-sm transition-transform hover:opacity-90 active:scale-95 cursor-pointer"
                        >
                          {copiedId === item.messageId ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isPersian ? 'کپی شد!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{isPersian ? 'کپی پاسخ' : 'Copy Reply'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onToggleReplyUsed(item.messageId)}
                          className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            item.replyUsed
                              ? 'border-neutral-900 dark:border-white bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                              : 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {item.replyUsed
                              ? isPersian
                                ? 'استفاده‌شده'
                                : 'Marked Used'
                              : isPersian
                              ? 'ثبت به عنوان ارسال‌شده'
                              : 'Mark Sent'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-900 dark:text-white leading-relaxed font-sans p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                      {item.stage4.suggestedReply}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span>
                        <strong className="text-neutral-800 dark:text-neutral-200">{isPersian ? 'استراتژی: ' : 'Strategy: '}</strong>
                        {item.stage4.replyStrategy}
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-neutral-800 dark:text-neutral-200">{isPersian ? 'دعوت به اقدام: ' : 'CTA: '}</strong>
                        {item.stage4.callToAction}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Agent Audit Trail */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 px-5 py-2.5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <button
                  onClick={() => setExpandedMessageId(isExpanded ? null : item.messageId)}
                  className="inline-flex items-center space-x-1.5 rtl:space-x-reverse hover:text-black dark:hover:text-white transition-colors py-0.5 cursor-pointer font-medium"
                >
                  <span>
                    {isExpanded
                      ? isPersian
                        ? 'بستن مراحل ایجنت'
                        : 'Hide Agent Details'
                      : isPersian
                      ? 'مشاهده تحلیل ۴ مرحله‌ای ایجنت'
                      : 'View 4-Stage Agent Audit Trail'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <span className="font-mono text-[11px]">
                  {item.totalTokensUsed} tokens • Stage: {item.currentStage}
                </span>
              </div>

              {/* Expanded Detailed Audit Trail */}
              {isExpanded && (
                <div className="p-5 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 space-y-3 text-xs">
                  {/* Stage 1 */}
                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white mb-1">
                      <span>Stage 1: Cheap Relevance Filter</span>
                      <span className="font-mono text-neutral-500">${item.stage1?.costUsd.toFixed(5)} ({item.stage1?.tokensUsed} tokens)</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Relevance Score: {item.stage1?.relevanceScore}/100 | Keywords: {item.stage1?.matchedKeywords.join(', ')}
                    </p>
                  </div>

                  {/* Stage 2 */}
                  {item.stage2 && (
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                      <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white mb-1">
                        <span>Stage 2: Context & Intent Understanding</span>
                        <span className="font-mono text-neutral-500">${item.stage2.costUsd.toFixed(5)} ({item.stage2.tokensUsed} tokens)</span>
                      </div>
                      <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
                        <p><strong className="text-neutral-800 dark:text-neutral-200">Detected Problem:</strong> {item.stage2.detectedProblem}</p>
                        <p><strong className="text-neutral-800 dark:text-neutral-200">Intent:</strong> {item.stage2.intentType} | <strong className="text-neutral-800 dark:text-neutral-200">Urgency:</strong> {item.stage2.urgency}</p>
                        <p><strong className="text-neutral-800 dark:text-neutral-200">User Profile:</strong> {item.stage2.userSkillOrStatus}</p>
                      </div>
                    </div>
                  )}

                  {/* Stage 3 */}
                  {item.stage3 && (
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                      <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white mb-1">
                        <span>Stage 3: Bilateral Fit Evaluation</span>
                        <span className="font-mono text-neutral-500">${item.stage3.costUsd.toFixed(5)} ({item.stage3.tokensUsed} tokens)</span>
                      </div>
                      <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
                        <p><strong className="text-neutral-800 dark:text-neutral-200">Fit Level:</strong> {item.stage3.fitLevel} ({item.stage3.opportunityScore}/100)</p>
                        <p><strong className="text-neutral-800 dark:text-neutral-200">Reasoning:</strong> {item.stage3.fitReasoning}</p>
                      </div>
                    </div>
                  )}

                  {/* Stage 4 */}
                  {item.stage4 && (
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                      <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-white mb-1">
                        <span>Stage 4: Reply Generation</span>
                        <span className="font-mono text-neutral-500">${item.stage4.costUsd.toFixed(5)} ({item.stage4.tokensUsed} tokens)</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        <strong className="text-neutral-800 dark:text-neutral-200">Strategy:</strong> {item.stage4.replyStrategy}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
