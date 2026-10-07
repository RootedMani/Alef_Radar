import React, { useState } from 'react';
import { Database, Play, BookOpen, Eye, Terminal } from 'lucide-react';
import { CommunityMessage, ProductProfile } from '../types';
import { programmingCourseDataset, eyeStrainGlassesDataset } from '../data/demoDatasets';

interface MessageInputSectionProps {
  messages: CommunityMessage[];
  onSetMessages: (msgs: CommunityMessage[]) => void;
  onRunAgent: () => void;
  isLoading: boolean;
  activeProfile: ProductProfile;
  isPersian: boolean;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  messages,
  onSetMessages,
  onRunAgent,
  isLoading,
  activeProfile,
  isPersian,
}) => {
  const [activeTab, setActiveTab] = useState<'programming' | 'eyewear' | 'custom'>('programming');
  const [customText, setCustomText] = useState('');

  const handleSelectDataset = (type: 'programming' | 'eyewear') => {
    setActiveTab(type);
    if (type === 'programming') {
      onSetMessages(programmingCourseDataset);
    } else {
      onSetMessages(eyeStrainGlassesDataset);
    }
  };

  const handleParseCustom = () => {
    if (!customText.trim()) return;
    const lines = customText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 5);

    const parsed: CommunityMessage[] = lines.map((text, idx) => ({
      id: `custom-msg-${Date.now()}-${idx}`,
      author: `user_${idx + 1}`,
      platform: 'Telegram',
      sourceCommunity: 'Community Feed',
      timestamp: 'Just now',
      text,
      likesOrUpvotes: Math.floor(Math.random() * 15),
      repliesCount: Math.floor(Math.random() * 8)
    }));

    onSetMessages(parsed);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm transition-colors">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-neutral-200 dark:border-neutral-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              02 // Input Stream
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
              {messages.length} messages loaded
            </span>
          </div>

          <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
            {isPersian ? 'خوراک پیام‌های جامعه آنلاین' : 'Community Messages Stream'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isPersian
              ? 'دیتاست‌های استاندارد مسابقه buildX یا متن‌های اختصاصی را جهت پایش ایجنت انتخاب کنید.'
              : 'Choose built-in buildX demo datasets or paste custom community messages.'}
          </p>
        </div>

        {/* High-Contrast Minimalist Primary Action Button */}
        <button
          onClick={onRunAgent}
          disabled={isLoading || messages.length === 0}
          className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs tracking-wide shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>
            {isLoading
              ? isPersian
                ? 'در حال اجرای پایپ‌لاین ایجنت...'
                : 'Agent Cascade Running...'
              : isPersian
              ? 'اجرای رادار ایجنتیک (Run Radar)'
              : 'Run OpportunityRadar'}
          </span>
        </button>
      </div>

      {/* Dataset Selectors */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => handleSelectDataset('programming')}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            activeTab === 'programming'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-black border-neutral-950 dark:border-white shadow-sm'
              : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isPersian ? 'دیتاست دوره‌های برنامه‌نویسی' : 'Programming Course Dataset (8)'}</span>
        </button>

        <button
          onClick={() => handleSelectDataset('eyewear')}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            activeTab === 'eyewear'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-black border-neutral-950 dark:border-white shadow-sm'
              : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isPersian ? 'دیتاست خستگی چشم و عینک' : 'Eye Strain & Glasses Dataset (8)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            activeTab === 'custom'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-black border-neutral-950 dark:border-white shadow-sm'
              : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{isPersian ? 'ورود دستی پیام‌ها' : 'Custom Input'}</span>
        </button>
      </div>

      {/* Custom Textarea if tab selected */}
      {activeTab === 'custom' && (
        <div className="mb-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-2">
          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {isPersian
              ? 'هر پیام را در یک خط قرار دهید و روی دکمه اعمال کلیک کنید:'
              : 'Paste community messages (one per line):'}
          </label>
          <textarea
            rows={4}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="I am struggling to find an affordable Python bootcamp with real mentorship...&#10;My eyes burn after 10 hours of monitor work, any glasses recommendation?&#10;Claim free 5000 SOL airdrop now!"
            className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white font-mono"
          />
          <button
            onClick={handleParseCustom}
            className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {isPersian ? 'اعمال پیام‌های واردشده' : 'Load Parsed Messages'}
          </button>
        </div>
      )}

      {/* Messages Stream List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-left rtl:text-right"
          >
            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mb-1.5 font-mono">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-neutral-900 dark:text-white">@{msg.author}</span>
                <span>•</span>
                <span className="text-neutral-600 dark:text-neutral-300 font-sans">{msg.platform}</span>
                <span>•</span>
                <span className="truncate max-w-[200px] font-sans">{msg.sourceCommunity}</span>
              </div>
              <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>
            </div>
            <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
