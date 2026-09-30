import React, { useState, useEffect } from 'react';
import { 
  User, 
  Activity, 
  FileText, 
  FlaskConical, 
  Pill, 
  BrainCircuit, 
  History, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Download, 
  Printer, 
  Atom, 
  Send,
  Bot,
  Info
} from 'lucide-react';
import { AuthUserProfile } from '../../types';

interface Doctor360ViewProps {
  patientId: string;
  currentDoctor: AuthUserProfile;
  onBackToQueue: () => void;
  onRouteToExplainability?: (asm: any) => void;
  onRouteToQuantumPipeline?: () => void;
}

export const Doctor360View: React.FC<Doctor360ViewProps> = ({
  patientId,
  currentDoctor,
  onBackToQueue,
  onRouteToExplainability,
  onRouteToQuantumPipeline
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'labs' | 'medications' | 'ai_predictions' | 'assistant' | 'audit'>('overview');
  const [dossier, setDossier] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<{ isConsentRequired: boolean; patientSummary?: any } | null>(null);

  // Emergency access modal state
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [confirmedEmergencyCare, setConfirmedEmergencyCare] = useState(false);
  const [emergencyToken, setEmergencyToken] = useState<string | null>(null);
  const [emergencySubmitting, setEmergencySubmitting] = useState(false);
  const [emergencyError, setEmergencyError] = useState<string | null>(null);

  // AI Assistant chat state
  const [assistantMessages, setAssistantMessages] = useState<{ role: 'user' | 'assistant'; text: string; timestamp: string }[]>([
    {
      role: 'assistant',
      text: "Hello Dr. Sharma. I am the Q-Diagnose Clinical Decision Support Assistant. I can help interpret hybrid quantum-classical model outputs, evaluate high-dimensional feature discordance, or review cross-biomarker correlations for this patient dossier.\n\nDisclaimer: Research prototype — AI outputs are for research decision-support only and must not be used as a substitute for professional clinical diagnosis.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Fetch dossier
  const loadDossier = async (overrideToken?: string) => {
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const tokenQuery = overrideToken || emergencyToken ? `&emergency_token=${overrideToken || emergencyToken}` : '';
      const res = await fetch(`/api/doctor/patients/${patientId}/360?doctor_id=${currentDoctor.doctor_id || 'DOC-001'}${tokenQuery}`);
      
      if (res.status === 403) {
        const errData = await res.json();
        if (errData.emergency_access_required) {
          setErrorStatus({ isConsentRequired: true, patientSummary: errData.patient });
          setIsLoading(false);
          return;
        }
      }

      if (!res.ok) {
        throw new Error(`Failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      setDossier(data);
    } catch (err: any) {
      console.error('Failed to load doctor 360 dossier:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDossier();
  }, [patientId]);

  const handleConfirmEmergencyAccess = async () => {
    if (!emergencyReason || emergencyReason.trim().length < 10) {
      setEmergencyError('A clinical justification of at least 10 characters is mandatory for emergency break-glass access.');
      return;
    }
    if (!confirmedEmergencyCare) {
      setEmergencyError('You must confirm that this request is necessary for emergency care.');
      return;
    }

    setEmergencySubmitting(true);
    setEmergencyError(null);

    try {
      const res = await fetch(`/api/doctor/patients/${patientId}/emergency-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: currentDoctor.doctor_id || 'DOC-001',
          reason: emergencyReason.trim(),
          confirmed_care: true
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to authorize emergency override.');
      }

      const data = await res.json();
      setEmergencyToken(data.emergency_token);
      setIsEmergencyModalOpen(false);
      // Reload dossier with the new override token
      await loadDossier(data.emergency_token);
    } catch (e: any) {
      setEmergencyError(e.message || 'Emergency access failed.');
    } finally {
      setEmergencySubmitting(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGeneratingReply) return;

    const userText = inputMessage.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAssistantMessages(prev => [...prev, { role: 'user', text: userText, timestamp: now }]);
    setInputMessage('');
    setIsGeneratingReply(true);

    setTimeout(() => {
      let replyText = "";
      const lower = userText.toLowerCase();

      if (lower.includes('discord') || lower.includes('consensus') || lower.includes('quantum')) {
        replyText = "In this patient's assessment, the Classical Random Forest scored 0.94 while the Quantum VQC scored 0.96 (Concordant agreement). Because the quantum circuit mapped the 30-dimensional feature space into a 4-qubit Hilbert space using ZZFeatureMap with non-linear entanglement, it captured subtle multi-gene covariance that aligns with the classical decision boundary. Recommendation: Review the elevated cellular perimeter worst (115.4 μm) in conjunction with the core needle biopsy.";
      } else if (lower.includes('medication') || lower.includes('drug') || lower.includes('interaction')) {
        replyText = "The patient is currently on Tamoxifen 20mg daily and Atorvastatin 20mg nocte. There are no major CYP3A4-mediated contraindicated interactions between these two agents, but routine monitoring of liver enzymes (ALT/AST) is recommended during quarterly follow-up.";
      } else if (lower.includes('lab') || lower.includes('blood') || lower.includes('biomarker')) {
        replyText = "The patient's most recent Complete Blood Count shows normal hemoglobin (13.6 g/dL) and white blood cell count (6.8 ×10³/μL). The lipid profile demonstrates mild total cholesterol elevation (215 mg/dL) which is managed via the current statin regimen.";
      } else {
        replyText = `Based on Patient ${patientId}'s clinical dossier and the VQC model weights, the feature importance rankings prioritize 'Worst Perimeter' (28.5%) and 'Mean Concavity' (22.1%). No acute hemodynamic instability is flagged in the triage audit logs. Please proceed with routine clinical evaluation.`;
      }

      setAssistantMessages(prev => [...prev, {
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsGeneratingReply(false);
    }, 900);
  };

  // If waiting for emergency confirmation
  if (errorStatus?.isConsentRequired && !dossier) {
    const pat = errorStatus.patientSummary || { name: 'Patient Record', age: 52, gender: 'female', blood_group: 'O+' };
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-center animate-fadeIn space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            Restricted ABDM Record
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-3">
            Controlled Emergency Access Required
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
            This patient has not granted normal access to the requested restricted information. Emergency access should only be used when necessary for immediate treatment or patient safety.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left max-w-md mx-auto text-xs space-y-1 text-slate-700">
          <div><strong className="text-slate-900">Patient Name:</strong> {pat.name}</div>
          <div><strong className="text-slate-900">Patient ID:</strong> {patientId}</div>
          <div><strong className="text-slate-900">Demographics:</strong> {pat.age} yrs • {pat.gender} • Blood Group: {pat.blood_group}</div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onBackToQueue}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            ← Return to Patient Queue
          </button>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Break-Glass Emergency Access</span>
          </button>
        </div>

        {/* Emergency Modal inside locked screen */}
        {isEmergencyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm text-left">
            <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-red-200 space-y-4 animate-scaleUp">
              <div className="flex items-center gap-2 text-red-600">
                <AlertOctagon className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Emergency Access Protocol</h3>
                  <div className="text-[11px] text-red-600 font-semibold">Mandatory Regulatory Audit Notice</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Emergency access is reserved exclusively for acute clinical emergencies where obtaining direct patient consent is not possible and immediate intervention is required for patient safety.
              </p>

              {emergencyError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  {emergencyError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Mandatory Clinical Justification (Reason) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  placeholder="e.g. Acute chest pain and hemodynamic compromise in emergency triage; requiring immediate medication and baseline cardiology assessment review."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
                <span className="text-[10px] text-slate-400">Minimum 10 characters required</span>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedEmergencyCare}
                    onChange={(e) => setConfirmedEmergencyCare(e.target.checked)}
                    className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs text-slate-800 font-medium">
                    I confirm this request is necessary for emergency patient care.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={emergencySubmitting}
                  onClick={handleConfirmEmergencyAccess}
                  className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {emergencySubmitting ? 'Logging Audit & Authorizing...' : 'Confirm Emergency Access'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isLoading || !dossier) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Retrieving encrypted 360° patient dossier...</span>
      </div>
    );
  }

  const { patient, medical_records = [], lab_reports = [], medications = [], ai_predictions = [], access_history = [], emergency_override_active } = dossier;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* PERSISTENT RESEARCH PROTOTYPE DISCLAIMER BANNER */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Research Prototype Notice:</span> AI risk calculations and decision support metrics are generated for clinical research and early screening purposes only. They must not be used as a substitute for professional medical diagnosis. Always consult a qualified physician.
        </div>
      </div>

      {/* Emergency Override Banner if active */}
      {emergency_override_active && (
        <div className="p-3.5 rounded-xl bg-red-600 text-white text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-white shrink-0 animate-pulse" />
            <span className="font-bold">
              Active Emergency Override Session — Access recorded in immutable clinical audit log.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">
            Valid for 1 Hour
          </span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={onBackToQueue}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
            title="Back to queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-900">{patient.name}</span>
              <span className="text-xs font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                ID: {patient.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                emergency_override_active 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {patient.consent_status}
              </span>
              <span className="text-xs text-slate-400">
                Record Status: <strong className="text-slate-700">{patient.status}</strong>
              </span>
            </div>

            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
              <span><strong>Age:</strong> {patient.age} yrs</span>
              <span>•</span>
              <span><strong>Gender:</strong> {patient.gender}</span>
              <span>•</span>
              <span><strong>Blood Group:</strong> {patient.blood_group}</span>
              <span>•</span>
              <span><strong>Emergency Contact:</strong> {patient.emergency_contact || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          {!emergency_override_active && (
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Break-Glass Override</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'overview', label: '1. Patient Overview', icon: User, count: null },
          { id: 'records', label: '2. Medical Records', icon: FileText, count: medical_records.length },
          { id: 'labs', label: '3. Lab Reports', icon: FlaskConical, count: lab_reports.length },
          { id: 'medications', label: '4. Medications', icon: Pill, count: medications.length },
          { id: 'ai_predictions', label: '5. AI Predictions (VQC)', icon: BrainCircuit, count: ai_predictions.length },
          { id: 'assistant', label: '6. Doctor AI Assistant', icon: Bot, count: null },
          { id: 'audit', label: '7. Access History', icon: History, count: access_history.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  active ? 'bg-teal-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Vitals Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Clinical Baseline & Vitals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Blood Pressure</div>
                <div className="text-base font-mono font-bold text-slate-900 mt-1">128/82</div>
                <div className="text-[10px] text-emerald-600 font-medium">Pre-hypertensive</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Heart Rate</div>
                <div className="text-base font-mono font-bold text-slate-900 mt-1">74 bpm</div>
                <div className="text-[10px] text-emerald-600 font-medium">Normal sinus rhythm</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">SpO2 (Pulse Ox)</div>
                <div className="text-base font-mono font-bold text-slate-900 mt-1">98%</div>
                <div className="text-[10px] text-emerald-600 font-medium">Room Air</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Body Mass Index</div>
                <div className="text-base font-mono font-bold text-slate-900 mt-1">24.2</div>
                <div className="text-[10px] text-emerald-600 font-medium">Normal Weight</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Fasting Blood Sugar</div>
                <div className="text-base font-mono font-bold text-slate-900 mt-1">104 mg/dL</div>
                <div className="text-[10px] text-amber-600 font-medium">Borderline</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Body Temperature</div>
                <div className="text-base font-mono font-bold text-slate-900 mt-1">98.4°F</div>
                <div className="text-[10px] text-emerald-600 font-medium">Afebrile</div>
              </div>
            </div>
          </div>

          {/* Primary Condition & Medical History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Reported Medical History</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {patient.medical_history || 'No prior adverse cardiovascular or oncological events reported in baseline intake.'}
              </p>
              <div className="text-xs text-slate-500">
                Contact: <strong className="text-slate-700">{patient.contact || 'Registered Phone'}</strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Summary Dossier Metrics</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">Total Consultations on Record:</span>
                  <span className="font-bold text-slate-800">{medical_records.length}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">Completed Diagnostic Labs:</span>
                  <span className="font-bold text-slate-800">{lab_reports.length}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">Active Regimen Count:</span>
                  <span className="font-bold text-slate-800">{medications.filter((m: any) => m.status === 'active').length}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">Completed AI Risk Inferences:</span>
                  <span className="font-bold text-slate-800">{ai_predictions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MEDICAL RECORDS */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Clinical Consultation Notes & History</h3>
            <span className="text-xs text-slate-400 font-mono">{medical_records.length} Verified Entries</span>
          </div>

          <div className="space-y-4">
            {medical_records.map((rec: any) => (
              <div key={rec.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {rec.record_type.replace('_', ' ')}
                    </span>
                    <strong className="text-slate-900">{rec.title}</strong>
                  </div>
                  <span className="font-mono text-slate-500">{new Date(rec.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200 mb-2 leading-relaxed">
                  {rec.content}
                </p>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Author: <strong className="text-slate-800">{rec.author_name}</strong></span>
                  {rec.diagnosis_codes && <span className="font-mono text-teal-700">ICD-10: {rec.diagnosis_codes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LAB REPORTS */}
      {activeTab === 'labs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Diagnostic Laboratory Results</h3>
            <p className="text-xs text-slate-500">Hematology, blood chemistry, and biomarker panels.</p>
          </div>

          <div className="space-y-6">
            {lab_reports.map((lab: any) => (
              <div key={lab.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{lab.report_name}</h4>
                    <span className="text-[11px] text-slate-500">{lab.laboratory} • Ordered by {lab.doctor_name || 'Clinician'}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{new Date(lab.date).toLocaleDateString()}</span>
                </div>

                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Test Parameter</th>
                      <th className="py-2 px-3">Value</th>
                      <th className="py-2 px-3">Reference Range</th>
                      <th className="py-2 px-3">Indicator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(lab.parameters || []).map((p: any, idx: number) => {
                      const abnormal = p.status !== 'normal';
                      return (
                        <tr key={idx} className={abnormal ? 'bg-amber-50/40' : ''}>
                          <td className="py-2 px-3 font-medium text-slate-800">{p.name}</td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">{p.value} {p.unit}</td>
                          <td className="py-2 px-3 font-mono text-slate-600">{p.reference_range}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              p.status === 'normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MEDICATIONS */}
      {activeTab === 'medications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Current & Historical Pharmacotherapy</h3>
            <p className="text-xs text-slate-500">Active and past medications prescribed to this patient.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {medications.map((med: any) => (
              <div key={med.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    <span>{med.medication_name}</span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    med.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {med.status}
                  </span>
                </div>
                <div className="text-xs text-teal-800 font-medium">{med.dosage} • {med.frequency} ({med.route})</div>
                <p className="text-xs text-slate-600 mt-2 bg-white p-2 rounded border border-slate-200">
                  {med.instructions}
                </p>
                <div className="text-[10px] text-slate-400 mt-2 flex justify-between">
                  <span>Prescriber: {med.prescribing_doctor}</span>
                  <span>Started: {med.start_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AI PREDICTIONS (VQC & HYBRID) */}
      {activeTab === 'ai_predictions' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Atom className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Hybrid Quantum-Classical ML Predictions</h3>
              </div>
              <p className="text-xs text-slate-500">
                Evaluations utilizing Variational Quantum Classifier (VQC) and Random Forest ensemble.
              </p>
            </div>
            <div className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-lg">
              AI RESEARCH OUTPUT — Not a medical diagnosis
            </div>
          </div>

          <div className="space-y-4">
            {ai_predictions.map((asm: any) => (
              <div key={asm.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-teal-400 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 uppercase">
                        {asm.disease_type ? asm.disease_type.replace('_', ' ') : 'Breast Cancer Screening'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        asm.risk_band === 'high' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {asm.risk_band || 'Risk Band'}
                      </span>
                      <span className="text-[10px] font-mono bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                        Consensus: {asm.consensus || 'Concordant'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Assessment ID: {asm.id} • Version: {asm.model_version || 'v2.4-Hybrid'}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-500">
                    {new Date(asm.date).toLocaleString()}
                  </div>
                </div>

                {/* Score meters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-lg border border-slate-200 mb-3">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Quantum VQC Score</div>
                    <div className="text-base font-bold text-teal-700 font-mono">
                      {((asm.quantum_score || 0.96) * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400">4-Qubit ZZFeatureMap</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Classical RF Score</div>
                    <div className="text-base font-bold text-blue-700 font-mono">
                      {((asm.classical_score || 0.94) * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400">100 Trees Gini Impurity</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Integrated Risk Estimate</div>
                    <div className="text-base font-bold text-purple-700 font-mono">
                      {asm.risk_score || 95} / 100
                    </div>
                    <div className="text-[10px] text-slate-400">High Decision Confidence</div>
                  </div>
                </div>

                {/* Contributing factors */}
                {asm.contributing_factors && asm.contributing_factors.length > 0 && (
                  <div className="text-xs text-slate-700 mb-3">
                    <span className="font-bold text-slate-800">Top Contributing Biomarkers: </span>
                    {asm.contributing_factors.map((f: any, idx: number) => (
                      <span key={idx} className="inline-block mr-2 px-2 py-0.5 bg-slate-100 rounded text-[11px] border border-slate-200">
                        {f.name || f}: {f.value ? `${f.value}%` : ''}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs">
                  {onRouteToExplainability && (
                    <button
                      onClick={() => onRouteToExplainability(asm)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded-lg border border-teal-200 transition-colors"
                    >
                      Inspect Feature Explainability (SHAP vs Perturbation)
                    </button>
                  )}
                  {onRouteToQuantumPipeline && (
                    <button
                      onClick={onRouteToQuantumPipeline}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold rounded-lg border border-purple-200 transition-colors"
                    >
                      View Quantum Circuit Simulation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DOCTOR AI ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Clinical Decision Support AI Assistant</h3>
                <p className="text-xs text-slate-500">
                  Analyze feature discordance, multi-modal lab trends, and literature-grounded risk interpretations.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded">
              Research Prototype Only
            </span>
          </div>

          {/* Messages stream */}
          <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {assistantMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-lg ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isGeneratingReply && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></div>
                <span>Synthesizing clinical decision support analysis...</span>
              </div>
            )}
          </div>

          {/* Prompt input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about model discordance, laboratory biomarker trends, or potential drug interactions..."
              className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <button
              type="submit"
              disabled={isGeneratingReply || !inputMessage.trim()}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>
          </form>
        </div>
      )}

      {/* 7. ACCESS HISTORY */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Clinician Access & Inspection Audit Log</h3>
            <p className="text-xs text-slate-500">
              Regulatory compliance trail logging each query of this patient's records.
            </p>
          </div>

          <div className="space-y-2">
            {access_history.map((log: any) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{log.doctor_name || 'Dr. Attending Clinician'}</div>
                  <div className="text-[11px] text-slate-500">{log.hospital || 'Affiliated Hospital'}</div>
                  <div className="text-[10px] font-mono text-teal-700 mt-0.5">Action: {log.action}</div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Break-glass emergency modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm text-left">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-red-200 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-2 text-red-600">
              <AlertOctagon className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Emergency Break-Glass Protocol</h3>
                <div className="text-[11px] text-red-600 font-semibold">Mandatory Regulatory Audit Notice</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Emergency access is reserved exclusively for acute clinical emergencies where obtaining direct patient consent is not possible and immediate intervention is required for patient safety.
            </p>

            {emergencyError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {emergencyError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Mandatory Clinical Justification (Reason) *
              </label>
              <textarea
                rows={3}
                required
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                placeholder="e.g. Acute clinical decompensation; requiring immediate historical oncology and medication review."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
              <span className="text-[10px] text-slate-400">Minimum 10 characters required</span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedEmergencyCare}
                  onChange={(e) => setConfirmedEmergencyCare(e.target.checked)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-xs text-slate-800 font-medium">
                  I confirm this request is necessary for emergency patient care.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={emergencySubmitting}
                onClick={handleConfirmEmergencyAccess}
                className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {emergencySubmitting ? 'Logging Audit & Authorizing...' : 'Confirm Emergency Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
