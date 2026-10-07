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
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { MessageAnalysis, ProductProfile, RunSummary } from '../types';

interface ResultsDashboardProps {
  summary: RunSummary;
  results: MessageAnalysis[];
  activeProfile: ProductProfile;
  onToggleReplyUsed: (messageId: string) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  summary,
  results,
  activeProfile,
  onToggleReplyUsed,
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
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            STEP 3 // ANALYSIS & CONVERSION RESULTS
          </div>
          <h2 className="text-xl font-extrabold text-neutral-950 mt-1">
            Detected Opportunities & Suggested Actions
          </h2>
        </div>

        <button
          onClick={exportToJson}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Results (JSON)</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>Act Now Leads</span>
            <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono">
            {summary.stage4ActNow}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            High conviction buyer leads
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>Filtered Noise</span>
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono">
            {summary.stage1FilteredOut + summary.stage2FilteredOut}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Halted at cheap Stage 1
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>Agent Cost</span>
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono">
            ${summary.totalCostUsd.toFixed(5)}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-mono">
            {summary.totalTokens.toLocaleString()} tokens
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>Cost Saved</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono">
            {summary.savingsPercentage}%
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            vs. naive single-prompt AI
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDecision('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'ALL'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
          >
            All Messages ({results.length})
          </button>

          <button
            onClick={() => setFilterDecision('ACT_NOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'ACT_NOW'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
          >
            Act Now ({summary.stage4ActNow})
          </button>

          <button
            onClick={() => setFilterDecision('WATCH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'WATCH'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
          >
            Watch ({summary.stage3WeakWatch})
          </button>

          <button
            onClick={() => setFilterDecision('IGNORE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'IGNORE'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
          >
            Discarded ({summary.stage1FilteredOut + summary.stage2FilteredOut})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords or authors..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Opportunity Cards List */}
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
                  ? 'bg-white border-neutral-950 shadow-sm ring-1 ring-neutral-950'
                  : isWatch
                  ? 'bg-white border-neutral-300'
                  : 'bg-neutral-50/70 border-neutral-200 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Card Header Bar */}
              <div className="p-5 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="font-bold text-neutral-950">@{item.message.author}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 font-sans text-[11px]">
                      {item.message.platform}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500 font-sans text-[11px] truncate max-w-[220px]">
                      {item.message.sourceCommunity}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    {/* Score Gauge */}
                    <div className="px-2.5 py-1 rounded-lg border border-neutral-300 font-mono text-xs font-bold text-neutral-900 bg-neutral-50">
                      <span className="text-[10px] text-neutral-500 font-sans">Score: </span>
                      <span>{item.totalOpportunityScore}/100</span>
                    </div>

                    {/* Decision Badge */}
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${
                        isActNow
                          ? 'bg-black text-white shadow-xs'
                          : isWatch
                          ? 'border border-neutral-400 text-neutral-800 bg-neutral-100'
                          : 'border border-neutral-200 text-neutral-400 bg-neutral-100'
                      }`}
                    >
                      {item.decision}
                    </div>

                    {/* Cost Badge */}
                    <div className="text-[11px] font-mono text-neutral-500 px-2 py-1 rounded border border-neutral-200 bg-neutral-50">
                      ${item.totalCostUsd.toFixed(5)}
                    </div>
                  </div>
                </div>

                {/* Original Message Text */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 mb-3 text-left">
                  <p className="text-xs sm:text-sm text-neutral-900 leading-relaxed font-sans">
                    {item.message.text}
                  </p>
                  {item.message.threadContext && (
                    <p className="text-[11px] text-neutral-400 mt-2 italic border-t border-neutral-200 pt-1.5 font-sans">
                      {item.message.threadContext}
                    </p>
                  )}
                </div>

                {/* Discard Reason if Ignored */}
                {isDiscarded && item.stage1?.discardReason && (
                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-100/70 text-xs text-neutral-600">
                    <span className="font-bold text-neutral-950">Discard Reason: </span>
                    <span>{item.stage1.discardReason}</span>
                    <span className="block text-[10px] text-neutral-400 mt-0.5 font-mono">
                      // Cost Saved: Halting at Stage 1 saved ${item.costSavedUsd.toFixed(5)} in downstream LLM inference tokens.
                    </span>
                  </div>
                )}

                {/* Suggested Reply Box (for ACT NOW items) */}
                {isActNow && item.stage4?.suggestedReply && (
                  <div className="mt-4 p-4 rounded-xl border border-neutral-300 bg-neutral-100/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-950">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Suggested Personalized Reply (Context-Aware):</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyReply(item.messageId, item.stage4!.suggestedReply)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold shadow-xs hover:bg-neutral-800 transition-all cursor-pointer"
                        >
                          {copiedId === item.messageId ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Reply</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onToggleReplyUsed(item.messageId)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            item.replyUsed
                              ? 'border-neutral-950 bg-neutral-200 text-neutral-950'
                              : 'border-neutral-300 text-neutral-600 hover:text-black bg-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.replyUsed ? 'Marked Sent' : 'Mark as Sent'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-950 leading-relaxed font-sans p-3.5 rounded-lg border border-neutral-200 bg-white">
                      {item.stage4.suggestedReply}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                      <span>
                        <strong className="text-neutral-800">Strategy: </strong>
                        {item.stage4.replyStrategy}
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-neutral-800">CTA: </strong>
                        {item.stage4.callToAction}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Agent Audit Trail Toggle */}
              <div className="border-t border-neutral-200 bg-neutral-50/60 px-5 py-2.5 flex items-center justify-between text-xs text-neutral-500">
                <button
                  onClick={() => setExpandedMessageId(isExpanded ? null : item.messageId)}
                  className="inline-flex items-center space-x-1.5 hover:text-neutral-950 transition-colors py-0.5 cursor-pointer font-medium"
                >
                  <span>
                    {isExpanded ? 'Hide Agent Stages' : 'View 4-Stage Agent Audit Trail'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <span className="font-mono text-[11px]">
                  {item.totalTokensUsed} tokens • Stage: {item.currentStage}
                </span>
              </div>

              {/* Expanded Detailed Audit Trail */}
              {isExpanded && (
                <div className="p-5 bg-white border-t border-neutral-200 space-y-3 text-xs">
                  {/* Stage 1 */}
                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div className="flex items-center justify-between font-bold text-neutral-950 mb-1">
                      <span>Stage 1: Cheap Relevance Filter</span>
                      <span className="font-mono text-neutral-500">${item.stage1?.costUsd.toFixed(5)} ({item.stage1?.tokensUsed} tokens)</span>
                    </div>
                    <p className="text-neutral-600">
                      Relevance Score: {item.stage1?.relevanceScore}/100 | Keywords: {item.stage1?.matchedKeywords.join(', ')}
                    </p>
                  </div>

                  {/* Stage 2 */}
                  {item.stage2 && (
                    <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                      <div className="flex items-center justify-between font-bold text-neutral-950 mb-1">
                        <span>Stage 2: Context & Intent Understanding</span>
                        <span className="font-mono text-neutral-500">${item.stage2.costUsd.toFixed(5)} ({item.stage2.tokensUsed} tokens)</span>
                      </div>
                      <div className="space-y-1 text-neutral-600">
                        <p><strong className="text-neutral-800">Detected Problem:</strong> {item.stage2.detectedProblem}</p>
                        <p><strong className="text-neutral-800">Intent:</strong> {item.stage2.intentType} | <strong className="text-neutral-800">Urgency:</strong> {item.stage2.urgency}</p>
                        <p><strong className="text-neutral-800">User Status:</strong> {item.stage2.userSkillOrStatus}</p>
                      </div>
                    </div>
                  )}

                  {/* Stage 3 */}
                  {item.stage3 && (
                    <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                      <div className="flex items-center justify-between font-bold text-neutral-950 mb-1">
                        <span>Stage 3: Bilateral Fit Evaluation</span>
                        <span className="font-mono text-neutral-500">${item.stage3.costUsd.toFixed(5)} ({item.stage3.tokensUsed} tokens)</span>
                      </div>
                      <div className="space-y-1 text-neutral-600">
                        <p><strong className="text-neutral-800">Fit Level:</strong> {item.stage3.fitLevel} ({item.stage3.opportunityScore}/100)</p>
                        <p><strong className="text-neutral-800">Reasoning:</strong> {item.stage3.fitReasoning}</p>
                      </div>
                    </div>
                  )}

                  {/* Stage 4 */}
                  {item.stage4 && (
                    <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                      <div className="flex items-center justify-between font-bold text-neutral-950 mb-1">
                        <span>Stage 4: Reply Generation</span>
                        <span className="font-mono text-neutral-500">${item.stage4.costUsd.toFixed(5)} ({item.stage4.tokensUsed} tokens)</span>
                      </div>
                      <p className="text-neutral-600">
                        <strong className="text-neutral-800">Strategy:</strong> {item.stage4.replyStrategy}
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
