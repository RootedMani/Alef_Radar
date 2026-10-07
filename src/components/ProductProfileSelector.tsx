import React, { useState } from 'react';
import { Layers, Plus, Check, Volume2, ShieldAlert, Sparkles, Target, Zap, Edit3 } from 'lucide-react';
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
      painPointsSolved: newProfile.painPointsSolved?.length ? newProfile.painPointsSolved : ['Inefficient workflows'],
      keyFeatures: newProfile.keyFeatures || ['Core automated feature'],
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <span>{isPersian ? 'پروفایل محصول فعال (Target Product Profile)' : 'Active Product Profile'}</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {activeProfile.category}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPersian
                ? 'ایجنت بر اساس این پروفایل تصمیم می‌گیرد کدام پیام‌ها مرتبط، واجد شرایط و لایق پیشنهاد پاسخ هستند.'
                : 'The agent uses this profile to evaluate contextual fit and generate tailor-made responses.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isPersian ? 'ساخت پروفایل جدید' : 'New Product Profile'}</span>
        </button>
      </div>

      {/* Profiles Switcher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {profiles.map((p) => {
          const isSelected = p.id === activeProfile.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all text-left rtl:text-right relative ${
                isSelected
                  ? 'bg-slate-850 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="text-xs font-bold text-slate-100 pr-6 rtl:pr-0 rtl:pl-6">{p.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {p.tagline}
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                <span>{p.pricePoint || 'Standard Tier'}</span>
                <span className="capitalize text-emerald-400/80">{p.toneOfVoice.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Profile Expanded Specifications */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-emerald-400 mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>{isPersian ? 'مخاطبان هدف و نقاط درد حل‌شده:' : 'Target Audience & Pain Points Solved:'}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activeProfile.painPointsSolved.map((pp, i) => (
                <li key={i} className="flex items-start space-x-1.5 rtl:space-x-reverse">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{pp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-amber-400 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isPersian ? 'قوانین منع و حذف (Exclusion Rules):' : 'Exclusion Rules (Spam Prevention):'}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {activeProfile.exclusionRules.map((ex, i) => (
                <li key={i} className="flex items-start space-x-1.5 rtl:space-x-reverse">
                  <span className="text-amber-500 mt-0.5">✕</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-400">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-300">{isPersian ? 'لحن پاسخ:' : 'Tone of Voice:'}</span>
              <span className="text-cyan-300 capitalize">{activeProfile.toneOfVoice.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-4">
              {isPersian ? 'تعریف پروفایل محصول جدید' : 'Create Custom Product Profile'}
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isPersian ? 'نام محصول' : 'Product Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newProfile.name || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="e.g. CodeForge AI Mentor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isPersian ? 'شعار / توضیح کوتاه' : 'Tagline'}
                </label>
                <input
                  type="text"
                  value={newProfile.tagline || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, tagline: e.target.value })}
                  placeholder="e.g. AI-driven test generator for Go developers"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isPersian ? 'توضیحات جامع محصول' : 'Full Description & Value Proposition'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProfile.description || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                  placeholder="Explain exactly how your product solves user problems..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isPersian ? 'مخاطبان هدف (با کاما جدا کنید)' : 'Target Audience (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={audienceInput}
                  onChange={(e) => {
                    setAudienceInput(e.target.value);
                    setNewProfile({ ...newProfile, targetAudience: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Junior devs, career changers, bootcamp grads"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isPersian ? 'نقاط درد حل‌شده (با کاما جدا کنید)' : 'Pain Points Solved (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={painPointInput}
                  onChange={(e) => {
                    setPainPointInput(e.target.value);
                    setNewProfile({ ...newProfile, painPointsSolved: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Tutorial hell, no code reviews, fear of blank screen"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isPersian ? 'قوانین عدم پاسخ و نادیده گرفتن (Exclusion Rules)' : 'Exclusion Rules'}
                </label>
                <input
                  type="text"
                  value={exclusionInput}
                  onChange={(e) => {
                    setExclusionInput(e.target.value);
                    setNewProfile({ ...newProfile, exclusionRules: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Do not pitch to senior architects, skip spam bots"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPersian ? 'لحن پاسخ ایجنت' : 'Tone of Voice'}
                  </label>
                  <select
                    value={newProfile.toneOfVoice || 'empathic_expert'}
                    onChange={(e: any) => setNewProfile({ ...newProfile, toneOfVoice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="empathic_expert">Empathic Expert (همدل و متخصص)</option>
                    <option value="friendly_peer">Friendly Peer (دوستانه و هم‌سطح)</option>
                    <option value="consultative">Consultative (مشاوره‌ای)</option>
                    <option value="direct_builder">Direct Builder (عملیاتی و سریع)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPersian ? 'قیمت یا مدل فروش' : 'Pricing Tier / Hook'}
                  </label>
                  <input
                    type="text"
                    value={newProfile.pricePoint || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, pricePoint: e.target.value })}
                    placeholder="e.g. $49/mo or Free Trial"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  {isPersian ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isPersian ? 'ذخیره و فعال‌سازی' : 'Save & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
