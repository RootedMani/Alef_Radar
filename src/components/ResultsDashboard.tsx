import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  TrendingUp,
  DollarSign,
  Filter,
  Eye,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Send,
  Download,
  Share2,
  Search,
  ExternalLink,
  Zap,
  ChevronDown,
  ChevronUp,
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
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: High-conviction Act Now */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isPersian ? 'فرصت‌های باارزش (Act Now)' : 'Act Now Opportunities'}
            </span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {summary.stage4ActNow}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isPersian ? 'آماده پاسخ و جذب قطعی' : 'Ready for high-intent reply'}
          </p>
        </div>

        {/* Card 2: Filtered Out Noise */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isPersian ? 'نویز فیلترشده (Discarded)' : 'Discarded Noise'}
            </span>
            <Filter className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {summary.stage1FilteredOut + summary.stage2FilteredOut}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isPersian ? 'حذف شده در مرحله اول ارزان' : 'Eliminated at cheap Stage 1'}
          </p>
        </div>

        {/* Card 3: Total Cost Spent */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-purple-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isPersian ? 'هزینه واقعی اجرای ایجنت' : 'Total Agent Cost'}
            </span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            ${summary.totalCostUsd.toFixed(5)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {summary.totalTokens.toLocaleString()} tokens used
          </p>
        </div>

        {/* Card 4: Cost Saved by Filter */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-950/50 to-slate-900 border border-teal-500/30 shadow-lg">
          <div className="flex items-center justify-between text-teal-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isPersian ? 'صرفه‌جویی با معماری ایجنت' : 'Cascade Cost Saved'}
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
            {summary.savingsPercentage}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            vs. monolithic single-prompt LLM
          </p>
        </div>
      </div>

      {/* Stage Cascade Funnel Proof */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{isPersian ? 'شفافیت هزینه و قیف مرحله‌ای ایجنت (Agent Cost Funnel)' : 'Multi-Stage Cost & Funnel Breakdown'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPersian
                ? 'نمایش نحوه حذف تدریجی پیام‌ها و جلوگیری از هزینه توکن بیهوده'
                : 'Demonstrates LangGraph-style early noise pruning to save cloud inference costs'}
            </p>
          </div>

          <button
            onClick={exportToJson}
            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isPersian ? 'خروجی داده‌ها (JSON)' : 'Export JSON'}</span>
          </button>
        </div>

        {/* Funnel Progress Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Stage 1: Input Stream</div>
            <div className="text-base font-bold text-slate-200 font-mono mt-1">{summary.totalMessages} msgs</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% scanned</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="text-[10px] text-cyan-400 uppercase font-semibold">Stage 1 Discarded</div>
            <div className="text-base font-bold text-cyan-300 font-mono mt-1">-{summary.stage1FilteredOut} spam/noise</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Saved ~$0.00030/msg</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="text-[10px] text-amber-400 uppercase font-semibold">Stage 2-3 Evaluated</div>
            <div className="text-base font-bold text-amber-300 font-mono mt-1">
              {summary.totalMessages - summary.stage1FilteredOut} msgs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{summary.stage3WeakWatch} tagged as WATCH</div>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
            <div className="text-[10px] text-emerald-400 uppercase font-semibold">Stage 4 Strong Fit</div>
            <div className="text-base font-bold text-emerald-300 font-mono mt-1">
              {summary.stage4ActNow} Golden Leads
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Full personalized reply</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDecision('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterDecision === 'ALL'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isPersian ? `همه (${results.length})` : `All (${results.length})`}
          </button>

          <button
            onClick={() => setFilterDecision('ACT_NOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterDecision === 'ACT_NOW'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isPersian ? `🔥 فرصت قوی (${summary.stage4ActNow})` : `🔥 Act Now (${summary.stage4ActNow})`}
          </button>

          <button
            onClick={() => setFilterDecision('WATCH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterDecision === 'WATCH'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isPersian ? `👀 زیر نظر (${summary.stage3WeakWatch})` : `👀 Watch (${summary.stage3WeakWatch})`}
          </button>

          <button
            onClick={() => setFilterDecision('IGNORE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterDecision === 'IGNORE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isPersian
              ? `✕ نادیده‌گرفته‌شده (${summary.stage1FilteredOut + summary.stage2FilteredOut})`
              : `✕ Discarded (${summary.stage1FilteredOut + summary.stage2FilteredOut})`}
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isPersian ? 'جستجو در پیام‌ها یا نویسنده...' : 'Search messages, authors...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 rtl:pr-8 rtl:pl-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Results Cards List */}
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
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : isWatch
                  ? 'bg-slate-900/70 border-amber-500/30'
                  : 'bg-slate-950/50 border-slate-800/70 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Card Header Bar */}
              <div className="p-4 sm:p-5 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse font-mono text-xs">
                    <span className="font-bold text-slate-200">@{item.message.author}</span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-sans text-[11px]">
                      {item.message.platform}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 font-sans text-[11px] truncate max-w-[220px]">
                      {item.message.sourceCommunity}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse self-start sm:self-auto">
                    {/* Score Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border flex items-center space-x-1 rtl:space-x-reverse ${
                        item.totalOpportunityScore >= 80
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : item.totalOpportunityScore >= 45
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 font-sans">{isPersian ? 'امتیاز:' : 'Score:'}</span>
                      <span>{item.totalOpportunityScore}/100</span>
                    </div>

                    {/* Decision Badge */}
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                        isActNow
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : isWatch
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.decision}
                    </div>

                    {/* Token & Micro-Cost Badge */}
                    <div className="text-[11px] font-mono text-slate-500 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                      ${item.totalCostUsd.toFixed(5)}
                    </div>
                  </div>
                </div>

                {/* Original Message Text */}
                <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl mb-3 text-left rtl:text-right">
                  <p className="text-sm text-slate-100 leading-relaxed font-sans">{item.message.text}</p>
                  {item.message.threadContext && (
                    <p className="text-[11px] text-slate-500 mt-2 italic font-sans border-t border-slate-800/60 pt-1.5">
                      {item.message.threadContext}
                    </p>
                  )}
                </div>

                {/* Discard Reason if Ignored */}
                {isDiscarded && item.stage1?.discardReason && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start space-x-2 rtl:space-x-reverse text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{isPersian ? 'علت رد پیام: ' : 'Discard Reason: '}</span>
                      <span>{item.stage1.discardReason}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {isPersian
                          ? `صرفه‌جویی توکن: به دلیل توقف در مرحله ۱، هزینه مراحل بعدی پرداخت نشد ($${item.costSavedUsd.toFixed(5)} ذخیره شد).`
                          : `Cost Saved: Halting at Stage 1 saved $${item.costSavedUsd.toFixed(5)} of downstream LLM tokens.`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Suggested Reply Box (for ACT NOW items) */}
                {isActNow && item.stage4?.suggestedReply && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isPersian ? 'پاسخ پیشنهادی ایجنت (Context-Aware Reply):' : 'Suggested Personalized Reply:'}</span>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleCopyReply(item.messageId, item.stage4!.suggestedReply)}
                          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
                        >
                          {copiedId === item.messageId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                          className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            item.replyUsed
                              ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
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
                              : 'Mark as Sent'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                      {item.stage4.suggestedReply}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>
                        <strong className="text-slate-300">{isPersian ? 'استراتژی: ' : 'Strategy: '}</strong>
                        {item.stage4.replyStrategy}
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-slate-300">{isPersian ? 'دعوت به اقدام: ' : 'CTA: '}</strong>
                        {item.stage4.callToAction}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Multi-Stage Audit Trail */}
              <div className="border-t border-slate-800/80 bg-slate-950/40 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => setExpandedMessageId(isExpanded ? null : item.messageId)}
                  className="inline-flex items-center space-x-1 rtl:space-x-reverse hover:text-emerald-400 transition-colors py-1"
                >
                  <span>{isExpanded ? (isPersian ? 'بستن جزئیات مراحل ایجنت' : 'Hide Agent Stages') : (isPersian ? 'مشاهده تحلیل ۴ مرحله‌ای ایجنت' : 'View 4-Stage Agent Audit Trail')}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <span className="font-mono text-[11px] text-slate-500">
                  {item.totalTokensUsed} tokens • Stage: {item.currentStage}
                </span>
              </div>

              {/* Expanded Detailed Audit Trail */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800/80 space-y-3 text-xs">
                  {/* Stage 1 */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-slate-300 mb-1">
                      <span>Stage 1: Cheap Relevance Filter</span>
                      <span className="font-mono text-cyan-400">${item.stage1?.costUsd.toFixed(5)} ({item.stage1?.tokensUsed} tokens)</span>
                    </div>
                    <p className="text-slate-400">
                      Relevance Score: {item.stage1?.relevanceScore}/100 | Keywords: {item.stage1?.matchedKeywords.join(', ')}
                    </p>
                  </div>

                  {/* Stage 2 */}
                  {item.stage2 && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center justify-between font-bold text-slate-300 mb-1">
                        <span>Stage 2: Context & Intent Understanding</span>
                        <span className="font-mono text-purple-400">${item.stage2.costUsd.toFixed(5)} ({item.stage2.tokensUsed} tokens)</span>
                      </div>
                      <div className="space-y-1 text-slate-400">
                        <p><strong className="text-slate-300">Detected Problem:</strong> {item.stage2.detectedProblem}</p>
                        <p><strong className="text-slate-300">Intent:</strong> {item.stage2.intentType} | <strong className="text-slate-300">Urgency:</strong> {item.stage2.urgency}</p>
                        <p><strong className="text-slate-300">Status/Profile:</strong> {item.stage2.userSkillOrStatus}</p>
                      </div>
                    </div>
                  )}

                  {/* Stage 3 */}
                  {item.stage3 && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center justify-between font-bold text-slate-300 mb-1">
                        <span>Stage 3: Bilateral Fit Evaluation</span>
                        <span className="font-mono text-amber-400">${item.stage3.costUsd.toFixed(5)} ({item.stage3.tokensUsed} tokens)</span>
                      </div>
                      <div className="space-y-1 text-slate-400">
                        <p><strong className="text-slate-300">Fit Level:</strong> {item.stage3.fitLevel} ({item.stage3.opportunityScore}/100)</p>
                        <p><strong className="text-slate-300">Reasoning:</strong> {item.stage3.fitReasoning}</p>
                      </div>
                    </div>
                  )}

                  {/* Stage 4 */}
                  {item.stage4 && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center justify-between font-bold text-slate-300 mb-1">
                        <span>Stage 4: Reply Generation</span>
                        <span className="font-mono text-emerald-400">${item.stage4.costUsd.toFixed(5)} ({item.stage4.tokensUsed} tokens)</span>
                      </div>
                      <p className="text-slate-400"><strong className="text-slate-300">Strategy:</strong> {item.stage4.replyStrategy}</p>
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
