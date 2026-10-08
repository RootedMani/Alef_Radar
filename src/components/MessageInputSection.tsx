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
import {
  programmingCourseDataset,
  eyeStrainGlassesDataset,
  programmingCourseDatasetFa,
  eyeStrainGlassesDatasetFa
} from '../data/demoDatasets';
import { parseCsv, parseJson, parseRawText } from '../utils/dataParser';
import { Language, translations } from '../utils/i18n';

interface MessageInputSectionProps {
  messages: CommunityMessage[];
  onSetMessages: (msgs: CommunityMessage[]) => void;
  onRunAgent: () => void;
  isLoading: boolean;
  activeProfile: ProductProfile;
  language?: Language;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  messages,
  onSetMessages,
  onRunAgent,
  isLoading,
  activeProfile,
  language = 'en',
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

  const t = translations[language];
  const isRtl = language === 'fa';

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
        setUploadStatus({
          message: language === 'fa' ? 'هیچ پیام معتبری در فایل شناسایی نشد.' : 'No valid messages detected in file.',
          isError: true
        });
      } else {
        onSetMessages(result.messages);
        setUploadStatus({
          message: language === 'fa'
            ? `با موفقیت ${result.messages.length} پیام از فایل "${file.name}" بارگذاری شد!`
            : `Successfully imported ${result.messages.length} messages from "${file.name}"!`,
          isError: false
        });
      }
    };

    reader.onerror = () => {
      setUploadStatus({
        message: language === 'fa' ? 'خطا در خواندن فایل از حافظه.' : 'Failed to read file from disk.',
        isError: true
      });
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
      setUploadStatus({
        message: language === 'fa' ? 'پیام معتبری از متن وارد شده شناسایی نشد.' : 'Could not extract valid messages from text.',
        isError: true
      });
    } else {
      onSetMessages(result.messages);
      setUploadStatus({
        message: language === 'fa'
          ? `${result.messages.length} پیام تجزیه و در جریان چت وارد شد!`
          : `Parsed and loaded ${result.messages.length} messages into the stream!`,
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
      author: manualAuthor.trim() || (language === 'fa' ? 'کاربر_جامعه' : 'community_user'),
      platform: manualPlatform,
      sourceCommunity: manualCommunity.trim() || (language === 'fa' ? 'جامعه آنلاین' : 'Online Community'),
      timestamp: language === 'fa' ? 'همین الان' : 'Just now',
      text: manualText.trim(),
      likesOrUpvotes: Math.floor(Math.random() * 20),
      repliesCount: Math.floor(Math.random() * 8)
    };

    onSetMessages([newMsg, ...messages]);
    setManualAuthor('');
    setManualCommunity('');
    setManualText('');
    setShowManualModal(false);
    setUploadStatus({
      message: language === 'fa' ? 'پیام جدید با موفقیت به جریان افزوده شد!' : 'New message added to batch!',
      isError: false
    });
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
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors"
    >
      {/* Workspace Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-neutral-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
              {t.step2StreamLabel}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-neutral-800 dark:text-zinc-200">
              {messages.length} {t.loadedPosts}
            </span>
          </div>

          <h2 className="text-xl font-black text-neutral-950 dark:text-white mt-1">
            {t.feedTitle}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">
            {t.feedSubtitle}
          </p>
        </div>

        {/* Primary Agent Cascade Execution Button */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse w-full sm:w-auto lg:self-auto">
          <button
            onClick={onRunAgent}
            disabled={isLoading || messages.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 rtl:space-x-reverse px-6 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs tracking-wider shadow-md hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isLoading
                ? t.agentRunning
                : `${t.runAgentBtn} (${messages.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Ingestion Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-100 dark:bg-zinc-800/80 rounded-2xl border border-neutral-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'benchmarks'
              ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t.benchmarksTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>{t.uploadTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('paste')}
          className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'paste'
              ? 'bg-white dark:bg-zinc-900 text-neutral-950 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{t.pasteTab}</span>
        </button>

        <button
          onClick={() => setShowManualModal(true)}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-bold border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer shadow-2xs ${
            isRtl ? 'mr-auto' : 'ml-auto'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addMessageBtn}</span>
        </button>
      </div>

      {/* Feedback Alert Banner */}
      {uploadStatus && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            uploadStatus.isError
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
          }`}
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {uploadStatus.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
          <button
            onClick={() => setUploadStatus(null)}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-0.5"
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
              const dataset = language === 'fa' ? programmingCourseDatasetFa : programmingCourseDataset;
              onSetMessages(dataset);
              setUploadStatus({
                message: language === 'fa' ? 'فید دوره‌های برنامه‌نویسی و پایتون (۸ پیام فارسی) بارگذاری شد.' : 'Loaded Programming & Career Pivot dataset (8 messages)',
                isError: false
              });
            }}
            className="p-5 rounded-2xl border border-neutral-200 dark:border-zinc-800 hover:border-neutral-950 dark:hover:border-white bg-neutral-50/50 dark:bg-zinc-950/40 hover:bg-white dark:hover:bg-zinc-900 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-neutral-500 dark:text-zinc-400 uppercase">
                {t.benchmark01Badge}
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                {t.loadBatchBtn}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-1">
              {t.benchmark01Title}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
              {t.benchmark01Desc}
            </p>
          </div>

          <div
            onClick={() => {
              const dataset = language === 'fa' ? eyeStrainGlassesDatasetFa : eyeStrainGlassesDataset;
              onSetMessages(dataset);
              setUploadStatus({
                message: language === 'fa' ? 'فید خستگی چشم و عینک بلوکنترل (۸ پیام فارسی) بارگذاری شد.' : 'Loaded Eye Strain & Blue Light Eyewear dataset (8 messages)',
                isError: false
              });
            }}
            className="p-5 rounded-2xl border border-neutral-200 dark:border-zinc-800 hover:border-neutral-950 dark:hover:border-white bg-neutral-50/50 dark:bg-zinc-950/40 hover:bg-white dark:hover:bg-zinc-900 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-neutral-500 dark:text-zinc-400 uppercase">
                {t.benchmark02Badge}
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                {t.loadBatchBtn}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-1">
              {t.benchmark02Title}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
              {t.benchmark02Desc}
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
            className="p-8 sm:p-10 border-2 border-dashed border-neutral-300 dark:border-zinc-700 hover:border-black dark:hover:border-white rounded-2xl bg-neutral-50 dark:bg-zinc-950/50 hover:bg-white dark:hover:bg-zinc-900 transition-all text-center cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.tsv,.json,.txt"
              className="hidden"
            />
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 group-hover:border-black dark:group-hover:border-white mb-3 shadow-2xs transition-colors">
              <UploadCloud className="w-6 h-6 text-neutral-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white" />
            </div>
            <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white mb-1">
              {t.uploadTitle}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              {t.uploadDesc}
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2 rtl:space-x-reverse text-[11px] font-mono text-neutral-400 dark:text-zinc-500">
              <span>{t.uploadSub}</span>
            </div>
          </div>

          {/* Sample template hints */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-neutral-600 dark:text-zinc-400">
              {t.sampleTemplateHint}
            </div>
            <button
              onClick={() => {
                const sampleCsv = `author,platform,community,text\nalex_buyer,Reddit,r/learnprogramming,"I am trapped in tutorial hell for 6 months. Need 1-on-1 mentor code reviews!"\ncurious_user,Telegram,DevChat,"Does anybody know good Python backend frameworks?"\nspambot,Twitter,Deals,"Claim 5000 free tokens airdrop right now!"`;
                const parsed = parseCsv(sampleCsv, 'sample_template.csv');
                onSetMessages(parsed.messages);
                setUploadStatus({
                  message: language === 'fa' ? '۳ پیام نمونه از قالب CSV بارگذاری شد!' : 'Loaded 3 sample CSV messages!',
                  isError: false
                });
              }}
              className="text-xs font-bold text-neutral-900 dark:text-white underline hover:text-neutral-600 dark:hover:text-zinc-300 whitespace-nowrap cursor-pointer"
            >
              {t.loadSampleTemplateBtn}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PASTE RAW TEXT / JSON */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-zinc-200">
              {t.pasteLabel}
            </label>
            <span className="text-[11px] text-neutral-400 dark:text-zinc-500 font-mono">
              {t.pasteSub}
            </span>
          </div>

          <textarea
            rows={5}
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder={
              language === 'fa'
                ? `متن پیام‌ها را اینجا بچسبانید، برای نمونه:\n[تلگرام] @reza: دنبال یک دوره پایتون با منتور ارشد و بررسی کد هستم.\n[ردیت] @spambot: دریافت ایردراپ رایگان در کانال ما!\nیا آرایه JSON وارد کنید: [{"text": "چشمانم بعد از ۱۰ ساعت کار با مانیتور می‌سوزد...", "author": "سارا"}]`
                : `Paste here, for example:\n[Reddit] @dev_mike: I've been stuck in tutorial hell for 4 months, need structured mentor code reviews.\n[Telegram] @crypto_bot: Claim 5000 free coins on our site!\nOr paste a JSON array: [{"text": "My eyes hurt after 10 hours of screen work...", "author": "sara"}]`
            }
            className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-300 dark:border-zinc-700 rounded-2xl p-4 text-xs font-mono text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 dark:placeholder-zinc-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-zinc-400">
              {pasteContent.trim().length > 0 ? `${pasteContent.split('\n').filter(Boolean).length} ${language === 'fa' ? 'خط شناسایی شد' : 'lines detected'}` : ''}
            </span>
            <button
              onClick={handleParsePaste}
              disabled={!pasteContent.trim()}
              className="px-5 py-2.5 bg-black dark:bg-white hover:opacity-90 text-white dark:text-black text-xs font-bold rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-xs"
            >
              {t.parseIngestBtn}
            </button>
          </div>
        </div>
      )}

      {/* INGESTED STREAM PREVIEW & MANAGEMENT TABLE */}
      <div className="border border-neutral-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        
        {/* Sub-bar with Platform Breakdown and Search */}
        <div className="p-4 bg-neutral-50 dark:bg-zinc-950/60 border-b border-neutral-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-neutral-600 dark:text-zinc-400 mr-1 rtl:ml-1 rtl:mr-0">
              {language === 'fa' ? 'پلتفرم‌ها:' : 'Platforms:'}
            </span>
            {Object.entries(platformCounts).map(([platform, count]) => (
              <span
                key={platform}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-neutral-800 dark:text-zinc-200 shadow-2xs"
              >
                {platform}: {count}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute ${isRtl ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500`} />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={t.searchBatchPlaceholder}
                className={`w-40 sm:w-48 bg-white dark:bg-zinc-900 border border-neutral-300 dark:border-zinc-700 rounded-lg py-1 ${isRtl ? 'pr-8 pl-2.5' : 'pl-8 pr-2.5'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 dark:placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white font-sans`}
              />
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-500 dark:text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                title={language === 'fa' ? 'پاکسازی کامل این بسته' : 'Clear entire batch'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Message Cards Scroll Area */}
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 dark:text-zinc-500 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-neutral-300 dark:text-zinc-700" />
            <p className="text-xs font-semibold">{t.noMessagesLoaded}</p>
            <p className="text-[11px] text-neutral-400 dark:text-zinc-500">{t.noMessagesSub}</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-zinc-800 max-h-96 overflow-y-auto">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 hover:bg-neutral-100/70 dark:hover:bg-zinc-800/60 transition-colors flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-neutral-950 dark:text-white">@{msg.author}</span>
                    <span className="px-1.5 py-0.2 rounded border border-neutral-200 dark:border-zinc-700 bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 text-[10px] font-sans">
                      {msg.platform}
                    </span>
                    <span className="text-neutral-500 dark:text-zinc-400 text-[11px] font-sans truncate max-w-[240px]">
                      {msg.sourceCommunity}
                    </span>
                    <span className={`text-[10px] text-neutral-400 dark:text-zinc-500 ${isRtl ? 'mr-auto ml-2' : 'ml-auto mr-2'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-800 dark:text-zinc-200 leading-relaxed font-sans pr-2 rtl:pr-0 rtl:pl-2">
                    {msg.text}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-neutral-400 dark:text-zinc-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all cursor-pointer self-start shrink-0"
                  title={language === 'fa' ? 'حذف پیام از بسته' : 'Remove message from batch'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl transition-colors">
            <button
              onClick={() => setShowManualModal(false)}
              className={`absolute top-5 ${isRtl ? 'left-5' : 'right-5'} p-1 rounded-lg text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-neutral-950 dark:text-white">{t.addModalTitle}</h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">
                {t.addModalDesc}
              </p>
            </div>

            <form onSubmit={handleAddManualMessage} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">{t.authorLabel}</label>
                  <input
                    type="text"
                    value={manualAuthor}
                    onChange={(e) => setManualAuthor(e.target.value)}
                    placeholder={language === 'fa' ? 'مثال: علی_بنیانگذار' : 'e.g. david_founder'}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-700 rounded-xl p-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">{t.platformLabel}</label>
                  <select
                    value={manualPlatform}
                    onChange={(e) => setManualPlatform(e.target.value as any)}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-700 rounded-xl p-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer"
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
                <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">{t.communityLabel}</label>
                <input
                  type="text"
                  value={manualCommunity}
                  onChange={(e) => setManualCommunity(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: r/learnprogramming یا گروه تلگرام توسعه‌دهندگان' : 'e.g. r/learnprogramming or Telegram Tech Group'}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-700 rounded-xl p-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1">{t.messageTextLabel}</label>
                <textarea
                  required
                  rows={4}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={language === 'fa' ? 'متن دقیق پیام مخاطب را اینجا بنویسید یا بچسبانید...' : 'Paste or write the exact prospect message here...'}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black dark:bg-white hover:opacity-90 text-white dark:text-black text-xs font-extrabold rounded-xl transition-colors cursor-pointer shadow-xs mt-2"
              >
                {t.insertMessageBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
