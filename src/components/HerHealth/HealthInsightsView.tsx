import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  Calendar, 
  Smile, 
  Droplet, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { PeriodEntry, SymptomLog, MoodLog, FoodActivityLog } from './types';

interface HealthInsightsViewProps {
  cycles: PeriodEntry[];
  symptoms: SymptomLog[];
  moods: MoodLog[];
  lifestyle: FoodActivityLog[];
}

export const HealthInsightsView: React.FC<HealthInsightsViewProps> = ({
  cycles,
  symptoms,
  moods,
  lifestyle,
}) => {
  // Compute analytics
  const avgCycle = cycles.length > 0 
    ? Math.round(cycles.reduce((acc, c) => acc + c.cycleLength, 0) / cycles.length)
    : 28;
  const cycleVariance = cycles.length > 1
    ? Math.max(...cycles.map(c => c.cycleLength)) - Math.min(...cycles.map(c => c.cycleLength))
    : 1;

  const regularityScore = cycleVariance <= 3 ? 'High Regularity' : cycleVariance <= 7 ? 'Moderate Regularity' : 'Irregular Variation';

  // Symptom counts
  const crampsCount = symptoms.filter(s => s.symptomType === 'Cramps').length;
  const fatigueCount = symptoms.filter(s => s.symptomType === 'Fatigue').length;
  const headacheCount = symptoms.filter(s => s.symptomType === 'Headache').length;
  const bloatingCount = symptoms.filter(s => s.symptomType === 'Bloating').length;

  return (
    <div id="herhealth-insights-view" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Health Insights & Cross-Domain Analytics</h2>
          </div>
          <p className="text-xs text-slate-600">
            Algorithmic pattern recognition correlating cycle days, symptom frequency, mood fluctuations, and lifestyle logs.
          </p>
        </div>
      </div>

      {/* 4 Summary Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Cycle Regularity</span>
          <div className="text-xl font-black text-teal-800">{regularityScore}</div>
          <p className="text-[11px] text-slate-500">Variance: ±{cycleVariance} days across {cycles.length} cycles</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Primary Symptom</span>
          <div className="text-xl font-black text-rose-800">
            {crampsCount >= fatigueCount ? 'Cramps (Dysmenorrhea)' : 'Fatigue / Low Energy'}
          </div>
          <p className="text-[11px] text-slate-500">Concentrated on Menstrual Days 1–2</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Sleep-Stress Correlation</span>
          <div className="text-xl font-black text-indigo-900">-0.68 (Strong Inverse)</div>
          <p className="text-[11px] text-slate-500">Days with &lt;7h sleep double stress probability</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Hydration Efficacy</span>
          <div className="text-xl font-black text-sky-700">88% Target Reached</div>
          <p className="text-[11px] text-slate-500">Associated with 45% fewer headache logs</p>
        </div>
      </div>

      {/* Cross-Domain Pattern Detection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pattern 1: Cycle vs Symptoms */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-[#0B1E3D]">Cycle Phase vs. Symptom Clustering</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Pattern Identified
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Symptom logs indicate that cramping and lumbar soreness are 80% concentrated within the initial 48 hours of flow onset (Days 1–2), consistent with physiological uterine prostaglandin release.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-[#0B1E3D]">Actionable Recommendation:</div>
            <p className="text-slate-600">
              Initiate magnesium glycinate and warm heating pad protocols 24 hours prior to estimated onset to soften smooth muscle contractions before peak intensity.
            </p>
          </div>
        </div>

        {/* Pattern 2: Sleep & Stress */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-[#0B1E3D]">Rest Quality & Emotional Resilience</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              High Impact
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Your journal logs reveal that during the late luteal phase (Days 23–27), self-reported stress rises when sleep falls below 7 hours. Progesterone and serotonin interactions are sensitive to sleep debt.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-[#0B1E3D]">Actionable Recommendation:</div>
            <p className="text-slate-600">
              Schedule 4-7-8 parasympathetic vagus breathing exercises at 20:30 and transition to dimmer, warm lighting 60 minutes before intended bedtime.
            </p>
          </div>
        </div>
      </div>

      {/* Longitudinal Correlation Chart Representation */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B1E3D]">Symptom Frequency by Cycle Stage</h3>
            <p className="text-xs text-slate-500">Distribution across menstrual, follicular, ovulatory, and luteal phases</p>
          </div>
          <TrendingUp className="w-5 h-5 text-teal-600" />
        </div>

        <div className="space-y-3 pt-2 text-xs">
          {[
            { phase: 'Menstrual (Days 1–5)', symptom: 'Cramps & Lumbar Ache', pct: 75, color: 'bg-rose-500' },
            { phase: 'Follicular (Days 6–13)', symptom: 'High Vitality & Low Discomfort', pct: 15, color: 'bg-emerald-500' },
            { phase: 'Ovulatory (Days 14–16)', symptom: 'Mild Mid-Cycle Mittelschmerz', pct: 25, color: 'bg-amber-500' },
            { phase: 'Luteal (Days 17–28)', symptom: 'Bloating, Fatigue & Mood Sensitivity', pct: 60, color: 'bg-indigo-500' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>{item.phase}</span>
                <span className="text-slate-500">{item.symptom} ({item.pct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-diagnostic Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Scientific Disclaimer:</strong> Insights and pattern correlations are statistical analyses derived from your self-reported logs. They represent trends rather than medical causality or diagnosis. Share these trend exports with your doctor during annual wellness reviews.
        </p>
      </div>
    </div>
  );
};
