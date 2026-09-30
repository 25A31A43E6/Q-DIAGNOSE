import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Sparkles, 
  Heart, 
  Wind, 
  Compass, 
  AlertCircle, 
  RotateCcw, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Minimize2,
  Maximize2,
  Languages
} from 'lucide-react';
import { SupportedLanguage, NavSection, AppMode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface VoiceAssistantProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onNavigate: (section: NavSection, mode?: AppMode) => void;
  currentSection: NavSection;
  currentMode: AppMode;
  onOpenSos: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    type: 'navigate' | 'grounding' | 'sos' | 'screener';
    target?: NavSection;
    label: string;
  };
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  language,
  onLanguageChange,
  onNavigate,
  currentSection,
  currentMode,
  onOpenSos,
  isOpen,
  onToggleOpen,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'नमस्ते! मैं आपका Q-डायग्नोस स्वास्थ्य साथी हूँ। मैं आपको ऐप के हर चरण में मार्गदर्शन कर सकता हूँ, या यदि आपको घबराहट महसूस हो रही है तो शांत करने वाले श्वसन अभ्यास करा सकता हूँ। मैं आपकी क्या मदद करूँ?'
        : language === 'ta'
        ? 'வணக்கம்! நான் உங்கள் Q-டயக்னோஸ் நலன் உதவியாளர். உடல்நலப் பரிசோதனை, நினைவாற்றல் உதவிகள் அல்லது அமைதிப்படுத்தும் சுவாசப் பயிற்சிகளுக்கு நான் உங்களுக்கு வழிகாட்ட முடியும்.'
        : language === 'te'
        ? 'నమస్కారం! నేను మీ Q-డయాగ్నోస్ ఆరోగ్య సహాయకుడిని. మీకు యాప్ ద్వారా మార్గదర్శనం చేయగలను లేదా ఆందోళనగా ఉంటే ప్రశాంతపరిచే శ్వాస పద్ధతులు నేర్పించగలను.'
        : language === 'bn'
        ? 'নমস্কার! আমি আপনার Q-ডায়াগনোজ স্বাস্থ্য সহকারী। আমি আপনাকে স্বাস্থ্য পরীক্ষা, স্মৃতি যত্ন অথবা আতঙ্ক শান্ত করার শ্বাস-প্রশ্বাসের নির্দেশ দিতে পারি।'
        : language === 'mr'
        ? 'नमस्कार! मी आपला Q-डायग्नोस आरोग्य साथी आहे. मी आपल्याला आरोग्य चाचणी, स्मृती काळजी किंवा शांत श्वसन सरावात मदत करू शकतो.'
        : 'Hello, I am your Q-Diagnose companion. I can guide you through early health screenings, memory care routines, or lead a calming breathing exercise if you are feeling anxious. How can I support you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isCalmMode, setIsCalmMode] = useState(false);
  const [calmStep, setCalmStep] = useState<'breathe' | '54321' | 'reassure'>('breathe');
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (4s)' | 'Exhale (4s)' | 'Rest (4s)'>('Inhale (4s)');
  const [breathTimer, setBreathTimer] = useState(4);
  const [sensesStep, setSensesStep] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const breathIntervalRef = useRef<any>(null);

  // Scroll to bottom of message list
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Box Breathing Timer
  useEffect(() => {
    if (isCalmMode && calmStep === 'breathe') {
      let counter = 4;
      let phaseIndex = 0;
      const phases: ('Inhale (4s)' | 'Hold (4s)' | 'Exhale (4s)' | 'Rest (4s)')[ ] = [
        'Inhale (4s)',
        'Hold (4s)',
        'Exhale (4s)',
        'Rest (4s)'
      ];

      breathIntervalRef.current = setInterval(() => {
        counter -= 1;
        if (counter <= 0) {
          phaseIndex = (phaseIndex + 1) % 4;
          setBreathPhase(phases[phaseIndex]);
          counter = 4;
          
          // Optional subtle speech prompt for breathing
          if (isVoiceEnabled && window.speechSynthesis) {
            const shortText = phases[phaseIndex].split(' ')[0];
            const utterance = new SpeechSynthesisUtterance(shortText);
            utterance.rate = 0.85;
            utterance.pitch = 0.9;
            window.speechSynthesis.speak(utterance);
          }
        }
        setBreathTimer(counter);
      }, 1000);

      return () => {
        if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      };
    } else {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    }
  }, [isCalmMode, calmStep, isVoiceEnabled]);

  // Voice Speech Synthesis
  const speakText = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN'
      };
      utterance.lang = langMap[language] || 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not available', e);
    }
  };

  // Voice Recognition (STT)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN'
      };
      recognition.lang = langMap[language] || 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      console.warn(e);
    }
  };

  // Process User Messages and generate intelligent, supportive responses
  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText || inputQuery).trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    const lower = textToSend.toLowerCase();

    // Panic / Distress Detection
    const panicKeywords = [
      'panic', 'panicking', 'panicky', "can't breathe", 'cannot breathe', 
      'terrified', 'scared', 'freaking out', 'overwhelmed', 'anxiety attack',
      'dying', 'chest tight', 'help me breathe', 'घबराहट', 'பயமாக', 'కంగారుగా'
    ];
    const isPanic = panicKeywords.some(k => lower.includes(k));

    if (isPanic) {
      setIsCalmMode(true);
      setCalmStep('breathe');
      const panicResponse: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: "I am right here with you. You are in a safe place. Let's slow everything down together. Follow the gentle box breathing circle on your screen right now: breathe in slowly... hold... and gently breathe out.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: {
          type: 'grounding',
          label: 'Open Grounding & Breathing'
        }
      };
      setMessages(prev => [...prev, panicResponse]);
      speakText("I am right here with you. You are safe. Let's take a slow, gentle breath together.");
      return;
    }

    // Suicidal / Crisis Language Detection
    const crisisKeywords = ['kill myself', 'suicide', 'end my life', 'better off dead', 'hurt myself'];
    if (crisisKeywords.some(k => lower.includes(k))) {
      const crisisResponse: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: "I hear how much pain you are experiencing, and I want you to be safe. You do not have to carry this alone. Please connect right away with compassionate, confidential professionals on the 24/7 Tele-MANAS helpline (14416) or tap SOS below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: {
          type: 'sos',
          label: 'Open Emergency SOS & Helpline'
        }
      };
      setMessages(prev => [...prev, crisisResponse]);
      speakText("Please stay safe. We have immediate crisis support available for you right now.");
      return;
    }

    // Navigation and Feature Routing
    let replyText = '';
    let replyAction: Message['action'] | undefined;

    if (lower.includes('check') || lower.includes('predict') || lower.includes('upload') || lower.includes('test')) {
      replyText = "I can take you directly to 'Check My Health'. There you can choose between Breast Tissue, Cardiovascular, or Vocal biomarker assessments with step-by-step guidance.";
      replyAction = { type: 'navigate', target: 'check', label: 'Go to Check My Health' };
    } else if (lower.includes('result') || lower.includes('score') || lower.includes('finding')) {
      replyText = "I will take you to 'My Results'. You'll see plain-language summaries of what was observed, confidence ranges, and next steps.";
      replyAction = { type: 'navigate', target: 'results', label: 'Go to My Results' };
    } else if (lower.includes('memory') || lower.includes('alzheimer') || lower.includes('cognitive') || lower.includes('routine')) {
      replyText = "Let's open the 'Memory Care' module. It includes today's orientation, medication alarms, daily routines, and family recall prompts.";
      replyAction = { type: 'navigate', target: 'memory', label: 'Go to Memory Care' };
    } else if (lower.includes('mood') || lower.includes('mental') || lower.includes('anxiety') || lower.includes('depression') || lower.includes('phq')) {
      replyText = "Opening 'Mind & Mood'. You can take confidential self-assessments (PHQ-9, GAD-7) and access calming relaxation guides.";
      replyAction = { type: 'navigate', target: 'mind', label: 'Go to Mind & Mood' };
    } else if (lower.includes('clinical') || lower.includes('research') || lower.includes('quantum') || lower.includes('vqc') || lower.includes('benchmark')) {
      replyText = "Switching to Clinical & Research Mode. You can inspect Qiskit Aer simulation circuits, SHAP feature importance, and 5-fold cross-validation benchmarks.";
      replyAction = { type: 'navigate', target: 'dashboard', label: 'Switch to Clinical Mode' };
    } else if (lower.includes('walk me through') || lower.includes('explain this screen') || lower.includes('how does this work')) {
      replyText = getScreenWalkthrough(currentSection, currentMode);
    } else {
      replyText = "I am here to guide you. You can ask me to navigate the app, explain medical terminology, run a guided health assessment, or start a calming breathing session.";
    }

    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: replyAction
    };

    setMessages(prev => [...prev, assistantMsg]);
    speakText(replyText);
  };

  const getScreenWalkthrough = (section: NavSection, mode: AppMode): string => {
    if (mode === 'patient') {
      switch (section) {
        case 'home':
          return "You are on the Home screen. Here you can start a guided health check, access Memory Care routines, explore Mind & Mood screeners, or ask me any question.";
        case 'check':
          return "You are in Check My Health. Select an area (Breast, Cardiovascular, or Vocal), review the simple clinical parameters or load a verified demo patient, and tap 'Run Health Analysis'.";
        case 'results':
          return "This is My Results. It shows what our quantum-classical models found in plain, non-technical words, along with confidence ranges and recommended next steps.";
        case 'memory':
          return "You are in Memory Care. Check today's date and weather, view medication times, complete gentle daily tasks, and review family photo cards.";
        case 'mind':
          return "You are in Mind & Mood. Take confidential depression (PHQ-9) or anxiety (GAD-7) self-checks, and practice evidence-based relaxation exercises.";
        case 'settings':
          return "You are in Settings. Adjust your preferred language, text scaling for readability, voice assistance, and caregiver transparency options.";
        default:
          return "Welcome to Q-Diagnose. I am here to help you navigate smoothly.";
      }
    } else {
      return `You are in Clinical & Research Mode viewing ${section}. Here you can evaluate Qiskit Aer VQC, QNN, and QSVM circuits, analyze noise resilience, and review multi-disease datasets.`;
    }
  };

  const handleStartPanicGrounding = () => {
    setIsCalmMode(true);
    setCalmStep('breathe');
    speakText("Starting guided box breathing. Inhale gently for four seconds... hold... and breathe out.");
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          id="btn-open-voice-assistant"
          onClick={onToggleOpen}
          aria-label="Open AI Voice Assistant and Calm Companion"
          className="fixed bottom-6 right-6 z-40 px-4 py-3.5 rounded-2xl bg-[#0B1E3D] hover:bg-slate-900 text-white shadow-xl shadow-sky-950/20 border border-teal-500/50 flex items-center gap-3 transition-all hover:scale-105 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-400/40 text-teal-300">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform text-teal-300" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-widest text-teal-300 font-bold">AI Companion</div>
            <div className="text-xs font-bold text-white leading-tight">Voice Guide & Calm</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
        </button>
      )}

      {/* Assistant Modal / Sliding Flyout */}
      {isOpen && (
        <div 
          id="voice-assistant-panel"
          className={`fixed bottom-6 right-6 z-50 bg-white border border-[#DCE8F6] rounded-3xl shadow-2xl shadow-sky-950/15 flex flex-col text-[#2D3748] overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-[90vw] sm:w-[600px] h-[85vh]' : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
          role="region"
          aria-label="AI Health Assistant"
        >
          {/* Header */}
          <div className="bg-[#0B1E3D] p-4 flex items-center justify-between text-white border-b border-[#DCE8F6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-400/30 text-teal-300">
                <Bot className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-white">{t.assistantTitle}</h2>
                  <span className="text-[9px] font-mono bg-teal-500/30 text-teal-200 px-1.5 py-0.2 rounded border border-teal-400/40">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-teal-100 opacity-80">{t.assistantStatus}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Switcher Dropdown */}
              <div className="relative group">
                <button
                  id="btn-assistant-lang"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 cursor-pointer"
                  title="Change Assistant Language"
                >
                  <Languages className="w-3.5 h-3.5 text-teal-300" />
                  <span className="font-mono uppercase text-[10px]">{language}</span>
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white border border-[#DCE8F6] rounded-xl shadow-xl py-1 z-50 text-xs w-32">
                  {(['en', 'hi', 'ta', 'te', 'bn', 'mr'] as SupportedLanguage[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => onLanguageChange(l)}
                      className={`w-full text-left px-3 py-1.5 hover:bg-sky-50 flex items-center justify-between cursor-pointer ${
                        language === l ? 'text-teal-700 font-bold bg-teal-50' : 'text-[#2D3748]'
                      }`}
                    >
                      <span>{l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : l === 'ta' ? 'தமிழ்' : l === 'te' ? 'తెలుగు' : l === 'bn' ? 'বাংলা' : 'मराठी'}</span>
                      {language === l && <Check className="w-3 h-3 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Sound Toggle */}
              <button
                id="btn-toggle-assistant-voice"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-1.5 rounded-lg text-white transition-colors cursor-pointer ${
                  isVoiceEnabled ? 'bg-white/15' : 'bg-red-500/40 text-red-200'
                }`}
                title={isVoiceEnabled ? 'Mute Voice Readout' : 'Unmute Voice Readout'}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-teal-300" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Expand Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
              </button>

              {/* Close Panel */}
              <button
                id="btn-close-assistant"
                onClick={onToggleOpen}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Action Pills Bar */}
          <div className="bg-[#F4F8FA] px-4 py-2 border-b border-[#DCE8F6] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              id="btn-assistant-panic-calm"
              onClick={handleStartPanicGrounding}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                isCalmMode ? 'bg-teal-600 text-white font-bold shadow-xs' : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.calmGroundingButton}</span>
            </button>
            
            <button
              id="btn-assistant-walkthrough"
              onClick={() => handleSendMessage('Walk me through this screen')}
              className="px-2.5 py-1 rounded-full bg-white text-[#0B1E3D] border border-[#DCE8F6] hover:bg-sky-50 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>Explain this page</span>
            </button>

            <button
              onClick={() => handleSendMessage('Take me to Check My Health')}
              className="px-2.5 py-1 rounded-full bg-white text-[#2D3748] border border-[#DCE8F6] hover:bg-sky-50 transition-all shrink-0 cursor-pointer"
            >
              Check Health
            </button>

            <button
              onClick={() => handleSendMessage('Take me to Memory Care')}
              className="px-2.5 py-1 rounded-full bg-white text-[#2D3748] border border-[#DCE8F6] hover:bg-sky-50 transition-all shrink-0 cursor-pointer"
            >
              Memory Care
            </button>

            <button
              onClick={() => handleSendMessage('Take me to Mind & Mood')}
              className="px-2.5 py-1 rounded-full bg-white text-[#2D3748] border border-[#DCE8F6] hover:bg-sky-50 transition-all shrink-0 cursor-pointer"
            >
              Mind & Mood
            </button>
          </div>

          {/* Interactive Calm / Panic Grounding Overlay */}
          {isCalmMode ? (
            <div className="flex-1 p-5 bg-[#F4F8FA] flex flex-col items-center justify-between text-center overflow-y-auto">
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-teal-700 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-teal-600" />
                  Calm Grounding Mode
                </span>
                <button
                  onClick={() => setIsCalmMode(false)}
                  className="text-xs text-[#2D3748] hover:text-[#0B1E3D] px-2.5 py-1 rounded-lg bg-white border border-[#DCE8F6] shadow-xs cursor-pointer"
                >
                  Exit Grounding
                </button>
              </div>

              {/* Sub-Tabs for Grounding */}
              <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-[#DCE8F6] shadow-xs mt-2">
                <button
                  onClick={() => setCalmStep('breathe')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    calmStep === 'breathe' ? 'bg-teal-600 text-white font-bold' : 'text-[#2D3748] hover:text-[#0B1E3D]'
                  }`}
                >
                  Box Breathing
                </button>
                <button
                  onClick={() => setCalmStep('54321')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    calmStep === '54321' ? 'bg-teal-600 text-white font-bold' : 'text-[#2D3748] hover:text-[#0B1E3D]'
                  }`}
                >
                  5-4-3-2-1 Senses
                </button>
                <button
                  onClick={() => setCalmStep('reassure')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    calmStep === 'reassure' ? 'bg-teal-600 text-white font-bold' : 'text-[#2D3748] hover:text-[#0B1E3D]'
                  }`}
                >
                  Support Resources
                </button>
              </div>

              {/* 1. Box Breathing View */}
              {calmStep === 'breathe' && (
                <div className="my-auto flex flex-col items-center space-y-4">
                  {/* Pulsing Visual Ring */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full bg-teal-100 transition-transform duration-1000 ${
                      breathPhase.startsWith('Inhale') ? 'scale-125 bg-teal-200/50' : breathPhase.startsWith('Exhale') ? 'scale-90 bg-teal-100/50' : 'scale-110 bg-teal-150'
                    }`}></div>
                    <div className="w-32 h-32 rounded-full border-4 border-teal-500 flex flex-col items-center justify-center bg-white shadow-lg z-10">
                      <span className="text-sm font-extrabold text-teal-700 tracking-wide">{breathPhase}</span>
                      <span className="text-2xl font-black font-mono text-[#0B1E3D] mt-0.5">{breathTimer}s</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#2D3748] opacity-80 max-w-xs leading-relaxed">
                    Allow your shoulders to soften. You are safe. Continue matching your breath to the rhythm.
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setCalmStep('54321')}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Try 5-4-3-2-1 Senses</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* 2. 5-4-3-2-1 Senses View */}
              {calmStep === '54321' && (
                <div className="my-auto max-w-sm space-y-4 text-left">
                  <div className="p-4 rounded-2xl bg-white border border-[#DCE8F6] shadow-sm space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 font-bold">
                      Cognitive Redirection
                    </span>
                    <h3 className="text-sm font-bold text-[#0B1E3D]">
                      {sensesStep === 5 && '5 Things you can SEE right now'}
                      {sensesStep === 4 && '4 Things you can physically TOUCH'}
                      {sensesStep === 3 && '3 Sounds you can HEAR around you'}
                      {sensesStep === 2 && '2 Scents you can SMELL in the air'}
                      {sensesStep === 1 && '1 Thing you can TASTE right now'}
                    </h3>
                    <p className="text-xs text-[#2D3748] opacity-80">
                      {sensesStep === 5 && 'Look around the room: notice a clock, a light, a table, or wall pattern.'}
                      {sensesStep === 4 && 'Feel your clothes against your skin, your feet on the floor, or the cool desk.'}
                      {sensesStep === 3 && 'Listen closely: the fan hum, your own breath, or distant street noise.'}
                      {sensesStep === 2 && 'Notice any scent in the room, soap, or take a breath of fresh air.'}
                      {sensesStep === 1 && 'Take a sip of water or notice the clean baseline taste in your mouth.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[5, 4, 3, 2, 1].map((st) => (
                        <button
                          key={st}
                          onClick={() => setSensesStep(st)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            sensesStep === st ? 'bg-teal-600 text-white font-black' : 'bg-white border border-[#DCE8F6] text-[#2D3748] hover:bg-sky-50'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                    {sensesStep > 1 ? (
                      <button
                        onClick={() => setSensesStep(sensesStep - 1)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Next Sense ({sensesStep - 1})
                      </button>
                    ) : (
                      <button
                        onClick={() => setCalmStep('reassure')}
                        className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Finish Grounding
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Reassurance & Non-Pushy Resources */}
              {calmStep === 'reassure' && (
                <div className="my-auto max-w-sm space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center border border-teal-200">
                    <Check className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1E3D]">How are you feeling now?</h3>
                  <p className="text-xs text-[#2D3748] opacity-80 leading-relaxed">
                    You navigated through the acute surge. Your autonomic nervous system is resetting. Would you like to view support resources or notify someone?
                  </p>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={onOpenSos}
                      className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Open Emergency Helpline / Notify Caregiver</span>
                    </button>
                    <button
                      onClick={() => setIsCalmMode(false)}
                      className="w-full py-2 rounded-xl bg-white border border-[#DCE8F6] hover:bg-sky-50 text-[#2D3748] text-xs font-medium cursor-pointer"
                    >
                      I am feeling better, return to chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Standard Interactive Chat Stream */
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F8FA]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-white text-[#2D3748] rounded-bl-none border border-[#DCE8F6]'
                    }`}
                  >
                    <p>{msg.text}</p>
                    
                    {/* Action Deep-Link Button */}
                    {msg.action && (
                      <div className="mt-2.5 pt-2 border-t border-[#DCE8F6]">
                        {msg.action.type === 'navigate' && msg.action.target && (
                          <button
                            onClick={() => {
                              onNavigate(msg.action!.target!);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight className="w-3 h-3 text-white" />
                          </button>
                        )}
                        {msg.action.type === 'sos' && (
                          <button
                            onClick={onOpenSos}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight className="w-3 h-3 text-white" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-[#2D3748] opacity-60 px-1 mt-0.5">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Footer Input Bar */}
          {!isCalmMode && (
            <div className="p-3 bg-white border-t border-[#DCE8F6]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Speech to Text Mic Button */}
                <button
                  type="button"
                  id="btn-voice-mic"
                  onClick={toggleSpeechRecognition}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300'
                      : 'bg-[#F4F8FA] hover:bg-sky-100 text-teal-700 border border-[#DCE8F6]'
                  }`}
                  title={isListening ? 'Listening (Tap to stop)' : 'Speak in your language'}
                >
                  {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-teal-600" />}
                </button>

                {/* Text Input */}
                <input
                  id="input-assistant-query"
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={t.assistantPromptPlaceholder}
                  className="flex-1 bg-[#F4F8FA] border border-[#DCE8F6] rounded-xl px-3.5 py-2 text-xs text-[#2D3748] placeholder:text-[#2D3748]/50 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                />

                {/* Send Button */}
                <button
                  id="btn-send-assistant-query"
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:hover:bg-teal-600 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>

              {/* Micro Disclaimer */}
              <div className="mt-2 text-[10px] text-[#2D3748] opacity-70 flex items-center justify-between px-1">
                <span>Non-diagnostic AI health support</span>
                <span className="font-mono text-teal-700 font-bold">Emergency? Call 112</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
