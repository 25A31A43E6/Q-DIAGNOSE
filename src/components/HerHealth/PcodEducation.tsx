import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  Heart, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';

export const PcodEducation: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'What is the primary difference between PCOD and PCOS?',
      a: 'PCOD (Polycystic Ovarian Disease) is a condition where ovaries produce immature or partially mature eggs due to lifestyle and temporary hormonal imbalances. PCOS (Polycystic Ovary Syndrome) is a broader metabolic and endocrine disorder characterized by higher androgen levels, ovulatory dysfunction, and insulin resistance that impacts multiple organ systems.'
    },
    {
      q: 'Can a person with PCOD become pregnant naturally?',
      a: 'Yes, absolutely. Most women with PCOD ovulate and conceive naturally. With supportive lifestyle adjustments, balanced nutrition, and guidance from a gynecologist, ovulatory regularity can be established.'
    },
    {
      q: 'Is extreme weight loss or restrictive dieting required for PCOD?',
      a: 'No. Modern clinical consensus emphasizes weight-neutral metabolic health. Restrictive calorie deprivation frequently triggers high cortisol and sympathetic nervous stress, which can worsen hormonal dysregulation. The focus is on nutrient density, blood sugar stability, and consistent joy in movement.'
    },
    {
      q: 'Why are irregular periods so common in PCOD?',
      a: 'Irregular cycles occur when hormonal signaling between the pituitary gland (LH & FSH) and the ovaries is out of balance, delaying or temporarily preventing the release of a mature egg (anovulation). Without ovulation, progesterone is not produced in sufficient quantities to signal regular shedding of the uterine lining.'
    }
  ];

  const MYTHS_FACTS = [
    {
      myth: 'PCOD only affects women who are overweight or obese.',
      fact: 'False. "Lean PCOD/PCOS" affects up to 20–30% of women who have normal or lower BMI, driven primarily by insulin resistance, chronic stress, or genetic predispositions.'
    },
    {
      myth: 'You must completely eliminate all carbohydrates to manage PCOD.',
      fact: 'False. Carbohydrates are essential for thyroid hormone conversion (T4 to T3). The goal is choosing complex, low-glycemic, fiber-rich carbohydrates (oats, millets, quinoa, beans) rather than refined sugars.'
    },
    {
      myth: 'Birth control pills are the only treatment for PCOD.',
      fact: 'False. While oral contraceptive pills can manage symptoms and regulate monthly bleeding, they do not resolve underlying metabolic drivers. Lifestyle modification, stress reduction, and insulin sensitization remain core first-line interventions.'
    },
    {
      myth: 'Having polycystic ovaries on an ultrasound guarantees you have PCOS.',
      fact: 'False. Up to 25% of healthy women have polycystic-appearing ovaries on ultrasound without fulfilling the clinical diagnostic criteria (such as Rotterdam criteria) for PCOS.'
    }
  ];

  return (
    <div id="herhealth-pcod-education" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">AI-Based PCOD Education & Awareness</h2>
          </div>
          <p className="text-xs text-slate-600">
            Scientifically validated education on PCOD, metabolic dynamics, weight-neutral wellness, and clinical boundaries.
          </p>
        </div>
      </div>

      {/* Non-diagnostic Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Educational Boundary Notice:</strong> This material is provided strictly for awareness and educational empowerment. It cannot confirm or rule out a diagnosis of PCOD/PCOS. Diagnostic confirmation requires formal clinical evaluation, pelvic sonography, and blood biomarker testing by a qualified physician.
        </p>
      </div>

      {/* Symptoms & Contributing Factors Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Symptoms */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#0B1E3D]">Common Clinical Manifestations</h3>
          <div className="space-y-2.5 text-xs">
            {[
              { title: 'Irregular or Delayed Menstruation', desc: 'Cycles exceeding 35 days, oligomenorrhea, or variable flow duration.' },
              { title: 'Androgenic Indicators', desc: 'Mild hirsutism (facial/body hair), adult cystic acne around jawline, or hair thinning at crown.' },
              { title: 'Metabolic & Insulin Cues', desc: 'Intense afternoon sugar cravings, post-meal lethargy, or darkened skin patches (acanthosis nigricans).' },
              { title: 'Pelvic Heaviness & Bloating', desc: 'Mild discomfort or sensation of heaviness due to follicular clustering in ovarian stroma.' }
            ].map((s, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="font-bold text-[#0B1E3D] block">{s.title}</span>
                <span className="text-slate-600">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#0B1E3D]">Contributing Factors & Pathophysiology</h3>
          <div className="space-y-2.5 text-xs">
            {[
              { title: 'Insulin Resistance', desc: 'Elevated circulating insulin stimulates the ovarian theca cells to produce excessive androgens, disrupting normal follicle maturation.' },
              { title: 'Hypothalamic-Pituitary-Adrenal (HPA) Axis Stress', desc: 'Chronic psychological or physiological stress raises adrenal DHEA-S and cortisol, impeding normal LH pulsatility.' },
              { title: 'Low-Grade Systemic Inflammation', desc: 'Elevated inflammatory cytokines impair insulin signaling and ovarian follicular microenvironments.' },
              { title: 'Genetic & Epigenetic Susceptibility', desc: 'Family history of diabetes, gestational diabetes, or menstrual irregularities increases baseline predisposition.' }
            ].map((f, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-fuchsia-50/50 border border-fuchsia-100 space-y-0.5">
                <span className="font-bold text-[#0B1E3D] block">{f.title}</span>
                <span className="text-slate-600">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weight-Neutral Health & Lifestyle Guidance */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-[#0B1E3D]">Evidence-Based, Weight-Neutral Lifestyle Strategies</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 block text-sm">Balanced Glycemic Nutrition</span>
            <p className="text-slate-600 leading-relaxed">
              Pair carbohydrates with dietary fiber and healthy proteins (dal, eggs, tofu) to flatten glucose excursions. Inositol-rich foods like citrus fruits and cantaloupe support cellular insulin sensitization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
            <span className="font-bold text-teal-900 block text-sm">Gentle Resistance & Walking</span>
            <p className="text-slate-600 leading-relaxed">
              Strength training increases GLUT4 transporter translocation in skeletal muscle, clearing blood glucose without insulin dependence. Combine with 20–30 minutes of joyful daily walking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <span className="font-bold text-indigo-900 block text-sm">Nervous System Recovery</span>
            <p className="text-slate-600 leading-relaxed">
              Prioritize 7–8 hours of consistent, restorative sleep. Practice somatic breathwork to lower evening cortisol, supporting natural melatonin secretion and hormonal harmony.
            </p>
          </div>
        </div>
      </div>

      {/* Myths vs Facts */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">PCOD Myths vs. Scientific Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {MYTHS_FACTS.map((item, idx) => (
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

      {/* Accordion FAQs */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Frequently Asked Questions</h3>
        <div className="space-y-2 text-xs">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-[#0B1E3D] bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 bg-white text-slate-600 leading-relaxed border-t border-slate-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* When to Consult a Healthcare Pro */}
      <div className="p-5 rounded-3xl bg-teal-50 border border-teal-200 text-teal-950 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-teal-900">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>When to Schedule a Healthcare Evaluation:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-700">
          <li>Absence of menstruation for more than 90 consecutive days (excluding pregnancy).</li>
          <li>Extremely heavy or prolonged bleeding (soaking through a pad or tampon every hour for 2+ consecutive hours).</li>
          <li>Severe, unremitting pelvic pain or rapid onset of hirsutism and hair loss.</li>
          <li>Difficulty conceiving after 12 months (or 6 months if aged 35+) of timed intercourse.</li>
        </ul>
      </div>
    </div>
  );
};
