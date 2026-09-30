import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Plus, 
  PhoneCall, 
  HelpCircle,
  FileText,
  ShieldCheck,
  Brain
} from 'lucide-react';

interface SymptomInputStepProps {
  onAnalyze: (symptomsText: string, selectedChips: string[]) => void;
  onCancel: () => void;
  onOpenEmergency: () => void;
}

const AVAILABLE_SYMPTOM_CHIPS = [
  'Memory Problems',
  'Tremor',
  'Seizure',
  'Speech Problems',
  'Vision Changes',
  'Balance Problems',
  'Weakness / Numbness',
  'Headache',
  'Sleep Problems'
];

// Symptoms that warrant an immediate urgent warning
const URGENT_SYMPTOM_TRIGGERS = [
  'sudden weakness',
  'sudden numbness',
  'sudden speech difficulty',
  'sudden speech',
  'slurred speech',
  'sudden vision',
  'vision loss',
  'seizure',
  'sudden severe confusion',
  'severe confusion',
  'severe sudden headache',
  'worst headache',
  'loss of responsiveness',
  'unconscious',
  'paralysis'
];

export const SymptomInputStep: React.FC<SymptomInputStepProps> = ({
  onAnalyze,
  onCancel,
  onOpenEmergency
}) => {
  const [symptomsText, setSymptomsText] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  // Check if any entered text or selected chip triggers urgent caution
  const urgentMatch = useMemo(() => {
    const lowerText = symptomsText.toLowerCase();
    
    // Check chips
    if (selectedChips.includes('Seizure')) {
      return 'Seizure symptoms reported';
    }
    if (selectedChips.includes('Weakness / Numbness') && (lowerText.includes('sudden') || lowerText.includes('one side'))) {
      return 'Sudden unilateral weakness/numbness';
    }
    if (selectedChips.includes('Speech Problems') && lowerText.includes('sudden')) {
      return 'Sudden speech alterations';
    }

    // Check text
    for (const trigger of URGENT_SYMPTOM_TRIGGERS) {
      if (lowerText.includes(trigger)) {
        return `Reported symptom: "${trigger}"`;
      }
    }

    return null;
  }, [symptomsText, selectedChips]);

  const toggleChip = (chip: string) => {
    setSelectedChips(prev => 
      prev.includes(chip) 
        ? prev.filter(c => c !== chip) 
        : [...prev, chip]
    );
  };

  const handleApplyExample = () => {
    setSymptomsText('I have been experiencing memory problems, occasional confusion, and difficulty finding words during daily conversations.');
    setSelectedChips(['Memory Problems', 'Speech Problems']);
  };

  const canSubmit = symptomsText.trim().length > 0 || selectedChips.length > 0;

  return (
    <div id="neurology-symptom-input-step" className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Step 1 of 3: Symptom Description</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1E3D]">
          Describe Your Neurological Symptoms
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Please describe how you are feeling in your own words. You may also select any matching symptom tags below.
        </p>
      </div>

      {/* Urgent Warning Banner if urgent symptoms are detected */}
      {urgentMatch && (
        <div 
          id="urgent-symptom-warning-banner"
          className="p-5 rounded-3xl bg-red-50 border-2 border-red-500/80 text-red-950 space-y-3 shadow-md animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-extrabold text-red-900">
                Urgent Medical Attention May Be Required: Seek Emergency Care
              </h3>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                You entered symptoms ({urgentMatch}) that may indicate an acute event such as a stroke, seizure, or sudden neurological emergency. Do not wait for an online screening.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={onOpenEmergency}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center shadow-xs transition-colors cursor-pointer"
            >
              <span>Call Emergency Services (112 / 108)</span>
            </button>
            <span className="text-xs text-red-700 font-medium">
              If this is an emergency, seek immediate emergency care right now.
            </span>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="symptoms-textarea" 
              className="text-xs sm:text-sm font-bold text-[#0B1E3D] flex items-center gap-2"
            >
              <span>Describe your symptoms in your own words</span>
              <span className="text-slate-400 font-normal text-xs">(Required)</span>
            </label>
            <button
              type="button"
              onClick={handleApplyExample}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center cursor-pointer"
            >
              <span>Insert Example Symptoms</span>
            </button>
          </div>

          <textarea
            id="symptoms-textarea"
            rows={5}
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
            placeholder="I have been experiencing memory problems, occasional confusion, and difficulty finding words..."
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none leading-relaxed"
          />
          <p className="text-[11px] text-slate-500">
            Include when symptoms started, how often they occur, and whether they affect your daily activities.
          </p>
        </div>

        {/* Optional Symptom Chips */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <span className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider block">
              Optional Symptom Indicators
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select any tags that apply to your experience (these are symptoms, not disease selections):
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SYMPTOM_CHIPS.map((chip) => {
              const isSelected = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  id={`symptom-chip-${chip.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => toggleChip(chip)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-sm scale-102'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-[#0B1E3D] block font-bold">Privacy & Non-Diagnostic Notice</strong>
            <span>
              Your information is reviewed to provide clinical risk screening scores across five common neurological conditions. This tool does not replace a doctor or issue prescriptions.
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Back</span>
          </button>

          <button
            type="button"
            id="btn-analyze-symptoms"
            disabled={!canSubmit}
            onClick={() => onAnalyze(symptomsText, selectedChips)}
            className="px-6 py-3 rounded-2xl bg-[#0B1E3D] hover:bg-[#132c54] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <span>Analyze Symptoms</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
