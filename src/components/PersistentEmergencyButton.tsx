import React from 'react';
import { AlertOctagon, PhoneCall } from 'lucide-react';

interface PersistentEmergencyButtonProps {
  onClick: () => void;
  lang?: string;
}

export const PersistentEmergencyButton: React.FC<PersistentEmergencyButtonProps> = ({ onClick, lang = 'en' }) => {
  const labels: Record<string, string> = {
    en: 'Emergency Help',
    hi: 'आपातकालीन सहायता',
    ta: 'அவசர உதவி',
    te: 'అత్యవసర సహాయం',
    bn: 'জরুরি সাহায্য',
    mr: 'आपत्कालीन मदत'
  };

  const text = labels[lang] || labels.en;

  return (
    <button
      id="persistent-emergency-btn"
      onClick={onClick}
      aria-label="Immediate Emergency Help"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-5 py-3 rounded-full font-bold shadow-2xl shadow-rose-950/40 border-2 border-rose-400/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-pulse focus:outline-none focus:ring-4 focus:ring-rose-500/40"
    >
      <span className="text-sm md:text-base font-semibold tracking-wide whitespace-nowrap">{text}</span>
      <span className="bg-rose-800/80 text-[11px] px-2 py-0.5 rounded-full text-rose-100 hidden sm:inline-flex items-center font-mono">
        112 / 108
      </span>
    </button>
  );
};
