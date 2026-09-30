import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Brain, Sparkles, ShieldCheck } from 'lucide-react';

interface AnalysisLoadingStepProps {
  onComplete: () => void;
  inputType: 'symptoms' | 'report';
}

interface StepItem {
  id: number;
  label: string;
  detail: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'Input received', detail: 'Symptom entries and clinical descriptors registered safely' },
  { id: 2, label: 'Information reviewed', detail: 'Evaluating semantic correlations across five neurological condition domains' },
  { id: 3, label: 'Preparing neurological screening', detail: 'Calculating multi-condition priority risk bands & confidence estimates' },
  { id: 4, label: 'Preparing results', detail: 'Assembling patient-friendly summaries and specialist guidance' }
];

export const AnalysisLoadingStep: React.FC<AnalysisLoadingStepProps> = ({
  onComplete,
  inputType
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    // Step 1 -> Step 2
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(50);
    }, 600);

    // Step 2 -> Step 3
    const timer2 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(75);
    }, 1300);

    // Step 3 -> Step 4
    const timer3 = setTimeout(() => {
      setCurrentStep(4);
      setProgress(100);
    }, 2000);

    // Step 4 -> onComplete
    const timer4 = setTimeout(() => {
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div id="neurology-analysis-loading-step" className="max-w-xl mx-auto py-12 px-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-10 shadow-lg text-center space-y-8 relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Brain Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0B1E3D] to-teal-700 text-white flex items-center justify-center shadow-lg border border-teal-400/40">
          <Brain className="w-10 h-10 text-teal-300 animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

        {/* Title and Progress Percentage */}
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700">
            {inputType === 'symptoms' ? 'Symptom Correlation' : 'Medical Report Review'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B1E3D]">
            Analyzing your information…
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Reviewing clinical indicators against five neurological screening reference profiles.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 relative z-10">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-teal-500 to-[#0B1E3D] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Safety-First Verification</span>
            <span className="font-bold text-teal-700">{progress}%</span>
          </div>
        </div>

        {/* Clinical Progress Steps List */}
        <div className="space-y-3 text-left relative z-10 max-w-md mx-auto">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div 
                key={step.id} 
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isCompleted 
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900' 
                    : isCurrent 
                    ? 'bg-sky-50/80 border-sky-300 text-[#0B1E3D] ring-2 ring-teal-500/20 shadow-xs' 
                    : 'bg-slate-50/50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600 animate-scaleIn" />
                  )}
                  {isCurrent && (
                    <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                      {step.id}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{step.label}</span>
                    {isCompleted && <span className="text-[10px] text-teal-700 font-mono font-bold">Done</span>}
                    {isCurrent && <span className="text-[10px] text-teal-600 font-mono font-bold">Active</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety Note */}
        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Non-diagnostic clinical decision support screening</span>
        </div>
      </div>
    </div>
  );
};
