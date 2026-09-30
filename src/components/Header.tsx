import React from 'react';
import { 
  Atom, 
  Server, 
  Sparkles, 
  FileSpreadsheet, 
  ShieldAlert, 
  Check, 
  Languages, 
  User, 
  Microscope, 
  Bot, 
  AlertOctagon,
  Heart,
  Activity,
  Brain,
  Sliders,
  LogIn,
  LogOut,
  Shield,
  Key
} from 'lucide-react';
import { AppMode, DiseaseId, SupportedLanguage, NavSection, AuthUserProfile } from '../types';
import { DISEASE_CONFIGS } from '../data/diseaseDatasets';
import { DiseaseSelector } from './DiseaseSelector';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  isApiConfigured: boolean;
  selectedDisease: DiseaseId;
  onSelectDisease: (disease: DiseaseId) => void;
  onQuickLoadSample: () => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenSos: () => void;
  onOpenAssistant: () => void;
  currentUser?: AuthUserProfile;
  onOpenAuth?: (mode?: 'login' | 'register' | 'forgot') => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  activeSection,
  onNavigate,
  isApiConfigured,
  selectedDisease,
  onSelectDisease,
  onQuickLoadSample,
  language,
  onLanguageChange,
  onOpenSos,
  onOpenAssistant,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const currentConfig = DISEASE_CONFIGS[selectedDisease];
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const languagesList: Array<{ code: SupportedLanguage; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  return (
    <header 
      id="global-qdiagnose-header" 
      className="bg-white border-b border-[#DCE8F6] sticky top-0 z-30 px-4 sm:px-8 py-3.5 text-[#2D3748] shadow-sm shadow-sky-950/5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Identity & Mode Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0B1E3D] to-teal-700 text-white flex items-center justify-center shadow-md border border-teal-400/40">
            <Atom className="w-6 h-6 text-teal-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-[#0B1E3D]">Q-Diagnose</span>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-[#FEF9E7] text-[#9A7416] border border-[#F6E58D]">
                v3.0 Hybrid
              </span>
            </div>
            <p className="text-[11px] text-[#2D3748] font-medium opacity-80">
              {currentMode === 'patient' ? 'Patient & Family Supportive Care' : 'Multi-Disease Quantum-Classical ML Engine'}
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Patient Mode vs Doctor / Clinical Mode vs Research Mode) */}
        <div 
          id="mode-switcher-container"
          className="flex items-center p-1 bg-[#F4F8FA] rounded-2xl border border-[#DCE8F6] shadow-inner"
        >
          <button
            id="btn-mode-patient"
            onClick={() => onModeChange('patient')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer ${
              currentMode === 'patient'
                ? 'bg-teal-600 text-white shadow-sm scale-102'
                : 'text-[#2D3748] hover:text-[#0B1E3D]'
            }`}
          >
            <span>{t.modePatient}</span>
          </button>

          <button
            id="btn-mode-clinical"
            onClick={() => onModeChange('clinical')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer ${
              currentMode === 'clinical'
                ? 'bg-[#0B1E3D] text-white shadow-sm scale-102'
                : 'text-[#2D3748] hover:text-[#0B1E3D]'
            }`}
          >
            <span>Doctor Mode</span>
          </button>

          <button
            id="btn-mode-research"
            onClick={() => onModeChange('research')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer ${
              currentMode === 'research'
                ? 'bg-teal-700 text-white shadow-sm scale-102'
                : 'text-[#2D3748] hover:text-[#0B1E3D]'
            }`}
            title="Research Mode: Interactive Quantum Circuit & Bloch Sphere simulation"
          >
            <span>Research</span>
          </button>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2.5">
          {/* Disease Selector */}
          <div className="hidden lg:block">
            <DiseaseSelector
              selectedDisease={selectedDisease}
              onSelectDisease={(disease) => {
                onSelectDisease(disease);
                if (currentMode === 'patient' && disease === 'neurological') {
                  onNavigate('neurology-screening');
                }
              }}
            />
          </div>

          {/* Quick Demo Loader in Clinical Mode */}
          {currentMode === 'clinical' && (
            <button
              id="btn-quick-load-clinical"
              onClick={onQuickLoadSample}
              className="hidden sm:flex items-center px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#0B1E3D] text-xs font-semibold border border-[#DCE8F6] transition-colors shadow-xs cursor-pointer"
              title="Load standard sample data for selected disease"
            >
              <span>Load Sample</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative group">
            <button
              id="btn-global-language"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#0B1E3D] text-xs font-semibold border border-[#DCE8F6] flex items-center cursor-pointer transition-colors shadow-xs"
              title="Select Language"
            >
              <span className="font-mono uppercase text-[11px] font-bold text-[#C59B27]">{language}</span>
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white border border-[#DCE8F6] rounded-2xl shadow-xl py-1 z-50 text-xs w-44">
              {languagesList.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`w-full text-left px-3.5 py-2 hover:bg-teal-50 flex items-center justify-between cursor-pointer ${
                    language === lang.code ? 'text-teal-700 font-bold bg-teal-50/60' : 'text-[#2D3748]'
                  }`}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* User Account / Persona Switcher */}
          {currentUser && onOpenAuth ? (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 transition-colors group cursor-pointer"
              title={`Logged in as ${currentUser.name} (${currentUser.role}). Click to switch persona or manage account.`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                currentUser.role === 'doctor'
                  ? 'bg-teal-700'
                  : currentUser.role === 'admin'
                  ? 'bg-purple-700'
                  : 'bg-blue-600'
              }`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-bold text-slate-800 leading-tight max-w-[100px] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[9px] uppercase tracking-wider font-semibold text-teal-700">
                  {currentUser.role}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Emergency SOS Header Button Shortcut */}
          <button
            id="btn-header-sos-trigger"
            onClick={onOpenSos}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center shadow-md shadow-red-950/20 transition-colors cursor-pointer"
            title="Open Emergency SOS Routing"
          >
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Patient Mode Navigation Bar - Clean text labels with no symbols before words */}
      {currentMode === 'patient' && (
        <nav 
          id="patient-top-nav"
          aria-label="Patient Navigation Menu"
          className="mt-3 pt-3 border-t border-[#DCE8F6] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs"
        >
          {[
            { id: 'home', label: 'Home' },
            { id: 'portal', label: 'Health Vault (ABDM)' },
            { id: 'herhealth', label: 'HERHEALTH' },
            { id: 'emergency-check', label: 'Emergency Check' },
            { id: 'assessment', label: 'Assessment' },
            { id: 'results', label: 'Risk Prediction' },
            { id: 'guidance', label: 'Action & Guidance' },
            { id: 'hospitals', label: 'Doctor / Hospital' },
            { id: 'neurology-screening', label: 'Neurology Screening' },
            { id: 'pipeline-explainer', label: 'Quantum Pipeline' },
            { id: 'history', label: 'Patient History' },
            { id: 'login', label: 'Security & Login' },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-${item.id}`}
                onClick={() => onNavigate(item.id as NavSection)}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm scale-102'
                    : 'text-[#2D3748] hover:text-[#0B1E3D] hover:bg-sky-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
