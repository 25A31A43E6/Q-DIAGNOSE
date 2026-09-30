import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  HeartHandshake, 
  Activity, 
  Stethoscope 
} from 'lucide-react';

interface MedicalAlertsRedFlagsProps {
  onOpenSos: () => void;
  onNavigateDoctors?: () => void;
}

export const MedicalAlertsRedFlags: React.FC<MedicalAlertsRedFlagsProps> = ({
  onOpenSos,
  onNavigateDoctors,
}) => {
  return (
    <div id="herhealth-medical-alerts" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-rose-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Clinical Red Flags & Urgent Medical Protocols</h2>
          </div>
          <p className="text-xs text-slate-600">
            Critical gynecological symptoms requiring prompt physician consultation, clinical triage, or emergency evaluation.
          </p>
        </div>

        <button
          onClick={onOpenSos}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Emergency SOS Dial (112 / 911)</span>
        </button>
      </div>

      {/* HIGHEST PRIORITY CRITICAL ALERT: POST-MENOPAUSAL BLEEDING */}
      <div 
        id="critical-post-menopausal-bleeding-card"
        className="bg-gradient-to-br from-rose-600 via-rose-700 to-red-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5 border-2 border-rose-400/50 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 text-rose-200 font-mono text-xs tracking-wider uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>High Priority Clinical Warning</span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Post-Menopausal Bleeding: Always Requires Medical Evaluation
          </h3>
          <p className="text-sm sm:text-base text-rose-100 leading-relaxed font-medium">
            Any vaginal bleeding, spotting, pink discharge, or brown staining occurring 12 or more months after your final menstrual period is <strong>never normal</strong> and requires immediate clinical assessment by an OB-GYN.
          </p>
        </div>

        {/* Why it Matters Box */}
        <div className="bg-black/25 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-2 text-xs">
          <span className="font-bold text-rose-200 text-sm block">Why This Evaluation Matters:</span>
          <p className="text-rose-50 leading-relaxed">
            In approximately 90% of cases, post-menopausal bleeding is caused by benign conditions such as endometrial atrophy, cervical polyps, or hormonal fluctuations. However, in approximately 10% of cases, it can be an early warning sign of endometrial hyperplasia or uterine cancer. Early detection through pelvic ultrasound and endometrial biopsy provides exceptionally high cure rates.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onNavigateDoctors ? (
            <button
              onClick={onNavigateDoctors}
              className="px-6 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Seek Medical Evaluation / Find Gynecologist</span>
            </button>
          ) : (
            <a
              href="#hospitals"
              className="px-6 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-102"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Seek Medical Evaluation / Find Gynecologist</span>
            </a>
          )}

          <button
            onClick={onOpenSos}
            className="px-5 py-3 rounded-2xl bg-rose-950/60 hover:bg-rose-950 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/25 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Services</span>
          </button>
        </div>
      </div>

      {/* Post-Menopausal Vaginal & Urinary Changes (GSM) Education */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">
          Genitourinary Syndrome of Menopause (GSM): What to Expect
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The natural decrease in estrogen after menopause affects both vaginal mucosal tissue and the lower urinary tract. Unlike vasomotor hot flashes which improve over time, untreated GSM is progressive but highly treatable.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-[#0B1E3D] block text-sm">Vaginal Changes</span>
            <p className="text-slate-600 leading-relaxed">
              Thinning of the vaginal epithelium, decreased natural lubrication, burning sensations, itching, and dyspareunia (painful intimacy).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-[#0B1E3D] block text-sm">Urinary Symptoms</span>
            <p className="text-slate-600 leading-relaxed">
              Increased urinary urgency, daytime frequency, nocturia, recurrent urinary tract infections (UTIs), and stress or urge incontinence.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-[#0B1E3D] block text-sm">Medical Management</span>
            <p className="text-slate-600 leading-relaxed">
              Prescription localized low-dose vaginal estrogen (creams, tablets, or rings) repairs mucosal integrity without significant systemic absorption.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Red Flag Warning Grid */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Other Critical Gynecological Red Flags</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {[
            {
              title: 'Severe Menorrhagia (Heavy Bleeding)',
              criteria: 'Soaking through one or more sanitary pads or tampons every hour for two consecutive hours, or passing blood clots larger than a quarter.',
              action: 'Risk of acute anemia; seek same-day clinical attention or visit urgent care.'
            },
            {
              title: 'Sudden, Sharp Unilateral Pelvic Pain',
              criteria: 'Intense stabbing pelvic pain, particularly if accompanied by dizziness, shoulder-tip pain, or fainting.',
              action: 'Potential ovarian torsion or ectopic pregnancy; requires immediate emergency sonography.'
            },
            {
              title: 'Foul-Smelling Vaginal Discharge with Fever',
              criteria: 'Greenish or purulent discharge accompanied by pelvic tenderness, chills, and fever above 38°C (100.4°F).',
              action: 'Possible pelvic inflammatory disease (PID) or acute bacterial vaginosis; requires prompt antibiotic evaluation.'
            },
            {
              title: 'Palpable Pelvic or Abdominal Mass',
              criteria: 'Unexplained firm lump, persistent abdominal distension, rapid unintended weight loss, or early satiety.',
              action: 'Requires gynecological pelvic examination and diagnostic pelvic MRI/ultrasound.'
            }
          ].map((flag, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{flag.title}</span>
              </div>
              <p className="text-slate-700">
                <strong>Symptoms:</strong> {flag.criteria}
              </p>
              <div className="p-2 rounded-xl bg-white border border-rose-200 text-[11px] font-semibold text-rose-800">
                {flag.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
