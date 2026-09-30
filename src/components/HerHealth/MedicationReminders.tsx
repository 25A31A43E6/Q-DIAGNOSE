import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Check, 
  Filter 
} from 'lucide-react';
import { ReminderItem } from './types';

interface MedicationRemindersProps {
  reminders: ReminderItem[];
  onAddReminder: (item: Omit<ReminderItem, 'id'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

export const MedicationReminders: React.FC<MedicationRemindersProps> = ({
  reminders,
  onAddReminder,
  onToggleComplete,
  onDeleteReminder,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderItem['type']>('medication');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [dosageOrNotes, setDosageOrNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      type,
      date,
      time,
      dosageOrNotes: dosageOrNotes.trim() || undefined,
      doctorName: doctorName.trim() || undefined,
      completed: false,
    });

    setTitle('');
    setDosageOrNotes('');
    setDoctorName('');
    setShowAddModal(false);
  };

  const filteredReminders = filterType === 'all'
    ? reminders
    : reminders.filter(r => r.type === filterType);

  return (
    <div id="herhealth-medication-reminders" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Medication & Appointment Reminders</h2>
          </div>
          <p className="text-xs text-slate-600">
            Keep track of doctor-prescribed treatments, supplements, gynecological checkups, and diagnostic labs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Reminder</span>
        </button>
      </div>

      {/* Safety Non-Prescription Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Non-Prescription Safety Notice:</strong> Reminders configured here are entirely user-managed schedules. HERHEALTH does not evaluate pharmacological interactions, prescribe dosages, or alter medical regimens. Always follow instructions given directly by your licensed physician or pharmacist.
        </p>
      </div>

      {/* List / Filter Card */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#0B1E3D]">Active Schedules</h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              ({reminders.filter(r => !r.completed).length} pending)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Reminders</option>
              <option value="medication">Medication & Supplements</option>
              <option value="appointment">Doctor Appointments</option>
              <option value="followup">Follow-up & Diagnostics</option>
              <option value="treatment">Therapies / Treatment</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredReminders.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                item.completed
                  ? 'bg-slate-50/70 border-slate-200 opacity-70'
                  : 'bg-white border-sky-100 hover:border-teal-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all mt-0.5 cursor-pointer ${
                    item.completed
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 hover:border-emerald-500 bg-white'
                  }`}
                  title={item.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${item.completed ? 'line-through text-slate-500' : 'text-[#0B1E3D]'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </span>
                    {item.doctorName && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-teal-700">{item.doctorName}</span>
                      </>
                    )}
                  </div>

                  {item.dosageOrNotes && (
                    <p className="text-slate-600 text-xs mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      {item.dosageOrNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onDeleteReminder(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredReminders.length === 0 && (
            <p className="text-xs text-slate-500 py-8 text-center">
              No reminders in this view. Click "Add New Reminder" to set a schedule.
            </p>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-[#0B1E3D]">Add New Reminder</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Reminder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Iron & Vitamin C Supplement, OB-GYN Review..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500 capitalize"
                  >
                    <option value="medication">Medication</option>
                    <option value="appointment">Doctor Appointment</option>
                    <option value="followup">Follow-Up Lab</option>
                    <option value="treatment">Treatment / Physical Therapy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor / Clinic (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Neha Verma"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <label className="block font-bold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Take with food, bring ultrasound reports..."
                  value={dosageOrNotes}
                  onChange={(e) => setDosageOrNotes(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
