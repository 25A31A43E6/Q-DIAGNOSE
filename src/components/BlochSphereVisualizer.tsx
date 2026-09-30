import React, { useState } from 'react';

interface QubitState {
  theta: number; // 0 to PI
  phi: number;   // 0 to 2*PI
  name: string;
  role: string;
}

export const BlochSphereVisualizer: React.FC = () => {
  const [activeQubitIdx, setActiveQubitIdx] = useState<number>(0);
  const [qubits, setQubits] = useState<QubitState[]>([
    { theta: 1.25, phi: 0.84, name: 'q[0]', role: 'Feature Dimension 1 (Biometric Concavity)' },
    { theta: 0.95, phi: 1.57, name: 'q[1]', role: 'Feature Dimension 2 (Acoustic Jitter)' },
    { theta: 2.10, phi: 3.14, name: 'q[2]', role: 'Feature Dimension 3 (Resting Blood Pressure)' },
    { theta: 0.50, phi: 0.00, name: 'q[3]', role: 'Feature Dimension 4 (Heart Rate Variability)' },
  ]);

  const currentQubit = qubits[activeQubitIdx];
  const theta = currentQubit.theta;
  const phi = currentQubit.phi;

  // Update current qubit theta & phi
  const updateCurrentQubit = (newTheta: number, newPhi: number) => {
    // normalize phi to [0, 2*PI)
    const normPhi = ((newPhi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    // clamp theta to [0, PI]
    const clampedTheta = Math.max(0, Math.min(Math.PI, newTheta));

    setQubits(prev => prev.map((q, i) => i === activeQubitIdx ? { ...q, theta: clampedTheta, phi: normPhi } : q));
  };

  // Quantum gate applications
  const applyHadamard = () => {
    // If currently |0>, goes to |+> (theta = PI/2, phi = 0)
    // If currently |1>, goes to |-> (theta = PI/2, phi = PI)
    if (theta < 0.2) {
      updateCurrentQubit(Math.PI / 2, 0);
    } else if (theta > Math.PI - 0.2) {
      updateCurrentQubit(Math.PI / 2, Math.PI);
    } else {
      updateCurrentQubit(Math.PI / 2, 0);
    }
  };

  const applyPauliX = () => {
    // Bit flip: theta -> PI - theta, phi -> -phi
    updateCurrentQubit(Math.PI - theta, -phi);
  };

  const applyPauliY = () => {
    // Bit & Phase flip: theta -> PI - theta, phi -> PI - phi
    updateCurrentQubit(Math.PI - theta, Math.PI - phi);
  };

  const applyPauliZ = () => {
    // Phase flip: phi -> phi + PI
    updateCurrentQubit(theta, phi + Math.PI);
  };

  const applySGate = () => {
    // S gate: phi -> phi + PI/2
    updateCurrentQubit(theta, phi + Math.PI / 2);
  };

  const applyTGate = () => {
    // T gate: phi -> phi + PI/4
    updateCurrentQubit(theta, phi + Math.PI / 4);
  };

  const resetToZero = () => {
    updateCurrentQubit(0.001, 0);
  };

  // Bloch vector 3D coordinates
  // x = sin(theta) * cos(phi)
  // y = sin(theta) * sin(phi)
  // z = cos(theta)
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  // SVG 2.5D Isometric Projection
  // Center is (150, 150), radius R = 100
  const cx = 150;
  const cy = 150;
  const R = 95;

  // Projection angles: standard isometric tilt
  // Screen X: cx + R * (x * cos(-30°) - y * sin(30°))
  // Screen Y: cy - R * z + R * 0.3 * (x * sin(-30°) + y * cos(30°))
  const projX = cx + R * (x * 0.866 - y * 0.5);
  const projY = cy - (R * z * 0.9) + (R * 0.25 * (x * 0.5 + y * 0.866));

  // Quantum State Amplitudes:
  // |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>
  const p0 = Math.pow(Math.cos(theta / 2), 2);
  const p1 = Math.pow(Math.sin(theta / 2), 2);
  const alphaVal = Math.cos(theta / 2).toFixed(3);
  const betaMag = Math.sin(theta / 2).toFixed(3);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
              Interactive Hilbert State Space
            </span>
            <span className="text-xs text-slate-400 font-mono">Qiskit Simulator</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            4-Qubit Bloch Sphere Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize single-qubit quantum state trajectories $|\psi\rangle$ mapped during non-linear kernel transformations.
          </p>
        </div>

        {/* Qubit Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {qubits.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQubitIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeQubitIdx === idx
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{q.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-teal-300 font-medium bg-teal-950/40 p-2.5 rounded-xl border border-teal-800/60">
        <strong className="text-white">Active Qubit:</strong> {currentQubit.name} — {currentQubit.role}
      </div>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3D SVG Bloch Sphere (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
          <svg width="300" height="300" viewBox="0 0 300 300" className="select-none">
            <defs>
              <radialGradient id="sphereGlow" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#0f172a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020617" stopOpacity="1" />
              </radialGradient>
              <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Sphere Background */}
            <circle cx={cx} cy={cy} r={R} fill="url(#sphereGlow)" stroke="#334155" strokeWidth="1.5" />

            {/* Equator Ellipse (X-Y plane) */}
            <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.32} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

            {/* Longitude Ellipse (Z-X plane) */}
            <ellipse cx={cx} cy={cy} rx={R * 0.32} ry={R} fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />

            {/* Z-Axis Line (Top to Bottom) */}
            <line x1={cx} y1={cy - R - 15} x2={cx} y2={cy + R + 15} stroke="#64748b" strokeWidth="1.5" />
            {/* Top |0> label */}
            <text x={cx} y={cy - R - 20} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">|0⟩ (+Z)</text>
            {/* Bottom |1> label */}
            <text x={cx} y={cy + R + 28} fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle">|1⟩ (-Z)</text>

            {/* X-Axis (Diagonal) */}
            <line x1={cx - 75} y1={cy + 35} x2={cx + 75} y2={cy - 35} stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <text x={cx + 85} y={cy - 38} fill="#94a3b8" fontSize="10" textAnchor="middle">+X</text>

            {/* Y-Axis (Horizontal) */}
            <line x1={cx - R - 10} y1={cy} x2={cx + R + 10} stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <text x={cx + R + 18} y={cy + 4} fill="#94a3b8" fontSize="10" textAnchor="middle">+Y</text>

            {/* Projection vector from center to point */}
            <line 
              x1={cx} 
              y1={cy} 
              x2={projX} 
              y2={projY} 
              stroke="url(#vectorGrad)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />

            {/* Origin Center Point */}
            <circle cx={cx} cy={cy} r="3.5" fill="#64748b" />

            {/* State Vector Tip */}
            <circle cx={projX} cy={projY} r="6" fill="#14b8a6" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />

            {/* State Label near tip */}
            <text 
              x={projX + (projX > cx ? 10 : -10)} 
              y={projY - 8} 
              fill="#2dd4bf" 
              fontSize="11" 
              fontWeight="bold" 
              textAnchor={projX > cx ? 'start' : 'end'}
            >
              |ψ⟩
            </text>
          </svg>

          {/* Real-Time Coordinates Readout */}
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300 mt-2">
            <span>x: <strong className="text-teal-400">{x.toFixed(2)}</strong></span>
            <span>y: <strong className="text-teal-400">{y.toFixed(2)}</strong></span>
            <span>z: <strong className="text-teal-400">{z.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Right Column: Controls, Math Readout, & Gate Triggers (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mathematical State Tomography */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quantum State Decomposition:
              </span>
              <span className="text-[11px] text-teal-400 font-mono">Pure State (Purity = 1.00)</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-sky-200 overflow-x-auto">
              |ψ⟩ = {alphaVal}|0⟩ + ({betaMag} · e^({phi.toFixed(2)}i))|1⟩
            </div>

            {/* Measurement Probabilities */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">P(|0⟩) Basis Probability:</span>
                <span className="font-mono text-teal-300 font-bold">{(p0 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-sky-500 h-full transition-all" style={{ width: `${p0 * 100}%` }} />
                <div className="bg-rose-500 h-full transition-all" style={{ width: `${p1 * 100}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>|0⟩: {(p0 * 100).toFixed(1)}%</span>
                <span>|1⟩: {(p1 * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Polar Angle θ (Latitude / Superposition):</span>
                <span className="font-mono text-teal-400 font-bold">{theta.toFixed(2)} rad ({(theta * (180 / Math.PI)).toFixed(0)}°)</span>
              </div>
              <input
                type="range"
                min="0.001"
                max={Math.PI}
                step="0.02"
                value={theta}
                onChange={e => updateCurrentQubit(parseFloat(e.target.value), phi)}
                className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Azimuthal Angle φ (Longitude / Quantum Phase):</span>
                <span className="font-mono text-teal-400 font-bold">{phi.toFixed(2)} rad ({(phi * (180 / Math.PI)).toFixed(0)}°)</span>
              </div>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.05"
                value={phi}
                onChange={e => updateCurrentQubit(theta, parseFloat(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Quantum Gate Execution Matrix (Buttons with NO symbols before words) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Apply Quantum Single-Qubit Gates:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              <button
                onClick={applyHadamard}
                title="Create Equal Superposition"
                className="py-2 px-2 rounded-xl bg-teal-600/90 hover:bg-teal-500 text-slate-950 font-bold text-xs text-center transition-all cursor-pointer shadow-sm"
              >
                <span>Hadamard</span>
              </button>

              <button
                onClick={applyPauliX}
                title="Pauli-X (NOT Bit Flip)"
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all cursor-pointer border border-slate-700"
              >
                <span>Pauli X</span>
              </button>

              <button
                onClick={applyPauliY}
                title="Pauli-Y Gate"
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all cursor-pointer border border-slate-700"
              >
                <span>Pauli Y</span>
              </button>

              <button
                onClick={applyPauliZ}
                title="Pauli-Z (Phase Flip)"
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all cursor-pointer border border-slate-700"
              >
                <span>Pauli Z</span>
              </button>

              <button
                onClick={applySGate}
                title="S Gate (Phase PI/2)"
                className="py-2 px-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 font-bold text-xs text-center transition-all cursor-pointer border border-indigo-700"
              >
                <span>S Gate</span>
              </button>

              <button
                onClick={applyTGate}
                title="T Gate (Phase PI/4)"
                className="py-2 px-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 font-bold text-xs text-center transition-all cursor-pointer border border-indigo-700"
              >
                <span>T Gate</span>
              </button>

              <button
                onClick={resetToZero}
                title="Reset to Ground State |0>"
                className="py-2 px-2 rounded-xl bg-rose-900/70 hover:bg-rose-800 text-rose-100 font-bold text-xs text-center transition-all cursor-pointer border border-rose-800"
              >
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
