import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Compass, 
  FileText, 
  Share2, 
  Hospital, 
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { PredictionResult, SupportedLanguage } from '../types';

interface RiskPredictionViewProps {
  result: PredictionResult;
  onGoToGuidance: () => void;
  onGoToHospitals: () => void;
  onBackToAssessment: () => void;
  lang?: SupportedLanguage;
}

export const RiskPredictionView: React.FC<RiskPredictionViewProps> = ({
  result,
  onGoToGuidance,
  onGoToHospitals,
  onBackToAssessment,
  lang = 'en'
}) => {
  const [showExplainability, setShowExplainability] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Derive risk band and colors
  const riskScore = result.risk_score ?? Math.round(result.confidence || 50);
  const riskBand = result.risk_band ?? (riskScore >= 65 ? 'high' : riskScore >= 35 ? 'moderate' : 'low');

  const riskConfig = {
    low: {
      badge: 'Low Risk',
      color: 'emerald',
      bgHeader: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
      pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      progressBar: 'bg-emerald-500',
      defaultMeaning: 'Your biometrics and indicators fall within standard healthy reference parameters. No immediate high-risk patterns were detected by the hybrid quantum-classical models.',
      defaultNextStep: 'Continue proactive lifestyle habits, regular exercise, and schedule routine preventive wellness checks annually.'
    },
    moderate: {
      badge: 'Moderate Risk',
      color: 'amber',
      bgHeader: 'bg-amber-500/10 border-amber-500/30 text-amber-800',
      pillBg: 'bg-amber-100 text-amber-800 border-amber-300',
      progressBar: 'bg-amber-500',
      defaultMeaning: 'One or more biometric readings indicate mild deviation from standard baseline norms. This suggests a potential early risk trend that benefits from non-urgent professional review.',
      defaultNextStep: 'Schedule a non-urgent consultation with a primary care physician to review your cardiovascular, cellular, or neurological health indicators.'
    },
    high: {
      badge: 'High Risk',
      color: 'rose',
      bgHeader: 'bg-rose-500/10 border-rose-500/30 text-rose-800',
      pillBg: 'bg-rose-100 text-rose-800 border-rose-300',
      progressBar: 'bg-rose-500',
      defaultMeaning: 'Multiple indicators exceed normal clinical reference boundaries. The hybrid quantum-classical models observed elevated anomaly correlations requiring clinical follow-up.',
      defaultNextStep: 'Promptly consult a certified healthcare professional or specialized clinic. Bring this screening report for confirmatory diagnostic testing.'
    }
  }[riskBand];

  const plainMeaning = result.plain_language_meaning || riskConfig.defaultMeaning;
  const nextStep = result.recommended_next_step || riskConfig.defaultNextStep;

  // Speech synthesis for accessibility
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = `Your screening result indicates ${riskConfig.badge} with an estimated risk score of ${riskScore} percent. ${plainMeaning}. Recommended next step: ${nextStep}. Remember, this is an AI-based screening result, not a medical diagnosis.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* 6-Step Flow Stepper */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 overflow-x-auto gap-2 pb-2">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>
            <span>Home</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
            <span>Emergency Check</span>
          </div>
          <span className="text-slate-300">→</span>
          <button onClick={onBackToAssessment} className="hover:text-[#0B1E3D] flex items-center gap-1.5 shrink-0 text-slate-600">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">3</span>
            <span>Assessment</span>
          </button>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">4</span>
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

      {/* Main Structured Risk-Level Card */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-md overflow-hidden">
        {/* Risk Band Header */}
        <div className={`p-6 sm:p-8 border-b ${riskConfig.bgHeader} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full shadow-xs">
                Step 4 of 6: Screening Assessment Result
              </span>
              <span className="text-xs font-mono text-slate-500">ID: {result.sample_id}</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xl sm:text-2xl font-black px-4 py-1.5 rounded-xl border ${riskConfig.pillBg} shadow-xs`}>
                {riskConfig.badge}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#0B1E3D]">
                <strong className="text-[#C59B27] font-black">{riskScore}%</strong> Numeric Estimate
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeech}
              className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Listen aloud in plain language"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Aloud'}</span>
            </button>
          </div>
        </div>

        {/* Risk Score Progress Bar */}
        <div className="px-6 sm:px-8 pt-6 pb-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>0% (Minimal Risk)</span>
            <span className="font-bold text-[#0B1E3D]">Calculated Risk Probability: {riskScore}%</span>
            <span>100% (Elevated Anomaly)</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${riskConfig.progressBar}`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        {/* Plain Language Meaning Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B1E3D]">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Plain-Language Meaning of This Result:</span>
            </div>
            <p className="text-base text-slate-800 leading-relaxed font-medium">
              {plainMeaning}
            </p>
          </div>

          {/* Recommended Next Step Box */}
          <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Recommended Next Action:</span>
            </div>
            <p className="text-sm sm:text-base text-teal-950 font-semibold leading-relaxed">
              {nextStep}
            </p>
          </div>

          {/* Persistent Non-Diagnostic Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Mandatory Safety Disclaimer:</strong> {result.disclaimer || 'This is an AI-based screening result, not a medical diagnosis.'} Always consult a licensed healthcare professional for clinical decisions, diagnostic confirmation, or emergency care.
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Explainability Section: "Why is my risk elevated?" */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        <button
          onClick={() => setShowExplainability(!showExplainability)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B1E3D] group-hover:text-teal-700 transition-colors">
                Why is my risk evaluated at this level? (Explainable AI)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Transparent factor contributions and hybrid quantum-classical consensus breakdown
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-all">
            {showExplainability ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showExplainability && (
          <div className="space-y-6 pt-4 border-t border-slate-100 animate-fadeIn">
            {/* Feature Importance Bars */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Primary Biomarkers & Contribution Weights
              </h3>
              <div className="space-y-3">
                {result.feature_importance && result.feature_importance.length > 0 ? (
                  result.feature_importance.map((feat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800">
                        <span className="font-bold text-[#0B1E3D]">{feat.name}</span>
                        <span className="text-[#C59B27] font-bold">{feat.value.toFixed(1)}% weight</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, feat.value * 2.5)}%` }}
                        />
                      </div>
                      {feat.description && (
                        <p className="text-xs text-slate-500">
                          {feat.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Feature importance data computed during hybrid model inference.</p>
                )}
              </div>
            </div>

            {/* Hybrid Consensus Breakdown */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50/50 to-sky-50/50 border border-sky-100 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C59B27]" />
                <h4 className="text-sm font-bold text-[#0B1E3D]">Hybrid Quantum & Classical Consensus Breakdown</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Quantum VQC / Hilbert Space:</span>
                  <div className="text-base font-bold text-teal-700">
                    {(result.quantum_score * 100).toFixed(1)}% Confidence
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {result.qubits_used || 4} Qubits • Circuit Depth {result.circuit_depth || 8} • ZZFeatureMap
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Classical Random Forest Ensemble:</span>
                  <div className="text-base font-bold text-teal-700">
                    {(result.classical_score * 100).toFixed(1)}% Confidence
                  </div>
                  <div className="text-[11px] text-slate-500">
                    100 Decision Trees • Gini Impurity Criterion
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Consensus Validation:</strong> The quantum variational ansatz mapped multi-dimensional non-linear biometric relationships into quantum state space, verifying the classical decision boundary with {result.consensus_agreement !== false ? 'full concordant agreement' : 'discordant boundary review'}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Action Buttons (Step 5 & Step 6) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onBackToAssessment}
          className="w-full sm:w-auto flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-all cursor-pointer"
        >
          <span>Edit Health Assessment</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <button
            id="proceed-to-guidance-btn"
            onClick={onGoToGuidance}
            className="w-full sm:w-auto flex items-center justify-center bg-[#0B1E3D] hover:bg-[#132c54] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Step 5: View Action & Guidance Plan</span>
          </button>

          <button
            onClick={onGoToHospitals}
            className="w-full sm:w-auto flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Step 6: Find Nearby Hospitals</span>
          </button>
        </div>
      </div>
    </div>
  );
};
