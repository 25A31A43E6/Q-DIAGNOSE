export interface WDBCRecord {
  id: string;
  diagnosis?: string;
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  symmetry_mean: number;
  fractal_dimension_mean: number;
  radius_se: number;
  texture_se: number;
  perimeter_se: number;
  area_se: number;
  smoothness_se: number;
  compactness_se: number;
  concavity_se: number;
  concave_points_se: number;
  symmetry_se: number;
  fractal_dimension_se: number;
  radius_worst: number;
  texture_worst: number;
  perimeter_worst: number;
  area_worst: number;
  smoothness_worst: number;
  compactness_worst: number;
  concavity_worst: number;
  concave_points_worst: number;
  symmetry_worst: number;
  fractal_dimension_worst: number;
}

export const SAMPLE_WDBC_CSV = `id,radius_mean,texture_mean,perimeter_mean,area_mean,smoothness_mean,compactness_mean,concavity_mean,concave_points_mean,symmetry_mean,fractal_dimension_mean,radius_worst,texture_worst,perimeter_worst,area_worst,smoothness_worst,compactness_worst,concavity_worst,concave_points_worst,symmetry_worst,fractal_dimension_worst
WDBC-842302,17.99,10.38,122.8,1001.0,0.1184,0.2776,0.3001,0.1471,0.2419,0.07871,25.38,17.33,184.6,2019.0,0.1622,0.6656,0.7119,0.2654,0.4601,0.11890
WDBC-842517,20.57,17.77,132.9,1326.0,0.08474,0.07864,0.0869,0.07017,0.1812,0.05667,24.99,23.41,158.8,1956.0,0.1238,0.1866,0.2416,0.1860,0.2750,0.08902
WDBC-843009,19.69,21.25,130.0,1203.0,0.1096,0.1599,0.1974,0.1279,0.2069,0.05999,23.57,25.53,152.5,1709.0,0.1444,0.4245,0.4504,0.2430,0.3613,0.08758
WDBC-843483,11.42,20.38,77.58,386.1,0.1425,0.2839,0.2414,0.1052,0.2597,0.09744,14.91,26.50,98.87,567.7,0.2098,0.8663,0.6869,0.2575,0.6638,0.17300
WDBC-843584,20.29,14.34,135.1,1297.0,0.1003,0.1328,0.1980,0.1043,0.1809,0.05883,22.54,16.67,152.2,1575.0,0.1374,0.2050,0.4000,0.1625,0.2364,0.07678
WDBC-843786,12.45,15.70,82.57,477.1,0.1278,0.1700,0.1578,0.08089,0.2087,0.07613,15.47,23.75,103.4,741.6,0.1791,0.5249,0.5355,0.1741,0.3985,0.12440
WDBC-844359,18.25,19.98,119.6,1040.0,0.09463,0.1090,0.1127,0.07400,0.1794,0.05742,22.88,27.66,153.2,1606.0,0.1442,0.2576,0.3784,0.1932,0.3063,0.08368
WDBC-844582,13.71,20.83,90.20,577.9,0.1189,0.1645,0.09366,0.05985,0.2196,0.07451,17.06,28.14,110.6,897.0,0.1654,0.3682,0.2678,0.1556,0.3196,0.11510
WDBC-844981,13.00,21.82,87.50,519.8,0.1273,0.1932,0.1859,0.09353,0.2350,0.07389,15.49,30.73,106.2,739.3,0.1703,0.5401,0.5390,0.2060,0.4378,0.10720
WDBC-845010,12.46,24.04,83.97,475.9,0.1186,0.2396,0.2273,0.08543,0.2030,0.08243,15.09,40.68,97.65,711.4,0.1853,1.0580,1.1050,0.2210,0.4366,0.20750
WDBC-8510426,13.54,14.36,87.46,566.3,0.09779,0.08129,0.06664,0.04781,0.1885,0.05766,15.11,19.26,99.70,711.2,0.1440,0.1773,0.2390,0.1288,0.2977,0.07259
WDBC-8510653,13.08,15.71,85.63,520.0,0.1075,0.1270,0.04568,0.03110,0.1967,0.06811,14.50,20.49,96.09,630.5,0.1312,0.2776,0.1890,0.07283,0.3184,0.08183
WDBC-8510824,9.504,12.44,60.34,273.9,0.1024,0.06492,0.02956,0.02076,0.1815,0.06905,10.23,15.66,65.13,314.9,0.1324,0.1148,0.08867,0.06227,0.2450,0.07773
WDBC-8511133,15.34,14.26,102.5,704.4,0.1073,0.2135,0.2077,0.09756,0.2521,0.07032,18.07,19.08,125.1,980.9,0.1390,0.5954,0.6305,0.2393,0.4667,0.09946`;

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
  fileName: string;
  rowCount: number;
}

export function parseCSV(csvText: string, fileName: string = 'wisconsin_breast_cancer_wdbc.csv'): ParsedCSV {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [], fileName, rowCount: 0 };
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length === headers.length) {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] !== undefined ? values[idx] : '';
      });
      rows.push(rowObj);
    }
  }

  return {
    headers,
    rows,
    fileName,
    rowCount: rows.length
  };
}

export const INITIAL_PREDICTIONS_HISTORY = [
  {
    id: 'PRED-2026-0901-01',
    timestamp: '2026-09-01 14:32:10 UTC',
    sample_id: 'WDBC-842302',
    dataset_name: 'WDBC_Clinical_Validation_v2.4',
    model_used: 'Both (Compare)',
    prediction: 'Malignant' as const,
    confidence: 96.8,
    quantum_score: 0.974,
    classical_score: 0.962,
    result: {
      id: 'PRED-2026-0901-01',
      timestamp: '2026-09-01 14:32:10 UTC',
      sample_id: 'WDBC-842302',
      dataset_name: 'WDBC_Clinical_Validation_v2.4',
      model_used: 'Both (Compare)',
      prediction: 'Malignant' as const,
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
    dataset_name: 'WDBC_Clinical_Validation_v2.4',
    model_used: 'Quantum (VQC)',
    prediction: 'Benign' as const,
    confidence: 98.4,
    quantum_score: 0.984,
    classical_score: 0.942,
    result: {
      id: 'PRED-2026-0901-02',
      timestamp: '2026-09-01 13:48:22 UTC',
      sample_id: 'WDBC-8510824',
      dataset_name: 'WDBC_Clinical_Validation_v2.4',
      model_used: 'Quantum (VQC)',
      prediction: 'Benign' as const,
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
  },
  {
    id: 'PRED-2026-0901-03',
    timestamp: '2026-09-01 11:15:04 UTC',
    sample_id: 'WDBC-843009',
    dataset_name: 'WDBC_PreScreen_CohortB',
    model_used: 'Both (Compare)',
    prediction: 'Malignant' as const,
    confidence: 94.2,
    quantum_score: 0.956,
    classical_score: 0.928,
    result: {
      id: 'PRED-2026-0901-03',
      timestamp: '2026-09-01 11:15:04 UTC',
      sample_id: 'WDBC-843009',
      dataset_name: 'WDBC_PreScreen_CohortB',
      model_used: 'Both (Compare)',
      prediction: 'Malignant' as const,
      confidence: 94.2,
      quantum_score: 0.956,
      classical_score: 0.928,
      circuit_depth: 8,
      qubits_used: 4,
      execution_time_ms: 135,
      consensus_agreement: true,
      notes: 'High nuclear irregularity with elevated area_worst and concave_points_worst.',
      feature_importance: [
        { name: 'concave_points_mean', value: 36.1, description: 'Concave contour points' },
        { name: 'perimeter_mean', value: 25.4, description: 'Mean nuclear contour perimeter' },
        { name: 'area_worst', value: 17.2, description: 'Largest nuclear area measurement' },
        { name: 'radius_worst', value: 12.0, description: 'Worst nuclear radius boundary' },
        { name: 'concavity_mean', value: 9.3, description: 'Severity of concave portions' },
      ],
    }
  },
  {
    id: 'PRED-2026-0901-04',
    timestamp: '2026-09-01 09:42:55 UTC',
    sample_id: 'WDBC-8510426',
    dataset_name: 'WDBC_Clinical_Validation_v2.4',
    model_used: 'Classical (Random Forest)',
    prediction: 'Benign' as const,
    confidence: 92.6,
    quantum_score: 0.941,
    classical_score: 0.926,
    result: {
      id: 'PRED-2026-0901-04',
      timestamp: '2026-09-01 09:42:55 UTC',
      sample_id: 'WDBC-8510426',
      dataset_name: 'WDBC_Clinical_Validation_v2.4',
      model_used: 'Classical (Random Forest)',
      prediction: 'Benign' as const,
      confidence: 92.6,
      quantum_score: 0.941,
      classical_score: 0.926,
      circuit_depth: 0,
      qubits_used: 0,
      execution_time_ms: 64,
      consensus_agreement: true,
      notes: 'Uniform nuclear membranes and low concavity.',
      feature_importance: [
        { name: 'area_mean', value: 29.8, description: 'Mean area measurement' },
        { name: 'radius_mean', value: 24.1, description: 'Mean cell radius' },
        { name: 'texture_mean', value: 18.6, description: 'Gray-scale standard deviation' },
        { name: 'perimeter_mean', value: 15.2, description: 'Perimeter measurement' },
        { name: 'smoothness_worst', value: 12.3, description: 'Worst smoothness variation' },
      ],
    }
  },
  {
    id: 'PRED-2026-0901-05',
    timestamp: '2026-08-31 18:20:14 UTC',
    sample_id: 'WDBC-843483',
    dataset_name: 'WDBC_Wisconsin_Archive',
    model_used: 'Quantum (VQC)',
    prediction: 'Malignant' as const,
    confidence: 95.1,
    quantum_score: 0.951,
    classical_score: 0.892,
    result: {
      id: 'PRED-2026-0901-05',
      timestamp: '2026-08-31 18:20:14 UTC',
      sample_id: 'WDBC-843483',
      dataset_name: 'WDBC_Wisconsin_Archive',
      model_used: 'Quantum (VQC)',
      prediction: 'Malignant' as const,
      confidence: 95.1,
      quantum_score: 0.951,
      classical_score: 0.892,
      circuit_depth: 8,
      qubits_used: 4,
      execution_time_ms: 110,
      consensus_agreement: true,
      notes: 'High compactness_worst and concavity detected via quantum feature encoding.',
      feature_importance: [
        { name: 'compactness_worst', value: 38.5, description: 'Worst nuclear compactness' },
        { name: 'fractal_dimension_worst', value: 22.4, description: 'Coastline approximation' },
        { name: 'concave_points_mean', value: 16.9, description: 'Concave contour points' },
        { name: 'concavity_worst', value: 12.1, description: 'Severity of contour depressions' },
        { name: 'smoothness_worst', value: 10.1, description: 'Worst smoothness measure' },
      ],
    }
  }
];

export const BENCHMARK_MODELS_DATA = [
  {
    model_name: 'Logistic Regression',
    type: 'classical' as const,
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
    type: 'classical' as const,
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
    type: 'classical' as const,
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
    type: 'quantum' as const,
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
    type: 'quantum' as const,
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
    type: 'quantum' as const,
    accuracy: 0.982,
    precision: 0.979,
    recall: 0.974,
    f1: 0.976,
    roc_auc: 0.997,
    train_time: '44.6s',
    inference_time: '9.8ms',
    notes: 'Parameterized ansatz circuit (RealAmplitudes + COBYLA optimizer) demonstrating superior non-linear boundary resolution.'
  }
];
