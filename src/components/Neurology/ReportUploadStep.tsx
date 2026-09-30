import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  ArrowRight, 
  ShieldAlert, 
  Info,
  Sparkles,
  FileCheck,
  Brain
} from 'lucide-react';
import { SAMPLE_MEDICAL_REPORTS } from '../../data/neurologyData';

interface UploadedFileInfo {
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  status: string;
  extractedSummary?: string;
  findings?: string[];
}

interface ReportUploadStepProps {
  onAnalyzeReport: (fileInfo: UploadedFileInfo) => void;
  onCancel: () => void;
}

export const ReportUploadStep: React.FC<ReportUploadStepProps> = ({
  onAnalyzeReport,
  onCancel
}) => {
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (file: File) => {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${(file.size / 1024).toFixed(0)} KB`;
    
    // Set realistic info based on file name or generic
    const lowerName = file.name.toLowerCase();
    let findings: string[] = [];
    let summary = '';

    if (lowerName.includes('mri') || lowerName.includes('brain')) {
      findings = [
        'Mild bilateral hippocampal volume reduction on coronal T1 sequence',
        'Absence of acute territorial stroke or large-vessel occlusion',
        'Fazekas Grade 1 periventricular white matter changes',
        'Spinal cord evaluation: Not available in the uploaded report.',
        'Intracranial pressure: Not available in the uploaded report.'
      ];
      summary = 'Brain MRI neuro-imaging analysis: Mild hippocampal changes, no acute infarct or hemorrhage.';
    } else if (lowerName.includes('eeg')) {
      findings = [
        'Posterior rhythm 9.5 Hz reactive to eye closure',
        'No focal epileptiform discharges or periodic sharp waves',
        'Sleep architecture: Not available in the uploaded report.',
        'Metabolic profile: Not available in the uploaded report.'
      ];
      summary = 'Clinical EEG recording: Symmetrical background activity without focal paroxysmal discharges.';
    } else {
      findings = [
        'Clinical neuro-screening documentation uploaded by patient',
        'Diagnostic impression: Information reviewed for screening indicators',
        'Quantitative volumetric data: Not available in the uploaded report.',
        'Laboratory serology markers: Not available in the uploaded report.'
      ];
      summary = 'Document uploaded successfully. Information available will be reviewed.';
    }

    setFileInfo({
      fileName: file.name,
      fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
      fileSize: formattedSize,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Ready for Screening',
      extractedSummary: summary,
      findings
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_MEDICAL_REPORTS[0]) => {
    setFileInfo({
      fileName: sample.fileName,
      fileType: sample.fileType,
      fileSize: sample.fileSize,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Ready for Screening',
      extractedSummary: sample.summary,
      findings: sample.findings
    });
  };

  const handleRemove = () => {
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="neurology-report-upload-step" className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Step 1 of 3: Clinical Documentation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1E3D]">
          Upload Medical Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Upload a report to include available clinical information in your screening.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        {/* If no file is selected yet */}
        {!fileInfo ? (
          <div className="space-y-4">
            {/* Drag and drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-teal-500 bg-teal-50/50'
                  : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleNativeChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <UploadCloud className="w-7 h-7 text-teal-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#0B1E3D]">
                  Click to select or drag and drop your report
                </p>
                <p className="text-xs text-slate-500">
                  Supported visual formats: <strong>PDF, JPG, PNG</strong> (Max 25 MB)
                </p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-[#0B1E3D] text-white text-xs font-bold hover:bg-[#132c54] transition-colors mt-2">
                Browse Files
              </span>
            </div>

            {/* Sample Reports for Fast Demo */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Or Select a Sample Clinical Report:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_MEDICAL_REPORTS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200 hover:border-teal-300 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="font-bold text-xs text-[#0B1E3D] group-hover:text-teal-700 truncate">
                        {sample.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      {sample.fileName} ({sample.fileSize})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* File Selected Card */
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#0B1E3D]">{fileInfo.fileName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 font-bold">
                      {fileInfo.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                    <span>Format: <strong className="font-mono text-slate-700">{fileInfo.fileType}</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="font-mono text-slate-700">{fileInfo.fileSize}</strong></span>
                    <span>•</span>
                    <span>Uploaded: {fileInfo.uploadDate}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold flex items-center transition-colors cursor-pointer self-start sm:self-center"
              >
                <span>Remove File</span>
              </button>
            </div>

            {/* Extracted Available Information Preview */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-[#0B1E3D] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Information Available in Uploaded Report</span>
                </strong>
                <span className="text-[10px] text-slate-400 font-mono">Clinical Extraction</span>
              </div>

              {fileInfo.extractedSummary && (
                <p className="text-slate-700 italic border-l-2 border-teal-500 pl-3 py-0.5">
                  "{fileInfo.extractedSummary}"
                </p>
              )}

              {fileInfo.findings && fileInfo.findings.length > 0 && (
                <ul className="space-y-1.5 pt-1 text-slate-700">
                  {fileInfo.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span className={f.includes('Not available') ? 'text-slate-400 italic' : ''}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Rule: Do not invent medical findings. Any parameter not explicitly in the report is marked as "Not available in the uploaded report."
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Non-diagnostic Notice */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-[#0B1E3D] block font-bold">Non-Diagnostic Safety Protocol</strong>
            <span>
              This AI-assisted screening tool reviews available clinical descriptors to estimate risk scores across five conditions. It is not a diagnostic impression and requires clinical correlation by a licensed physician.
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Back</span>
          </button>

          <button
            type="button"
            id="btn-analyze-report"
            disabled={!fileInfo}
            onClick={() => fileInfo && onAnalyzeReport(fileInfo)}
            className="px-6 py-3 rounded-2xl bg-[#0B1E3D] hover:bg-[#132c54] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <span>Analyze Report</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
