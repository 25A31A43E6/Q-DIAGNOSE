import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Droplet, 
  Sparkles, 
  Clock 
} from 'lucide-react';

export const MenstrualAwareness: React.FC = () => {
  const HYGIENE_RULES = [
    {
      title: 'Regular Changing Intervals',
      desc: 'Change sanitary pads every 4 to 6 hours, and tampons every 4 to 8 hours (never exceed 8 hours) regardless of flow intensity, to avert bacterial colonization.',
      icon: Clock,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Gentle External Cleansing Only',
      desc: 'Clean the vulva with plain warm water only. Strictly avoid internal vaginal douching, perfumed body washes, or vaginal deodorants which destroy protective Lactobacillus flora.',
      icon: Droplet,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Hand Hygiene Protocols',
      desc: 'Always wash hands thoroughly with soap before and after handling any menstrual product (pads, cups, tampons, discs) to prevent introduction of pathogens into the vaginal canal.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Safe Menstrual Cup Sterilization',
      desc: 'Boil silicone menstrual cups in rolling boiling water for 5–7 minutes between menstrual cycles. During your cycle, rinse with clean potable water and mild fragrance-free cleanser.',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  const MYTHS = [
    {
      myth: 'You cannot exercise or swim while menstruating.',
      fact: 'Exercise is completely safe and actually beneficial. Mild to moderate physical activity prompts beta-endorphin release, a natural analgesic that relieves cramping.'
    },
    {
      myth: 'Menstrual blood is dirty or "impure" toxic waste.',
      fact: 'Menstrual fluid consists of non-toxic normal shedding endometrium, mucus, cervical fluids, and ordinary arterial/venous blood. It is a natural biological sign of reproductive health.'
    },
    {
      myth: 'Wearing a tampon or cup can break or harm internal reproductive organs.',
      fact: 'Anatomically, the cervix has a tiny pin-sized opening that prevents tampons or cups from travelling anywhere else inside the abdominal cavity.'
    },
    {
      myth: 'Severe period pain is just a natural part of being a woman and must be tolerated.',
      fact: 'Mild discomfort is common, but incapacitating pain that stops daily activities is not normal. It may indicate conditions like endometriosis or adenomyosis that require medical attention.'
    }
  ];

  return (
    <div id="herhealth-menstrual-awareness" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-200">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Menstrual Health & Safe Hygiene Awareness</h2>
          </div>
          <p className="text-xs text-slate-600">
            Dismantling taboos through biological education, sanitary hygiene guidelines, and clinical red-flag vigilance.
          </p>
        </div>
      </div>

      {/* 4 Golden Hygiene Practices */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Evidence-Based Sanitary Hygiene Guidelines</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {HYGIENE_RULES.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${rule.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[#0B1E3D] text-sm">{rule.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-1">
                  {rule.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toxic Shock Syndrome (TSS) & Urgent Signs */}
      <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
          <AlertTriangle className="w-4 h-4 text-rose-700" />
          <span>Critical Warning: Toxic Shock Syndrome (TSS) Awareness</span>
        </div>
        <p className="text-slate-700 leading-relaxed">
          TSS is a rare but life-threatening complication of certain bacterial infections (Staphylococcus aureus and Streptococcus pyogenes), most frequently associated with leaving high-absorbency tampons or cups in place for extended intervals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-semibold text-rose-900">
          <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200">
            • Sudden high fever (&gt;38.9°C / 102°F)
          </div>
          <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200">
            • Sunburn-like rash, dizziness, or fainting
          </div>
          <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200">
            • Rapid drop in blood pressure or vomiting
          </div>
        </div>

        <p className="text-[11px] text-rose-800 font-bold">
          Action: If these symptoms arise while using a tampon or menstrual cup, remove the product immediately and seek urgent emergency department care.
        </p>
      </div>

      {/* Myths vs Facts Grid */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Menstrual Myths vs. Medical Science</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {MYTHS.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start gap-2 text-rose-700 font-semibold">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Myth: {item.myth}</span>
              </div>
              <div className="flex items-start gap-2 text-emerald-800 font-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Fact: {item.fact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
