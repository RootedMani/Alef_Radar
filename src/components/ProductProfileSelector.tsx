import React, { useState } from 'react';
import { Layers, Plus, Check, Volume2, ShieldAlert, Target, X } from 'lucide-react';
import { ProductProfile } from '../types';

interface ProductProfileSelectorProps {
  profiles: ProductProfile[];
  activeProfile: ProductProfile;
  onSelectProfile: (profile: ProductProfile) => void;
  onAddProfile: (profile: ProductProfile) => void;
}

export const ProductProfileSelector: React.FC<ProductProfileSelectorProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onAddProfile,
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
      category: newProfile.category || 'SaaS / Product',
      tagline: newProfile.tagline || 'Custom Product Profile',
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
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-neutral-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              STEP 1 // TARGET PRODUCT PROFILE
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="text-xs font-medium text-neutral-600">
              {activeProfile.category}
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-neutral-950 mt-1">
            Choose What You Are Pitching
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            The agent reads this profile to evaluate contextual fit and generate tailor-made responses.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-900 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Profile</span>
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
              className={`cursor-pointer rounded-xl p-4 border transition-all text-left relative ${
                isSelected
                  ? 'bg-neutral-50 border-neutral-950 shadow-xs ring-1 ring-neutral-950'
                  : 'bg-white border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-xs font-extrabold text-neutral-950 pr-4">
                  {p.name}
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                {p.tagline}
              </p>

              <div className="mt-3 pt-2.5 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>{p.pricePoint || 'Standard Tier'}</span>
                <span className="capitalize">{p.toneOfVoice.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Profile Summary Box */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 font-bold text-neutral-950 mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Pain Points Solved:</span>
            </div>
            <ul className="space-y-1.5 text-neutral-600">
              {activeProfile.painPointsSolved.map((pp, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="font-bold text-neutral-400">•</span>
                  <span>{pp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-1.5 font-bold text-neutral-950 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Strict Exclusion Rules (Spam Prevention):</span>
            </div>
            <ul className="space-y-1.5 text-neutral-500">
              {activeProfile.exclusionRules.map((ex, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span>✕</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center space-x-2 text-neutral-500">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Tone of Voice:</span>
              <span className="font-semibold text-neutral-800 capitalize">
                {activeProfile.toneOfVoice.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-neutral-400 hover:text-neutral-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-neutral-950 mb-4">
              Create Custom Product Profile
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newProfile.name || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="e.g. CodeForge AI Mentor"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={newProfile.tagline || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, tagline: e.target.value })}
                  placeholder="e.g. AI-driven test generator for Go engineers"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description & Value Proposition
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProfile.description || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                  placeholder="Explain exactly how your product solves user pain points..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Pain Points Solved (comma-separated)
                </label>
                <input
                  type="text"
                  value={painPointInput}
                  onChange={(e) => {
                    setPainPointInput(e.target.value);
                    setNewProfile({ ...newProfile, painPointsSolved: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Tutorial hell, no code reviews, lack of confidence"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Strict Exclusion Rules (comma-separated)
                </label>
                <input
                  type="text"
                  value={exclusionInput}
                  onChange={(e) => {
                    setExclusionInput(e.target.value);
                    setNewProfile({ ...newProfile, exclusionRules: e.target.value.split(',').map((s) => s.trim()) });
                  }}
                  placeholder="e.g. Do not pitch to senior architects, skip trivial syntax questions"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tone of Voice
                  </label>
                  <select
                    value={newProfile.toneOfVoice || 'empathic_expert'}
                    onChange={(e: any) => setNewProfile({ ...newProfile, toneOfVoice: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none"
                  >
                    <option value="empathic_expert">Empathic Expert</option>
                    <option value="friendly_peer">Friendly Peer</option>
                    <option value="consultative">Consultative</option>
                    <option value="direct_builder">Direct Builder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Pricing Point
                  </label>
                  <input
                    type="text"
                    value={newProfile.pricePoint || ''}
                    onChange={(e) => setNewProfile({ ...newProfile, pricePoint: e.target.value })}
                    placeholder="e.g. $490 / cohort"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-xs"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
