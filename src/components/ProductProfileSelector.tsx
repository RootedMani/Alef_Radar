import React, { useState } from 'react';
import { Layers, Plus, Check, Volume2, ShieldAlert, Target, X } from 'lucide-react';
import { ProductProfile } from '../types';

interface ProductProfileSelectorProps {
  profiles: ProductProfile[];
  activeProfile: ProductProfile;
  onSelectProfile: (profile: ProductProfile) => void;
  onAddProfile: (profile: ProductProfile) => void;
  isPersian: boolean;
}

export const ProductProfileSelector: React.FC<ProductProfileSelectorProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onAddProfile,
  isPersian,
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.name || !newProfile.description) return;

    const fullProfile: ProductProfile = {
      id: `prof-custom-${Date.now()}`,
      name: newProfile.name,
      category: newProfile.category || 'General SaaS / Product',
      tagline: newProfile.tagline || 'Custom Product Profile',
      description: newProfile.description,
      targetAudience: newProfile.targetAudience?.length ? newProfile.targetAudience : ['Target users seeking solution'],
      painPointsSolved: newProfile.painPointsSolved?.length ? newProfile.painPointsSolved : ['Manual workflow bottleneck'],
      keyFeatures: newProfile.keyFeatures || ['Core autonomous feature'],
      toneOfVoice: newProfile.toneOfVoice || 'empathic_expert',
      toneDescription: newProfile.toneDescription || 'Helpful, consultative expert',
      exclusionRules: newProfile.exclusionRules || ['Ignore unrelated spam'],
      pricePoint: newProfile.pricePoint || '$99'
    };

    onAddProfile(fullProfile);
    onSelectProfile(fullProfile);
    setShowCreateModal(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm transition-colors">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-neutral-200 dark:border-neutral-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              01 // Configuration
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-400" />
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {activeProfile.category}
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
            {isPersian ? 'پروفایل محصول هدف' : 'Active Product Profile'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isPersian
              ? 'معیار تصمیم‌گیری ایجنت در تشخیص تناسب نیاز مخاطب با ارزش محصول'
              : 'Used by the agent to calculate fit scores and tailor high-intent responses.'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isPersian ? 'افزودن پروفایل جدید' : 'New Profile'}</span>
        </button>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {profiles.map((p) => {
          const isSelected = p.id === activeProfile.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className={`cursor-pointer rounded-xl p-4 border transition-all text-left rtl:text-right relative ${
                isSelected
                  ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-950 dark:border-white shadow-sm ring-1 ring-neutral-950 dark:ring-white'
                  : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-xs font-extrabold text-neutral-900 dark:text-white pr-4 rtl:pr-0 rtl:pl-4">
                  {p.name}
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                {p.tagline}
              </p>

              <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                <span>{p.pricePoint || 'Standard'}</span>
                <span className="capitalize">{p.toneOfVoice.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Specs of Selected Profile */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-neutral-900 dark:text-white mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>{isPersian ? 'نقاط درد حل‌شده توسط محصول:' : 'Pain Points Solved:'}</span>
            </div>
            <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-300">
              {activeProfile.painPointsSolved.map((pp, i) => (
                <li key={i} className="flex items-start space-x-1.5 rtl:space-x-reverse">
                  <span className="font-bold text-neutral-400">•</span>
                  <span>{pp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-neutral-900 dark:text-white mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isPersian ? 'قوانین رد و عدم پیشنهاد (Exclusion Rules):' : 'Exclusion Rules (Anti-Spam):'}</span>
            </div>
            <ul className="space-y-1.5 text-neutral-500 dark:text-neutral-400">
              {activeProfile.exclusionRules.map((ex, i) => (
                <li key={i} className="flex items-start space-x-1.5 rtl:space-x-reverse">
                  <span>✕</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center space-x-2 rtl:space-x-reverse text-neutral-500 dark:text-neutral-400">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPersian ? 'لحن پاسخ ایجنت: ' : 'Tone: '}</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                {activeProfile.toneOfVoice.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Creating New Profile */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white mb-4">
              {isPersian ? 'تعریف پروفایل محصول جدید' : 'Create Product Profile'}
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isPersian ? 'نام محصول' : 'Product Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newProfile.name || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="e.g. NextPrompt SaaS"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isPersian ? 'شعار / معرفی کوتاه' : 'Tagline'}
                </label>
                <input
                  type="text"
                  value={newProfile.tagline || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, tagline: e.target.value })}
                  placeholder="e.g. Autonomous AI test generator for developers"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isPersian ? 'توضیحات جامع ارزش محصول' : 'Value Proposition Description'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProfile.description || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                  placeholder="Explain exactly how your product solves user pain points..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isPersian ? 'نقاط درد حل‌شده (با کاما جدا کنید)' : 'Pain Points Solved (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={painPointInput}
                  onChange={(e) => {
                    setPainPointInput(e.target.value);
                    setNewProfile({ ...newProfile, painPointsSolved: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Stuck in tutorial hell, no code reviews"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isPersian ? 'قوانین رد و منع پاسخ (Exclusion Rules)' : 'Exclusion Rules'}
                </label>
                <input
                  type="text"
                  value={exclusionInput}
                  onChange={(e) => {
                    setExclusionInput(e.target.value);
                    setNewProfile({ ...newProfile, exclusionRules: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Skip spam bots, ignore unrelated topics"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isPersian ? 'لحن پاسخ' : 'Tone'}
                  </label>
                  <select
                    value={newProfile.toneOfVoice || 'empathic_expert'}
                    onChange={(e: any) => setNewProfile({ ...newProfile, toneOfVoice: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="empathic_expert">Empathic Expert</option>
                    <option value="friendly_peer">Friendly Peer</option>
                    <option value="consultative">Consultative</option>
                    <option value="direct_builder">Direct Builder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isPersian ? 'تعرفه / قیمت' : 'Pricing Tier'}
                  </label>
                  <input
                    type="text"
                    value={newProfile.pricePoint || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, pricePoint: e.target.value })}
                    placeholder="e.g. $49/mo"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  {isPersian ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold shadow-sm hover:opacity-90"
                >
                  {isPersian ? 'ذخیره و فعال‌سازی' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
