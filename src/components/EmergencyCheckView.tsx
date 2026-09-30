import React, { useState } from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  Hospital, 
  ShieldAlert, 
  Activity,
  HeartCrack,
  Wind,
  UserX,
  Zap,
  Droplets,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface EmergencyCheckViewProps {
  onProceedToAssessment: () => void;
  onGoToHospitals: () => void;
  onBackToHome: () => void;
  lang?: SupportedLanguage;
}

interface SymptomOption {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const EmergencyCheckView: React.FC<EmergencyCheckViewProps> = ({
  onProceedToAssessment,
  onGoToHospitals,
  onBackToHome,
  lang = 'en'
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [noneConfirmed, setNoneConfirmed] = useState(false);

  const symptomList: SymptomOption[] = [
    {
      id: 'chest_pain',
      label: 'Severe chest pain, pressure, or tightness',
      sublabel: 'Crushing feeling spreading to jaw, neck, left arm, or back',
      icon: HeartCrack
    },
    {
      id: 'breathing',
      label: 'Severe difficulty breathing or gasping for air',
      sublabel: 'Unable to speak in full sentences, blue lips or fingernails',
      icon: Wind
    },
    {
      id: 'unconscious',
      label: 'Loss of consciousness, fainting, or unresponsiveness',
      sublabel: 'Blackouts, sudden collapse, or inability to wake person',
      icon: UserX
    },
    {
      id: 'paralysis',
      label: 'Sudden weakness, numbness, or paralysis (especially one side of face/body)',
      sublabel: 'Slurred speech, sudden confusion, or loss of balance / FAST stroke signs',
      icon: Zap
    },
    {
      id: 'bleeding',
      label: 'Severe, uncontrolled bleeding or coughing up blood',
      sublabel: 'Deep wounds that do not stop with direct pressure, massive blood loss',
      icon: Droplets
    },
    {
      id: 'life_threatening',
      label: 'Other acute, life-threatening symptoms or sudden excruciating agony',
      sublabel: 'Worst headache of life, severe acute abdominal rigidity, seizures',
      icon: HelpCircle
    }
  ];

  const hasEmergency = selectedSymptoms.length > 0;

  const toggleSymptom = (id: string) => {
    setNoneConfirmed(false);
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirmNone = () => {
    setSelectedSymptoms([]);
    setNoneConfirmed(true);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setNoneConfirmed(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* 6-Step Flow Stepper */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 overflow-x-auto gap-2 pb-2">
          <button onClick={onBackToHome} className="hover:text-[#0B1E3D] flex items-center gap-1.5 shrink-0 text-slate-600">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">1</span>
            <span>Home</span>
          </button>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            <span>Emergency Check</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">3</span>
            <span>Health Assessment</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">4</span>
            <span>Risk Prediction</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">5</span>
            <span>Guidance</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">6</span>
            <span>Doctor / Hospital</span>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  Step 2 of 6: Mandatory Safety Protocol
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1E3D] mt-1.5 tracking-tight">
                Emergency Symptom Check
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
                Before proceeding to AI/Quantum screening, verify that you or the patient are not experiencing acute emergency signs. AI algorithms are for risk screening, not acute medical emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert (Rendered IMMEDIATELY when any symptom is selected) */}
      {hasEmergency && (
        <div 
          id="emergency-alert-banner"
          className="bg-rose-600 text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-rose-900/20 border-2 border-rose-300 animate-bounceOnce space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                This may be a medical emergency. Do not wait for an AI prediction.
              </h2>
              <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
                You indicated life-threatening emergency symptoms. Computer models and online risk screeners cannot provide emergency resuscitation, diagnostics, or acute care. Contact local emergency services or proceed immediately to the nearest emergency department.
              </p>
            </div>
          </div>

          {/* Quick Call Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-bold px-4 py-3.5 rounded-xl shadow-sm text-sm transition-all transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Call 112 (National)</span>
            </a>
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-bold px-4 py-3.5 rounded-xl shadow-sm text-sm transition-all transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Call 108 (Ambulance)</span>
            </a>
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 bg-rose-800 text-white hover:bg-rose-900 font-bold px-4 py-3.5 rounded-xl shadow-sm text-sm transition-all transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911 (Global/US)</span>
            </a>
            <button
              onClick={onGoToHospitals}
              className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-4 py-3.5 rounded-xl shadow-sm text-sm transition-all transform active:scale-95"
            >
              <Hospital className="w-4 h-4" />
              <span>Find Nearest ER</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-rose-500/60 text-xs text-rose-200">
            <span>Selected {selectedSymptoms.length} critical symptom(s)</span>
            <button
              onClick={handleReset}
              className="underline hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear checklist selections
            </button>
          </div>
        </div>
      )}

      {/* Symptom Checklist Cards */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0B1E3D]">
              Do you or the patient have any of the following symptoms right now?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select all that apply. If none, select the confirmation below to proceed safely.
            </p>
          </div>
          {selectedSymptoms.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {symptomList.map(symptom => {
            const Icon = symptom.icon;
            const isChecked = selectedSymptoms.includes(symptom.id);

            return (
              <label
                key={symptom.id}
                htmlFor={`symptom-${symptom.id}`}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                  isChecked 
                    ? 'border-rose-500 bg-rose-50/60 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <input
                  id={`symptom-${symptom.id}`}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSymptom(symptom.id)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isChecked ? 'text-rose-600' : 'text-teal-600'}`} />
                    <span className={`text-sm font-semibold ${isChecked ? 'text-rose-900' : 'text-slate-800'}`}>
                      {symptom.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {symptom.sublabel}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* None of the above option */}
        <div className="pt-4 border-t border-slate-100">
          <label 
            htmlFor="confirm-none-checkbox"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              noneConfirmed && !hasEmergency 
                ? 'border-teal-500 bg-teal-50/60' 
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
            }`}
          >
            <input
              id="confirm-none-checkbox"
              type="checkbox"
              checked={noneConfirmed && !hasEmergency}
              onChange={handleConfirmNone}
              className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-bold text-slate-800">
                None of the above symptoms are present
              </span>
              <p className="text-xs text-slate-500">
                I confirm the individual is stable and not experiencing life-threatening acute signs.
              </p>
            </div>
          </label>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-all cursor-pointer"
          >
            <span>Back to Home</span>
          </button>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            {hasEmergency ? (
              <button
                onClick={onGoToHospitals}
                className="w-full sm:w-auto flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Go to Emergency Hospital Finder</span>
              </button>
            ) : (
              <button
                id="proceed-to-assessment-btn"
                onClick={onProceedToAssessment}
                className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer ${
                  noneConfirmed 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-700/20 scale-102' 
                    : 'bg-[#0B1E3D] hover:bg-[#132c54] text-white'
                }`}
              >
                <span>No Emergency Symptoms — Continue to Step 3</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Regulatory & Safety Notice */}
      <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Activity className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Safety Notice & Medical Disclaimer:</strong> Q-Diagnose uses hybrid quantum-classical algorithms strictly for early risk screening and preventive awareness. It is not an emergency triage service and does not provide medical diagnoses. For immediate, acute, or sudden health changes, contact licensed emergency medical professionals immediately.
        </p>
      </div>
    </div>
  );
};
