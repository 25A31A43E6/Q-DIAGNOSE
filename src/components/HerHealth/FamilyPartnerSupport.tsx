import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Check, 
  Copy, 
  Info, 
  Sparkles, 
  Smile, 
  HelpCircle 
} from 'lucide-react';
import { HerHealthSharingConsent, PeriodEntry, MoodLog } from './types';

interface FamilyPartnerSupportProps {
  consent: HerHealthSharingConsent;
  onUpdateConsent: (newConsent: HerHealthSharingConsent) => void;
  latestCycle?: PeriodEntry;
  latestMood?: MoodLog;
}

export const FamilyPartnerSupport: React.FC<FamilyPartnerSupportProps> = ({
  consent,
  onUpdateConsent,
  latestCycle,
  latestMood,
}) => {
  const [partnerName, setPartnerName] = useState(consent.partnerName || 'Sanjay Roy');
  const [shareCycle, setShareCycle] = useState(consent.shareCycleSummary);
  const [shareMood, setShareMood] = useState(consent.shareMoodSummary);
  const [copied, setCopied] = useState(false);

  const handleSaveConsent = () => {
    onUpdateConsent({
      ...consent,
      partnerName,
      shareCycleSummary: shareCycle,
      shareMoodSummary: shareMood,
      lastUpdated: new Date().toLocaleDateString(),
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://qdiagnose.app/partner-view?key=${consent.partnerAccessKey || 'HER-PARTNER-7729'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="herhealth-family-partner-support" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Family & Partner Empathy & Support</h2>
          </div>
          <p className="text-xs text-slate-600">
            Educational guidance to help partners and families understand biological cycles, mood transitions, and offer compassionate practical support.
          </p>
        </div>
      </div>

      {/* Consent-Based Partner Summary Card */}
      <div className="bg-gradient-to-br from-orange-50/70 via-white to-rose-50/40 p-6 rounded-3xl border border-orange-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-bold text-[#0B1E3D]">Consent-Controlled Partner Snapshot</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Explicit User Consent Only</span>
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          You are in complete control of what information is shared. Generate a read-only empathy summary card that your partner can view to understand what self-care you might appreciate right now.
        </p>

        {/* Live Shared Card Preview */}
        <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-bold text-xs text-[#0B1E3D]">
              Partner Health Empathy Card (Prepared for {partnerName})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Access Key: {consent.partnerAccessKey}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-700 block">Cycle Phase Context:</span>
              <span className="text-slate-600">
                {shareCycle ? 'Currently in Follicular/Luteal transition. May appreciate lower screen time and quiet resting space.' : 'Cycle sharing disabled by user.'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-700 block">Suggested Supportive Actions:</span>
              <span className="text-slate-600">
                {shareMood ? 'Warm chamomile tea, preparing a nourishing iron-rich meal, and active listening without trying to "fix" emotions.' : 'Mood sharing disabled by user.'}
              </span>
            </div>
          </div>
        </div>

        {/* Consent Switches */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-orange-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shareCycle}
                onChange={(e) => setShareCycle(e.target.checked)}
                className="rounded accent-orange-600"
              />
              <span className="font-semibold text-slate-700">Share Cycle Phase</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shareMood}
                onChange={(e) => setShareMood(e.target.checked)}
                className="rounded accent-orange-600"
              />
              <span className="font-semibold text-slate-700">Share Mood Context</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Partner Summary Link'}</span>
            </button>
            <button
              onClick={handleSaveConsent}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>

      {/* 3 Practical Support Educational Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Understanding Menstrual Pain & Mood */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0B1E3D]">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>The Science of Mood Shifts</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hormonal changes in the luteal phase (estrogen decline) directly affect serotonin synthesis in the brain. Irritability, fatigue, or sensitivity are neurochemical, not deliberate hostility.
          </p>
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-900 space-y-1">
            <strong>What Helps:</strong>
            <p className="text-slate-600">Avoid saying "Are you on your period?". Instead ask: "How can I make your evening easier today?"</p>
          </div>
        </div>

        {/* Practical Empathy & Household Support */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0B1E3D]">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Practical Domestic Assistance</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Physical cramping and fatigue make bending, cooking, or managing chores exhausting. Unprompted proactive assistance relieves cognitive and physical load.
          </p>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-900 space-y-1">
            <strong>What Helps:</strong>
            <p className="text-slate-600">Refill hot water bottles, restock sanitary products, ensure favorite snacks and hydration are on hand.</p>
          </div>
        </div>

        {/* PCOD & Menopause Empathy */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0B1E3D]">
            <Users className="w-4 h-4 text-teal-600" />
            <span>PCOD & Menopause Support</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conditions like PCOD and perimenopause can induce body image anxiety, vasomotor night sweats, and brain fog. Partner validation is clinically shown to reduce depressive distress.
          </p>
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-900 space-y-1">
            <strong>What Helps:</strong>
            <p className="text-slate-600">Encourage joyful joint walking, accompany to doctor visits when requested, and celebrate non-scale health wins.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
