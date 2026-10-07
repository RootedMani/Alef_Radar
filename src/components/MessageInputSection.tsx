import React, { useState } from 'react';
import { Play, BookOpen, Eye, Terminal } from 'lucide-react';
import { CommunityMessage, ProductProfile } from '../types';
import { programmingCourseDataset, eyeStrainGlassesDataset } from '../data/demoDatasets';

interface MessageInputSectionProps {
  messages: CommunityMessage[];
  onSetMessages: (msgs: CommunityMessage[]) => void;
  onRunAgent: () => void;
  isLoading: boolean;
  activeProfile: ProductProfile;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  messages,
  onSetMessages,
  onRunAgent,
  isLoading,
  activeProfile,
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
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-neutral-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              STEP 2 // COMMUNITY INCOMING STREAM
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700">
              {messages.length} messages loaded
            </span>
          </div>

          <h2 className="text-lg font-extrabold text-neutral-950 mt-1">
            Feed Community Messages
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Select one of the built-in contest benchmark datasets or paste your own community threads.
          </p>
        </div>

        {/* Primary Run Button */}
        <button
          onClick={onRunAgent}
          disabled={isLoading || messages.length === 0}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-black text-white font-extrabold text-xs tracking-wider shadow-sm hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>
            {isLoading
              ? 'Agent Cascade Running...'
              : 'Run OpportunityRadar'}
          </span>
        </button>
      </div>

      {/* Dataset Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => handleSelectDataset('programming')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'programming'
              ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Programming Course Dataset (8 Messages)</span>
        </button>

        <button
          onClick={() => handleSelectDataset('eyewear')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'eyewear'
              ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Eye Strain & Glasses Dataset (8 Messages)</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Custom Paste Input</span>
        </button>
      </div>

      {/* Custom Input */}
      {activeTab === 'custom' && (
        <div className="mb-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
          <label className="block text-xs font-bold text-neutral-800">
            Paste raw community messages (one per line):
          </label>
          <textarea
            rows={4}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="I am struggling to find an affordable Python bootcamp with real mentorship...&#10;My eyes burn after 10 hours of monitor work, any glasses recommendation?&#10;Claim free 5000 SOL airdrop now!"
            className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black font-mono"
          />
          <button
            onClick={handleParseCustom}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 cursor-pointer shadow-xs"
          >
            Load Parsed Messages
          </button>
        </div>
      )}

      {/* Messages Stream Preview */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:border-neutral-400 transition-colors text-left"
          >
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5 font-mono">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-neutral-950">@{msg.author}</span>
                <span>•</span>
                <span className="text-neutral-700 font-sans">{msg.platform}</span>
                <span>•</span>
                <span className="truncate max-w-[200px] font-sans">{msg.sourceCommunity}</span>
              </div>
              <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>
            </div>
            <p className="text-xs text-neutral-800 leading-relaxed font-sans">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
