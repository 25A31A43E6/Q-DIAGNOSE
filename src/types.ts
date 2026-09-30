export interface FeatureImportance {
  name: string;
  value: number; // percentage, e.g. 28.5
  description?: string;
  rawValue?: number | string;
}

export type AppMode = 'patient' | 'clinical' | 'research';
export type PatientNavSection = 
  | 'home'
  | 'portal'
  | 'herhealth'
  | 'emergency-check'
  | 'assessment'
  | 'prediction'
  | 'guidance'
  | 'hospitals'
  | 'quantum-pipeline'
  | 'history'
  | 'check'
  | 'results'
  | 'neurology-screening'
  | 'saved-reports'
  | 'screening-history'
  | 'neurology-education'
  | 'neurology-dashboard'
  | 'memory'
  | 'mind'
  | 'assistant'
  | 'settings'
  | 'login';
export type ClinicalNavSection = 'doctor-workspace' | 'doctor-360' | 'admin' | 'herhealth' | 'neurology-screening' | 'dashboard' | 'upload' | 'results' | 'benchmark' | 'reference' | 'quantum-pipeline' | 'login';
export type ResearchNavSection = 'dashboard' | 'quantum-pipeline' | 'upload' | 'results' | 'benchmark' | 'reference' | 'login';
export type NavSection = PatientNavSection | ClinicalNavSection | ResearchNavSection;

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

export type CompanionLocale = 
  | 'india_en' 
  | 'american' 
  | 'british' 
  | 'hi' 
  | 'ta' 
  | 'te' 
  | 'bn' 
  | 'mr' 
  | 'kn' 
  | 'pa' 
  | 'gu' 
  | 'ml';

export interface CompanionLocaleOption {
  id: CompanionLocale;
  name: string;
  nativeName: string;
  flag: string;
  registerDescription: string;
  category: 'primary' | 'regional';
  defaultUiLang: SupportedLanguage;
}

export type RiskBand = 'low' | 'moderate' | 'high' | 'emergency';

export type DiseaseId = 'breast_cancer' | 'cardiovascular' | 'neurological';

export type PredictionLabel = 
  | 'Malignant' 
  | 'Benign' 
  | 'High Risk' 
  | 'Low Risk' 
  | "Parkinson's Indicated"
  | 'Healthy'
  | 'High Risk (Tremor/Motor)' 
  | 'Low Risk (Healthy/Control)';

export interface DiseaseConfig {
  id: DiseaseId;
  name: string;
  shortName: string;
  datasetName: string;
  datasetFullName: string;
  recordsCount: number;
  featureCount: number;
  defaultQubits: number;
  hilbertDimension: string;
  description: string;
  formatDescription: string;
  positiveLabel: PredictionLabel;
  negativeLabel: PredictionLabel;
  positiveSubtitle: string;
  negativeSubtitle: string;
  featureDimensionNote: string;
  pcaVariance: string;
  sampleFileName: string;
}

export type ModelType = 
  | 'Classical (Random Forest)' 
  | 'Quantum (VQC)' 
  | 'Quantum (QNN)' 
  | 'Quantum (QSVM)'
  | 'Both (Compare)' 
  | 'classical' 
  | 'quantum' 
  | 'quantum_vqc'
  | 'quantum_qnn'
  | 'quantum_qsvm'
  | 'both';

export interface QuantumOutputInfo {
  score: number;
  qubits: number;
  ansatz?: string;
  feature_map?: string;
  architecture?: string;
  circuit_structure?: string;
}

export interface ClassicalOutputInfo {
  score: number;
  trees: number;
  splitting_criterion: string;
}

export interface PredictionResult {
  id: string;
  timestamp: string;
  sample_id: string;
  disease_id?: DiseaseId;
  dataset_name: string;
  model_used: ModelType | string;
  prediction: PredictionLabel | string;
  confidence: number; // 0 to 100
  consensus?: 'Concordant' | 'Discordant';
  inference_latency_ms?: number;
  quantum_score: number; // 0.0 to 1.0 or percentage
  classical_score: number; // 0.0 to 1.0 or percentage
  feature_importance: FeatureImportance[];
  quantum_output?: QuantumOutputInfo;
  classical_output?: ClassicalOutputInfo;
  interpretation?: string;
  execution_time_ms?: number;
  circuit_depth?: number;
  qubits_used?: number;
  consensus_agreement?: boolean;
  notes?: string;
  is_mock?: boolean;
  raw_features?: Record<string, number | string>;
  plain_language_summary?: string;
  confidence_interval?: string;
  risk_band?: 'low' | 'moderate' | 'high';
  risk_label?: string; // e.g., 'Low Risk', 'Moderate Risk', 'High Risk'
  risk_score?: number; // 0 - 100 numeric estimate
  plain_language_meaning?: string;
  recommended_next_step?: string;
  disclaimer?: string;
}

export interface BenchmarkItem {
  model_name: string;
  type: 'classical' | 'quantum';
  accuracy: number; // e.g. 0.965
  precision: number; // e.g. 0.958
  recall: number; // e.g. 0.972
  f1: number; // e.g. 0.965
  roc_auc: number; // e.g. 0.988
  train_time: string; // e.g. "1.2s" or "48.5s"
  inference_time: string; // e.g. "4.2ms" or "18.6ms"
  notes?: string;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  sample_id: string;
  disease_id?: DiseaseId;
  dataset_name: string;
  model_used: string;
  prediction: PredictionLabel | string;
  confidence: number;
  quantum_score: number;
  classical_score: number;
  result: PredictionResult;
}

export interface DashboardStats {
  totalPredictions: number;
  avgClassicalAccuracy: number; // percentage
  avgQuantumAccuracy: number; // percentage
  lastDatasetUsed: string;
  quantumSpeedupAdvantage: string;
  malignantRate: number;
  benignRate: number;
}

// Memory Care Types (Alzheimer's / Cognitive Support)
export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  notes?: string;
}

export interface DailyRoutineItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  iconName: string;
}

export interface MemoryPromptCard {
  id: string;
  personName: string;
  relationship: string;
  photoUrl: string;
  memories: string[];
  favoriteTopic: string;
}

// Mind & Mood Types
export interface ScreenerQuestion {
  id: number;
  text: string;
}

export interface ScreenerResult {
  score: number;
  maxScore: number;
  severityBand: string;
  severityColor: string;
  plainSummary: string;
  recommendations: string[];
  date: string;
}

export interface CopingResource {
  id: string;
  title: string;
  category: 'breathing' | 'grounding' | 'sleep' | 'journaling' | 'relaxation';
  duration: string;
  description: string;
  instructions: string[];
}

export interface CrisisContact {
  name: string;
  number: string;
  description: string;
  available: string;
  isEmergency?: boolean;
}

// Neurological Screening Types
export type NeurologicalConditionId = 'alzheimers' | 'parkinsons' | 'epilepsy' | 'stroke' | 'ms';

export interface NeurologicalConditionResult {
  id: NeurologicalConditionId;
  name: string;
  score: number; // 0 - 100
  level: 'High Concern' | 'Further Evaluation' | 'Low Concern';
  levelBand: 'high' | 'moderate' | 'low';
  whyThisResult: string;
  keyIndicators: string[];
}

export interface NeurologicalReportData {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  assessmentDate: string;
  inputType: 'symptoms' | 'report';
  reportedSymptoms: string[];
  symptomsDescription?: string;
  uploadedReportInfo?: {
    fileName: string;
    fileType: string;
    fileSize: string;
    uploadDate: string;
  };
  importantFindings: string[];
  conditions: NeurologicalConditionResult[];
  primaryConcern: NeurologicalConditionResult;
  recommendedSpecialist: string;
  nextSteps: string[];
  safetyNotice: string;
  timestamp: string;
}

export interface SavedNeurologicalReport {
  id: string;
  date: string;
  assessmentType: string;
  primaryConcernName: string;
  primaryConcernScore: number;
  status: 'High Concern' | 'Further Evaluation' | 'Low Concern';
  report: NeurologicalReportData;
}

export interface ScreeningHistoryTimelineItem {
  id: string;
  date: string;
  score: number;
  conditionName: string;
  status: 'High Concern' | 'Further Evaluation' | 'Low Concern';
  reportId?: string;
}

export interface NeurologyEducationItem {
  id: NeurologicalConditionId;
  name: string;
  shortName: string;
  description: string;
  commonSymptoms: string[];
  whenToSeekHelp: string[];
  specialist: string;
}

// -------------------------------------------------------------
// USER, AUTH & CLINICAL DOSSIER TYPES
// -------------------------------------------------------------

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AuthUserProfile {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  ui_locale?: string;
  companion_locale?: string;
  patient_id?: string;
  doctor_id?: string;
  specialty?: string;
  hospital?: string;
}

export interface MedicalRecordEntry {
  id: string;
  patient_id: string;
  record_type: 'consultation' | 'discharge_summary' | 'imaging' | 'prescription' | 'doctor_notes';
  title: string;
  date: string;
  doctor_id?: string;
  author_name: string;
  content: string;
  diagnosis_codes?: string;
  attachments?: string;
}

export interface LabParameter {
  name: string;
  value: number | string;
  unit: string;
  reference_range: string;
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface LabReportEntry {
  id: string;
  patient_id: string;
  report_name: string;
  category: string;
  date: string;
  laboratory: string;
  doctor_name?: string;
  parameters: LabParameter[];
  notes?: string;
}

export interface MedicationEntry {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  route: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'historical';
  prescribing_doctor: string;
  instructions: string;
}

export interface PatientConsentEntry {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialty: string;
  hospital: string;
  access_medical_records: number;
  access_lab_reports: number;
  access_medications: number;
  access_ai_predictions: number;
  status: 'active' | 'revoked' | 'expired';
  granted_at: string;
  expires_at: string;
  revoked_at?: string;
  notes?: string;
}

export interface EmergencyAccessLogEntry {
  id: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  patient_name: string;
  reason: string;
  confirmed_care: number;
  ip_address: string;
  action: string;
  timestamp: string;
}

export interface SecurityAuditEvent {
  id: string;
  user_id?: string;
  user_email?: string;
  user_role: string;
  action: string;
  target_resource: string;
  target_id?: string;
  details: string;
  ip_address: string;
  timestamp: string;
}


