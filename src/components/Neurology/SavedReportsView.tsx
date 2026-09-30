import React, { useState } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  Sparkles,
  Search,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { SavedNeurologicalReport } from '../../types';

interface SavedReportsViewProps {
  reports: SavedNeurologicalReport[];
  onViewReport: (report: SavedNeurologicalReport) => void;
  onDeleteReport: (reportId: string) => void;
  onStartNewScreening: () => void;
}

export const SavedReportsView: React.FC<SavedReportsViewProps> = ({
  reports,
  onViewReport,
  onDeleteReport,
  onStartNewScreening
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reportToDelete, setReportToDelete] = useState<SavedNeurologicalReport | null>(null);

  const filteredReports = reports.filter(r => 
    r.assessmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.primaryConcernName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (report: SavedNeurologicalReport) => {
    const reportData = report.report;
    const reportContent = `
===================================================================
                  NEUROLOGICAL SCREENING REPORT
                     Q-Diagnose Platform v3.0
===================================================================
Date: ${reportData.assessmentDate}
Report Reference ID: ${reportData.id}
Patient Name: ${reportData.patientName} (${reportData.patientId})
Primary Concern: ${reportData.primaryConcern.name} (${reportData.primaryConcern.score}%)
Status: ${reportData.primaryConcern.level}
Specialist Recommendation: ${reportData.recommendedSpecialist}
Summary: ${reportData.primaryConcern.whyThisResult}
===================================================================
`.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      onDeleteReport(reportToDelete.id);
      setReportToDelete(null);
    }
  };

  return (
    <div id="saved-reports-view" className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <FolderOpen className="w-4 h-4" />
              <span>Patient Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3D]">
              My Saved Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Access, download, and review your previous neurological screening reports.
            </p>
          </div>

          <button
            onClick={onStartNewScreening}
            className="px-5 py-3 rounded-2xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-bold flex items-center shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>New Screening</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by date, condition, or assessment type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#0B1E3D]">No Saved Reports Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? 'No reports match your search query.' : 'You have not saved any screening reports yet. Run a screening and tap "Save Report" to preserve your records here.'}
          </p>
          <button
            onClick={onStartNewScreening}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors inline-block cursor-pointer mt-2"
          >
            Start a Neurological Screening
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Assessment</th>
                  <th className="p-4">Primary Concern</th>
                  <th className="p-4">Screening Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-medium text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#0B1E3D]">
                      {item.assessmentType}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{item.primaryConcernName}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({item.primaryConcernScore}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold inline-block ${
                        item.status === 'High Concern'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : item.status === 'Further Evaluation'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReport(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center transition-colors cursor-pointer"
                          title="View Full Report"
                        >
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleDownload(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center transition-colors cursor-pointer"
                          title="Download Report"
                        >
                          <span>Download</span>
                        </button>

                        <button
                          onClick={() => setReportToDelete(item)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Requirement 10) */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div 
            id="delete-report-modal"
            className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0B1E3D]">
                Delete Screening Report?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this report from <strong>{reportToDelete.date}</strong> ({reportToDelete.assessmentType})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
