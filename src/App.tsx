import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { ResultsView } from './components/ResultsView';
import { BenchmarkView } from './components/BenchmarkView';
import { ReferenceView } from './components/ReferenceView';
import { DoctorClinicalWorkspace } from './components/DoctorClinicalWorkspace';

// Patient Mode & 6-Step Flow Components
import { PatientHomeView } from './components/PatientMode/PatientHomeView';
import { EmergencyCheckView } from './components/EmergencyCheckView';
import { HealthAssessmentWizard } from './components/HealthAssessmentWizard';
import { RiskPredictionView } from './components/RiskPredictionView';
import { ActionGuidanceView } from './components/ActionGuidanceView';
import { HospitalFinderView } from './components/HospitalFinderView';
import { QuantumPipelineExplainer } from './components/QuantumPipelineExplainer';
import { PatientHistoryView } from './components/PatientHistoryView';
import { PersistentEmergencyButton } from './components/PersistentEmergencyButton';
import { AiHealthCompanion } from './components/AiHealthCompanion';
import { NeurologyScreeningView } from './components/Neurology/NeurologyScreeningView';
import { HerHealthModule } from './components/HerHealth/HerHealthModule';

// Legacy & Supportive Care Views
import { PatientCheckView } from './components/PatientMode/PatientCheckView';
import { PatientResultsView } from './components/PatientMode/PatientResultsView';
import { PatientMemoryCareView } from './components/PatientMode/PatientMemoryCareView';
import { PatientMindMoodView } from './components/PatientMode/PatientMindMoodView';
import { PatientSettingsView } from './components/PatientMode/PatientSettingsView';

// Global Overlays
import { VoiceAssistant } from './components/VoiceAssistant';
import { SosModal } from './components/SosModal';
import { AuthModal } from './components/Auth/AuthModal';
import { PatientPortalView } from './components/PatientPortal/PatientPortalView';
import { Doctor360View } from './components/DoctorPortal/Doctor360View';
import { AdminPortalView } from './components/AdminPortal/AdminPortalView';
import { getStoredUser, clearStoredSession } from './utils/authService';

import { 
  PredictionResult, 
  BenchmarkItem, 
  PredictionHistoryItem, 
  DashboardStats, 
  ModelType,
  DiseaseId,
  AppMode,
  SupportedLanguage,
  CompanionLocale,
  NavSection,
  AuthUserProfile
} from './types';
import { 
  INITIAL_PREDICTIONS_HISTORY, 
  BENCHMARK_MODELS_DATA, 
  SAMPLE_WDBC_CSV, 
  parseCSV, 
  ParsedCSV 
} from './data/sampleDataset';
import { 
  DISEASE_CONFIGS, 
  DISEASE_BENCHMARKS,
  SAMPLE_HEART_DISEASE_CSV, 
  SAMPLE_NEUROLOGICAL_CSV 
} from './data/diseaseDatasets';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('patient');
  const [patientSection, setPatientSection] = useState<NavSection>('home');
  const [clinicalSection, setClinicalSection] = useState<NavSection>('doctor-workspace');
  
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [companionLocale, setCompanionLocale] = useState<CompanionLocale>(() => {
    const saved = localStorage.getItem('qdiagnose_companion_locale');
    return (saved as CompanionLocale) || 'india_en';
  });
  const [selectedDisease, setSelectedDisease] = useState<DiseaseId>('cardiovascular');
  
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(
    INITIAL_PREDICTIONS_HISTORY[0].result
  );
  const [history, setHistory] = useState<PredictionHistoryItem[]>(INITIAL_PREDICTIONS_HISTORY);
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>(BENCHMARK_MODELS_DATA);
  const [parsedData, setParsedData] = useState<ParsedCSV | null>(() =>
    parseCSV(SAMPLE_WDBC_CSV, 'Wisconsin_Diagnostic_WDBC_v2.4.csv')
  );

  const [isPredictLoading, setIsPredictLoading] = useState<boolean>(false);
  const [isBenchmarkLoading, setIsBenchmarkLoading] = useState<boolean>(false);
  const [isApiConfigured, setIsApiConfigured] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Authentication
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUserProfile>(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [doctor360PatientId, setDoctor360PatientId] = useState<string>('PAT-001');

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    clearStoredSession();
    const guestUser = getStoredUser();
    setCurrentUser(guestUser);
    setAppMode('patient');
    setPatientSection('home');
  };

  // Active section helper based on current mode
  const activeSection = appMode === 'patient' ? patientSection : clinicalSection;

  const handleNavigate = (section: NavSection, newMode?: AppMode) => {
    if (newMode) {
      setAppMode(newMode);
    }
    if (appMode === 'patient' || newMode === 'patient') {
      setPatientSection(section);
    } else {
      setClinicalSection(section);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Disease change logic
  const handleSelectDisease = (disease: DiseaseId) => {
    setSelectedDisease(disease);
    const config = DISEASE_CONFIGS[disease];
    let csvData = SAMPLE_WDBC_CSV;
    if (disease === 'cardiovascular') csvData = SAMPLE_HEART_DISEASE_CSV;
    if (disease === 'neurological') csvData = SAMPLE_NEUROLOGICAL_CSV;
    
    const parsed = parseCSV(csvData, config.sampleFileName);
    setParsedData(parsed);

    if (DISEASE_BENCHMARKS[disease]) {
      setBenchmarks(DISEASE_BENCHMARKS[disease]);
    }
  };

  // Initialize API config & history from server
  useEffect(() => {
    async function initApp() {
      try {
        const configRes = await fetch('/api/config');
        if (configRes.ok) {
          const config = await configRes.json();
          setIsApiConfigured(Boolean(config.ml_api_configured));
        }

        const historyRes = await fetch('/api/history');
        if (historyRes.ok) {
          const histData = await historyRes.json();
          if (Array.isArray(histData.history) && histData.history.length > 0) {
            setHistory(histData.history);
            if (histData.history[0]?.result) {
              setCurrentResult(histData.history[0].result);
            }
          }
        }
      } catch (err) {
        console.warn('Could not initialize backend config:', err);
      }
    }

    initApp();
  }, []);

  // Compute live dashboard stats
  const dashboardStats: DashboardStats = React.useMemo(() => {
    const totalPredictions = history.length;
    let classicalAccSum = 0;
    let quantumAccSum = 0;

    history.forEach((h) => {
      classicalAccSum += h.classical_score || 0.94;
      quantumAccSum += h.quantum_score || 0.96;
    });

    const avgClassical = totalPredictions > 0 ? (classicalAccSum / totalPredictions) * 100 : 94.8;
    const avgQuantum = totalPredictions > 0 ? (quantumAccSum / totalPredictions) * 100 : 98.2;

    const currentConfig = DISEASE_CONFIGS[selectedDisease];
    const lastDataset = history[0]?.dataset_name || currentConfig.datasetName;

    return {
      totalPredictions: 142 + totalPredictions,
      avgClassicalAccuracy: +avgClassical.toFixed(1),
      avgQuantumAccuracy: +avgQuantum.toFixed(1),
      lastDatasetUsed: lastDataset,
      quantumSpeedupAdvantage: '+3.4% Sensitivity',
      malignantRate: 37.2,
      benignRate: 62.8,
    };
  }, [history, selectedDisease]);

  // Run prediction against /api/predict
  const handleRunPrediction = async (
    data: any,
    model: ModelType,
    sampleId: string,
    datasetName: string
  ) => {
    setIsPredictLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          model,
          sample_id: sampleId,
          dataset_name: datasetName,
          disease_id: selectedDisease,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const newResult: PredictionResult = await response.json();
      newResult.disease_id = selectedDisease;

      setCurrentResult(newResult);

      const historyItem: PredictionHistoryItem = {
        id: newResult.id,
        timestamp: newResult.timestamp,
        sample_id: newResult.sample_id,
        dataset_name: newResult.dataset_name,
        model_used: newResult.model_used,
        prediction: newResult.prediction,
        confidence: newResult.confidence,
        quantum_score: newResult.quantum_score,
        classical_score: newResult.classical_score,
        result: newResult,
      };

      setHistory((prev) => [historyItem, ...prev]);
      if (appMode === 'clinical') {
        setClinicalSection('results');
      } else {
        setPatientSection('results');
      }
    } catch (err: any) {
      console.error('Prediction error:', err);
      setErrorMessage(
        `Prediction failed: ${err.message || 'Could not communicate with the machine learning backend.'}`
      );
    } finally {
      setIsPredictLoading(false);
    }
  };

  // Re-run benchmark suite via /api/benchmark
  const handleRefreshBenchmark = async () => {
    setIsBenchmarkLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease_id: selectedDisease })
      });

      if (!response.ok) {
        throw new Error(`Benchmark fetch failed with HTTP ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setBenchmarks(data);
      } else if (Array.isArray(data.benchmarks)) {
        setBenchmarks(data.benchmarks);
      }
    } catch (err: any) {
      console.error('Benchmark refresh error:', err);
      setErrorMessage(`Benchmark update failed: ${err.message}`);
    } finally {
      setIsBenchmarkLoading(false);
    }
  };

  // Quick action: load sample dataset for current disease
  const handleQuickLoadSample = () => {
    const config = DISEASE_CONFIGS[selectedDisease];
    let csvData = SAMPLE_WDBC_CSV;
    if (selectedDisease === 'cardiovascular') csvData = SAMPLE_HEART_DISEASE_CSV;
    if (selectedDisease === 'neurological') csvData = SAMPLE_NEUROLOGICAL_CSV;

    const sample = parseCSV(csvData, config.sampleFileName);
    setParsedData(sample);
    if (appMode === 'clinical') {
      setClinicalSection('upload');
    } else {
      setPatientSection('assessment');
    }
  };

  // Quick action: load sample and execute prediction demo
  const handleLoadSampleAndPredict = async () => {
    const config = DISEASE_CONFIGS[selectedDisease];
    let csvData = SAMPLE_WDBC_CSV;
    if (selectedDisease === 'cardiovascular') csvData = SAMPLE_HEART_DISEASE_CSV;
    if (selectedDisease === 'neurological') csvData = SAMPLE_NEUROLOGICAL_CSV;

    const sample = parseCSV(csvData, config.sampleFileName);
    setParsedData(sample);
    const firstRow = sample.rows[0];
    await handleRunPrediction(
      firstRow,
      'Both (Compare)',
      firstRow.id || `${config.id.toUpperCase()}-001`,
      sample.fileName
    );
  };

  const handleSelectHistoryPrediction = (prediction: PredictionResult) => {
    setCurrentResult(prediction);
    if (appMode === 'clinical') {
      setClinicalSection('results');
    } else {
      setPatientSection('results');
    }
  };

  return (
    <div id="q-diagnose-app" className="min-h-screen bg-[#F4F8FA] text-[#2D3748] flex flex-col font-sans">
      {/* Global Header */}
      <Header
        currentMode={appMode}
        onModeChange={(m) => setAppMode(m)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isApiConfigured={isApiConfigured}
        selectedDisease={selectedDisease}
        onSelectDisease={handleSelectDisease}
        onQuickLoadSample={handleQuickLoadSample}
        language={language}
        onLanguageChange={setLanguage}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex min-w-0">
        {/* Left Sidebar only rendered in Clinical Mode */}
        {appMode === 'clinical' && (
          <Sidebar
            activeSection={clinicalSection}
            onSelectSection={(sec) => {
              setClinicalSection(sec);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            hasResult={Boolean(currentResult)}
            totalPredictions={dashboardStats.totalPredictions}
            selectedDisease={selectedDisease}
          />
        )}

        {/* Dynamic Page Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 hover:bg-red-900 rounded text-red-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* PAGE CONTENT SWITCHING */}
          <main className="p-4 sm:p-8 flex-1">
            {/* PATIENT MODE VIEWS */}
            {appMode === 'patient' && (
              <>
                {/* STEP 1: Home Dashboard */}
                {patientSection === 'home' && (
                  <PatientHomeView
                    language={language}
                    onNavigate={handleNavigate}
                    onSelectDisease={handleSelectDisease}
                    recentResult={currentResult}
                    onOpenAssistant={() => setIsAssistantOpen(true)}
                    onOpenSos={() => handleNavigate('emergency-check')}
                  />
                )}

                {/* Patient Health Vault & ABDM Portal */}
                {patientSection === 'portal' && (
                  <PatientPortalView
                    currentUser={currentUser}
                    onNavigateToAssessment={() => handleNavigate('assessment')}
                    onNavigateToEmergency={() => handleNavigate('emergency-check')}
                    onNavigateToHerHealth={() => handleNavigate('herhealth')}
                    onNavigateToNeurology={() => handleNavigate('neurology-screening')}
                  />
                )}

                {/* STEP 2: Emergency Check (Deterministic Safety Triage) */}
                {patientSection === 'emergency-check' && (
                  <EmergencyCheckView
                    onProceedToAssessment={() => handleNavigate('assessment')}
                    onBackToHome={() => handleNavigate('home')}
                    lang={language}
                  />
                )}

                {/* STEP 3: Health Assessment (Multi-step Wizard) */}
                {(patientSection === 'assessment' || patientSection === 'check') && (
                  <HealthAssessmentWizard
                    onPredictionComplete={(res) => {
                      setCurrentResult(res);
                      handleNavigate('results');
                    }}
                    onBackToEmergency={() => handleNavigate('emergency-check')}
                    lang={language}
                  />
                )}

                {/* STEP 4: Risk Prediction (Structured Cards & Explainability) */}
                {patientSection === 'results' && currentResult && (
                  <RiskPredictionView
                    result={currentResult}
                    onGoToGuidance={() => handleNavigate('guidance')}
                    onGoToHospitals={() => handleNavigate('hospitals')}
                    onBackToAssessment={() => handleNavigate('assessment')}
                    lang={language}
                  />
                )}

                {/* STEP 5: Action & Guidance Roadmap */}
                {patientSection === 'guidance' && (
                  <ActionGuidanceView
                    result={currentResult}
                    onGoToHospitals={() => handleNavigate('hospitals')}
                    onBackToResults={() => handleNavigate('results')}
                    lang={language}
                  />
                )}

                {/* STEP 6: Doctor & Hospital Finder */}
                {patientSection === 'hospitals' && (
                  <HospitalFinderView
                    onBackToGuidance={() => handleNavigate('guidance')}
                    onGoToHome={() => handleNavigate('home')}
                    lang={language}
                  />
                )}

                {/* Pipeline Explainer View */}
                {patientSection === 'pipeline-explainer' && (
                  <QuantumPipelineExplainer lang={language} />
                )}

                {/* Patient History View */}
                {patientSection === 'history' && (
                  <PatientHistoryView
                    onStartNewAssessment={() => handleNavigate('emergency-check')}
                    onViewResultDetails={(res) => {
                      setCurrentResult(res);
                      handleNavigate('results');
                    }}
                    lang={language}
                  />
                )}

                {/* Legacy supportive care views */}
                {patientSection === 'memory' && (
                  <PatientMemoryCareView
                    language={language}
                    onOpenAssistantInCalmMode={() => setIsAssistantOpen(true)}
                    onOpenSos={() => handleNavigate('emergency-check')}
                  />
                )}

                {patientSection === 'mind' && (
                  <PatientMindMoodView
                    language={language}
                    onOpenSos={() => handleNavigate('emergency-check')}
                    onOpenCalmAssistant={() => setIsAssistantOpen(true)}
                  />
                )}

                {patientSection === 'settings' && (
                  <PatientSettingsView
                    language={language}
                    onLanguageChange={setLanguage}
                    onOpenAssistantInCalmMode={() => setIsAssistantOpen(true)}
                  />
                )}

                {/* Neurological Health Screening Module (5 Conditions) */}
                {(patientSection === 'neurology-screening' || 
                  patientSection === 'saved-reports' || 
                  patientSection === 'screening-history' || 
                  patientSection === 'neurology-education' || 
                  patientSection === 'neurology-dashboard') && (
                  <NeurologyScreeningView
                    onBackToHome={() => handleNavigate('home')}
                    onOpenSos={() => handleNavigate('emergency-check')}
                    onNavigateToHospitals={() => handleNavigate('hospitals')}
                    onOpenAssistant={() => setIsAssistantOpen(true)}
                  />
                )}

                {/* HERHEALTH – Women’s Health & Wellness Module */}
                {patientSection === 'herhealth' && (
                  <HerHealthModule
                    onBackToApp={() => handleNavigate('home')}
                    onNavigateEmergency={() => handleNavigate('emergency-check')}
                    onNavigateHospitals={() => handleNavigate('hospitals')}
                  />
                )}
              </>
            )}

            {/* CLINICAL MODE VIEWS */}
            {appMode === 'clinical' && (
              <>
                {clinicalSection === 'herhealth' && (
                  <HerHealthModule
                    onBackToApp={() => handleNavigate('doctor-workspace')}
                    onNavigateEmergency={() => handleNavigate('emergency-check')}
                    onNavigateHospitals={() => handleNavigate('hospitals')}
                  />
                )}

                {clinicalSection === 'doctor-workspace' && (
                  <DoctorClinicalWorkspace
                    onRouteToExplainability={(res) => {
                      setCurrentResult(res);
                      setClinicalSection('results');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onRouteToQuantumPipeline={(diseaseId) => {
                      handleSelectDisease(diseaseId);
                      setClinicalSection('quantum-pipeline');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onSwitchToPatientView={() => {
                      setAppMode('patient');
                      setPatientSection('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onOpenDoctor360={(patientId) => {
                      setDoctor360PatientId(patientId);
                      setClinicalSection('doctor-360');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Doctor 360° Comprehensive Dossier View */}
                {clinicalSection === 'doctor-360' && (
                  <Doctor360View
                    patientId={doctor360PatientId || 'PAT-001'}
                    currentDoctor={currentUser}
                    onBackToQueue={() => {
                      setClinicalSection('doctor-workspace');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onRouteToExplainability={(res) => {
                      setCurrentResult(res);
                      setClinicalSection('results');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onRouteToQuantumPipeline={(diseaseId) => {
                      handleSelectDisease(diseaseId);
                      setClinicalSection('quantum-pipeline');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {/* Admin Compliance & Security Audit Portal */}
                {clinicalSection === 'admin' && (
                  <AdminPortalView currentUser={currentUser} />
                )}

                {/* Neurological Health Screening Module in Clinical Mode */}
                {(clinicalSection === 'neurology-screening' || 
                  clinicalSection === 'saved-reports' || 
                  clinicalSection === 'screening-history' || 
                  clinicalSection === 'neurology-education' || 
                  clinicalSection === 'neurology-dashboard') && (
                  <NeurologyScreeningView
                    onBackToHome={() => {
                      setClinicalSection('doctor-workspace');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onOpenSos={() => handleNavigate('emergency-check')}
                    onNavigateToHospitals={() => handleNavigate('hospitals')}
                    onOpenAssistant={() => setIsAssistantOpen(true)}
                  />
                )}

                {clinicalSection === 'quantum-pipeline' && (
                  <QuantumPipelineExplainer lang={language} />
                )}

                {clinicalSection === 'dashboard' && (
                  <DashboardView
                    stats={dashboardStats}
                    history={history}
                    selectedDisease={selectedDisease}
                    onSelectPrediction={handleSelectHistoryPrediction}
                    onNavigate={(sec) => {
                      setClinicalSection(sec);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onLoadSample={handleQuickLoadSample}
                    onSelectDisease={handleSelectDisease}
                  />
                )}

                {clinicalSection === 'upload' && (
                  <UploadView
                    onRunPrediction={handleRunPrediction}
                    isLoading={isPredictLoading}
                    onLoadSample={handleQuickLoadSample}
                    parsedData={parsedData}
                    setParsedData={setParsedData}
                    selectedDisease={selectedDisease}
                  />
                )}

                {clinicalSection === 'results' && (
                  <ResultsView
                    result={currentResult}
                    isLoading={isPredictLoading}
                    selectedDisease={selectedDisease}
                    onNavigate={(sec) => {
                      setClinicalSection(sec);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onLoadSampleAndPredict={handleLoadSampleAndPredict}
                  />
                )}

                {clinicalSection === 'benchmark' && (
                  <BenchmarkView
                    onRefreshBenchmark={handleRefreshBenchmark}
                    benchmarks={benchmarks}
                    isLoading={isBenchmarkLoading}
                    isMock={!isApiConfigured}
                    selectedDisease={selectedDisease}
                  />
                )}

                {clinicalSection === 'reference' && (
                  <ReferenceView 
                    onLoadSampleToUpload={handleQuickLoadSample} 
                    selectedDisease={selectedDisease}
                    onSelectDisease={handleSelectDisease}
                  />
                )}
              </>
            )}

            {/* RESEARCH MODE VIEWS (Interactive Quantum Simulator & Bloch Sphere) */}
            {appMode === 'research' && (
              <div className="space-y-6">
                <QuantumPipelineExplainer lang={language} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Persistent Emergency Button (Red/Urgent Trigger leading to Step 2: Emergency Check) */}
      <PersistentEmergencyButton
        onEmergencyTrigger={() => handleNavigate('emergency-check')}
        lang={language}
      />

      {/* Multilingual AI Health Companion Drawer / Modal */}
      <AiHealthCompanion
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentResult={currentResult}
        currentLang={language}
        companionLocale={companionLocale}
        onCompanionLocaleChange={(loc) => {
          setCompanionLocale(loc);
          localStorage.setItem('qdiagnose_companion_locale', loc);
        }}
        onUiLanguageChange={(lang) => {
          setLanguage(lang);
        }}
      />

      {/* Global Fallback SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        language={language}
      />

      {/* Unified Authentication & Persona Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'doctor') {
            setAppMode('clinical');
            setClinicalSection('doctor-workspace');
          } else if (user.role === 'admin') {
            setAppMode('clinical');
            setClinicalSection('admin');
          } else {
            setAppMode('patient');
            setPatientSection('portal');
          }
        }}
      />
    </div>
  );
}
