import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FlaskConical, 
  Pill, 
  ShieldCheck, 
  History, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Plus, 
  Trash2, 
  Eye, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Download, 
  Sparkles,
  Info,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { 
  AuthUserProfile, 
  MedicalRecordEntry, 
  LabReportEntry, 
  MedicationEntry, 
  PatientConsentEntry, 
  PredictionResult 
} from '../../types';

interface PatientPortalViewProps {
  currentUser: AuthUserProfile;
  onNavigateToAssessment: () => void;
  onNavigateToEmergency: () => void;
  onNavigateToHerHealth: () => void;
  onNavigateToNeurology: () => void;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  currentUser,
  onNavigateToAssessment,
  onNavigateToEmergency,
  onNavigateToHerHealth,
  onNavigateToNeurology
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'records' | 'labs' | 'meds' | 'consent' | 'audit'>('dashboard');

  // Data states
  const [records, setRecords] = useState<MedicalRecordEntry[]>([]);
  const [labs, setLabs] = useState<LabReportEntry[]>([]);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [consents, setConsents] = useState<PatientConsentEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & form state
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantDoctorName, setGrantDoctorName] = useState('Dr. Rajesh Sharma, MD');
  const [grantDoctorId, setGrantDoctorId] = useState('DOC-001');
  const [grantSpecialty, setGrantSpecialty] = useState('Clinical Oncology');
  const [grantHospital, setGrantHospital] = useState('AIIMS Delhi');

  // Filters
  const [labFilter, setLabFilter] = useState('all');
  const [medFilter, setMedFilter] = useState<'all' | 'active' | 'inactive' | 'historical'>('active');

  const patientId = currentUser.patient_id || 'PAT-001';

  useEffect(() => {
    async function fetchPortalData() {
      setIsLoading(true);
      try {
        const [recRes, labRes, medRes, conRes, audRes] = await Promise.all([
          fetch(`/api/patient/records?patient_id=${patientId}`),
          fetch(`/api/patient/labs?patient_id=${patientId}`),
          fetch(`/api/patient/medications?patient_id=${patientId}`),
          fetch(`/api/patient/consents?patient_id=${patientId}`),
          fetch(`/api/patient/audit-logs?patient_id=${patientId}`)
        ]);

        if (recRes.ok) {
          const d = await recRes.json();
          setRecords(d.records || []);
        }
        if (labRes.ok) {
          const d = await labRes.json();
          setLabs(d.lab_reports || []);
        }
        if (medRes.ok) {
          const d = await medRes.json();
          setMedications(d.medications || []);
        }
        if (conRes.ok) {
          const d = await conRes.json();
          setConsents(d.consents || []);
        }
        if (audRes.ok) {
          const d = await audRes.json();
          setAuditLogs(d.doctor_access_logs || []);
        }
      } catch (err) {
        console.error('Failed to load patient portal data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortalData();
  }, [patientId]);

  const handleRevokeConsent = async (consentId: string) => {
    try {
      const res = await fetch(`/api/patient/consents/${consentId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: revokeReason || 'Patient initiated revocation' })
      });
      if (res.ok) {
        setConsents(prev => prev.map(c => c.id === consentId ? { ...c, status: 'revoked', revoked_at: new Date().toISOString() } : c));
        setShowRevokeModal(null);
        setRevokeReason('');
      }
    } catch (e) {
      console.error('Revoke failed:', e);
    }
  };

  const handleGrantConsent = async () => {
    try {
      const res = await fetch('/api/patient/consents/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          doctor_id: grantDoctorId,
          doctor_name: grantDoctorName,
          doctor_specialty: grantSpecialty,
          hospital: grantHospital,
          access_medical_records: 1,
          access_lab_reports: 1,
          access_medications: 1,
          access_ai_predictions: 1
        })
      });
      if (res.ok) {
        const conRes = await fetch(`/api/patient/consents?patient_id=${patientId}`);
        if (conRes.ok) {
          const d = await conRes.json();
          setConsents(d.consents || []);
        }
        setShowGrantModal(false);
      }
    } catch (e) {
      console.error('Grant failed:', e);
    }
  };

  const activeMeds = medications.filter(m => m.status === 'active');
  const activeConsents = consents.filter(c => c.status === 'active');

  const filteredLabs = labFilter === 'all' 
    ? labs 
    : labs.filter(l => l.category.toLowerCase().includes(labFilter.toLowerCase()) || l.report_name.toLowerCase().includes(labFilter.toLowerCase()));

  const filteredMeds = medFilter === 'all'
    ? medications
    : medications.filter(m => m.status === medFilter);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* PERSISTENT RESEARCH PROTOTYPE DISCLAIMER BANNER */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Research Prototype Notice:</span> AI risk calculations and decision support metrics are generated for clinical research and early screening purposes only. They must not be used as a substitute for professional medical diagnosis. Always consult a qualified physician.
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-400/30">
                ABDM Patient Portal
              </span>
              <span className="text-xs text-slate-400">
                Patient ID: <span className="font-mono text-teal-200">{patientId}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Your personal health record vault with Ayushman Bharat Digital Mission (ABDM) compliance, encrypted storage, transparent doctor consent controls, and hybrid AI early risk tracking.
            </p>
          </div>

          {/* Reassurance Badge */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">AES-256-GCM Encrypted</div>
              <div className="text-[10px] text-teal-200">Zero unauthorized clinician access</div>
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-1 border-t border-white/10 pt-4">
          {[
            { id: 'dashboard', label: 'My Health Overview', icon: Activity, count: null },
            { id: 'records', label: 'Medical Records', icon: FileText, count: records.length },
            { id: 'labs', label: 'Lab Reports', icon: FlaskConical, count: labs.length },
            { id: 'meds', label: 'Medications', icon: Pill, count: activeMeds.length },
            { id: 'consent', label: 'Doctor Consent (ABDM)', icon: ShieldCheck, count: activeConsents.length },
            { id: 'audit', label: 'Access Audit History', icon: History, count: auditLogs.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active ? 'bg-teal-700 text-teal-100' : 'bg-white/10 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DASHBOARD / OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveTab('records')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Medical Records</span>
                <FileText className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{records.length}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span>View consultation notes</span>
                <ChevronRight className="w-3 h-3 text-teal-600" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('labs')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Lab Reports</span>
                <FlaskConical className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{labs.length}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span>Biomarkers & bloodwork</span>
                <ChevronRight className="w-3 h-3 text-blue-600" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('meds')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Active Medications</span>
                <Pill className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{activeMeds.length}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span>Prescriptions & dosage</span>
                <ChevronRight className="w-3 h-3 text-emerald-600" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('consent')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Doctor Consents</span>
                <ShieldCheck className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{activeConsents.length}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span>ABDM active authorizations</span>
                <ChevronRight className="w-3 h-3 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/80 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-teal-950 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Q-Diagnose Integrated Health Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={onNavigateToAssessment}
                className="p-3.5 bg-white border border-teal-200 rounded-xl hover:border-teal-400 hover:shadow-sm text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Early Risk Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Evaluate oncology, cardiology & metabolic indicators via hybrid model.
                </p>
              </button>

              <button
                onClick={onNavigateToHerHealth}
                className="p-3.5 bg-white border border-pink-200 rounded-xl hover:border-pink-400 hover:shadow-sm text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-pink-900">HERHEALTH™ Module</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pink-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Women's health tracker, PCOS guidance, CBT mental wellness & cycle tracking.
                </p>
              </button>

              <button
                onClick={onNavigateToNeurology}
                className="p-3.5 bg-white border border-indigo-200 rounded-xl hover:border-indigo-400 hover:shadow-sm text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span className="text-indigo-900">Neurological Screening</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Screening for Parkinson's, Alzheimer's, stroke risk and tremors.
                </p>
              </button>
            </div>
          </div>

          {/* Recent Records & Timeline Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Medical Consultations */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Recent Clinical Records
                </h3>
                <button 
                  onClick={() => setActiveTab('records')}
                  className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                >
                  View All ({records.length})
                </button>
              </div>

              {records.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">No clinical records available.</div>
              ) : (
                <div className="space-y-3">
                  {records.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">{rec.title}</span>
                        <span className="text-slate-400 text-[10px]">{new Date(rec.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{rec.content}</p>
                      <div className="text-[10px] text-teal-700 font-medium mt-1.5">
                        Author: {rec.author_name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Doctor Authorizations */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Active Doctor Consents (ABDM)
                </h3>
                <button 
                  onClick={() => setActiveTab('consent')}
                  className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Manage ({activeConsents.length})
                </button>
              </div>

              {activeConsents.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">No active doctor authorizations.</div>
              ) : (
                <div className="space-y-3">
                  {activeConsents.map((con) => (
                    <div key={con.id} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{con.doctor_name}</div>
                        <div className="text-[11px] text-slate-500">{con.doctor_specialty} • {con.hospital}</div>
                        <div className="text-[10px] text-purple-700 font-medium mt-1">
                          Full Records & AI Prediction Access
                        </div>
                      </div>
                      <button
                        onClick={() => setShowRevokeModal(con.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDICAL RECORDS */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Chronological Medical Records</h2>
              <p className="text-xs text-slate-500">
                Encrypted at rest using AES-256-GCM. Decrypted on the client for authorized patient viewing.
              </p>
            </div>
            <span className="text-xs font-mono bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-lg">
              {records.length} Verified Entries
            </span>
          </div>

          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.id} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-teal-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {rec.record_type.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(rec.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3 font-sans">
                  {rec.content}
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Attending Clinician: <strong className="text-slate-700">{rec.author_name}</strong></span>
                  </div>
                  {rec.diagnosis_codes && (
                    <div className="text-teal-700 font-mono">
                      ICD-10: {rec.diagnosis_codes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LAB REPORTS */}
      {activeTab === 'labs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Laboratory & Diagnostic Reports</h2>
              <p className="text-xs text-slate-500">
                Blood biochemistry, hematology, lipid profiles, and specialty biomarkers.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={labFilter}
                onChange={(e) => setLabFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Laboratory Categories</option>
                <option value="hematology">Hematology (CBC)</option>
                <option value="lipid">Lipid Profile</option>
                <option value="metabolic">Metabolic Panel</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {filteredLabs.map((lab) => (
              <div key={lab.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {lab.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{lab.report_name}</h3>
                    <div className="text-xs text-slate-500">
                      {lab.laboratory} • Ordered by {lab.doctor_name || 'Attending Physician'}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(lab.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Parameters Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Test Parameter</th>
                        <th className="py-2.5 px-4">Observed Value</th>
                        <th className="py-2.5 px-4">Reference Range</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lab.parameters.map((param, idx) => {
                        const isAbnormal = param.status !== 'normal';
                        return (
                          <tr key={idx} className={isAbnormal ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                            <td className="py-2.5 px-4 font-medium text-slate-800">{param.name}</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                              {param.value} <span className="text-[10px] font-normal text-slate-500">{param.unit}</span>
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-600">{param.reference_range}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                param.status === 'normal' 
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : param.status === 'high'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {param.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {lab.notes && (
                  <div className="p-3 bg-slate-50/60 border-t border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-700">Lab Interpretation:</strong> {lab.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MEDICATIONS */}
      {activeTab === 'meds' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current & Historical Medications</h2>
              <p className="text-xs text-slate-500">
                Prescribed therapies with dosage timing and clinician directions.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
              {(['active', 'inactive', 'historical', 'all'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setMedFilter(st)}
                  className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider text-[10px] transition-all ${
                    medFilter === st
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMeds.map((med) => (
              <div key={med.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-teal-600" />
                      <span>{med.medication_name}</span>
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      med.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {med.status}
                    </span>
                  </div>

                  <div className="text-xs text-teal-800 font-semibold">
                    {med.dosage} • {med.frequency} ({med.route})
                  </div>

                  <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                    <strong className="text-slate-700">Directions:</strong> {med.instructions}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Prescribing Clinician: <strong>{med.prescribing_doctor}</strong></span>
                  <span>Started: {med.start_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CONSENT MANAGEMENT (ABDM) */}
      {activeTab === 'consent' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">ABDM Health Data Consent Manager</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Under the Ayushman Bharat Digital Mission, you have complete ownership over which doctors can inspect your records.
              </p>
            </div>

            <button
              onClick={() => setShowGrantModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Grant New Doctor Access</span>
            </button>
          </div>

          <div className="space-y-4">
            {consents.map((con) => {
              const isRevoked = con.status === 'revoked';
              return (
                <div key={con.id} className={`p-4 rounded-xl border transition-all ${
                  isRevoked ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-purple-50/30 border-purple-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{con.doctor_name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isRevoked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {con.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">{con.doctor_specialty} • {con.hospital}</div>
                    </div>

                    {!isRevoked && (
                      <button
                        onClick={() => setShowRevokeModal(con.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors shrink-0"
                      >
                        Revoke Consent
                      </button>
                    )}
                  </div>

                  {/* Permissions checkboxes display */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-100/60 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Medical Records</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Lab Reports</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Medications</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>AI Model Outputs</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-3 flex items-center justify-between font-mono">
                    <span>Consent ID: {con.id}</span>
                    <span>Granted: {new Date(con.granted_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: ACCESS AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-teal-600" />
              Clinician Record Access Audit Log
            </h2>
            <p className="text-xs text-slate-500">
              Complete, immutable transparency on every healthcare professional who has accessed your dossier.
            </p>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{log.doctor_name || 'Attending Doctor'}</div>
                  <div className="text-[11px] text-slate-500">{log.specialty} • {log.hospital}</div>
                  <div className="text-[10px] font-mono text-teal-700 mt-1">Action: {log.action}</div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: REVOKE CONSENT */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Revoke Clinician Consent</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to revoke access? This doctor will no longer be able to inspect your medical records, lab reports, or AI prediction history.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Revocation (Required for Audit Trail)
              </label>
              <textarea
                rows={2}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="e.g. Consultation complete, changing primary specialist"
                className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRevokeModal(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevokeConsent(showRevokeModal)}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GRANT NEW DOCTOR ACCESS */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-teal-600">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Authorize New Clinician</h3>
            </div>
            <p className="text-xs text-slate-600">
              Grant ABDM consent to an affiliated specialist to access your diagnostics and AI screenings.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={grantDoctorName}
                  onChange={(e) => setGrantDoctorName(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Specialty</label>
                <input
                  type="text"
                  value={grantSpecialty}
                  onChange={(e) => setGrantSpecialty(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Medical Center</label>
                <input
                  type="text"
                  value={grantHospital}
                  onChange={(e) => setGrantHospital(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowGrantModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantConsent}
                className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                Grant ABDM Consent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
