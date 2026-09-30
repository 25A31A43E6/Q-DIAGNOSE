import React, { useState } from 'react';
import { 
  Activity, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Filter, 
  BarChart2, 
  Smile, 
  Check 
} from 'lucide-react';
import { SymptomLog, SymptomSeverity } from './types';

interface SymptomTrackerProps {
  symptoms: SymptomLog[];
  onAddSymptom: (log: Omit<SymptomLog, 'id'>) => void;
  onDeleteSymptom: (id: string) => void;
}

const COMMON_SYMPTOMS = [
  'Cramps',
  'Headache',
  'Fatigue',
  'Bloating',
  'Breast Tenderness',
  'Back Pain',
  'Nausea',
  'Pelvic Pain',
  'Mood Swings',
  'Acne',
  'Hot Flashes',
  'Other'
] as const;

export const SymptomTracker: React.FC<SymptomTrackerProps> = ({
  symptoms,
  onAddSymptom,
  onDeleteSymptom,
}) => {
  const [selectedSymptom, setSelectedSymptom] = useState<typeof COMMON_SYMPTOMS[number]>('Cramps');
  const [severity, setSeverity] = useState<SymptomSeverity>('mild');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSymptom({
      date,
      time,
      symptomType: selectedSymptom,
      severity,
      notes: notes.trim() || undefined,
    });
    setNotes('');
  };

  // Compute symptom frequency stats
  const frequencyMap: Record<string, { total: number; severe: number }> = {};
  symptoms.forEach((s) => {
    if (!frequencyMap[s.symptomType]) {
      frequencyMap[s.symptomType] = { total: 0, severe: 0 };
    }
    frequencyMap[s.symptomType].total += 1;
    if (s.severity === 'severe') {
      frequencyMap[s.symptomType].severe += 1;
    }
  });

  const sortedFrequencies = Object.entries(frequencyMap).sort((a, b) => b[1].total - a[1].total);

  const filteredSymptoms = filterType === 'all' 
    ? symptoms 
    : symptoms.filter(s => s.symptomType === filterType);

  return (
    <div id="herhealth-symptom-tracker" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Symptom Tracking & Frequency Trends</h2>
          </div>
          <p className="text-xs text-slate-600">
            Record physical sensations and track patterns over time to share with your healthcare provider.
          </p>
        </div>
      </div>

      {/* Main Grid: Form & Frequency Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Log Symptom Card */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#0B1E3D]">Log a Symptom</h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Symptom Type</label>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {COMMON_SYMPTOMS.map((sym) => (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => setSelectedSymptom(sym)}
                    className={`px-3 py-2 rounded-xl text-left font-semibold transition-all cursor-pointer truncate ${
                      selectedSymptom === sym
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Severity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 'mild', label: 'Mild', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { level: 'moderate', label: 'Moderate', color: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { level: 'severe', label: 'Severe', color: 'bg-rose-50 text-rose-800 border-rose-300' }
                ].map(({ level, label, color }) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setSeverity(level as SymptomSeverity)}
                    className={`p-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                      severity === level 
                        ? `${color} ring-2 ring-teal-500` 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Notes / Context (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Occurred after lunch, relieved by warm compress..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Symptom</span>
            </button>
          </form>
        </div>

        {/* Symptom Frequency & Trend Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-[#0B1E3D]">Frequency Distribution</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {symptoms.length} total entries
              </span>
            </div>

            {sortedFrequencies.length > 0 ? (
              <div className="space-y-3 pt-1">
                {sortedFrequencies.map(([symType, counts]) => {
                  const percent = Math.round((counts.total / symptoms.length) * 100);
                  return (
                    <div key={symType} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>{symType}</span>
                        <span>
                          {counts.total} times ({percent}%)
                          {counts.severe > 0 && (
                            <span className="text-rose-600 font-bold ml-1.5">
                              • {counts.severe} severe
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-teal-500"
                          style={{ width: `${Math.min(100, percent * 1.5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">
                No symptoms recorded yet. Add an entry using the form on the left.
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p>
              <strong>Clinical Note:</strong> If symptoms like severe pelvic pain or unyielding headaches worsen over time, consult your gynecologist or healthcare provider.
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0B1E3D]">Symptom History</h3>
            <p className="text-xs text-slate-500">Longitudinal log of recorded symptoms</p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Symptoms</option>
              {COMMON_SYMPTOMS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Symptom</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Notes</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSymptoms.map((entry) => {
                let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (entry.severity === 'moderate') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                if (entry.severity === 'severe') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';

                return (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                      {entry.date} <span className="text-slate-400 text-[11px] font-normal">at {entry.time}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#0B1E3D]">{entry.symptomType}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] border ${badgeColor}`}>
                        {entry.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-sm truncate">
                      {entry.notes || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onDeleteSymptom(entry.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
