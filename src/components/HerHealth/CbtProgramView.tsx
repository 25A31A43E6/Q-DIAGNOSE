import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  Heart, 
  PenTool, 
  Clock, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { CbtExercise } from './types';

interface CbtProgramViewProps {
  exercises: CbtExercise[];
  onToggleComplete: (id: string, reflection?: string) => void;
}

export const CbtProgramView: React.FC<CbtProgramViewProps> = ({
  exercises,
  onToggleComplete,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<CbtExercise>(exercises[0]);
  const [userReflection, setUserReflection] = useState<string>('');

  // Interactive 4-7-8 Breathing Pacer State
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [breathCount, setBreathCount] = useState<number>(4);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            if (breathingPhase === 'Inhale (4s)') {
              setBreathingPhase('Hold (7s)');
              return 7;
            } else if (breathingPhase === 'Hold (7s)') {
              setBreathingPhase('Exhale (8s)');
              return 8;
            } else {
              setBreathingPhase('Inhale (4s)');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathingPhase]);

  const completedCount = exercises.filter(e => e.completed).length;
  const progressPercent = Math.round((completedCount / exercises.length) * 100);

  const handleSaveReflection = () => {
    onToggleComplete(selectedExercise.id, userReflection);
    setUserReflection('');
  };

  return (
    <div id="herhealth-cbt-program-view" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Brain className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Digital CBT & Somatic Relaxation Program</h2>
          </div>
          <p className="text-xs text-slate-600">
            Evidence-based cognitive restructuring, autonomic down-regulation, and compassionate guided reflection for menstrual distress.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-purple-50/80 p-3 rounded-2xl border border-purple-200 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-purple-800 block">Course Progress</span>
            <span className="text-sm font-black text-[#0B1E3D]">{progressPercent}% Completed</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
            {completedCount}/{exercises.length}
          </div>
        </div>
      </div>

      {/* Interactive 4-7-8 Breathing Pacing Visualizer */}
      <div className="bg-gradient-to-r from-teal-950 via-[#0B1E3D] to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-xs border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Autonomic Vagus Pacing</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">4-7-8 Parasympathetic Reset</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Designed by Dr. Andrew Weil, this pacing pattern stimulates the vagus nerve, rapidly decelerating heart rate and attenuating acute tension during cramp surges or premenstrual worry.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                if (!breathingActive) {
                  setBreathingPhase('Inhale (4s)');
                  setBreathCount(4);
                }
                setBreathingActive(!breathingActive);
              }}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{breathingActive ? 'Pause Exercise' : 'Start Pacing'}</span>
            </button>

            <button
              onClick={() => {
                setBreathingActive(false);
                setBreathingPhase('Inhale (4s)');
                setBreathCount(4);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dynamic Breathing Bubble */}
        <div className="flex flex-col items-center justify-center p-6">
          <div className={`w-44 h-44 rounded-full flex flex-col items-center justify-center border-4 border-teal-400/40 bg-teal-500/20 backdrop-blur-md transition-all duration-1000 ${
            breathingPhase.startsWith('Inhale') ? 'scale-110 shadow-lg shadow-teal-500/30' : breathingPhase.startsWith('Hold') ? 'scale-105' : 'scale-95'
          }`}>
            <span className="text-xs uppercase font-bold tracking-wider text-teal-200">{breathingPhase}</span>
            <span className="text-4xl font-black text-white my-1">{breathCount}</span>
            <span className="text-[10px] text-teal-100/80">Seconds</span>
          </div>
        </div>
      </div>

      {/* CBT Exercises Grid & Active Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Selection List */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-[#0B1E3D]">Curated CBT Modules</h3>
          <p className="text-xs text-slate-500">Select an exercise to begin practice</p>

          <div className="space-y-2 pt-1">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  selectedExercise.id === ex.id
                    ? 'bg-purple-50/80 border-purple-300 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0B1E3D]">{ex.title}</span>
                    {ex.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {ex.category} • {ex.durationMin} min
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Active Exercise Detail & Guided Reflection */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  {selectedExercise.category}
                </span>
                <h3 className="text-lg font-bold text-[#0B1E3D] mt-1">{selectedExercise.title}</h3>
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedExercise.durationMin} min duration</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedExercise.description}
            </p>

            {/* Steps List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0B1E3D] block">Practice Protocol Steps:</span>
              <div className="space-y-1.5">
                {selectedExercise.steps.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection Journaling */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-purple-900">
                <PenTool className="w-4 h-4 text-purple-700" />
                <span>Guided CBT Reflection Prompt</span>
              </div>
              <p className="text-slate-700 italic">
                "{selectedExercise.reflectionPrompt}"
              </p>

              <textarea
                rows={3}
                placeholder="Write your reflection and balanced thoughts here..."
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-200 bg-white focus:outline-purple-500 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {selectedExercise.completed ? 'Activity Completed' : 'Pending Completion'}
            </span>

            <button
              onClick={handleSaveReflection}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{selectedExercise.completed ? 'Update Reflection' : 'Mark Completed'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
