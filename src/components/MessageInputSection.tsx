import React, { useState } from 'react';
import { Database, UploadCloud, Play, Sparkles, MessageSquare, Terminal, Eye, BookOpen, AlertCircle } from 'lucide-react';
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
      sourceCommunity: 'Public Community Stream',
      timestamp: 'Just now',
      text,
      likesOrUpvotes: Math.floor(Math.random() * 15),
      repliesCount: Math.floor(Math.random() * 8)
    }));

    onSetMessages(parsed);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <span>{isPersian ? 'خوراک پیام‌های جامعه آنلاین (Community Messages Feed)' : 'Incoming Community Stream'}</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {messages.length} {isPersian ? 'پیام بارگذاری‌شده' : 'messages'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPersian
                ? 'مجموعه داده‌های مسابقه buildX یا متن‌های اختصاصی خود را برای پایش ایجنت انتخاب کنید.'
                : 'Select official buildX demo datasets or paste custom community messages.'}
            </p>
          </div>
        </div>

        {/* Big Action Run Button */}
        <button
          onClick={onRunAgent}
          disabled={isLoading || messages.length === 0}
          className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>
            {isLoading
              ? isPersian
                ? 'ایجنت در حال بررسی چندمرحله‌ای...'
                : 'Agent Processing Pipeline...'
              : isPersian
              ? 'اجرای رادار ایجنتیک (Run Radar)'
              : 'Run OpportunityRadar Agent'}
          </span>
        </button>
      </div>

      {/* Dataset Picker Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => handleSelectDataset('programming')}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'programming'
              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isPersian ? 'دیتاست دوره‌های برنامه‌نویسی (Programming)' : 'Programming Course Dataset (8 Msgs)'}</span>
        </button>

        <button
          onClick={() => handleSelectDataset('eyewear')}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'eyewear'
              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isPersian ? 'دیتاست خستگی چشم و عینک (Eye Strain / X)' : 'Eye Strain / Glasses Dataset (8 Msgs)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'custom'
              ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span>{isPersian ? 'ورود دستی پیام‌ها (Custom Paste)' : 'Custom Paste Messages'}</span>
        </button>
      </div>

      {/* Custom Paste Textarea */}
      {activeTab === 'custom' && (
        <div className="mb-4 p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            {isPersian
              ? 'هر پیام را در یک خط جداگانه قرار دهید و روی دکمه اعمال کلیک کنید:'
              : 'Paste community messages (one per line):'}
          </label>
          <textarea
            rows={4}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="I am struggling to find an affordable Python bootcamp with real mentorship...&#10;My eyes burn after 10 hours of monitor work, any glasses recommendation?&#10;Claim free 5000 SOL airdrop now!"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleParseCustom}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
          >
            {isPersian ? 'بارگذاری پیام‌های واردشده' : 'Load Parsed Messages'}
          </button>
        </div>
      )}

      {/* Messages Preview Stream */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors text-left rtl:text-right"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono">
                <span className="font-semibold text-slate-200">@{msg.author}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">{msg.platform}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 truncate max-w-[180px]">{msg.sourceCommunity}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
