import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  HelpCircle, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  PhoneCall, 
  HeartHandshake,
  Brain
} from 'lucide-react';
import { NEUROLOGICAL_CONDITIONS_INFO } from '../../data/neurologyData';
import { NeurologicalConditionId } from '../../types';

interface NeurologyEducationModalProps {
  onStartScreening: () => void;
  onOpenEmergency: () => void;
}

export const NeurologyEducationModal: React.FC<NeurologyEducationModalProps> = ({
  onStartScreening,
  onOpenEmergency
}) => {
  const [selectedCondition, setSelectedCondition] = useState<NeurologicalConditionId | null>(null);

  const conditionKeys: NeurologicalConditionId[] = [
    'alzheimers',
    'parkinsons',
    'epilepsy',
    'stroke',
    'ms'
  ];

  const activeConditionData = selectedCondition 
    ? NEUROLOGICAL_CONDITIONS_INFO[selectedCondition] 
    : null;

  return (
    <div id="learn-about-neurology-section" className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Patient Health Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3D]">
          Learn About Neurological Health
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Clear, educational information on five major neurological conditions, their common signs, and guidance on when to seek professional medical help.
        </p>
      </div>

      {/* 5 Educational Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditionKeys.map((key) => {
          const item = NEUROLOGICAL_CONDITIONS_INFO[key];
          return (
            <div
              key={key}
              id={`learn-card-${key}`}
              onClick={() => setSelectedCondition(key)}
              className="bg-white hover:bg-slate-50/80 rounded-3xl border border-sky-100 hover:border-teal-300 p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-xl">
                    Condition Overview
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-[#0B1E3D] group-hover:text-teal-800 transition-colors">
                  {item.shortName}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
                <span>View Symptoms & Care Guide →</span>
                <span className="text-slate-400 text-[11px] font-normal">{item.specialist}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Bar */}
      <div className="p-6 rounded-3xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0B1E3D]">
              Ready to check your symptoms?
            </h4>
            <p className="text-xs text-slate-600">
              Run an AI-assisted screening across all five conditions in just 2 minutes.
            </p>
          </div>
        </div>

        <button
          onClick={onStartScreening}
          className="px-5 py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
        >
          Start Neurological Screening
        </button>
      </div>

      {/* EDUCATIONAL MODAL (Requirement 16) */}
      {activeConditionData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div 
            id="neurology-education-modal"
            className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider">
                  Patient Education Guide
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E3D] mt-1">
                  {activeConditionData.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCondition(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* What is it? */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>What is it?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {activeConditionData.description}
              </p>
            </div>

            {/* Common Symptoms */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span>Common Symptoms</span>
              </h3>
              <ul className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                {activeConditionData.commonSymptoms.map((sym, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to Seek Medical Help */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>When to Seek Medical Help</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeConditionData.whenToSeekHelp.map((help, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-2 text-amber-950">
                    <span className="text-amber-600 font-bold">!</span>
                    <span>{help}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Care Specialist */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Recommended Care Specialist:</span>
                <strong className="text-teal-900 text-sm font-bold">{activeConditionData.specialist}</strong>
              </div>
              <button
                onClick={() => {
                  setSelectedCondition(null);
                  onStartScreening();
                }}
                className="px-4 py-2 rounded-xl bg-[#0B1E3D] hover:bg-[#132c54] text-white font-bold transition-colors cursor-pointer text-xs"
              >
                Screen for this Condition
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400">
                Educational reference only. Does not replace professional diagnostic medical advice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
