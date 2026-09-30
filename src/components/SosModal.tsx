import React, { useState } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  UserCheck, 
  MapPin, 
  HeartHandshake, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CRISIS_CONTACTS } from '../data/mindMoodData';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [confirmedCall, setConfirmedCall] = useState<{ number: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'options' | 'hospitals' | 'crisis'>('options');

  if (!isOpen) return null;

  const trustedContact = {
    name: 'Ananya Sharma (Primary Caregiver / Daughter)',
    phone: '+91 98765 43210',
    relation: 'Emergency Family Contact'
  };

  const nearbyHospitals = [
    { name: 'City Central Multispeciality Hospital & ER', distance: '1.2 km away', phone: '080-2345-6789', address: 'MG Road Medical Enclave, Block 4' },
    { name: 'Apex Heart & Neurosciences Emergency Trauma Center', distance: '2.8 km away', phone: '080-4567-8901', address: '14th Cross, Healthcare Ring Road' },
    { name: 'Community General Hospital 24/7 Casualty', distance: '3.5 km away', phone: '108', address: 'Civil Lines Station Road' },
  ];

  return (
    <div 
      id="sos-emergency-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-heading"
    >
      <div 
        id="sos-modal-container"
        className="bg-white border-2 border-red-500 rounded-3xl shadow-2xl max-w-xl w-full text-[#2D3748] overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 text-white animate-pulse">
              <AlertOctagon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold bg-red-900/60 px-2 py-0.5 rounded text-white border border-red-400/40">
                  EMERGENCY ROUTING
                </span>
                <span className="text-[11px] font-medium text-red-100">24/7 Assistance</span>
              </div>
              <h2 id="sos-modal-heading" className="text-lg font-black tracking-tight text-white mt-0.5">
                {t.sosModalTitle}
              </h2>
            </div>
          </div>
          <button
            id="btn-close-sos"
            onClick={() => {
              setConfirmedCall(null);
              onClose();
            }}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Close emergency modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F4F8FA] px-4 py-2 border-b border-[#DCE8F6] flex items-center gap-2">
          <button
            onClick={() => { setConfirmedCall(null); setActiveTab('options'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'options' ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-[#2D3748] hover:text-[#0B1E3D] hover:bg-sky-100'
            }`}
          >
            Emergency Actions
          </button>
          <button
            onClick={() => { setConfirmedCall(null); setActiveTab('hospitals'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hospitals' ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-[#2D3748] hover:text-[#0B1E3D] hover:bg-sky-100'
            }`}
          >
            Nearest ER & Hospitals
          </button>
          <button
            onClick={() => { setConfirmedCall(null); setActiveTab('crisis'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'crisis' ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-[#2D3748] hover:text-[#0B1E3D] hover:bg-sky-100'
            }`}
          >
            Mental Health Helplines
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Active Confirmation Call View if User clicked a number */}
          {confirmedCall ? (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 border border-red-300 text-red-600 mx-auto flex items-center justify-center">
                <PhoneCall className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-red-900">Confirm Direct Call</h3>
              <p className="text-xs text-red-800">
                You are about to place a call to <strong className="text-red-950">{confirmedCall.name}</strong> at <span className="font-mono text-[#C59B27] font-bold">{confirmedCall.number}</span>.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  id="btn-confirm-dial"
                  href={`tel:${confirmedCall.number}`}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Now ({confirmedCall.number})</span>
                </a>
                <button
                  onClick={() => setConfirmedCall(null)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-[#2D3748] border border-[#DCE8F6] font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === 'options' && !confirmedCall && (
            <div className="space-y-3">
              <p className="text-xs text-[#2D3748] opacity-85 leading-relaxed">
                {t.sosModalSubtitle}
              </p>

              {/* Option 1: National Emergency */}
              <button
                id="sos-action-call-112"
                onClick={() => setConfirmedCall({ name: 'National Emergency Dispatch', number: '112' })}
                className="w-full text-left p-4 rounded-2xl bg-red-50 border border-red-200 hover:border-red-400 hover:bg-red-100/70 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <PhoneCall className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-900 group-hover:text-red-950 flex items-center gap-2">
                      <span>{t.sosCallEmergency}</span>
                      <span className="text-[10px] font-mono font-extrabold bg-red-200 text-red-900 px-1.5 py-0.5 rounded border border-red-300">
                        112 / 108
                      </span>
                    </h3>
                    <p className="text-xs text-red-800 mt-0.5">
                      Direct connection to central ambulance, medical dispatch, or first responders.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 2: Caregiver / Family */}
              <button
                id="sos-action-call-caregiver"
                onClick={() => setConfirmedCall({ name: trustedContact.name, number: trustedContact.phone })}
                className="w-full text-left p-4 rounded-2xl bg-white border border-[#DCE8F6] hover:border-teal-400 hover:bg-teal-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1E3D] group-hover:text-teal-700">
                      {t.sosCallCaregiver}
                    </h3>
                    <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
                      <strong className="text-[#0B1E3D]">{trustedContact.name}</strong> • <span className="font-mono text-[#C59B27] font-bold">{trustedContact.phone}</span>
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 3: Mental Health Crisis */}
              <button
                id="sos-action-crisis-line"
                onClick={() => setConfirmedCall({ name: 'Tele-MANAS Mental Health Crisis Line', number: '14416' })}
                className="w-full text-left p-4 rounded-2xl bg-white border border-[#DCE8F6] hover:border-teal-400 hover:bg-teal-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <HeartHandshake className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1E3D] group-hover:text-teal-700 flex items-center gap-2">
                      <span>{t.sosCrisisLine}</span>
                      <span className="text-[10px] font-mono bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200 font-bold">
                        24/7 FREE
                      </span>
                    </h3>
                    <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
                      Immediate, confidential counseling for panic, severe distress, or depression.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 4: Nearest Hospitals */}
              <button
                id="sos-action-hospitals-tab"
                onClick={() => setActiveTab('hospitals')}
                className="w-full text-left p-4 rounded-2xl bg-white border border-[#DCE8F6] hover:border-teal-400 hover:bg-teal-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1E3D] group-hover:text-teal-700">
                      {t.sosFindHospitals}
                    </h3>
                    <p className="text-xs text-[#2D3748] opacity-80 mt-0.5">
                      View nearby 24/7 Emergency Rooms, contact numbers, and turn-by-turn routing.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {activeTab === 'hospitals' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">Nearby Emergency Medical Centers</h3>
              {nearbyHospitals.map((h, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1E3D] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{h.name}</span>
                    </h4>
                    <p className="text-[11px] text-[#2D3748] opacity-75 mt-0.5">{h.address}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FEF9E7] text-[#9A7416] border border-[#F6E58D] font-bold">
                      {h.distance}
                    </span>
                  </div>
                  <button
                    onClick={() => setConfirmedCall({ name: h.name, number: h.phone })}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-white" />
                    <span>Call ER</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'crisis' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">Confidential Mental Health & Crisis Lines</h3>
              {CRISIS_CONTACTS.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F4F8FA] border border-[#DCE8F6] flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1E3D]">{c.name}</h4>
                    <p className="text-[11px] text-[#2D3748] opacity-80 mt-0.5">{c.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        {c.number}
                      </span>
                      <span className="text-[10px] text-[#2D3748] opacity-70 font-mono">{c.available}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmedCall({ name: c.name, number: c.number })}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-white" />
                    <span>Connect</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F4F8FA] px-6 py-3 border-t border-[#DCE8F6] flex items-center justify-between text-[11px] text-[#2D3748]">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span className="opacity-80">{t.sosDisclaimer}</span>
          </div>
          <button
            onClick={() => { setConfirmedCall(null); onClose(); }}
            className="text-xs font-semibold text-[#2D3748] hover:text-[#0B1E3D] px-3 py-1 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
          >
            {t.sosCancel}
          </button>
        </div>
      </div>
    </div>
  );
};
