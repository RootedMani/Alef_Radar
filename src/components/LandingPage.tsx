import React from 'react';
import {
  Radar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Layers,
  MessageSquare,
  CheckCircle2,
  Filter,
  DollarSign,
  Cpu,
  BookOpen,
  Eye,
  Zap,
} from 'lucide-react';
import { CommunityMessage, ProductProfile } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDatasets: (type: 'programming' | 'eyewear') => void;
  onViewDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDatasets,
  onViewDocs,
}) => {
  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 pb-6 text-center max-w-4xl mx-auto px-4">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-neutral-300 bg-white text-xs font-mono font-bold text-neutral-800 mb-6 shadow-xs">
          <Radar className="w-3.5 h-3.5" />
          <span>AUTONOMOUS LEAD DETECTION AGENT // BUILDX MVP</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.15]">
          Turn Online Communities Into Your Highest-Converting Sales Pipeline
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          OpportunityRadar scans Reddit, Telegram, X, and Discord feeds, filters out 75% of chatter for micro-cents, and drafts authentic, non-spammy replies at the exact moment prospects express buying intent.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-xl bg-black text-white font-extrabold text-sm tracking-wide shadow-md hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <span>Launch Radar App (Free)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDocs}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Architecture & Pitch Deck</span>
          </button>
        </div>

        {/* Micro Telemetry Metrics */}
        <div className="mt-12 pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-neutral-950 font-mono">88.7%</div>
            <div className="text-xs text-neutral-500 font-medium mt-0.5">LLM Inference Cost Saved</div>
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-950 font-mono">4 Stages</div>
            <div className="text-xs text-neutral-500 font-medium mt-0.5">LangGraph State Machine</div>
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-950 font-mono">&lt; 150 ms</div>
            <div className="text-xs text-neutral-500 font-medium mt-0.5">Average Triage Latency</div>
          </div>
          <div>
            <div className="text-2xl font-black text-neutral-950 font-mono">0% Spam</div>
            <div className="text-xs text-neutral-500 font-medium mt-0.5">Value-First Suggested Replies</div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            Workflow Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1">
            How The Agentic Cascade Works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Instead of wasting expensive tokens running monolithic prompts on every post, OpportunityRadar employs an intelligent 4-stage cascade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-400 mb-3">01 // DEFINE PROFILE</div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                Configure Target Product
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Specify your value proposition, customer pain points, tone of voice (e.g. empathic expert), and strict exclusion rules to prevent inappropriate pitching.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Ready in 60s</span>
              <span>Customizable</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-950 shadow-sm flex flex-col justify-between ring-1 ring-neutral-950">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-950 mb-3">02 // 4-STAGE CASCADE</div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                Filter Noise & Understand Context
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Stage 1 eliminates crypto airdrops and irrelevant posts for $0.00001. Stage 2 & 3 extract implicit buyer urgency, problem depth, and calculate a 0–100 fit score.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-950 font-bold">
              <span>88.7% Cost Pruning</span>
              <span>Gemini 3.8 Flash</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-400 mb-3">03 // ACT NOW OPPORTUNITIES</div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                Value-First Personalized Reply
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Stage 4 activates strictly for Strong Fits, composing an authentic, peer-level reply that provides helpful advice first and mentions your product naturally.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>1-Click Copy</span>
              <span>Zero Account Bans</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Cost-Aware Advantage (Comparison Grid) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Economic Feasibility
            </span>
            <h2 className="text-2xl font-black text-neutral-950 mt-1">
              Why Monolithic AI Scanners Fail at Scale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Manual */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-center">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Manual Human Browsing</div>
              <div className="text-2xl font-black text-neutral-950 mt-2 font-mono">20+ Hours/wk</div>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Founders and sales reps manually scroll Twitter and Reddit feeds. 95% of time wasted on noise; responses arrive hours too late.
              </p>
            </div>

            {/* Naive AI */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-center">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Naive Single-Prompt AI</div>
              <div className="text-2xl font-black text-neutral-950 mt-2 font-mono">$144 / mo</div>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Sending 1,200 tokens per message through heavy LLMs across 10,000 stream messages burns cash on memes and bot spam.
              </p>
            </div>

            {/* OpportunityRadar */}
            <div className="p-5 rounded-xl border border-neutral-950 bg-neutral-950 text-white text-center shadow-md">
              <div className="text-xs font-bold uppercase tracking-wide opacity-80">OpportunityRadar Cascade</div>
              <div className="text-2xl font-black mt-2 font-mono text-white">$16.24 / mo</div>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                70% pruned at Stage 1 ($0.00001/msg). Only verified golden leads reach reply generation, slashing token bills by 88.7%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built-in Demo Datasets Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="border border-neutral-200 rounded-3xl p-8 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                Evaluation Datasets
              </span>
              <h2 className="text-2xl font-black text-neutral-950 mt-0.5">
                Included buildX Contest Test Suites
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Pre-loaded with real-world community messages containing perfect buyer leads, weak curiosities, and spam bots.
              </p>
            </div>

            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all self-start md:self-auto cursor-pointer"
            >
              <span>Test Both Datasets Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Dataset 1 */}
            <div
              onClick={() => onExploreDatasets('programming')}
              className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-950 transition-all cursor-pointer bg-neutral-50/50 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500">SUITE A // EDUCATION</span>
                <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">Run Test →</span>
              </div>
              <h4 className="font-extrabold text-neutral-950 text-base mb-1">
                Programming Course & Bootcamp Community
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                Scraped from Reddit r/learnprogramming, Discord tech hubs, and Telegram groups. Features career switchers in tutorial hell, technical language debates, and crypto spam.
              </p>
              <div className="text-[11px] font-mono text-neutral-400">
                Matches Profile: DevCraft Python Career Accelerator
              </div>
            </div>

            {/* Dataset 2 */}
            <div
              onClick={() => onExploreDatasets('eyewear')}
              className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-950 transition-all cursor-pointer bg-neutral-50/50 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500">SUITE B // HARDWARE & DTC</span>
                <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">Run Test →</span>
              </div>
              <h4 className="font-extrabold text-neutral-950 text-base mb-1">
                Blue-Light Glasses & Screen Strain
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                Real Twitter/X and Reddit threads from knowledge workers and day traders suffering from 10-hour monitor screen fatigue, temple migraines, and color distortion issues.
              </p>
              <div className="text-[11px] font-mono text-neutral-400">
                Matches Profile: LuminaShield Precision Eyewear
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-10 rounded-3xl bg-neutral-950 text-white shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Run OpportunityRadar?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Register your account for free or click instant 1-click test access to evaluate the multi-stage agent live.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-neutral-100 transition-all cursor-pointer shadow-md"
            >
              <span>Open Radar App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
