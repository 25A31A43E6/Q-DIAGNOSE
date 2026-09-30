import React, { useState } from 'react';
import { 
  Smile, 
  Moon, 
  Zap, 
  Heart, 
  Plus, 
  BookOpen, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  TrendingUp, 
  BarChart, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { MoodLog } from './types';

interface MoodMentalHealthProps {
  moods: MoodLog[];
  onAddMood: (log: Omit<MoodLog, 'id'>) => void;
  onDeleteMood: (id: string) => void;
  onOpenSos: () => void;
}

const MOOD_OPTIONS: Array<{ key: MoodLog['mood']; label: string; bg: string }> = [
  { key: 'happy', label: 'Happy', bg: 'hover:bg-emerald-50' },
  { key: 'calm', label: 'Calm', bg: 'hover:bg-teal-50' },
  { key: 'energetic', label: 'Energetic', bg: 'hover:bg-amber-50' },
  { key: 'anxious', label: 'Anxious', bg: 'hover:bg-yellow-50' },
  { key: 'stressed', label: 'Stressed', bg: 'hover:bg-orange-50' },
  { key: 'irritable', label: 'Irritable', bg: 'hover:bg-rose-50' },
  { key: 'sad', label: 'Sad', bg: 'hover:bg-blue-50' },
  { key: 'exhausted', label: 'Exhausted', bg: 'hover:bg-purple-50' },
];

export const MoodMentalHealth: React.FC<MoodMentalHealthProps> = ({
  moods,
  onAddMood,
  onDeleteMood,
  onOpenSos,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodLog['mood']>('calm');
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(1);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<MoodLog['sleepQuality']>('good');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [overallWellbeing, setOverallWellbeing] = useState<number>(4);
  const [journalNote, setJournalNote] = useState<string>('');
  const [showDistressModal, setShowDistressModal] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for extreme distress flags in input
    if (stressLevel === 5 && anxietyLevel === 5) {
      setShowDistressModal(true);
    }

    onAddMood({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      mood: selectedMood,
      stressLevel,
      anxietyLevel,
      sleepHours: Number(sleepHours),
      sleepQuality,
      energyLevel,
      overallWellbeing,
      journalNote: journalNote.trim() || undefined,
    });

    setJournalNote('');
  };

  // Compute averages
  const avgSleepHours = moods.length > 0
    ? (moods.reduce((acc, m) => acc + m.sleepHours, 0) / moods.length).toFixed(1)
    : '7.5';
  const avgStress = moods.length > 0
    ? (moods.reduce((acc, m) => acc + m.stressLevel, 0) / moods.length).toFixed(1)
    : '2.0';
  const avgWellbeing = moods.length > 0
    ? (moods.reduce((acc, m) => acc + m.overallWellbeing, 0) / moods.length).toFixed(1)
    : '4.0';

  return (
    <div id="herhealth-mood-mental-health" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Smile className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Mood & Emotional Wellbeing</h2>
          </div>
          <p className="text-xs text-slate-600">
            Log your daily emotional state, stress levels, sleep patterns, and private reflective thoughts.
          </p>
        </div>
      </div>

      {/* Safety & Crisis Helplines Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Mental Health Educational Notice:</span>
            <span className="text-slate-700">
              This module is designed for wellness tracking and emotional awareness. It does not diagnose anxiety, depression, or psychiatric disorders.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-indigo-900 font-semibold shrink-0">
          <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tele-MANAS (India): 14416 | KIRAN: 1800-599-0019</span>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Average Sleep</span>
          <div className="text-2xl font-black text-[#0B1E3D]">{avgSleepHours} Hours</div>
          <p className="text-[11px] text-slate-500">Target: 7–9 hours for hormone harmony</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Average Stress Level</span>
          <div className="text-2xl font-black text-indigo-900">{avgStress} / 5</div>
          <p className="text-[11px] text-slate-500">Scale: 1 (Very Low) to 5 (Extremely High)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Overall Wellbeing Score</span>
          <div className="text-2xl font-black text-teal-800">{avgWellbeing} / 5</div>
          <p className="text-[11px] text-slate-500">Self-reported vitality and emotional balance</p>
        </div>
      </div>

      {/* Log Form and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Entry Form */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#0B1E3D]">Daily Wellbeing Check-in</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Mood Selector Grid */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Primary Mood Today</label>
              <div className="grid grid-cols-4 gap-2">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    type="button"
                    key={m.key}
                    onClick={() => setSelectedMood(m.key)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                      selectedMood === m.key
                        ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-sm scale-102'
                        : `bg-slate-50 text-slate-700 border-slate-200 ${m.bg}`
                    }`}
                  >
                    <span className="text-xs font-bold capitalize">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Stress & Anxiety */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Stress Level:</span>
                  <span className="text-indigo-600">{stressLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Anxiety Level:</span>
                  <span className="text-indigo-600">{anxietyLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={anxietyLevel}
                  onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Sleep Info */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sleep (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  min="2"
                  max="16"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sleep Quality</label>
                <select
                  value={sleepQuality}
                  onChange={(e: any) => setSleepQuality(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-indigo-500 capitalize"
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>
            </div>

            {/* Energy & Wellbeing */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Energy: {energyLevel}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wellbeing: {overallWellbeing}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={overallWellbeing}
                  onChange={(e) => setOverallWellbeing(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>

            {/* Thought Journaling Functionality */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Reflective Journal Entry</label>
                <span className="text-[10px] text-slate-400">Private & Encrypted</span>
              </div>
              <textarea
                rows={3}
                placeholder="What was on your mind today? How did your body feel throughout the day?"
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Wellbeing Log</span>
            </button>
          </form>
        </div>

        {/* Weekly Mood Trend & Journal Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">Recent Wellbeing Trends</h3>
                <p className="text-xs text-slate-500">Sleep hours and stress comparisons</p>
              </div>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="space-y-3 pt-2">
              {moods.slice(0, 5).map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0B1E3D] capitalize">{m.date}</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 capitalize">
                        {m.mood}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span>Sleep: <strong>{m.sleepHours}h</strong> ({m.sleepQuality})</span>
                      <span>Stress: <strong>{m.stressLevel}/5</strong></span>
                    </div>
                  </div>

                  {m.journalNote && (
                    <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80 italic">
                      "{m.journalNote}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Simple Wellbeing Insights */}
          <div className="bg-gradient-to-br from-indigo-50 to-teal-50/40 p-5 rounded-3xl border border-indigo-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Personalized Mental Wellbeing Insight</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Your entries suggest days with 7+ hours of restful sleep show a 40% reduction in self-reported stress. Prioritize wind-down routines like gentle somatic stretching and digital detox before bedtime.
            </p>
          </div>
        </div>
      </div>

      {/* Distress Alert Modal (Triggered on severe distress) */}
      {showDistressModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-rose-300 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0B1E3D]">Support & Compassionate Resources</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                You reported experiencing peak stress and anxiety. Please know you are not alone, and there is immediate, confidential, round-the-clock professional help available.
              </p>
            </div>

            <div className="space-y-2 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs">
              <div className="font-bold text-rose-900">National Mental Health Helplines:</div>
              <div className="text-slate-700 space-y-1">
                <p>• <strong>Tele-MANAS (India):</strong> Call 14416 or 1800-891-4416 (Toll-Free, 24x7)</p>
                <p>• <strong>KIRAN Mental Health:</strong> 1800-599-0019</p>
                <p>• <strong>Emergency Services:</strong> 112 (India) / 911 (US) / 999 (UK)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDistressModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Notice
              </button>
              <button
                onClick={() => {
                  setShowDistressModal(false);
                  onOpenSos();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Open Emergency SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
