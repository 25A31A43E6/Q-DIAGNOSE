import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Activity, 
  Smile, 
  Utensils, 
  Bot, 
  BookOpen, 
  Sparkles, 
  Brain, 
  GraduationCap, 
  HeartHandshake, 
  Bell, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  Stethoscope, 
  LayoutDashboard, 
  ArrowLeft, 
  Database, 
  PhoneCall, 
  X, 
  Check, 
  Plus,
  ShieldAlert
} from 'lucide-react';
import { 
  HerHealthSubTab, 
  PeriodEntry, 
  SymptomLog, 
  MoodLog, 
  FoodActivityLog, 
  ReminderItem, 
  CbtExercise, 
  HerHealthSharingConsent 
} from './types';
import { 
  DEMO_PERIOD_CYCLES, 
  DEMO_SYMPTOM_LOGS, 
  DEMO_MOOD_LOGS, 
  DEMO_LIFESTYLE_LOGS, 
  DEMO_REMINDERS, 
  DEMO_CBT_EXERCISES, 
  DEMO_SHARING_CONSENT 
} from './sampleData';

import { PersonalizedDashboard } from './PersonalizedDashboard';
import { PeriodCycleTracker } from './PeriodCycleTracker';
import { SymptomTracker } from './SymptomTracker';
import { MoodMentalHealth } from './MoodMentalHealth';
import { FoodActivityGuidance } from './FoodActivityGuidance';
import { AiHealthCompanionHer } from './AiHealthCompanionHer';
import { PcodEducation } from './PcodEducation';
import { HealthInsightsView } from './HealthInsightsView';
import { CbtProgramView } from './CbtProgramView';
import { DigitalHealthEducation } from './DigitalHealthEducation';
import { MenstrualAwareness } from './MenstrualAwareness';
import { MedicationReminders } from './MedicationReminders';
import { FamilyPartnerSupport } from './FamilyPartnerSupport';
import { MedicalAlertsRedFlags } from './MedicalAlertsRedFlags';
import { SecureHealthRecords } from './SecureHealthRecords';
import { DoctorSharedView } from './DoctorSharedView';

interface HerHealthModuleProps {
  onBackToApp?: () => void;
  onNavigateEmergency?: () => void;
  onNavigateHospitals?: () => void;
}

const STORAGE_KEY = 'herhealth_state_v1';

export const HerHealthModule: React.FC<HerHealthModuleProps> = ({
  onBackToApp,
  onNavigateEmergency,
  onNavigateHospitals,
}) => {
  const [activeTab, setActiveTab] = useState<HerHealthSubTab>('dashboard');

  // Core State
  const [usingDemoData, setUsingDemoData] = useState<boolean>(true);
  const [cycles, setCycles] = useState<PeriodEntry[]>(DEMO_PERIOD_CYCLES);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>(DEMO_SYMPTOM_LOGS);
  const [moods, setMoods] = useState<MoodLog[]>(DEMO_MOOD_LOGS);
  const [lifestyle, setLifestyle] = useState<FoodActivityLog[]>(DEMO_LIFESTYLE_LOGS);
  const [reminders, setReminders] = useState<ReminderItem[]>(DEMO_REMINDERS);
  const [cbtExercises, setCbtExercises] = useState<CbtExercise[]>(DEMO_CBT_EXERCISES);
  const [consent, setConsent] = useState<HerHealthSharingConsent>(DEMO_SHARING_CONSENT);

  // Quick Log Modal State
  const [quickLogModal, setQuickLogModal] = useState<'period' | 'symptom' | 'mood' | 'water' | null>(null);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cycles) setCycles(parsed.cycles);
        if (parsed.symptoms) setSymptoms(parsed.symptoms);
        if (parsed.moods) setMoods(parsed.moods);
        if (parsed.lifestyle) setLifestyle(parsed.lifestyle);
        if (parsed.reminders) setReminders(parsed.reminders);
        if (parsed.cbtExercises) setCbtExercises(parsed.cbtExercises);
        if (parsed.consent) setConsent(parsed.consent);
        if (typeof parsed.usingDemoData === 'boolean') setUsingDemoData(parsed.usingDemoData);
      }
    } catch {
      // Fallback to sample data
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const payload = {
        cycles,
        symptoms,
        moods,
        lifestyle,
        reminders,
        cbtExercises,
        consent,
        usingDemoData,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [cycles, symptoms, moods, lifestyle, reminders, cbtExercises, consent, usingDemoData]);

  // Handlers for Cycles
  const handleAddCycle = (entry: Omit<PeriodEntry, 'id'>) => {
    const newEntry: PeriodEntry = {
      ...entry,
      id: `cycle-${Date.now()}`,
    };
    setCycles([newEntry, ...cycles]);
  };

  const handleUpdateCycle = (updated: PeriodEntry) => {
    setCycles(cycles.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteCycle = (id: string) => {
    setCycles(cycles.filter(c => c.id !== id));
  };

  // Handlers for Symptoms
  const handleAddSymptom = (log: Omit<SymptomLog, 'id'>) => {
    const newLog: SymptomLog = {
      ...log,
      id: `sym-${Date.now()}`,
    };
    setSymptoms([newLog, ...symptoms]);
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  // Handlers for Moods
  const handleAddMood = (log: Omit<MoodLog, 'id'>) => {
    const newLog: MoodLog = {
      ...log,
      id: `mood-${Date.now()}`,
    };
    setMoods([newLog, ...moods]);
  };

  const handleDeleteMood = (id: string) => {
    setMoods(moods.filter(m => m.id !== id));
  };

  // Handlers for Lifestyle
  const handleUpdateWater = (glasses: number) => {
    if (lifestyle.length > 0) {
      const updated = [...lifestyle];
      updated[0] = { ...updated[0], waterGlasses: glasses };
      setLifestyle(updated);
    } else {
      setLifestyle([{
        id: `life-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        waterGlasses: glasses,
        waterTarget: 8,
        meals: [],
        activityMinutes: 30,
        activityType: 'walking',
        steps: 6000,
        sleepHabitScore: 4,
      }]);
    }
  };

  const handleAddMeal = (meal: any) => {
    if (lifestyle.length > 0) {
      const updated = [...lifestyle];
      updated[0] = {
        ...updated[0],
        meals: [...updated[0].meals, meal]
      };
      setLifestyle(updated);
    }
  };

  // Handlers for Reminders
  const handleAddReminder = (item: Omit<ReminderItem, 'id'>) => {
    const newItem: ReminderItem = {
      ...item,
      id: `rem-${Date.now()}`,
    };
    setReminders([...reminders, newItem]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // Handlers for CBT
  const handleToggleCbt = (id: string, reflection?: string) => {
    setCbtExercises(cbtExercises.map(e => {
      if (e.id === id) {
        return {
          ...e,
          completed: !e.completed,
          userReflection: reflection || e.userReflection,
          completedAt: !e.completed ? new Date().toLocaleString() : undefined,
        };
      }
      return e;
    }));
  };

  // Reset / Demo Data Toggles
  const handleToggleDemoData = () => {
    if (usingDemoData) {
      // Switch to blank data
      setCycles([]);
      setSymptoms([]);
      setMoods([]);
      setLifestyle([]);
      setReminders([]);
      setUsingDemoData(false);
    } else {
      // Re-seed demo data
      setCycles(DEMO_PERIOD_CYCLES);
      setSymptoms(DEMO_SYMPTOM_LOGS);
      setMoods(DEMO_MOOD_LOGS);
      setLifestyle(DEMO_LIFESTYLE_LOGS);
      setReminders(DEMO_REMINDERS);
      setCbtExercises(DEMO_CBT_EXERCISES);
      setUsingDemoData(true);
    }
  };

  const handleResetAllData = () => {
    setCycles(DEMO_PERIOD_CYCLES);
    setSymptoms(DEMO_SYMPTOM_LOGS);
    setMoods(DEMO_MOOD_LOGS);
    setLifestyle(DEMO_LIFESTYLE_LOGS);
    setReminders(DEMO_REMINDERS);
    setCbtExercises(DEMO_CBT_EXERCISES);
    setConsent(DEMO_SHARING_CONSENT);
    setUsingDemoData(true);
    localStorage.removeItem(STORAGE_KEY);
  };

  const SUB_TABS: Array<{ id: HerHealthSubTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'period', label: 'Period & Cycle', icon: Calendar },
    { id: 'symptoms', label: 'Symptoms', icon: Activity },
    { id: 'mood', label: 'Mood & Wellbeing', icon: Smile },
    { id: 'lifestyle', label: 'Food & Movement', icon: Utensils },
    { id: 'companion', label: 'AI Companion', icon: Bot },
    { id: 'pcod', label: 'PCOD Education', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'cbt', label: 'Digital CBT', icon: Brain },
    { id: 'education', label: 'Health Library', icon: GraduationCap },
    { id: 'awareness', label: 'Period Hygiene', icon: HeartHandshake },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'partner', label: 'Partner Support', icon: Users },
    { id: 'alerts', label: 'Medical Alerts', icon: AlertTriangle },
    { id: 'records', label: 'Secure Vault', icon: ShieldCheck },
    { id: 'doctor-review', label: 'Doctor Review', icon: Stethoscope },
  ];

  return (
    <div id="herhealth-root" className="min-h-screen bg-gradient-to-b from-rose-50/20 via-slate-50 to-teal-50/20 text-slate-800 pb-20">
      {/* Module Navigation Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Return to Main Website"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Main Website</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-teal-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                <HeartHandshake className="w-5 h-5 text-white" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-[#0B1E3D]">
                    HERHEALTH
                  </h1>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Women’s Health & Wellness
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Integrated Clinical & Somatic Sanctuary • SIH 2026 Demonstration
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSosModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Emergency Helpline</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer border border-amber-200"
              title="View Clinical Red Flags"
            >
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </button>
          </div>
        </div>

        {/* Scrollable Sub-Tabs Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100/80 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 py-2">
            {SUB_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1E3D] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-[#0B1E3D] hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Module Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <PersonalizedDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
            cycles={cycles}
            symptoms={symptoms}
            moods={moods}
            lifestyle={lifestyle}
            reminders={reminders}
            cbtExercises={cbtExercises}
            onOpenQuickLog={(type) => setQuickLogModal(type)}
            onOpenSos={() => setSosModalOpen(true)}
          />
        )}

        {activeTab === 'period' && (
          <PeriodCycleTracker
            cycles={cycles}
            onAddCycle={handleAddCycle}
            onUpdateCycle={handleUpdateCycle}
            onDeleteCycle={handleDeleteCycle}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomTracker
            symptoms={symptoms}
            onAddSymptom={handleAddSymptom}
            onDeleteSymptom={handleDeleteSymptom}
          />
        )}

        {activeTab === 'mood' && (
          <MoodMentalHealth
            moods={moods}
            onAddMood={handleAddMood}
            onDeleteMood={handleDeleteMood}
            onOpenSos={() => setSosModalOpen(true)}
          />
        )}

        {activeTab === 'lifestyle' && (
          <FoodActivityGuidance
            lifestyle={lifestyle}
            onUpdateWater={handleUpdateWater}
            onAddMeal={handleAddMeal}
          />
        )}

        {activeTab === 'companion' && (
          <AiHealthCompanionHer />
        )}

        {activeTab === 'pcod' && (
          <PcodEducation />
        )}

        {activeTab === 'insights' && (
          <HealthInsightsView
            cycles={cycles}
            symptoms={symptoms}
            moods={moods}
            lifestyle={lifestyle}
          />
        )}

        {activeTab === 'cbt' && (
          <CbtProgramView
            exercises={cbtExercises}
            onToggleComplete={handleToggleCbt}
          />
        )}

        {activeTab === 'education' && (
          <DigitalHealthEducation />
        )}

        {activeTab === 'awareness' && (
          <MenstrualAwareness />
        )}

        {activeTab === 'reminders' && (
          <MedicationReminders
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onToggleComplete={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {activeTab === 'partner' && (
          <FamilyPartnerSupport
            consent={consent}
            onUpdateConsent={setConsent}
            latestCycle={cycles[0]}
            latestMood={moods[0]}
          />
        )}

        {activeTab === 'alerts' && (
          <MedicalAlertsRedFlags
            onOpenSos={() => setSosModalOpen(true)}
            onNavigateDoctors={onNavigateHospitals}
          />
        )}

        {activeTab === 'records' && (
          <SecureHealthRecords
            cycles={cycles}
            symptoms={symptoms}
            moods={moods}
            lifestyle={lifestyle}
            reminders={reminders}
            consent={consent}
            onUpdateConsent={setConsent}
            usingDemoData={usingDemoData}
            onToggleDemoData={handleToggleDemoData}
            onResetAllData={handleResetAllData}
          />
        )}

        {activeTab === 'doctor-review' && (
          <DoctorSharedView
            cycles={cycles}
            symptoms={symptoms}
            moods={moods}
            reminders={reminders}
            consent={consent}
          />
        )}
      </main>

      {/* Emergency Helpline Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-rose-300 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-rose-700">
                <ShieldAlert className="w-6 h-6" />
                <span className="text-lg">Emergency & Urgent Care</span>
              </div>
              <button
                onClick={() => setSosModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If you or someone nearby is experiencing acute symptoms like heavy bleeding, excruciating sudden pain, or fainting, contact emergency services immediately:
            </p>

            <div className="space-y-2 text-xs">
              <a
                href="tel:112"
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 flex items-center justify-between font-bold transition-colors cursor-pointer"
              >
                <span>National Emergency Number (India)</span>
                <span className="font-mono text-sm">Dial 112</span>
              </a>

              <a
                href="tel:108"
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 flex items-center justify-between font-bold transition-colors cursor-pointer"
              >
                <span>Ambulance Services</span>
                <span className="font-mono text-sm">Dial 108</span>
              </a>

              <a
                href="tel:14416"
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 flex items-center justify-between font-bold transition-colors cursor-pointer"
              >
                <span>Tele-MANAS Mental Health Helpline</span>
                <span className="font-mono text-sm">Dial 14416</span>
              </a>

              <a
                href="tel:181"
                className="p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-950 flex items-center justify-between font-bold transition-colors cursor-pointer"
              >
                <span>Women’s Helpline (National)</span>
                <span className="font-mono text-sm">Dial 181</span>
              </a>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSosModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
