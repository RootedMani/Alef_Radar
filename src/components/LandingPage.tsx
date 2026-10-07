import React, { useState } from 'react';
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
  HelpCircle,
  ChevronDown
} from 'lucide-react';

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does OpportunityRadar reduce LLM token costs by 88%?',
      a: 'Instead of passing every community chatter message to a large reasoning prompt, our 4-stage cascade applies ultra-cheap lexical screening at Stage 1 ($0.00001 per message). Over 70% of memes, bot spam, and irrelevant posts are dropped instantly. Only high-conviction buying intent triggers the deeper semantic reasoning and reply generation stages.'
    },
    {
      q: 'Will replies look like automated bot spam?',
      a: 'Never. OpportunityRadar is programmed with value-first peer conversation guidelines. The agent prioritizes empathizing with the specific user problem and offering actionable advice first, only subtly introducing your solution where genuinely relevant, preserving community trust and preventing moderator bans.'
    },
    {
      q: 'Can I connect custom community streams and my own product profile?',
      a: 'Yes. You can paste custom feeds or integrate stream webhooks, and define multiple target product profiles with specific audience pain points, tone of voice, price point, and strict exclusion rules.'
    },
    {
      q: 'What underlying AI model powers the agent?',
      a: 'OpportunityRadar runs on Google Gemini 3.8 Flash, delivering sub-second inference speeds with reliable structured JSON outputs and exceptionally low inference pricing.'
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-4 text-center max-w-4xl mx-auto px-4">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-neutral-300 bg-white text-xs font-mono font-bold text-neutral-800 mb-6 shadow-xs">
          <Radar className="w-3.5 h-3.5 text-black" />
          <span>AUTONOMOUS COMMUNITY INTELLIGENCE // AI LEAD AGENT</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.12]">
          Turn Public Discussions Into High-Converting Customer Pipelines
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          OpportunityRadar scans Reddit, Telegram, X, and Discord feeds, eliminates 75% of noise for micro-cents, and crafts authentic, peer-level replies the moment prospects express purchasing pain points.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-black text-white font-extrabold text-sm tracking-wide shadow-md hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <span>Launch Radar Scanner (Free)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDocs}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Architecture & Specifications</span>
          </button>
        </div>

        {/* Micro Telemetry Metrics */}
        <div className="mt-14 pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 font-mono">88.7%</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">Inference Cost Savings</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 font-mono">4 Stages</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">State Machine Cascade</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 font-mono">&lt; 140 ms</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">Average Triage Latency</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 font-mono">0% Spam</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">Value-First Suggested Outreach</div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            Pipeline Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1">
            How The Agentic Cascade Operates
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Instead of burning budgets running monolithic models across entire chat logs, OpportunityRadar funnels messages through an intelligent 4-tier state machine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-400 mb-3">01 // TARGET SPECIFICATION</div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                Configure Product Profile
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Define your exact customer pain points, value proposition, ideal persona, voice tone, and negative criteria to forbid awkward or out-of-place replies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Ready in 60s</span>
              <span>Fully Customizable</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-neutral-950 shadow-sm flex flex-col justify-between ring-1 ring-neutral-950">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-950 mb-3">02 // 4-STAGE CASCADE</div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                Filter Noise & Assess Intent
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Stage 1 cuts noise for $0.00001. Stages 2 and 3 evaluate implicit purchase urgency, specific friction points, and output a validated 0–100 opportunity score.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-950 font-bold">
              <span>88.7% Cost Pruned</span>
              <span>Gemini 3.8 Flash</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-400 mb-3">03 // VALUE-FIRST ENGAGEMENT</div>
              <h3 className="text-lg font-extrabold text-neutral-950 mb-2">
                Generate Natural Replies
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Stage 4 runs strictly on Strong Fit leads, generating personalized, helpful advice that introduces your solution naturally without feeling like a marketing pitch.
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
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Economic Validation
            </span>
            <h2 className="text-2xl font-black text-neutral-950 mt-1">
              Why Naive LLM Bots Fail at Real-World Scale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Manual */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-center">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Manual Human Browsing</div>
              <div className="text-2xl font-black text-neutral-950 mt-2 font-mono">20+ Hours/wk</div>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Growth leads manually reading through Discord and Reddit. 95% wasted on banter; replies arrive hours too late.
              </p>
            </div>

            {/* Naive AI */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-center">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Naive Single-Prompt AI</div>
              <div className="text-2xl font-black text-neutral-950 mt-2 font-mono">$144.00 / mo</div>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Pumping 1,200 tokens per message through heavy LLMs across 10,000 community messages burns budget on memes and bots.
              </p>
            </div>

            {/* OpportunityRadar */}
            <div className="p-5 rounded-xl border border-neutral-950 bg-neutral-950 text-white text-center shadow-md">
              <div className="text-xs font-bold uppercase tracking-wide opacity-80">OpportunityRadar Cascade</div>
              <div className="text-2xl font-black mt-2 font-mono text-white">$16.24 / mo</div>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                70% pruned at Stage 1 ($0.00001/msg). Only verified buyer leads reach final generation, slashing bills by 88.7%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Datasets Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="border border-neutral-200 rounded-3xl p-8 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                Live Pre-loaded Streams
              </span>
              <h2 className="text-2xl font-black text-neutral-950 mt-0.5">
                Test With Pre-Loaded Community Datasets
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Authentic community messages containing urgent buyers, weak curiosities, and spam noise.
              </p>
            </div>

            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all self-start md:self-auto cursor-pointer"
            >
              <span>Test Streams in Scanner</span>
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
                <span className="text-xs font-mono font-bold text-neutral-500">FEED 01 // EDTECH & SOFTWARE</span>
                <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">Run Test →</span>
              </div>
              <h4 className="font-extrabold text-neutral-950 text-base mb-1">
                Programming Course & Career Pivot Community
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                Scraped from Reddit r/learnprogramming, Discord developer chats, and tech boards. Features career switchers in tutorial hell, questions, and crypto spam.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                Target Profile: DevCraft Python Career Accelerator
              </div>
            </div>

            {/* Dataset 2 */}
            <div
              onClick={() => onExploreDatasets('eyewear')}
              className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-950 transition-all cursor-pointer bg-neutral-50/50 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500">FEED 02 // DTC HARDWARE & ERGONOMICS</span>
                <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">Run Test →</span>
              </div>
              <h4 className="font-extrabold text-neutral-950 text-base mb-1">
                Blue-Light Glasses & Screen Fatigue Feed
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                Twitter/X and Reddit threads from remote software engineers, analysts, and traders experiencing 10-hour screen migraines and blurred vision.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                Target Profile: LuminaShield Precision Eyewear
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plans Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            Predictable Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1">
            Simple, Cost-Aware Subscription Tiers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Start free, explore the cascade live, and upgrade when streaming live webhooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Free Starter</div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-neutral-950 font-mono">$0</span>
                <span className="text-xs text-neutral-500 ml-1">/ forever</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Ideal for evaluating the agent pipeline and scanning manual community message batches.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-neutral-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span>Up to 500 scanned posts / mo</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span>2 Active Product Profiles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span>Full 4-Stage cascade visualizer</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-6 w-full py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-900 transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Growth Plan */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-950 shadow-md ring-1 ring-neutral-950 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Pro Growth</span>
                <span className="text-[10px] font-mono font-bold bg-neutral-950 text-white px-2 py-0.5 rounded-full">POPULAR</span>
              </div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-neutral-950 font-mono">$49</span>
                <span className="text-xs text-neutral-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                For active founders, SaaS marketers, and growth agencies monitoring daily channels.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-neutral-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                  <span>Up to 15,000 scanned posts / mo</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                  <span>Unlimited Product Profiles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                  <span>Real-time webhook triggers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                  <span>Instant 1-click reply drafting</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-6 w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
            >
              Start 14-Day Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Enterprise Scale</div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-neutral-950 font-mono">$199</span>
                <span className="text-xs text-neutral-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                High-volume streaming listeners, dedicated webhooks, CRM sync, and custom model fine-tuning.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-neutral-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span>Unlimited scanned posts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span>Direct HubSpot & Salesforce sync</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span>Custom tone fine-tuning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                  <span>Dedicated SLA & engineering support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-6 w-full py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-900 transition-colors cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            Got Questions?
          </span>
          <h2 className="text-2xl font-black text-neutral-950 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 rounded-2xl bg-white overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-neutral-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-10 rounded-3xl bg-neutral-950 text-white shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Start Detecting High-Intent Customers Now
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Create your account or launch the interactive scanner immediately to test real stream triage and reply generation.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-neutral-100 transition-all cursor-pointer shadow-md"
            >
              <span>Open Radar Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
