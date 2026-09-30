export type HerHealthSubTab = 
  | 'dashboard'
  | 'period'
  | 'symptoms'
  | 'mood'
  | 'lifestyle'
  | 'companion'
  | 'pcod'
  | 'insights'
  | 'cbt'
  | 'education'
  | 'awareness'
  | 'reminders'
  | 'partner'
  | 'alerts'
  | 'records'
  | 'doctor-review';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface PeriodEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  cycleLength: number; // days e.g. 28
  periodDuration: number; // days e.g. 5
  flow: 'light' | 'medium' | 'heavy' | 'spotting';
  symptomsNoted: string[];
  notes?: string;
  isDemo?: boolean;
}

export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  symptomType: 
    | 'Cramps' 
    | 'Headache' 
    | 'Fatigue' 
    | 'Bloating' 
    | 'Breast Tenderness' 
    | 'Back Pain' 
    | 'Nausea' 
    | 'Pelvic Pain' 
    | 'Mood Swings' 
    | 'Acne' 
    | 'Hot Flashes' 
    | 'Other';
  severity: SymptomSeverity;
  notes?: string;
  isDemo?: boolean;
}

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'irritable' | 'energetic' | 'exhausted' | 'stressed';
  stressLevel: number; // 1-5
  anxietyLevel: number; // 1-5
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  energyLevel: number; // 1-5
  overallWellbeing: number; // 1-5
  journalNote?: string;
  isDemo?: boolean;
}

export interface FoodActivityLog {
  id: string;
  date: string;
  waterGlasses: number; // 250ml each
  waterTarget: number;  // default 8
  meals: Array<{
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    description: string;
    nutritionalTags: ('iron-rich' | 'protein' | 'fiber' | 'calcium' | 'anti-inflammatory' | 'vitamins')[];
  }>;
  activityMinutes: number;
  activityType: 'walking' | 'yoga' | 'stretching' | 'pilates' | 'swimming' | 'strength' | 'rest';
  steps: number;
  sleepHabitScore: number; // 1-5
  stressManagementPractice?: string;
  isDemo?: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  type: 'medication' | 'treatment' | 'appointment' | 'followup';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  dosageOrNotes?: string;
  doctorName?: string;
  completed: boolean;
  isDemo?: boolean;
}

export interface CbtExercise {
  id: string;
  title: string;
  category: 'Cognitive Reframing' | 'Stress Relief' | 'Grounding' | 'Mindful Reflection' | 'Sleep Preparation';
  durationMin: number;
  description: string;
  steps: string[];
  reflectionPrompt: string;
  userReflection?: string;
  completed: boolean;
  completedAt?: string;
}

export interface HealthInsight {
  id: string;
  category: 'cycle' | 'symptom' | 'mood' | 'lifestyle' | 'preventive';
  type: 'info' | 'positive' | 'warning';
  title: string;
  message: string;
  actionableTip: string;
  relevantMetric?: string;
}

export interface HerHealthSharingConsent {
  shareCycleSummary: boolean;
  shareSymptomTrends: boolean;
  shareMoodSummary: boolean;
  shareMedicationList: boolean;
  shareEmergencyContactAlerts: boolean;
  partnerAccessKey?: string;
  partnerName?: string;
  doctorAccessAllowed: boolean;
  lastUpdated: string;
}

export interface HerHealthState {
  cycles: PeriodEntry[];
  symptoms: SymptomLog[];
  moods: MoodLog[];
  lifestyle: FoodActivityLog[];
  reminders: ReminderItem[];
  cbtExercises: CbtExercise[];
  consent: HerHealthSharingConsent;
  usingDemoData: boolean;
}
