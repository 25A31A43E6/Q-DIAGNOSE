import { PredictionResult, DiseaseId, RiskBand } from '../types';

export interface PatientAuditEntry {
  timestamp: string;
  doctorName: string;
  action: string;
  consentId: string;
}

export interface PatientRecord {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  primaryCondition: DiseaseId;
  conditionLabel: string;
  latestRiskScore: number;
  latestRiskBand: RiskBand;
  isFlaggedHighRisk: boolean;
  lastAssessmentDate: string;
  attendingDoctor: string;
  consentStatus: string;
  consentExpires: string;
  vitals: {
    bp: string;
    restingHeartRate: number;
    bmi: number;
    glucose?: number;
    spo2: number;
  };
  assessments: {
    id: string;
    date: string;
    timeframeCategory: 'past_7_days' | 'past_30_days' | 'older_archive';
    diseaseId: DiseaseId;
    assessmentType: string;
    riskScore: number;
    riskBand: RiskBand;
    contributingFactors: { name: string; impact: number; rawValue: string }[];
    consensus: 'Concordant' | 'Discordant';
    clinicalNotes?: string;
    result: PredictionResult;
  }[];
}

export const MOCK_CLINICAL_PATIENTS: PatientRecord[] = [
  {
    id: 'PT-1042',
    mrn: 'MRN-CARD-8812',
    name: 'Ramesh Patel',
    age: 63,
    gender: 'Male',
    bloodGroup: 'B+',
    primaryCondition: 'cardiovascular',
    conditionLabel: 'Cardiovascular Risk',
    latestRiskScore: 78,
    latestRiskBand: 'high',
    isFlaggedHighRisk: true,
    lastAssessmentDate: '2026-09-02',
    attendingDoctor: 'Dr. Ananya Rao, MD',
    consentStatus: 'Active ABDM Consent #ABHA-8812-90',
    consentExpires: '2026-12-31',
    vitals: {
      bp: '148/94 mmHg',
      restingHeartRate: 88,
      bmi: 29.4,
      glucose: 142,
      spo2: 97
    },
    assessments: [
      {
        id: 'ASSESS-8812-04',
        date: '2026-09-02',
        timeframeCategory: 'past_7_days',
        diseaseId: 'cardiovascular',
        assessmentType: 'Hemodynamic & Exertional Stress',
        riskScore: 78,
        riskBand: 'high',
        contributingFactors: [
          { name: 'Systolic Blood Pressure (148 mmHg)', impact: 34.2, rawValue: '148' },
          { name: 'Resting Heart Rate (88 bpm)', impact: 23.5, rawValue: '88' },
          { name: 'Age & Metabolic BMI (29.4)', impact: 19.8, rawValue: '29.4' },
          { name: 'Low Exercise Exertion Tolerance', impact: 14.1, rawValue: 'Sedentary' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Persistent Stage 1 hypertension. Patient reported exertional chest tightness during fast walks. Ordered 2D Echo and lipid profile.',
        result: {
          id: 'PRED-CVD-8812-04',
          timestamp: '2026-09-02 11:20:00 UTC',
          sample_id: 'PT-1042-S4',
          disease_id: 'cardiovascular',
          dataset_name: 'UCI Cleveland Heart Disease Cohort',
          model_used: 'Both (Compare)',
          prediction: 'High Risk',
          confidence: 78.4,
          quantum_score: 0.792,
          classical_score: 0.776,
          risk_band: 'high',
          risk_label: 'High Risk',
          risk_score: 78,
          plain_language_meaning: 'Elevated blood pressure and resting pulse create hemodynamic stress, suggesting prompt cardiovascular evaluation.',
          recommended_next_step: 'Consult cardiologist within 48-72 hours for ECG and lipid evaluation.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Systolic Blood Pressure (trestbps)', value: 34.2, rawValue: '148 mmHg' },
            { name: 'Resting Heart Rate (thalach)', value: 23.5, rawValue: '88 bpm' },
            { name: 'BMI & Age Profile', value: 19.8, rawValue: '29.4 kg/m²' },
            { name: 'Physical Inactivity Level', value: 14.1, rawValue: '< 1 hr/week' }
          ]
        }
      },
      {
        id: 'ASSESS-8812-03',
        date: '2026-08-18',
        timeframeCategory: 'past_30_days',
        diseaseId: 'cardiovascular',
        assessmentType: 'Monthly Cardiovascular Follow-up',
        riskScore: 74,
        riskBand: 'high',
        contributingFactors: [
          { name: 'Systolic BP (144 mmHg)', impact: 31.0, rawValue: '144' },
          { name: 'Resting Heart Rate (84 bpm)', impact: 22.1, rawValue: '84' },
          { name: 'Metabolic Profile', impact: 18.2, rawValue: '29.5' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Adjustment of antihypertensive regimen initiated.',
        result: {
          id: 'PRED-CVD-8812-03',
          timestamp: '2026-08-18 09:15:00 UTC',
          sample_id: 'PT-1042-S3',
          disease_id: 'cardiovascular',
          dataset_name: 'UCI Cleveland Heart Disease Cohort',
          model_used: 'Quantum (VQC)',
          prediction: 'High Risk',
          confidence: 74.0,
          quantum_score: 0.74,
          classical_score: 0.72,
          risk_band: 'high',
          risk_score: 74,
          plain_language_meaning: 'Elevated cardiac risk metrics persistent across monthly follow-up.',
          recommended_next_step: 'Follow-up with physician for dosage adjustment.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Systolic BP', value: 31.0 },
            { name: 'Resting Heart Rate', value: 22.1 },
            { name: 'Metabolic Profile', value: 18.2 }
          ]
        }
      },
      {
        id: 'ASSESS-8812-02',
        date: '2026-07-10',
        timeframeCategory: 'older_archive',
        diseaseId: 'cardiovascular',
        assessmentType: 'Quarterly Routine Screening',
        riskScore: 68,
        riskBand: 'moderate',
        contributingFactors: [
          { name: 'Systolic BP (138 mmHg)', impact: 28.5, rawValue: '138' },
          { name: 'Total Cholesterol Elevation', impact: 24.2, rawValue: '235 mg/dL' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Patient advised on dietary sodium reduction and daily 20 min morning walk.',
        result: {
          id: 'PRED-CVD-8812-02',
          timestamp: '2026-07-10 14:00:00 UTC',
          sample_id: 'PT-1042-S2',
          disease_id: 'cardiovascular',
          dataset_name: 'UCI Cleveland Heart Disease Cohort',
          model_used: 'Both (Compare)',
          prediction: 'High Risk',
          confidence: 68.0,
          quantum_score: 0.68,
          classical_score: 0.66,
          risk_band: 'moderate',
          risk_score: 68,
          plain_language_meaning: 'Borderline elevated hemodynamic attributes.',
          recommended_next_step: 'Lifestyle modification and re-check in 4-6 weeks.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Systolic BP', value: 28.5 },
            { name: 'Total Cholesterol', value: 24.2 }
          ]
        }
      },
      {
        id: 'ASSESS-8812-01',
        date: '2026-05-14',
        timeframeCategory: 'older_archive',
        diseaseId: 'cardiovascular',
        assessmentType: 'Baseline Health Intake',
        riskScore: 62,
        riskBand: 'moderate',
        contributingFactors: [
          { name: 'Borderline BP (134 mmHg)', impact: 26.0, rawValue: '134' },
          { name: 'Family History of CAD', impact: 22.0, rawValue: 'Paternal' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Initial baseline intake. Routine laboratory investigations scheduled.',
        result: {
          id: 'PRED-CVD-8812-01',
          timestamp: '2026-05-14 10:30:00 UTC',
          sample_id: 'PT-1042-S1',
          disease_id: 'cardiovascular',
          dataset_name: 'UCI Cleveland Heart Disease Cohort',
          model_used: 'Classical (Random Forest)',
          prediction: 'High Risk',
          confidence: 62.0,
          quantum_score: 0.61,
          classical_score: 0.63,
          risk_band: 'moderate',
          risk_score: 62,
          plain_language_meaning: 'Moderate cardiovascular baseline risk due to family history and borderline BP.',
          recommended_next_step: 'Routine monitoring and lipid profile baseline.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Systolic BP', value: 26.0 },
            { name: 'Family History', value: 22.0 }
          ]
        }
      }
    ]
  },
  {
    id: 'PT-2091',
    mrn: 'MRN-ONCO-4029',
    name: 'Anita Desai',
    age: 52,
    gender: 'Female',
    bloodGroup: 'O+',
    primaryCondition: 'breast_cancer',
    conditionLabel: 'Cellular Nuclear Biomarkers',
    latestRiskScore: 64,
    latestRiskBand: 'moderate',
    isFlaggedHighRisk: false,
    lastAssessmentDate: '2026-08-30',
    attendingDoctor: 'Dr. Ananya Rao, MD',
    consentStatus: 'Active ABDM Consent #ABHA-4029-11',
    consentExpires: '2026-11-15',
    vitals: {
      bp: '122/78 mmHg',
      restingHeartRate: 72,
      bmi: 23.8,
      spo2: 99
    },
    assessments: [
      {
        id: 'ASSESS-4029-02',
        date: '2026-08-30',
        timeframeCategory: 'past_7_days',
        diseaseId: 'breast_cancer',
        assessmentType: 'Cellular Fine Needle Cytology Scan',
        riskScore: 64,
        riskBand: 'moderate',
        contributingFactors: [
          { name: 'Nuclear Concavity Points (0.052)', impact: 31.4, rawValue: '0.052' },
          { name: 'Mean Perimeter Ratio (92.4 mm)', impact: 24.1, rawValue: '92.4 mm' },
          { name: 'Tissue Texture Variance (18.6)', impact: 19.5, rawValue: '18.6' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Mild cellular pleomorphism observed. Ultrasound correlation recommended within 14 days.',
        result: {
          id: 'PRED-WDBC-4029-02',
          timestamp: '2026-08-30 15:45:00 UTC',
          sample_id: 'PT-2091-S2',
          disease_id: 'breast_cancer',
          dataset_name: 'Wisconsin Diagnostic Breast Cancer (WDBC)',
          model_used: 'Both (Compare)',
          prediction: 'Malignant',
          confidence: 64.0,
          quantum_score: 0.65,
          classical_score: 0.63,
          risk_band: 'moderate',
          risk_label: 'Moderate Risk',
          risk_score: 64,
          plain_language_meaning: 'Borderline cellular irregularities warrant standard clinical correlation and high-resolution mammography.',
          recommended_next_step: 'Schedule targeted clinical breast examination & ultrasound.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Nuclear Concavity Points', value: 31.4 },
            { name: 'Perimeter Ratio', value: 24.1 },
            { name: 'Texture Variance', value: 19.5 }
          ]
        }
      },
      {
        id: 'ASSESS-4029-01',
        date: '2026-06-12',
        timeframeCategory: 'older_archive',
        diseaseId: 'breast_cancer',
        assessmentType: 'Initial Cellular Cytology Screening',
        riskScore: 48,
        riskBand: 'moderate',
        contributingFactors: [
          { name: 'Nuclear Area Uniformity', impact: 28.0, rawValue: 'Normal' },
          { name: 'Minimal Texture Shift', impact: 20.0, rawValue: '15.2' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Baseline cytological review. Normal fibro-glandular architecture.',
        result: {
          id: 'PRED-WDBC-4029-01',
          timestamp: '2026-06-12 11:00:00 UTC',
          sample_id: 'PT-2091-S1',
          disease_id: 'breast_cancer',
          dataset_name: 'Wisconsin Diagnostic Breast Cancer (WDBC)',
          model_used: 'Quantum (VQC)',
          prediction: 'Benign',
          confidence: 78.0,
          quantum_score: 0.22,
          classical_score: 0.25,
          risk_band: 'moderate',
          risk_score: 48,
          plain_language_meaning: 'Low-to-moderate baseline with subtle density changes.',
          recommended_next_step: 'Routine follow-up in 3 months.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Nuclear Area Uniformity', value: 28.0 },
            { name: 'Texture Shift', value: 20.0 }
          ]
        }
      }
    ]
  },
  {
    id: 'PT-3118',
    mrn: 'MRN-NEUR-5501',
    name: 'Vikram Mehra',
    age: 68,
    gender: 'Male',
    bloodGroup: 'A+',
    primaryCondition: 'neurological',
    conditionLabel: 'Vocal Micro-Tremor & Acoustic Dynamics',
    latestRiskScore: 82,
    latestRiskBand: 'high',
    isFlaggedHighRisk: true,
    lastAssessmentDate: '2026-09-01',
    attendingDoctor: 'Dr. Ananya Rao, MD',
    consentStatus: 'Active ABDM Consent #ABHA-5501-72',
    consentExpires: '2026-10-30',
    vitals: {
      bp: '130/84 mmHg',
      restingHeartRate: 76,
      bmi: 25.1,
      spo2: 98
    },
    assessments: [
      {
        id: 'ASSESS-5501-03',
        date: '2026-09-01',
        timeframeCategory: 'past_7_days',
        diseaseId: 'neurological',
        assessmentType: 'Acoustic Dysphonia & Tremor Profile',
        riskScore: 82,
        riskBand: 'high',
        contributingFactors: [
          { name: 'Pitch Period Entropy PPE (0.292)', impact: 35.8, rawValue: '0.292' },
          { name: 'Fundamental Frequency Spread1 (-4.78)', impact: 26.4, rawValue: '-4.78' },
          { name: 'Harmonic-to-Noise Ratio (14.2 dB)', impact: 18.2, rawValue: '14.2 dB' },
          { name: 'Recurrence Period Density (0.58)', impact: 12.0, rawValue: '0.58' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Elevated vocal micro-tremor and sub-harmonic instability. Referred to Movement Disorder Neurologist for UPDRS motor evaluation.',
        result: {
          id: 'PRED-NEUR-5501-03',
          timestamp: '2026-09-01 16:30:00 UTC',
          sample_id: 'PT-3118-S3',
          disease_id: 'neurological',
          dataset_name: 'Oxford Parkinson\'s Voice Measurement Dataset',
          model_used: 'Both (Compare)',
          prediction: 'High Risk (Tremor/Motor)',
          confidence: 82.0,
          quantum_score: 0.84,
          classical_score: 0.80,
          risk_band: 'high',
          risk_label: 'High Risk',
          risk_score: 82,
          plain_language_meaning: 'Significant acoustic perturbations detected in sustained vocalization, correlating with basal ganglia motor pathways.',
          recommended_next_step: 'Comprehensive Neurological Clinical Assessment and motor examination.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Pitch Period Entropy (PPE)', value: 35.8 },
            { name: 'Frequency Variation (spread1)', value: 26.4 },
            { name: 'Harmonic-to-Noise Ratio', value: 18.2 },
            { name: 'Recurrence Period Density', value: 12.0 }
          ]
        }
      },
      {
        id: 'ASSESS-5501-02',
        date: '2026-08-04',
        timeframeCategory: 'past_30_days',
        diseaseId: 'neurological',
        assessmentType: 'Monthly Motor Stability Tracking',
        riskScore: 76,
        riskBand: 'high',
        contributingFactors: [
          { name: 'Pitch Period Entropy PPE', impact: 32.0, rawValue: '0.274' },
          { name: 'Spread1 Frequency Jitter', impact: 24.5, rawValue: '-5.12' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Progression in vocal micro-fluctuations observed compared to 3 months prior.',
        result: {
          id: 'PRED-NEUR-5501-02',
          timestamp: '2026-08-04 10:00:00 UTC',
          sample_id: 'PT-3118-S2',
          disease_id: 'neurological',
          dataset_name: 'Oxford Parkinson\'s Voice Measurement Dataset',
          model_used: 'Quantum (VQC)',
          prediction: 'High Risk (Tremor/Motor)',
          confidence: 76.0,
          quantum_score: 0.77,
          classical_score: 0.75,
          risk_band: 'high',
          risk_score: 76,
          plain_language_meaning: 'Continued sub-harmonic frequency jitter.',
          recommended_next_step: 'Schedule formal neurological motor exam.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Pitch Period Entropy', value: 32.0 },
            { name: 'Spread1 Jitter', value: 24.5 }
          ]
        }
      },
      {
        id: 'ASSESS-5501-01',
        date: '2026-05-20',
        timeframeCategory: 'older_archive',
        diseaseId: 'neurological',
        assessmentType: 'Baseline Acoustic Analysis',
        riskScore: 68,
        riskBand: 'moderate',
        contributingFactors: [
          { name: 'Mild Vocal Jitter (0.0048)', impact: 28.0, rawValue: '0.0048' },
          { name: 'Moderate Shimmer (0.038)', impact: 22.0, rawValue: '0.038' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Mild vocal fatigue noted by patient during evenings.',
        result: {
          id: 'PRED-NEUR-5501-01',
          timestamp: '2026-05-20 14:15:00 UTC',
          sample_id: 'PT-3118-S1',
          disease_id: 'neurological',
          dataset_name: 'Oxford Parkinson\'s Voice Measurement Dataset',
          model_used: 'Classical (Random Forest)',
          prediction: 'High Risk (Tremor/Motor)',
          confidence: 68.0,
          quantum_score: 0.66,
          classical_score: 0.70,
          risk_band: 'moderate',
          risk_score: 68,
          plain_language_meaning: 'Borderline micro-tremor markers.',
          recommended_next_step: 'Longitudinal tracking every 4 weeks.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Mild Vocal Jitter', value: 28.0 },
            { name: 'Moderate Shimmer', value: 22.0 }
          ]
        }
      }
    ]
  },
  {
    id: 'PT-4220',
    mrn: 'MRN-CARD-9014',
    name: 'Sunita Rao',
    age: 46,
    gender: 'Female',
    bloodGroup: 'AB+',
    primaryCondition: 'cardiovascular',
    conditionLabel: 'Cardiovascular Risk',
    latestRiskScore: 24,
    latestRiskBand: 'low',
    isFlaggedHighRisk: false,
    lastAssessmentDate: '2026-08-25',
    attendingDoctor: 'Dr. Ananya Rao, MD',
    consentStatus: 'Active ABDM Consent #ABHA-9014-63',
    consentExpires: '2027-01-15',
    vitals: {
      bp: '116/74 mmHg',
      restingHeartRate: 64,
      bmi: 22.4,
      glucose: 94,
      spo2: 99
    },
    assessments: [
      {
        id: 'ASSESS-9014-02',
        date: '2026-08-25',
        timeframeCategory: 'past_30_days',
        diseaseId: 'cardiovascular',
        assessmentType: 'Routine Wellness Checkup',
        riskScore: 24,
        riskBand: 'low',
        contributingFactors: [
          { name: 'Healthy Systolic BP (116 mmHg)', impact: 12.0, rawValue: '116' },
          { name: 'Optimal Resting HR (64 bpm)', impact: 10.5, rawValue: '64' },
          { name: 'High Aerobic Activity (>150 min/wk)', impact: 9.8, rawValue: 'Active' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'All hemodynamic indices optimal. Continue standard annual checkups.',
        result: {
          id: 'PRED-CVD-9014-02',
          timestamp: '2026-08-25 09:40:00 UTC',
          sample_id: 'PT-4220-S2',
          disease_id: 'cardiovascular',
          dataset_name: 'UCI Cleveland Heart Disease Cohort',
          model_used: 'Both (Compare)',
          prediction: 'Low Risk',
          confidence: 94.0,
          quantum_score: 0.18,
          classical_score: 0.22,
          risk_band: 'low',
          risk_label: 'Low Risk',
          risk_score: 24,
          plain_language_meaning: 'Normal hemodynamic profile with no acute cardiovascular risk indicators.',
          recommended_next_step: 'Maintain current healthy diet and routine exercise.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Optimal Blood Pressure', value: 12.0 },
            { name: 'Cardiorespiratory Fitness', value: 10.5 },
            { name: 'Healthy BMI', value: 9.8 }
          ]
        }
      },
      {
        id: 'ASSESS-9014-01',
        date: '2026-03-11',
        timeframeCategory: 'older_archive',
        diseaseId: 'cardiovascular',
        assessmentType: 'Annual Physical',
        riskScore: 28,
        riskBand: 'low',
        contributingFactors: [
          { name: 'Optimal Blood Pressure (118/76)', impact: 14.0, rawValue: '118/76' },
          { name: 'Non-Smoker Status', impact: 11.2, rawValue: 'Never' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Clean cardiovascular baseline.',
        result: {
          id: 'PRED-CVD-9014-01',
          timestamp: '2026-03-11 11:30:00 UTC',
          sample_id: 'PT-4220-S1',
          disease_id: 'cardiovascular',
          dataset_name: 'UCI Cleveland Heart Disease Cohort',
          model_used: 'Quantum (VQC)',
          prediction: 'Low Risk',
          confidence: 92.0,
          quantum_score: 0.20,
          classical_score: 0.24,
          risk_band: 'low',
          risk_score: 28,
          plain_language_meaning: 'Healthy baseline cardiovascular parameters.',
          recommended_next_step: 'Routine annual follow-up.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Optimal BP', value: 14.0 },
            { name: 'Non-smoker', value: 11.2 }
          ]
        }
      }
    ]
  },
  {
    id: 'PT-5334',
    mrn: 'MRN-ONCO-7182',
    name: 'Priya Nair',
    age: 41,
    gender: 'Female',
    bloodGroup: 'B-',
    primaryCondition: 'breast_cancer',
    conditionLabel: 'Cellular Nuclear Biomarkers',
    latestRiskScore: 31,
    latestRiskBand: 'low',
    isFlaggedHighRisk: false,
    lastAssessmentDate: '2026-08-14',
    attendingDoctor: 'Dr. Ananya Rao, MD',
    consentStatus: 'Active ABDM Consent #ABHA-7182-04',
    consentExpires: '2026-12-15',
    vitals: {
      bp: '120/78 mmHg',
      restingHeartRate: 68,
      bmi: 24.2,
      spo2: 99
    },
    assessments: [
      {
        id: 'ASSESS-7182-01',
        date: '2026-08-14',
        timeframeCategory: 'past_30_days',
        diseaseId: 'breast_cancer',
        assessmentType: 'Preventative Cytology Review',
        riskScore: 31,
        riskBand: 'low',
        contributingFactors: [
          { name: 'Uniform Nuclear Boundaries', impact: 14.2, rawValue: 'Uniform' },
          { name: 'Symmetric Nuclear Radius (12.4 mm)', impact: 11.5, rawValue: '12.4 mm' },
          { name: 'Low Texture Contrast (14.1)', impact: 8.8, rawValue: '14.1' }
        ],
        consensus: 'Concordant',
        clinicalNotes: 'Benign baseline cytological architecture. Advised standard age-appropriate self-checks.',
        result: {
          id: 'PRED-WDBC-7182-01',
          timestamp: '2026-08-14 14:10:00 UTC',
          sample_id: 'PT-5334-S1',
          disease_id: 'breast_cancer',
          dataset_name: 'Wisconsin Diagnostic Breast Cancer (WDBC)',
          model_used: 'Both (Compare)',
          prediction: 'Benign',
          confidence: 89.0,
          quantum_score: 0.16,
          classical_score: 0.18,
          risk_band: 'low',
          risk_label: 'Low Risk',
          risk_score: 31,
          plain_language_meaning: 'Cytological features exhibit regular margins with no indicators of malignant proliferation.',
          recommended_next_step: 'Continue standard age-appropriate preventative screening.',
          disclaimer: 'AI-assisted screening result — for clinical correlation.',
          feature_importance: [
            { name: 'Nuclear Margin Smoothness', value: 14.2 },
            { name: 'Nuclear Radius Symmetry', value: 11.5 },
            { name: 'Low Tissue Texture Variance', value: 8.8 }
          ]
        }
      }
    ]
  }
];

export const CLINICAL_AUDIT_TRAIL: PatientAuditEntry[] = [
  {
    timestamp: '2026-09-03 07:05:14 UTC',
    doctorName: 'Dr. Ananya Rao, MD',
    action: 'Accessed Longitudinal Assessment History for Patient Ramesh Patel (MRN-CARD-8812)',
    consentId: 'ABHA-8812-90'
  },
  {
    timestamp: '2026-09-02 11:24:02 UTC',
    doctorName: 'Dr. Ananya Rao, MD',
    action: 'Generated Explainability Decomposition (SHAP / Feature Attribution) for Vikram Mehra (MRN-NEUR-5501)',
    consentId: 'ABHA-5501-72'
  },
  {
    timestamp: '2026-09-01 16:42:19 UTC',
    doctorName: 'Dr. Ananya Rao, MD',
    action: 'Examined 4-Qubit ZZFeatureMap Quantum State Vector for Anita Desai (MRN-ONCO-4029)',
    consentId: 'ABHA-4029-11'
  }
];
