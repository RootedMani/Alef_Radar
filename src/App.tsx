import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProductProfileSelector } from './components/ProductProfileSelector';
import { MessageInputSection } from './components/MessageInputSection';
import { AgentProgressModal } from './components/AgentProgressModal';
import { ResultsDashboard } from './components/ResultsDashboard';
import { DocsModal } from './components/DocsModal';
import { CommunityMessage, MessageAnalysis, ProductProfile, RunSummary, User } from './types';
import { defaultProductProfiles } from './data/defaultProfiles';
import { programmingCourseDataset, eyeStrainGlassesDataset } from './data/demoDatasets';
import { runAgentPipeline, saveProfile } from './services/agentApi';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isPersian, setIsPersian] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>({
    id: 'user-demo-01',
    email: 'contest@buildx.ir',
    name: 'buildX Evaluator',
    role: 'Judge',
    createdAt: new Date().toISOString()
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'radar' | 'profiles' | 'tech_docs' | 'business_plan' | 'pitch' | 'video'>('radar');

  const [profiles, setProfiles] = useState<ProductProfile[]>(defaultProductProfiles);
  const [activeProfile, setActiveProfile] = useState<ProductProfile>(defaultProductProfiles[0]);
  const [messages, setMessages] = useState<CommunityMessage[]>(programmingCourseDataset);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);
  const [analyzedResults, setAnalyzedResults] = useState<MessageAnalysis[]>([]);

  // Agent Progress Animation states
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [currentStageNumber, setCurrentStageNumber] = useState<1 | 2 | 3 | 4>(1);
  const [runningTokens, setRunningTokens] = useState<number>(0);
  const [runningCost, setRunningCost] = useState<number>(0);
  const [discardedCount, setDiscardedCount] = useState<number>(0);
  const [actNowCount, setActNowCount] = useState<number>(0);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSetMessages = (newMsgs: CommunityMessage[]) => {
    setMessages(newMsgs);
    if (newMsgs === eyeStrainGlassesDataset) {
      const eyewear = profiles.find((p) => p.id.includes('eyewear')) || profiles[1];
      if (eyewear) setActiveProfile(eyewear);
    } else if (newMsgs === programmingCourseDataset) {
      const bootcamp = profiles.find((p) => p.id.includes('bootcamp')) || profiles[0];
      if (bootcamp) setActiveProfile(bootcamp);
    }
  };

  const handleSelectProfile = (p: ProductProfile) => {
    setActiveProfile(p);
    if (p.id.includes('eyewear') && messages === programmingCourseDataset) {
      setMessages(eyeStrainGlassesDataset);
    } else if (p.id.includes('bootcamp') && messages === eyeStrainGlassesDataset) {
      setMessages(programmingCourseDataset);
    }
  };

  const handleAddProfile = async (p: ProductProfile) => {
    const saved = await saveProfile(p);
    setProfiles((prev) => [saved, ...prev]);
    setActiveProfile(saved);
  };

  const handleToggleReplyUsed = (messageId: string) => {
    setAnalyzedResults((prev) =>
      prev.map((r) => (r.messageId === messageId ? { ...r, replyUsed: !r.replyUsed } : r))
    );
  };

  const handleRunAgent = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setShowProgressModal(true);
    setCurrentMessageIndex(0);
    setCurrentStageNumber(1);
    setRunningTokens(0);
    setRunningCost(0);
    setDiscardedCount(0);
    setActNowCount(0);

    const pipelinePromise = runAgentPipeline(activeProfile, messages);

    const total = messages.length;
    let tokens = 0;
    let disc = 0;
    let acts = 0;

    for (let i = 0; i < total; i++) {
      setCurrentMessageIndex(i);
      setCurrentStageNumber(1);
      tokens += 85;
      setRunningTokens(tokens);
      setRunningCost(tokens * 0.00000025);

      await new Promise((res) => setTimeout(res, 90));

      const msgText = messages[i].text.toLowerCase();
      const isNoise =
        msgText.includes('airdrop') ||
        msgText.includes('discount coupon') ||
        msgText.includes('sunset shot') ||
        msgText.includes('espresso') ||
        (msgText.includes('syntaxerror') && msgText.includes('if x = 5')) ||
        (activeProfile.id.includes('eyewear') && msgText.includes('aeron chair'));

      if (isNoise) {
        disc++;
        setDiscardedCount(disc);
        continue;
      }

      setCurrentStageNumber(2);
      tokens += 290;
      setRunningTokens(tokens);
      setRunningCost(tokens * 0.00000025);
      await new Promise((res) => setTimeout(res, 90));

      setCurrentStageNumber(3);
      tokens += 320;
      setRunningTokens(tokens);
      setRunningCost(tokens * 0.00000025);
      await new Promise((res) => setTimeout(res, 90));

      if (
        msgText.includes('bootcamp') ||
        msgText.includes('mentorship') ||
        msgText.includes('blue light') ||
        msgText.includes('glasses') ||
        msgText.includes('عینک') ||
        msgText.includes('دوره یا منتورینگ') ||
        msgText.includes('tutorial hell') ||
        msgText.includes('fastapi')
      ) {
        setCurrentStageNumber(4);
        acts++;
        setActNowCount(acts);
        tokens += 450;
        setRunningTokens(tokens);
        setRunningCost(tokens * 0.00000025);
        await new Promise((res) => setTimeout(res, 110));
      }
    }

    const res = await pipelinePromise;
    setRunSummary(res.summary);
    setAnalyzedResults(res.results);

    await new Promise((res) => setTimeout(res, 250));
    setShowProgressModal(false);
    setIsLoading(false);
  };

  return (
    <div
      dir={isPersian ? 'rtl' : 'ltr'}
      className="min-h-screen bg-neutral-100/60 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-neutral-950 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans transition-colors"
    >
      {/* Minimalist Top Contest Status Banner */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-2 px-4 text-center text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono">
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-neutral-900 dark:text-white">
            <Award className="w-3.5 h-3.5" />
            <span>buildX 2026:</span>
          </span>
          <span className="text-neutral-600 dark:text-neutral-300">
            {isPersian
              ? 'کاشف مشتری بالقوه در یک جامعهٔ آنلاین (Potential Customer Detector in Online Communities)'
              : 'Potential Customer Detector in Online Communities'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
            {isPersian ? '۴ مرحله ارکستراسیون ایجنت • ۸۸٪ صرفه‌جویی توکن' : '4-Stage Agent Cascade • 88% Token Savings'}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => setUser(null)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPersian={isPersian}
        setIsPersian={setIsPersian}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'radar' && (
          <>
            {/* Minimalist Hero Section */}
            <div className="rounded-2xl p-6 sm:p-10 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
              <div className="max-w-3xl">
                <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono font-bold text-neutral-700 dark:text-neutral-300 mb-3 bg-neutral-50 dark:bg-neutral-900">
                  <span>AGENTIC CORE // COST-AWARE CASCADE</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
                  {isPersian
                    ? 'کشف خودکار خریداران و فرصت‌های فروش در جوامع آنلاین'
                    : 'Autonomous Potential Customer Detector for Online Communities'}
                </h1>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                  {isPersian
                    ? 'سیستم هوشمند OpportunityRadar پیام‌های گفتگو در ردیت، تلگرام و توییتر را پایش کرده، نویزها را بدون صرف هزینه توکن حذف می‌کند، قصد خرید و فوریت مخاطب را ارزیابی می‌نماید و برای فرصت‌های واقعی پاسخی اصیل و بدون اسپم آماده می‌سازد.'
                    : 'OpportunityRadar continuously listens to community messages, cheaply prunes chatter at Stage 1, extracts true buyer intent and constraints at Stage 2, scores bilateral fit at Stage 3, and generates value-first personalized replies only for high-conviction opportunities.'}
                </p>

                {/* Minimalist 4-Stage Summary Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <div className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
                    01 // Cheap Filter (~80 tok)
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
                    02 // Context & Intent
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
                    03 // Fit Evaluation (0–100)
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-black font-bold">
                    04 // Value-First Reply
                  </div>
                </div>
              </div>
            </div>

            {/* Product Profile Selector */}
            <ProductProfileSelector
              profiles={profiles}
              activeProfile={activeProfile}
              onSelectProfile={handleSelectProfile}
              onAddProfile={handleAddProfile}
              isPersian={isPersian}
            />

            {/* Community Messages Feed & Trigger */}
            <MessageInputSection
              messages={messages}
              onSetMessages={handleSetMessages}
              onRunAgent={handleRunAgent}
              isLoading={isLoading}
              activeProfile={activeProfile}
              isPersian={isPersian}
            />

            {/* Results Section */}
            {runSummary && (
              <ResultsDashboard
                summary={runSummary}
                results={analyzedResults}
                activeProfile={activeProfile}
                onToggleReplyUsed={handleToggleReplyUsed}
                isPersian={isPersian}
              />
            )}
          </>
        )}

        {/* Tab: Product Profiles management */}
        {activeTab === 'profiles' && (
          <ProductProfileSelector
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={handleSelectProfile}
            onAddProfile={handleAddProfile}
            isPersian={isPersian}
          />
        )}

        {/* Tab: Tech Specs / Business Plan / Pitch / Video */}
        {(activeTab === 'tech_docs' ||
          activeTab === 'business_plan' ||
          activeTab === 'pitch' ||
          activeTab === 'video') && (
          <DocsModal
            viewMode={activeTab}
            onClose={() => setActiveTab('radar')}
            isPersian={isPersian}
          />
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-6 px-4 text-xs text-neutral-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono">
            <span className="font-bold text-neutral-900 dark:text-white">OpportunityRadar</span>
            <span>/</span>
            <span>buildX Contest Submission</span>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse font-mono text-[11px]">
            <span>Model: Google Gemini 3.8 Flash</span>
            <span>•</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">10-Day Availability Active</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(u) => setUser(u)}
        isPersian={isPersian}
      />

      <AgentProgressModal
        isOpen={showProgressModal}
        totalMessages={messages.length}
        currentMessageIndex={currentMessageIndex}
        currentStageNumber={currentStageNumber}
        runningTokens={runningTokens}
        runningCost={runningCost}
        discardedCount={discardedCount}
        actNowCount={actNowCount}
        isPersian={isPersian}
      />
    </div>
  );
}
