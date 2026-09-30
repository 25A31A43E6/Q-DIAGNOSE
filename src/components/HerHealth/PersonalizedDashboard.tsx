import React from 'react';
import { 
  Calendar, 
  Activity, 
  Smile, 
  Utensils, 
  Bot, 
  BookOpen, 
  Sparkles, 
  Brain, 
  GraduationCap, 
  HeartHandshake, 
  Bell, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Droplet, 
  Moon, 
  Flame, 
  Plus, 
  ShieldAlert,
  Compass,
  Stethoscope
} from 'lucide-react';
import { 
  HerHealthSubTab, 
  PeriodEntry, 
  SymptomLog, 
  MoodLog, 
  FoodActivityLog, 
  ReminderItem, 
  CbtExercise 
} from './types';

interface PersonalizedDashboardProps {
  onNavigateTab: (tab: HerHealthSubTab) => void;
  cycles: PeriodEntry[];
  symptoms: SymptomLog[];
  moods: MoodLog[];
  lifestyle: FoodActivityLog[];
  reminders: ReminderItem[];
  cbtExercises: CbtExercise[];
  onOpenQuickLog: (type: 'period' | 'symptom' | 'mood' | 'water') => void;
  onOpenSos: () => void;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  onNavigateTab,
  cycles,
  symptoms,
  moods,
  lifestyle,
  reminders,
  cbtExercises,
  onOpenQuickLog,
  onOpenSos
}) => {
  // Compute cycle estimates
  const latestCycle = cycles[0];
  const lastStart = latestCycle ? new Date(latestCycle.startDate) : new Date();
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastStart.getTime()) / (1000 * 3600 * 24));
  const cycleLength = latestCycle?.cycleLength || 28;
  const currentCycleDay = (diffDays % cycleLength) + 1;

  // Determine current cycle phase
  let currentPhase: { name: string; description: string; tagColor: string } = {
    name: 'Follicular Phase',
    description: 'Estrogen rising; optimal energy for creative work and moderate activity.',
    tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  };

  if (currentCycleDay <= (latestCycle?.periodDuration || 5)) {
    currentPhase = {
      name: 'Menstrual Phase',
      description: 'Hormones at baseline; prioritize warm nourishing foods, gentle stretches, and adequate rest.',
      tagColor: 'bg-rose-50 text-rose-800 border-rose-200'
    };
  } else if (currentCycleDay >= 13 && currentCycleDay <= 16) {
    currentPhase = {
      name: 'Ovulatory Phase',
      description: 'Luteinizing hormone peak; highest vitality, social energy, and metabolic balance.',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  } else if (currentCycleDay > 16) {
    currentPhase = {
      name: 'Luteal Phase',
      description: 'Progesterone dominant; body temperature slightly higher. Prioritize magnesium, complex carbs & stress management.',
      tagColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    };
  }

  // Next estimated period calculation
  const nextEstimatedDate = new Date(lastStart);
  nextEstimatedDate.setDate(lastStart.getDate() + cycleLength);
  const daysUntilNext = Math.max(0, Math.ceil((nextEstimatedDate.getTime() - today.getTime()) / (1000 * 3600 * 24)));

  const latestMood = moods[0];
  const latestSymptoms = symptoms.slice(0, 3);
  const latestLifestyle = lifestyle[0];
  const pendingReminders = reminders.filter(r => !r.completed);
  const completedCbtCount = cbtExercises.filter(e => e.completed).length;

  return (
    <div id="herhealth-personalized-dashboard" className="space-y-8 animate-fadeIn">
      {/* 1. Hero Overview Banner */}
      <section 
        id="herhealth-hero-card"
        className="bg-gradient-to-r from-rose-900/95 via-[#0B1E3D] to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold backdrop-blur-xs border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Personalized Wellness Central Hub</span>
              <span className="opacity-40">•</span>
              <span>Day {currentCycleDay} of {cycleLength}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome to HERHEALTH
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              Your comprehensive, non-diagnostic sanctuary for cycle awareness, symptom patterns, mental wellbeing, and evidence-informed health education.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="btn-quick-log-period"
                onClick={() => onOpenQuickLog('period')}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Cycle Date</span>
              </button>

              <button
                id="btn-quick-log-symptom"
                onClick={() => onOpenQuickLog('symptom')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4 text-teal-300" />
                <span>Log Symptoms</span>
              </button>

              <button
                id="btn-ask-ai-companion"
                onClick={() => onNavigateTab('companion')}
                className="px-4 py-2.5 rounded-xl bg-teal-500/30 hover:bg-teal-500/40 text-teal-200 font-bold text-xs flex items-center gap-1.5 border border-teal-400/30 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-teal-300" />
                <span>AI Health Companion</span>
              </button>
            </div>
          </div>

          {/* Cycle Badge Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center w-full md:w-56 shrink-0 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-rose-200 font-bold block">
              Estimated Next Period
            </span>
            <div className="text-2xl font-black text-white">
              ~ {daysUntilNext} Days
            </div>
            <p className="text-[10px] text-rose-100/80">
              Est. {nextEstimatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <div className="pt-1 text-[9px] text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-400/30">
              Estimate only; not medical certainty
            </div>
          </div>
        </div>
      </section>

      {/* 2. Critical Health Notice & Red Flags Banner */}
      <section 
        id="dashboard-medical-alerts-banner"
        className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0B1E3D]">Clinical Awareness & Red Flag Protocols</h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                Safety First
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Post-menopausal vaginal bleeding or persistent severe pelvic pain requires direct evaluation by a qualified healthcare professional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('alerts')}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Review Medical Alerts
          </button>
          <button
            onClick={onOpenSos}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Emergency SOS
          </button>
        </div>
      </section>

      {/* 3. Daily Health Status Grid (4 Core Overview Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cycle Summary */}
        <div 
          onClick={() => onNavigateTab('period')}
          className="bg-white p-5 rounded-3xl border border-sky-100 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <Calendar className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentPhase.tagColor}`}>
                {currentPhase.name}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B1E3D]">Cycle Summary</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Day {currentCycleDay} • Last recorded: {latestCycle?.startDate || 'N/A'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>View Cycle Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Symptoms Overview */}
        <div 
          onClick={() => onNavigateTab('symptoms')}
          className="bg-white p-5 rounded-3xl border border-sky-100 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                {symptoms.length} Logged
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B1E3D]">Active Symptoms</h4>
            <div className="flex flex-wrap gap-1">
              {latestSymptoms.length > 0 ? (
                latestSymptoms.map((s, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {s.symptomType} ({s.severity})
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No active symptoms today</span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
            <span>Symptom Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mood & Wellbeing */}
        <div 
          onClick={() => onNavigateTab('mood')}
          className="bg-white p-5 rounded-3xl border border-sky-100 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                <Smile className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 capitalize">
                {latestMood ? latestMood.mood : 'Calm'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B1E3D]">Mood & Mental State</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stress {latestMood ? `${latestMood.stressLevel}/5` : '2/5'} • Sleep {latestMood ? `${latestMood.sleepHours} hrs` : '7.5 hrs'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700">
            <span>Mood & Journaling</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Daily Goals & Hydration */}
        <div 
          onClick={() => onNavigateTab('lifestyle')}
          className="bg-white p-5 rounded-3xl border border-sky-100 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                {latestLifestyle?.waterGlasses || 7}/8 Glasses
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B1E3D]">Hydration & Activity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Steps: {latestLifestyle?.steps || 7400} • Activity: {latestLifestyle?.activityMinutes || 35} mins ({latestLifestyle?.activityType || 'Yoga'})
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
            <span>Lifestyle Guidance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>

      {/* 4. Recommendations & Upcoming Reminders Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase-Based Wellness Guidance */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-[#0B1E3D]">Phase-Specific Wellness Recommendations</h3>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Evidence-Informed
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentPhase.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-700">Nutrition Focus</span>
              <p className="text-xs font-semibold text-[#0B1E3D]">Iron & Magnesium Rich</p>
              <p className="text-[11px] text-slate-500">Lentils, spinach, pumpkin seeds, and dark leafy greens.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-700">Movement Strategy</span>
              <p className="text-xs font-semibold text-[#0B1E3D]">Gentle Somatic Flow</p>
              <p className="text-[11px] text-slate-500">Restorative yoga, brisk walking, and hip-opening stretches.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-700">Rest & Reflection</span>
              <p className="text-xs font-semibold text-[#0B1E3D]">Parasympathetic Downregulation</p>
              <p className="text-[11px] text-slate-500">4-7-8 breathing practice and warm herbal infusions.</p>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders Card */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-[#0B1E3D]">Upcoming Reminders</h3>
              </div>
              <button 
                onClick={() => onNavigateTab('reminders')}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingReminders.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-[#0B1E3D] block">{r.title}</span>
                    <span className="text-[11px] text-slate-600">
                      {r.date} at {r.time} • {r.type}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('reminders')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1E3D] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Manage Medication & Appointments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. Complete HERHEALTH Modular Feature Grid (15 Feature Modules) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B1E3D]">Women’s Health & Wellness Modules</h2>
            <p className="text-xs text-slate-600">Select any dedicated section to track, explore, learn, or manage records.</p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            15 Modules Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'period',
              title: 'Period & Cycle Tracking',
              desc: 'Calendar view, cycle length, luteal/follicular tracking, and non-diagnostic period predictions.',
              icon: Calendar,
              color: 'text-rose-600 bg-rose-50 border-rose-200',
            },
            {
              id: 'symptoms',
              title: 'Symptom Tracking',
              desc: 'Record cramps, headaches, bloating, back pain, and severity with longitudinal trend charts.',
              icon: Activity,
              color: 'text-teal-600 bg-teal-50 border-teal-200',
            },
            {
              id: 'mood',
              title: 'Mood & Mental Health',
              desc: 'Log emotional state, stress levels, sleep hours, anxiety, and private reflective journaling.',
              icon: Smile,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
            },
            {
              id: 'lifestyle',
              title: 'Food & Activity Guidance',
              desc: 'Iron-rich nutrition, water tracker, gentle movement routines, yoga, and healthy sleep habits.',
              icon: Utensils,
              color: 'text-amber-600 bg-amber-50 border-amber-200',
            },
            {
              id: 'companion',
              title: 'AI Health Companion',
              desc: 'Educational women’s health Q&A assistant with built-in safety boundaries and clinical red-flag triage.',
              icon: Bot,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            },
            {
              id: 'pcod',
              title: 'AI-Based PCOD Education',
              desc: 'PCOD vs PCOS distinctions, common symptoms, weight-neutral lifestyle guidance, FAQs, and myths.',
              icon: BookOpen,
              color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200',
            },
            {
              id: 'insights',
              title: 'Health Insights',
              desc: 'Correlation analytics between cycle days, symptom frequency, sleep quality, and lifestyle logs.',
              icon: Sparkles,
              color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
            },
            {
              id: 'cbt',
              title: 'Digital CBT Program',
              desc: 'Evidence-based cognitive reframing, worry trees, somatosensory grounding, and breathing exercises.',
              icon: Brain,
              color: 'text-purple-600 bg-purple-50 border-purple-200',
            },
            {
              id: 'education',
              title: 'Digital Health Education',
              desc: 'Comprehensive library covering PMS, PMDD, PCOD, menopause, reproductive health, and prevention.',
              icon: GraduationCap,
              color: 'text-blue-600 bg-blue-50 border-blue-200',
            },
            {
              id: 'awareness',
              title: 'Menstrual Awareness',
              desc: 'Safe period hygiene, menstrual care practices, myths vs facts, and healthy menstrual habits.',
              icon: HeartHandshake,
              color: 'text-pink-600 bg-pink-50 border-pink-200',
            },
            {
              id: 'reminders',
              title: 'Medication & Treatment',
              desc: 'Schedule prescription times, supplement reminders, doctor appointments, and lab test follow-ups.',
              icon: Bell,
              color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            },
            {
              id: 'partner',
              title: 'Family & Partner Support',
              desc: 'Educational guide for partners, cycle empathy, practical support advice, and consent-based sharing.',
              icon: Users,
              color: 'text-orange-600 bg-orange-50 border-orange-200',
            },
            {
              id: 'alerts',
              title: 'Medical Alerts & Red Flags',
              desc: 'High-priority warnings for post-menopausal bleeding, acute pelvic pain, and when to seek urgent care.',
              icon: AlertTriangle,
              color: 'text-red-600 bg-red-50 border-red-200',
            },
            {
              id: 'records',
              title: 'Secure Health Records',
              desc: 'Private encrypted health archive, granular consent controls, and PDF/CSV clinical export.',
              icon: ShieldCheck,
              color: 'text-teal-700 bg-teal-50 border-teal-300',
            },
            {
              id: 'doctor-review',
              title: 'Doctor / Clinical Review',
              desc: 'Healthcare professional view showing only patient-authorized cycles, symptoms, and health summaries.',
              icon: Stethoscope,
              color: 'text-slate-700 bg-slate-100 border-slate-300',
            }
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigateTab(mod.id as HerHealthSubTab)}
                className="bg-white p-5 rounded-3xl border border-sky-100 hover:border-teal-400/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${mod.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1E3D] group-hover:text-teal-700 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                  <span>Open Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
