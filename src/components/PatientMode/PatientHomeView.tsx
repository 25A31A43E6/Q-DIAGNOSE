import React from 'react';
import { 
  Activity, 
  Heart, 
  Brain, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Bot, 
  Compass, 
  Dna, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  TrendingUp, 
  Layers, 
  Hospital, 
  PhoneCall,
  Zap,
  HelpCircle,
  HeartHandshake
} from 'lucide-react';
import { SupportedLanguage, NavSection, DiseaseId, PredictionResult } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface PatientHomeViewProps {
  language: SupportedLanguage;
  onNavigate: (section: NavSection) => void;
  onSelectDisease: (disease: DiseaseId) => void;
  recentResult: PredictionResult | null;
  onOpenAssistant: () => void;
  onOpenSos: () => void;
}

export const PatientHomeView: React.FC<PatientHomeViewProps> = ({
  language,
  onNavigate,
  onSelectDisease,
  recentResult,
  onOpenAssistant,
  onOpenSos,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const currentDate = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div id="patient-home-view" className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Friendly Welcome Hero Banner with Official Tagline */}
      <section 
        id="patient-welcome-hero"
        aria-label="Welcome and Daily Overview"
        className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-10 text-[#222222] shadow-sm shadow-sky-950/5 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-sky-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C59B27] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>From Prediction to Prevention</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-normal">{currentDate}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B1E3D] leading-tight">
            A Hybrid Quantum-AI System for Early Health Risk Screening
          </h1>
          
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
            Empowering proactive wellness through 4-qubit Hilbert space variational classifiers paired with classical machine learning ensembles. Fast, non-invasive, and non-diagnostic risk screening.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="btn-hero-start-screening"
              onClick={() => onNavigate('emergency-check')}
              className="px-6 py-3.5 rounded-2xl bg-[#0B1E3D] hover:bg-[#132c54] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-navy-950/10 transition-all hover:scale-102 cursor-pointer"
            >
              <span>Start Health Assessment</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>

            <button
              id="btn-hero-health-vault"
              onClick={() => onNavigate('portal')}
              className="px-4 py-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs sm:text-sm flex items-center gap-2 border border-teal-200 shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Health Vault (ABDM)</span>
            </button>

            <button
              id="btn-hero-herhealth"
              onClick={() => onNavigate('herhealth')}
              className="px-4 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs sm:text-sm flex items-center gap-2 border border-rose-200 shadow-xs transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>HERHEALTH</span>
            </button>

            <button
              id="btn-hero-ai-companion"
              onClick={onOpenAssistant}
              className="px-4 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-[#0B1E3D] font-bold text-xs sm:text-sm flex items-center border border-sky-200 shadow-xs transition-all cursor-pointer"
            >
              <span>Ask AI Health Companion</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6-Step Clinical Roadmap Overview */}
      <section className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-600" />
            <h2 className="text-base sm:text-lg font-bold text-[#0B1E3D]">
              Streamlined 6-Step Care Roadmap
            </h2>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Safety-First Architecture
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-center">
          <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1">
            <span className="text-[11px] font-bold text-teal-800 uppercase block">Step 1</span>
            <div className="font-bold text-xs text-[#0B1E3D]">Home</div>
            <p className="text-[10px] text-slate-500">Overview & Portal</p>
          </div>

          <button 
            onClick={() => onNavigate('emergency-check')}
            className="p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-200 space-y-1 transition-all cursor-pointer text-center"
          >
            <span className="text-[11px] font-bold text-rose-700 uppercase block">Step 2</span>
            <div className="font-bold text-xs text-[#0B1E3D]">Emergency Check</div>
            <p className="text-[10px] text-slate-500">Symptom Safety Triage</p>
          </button>

          <button 
            onClick={() => onNavigate('assessment')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200 space-y-1 transition-all cursor-pointer text-center"
          >
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Step 3</span>
            <div className="font-bold text-xs text-[#0B1E3D]">Assessment</div>
            <p className="text-[10px] text-slate-500">Biometrics & Lifestyle</p>
          </button>

          <button 
            onClick={() => onNavigate('results')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200 space-y-1 transition-all cursor-pointer text-center"
          >
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Step 4</span>
            <div className="font-bold text-xs text-[#0B1E3D]">Risk Prediction</div>
            <p className="text-[10px] text-slate-500">Low / Moderate / High Risk Band</p>
          </button>

          <button 
            onClick={() => onNavigate('guidance')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200 space-y-1 transition-all cursor-pointer text-center"
          >
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Step 5</span>
            <div className="font-bold text-xs text-[#0B1E3D]">Action / Guidance</div>
            <p className="text-[10px] text-slate-500">Doctor Questions & Report</p>
          </button>

          <button 
            onClick={() => onNavigate('hospitals')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200 space-y-1 transition-all cursor-pointer text-center"
          >
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Step 6</span>
            <div className="font-bold text-xs text-[#0B1E3D]">Doctor / Hospital</div>
            <p className="text-[10px] text-slate-500">Nearby Facilities</p>
          </button>
        </div>
      </section>

      {/* Persistent Red Emergency Quick Link */}
      <div className="p-4 rounded-2xl bg-white border border-sky-100 text-xs text-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <strong className="text-[#0B1E3D] block text-sm">Regulatory Notice & Clinical Safety</strong>
            <span className="text-slate-600">This software provides early risk screening and is not a medical diagnosis. Deterministic safety triage is always accessible.</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('emergency-check')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 flex items-center shadow-xs transition-colors cursor-pointer"
        >
          <span>Emergency Symptom Checklist</span>
        </button>
      </div>

      {/* Core Screening & Feature Modules Grid */}
      <section 
        aria-label="Core Care Services" 
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* Module 1: Cardiovascular Health Risk */}
        <div 
          onClick={() => {
            onSelectDisease('cardiovascular');
            onNavigate('emergency-check');
          }}
          className="p-6 rounded-3xl bg-white hover:bg-sky-50/30 border border-sky-100 hover:border-teal-400/80 transition-all shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-[11px] font-mono font-bold bg-amber-50 text-[#C59B27] px-2.5 py-1 rounded-full border border-amber-200">
                4-Qubit VQC
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1E3D] mt-4 group-hover:text-teal-700 transition-colors">
              Cardiovascular Risk Screening
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Evaluate blood pressure patterns, resting pulse dynamics, exertional comfort, and lifestyle factors.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Start Cardiovascular Check</span>
            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 2: Cellular & Breast Health */}
        <div 
          onClick={() => {
            onSelectDisease('breast_cancer');
            onNavigate('emergency-check');
          }}
          className="p-6 rounded-3xl bg-white hover:bg-sky-50/30 border border-sky-100 hover:border-teal-400/80 transition-all shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 group-hover:scale-110 transition-transform">
                <Dna className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-[11px] font-mono font-bold bg-amber-50 text-[#C59B27] px-2.5 py-1 rounded-full border border-amber-200">
                WDBC Dataset
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1E3D] mt-4 group-hover:text-teal-700 transition-colors">
              Cellular & Tissue Biomarkers
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Analyzes multi-dimensional nuclear contour concavity, texture variance, and density indicators.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Start Cellular Screening</span>
            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 3: Neurological Health Screening (5 Conditions) */}
        <div 
          onClick={() => {
            onSelectDisease('neurological');
            onNavigate('neurology-screening');
          }}
          className="p-6 rounded-3xl bg-white hover:bg-sky-50/30 border border-teal-200 hover:border-teal-500 transition-all shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-teal-500 text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-bl-xl tracking-wider">
            5 Conditions
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-[11px] font-mono font-bold bg-amber-50 text-[#C59B27] px-2.5 py-1 rounded-full border border-amber-200">
                Quantum-Acoustic
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1E3D] mt-4 group-hover:text-teal-700 transition-colors">
              Neurological Health Screening
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Screens for Parkinson's, Alzheimer's/MCI, MS, ALS, and Huntington's disease using multi-symptom triage and report analysis.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Launch Neurology Suite</span>
            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 4: HERHEALTH – Women’s Health & Wellness */}
        <div 
          onClick={() => onNavigate('herhealth')}
          className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/50 via-white to-teal-50/30 hover:bg-rose-50/70 border border-rose-200 hover:border-rose-400 transition-all shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-bl-xl tracking-wider">
            SIH 2026 Feature
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-[11px] font-mono font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                Women's Wellness
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1E3D] mt-4 group-hover:text-rose-700 transition-colors">
              HERHEALTH Module
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Period cycle tracking, PCOD/PCOS lifestyle, symptom correlations, mood & digital CBT, non-diagnostic AI assistant, and partner empathy sharing.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-700">
            <span>Open HERHEALTH Hub</span>
            <ArrowRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* HERHEALTH Feature Spotlight Banner */}
      <section className="bg-gradient-to-r from-[#1A0B2E] via-[#351240] to-[#0B1E3D] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden border border-rose-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-rose-400/30">
                Official Module
              </span>
              <span className="text-xs text-slate-300">HERHEALTH – Women’s Health & Wellness</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Holistic Care for Menstrual Cycles, PCOD/PCOS, Hormonal Health & Emotional Wellbeing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Equipped with smart period predictions, symptom tracking, interactive CBT programs, non-diagnostic educational AI, post-menopausal red-flag alerts, and private user-controlled record vaults.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('herhealth')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore HERHEALTH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Neurological Screening Feature Spotlight Banner */}
      <section className="bg-gradient-to-r from-[#0B1E3D] to-[#14325a] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-teal-400/30">
                New Clinical Module
              </span>
              <span className="text-xs text-slate-300">5-Condition Differential Screening</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Comprehensive Neurological Risk Assessment Suite
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Includes Parkinson's, Alzheimer's, Multiple Sclerosis, ALS, and Huntington's. Supports voice acoustics, motor symptoms, and PDF/EMR report uploads with longitudinal tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('neurology-screening')}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0B1E3D] text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Start Screening</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('pipeline-explainer')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center"
            >
              <span>Quantum Circuit</span>
            </button>
          </div>
        </div>
      </section>

      {/* Secondary Modules: Pipeline Explainer & Patient History */}
      <section 
        aria-label="Advanced Features and Historical Records"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Pipeline Explainer Card */}
        <div 
          onClick={() => onNavigate('pipeline-explainer')}
          className="p-6 rounded-3xl bg-white hover:bg-sky-50/30 border border-sky-100 hover:border-teal-400/80 transition-all shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <Zap className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Interactive Circuit
              </span>
            </div>
            <h4 className="text-base font-bold text-[#0B1E3D]">Hybrid Quantum-AI Pipeline Explainer</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Step through all 8 stages from PCA reduction to ZZFeatureMap quantum entanglement and view the interactive 4-qubit circuit with OpenQASM export.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Explore Pipeline & Circuit</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Patient History Card */}
        <div 
          onClick={() => onNavigate('history')}
          className="p-6 rounded-3xl bg-white hover:bg-sky-50/30 border border-sky-100 hover:border-teal-400/80 transition-all shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Trend Analytics
              </span>
            </div>
            <h4 className="text-base font-bold text-[#0B1E3D]">Patient Assessment History & Trends</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              View past risk scores over chronological timelines, export formatted CSV/text reports, and track longitudinal health progress.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>View Historical Records</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>
    </div>
  );
};

