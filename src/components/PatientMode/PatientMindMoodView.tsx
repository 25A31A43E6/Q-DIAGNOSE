import React, { useState } from 'react';
import { 
  Smile, 
  Heart, 
  Wind, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  PhoneCall, 
  Volume2, 
  Sparkles, 
  AlertOctagon, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Feather
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { 
  PHQ9_QUESTIONS, 
  GAD7_QUESTIONS, 
  SCALE_OPTIONS, 
  COPING_RESOURCES, 
  CRISIS_CONTACTS 
} from '../../data/mindMoodData';

interface PatientMindMoodViewProps {
  language: SupportedLanguage;
  onOpenSos: () => void;
  onOpenCalmAssistant: () => void;
}

export const PatientMindMoodView: React.FC<PatientMindMoodViewProps> = ({
  language,
  onOpenSos,
  onOpenCalmAssistant,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'phq9' | 'gad7' | 'coping' | 'tracker'>('phq9');

  // Screener state for PHQ-9
  const [phq9Answers, setPhq9Answers] = useState<Record<number, number>>({});
  const [phq9Submitted, setPhq9Submitted] = useState(false);

  // Screener state for GAD-7
  const [gad7Answers, setGad7Answers] = useState<Record<number, number>>({});
  const [gad7Submitted, setGad7Submitted] = useState(false);

  // Daily Mood Log State
  const [selectedMood, setSelectedMood] = useState<string | null>('Calm & Content');
  const [moodNotes, setMoodNotes] = useState('');
  const [moodLogs, setMoodLogs] = useState<Array<{ id: string; mood: string; note: string; date: string }>>([
    { id: '1', mood: 'Calm & Content', note: 'Took a morning walk in the park.', date: 'Yesterday' }
  ]);

  // Handle PHQ-9 calculation
  const phq9Total: number = (Object.values(phq9Answers) as number[]).reduce((a: number, b: number) => a + b, 0);
  const phq9HasQ9Flag = (phq9Answers[9] || 0) > 0;

  const getPhq9Category = (score: number) => {
    if (score <= 4) return { label: 'Minimal / Baseline (0-4)', color: 'text-emerald-400', advice: 'Your responses suggest minimal depressive symptoms. Continue your healthy daily routines.' };
    if (score <= 9) return { label: 'Mild (5-9)', color: 'text-teal-400', advice: 'Your responses suggest mild depressive symptoms. Lifestyle pacing, restful sleep, and gentle exercise may be helpful.' };
    if (score <= 14) return { label: 'Moderate (10-14)', color: 'text-amber-400', advice: 'Your responses indicate moderate depressive symptoms. We encourage speaking with a licensed healthcare counselor.' };
    if (score <= 19) return { label: 'Moderately Severe (15-19)', color: 'text-orange-400', advice: 'Your responses reflect moderately severe symptoms. Professional clinical evaluation is recommended.' };
    return { label: 'Severe (20-27)', color: 'text-rose-400', advice: 'Your responses reflect severe depressive symptoms. Please connect with a qualified mental health specialist or support helpline.' };
  };

  // Handle GAD-7 calculation
  const gad7Total: number = (Object.values(gad7Answers) as number[]).reduce((a: number, b: number) => a + b, 0);

  const getGad7Category = (score: number) => {
    if (score <= 4) return { label: 'Minimal Anxiety (0-4)', color: 'text-emerald-400', advice: 'Anxiety symptoms are minimal. Continue practicing mindfulness and grounding.' };
    if (score <= 9) return { label: 'Mild Anxiety (5-9)', color: 'text-teal-400', advice: 'Mild anxiety symptoms detected. Deep breathing and relaxation exercises can help manage daily stress.' };
    if (score <= 14) return { label: 'Moderate Anxiety (10-14)', color: 'text-amber-400', advice: 'Moderate anxiety symptoms detected. Consider consulting a therapist or counselor for coping strategies.' };
    return { label: 'Severe Anxiety (15-21)', color: 'text-rose-400', advice: 'Severe anxiety symptoms detected. We strongly encourage professional medical or psychological evaluation.' };
  };

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setMoodLogs([
      {
        id: `mood-${Date.now()}`,
        mood: selectedMood,
        note: moodNotes,
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...moodLogs
    ]);
    setMoodNotes('');
  };

  return (
    <div id="patient-mind-mood-view" className="space-y-8 max-w-5xl mx-auto">
      {/* Non-Diagnostic Safety Header Card */}
      <div className="bg-white border border-[#DCE8F6] rounded-3xl p-6 sm:p-7 shadow-sm shadow-sky-950/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
              Mental & Behavioral Health Support
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D]">{t.mindMoodTitle}</h1>
            <p className="text-xs text-[#2D3748] opacity-85 max-w-2xl leading-relaxed">
              Standardized, evidence-based self-reflection screeners (PHQ-9, GAD-7) and calming coping tools. 
              <strong className="text-[#0B1E3D]"> This is a screening tool, not a clinical diagnosis.</strong>
            </p>
          </div>

          <button
            id="btn-mind-open-calm"
            onClick={onOpenCalmAssistant}
            className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Wind className="w-4 h-4 text-white" />
            <span>Guided Grounding</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#DCE8F6] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('phq9')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'phq9' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-[#2D3748] hover:bg-sky-50 bg-white border border-[#DCE8F6]'
            }`}
          >
            PHQ-9 Depression Screener
          </button>
          <button
            onClick={() => setActiveTab('gad7')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gad7' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-[#2D3748] hover:bg-sky-50 bg-white border border-[#DCE8F6]'
            }`}
          >
            GAD-7 Anxiety Screener
          </button>
          <button
            onClick={() => setActiveTab('coping')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'coping' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-[#2D3748] hover:bg-sky-50 bg-white border border-[#DCE8F6]'
            }`}
          >
            Coping & Calming Tools
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tracker' 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'text-[#2D3748] hover:bg-sky-50 bg-white border border-[#DCE8F6]'
            }`}
          >
            Daily Mood Log
          </button>
        </div>
      </div>

      {/* 1. PHQ-9 SCREENER VIEW */}
      {activeTab === 'phq9' && (
        <div className="space-y-6">
          {!phq9Submitted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] space-y-6 shadow-sm shadow-sky-950/5">
              <div className="border-b border-[#DCE8F6] pb-3">
                <h2 className="text-base font-bold text-[#0B1E3D]">Patient Health Questionnaire (PHQ-9)</h2>
                <p className="text-xs text-[#2D3748] opacity-80 mt-1">
                  Over the <strong>last 2 weeks</strong>, how often have you been bothered by any of the following problems?
                </p>
              </div>

              <div className="space-y-6">
                {PHQ9_QUESTIONS.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6] space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-[#0B1E3D]">
                        {q.id}. {q.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SCALE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPhq9Answers({ ...phq9Answers, [q.id]: opt.value })}
                          className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer ${
                            phq9Answers[q.id] === opt.value
                              ? 'bg-teal-600 border-teal-600 text-white font-bold shadow-xs'
                              : 'bg-white border-[#DCE8F6] text-[#2D3748] hover:bg-sky-50'
                          }`}
                        >
                          <span className="block text-xs font-bold">{opt.label}</span>
                          <span className="block text-[10px] font-mono opacity-70">({opt.value} pts)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4 border-t border-[#DCE8F6]">
                <span className="text-xs text-[#2D3748] opacity-80 font-mono">
                  Answered {Object.keys(phq9Answers).length} of 9 questions
                </span>
                <button
                  id="btn-submit-phq9"
                  disabled={Object.keys(phq9Answers).length < 9}
                  onClick={() => setPhq9Submitted(true)}
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Calculate Score & Interpretation</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ) : (
            /* PHQ-9 Result View */
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-6">
              {/* Question 9 Safety Alert Banner if triggered */}
              {phq9HasQ9Flag && (
                <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                      <AlertOctagon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-red-900">We are here with you</h3>
                      <p className="text-xs text-red-800">
                        You noted feelings related to self-harm. You do not have to carry this distress alone. Compassionate counselors are available right now.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={onOpenSos}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call Free Tele-MANAS (14416)</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE8F6] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                    PHQ-9 Score Interpretation
                  </span>
                  <h2 className="text-2xl font-black text-[#0B1E3D] mt-0.5">
                    Score: <span className="font-mono text-[#C59B27]">{phq9Total} / 27</span>
                  </h2>
                  <span className={`text-sm font-bold block mt-1 ${getPhq9Category(phq9Total).color}`}>
                    {getPhq9Category(phq9Total).label}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setPhq9Answers({});
                    setPhq9Submitted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-sky-50 border border-[#DCE8F6] text-[#2D3748] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4 text-teal-600" />
                  <span>Retake Screener</span>
                </button>
              </div>

              <p className="text-xs text-[#2D3748] leading-relaxed bg-[#F4F8FA] p-4 rounded-2xl border border-[#DCE8F6]">
                {getPhq9Category(phq9Total).advice}
              </p>

              <div className="p-4 rounded-2xl bg-[#FEF9E7]/40 border border-[#F6E58D] text-[11px] text-[#9A7416] italic">
                {t.nonDiagnosticNotice}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. GAD-7 SCREENER VIEW */}
      {activeTab === 'gad7' && (
        <div className="space-y-6">
          {!gad7Submitted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] space-y-6 shadow-sm shadow-sky-950/5">
              <div className="border-b border-[#DCE8F6] pb-3">
                <h2 className="text-base font-bold text-[#0B1E3D]">Generalized Anxiety Disorder (GAD-7)</h2>
                <p className="text-xs text-[#2D3748] opacity-80 mt-1">
                  Over the <strong>last 2 weeks</strong>, how often have you been bothered by the following problems?
                </p>
              </div>

              <div className="space-y-6">
                {GAD7_QUESTIONS.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6] space-y-3">
                    <span className="text-xs font-bold text-[#0B1E3D]">
                      {q.id}. {q.text}
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SCALE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setGad7Answers({ ...gad7Answers, [q.id]: opt.value })}
                          className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer ${
                            gad7Answers[q.id] === opt.value
                              ? 'bg-teal-600 border-teal-600 text-white font-bold shadow-xs'
                              : 'bg-white border-[#DCE8F6] text-[#2D3748] hover:bg-sky-50'
                          }`}
                        >
                          <span className="block text-xs font-bold">{opt.label}</span>
                          <span className="block text-[10px] font-mono opacity-70">({opt.value} pts)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#DCE8F6]">
                <span className="text-xs text-[#2D3748] opacity-80 font-mono">
                  Answered {Object.keys(gad7Answers).length} of 7 questions
                </span>
                <button
                  id="btn-submit-gad7"
                  disabled={Object.keys(gad7Answers).length < 7}
                  onClick={() => setGad7Submitted(true)}
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Calculate Anxiety Score</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ) : (
            /* GAD-7 Result View */
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE8F6] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                    GAD-7 Anxiety Scale Result
                  </span>
                  <h2 className="text-2xl font-black text-[#0B1E3D] mt-0.5">
                    Score: <span className="font-mono text-[#C59B27]">{gad7Total} / 21</span>
                  </h2>
                  <span className={`text-sm font-bold block mt-1 ${getGad7Category(gad7Total).color}`}>
                    {getGad7Category(gad7Total).label}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setGad7Answers({});
                    setGad7Submitted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-sky-50 border border-[#DCE8F6] text-[#2D3748] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4 text-teal-600" />
                  <span>Retake Screener</span>
                </button>
              </div>

              <p className="text-xs text-[#2D3748] leading-relaxed bg-[#F4F8FA] p-4 rounded-2xl border border-[#DCE8F6]">
                {getGad7Category(gad7Total).advice}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('coping')}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5 text-white" />
                  <span>Explore Calming Exercises</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. COPING & CALMING LIBRARY */}
      {activeTab === 'coping' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COPING_RESOURCES.map((r) => (
            <div key={r.id} className="p-6 rounded-3xl bg-white border border-[#DCE8F6] space-y-4 shadow-sm shadow-sky-950/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-teal-800 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {r.category.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-[#C59B27] font-bold">{r.duration}</span>
                </div>
                <h3 className="text-base font-bold text-[#0B1E3D] mt-3">{r.title}</h3>
                <p className="text-xs text-[#2D3748] opacity-80 mt-2 leading-relaxed">{r.description}</p>
                <div className="mt-4 p-3 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6] text-xs text-[#2D3748] font-mono space-y-1">
                  {r.instructions.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenCalmAssistant}
                className="mt-4 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Wind className="w-4 h-4 text-white" />
                <span>Launch Interactive Assistant Session</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. DAILY MOOD LOG */}
      {activeTab === 'tracker' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE8F6] shadow-sm shadow-sky-950/5 space-y-6">
          <form onSubmit={handleSaveMood} className="space-y-4">
            <h2 className="text-base font-bold text-[#0B1E3D]">How are you feeling right now?</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Calm & Content', color: 'bg-teal-500' },
                { label: 'Energetic & Hopeful', color: 'bg-amber-500' },
                { label: 'Mildly Anxious', color: 'bg-indigo-500' },
                { label: 'Tired / Low Energy', color: 'bg-blue-500' },
                { label: 'Overwhelmed', color: 'bg-rose-500' },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    selectedMood === m.label
                      ? `bg-teal-50 border-teal-500 text-[#0B1E3D] font-bold ring-2 ring-teal-400/40`
                      : 'bg-white border-[#DCE8F6] text-[#2D3748] hover:bg-sky-50'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${m.color}`} />
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>

            <textarea
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              placeholder="Add optional notes (e.g. slept 7 hours, had green tea, feeling peaceful)..."
              className="w-full bg-[#F4F8FA] border border-[#DCE8F6] rounded-2xl p-3 text-xs text-[#2D3748] placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 h-20"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Log Mood Reflection</span>
              </button>
            </div>
          </form>

          {/* Past Mood Entries */}
          <div className="space-y-3 pt-4 border-t border-[#DCE8F6]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">Recent Reflections</h3>
            {moodLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0B1E3D]">{log.mood}</span>
                  {log.note && <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">{log.note}</p>}
                </div>
                <span className="text-[10px] font-mono text-[#C59B27] font-bold">{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
