import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  Calendar, 
  User, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Brain,
  FileText
} from 'lucide-react';
import { SavedNeurologicalReport } from '../../types';

interface NeurologyDashboardOverviewProps {
  reports: SavedNeurologicalReport[];
  onViewReport: (report: SavedNeurologicalReport) => void;
  onStartNewScreening: () => void;
}

export const NeurologyDashboardOverview: React.FC<NeurologyDashboardOverviewProps> = ({
  reports,
  onViewReport,
  onStartNewScreening
}) => {
  const totalScreenings = reports.length;
  const highConcernCount = reports.filter(r => r.status === 'High Concern').length;
  const furtherEvalCount = reports.filter(r => r.status === 'Further Evaluation').length;
  const lowConcernCount = reports.filter(r => r.status === 'Low Concern').length;

  return (
    <div id="neurology-dashboard-overview" className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Neurological Care Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3D]">
              Neurological Screening Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Aggregated screening metrics, condition distributions, and recent assessment activity.
            </p>
          </div>

          <button
            onClick={onStartNewScreening}
            className="px-5 py-3 rounded-2xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-bold flex items-center shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>New Screening</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY STAT CARDS (Requirement 15) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Screenings */}
        <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Screenings</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B1E3D] font-mono pt-1">
            {totalScreenings}
          </div>
          <span className="text-[11px] text-slate-400 block">Logged in patient record</span>
        </div>

        {/* High Concern */}
        <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">High Concern</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-900 font-mono pt-1">
            {highConcernCount}
          </div>
          <span className="text-[11px] text-rose-600/80 block">Prompt specialist consult</span>
        </div>

        {/* Further Evaluation */}
        <div className="bg-white rounded-3xl border border-amber-100 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Further Evaluation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 font-mono pt-1">
            {furtherEvalCount}
          </div>
          <span className="text-[11px] text-amber-700/80 block">Follow-up monitoring</span>
        </div>

        {/* Low Concern */}
        <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Low Concern</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono pt-1">
            {lowConcernCount}
          </div>
          <span className="text-[11px] text-emerald-700/80 block">Routine maintenance</span>
        </div>
      </div>

      {/* RECENT SCREENINGS TABLE (Requirement 15) */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#0B1E3D] flex items-center gap-2">
            <span>Recent Screenings</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {reports.length} records
            </span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Chronological audit of completed evaluations
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Patient</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Primary Concern</th>
                <th className="p-3.5">Screening Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-[#0B1E3D] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {report.report.patientName.charAt(0)}
                      </div>
                      <div>
                        <div>{report.report.patientName}</div>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">{report.report.patientId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600 whitespace-nowrap">
                    {report.date}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">
                      {report.primaryConcernName}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Score: {report.primaryConcernScore}%
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold inline-block ${
                      report.status === 'High Concern'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : report.status === 'Further Evaluation'
                        ? 'bg-amber-100 text-amber-900 border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onViewReport(report)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center transition-colors ml-auto cursor-pointer"
                    >
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
