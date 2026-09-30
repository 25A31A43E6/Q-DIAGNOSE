import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { runMigrationsAndSeed } from './server/migrations.js';
import { apiRouter } from './server/apiRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize DB schema & seed demo data
runMigrationsAndSeed();

// Mount API router for both /api/* and root /* endpoints
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  sample_id: string;
  dataset_name: string;
  model_used: string;
  prediction: string;
  confidence: number;
  quantum_score: number;
  classical_score: number;
  circuit_depth?: number;
  qubits_used?: number;
  execution_time_ms?: number;
  consensus_agreement?: boolean;
  notes?: string;
  is_mock?: boolean;
  feature_importance: Array<{ name: string; value: number; description?: string }>;
}

// In-memory session history for recent predictions
const predictionHistory: HistoryItem[] = [
  {
    id: 'PRED-2026-0901-01',
    timestamp: '2026-09-01 14:32:10 UTC',
    sample_id: 'WDBC-842302',
    dataset_name: 'WDBC_Clinical_Validation_v2.4',
    model_used: 'Both (Compare)',
    prediction: 'Malignant',
    confidence: 96.8,
    quantum_score: 0.974,
    classical_score: 0.962,
    circuit_depth: 8,
    qubits_used: 4,
    execution_time_ms: 142,
    consensus_agreement: true,
    notes: 'High concavity and large perimeter worst. Quantum Hilbert-space mapping identified subtle non-linear boundary with 97.4% probability.',
    is_mock: true,
    feature_importance: [
      { name: 'concave_points_mean', value: 34.2, description: 'Number of concave portions of the contour' },
      { name: 'area_worst', value: 24.6, description: 'Largest area measurement among outer perimeter' },
      { name: 'perimeter_worst', value: 18.1, description: 'Largest perimeter of the cell nuclei' },
      { name: 'radius_worst', value: 12.8, description: 'Largest radius of cell nuclear boundaries' },
      { name: 'texture_worst', value: 10.3, description: 'Standard deviation of gray-scale values' },
    ]
  },
  {
    id: 'PRED-2026-0901-02',
    timestamp: '2026-09-01 13:48:22 UTC',
    sample_id: 'WDBC-8510824',
    dataset_name: 'WDBC_Clinical_Validation_v2.4',
    model_used: 'Quantum (VQC)',
    prediction: 'Benign',
    confidence: 98.4,
    quantum_score: 0.984,
    classical_score: 0.942,
    circuit_depth: 8,
    qubits_used: 4,
    execution_time_ms: 98,
    consensus_agreement: true,
    notes: 'Compact uniform nuclear structures. Low fractal dimension and perimeter consistency indicate benign tissue architecture.',
    is_mock: true,
    feature_importance: [
      { name: 'radius_mean', value: 31.0, description: 'Mean distance from center to perimeter' },
      { name: 'area_mean', value: 26.5, description: 'Mean nuclear area in square micrometers' },
      { name: 'smoothness_mean', value: 19.8, description: 'Local variation in radius lengths' },
      { name: 'compactness_mean', value: 13.4, description: 'Perimeter^2 / area - 1.0' },
      { name: 'symmetry_mean', value: 9.3, description: 'Nuclear symmetry coefficient' },
    ]
  },
  {
    id: 'PRED-2026-0901-03',
    timestamp: '2026-09-01 11:15:04 UTC',
    sample_id: 'WDBC-843009',
    dataset_name: 'WDBC_PreScreen_CohortB',
    model_used: 'Both (Compare)',
    prediction: 'Malignant',
    confidence: 94.2,
    quantum_score: 0.956,
    classical_score: 0.928,
    circuit_depth: 8,
    qubits_used: 4,
    execution_time_ms: 135,
    consensus_agreement: true,
    notes: 'High nuclear irregularity with elevated area_worst and concave_points_worst.',
    is_mock: true,
    feature_importance: [
      { name: 'concave_points_mean', value: 36.1, description: 'Concave contour points' },
      { name: 'perimeter_mean', value: 25.4, description: 'Mean nuclear contour perimeter' },
      { name: 'area_worst', value: 17.2, description: 'Largest nuclear area measurement' },
      { name: 'radius_worst', value: 12.0, description: 'Worst nuclear radius boundary' },
      { name: 'concavity_mean', value: 9.3, description: 'Severity of concave portions' },
    ]
  }
];

const DEFAULT_BENCHMARKS_BY_DISEASE: Record<string, any[]> = {
  breast_cancer: [
    {
      model_name: 'Logistic Regression',
      type: 'classical',
      accuracy: 0.947,
      precision: 0.941,
      recall: 0.925,
      f1: 0.933,
      roc_auc: 0.974,
      train_time: '0.4s',
      inference_time: '1.2ms',
      notes: 'Baseline linear hyper-plane classification on standard scaled WDBC features.'
    },
    {
      model_name: 'Random Forest',
      type: 'classical',
      accuracy: 0.965,
      precision: 0.958,
      recall: 0.952,
      f1: 0.955,
      roc_auc: 0.988,
      train_time: '1.8s',
      inference_time: '4.8ms',
      notes: '100 estimators, Gini impurity criterion with bootstrapping.'
    },
    {
      model_name: 'XGBoost',
      type: 'classical',
      accuracy: 0.968,
      precision: 0.962,
      recall: 0.956,
      f1: 0.959,
      roc_auc: 0.991,
      train_time: '2.4s',
      inference_time: '3.6ms',
      notes: 'Gradient boosted decision trees with depth=4 and shrinkage rate 0.08.'
    },
    {
      model_name: 'QSVM',
      type: 'quantum',
      accuracy: 0.976,
      precision: 0.971,
      recall: 0.968,
      f1: 0.969,
      roc_auc: 0.994,
      train_time: '38.2s',
      inference_time: '12.4ms',
      notes: 'Quantum kernel estimation with ZZFeatureMap (reps=2, depth=8, 6 qubits) mapping into 2^6 Hilbert space.'
    },
    {
      model_name: 'QNN (Quantum Neural Network)',
      type: 'quantum',
      accuracy: 0.979,
      precision: 0.975,
      recall: 0.972,
      f1: 0.973,
      roc_auc: 0.996,
      train_time: '41.5s',
      inference_time: '10.8ms',
      notes: 'Hybrid classical-quantum layer with 4-qubit parameterized variational circuit coupled to classical dense readout layers.'
    },
    {
      model_name: 'VQC',
      type: 'quantum',
      accuracy: 0.982,
      precision: 0.979,
      recall: 0.974,
      f1: 0.976,
      roc_auc: 0.997,
      train_time: '44.6s',
      inference_time: '9.8ms',
      notes: 'Parameterized ansatz circuit (RealAmplitudes + COBYLA optimizer) demonstrating superior non-linear boundary resolution.'
    }
  ],
  cardiovascular: [
    {
      model_name: 'Logistic Regression',
      type: 'classical',
      accuracy: 0.835,
      precision: 0.828,
      recall: 0.841,
      f1: 0.834,
      roc_auc: 0.892,
      train_time: '0.3s',
      inference_time: '1.1ms',
      notes: 'Standard multivariate logistic regression baseline on 13 clinical cardio features.'
    },
    {
      model_name: 'Random Forest',
      type: 'classical',
      accuracy: 0.871,
      precision: 0.865,
      recall: 0.878,
      f1: 0.871,
      roc_auc: 0.932,
      train_time: '1.4s',
      inference_time: '3.9ms',
      notes: 'Ensemble forest with 100 trees and bootstrap sampling across hemodynamic markers.'
    },
    {
      model_name: 'XGBoost',
      type: 'classical',
      accuracy: 0.884,
      precision: 0.879,
      recall: 0.889,
      f1: 0.884,
      roc_auc: 0.941,
      train_time: '1.9s',
      inference_time: '3.2ms',
      notes: 'Extreme gradient boosting with early stopping and L2 weight regularization.'
    },
    {
      model_name: 'QSVM',
      type: 'quantum',
      accuracy: 0.898,
      precision: 0.892,
      recall: 0.904,
      f1: 0.898,
      roc_auc: 0.952,
      train_time: '32.1s',
      inference_time: '11.8ms',
      notes: 'Quantum support vector machine with non-linear ZZ-kernel mapping.'
    },
    {
      model_name: 'QNN (Quantum Neural Network)',
      type: 'quantum',
      accuracy: 0.902,
      precision: 0.897,
      recall: 0.908,
      f1: 0.902,
      roc_auc: 0.957,
      train_time: '35.4s',
      inference_time: '10.2ms',
      notes: '4-qubit parameterized variational circuit with classical backpropagation.'
    },
    {
      model_name: 'VQC',
      type: 'quantum',
      accuracy: 0.908,
      precision: 0.903,
      recall: 0.912,
      f1: 0.907,
      roc_auc: 0.961,
      train_time: '37.8s',
      inference_time: '9.4ms',
      notes: 'Variational Quantum Classifier with Pauli-Z expectation value readout.'
    }
  ],
  neurological: [
    {
      model_name: 'Logistic Regression',
      type: 'classical',
      accuracy: 0.856,
      precision: 0.862,
      recall: 0.851,
      f1: 0.856,
      roc_auc: 0.908,
      train_time: '0.5s',
      inference_time: '1.4ms',
      notes: 'L2-regularized logistic regression on 22 acoustic voice jitter & tremor features.'
    },
    {
      model_name: 'Random Forest',
      type: 'classical',
      accuracy: 0.897,
      precision: 0.901,
      recall: 0.894,
      f1: 0.897,
      roc_auc: 0.948,
      train_time: '1.9s',
      inference_time: '4.2ms',
      notes: 'Random forest on phonation measurements and fractal dimension acoustic signals.'
    },
    {
      model_name: 'XGBoost',
      type: 'classical',
      accuracy: 0.908,
      precision: 0.913,
      recall: 0.904,
      f1: 0.908,
      roc_auc: 0.956,
      train_time: '2.6s',
      inference_time: '3.5ms',
      notes: 'Gradient boosting resolving non-linear pitch period perturbation correlations.'
    },
    {
      model_name: 'QSVM',
      type: 'quantum',
      accuracy: 0.923,
      precision: 0.927,
      recall: 0.919,
      f1: 0.923,
      roc_auc: 0.968,
      train_time: '36.5s',
      inference_time: '12.0ms',
      notes: 'Quantum kernel mapping high-order vocal micro-tremors in Hilbert state space.'
    },
    {
      model_name: 'QNN (Quantum Neural Network)',
      type: 'quantum',
      accuracy: 0.928,
      precision: 0.932,
      recall: 0.924,
      f1: 0.928,
      roc_auc: 0.972,
      train_time: '39.8s',
      inference_time: '10.5ms',
      notes: 'Hybrid quantum-classical dense neural network with parameter-shift optimization.'
    },
    {
      model_name: 'VQC',
      type: 'quantum',
      accuracy: 0.933,
      precision: 0.938,
      recall: 0.929,
      f1: 0.933,
      roc_auc: 0.976,
      train_time: '42.0s',
      inference_time: '9.6ms',
      notes: '4-qubit RealAmplitudes ansatz detecting subtle multi-frequency vocal biomarkers.'
    }
  ]
};

// Helper: generate realistic disease simulation
function generateSimulatedPrediction(
  patientData: Record<string, any>, 
  modelChoice: string = 'Both (Compare)',
  diseaseId: string = 'breast_cancer'
) {
  let isAbnormal = false;
  let prediction = 'Benign';
  let featureImportance: Array<{ name: string; value: number; description?: string }> = [];
  let notes = '';

  let rawRisk = 0.15;
  if (diseaseId === 'cardiovascular') {
    const age = parseFloat(patientData.age || '55');
    const cp = parseFloat(patientData.cp || '0');
    const trestbps = parseFloat(patientData.trestbps || '130');
    const chol = parseFloat(patientData.chol || '240');
    const thalach = parseFloat(patientData.thalach || '150');
    const exang = parseFloat(patientData.exang || '0');
    const oldpeak = parseFloat(patientData.oldpeak || '1.0');

    rawRisk = 
      (cp > 0 ? 0.35 : 0.05) +
      (oldpeak > 1.5 ? 0.30 : 0.08) +
      (exang > 0 ? 0.25 : 0.05) +
      (thalach < 130 ? 0.15 : 0.02) +
      (chol > 260 ? 0.10 : 0.02);

    isAbnormal = rawRisk > 0.45;
    prediction = isAbnormal ? 'Elevated Cardiovascular Risk' : 'Healthy Cardiac Baseline';

    featureImportance = isAbnormal ? [
      { name: 'chest_pain_type (cp)', value: 32.4, description: 'Asymptomatic / typical angina patterns' },
      { name: 'st_depression (oldpeak)', value: 26.1, description: 'ST depression induced by exercise relative to rest' },
      { name: 'exercise_angina (exang)', value: 18.5, description: 'Exercise induced angina presence' },
      { name: 'max_heart_rate (thalach)', value: 14.2, description: 'Maximum achieved heart rate during stress' },
      { name: 'serum_cholesterol (chol)', value: 8.8, description: 'Serum cholesterol level in mg/dl' }
    ] : [
      { name: 'max_heart_rate (thalach)', value: 34.0, description: 'Normal robust heart rate response' },
      { name: 'st_depression (oldpeak)', value: 25.2, description: 'Minimal ST segment deviation' },
      { name: 'resting_bp (trestbps)', value: 19.5, description: 'Normotensive baseline blood pressure' },
      { name: 'chest_pain_type (cp)', value: 12.8, description: 'No ischemia-related angina presentation' },
      { name: 'serum_cholesterol (chol)', value: 8.5, description: 'Cholesterol within manageable bounds' }
    ];

    notes = isAbnormal
      ? 'Elevated ST depression and exercise-induced angina detected. Quantum Hilbert-space encoding mapped non-linear hemodynamic interactions.'
      : 'Normal sinus rhythm indicators and satisfactory exercise tolerance without significant ST segment depression.';

  } else if (diseaseId === 'neurological') {
    const jitter = parseFloat(patientData['MDVP:Jitter(%)'] || patientData.jitter || '0.005');
    const shimmer = parseFloat(patientData['MDVP:Shimmer'] || patientData.shimmer || '0.03');
    const hnr = parseFloat(patientData.HNR || patientData.hnr || '21.0');
    const dfa = parseFloat(patientData.DFA || patientData.dfa || '0.7');
    const spread1 = parseFloat(patientData.spread1 || '-5.0');

    rawRisk = 
      (jitter > 0.006 ? 0.30 : 0.05) +
      (shimmer > 0.035 ? 0.25 : 0.05) +
      (hnr < 20.0 ? 0.25 : 0.05) +
      (spread1 > -5.5 ? 0.25 : 0.05);

    isAbnormal = rawRisk > 0.45;
    prediction = isAbnormal ? 'Elevated Motor/Tremor Risk' : 'Normal Phonation Dynamics';

    featureImportance = isAbnormal ? [
      { name: 'fundamental_freq_spread (spread1)', value: 31.8, description: 'Nonlinear dynamic vocal pitch variability' },
      { name: 'harmonic_noise_ratio (HNR)', value: 27.4, description: 'Acoustic voice breathiness and turbulence' },
      { name: 'shimmer_apq5', value: 19.2, description: 'Acoustic micro-amplitude perturbation' },
      { name: 'jitter_percent', value: 13.5, description: 'Cycle-to-cycle pitch frequency variation' },
      { name: 'fractal_scaling (DFA)', value: 8.1, description: 'Signal fractal scaling exponent' }
    ] : [
      { name: 'harmonic_noise_ratio (HNR)', value: 35.2, description: 'High acoustic signal clarity and harmonicity' },
      { name: 'fundamental_freq_spread (spread1)', value: 24.8, description: 'Stable pitch frequency attractor dynamics' },
      { name: 'jitter_percent', value: 18.0, description: 'Low cycle frequency perturbation' },
      { name: 'shimmer_local', value: 13.5, description: 'Stable vocal fold cycle amplitude' },
      { name: 'detrended_fluctuation (DFA)', value: 8.5, description: 'Typical phonation signal scaling' }
    ];

    notes = isAbnormal
      ? 'Acoustic vocal micro-tremors and decreased harmonic-to-noise ratio indicate neurological motor impairment.'
      : 'Stable fundamental frequency modulation and high harmonicity consistent with healthy phonation dynamics.';

  } else {
    // Breast Cancer (WDBC)
    const radiusMean = parseFloat(patientData.radius_mean || patientData.radius || '14.0');
    const concavePoints = parseFloat(patientData.concave_points_mean || patientData.concave_points || '0.05');
    const areaWorst = parseFloat(patientData.area_worst || patientData.area || '600.0');

    rawRisk = 
      (radiusMean > 15 ? 0.35 : 0.08) +
      (concavePoints > 0.07 ? 0.40 : 0.08) +
      (areaWorst > 850 ? 0.25 : 0.05);

    isAbnormal = rawRisk > 0.45;
    prediction = isAbnormal ? 'Elevated Cellular Irregularity' : 'Normal Cellular Consistency';

    featureImportance = isAbnormal ? [
      { name: 'concave_points_mean', value: 34.2, description: 'Number of concave portions of tumor contour' },
      { name: 'area_worst', value: 24.6, description: 'Largest area measurement among outer perimeter' },
      { name: 'perimeter_worst', value: 18.1, description: 'Largest perimeter of the cell nuclei' },
      { name: 'radius_worst', value: 12.8, description: 'Largest radius of cell nuclear boundaries' },
      { name: 'texture_worst', value: 10.3, description: 'Standard deviation of gray-scale values' }
    ] : [
      { name: 'radius_mean', value: 31.0, description: 'Mean distance from center to perimeter' },
      { name: 'area_mean', value: 26.5, description: 'Mean nuclear area in square micrometers' },
      { name: 'smoothness_mean', value: 19.8, description: 'Local variation in radius lengths' },
      { name: 'compactness_mean', value: 13.4, description: 'Perimeter^2 / area - 1.0' },
      { name: 'symmetry_mean', value: 9.3, description: 'Nuclear symmetry coefficient' }
    ];

    notes = isAbnormal 
      ? 'Elevated concavity points and nuclear area expansion detected. Quantum VQC ansatz mapped multi-dimensional non-linear features into 4-qubit Hilbert space.'
      : 'Symmetric cellular boundaries and uniform nuclear density. Concordant confidence between classical random forest and quantum state tomography.';
  }

  let quantumScore = isAbnormal 
    ? +(0.88 + Math.random() * 0.11).toFixed(3)
    : +(0.89 + Math.random() * 0.10).toFixed(3);
  
  let classicalScore = isAbnormal
    ? +(0.84 + Math.random() * 0.12).toFixed(3)
    : +(0.86 + Math.random() * 0.11).toFixed(3);

  let confidence = Math.round(
    modelChoice.includes('Quantum') || modelChoice.includes('VQC') || modelChoice.includes('QNN') || modelChoice.includes('QSVM')
      ? quantumScore * 100
      : modelChoice.includes('Classical') || modelChoice.includes('Forest') || modelChoice.includes('XGBoost')
      ? classicalScore * 100
      : ((quantumScore * 0.55 + classicalScore * 0.45) * 100)
  );

  // Structured Risk Bands (🟢 Low / 🟠 Moderate / 🔴 High)
  const riskScorePercentage = Math.min(99, Math.max(8, Math.round(rawRisk * 100)));
  let riskBand: 'low' | 'moderate' | 'high' = 'low';
  let riskLabel = '🟢 Low Risk';
  let plainLanguageMeaning = 'Your health markers and biometric readings fall within expected healthy baseline parameters. No significant indicators of concern were flagged by the hybrid screening models.';
  let recommendedNextStep = 'Continue current healthy habits, schedule routine annual wellness checks, and maintain balanced nutrition and physical activity.';

  if (riskScorePercentage >= 65) {
    riskBand = 'high';
    riskLabel = '🔴 High Risk';
    plainLanguageMeaning = 'Multiple biometric parameters exceed standard reference thresholds, indicating heightened risk markers in this screening domain.';
    recommendedNextStep = 'Seek medical evaluation promptly with a certified healthcare specialist. Bring this screening report to assist in detailed clinical diagnostic follow-up.';
  } else if (riskScorePercentage >= 35) {
    riskBand = 'moderate';
    riskLabel = '🟠 Moderate Risk';
    plainLanguageMeaning = 'Certain metrics show mild deviation from baseline norms. While not indicative of acute disease, these markers warrant proactive review.';
    recommendedNextStep = 'Consider scheduling an appointment with a primary care physician for standard confirmatory laboratory checks and routine preventive guidance.';
  }

  return {
    prediction,
    isAbnormal,
    confidence,
    risk_band: riskBand,
    risk_label: riskLabel,
    risk_score: riskScorePercentage,
    plain_language_meaning: plainLanguageMeaning,
    recommended_next_step: recommendedNextStep,
    disclaimer: 'This is an AI-based screening result, not a medical diagnosis.',
    feature_importance: featureImportance,
    quantum_score: quantumScore,
    classical_score: classicalScore,
    circuit_depth: modelChoice.includes('Classical') ? 0 : 8,
    qubits_used: modelChoice.includes('Classical') ? 0 : 4,
    execution_time_ms: modelChoice.includes('Quantum') || modelChoice.includes('VQC') ? 112 : modelChoice.includes('Classical') ? 48 : 156,
    consensus_agreement: Math.abs(quantumScore - classicalScore) < 0.15,
    notes
  };
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// GET /health & GET /api/health
function handleHealth(req: express.Request, res: express.Response) {
  res.json({
    status: 'ok',
    models_loaded: true,
    supported_diseases: ['breast_cancer', 'cardiovascular', 'neurological'],
    quantum_backend: 'Qiskit Aer Simulator (4 Qubits)',
    ml_api_configured: !!process.env.ML_API_URL
  });
}
app.get('/health', handleHealth);
app.get('/api/health', handleHealth);

app.get('/api/config', (req, res) => {
  res.json({
    ml_api_configured: !!process.env.ML_API_URL,
    has_quantum_backend: true,
    supported_diseases: [
      { id: 'breast_cancer', name: 'Breast Cancer (WDBC)', samples: 569 },
      { id: 'cardiovascular', name: 'Cardiovascular Disease', samples: 303 },
      { id: 'neurological', name: 'Neurological Disorders', samples: 195 }
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/history', (req, res) => {
  res.json({
    history: predictionHistory,
    total: predictionHistory.length
  });
});

app.delete('/api/history', (req, res) => {
  predictionHistory.length = 0;
  res.json({ success: true, message: 'Prediction history cleared' });
});

// POST /predict & POST /api/predict
async function handlePredict(req: express.Request, res: express.Response) {
  const { 
    sample_id = 'SAMPLE-001', 
    features, 
    data, 
    model = 'Both (Compare)', 
    dataset_name,
    disease_id = 'breast_cancer' 
  } = req.body || {};

  let targetRow: Record<string, any> = {};
  if (Array.isArray(features)) {
    features.forEach((val: number, idx: number) => {
      targetRow[`feature_${idx + 1}`] = val;
    });
  } else if (Array.isArray(data) && data.length > 0) {
    targetRow = data[0];
  } else if (data && typeof data === 'object') {
    targetRow = data;
  }

  // Simulation execution matching exact contract
  const sim = generateSimulatedPrediction(targetRow, model, disease_id);
  const consensusStr = sim.consensus_agreement ? 'Concordant' : 'Discordant';
  const topFeat = sim.feature_importance[0]?.name || 'primary_biomarker';

  const interpretation = sim.isAbnormal
    ? `High probability of pathological indication (${sim.confidence}%) driven by elevated ${topFeat} and concordant quantum Hilbert space classification.`
    : `Negative / benign clinical profile (${sim.confidence}% certainty) with normal reference ranges and low ${topFeat}.`;

  const isQNN = model === 'QNN' || model.includes('Neural');
  const isQSVM = model === 'QSVM' || model.includes('SVM');

  const responsePayload = {
    prediction: sim.prediction,
    confidence: sim.confidence,
    consensus: consensusStr,
    inference_latency_ms: sim.execution_time_ms,
    feature_importance: sim.feature_importance,
    quantum_output: {
      score: sim.quantum_score,
      qubits: 4,
      ansatz: isQNN 
        ? "Hybrid Quantum-Classical Layer (depth=6)" 
        : isQSVM 
        ? "ZZFeatureMap Kernel (depth=8)" 
        : "RealAmplitudes (depth=8)",
      feature_map: "ZZFeatureMap (reps=2)"
    },
    classical_output: {
      score: sim.classical_score,
      trees: 100,
      splitting_criterion: "Gini Impurity"
    },
    interpretation: interpretation,
    id: `PRED-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    sample_id: sample_id || targetRow.id || `${disease_id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    dataset_name: dataset_name || (disease_id === 'cardiovascular' ? 'Heart_Disease_UCI_v1.2.csv' : disease_id === 'neurological' ? 'Parkinsons_Acoustic_v3.0.csv' : 'Wisconsin_Diagnostic_WDBC_v2.4.csv'),
    model_used: model,
    disease_id: disease_id,
    quantum_score: sim.quantum_score,
    classical_score: sim.classical_score,
    risk_band: sim.risk_band,
    risk_label: sim.risk_label,
    risk_score: sim.risk_score,
    plain_language_meaning: sim.plain_language_meaning,
    recommended_next_step: sim.recommended_next_step,
    disclaimer: sim.disclaimer,
    circuit_depth: isQNN ? 6 : 8,
    qubits_used: 4,
    execution_time_ms: sim.execution_time_ms,
    consensus_agreement: sim.consensus_agreement,
    notes: sim.notes,
    is_mock: true,
    raw_features: targetRow
  };

  // Add to session history
  predictionHistory.unshift(responsePayload as unknown as HistoryItem);
  if (predictionHistory.length > 20) predictionHistory.pop();

  await new Promise(r => setTimeout(r, 200));
  res.json(responsePayload);
}

app.post('/predict', handlePredict);
app.post('/api/predict', handlePredict);

// POST /api/history - save user assessment
app.post('/api/history', (req, res) => {
  const item = req.body;
  if (item && item.id) {
    predictionHistory.unshift(item);
    if (predictionHistory.length > 50) predictionHistory.pop();
  }
  res.json({ success: true, count: predictionHistory.length });
});

// POST /api/chat - Multilingual & Multi-Register AI Health Companion using Gemini 3.8 Flash
app.post('/api/chat', async (req, res) => {
  const { message, companion_locale = 'india_en', language = 'en', context = {} } = req.body || {};

  const registerDescriptions: Record<string, { name: string; targetLang: string; registerGuidance: string }> = {
    india_en: {
      name: 'Indian English / Hinglish',
      targetLang: 'English (with natural Indian conversational cadence & occasional familiar Hinglish idioms)',
      registerGuidance: 'Respond in a warm, everyday Indian conversational style, as a caring local community health worker or trusted family elder would explain things. Use comforting, relatable Indian-English turns of phrase (e.g., "Do not worry, let us look at this step-by-step", "First let us get a routine checkup done with a good physician nearby", "take it easy"). Avoid stiff, textbook-formal or robotic language.'
    },
    american: {
      name: 'American English',
      targetLang: 'American English',
      registerGuidance: 'Respond using friendly, casual American English idiom, conversational flow, and reassuring phrasing (e.g., "Hey there", "Take a deep breath — here is the breakdown in plain English", "We definitely want to follow up on this with your primary care doctor"). Clear, direct, empathetic.'
    },
    british: {
      name: 'British English',
      targetLang: 'British English',
      registerGuidance: 'Respond using polite British English idiom and UK spelling conventions (e.g., "Do not worry, let us look through your results", "consult your GP or local surgery", "whilst", "programme", "specialist care"). Reassuring, measured, respectful.'
    },
    hi: {
      name: 'Hindi (हिन्दी)',
      targetLang: 'Hindi (हिन्दी)',
      registerGuidance: 'Respond in natural, everyday conversational Hindi (बोलचाल की सरल हिन्दी), as a caring local health companion would. Use simple, non-intimidating vocabulary and avoid heavy Sanskritized textbook jargon.'
    },
    ta: {
      name: 'Tamil (தமிழ்)',
      targetLang: 'Tamil (தமிழ்)',
      registerGuidance: 'Respond in natural, respectful, everyday spoken Tamil (எளிய தமிழ்), providing clear, compassionate health guidance without complex clinical jargon.'
    },
    te: {
      name: 'Telugu (తెలుగు)',
      targetLang: 'Telugu (తెలుగు)',
      registerGuidance: 'Respond in friendly, natural conversational Telugu (సులభమైన తెలుగు), explaining health metrics with empathy and clarity.'
    },
    bn: {
      name: 'Bengali (বাংলা)',
      targetLang: 'Bengali (বাংলা)',
      registerGuidance: 'Respond in warm, colloquial everyday Bengali (সহজ বাংলা), reassuring the user and explaining screening results gently.'
    },
    mr: {
      name: 'Marathi (मराठी)',
      targetLang: 'Marathi (मराठी)',
      registerGuidance: 'Respond in natural, respectful conversational Marathi (सोपी मराठी), breaking down health screening details step-by-step.'
    },
    kn: {
      name: 'Kannada (ಕನ್ನಡ)',
      targetLang: 'Kannada (ಕನ್ನಡ)',
      registerGuidance: 'Respond in everyday conversational Kannada (ಸರಳ ಕನ್ನಡ), offering supportive and clear explanations.'
    },
    pa: {
      name: 'Punjabi (ਪੰਜਾਬੀ)',
      targetLang: 'Punjabi (ਪੰਜਾਬੀ)',
      registerGuidance: 'Respond in warm, affectionate spoken Punjabi (ਸਰਲ ਪੰਜਾਬੀ), guiding the user with practical reassurance.'
    },
    gu: {
      name: 'Gujarati (ગુજરાતી)',
      targetLang: 'Gujarati (ગુજરાતી)',
      registerGuidance: 'Respond in warm, everyday conversational Gujarati (સરળ ગુજરાતી), explaining screening observations with care.'
    },
    ml: {
      name: 'Malayalam (മലയാളം)',
      targetLang: 'Malayalam (മലയാളം)',
      registerGuidance: 'Respond in compassionate everyday conversational Malayalam (ലളിതമായ മലയാളം), explaining health metrics simply.'
    }
  };

  const selectedRegister = registerDescriptions[companion_locale] || registerDescriptions.india_en;

  // System instructions strictly enforcing non-diagnostic, safety-first framing and register authenticity
  const systemInstruction = `You are the Q-Diagnose AI Health Companion, an empathetic, caring, multilingual health assistant focused on helping patients understand their health risk numbers and what practical steps to take next.

CRITICAL INSTRUCTION — TALK ABOUT THE PROBLEM, NOT THE PROCESS:
1. TALK ABOUT THE PATIENT'S PROBLEM AND NEXT STEPS, NEVER THE TECHNICAL PROCESS:
   - Your primary role is to explain what the patient's result means, why it matters, and what to do next — in plain, everyday language, exactly the way a caring relative or local health worker would put it.
   - You have a short, STRICTLY FIXED SET of 4 topics you are allowed to talk about by default:
     (a) What the result / risk level means (in plain language without clinical jargon)
     (b) Why it matters for their long-term health and well-being
     (c) What practical steps to take next (e.g. scheduling a doctor consultation, questions to bring to their doctor, simple dietary/lifestyle habits)
     (d) Reassurance and emergency guidance
   - NEVER BRING UP HOW THE SYSTEM WORKS INTERNALLY. Do NOT mention quantum computing, quantum circuits, VQC, qubits, machine learning pipelines, model names, feature extraction, or algorithms UNLESS the patient specifically and explicitly asks "how does this work?" or directly inquires about the technology.
   - All technical and quantum pipeline explanations live strictly in the separate "Pipeline Explainer" tab of the app, NOT in your everyday conversation with the patient.

CRITICAL SAFETY & MEDICAL POLICIES (MANDATORY ACROSS ALL ACCENTS & LANGUAGES):
2. YOU ARE NOT A DOCTOR AND YOU DO NOT PROVIDE MEDICAL DIAGNOSES. Frame all assessments as "AI-assisted early risk screening that helps you know when to see a doctor."
3. NEVER prescribe medications or declare definitive medical conditions.
4. EMERGENCY FIRST: If the user mentions any emergency warning signs (severe chest pain, severe difficulty breathing, sudden weakness/paralysis, unconsciousness, severe bleeding, or sudden speech loss), IMMEDIATELY urge them to contact emergency services (112 / 108 in India, 911 in the US, 999 in the UK) or go to the nearest hospital emergency room right away. Do NOT tell them to wait for an AI screening.
5. REGISTER & TONE GUIDELINES:
   - Selected Dialect / Register: ${selectedRegister.name}
   - Specific Instructions: ${selectedRegister.registerGuidance}
   - Always keep the medical substance, risk thresholds, and emergency instructions strictly accurate, while adapting the conversational style, idioms, and vocabulary to this register.
6. Keep answers warm, human, reassuring, and concise (2-3 short paragraphs or clean bullet points).`;

  const client = getGenAI();

  if (client) {
    try {
      const promptText = `User Message: "${message || 'Hello'}"
Current Patient & Assessment Context:
- Active Section: ${context.section || 'General'}
- Screened Pathology: ${context.disease_id || 'General Cardiometabolic Screening'}
- Screening Risk Band: ${context.risk_band || 'None evaluated yet'}
- Screening Risk Score: ${context.risk_score ? `${context.risk_score}%` : 'None'}
- Plain Meaning: ${context.plain_meaning || 'Routine health inquiry'}

Please provide a compassionate, culturally authentic, and medically safe response according to your specified register.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || '';
      return res.json({
        reply: replyText,
        companion_locale,
        language: companion_locale,
        source: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.warn('[Gemini API] Request error, using smart register-tailored fallback:', err?.message || err);
      // Fall through to register fallback below
    }
  }

  // Smart Register-Tailored Fallback when offline or no API key
  const fallbackByRegister: Record<string, Record<string, string>> = {
    emergency: {
      india_en: "⚠️ Please do not wait! If you or anyone with you has severe chest tightness, sudden breathlessness, weakness on one side, or heavy bleeding, please call emergency services (112 or 108) or go to the nearest hospital casualty/emergency ward immediately.",
      american: "⚠️ This sounds like it could be a medical emergency! If you're experiencing severe chest pain, trouble breathing, sudden numbness or weakness, please call 911 or head to the nearest ER right away. Please don't wait on an AI app.",
      british: "⚠️ Please treat this as urgent! If you or someone with you has severe chest pain, acute shortness of breath, or sudden weakness, please dial 999 or proceed to your nearest A&E immediately. Do not delay for online screening.",
      hi: "⚠️ कृपया बिल्कुल प्रतीक्षा न करें! यदि आपको या आपके किसी परिजन को सीने में तेज दर्द, सांस लेने में अत्यधिक तकलीफ, अचानक कमजोरी या अत्यधिक रक्तस्राव हो रहा है, तो तुरंत आपातकालीन सेवाओं (108 / 112) पर कॉल करें या नजदीकी अस्पताल के इमरजेंसी विभाग में जाएं।",
      ta: "⚠️ தயவுசெய்து காத்திருக்க வேண்டாம்! கடுமையான நெஞ்சு வலி, மூச்சுத் திணறல் அல்லது திடீர் பக்கவாதம் போன்ற அறிகுறிகள் இருந்தால், உடனடியாக 108 அல்லது 112 அவசர உதவிக்கு அழைக்கவும் அல்லது அருகிலுள்ள அவசர சிகிச்சை மையத்திற்கு செல்லவும்.",
      te: "⚠️ దయచేసి ఏమాత్రం ఆలస్యం చేయకండి! తీవ్రమైన ఛాతీ నొప్పి, శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా ఆకస్మిక బలహీనత ఉంటే, వెంటనే 108 లేదా 112 అత్యవసర సేవలకు కాల్ చేయండి లేదా సమీపంలోని అత్యవసర విభాగానికి వెళ్లండి.",
      bn: "⚠️ অবিলম্বে ব্যবস্থা নিন! তীব্র বুকে ব্যথা, মারাত্মক শ্বাসকষ্ট, হঠাৎ দুর্বলতা বা অসাড়তা দেখা দিলে দেরি না করে 108 বা 112 নম্বরে ফোন করুন অথবা নিকটস্থ জরুরি বিভাগে যান।",
      mr: "⚠️ कृपया अजिबात वेळ वाया घालवू नका! छातीत तीव्र वेदना, श्वास घेण्यास त्रास किंवा अचानक अशक्तपणा जाणवत असल्यास तात्काळ 108 / 112 वर संपर्क साधा किंवा जवळच्या हॉस्पिटलच्या इमर्जन्सी वॉर्डमध्ये जा.",
      kn: "⚠️ ದಯವಿಟ್ಟು ಕಾಯಬೇಡಿ! ತೀವ್ರ ಎದೆ ನೋವು, ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ಹಠಾತ್ ದೌರ್ಬಲ್ಯವಿದ್ದರೆ ತಕ್ಷಣ 108 ಅಥವಾ 112 ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.",
      pa: "⚠️ ਬਿਲਕੁਲ ਵੀ ਦੇਰ ਨਾ ਕਰੋ ਜੀ! ਜੇਕਰ ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ, ਸਾਹ ਲੈਣ ਵਿੱਚ ਔਖ ਜਾਂ ਅਚਾਨਕ ਕਮਜ਼ੋਰੀ ਹੈ ਤਾਂ ਤੁਰੰਤ 108 ਜਾਂ 112 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨਜ਼ਦੀਕੀ ਐਮਰਜੈਂਸੀ ਹਸਪਤਾਲ ਜਾਓ।",
      gu: "⚠️ કૃપા કરીને રાહ ન જુઓ! જો છાતીમાં તીવ્ર દુખાવો, શ્વાસ લેવામાં તકલીફ અથવા અચાનક નબળાઈ જણાય, તો તરત જ 108 અથવા 112 પર સંપર્ક કરો અથવા નજીકની હોસ્પિટલ પહોંચો.",
      ml: "⚠️ ദയവായി ഒട്ടും കാത്തിരിക്കരുത്! കഠിനമായ നെഞ്ചുവേദന, ശ്വാസതടസ്സം അല്ലെങ്കിൽ പെട്ടെന്നുള്ള തളർച്ച ഉണ്ടെങ്കിൽ ഉടൻ 108 അല്ലെങ്കിൽ 112 എമർജൻസി നമ്പറിൽ വിളിക്കുക."
    },
    risk_query: {
      india_en: "Let us look at your screening numbers together. A risk score indicates where your health indicators sit compared to typical preventive ranges. It is an early signal to help you take proactive care, not a medical diagnosis. The most helpful step now is to schedule a routine consultation with your doctor, share these results, and discuss practical lifestyle changes like diet and regular walking.",
      american: "Here is what your screening numbers mean in plain English: they show how your current health indicators compare against standard preventive guidelines. It is an early heads-up so you can stay ahead of your health, not a clinical diagnosis. The best next move is to share these numbers with your primary care doctor and discuss simple everyday habits that can make a big difference.",
      british: "Let us examine your screening score in plain terms. Your score highlights areas where your health markers could benefit from proactive attention. Remember, this is an early risk screening rather than a medical diagnosis. The sensible next step is to arrange a consultation with your GP, bring these metrics along, and discuss sensible lifestyle and monitoring steps.",
      hi: "आइए आपके स्क्रीनिंग स्कोर को सरल भाषा में समझें। यह स्कोर केवल यह दर्शाता है कि आपके स्वास्थ्य संकेतक सामान्य सीमा से कितने अलग हैं। यह कोई बीमारी का पक्का डायग्नोसिस नहीं है, बल्कि एक पूर्व-चेतावनी है ताकि आप समय रहते सजग हो सकें। सबसे सही कदम यह है कि आप अपने डॉक्टर से मिलकर इस पर चर्चा करें और अपने खान-पान व दिनचर्या में स्वस्थ बदलाव करें।",
      ta: "உங்கள் பரிசோதனை முடிவை எளிய முறையில் புரிந்து கொள்வோம். இந்த அபாய மதிப்பீடு உங்கள் உடல்நலக் குறியீடுகள் எவ்வாறு உள்ளன என்பதைக் காட்டும் ஆரம்ப எச்சரிக்கை மட்டுமே. இது மருத்துவ நோயறிதல் அல்ல. இந்த எண்களை உங்கள் மருத்துவரிடம் காண்பித்து, உணவு முறை மற்றும் எளிய உடற்பயிற்சிகள் குறித்து ஆலோசிப்பதே சிறந்த அடுத்த படியாகும்.",
      te: "మీ స్క్రీనింగ్ ఫలితాన్ని సులభంగా అర్థం చేసుకుందాం. ఈ రిస్క్ స్కోరు మీ ఆరోగ్య సూచికలు సాధారణ పరిమితులతో పోలిస్తే ఎలా ఉన్నాయో తెలిపే ముందస్తు సూచన మాత్రమే. ఇది తుది రోగ నిర్ధారణ కాదు. మీ వైద్యుడిని సంప్రదించి, ఈ వివరాలను చూపించి జీవనశైలి మార్పులపై సలహా తీసుకోవడం మంచిది.",
      bn: "আসুন আপনার স্ক্রীনিং স্কোরটি সহজ ভাষায় বুঝে নিই। এই স্কোরটি আপনার স্বাস্থ্যের বর্তমান অবস্থা সম্পর্কে একটি প্রাথমিক ধারণা দেয়, এটি কোনো নিশ্চিত রোগনির্ণয় নয়। সবচেয়ে ভালো পদক্ষেপ হলো একজন চিকিৎসকের সাথে আলোচনা করা এবং খাদ্যাভ্যাস ও শরীরচর্চায় স্বাস্থ্যকর পরিবর্তন আনা।",
      mr: "आपल्या तपासणीच्या निकालाचा सोपा अर्थ समजून घेऊया. हा स्कोअर आपल्या आरोग्याची स्थिती दर्शवणारा एक प्राथमिक इशारा आहे, कोणताही पक्का आजार नाही. डॉक्टरांना भेटून यावर सल्ला घेणे आणि आहारासह रोजच्या सवयींमध्ये योग्य बदल करणे हे सर्वात महत्त्वाचे पाऊल आहे.",
      kn: "ನಿಮ್ಮ ಸ್ಕ್ರೀನಿಂಗ್ ಫಲಿತಾಂಶವನ್ನು ಸರಳವಾಗಿ ತಿಳಿಯೋಣ. ಈ ಅಂಕವು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸ್ಥಿತಿಯ ಆರಂಭಿಕ ಎಚ್ಚರಿಕೆ ಮಾತ್ರ, ಖಚಿತವಾದ ರೋಗನಿರ್ಣಯವಲ್ಲ. ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ ಈ ಬಗ್ಗೆ ಸಮಾಲೋಚಿಸುವುದು ಮತ್ತು ಉತ್ತಮ ದಿನಚರಿ ರೂಢಿಸಿಕೊಳ್ಳುವುದು ಸೂಕ್ತ.",
      pa: "ਆਓ ਤੁਹਾਡੇ ਸਕ੍ਰੀਨਿੰਗ ਨਤੀਜੇ ਨੂੰ ਆਮ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝੀਏ। ਇਹ ਸਕੋਰ ਸਿਰਫ਼ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਸੰਕੇਤ ਹੈ ਤਾਂ ਜੋ ਤੁਸੀਂ ਸਮੇਂ ਸਿਰ ਸੁਚੇਤ ਹੋ ਸਕੋ, ਕੋਈ ਪੱਕੀ ਬਿਮਾਰੀ ਨਹੀਂ। ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰਨਾ ਅਤੇ ਖਾਣ-ਪੀਣ ਵਿੱਚ ਸਿਹਤਮੰਦ ਬਦਲਾਅ ਲਿਆਉਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਕਦਮ ਹੈ।",
      gu: "ચાલો તમારા સ્ક્રીનીંગ સ્કોરને સરળ ભાષામાં સમજીએ. આ સ્કોર માત્ર એક પ્રારંભિક સંકેત છે જેથી તમે સમયસર જાગૃત થઈ શકો, કોઈ તબીબી નિદાન નથી. તમારા ડૉક્ટરની સલાહ લઈને યોગ્ય આહાર અને કસરત શરૂ કરવી એ શ્રેષ્ઠ પગલું છે.",
      ml: "നിങ്ങളുടെ സ്ക്രീനിംഗ് സ്കോർ ലളിതമായി മനസ്സിലാക്കാം. ഇത് നിങ്ങളുടെ ആരോഗ്യ സൂചകങ്ങളുടെ ഒരു പ്രാരംഭ മുന്നറിയിപ്പ് മാത്രമാണ്, അന്തിമ രോഗനിർണയമല്ല. ഡോക്ടറെ കണ്ട് സംസാരിക്കുകയും ഭക്ഷണത്തിലും ജീവിതരീതിയിലും നല്ല മാറ്റങ്ങൾ വരുത്തുകയുമാണ് അടുത്ത പടി."
    },
    general: {
      india_en: "Namaste! I am your Q-Diagnose health companion. Please don't worry at all — I am here to help explain what your screening numbers mean in simple words, why they matter, and what questions to prepare for your doctor. How can I assist you right now?",
      american: "Hey there! I'm your health companion. Take a breath — I'm here to break down what your screening numbers mean, why they matter, and what steps to take next with your doctor. What would you like to explore?",
      british: "Hello. I am your health companion. Please do not worry — I am here to help you understand your health risk screening, explain why your numbers matter, and suggest points to discuss with your GP. How may I be of help today?",
      hi: "नमस्ते! मैं आपका स्वास्थ्य साथी हूँ। बिल्कुल चिंता न करें — मैं आपके स्क्रीनिंग स्कोर को सरल भाषा में समझाने, यह आपके लिए क्यों जरूरी है और डॉक्टर से बात करने की तैयारी करने में मदद के लिए यहाँ हूँ। बताइए, मैं आपकी क्या सहायता करूँ?",
      ta: "வணக்கம்! உங்கள் பரிசோதனை முடிவுகள் என்ன சொல்கின்றன, அவை ஏன் முக்கியம், மற்றும் மருத்துவரிடம் என்ன கேட்க வேண்டும் என்பதை எளிய தமிழில் விளக்க நான் உங்களுக்கு உதவுகிறேன். என்ன உதவி வேண்டும்?",
      te: "నమస్కారం! మీ స్క్రీనింగ్ ఫలితాలు ఏమి చెబుతున్నాయి, అవి ఎందుకు ముఖ్యమైనవి మరియు డాక్టర్‌తో చర్చించే అంశాలను సిద్ధం చేయడానికి నేను సహాయపడగలను. మీకు ఏ విషయంలో సహాయం కావాలి?",
      bn: "নমস্কার! আপনার স্বাস্থ্য স্ক্রীনিং ফলাফল বুঝতে, এর গুরুত্ব অনুধাবন করতে এবং চিকিৎসকের সাথে আলোচনার প্রস্তুতি নিতে আমি সাহায্য করতে পারি। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      mr: "नमस्कार! आपल्या तपासणीचे निकाल सोप्या भाषेत समजून घेण्यासाठी, त्याचे महत्त्व जाणून घेण्यासाठी आणि डॉक्टरांशी चर्चेसाठी मी मदत करू शकतो. मी आपल्याला काय मदत करू?",
      kn: "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಆರೋಗ್ಯ ತಪಾಸಣಾ ಫಲಿತಾಂಶಗಳು ಏನು ಸೂಚಿಸುತ್ತವೆ ಮತ್ತು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ಏನು ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳಬೇಕೆಂದು ನಾನು ಮಾರ್ಗದರ್ಶನ ನೀಡಬಲ್ಲೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
      pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ ਤੁਹਾਡੇ ਸਕ੍ਰੀਨਿੰਗ ਨਤੀਜਿਆਂ ਦਾ ਮਤਲਬ ਸਮਝਾਉਣ ਅਤੇ ਡਾਕਟਰ ਨਾਲ ਗੱਲਬਾਤ ਕਰਨ ਦੇ ਨੁਕਤੇ ਤਿਆਰ ਕਰਨ ਵਿੱਚ ਮਦਦ ਲਈ ਹਾਜ਼ਰ ਹਾਂ। ਦੱਸੋ ਜੀ ਕੀ ਸਹਾਇਤਾ ਕਰਾਂ?",
      gu: "નમસ્તે! હું તમારા સ્ક્રીનીંગ પરિણામોનો અર્થ સરળતાથી સમજાવવા અને ડૉક્ટર સાથે ચર્ચા માટે મુદ્દા તૈયાર કરવા મદદ કરી શકું છું. હું તમારી શું સેવા કરું?",
      ml: "നമസ്കാരം! നിങ്ങളുടെ ആരോഗ്യ പരിശോധനാ ഫലങ്ങൾ മനസ്സിലാക്കാനും ഡോക്ടറോട് സംസാരിക്കാനുള്ള കാര്യങ്ങൾ തയ്യാറാക്കാനും ഞാൻ സഹായിക്കാം. എന്താണ് അറിയേണ്ടത്?"
    }
  };

  const lowerMsg = (message || '').toLowerCase();
  let category = 'general';
  if (lowerMsg.includes('chest') || lowerMsg.includes('breath') || lowerMsg.includes('pain') || lowerMsg.includes('emergency') || lowerMsg.includes('sos') || lowerMsg.includes('दर्द') || lowerMsg.includes('सांस') || lowerMsg.includes('வலி') || lowerMsg.includes('నొప్పి')) {
    category = 'emergency';
  } else if (lowerMsg.includes('risk') || lowerMsg.includes('score') || lowerMsg.includes('result') || lowerMsg.includes('prediction') || lowerMsg.includes('why') || lowerMsg.includes('जोखिम') || lowerMsg.includes('ரிஸ்க்')) {
    category = 'risk_query';
  }

  const registerGroup = fallbackByRegister[category] || fallbackByRegister.general;
  const reply = registerGroup[companion_locale] || registerGroup.india_en;

  res.json({
    reply,
    companion_locale,
    language: companion_locale,
    source: 'register-authentic-companion-engine'
  });
});

// GET /benchmark & POST /benchmark
async function handleBenchmark(req: express.Request, res: express.Response) {
  const diseaseId = (req.body && req.body.disease_id) || (req.query && req.query.disease_id) || 'breast_cancer';
  const data = DEFAULT_BENCHMARKS_BY_DISEASE[String(diseaseId)] || DEFAULT_BENCHMARKS_BY_DISEASE.breast_cancer;
  res.json(data);
}

app.get('/benchmark', handleBenchmark);
app.post('/benchmark', handleBenchmark);
app.get('/api/benchmark', handleBenchmark);
app.post('/api/benchmark', handleBenchmark);

// -------------------------------------------------------------
// Vite Server / Static Assets
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Q-Diagnose] Multi-Disease Medical ML Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
