import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw, 
  User, 
  ExternalLink,
  PhoneCall
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRedFlagWarning?: boolean;
}

const SUGGESTED_PROMPTS = [
  'What foods and nutrients may help relieve menstrual cramps?',
  'How does PCOD differ from PCOS?',
  'Why do fatigue and mood shifts often happen during the luteal phase?',
  'What are post-menopausal bleeding red flags?',
  'What gentle stretches help ease pelvic tension?'
];

export const AiHealthCompanionHer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-001',
      sender: 'assistant',
      text: "Hello! I am your HERHEALTH Educational Companion. I am here to share evidence-based information on women's health, cycle phases, and self-care strategies. \n\n*Important Notice: I am an AI educational tool, not a doctor. I cannot diagnose medical conditions or prescribe medications. If you ever experience sudden severe pain, heavy hemorrhaging, or post-menopausal bleeding, please seek immediate medical care.* How can I support your wellness learning today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call backend companion API or fallback to safe curated medical knowledge base
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: 'herhealth-womens-wellness',
          history: messages.map(m => ({ sender: m.sender, text: m.text }))
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        const replyText = data.reply || data.response || generateSafeLocalResponse(query);
        const hasRedFlag = checkRedFlag(query) || checkRedFlag(replyText);

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRedFlagWarning: hasRedFlag
          }
        ]);
      } else {
        // Safe educational responder
        await new Promise(r => setTimeout(r, 800));
        const replyText = generateSafeLocalResponse(query);
        const hasRedFlag = checkRedFlag(query) || checkRedFlag(replyText);

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRedFlagWarning: hasRedFlag
          }
        ]);
      }
    } catch {
      const replyText = generateSafeLocalResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRedFlagWarning: checkRedFlag(query)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const checkRedFlag = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes('post-menopause') ||
      lower.includes('postmenopausal bleeding') ||
      lower.includes('severe bleeding') ||
      lower.includes('fainting') ||
      lower.includes('emergency') ||
      lower.includes('soaking')
    );
  };

  const generateSafeLocalResponse = (q: string): string => {
    const query = q.toLowerCase();

    if (query.includes('post-menopausal') || query.includes('after menopause') || query.includes('bleeding after')) {
      return `**CRITICAL RED-FLAG GUIDANCE: Post-Menopausal Bleeding**\n\nAny vaginal bleeding or spotting that occurs 12 or more months after the final menstrual period is considered abnormal and **must be evaluated promptly by a gynecologist**.\n\n• **Potential causes**: While common non-malignant causes include endometrial atrophy or polyps, it is essential to rule out endometrial hyperplasia or uterine malignancies via pelvic ultrasound and endometrial biopsy.\n• **Immediate Action**: Please schedule an urgent appointment with an OB-GYN. If bleeding is accompanied by dizziness or weakness, visit the nearest emergency facility immediately.`;
    }

    if (query.includes('cramp') || query.includes('pain') || query.includes('period pain')) {
      return `Period cramps (primary dysmenorrhea) are caused by prostaglandins—hormone-like lipids that prompt the uterine muscle to contract to shed its lining.\n\n• **Self-Care Approaches**:\n  - **Heat Therapy**: Applying a warm heating pad or taking a warm bath relaxes the myometrium and increases blood circulation.\n  - **Nutrition**: Magnesium-rich foods (pumpkin seeds, dark leafy greens) and Omega-3 fatty acids (flaxseeds, walnuts) help modulate inflammatory prostaglandins.\n  - **Gentle Movement**: Gentle pelvic tilts and Child's Pose (Balasana) relieve lumbar and sacral tension.\n  - **Hydration**: Warm herbal infusions such as chamomile or ginger tea.\n\n*Notice: If cramps are sudden, incapacitating, or radiate into the leg, please consult a healthcare professional to assess for underlying causes like endometriosis or fibroids.*`;
    }

    if (query.includes('pcod') || query.includes('pcos')) {
      return `**PCOD vs. PCOS Distinction**:\n\n• **PCOD (Polycystic Ovarian Disease)**: Often characterized by the ovaries releasing immature or partially mature eggs, forming small benign cysts. It is largely manageable through balanced nutrition, consistent physical movement, and sleep synchronization.\n• **PCOS (Polycystic Ovary Syndrome)**: A more complex systemic endocrine disorder involving higher androgen levels, hyperinsulinemia, irregular ovulatory cycles, and broader metabolic impacts.\n\n• **Evidence-Informed Lifestyle Pillars**:\n  - Focus on low-glycemic, fiber-rich meals with lean proteins to stabilize post-prandial insulin.\n  - Engage in resistance training and gentle somatic walking.\n  - Support stress management: chronic cortisol elevations can disrupt hypothalamic-pituitary-ovarian signaling.\n\n*Please discuss with your gynecologist and endocrinologist for accurate ultrasound evaluation and targeted blood hormone panels.*`;
    }

    if (query.includes('fatigue') || query.includes('tired') || query.includes('luteal')) {
      return `Experiencing fatigue during the luteal phase (the 10–14 days before your period) is a well-documented physiological occurrence:\n\n1. **Progesterone Peak**: Progesterone is a natural mild sedative that interacts with GABA-A receptors in the brain.\n2. **Basal Metabolic Rate**: Your body's resting energy expenditure increases slightly after ovulation, demanding more caloric and rest energy.\n3. **Serotonin Fluctuations**: Declining estrogen toward late luteal phase can temporarily reduce serotonin availability.\n\n• **Supportive Tips**: Prioritize 8 hours of sleep, incorporate complex carbohydrates (oats, sweet potatoes) to support serotonin synthesis, and avoid excessive afternoon caffeine which can impair restorative deep sleep.`;
    }

    if (query.includes('stretch') || query.includes('yoga') || query.includes('exercise')) {
      return `**Gentle Somatic Stretches for Menstrual & Pelvic Relief**:\n\n1. **Supta Baddha Konasana (Reclining Bound Angle)**: Soles of feet together, knees open wide with cushions under thighs. Releases inner groin and pelvic floor tension.\n2. **Balasana (Child's Pose)**: Wide knees with torso resting forward. Decompresses the lumbar spine and promotes deep diaphragmatic breathing.\n3. **Cat-Cow (Marjaryasana-Bitilasana)**: Gentle rhythmic spinal mobilization that enhances circulation to abdominal organs.\n4. **Viparita Karani (Legs-Up-The-Wall)**: Promotes venous return, relieves heavy legs, and calms the sympathetic nervous system.\n\n*Remember to move gently and listen to your body's comfort levels.*`;
    }

    return `Thank you for your question. From a women's wellness perspective, hormonal fluctuations across the menstrual cycle interact with sleep, metabolism, and mood.\n\n• **Holistic Self-Care Principles**:\n  - Consistent hydration (at least 2 liters of water daily).\n  - Whole foods rich in iron, zinc, B-vitamins, and essential fatty acids.\n  - Gentle physical activity adapted to your energy phase.\n  - Somatic breathwork to support the parasympathetic nervous system.\n\n*Please remember that this information is educational only. If you are experiencing persistent or worsening symptoms, consult your primary care doctor or gynecologist.*`;
  };

  return (
    <div id="herhealth-ai-companion" className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <Bot className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">AI Health Companion (Educational)</h2>
          </div>
          <p className="text-xs text-slate-600">
            Ask questions about cycle phases, nutrition, self-care routines, PCOD awareness, and lifestyle strategies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safety Protocols Active</span>
          </span>
        </div>
      </div>

      {/* Strict AI Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-700 leading-relaxed">
          <strong className="text-amber-950 block">AI Safety & Non-Diagnostic Disclosure:</strong>
          This companion provides educational health information only. It does <strong>not</strong> diagnose medical conditions, prescribe medications, alter dosages, or claim medical certainty. Always consult a qualified physician or gynecologist for diagnosis and treatment.
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-rose-600 text-white font-medium rounded-tr-xs'
                        : msg.isRedFlagWarning
                        ? 'bg-rose-50 text-rose-950 border-2 border-rose-300 rounded-tl-xs shadow-xs'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>

                  <span className="text-[10px] text-slate-400 px-1 block">
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Generating evidence-informed educational guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Row */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about cycle symptoms, nutrition, PCOD lifestyle habits, or red flags..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs focus:outline-teal-500 bg-slate-50/50"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
