import React, { useState, useRef } from 'react';
import {
  Play,
  UploadCloud,
  FileText,
  FileCode,
  Terminal,
  Plus,
  Trash2,
  Search,
  BookOpen,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  X,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { CommunityMessage, ProductProfile } from '../types';
import { programmingCourseDataset, eyeStrainGlassesDataset } from '../data/demoDatasets';
import { parseCsv, parseJson, parseRawText } from '../utils/dataParser';

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
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'benchmarks' | 'manual'>('benchmarks');
  const [searchFilter, setSearchFilter] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ message: string; isError?: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste Text state
  const [pasteContent, setPasteContent] = useState('');

  // Manual Add Form state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualPlatform, setManualPlatform] = useState<CommunityMessage['platform']>('Reddit');
  const [manualCommunity, setManualCommunity] = useState('');
  const [manualText, setManualText] = useState('');

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    setUploadStatus(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lowerName = file.name.toLowerCase();
      let result;

      if (lowerName.endsWith('.json')) {
        result = parseJson(content, file.name);
      } else if (lowerName.endsWith('.csv') || lowerName.endsWith('.tsv')) {
        result = parseCsv(content, file.name);
      } else {
        result = parseRawText(content, file.name);
      }

      if (result.errors.length > 0) {
        setUploadStatus({ message: result.errors[0], isError: true });
      } else if (result.messages.length === 0) {
        setUploadStatus({ message: 'No valid messages detected in file.', isError: true });
      } else {
        onSetMessages(result.messages);
        setUploadStatus({
          message: `Successfully imported ${result.messages.length} messages from "${file.name}"!`,
          isError: false
        });
      }
    };

    reader.onerror = () => {
      setUploadStatus({ message: 'Failed to read file from disk.', isError: true });
    };

    reader.readAsText(file);
  };

  // Paste Parsing Handler
  const handleParsePaste = () => {
    if (!pasteContent.trim()) return;
    setUploadStatus(null);

    let result;
    const trimmed = pasteContent.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      result = parseJson(trimmed, 'pasted_json.json');
    } else if (trimmed.includes(',') && trimmed.includes('\n')) {
      result = parseCsv(trimmed, 'pasted_csv.csv');
    } else {
      result = parseRawText(trimmed, 'pasted_text.txt');
    }

    if (result.messages.length === 0) {
      setUploadStatus({ message: 'Could not extract valid messages from text.', isError: true });
    } else {
      onSetMessages(result.messages);
      setUploadStatus({
        message: `Parsed and loaded ${result.messages.length} messages into the stream!`,
        isError: false
      });
      setPasteContent('');
    }
  };

  // Manual Add Message Handler
  const handleAddManualMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const newMsg: CommunityMessage = {
      id: `manual-msg-${Date.now()}`,
      author: manualAuthor.trim() || 'community_user',
      platform: manualPlatform,
      sourceCommunity: manualCommunity.trim() || 'Online Community',
      timestamp: 'Just now',
      text: manualText.trim(),
      likesOrUpvotes: Math.floor(Math.random() * 20),
      repliesCount: Math.floor(Math.random() * 8)
    };

    onSetMessages([newMsg, ...messages]);
    setManualAuthor('');
    setManualCommunity('');
    setManualText('');
    setShowManualModal(false);
    setUploadStatus({ message: 'New message added to batch!', isError: false });
  };

  const handleDeleteMessage = (id: string) => {
    onSetMessages(messages.filter((m) => m.id !== id));
  };

  const handleClearAll = () => {
    onSetMessages([]);
    setUploadStatus(null);
  };

  // Filtered view
  const filteredMessages = messages.filter((m) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      m.text.toLowerCase().includes(q) ||
      m.author.toLowerCase().includes(q) ||
      m.sourceCommunity.toLowerCase().includes(q) ||
      m.platform.toLowerCase().includes(q)
    );
  });

  // Calculate platform breakdown
  const platformCounts = messages.reduce((acc, m) => {
    acc[m.platform] = (acc[m.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Workspace Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              STEP 2 // COMMUNITY INCOMING STREAM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800">
              {messages.length} Posts Ingested
            </span>
          </div>

          <h2 className="text-xl font-black text-neutral-950 mt-1">
            Data Ingestion & Live Community Feed
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Import your own community files (CSV, JSON, text dumps), or test with pre-built benchmark datasets.
          </p>
        </div>

        {/* Primary Agent Cascade Execution Button */}
        <div className="flex items-center space-x-2 self-start lg:self-auto">
          <button
            onClick={onRunAgent}
            disabled={isLoading || messages.length === 0}
            className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-black text-white font-extrabold text-xs tracking-wider shadow-md hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isLoading
                ? 'Processing 4-Stage Cascade...'
                : `Run Radar Agent (${messages.length} Messages)`}
            </span>
          </button>
        </div>
      </div>

      {/* Ingestion Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200">
        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'benchmarks'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Benchmarks</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Import CSV / JSON File</span>
        </button>

        <button
          onClick={() => setActiveTab('paste')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'paste'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Paste Raw Text / Chats</span>
        </button>

        <button
          onClick={() => setShowManualModal(true)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 ml-auto transition-colors cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Message</span>
        </button>
      </div>

      {/* Feedback Alert Banner */}
      {uploadStatus && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            uploadStatus.isError
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {uploadStatus.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
          <button
            onClick={() => setUploadStatus(null)}
            className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB 1: CURATED BENCHMARKS */}
      {activeTab === 'benchmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => {
              onSetMessages(programmingCourseDataset);
              setUploadStatus({ message: 'Loaded Programming & Career Pivot dataset (8 messages)', isError: false });
            }}
            className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-950 bg-neutral-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase">
                BENCHMARK 01 // EDTECH & DEV
              </span>
              <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">
                Load Batch →
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-neutral-950 mb-1">
              Programming Course & Career Pivot Feeds (8 Messages)
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Scraped from Reddit r/learnprogramming, Telegram developer groups, and Discord. Contains self-taught learners in tutorial hell, syntax bugs, and crypto airdrop bots.
            </p>
          </div>

          <div
            onClick={() => {
              onSetMessages(eyeStrainGlassesDataset);
              setUploadStatus({ message: 'Loaded Eye Strain & Blue Light Eyewear dataset (8 messages)', isError: false });
            }}
            className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-950 bg-neutral-50/50 hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase">
                BENCHMARK 02 // HARDWARE & DTC
              </span>
              <span className="text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">
                Load Batch →
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-neutral-950 mb-1">
              Blue-Light Glasses & Screen Eye Strain Feeds (8 Messages)
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Scraped from Twitter/X and Reddit threads with developers and knowledge workers suffering from dry eye fatigue, temple headaches, and discount spam.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: FILE UPLOAD (CSV / TSV / JSON) */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="p-8 sm:p-10 border-2 border-dashed border-neutral-300 hover:border-black rounded-2xl bg-neutral-50 hover:bg-white transition-all text-center cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.tsv,.json,.txt"
              className="hidden"
            />
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-neutral-200 group-hover:border-black mb-3 shadow-2xs transition-colors">
              <UploadCloud className="w-6 h-6 text-neutral-700 group-hover:text-black" />
            </div>
            <h3 className="text-sm font-extrabold text-neutral-950 mb-1">
              Click to upload or drag and drop your data file
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
              Accepts <strong className="text-neutral-800">.CSV</strong>, <strong className="text-neutral-800">.JSON</strong>, or <strong className="text-neutral-800">.TSV</strong> exported from Reddit, Twitter, Discord, Telegram, or Google Sheets.
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2 text-[11px] font-mono text-neutral-400">
              <span>Automatic Column Auto-Detection</span>
              <span>•</span>
              <span>Max 5,000 rows</span>
            </div>
          </div>

          {/* Sample template hints */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-neutral-600">
              <strong className="text-neutral-900 font-bold">Supported CSV Column Headers:</strong> text, author, platform, community, timestamp (or auto-detected from row length).
            </div>
            <button
              onClick={() => {
                const sampleCsv = `author,platform,community,text\nalex_buyer,Reddit,r/learnprogramming,"I am trapped in tutorial hell for 6 months. Need 1-on-1 mentor code reviews!"\ncurious_user,Telegram,DevChat,"Does anybody know good Python backend frameworks?"\nspambot,Twitter,Deals,"Claim 5000 free tokens airdrop right now!"`;
                const parsed = parseCsv(sampleCsv, 'sample_template.csv');
                onSetMessages(parsed.messages);
                setUploadStatus({ message: 'Loaded 3 sample CSV messages!', isError: false });
              }}
              className="text-xs font-bold text-neutral-900 underline hover:text-neutral-600 whitespace-nowrap cursor-pointer"
            >
              Load Sample CSV Template
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PASTE RAW TEXT / JSON */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800">
              Paste Raw Multi-Line Messages, Chat Logs, or JSON Array:
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">
              Line breaks or JSON objects accepted
            </span>
          </div>

          <textarea
            rows={5}
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder={`Paste here, for example:\n[Reddit] @dev_mike: I've been stuck in tutorial hell for 4 months, need structured mentor code reviews.\n[Telegram] @crypto_bot: Claim 5000 free coins on our site!\nOr paste a JSON array: [{"text": "My eyes hurt after 10 hours of screen work...", "author": "sara"}]`}
            className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl p-4 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              {pasteContent.trim().length > 0 ? `${pasteContent.split('\n').filter(Boolean).length} lines detected` : ''}
            </span>
            <button
              onClick={handleParsePaste}
              disabled={!pasteContent.trim()}
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-xs"
            >
              Parse & Ingest Messages
            </button>
          </div>
        </div>
      )}

      {/* INGESTED STREAM PREVIEW & MANAGEMENT TABLE */}
      <div className="border border-neutral-200 rounded-2xl overflow-hidden">
        
        {/* Sub-bar with Platform Breakdown and Search */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-neutral-600 mr-1">Platforms:</span>
            {Object.entries(platformCounts).map(([platform, count]) => (
              <span
                key={platform}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white border border-neutral-200 text-neutral-800 shadow-2xs"
              >
                {platform}: {count}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search batch..."
                className="w-40 sm:w-48 bg-white border border-neutral-300 rounded-lg py-1 pl-8 pr-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black font-sans"
              />
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                title="Clear entire batch"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Message Cards Scroll Area */}
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-neutral-300" />
            <p className="text-xs font-semibold">No messages loaded in this stream.</p>
            <p className="text-[11px] text-neutral-400">Choose a benchmark above or upload your CSV/JSON data.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
            {filteredMessages.map((msg, idx) => (
              <div
                key={msg.id}
                className="p-4 hover:bg-neutral-50/80 transition-colors flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-neutral-950">@{msg.author}</span>
                    <span className="px-1.5 py-0.2 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 text-[10px] font-sans">
                      {msg.platform}
                    </span>
                    <span className="text-neutral-500 text-[11px] font-sans truncate max-w-[240px]">
                      {msg.sourceCommunity}
                    </span>
                    <span className="text-[10px] text-neutral-400 ml-auto mr-2">
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-800 leading-relaxed font-sans pr-2">
                    {msg.text}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-all cursor-pointer self-start shrink-0"
                  title="Remove message from batch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD MANUAL CUSTOM MESSAGE */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <button
              onClick={() => setShowManualModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-neutral-950">Add Individual Post</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Insert a single community message to test how the agent handles specific wording.
              </p>
            </div>

            <form onSubmit={handleAddManualMessage} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Author / Handle</label>
                  <input
                    type="text"
                    value={manualAuthor}
                    onChange={(e) => setManualAuthor(e.target.value)}
                    placeholder="e.g. david_founder"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Platform</label>
                  <select
                    value={manualPlatform}
                    onChange={(e) => setManualPlatform(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2 text-xs text-neutral-900 focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Reddit">Reddit</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Discord">Discord</option>
                    <option value="Twitter/X">Twitter/X</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Forum">Forum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Source Community / Channel</label>
                <input
                  type="text"
                  value={manualCommunity}
                  onChange={(e) => setManualCommunity(e.target.value)}
                  placeholder="e.g. r/learnprogramming or Telegram Tech Group"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Message Text</label>
                <textarea
                  required
                  rows={4}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste or write the exact prospect message here..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer shadow-xs mt-2"
              >
                Insert Message into Stream
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
