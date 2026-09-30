import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface Article {
  id: string;
  category: 'Menstrual' | 'PMS/PMDD' | 'PCOD/PCOS' | 'Menopause' | 'Reproductive' | 'Preventive';
  title: string;
  summary: string;
  readTime: string;
  keyPoints: string[];
  clinicalNote: string;
}

const ARTICLES: Article[] = [
  {
    id: 'art-001',
    category: 'PMS/PMDD',
    title: 'Understanding PMS vs. PMDD (Premenstrual Dysphoric Disorder)',
    summary: 'While premenstrual syndrome (PMS) affects up to 75% of menstruating individuals with mild physical and emotional changes, PMDD is a severe, debilitating neuroendocrine reaction affecting 3–8%.',
    readTime: '4 min read',
    keyPoints: [
      'PMDD involves severe emotional dysphoria, sudden tearfulness, rage, or hopelessness in the late luteal phase.',
      'Symptom onset occurs exclusively in the 7–14 days prior to menstruation and resolves within days of bleeding.',
      'Driven by abnormal cellular sensitivity in brain GABA-A receptors to normal allopregnanolone drops rather than abnormal hormone levels.'
    ],
    clinicalNote: 'If premenstrual emotional distress impairs your work, relationships, or leads to thoughts of despair, seek a medical evaluation. First-line treatments include SSRIs, cognitive therapy, and targeted hormonal therapies.'
  },
  {
    id: 'art-002',
    category: 'Menopause',
    title: 'Perimenopause, Menopause, and Post-Menopausal Biology',
    summary: 'The natural biological transition marking the end of reproductive years, defined officially after 12 consecutive months without a menstrual period.',
    readTime: '5 min read',
    keyPoints: [
      'Perimenopause can begin 4–8 years before the final period, featuring fluctuating estrogen, hot flashes, and sleep disturbances.',
      'Average age of natural menopause globally is 51 years (46–48 in South Asian populations).',
      'Post-menopausal health prioritizes bone density (osteoporosis screening) and cardiovascular preservation due to reduced cardioprotective estrogen.'
    ],
    clinicalNote: 'Critical Red Flag: Any vaginal bleeding or spotting occurring after menopause (12 months without a period) requires prompt gynecological evaluation to rule out endometrial pathology.'
  },
  {
    id: 'art-003',
    category: 'Preventive',
    title: 'Essential Preventive Screenings Across the Female Lifespan',
    summary: 'Routine preventative screenings detect cervical dysplasia, breast tissue changes, and bone mineral loss years before clinical symptoms emerge.',
    readTime: '6 min read',
    keyPoints: [
      'Cervical Cancer Screening: High-risk HPV testing and Pap smears every 3–5 years starting at age 21 to 25 depending on national guidelines.',
      'Clinical Breast Exams & Mammography: Annual or biennial mammograms typically recommended starting between ages 40–50.',
      'Bone Mineral Density (DEXA): Recommended at age 65 or earlier if clinical risk factors (early surgical menopause, corticosteroid use) exist.',
      'Cardiometabolic Panels: Fasting blood glucose, lipid profile, and blood pressure screening.'
    ],
    clinicalNote: 'Routine preventative visits foster proactive relationship building with your clinician and ensure timely vaccination (such as the HPV vaccine).'
  },
  {
    id: 'art-004',
    category: 'Menstrual',
    title: 'The Physiology of the Menstrual Cycle: A Vital Sign of Health',
    summary: 'The menstrual cycle is increasingly recognized by the American College of Obstetricians and Gynecologists (ACOG) as a fifth vital sign of female systemic health.',
    readTime: '4 min read',
    keyPoints: [
      'Regulated by the hypothalamic-pituitary-ovarian (HPO) axis.',
      'Normal cycle interval ranges between 21 and 35 days with 2–7 days of bleeding.',
      'Excessive exercise, acute calorie deprivation, or severe emotional distress can suppress GnRH, resulting in functional hypothalamic amenorrhea.'
    ],
    clinicalNote: 'Sudden cycle cessation for more than 3 months without pregnancy warrants endocrine evaluation including prolactin, thyroid-stimulating hormone (TSH), and FSH.'
  },
  {
    id: 'art-005',
    category: 'Reproductive',
    title: 'Endometriosis & Adenomyosis: Beyond Normal Period Pain',
    summary: 'Endometriosis occurs when tissue similar to the endometrium grows outside the uterus, inciting chronic inflammatory pain, scarring, and adhesions.',
    readTime: '5 min read',
    keyPoints: [
      'Affects approximately 1 in 10 women of reproductive age worldwide.',
      'Hallmarks include incapacitating dysmenorrhea, deep dyspareunia (pain with intercourse), chronic pelvic pain, and bowel/bladder pain during periods.',
      'Often delayed in diagnosis by 7–10 years due to normalization of period pain.'
    ],
    clinicalNote: 'Pain that prevents attending school or work, or that does not respond to standard over-the-counter pain medication, is not "normal period pain" and deserves laparoscopic or high-resolution ultrasound consultation.'
  }
];

export const DigitalHealthEducation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('art-001');

  const CATEGORIES = ['All', 'Menstrual', 'PMS/PMDD', 'PCOD/PCOS', 'Menopause', 'Reproductive', 'Preventive'];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyPoints.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div id="herhealth-digital-education" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Digital Health Education Library</h2>
          </div>
          <p className="text-xs text-slate-600">
            Peer-reviewed articles, screening guidelines, and clinical insights across the reproductive lifespan.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-sky-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by topic (e.g. PMDD, Pap smear, Menopause, Endometriosis)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B1E3D] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid & Expansion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => {
          const isExpanded = expandedArticleId === art.id;
          return (
            <div
              key={art.id}
              className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{art.readTime}</span>
                </div>

                <h3 className="text-base font-bold text-[#0B1E3D] leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {art.summary}
                </p>

                {isExpanded && (
                  <div className="space-y-3 pt-2 border-t border-slate-100 text-xs animate-fadeIn">
                    <div>
                      <span className="font-bold text-[#0B1E3D] block mb-1.5">Key Clinical Takeaways:</span>
                      <ul className="space-y-1.5 text-slate-700">
                        {art.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-950 space-y-1">
                      <span className="font-bold text-teal-900 block text-[11px]">When to Discuss with a Clinician:</span>
                      <p className="text-[11px] leading-relaxed text-slate-700">{art.clinicalNote}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{isExpanded ? 'Collapse Article' : 'Read Full Clinical Guide'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
