import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  FileText, 
  Activity, 
  Atom, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  Heart, 
  Brain, 
  Dna, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Lock, 
  FileSpreadsheet, 
  RefreshCw,
  Eye,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { 
  MOCK_CLINICAL_PATIENTS, 
  CLINICAL_AUDIT_TRAIL, 
  PatientRecord, 
  PatientAuditEntry 
} from '../data/clinicalPatients';
import { DiseaseId, PredictionResult, RiskBand } from '../types';

interface DoctorClinicalWorkspaceProps {
  onRouteToExplainability: (result: PredictionResult) => void;
  onRouteToQuantumPipeline: (diseaseId: DiseaseId) => void;
  onSwitchToPatientView: () => void;
  onOpenDoctor360?: (patientId: string) => void;
}

export const DoctorClinicalWorkspace: React.FC<DoctorClinicalWorkspaceProps> = ({
  onRouteToExplainability,
  onRouteToQuantumPipeline,
  onSwitchToPatientView,
  onOpenDoctor360
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'symptoms' | 'screening' | 'history' | 'explainability' | 'clinical-notes' | 'audit-trail'
  >('overview');
  const [patients, setPatients] = useState<PatientRecord[]>(MOCK_CLINICAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_CLINICAL_PATIENTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high_flagged' | 'moderate' | 'low'>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | DiseaseId>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<'all' | 'past_7_days' | 'past_30_days' | 'older_archive'>('all');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [clinicalNotesDraft, setClinicalNotesDraft] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLog, setAuditLog] = useState<PatientAuditEntry[]>(CLINICAL_AUDIT_TRAIL);

  // Active Patient
  const activePatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Active Assessment for the drilldown panel
  const activeAssessment = useMemo(() => {
    if (!activePatient) return null;
    if (selectedAssessmentId) {
      const found = activePatient.assessments.find(a => a.id === selectedAssessmentId);
      if (found) return found;
    }
    return activePatient.assessments[0] || null;
  }, [activePatient, selectedAssessmentId]);

  // Filtered Patient Queue
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Search
      const matchSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      // Risk filter
      if (riskFilter === 'high_flagged' && !p.isFlaggedHighRisk) return false;
      if (riskFilter === 'moderate' && p.latestRiskBand !== 'moderate') return false;
      if (riskFilter === 'low' && p.latestRiskBand !== 'low') return false;

      // Condition filter
      if (conditionFilter !== 'all' && p.primaryCondition !== conditionFilter) return false;

      return true;
    }).sort((a, b) => {
      // Flagged high-risk first if requested or by risk score descending
      if (a.isFlaggedHighRisk && !b.isFlaggedHighRisk) return -1;
      if (!a.isFlaggedHighRisk && b.isFlaggedHighRisk) return 1;
      return b.latestRiskScore - a.latestRiskScore;
    });
  }, [patients, searchQuery, riskFilter, conditionFilter]);

  // Filtered Assessments for Selected Patient
  const filteredAssessments = useMemo(() => {
    if (!activePatient) return [];
    return activePatient.assessments.filter(a => {
      if (timeframeFilter !== 'all' && a.timeframeCategory !== timeframeFilter) return false;
      if (conditionFilter !== 'all' && a.diseaseId !== conditionFilter) return false;
      return true;
    });
  }, [activePatient, timeframeFilter, conditionFilter]);

  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatientId(patient.id);
    setSelectedAssessmentId(patient.assessments[0]?.id || null);
    
    // Log audit entry for HIPAA/ABDM clinical compliance
    const newEntry: PatientAuditEntry = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      doctorName: 'Dr. Ananya Rao, MD',
      action: `Clinical chart review accessed for patient ${patient.name} (${patient.mrn})`,
      consentId: patient.consentStatus.split('#')[1] || 'CONSENT-VAL'
    };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  const handleSaveClinicalNote = () => {
    if (!clinicalNotesDraft.trim() || !activeAssessment) return;
    setPatients(prev => prev.map(p => {
      if (p.id !== activePatient.id) return p;
      return {
        ...p,
        assessments: p.assessments.map(a => {
          if (a.id !== activeAssessment.id) return a;
          return {
            ...a,
            clinicalNotes: (a.clinicalNotes ? `${a.clinicalNotes}\n[Addendum]: ` : '') + clinicalNotesDraft.trim()
          };
        })
      };
    }));
    setClinicalNotesDraft('');
  };

  return (
    <div id="doctor-clinical-workspace" className="space-y-6 max-w-[1550px] mx-auto animate-fadeIn pb-16">
      {/* Top Clinical Utility Bar */}
      <header className="bg-[#0B1E3D] text-white rounded-3xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4 border border-sky-900/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-xs">
            <Atom className="w-6 h-6 text-teal-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold">Clinical Workspace</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900/80 text-teal-200 border border-teal-700/60 font-mono">
                ABDM Compliant EMR
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
              Dr. Ananya Rao, MD, DM <span className="text-slate-400 font-normal text-sm">(Cardiology & Internal Medicine)</span>
            </h1>
            <p className="text-xs text-slate-300">
              Department of Preventative Medicine & Cardiometabolic Risk • Apollo / AIIMS Research Network
            </p>
          </div>
        </div>

        {/* Clinical Disclaimer & Quick Actions */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-950/60 border border-sky-800/60 text-sky-200 text-xs font-medium">
            <span><strong>Clinical Protocol:</strong> AI-assisted screening result — for clinical correlation.</span>
          </div>

          <button
            onClick={() => setShowAuditModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center transition-all cursor-pointer border border-white/10"
            title="View HIPAA / ABDM Access Logs"
          >
            <span>Audit Trail ({auditLog.length})</span>
          </button>

          <button
            onClick={onSwitchToPatientView}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center shadow-sm transition-all cursor-pointer"
          >
            <span>Patient-Facing Mode</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: High-Density Patient Queue (4 cols on XL) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-sm space-y-3.5">
            {/* Search Bar & Queue Controls */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0B1E3D] uppercase tracking-wider">Patient Queue ({filteredPatients.length})</h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Sorted: Priority Risk</span>
            </div>

            {/* Compact Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search patient, MRN (e.g. MRN-CARD), or ID..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            {/* Quick Priority Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  riskFilter === 'all'
                    ? 'bg-[#0B1E3D] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({patients.length})
              </button>

              <button
                onClick={() => setRiskFilter('high_flagged')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center transition-all cursor-pointer ${
                  riskFilter === 'high_flagged'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>Flagged High-Risk (2)</span>
              </button>

              <button
                onClick={() => setRiskFilter('moderate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  riskFilter === 'moderate'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>Moderate</span>
              </button>

              <button
                onClick={() => setRiskFilter('low')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  riskFilter === 'low'
                    ? 'bg-teal-700 text-white'
                    : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                <span>Low</span>
              </button>
            </div>

            {/* High Density Patient Queue List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredPatients.map(patient => {
                const isSelected = patient.id === activePatient.id;
                const Icon = patient.primaryCondition === 'cardiovascular' ? Heart : patient.primaryCondition === 'breast_cancer' ? Dna : Brain;

                return (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          patient.latestRiskBand === 'high'
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : patient.latestRiskBand === 'moderate'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-teal-50 border-teal-200 text-teal-700'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-[#0B1E3D]">{patient.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({patient.age}y • {patient.gender})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{patient.mrn}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono inline-block ${
                          patient.latestRiskBand === 'high'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : patient.latestRiskBand === 'moderate'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {patient.latestRiskScore}% Risk
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{patient.lastAssessmentDate}</div>
                      </div>
                    </div>

                    {/* Vitals Summary Strip */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] text-slate-600 font-mono">
                      <div>BP: <strong className="text-slate-800">{patient.vitals.bp}</strong></div>
                      <div>HR: <strong className="text-slate-800">{patient.vitals.restingHeartRate} bpm</strong></div>
                      <div>BMI: <strong className="text-slate-800">{patient.vitals.bmi}</strong></div>
                    </div>
                  </div>
                );
              })}

              {filteredPatients.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No patients match your search criteria.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Patient Longitudinal Profile, Multi-Month History & Explainability Drill-Down (8 cols on XL) */}
        <div className="xl:col-span-8 space-y-6">
          {/* 7 Clinical Workspace Tabs (Requirement 13) */}
          <div className="bg-white rounded-2xl border border-sky-100 p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'overview' as const, label: 'Overview' },
              { id: 'symptoms' as const, label: 'Symptoms' },
              { id: 'screening' as const, label: 'Screening' },
              { id: 'history' as const, label: 'History' },
              { id: 'explainability' as const, label: 'Explainability' },
              { id: 'clinical-notes' as const, label: 'Clinical Notes' },
              { id: 'audit-trail' as const, label: 'Audit Trail' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1E3D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Patient Header Card (Always Visible on Top of Right Column) */}
          <section className="bg-white rounded-3xl border border-sky-100 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#0B1E3D]">{activePatient.name}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold border border-slate-200">
                    {activePatient.mrn}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                    {activePatient.conditionLabel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span>Age: <strong>{activePatient.age} years</strong></span>
                  <span>•</span>
                  <span>Gender: <strong>{activePatient.gender}</strong></span>
                  <span>•</span>
                  <span>Blood: <strong>{activePatient.bloodGroup}</strong></span>
                  <span>•</span>
                  <span>Doctor: <strong>{activePatient.attendingDoctor}</strong></span>
                </div>
              </div>

              {/* Verified Consent Badge & Doctor 360 Link */}
              <div className="flex items-center gap-2">
                {onOpenDoctor360 && (
                  <button
                    onClick={() => onOpenDoctor360(activePatient.id === 'pat-001' ? 'PAT-001' : activePatient.id === 'pat-002' ? 'PAT-002' : 'PAT-001')}
                    className="px-3 py-2 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    title="Open full 360-degree patient dossier, lab history, and emergency break-glass"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-300" />
                    <span>360° Dossier</span>
                  </button>
                )}
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                  <div>
                    <strong className="block font-bold">{activePatient.consentStatus}</strong>
                    <span className="text-emerald-700 text-[10px]">Verified patient consent active through {activePatient.consentExpires}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Blood Pressure</span>
                <div className="text-base font-extrabold text-[#0B1E3D] mt-0.5">{activePatient.vitals.bp}</div>
                <span className="text-[10px] text-amber-700 font-medium">Stage 1 Alert</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Resting Heart Rate</span>
                <div className="text-base font-extrabold text-[#0B1E3D] mt-0.5">{activePatient.vitals.restingHeartRate} bpm</div>
                <span className="text-[10px] text-slate-500">Normal sinus rhythm</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Body Mass Index</span>
                <div className="text-base font-extrabold text-[#0B1E3D] mt-0.5">{activePatient.vitals.bmi} kg/m²</div>
                <span className="text-[10px] text-amber-700">Overweight range</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Oxygen Saturation</span>
                <div className="text-base font-extrabold text-[#0B1E3D] mt-0.5">{activePatient.vitals.spo2}% SpO2</div>
                <span className="text-[10px] text-teal-700">Adequate saturation</span>
              </div>
            </div>
          </section>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Clinical Highlights & Active Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Screening Risk Score</span>
                  <div className="text-2xl font-black text-[#0B1E3D] font-mono">
                    {activePatient.latestRiskScore}%
                  </div>
                  <span className={`text-[11px] font-bold inline-block px-2 py-0.5 rounded-full ${
                    activePatient.latestRiskBand === 'high' ? 'bg-rose-100 text-rose-800' :
                    activePatient.latestRiskBand === 'moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {activePatient.latestRiskBand.toUpperCase()} RISK
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Recorded Assessments</span>
                  <div className="text-2xl font-black text-[#0B1E3D] font-mono">
                    {activePatient.assessments.length}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Latest: {activePatient.lastAssessmentDate}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Data Protection Status</span>
                  <div className="text-sm font-bold text-emerald-700 pt-1">
                    <span>{activePatient.consentStatus}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Expires: {activePatient.consentExpires}
                  </span>
                </div>
              </div>

              {/* Quick Navigation into Other Tabs */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">
                  Quick Access Clinical Modules
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('symptoms')}
                    className="p-3 rounded-2xl bg-white hover:bg-teal-50/50 border border-slate-200 text-left transition-all cursor-pointer font-bold text-[#0B1E3D]"
                  >
                    Review Symptoms
                  </button>
                  <button
                    onClick={() => setActiveTab('screening')}
                    className="p-3 rounded-2xl bg-white hover:bg-teal-50/50 border border-slate-200 text-left transition-all cursor-pointer font-bold text-[#0B1E3D]"
                  >
                    Active Screening
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="p-3 rounded-2xl bg-white hover:bg-teal-50/50 border border-slate-200 text-left transition-all cursor-pointer font-bold text-[#0B1E3D]"
                  >
                    Progression History
                  </button>
                  <button
                    onClick={() => setActiveTab('explainability')}
                    className="p-3 rounded-2xl bg-white hover:bg-teal-50/50 border border-slate-200 text-left transition-all cursor-pointer font-bold text-[#0B1E3D]"
                  >
                    SHAP Explainability
                  </button>
                  <button
                    onClick={() => setActiveTab('clinical-notes')}
                    className="p-3 rounded-2xl bg-white hover:bg-teal-50/50 border border-slate-200 text-left transition-all cursor-pointer font-bold text-[#0B1E3D]"
                  >
                    Clinical Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('audit-trail')}
                    className="p-3 rounded-2xl bg-white hover:bg-teal-50/50 border border-slate-200 text-left transition-all cursor-pointer font-bold text-[#0B1E3D]"
                  >
                    Audit Trail
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYMPTOMS */}
          {activeTab === 'symptoms' && (
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0B1E3D]">Patient Reported Symptoms & Clinical Presentation</h3>
                  <p className="text-xs text-slate-500">Documented symptoms and physiological alerts for {activePatient.name}</p>
                </div>
                <span className="text-xs font-mono bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
                  {activePatient.conditionLabel}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reported Primary Indications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Symptom Cluster</span>
                    <div className="font-bold text-[#0B1E3D]">
                      {activePatient.primaryCondition === 'cardiovascular'
                        ? 'Exertional dyspnea, intermittent palpitations, bilateral ankle edema'
                        : activePatient.primaryCondition === 'neurological'
                        ? 'Intermittent resting hand tremor, mild gait instability, sleep disturbances'
                        : 'Unilateral localized lump palpation, minor localized tenderness'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Onset & Duration</span>
                    <div className="font-bold text-[#0B1E3D]">
                      Onset approximately 6-8 weeks prior, gradual progression noted by family.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <strong className="font-bold block">Clinical Triage Assessment</strong>
                  <p>
                    Non-acute presentation at time of check. Vitals show Stage 1 BP elevation ({activePatient.vitals.bp}), with no acute ischemic signs on telemetry. Scheduled for comprehensive evaluation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCREENING */}
          {activeTab === 'screening' && activeAssessment && (
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-5 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-teal-700 uppercase font-bold">Active Screening Record</span>
                  <h3 className="text-lg font-bold text-[#0B1E3D]">
                    {activeAssessment.assessmentType} ({activeAssessment.date})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    activeAssessment.riskBand === 'high' ? 'bg-rose-100 text-rose-800' :
                    activeAssessment.riskBand === 'moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {activeAssessment.riskScore}% {activeAssessment.riskBand.toUpperCase()} RISK
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                    Consensus: {activeAssessment.consensus}
                  </span>
                </div>
              </div>

              {/* Models Comparison (VQC vs Classical ML) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900">4-Qubit Variational Quantum Classifier (VQC)</span>
                    <span className="text-xs font-mono font-bold text-teal-700">92.4% Confidence</span>
                  </div>
                  <div className="w-full bg-teal-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '92.4%' }} />
                  </div>
                  <p className="text-[11px] text-teal-800">
                    Hilbert space projection using ZZFeatureMap with entangling CZ layers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1E3D]">Classical Gradient Boosted Forest</span>
                    <span className="text-xs font-mono font-bold text-sky-700">89.8% Confidence</span>
                  </div>
                  <div className="w-full bg-sky-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0B1E3D] h-full rounded-full" style={{ width: '89.8%' }} />
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Ensemble decision tree with cross-validated tabular features.
                  </p>
                </div>
              </div>

              {/* Contributing Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">
                  Key Biomarkers in this Screening
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeAssessment.contributingFactors.map((factor, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#0B1E3D] block">{factor.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">Value: {factor.rawValue}</span>
                      </div>
                      <span className="font-mono font-bold text-teal-700">+{factor.impact}% impact</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HISTORY (Longitudinal Trajectory & Assessments Table) */}
          {activeTab === 'history' && (
            <section className="bg-white rounded-3xl border border-sky-100 p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#0B1E3D]">Multi-Month Risk Progression & Assessment History</h3>
                  <p className="text-xs text-slate-500">
                    Longitudinal track of Quantum-Classical hybrid risk scores over past visits and archival records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={timeframeFilter}
                    onChange={e => setTimeframeFilter(e.target.value as any)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Dates ({activePatient.assessments.length})</option>
                    <option value="past_7_days">Past 7 Days</option>
                    <option value="past_30_days">Past 30 Days</option>
                    <option value="older_archive">Older / Archival</option>
                  </select>
                </div>
              </div>

              {/* Visual Risk Progression Curve (SVG) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                  <span>Longitudinal Trajectory</span>
                  <span className="text-slate-400">Chronological: Past to Recent</span>
                </div>

                <div className="h-32 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#fca5a5" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#fde68a" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#99f6e4" strokeDasharray="3 3" strokeWidth="1" />

                    {(() => {
                      const sortedAsc = [...activePatient.assessments].reverse();
                      if (sortedAsc.length < 2) return null;
                      const points = sortedAsc.map((a, i) => {
                        const x = (i / (sortedAsc.length - 1)) * 480 + 10;
                        const y = 100 - (a.riskScore * 0.9);
                        return `${x},${y}`;
                      }).join(' ');
                      return (
                        <polyline
                          fill="none"
                          stroke="#0B1E3D"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                      );
                    })()}

                    {(() => {
                      const sortedAsc = [...activePatient.assessments].reverse();
                      return sortedAsc.map((a, i) => {
                        const x = sortedAsc.length === 1 ? 250 : (i / (sortedAsc.length - 1)) * 480 + 10;
                        const y = 100 - (a.riskScore * 0.9);
                        const isHigh = a.riskBand === 'high';
                        return (
                          <g key={a.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r={a.id === activeAssessment?.id ? '7' : '5'}
                              fill={isHigh ? '#e11d48' : '#0d9488'}
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="cursor-pointer hover:scale-125 transition-transform"
                              onClick={() => setSelectedAssessmentId(a.id)}
                            />
                            <text
                              x={x}
                              y={y - 10}
                              textAnchor="middle"
                              fontSize="10"
                              fontWeight="bold"
                              fill="#0B1E3D"
                            >
                              {a.riskScore}%
                            </text>
                          </g>
                        );
                      });
                    })()}
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span> High Risk (&gt;70%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate (40-70%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span> Low (&lt;40%)
                  </span>
                </div>
              </div>

              {/* Compact Clinical Timeline Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Assessment Type</th>
                      <th className="py-2.5 px-3">Risk Band</th>
                      <th className="py-2.5 px-3">Key Contributing Factors</th>
                      <th className="py-2.5 px-3">Consensus</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAssessments.map(item => {
                      const isSelected = item.id === activeAssessment?.id;
                      return (
                        <tr 
                          key={item.id}
                          onClick={() => setSelectedAssessmentId(item.id)}
                          className={`hover:bg-sky-50/40 transition-colors cursor-pointer ${
                            isSelected ? 'bg-teal-50/50 font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">{item.date}</td>
                          <td className="py-3 px-3 font-bold text-[#0B1E3D]">{item.assessmentType}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[10px] inline-block ${
                              item.riskBand === 'high'
                                ? 'bg-rose-100 text-rose-800'
                                : item.riskBand === 'moderate'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                              {item.riskScore}% {item.riskBand.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                            {item.contributingFactors.map(f => `${f.name} (${f.impact}%)`).join(', ')}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-mono border border-sky-200">
                              {item.consensus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAssessmentId(item.id);
                                setActiveTab('screening');
                              }}
                              className="px-2 py-1 rounded-lg bg-white hover:bg-teal-50 text-teal-700 border border-slate-200 text-[11px] font-bold cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 5: EXPLAINABILITY (SHAP & Quantum Breakdown) */}
          {activeTab === 'explainability' && activeAssessment && (
            <section className="bg-white rounded-3xl border border-sky-100 p-5 sm:p-6 shadow-sm space-y-5 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-teal-700 uppercase font-bold">Explainable AI Deep-Dive</span>
                  <h3 className="text-base font-bold text-[#0B1E3D]">
                    {activeAssessment.assessmentType} ({activeAssessment.date})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRouteToExplainability(activeAssessment.result)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Explainability Deep-Dive</span>
                  </button>

                  <button
                    onClick={() => onRouteToQuantumPipeline(activeAssessment.diseaseId)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>View Quantum Circuit</span>
                  </button>
                </div>
              </div>

              {/* Feature Attribution Weights Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#0B1E3D] uppercase tracking-wider text-[11px]">
                    Key Contributing Factors (Feature Attribution Weights)
                  </strong>
                  <span className="text-slate-400 font-mono text-[11px]">Normalized SHAP Decomposition</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeAssessment.contributingFactors.map((factor, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0B1E3D]">{factor.name}</span>
                        <span className="font-mono font-bold text-teal-700">+{factor.impact}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-[#0B1E3D] h-full rounded-full" 
                          style={{ width: `${Math.min(factor.impact * 2.2, 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Measured baseline: <strong className="text-slate-700 font-mono">{factor.rawValue}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: CLINICAL NOTES */}
          {activeTab === 'clinical-notes' && activeAssessment && (
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0B1E3D]">Physician Clinical Addendum & Chart Notes</h3>
                  <p className="text-xs text-slate-500">Document clinical impressions, follow-ups, and diagnostic orders</p>
                </div>
                <span className="text-xs font-mono text-slate-400">Electronic Health Record</span>
              </div>

              {activeAssessment.clinicalNotes ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {activeAssessment.clinicalNotes}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 italic">
                  No notes recorded yet for this assessment record.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Add New Clinical Addendum
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotesDraft}
                  onChange={e => setClinicalNotesDraft(e.target.value)}
                  placeholder="Enter physician observations, follow-up tests ordered, or differential diagnosis..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                <button
                  onClick={handleSaveClinicalNote}
                  disabled={!clinicalNotesDraft.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#132c54] disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Save Note to Chart
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT TRAIL */}
          {activeTab === 'audit-trail' && (
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0B1E3D]">ABDM / HIPAA Clinical Access Audit Trail</h3>
                  <p className="text-xs text-slate-500">Immutable timestamped access log for patient data compliance</p>
                </div>
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold cursor-pointer"
                >
                  Expand Modal View
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {auditLog.map((log, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{log.timestamp}</span>
                      <span className="text-teal-700 font-bold font-mono">Consent: #{log.consentId}</span>
                    </div>
                    <div className="font-bold text-[#0B1E3D]">{log.action}</div>
                    <div className="text-slate-500 text-[11px]">Clinician: {log.doctorName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HIPAA / ABDM Access Audit Trail Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white max-w-2xl w-full rounded-3xl border border-sky-100 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0B1E3D]">ABDM / HIPAA Clinical Access Audit Trail</h3>
                <p className="text-xs text-slate-500">Immutable timestamped access log for patient data compliance</p>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {auditLog.map((log, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{log.timestamp}</span>
                    <span className="text-teal-700 font-bold font-mono">Consent: #{log.consentId}</span>
                  </div>
                  <div className="font-bold text-[#0B1E3D]">{log.action}</div>
                  <div className="text-slate-500 text-[11px]">Clinician: {log.doctorName}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0B1E3D] text-white text-xs font-bold hover:bg-[#132c54]"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
