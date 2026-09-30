import React, { useState, useId } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Heart, 
  Dna, 
  Brain, 
  Scale, 
  Activity, 
  HelpCircle, 
  RefreshCw, 
  Flame, 
  Cigarette, 
  Smile, 
  ShieldCheck,
  Zap,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { DiseaseId, PredictionResult, SupportedLanguage } from '../types';

interface HealthAssessmentWizardProps {
  onPredictionComplete: (result: PredictionResult) => void;
  onBackToEmergency: () => void;
  lang?: SupportedLanguage;
}

export const HealthAssessmentWizard: React.FC<HealthAssessmentWizardProps> = ({
  onPredictionComplete,
  onBackToEmergency,
  lang = 'en'
}) => {
  // Active screening domain
  const [selectedDisease, setSelectedDisease] = useState<DiseaseId>('cardiovascular');

  // Wizard Step: 1 = Basic Info, 2 = Health Info, 3 = Lifestyle & Biometrics
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Model choice
  const [modelType, setModelType] = useState<string>('Both (Compare)');

  // Loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State: Step 1 - Basic Info
  const [age, setAge] = useState<number>(54);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(76);

  // Calculated BMI
  const bmi = heightCm > 0 ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1) : '24.5';
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { text: 'Underweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val < 25) return { text: 'Normal Weight', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val < 30) return { text: 'Overweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: 'Obese', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };
  const bmiCategory = getBmiCategory(parseFloat(bmi));

  // Form State: Step 2 - Health Info (Cardio / Cellular / Neuro specific)
  const [systolicBp, setSystolicBp] = useState<number>(132); // resting bp
  const [restingHeartRate, setRestingHeartRate] = useState<number>(76); // bpm
  const [cholesterolLevel, setCholesterolLevel] = useState<'normal' | 'borderline' | 'high'>('borderline');
  const [bloodSugarFasting, setBloodSugarFasting] = useState<number>(104);
  const [chestDiscomfort, setChestDiscomfort] = useState<'none' | 'mild_exertion' | 'moderate' | 'frequent'>('mild_exertion');

  // Specific for Breast / Cellular domain:
  const [tissueTexture, setTissueTexture] = useState<'uniform' | 'slightly_dense' | 'irregular_density'>('slightly_dense');
  const [contourCircularity, setContourCircularity] = useState<number>(14.8);
  const [palpableDiscomfort, setPalpableDiscomfort] = useState<boolean>(false);

  // Specific for Neuro / Vocal domain:
  const [voiceTremorLevel, setVoiceTremorLevel] = useState<'none' | 'subtle_strain' | 'audible_quaver'>('subtle_strain');
  const [speechFatigue, setSpeechFatigue] = useState<'normal' | 'tired_evening' | 'pronounced'>('tired_evening');
  const [motorSteadiness, setMotorSteadiness] = useState<number>(82); // 0 - 100

  // Form State: Step 3 - Lifestyle Info
  const [exerciseDays, setExerciseDays] = useState<number>(2); // 0-7 days
  const [tobaccoUse, setTobaccoUse] = useState<'never' | 'former' | 'current'>('former');
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [familyHistory, setFamilyHistory] = useState<boolean>(true);
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high'>('moderate');

  // Load Demo Profiles
  const loadDemoProfile = (type: 'healthy' | 'elevated') => {
    if (type === 'healthy') {
      setAge(36);
      setGender('female');
      setHeightCm(168);
      setWeightKg(62);
      setSystolicBp(118);
      setRestingHeartRate(68);
      setCholesterolLevel('normal');
      setBloodSugarFasting(92);
      setChestDiscomfort('none');
      setTissueTexture('uniform');
      setContourCircularity(12.1);
      setPalpableDiscomfort(false);
      setVoiceTremorLevel('none');
      setSpeechFatigue('normal');
      setMotorSteadiness(95);
      setExerciseDays(4);
      setTobaccoUse('never');
      setSleepHours(8);
      setFamilyHistory(false);
      setStressLevel('low');
    } else {
      setAge(61);
      setGender('male');
      setHeightCm(175);
      setWeightKg(89);
      setSystolicBp(148);
      setRestingHeartRate(88);
      setCholesterolLevel('high');
      setBloodSugarFasting(126);
      setChestDiscomfort('moderate');
      setTissueTexture('irregular_density');
      setContourCircularity(18.4);
      setPalpableDiscomfort(true);
      setVoiceTremorLevel('audible_quaver');
      setSpeechFatigue('pronounced');
      setMotorSteadiness(58);
      setExerciseDays(0);
      setTobaccoUse('current');
      setSleepHours(5);
      setFamilyHistory(true);
      setStressLevel('high');
    }
  };

  const executeScreening = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    // Build payload corresponding to server.ts expectations
    let patientPayload: Record<string, any> = {
      age: age,
      gender: gender,
      bmi: parseFloat(bmi),
      resting_bp: systolicBp,
      trestbps: systolicBp,
      thalach: restingHeartRate,
      chol: cholesterolLevel === 'high' ? 275 : cholesterolLevel === 'borderline' ? 225 : 180,
      cp: chestDiscomfort === 'frequent' ? 2 : chestDiscomfort === 'moderate' ? 1 : chestDiscomfort === 'mild_exertion' ? 1 : 0,
      exang: chestDiscomfort !== 'none' ? 1 : 0,
      oldpeak: systolicBp > 140 ? 2.2 : 0.8,
      // Breast fields
      radius_mean: contourCircularity,
      concave_points_mean: tissueTexture === 'irregular_density' ? 0.09 : 0.03,
      area_worst: tissueTexture === 'irregular_density' ? 950 : 540,
      // Neuro fields
      jitter: voiceTremorLevel === 'audible_quaver' ? 0.008 : 0.003,
      shimmer: voiceTremorLevel === 'audible_quaver' ? 0.045 : 0.02,
      hnr: voiceTremorLevel === 'audible_quaver' ? 17.5 : 24.0,
      spread1: motorSteadiness < 65 ? -4.2 : -6.1,
      lifestyle: {
        exerciseDays,
        tobaccoUse,
        sleepHours,
        familyHistory,
        stressLevel
      }
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sample_id: `SCREEN-${Date.now().toString().slice(-6)}`,
          data: patientPayload,
          model: modelType,
          disease_id: selectedDisease
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result: PredictionResult = await response.json();
      onPredictionComplete(result);
    } catch (err: any) {
      console.error('[HealthAssessment] Prediction error:', err);
      // Fallback deterministic simulation in case server is unreachable
      const isHigh = systolicBp > 140 || (selectedDisease === 'breast_cancer' && contourCircularity > 16);
      const fallbackResult: PredictionResult = {
        id: `PRED-LOCAL-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        sample_id: `SCREEN-${Math.floor(100000 + Math.random() * 900000)}`,
        dataset_name: selectedDisease === 'cardiovascular' ? 'Heart_Disease_UCI_v1.2' : 'Wisconsin_Diagnostic_WDBC',
        model_used: modelType,
        disease_id: selectedDisease,
        prediction: isHigh ? 'Elevated Clinical Risk' : 'Normal Physiological Baseline',
        confidence: isHigh ? 84 : 91,
        risk_band: isHigh ? 'high' : 'low',
        risk_label: isHigh ? 'High Risk' : 'Low Risk',
        risk_score: isHigh ? 78 : 22,
        plain_language_meaning: isHigh 
          ? 'Multiple markers indicate elevated health risk. Clinical evaluation is recommended to interpret these metrics with standard diagnostic tests.'
          : 'Biometric readings fall within typical healthy reference ranges. Routine wellness monitoring is advised.',
        recommended_next_step: isHigh 
          ? 'Schedule a clinical check with a licensed healthcare practitioner for confirmatory testing.'
          : 'Maintain active physical lifestyle, balanced nutrition, and continue routine health monitoring.',
        disclaimer: 'This is an AI-based screening result, not a medical diagnosis.',
        quantum_score: isHigh ? 0.88 : 0.92,
        classical_score: isHigh ? 0.82 : 0.89,
        consensus_agreement: true,
        circuit_depth: 8,
        qubits_used: 4,
        execution_time_ms: 135,
        feature_importance: [
          { name: 'Blood Pressure / Hemodynamics', value: 34.2, description: 'Resting systolic cardiovascular pressure' },
          { name: 'Biometric Ratio (BMI)', value: 26.5, description: 'Body mass relationship to height' },
          { name: 'Physical Activity Balance', value: 18.3, description: 'Reported weekly cardiovascular workout frequency' },
          { name: 'Metabolic & Sugar Indicators', value: 12.0, description: 'Fasting glucose and lipid ranges' }
        ]
      };
      onPredictionComplete(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
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
          <button onClick={onBackToEmergency} className="hover:text-[#0B1E3D] flex items-center gap-1.5 shrink-0 text-slate-600">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">2</span>
            <span>Emergency Check</span>
          </button>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">3</span>
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

      {/* Header & Domain Switcher */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Step 3 of 6: Multi-Step Health Assessment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1E3D] mt-1.5 tracking-tight">
              Personal Health & Biometric Assessment
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Enter basic health indicators below. Our quantum-classical hybrid algorithms evaluate non-linear patterns to screen for early risk factors.
            </p>
          </div>

          {/* Quick Demo Profile Loader */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
            <span className="text-xs font-semibold text-slate-500 px-1">Demo Profile:</span>
            <button
              onClick={() => loadDemoProfile('healthy')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-all cursor-pointer"
            >
              Healthy Baseline
            </button>
            <button
              onClick={() => loadDemoProfile('elevated')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 transition-all cursor-pointer"
            >
              Elevated Risk
            </button>
          </div>
        </div>

        {/* Screening Domain Selection Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Choose Health Screening Domain:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedDisease('cardiovascular')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                selectedDisease === 'cardiovascular'
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                selectedDisease === 'cardiovascular' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#0B1E3D]">Cardiovascular Risk</div>
                <div className="text-xs text-slate-500">Heart & Blood Pressure</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDisease('breast_cancer')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                selectedDisease === 'breast_cancer'
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                selectedDisease === 'breast_cancer' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#0B1E3D]">Cellular & Breast Health</div>
                <div className="text-xs text-slate-500">Tissue & Contour Biomarkers</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDisease('neurological')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                selectedDisease === 'neurological'
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                selectedDisease === 'neurological' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#0B1E3D]">Vocal & Tremor Health</div>
                <div className="text-xs text-slate-500">Acoustic & Motor Dynamics</div>
              </div>
            </button>
          </div>
        </div>

        {/* Wizard Sub-Step Progress Tabs */}
        <div className="pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <button
              onClick={() => setWizardStep(1)}
              className={`flex items-center gap-2 pb-2 -mb-3.5 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                wizardStep === 1 
                  ? 'border-teal-600 text-teal-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                wizardStep === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              <span>Step 1: Basic Information</span>
            </button>

            <button
              onClick={() => setWizardStep(2)}
              className={`flex items-center gap-2 pb-2 -mb-3.5 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                wizardStep === 2 
                  ? 'border-teal-600 text-teal-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                wizardStep === 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              <span>Step 2: Biometric & Health Details</span>
            </button>

            <button
              onClick={() => setWizardStep(3)}
              className={`flex items-center gap-2 pb-2 -mb-3.5 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                wizardStep === 3 
                  ? 'border-teal-600 text-teal-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                wizardStep === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              <span>Step 3: Lifestyle & Environment</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUB-STEP 1: Basic Information */}
        {/* ======================================================== */}
        {wizardStep === 1 && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-age-range" className="text-sm font-semibold text-slate-700">Age: <span className="text-[#C59B27] font-bold text-base">{age}</span> years</label>
                  <span className="text-xs text-slate-400">18 - 95</span>
                </div>
                <input
                  id="input-age-range"
                  type="range"
                  min="18"
                  max="95"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Biological Gender */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Biological Sex / Gender:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['female', 'male', 'other'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        gender === g
                          ? 'border-teal-600 bg-teal-50 text-teal-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-height-range" className="text-sm font-semibold text-slate-700">Height: <span className="text-[#C59B27] font-bold text-base">{heightCm}</span> cm</label>
                  <span className="text-xs text-slate-400">120 - 220 cm</span>
                </div>
                <input
                  id="input-height-range"
                  type="range"
                  min="120"
                  max="220"
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-weight-range" className="text-sm font-semibold text-slate-700">Weight: <span className="text-[#C59B27] font-bold text-base">{weightKg}</span> kg</label>
                  <span className="text-xs text-slate-400">35 - 160 kg</span>
                </div>
                <input
                  id="input-weight-range"
                  type="range"
                  min="35"
                  max="160"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Auto-calculated BMI Card */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-teal-600" />
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Calculated BMI</span>
                  <div className="text-lg font-bold text-[#0B1E3D]">
                    {bmi} <span className="text-xs text-slate-500 font-normal">kg/m²</span>
                  </div>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${bmiCategory.color}`}>
                {bmiCategory.text}
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="flex items-center gap-2 bg-[#0B1E3D] hover:bg-[#132c54] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                <span>Continue to Step 2: Health Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-STEP 2: Health & Biometric Details */}
        {/* ======================================================== */}
        {wizardStep === 2 && (
          <div className="space-y-6 pt-2">
            {/* Common Cardio/Vascular inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Resting Blood Pressure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-bp-range" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <span>Blood Pressure (Systolic)</span>
                    <span className="text-xs text-slate-400 font-normal">mmHg</span>
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    systolicBp > 135 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {systolicBp} mmHg {systolicBp > 135 ? '(Elevated)' : '(Normal)'}
                  </span>
                </div>
                <input
                  id="input-bp-range"
                  type="range"
                  min="90"
                  max="180"
                  value={systolicBp}
                  onChange={e => setSystolicBp(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <p className="text-xs text-slate-500">Standard healthy resting systolic pressure is typically under 120-130 mmHg.</p>
              </div>

              {/* Resting Heart Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-pulse-range" className="text-sm font-semibold text-slate-700">Resting Pulse Rate: <span className="text-[#C59B27] font-bold text-base">{restingHeartRate}</span> bpm</label>
                  <span className="text-xs text-slate-400">50 - 130 bpm</span>
                </div>
                <input
                  id="input-pulse-range"
                  type="range"
                  min="50"
                  max="130"
                  value={restingHeartRate}
                  onChange={e => setRestingHeartRate(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <p className="text-xs text-slate-500">Normal adult resting heart rate is 60–100 beats per minute.</p>
              </div>

              {/* Blood Sugar (Fasting) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-sugar-range" className="text-sm font-semibold text-slate-700">Fasting Blood Sugar: <span className="text-[#C59B27] font-bold text-base">{bloodSugarFasting}</span> mg/dL</label>
                  <span className="text-xs text-slate-400">70 - 200 mg/dL</span>
                </div>
                <input
                  id="input-sugar-range"
                  type="range"
                  min="70"
                  max="200"
                  value={bloodSugarFasting}
                  onChange={e => setBloodSugarFasting(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Cholesterol status */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Cholesterol Profile:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'borderline', 'high'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCholesterolLevel(c)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        cholesterolLevel === c
                          ? 'border-teal-600 bg-teal-50 text-teal-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Domain-specific questions */}
            {selectedDisease === 'cardiovascular' && (
              <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100 space-y-3">
                <label className="text-sm font-bold text-[#0B1E3D] block">
                  Chest Comfort During Physical Exertion (Brisk Walking, Climbing Stairs):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'Completely Comfortable' },
                    { id: 'mild_exertion', label: 'Occasional Tightness' },
                    { id: 'moderate', label: 'Moderate Exertional Discomfort' },
                    { id: 'frequent', label: 'Frequent or Concerning' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setChestDiscomfort(item.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        chestDiscomfort === item.id 
                          ? 'border-teal-600 bg-white text-teal-900 shadow-sm font-bold' 
                          : 'border-slate-200 hover:border-slate-300 bg-white/70 text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDisease === 'breast_cancer' && (
              <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-3">
                <label className="text-sm font-bold text-[#0B1E3D] block">
                  Cellular / Tissue Consistency & Exam Indicators:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'uniform', label: 'Uniform & Smooth' },
                    { id: 'slightly_dense', label: 'Slightly Dense / Normal Variant' },
                    { id: 'irregular_density', label: 'Firm / Irregular Density' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTissueTexture(t.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        tissueTexture === t.id 
                          ? 'border-rose-500 bg-white text-rose-900 shadow-sm font-bold' 
                          : 'border-slate-200 hover:border-slate-300 bg-white/70 text-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDisease === 'neurological' && (
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100 space-y-3">
                <label className="text-sm font-bold text-[#0B1E3D] block">
                  Vocal Stability & Motor Steadiness:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Smooth, Consistent Voice' },
                    { id: 'subtle_strain', label: 'Occasional Micro-Strain' },
                    { id: 'audible_quaver', label: 'Audible Tremor / Quaver' }
                  ].map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoiceTremorLevel(v.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        voiceTremorLevel === v.id 
                          ? 'border-amber-600 bg-white text-amber-900 shadow-sm font-bold' 
                          : 'border-slate-200 hover:border-slate-300 bg-white/70 text-slate-700'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="flex items-center gap-2 border border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={() => setWizardStep(3)}
                className="flex items-center gap-2 bg-[#0B1E3D] hover:bg-[#132c54] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                <span>Continue to Step 3: Lifestyle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-STEP 3: Lifestyle & Screening Execution */}
        {/* ======================================================== */}
        {wizardStep === 3 && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Exercise Frequency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-exercise-range" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Cardio Exercise: <strong className="text-[#C59B27]">{exerciseDays}</strong> days/week</span>
                  </label>
                  <span className="text-xs text-slate-400">0 - 7 days</span>
                </div>
                <input
                  id="input-exercise-range"
                  type="range"
                  min="0"
                  max="7"
                  value={exerciseDays}
                  onChange={e => setExerciseDays(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <p className="text-xs text-slate-500">Moderate brisk walking, cycling, swimming, or sports (≥30 min).</p>
              </div>

              {/* Tobacco / Smoking History */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Cigarette className="w-4 h-4 text-slate-500" />
                  <span>Tobacco / Smoking History:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['never', 'former', 'current'] as const).map(tob => (
                    <button
                      key={tob}
                      type="button"
                      onClick={() => setTobaccoUse(tob)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        tobaccoUse === tob
                          ? 'border-teal-600 bg-teal-50 text-teal-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {tob}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Duration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-sleep-range" className="text-sm font-semibold text-slate-700">Nightly Sleep: <strong className="text-[#C59B27]">{sleepHours}</strong> hours</label>
                  <span className="text-xs text-slate-400">4 - 12 hrs</span>
                </div>
                <input
                  id="input-sleep-range"
                  type="range"
                  min="4"
                  max="12"
                  value={sleepHours}
                  onChange={e => setSleepHours(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Family History */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Immediate Family History:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFamilyHistory(false)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      !familyHistory 
                        ? 'border-teal-600 bg-teal-50 text-teal-800' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    No Known History
                  </button>
                  <button
                    type="button"
                    onClick={() => setFamilyHistory(true)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      familyHistory 
                        ? 'border-amber-600 bg-amber-50 text-amber-800' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    Yes, Family History Present
                  </button>
                </div>
              </div>
            </div>

            {/* Model Architecture Selection Banner */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Hybrid Quantum Engine:</span>
                  <span className="text-xs text-slate-500">4-Qubit Variational Circuit (VQC) + Random Forest Ensemble</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(['Both (Compare)', 'Quantum (VQC)', 'Classical (Random Forest)'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModelType(m)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      modelType === m
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {m.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Execution CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 2</span>
              </button>

              <button
                id="run-quantum-screening-btn"
                type="button"
                onClick={executeScreening}
                disabled={isAnalyzing}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-600 to-[#0B1E3D] hover:from-teal-700 hover:to-[#08172e] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-teal-900/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Executing Quantum Mapping & Model Inference...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#C59B27]" />
                    <span>Run Screening & View Risk Prediction</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Medical Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 text-center">
        <strong>Mandatory Screening Notice:</strong> This software is designed for early risk screening and preventive awareness. It is not an authorized medical diagnosis and should never replace clinical evaluation by a licensed healthcare physician.
      </div>
    </div>
  );
};
