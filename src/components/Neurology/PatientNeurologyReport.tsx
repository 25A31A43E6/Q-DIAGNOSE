import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck, 
  Calendar, 
  Brain, 
  Info,
  Check,
  BookmarkCheck,
  ExternalLink,
  Stethoscope
} from 'lucide-react';
import { NeurologicalReportData } from '../../types';

interface PatientNeurologyReportProps {
  report: NeurologicalReportData;
  onBack: () => void;
  onSaveReport: () => void;
  isSaved?: boolean;
  onViewSavedReports: () => void;
}

export const PatientNeurologyReport: React.FC<PatientNeurologyReportProps> = ({
  report,
  onBack,
  onSaveReport,
  isSaved = false,
  onViewSavedReports
}) => {
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    onSaveReport();
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/markdown printable summary to trigger download
    const reportContent = `
===================================================================
                  NEUROLOGICAL SCREENING REPORT
                     Q-Diagnose Platform v3.0
===================================================================

Date of Assessment: ${report.assessmentDate}
Report Reference ID: ${report.id}

1. PATIENT INFORMATION
-------------------------------------------------------------------
Full Name:         ${report.patientName}
Patient ID:        ${report.patientId}
Age / Gender:      ${report.age} yrs / ${report.gender}
Input Type:        ${report.inputType === 'symptoms' ? 'Patient Symptom Description' : 'Medical Report Review'}
${report.uploadedReportInfo ? `Uploaded File:     ${report.uploadedReportInfo.fileName} (${report.uploadedReportInfo.fileSize})` : ''}

2. REPORTED SYMPTOMS & CLINICAL DESCRIPTORS
-------------------------------------------------------------------
Reported Symptoms: ${report.reportedSymptoms.join(', ') || 'None selected'}
${report.symptomsDescription ? `Patient Description: "${report.symptomsDescription}"` : ''}

Important Findings:
${report.importantFindings.map(f => `  • ${f}`).join('\n')}

3. FIVE-CONDITION SCREENING RESULTS
-------------------------------------------------------------------
${report.conditions.map(c => `  • ${c.name.padEnd(28)} | Score: ${c.score}% | Status: ${c.level}`).join('\n')}

4. HIGHEST-PRIORITY CONCERN
-------------------------------------------------------------------
Primary Condition: ${report.primaryConcern.name} (${report.primaryConcern.score}% Screening Score)
Status:            ${report.primaryConcern.level}
Why This Result:   ${report.primaryConcern.whyThisResult}

5. RECOMMENDED SPECIALIST & NEXT STEPS
-------------------------------------------------------------------
Recommended Specialist: ${report.recommendedSpecialist}
Action Steps:
${report.nextSteps.map(s => `  1. ${s}`).join('\n')}

6. CLINICAL SAFETY DISCLAIMER
-------------------------------------------------------------------
${report.safetyNotice}
Note: This screening report is for informational decision-support and does not
constitute a definitive medical diagnosis or prescribe treatments.
===================================================================
`.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Neurological_Screening_Report_${report.patientId}_${report.assessmentDate.replace(/[\s,]+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="patient-neurology-report-container" className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Bar with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl border border-sky-100 p-4 sm:p-5 shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center transition-colors cursor-pointer"
        >
          <span>Back to Screening Results</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Save Button with feedback */}
          <button
            onClick={handleSave}
            id="report-save-button"
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center border transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
          >
            {isSaved ? (
              <span>Saved to Records</span>
            ) : (
              <span>Save Report</span>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-800 border border-teal-200 text-xs font-bold flex items-center transition-colors cursor-pointer"
          >
            <span>Download Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0B1E3D] hover:bg-[#132c54] text-white text-xs font-bold flex items-center shadow-xs transition-colors cursor-pointer"
          >
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner (Requirement 9) */}
      {showSavedToast && (
        <div 
          id="report-saved-toast-notification"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-4 shadow-sm animate-fadeIn"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block text-xs sm:text-sm font-extrabold text-emerald-950">
                Report Saved Successfully
              </strong>
              <span className="text-xs text-emerald-800">
                Your neurological screening report has been saved to your patient record.
              </span>
            </div>
          </div>
          <button
            onClick={onViewSavedReports}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            View Saved Reports
          </button>
        </div>
      )}

      {/* PRINTABLE CLINICAL SCREENING REPORT CARD */}
      <div 
        id="printable-neurology-report"
        className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-teal-600" />
              <span className="text-xs font-mono font-bold tracking-wider text-teal-800 uppercase">
                Q-Diagnose • Clinical Screening Series
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D]">
              Neurological Screening Report
            </h1>
            <p className="text-xs text-slate-500">
              AI-assisted multi-condition screening and decision-support summary.
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 space-y-1 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-none border-slate-200">
            <div>Report ID: <strong className="font-mono text-[#0B1E3D]">{report.id}</strong></div>
            <div>Date: <strong>{report.assessmentDate}</strong></div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
              Screening Document
            </span>
          </div>
        </div>

        {/* Section 1: Patient Information (Requirement 8) */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <span>1. Patient Information</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Patient Name</span>
              <strong className="text-[#0B1E3D] text-sm">{report.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Patient ID</span>
              <strong className="font-mono text-slate-800">{report.patientId}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Age / Gender</span>
              <strong className="text-slate-800">{report.age} yrs / {report.gender}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Input Source</span>
              <strong className="text-teal-700 capitalize">
                {report.inputType === 'symptoms' ? 'Symptoms Input' : 'Uploaded Medical Report'}
              </strong>
            </div>
          </div>
          {report.uploadedReportInfo && (
            <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 text-xs text-slate-700 flex items-center justify-between">
              <span>Uploaded Document: <strong>{report.uploadedReportInfo.fileName}</strong> ({report.uploadedReportInfo.fileSize})</span>
              <span className="text-[10px] text-slate-500 font-mono">Verified Format</span>
            </div>
          )}
        </section>

        {/* Section 2: Reported Symptoms & Clinical Descriptors (Requirement 8) */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <span>2. Reported Symptoms</span>
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 text-xs">
            {report.reportedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {report.reportedSymptoms.map((sym, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold">
                    • {sym}
                  </span>
                ))}
              </div>
            )}
            {report.symptomsDescription && (
              <p className="text-slate-700 italic pt-1 border-l-2 border-teal-500 pl-3">
                "{report.symptomsDescription}"
              </p>
            )}
          </div>
        </section>

        {/* Section 3: Important Findings (Requirement 8) */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <span>3. Important Findings</span>
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 space-y-1.5">
            {report.importantFindings.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span className={finding.includes('Not available') ? 'text-slate-400 italic' : 'text-slate-800 font-medium'}>
                  {finding}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Five-Condition Screening Results Table (Requirement 8) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              <span>4. Five-Condition Screening Results</span>
            </h2>
            <span className="text-[11px] text-slate-400">All 5 conditions screened</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Condition</th>
                  <th className="p-3 text-center">Screening Score</th>
                  <th className="p-3">Screening Level</th>
                  <th className="p-3">Clinical Indication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.conditions.map((c) => {
                  const isPrimary = c.id === report.primaryConcern.id;
                  return (
                    <tr key={c.id} className={isPrimary ? 'bg-teal-50/40 font-semibold' : 'hover:bg-slate-50/50'}>
                      <td className="p-3 flex items-center gap-2">
                        <span>{c.name}</span>
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-bold">
                            Primary
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-800">
                        {c.score}%
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                          c.level === 'High Concern'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : c.level === 'Further Evaluation'
                            ? 'bg-amber-100 text-amber-900 border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {c.level}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 text-[11px] max-w-xs">
                        {c.whyThisResult}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Most Relevant Concern & Why This Result (Requirement 8) */}
        <section className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <span>5. Most Relevant Concern:</span>
              <span className="text-sm font-extrabold text-[#0B1E3D]">{report.primaryConcern.name}</span>
            </h2>
            <span className="font-mono font-extrabold text-sm text-teal-800">
              {report.primaryConcern.score}% Concern
            </span>
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <span className="font-bold text-[#0B1E3D] block">Why This Result?:</span>
            <p className="leading-relaxed">
              {report.primaryConcern.whyThisResult}
            </p>
          </div>
        </section>

        {/* Section 6: Recommended Specialist & Next Steps (Requirement 8) */}
        <section className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-[#0B1E3D]">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800">
              6. Recommended Specialist:
            </h2>
            <strong className="text-xs sm:text-sm font-bold text-[#0B1E3D]">
              {report.recommendedSpecialist}
            </strong>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 pt-1">
            <span className="font-bold text-[#0B1E3D] block">Recommended Next Steps:</span>
            <ul className="space-y-1">
              {report.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 7: Safety Notice (Requirement 8) */}
        <section className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block font-bold">Safety Notice & Legal Disclaimer</strong>
            <p className="text-[11px] leading-relaxed text-amber-900">
              "{report.safetyNotice}"
            </p>
          </div>
        </section>

        {/* Report Footer */}
        <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Q-Diagnose • Quantum-AI Hybrid Early Risk Screening</span>
          <span>Verified Clinical Decision-Support Architecture</span>
          <span>Generated on {report.assessmentDate}</span>
        </div>
      </div>
    </div>
  );
};
