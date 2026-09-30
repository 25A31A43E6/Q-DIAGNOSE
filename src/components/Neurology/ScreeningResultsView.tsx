import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  UserCheck, 
  FileText, 
  ArrowRight, 
  RefreshCw, 
  PhoneCall, 
  Sparkles,
  Info,
  Brain,
  Award,
  Check,
  Stethoscope
} from 'lucide-react';
import { NeurologicalReportData, NeurologicalConditionResult } from '../../types';

interface ScreeningResultsViewProps {
  reportData: NeurologicalReportData;
  onViewReport: () => void;
  onNewScreening: () => void;
  onSaveReport: () => void;
  isSaved?: boolean;
  onOpenEmergency: () => void;
}

export const ScreeningResultsView: React.FC<ScreeningResultsViewProps> = ({
  reportData,
  onViewReport,
  onNewScreening,
  onSaveReport,
  isSaved = false,
  onOpenEmergency
}) => {
  const [expandedCondition, setExpandedCondition] = useState<string | null>(
    reportData.primaryConcern.id
  );

  const toggleExpand = (id: string) => {
    setExpandedCondition(prev => (prev === id ? null : id));
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'High Concern':
        return {
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          dotColor: 'bg-rose-600',
          symbol: '',
          text: 'High Concern'
        };
      case 'Further Evaluation':
        return {
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
          dotColor: 'bg-amber-500',
          symbol: '',
          text: 'Further Evaluation'
        };
      default:
        return {
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dotColor: 'bg-emerald-600',
          symbol: '',
          text: 'Low Concern'
        };
    }
  };

  const primaryBadge = getLevelBadge(reportData.primaryConcern.level);

  return (
    <div id="neurological-screening-results-view" className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>AI-Assisted Health Screening</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Assessment Date: {reportData.assessmentDate}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0B1E3D]">
          Neurological Screening Results
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Comprehensive multi-condition evaluation across five neurological domains based on your reported information.
        </p>
      </div>

      {/* HIGHEST-PRIORITY RESULT HIGHLIGHT CARD (Requirement 5) */}
      <section 
        id="highest-priority-concern-card"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-sky-50/70 border-2 border-teal-500/80 shadow-md space-y-5 relative overflow-hidden"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 text-teal-900 border border-teal-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Highest-Priority Screening Match</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1E3D] pt-1">
              Possible Concern: {reportData.primaryConcern.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Further Evaluation Recommended based on reported symptom and clinical indicators.
            </p>
          </div>

          <div className="text-right sm:text-right">
            <div className="text-3xl sm:text-4xl font-black text-[#0B1E3D] font-mono">
              {reportData.primaryConcern.score}%
            </div>
            <div className="text-xs font-bold mt-0.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${primaryBadge.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full ${primaryBadge.dotColor}`} />
                <span>{primaryBadge.text}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary Explanation */}
        <div className="p-4 rounded-2xl bg-white border border-sky-100 text-xs sm:text-sm text-slate-700 space-y-2">
          <div className="font-bold text-[#0B1E3D] flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600" />
            <span>Why This Result?</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            {reportData.primaryConcern.whyThisResult}
          </p>
        </div>

        {/* RECOMMENDED SPECIALIST (Requirement 7) */}
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                Recommended Specialist
              </span>
              <strong className="text-base font-bold text-[#0B1E3D]">
                {reportData.recommendedSpecialist}
              </strong>
              <p className="text-xs text-slate-600 mt-0.5">
                Please consult a qualified neurologist for complete clinical evaluation. (No medication or dosage prescribed).
              </p>
            </div>
          </div>

          <button
            onClick={onViewReport}
            className="px-4 py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>View Next Steps</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </section>

      {/* FIVE-CONDITION SCREENING RESULTS LIST (Requirement 5) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-bold text-[#0B1E3D] flex items-center gap-2">
            <span>All Five Neurological Conditions Screened</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              5 of 5
            </span>
          </h3>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Scores reflect relative screening correlation, not confirmed diagnoses.
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {reportData.conditions.map((condition) => {
            const badge = getLevelBadge(condition.level);
            const isExpanded = expandedCondition === condition.id;
            const isPrimary = condition.id === reportData.primaryConcern.id;

            return (
              <div
                key={condition.id}
                id={`condition-card-${condition.id}`}
                className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isPrimary
                    ? 'bg-white border-teal-400 shadow-sm ring-1 ring-teal-400/50'
                    : 'bg-white border-slate-200 hover:border-sky-300 shadow-2xs'
                }`}
              >
                {/* Header Strip */}
                <div 
                  onClick={() => toggleExpand(condition.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      condition.level === 'High Concern'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : condition.level === 'Further Evaluation'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {condition.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#0B1E3D]">
                          {condition.name}
                        </h4>
                        {isPrimary && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                            Primary Concern
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block sm:inline">
                        Screening Score: <strong className="font-mono text-slate-800">{condition.score}%</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${badge.badgeClass}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
                      <span>{badge.text}</span>
                    </span>

                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-700 transition-transform"
                      aria-label="Expand why this result"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-teal-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE "WHY THIS RESULT? ▾" SECTION (Requirement 6) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs animate-fadeIn">
                    <div className="space-y-1">
                      <span className="font-bold text-[#0B1E3D] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-teal-600" />
                        <span>Why this result?</span>
                      </span>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                        {condition.whyThisResult}
                      </p>
                    </div>

                    {condition.keyIndicators && condition.keyIndicators.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                          Reported Correlations:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {condition.keyIndicators.map((ind, i) => (
                            <span 
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3 text-teal-600 shrink-0" />
                              <span>{ind}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 italic pt-1">
                      Note: This is a screening score based on patient-reported descriptions. It is not an invasive test or definitive diagnosis.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety Notice Card */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-slate-700 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#0B1E3D] block font-bold">Clinical Safety Protocol</strong>
          <span>
            This is an AI-assisted screening result and does not confirm a medical diagnosis. Only a qualified physician can diagnose neurological conditions. If you experience sudden weakness, slurred speech, or seizure, seek emergency care immediately.
          </span>
        </div>
      </div>

      {/* BOTTOM ACTIONS (Requirements 8, 9, 17) */}
      <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onViewReport}
            id="btn-view-neurology-report"
            className="px-5 py-3 rounded-2xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <span>View Full Neurological Report</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>

          <button
            onClick={onSaveReport}
            id="btn-save-neurology-report"
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center border transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {isSaved ? (
              <span>Report Saved</span>
            ) : (
              <span>Save Report</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewScreening}
            className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center transition-colors cursor-pointer"
          >
            <span>New Screening</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center shadow-xs transition-colors cursor-pointer"
          >
            <span>Emergency Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};
