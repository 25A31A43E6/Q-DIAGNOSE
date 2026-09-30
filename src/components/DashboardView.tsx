import React from 'react';
import { 
  Activity, 
  Atom, 
  Cpu, 
  TrendingUp, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Sparkles,
  BarChart3,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Sliders,
  Check,
  Binary,
  HeartPulse,
  Brain,
  Globe2
} from 'lucide-react';
import { PredictionHistoryItem, DashboardStats, PredictionResult, DiseaseId } from '../types';
import { DISEASE_CONFIGS } from '../data/diseaseDatasets';
import { NavSection } from './Sidebar';

interface DashboardViewProps {
  stats: DashboardStats;
  history: PredictionHistoryItem[];
  selectedDisease: DiseaseId;
  onSelectPrediction: (prediction: PredictionResult) => void;
  onNavigate: (section: NavSection) => void;
  onLoadSample: () => void;
  onSelectDisease?: (disease: DiseaseId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  history,
  selectedDisease,
  onSelectPrediction,
  onNavigate,
  onLoadSample,
  onSelectDisease,
}) => {
  const diseaseConfig = DISEASE_CONFIGS[selectedDisease];
  const recentHistory = history.slice(0, 5);

  return (
    <div id="dashboard-view" className="space-y-8 max-w-7xl mx-auto">
      {/* Platform Multi-Disease Overview Summary Row */}
      <section 
        id="platform-overview-summary-row" 
        aria-label="Platform Multi-Disease Overview"
        className="bg-white rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Globe2 className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700">Platform Overview</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF9E7] text-[#9A7416] border border-[#F6E58D]">
                3 Supported Diseases
              </span>
            </div>
            <div className="text-sm font-extrabold text-[#0B1E3D] mt-0.5 flex items-center gap-2 font-sans">
              <span>Multi-Pathology Quantum Research Suite</span>
              <span className="text-xs font-mono font-normal text-slate-300">|</span>
              <span className="text-xs font-mono font-medium text-[#2D3748] opacity-80">
                1,067 Combined Cohort Samples • 65 Total Features
              </span>
            </div>
          </div>
        </div>

        {/* 3 Interactive Quick Disease Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {(['breast_cancer', 'cardiovascular', 'neurological'] as DiseaseId[]).map((dId) => {
            const config = DISEASE_CONFIGS[dId];
            const isCurrent = selectedDisease === dId;
            const Icon = dId === 'breast_cancer' ? Activity : dId === 'cardiovascular' ? HeartPulse : Brain;
            const activeStyle = 'bg-teal-600 text-white shadow-xs';
            const inactiveStyle = 'bg-white hover:bg-sky-50 text-[#2D3748] border border-[#DCE8F6]';

            return (
              <button
                key={dId}
                id={`btn-platform-overview-${dId}`}
                type="button"
                onClick={() => onSelectDisease && onSelectDisease(dId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isCurrent ? activeStyle : inactiveStyle
                }`}
                title={`Switch context to ${config.name}`}
              >
                <span>{config.shortName}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-sky-50 text-[#0B1E3D]'
                  }`}
                >
                  {config.recordsCount}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Research Disclaimer Banner */}
      <div id="research-disclaimer-banner" className="bg-white border border-[#DCE8F6] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-[#2D3748] shadow-sm shadow-sky-950/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
          <span>
            <strong className="text-[#0B1E3D]">Research Prototype:</strong> Designed for academic and hackathon evaluation — evaluated on {diseaseConfig.name}.
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#C59B27] font-bold shrink-0">
          {diseaseConfig.shortName} Cohort ({diseaseConfig.recordsCount} Samples)
        </span>
      </div>

      {/* Top Metric Summary Cards */}
      <section aria-label="Summary Metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Predictions */}
        <div id="stat-card-total-predictions" className="bg-white p-5 rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">Total Predictions Run</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#C59B27] font-mono tracking-tight">
                {stats.totalPredictions}
              </span>
              <span className="text-xs font-semibold text-teal-700 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5 text-teal-600" /> Active Session
              </span>
            </div>
            <p className="text-xs text-[#2D3748] opacity-80 mt-1 font-medium">Verified clinical research runs</p>
          </div>
        </div>

        {/* Metric 2: Average Accuracy (Classical vs Quantum) */}
        <div id="stat-card-accuracy-compare" className="bg-white p-5 rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">Avg Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Atom className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <span className="text-[#2D3748]">Classical RF: <span className="font-mono text-[#0B1E3D] font-bold">{stats.avgClassicalAccuracy}%</span></span>
              <span className="text-teal-700">Quantum VQC: <span className="font-mono text-[#C59B27] font-bold">{stats.avgQuantumAccuracy}%</span></span>
            </div>
            {/* Visual dual bar */}
            <div className="w-full bg-[#F4F8FA] h-2.5 rounded-full overflow-hidden flex gap-1 border border-[#DCE8F6]">
              <div 
                className="bg-slate-400 h-full rounded-l-full" 
                style={{ width: `${stats.avgClassicalAccuracy / 2}%` }}
                title={`Classical: ${stats.avgClassicalAccuracy}%`}
              ></div>
              <div 
                className="bg-teal-600 h-full rounded-r-full" 
                style={{ width: `${stats.avgQuantumAccuracy / 2}%` }}
                title={`Quantum: ${stats.avgQuantumAccuracy}%`}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-[#2D3748] opacity-85">
              <span>Baseline vs Quantum</span>
              <span className="font-bold text-[#9A7416] bg-[#FEF9E7] px-1.5 py-0.5 rounded border border-[#F6E58D]">
                +{(stats.avgQuantumAccuracy - stats.avgClassicalAccuracy).toFixed(1)}% Quantum Gain
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Reference Dataset Card */}
        <div id="stat-card-last-dataset" className="bg-white p-5 rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">Reference Dataset</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-bold text-[#0B1E3D] text-sm truncate font-mono" title={diseaseConfig.datasetName}>
              {diseaseConfig.shortName} ({diseaseConfig.recordsCount} Records)
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#2D3748]">
              <span className="bg-[#FEF9E7] border border-[#F6E58D] px-2 py-0.5 rounded text-[11px] font-mono text-[#9A7416] font-semibold">
                {diseaseConfig.featureCount} Clinical Features
              </span>
              <span className="text-teal-700 font-medium font-mono">14 Demo Samples</span>
            </div>
            <p className="text-[11px] text-[#2D3748] opacity-75 mt-1 truncate" title={diseaseConfig.datasetName}>
              {diseaseConfig.datasetName}
            </p>
          </div>
        </div>

        {/* Metric 4: Hilbert Space Mapping Card */}
        <div id="stat-card-quantum-advantage" className="bg-white p-5 rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">Hilbert Space Mapping</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF9E7] text-[#9A7416] flex items-center justify-center border border-[#F6E58D]">
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#C59B27] font-mono tracking-tight">
                {diseaseConfig.hilbertDimension}
              </span>
            </div>
            <p className="text-xs text-[#2D3748] opacity-85 mt-1 font-medium">
              {diseaseConfig.featureDimensionNote}
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Flow Diagram Card */}
      <section aria-label="System Architecture Flow" className="bg-white rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F6] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Binary className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B1E3D]">Hybrid Quantum-Classical Architecture ({diseaseConfig.name})</h2>
              <p className="text-xs text-[#2D3748] opacity-80">End-to-end data processing, parallel quantum/classical inference, and consensus voting</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            Pipeline v2.4
          </span>
        </div>

        {/* Horizontal Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative items-center">
          {/* Step 1: Raw Data */}
          <div className="p-4 rounded-2xl bg-white border border-[#DCE8F6] text-center space-y-1 relative shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 font-mono">Input</span>
            <div className="text-xs font-bold text-[#0B1E3D]">{diseaseConfig.shortName} Data</div>
            <div className="text-[11px] font-mono text-[#C59B27] font-bold">{diseaseConfig.featureCount} Clinical Features</div>
            <div className="text-[10px] text-[#2D3748] opacity-75 truncate">{diseaseConfig.name}</div>
          </div>

          {/* Step 2: Preprocessing */}
          <div className="p-4 rounded-2xl bg-sky-50/40 border border-[#DCE8F6] text-center space-y-1 relative shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 font-mono">Step 0</span>
            <div className="text-xs font-bold text-[#0B1E3D]">StandardScaler + PCA</div>
            <div className="text-[11px] font-mono text-teal-700 font-semibold">{diseaseConfig.featureCount}D → 4 Principal Components</div>
            <div className="text-[10px] text-[#2D3748] opacity-75">{diseaseConfig.pcaVariance} Preserved</div>
          </div>

          {/* Step 3: Parallel Inference (Stacked Classical + Quantum) */}
          <div className="p-3 rounded-2xl bg-teal-50/30 border border-teal-200 space-y-2 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 font-mono">Parallel Models</span>
            
            <div className="p-2 rounded-xl bg-white border border-[#DCE8F6] text-left">
              <div className="flex items-center justify-between text-xs font-bold text-[#0B1E3D]">
                <span>Random Forest</span>
                <span className="text-[10px] font-mono text-slate-500">100 Trees</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#DCE8F6] text-left">
              <div className="flex items-center justify-between text-xs font-bold text-teal-700">
                <span>VQC / QNN / QSVM</span>
                <span className="text-[10px] font-mono text-[#C59B27] font-bold">4 Qubits</span>
              </div>
            </div>
          </div>

          {/* Step 4: Joint Consensus Voting */}
          <div className="p-4 rounded-2xl bg-[#FEF9E7]/40 border border-[#F6E58D] text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7416] font-mono">Integration</span>
            <div className="text-xs font-bold text-[#0B1E3D]">Joint Decision Voting</div>
            <div className="text-[11px] font-mono text-[#C59B27] font-bold">Confidence Weighted</div>
            <div className="text-[10px] text-[#2D3748] opacity-75">Consensus & Discordance Check</div>
          </div>

          {/* Step 5: Output */}
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 font-mono">Output</span>
            <div className="text-xs font-bold text-[#0B1E3D]">Diagnostic Verdict</div>
            <div className="text-[11px] font-mono text-teal-700 font-semibold">{diseaseConfig.positiveLabel} / {diseaseConfig.negativeLabel}</div>
            <div className="text-[10px] text-[#2D3748] opacity-75">SHAP + State Sensitivity</div>
          </div>
        </div>
      </section>

      {/* Main Grid: Recent Activity List & Hybrid Pipeline Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Predictions Table (Last 5) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 overflow-hidden">
          <div className="p-5 border-b border-[#DCE8F6] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B1E3D]">Recent Prediction Activity</h2>
              <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">Last 5 evaluations run through the hybrid pipeline</p>
            </div>
            <button
              id="btn-view-all-upload"
              onClick={() => onNavigate('upload')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Upload New Sample</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table id="table-recent-predictions" className="w-full text-left text-xs">
              <thead className="bg-[#F4F8FA] text-[#2D3748] uppercase font-semibold text-[11px] border-b border-[#DCE8F6]">
                <tr>
                  <th className="px-5 py-3 text-[#0B1E3D]">Sample ID</th>
                  <th className="px-4 py-3 text-[#0B1E3D]">Model</th>
                  <th className="px-4 py-3 text-[#0B1E3D]">Diagnosis / Risk</th>
                  <th className="px-4 py-3 text-[#0B1E3D]">Confidence</th>
                  <th className="px-4 py-3 text-[#0B1E3D]">Quantum / Classical</th>
                  <th className="px-5 py-3 text-right text-[#0B1E3D]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8F6]">
                {recentHistory.map((item) => {
                  const isPositive = 
                    item.prediction === 'Malignant' || 
                    item.prediction === 'High Risk' || 
                    item.prediction.includes('High Risk');
                  return (
                    <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-[#0B1E3D]">
                        {item.sample_id}
                        <div className="text-[10px] text-[#2D3748] opacity-70 font-normal font-sans">{item.timestamp.split(' ')[0]}</div>
                      </td>
                      <td className="px-4 py-3.5 text-[#2D3748] font-medium">
                        <span className="px-2 py-0.5 rounded bg-white text-[#2D3748] text-[11px] border border-[#DCE8F6] font-mono">
                          {item.model_used.includes('Both') 
                            ? 'Hybrid (Both)' 
                            : item.model_used.includes('QNN')
                            ? 'Quantum QNN'
                            : item.model_used.includes('QSVM')
                            ? 'Quantum QSVM'
                            : item.model_used.includes('Quantum') 
                            ? 'Quantum VQC' 
                            : 'Random Forest'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isPositive
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {item.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#F4F8FA] border border-[#DCE8F6] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isPositive ? 'bg-red-500' : 'bg-teal-600'}`}
                              style={{ width: `${item.confidence}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-[#C59B27]">{item.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#2D3748]">
                        <span className="text-teal-700 font-semibold">Q: {(item.quantum_score * 100).toFixed(1)}%</span>
                        <span className="text-slate-300 mx-1">|</span>
                        <span className="text-[#2D3748]">C: {(item.classical_score * 100).toFixed(1)}%</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          id={`btn-inspect-${item.id}`}
                          onClick={() => onSelectPrediction(item.result)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-teal-700 font-semibold text-[11px] transition-colors inline-flex items-center gap-1 border border-[#DCE8F6] cursor-pointer shadow-xs"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3 text-teal-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quantum-Classical Pipeline Architecture Card */}
        <div className="bg-white rounded-3xl border border-[#DCE8F6] shadow-sm shadow-sky-950/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F6] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200">
                  <Layers className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B1E3D]">Hybrid Pipeline Steps</h3>
                  <p className="text-[11px] text-[#2D3748] opacity-75">{diseaseConfig.shortName} Feature Mapping</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FEF9E7] text-[#9A7416] border border-[#F6E58D] font-bold">
                Consensus 98.6%
              </span>
            </div>

            <div className="space-y-3 text-xs text-[#2D3748]">
              {/* Step 0: Classical Preprocessing */}
              <div className="p-3 rounded-2xl bg-white border border-[#DCE8F6]">
                <div className="font-bold text-[#0B1E3D] flex items-center justify-between mb-1">
                  <span>0. Classical Preprocessing</span>
                  <span className="text-[10px] font-mono text-teal-700 font-semibold">StandardScaler + PCA</span>
                </div>
                <p className="text-[11px] text-[#2D3748] opacity-80">
                  StandardScaler + PCA reduces {diseaseConfig.featureCount} {diseaseConfig.shortName} features down to 4 principal components before quantum encoding.
                </p>
              </div>

              {/* Step 1: Quantum State Tomography */}
              <div className="p-3 rounded-2xl bg-white border border-[#DCE8F6]">
                <div className="font-bold text-[#0B1E3D] flex items-center justify-between mb-1">
                  <span>1. Quantum State Tomography</span>
                  <span className="text-[10px] font-mono text-[#C59B27] font-bold">ZZFeatureMap</span>
                </div>
                <p className="text-[11px] text-[#2D3748] opacity-80">
                  Encodes 4 principal components into a 4-qubit parameterized state space for non-linear Hilbert kernel separation.
                </p>
              </div>

              {/* Step 2: Classical Ensemble */}
              <div className="p-3 rounded-2xl bg-white border border-[#DCE8F6]">
                <div className="font-bold text-[#0B1E3D] flex items-center justify-between mb-1">
                  <span>2. Classical Ensemble</span>
                  <span className="text-[10px] font-mono text-[#C59B27] font-bold">Random Forest</span>
                </div>
                <p className="text-[11px] text-[#2D3748] opacity-80">
                  Runs 100 Gini-impurity decision trees on bootstrap subsets for high-variance stabilization and explainability.
                </p>
              </div>

              {/* Step 3: Joint Decision Voting */}
              <div className="p-3 rounded-2xl bg-white border border-[#DCE8F6]">
                <div className="font-bold text-[#0B1E3D] flex items-center justify-between mb-1">
                  <span>3. Joint Decision Voting</span>
                  <span className="text-[10px] font-mono text-teal-700 font-bold">Confidence Weighted</span>
                </div>
                <p className="text-[11px] text-[#2D3748] opacity-80">
                  Cross-validates quantum expectation values with classical tree entropy to eliminate false negatives in early stage screening.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#DCE8F6] flex items-center justify-between gap-3">
            <button
              id="btn-quick-benchmark-dash"
              onClick={() => onNavigate('benchmark')}
              className="flex-1 py-2.5 px-3 rounded-xl border border-[#DCE8F6] hover:bg-sky-50 text-[#0B1E3D] font-semibold text-xs text-center transition-colors cursor-pointer shadow-xs"
            >
              Model Benchmarks
            </button>
            <button
              id="btn-quick-upload-dash"
              onClick={() => onNavigate('upload')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs text-center transition-colors shadow-sm cursor-pointer"
            >
              Run Prediction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
