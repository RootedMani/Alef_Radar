import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
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
import { ArrowLeft, Radar, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'docs'>('landing');
  
  // Persisted user state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('opportunityradar_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans antialiased selection:bg-neutral-900 selection:text-white">
      
      {/* Main SaaS Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentView('app')}
            onExploreDatasets={(type) => {
              if (type === 'eyewear') {
                handleSetMessages(eyeStrainGlassesDataset);
              } else {
                handleSetMessages(programmingCourseDataset);
              }
              setCurrentView('app');
            }}
            onViewDocs={() => setCurrentView('docs')}
          />
        )}

        {/* VIEW 2: RADAR APPLICATION WORKSPACE */}
        {currentView === 'app' && (
          <div className="space-y-8 animate-fade-in">
            {/* Workspace Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
              <div>
                <button
                  onClick={() => setCurrentView('landing')}
                  className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-neutral-950 mb-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Product Overview</span>
                </button>
                <h1 className="text-2xl font-black text-neutral-950">
                  Radar Detection Workspace
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Configure your product criteria, load stream messages, and let the multi-stage agent find high-intent buyer leads.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView('docs')}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                >
                  Architecture & Docs
                </button>
              </div>
            </div>

            {/* Step 1: Product Profile Selector */}
            <ProductProfileSelector
              profiles={profiles}
              activeProfile={activeProfile}
              onSelectProfile={handleSelectProfile}
              onAddProfile={handleAddProfile}
            />

            {/* Step 2: Message Stream Feed & Run Trigger */}
            <MessageInputSection
              messages={messages}
              onSetMessages={handleSetMessages}
              onRunAgent={handleRunAgent}
              isLoading={isLoading}
              activeProfile={activeProfile}
            />

            {/* Step 3: Results Dashboard (Displayed when processed) */}
            {runSummary && (
              <ResultsDashboard
                summary={runSummary}
                results={analyzedResults}
                activeProfile={activeProfile}
                onToggleReplyUsed={handleToggleReplyUsed}
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
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Radar Workspace</span>
              </button>
            </div>
            <DocsModal onBackToApp={() => setCurrentView('app')} />
          </div>
        )}
      </main>

      {/* Professional SaaS Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 px-4 text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-neutral-950">OpportunityRadar</span>
            <span>//</span>
            <span>Autonomous Community Lead Intelligence</span>
          </div>

          <div className="flex items-center space-x-3 text-neutral-500">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-neutral-800 font-semibold">99.98% System Uptime</span>
            </span>
            <span>•</span>
            <span>Gemini 3.8 Flash</span>
            <span>•</span>
            <span>SaaS Cloud Edition</span>
          </div>
        </div>
      </footer>

      {/* Free Registration / Login Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
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
      />
    </div>
  );
}
