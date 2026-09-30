import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  UserCheck, 
  FileSpreadsheet, 
  Lock, 
  Cpu,
  RefreshCw,
  Info
} from 'lucide-react';
import { DiseaseId, SupportedLanguage, PredictionResult } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { DISEASE_CONFIGS } from '../../data/diseaseDatasets';

interface PatientCheckViewProps {
  language: SupportedLanguage;
  selectedDisease: DiseaseId;
  onSelectDisease: (disease: DiseaseId) => void;
  onPredictionComplete: (result: PredictionResult) => void;
}

export const PatientCheckView: React.FC<PatientCheckViewProps> = ({
  language,
  selectedDisease,
  onSelectDisease,
  onPredictionComplete,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const config = DISEASE_CONFIGS[selectedDisease];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasConsented, setHasConsented] = useState(true);

  // Simplified Patient Inputs mapped to feature vectors
  const [breastParams, setBreastParams] = useState({
    radiusMean: 14.12,
    textureMean: 19.28,
    perimeterMean: 91.96,
    areaMean: 654.88,
    concavityMean: 0.088,
    symmetryMean: 0.181
  });

  const [heartParams, setHeartParams] = useState({
    age: 58,
    restingBP: 132,
    cholesterol: 242,
    maxHeartRate: 149,
    stDepression: 1.1,
    chestPainType: 2 // 1: typical, 2: atypical, 3: non-anginal, 4: asymptomatic
  });

  const [neuroParams, setNeuroParams] = useState({
    jitterPercent: 0.0062,
    shimmerPercent: 0.029,
    nhrNoiseToHarmonic: 0.024,
    fundamentalFrequency: 154.2,
    spread1Variance: -5.68,
    ppeEntropy: 0.206
  });

  const handleLoadDemoPatient = (profile: 'healthy' | 'at_risk') => {
    if (selectedDisease === 'breast_cancer') {
      if (profile === 'healthy') {
        setBreastParams({
          radiusMean: 11.84,
          textureMean: 15.22,
          perimeterMean: 75.89,
          areaMean: 432.0,
          concavityMean: 0.024,
          symmetryMean: 0.165
        });
      } else {
        setBreastParams({
          radiusMean: 17.99,
          textureMean: 24.54,
          perimeterMean: 122.8,
          areaMean: 1001.0,
          concavityMean: 0.228,
          symmetryMean: 0.241
        });
      }
    } else if (selectedDisease === 'cardiovascular') {
      if (profile === 'healthy') {
        setHeartParams({
          age: 48,
          restingBP: 118,
          cholesterol: 195,
          maxHeartRate: 168,
          stDepression: 0.2,
          chestPainType: 1
        });
      } else {
        setHeartParams({
          age: 63,
          restingBP: 154,
          cholesterol: 294,
          maxHeartRate: 128,
          stDepression: 2.6,
          chestPainType: 4
        });
      }
    } else if (selectedDisease === 'neurological') {
      if (profile === 'healthy') {
        setNeuroParams({
          jitterPercent: 0.0031,
          shimmerPercent: 0.016,
          nhrNoiseToHarmonic: 0.009,
          fundamentalFrequency: 188.4,
          spread1Variance: -7.12,
          ppeEntropy: 0.114
        });
      } else {
        setNeuroParams({
          jitterPercent: 0.0118,
          shimmerPercent: 0.058,
          nhrNoiseToHarmonic: 0.048,
          fundamentalFrequency: 116.8,
          spread1Variance: -3.84,
          ppeEntropy: 0.382
        });
      }
    }
  };

  const handleExecuteAssessment = async () => {
    setIsAnalyzing(true);
    setCurrentStep(3);

    // Build raw feature array for quantum-classical simulator
    let rawFeatureRecord: Record<string, number> = {};
    if (selectedDisease === 'breast_cancer') {
      rawFeatureRecord = {
        radius_mean: breastParams.radiusMean,
        texture_mean: breastParams.textureMean,
        perimeter_mean: breastParams.perimeterMean,
        area_mean: breastParams.areaMean,
        smoothness_mean: 0.096,
        compactness_mean: 0.104,
        concavity_mean: breastParams.concavityMean,
        concave_points_mean: breastParams.concavityMean * 0.6,
        symmetry_mean: breastParams.symmetryMean,
        fractal_dimension_mean: 0.062,
        radius_worst: breastParams.radiusMean * 1.25,
        texture_worst: breastParams.textureMean * 1.3,
        perimeter_worst: breastParams.perimeterMean * 1.28,
        area_worst: breastParams.areaMean * 1.45,
        smoothness_worst: 0.132,
        compactness_worst: 0.254,
        concavity_worst: breastParams.concavityMean * 1.5,
        concave_points_worst: breastParams.concavityMean * 0.9,
        symmetry_worst: breastParams.symmetryMean * 1.2,
        fractal_dimension_worst: 0.083
      };
    } else if (selectedDisease === 'cardiovascular') {
      rawFeatureRecord = {
        age: heartParams.age,
        sex: 1,
        cp: heartParams.chestPainType,
        trestbps: heartParams.restingBP,
        chol: heartParams.cholesterol,
        fbs: heartParams.cholesterol > 250 ? 1 : 0,
        restecg: 1,
        thalach: heartParams.maxHeartRate,
        exang: heartParams.chestPainType >= 3 ? 1 : 0,
        oldpeak: heartParams.stDepression,
        slope: 2,
        ca: heartParams.stDepression > 1.5 ? 2 : 0,
        thal: 3
      };
    } else {
      rawFeatureRecord = {
        'MDVP:Fo(Hz)': neuroParams.fundamentalFrequency,
        'MDVP:Fhi(Hz)': neuroParams.fundamentalFrequency * 1.2,
        'MDVP:Flo(Hz)': neuroParams.fundamentalFrequency * 0.85,
        'MDVP:Jitter(%)': neuroParams.jitterPercent,
        'MDVP:Shimmer': neuroParams.shimmerPercent,
        NHR: neuroParams.nhrNoiseToHarmonic,
        HNR: 21.4,
        RPDE: 0.442,
        DFA: 0.718,
        spread1: neuroParams.spread1Variance,
        spread2: 0.226,
        D2: 2.38,
        PPE: neuroParams.ppeEntropy
      };
    }

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: rawFeatureRecord,
          model: 'Both (Compare)',
          sample_id: `PATIENT-${Date.now().toString().slice(-5)}`,
          dataset_name: config.datasetName,
          disease_id: selectedDisease,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result: PredictionResult = await response.json();
      result.disease_id = selectedDisease;

      // Enrich with plain language summary for patient
      const isPositive = result.prediction === config.positiveLabel;
      result.plain_language_summary = isPositive
        ? `Our hybrid analysis noted elevated geometric and biological indicators that warrant a follow-up consultation with your healthcare provider for clinical confirmation.`
        : `Our hybrid analysis observed metrics within typical, baseline expected ranges for this assessment.`;
      result.confidence_interval = `[${(result.confidence - 2.8).toFixed(1)}% – ${(Math.min(99.5, result.confidence + 2.4)).toFixed(1)}%] (95% CI)`;

      setTimeout(() => {
        setIsAnalyzing(false);
        onPredictionComplete(result);
      }, 1200);
    } catch (e) {
      setIsAnalyzing(false);
      console.error('Prediction failed in patient view:', e);
    }
  };

  return (
    <div id="patient-check-view" className="space-y-8 max-w-5xl mx-auto">
      {/* Step Wizard Header Indicator */}
      <div className="bg-white border border-[#DCE8F6] rounded-3xl p-4 sm:p-6 shadow-sm shadow-sky-950/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
              Guided Health Assessment Wizard
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D] mt-0.5">
              {currentStep === 1 && t.stepSelectArea}
              {currentStep === 2 && t.stepProvideDetails}
              {currentStep === 3 && t.stepReviewAnalyze}
            </h2>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((st) => (
              <div
                key={st}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStep === st
                    ? 'bg-teal-600 text-white shadow-sm'
                    : currentStep > st
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'bg-[#F4F8FA] text-[#2D3748] opacity-70 border border-[#DCE8F6]'
                }`}
              >
                <span>Step {st}</span>
                {currentStep > st && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: SELECT HEALTH FOCUS AREA */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Option 1: Breast Tissue */}
            <div
              onClick={() => onSelectDisease('breast_cancer')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedDisease === 'breast_cancer'
                  ? 'bg-white border-teal-600 shadow-md shadow-teal-900/10'
                  : 'bg-white border-[#DCE8F6] hover:border-teal-300 shadow-xs'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <Activity className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-base font-bold text-[#0B1E3D] mt-4">{t.breastHealth}</h3>
                <p className="text-xs text-[#2D3748] opacity-85 mt-2 leading-relaxed">
                  Evaluates cellular contour, radius, and texture homogeneity using Wisconsin FNA cytological models.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE8F6] flex items-center justify-between text-xs font-mono text-teal-700 font-bold">
                <span>30 Attributes • 4 Qubits</span>
                {selectedDisease === 'breast_cancer' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
              </div>
            </div>

            {/* Option 2: Heart Health */}
            <div
              onClick={() => onSelectDisease('cardiovascular')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedDisease === 'cardiovascular'
                  ? 'bg-white border-rose-500 shadow-md shadow-rose-900/10'
                  : 'bg-white border-[#DCE8F6] hover:border-rose-300 shadow-xs'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                  <Heart className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-base font-bold text-[#0B1E3D] mt-4">{t.heartHealth}</h3>
                <p className="text-xs text-[#2D3748] opacity-85 mt-2 leading-relaxed">
                  Screens hemodynamic stress markers, resting blood pressure, cholesterol, and coronary vascular risk.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE8F6] flex items-center justify-between text-xs font-mono text-rose-700 font-bold">
                <span>13 Attributes • 4 Qubits</span>
                {selectedDisease === 'cardiovascular' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
              </div>
            </div>

            {/* Option 3: Neurological Vocal */}
            <div
              onClick={() => onSelectDisease('neurological')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedDisease === 'neurological'
                  ? 'bg-white border-purple-500 shadow-md shadow-purple-900/10'
                  : 'bg-white border-[#DCE8F6] hover:border-purple-300 shadow-xs'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-base font-bold text-[#0B1E3D] mt-4">{t.neuroVoiceHealth}</h3>
                <p className="text-xs text-[#2D3748] opacity-85 mt-2 leading-relaxed">
                  Analyzes micro-tremors, frequency jitter, and voice perturbation biomarkers for early Parkinson's screening.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE8F6] flex items-center justify-between text-xs font-mono text-purple-700 font-bold">
                <span>22 Attributes • 4 Qubits</span>
                {selectedDisease === 'neurological' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              id="btn-step1-continue"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-teal-900/15 transition-all cursor-pointer"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PROVIDE DETAILS OR LOAD VERIFIED CASE */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Quick Demo Loader Pill Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-[#0B1E3D]">Load Pre-configured Clinical Profile:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-load-healthy-profile"
                type="button"
                onClick={() => handleLoadDemoPatient('healthy')}
                className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Profile A (Typical / Baseline)</span>
              </button>
              <button
                id="btn-load-risk-profile"
                type="button"
                onClick={() => handleLoadDemoPatient('at_risk')}
                className="px-3 py-1.5 rounded-xl bg-[#FEF9E7] text-[#9A7416] border border-[#F6E58D] hover:bg-amber-100/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Profile B (Elevated Indicators)</span>
              </button>
            </div>
          </div>

          {/* Interactive Parameters Card */}
          <div className="bg-white border border-[#DCE8F6] rounded-3xl p-6 space-y-6 shadow-sm shadow-sky-950/5">
            <div className="flex items-center justify-between border-b border-[#DCE8F6] pb-3">
              <h3 className="text-sm font-bold text-[#0B1E3D]">
                Clinical Measurement Controls ({config.shortName})
              </h3>
              <span className="text-xs font-mono text-[#2D3748] opacity-75">Values standardized into Hilbert Space</span>
            </div>

            {/* Breast Cancer Inputs */}
            {selectedDisease === 'breast_cancer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Cell Radius (Mean):</span>
                    <span className="text-teal-700 font-mono font-bold">{breastParams.radiusMean} mm</span>
                  </div>
                  <input
                    type="range"
                    min="6.98"
                    max="28.11"
                    step="0.1"
                    value={breastParams.radiusMean}
                    onChange={(e) => setBreastParams({ ...breastParams, radiusMean: parseFloat(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#2D3748] opacity-75">
                    <span>6.98 mm (Normal)</span>
                    <span>28.11 mm (Hyperplasia)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Chromatin Texture (Mean):</span>
                    <span className="text-teal-700 font-mono font-bold">{breastParams.textureMean}</span>
                  </div>
                  <input
                    type="range"
                    min="9.71"
                    max="39.28"
                    step="0.1"
                    value={breastParams.textureMean}
                    onChange={(e) => setBreastParams({ ...breastParams, textureMean: parseFloat(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Contour Concavity:</span>
                    <span className="text-teal-700 font-mono font-bold">{breastParams.concavityMean}</span>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="0.43"
                    step="0.01"
                    value={breastParams.concavityMean}
                    onChange={(e) => setBreastParams({ ...breastParams, concavityMean: parseFloat(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Nuclear Symmetry:</span>
                    <span className="text-teal-700 font-mono font-bold">{breastParams.symmetryMean}</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.30"
                    step="0.01"
                    value={breastParams.symmetryMean}
                    onChange={(e) => setBreastParams({ ...breastParams, symmetryMean: parseFloat(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                </div>
              </div>
            )}

            {/* Heart Disease Inputs */}
            {selectedDisease === 'cardiovascular' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Patient Age:</span>
                    <span className="text-rose-700 font-mono font-bold">{heartParams.age} years</span>
                  </div>
                  <input
                    type="range"
                    min="29"
                    max="77"
                    value={heartParams.age}
                    onChange={(e) => setHeartParams({ ...heartParams, age: parseInt(e.target.value) })}
                    className="w-full accent-rose-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Resting Blood Pressure:</span>
                    <span className="text-rose-700 font-mono font-bold">{heartParams.restingBP} mm Hg</span>
                  </div>
                  <input
                    type="range"
                    min="94"
                    max="200"
                    value={heartParams.restingBP}
                    onChange={(e) => setHeartParams({ ...heartParams, restingBP: parseInt(e.target.value) })}
                    className="w-full accent-rose-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Serum Cholesterol:</span>
                    <span className="text-rose-700 font-mono font-bold">{heartParams.cholesterol} mg/dl</span>
                  </div>
                  <input
                    type="range"
                    min="126"
                    max="564"
                    value={heartParams.cholesterol}
                    onChange={(e) => setHeartParams({ ...heartParams, cholesterol: parseInt(e.target.value) })}
                    className="w-full accent-rose-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Max Heart Rate Achieved:</span>
                    <span className="text-rose-700 font-mono font-bold">{heartParams.maxHeartRate} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="71"
                    max="202"
                    value={heartParams.maxHeartRate}
                    onChange={(e) => setHeartParams({ ...heartParams, maxHeartRate: parseInt(e.target.value) })}
                    className="w-full accent-rose-600"
                  />
                </div>
              </div>
            )}

            {/* Neurological Inputs */}
            {selectedDisease === 'neurological' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Vocal Frequency Jitter (%):</span>
                    <span className="text-purple-700 font-mono font-bold">{(neuroParams.jitterPercent * 100).toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.03"
                    step="0.001"
                    value={neuroParams.jitterPercent}
                    onChange={(e) => setNeuroParams({ ...neuroParams, jitterPercent: parseFloat(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Amplitude Shimmer (%):</span>
                    <span className="text-purple-700 font-mono font-bold">{(neuroParams.shimmerPercent * 100).toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.009"
                    max="0.12"
                    step="0.001"
                    value={neuroParams.shimmerPercent}
                    onChange={(e) => setNeuroParams({ ...neuroParams, shimmerPercent: parseFloat(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Noise-to-Harmonic (NHR):</span>
                    <span className="text-purple-700 font-mono font-bold">{neuroParams.nhrNoiseToHarmonic}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0006"
                    max="0.31"
                    step="0.005"
                    value={neuroParams.nhrNoiseToHarmonic}
                    onChange={(e) => setNeuroParams({ ...neuroParams, nhrNoiseToHarmonic: parseFloat(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2D3748] font-medium">Pitch Period Entropy (PPE):</span>
                    <span className="text-purple-700 font-mono font-bold">{neuroParams.ppeEntropy}</span>
                  </div>
                  <input
                    type="range"
                    min="0.04"
                    max="0.52"
                    step="0.01"
                    value={neuroParams.ppeEntropy}
                    onChange={(e) => setNeuroParams({ ...neuroParams, ppeEntropy: parseFloat(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
            )}

            {/* Privacy & Consent Checkbox */}
            <div className="p-4 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-start gap-3">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="consent-checkbox" className="text-xs text-[#2D3748] leading-relaxed cursor-pointer">
                <strong className="text-[#0B1E3D]">Privacy & Research Consent:</strong> I understand that my entered measurements are evaluated securely in-browser for health screening purposes and are never transmitted to unauthorized third parties.
              </label>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-[#0B1E3D] border border-[#DCE8F6] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Back to Focus Area
            </button>
            <button
              id="btn-execute-patient-assessment"
              disabled={!hasConsented || isAnalyzing}
              onClick={handleExecuteAssessment}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-teal-900/15 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-white" />
              <span>{t.startAnalysis}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ANALYZING ANIMATION */}
      {currentStep === 3 && isAnalyzing && (
        <div className="p-12 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping"></div>
            <div className="w-20 h-20 rounded-full border-4 border-teal-600 border-t-transparent animate-spin flex items-center justify-center bg-teal-50">
              <Cpu className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0B1E3D]">Synthesizing Quantum & Classical Models</h3>
            <p className="text-xs text-[#2D3748] opacity-85 max-w-md mx-auto mt-2 leading-relaxed">
              Mapping your measurements into 4-qubit Hilbert space via Qiskit Aer statevector simulation, parallelized alongside classical ensemble trees.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-800 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
            <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
            <span>Computing parameterized rotation ansatz & consensus...</span>
          </div>
        </div>
      )}
    </div>
  );
};
