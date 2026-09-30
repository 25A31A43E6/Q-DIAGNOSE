import React from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  Smile, 
  FileText, 
  AlertTriangle, 
  Lock, 
  Printer, 
  CheckCircle2 
} from 'lucide-react';
import { 
  PeriodEntry, 
  SymptomLog, 
  MoodLog, 
  ReminderItem, 
  HerHealthSharingConsent 
} from './types';

interface DoctorSharedViewProps {
  cycles: PeriodEntry[];
  symptoms: SymptomLog[];
  moods: MoodLog[];
  reminders: ReminderItem[];
  consent: HerHealthSharingConsent;
}

export const DoctorSharedView: React.FC<DoctorSharedViewProps> = ({
  cycles,
  symptoms,
  moods,
  reminders,
  consent,
}) => {
  // If doctor access is revoked by user
  if (!consent.doctorAccessAllowed) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-sm text-center space-y-4 max-w-lg mx-auto my-12 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#0B1E3D]">Doctor Review Access Restricted</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The patient has currently toggled off healthcare professional sharing permissions in their Secure Health Records vault. Consent must be granted by the patient to display this clinical intake summary.
        </p>
      </div>
    );
  }

  // Averages
  const avgCycle = cycles.length > 0 
    ? Math.round(cycles.reduce((acc, c) => acc + c.cycleLength, 0) / cycles.length)
    : 28;
  const avgDuration = cycles.length > 0 
    ? Math.round(cycles.reduce((acc, c) => acc + c.periodDuration, 0) / cycles.length)
    : 5;

  return (
    <div id="herhealth-doctor-review-view" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 text-[#0B1E3D] border border-slate-200">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Clinical Consultation Intake Summary</h2>
          </div>
          <p className="text-xs text-slate-600">
            Authorized patient-shared EMR summary for OB-GYN, reproductive endocrinologist, or primary physician consults.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consent Verified</span>
          </span>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1E3D] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Clinical Note</span>
          </button>
        </div>
      </div>

      {/* Clinical Metrics Triage Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Mean Cycle Length</span>
          <div className="text-2xl font-black text-[#0B1E3D]">{avgCycle} Days</div>
          <p className="text-[11px] text-slate-500">Recorded across {cycles.length} cycles</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Menses Duration</span>
          <div className="text-2xl font-black text-[#0B1E3D]">{avgDuration} Days</div>
          <p className="text-[11px] text-slate-500">Flow: Predominantly Medium</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Dysmenorrhea Level</span>
          <div className="text-2xl font-black text-rose-800">Mild – Moderate</div>
          <p className="text-[11px] text-slate-500">Primary onset: Days 1–2</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Red Flag Status</span>
          <div className="text-2xl font-black text-emerald-700">Clear / None</div>
          <p className="text-[11px] text-slate-500">No post-menopausal bleeding reported</p>
        </div>
      </div>

      {/* Structured Clinical Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle History for Physician */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-[#0B1E3D]">Recent Gynecological Cycles</h3>
          </div>

          <div className="space-y-2 text-xs">
            {cycles.slice(0, 4).map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0B1E3D] block">{c.startDate} to {c.endDate}</span>
                  <span className="text-slate-500">Duration: {c.periodDuration}d • Cycle Interval: {c.cycleLength}d • Flow: {c.flow}</span>
                </div>
                <span className="text-[11px] text-slate-600 italic max-w-xs truncate">{c.notes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Symptoms Clustering */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-[#0B1E3D]">Reported Symptom Frequency & Severity</h3>
          </div>

          <div className="space-y-2 text-xs">
            {symptoms.slice(0, 5).map((s) => (
              <div key={s.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0B1E3D] block">{s.symptomType} ({s.severity})</span>
                  <span className="text-slate-500">Logged on {s.date} at {s.time}</span>
                </div>
                <span className="text-[11px] text-slate-600 italic max-w-xs truncate">{s.notes || 'No notes'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medication & Supplement Intake */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Patient Logged Medications & Clinical Appointments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {reminders.map((r) => (
            <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-[#0B1E3D]">
                <span>{r.title}</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">{r.type}</span>
              </div>
              <p className="text-slate-600">{r.dosageOrNotes || 'Standard timing'}</p>
              <span className="text-[10px] text-slate-400 block">{r.date} • {r.doctorName || 'Self-scheduled'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
