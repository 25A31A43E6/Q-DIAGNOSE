import React, { useState } from 'react';
import { 
  Brain, 
  Sun, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  UserCheck, 
  Heart, 
  HelpCircle, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Smile, 
  Droplet, 
  Music, 
  Phone,
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { 
  INITIAL_MEDICATIONS, 
  INITIAL_ROUTINES, 
  MEMORY_PROMPT_CARDS, 
  INITIAL_CAREGIVER_NOTES,
  MedicationReminder,
  DailyRoutineItem,
  CaregiverNote
} from '../../data/memoryCareData';

interface PatientMemoryCareViewProps {
  language: SupportedLanguage;
  onOpenAssistantInCalmMode: () => void;
  onOpenSos: () => void;
}

export const PatientMemoryCareView: React.FC<PatientMemoryCareViewProps> = ({
  language,
  onOpenAssistantInCalmMode,
  onOpenSos,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [isCaregiverMode, setIsCaregiverMode] = useState(false);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);

  const [medications, setMedications] = useState<MedicationReminder[]>(INITIAL_MEDICATIONS);
  const [routines, setRoutines] = useState<DailyRoutineItem[]>(INITIAL_ROUTINES);
  const [caregiverNotes, setCaregiverNotes] = useState<CaregiverNote[]>(INITIAL_CAREGIVER_NOTES);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Daily Date & Time Format
  const now = new Date();
  const dayName = now.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
  const dateFormatted = now.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Voice Readout Helper
  const speakGentlePrompt = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const updated = !m.taken;
        if (updated) {
          speakGentlePrompt(`Great job taking your ${m.name}.`);
        }
        return { ...m, taken: updated };
      }
      return m;
    }));
  };

  const handleToggleRoutine = (id: string) => {
    setRoutines(prev => prev.map(r => {
      if (r.id === id) {
        const updated = !r.completed;
        if (updated) {
          speakGentlePrompt(`Wonderful! You completed ${r.title}.`);
        }
        return { ...r, completed: updated };
      }
      return r;
    }));
  };

  const handleAddCaregiverNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote: CaregiverNote = {
      id: `note-${Date.now()}`,
      author: 'Family Caregiver',
      timestamp: 'Just now',
      content: newNoteContent.trim(),
      moodRating: 'Calm & Happy'
    };

    setCaregiverNotes(prev => [newNote, ...prev]);
    setNewNoteContent('');
  };

  return (
    <div id="patient-memory-care-view" className="space-y-8 max-w-5xl mx-auto">
      {/* Top Controls Bar: Patient View vs Caregiver View & Simplified UI Toggle */}
      <div className="bg-white border border-[#DCE8F6] rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm shadow-sky-950/5">
        <div className="flex items-center gap-2 p-1 bg-[#F4F8FA] rounded-2xl border border-[#DCE8F6]">
          <button
            id="btn-memory-patient-view"
            onClick={() => setIsCaregiverMode(false)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              !isCaregiverMode
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-[#2D3748] hover:text-[#0B1E3D]'
            }`}
          >
            Patient Mode (Self & Loved One)
          </button>
          <button
            id="btn-memory-caregiver-view"
            onClick={() => setIsCaregiverMode(true)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isCaregiverMode
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-[#2D3748] hover:text-[#0B1E3D]'
            }`}
          >
            Caregiver Dashboard & Portal
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Simplified Mode Toggle */}
          <button
            id="btn-toggle-simplified-mode"
            onClick={() => setIsSimplifiedMode(!isSimplifiedMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isSimplifiedMode
                ? 'bg-[#FEF9E7] text-[#9A7416] border-[#F6E58D] font-bold'
                : 'bg-white text-[#2D3748] border-[#DCE8F6] hover:bg-sky-50'
            }`}
          >
            <Eye className="w-4 h-4 text-teal-600" />
            <span>{isSimplifiedMode ? 'Simplified (Active)' : 'High Contrast / Large Text'}</span>
          </button>

          {/* One-Tap "I'm Feeling Confused" Emergency Calmer */}
          <button
            id="btn-im-feeling-confused"
            onClick={onOpenAssistantInCalmMode}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform hover:scale-105 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-white" />
            <span>{t.imConfusedButton}</span>
          </button>
        </div>
      </div>

      {/* PATIENT-FACING COGNITIVE SUPPORT VIEW */}
      {!isCaregiverMode ? (
        <div className="space-y-8">
          {/* 1. Daily Orientation Card */}
          <section
            id="daily-orientation-card"
            aria-label="Today's Date, Time, and Weather Orientation"
            className={`p-6 sm:p-8 rounded-3xl border-2 border-teal-500/40 bg-white shadow-sm shadow-sky-950/5 relative overflow-hidden ${
              isSimplifiedMode ? 'text-lg' : ''
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-mono font-bold border border-teal-200">
                  <Sun className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>{t.todayOrientation}</span>
                </span>
                <h1 className={`font-black tracking-tight text-[#0B1E3D] ${isSimplifiedMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
                  Today is {dayName}
                </h1>
                <p className={`text-[#2D3748] font-sans font-medium ${isSimplifiedMode ? 'text-xl' : 'text-base'}`}>
                  {dateFormatted} • <span className="font-mono font-bold text-[#C59B27]">{timeFormatted}</span>
                </p>
                <p className="text-xs text-[#2D3748] opacity-80 pt-1">
                  Warm and pleasant weather today (24°C / 75°F) • You are safe in your home.
                </p>
              </div>

              <button
                onClick={() => speakGentlePrompt(`Today is ${dayName}, ${dateFormatted}. The time is ${timeFormatted}. Everything is calm, safe, and on schedule.`)}
                className="p-4 rounded-2xl bg-white hover:bg-sky-50 border border-[#DCE8F6] text-[#0B1E3D] flex items-center gap-2 text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors"
                title="Read Today's Date and Time Aloud"
              >
                <Volume2 className="w-5 h-5 text-teal-600" />
                <span>Read Aloud</span>
              </button>
            </div>
          </section>

          {/* 2. Medication Schedule & Reminders */}
          <section
            id="medication-schedule-section"
            aria-label="Medication Reminders"
            className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#DCE8F6] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0B1E3D]">{t.medicationReminders}</h2>
                  <p className="text-xs text-[#2D3748] opacity-80">Tap the checkmark after taking your medicine.</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#9A7416] bg-[#FEF9E7] px-2.5 py-1 rounded-lg border border-[#F6E58D]">
                {medications.filter(m => m.taken).length} / {medications.length} Taken
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => handleToggleMedication(med.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    med.taken
                      ? 'bg-teal-50/60 border-teal-400 text-[#2D3748]'
                      : 'bg-white border-[#DCE8F6] hover:border-teal-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#C59B27]">{med.time}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        med.taken ? 'bg-teal-600 border-teal-600 text-white' : 'border-[#DCE8F6] bg-[#F4F8FA]'
                      }`}>
                        {med.taken && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <h3 className={`font-bold mt-2 ${isSimplifiedMode ? 'text-lg' : 'text-sm'} text-[#0B1E3D]`}>
                      {med.name}
                    </h3>
                    <p className="text-xs text-[#2D3748] opacity-75 font-mono mt-0.5">{med.dosage}</p>
                    {med.notes && (
                      <p className="text-[11px] text-[#2D3748] opacity-80 mt-2 italic bg-[#F4F8FA] p-2 rounded-lg border border-[#DCE8F6]">
                        {med.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DCE8F6] flex items-center justify-between text-xs font-semibold">
                    <span className={med.taken ? 'text-teal-700 font-bold' : 'text-[#2D3748] opacity-70'}>
                      {med.taken ? 'Completed' : 'Tap when taken'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakGentlePrompt(`It is time for ${med.name}, ${med.dosage}. ${med.notes || ''}`);
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-teal-700 border border-[#DCE8F6]"
                      title="Audio Reminder"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Daily Routines & Checklists */}
          <section
            id="daily-routines-section"
            aria-label="Daily Routines and Activities"
            className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#DCE8F6] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0B1E3D]">{t.dailyRoutine}</h2>
                  <p className="text-xs text-[#2D3748] opacity-80">Gentle structured steps for a peaceful day.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {routines.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleToggleRoutine(r.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    r.completed
                      ? 'bg-teal-50/50 border-teal-300 opacity-90'
                      : 'bg-white border-[#DCE8F6] hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      r.completed ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}>
                      {r.iconName === 'sun' && <Sun className="w-4 h-4" />}
                      {r.iconName === 'droplet' && <Droplet className="w-4 h-4" />}
                      {r.iconName === 'music' && <Music className="w-4 h-4" />}
                      {r.iconName === 'phone' && <Phone className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className={`font-bold ${isSimplifiedMode ? 'text-base' : 'text-xs sm:text-sm'} text-[#0B1E3D]`}>
                        {r.title}
                      </span>
                      <span className="block text-[11px] font-mono text-[#C59B27] font-bold">{r.time}</span>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    r.completed ? 'bg-teal-600 border-teal-600 text-white' : 'border-[#DCE8F6] bg-[#F4F8FA]'
                  }`}>
                    {r.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Family & Familiar Faces Memory Album */}
          <section
            id="family-memory-prompts-section"
            aria-label="Family and Loved Ones Memory Recall"
            className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#DCE8F6] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <Heart className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0B1E3D]">{t.familyMemoryRecall}</h2>
                  <p className="text-xs text-[#2D3748] opacity-80">Gentle recall reminders about your cherished family members.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MEMORY_PROMPT_CARDS.map((card) => (
                <div key={card.id} className="p-4 rounded-2xl bg-white border border-[#DCE8F6] space-y-3 shadow-xs">
                  <img
                    src={card.photoUrl}
                    alt={card.personName}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover rounded-xl border border-[#DCE8F6]"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                      {card.relationship}
                    </span>
                    <h3 className="text-sm font-bold text-[#0B1E3D] mt-0.5">{card.personName}</h3>
                  </div>

                  <ul className="text-xs text-[#2D3748] space-y-1.5 list-disc list-inside leading-relaxed bg-[#F4F8FA] p-2.5 rounded-xl border border-[#DCE8F6]">
                    {card.memories.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() => speakGentlePrompt(`This is ${card.personName}, your ${card.relationship}. ${card.memories.join(' ')}`)}
                    className="w-full py-2 rounded-xl bg-white hover:bg-sky-50 text-teal-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#DCE8F6]"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Read About {card.personName.split(' ')[0]}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* CAREGIVER PORTAL & DASHBOARD */
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCE8F6] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                  Caregiver Portal (Transparent & Consented)
                </span>
                <h2 className="text-xl font-bold text-[#0B1E3D] mt-0.5">{t.caregiverDashboard}</h2>
                <p className="text-xs text-[#2D3748] opacity-80 mt-1">
                  Manage medication alarms, review daily activity logs, and maintain family memory cards with the patient's awareness.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
              </div>
            </div>

            {/* Caregiver Log Entry Form */}
            <form onSubmit={handleAddCaregiverNote} className="space-y-3 p-4 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3D]">
                Log New Care Observation or Daily Note
              </h3>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="e.g. Took afternoon Donepezil easily, enjoyed 20 mins garden walk, calm mood throughout lunch..."
                className="w-full bg-white border border-[#DCE8F6] rounded-xl p-3 text-xs text-[#2D3748] placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 h-20"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Save Observation</span>
                </button>
              </div>
            </form>

            {/* Historical Caregiver Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">Recent Care Observations</h3>
              {caregiverNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1E3D]">{note.author}</span>
                    <span className="text-[10px] font-mono text-[#C59B27] font-bold">{note.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#2D3748] leading-relaxed">{note.content}</p>
                  <span className="inline-block text-[10px] font-mono bg-[#FEF9E7] text-[#9A7416] px-2 py-0.5 rounded-full border border-[#F6E58D]">
                    Mood: {note.moodRating}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
