import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ProductProfileSelector } from './components/ProductProfileSelector';
import { MessageInputSection } from './components/MessageInputSection';
import { AgentProgressModal } from './components/AgentProgressModal';
import { ResultsDashboard } from './components/ResultsDashboard';
import { DocsModal } from './components/DocsModal';
import { InteractiveBackground } from './components/InteractiveBackground';
import { RadarIntroLoader } from './components/RadarIntroLoader';
import { CommunityMessage, MessageAnalysis, ProductProfile, RunSummary, User } from './types';
import { defaultProductProfiles } from './data/defaultProfiles';
import {
  programmingCourseDataset,
  eyeStrainGlassesDataset,
  programmingCourseDatasetFa,
  eyeStrainGlassesDatasetFa
} from './data/demoDatasets';
import { runAgentPipeline, saveProfile } from './services/agentApi';
import { Language, translations } from './utils/i18n';
import { ArrowLeft, ArrowRight, Radar, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'docs'>('landing');
  const [isLoadingIntro, setIsLoadingIntro] = useState<boolean>(true);

  // User is not signed in by default
  const [user, setUser] = useState<User | null>(null);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Dark Mode state: strictly defaults to light mode as requested!
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('opportunityradar_theme');
      if (saved === 'dark') return true;
      return false; // Default light mode
    } catch {
      return false;
    }
  });

  const handleSetDarkMode = (isDark: boolean) => {
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('opportunityradar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('opportunityradar_theme', 'light');
    }
  };

  const handleToggleDarkMode = () => {
    handleSetDarkMode(!darkMode);
  };

  // Language state (en or fa) with RTL direction setup
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('opportunityradar_lang');
      return saved === 'fa' ? 'fa' : 'en';
    } catch {
      return 'en';
    }
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('opportunityradar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('opportunityradar_theme', 'light');
    }
  }, [darkMode]);

  // Apply language and RTL direction to root HTML
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('opportunityradar_lang', language);
  }, [language]);

  const [profiles, setProfiles] = useState<ProductProfile[]>(defaultProductProfiles);
  const [activeProfile, setActiveProfile] = useState<ProductProfile>(defaultProductProfiles[0]);
  const [messages, setMessages] = useState<CommunityMessage[]>(() =>
    language === 'fa' ? programmingCourseDatasetFa : programmingCourseDataset
  );

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

  const t = translations[language];
  const isRtl = language === 'fa';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
    if (newLang === 'fa') {
      if (messages === programmingCourseDataset) {
        setMessages(programmingCourseDatasetFa);
      } else if (messages === eyeStrainGlassesDataset) {
        setMessages(eyeStrainGlassesDatasetFa);
      }
    } else {
      if (messages === programmingCourseDatasetFa) {
        setMessages(programmingCourseDataset);
      } else if (messages === eyeStrainGlassesDatasetFa) {
        setMessages(eyeStrainGlassesDataset);
      }
    }
  };

  const handleSetMessages = (newMsgs: CommunityMessage[]) => {
    setMessages(newMsgs);
    if (newMsgs === eyeStrainGlassesDataset || newMsgs === eyeStrainGlassesDatasetFa) {
      const eyewear = profiles.find((p) => p.id.includes('eyewear')) || profiles[1];
      if (eyewear) setActiveProfile(eyewear);
    } else if (newMsgs === programmingCourseDataset || newMsgs === programmingCourseDatasetFa) {
      const bootcamp = profiles.find((p) => p.id.includes('bootcamp')) || profiles[0];
      if (bootcamp) setActiveProfile(bootcamp);
    }
  };

  const handleSelectProfile = (p: ProductProfile) => {
    setActiveProfile(p);
    if (p.id.includes('eyewear') && (messages === programmingCourseDataset || messages === programmingCourseDatasetFa)) {
      setMessages(language === 'fa' ? eyeStrainGlassesDatasetFa : eyeStrainGlassesDataset);
    } else if (p.id.includes('bootcamp') && (messages === eyeStrainGlassesDataset || messages === eyeStrainGlassesDatasetFa)) {
      setMessages(language === 'fa' ? programmingCourseDatasetFa : programmingCourseDataset);
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

  const handleLogout = () => {
    localStorage.removeItem('opportunityradar_user');
    setUser(null);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    localStorage.setItem('opportunityradar_user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const handleUpdateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('opportunityradar_user', JSON.stringify(updated));
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-screen bg-neutral-100/30 dark:bg-zinc-950/30 text-neutral-900 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-neutral-900 dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors overflow-x-hidden bg-radar-grid"
    >
      {/* Intro Radar Loading Animation */}
      {isLoadingIntro && (
        <RadarIntroLoader
          onComplete={() => setIsLoadingIntro(false)}
          darkMode={darkMode}
        />
      )}

      {/* Floating Animated Geometric Canvas Background */}
      <InteractiveBackground darkMode={darkMode} />

      {/* Main SaaS Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfileModal(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        language={language}
        onSetLanguage={handleSetLanguage}
      />

      {/* View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentView('app')}
            onExploreDatasets={(type) => {
              if (type === 'eyewear') {
                handleSetMessages(language === 'fa' ? eyeStrainGlassesDatasetFa : eyeStrainGlassesDataset);
              } else {
                handleSetMessages(language === 'fa' ? programmingCourseDatasetFa : programmingCourseDataset);
              }
              setCurrentView('app');
            }}
            onViewDocs={() => setCurrentView('docs')}
            language={language}
          />
        )}

        {/* VIEW 2: RADAR APPLICATION WORKSPACE */}
        {currentView === 'app' && (
          <div className="space-y-8 animate-fade-in">
            {/* Workspace Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 dark:border-zinc-800 gap-3">
              <div>
                <button
                  onClick={() => setCurrentView('landing')}
                  className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-neutral-500 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white mb-1 transition-colors cursor-pointer"
                >
                  <BackArrow className="w-3.5 h-3.5" />
                  <span>{t.backToOverview}</span>
                </button>
                <h1 className="text-2xl font-black text-neutral-950 dark:text-white">
                  {t.workspaceTitle}
                </h1>
                <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">
                  {t.workspaceSubtitle}
                </p>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setCurrentView('docs')}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-200/80 dark:border-white/15 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-700/80 text-xs font-semibold text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer shadow-xs"
                >
                  {t.navDocs}
                </button>
              </div>
            </div>

            {/* Step 1: Product Profile Selector */}
            <ProductProfileSelector
              profiles={profiles}
              activeProfile={activeProfile}
              onSelectProfile={handleSelectProfile}
              onAddProfile={handleAddProfile}
              language={language}
            />

            {/* Step 2: Message Stream Feed & Run Trigger */}
            <MessageInputSection
              messages={messages}
              onSetMessages={handleSetMessages}
              onRunAgent={handleRunAgent}
              isLoading={isLoading}
              activeProfile={activeProfile}
              language={language}
            />

            {/* Step 3: Results Dashboard (Displayed when processed) */}
            {runSummary && (
              <ResultsDashboard
                summary={runSummary}
                results={analyzedResults}
                activeProfile={activeProfile}
                onToggleReplyUsed={handleToggleReplyUsed}
                language={language}
              />
            )}
          </div>
        )}

        {/* VIEW 3: DOCUMENTATION, SPECS & PITCH */}
        {currentView === 'docs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-2">
              <button
                onClick={() => setCurrentView('app')}
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                <BackArrow className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'بازگشت به اسکنر رادار' : 'Return to Radar Workspace'}</span>
              </button>
            </div>
            <DocsModal onBackToApp={() => setCurrentView('app')} language={language} />
          </div>
        )}
      </main>

      {/* Professional SaaS Footer */}
      <footer className="border-t border-neutral-200/60 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl py-6 sm:py-8 px-4 text-xs text-neutral-600 dark:text-zinc-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 font-mono text-[11px]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left rtl:sm:text-right">
            <span className="font-extrabold text-neutral-950 dark:text-white">{t.appName}</span>
            <span className="text-neutral-400 dark:text-zinc-600">//</span>
            <span>{t.tagline}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-neutral-500 dark:text-zinc-400 text-center">
            <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-neutral-800 dark:text-zinc-200 font-semibold">
                {language === 'fa' ? '۹۹.۹۸٪ پایداری سیستم' : '99.98% System Uptime'}
              </span>
            </span>
            <span>•</span>
            <span>{language === 'fa' ? 'مدل Gemini 3.8 Flash' : 'Gemini 3.8 Flash'}</span>
            <span>•</span>
            <span>{language === 'fa' ? 'نسخه ابری نرم‌افزار' : 'SaaS Cloud Edition'}</span>
          </div>
        </div>
      </footer>

      {/* Free Registration / Login Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        language={language}
      />

      {/* Logged-In User Profile & Subscription Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onSetDarkMode={handleSetDarkMode}
        language={language}
        onSetLanguage={setLanguage}
      />

      {/* Live Agent Progress Visualizer */}
      <AgentProgressModal
        isOpen={showProgressModal}
        totalMessages={messages.length}
        currentMessageIndex={currentMessageIndex}
        currentStageNumber={currentStageNumber}
        runningTokens={runningTokens}
        runningCost={runningCost}
        discardedCount={discardedCount}
        actNowCount={actNowCount}
        language={language}
      />
    </div>
  );
}
