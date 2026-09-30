import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  RefreshCw, 
  AlertTriangle, 
  Languages, 
  HelpCircle, 
  ShieldAlert,
  Mic,
  MicOff,
  ChevronDown,
  Info,
  Check,
  Volume2,
  VolumeX
} from 'lucide-react';
import { SupportedLanguage, PredictionResult, CompanionLocale, CompanionLocaleOption } from '../types';
import { COMPANION_LOCALES, COMPANION_REGISTER_GREETINGS } from '../data/companionLocales';

interface AiHealthCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: PredictionResult | null;
  currentLang?: SupportedLanguage;
  companionLocale?: CompanionLocale;
  onCompanionLocaleChange?: (locale: CompanionLocale) => void;
  onUiLanguageChange?: (lang: SupportedLanguage) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  locale?: CompanionLocale;
}

const TTS_LANG_MAP: Record<CompanionLocale, string> = {
  india_en: 'en-IN',
  american: 'en-US',
  british: 'en-GB',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  kn: 'kn-IN',
  pa: 'pa-IN',
  gu: 'gu-IN',
  ml: 'ml-IN'
};

export const AiHealthCompanion: React.FC<AiHealthCompanionProps> = ({
  isOpen,
  onClose,
  currentResult,
  currentLang = 'en',
  companionLocale: propCompanionLocale,
  onCompanionLocaleChange,
  onUiLanguageChange
}) => {
  // Locale state persisted in localStorage
  const [activeLocale, setActiveLocale] = useState<CompanionLocale>(() => {
    if (propCompanionLocale) return propCompanionLocale;
    const saved = localStorage.getItem('qdiagnose_companion_locale');
    return (saved as CompanionLocale) || 'india_en';
  });

  const [showRegionalPicker, setShowRegionalPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    return localStorage.getItem('qdiagnose_companion_autospeak') === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-init',
      sender: 'assistant',
      text: COMPANION_REGISTER_GREETINGS['india_en'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      locale: 'india_en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentOption = COMPANION_LOCALES.find(l => l.id === activeLocale) || COMPANION_LOCALES[0];

  // Stop TTS if companion closes or unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMsgId(null);
  }, []);

  // Text-To-Speech function calibrated for selected companion locale
  const speakText = useCallback((rawText: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean text of markdown formatting, bracket labels, and asterisk emphasis
    const cleanText = rawText
      .replace(/\[.*?\]/g, '')
      .replace(/[*_#`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLangCode = TTS_LANG_MAP[activeLocale] || 'en-IN';
    utterance.lang = targetLangCode;
    utterance.rate = activeLocale === 'india_en' ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    // Try matching an installed system voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find(v => v.lang === targetLangCode || v.lang.startsWith(targetLangCode.split('-')[0]));
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (msgId) setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [activeLocale]);

  // Sync prop if changed externally
  useEffect(() => {
    if (propCompanionLocale && propCompanionLocale !== activeLocale) {
      setActiveLocale(propCompanionLocale);
    }
  }, [propCompanionLocale, activeLocale]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleLocaleChange = (newLocale: CompanionLocale) => {
    stopSpeaking();
    setActiveLocale(newLocale);
    localStorage.setItem('qdiagnose_companion_locale', newLocale);
    if (onCompanionLocaleChange) {
      onCompanionLocaleChange(newLocale);
    }

    const localeConfig = COMPANION_LOCALES.find(l => l.id === newLocale);
    if (localeConfig && onUiLanguageChange) {
      onUiLanguageChange(localeConfig.defaultUiLang);
    }

    // Add greeting message in the newly selected register
    const newGreeting = COMPANION_REGISTER_GREETINGS[newLocale] || COMPANION_REGISTER_GREETINGS.india_en;
    const greetingId = `greeting-${newLocale}-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      {
        id: greetingId,
        sender: 'assistant',
        text: `[Switched to ${localeConfig?.name || newLocale}]\n\n${newGreeting}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locale: newLocale
      }
    ]);
    setShowRegionalPicker(false);

    if (autoSpeak) {
      setTimeout(() => {
        speakText(newGreeting, greetingId);
      }, 300);
    }
  };

  const handleToggleAutoSpeak = () => {
    const next = !autoSpeak;
    setAutoSpeak(next);
    localStorage.setItem('qdiagnose_companion_autospeak', String(next));
    if (!next) {
      stopSpeaking();
    }
  };

  const handleSendMessage = async (textToSend?: string, triggeredByVoice: boolean = false) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          companion_locale: activeLocale,
          language: activeLocale,
          context: currentResult ? {
            risk_band: currentResult.risk_band,
            risk_score: currentResult.risk_score,
            disease_id: currentResult.disease_id,
            plain_meaning: currentResult.plain_language_meaning
          } : {
            section: 'General Health Awareness'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || 'I am here to support you with non-diagnostic health risk awareness.';
      const msgId = `ai-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: msgId,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locale: activeLocale
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Auto-speak reply if autoSpeak is enabled or user asked via voice
      if (autoSpeak || triggeredByVoice) {
        setTimeout(() => {
          speakText(replyText, msgId);
        }, 300);
      }
    } catch (err) {
      console.error('[AiHealthCompanion] Error:', err);
      // Register-tailored fallback message
      const fallbackText = COMPANION_REGISTER_GREETINGS[activeLocale] || 
        'Thank you for your question. Please note that this AI tool is intended purely for early risk screening awareness and does not substitute for clinical medical evaluation. We advise consulting a licensed physician regarding any health concerns.';

      const msgId = `ai-err-${Date.now()}`;
      const fallbackMsg: ChatMessage = {
        id: msgId,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locale: activeLocale
      };
      setMessages(prev => [...prev, fallbackMsg]);

      if (autoSpeak || triggeredByVoice) {
        setTimeout(() => {
          speakText(fallbackText, msgId);
        }, 300);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Browser speech recognition (Speech-to-Text)
  const handleVoiceToggle = () => {
    stopSpeaking();

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment. You can type your question directly.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.lang = TTS_LANG_MAP[activeLocale] || 'en-IN';

      if (!isListening) {
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          // Directly submit speech query
          if (transcript.trim()) {
            handleSendMessage(transcript, true);
          }
        };
        recognition.onerror = () => {
          setIsListening(false);
        };
        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } catch (e) {
      setIsListening(false);
    }
  };

  // Dynamic starter prompts according to active dialect/register
  const getStarterPrompts = () => {
    if (activeLocale === 'india_en') {
      return [
        'Can you explain what my risk level means in simple words?',
        'Why does this matter for my overall health?',
        'What specific questions should I ask my doctor?',
        'What everyday habits should I adjust next?'
      ];
    }
    if (activeLocale === 'american') {
      return [
        'What does my risk score mean in plain English?',
        'Why does this result matter for me?',
        'What questions should I bring to my primary care doctor?',
        'What practical steps can I take starting today?'
      ];
    }
    if (activeLocale === 'british') {
      return [
        'Could you explain what my result means in plain English?',
        'Why does this risk level matter?',
        'What should I discuss with my GP at my next appointment?',
        'What simple everyday habits support better heart health?'
      ];
    }
    if (activeLocale === 'hi') {
      return [
        'मेरे जोखिम स्कोर का क्या मतलब है सरल भाषा में?',
        'यह परिणाम मेरे स्वास्थ्य के लिए क्यों महत्वपूर्ण है?',
        'डॉक्टर से मिलने पर मुझे क्या सवाल पूछने चाहिए?',
        'रोजमर्रा में क्या सरल और स्वस्थ बदलाव करने चाहिए?'
      ];
    }
    if (activeLocale === 'ta') {
      return [
        'எனது பரிசோதனை முடிவு என்ன சொல்கிறது?',
        'இது எனது உடல்நலத்திற்கு ஏன் முக்கியம்?',
        'மருத்துவரிடம் என்ன கேள்விகள் கேட்க வேண்டும்?',
        'நான் செய்ய வேண்டிய எளிய ஆரோக்கிய பழக்கங்கள் என்ன?'
      ];
    }
    return [
      'What does my screening risk level mean in simple words?',
      'Why does this screening matter for my health?',
      'What questions should I ask my doctor?',
      'What practical next steps should I take?'
    ];
  };

  if (!isOpen) return null;

  const primaryLocales = COMPANION_LOCALES.filter(l => l.category === 'primary');
  const regionalLocales = COMPANION_LOCALES.filter(l => l.category === 'regional');
  // Exclude whichever language is currently active in "More Languages"
  const availableMoreLanguages = regionalLocales.filter(l => l.id !== activeLocale);
  const isRegionalActive = regionalLocales.some(r => r.id === activeLocale);

  return (
    <div id="ai-health-companion-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl h-[88vh] max-h-[750px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Title & Dialect Selector */}
        <div className="bg-[#0B1E3D] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Multilingual AI Health Companion</h3>
                <span className="text-[10px] bg-teal-900/80 text-teal-300 px-2 py-0.5 rounded-full border border-teal-600/40 font-mono font-bold">
                  Gemini 3.8 Native
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Patient health guide • What your results mean & what to do next
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Speak Toggle */}
            <button
              onClick={handleToggleAutoSpeak}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                autoSpeak
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-xs'
                  : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
              }`}
              title={autoSpeak ? 'Audio Voice Output is ON' : 'Audio Voice Output is OFF'}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Voice TTS: {autoSpeak ? 'ON' : 'OFF'}</span>
            </button>

            <button
              id="close-companion-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section 10 Accent/Dialect Mode Bar (Prominent & Separate from static UI language) */}
        <div className="bg-slate-900 text-slate-200 px-4 py-2.5 border-b border-slate-800 text-xs shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>Voice / Dialect Register:</span>
            </div>

            {/* Quick-toggle Primary Registers */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {primaryLocales.map(loc => (
                <button
                  key={loc.id}
                  id={`companion-mode-${loc.id}`}
                  onClick={() => handleLocaleChange(loc.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center transition-all cursor-pointer ${
                    activeLocale === loc.id
                      ? 'bg-teal-500 text-slate-950 shadow-xs font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>{loc.id === 'india_en' ? 'India' : loc.id === 'american' ? 'American' : 'British'}</span>
                </button>
              ))}

              {/* Expandable Regional Indian Languages (Excluding currently active) */}
              <div className="relative">
                <button
                  id="regional-languages-dropdown-btn"
                  onClick={() => setShowRegionalPicker(!showRegionalPicker)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isRegionalActive
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>
                    {isRegionalActive ? `${currentOption.name}` : 'More Languages'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showRegionalPicker ? 'rotate-180' : ''}`} />
                </button>

                {showRegionalPicker && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                      Indian Regional Languages
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-1">
                      {availableMoreLanguages.map(reg => (
                        <button
                          key={reg.id}
                          id={`companion-regional-${reg.id}`}
                          onClick={() => handleLocaleChange(reg.id)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors text-slate-200 hover:bg-slate-800"
                        >
                          <div>
                            <span className="font-semibold">{reg.name}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">({reg.nativeName})</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{reg.defaultUiLang}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Register Description Sub-banner & Speech Status */}
          <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-teal-400 font-semibold">{currentOption.name}:</span>
              <span className="truncate">{currentOption.registerDescription}</span>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold animate-pulse cursor-pointer hover:bg-rose-900"
                >
                  <span>Stop Voice</span>
                </button>
              )}
              <span className="text-[10px] text-slate-500 hidden sm:block">
                UI Lang: {currentLang.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Persistent Safety Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-900 font-medium shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Safety Disclaimer:</strong> Educational screening companion only. Not a clinical diagnosis. In an acute emergency, dial 112/108 or 911 immediately.
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
          {messages.map(msg => {
            const isThisMsgSpeaking = isSpeaking && speakingMsgId === msg.id;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                    msg.sender === 'user'
                      ? 'bg-[#0B1E3D] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  <div
                    className={`text-[10px] mt-2 flex items-center justify-between gap-2 border-t pt-1.5 ${
                      msg.sender === 'user' ? 'border-sky-900/60 text-slate-300' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    {msg.sender === 'assistant' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-teal-700 font-medium flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Non-diagnostic
                        </span>
                        
                        {/* Audio Speak Button for Message */}
                        <button
                          onClick={() => {
                            if (isThisMsgSpeaking) {
                              stopSpeaking();
                            } else {
                              speakText(msg.text, msg.id);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                            isThisMsgSpeaking
                              ? 'bg-teal-100 text-teal-800 font-bold'
                              : 'hover:bg-slate-100 text-slate-500'
                          }`}
                          title={isThisMsgSpeaking ? 'Stop speaking' : 'Listen with voice output'}
                        >
                          {isThisMsgSpeaking ? (
                            <span className="text-teal-700 font-semibold">Speaking...</span>
                          ) : (
                            <span>Listen</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <span>You</span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#C59B27] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
              <span>Companion is formulating a {currentOption.name} response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Context-Aware Starter Prompts tailored to active dialect */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Suggested Prompts ({currentOption.nativeName}):
          </div>
          <div className="flex items-center gap-2 min-w-max">
            {getStarterPrompts().map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                id={`starter-prompt-${idx}`}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Voice Input (STT) & Send */}
        <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              id="voice-dictate-btn"
              onClick={handleVoiceToggle}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isListening 
                  ? 'bg-rose-600 text-white animate-pulse border-rose-700 font-bold px-3' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              }`}
              title={isListening ? 'Listening... click to stop' : `Voice dictation in ${currentOption.name}`}
            >
              {isListening ? (
                <span className="text-xs">Listening...</span>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              id="companion-chat-input"
              type="text"
              placeholder={`Ask a question in ${currentOption.name} or tap Mic...`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
            />

            <button
              type="submit"
              id="companion-chat-submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
