import React from 'react';
import { 
  History, 
  ArrowRight, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Sparkles,
  Info,
  Clock,
  Brain
} from 'lucide-react';
import { ScreeningHistoryTimelineItem } from '../../types';

interface ScreeningTimelineViewProps {
  historyItems: ScreeningHistoryTimelineItem[];
  onSelectReport: (reportId: string) => void;
  onStartNewScreening: () => void;
}

export const ScreeningTimelineView: React.FC<ScreeningTimelineViewProps> = ({
  historyItems,
  onSelectReport,
  onStartNewScreening
}) => {
  return (
    <div id="screening-timeline-view" className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <History className="w-4 h-4" />
              <span>Longitudinal Patient Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3D]">
              Screening History
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Chronological timeline tracking your neurological screening results over time (Past → Recent).
            </p>
          </div>

          <button
            onClick={onStartNewScreening}
            className="px-5 py-2.5 rounded-2xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-bold flex items-center shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>New Screening</span>
          </button>
        </div>
      </div>

      {/* Trajectory Summary Banner */}
      <div className="p-5 rounded-3xl bg-sky-50/80 border border-sky-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0B1E3D]">
              Chronological Screening Trajectory
            </h3>
            <p className="text-xs text-slate-600">
              Progression reflects historical inputs: May 14 (42%) → Jul 10 (55%) → Aug 18 (64%) → Sep 04 (78%).
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-teal-800 bg-teal-100 px-3 py-1 rounded-full font-bold">
          4 Records Logged
        </span>
      </div>

      {/* Timeline Steps (Past -> Recent) */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-100 pb-3">
          <span>PAST SCREENINGS</span>
          <span className="flex items-center gap-1 text-teal-700 font-bold">
            <span>CHRONOLOGICAL ORDER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <span>MOST RECENT</span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-teal-200">
          {historyItems.map((item, index) => {
            const isLatest = index === historyItems.length - 1;
            
            return (
              <div 
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => item.reportId && onSelectReport(item.reportId)}
              >
                {/* Timeline node */}
                <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-4 transition-all flex items-center justify-center ${
                  isLatest
                    ? 'bg-rose-500 border-white ring-4 ring-rose-200 scale-110'
                    : 'bg-teal-600 border-white ring-2 ring-teal-100'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Timeline Card */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  isLatest 
                    ? 'bg-sky-50/70 border-teal-300 ring-1 ring-teal-300/60 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-teal-200 hover:bg-slate-50/50 shadow-2xs'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            Current Assessment
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#0B1E3D] pt-0.5">
                        Primary Indication: {item.conditionName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block text-[10px]">Screening Score</span>
                        <strong className="text-base sm:text-lg font-black font-mono text-[#0B1E3D]">
                          {item.score}%
                        </strong>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                        item.status === 'High Concern'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : item.status === 'Further Evaluation'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {item.status}
                      </span>

                      {item.reportId && (
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center transition-colors cursor-pointer"
                        >
                          <span className="hidden sm:inline">View Report</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    {item.score >= 70
                      ? 'Elevated score observed based on reported memory lapses and speech pauses. Consultation recommended.'
                      : item.score >= 50
                      ? 'Moderate screening indicators observed. Longitudinal tracking advised.'
                      : 'Baseline screening score within normal reference variation.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
