import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  GitBranch, 
  Sparkles, 
  Check, 
  Sliders, 
  Zap, 
  Binary, 
  FileCode, 
  Activity
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { BlochSphereVisualizer } from './BlochSphereVisualizer';

interface QuantumPipelineExplainerProps {
  lang?: SupportedLanguage;
}

export const QuantumPipelineExplainer: React.FC<QuantumPipelineExplainerProps> = ({ lang = 'en' }) => {
  const [activeStage, setActiveStage] = useState<number>(3); // 0 to 7
  const [copiedQasm, setCopiedQasm] = useState(false);
  const [thetaParam, setThetaParam] = useState<number>(1.25); // radians
  const [phiParam, setPhiParam] = useState<number>(0.84); // radians

  const pipelineStages = [
    {
      id: 0,
      title: '1. Patient Data Ingestion',
      subtitle: 'Biometric, acoustic & clinical inputs',
      icon: Activity,
      details: 'Continuous biometric parameters (e.g. resting BP, acoustic vocal jitter, cellular concavity) are validated against clinical range boundaries.',
      tech: 'JSON Schema Validation, Outlier Clipping'
    },
    {
      id: 1,
      title: '2. Preprocessing & Normalization',
      subtitle: 'Zero-mean & Unit-variance scaling',
      icon: Binary,
      details: 'Features are scaled into [0, 2π] phase domain appropriate for quantum angle encoding, preventing saturation in quantum Hilbert state space.',
      tech: 'MinMaxScaler, RobustScaler, Box-Cox'
    },
    {
      id: 2,
      title: '3. Classical Feature Extraction',
      subtitle: 'Dimensionality reduction to 4 components',
      icon: Layers,
      details: 'Principal Component Analysis (PCA) maps 30+ multi-dimensional clinical measurements down to 4 orthogonal principal components preserving >92.4% variance.',
      tech: 'PCA (n_components=4), SVD'
    },
    {
      id: 3,
      title: '4. Quantum Feature Mapping',
      subtitle: 'ZZFeatureMap into 4-Qubit Hilbert Space',
      icon: Zap,
      details: 'Encodes classical vector into an exponentially large 2^4 = 16-dimensional quantum Hilbert state space using second-order Pauli expansion with entangling ZZ gates.',
      tech: 'Qiskit ZZFeatureMap (reps=2, entanglement="linear")'
    },
    {
      id: 4,
      title: '5. Parameterized Variational Circuit',
      subtitle: 'RealAmplitudes Ansatz (depth=8)',
      icon: Cpu,
      details: 'Trainable rotation gates Ry(θ) and alternating CNOT gates optimize quantum state vector weights via classical gradient descent with parameter-shift rules.',
      tech: 'RealAmplitudes, ParameterShiftGradient'
    },
    {
      id: 5,
      title: '6. Classical Machine Learning',
      subtitle: 'Random Forest 100-Tree Ensemble',
      icon: GitBranch,
      details: 'Independent parallel classical model computes decision trees based on Gini impurity for benchmark comparison and consensus validation.',
      tech: 'RandomForestClassifier (n_estimators=100)'
    },
    {
      id: 6,
      title: '7. Hybrid Consensus & Tomography',
      subtitle: 'Quantum-Classical Concordance Check',
      icon: Sparkles,
      details: 'Simulated quantum Pauli-Z expectation values are ensembled with classical forest probabilities to compute concordance confidence and eliminate false positives.',
      tech: 'Ensemble Tomography, Concordance Metric'
    },
    {
      id: 7,
      title: '8. Structured Risk-Level Output',
      subtitle: 'Low / Moderate / High Risk Card',
      icon: Check,
      details: 'Translates raw continuous probabilities into human-understandable clinical risk bands with feature attribution explanations and guidance.',
      tech: 'Calibrated Risk Scoring, Explainable AI'
    }
  ];

  // Dynamic OpenQASM 2.0 representation based on parameters
  const qasmCode = `// Qiskit Aer OpenQASM 2.0 Representation
// Q-Diagnose 4-Qubit Hybrid VQC Classifier
OPENQASM 2.0;
include "qelib1.inc";

qreg q[4];
creg c[4];

// Stage 1: State Superposition
h q[0];
h q[1];
h q[2];
h q[3];

// Stage 2: ZZFeatureMap Data Encoding
rz(${thetaParam.toFixed(3)}) q[0];
rz(${phiParam.toFixed(3)}) q[1];
rz(0.482) q[2];
rz(1.024) q[3];

cx q[0], q[1];
rz(${((thetaParam * phiParam) % 3.14).toFixed(3)}) q[1];
cx q[0], q[1];

cx q[1], q[2];
rz(0.712) q[2];
cx q[1], q[2];

cx q[2], q[3];
rz(0.935) q[3];
cx q[2], q[3];

// Stage 3: RealAmplitudes Variational Ansatz (depth=2 shown)
ry(${thetaParam.toFixed(3)}) q[0];
ry(${phiParam.toFixed(3)}) q[1];
ry(0.551) q[2];
ry(1.230) q[3];

cx q[0], q[1];
cx q[1], q[2];
cx q[2], q[3];

// Stage 4: Quantum Measurement
measure q[0] -> c[0];
measure q[1] -> c[1];
measure q[2] -> c[2];
measure q[3] -> c[3];`;

  const handleCopyQasm = () => {
    navigator.clipboard.writeText(qasmCode);
    setCopiedQasm(true);
    setTimeout(() => setCopiedQasm(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            System Architecture
          </span>
          <span className="text-xs font-mono text-slate-400">Qiskit Aer • 4-Qubit VQC</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1E3D] tracking-tight">
          Hybrid Quantum-AI Pipeline Explainer
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
          Visualizing how Q-Diagnose bridges clinical biometric observations with quantum Hilbert-space kernel mappings and classical tree ensembles for high-fidelity early risk screening.
        </p>
      </div>

      {/* Horizontal Stage Stepper Bar */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer flex-1 text-center ${
                  isActive 
                    ? 'bg-teal-50 border border-teal-300 shadow-xs' 
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                  isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[11px] font-bold leading-tight ${
                  isActive ? 'text-teal-900' : 'text-slate-600'
                }`}>
                  Step {idx + 1}
                </span>
                <span className="text-[10px] text-slate-400 truncate w-full">
                  {stage.title.split('. ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Card */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Active Stage Focus: Step {activeStage + 1} of 8
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E3D] mt-1">
              {pipelineStages[activeStage].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {pipelineStages[activeStage].subtitle}
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            {pipelineStages[activeStage].tech}
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {pipelineStages[activeStage].details}
        </p>

        {/* Stage specific visualization */}
        {activeStage === 3 || activeStage === 4 ? (
          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 text-xs text-teal-950">
            <strong>Hilbert Space Advantage:</strong> While classical linear SVMs struggle with overlapping non-linear clinical metrics, the 4-qubit ZZFeatureMap maps vectors into a 16-dimensional complex Hilbert space where non-linear boundaries become linearly separable.
          </div>
        ) : null}
      </div>

      {/* Interactive Qiskit Quantum Circuit Diagram */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1E3D] text-white flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B1E3D]">
                Interactive Qiskit Quantum Circuit (4 Qubits)
              </h2>
              <p className="text-xs text-slate-500">
                Visualizing Hadamard gates (H), parametric rotations Rz(θ), and entangling CNOT gates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyQasm}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              <span>{copiedQasm ? 'Copied QASM!' : 'Copy OpenQASM'}</span>
            </button>
          </div>
        </div>

        {/* Visual Circuit Canvas with Wire Lines */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 overflow-x-auto shadow-inner border border-slate-800 font-mono text-xs select-none">
          <div className="min-w-[640px] space-y-6 py-2">
            {/* Qubit 0 */}
            <div className="flex items-center gap-3">
              <span className="w-12 text-teal-400 font-bold">q[0]:</span>
              <div className="flex-1 flex items-center relative">
                <div className="absolute inset-x-0 h-0.5 bg-slate-700 z-0" />
                <div className="relative z-10 flex items-center gap-5 pl-4">
                  <div className="w-8 h-8 rounded bg-teal-500 text-slate-950 font-bold flex items-center justify-center shadow">H</div>
                  <div className="w-12 h-8 rounded bg-sky-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Rz(θ₁)</div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-slate-900 mx-2" title="CNOT Control" />
                  <div className="w-12 h-8 rounded bg-indigo-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Ry(w₁)</div>
                  <div className="w-8 h-8 rounded bg-rose-600 text-white font-bold flex items-center justify-center shadow ml-12">M₀</div>
                </div>
              </div>
            </div>

            {/* Qubit 1 */}
            <div className="flex items-center gap-3">
              <span className="w-12 text-teal-400 font-bold">q[1]:</span>
              <div className="flex-1 flex items-center relative">
                <div className="absolute inset-x-0 h-0.5 bg-slate-700 z-0" />
                <div className="relative z-10 flex items-center gap-5 pl-4">
                  <div className="w-8 h-8 rounded bg-teal-500 text-slate-950 font-bold flex items-center justify-center shadow">H</div>
                  <div className="w-12 h-8 rounded bg-sky-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Rz(θ₂)</div>
                  <div className="w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center" title="CNOT Target">⊕</div>
                  <div className="w-12 h-8 rounded bg-indigo-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Ry(w₂)</div>
                  <div className="w-8 h-8 rounded bg-rose-600 text-white font-bold flex items-center justify-center shadow ml-12">M₁</div>
                </div>
              </div>
            </div>

            {/* Qubit 2 */}
            <div className="flex items-center gap-3">
              <span className="w-12 text-teal-400 font-bold">q[2]:</span>
              <div className="flex-1 flex items-center relative">
                <div className="absolute inset-x-0 h-0.5 bg-slate-700 z-0" />
                <div className="relative z-10 flex items-center gap-5 pl-4">
                  <div className="w-8 h-8 rounded bg-teal-500 text-slate-950 font-bold flex items-center justify-center shadow">H</div>
                  <div className="w-12 h-8 rounded bg-sky-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Rz(θ₃)</div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-slate-900 mx-2" title="CNOT Control" />
                  <div className="w-12 h-8 rounded bg-indigo-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Ry(w₃)</div>
                  <div className="w-8 h-8 rounded bg-rose-600 text-white font-bold flex items-center justify-center shadow ml-12">M₂</div>
                </div>
              </div>
            </div>

            {/* Qubit 3 */}
            <div className="flex items-center gap-3">
              <span className="w-12 text-teal-400 font-bold">q[3]:</span>
              <div className="flex-1 flex items-center relative">
                <div className="absolute inset-x-0 h-0.5 bg-slate-700 z-0" />
                <div className="relative z-10 flex items-center gap-5 pl-4">
                  <div className="w-8 h-8 rounded bg-teal-500 text-slate-950 font-bold flex items-center justify-center shadow">H</div>
                  <div className="w-12 h-8 rounded bg-sky-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Rz(θ₄)</div>
                  <div className="w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center" title="CNOT Target">⊕</div>
                  <div className="w-12 h-8 rounded bg-indigo-600 text-white font-bold flex items-center justify-center shadow px-1 text-[10px]">Ry(w₄)</div>
                  <div className="w-8 h-8 rounded bg-rose-600 text-white font-bold flex items-center justify-center shadow ml-12">M₃</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-teal-500" /> Hadamard (H)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-sky-600" /> Feature Angle Rz(θ)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Entangling CNOT (CX)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-600" /> Ansatz Weights Ry(w)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-600" /> Measurement</span>
          </div>
        </div>

        {/* Live Parameter Tuner */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Interactive Quantum Parameter Tuner:
              </h3>
            </div>
            <span className="text-xs text-slate-500">Live QASM update</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Rotation Angle θ₁:</span>
                <span className="font-mono text-teal-700 font-bold">{thetaParam.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.14"
                step="0.05"
                value={thetaParam}
                onChange={e => setThetaParam(parseFloat(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Rotation Angle θ₂:</span>
                <span className="font-mono text-teal-700 font-bold">{phiParam.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.14"
                step="0.05"
                value={phiParam}
                onChange={e => setPhiParam(parseFloat(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* OpenQASM Code Viewer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-teal-600" />
              <span>Exportable OpenQASM 2.0 Code:</span>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-xs font-mono border border-slate-800 max-h-56">
            <code>{qasmCode}</code>
          </pre>
        </div>
      </div>

      {/* Interactive 4-Qubit Bloch Sphere Visualizer */}
      <BlochSphereVisualizer />
    </div>
  );
};
