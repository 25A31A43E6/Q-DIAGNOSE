import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Hospital, 
  Download, 
  FileText, 
  Heart, 
  Apple, 
  Activity, 
  Calendar, 
  PhoneCall, 
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';
import { PredictionResult, SupportedLanguage } from '../types';
import { generateClinicalSummaryPdf } from '../utils/clinicalPdfGenerator';

interface ActionGuidanceViewProps {
  result: PredictionResult | null;
  onGoToHospitals: () => void;
  onBackToResults: () => void;
  lang?: SupportedLanguage;
}

export const ActionGuidanceView: React.FC<ActionGuidanceViewProps> = ({
  result,
  onGoToHospitals,
  onBackToResults,
  lang = 'en'
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const riskScore = result?.risk_score ?? (result ? Math.round(result.confidence || 50) : 25);
  const riskBand = result?.risk_band ?? (riskScore >= 65 ? 'high' : riskScore >= 35 ? 'moderate' : 'low');

  // Export summary report
  const handleExportReport = () => {
    const reportText = `=====================================================
Q-DIAGNOSE EARLY HEALTH RISK SCREENING REPORT
=====================================================
Date & Time: ${result?.timestamp || new Date().toISOString()}
Sample / Screening ID: ${result?.sample_id || 'LOCAL-001'}
Condition Assessed: ${result?.disease_id || 'Cardiovascular'}
Calculated Risk Level: ${riskBand.toUpperCase()} (${riskScore}%)
Quantum Hilbert Score: ${result?.quantum_score ? (result.quantum_score * 100).toFixed(1) + '%' : 'N/A'}
Classical Model Score: ${result?.classical_score ? (result.classical_score * 100).toFixed(1) + '%' : 'N/A'}

SUMMARY & PLAIN-LANGUAGE FINDINGS:
${result?.plain_language_meaning || 'Routine health screening metrics within standard baseline.'}

RECOMMENDED NEXT STEPS:
${result?.recommended_next_step || 'Consult healthcare professional for non-urgent evaluation.'}

PRIMARY OBSERVED FACTORS:
${(result?.feature_importance || []).map(f => `- ${f.name}: ${f.value.toFixed(1)}% (${f.description || ''})`).join('\n')}

MANDATORY REGULATORY DISCLAIMER:
This is an AI-based screening result, not a medical diagnosis.
Always consult a licensed medical physician or emergency services for clinical decisions.
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Q-Diagnose_Screening_Report_${result?.sample_id || 'Summary'}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const doctorQuestions = [
    'How do these screening indicators compare against my routine baseline medical history?',
    'Are there specific confirmatory laboratory panels or imaging tests recommended based on these metrics?',
    'Should I schedule a follow-up test in 3 months, 6 months, or 1 year?',
    'What targeted dietary, exercise, or lifestyle modifications would most effectively reduce my specific risk factors?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* 6-Step Flow Stepper */}
      <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 overflow-x-auto gap-2 pb-2">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>
            <span>Home</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
            <span>Emergency Check</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">3</span>
            <span>Assessment</span>
          </div>
          <span className="text-slate-300">→</span>
          <button onClick={onBackToResults} className="hover:text-[#0B1E3D] flex items-center gap-1.5 shrink-0 text-slate-600">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">4</span>
            <span>Risk Prediction</span>
          </button>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">5</span>
            <span>Guidance</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">6</span>
            <span>Doctor / Hospital</span>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Step 5 of 6: Actionable Healthcare Plan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1E3D] mt-1.5 tracking-tight">
              Action & Guidance Roadmap
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Tailored guidance based on your <strong className="text-[#0B1E3D] font-bold">{riskBand.toUpperCase()} RISK ({riskScore}%)</strong> screening results.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {result && (
              <button
                id="btn-guidance-download-pdf"
                onClick={() => generateClinicalSummaryPdf({ result })}
                className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
              >
                <span>Download PDF</span>
              </button>
            )}

            <button
              onClick={handleExportReport}
              className="flex items-center bg-slate-100 hover:bg-slate-200 text-[#0B1E3D] px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs transition-all cursor-pointer shrink-0"
            >
              <span>{downloadSuccess ? 'Report Downloaded' : 'Export Doctor Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guidance Cards By Risk Band */}
      {riskBand === 'low' && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Low Risk Guidance Plan
              </span>
              <h2 className="text-xl font-bold text-emerald-950 mt-1">
                Maintain Your Healthy Baseline & Routine Prevention
              </h2>
              <p className="text-emerald-900 text-sm mt-1 leading-relaxed">
                Your biomarkers indicate positive cardiovascular and cellular health. The key focus is sustaining consistent physical activity, balanced nutrition, and annual monitoring.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Physical Activity</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aim for at least 150 minutes of moderate aerobic exercise (brisk walking, swimming) per week plus 2 days of muscle strengthening.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase">
                <Apple className="w-4 h-4 text-emerald-600" />
                <span>Heart-Healthy Nutrition</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prioritize whole grains, leafy greens, legumes, nuts, and limit saturated fats, refined sugars, and excessive sodium intake.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Routine Annual Check</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule a routine checkup once a year with your general practitioner to keep blood pressure and lipid records updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {riskBand === 'moderate' && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Moderate Risk Guidance Plan
              </span>
              <h2 className="text-xl font-bold text-amber-950 mt-1">
                Schedule a Non-Urgent Medical Evaluation
              </h2>
              <p className="text-amber-900 text-sm mt-1 leading-relaxed">
                Some indicators show borderline or mild elevation. While not an emergency, early preventive consultation can prevent progression into chronic disease.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Consultation Window</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Book a doctor appointment within the next 2 to 4 weeks. Request a resting 12-lead ECG, fasting blood glucose, and lipid panel.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Home Log Tracking</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track your resting blood pressure twice daily for 7 consecutive days in a logbook to bring to your consultation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase">
                <Apple className="w-4 h-4 text-amber-600" />
                <span>Targeted Adjustment</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reduce sodium intake to below 2,000 mg/day, manage stress through breathing exercises, and ensure 7-8 hours of restful sleep.
              </p>
            </div>
          </div>
        </div>
      )}

      {riskBand === 'high' && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                High Risk Guidance Plan
              </span>
              <h2 className="text-xl font-bold text-rose-950 mt-1">
                Prompt Clinical Evaluation Strongly Advised
              </h2>
              <p className="text-rose-900 text-sm mt-1 leading-relaxed">
                Multiple screening markers exceeded standard reference ranges. Contact a certified healthcare physician or diagnostic clinic promptly for comprehensive clinical assessment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white border border-rose-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Prompt Consultation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach out to a medical center or specialist within 24 to 72 hours for an in-depth clinical consultation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-rose-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase">
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Bring This Report</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export or print this screening summary to share the quantified factor weights and quantum Hilbert scores with your doctor.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-rose-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase">
                <Activity className="w-4 h-4 text-rose-600" />
                <span>Avoid High Stress Exertion</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Avoid heavy unaccustomed exertion until cleared by your doctor. If any acute pain or shortness of breath begins, dial emergency immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Questions to Ask Your Doctor Checklist */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-bold text-[#0B1E3D]">
            Suggested Questions to Ask Your Doctor
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Take these talking points to your consultation to facilitate a productive discussion:
        </p>

        <div className="space-y-3 pt-2">
          {doctorQuestions.map((q, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-slate-800">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Link Card */}
      <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-900">Experiencing Acute Symptoms Right Now?</h4>
            <p className="text-xs text-rose-700">Call emergency services (112 / 108 / 911) or proceed immediately to the nearest trauma center.</p>
          </div>
        </div>
        <a
          href="tel:112"
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center whitespace-nowrap"
        >
          <span>Call 112 / 108 Now</span>
        </a>
      </div>

      {/* Navigation Buttons to Step 6 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onBackToResults}
          className="w-full sm:w-auto flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-all cursor-pointer"
        >
          <span>Back to Step 4: Risk Prediction</span>
        </button>

        <button
          id="proceed-to-hospitals-btn"
          onClick={onGoToHospitals}
          className="w-full sm:w-auto flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <span>Continue to Step 6: Find Nearby Hospitals & Doctors</span>
        </button>
      </div>
    </div>
  );
};
