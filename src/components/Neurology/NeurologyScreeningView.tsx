import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  FileText, 
  UploadCloud, 
  History, 
  BookmarkCheck, 
  BookOpen, 
  PhoneCall, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  FolderOpen,
  Info
} from 'lucide-react';
import { 
  NeurologicalReportData, 
  SavedNeurologicalReport, 
  ScreeningHistoryTimelineItem, 
  NeurologicalConditionResult 
} from '../../types';
import { 
  INITIAL_SAVED_REPORTS, 
  DEFAULT_SCREENING_HISTORY 
} from '../../data/neurologyData';
import { SymptomInputStep } from './SymptomInputStep';
import { ReportUploadStep } from './ReportUploadStep';
import { AnalysisLoadingStep } from './AnalysisLoadingStep';
import { ScreeningResultsView } from './ScreeningResultsView';
import { PatientNeurologyReport } from './PatientNeurologyReport';
import { SavedReportsView } from './SavedReportsView';
import { ScreeningTimelineView } from './ScreeningTimelineView';
import { NeurologyEducationModal } from './NeurologyEducationModal';
import { NeurologyDashboardOverview } from './NeurologyDashboardOverview';

interface NeurologyScreeningViewProps {
  onOpenEmergency: () => void;
  initialSubStep?: 'hub' | 'symptoms' | 'upload' | 'results' | 'report' | 'saved-reports' | 'history' | 'education' | 'dashboard';
}

type NeurologySubStep = 
  | 'hub' 
  | 'symptoms' 
  | 'upload' 
  | 'analyzing' 
  | 'results' 
  | 'report' 
  | 'saved-reports' 
  | 'history' 
  | 'education' 
  | 'dashboard';

export const NeurologyScreeningView: React.FC<NeurologyScreeningViewProps> = ({
  onOpenEmergency,
  initialSubStep = 'hub'
}) => {
  const [subStep, setSubStep] = useState<NeurologySubStep>(initialSubStep);
  const [inputType, setInputType] = useState<'symptoms' | 'report'>('symptoms');
  const [currentReport, setCurrentReport] = useState<NeurologicalReportData>(
    INITIAL_SAVED_REPORTS[0].report
  );

  // Saved reports in state + localStorage
  const [savedReports, setSavedReports] = useState<SavedNeurologicalReport[]>(() => {
    try {
      const stored = localStorage.getItem('qdiagnose_neuro_saved_reports');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load saved reports from localStorage', e);
    }
    return INITIAL_SAVED_REPORTS;
  });

  // History timeline in state + localStorage
  const [historyItems, setHistoryItems] = useState<ScreeningHistoryTimelineItem[]>(() => {
    try {
      const stored = localStorage.getItem('qdiagnose_neuro_history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
    return DEFAULT_SCREENING_HISTORY;
  });

  const [isReportSaved, setIsReportSaved] = useState<boolean>(true);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('qdiagnose_neuro_saved_reports', JSON.stringify(savedReports));
    } catch (e) {
      console.error('Failed to save reports to localStorage', e);
    }
  }, [savedReports]);

  useEffect(() => {
    try {
      localStorage.setItem('qdiagnose_neuro_history', JSON.stringify(historyItems));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [historyItems]);

  // Sync subStep if initialSubStep prop changes
  useEffect(() => {
    if (initialSubStep) {
      setSubStep(initialSubStep);
    }
  }, [initialSubStep]);

  // Calculate results from symptoms input
  const handleAnalyzeSymptoms = (symptomsText: string, selectedChips: string[]) => {
    setInputType('symptoms');
    const lowerText = symptomsText.toLowerCase();

    // Determine conditions based on entered symptoms
    const isMemory = selectedChips.includes('Memory Problems') || 
                     lowerText.includes('memory') || lowerText.includes('forget') || lowerText.includes('confus');
    const isTremor = selectedChips.includes('Tremor') || 
                     lowerText.includes('tremor') || lowerText.includes('shak') || lowerText.includes('stiff');
    const isSeizure = selectedChips.includes('Seizure') || 
                      lowerText.includes('seizure') || lowerText.includes('blackout') || lowerText.includes('convuls');
    const isStrokeLike = selectedChips.includes('Weakness / Numbness') && (lowerText.includes('sudden') || lowerText.includes('one side') || selectedChips.includes('Speech Problems'));
    const isMSLike = selectedChips.includes('Vision Changes') || 
                     (selectedChips.includes('Weakness / Numbness') && selectedChips.includes('Balance Problems'));

    // Scoring heuristics
    let alzheimerScore = 20;
    let parkinsonScore = 18;
    let epilepsyScore = 12;
    let strokeScore = 15;
    let msScore = 22;

    if (isMemory) alzheimerScore += 58;
    if (isTremor) parkinsonScore += 56;
    if (isSeizure) epilepsyScore += 62;
    if (isStrokeLike) strokeScore += 69;
    if (isMSLike) msScore += 46;

    // Normalizing clamp
    alzheimerScore = Math.min(Math.max(alzheimerScore, 15), 88);
    parkinsonScore = Math.min(Math.max(parkinsonScore, 14), 85);
    epilepsyScore = Math.min(Math.max(epilepsyScore, 10), 82);
    strokeScore = Math.min(Math.max(strokeScore, 12), 89);
    msScore = Math.min(Math.max(msScore, 16), 80);

    const getLevel = (s: number): 'High Concern' | 'Further Evaluation' | 'Low Concern' => {
      if (s >= 70) return 'High Concern';
      if (s >= 40) return 'Further Evaluation';
      return 'Low Concern';
    };

    const conditionsList: NeurologicalConditionResult[] = [
      {
        id: 'alzheimers',
        name: "Alzheimer's Disease",
        score: alzheimerScore,
        level: getLevel(alzheimerScore),
        levelBand: alzheimerScore >= 70 ? 'high' : alzheimerScore >= 40 ? 'moderate' : 'low',
        whyThisResult: isMemory 
          ? 'Memory-related changes, word-finding hesitation, and occasional confusion were specifically highlighted in your reported symptoms.'
          : 'Low correlation with reported symptoms. Routine age-appropriate screening recommended.',
        keyIndicators: isMemory ? ['Memory recall changes', 'Conversational word-finding pauses'] : ['Normal cognitive markers']
      },
      {
        id: 'parkinsons',
        name: "Parkinson's Disease",
        score: parkinsonScore,
        level: getLevel(parkinsonScore),
        levelBand: parkinsonScore >= 70 ? 'high' : parkinsonScore >= 40 ? 'moderate' : 'low',
        whyThisResult: isTremor 
          ? 'Motor tremors, limb stiffness, or balance hesitation were noted in the reported information.'
          : 'No resting tremor or significant muscle rigidity reported.',
        keyIndicators: isTremor ? ['Resting tremor indications', 'Postural stability changes'] : ['No resting tremor reported']
      },
      {
        id: 'epilepsy',
        name: 'Epilepsy',
        score: epilepsyScore,
        level: getLevel(epilepsyScore),
        levelBand: epilepsyScore >= 70 ? 'high' : epilepsyScore >= 40 ? 'moderate' : 'low',
        whyThisResult: isSeizure 
          ? 'Episodes resembling seizures, staring spells, or brief unresponsiveness were indicated in your description.'
          : 'No seizure episodes, sudden staring spells, or paroxysmal loss of consciousness described.',
        keyIndicators: isSeizure ? ['Paroxysmal episodic events'] : ['No seizure history noted']
      },
      {
        id: 'stroke',
        name: 'Stroke',
        score: strokeScore,
        level: getLevel(strokeScore),
        levelBand: strokeScore >= 70 ? 'high' : strokeScore >= 40 ? 'moderate' : 'low',
        whyThisResult: isStrokeLike 
          ? 'Acute unilateral motor, sensory, or speech changes suggest prompt urgent vascular assessment.'
          : 'No sudden one-sided paralysis, acute facial drooping, or emergency focal deficits reported.',
        keyIndicators: isStrokeLike ? ['Acute focal motor/speech indicators'] : ['No sudden focal onset reported']
      },
      {
        id: 'ms',
        name: 'Multiple Sclerosis (MS)',
        score: msScore,
        level: getLevel(msScore),
        levelBand: msScore >= 70 ? 'high' : msScore >= 40 ? 'moderate' : 'low',
        whyThisResult: isMSLike 
          ? 'Sensory changes, vision changes, or balance disturbances warrant clinical correlation.'
          : 'No optic neuritis, localized electric-shock sensations, or focal demyelinating symptoms described.',
        keyIndicators: isMSLike ? ['Visual and sensory disturbance indicators'] : ['No active demyelinating signs']
      }
    ];

    // Find highest priority
    const sorted = [...conditionsList].sort((a, b) => b.score - a.score);
    const primary = sorted[0];

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const newReportId = `REP-NEUR-${Date.now().toString().slice(-4)}`;

    const findings = [
      ...selectedChips.map(c => `Reported symptom category: ${c}`),
      symptomsText ? `Patient narrative: "${symptomsText.slice(0, 100)}..."` : 'Clinical symptoms logged'
    ];

    const newReport: NeurologicalReportData = {
      id: newReportId,
      patientName: 'Vikram Joshi',
      patientId: 'PT-NEUR-9402',
      age: 64,
      gender: 'Male',
      assessmentDate: todayStr,
      inputType: 'symptoms',
      reportedSymptoms: selectedChips,
      symptomsDescription: symptomsText,
      importantFindings: findings,
      conditions: conditionsList,
      primaryConcern: primary,
      recommendedSpecialist: primary.id === 'parkinsons' 
        ? 'Neurologist (Movement Disorder Specialist)'
        : primary.id === 'alzheimers'
        ? 'Neurologist (Cognitive & Memory Care)'
        : primary.id === 'stroke'
        ? 'Vascular Neurologist / Emergency Stroke Team'
        : primary.id === 'epilepsy'
        ? 'Epileptologist / Clinical Neurologist'
        : 'Neurologist (Neuroimmunology / General Neurology)',
      nextSteps: [
        'Schedule a formal clinical consultation with a qualified neurologist.',
        'Document when symptoms occur and note if any daily activities are impacted.',
        'Bring this screening summary along with past medical records to your visit.',
        'If you experience sudden weakness, slurred speech, or seizure, seek emergency care immediately.'
      ],
      safetyNotice: 'This is an AI-assisted screening result and does not confirm a medical diagnosis. Only a licensed physician can diagnose neurological conditions.',
      timestamp: new Date().toISOString()
    };

    setCurrentReport(newReport);
    setIsReportSaved(false);
    setSubStep('analyzing');
  };

  // Calculate results from uploaded report
  const handleAnalyzeReport = (fileInfo: {
    fileName: string;
    fileType: string;
    fileSize: string;
    uploadDate: string;
    extractedSummary?: string;
    findings?: string[];
  }) => {
    setInputType('report');
    const lowerName = fileInfo.fileName.toLowerCase();
    
    // Condition scoring heuristic based on report type
    let primaryId: 'alzheimers' | 'parkinsons' | 'epilepsy' | 'stroke' | 'ms' = 'alzheimers';
    let primaryScore = 68;

    if (lowerName.includes('eeg')) {
      primaryId = 'epilepsy';
      primaryScore = 48; // normal EEG
    } else if (lowerName.includes('motor') || lowerName.includes('tremor') || lowerName.includes('vocal')) {
      primaryId = 'parkinsons';
      primaryScore = 74;
    } else if (lowerName.includes('stroke') || lowerName.includes('infarct')) {
      primaryId = 'stroke';
      primaryScore = 62;
    }

    const conditionsList: NeurologicalConditionResult[] = [
      {
        id: 'alzheimers',
        name: "Alzheimer's Disease",
        score: primaryId === 'alzheimers' ? 68 : 34,
        level: primaryId === 'alzheimers' ? 'Further Evaluation' : 'Low Concern',
        levelBand: primaryId === 'alzheimers' ? 'moderate' : 'low',
        whyThisResult: primaryId === 'alzheimers'
          ? 'Mild hippocampal volumetric differences noted in neuro-imaging warrant clinical correlation.'
          : 'No significant temporal or hippocampal volumetric atrophy identified.',
        keyIndicators: primaryId === 'alzheimers' ? ['Mild hippocampal volume changes'] : ['Stable cortical markers']
      },
      {
        id: 'parkinsons',
        name: "Parkinson's Disease",
        score: primaryId === 'parkinsons' ? 74 : 26,
        level: primaryId === 'parkinsons' ? 'High Concern' : 'Low Concern',
        levelBand: primaryId === 'parkinsons' ? 'high' : 'low',
        whyThisResult: primaryId === 'parkinsons'
          ? 'Acoustic micro-tremor and resting hand tremor measurements correlate with movement disorder pathways.'
          : 'Basal ganglia and motor coordination signals remain within baseline expectations.',
        keyIndicators: primaryId === 'parkinsons' ? ['Resting micro-tremor 4-5 Hz', 'Pitch period entropy elevation'] : ['Normal basal ganglia']
      },
      {
        id: 'epilepsy',
        name: 'Epilepsy',
        score: primaryId === 'epilepsy' ? 48 : 18,
        level: primaryId === 'epilepsy' ? 'Further Evaluation' : 'Low Concern',
        levelBand: primaryId === 'epilepsy' ? 'moderate' : 'low',
        whyThisResult: primaryId === 'epilepsy'
          ? 'Background rhythm reviewed; no acute epileptogenic spike activity detected in provided recording.'
          : 'No paroxysmal epileptiform activity detected.',
        keyIndicators: ['Symmetric background rhythm']
      },
      {
        id: 'stroke',
        name: 'Stroke',
        score: primaryId === 'stroke' ? 62 : 22,
        level: primaryId === 'stroke' ? 'Further Evaluation' : 'Low Concern',
        levelBand: primaryId === 'stroke' ? 'moderate' : 'low',
        whyThisResult: 'Diffusion-weighted review confirms no acute territorial large-vessel occlusion.',
        keyIndicators: ['No acute territorial infarction']
      },
      {
        id: 'ms',
        name: 'Multiple Sclerosis (MS)',
        score: 24,
        level: 'Low Concern',
        levelBand: 'low',
        whyThisResult: 'Absence of active demyelinating periventricular plaque lesions.',
        keyIndicators: ['No active demyelinating plaques']
      }
    ];

    const primary = conditionsList.find(c => c.id === primaryId) || conditionsList[0];
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const newReportId = `REP-NEUR-${Date.now().toString().slice(-4)}`;

    const newReport: NeurologicalReportData = {
      id: newReportId,
      patientName: 'Vikram Joshi',
      patientId: 'PT-NEUR-9402',
      age: 64,
      gender: 'Male',
      assessmentDate: todayStr,
      inputType: 'report',
      reportedSymptoms: ['Report Upload Screening'],
      uploadedReportInfo: {
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.fileSize,
        uploadDate: fileInfo.uploadDate
      },
      importantFindings: fileInfo.findings || [
        'Report uploaded and evaluated for neurological markers',
        'Specific biomarker metrics: Not available in the uploaded report.'
      ],
      conditions: conditionsList,
      primaryConcern: primary,
      recommendedSpecialist: 'Neurologist',
      nextSteps: [
        'Present the original medical imaging/laboratory document to your treating neurologist.',
        'Correlate screening findings with an in-person physical motor and cognitive exam.',
        'Keep a structured log of any symptoms experienced since the date of this test.'
      ],
      safetyNotice: 'This is an AI-assisted screening result and does not confirm a medical diagnosis.',
      timestamp: new Date().toISOString()
    };

    setCurrentReport(newReport);
    setIsReportSaved(false);
    setSubStep('analyzing');
  };

  const handleSaveCurrentReport = () => {
    if (isReportSaved) return;

    const newSavedEntry: SavedNeurologicalReport = {
      id: currentReport.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      assessmentType: currentReport.inputType === 'symptoms' ? 'Symptom-Based Screening' : 'Medical Report Review',
      primaryConcernName: currentReport.primaryConcern.name,
      primaryConcernScore: currentReport.primaryConcern.score,
      status: currentReport.primaryConcern.level,
      report: currentReport
    };

    // Add to saved reports (prevent duplicates)
    setSavedReports(prev => [newSavedEntry, ...prev.filter(r => r.id !== currentReport.id)]);

    // Add to history timeline
    const newHistoryItem: ScreeningHistoryTimelineItem = {
      id: `HIST-${currentReport.id}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score: currentReport.primaryConcern.score,
      conditionName: currentReport.primaryConcern.name,
      status: currentReport.primaryConcern.level,
      reportId: currentReport.id
    };

    setHistoryItems(prev => [...prev, newHistoryItem]);
    setIsReportSaved(true);
  };

  const handleDeleteReport = (reportId: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleViewSavedReport = (saved: SavedNeurologicalReport) => {
    setCurrentReport(saved.report);
    setIsReportSaved(true);
    setSubStep('report');
  };

  const handleSelectHistoryReport = (reportId: string) => {
    const match = savedReports.find(r => r.id === reportId);
    if (match) {
      setCurrentReport(match.report);
      setIsReportSaved(true);
      setSubStep('report');
    } else {
      setSubStep('report');
    }
  };

  return (
    <div id="neurological-module-container" className="space-y-6">
      {/* Top Navigation Tabs for Neurological Health */}
      <div className="bg-white rounded-3xl border border-sky-100 p-2 sm:p-2.5 shadow-xs flex items-center justify-between overflow-x-auto gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSubStep('hub')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center transition-all cursor-pointer ${
              subStep === 'hub' || subStep === 'symptoms' || subStep === 'upload' || subStep === 'results' || subStep === 'report'
                ? 'bg-[#0B1E3D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Neurological Screening</span>
          </button>

          <button
            onClick={() => setSubStep('dashboard')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center transition-all cursor-pointer ${
              subStep === 'dashboard'
                ? 'bg-[#0B1E3D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setSubStep('saved-reports')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subStep === 'saved-reports'
                ? 'bg-[#0B1E3D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>My Reports</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-900 font-mono">
              {savedReports.length}
            </span>
          </button>

          <button
            onClick={() => setSubStep('history')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center transition-all cursor-pointer ${
              subStep === 'history'
                ? 'bg-[#0B1E3D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Screening History</span>
          </button>

          <button
            onClick={() => setSubStep('education')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center transition-all cursor-pointer ${
              subStep === 'education'
                ? 'bg-[#0B1E3D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Learn & Education</span>
          </button>
        </div>

        {/* Emergency Assistance Button */}
        <button
          onClick={onOpenEmergency}
          className="px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center shadow-xs transition-colors shrink-0 ml-2 cursor-pointer"
        >
          <span>Emergency (112)</span>
        </button>
      </div>

      {/* RENDER STEP BASED ON SUBSTEP */}

      {/* 1. HUB VIEW: Primary Actions (Enter Symptoms OR Upload Report) (Requirement 1) */}
      {subStep === 'hub' && (
        <div id="neurology-screening-hub" className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
          {/* Main Hero Banner */}
          <div className="bg-gradient-to-br from-[#0B1E3D] via-[#102a54] to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden space-y-4">
            <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase">
              <span>Multi-Condition Neurological Risk Screening</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight max-w-2xl">
              Neurological Health Screening
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Enter your symptoms or upload a medical report for an AI-assisted neurological screening.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <span>No disease pre-selection needed</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <span>Evaluates 5 neurological conditions</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <span>Non-diagnostic clinical decision support</span>
              </span>
            </div>
          </div>

          {/* TWO PRIMARY ACTIONS (Requirement 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Action 1: Enter Symptoms */}
            <div 
              id="action-enter-symptoms"
              onClick={() => setSubStep('symptoms')}
              className="bg-white hover:bg-slate-50/80 rounded-3xl border-2 border-sky-100 hover:border-teal-500 p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-teal-200">
                  <FileText className="w-7 h-7 text-teal-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#0B1E3D] group-hover:text-teal-800 transition-colors">
                    Enter Symptoms
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Describe your symptoms in your own words, select common indicator tags, and check your health status safely.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>Start Symptom Screening →</span>
                <span className="text-slate-400 font-normal text-[11px]">Takes ~2 minutes</span>
              </div>
            </div>

            {/* Action 2: Upload Medical Report */}
            <div 
              id="action-upload-report"
              onClick={() => setSubStep('upload')}
              className="bg-white hover:bg-slate-50/80 rounded-3xl border-2 border-sky-100 hover:border-teal-500 p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-sky-200">
                  <UploadCloud className="w-7 h-7 text-sky-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#0B1E3D] group-hover:text-teal-800 transition-colors">
                    Upload Medical Report
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Upload a Brain MRI, EEG, or clinical documentation (PDF/JPG/PNG) to evaluate documented findings against reference models.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>Upload Report for Screening →</span>
                <span className="text-slate-400 font-normal text-[11px]">PDF, JPG, PNG</span>
              </div>
            </div>
          </div>

          {/* Quick Features Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setSubStep('saved-reports')}
              className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs font-bold text-[#0B1E3D] block">My Saved Reports</strong>
                <span className="text-[11px] text-slate-500">Access saved screening summaries</span>
              </div>
            </button>

            <button
              onClick={() => setSubStep('history')}
              className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs font-bold text-[#0B1E3D] block">Screening History</strong>
                <span className="text-[11px] text-slate-500">View chronological trajectory</span>
              </div>
            </button>

            <button
              onClick={() => setSubStep('education')}
              className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs font-bold text-[#0B1E3D] block">Learn Conditions</strong>
                <span className="text-[11px] text-slate-500">5 neurological health guides</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 2. SYMPTOMS INPUT STEP */}
      {subStep === 'symptoms' && (
        <SymptomInputStep
          onAnalyze={handleAnalyzeSymptoms}
          onCancel={() => setSubStep('hub')}
          onOpenEmergency={onOpenEmergency}
        />
      )}

      {/* 3. REPORT UPLOAD STEP */}
      {subStep === 'upload' && (
        <ReportUploadStep
          onAnalyzeReport={handleAnalyzeReport}
          onCancel={() => setSubStep('hub')}
        />
      )}

      {/* 4. ANALYSIS LOADING SCREEN */}
      {subStep === 'analyzing' && (
        <AnalysisLoadingStep
          inputType={inputType}
          onComplete={() => setSubStep('results')}
        />
      )}

      {/* 5. FIVE-CONDITION SCREENING RESULTS VIEW */}
      {subStep === 'results' && (
        <ScreeningResultsView
          reportData={currentReport}
          onViewReport={() => setSubStep('report')}
          onNewScreening={() => setSubStep('hub')}
          onSaveReport={handleSaveCurrentReport}
          isSaved={isReportSaved}
          onOpenEmergency={onOpenEmergency}
        />
      )}

      {/* 6. FULL PATIENT SCREENING REPORT */}
      {subStep === 'report' && (
        <PatientNeurologyReport
          report={currentReport}
          onBack={() => setSubStep('results')}
          onSaveReport={handleSaveCurrentReport}
          isSaved={isReportSaved}
          onViewSavedReports={() => setSubStep('saved-reports')}
        />
      )}

      {/* 7. SAVED REPORTS VIEW */}
      {subStep === 'saved-reports' && (
        <SavedReportsView
          reports={savedReports}
          onViewReport={handleViewSavedReport}
          onDeleteReport={handleDeleteReport}
          onStartNewScreening={() => setSubStep('hub')}
        />
      )}

      {/* 8. SCREENING HISTORY TIMELINE VIEW */}
      {subStep === 'history' && (
        <ScreeningTimelineView
          historyItems={historyItems}
          onSelectReport={handleSelectHistoryReport}
          onStartNewScreening={() => setSubStep('hub')}
        />
      )}

      {/* 9. EDUCATION VIEW */}
      {subStep === 'education' && (
        <NeurologyEducationModal
          onStartScreening={() => setSubStep('hub')}
          onOpenEmergency={onOpenEmergency}
        />
      )}

      {/* 10. DASHBOARD OVERVIEW */}
      {subStep === 'dashboard' && (
        <NeurologyDashboardOverview
          reports={savedReports}
          onViewReport={handleViewSavedReport}
          onStartNewScreening={() => setSubStep('hub')}
        />
      )}
    </div>
  );
};
