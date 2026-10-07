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
  Layers,
  LayoutGrid,
  Kanban,
  Table as TableIcon,
  Send,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Flame,
  Clock,
  UserCheck
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
  const [viewMode, setViewMode] = useState<'cards' | 'kanban' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

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
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              STEP 3 // ANALYSIS RESULTS & OUTREACH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800">
              {results.length} Analyzed
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 mt-1">
            Detected Lead Opportunities & Tailored Actions
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Matched against profile: <span className="font-bold text-neutral-900">{activeProfile.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {summary.stage4ActNow > 0 && (
            <button
              onClick={handleCopyAllActNow}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'All Replies Copied!' : `Copy ${summary.stage4ActNow} High-Fit Replies`}</span>
            </button>
          )}

          <button
            onClick={exportToCsv}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportToJson}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 text-xs font-semibold transition-all cursor-pointer"
            title="Download full JSON with audit logs"
          >
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Act Now */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-950 shadow-sm ring-1 ring-neutral-950 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>High-Intent Leads</span>
            <Flame className="w-4 h-4 text-neutral-950" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono flex items-baseline space-x-2">
            <span>{summary.stage4ActNow}</span>
            <span className="text-xs font-bold text-neutral-500 font-sans">
              ({results.length > 0 ? Math.round((summary.stage4ActNow / results.length) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 mt-1 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>Outreach replies generated</span>
          </p>
        </div>

        {/* Metric 2: Watchlist */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>Watch & Nurture</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono">
            {summary.stage3WeakWatch}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Moderate fit or early intent
          </p>
        </div>

        {/* Metric 3: Filtered Noise */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>Noise Pruned</span>
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono">
            {summary.stage1FilteredOut + summary.stage2FilteredOut}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Dropped at cheap Stage 1 & 2
          </p>
        </div>

        {/* Metric 4: Cost Savings */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <span>Token Cost Saved</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-3xl font-black text-neutral-950 font-mono">
            {summary.savingsPercentage}%
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-mono">
            Spent ${summary.totalCostUsd.toFixed(5)} total
          </p>
        </div>
      </div>

      {/* CASCADE FUNNEL FALLOUT DIAGRAM */}
      <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
        <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-neutral-600">
          <span>4-STAGE AGENT CASCADE EFFICIENCY FUNNEL</span>
          <span className="text-[11px] text-neutral-400">Total Tokens: {summary.totalTokens.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 bg-white rounded-xl border border-neutral-200">
            <div className="text-[10px] text-neutral-400 font-mono uppercase">Stage 1 Filter</div>
            <div className="font-extrabold text-neutral-950 text-sm mt-0.5">{results.length} Ingested</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">{summary.stage1FilteredOut} Noise Dropped</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-neutral-200">
            <div className="text-[10px] text-neutral-400 font-mono uppercase">Stage 2 Intent</div>
            <div className="font-extrabold text-neutral-950 text-sm mt-0.5">{results.length - summary.stage1FilteredOut} Passed</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">{summary.stage2FilteredOut} Trivia/Casual</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-neutral-200">
            <div className="text-[10px] text-neutral-400 font-mono uppercase">Stage 3 Fit</div>
            <div className="font-extrabold text-neutral-950 text-sm mt-0.5">{summary.stage3WeakWatch + summary.stage4ActNow} Scored</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">{summary.stage3WeakWatch} Nurture / Watch</div>
          </div>
          <div className="p-3 bg-black text-white rounded-xl shadow-xs">
            <div className="text-[10px] text-neutral-300 font-mono uppercase">Stage 4 Reply</div>
            <div className="font-extrabold text-white text-sm mt-0.5">{summary.stage4ActNow} Act Now</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Value-First Tailored</div>
          </div>
        </div>
      </div>

      {/* FILTER, SEARCH, AND VIEW MODE TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
        
        {/* Decision Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDecision('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterDecision === 'ALL'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
          >
            All ({results.length})
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
            Noise ({summary.stage1FilteredOut + summary.stage2FilteredOut})
          </button>
        </div>

        {/* View Mode & Search */}
        <div className="flex items-center space-x-2">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black font-sans"
            />
          </div>

          <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 border border-neutral-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-black shadow-xs' : 'text-neutral-500 hover:text-black'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-black shadow-xs' : 'text-neutral-500 hover:text-black'
              }`}
              title="Kanban Pipeline View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-black shadow-xs' : 'text-neutral-500 hover:text-black'
              }`}
              title="Table View"
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
                    ? 'bg-white border-neutral-950 shadow-md ring-1 ring-neutral-950'
                    : isWatch
                    ? 'bg-white border-neutral-300 shadow-xs'
                    : 'bg-neutral-50/70 border-neutral-200 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Card Top Row */}
                <div className="p-6 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="font-extrabold text-neutral-950 text-sm">@{item.message.author}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="px-2 py-0.5 rounded-md border border-neutral-200 bg-neutral-100 text-neutral-800 font-sans text-[11px] font-bold">
                        {item.message.platform}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500 font-sans text-xs truncate max-w-[240px]">
                        {item.message.sourceCommunity}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      {/* Score Indicator */}
                      <div className="px-3 py-1 rounded-xl border border-neutral-300 font-mono text-xs font-bold text-neutral-900 bg-neutral-50 flex items-center space-x-1.5">
                        <span className="text-[10px] text-neutral-400 font-sans uppercase">Score</span>
                        <span className="text-sm font-extrabold text-neutral-950">{item.totalOpportunityScore}</span>
                        <span className="text-[10px] text-neutral-400">/100</span>
                      </div>

                      {/* Decision Badge */}
                      <div
                        className={`px-3.5 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                          isActNow
                            ? 'bg-black text-white shadow-xs'
                            : isWatch
                            ? 'border border-neutral-400 text-neutral-800 bg-neutral-100'
                            : 'border border-neutral-200 text-neutral-400 bg-neutral-100'
                        }`}
                      >
                        {item.decision === 'ACT_NOW' ? '🔥 Act Now' : item.decision}
                      </div>

                      {/* Micro-Cent Cost Badge */}
                      <div className="text-[10px] font-mono text-neutral-400 px-2 py-1 rounded-md border border-neutral-200 bg-neutral-50">
                        ${item.totalCostUsd.toFixed(5)}
                      </div>
                    </div>
                  </div>

                  {/* Original Prospect Message */}
                  <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 mb-4 text-left">
                    <p className="text-xs sm:text-sm text-neutral-900 leading-relaxed font-sans font-medium">
                      "{item.message.text}"
                    </p>
                    {item.message.threadContext && (
                      <p className="text-[11px] text-neutral-400 mt-2 italic border-t border-neutral-200/80 pt-2 font-sans">
                        Context: {item.message.threadContext}
                      </p>
                    )}
                  </div>

                  {/* Extracted Semantic Context Tags (if reached Stage 2) */}
                  {item.stage2 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                      {item.stage2.detectedProblem && (
                        <div className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800">
                          <strong className="text-neutral-500 text-[10px] uppercase font-mono block">Detected Pain Point:</strong>
                          <span>{item.stage2.detectedProblem}</span>
                        </div>
                      )}

                      <div className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800">
                        <strong className="text-neutral-500 text-[10px] uppercase font-mono block">Urgency:</strong>
                        <span className={`font-bold ${item.stage2.urgency === 'HIGH' ? 'text-black' : 'text-neutral-700'}`}>
                          {item.stage2.urgency}
                        </span>
                      </div>

                      {item.stage2.userSkillOrStatus && (
                        <div className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800">
                          <strong className="text-neutral-500 text-[10px] uppercase font-mono block">Prospect Level:</strong>
                          <span>{item.stage2.userSkillOrStatus}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STAGE 4: VALUE-FIRST TAILORED OUTREACH REPLY */}
                  {item.stage4?.suggestedReply && (
                    <div className="p-5 rounded-2xl border border-neutral-950 bg-neutral-950 text-white space-y-3 mt-4 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-white" />
                          <span className="font-extrabold uppercase font-mono tracking-wider text-[11px]">
                            Authentic Value-First Outreach Draft
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Mark as Contacted Status */}
                          <button
                            onClick={() => onToggleReplyUsed(item.messageId)}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              item.replyUsed
                                ? 'bg-emerald-500 text-white'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{item.replyUsed ? 'Outreach Sent' : 'Mark as Sent'}</span>
                          </button>

                          {/* Copy Reply Button */}
                          <button
                            onClick={() => handleCopyReply(item.messageId, item.stage4?.suggestedReply || '')}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            {copiedId === item.messageId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Reply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Reply Text Quote */}
                      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs sm:text-sm leading-relaxed font-sans">
                        {item.stage4.suggestedReply}
                      </div>

                      {/* Anti-Spam Strategy Reason */}
                      {item.stage4.replyStrategy && (
                        <div className="text-[11px] text-neutral-400 flex items-center space-x-1.5 font-mono">
                          <span className="text-white">Why it works:</span>
                          <span>{item.stage4.replyStrategy}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Discard Reason (if filtered early) */}
                  {isDiscarded && item.stage1?.discardReason && (
                    <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center space-x-2 mt-2">
                      <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span><strong>Pruning Reason:</strong> {item.stage1.discardReason}</span>
                    </div>
                  )}
                </div>

                {/* Audit Drawer Toggle */}
                <div className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-2.5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setExpandedAuditId(isAuditOpen ? null : item.messageId)}
                    className="inline-flex items-center space-x-1 text-neutral-500 hover:text-neutral-950 font-bold transition-colors cursor-pointer"
                  >
                    <span>{isAuditOpen ? 'Hide Multi-Stage Telemetry' : 'Inspect Multi-Stage Telemetry'}</span>
                    {isAuditOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <span className="font-mono text-[11px] text-neutral-400">
                    Tokens: {item.totalTokensUsed} (${item.totalCostUsd.toFixed(6)})
                  </span>
                </div>

                {/* Expanded Audit Details */}
                {isAuditOpen && (
                  <div className="border-t border-neutral-200 p-6 bg-neutral-50 space-y-4 text-xs font-mono animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                        <span className="font-bold text-neutral-950 block mb-1">Stage 1: Cheap Filter</span>
                        <div>Passed: {item.stage1?.passed ? 'YES' : 'NO'}</div>
                        <div>Score: {item.stage1?.relevanceScore}/100</div>
                        <div>Cost: ${item.stage1?.costUsd.toFixed(6)}</div>
                      </div>

                      <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                        <span className="font-bold text-neutral-950 block mb-1">Stage 2: Intent Understanding</span>
                        <div>Intent: {item.stage2?.intentType || 'N/A'}</div>
                        <div>Urgency: {item.stage2?.urgency || 'N/A'}</div>
                        <div>Cost: ${item.stage2?.costUsd.toFixed(6) || 0}</div>
                      </div>

                      <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                        <span className="font-bold text-neutral-950 block mb-1">Stage 3: Profile Fit</span>
                        <div>Fit Level: {item.stage3?.fitLevel || 'N/A'}</div>
                        <div>Score: {item.stage3?.opportunityScore || 0}/100</div>
                        <div>Cost: ${item.stage3?.costUsd.toFixed(6) || 0}</div>
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
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-xs font-extrabold uppercase font-mono text-neutral-950 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Act Now ({results.filter((r) => r.decision === 'ACT_NOW').length})</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white">Outreach</span>
            </div>
            <div className="space-y-3">
              {results
                .filter((r) => r.decision === 'ACT_NOW')
                .map((item) => (
                  <div key={item.messageId} className="p-4 bg-white border border-neutral-950 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-neutral-950">@{item.message.author}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-bold">{item.totalOpportunityScore}/100</span>
                    </div>
                    <p className="text-xs text-neutral-700 line-clamp-3 font-sans">{item.message.text}</p>
                    {item.stage4?.suggestedReply && (
                      <button
                        onClick={() => handleCopyReply(item.messageId, item.stage4?.suggestedReply || '')}
                        className="w-full py-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1"
                      >
                        {copiedId === item.messageId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === item.messageId ? 'Copied' : 'Copy Outreach Reply'}</span>
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: Watchlist */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-xs font-extrabold uppercase font-mono text-neutral-700 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Watchlist ({results.filter((r) => r.decision === 'WATCH').length})</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">Nurture</span>
            </div>
            <div className="space-y-3">
              {results
                .filter((r) => r.decision === 'WATCH')
                .map((item) => (
                  <div key={item.messageId} className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-neutral-950">@{item.message.author}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-bold">{item.totalOpportunityScore}/100</span>
                    </div>
                    <p className="text-xs text-neutral-700 line-clamp-3 font-sans">{item.message.text}</p>
                    {item.stage2?.detectedProblem && (
                      <p className="text-[11px] text-neutral-500 font-mono">Problem: {item.stage2.detectedProblem}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Column 3: Discarded Noise */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-xs font-extrabold uppercase font-mono text-neutral-500 flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Pruned Noise ({results.filter((r) => r.decision === 'IGNORE').length})</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-500">Pruned</span>
            </div>
            <div className="space-y-3">
              {results
                .filter((r) => r.decision === 'IGNORE')
                .map((item) => (
                  <div key={item.messageId} className="p-3.5 bg-white/70 border border-neutral-200 rounded-xl space-y-1.5 opacity-70">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-neutral-600">@{item.message.author}</span>
                      <span className="text-[10px] text-neutral-400">{item.message.platform}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 font-sans">{item.message.text}</p>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {item.stage1?.discardReason || 'Low relevance'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: DENSE TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-mono text-neutral-500 uppercase">
                  <th className="p-3.5 pl-4 font-bold">Author</th>
                  <th className="p-3.5 font-bold">Platform</th>
                  <th className="p-3.5 font-bold">Message Content</th>
                  <th className="p-3.5 font-bold">Score</th>
                  <th className="p-3.5 font-bold">Decision</th>
                  <th className="p-3.5 font-bold">Urgency</th>
                  <th className="p-3.5 pr-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredResults.map((item) => (
                  <tr key={item.messageId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-bold text-neutral-950 whitespace-nowrap">
                      @{item.message.author}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-100 text-[10px] font-bold">
                        {item.message.platform}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-md truncate text-neutral-800">
                      {item.message.text}
                    </td>
                    <td className="p-3.5 font-mono font-bold whitespace-nowrap">
                      {item.totalOpportunityScore}/100
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          item.decision === 'ACT_NOW'
                            ? 'bg-black text-white'
                            : item.decision === 'WATCH'
                            ? 'border border-neutral-300 text-neutral-800'
                            : 'text-neutral-400'
                        }`}
                      >
                        {item.decision}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-neutral-600 whitespace-nowrap">
                      {item.stage2?.urgency || '—'}
                    </td>
                    <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                      {item.stage4?.suggestedReply ? (
                        <button
                          onClick={() => handleCopyReply(item.messageId, item.stage4?.suggestedReply || '')}
                          className="px-2.5 py-1 bg-black text-white font-bold text-[11px] rounded-lg hover:bg-neutral-800 cursor-pointer inline-flex items-center space-x-1"
                        >
                          {copiedId === item.messageId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === item.messageId ? 'Copied' : 'Copy'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-mono">—</span>
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
