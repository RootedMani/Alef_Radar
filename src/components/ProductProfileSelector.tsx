import React, { useState } from 'react';
import { Layers, Plus, Check, Volume2, ShieldAlert, Target, X } from 'lucide-react';
import { ProductProfile } from '../types';
import { Language, translations } from '../utils/i18n';

interface ProductProfileSelectorProps {
  profiles: ProductProfile[];
  activeProfile: ProductProfile;
  onSelectProfile: (profile: ProductProfile) => void;
  onAddProfile: (profile: ProductProfile) => void;
  language?: Language;
}

export const ProductProfileSelector: React.FC<ProductProfileSelectorProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onAddProfile,
  language = 'en',
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<ProductProfile>>({
    name: '',
    category: '',
    tagline: '',
    description: '',
    targetAudience: [],
    painPointsSolved: [],
    keyFeatures: [],
    toneOfVoice: 'empathic_expert',
    toneDescription: '',
    exclusionRules: [],
    pricePoint: ''
  });

  const [audienceInput, setAudienceInput] = useState('');
  const [painPointInput, setPainPointInput] = useState('');
  const [exclusionInput, setExclusionInput] = useState('');

  const isRtl = language === 'fa';
  const t = translations[language];

  const getToneLabel = (tone: string) => {
    if (language !== 'fa') return tone;
    if (tone === 'empathic_expert') return 'متخصص همدل';
    if (tone === 'friendly_peer') return 'همتای صمیمی';
    if (tone === 'consultative') return 'مشاوره‌ای';
    if (tone === 'direct_builder') return 'سازنده مستقیم';
    return tone;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.name || !newProfile.description) return;

    const fullProfile: ProductProfile = {
      id: `prof-custom-${Date.now()}`,
      name: newProfile.name,
      category: newProfile.category || (language === 'fa' ? 'محصول نرم‌افزاری' : 'SaaS / Product'),
      tagline: newProfile.tagline || (language === 'fa' ? 'پروفایل سفارشی محصول' : 'Custom Product Profile'),
      description: newProfile.description,
      targetAudience: newProfile.targetAudience?.length ? newProfile.targetAudience : ['Target prospects'],
      painPointsSolved: newProfile.painPointsSolved?.length ? newProfile.painPointsSolved : ['Inefficient workflows'],
      keyFeatures: newProfile.keyFeatures || ['Core automated feature'],
      toneOfVoice: newProfile.toneOfVoice || 'empathic_expert',
      toneDescription: newProfile.toneDescription || 'Helpful consultative expert',
      exclusionRules: newProfile.exclusionRules || ['Ignore unrelated spam'],
      pricePoint: newProfile.pricePoint || '$99'
    };

    onAddProfile(fullProfile);
    onSelectProfile(fullProfile);
    setShowCreateModal(false);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xs transition-colors"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-neutral-200/80 dark:border-white/10 gap-3">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
              {language === 'fa' ? 'مرحله ۱ // مشخصات محصول هدف' : 'STEP 1 // TARGET PRODUCT PROFILE'}
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-zinc-700" />
            <span className="text-xs font-medium text-neutral-600 dark:text-zinc-400">
              {activeProfile.category}
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white mt-1 break-words">
            {t.targetProfileTitle}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 break-words">
            {t.targetProfileSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl border border-neutral-200/80 dark:border-white/15 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-700/80 text-neutral-900 dark:text-zinc-100 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'fa' ? 'پروفایل جدید' : 'New Profile'}</span>
        </button>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {profiles.map((p) => {
          const isSelected = p.id === activeProfile.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all text-left rtl:text-right relative ${
                isSelected
                  ? 'bg-neutral-900/10 dark:bg-white/10 border-neutral-950 dark:border-white shadow-xs ring-1 ring-neutral-950 dark:ring-white backdrop-blur-md'
                  : 'glass-card hover:border-neutral-400 dark:hover:border-zinc-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-xs font-extrabold text-neutral-950 dark:text-white pr-4 rtl:pr-0 rtl:pl-4 break-words">
                  {p.name}
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-neutral-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed break-words">
                {p.tagline}
              </p>

              <div className="mt-3 pt-2.5 border-t border-neutral-200/50 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400 dark:text-zinc-500">
                <span>{p.category}</span>
                {p.pricePoint && <span className="font-bold text-neutral-900 dark:text-zinc-200">{p.pricePoint}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Profile Selected Highlights Panel */}
      <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs">
            <span className="font-bold text-neutral-900 dark:text-zinc-100">{activeProfile.name}</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-500 dark:text-zinc-400 font-mono text-[11px]">{getToneLabel(activeProfile.toneOfVoice)}</span>
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-zinc-400 font-mono">
            {language === 'fa' ? 'نرخ قیمت:' : 'Price:'} <span className="font-bold text-neutral-900 dark:text-zinc-100">{activeProfile.pricePoint || 'Custom'}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-600 dark:text-zinc-300 leading-relaxed break-words">
          {activeProfile.description}
        </p>

        {/* Pain points chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 mr-1 rtl:mr-0 rtl:ml-1 font-bold">
            {language === 'fa' ? 'نقاط درد حل‌شده:' : 'Pain Points:'}
          </span>
          {activeProfile.painPointsSolved.map((pp, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xs border border-neutral-200/80 dark:border-white/10 text-neutral-700 dark:text-zinc-300 break-words"
            >
              {pp}
            </span>
          ))}
        </div>
      </div>

      {/* MODAL: CREATE CUSTOM PROFILE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="relative w-full max-w-lg glass-modal rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowCreateModal(false)}
              className={`absolute top-5 ${isRtl ? 'left-5' : 'right-5'} p-1 rounded-lg text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-neutral-950 dark:text-white break-words">
                {language === 'fa' ? 'تعریف پروفایل محصول جدید' : 'Create Custom Product Profile'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 break-words">
                {language === 'fa'
                  ? 'ایجنت پیام‌های جوامع آنلاین را بر اساس این مشخصات بررسی کرده و پاسخ ارزش‌محور می‌نویسد.'
                  : 'Define your product value props so the agent detects exact matches and speaks in your voice.'}
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-zinc-300 mb-1">
                    {language === 'fa' ? 'نام محصول' : 'Product Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProfile.name || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    placeholder="e.g. TestCraft AI"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-zinc-300 mb-1">
                    {language === 'fa' ? 'دسته‌بندی' : 'Category'}
                  </label>
                  <input
                    type="text"
                    value={newProfile.category || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, category: e.target.value })}
                    placeholder="e.g. Developer Tools"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-zinc-300 mb-1">
                  {language === 'fa' ? 'شعار / معرفی کوتاه' : 'Tagline'}
                </label>
                <input
                  type="text"
                  value={newProfile.tagline || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, tagline: e.target.value })}
                  placeholder="e.g. Automated end-to-end tests for FastAPI backends"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-zinc-300 mb-1">
                  {language === 'fa' ? 'توضیحات و ارزش پیشنهادی' : 'Description & Value Proposition'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProfile.description || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                  placeholder="Explain exactly how your product solves user pain points..."
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-zinc-300 mb-1">
                  {language === 'fa' ? 'نقاط درد حل‌شده (با کاما جدا کنید)' : 'Pain Points Solved (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={painPointInput}
                  onChange={(e) => {
                    setPainPointInput(e.target.value);
                    setNewProfile({ ...newProfile, painPointsSolved: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Flaky tests, slow deployments, zero code coverage"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-zinc-300 mb-1">
                    {language === 'fa' ? 'لحن پاسخ ایجنت' : 'Tone of Voice'}
                  </label>
                  <select
                    value={newProfile.toneOfVoice || 'empathic_expert'}
                    onChange={(e: any) => setNewProfile({ ...newProfile, toneOfVoice: e.target.value })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    <option value="empathic_expert" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
                      {language === 'fa' ? 'متخصص همدل (Empathic Expert)' : 'Empathic Expert'}
                    </option>
                    <option value="friendly_peer" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
                      {language === 'fa' ? 'همتای صمیمی (Friendly Peer)' : 'Friendly Peer'}
                    </option>
                    <option value="consultative" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
                      {language === 'fa' ? 'مشاوره‌ای (Consultative)' : 'Consultative'}
                    </option>
                    <option value="direct_builder" className="bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
                      {language === 'fa' ? 'سازنده مستقیم (Direct Builder)' : 'Direct Builder'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-zinc-300 mb-1">
                    {language === 'fa' ? 'تعرفه قیمت' : 'Pricing Point'}
                  </label>
                  <input
                    type="text"
                    value={newProfile.pricePoint || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, pricePoint: e.target.value })}
                    placeholder="e.g. $49 / mo"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t border-neutral-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-neutral-200/80 dark:border-white/10 rounded-xl text-xs font-semibold text-neutral-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  {language === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer shadow-xs"
                >
                  {language === 'fa' ? 'ذخیره و انتخاب' : 'Save & Select'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
