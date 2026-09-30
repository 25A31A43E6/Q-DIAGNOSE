import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText, 
  Database, 
  RefreshCw, 
  Check, 
  Share2, 
  AlertCircle,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { 
  PeriodEntry, 
  SymptomLog, 
  MoodLog, 
  FoodActivityLog, 
  ReminderItem, 
  HerHealthSharingConsent 
} from './types';

interface SecureHealthRecordsProps {
  cycles: PeriodEntry[];
  symptoms: SymptomLog[];
  moods: MoodLog[];
  lifestyle: FoodActivityLog[];
  reminders: ReminderItem[];
  consent: HerHealthSharingConsent;
  onUpdateConsent: (c: HerHealthSharingConsent) => void;
  usingDemoData: boolean;
  onToggleDemoData: () => void;
  onResetAllData: () => void;
}

export const SecureHealthRecords: React.FC<SecureHealthRecordsProps> = ({
  cycles,
  symptoms,
  moods,
  lifestyle,
  reminders,
  consent,
  onUpdateConsent,
  usingDemoData,
  onToggleDemoData,
  onResetAllData,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Export to JSON
  const exportToJson = () => {
    const payload = {
      exportTimestamp: new Date().toISOString(),
      module: 'HERHEALTH - Women\'s Health & Wellness',
      version: '1.0',
      data: {
        cycles,
        symptoms,
        moods,
        lifestyle,
        reminders,
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `herhealth_records_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('JSON archive exported successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Export to CSV
  const exportToCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,ID,Date,Detail1,Detail2,Notes\n';

    cycles.forEach((c) => {
      csvContent += `Period,${c.id},${c.startDate},${c.endDate},CycleLen:${c.cycleLength}d Flow:${c.flow},"${c.notes || ''}"\n`;
    });

    symptoms.forEach((s) => {
      csvContent += `Symptom,${s.id},${s.date},${s.symptomType},Severity:${s.severity},"${s.notes || ''}"\n`;
    });

    moods.forEach((m) => {
      csvContent += `Mood,${m.id},${m.date},Mood:${m.mood},Stress:${m.stressLevel}/5 Sleep:${m.sleepHours}h,"${m.journalNote || ''}"\n`;
    });

    reminders.forEach((r) => {
      csvContent += `Reminder,${r.id},${r.date},${r.title},Type:${r.type} Completed:${r.completed},"${r.dosageOrNotes || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `herhealth_summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV spreadsheet exported successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div id="herhealth-secure-records" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Secure Health Records & Privacy Vault</h2>
          </div>
          <p className="text-xs text-slate-600">
            Encrypted client-side storage, granular authorization controls, and standard medical export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportToCsv}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Security Principles Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-bold">
          <Lock className="w-4 h-4" />
          <span>Strict Client-Controlled Privacy Standards:</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Your reproductive cycle, symptoms, and psychological notes are private. No data is shared with third-party advertisers or insurance providers. Doctor and partner access requires your explicit, revocable cryptographic consent keys.
        </p>
      </div>

      {/* Granular Sharing & Consent Configuration */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0B1E3D]">User-Controlled Authorization Settings</h3>
          <span className="text-[11px] text-slate-400">Updated: {consent.lastUpdated}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0B1E3D] block">Doctor / Clinician Review Access</span>
              <span className="text-slate-500">Allows authorized clinicians to view cycle history during consultations.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                checked={consent.doctorAccessAllowed}
                onChange={(e) => onUpdateConsent({ ...consent, doctorAccessAllowed: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0B1E3D] block">Partner Empathy Sharing</span>
              <span className="text-slate-500">Enables read-only summary card generation for your designated partner.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                checked={consent.shareCycleSummary}
                onChange={(e) => onUpdateConsent({ ...consent, shareCycleSummary: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0B1E3D] block">Include Medication in Shared Summary</span>
              <span className="text-slate-500">Show prescribed supplement and medication names in shared exports.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                checked={consent.shareMedicationList}
                onChange={(e) => onUpdateConsent({ ...consent, shareMedicationList: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#0B1E3D] block">Emergency Red Flag Dispatch</span>
              <span className="text-slate-500">Auto-include emergency contact numbers when red-flag alert is triggered.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                checked={consent.shareEmergencyContactAlerts}
                onChange={(e) => onUpdateConsent({ ...consent, shareEmergencyContactAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Dataset & Demo State Management (SIH 2026 Demonstration) */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Demonstration & Storage Management</h3>
        <p className="text-xs text-slate-600">
          Switch between verified clinical demo datasets (for judging and presentation) and blank personal records.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onToggleDemoData}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              usingDemoData
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{usingDemoData ? 'Using Demo Dataset (Click to Switch)' : 'Using Custom Real Data'}</span>
          </button>

          <button
            onClick={onResetAllData}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
