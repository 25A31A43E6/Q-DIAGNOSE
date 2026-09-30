import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileText, 
  Download, 
  Trash2, 
  Plus, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  Activity,
  Heart,
  Dna,
  Brain,
  CheckCircle2
} from 'lucide-react';
import { PredictionResult, SupportedLanguage } from '../types';

interface PatientHistoryViewProps {
  onStartNewAssessment: () => void;
  onViewResultDetails: (result: PredictionResult) => void;
  lang?: SupportedLanguage;
}

interface SavedHistoryItem {
  id: string;
  date: string;
  condition: string;
  riskBand: 'low' | 'moderate' | 'high';
  riskScore: number;
  confidence: number;
  model: string;
  profile: string;
  rawResult: PredictionResult;
}

export const PatientHistoryView: React.FC<PatientHistoryViewProps> = ({
  onStartNewAssessment,
  onViewResultDetails,
  lang = 'en'
}) => {
  const [selectedProfile, setSelectedProfile] = useState<string>('Self (Default)');
  const [historyItems, setHistoryItems] = useState<SavedHistoryItem[]>([]);
  const [filterCondition, setFilterCondition] = useState<string>('all');

  // Seed with realistic historical records and combine with session localStorage
  useEffect(() => {
    const saved = localStorage.getItem('qdiagnose_assessment_history');
    if (saved) {
      try {
        setHistoryItems(JSON.parse(saved));
        return;
      } catch (e) {
        // Fallback to default records below
      }
    }

    // Default realistic records across recent months
    const defaultRecords: SavedHistoryItem[] = [
      {
        id: 'HIST-2026-0815',
        date: '2026-08-15',
        condition: 'Cardiovascular Risk',
        riskBand: 'low',
        riskScore: 22,
        confidence: 94,
        model: 'Both (Compare)',
        profile: 'Self (Default)',
        rawResult: {
          id: 'HIST-2026-0815',
          timestamp: '2026-08-15 10:20:00 UTC',
          sample_id: 'CARDIO-847291',
          disease_id: 'cardiovascular',
          dataset_name: 'Heart_Disease_UCI_v1.2',
          model_used: 'Both (Compare)',
          prediction: 'Healthy Cardiac Baseline',
          confidence: 94,
          risk_band: 'low',
          risk_label: 'Low Risk',
          risk_score: 22,
          plain_language_meaning: 'Normal cardiovascular biometric readings with robust exercise tolerance and standard arterial pressure.',
          recommended_next_step: 'Continue balanced nutrition and annual physical checks.',
          quantum_score: 0.95,
          classical_score: 0.93,
          feature_importance: [
            { name: 'Resting BP', value: 24.1, description: 'Normotensive blood pressure' },
            { name: 'Heart Rate', value: 19.5, description: 'Regular resting pulse' }
          ]
        }
      },
      {
        id: 'HIST-2026-0702',
        date: '2026-07-02',
        condition: 'Cardiovascular Risk',
        riskBand: 'moderate',
        riskScore: 42,
        confidence: 88,
        model: 'Quantum (VQC)',
        profile: 'Self (Default)',
        rawResult: {
          id: 'HIST-2026-0702',
          timestamp: '2026-07-02 15:45:00 UTC',
          sample_id: 'CARDIO-619283',
          disease_id: 'cardiovascular',
          dataset_name: 'Heart_Disease_UCI_v1.2',
          model_used: 'Quantum (VQC)',
          prediction: 'Mild Borderline Elevation',
          confidence: 88,
          risk_band: 'moderate',
          risk_label: 'Moderate Risk',
          risk_score: 42,
          plain_language_meaning: 'Borderline elevated resting blood pressure and high stress index detected.',
          recommended_next_step: 'Reduced sodium diet and lifestyle stress reduction.',
          quantum_score: 0.89,
          classical_score: 0.86,
          feature_importance: [
            { name: 'Blood Pressure', value: 31.2, description: 'Mild elevation recorded' },
            { name: 'Cholesterol', value: 22.0, description: 'Borderline range' }
          ]
        }
      },
      {
        id: 'HIST-2026-0518',
        date: '2026-05-18',
        condition: 'Cellular / Breast Health',
        riskBand: 'low',
        riskScore: 16,
        confidence: 96,
        model: 'Both (Compare)',
        profile: 'Self (Default)',
        rawResult: {
          id: 'HIST-2026-0518',
          timestamp: '2026-05-18 11:15:00 UTC',
          sample_id: 'WDBC-339182',
          disease_id: 'breast_cancer',
          dataset_name: 'Wisconsin_Diagnostic_WDBC',
          model_used: 'Both (Compare)',
          prediction: 'Normal Cellular Consistency',
          confidence: 96,
          risk_band: 'low',
          risk_label: 'Low Risk',
          risk_score: 16,
          plain_language_meaning: 'Symmetric cellular margins and smooth nuclear density.',
          recommended_next_step: 'Routine annual mammography and self-awareness.',
          quantum_score: 0.97,
          classical_score: 0.95,
          feature_importance: [
            { name: 'Radius Mean', value: 32.5, description: 'Uniform radius' },
            { name: 'Area Mean', value: 24.1, description: 'Standard area' }
          ]
        }
      }
    ];

    setHistoryItems(defaultRecords);
    localStorage.setItem('qdiagnose_assessment_history', JSON.stringify(defaultRecords));
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your saved screening history?')) {
      setHistoryItems([]);
      localStorage.removeItem('qdiagnose_assessment_history');
    }
  };

  const handleExportCsv = () => {
    const header = 'ID,Date,Profile,Condition,Risk Band,Risk Score (%),Model,Confidence (%)\n';
    const rows = historyItems.map(h => 
      `"${h.id}","${h.date}","${h.profile}","${h.condition}","${h.riskBand}","${h.riskScore}","${h.model}","${h.confidence}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Q-Diagnose_Health_History_${selectedProfile.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredItems = historyItems.filter(item => {
    const matchesProfile = item.profile === selectedProfile;
    if (filterCondition === 'all') return matchesProfile;
    return matchesProfile && item.condition.toLowerCase().includes(filterCondition.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Longitudinal Health Records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1E3D] mt-1.5 tracking-tight">
              Patient Assessment History & Risk Trends
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Track your risk screening trajectory over time, review past clinical biomarker reports, and share records with your doctor.
            </p>
          </div>

          <button
            onClick={onStartNewAssessment}
            className="flex items-center gap-2 bg-[#0B1E3D] hover:bg-[#132c54] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-teal-300" />
            <span>Start New Screening</span>
          </button>
        </div>

        {/* Profile Selector & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500">Active Profile:</span>
            <select
              value={selectedProfile}
              onChange={e => setSelectedProfile(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1E3D] focus:outline-none"
            >
              <option value="Self (Default)">Self (Default)</option>
              <option value="Parent / Spouse">Parent / Spouse</option>
              <option value="Caregiver Client">Caregiver Client</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Export CSV</span>
            </button>
            {historyItems.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Risk-Trend Chart (Interactive Visual Trajectory) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1E3D]">
                Longitudinal Risk Trajectory
              </h2>
              <p className="text-xs text-slate-500">
                Risk score percentage (%) over chronological assessment timeline
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            {filteredItems.length} Records Tracked
          </span>
        </div>

        {/* Visual Trend Chart Canvas */}
        <div className="h-56 w-full bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between relative overflow-hidden">
          {/* Reference bands */}
          <div className="absolute inset-x-0 top-6 border-b border-rose-200/50 flex justify-end pr-2">
            <span className="text-[10px] font-bold text-rose-500">65% High Risk Threshold</span>
          </div>
          <div className="absolute inset-x-0 top-24 border-b border-amber-200/50 flex justify-end pr-2">
            <span className="text-[10px] font-bold text-amber-500">35% Moderate Threshold</span>
          </div>
          <div className="absolute inset-x-0 bottom-8 border-b border-emerald-200/50 flex justify-end pr-2">
            <span className="text-[10px] font-bold text-emerald-500">0% Baseline Low Risk</span>
          </div>

          {/* Points connected by trend line */}
          <div className="relative z-10 h-full flex items-center justify-around px-4">
            {filteredItems.map((item, idx) => {
              // Map score 0-100 to bottom %
              const bottomPercent = Math.min(85, Math.max(15, item.riskScore));
              return (
                <div key={item.id} className="flex flex-col items-center group relative cursor-pointer" onClick={() => onViewResultDetails(item.rawResult)}>
                  <div 
                    className="flex flex-col items-center transition-all duration-300 transform group-hover:scale-110"
                    style={{ marginBottom: `${bottomPercent * 1.2}px` }}
                  >
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs mb-1 ${
                      item.riskBand === 'high' ? 'bg-rose-100 text-rose-800' : item.riskBand === 'moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.riskScore}%
                    </span>
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                      item.riskBand === 'high' ? 'bg-rose-600' : item.riskBand === 'moderate' ? 'bg-amber-500' : 'bg-emerald-600'
                    }`} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-1 absolute bottom-0">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#0B1E3D]">
          Past Assessment Records
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="pb-3">Date</th>
                <th className="pb-3">Screening Focus</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Model Used</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-bold text-[#0B1E3D]">
                    {item.condition}
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.riskBand === 'high' 
                        ? 'bg-rose-100 text-rose-800' 
                        : item.riskBand === 'moderate' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.riskBand === 'high' 
                          ? 'bg-rose-500' 
                          : item.riskBand === 'moderate' 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`} />
                      {item.riskBand === 'high' ? 'High' : item.riskBand === 'moderate' ? 'Moderate' : 'Low'} ({item.riskScore}%)
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 font-mono">
                    {item.confidence}%
                  </td>
                  <td className="py-3.5 text-slate-500 text-xs">
                    {item.model}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => onViewResultDetails(item.rawResult)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      View Report →
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No past assessments found for profile "{selectedProfile}". Complete your first screening to track trends!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
