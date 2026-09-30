import { DiseaseId, DiseaseConfig, BenchmarkItem, PredictionHistoryItem } from '../types';

export const DISEASE_CONFIGS: Record<DiseaseId, DiseaseConfig> = {
  breast_cancer: {
    id: 'breast_cancer',
    name: 'Breast Cancer (WDBC)',
    shortName: 'WDBC Breast Cancer',
    datasetName: 'Wisconsin Diagnostic Breast Cancer (WDBC)',
    datasetFullName: 'Wisconsin Diagnostic Breast Cancer (WDBC) Cohort',
    recordsCount: 569,
    featureCount: 30,
    defaultQubits: 4,
    hilbertDimension: '2⁴ (16 States)',
    description: 'Computed from digitized images of fine needle aspirates (FNA) of breast masses, characterizing cell nuclei contours.',
    formatDescription: 'Supports WDBC format (30 real-valued cell nuclei cytological features: radius, perimeter, area, concavity, concave points, etc.)',
    positiveLabel: 'Malignant',
    negativeLabel: 'Benign',
    positiveSubtitle: 'High probability of malignant breast tumor tissue identified',
    negativeSubtitle: 'Benign tissue architecture identified with high certainty',
    featureDimensionNote: '4 PCA components mapped to 4-qubit ZZFeatureMap ansatz (16-dimensional Hilbert space)',
    pcaVariance: '79.23% (30D -> 4D)',
    sampleFileName: 'Wisconsin_Diagnostic_WDBC_v2.4.csv',
  },
  cardiovascular: {
    id: 'cardiovascular',
    name: 'Cardiovascular Disease',
    shortName: 'UCI Heart Disease',
    datasetName: 'UCI Cleveland Heart Disease Cohort',
    datasetFullName: 'UCI Heart Disease Multi-Center Clinical Dataset',
    recordsCount: 303,
    featureCount: 13,
    defaultQubits: 4,
    hilbertDimension: '2⁴ (16 States)',
    description: 'Clinical hemodynamic and electrocardiographic attributes predicting coronary artery stenosis presence.',
    formatDescription: 'Supports UCI Heart Disease format (13 clinical features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal)',
    positiveLabel: 'High Risk',
    negativeLabel: 'Low Risk',
    positiveSubtitle: 'Significant risk of coronary artery disease / ischemic cardiac event',
    negativeSubtitle: 'Low cardiovascular disease risk indicated by hemodynamic parameters',
    featureDimensionNote: '4 PCA components mapped to 4-qubit ZZFeatureMap ansatz (16-dimensional Hilbert space)',
    pcaVariance: '74.85% (13D -> 4D)',
    sampleFileName: 'UCI_Heart_Disease_Cleveland_Cohort.csv',
  },
  neurological: {
    id: 'neurological',
    name: 'Neurological Disorders',
    shortName: 'Parkinson\'s Acoustic',
    datasetName: 'Oxford Parkinson\'s Voice Measurement Dataset',
    datasetFullName: 'Oxford Parkinson\'s Voice Dysphonia & Tremor Biomarkers',
    recordsCount: 195,
    featureCount: 22,
    defaultQubits: 4,
    hilbertDimension: '2⁴ (16 States)',
    description: 'Biomedical voice and acoustic stability measurements characterizing basal ganglia neurodegenerative motor impairments.',
    formatDescription: 'Supports Parkinson\'s Biomarker format (22 biomedical features: fundamental frequency MDVP:Fo, jitter, shimmer, NHR, HNR, RPDE, DFA, PPE, etc.)',
    positiveLabel: 'Parkinson\'s Indicated',
    negativeLabel: 'Healthy',
    positiveSubtitle: 'Acoustic dysphonia and vocal micro-tremors indicate Parkinsonian motor impairment',
    negativeSubtitle: 'Healthy neuromuscular vocal control and clean harmonic acoustic profile confirmed',
    featureDimensionNote: '4 PCA components mapped to 4-qubit ZZFeatureMap ansatz (16-dimensional Hilbert space)',
    pcaVariance: '81.40% (22D -> 4D)',
    sampleFileName: 'Oxford_Parkinsons_Acoustic_Cohort.csv',
  },
};

// CSV Samples
export const SAMPLE_HEART_DISEASE_CSV = `id,age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal
CVD-84920,63,1,3,145,233,1,0,150,0,2.3,0,0,1
CVD-71042,37,1,2,130,250,0,1,187,0,3.5,0,0,2
CVD-59301,41,0,1,130,204,0,0,172,0,1.4,2,0,2
CVD-62945,56,1,1,120,236,0,1,178,0,0.8,2,0,2
CVD-48190,57,0,0,120,354,0,1,163,1,0.6,2,0,2
CVD-83921,57,1,0,140,192,0,1,148,0,0.4,1,0,1
CVD-91402,56,0,1,140,294,0,0,153,0,1.3,1,0,2
CVD-55219,44,1,1,120,263,0,1,173,0,0.0,2,0,3
CVD-67104,52,1,2,172,199,1,1,162,0,0.5,2,0,3
CVD-73489,57,1,2,150,168,0,1,174,0,1.6,2,0,2
CVD-81923,54,1,0,140,239,0,1,160,0,1.2,2,0,2
CVD-42091,48,0,2,130,275,0,1,139,0,0.2,2,0,2
CVD-90184,63,1,0,140,187,0,0,144,1,4.0,2,2,3
CVD-66432,53,1,0,140,203,1,0,155,1,3.1,0,0,3`;

export const SAMPLE_NEUROLOGICAL_CSV = `id,mdvp_fo_hz,mdvp_fhi_hz,mdvp_flo_hz,mdvp_jitter_pct,mdvp_jitter_abs,mdvp_rap,mdvp_ppq,jitter_ddp,mdvp_shimmer,mdvp_shimmer_db,shimmer_apq3,shimmer_apq5,mdvp_apq,shimmer_dda,nhr,hnr,rpde,dfa,spread1,spread2,d2,ppe
PKD-72014,119.992,157.302,74.997,0.00784,0.00007,0.00370,0.00554,0.01109,0.04374,0.426,0.02182,0.03130,0.02971,0.06545,0.02211,21.033,0.414783,0.815285,-4.813031,0.266482,2.301442,0.284654
PKD-81943,122.400,148.650,113.819,0.00968,0.00008,0.00465,0.00696,0.01394,0.06134,0.626,0.03134,0.04518,0.04368,0.09403,0.01929,19.085,0.458359,0.819521,-4.075192,0.335590,2.486855,0.368674
PKD-63491,116.682,131.111,111.555,0.01050,0.00009,0.00544,0.00781,0.01633,0.05233,0.482,0.02757,0.03858,0.03590,0.08270,0.01309,20.651,0.429895,0.825288,-4.443179,0.311173,2.342259,0.332634
PKD-51098,116.676,137.871,111.366,0.00997,0.00009,0.00502,0.00698,0.01505,0.05492,0.517,0.02924,0.04005,0.03772,0.08771,0.01353,20.644,0.434969,0.819235,-4.117501,0.334147,2.405554,0.368975
PKD-44820,116.014,141.781,110.655,0.01284,0.00011,0.00655,0.00908,0.01966,0.06425,0.584,0.03490,0.04825,0.04465,0.10470,0.01767,19.649,0.417356,0.823484,-3.747787,0.234513,2.332180,0.410335
PKD-90312,120.552,131.162,113.787,0.00968,0.00008,0.00463,0.00750,0.01388,0.04701,0.456,0.02328,0.03526,0.03243,0.06985,0.01222,21.378,0.415564,0.825124,-4.242867,0.299111,2.187560,0.357775
PKD-10934,197.076,206.896,192.055,0.00289,0.00001,0.00166,0.00168,0.00498,0.01098,0.097,0.00563,0.00680,0.00802,0.01689,0.00339,26.775,0.422229,0.741367,-7.348300,0.177551,1.743867,0.085569
PKD-28491,199.228,209.512,192.091,0.00241,0.00001,0.00134,0.00138,0.00402,0.01015,0.089,0.00504,0.00641,0.00762,0.01513,0.00167,30.940,0.432439,0.742055,-7.682587,0.173319,2.103106,0.068501
PKD-37209,198.383,215.203,193.104,0.00212,0.00001,0.00113,0.00135,0.00339,0.00910,0.079,0.00446,0.00563,0.00680,0.01338,0.00164,30.841,0.443936,0.740880,-7.711812,0.173319,2.103106,0.068501
PKD-19402,202.266,211.604,197.079,0.00180,0.00001,0.00093,0.00107,0.00278,0.00954,0.085,0.00469,0.00606,0.00719,0.01407,0.00072,32.684,0.368535,0.742133,-7.695734,0.178540,1.544809,0.056141`;

export interface GlossaryFeature {
  name: string;
  description: string;
  range: string;
  clinicalNote: string;
}

export const DISEASE_GLOSSARIES: Record<DiseaseId, GlossaryFeature[]> = {
  breast_cancer: [
    {
      name: 'radius_mean / radius_worst',
      description: 'Mean of distances from center to points on the cell perimeter.',
      range: '6.98 – 28.11 mm',
      clinicalNote: 'Primary indicator of nuclear hyperplasia; enlarged nuclei frequently correlate with malignancy.'
    },
    {
      name: 'texture_mean / texture_worst',
      description: 'Standard deviation of gray-scale values in the digitized fine needle aspirate (FNA) image.',
      range: '9.71 – 39.28',
      clinicalNote: 'Quantifies chromatin heterogeneity; high texture indicates chromatin clump variation.'
    },
    {
      name: 'perimeter_mean / perimeter_worst',
      description: 'Total contour distance bounding the cell nucleus.',
      range: '43.79 – 188.5 mm',
      clinicalNote: 'Elevated perimeter indicates irregular, invasive cellular boundaries.'
    },
    {
      name: 'area_mean / area_worst',
      description: 'Nuclear cross-sectional area computed via pixel grid integration.',
      range: '143.5 – 2501.0 mm²',
      clinicalNote: 'Strong discriminator for macro-nucleoli enlargement in invasive carcinoma.'
    },
    {
      name: 'smoothness_mean / smoothness_worst',
      description: 'Local variation in radius lengths along the nuclear perimeter.',
      range: '0.053 – 0.163',
      clinicalNote: 'Identifies ragged membrane contours characteristic of ductal carcinomas.'
    },
    {
      name: 'compactness_mean / compactness_worst',
      description: 'Defined as (perimeter² / area - 1.0). Dimensionless circularity measure.',
      range: '0.019 – 0.345',
      clinicalNote: 'Deviations from circular geometry indicate malignant pleomorphism.'
    },
    {
      name: 'concavity_mean / concavity_worst',
      description: 'Severity and depth of concave portions of the nuclear contour.',
      range: '0.000 – 0.427',
      clinicalNote: 'High concavity is one of the highest weighted features in quantum Hilbert space mapping.'
    },
    {
      name: 'concave_points_mean / concave_points_worst',
      description: 'Total count of inward contour indentations on the boundary.',
      range: '0.000 – 0.201',
      clinicalNote: 'Top-ranked feature in both Random Forest Gini importance and VQC gradient sensitivity.'
    },
    {
      name: 'symmetry_mean / symmetry_worst',
      description: 'Nuclear mirror axis alignment coefficient.',
      range: '0.106 – 0.304',
      clinicalNote: 'Asymmetry is common in high-grade aneuploid tumor cells.'
    },
    {
      name: 'fractal_dimension_mean / fractal_dimension_worst',
      description: 'Coastline approximation of nuclear boundary roughness (fractal dimension - 1).',
      range: '0.050 – 0.097',
      clinicalNote: 'Captures microscopic boundary self-similarity.'
    }
  ],
  cardiovascular: [
    {
      name: 'age',
      description: 'Age of patient in continuous biological years.',
      range: '29 – 77 years',
      clinicalNote: 'Key baseline risk multiplier for progressive coronary atheroma development.'
    },
    {
      name: 'sex',
      description: 'Biological sex of patient (1 = male, 0 = female).',
      range: '0 or 1',
      clinicalNote: 'Biological risk stratification factor in pre-menopausal and post-menopausal cohorts.'
    },
    {
      name: 'cp (Chest Pain Type)',
      description: 'Pain classification: 0=typical angina, 1=atypical angina, 2=non-anginal, 3=asymptomatic.',
      range: '0 – 3',
      clinicalNote: 'Asymptomatic (type 3) and atypical presentations strongly predict occult myocardial ischemia.'
    },
    {
      name: 'trestbps (Resting Blood Pressure)',
      description: 'Resting systolic blood pressure upon hospital admission in mm Hg.',
      range: '94 – 200 mm Hg',
      clinicalNote: 'Chronic hypertension strains arterial walls, accelerating coronary vascular remodeling.'
    },
    {
      name: 'chol (Serum Cholesterol)',
      description: 'Serum cholesterol concentration in mg/dl.',
      range: '126 – 564 mg/dl',
      clinicalNote: 'Elevated low-density lipoproteins drive coronary plaque accumulation.'
    },
    {
      name: 'fbs (Fasting Blood Sugar)',
      description: 'Fasting blood sugar > 120 mg/dl indicator (1 = true, 0 = false).',
      range: '0 or 1',
      clinicalNote: 'Marker for diabetic vasculopathy and accelerated atherosclerotic progression.'
    },
    {
      name: 'restecg (Resting ECG)',
      description: '0 = normal, 1 = ST-T wave abnormality, 2 = probable/definite left ventricular hypertrophy.',
      range: '0 – 2',
      clinicalNote: 'ST-T wave depression indicates baseline myocardial repolarization impairment.'
    },
    {
      name: 'thalach (Max Heart Rate)',
      description: 'Maximum achieved heart rate during treadmill exercise tolerance stress test.',
      range: '71 – 202 bpm',
      clinicalNote: 'Reduced maximum chronotropic capacity correlates with severe multi-vessel CAD.'
    },
    {
      name: 'exang (Exercise Induced Angina)',
      description: 'Presence of chest angina elicited during stress testing (1 = yes, 0 = no).',
      range: '0 or 1',
      clinicalNote: 'Direct clinical indicator of insufficient coronary collateral blood flow.'
    },
    {
      name: 'oldpeak (ST Depression)',
      description: 'ST depression induced by exercise relative to resting baseline electrocardiogram.',
      range: '0.0 – 6.2 mm',
      clinicalNote: 'Crucial hemodynamic sign; >2.0 mm ST sag strongly indicates subendocardial ischemia.'
    },
    {
      name: 'slope (ST Segment Slope)',
      description: 'Slope of peak exercise ST segment: 0 = upsloping, 1 = flat, 2 = downsloping.',
      range: '0 – 2',
      clinicalNote: 'Downsloping and horizontal slopes carry significant diagnostic weight in ischemic injury.'
    },
    {
      name: 'ca (Vessels Colored)',
      description: 'Number of major coronary vessels (0–3) visualized by fluoroscopy.',
      range: '0 – 3 vessels',
      clinicalNote: 'High vessel counts confirm multi-arterial calcification and occlusive coronary disease.'
    },
    {
      name: 'thal (Thallium Scintigraphy)',
      description: 'Perfusion defect: 1 = normal, 2 = fixed defect (infarction), 3 = reversible defect (ischemia).',
      range: '1 – 3',
      clinicalNote: 'Reversible defects pinpoint viable myocardium suffering from stress-induced ischemia.'
    }
  ],
  neurological: [
    {
      name: 'mdvp_fo_hz (Average Fundamental Frequency)',
      description: 'Mean vocal acoustic fundamental frequency (pitch) in Hertz (Hz).',
      range: '88.33 – 260.10 Hz',
      clinicalNote: 'Reflects vocal cord tension control modulated by laryngeal motor neurons.'
    },
    {
      name: 'mdvp_fhi_hz / mdvp_flo_hz (Pitch Extremes)',
      description: 'Maximum and minimum vocal fundamental frequencies across sustained phonation.',
      range: '102.1 – 592.0 Hz',
      clinicalNote: 'Parkinson\'s rigidity restricts phonatory pitch range, causing vocal pitch flattening.'
    },
    {
      name: 'mdvp_jitter_pct / mdvp_jitter_abs',
      description: 'Cycle-to-cycle frequency variation in sustained vowel /a/ phonation.',
      range: '0.0016 – 0.0331%',
      clinicalNote: 'Elevated frequency perturbation indicates basal ganglia tremor transmitting to laryngeal muscles.'
    },
    {
      name: 'mdvp_shimmer / mdvp_shimmer_db',
      description: 'Cycle-to-cycle sound wave amplitude variation in absolute and decibel scale.',
      range: '0.009 – 0.119',
      clinicalNote: 'Incomplete vocal fold closure and breathiness cause irregular sound wave amplitude spikes.'
    },
    {
      name: 'hnr (Harmonics-to-Noise Ratio)',
      description: 'Ratio of harmonic acoustic energy to turbulent noise in decibels (dB).',
      range: '8.44 – 33.04 dB',
      clinicalNote: 'Healthy voices exceed 20 dB; lower values signify severe dysphonia and air escape.'
    },
    {
      name: 'nhr (Noise-to-Harmonics Ratio)',
      description: 'Measure of turbulent noise component within the vocal spectrum.',
      range: '0.0006 – 0.3148',
      clinicalNote: 'Directly reflects vocal tremor dysarthria in neurodegenerative progression.'
    },
    {
      name: 'rpde (Recurrence Period Density Entropy)',
      description: 'Non-linear dynamical complexity measure of vocal cycle periodicity.',
      range: '0.256 – 0.685',
      clinicalNote: 'Quantifies chaotic irregularity in vocal attractor dynamics caused by motor dyscontrol.'
    },
    {
      name: 'dfa (Detrended Fluctuation Analysis)',
      description: 'Signal fractal scaling exponent measuring self-similarity across timescales.',
      range: '0.574 – 0.825',
      clinicalNote: 'Disturbed long-range correlations distinguish Parkinsonian dysphonia from healthy aging.'
    },
    {
      name: 'spread1 / spread2',
      description: 'Non-linear measures of fundamental frequency variation and pitch chaos spread.',
      range: '-7.96 – -2.43',
      clinicalNote: 'Highly ranked in quantum state separation for identifying early-stage basal ganglia degeneration.'
    },
    {
      name: 'ppe (Pitch Period Entropy)',
      description: 'Impaired pitch period entropy quantifying voice pitch modulation stability.',
      range: '0.044 – 0.527',
      clinicalNote: 'Robust biomarker resistant to acoustic recording noise, heavily weighted in VQC / QNN circuits.'
    }
  ]
};

export const DISEASE_BENCHMARKS: Record<DiseaseId, BenchmarkItem[]> = {
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
      notes: '100 estimators, Gini impurity criterion with bootstrapping on 30 features.'
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
      model_name: 'QSVM (Quantum SVM)',
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
      model_name: 'VQC (Variational Quantum Classifier)',
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
      recall: 0.840,
      f1: 0.834,
      roc_auc: 0.892,
      train_time: '0.3s',
      inference_time: '1.1ms',
      notes: 'Linear logistic regression with L2 regularization on 13 standardized clinical features.'
    },
    {
      model_name: 'Random Forest',
      type: 'classical',
      accuracy: 0.868,
      precision: 0.862,
      recall: 0.871,
      f1: 0.866,
      roc_auc: 0.924,
      train_time: '1.4s',
      inference_time: '3.9ms',
      notes: '100 trees, max_depth=6, tuned for clinical cardiovascular risk stratification.'
    },
    {
      model_name: 'XGBoost',
      type: 'classical',
      accuracy: 0.875,
      precision: 0.870,
      recall: 0.879,
      f1: 0.874,
      roc_auc: 0.931,
      train_time: '1.9s',
      inference_time: '3.2ms',
      notes: 'Gradient boosting with subsample=0.8, regularizing complex ECG/hemodynamic feature interactions.'
    },
    {
      model_name: 'QSVM (Quantum SVM)',
      type: 'quantum',
      accuracy: 0.884,
      precision: 0.880,
      recall: 0.887,
      f1: 0.883,
      roc_auc: 0.941,
      train_time: '32.6s',
      inference_time: '11.5ms',
      notes: 'ZZFeatureMap quantum kernel projecting 4 PCA cardiovascular components into 16-dimensional state space.'
    },
    {
      model_name: 'QNN (Quantum Neural Network)',
      type: 'quantum',
      accuracy: 0.891,
      precision: 0.886,
      recall: 0.894,
      f1: 0.890,
      roc_auc: 0.948,
      train_time: '36.8s',
      inference_time: '9.6ms',
      notes: 'Hybrid parameterized quantum circuit (4 qubits) with dense readout for continuous risk estimation.'
    },
    {
      model_name: 'VQC (Variational Quantum Classifier)',
      type: 'quantum',
      accuracy: 0.898,
      precision: 0.892,
      recall: 0.902,
      f1: 0.897,
      roc_auc: 0.954,
      train_time: '39.4s',
      inference_time: '8.9ms',
      notes: '4-qubit RealAmplitudes ansatz mapping non-linear ST-depression and thal defect boundaries.'
    }
  ],
  neurological: [
    {
      model_name: 'Logistic Regression',
      type: 'classical',
      accuracy: 0.856,
      precision: 0.849,
      recall: 0.865,
      f1: 0.857,
      roc_auc: 0.908,
      train_time: '0.3s',
      inference_time: '1.0ms',
      notes: 'Logistic regression baseline on 22 acoustic voice/jitter dysphonia features.'
    },
    {
      model_name: 'Random Forest',
      type: 'classical',
      accuracy: 0.908,
      precision: 0.901,
      recall: 0.914,
      f1: 0.907,
      roc_auc: 0.952,
      train_time: '1.6s',
      inference_time: '4.2ms',
      notes: '100 ensemble trees on 22 Oxford voice frequency and motor tremor parameters.'
    },
    {
      model_name: 'XGBoost',
      type: 'classical',
      accuracy: 0.918,
      precision: 0.912,
      recall: 0.922,
      f1: 0.917,
      roc_auc: 0.961,
      train_time: '2.1s',
      inference_time: '3.4ms',
      notes: 'Gradient boosting capturing non-linear dysphonia correlations (RPDE, DFA, spread1).'
    },
    {
      model_name: 'QSVM (Quantum SVM)',
      type: 'quantum',
      accuracy: 0.928,
      precision: 0.922,
      recall: 0.931,
      f1: 0.926,
      roc_auc: 0.969,
      train_time: '29.5s',
      inference_time: '10.8ms',
      notes: 'Quantum state inner product distinguishing subtle acoustic perturbation manifolds.'
    },
    {
      model_name: 'QNN (Quantum Neural Network)',
      type: 'quantum',
      accuracy: 0.933,
      precision: 0.927,
      recall: 0.936,
      f1: 0.931,
      roc_auc: 0.974,
      train_time: '34.2s',
      inference_time: '9.2ms',
      notes: 'Hybrid quantum-classical network regularizing pitch period entropy (PPE) variance.'
    },
    {
      model_name: 'VQC (Variational Quantum Classifier)',
      type: 'quantum',
      accuracy: 0.938,
      precision: 0.933,
      recall: 0.941,
      f1: 0.937,
      roc_auc: 0.979,
      train_time: '37.0s',
      inference_time: '8.4ms',
      notes: '4-qubit parameterized rotation ansatz isolating sub-harmonic phonation and tremor signs.'
    }
  ]
};

export const INITIAL_DISEASE_HISTORY: Record<DiseaseId, PredictionHistoryItem[]> = {
  breast_cancer: [
    {
      id: 'PRED-2026-0901-01',
      timestamp: '2026-09-01 14:32:10 UTC',
      sample_id: 'WDBC-842302',
      disease_id: 'breast_cancer',
      dataset_name: 'WDBC_Clinical_Validation_v2.4',
      model_used: 'Both (Compare)',
      prediction: 'Malignant',
      confidence: 96.8,
      quantum_score: 0.974,
      classical_score: 0.962,
      result: {
        id: 'PRED-2026-0901-01',
        timestamp: '2026-09-01 14:32:10 UTC',
        sample_id: 'WDBC-842302',
        disease_id: 'breast_cancer',
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
        feature_importance: [
          { name: 'concave_points_mean', value: 34.2, description: 'Number of concave portions of the tumor contour' },
          { name: 'area_worst', value: 24.6, description: 'Largest area measurement among outer perimeter' },
          { name: 'perimeter_worst', value: 18.1, description: 'Largest perimeter of the cell nuclei' },
          { name: 'radius_worst', value: 12.8, description: 'Largest radius of cell nuclear boundaries' },
          { name: 'texture_worst', value: 10.3, description: 'Standard deviation of gray-scale values' },
        ],
      }
    },
    {
      id: 'PRED-2026-0901-02',
      timestamp: '2026-09-01 13:48:22 UTC',
      sample_id: 'WDBC-8510824',
      disease_id: 'breast_cancer',
      dataset_name: 'WDBC_Clinical_Validation_v2.4',
      model_used: 'Quantum (VQC)',
      prediction: 'Benign',
      confidence: 98.4,
      quantum_score: 0.984,
      classical_score: 0.942,
      result: {
        id: 'PRED-2026-0901-02',
        timestamp: '2026-09-01 13:48:22 UTC',
        sample_id: 'WDBC-8510824',
        disease_id: 'breast_cancer',
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
        feature_importance: [
          { name: 'radius_mean', value: 31.0, description: 'Mean distance from center to perimeter' },
          { name: 'area_mean', value: 26.5, description: 'Mean nuclear area in square micrometers' },
          { name: 'smoothness_mean', value: 19.8, description: 'Local variation in radius lengths' },
          { name: 'compactness_mean', value: 13.4, description: 'Perimeter^2 / area - 1.0' },
          { name: 'symmetry_mean', value: 9.3, description: 'Nuclear symmetry coefficient' },
        ],
      }
    }
  ],
  cardiovascular: [
    {
      id: 'PRED-2026-0902-C01',
      timestamp: '2026-09-02 08:15:30 UTC',
      sample_id: 'HEART-101',
      disease_id: 'cardiovascular',
      dataset_name: 'UCI_Heart_Disease_Cleveland_Cohort',
      model_used: 'Both (Compare)',
      prediction: 'High Risk',
      confidence: 93.4,
      quantum_score: 0.942,
      classical_score: 0.918,
      result: {
        id: 'PRED-2026-0902-C01',
        timestamp: '2026-09-02 08:15:30 UTC',
        sample_id: 'HEART-101',
        disease_id: 'cardiovascular',
        dataset_name: 'UCI_Heart_Disease_Cleveland_Cohort',
        model_used: 'Both (Compare)',
        prediction: 'High Risk',
        confidence: 93.4,
        quantum_score: 0.942,
        classical_score: 0.918,
        circuit_depth: 8,
        qubits_used: 4,
        execution_time_ms: 124,
        consensus_agreement: true,
        notes: 'Significant exercise-induced ST depression (oldpeak: 2.3) combined with asymptomatic chest pain and elevated resting BP (145 mmHg). Quantum circuit resolved non-linear ST/thal defect interaction.',
        feature_importance: [
          { name: 'thal', value: 31.5, description: 'Thallium scintigraphy stress defect (reversible/fixed)' },
          { name: 'cp (chest pain)', value: 26.8, description: 'Chest pain type (asymptomatic ischemia risk)' },
          { name: 'oldpeak', value: 20.4, description: 'ST depression induced by exercise relative to rest' },
          { name: 'ca (fluoroscopy)', value: 12.7, description: 'Number of major vessels colored by fluoroscopy' },
          { name: 'thalach (max HR)', value: 8.6, description: 'Maximum achieved heart rate during exercise' },
        ],
      }
    },
    {
      id: 'PRED-2026-0902-C02',
      timestamp: '2026-09-02 07:40:12 UTC',
      sample_id: 'HEART-103',
      disease_id: 'cardiovascular',
      dataset_name: 'UCI_Heart_Disease_Cleveland_Cohort',
      model_used: 'Quantum (VQC)',
      prediction: 'Low Risk',
      confidence: 95.8,
      quantum_score: 0.962,
      classical_score: 0.925,
      result: {
        id: 'PRED-2026-0902-C02',
        timestamp: '2026-09-02 07:40:12 UTC',
        sample_id: 'HEART-103',
        disease_id: 'cardiovascular',
        dataset_name: 'UCI_Heart_Disease_Cleveland_Cohort',
        model_used: 'Quantum (VQC)',
        prediction: 'Low Risk',
        confidence: 95.8,
        quantum_score: 0.962,
        classical_score: 0.925,
        circuit_depth: 8,
        qubits_used: 4,
        execution_time_ms: 92,
        consensus_agreement: true,
        notes: 'High maximum heart rate (172 bpm) with normal resting ECG and zero fluoroscopy vessel calcification indicating healthy coronary perfusion.',
        feature_importance: [
          { name: 'thalach (max HR)', value: 33.2, description: 'High cardiac output capacity with healthy chronotropic response' },
          { name: 'ca (fluoroscopy)', value: 28.5, description: 'Zero calcified major coronary arteries detected' },
          { name: 'exang (angina)', value: 18.1, description: 'No exercise-induced angina symptoms' },
          { name: 'chol (cholesterol)', value: 11.4, description: 'Serum cholesterol within manageable clinical range' },
          { name: 'trestbps (resting BP)', value: 8.8, description: 'Resting blood pressure baseline' },
        ],
      }
    }
  ],
  neurological: [
    {
      id: 'PRED-2026-0902-N01',
      timestamp: '2026-09-02 08:30:45 UTC',
      sample_id: 'NEURO-001',
      disease_id: 'neurological',
      dataset_name: 'Oxford_Parkinsons_Acoustic_Cohort',
      model_used: 'Both (Compare)',
      prediction: 'High Risk (Tremor/Motor)',
      confidence: 95.2,
      quantum_score: 0.958,
      classical_score: 0.941,
      result: {
        id: 'PRED-2026-0902-N01',
        timestamp: '2026-09-02 08:30:45 UTC',
        sample_id: 'NEURO-001',
        disease_id: 'neurological',
        dataset_name: 'Oxford_Parkinsons_Acoustic_Cohort',
        model_used: 'Both (Compare)',
        prediction: 'High Risk (Tremor/Motor)',
        confidence: 95.2,
        quantum_score: 0.958,
        classical_score: 0.941,
        circuit_depth: 8,
        qubits_used: 4,
        execution_time_ms: 130,
        consensus_agreement: true,
        notes: 'Elevated Pitch Period Entropy (PPE: 0.285) and Non-linear Dynamical spread1 (-4.81) indicate significant vocal fold tremor and basal ganglia motor instability.',
        feature_importance: [
          { name: 'ppe (entropy)', value: 32.8, description: 'Pitch period entropy quantifying impaired phonation stability' },
          { name: 'spread1 (fundamental variation)', value: 25.4, description: 'Non-linear measure of fundamental frequency variation' },
          { name: 'rpde (recurrence)', value: 19.6, description: 'Recurrence period density entropy of vocal dynamics' },
          { name: 'mdvp_shimmer', value: 13.1, description: 'Cycle-to-cycle sound wave amplitude perturbation' },
          { name: 'mdvp_jitter_pct', value: 9.1, description: 'Frequency perturbation coefficient in sustained vowels' },
        ],
      }
    },
    {
      id: 'PRED-2026-0902-N02',
      timestamp: '2026-09-02 08:02:19 UTC',
      sample_id: 'NEURO-008',
      disease_id: 'neurological',
      dataset_name: 'Oxford_Parkinsons_Acoustic_Cohort',
      model_used: 'Quantum (VQC)',
      prediction: 'Low Risk (Healthy/Control)',
      confidence: 97.6,
      quantum_score: 0.976,
      classical_score: 0.938,
      result: {
        id: 'PRED-2026-0902-N02',
        timestamp: '2026-09-02 08:02:19 UTC',
        sample_id: 'NEURO-008',
        disease_id: 'neurological',
        dataset_name: 'Oxford_Parkinsons_Acoustic_Cohort',
        model_used: 'Quantum (VQC)',
        prediction: 'Low Risk (Healthy/Control)',
        confidence: 97.6,
        quantum_score: 0.976,
        classical_score: 0.938,
        circuit_depth: 8,
        qubits_used: 4,
        execution_time_ms: 88,
        consensus_agreement: true,
        notes: 'Harmonics-to-Noise Ratio (HNR: 30.94 dB) and minimal jitter (0.0024) confirm clean sustained phonation and healthy neuromuscular vocal control.',
        feature_importance: [
          { name: 'hnr (harmonic ratio)', value: 35.0, description: 'High harmonics-to-noise ratio confirming clear acoustic output' },
          { name: 'ppe (entropy)', value: 26.2, description: 'Minimal pitch period entropy indicating normal motor control' },
          { name: 'mdvp_jitter_abs', value: 18.5, description: 'Very low absolute frequency deviation across cycles' },
          { name: 'dfa (fractal scaling)', value: 12.1, description: 'Detrended fluctuation analysis within normal baseline' },
          { name: 'spread2', value: 8.2, description: 'Nonlinear fundamental frequency variation spread' },
        ],
      }
    }
  ]
};
