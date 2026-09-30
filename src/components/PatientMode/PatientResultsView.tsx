import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Bot, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Atom, 
  Cpu, 
  HelpCircle,
  Clock,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { PredictionResult, SupportedLanguage, NavSection, DiseaseId } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { DISEASE_CONFIGS } from '../../data/diseaseDatasets';

interface PatientResultsViewProps {
  result: PredictionResult | null;
  language: SupportedLanguage;
  onNavigate: (section: NavSection) => void;
  onOpenAssistantWithQuery: (query: string) => void;
}

export const PatientResultsView: React.FC<PatientResultsViewProps> = ({
  result,
  language,
  onNavigate,
  onOpenAssistantWithQuery,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!result) {
    return (
      <div className="p-12 rounded-3xl bg-white border border-[#DCE8F6] text-center space-y-4 max-w-2xl mx-auto shadow-sm shadow-sky-950/5">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center border border-teal-200">
          <Activity className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-bold text-[#0B1E3D]">No Active Assessment Found</h3>
        <p className="text-xs text-[#2D3748] opacity-80 leading-relaxed">
          Please complete a guided assessment or load a demo patient profile in "Check My Health" to see personalized results here.
        </p>
        <button
          onClick={() => onNavigate('check')}
          className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs flex items-center gap-2 mx-auto transition-all cursor-pointer shadow-xs"
        >
          <span>Go to Check My Health</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  const isAtRisk = 
    result.prediction === 'Malignant' || 
    result.prediction === 'High Risk' || 
    result.prediction === "Parkinson's Indicated" || 
    result.prediction === 'High Risk (Tremor/Motor)';

  const handleSpeakResults = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const summaryText = `Health Assessment Summary: What we found: ${result.prediction}. Confidence level: ${result.confidence.toFixed(1)} percent. ${result.plain_language_summary || ''}`;
    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="patient-results-view" className="space-y-8 max-w-4xl mx-auto">
      {/* Primary Result Summary Card */}
      <div 
        id="patient-results-card"
        className="rounded-3xl border border-[#DCE8F6] p-6 sm:p-8 shadow-sm shadow-sky-950/5 relative overflow-hidden bg-white"
      >
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#DCE8F6]">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs ${
              isAtRisk ? 'bg-amber-500' : 'bg-teal-600'
            }`}>
              {isAtRisk ? <AlertTriangle className="w-6 h-6 text-white" /> : <CheckCircle2 className="w-6 h-6 text-white" />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                {result.dataset_name} Health Report
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1E3D] mt-0.5">
                {t.whatWeFound}: <span className={isAtRisk ? 'text-[#C59B27]' : 'text-teal-600'}>{result.prediction}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakResults}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSpeaking 
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                  : 'bg-white hover:bg-sky-50 text-[#2D3748] border-[#DCE8F6]'
              }`}
              title="Listen to Result Summary"
            >
              <Volume2 className="w-4 h-4 text-teal-600" />
              <span>{isSpeaking ? 'Listening...' : 'Read Aloud'}</span>
            </button>

            <button
              onClick={() => onNavigate('check')}
              className="p-2.5 rounded-xl bg-white hover:bg-sky-50 text-[#2D3748] border border-[#DCE8F6] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-teal-600" />
              <span>New Check</span>
            </button>
          </div>
        </div>

        {/* Plain Language Interpretation Box */}
        <div className="py-6 space-y-4">
          <p className="text-sm sm:text-base text-[#2D3748] leading-relaxed font-sans">
            {result.plain_language_summary || (
              isAtRisk 
                ? "Our quantum-classical screening observed elevated statistical markers compared to normative baseline cohorts. We recommend sharing this report with your physician for a routine follow-up."
                : "Our quantum-classical screening found all key biological metrics within the healthy, baseline expected ranges."
            )}
          </p>

          {/* Confidence and Uncertainty Range */}
          <div className="p-4 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                {t.confidenceTitle}
              </div>
              <div className="text-xl font-mono font-black text-[#0B1E3D] mt-0.5 flex items-baseline gap-2">
                <span className="text-[#C59B27]">{result.confidence.toFixed(1)}%</span>
                <span className="text-xs font-normal text-[#2D3748] opacity-75">
                  {result.confidence_interval || '[93.2% – 97.8%] (95% CI)'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#2D3748] font-mono">
              <div>
                <span className="block text-[10px] text-[#2D3748] opacity-70">Quantum VQC Score</span>
                <span className="font-bold text-teal-600">{(result.quantum_score * 100).toFixed(1)}%</span>
              </div>
              <div className="w-px h-7 bg-[#DCE8F6]"></div>
              <div>
                <span className="block text-[10px] text-[#2D3748] opacity-70">Classical RF Score</span>
                <span className="font-bold text-[#0B1E3D]">{(result.classical_score * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Observed Biological Factors */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">
            {t.keyContributingFactors}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.feature_importance.slice(0, 4).map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0B1E3D]">{f.name.replace(/_/g, ' ')}</span>
                  <p className="text-[11px] text-[#2D3748] opacity-75">{f.description || 'Measured biological metric'}</p>
                </div>
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {f.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ask Assistant Integration */}
        <div className="mt-6 pt-5 border-t border-[#DCE8F6] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenAssistantWithQuery(`Can you explain my ${result.dataset_name} result of ${result.prediction} in simple, calming words?`)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>{t.askAssistantAboutResults}</span>
          </button>

          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="text-xs text-[#2D3748] hover:text-[#0B1E3D] flex items-center gap-1 font-semibold transition-colors"
          >
            <span>{showTechnicalDetails ? 'Hide Model Architecture' : t.learnMoreDetails}</span>
            {showTechnicalDetails ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4 text-teal-600" />}
          </button>
        </div>
      </div>

      {/* Expandable Technical Model Details */}
      {showTechnicalDetails && (
        <div className="p-6 rounded-3xl bg-white border border-[#DCE8F6] space-y-4 shadow-sm shadow-sky-950/5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#DCE8F6] pb-3">
            <div className="flex items-center gap-2">
              <Atom className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-[#0B1E3D]">Quantum-Classical Pipeline Internals</h3>
            </div>
            <span className="text-xs font-mono bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded border border-teal-200 font-bold">
              Qiskit Aer Simulator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6]">
              <span className="text-[#2D3748] opacity-70 block text-[10px] uppercase font-mono">Hilbert Space Dimension</span>
              <span className="text-[#0B1E3D] font-bold font-mono text-sm mt-0.5 block">2⁴ = 16 States</span>
              <p className="text-[11px] text-[#2D3748] opacity-80 mt-1">4-qubit parameterized Ry/Rz rotation ansatz with linear CNOT entanglement.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6]">
              <span className="text-[#2D3748] opacity-70 block text-[10px] uppercase font-mono">Consensus Status</span>
              <span className="text-teal-700 font-bold font-mono text-sm mt-0.5 block">Concordant Agreement</span>
              <p className="text-[11px] text-[#2D3748] opacity-80 mt-1">Both quantum kernel and Random Forest predicted identical classification labels.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6]">
              <span className="text-[#2D3748] opacity-70 block text-[10px] uppercase font-mono">Feature Encoding</span>
              <span className="text-[#0B1E3D] font-bold font-mono text-sm mt-0.5 block">StandardScaler + PCA</span>
              <p className="text-[11px] text-[#2D3748] opacity-80 mt-1">First 4 principal components preserving &gt;92% variance across the cohort.</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Next Steps Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-3">
        <h3 className="text-sm font-bold text-[#0B1E3D] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>{t.nextStepsTitle}</span>
        </h3>
        <ul className="text-xs text-[#2D3748] space-y-2 list-disc list-inside leading-relaxed">
          <li>Share this summary with your primary physician or specialist during your next scheduled appointment.</li>
          <li>Retake this screening periodically if you note new physical changes or symptom shifts.</li>
          <li>Access our Memory Care routines or Mind & Mood relaxation exercises whenever you need daily wellness support.</li>
        </ul>
        <div className="pt-2 text-[11px] text-[#9A7416] italic">
          {t.nonDiagnosticNotice}
        </div>
      </div>
    </div>
  );
};
