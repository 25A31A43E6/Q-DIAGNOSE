import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Activity, 
  BarChart3, 
  BookOpen, 
  Cpu, 
  Atom, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Layers,
  Users,
  Stethoscope,
  Brain,
  HeartHandshake
} from 'lucide-react';
import { DiseaseId, NavSection } from '../types';
import { DISEASE_CONFIGS } from '../data/diseaseDatasets';

export type { NavSection };

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  hasResult: boolean;
  totalPredictions: number;
  selectedDisease?: DiseaseId;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  hasResult,
  totalPredictions,
  selectedDisease = 'breast_cancer',
}) => {
  const currentConfig = DISEASE_CONFIGS[selectedDisease];
  const navItems = [
    {
      id: 'doctor-workspace' as NavSection,
      label: 'Doctor EMR Workspace',
      shortLabel: 'Doctor EMR',
      icon: Stethoscope,
      badge: 'Clinical',
      badgeColor: 'bg-teal-900/80 text-teal-200 border border-teal-500/40',
    },
    {
      id: 'doctor-360' as NavSection,
      label: 'Doctor 360° Dossier',
      shortLabel: 'Patient 360°',
      icon: Users,
      badge: 'Break-Glass',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
    },
    {
      id: 'admin' as NavSection,
      label: 'Security & Audit Admin',
      shortLabel: 'Admin Audit',
      icon: ShieldCheck,
      badge: 'ABDM Logs',
      badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300',
    },
    {
      id: 'neurology-screening' as NavSection,
      label: 'Neurology Screening',
      shortLabel: 'Neurology',
      icon: Brain,
      badge: '5 Conditions',
      badgeColor: 'bg-teal-50 text-teal-800 border border-teal-300',
    },
    {
      id: 'herhealth' as NavSection,
      label: 'HERHEALTH Portal',
      shortLabel: 'HERHEALTH',
      icon: HeartHandshake,
      badge: 'Women Health',
      badgeColor: 'bg-rose-50 text-rose-800 border border-rose-200',
    },
    {
      id: 'dashboard' as NavSection,
      label: 'Research Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: `${totalPredictions} runs`,
    },
    {
      id: 'quantum-pipeline' as NavSection,
      label: 'Hybrid Quantum Pipeline',
      shortLabel: 'Quantum Circuit',
      icon: Atom,
    },
    {
      id: 'upload' as NavSection,
      label: 'Upload & Predict',
      shortLabel: 'Upload',
      icon: UploadCloud,
    },
    {
      id: 'results' as NavSection,
      label: 'Prediction Results',
      shortLabel: 'Results',
      icon: Activity,
      badge: hasResult ? 'Active' : undefined,
      badgeColor: hasResult ? 'bg-blue-900/80 text-blue-200 border border-blue-500/40' : undefined,
    },
    {
      id: 'benchmark' as NavSection,
      label: 'Model Benchmarks',
      shortLabel: 'Benchmarks',
      icon: BarChart3,
    },
    {
      id: 'reference' as NavSection,
      label: 'Dataset Reference',
      shortLabel: 'Reference',
      icon: BookOpen,
    },
    {
      id: 'login' as NavSection,
      label: 'Security & Login',
      shortLabel: 'Login & Security',
      icon: ShieldCheck,
      badge: 'Protected',
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    },
  ];

  return (
    <aside 
      id="main-sidebar" 
      className="w-64 bg-white border-r border-[#DCE8F6] flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-sm shadow-sky-950/5 z-20 text-[#2D3748]"
    >
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#DCE8F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0B1E3D] to-teal-700 text-white flex items-center justify-center shadow-sm border border-teal-400/40">
              <Atom className="w-6 h-6 text-teal-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-[#0B1E3D]">Q-Diagnose</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FEF9E7] text-[#9A7416] border border-[#F6E58D]">
                  v3.0
                </span>
              </div>
              <p className="text-[11px] text-[#2D3748] opacity-75 font-medium">Hybrid Quantum-Classical ML</p>
            </div>
          </div>
          <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-center justify-between text-xs text-[#2D3748]">
            <span className="flex items-center gap-1.5 font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 -ml-3.5"></span>
              Clinical Engine: Ready
            </span>
            <span className="font-mono text-[11px] text-teal-700 font-bold">4-Qubit VQC</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-teal-800 uppercase">
            Clinical Workflow
          </div>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1E3D] text-white shadow-sm'
                    : 'text-[#2D3748] hover:text-[#0B1E3D] hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center">
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-teal-900/80 text-teal-200 border border-teal-400/40'
                        : 'bg-[#FEF9E7] text-[#9A7416] border border-[#F6E58D]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Specs */}
      <div className="p-4 border-t border-[#DCE8F6] bg-[#F8FAFC] m-3 rounded-2xl border border-[#DCE8F6] shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#0B1E3D] mb-2">
          <span>Active Architecture</span>
          <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-mono font-bold border border-teal-200">
            {currentConfig.shortName}
          </span>
        </div>
        <div className="space-y-1.5 text-[11px] text-[#2D3748] font-mono">
          <div className="flex justify-between">
            <span className="opacity-75">Ansatz Circuit:</span>
            <span className="font-semibold text-[#0B1E3D]">RealAmplitudes</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-75">Feature Map:</span>
            <span className="font-semibold text-[#0B1E3D]">ZZFeatureMap (d=4)</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-75">Classical Model:</span>
            <span className="font-semibold text-[#0B1E3D]">RandomForest (100)</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-[#DCE8F6] flex items-center justify-between text-[10px] text-[#2D3748]">
          <span className="opacity-75">Simulation Engine</span>
          <span className="text-teal-700 font-bold">
            Qiskit Aer
          </span>
        </div>
      </div>
    </aside>
  );
};
