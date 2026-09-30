import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Info, 
  AlertCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Droplet,
  Check
} from 'lucide-react';
import { PeriodEntry, CyclePhase } from './types';

interface PeriodCycleTrackerProps {
  cycles: PeriodEntry[];
  onAddCycle: (entry: Omit<PeriodEntry, 'id'>) => void;
  onUpdateCycle: (entry: PeriodEntry) => void;
  onDeleteCycle: (id: string) => void;
}

export const PeriodCycleTracker: React.FC<PeriodCycleTrackerProps> = ({
  cycles,
  onAddCycle,
  onUpdateCycle,
  onDeleteCycle,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [cycleLength, setCycleLength] = useState(28);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | 'spotting'>('medium');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [notes, setNotes] = useState('');

  // Calendar navigation state (year and month)
  const [calDate, setCalDate] = useState(new Date(2026, 8, 1)); // September 2026

  const handleOpenAdd = () => {
    setEditingId(null);
    setStartDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setDate(d.getDate() + 4);
    setEndDate(d.toISOString().split('T')[0]);
    setCycleLength(28);
    setFlow('medium');
    setSymptomsInput('');
    setNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (entry: PeriodEntry) => {
    setEditingId(entry.id);
    setStartDate(entry.startDate);
    setEndDate(entry.endDate);
    setCycleLength(entry.cycleLength);
    setFlow(entry.flow);
    setSymptomsInput(entry.symptomsNoted.join(', '));
    setNotes(entry.notes || '');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const parsedSymptoms = symptomsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingId) {
      onUpdateCycle({
        id: editingId,
        startDate,
        endDate,
        cycleLength: Number(cycleLength),
        periodDuration: duration,
        flow,
        symptomsNoted: parsedSymptoms,
        notes,
      });
    } else {
      onAddCycle({
        startDate,
        endDate,
        cycleLength: Number(cycleLength),
        periodDuration: duration,
        flow,
        symptomsNoted: parsedSymptoms,
        notes,
      });
    }

    setShowAddModal(false);
  };

  // Compute stats
  const avgCycleLength = cycles.length > 0 
    ? Math.round(cycles.reduce((acc, c) => acc + c.cycleLength, 0) / cycles.length)
    : 28;
  const avgPeriodDuration = cycles.length > 0
    ? Math.round(cycles.reduce((acc, c) => acc + c.periodDuration, 0) / cycles.length)
    : 5;

  const latestCycle = cycles[0];
  const lastStart = latestCycle ? new Date(latestCycle.startDate) : new Date();
  const nextEstimatedStart = new Date(lastStart);
  nextEstimatedStart.setDate(lastStart.getDate() + avgCycleLength);

  // Calendar generation for current selected month
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCalDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalDate(new Date(year, month + 1, 1));

  // Helper to check if a day falls within a period
  const getDayStatus = (dayNum: number) => {
    const curDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const targetTime = new Date(curDateStr).getTime();

    for (const c of cycles) {
      const s = new Date(c.startDate).getTime();
      const e = new Date(c.endDate).getTime();
      if (targetTime >= s && targetTime <= e) {
        return { isPeriod: true, flow: c.flow };
      }
    }

    // Check if within predicted window
    const predStart = nextEstimatedStart.getTime();
    const predEnd = predStart + (avgPeriodDuration - 1) * 86400000;
    if (targetTime >= predStart && targetTime <= predEnd) {
      return { isPredicted: true };
    }

    // Check if ovulatory window (~14 days before predicted period)
    const ovuDay = predStart - 14 * 86400000;
    if (Math.abs(targetTime - ovuDay) <= 86400000) {
      return { isOvulatory: true };
    }

    return {};
  };

  return (
    <div id="herhealth-period-tracker" className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Period & Cycle Tracking</h2>
          </div>
          <p className="text-xs text-slate-600">
            Log start and end dates to monitor cycle regularity, phase dynamics, and estimated future windows.
          </p>
        </div>

        <button
          id="btn-add-period-entry"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Period Dates</span>
        </button>
      </div>

      {/* Non-diagnostic Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Notice Regarding Cycle Predictions:</span>
          <p className="text-slate-700 leading-relaxed">
            Future period and fertility windows displayed here are mathematical estimations based on your historical records. They must <strong>never</strong> be used as a method of contraception, medical certainty, or diagnostic determination.
          </p>
        </div>
      </div>

      {/* Statistics & Next Cycle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Average Cycle Length
          </span>
          <div className="text-2xl font-black text-[#0B1E3D]">
            {avgCycleLength} Days
          </div>
          <p className="text-[11px] text-slate-500">Normal clinical range: 21–35 days</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Average Flow Duration
          </span>
          <div className="text-2xl font-black text-[#0B1E3D]">
            {avgPeriodDuration} Days
          </div>
          <p className="text-[11px] text-slate-500">Typical duration: 3–7 days</p>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-3xl border border-rose-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-rose-800 font-bold">
            Estimated Next Period
          </span>
          <div className="text-2xl font-black text-rose-900">
            {nextEstimatedStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <p className="text-[11px] text-rose-700 font-medium">Estimated window based on {cycles.length} recorded cycles</p>
        </div>
      </div>

      {/* Visual Calendar and Cycle Phases Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Calendar View */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1E3D]">
                {calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-500">Visual period calendar and phase markers</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-slate-50/50" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getDayStatus(day);
              
              let bgClass = 'bg-slate-50 hover:bg-slate-100 text-slate-700';
              if (status.isPeriod) {
                bgClass = 'bg-rose-500 text-white font-bold shadow-xs';
              } else if (status.isPredicted) {
                bgClass = 'bg-rose-100 text-rose-900 border border-dashed border-rose-400 font-bold';
              } else if (status.isOvulatory) {
                bgClass = 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold';
              }

              return (
                <div
                  key={`day-${day}`}
                  className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs transition-colors relative ${bgClass}`}
                >
                  <span>{day}</span>
                  {status.isPeriod && (
                    <span className="text-[9px] opacity-80 capitalize hidden sm:block">
                      {status.flow}
                    </span>
                  )}
                  {status.isPredicted && (
                    <span className="text-[8px] opacity-75 hidden sm:block">
                      Est.
                    </span>
                  )}
                  {status.isOvulatory && (
                    <span className="text-[8px] opacity-75 hidden sm:block">
                      Ovu
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-500" />
              <span>Recorded Period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-dashed border-rose-400" />
              <span>Estimated Period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-300" />
              <span>Ovulatory Window</span>
            </div>
          </div>
        </div>

        {/* 4 Cycle Phases Information Card */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-[#0B1E3D]">Understanding Cycle Phases</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span>1. Menstrual Phase</span>
                <span>Days 1–5</span>
              </div>
              <p className="text-slate-600">
                Uterine lining sheds as progesterone and estrogen hit lowest baseline. Rest, warm hydration, and gentle walks are recommended.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span>2. Follicular Phase</span>
                <span>Days 6–13</span>
              </div>
              <p className="text-slate-600">
                Follicle-stimulating hormone (FSH) matures ovarian follicles. Estrogen rises, increasing energy, mental sharpness, and endurance.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>3. Ovulatory Phase</span>
                <span>Days 14–16</span>
              </div>
              <p className="text-slate-600">
                LH surge triggers the release of an egg from the ovary. Basal body temperature shifts slightly. High social and physical vitality.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-indigo-900">
                <span>4. Luteal Phase</span>
                <span>Days 17–28</span>
              </div>
              <p className="text-slate-600">
                Corpus luteum produces progesterone. Metabolism increases slightly. Prioritize magnesium, complex carbs, and stress reduction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recorded Cycle History Table */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B1E3D]">Cycle History Records</h3>
            <p className="text-xs text-slate-500">Edit or delete any recorded entry</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {cycles.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Start Date</th>
                <th className="py-2.5 px-3">End Date</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Cycle Length</th>
                <th className="py-2.5 px-3">Flow</th>
                <th className="py-2.5 px-3">Symptoms / Notes</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cycles.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#0B1E3D]">{entry.startDate}</td>
                  <td className="py-3 px-3 text-slate-600">{entry.endDate}</td>
                  <td className="py-3 px-3 text-slate-600">{entry.periodDuration} days</td>
                  <td className="py-3 px-3 text-slate-600">{entry.cycleLength} days</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold capitalize border border-rose-200">
                      {entry.flow}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {entry.symptomsNoted.length > 0 && (
                      <span className="font-semibold text-slate-700 mr-1">
                        [{entry.symptomsNoted.join(', ')}]
                      </span>
                    )}
                    {entry.notes}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCycle(entry.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-[#0B1E3D]">
              {editingId ? 'Edit Period Entry' : 'Record New Period Entry'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cycle Length (Days)</label>
                  <input
                    type="number"
                    min="18"
                    max="60"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Flow Intensity</label>
                  <select
                    value={flow}
                    onChange={(e: any) => setFlow(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                    <option value="spotting">Spotting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Symptoms (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Mild Cramps, Headache, Fatigue"
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Observations</label>
                <textarea
                  rows={2}
                  placeholder="Any lifestyle or personal observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
