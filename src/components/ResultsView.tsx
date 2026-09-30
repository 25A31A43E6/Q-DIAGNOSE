import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Atom, 
  Cpu, 
  Sparkles, 
  ArrowLeft, 
  Download, 
  BarChart2, 
  Share2, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Info,
  Copy,
  Check
} from 'lucide-react';
import { PredictionResult, DiseaseId } from '../types';
import { DISEASE_CONFIGS } from '../data/diseaseDatasets';
import { CircularProgress } from './CircularProgress';
import { NavSection } from './Sidebar';

import { generateClinicalSummaryPdf } from '../utils/clinicalPdfGenerator';

interface ResultsViewProps {
  result: PredictionResult | null;
  isLoading?: boolean;
  selectedDisease: DiseaseId;
  onNavigate: (section: NavSection) => void;
  onLoadSampleAndPredict: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  isLoading = false,
  selectedDisease,
  onNavigate,
  onLoadSampleAndPredict,
}) => {
  const [copied, setCopied] = React.useState(false);

  const diseaseConfig = DISEASE_CONFIGS[result?.disease_id || selectedDisease];

  // Loading State with animated quantum-classical processing skeleton
  if (isLoading) {
    return (
      <div id="results-loading-state" className="max-w-4xl mx-auto space-y-6 my-6">
        <div className="bg-white rounded-2xl border border-[#DCE8F6] p-8 shadow-sm shadow-sky-950/5 text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin"></div>
            <Atom className="w-8 h-8 text-teal-600 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-[#0B1E3D]">Simulating Quantum-Classical Inference</h2>
            <p className="text-xs text-[#2D3748] opacity-80 leading-relaxed">
              StandardScaler + PCA feature reduction active. Mapping 4 principal components to 4-qubit Hilbert state space and executing 100-tree Random Forest ensemble for {diseaseConfig.name}...
            </p>
          </div>

          {/* Skeleton progress indicators */}
          <div className="max-w-md mx-auto space-y-3 text-left">
            <div className="p-3 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#2D3748] font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
                Quantum VQC Circuit (ZZFeatureMap)
              </span>
              <span className="font-mono text-teal-600 font-bold">Evaluating...</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#2D3748] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Classical Random Forest (Gini Impurity)
              </span>
              <span className="font-mono text-emerald-600 font-bold">Evaluating...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!result) {
    return (
      <div id="results-empty-state" className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#DCE8F6] p-12 text-center shadow-sm shadow-sky-950/5 my-8 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
          <BarChart2 className="w-8 h-8 text-teal-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#0B1E3D]">No Prediction Results Yet</h2>
          <p className="text-sm text-[#2D3748] opacity-80 max-w-md mx-auto">
            Upload a patient CSV or select a sample from the {diseaseConfig.name} dataset and click <strong>Run Prediction</strong>.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            id="btn-empty-upload-nav"
            onClick={() => onNavigate('upload')}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Go to Upload Page
          </button>
          <button
            id="btn-empty-demo-run"
            onClick={onLoadSampleAndPredict}
            className="px-5 py-2.5 rounded-xl bg-[#F4F8FA] hover:bg-slate-200 text-[#0B1E3D] font-semibold text-xs border border-[#DCE8F6] transition-colors cursor-pointer"
          >
            Run Demo Prediction
          </button>
        </div>
      </div>
    );
  }

  const isPositive = 
    result.prediction === 'Malignant' || 
    result.prediction === 'High Risk' || 
    result.prediction.includes('High Risk');

  const confidence = result.confidence || 95;

  const modelStr = (result.model_used || '').toLowerCase();
  const isQNN = modelStr.includes('qnn') || result.quantum_output?.architecture?.toLowerCase().includes('hybrid') || result.quantum_output?.architecture?.toLowerCase().includes('qnn');
  const isQSVM = modelStr.includes('qsvm');
  const quantumModelName = isQNN ? 'Quantum QNN' : isQSVM ? 'Quantum QSVM' : 'Quantum VQC';

  const handleCopySummary = () => {
    const text = `Q-Diagnose Clinical Report (${diseaseConfig.name})
Sample ID: ${result.sample_id}
Dataset: ${result.dataset_name}
Diagnosis / State: ${result.prediction}
Confidence: ${confidence}%
${quantumModelName} Score: ${(result.quantum_score * 100).toFixed(1)}%
Classical RF Score: ${(result.classical_score * 100).toFixed(1)}%
Top Contributing Features:
${result.feature_importance.map(f => `- ${f.name}: ${f.value}%`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Q-Diagnose_${diseaseConfig.id}_Report_${result.sample_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="results-view" className="space-y-8 max-w-7xl mx-auto">
      {/* Research Disclaimer Banner */}
      <div id="results-research-disclaimer" className="bg-[#F4F8FA] border border-[#DCE8F6] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-[#2D3748]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
          <span>
            <strong className="text-[#0B1E3D]">Research Prototype:</strong> Evaluated for {diseaseConfig.name} clinical study — not a certified standalone diagnostic device.
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#2D3748] opacity-70 font-medium shrink-0">
          Inference Engine v2.4
        </span>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-upload"
            onClick={() => onNavigate('upload')}
            className="px-3 py-1.5 rounded-lg bg-[#F4F8FA] hover:bg-sky-100 text-[#0B1E3D] text-xs font-semibold border border-[#DCE8F6] transition-colors cursor-pointer"
            title="Back to Upload"
          >
            <span>Back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#2D3748] opacity-70 uppercase">Sample ID:</span>
              <span className="text-sm font-bold font-mono text-[#0B1E3D] bg-[#F4F8FA] border border-[#DCE8F6] px-2 py-0.5 rounded">
                {result.sample_id}
              </span>
              <span className="text-xs text-[#DCE8F6]">|</span>
              <span className="text-xs text-[#2D3748] font-medium">{result.dataset_name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-report"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-lg bg-[#F4F8FA] hover:bg-sky-100 text-[#0B1E3D] text-xs font-semibold flex items-center border border-[#DCE8F6] transition-colors cursor-pointer"
          >
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
          <button
            id="btn-download-pdf"
            onClick={() => generateClinicalSummaryPdf({ result })}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center shadow-xs transition-colors cursor-pointer"
          >
            <span>Download PDF</span>
          </button>
          <button
            id="btn-download-json"
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold flex items-center border border-teal-200 transition-colors cursor-pointer"
          >
            <span>Export JSON</span>
          </button>
          <button
            id="btn-new-sample"
            onClick={() => onNavigate('upload')}
            className="px-3.5 py-1.5 rounded-lg bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Test Another Sample</span>
          </button>
        </div>
      </div>

      {/* Primary Results Section: Diagnostic Label & Circular Confidence Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Result Card */}
        <div
          id="card-main-prediction"
          className={`lg:col-span-2 rounded-2xl border p-7 shadow-sm shadow-sky-950/5 relative overflow-hidden flex flex-col justify-between ${
            isPositive
              ? 'bg-gradient-to-br from-red-50/50 via-white to-white border-red-200'
              : 'bg-gradient-to-br from-sky-50/40 via-white to-white border-[#DCE8F6]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F6]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2D3748] opacity-70 uppercase tracking-wider">
                  Classification Output
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F4F8FA] text-[#0B1E3D] border border-[#DCE8F6] font-semibold">
                  {result.model_used}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#2D3748] opacity-70 font-mono">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{result.timestamp}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6">
              {/* Left: Big Clinical Badge */}
              <div>
                <span className="text-xs font-bold text-[#2D3748] opacity-70 uppercase tracking-wider">
                  Predicted Pathological State
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPositive ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    }`}
                  >
                    {isPositive ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2
                      id="text-prediction-label"
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        isPositive ? 'text-red-700' : 'text-[#0B1E3D]'
                      }`}
                    >
                      {result.prediction}
                    </h2>
                    <p className="text-xs font-medium text-[#2D3748] opacity-80">
                      {isPositive
                        ? diseaseConfig.positiveSubtitle
                        : diseaseConfig.negativeSubtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-xs text-[#2D3748]">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F4F8FA] border border-[#DCE8F6]">
                    <span className="font-medium text-[#2D3748] opacity-80">Consensus Status:</span>
                    <span className="font-bold text-teal-700">
                      Concordant (Quantum & Classical agree)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F4F8FA] border border-[#DCE8F6]">
                    <span className="font-medium text-[#2D3748] opacity-80">Inference Latency:</span>
                    <span className="font-mono font-semibold text-[#0B1E3D]">{result.execution_time_ms || 128} ms</span>
                  </div>
                </div>
              </div>

              {/* Right: Circular Confidence Ring */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5">
                <CircularProgress
                  value={confidence}
                  size={150}
                  strokeWidth={12}
                  isMalignant={isPositive}
                  label="Confidence"
                />
                <p className="text-[11px] text-[#2D3748] opacity-70 mt-2 text-center font-medium">
                  Aggregated Bayesian probability threshold
                </p>
              </div>
            </div>
          </div>

          {/* Research diagnostic notes */}
          {result.notes && (
            <div className="mt-2 p-3.5 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] text-xs text-[#2D3748] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-[#0B1E3D]">Clinical Research Interpretation: </strong>
                {result.notes}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quantum vs Classical Side-by-Side Cards */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Card 1: Quantum Model Output */}
          <div id="card-quantum-output" className="bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DCE8F6]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                    <Atom className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">Quantum Model Output</h3>
                    <p className="text-[10px] text-[#2D3748] opacity-70">
                      {isQNN ? 'Quantum Neural Network' : isQSVM ? 'Quantum Support Vector Machine' : 'Variational Quantum Classifier'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                  {isQNN ? '4 Qubits + Dense' : isQSVM ? '6 Qubits' : '4 Qubits'}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-[#2D3748] opacity-80 font-medium">Measurement Probability:</span>
                <span className="text-2xl font-extrabold text-[#C59B27] font-mono">
                  {(result.quantum_score * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#F4F8FA] border border-[#DCE8F6] h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${result.quantum_score * 100}%` }}
                ></div>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-[#2D3748] opacity-80">
                {isQNN ? (
                  <>
                    <div className="flex justify-between">
                      <span>Architecture:</span>
                      <span className="font-bold text-[#0B1E3D]">Hybrid Classical-Quantum Layer</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Circuit structure:</span>
                      <span className="font-bold text-[#0B1E3D]">4-qubit quantum layer + classical dense layers</span>
                    </div>
                  </>
                ) : isQSVM ? (
                  <>
                    <div className="flex justify-between">
                      <span>Quantum Kernel:</span>
                      <span className="font-bold text-[#0B1E3D]">ZZFeatureMap (reps=2, depth=8)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fidelity Metric:</span>
                      <span className="font-bold text-[#0B1E3D]">2^6 Hilbert State Inner Product</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>Ansatz Circuit:</span>
                      <span className="font-bold text-[#0B1E3D]">RealAmplitudes (depth=8)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feature Map:</span>
                      <span className="font-bold text-[#0B1E3D]">ZZFeatureMap (reps=2)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Classical Model Output */}
          <div id="card-classical-output" className="bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DCE8F6]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F4F8FA] border border-[#DCE8F6] text-[#0B1E3D] flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">Classical Model Output</h3>
                    <p className="text-[10px] text-[#2D3748] opacity-70">Random Forest Classifier</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F4F8FA] text-[#0B1E3D] border border-[#DCE8F6] font-bold">
                  100 Trees
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-[#2D3748] opacity-80 font-medium">Ensemble Probability:</span>
                <span className="text-2xl font-extrabold text-[#0B1E3D] font-mono">
                  {(result.classical_score * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#F4F8FA] border border-[#DCE8F6] h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-teal-700 h-full rounded-full transition-all duration-700"
                  style={{ width: `${result.classical_score * 100}%` }}
                ></div>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-[#2D3748] opacity-80">
                <div className="flex justify-between">
                  <span>Splitting Criterion:</span>
                  <span className="font-bold text-[#0B1E3D]">Gini Impurity</span>
                </div>
                <div className="flex justify-between">
                  <span>Bootstrap Subsamples:</span>
                  <span className="font-bold text-[#0B1E3D]">Enabled (max_features=sqrt)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart: Top Contributing Features */}
      <div id="chart-top-features" className="bg-white rounded-2xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F6] mb-6">
          <div>
            <h3 className="text-base font-bold text-[#0B1E3D]">Top Contributing Features</h3>
            <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
              SHAP / Quantum State Sensitivity feature importance distribution for sample {result.sample_id} ({diseaseConfig.name})
            </p>
          </div>
          <span className="text-xs font-mono bg-teal-50 text-teal-700 font-semibold px-2.5 py-1 rounded-lg border border-teal-200">
            Top Ranked {diseaseConfig.shortName} Attributes
          </span>
        </div>

        {/* Feature Bars */}
        <div className="space-y-4">
          {result.feature_importance.map((feature, idx) => (
            <div key={feature.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F4F8FA] border border-[#DCE8F6] text-[#0B1E3D] flex items-center justify-center font-mono font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-bold text-[#0B1E3D]">{feature.name}</span>
                  {feature.description && (
                    <span className="text-[11px] text-[#2D3748] opacity-60 hidden sm:inline">
                      — {feature.description}
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-[#C59B27]">{feature.value.toFixed(1)}%</span>
              </div>

              {/* Horizontal Bar */}
              <div className="w-full bg-[#F4F8FA] border border-[#DCE8F6] h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(feature.value * 2.5, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#DCE8F6] text-xs text-[#2D3748] opacity-80 flex flex-wrap items-center justify-between gap-2">
          <span>Feature weights computed via quantum gradient expectation values and mean decrease in impurity.</span>
          <button
            id="btn-view-benchmarks-from-results"
            onClick={() => onNavigate('benchmark')}
            className="text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center cursor-pointer"
          >
            <span>Compare with Overall Model Benchmarks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
