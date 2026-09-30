import React, { useState } from 'react';
import { 
  Settings, 
  Languages, 
  Type, 
  Volume2, 
  ShieldCheck, 
  Eye, 
  Atom, 
  Check, 
  Lock, 
  Heart,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface PatientSettingsViewProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenAssistantInCalmMode: () => void;
}

export const PatientSettingsView: React.FC<PatientSettingsViewProps> = ({
  language,
  onLanguageChange,
  onOpenAssistantInCalmMode,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [voicePromptsEnabled, setVoicePromptsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [caregiverConsent, setCaregiverConsent] = useState(true);

  const languagesList: Array<{ code: SupportedLanguage; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <div id="patient-settings-view" className="space-y-8 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Settings className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0B1E3D]">{t.settingsTitle}</h1>
            <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
              Personalize language, accessibility, voice guidance, and data privacy.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Language & Localization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#DCE8F6] pb-3">
          <Languages className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-[#0B1E3D]">{t.languageSetting}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {languagesList.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                language === lang.code
                  ? 'bg-teal-50 border-teal-500 text-[#0B1E3D] font-bold ring-2 ring-teal-400/30'
                  : 'bg-white border-[#DCE8F6] text-[#2D3748] hover:bg-sky-50'
              }`}
            >
              <div>
                <span className="block text-sm font-bold text-[#0B1E3D]">{lang.native}</span>
                <span className="block text-[11px] text-[#2D3748] opacity-70 font-mono">{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-4 h-4 text-teal-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual Accessibility & Text Scaling */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#DCE8F6] pb-3">
          <Type className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-[#0B1E3D]">{t.accessibilitySetting}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'normal', label: 'Default Text Size', desc: 'Standard UI font scale' },
            { id: 'large', label: 'Large Text (120%)', desc: 'Enhanced clarity for reading' },
            { id: 'xl', label: 'Extra Large (140%)', desc: 'Maximum accessibility' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setTextSize(s.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                textSize === s.id
                  ? 'bg-teal-50 border-teal-500 text-[#0B1E3D] font-bold ring-2 ring-teal-400/30'
                  : 'bg-white border-[#DCE8F6] text-[#2D3748] hover:bg-sky-50'
              }`}
            >
              <span className="block text-xs font-bold text-[#0B1E3D]">{s.label}</span>
              <span className="block text-[11px] text-[#2D3748] opacity-75 mt-1">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Audio & Voice Companion Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#DCE8F6] pb-3">
          <Volume2 className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-[#0B1E3D]">{t.voiceSetting}</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6]">
          <div>
            <h3 className="text-xs font-bold text-[#0B1E3D]">Spoken Assistance & Reminders</h3>
            <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
              Read out medication schedules, health report findings, and guided breathing prompts automatically.
            </p>
          </div>
          <input
            type="checkbox"
            checked={voicePromptsEnabled}
            onChange={(e) => setVoicePromptsEnabled(e.target.checked)}
            className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Why Quantum? Plain-Language Explainer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Atom className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
              Research & Science
            </span>
            <h2 className="text-base font-bold text-[#0B1E3D] mt-0.5">{t.whyQuantumTitle}</h2>
          </div>
        </div>

        <p className="text-xs text-[#2D3748] leading-relaxed font-sans">
          {t.whyQuantumText}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#2D3748]">
          <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6]">
            <strong className="text-[#0B1E3D] block mb-1">Multi-Parameter Interactions</strong>
            Observes subtle geometric patterns between 30 cellular attributes that classical computers often miss.
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6]">
            <strong className="text-[#0B1E3D] block mb-1">Hybrid Consensus Validation</strong>
            Every quantum circuit prediction is verified alongside established Random Forest ensemble algorithms.
          </div>
        </div>
      </div>

      {/* 5. Caregiver Privacy & Data Transparency */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-3 text-xs text-[#2D3748]">
        <div className="flex items-center gap-2 text-[#0B1E3D] font-bold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Caregiver Privacy & Patient Consent</span>
        </div>
        <p className="leading-relaxed opacity-85">
          All entered health details, medication checkmarks, and mood reflections are retained securely within your current browser session. We prioritize dignity, transparent communication, and patient agency.
        </p>
      </div>
    </div>
  );
};
