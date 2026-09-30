import { 
  PeriodEntry, 
  SymptomLog, 
  MoodLog, 
  FoodActivityLog, 
  ReminderItem, 
  CbtExercise, 
  HerHealthSharingConsent 
} from './types';

export const DEMO_PERIOD_CYCLES: PeriodEntry[] = [
  {
    id: 'cycle-001',
    startDate: '2026-08-12',
    endDate: '2026-08-16',
    cycleLength: 28,
    periodDuration: 5,
    flow: 'medium',
    symptomsNoted: ['Mild Cramps', 'Fatigue', 'Bloating'],
    notes: 'Standard regular cycle. Drank chamomile tea on Day 1.',
    isDemo: true,
  },
  {
    id: 'cycle-002',
    startDate: '2026-07-15',
    endDate: '2026-07-19',
    cycleLength: 29,
    periodDuration: 5,
    flow: 'heavy',
    symptomsNoted: ['Moderate Cramps', 'Headache'],
    notes: 'Work deadline week, stress elevated slightly.',
    isDemo: true,
  },
  {
    id: 'cycle-003',
    startDate: '2026-06-16',
    endDate: '2026-06-20',
    cycleLength: 28,
    periodDuration: 5,
    flow: 'medium',
    symptomsNoted: ['Bloating', 'Breast Tenderness'],
    notes: 'Regular flow throughout all 5 days.',
    isDemo: true,
  },
  {
    id: 'cycle-004',
    startDate: '2026-05-19',
    endDate: '2026-05-23',
    cycleLength: 28,
    periodDuration: 5,
    flow: 'medium',
    symptomsNoted: ['Mild Back Pain'],
    notes: 'Normal onset.',
    isDemo: true,
  }
];

export const DEMO_SYMPTOM_LOGS: SymptomLog[] = [
  {
    id: 'sym-001',
    date: '2026-09-07',
    time: '14:30',
    symptomType: 'Fatigue',
    severity: 'mild',
    notes: 'Afternoon energy dip after screen time',
    isDemo: true,
  },
  {
    id: 'sym-002',
    date: '2026-09-06',
    time: '09:15',
    symptomType: 'Bloating',
    severity: 'moderate',
    notes: 'Experienced post-breakfast; resolved with warm water and walking',
    isDemo: true,
  },
  {
    id: 'sym-003',
    date: '2026-09-04',
    time: '19:00',
    symptomType: 'Headache',
    severity: 'mild',
    notes: 'Tension behind temples; hydrated and rested',
    isDemo: true,
  },
  {
    id: 'sym-004',
    date: '2026-09-02',
    time: '11:00',
    symptomType: 'Cramps',
    severity: 'mild',
    notes: 'Pre-luteal twinges',
    isDemo: true,
  },
  {
    id: 'sym-005',
    date: '2026-08-30',
    time: '16:45',
    symptomType: 'Breast Tenderness',
    severity: 'moderate',
    notes: 'Mid-luteal phase sensation',
    isDemo: true,
  },
  {
    id: 'sym-006',
    date: '2026-08-28',
    time: '10:00',
    symptomType: 'Back Pain',
    severity: 'mild',
    notes: 'Lower back stiffness after long desk hours',
    isDemo: true,
  }
];

export const DEMO_MOOD_LOGS: MoodLog[] = [
  {
    id: 'mood-001',
    date: '2026-09-07',
    time: '20:30',
    mood: 'calm',
    stressLevel: 2,
    anxietyLevel: 1,
    sleepHours: 7.5,
    sleepQuality: 'good',
    energyLevel: 4,
    overallWellbeing: 4,
    journalNote: 'Completed evening yoga stretch. Felt grounded and productive throughout the day.',
    isDemo: true,
  },
  {
    id: 'mood-002',
    date: '2026-09-06',
    time: '21:00',
    mood: 'happy',
    stressLevel: 2,
    anxietyLevel: 2,
    sleepHours: 8.0,
    sleepQuality: 'excellent',
    energyLevel: 4,
    overallWellbeing: 5,
    journalNote: 'Outdoor walk in the morning made a huge difference to my mood and focus.',
    isDemo: true,
  },
  {
    id: 'mood-003',
    date: '2026-09-05',
    time: '21:15',
    mood: 'stressed',
    stressLevel: 4,
    anxietyLevel: 3,
    sleepHours: 6.2,
    sleepQuality: 'fair',
    energyLevel: 2,
    overallWellbeing: 3,
    journalNote: 'Heavy work demands today; needed to practice the 4-7-8 breathing exercise.',
    isDemo: true,
  },
  {
    id: 'mood-004',
    date: '2026-09-04',
    time: '20:45',
    mood: 'calm',
    stressLevel: 2,
    anxietyLevel: 2,
    sleepHours: 7.2,
    sleepQuality: 'good',
    energyLevel: 3,
    overallWellbeing: 4,
    journalNote: 'Focused on consistent hydration and nourishing whole foods.',
    isDemo: true,
  }
];

export const DEMO_LIFESTYLE_LOGS: FoodActivityLog[] = [
  {
    id: 'life-001',
    date: '2026-09-07',
    waterGlasses: 8,
    waterTarget: 8,
    meals: [
      {
        type: 'breakfast',
        description: 'Oatmeal with chia seeds, blueberries, and crushed almonds',
        nutritionalTags: ['fiber', 'iron-rich', 'vitamins'],
      },
      {
        type: 'lunch',
        description: 'Spinach and lentil dal with brown rice and cucumber raita',
        nutritionalTags: ['iron-rich', 'protein', 'anti-inflammatory'],
      },
      {
        type: 'dinner',
        description: 'Grilled paneer with steamed broccoli and quinoa',
        nutritionalTags: ['protein', 'calcium', 'vitamins'],
      },
      {
        type: 'snack',
        description: 'Handful of roasted pumpkin seeds and green tea',
        nutritionalTags: ['iron-rich', 'anti-inflammatory'],
      }
    ],
    activityMinutes: 35,
    activityType: 'yoga',
    steps: 7420,
    sleepHabitScore: 4,
    stressManagementPractice: '10-minute diaphragmatic breathing before sleep',
    isDemo: true,
  },
  {
    id: 'life-002',
    date: '2026-09-06',
    waterGlasses: 7,
    waterTarget: 8,
    meals: [
      {
        type: 'breakfast',
        description: 'Scrambled eggs on whole-grain sourdough with avocado',
        nutritionalTags: ['protein', 'fiber', 'vitamins'],
      },
      {
        type: 'lunch',
        description: 'Chickpea Mediterranean salad with olive oil and greens',
        nutritionalTags: ['fiber', 'iron-rich', 'anti-inflammatory'],
      },
      {
        type: 'dinner',
        description: 'Vegetable vegetable stir-fry with tofu and sesame seeds',
        nutritionalTags: ['protein', 'calcium'],
      }
    ],
    activityMinutes: 40,
    activityType: 'walking',
    steps: 8250,
    sleepHabitScore: 5,
    stressManagementPractice: 'Evening mindful walk in park',
    isDemo: true,
  }
];

export const DEMO_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-001',
    title: 'Daily Iron & Vitamin C Supplement',
    type: 'medication',
    date: '2026-09-08',
    time: '08:30',
    dosageOrNotes: 'Take with lemon water after breakfast',
    completed: true,
    isDemo: true,
  },
  {
    id: 'rem-002',
    title: 'Gynecological Annual Wellness Review',
    type: 'appointment',
    date: '2026-09-22',
    time: '10:30',
    doctorName: 'Dr. Neha Verma, MD (OB-GYN)',
    dosageOrNotes: 'Bring cycle & symptom logs and lipid panel',
    completed: false,
    isDemo: true,
  },
  {
    id: 'rem-003',
    title: 'Thyroid & Vitamin D3 Lab Follow-Up',
    type: 'followup',
    date: '2026-09-18',
    time: '09:00',
    dosageOrNotes: 'Fasting 10-12 hours required',
    completed: false,
    isDemo: true,
  },
  {
    id: 'rem-004',
    title: 'Omega-3 Fatty Acid Capsule',
    type: 'medication',
    date: '2026-09-08',
    time: '20:00',
    dosageOrNotes: 'Take after dinner for healthy hormone building blocks',
    completed: false,
    isDemo: true,
  }
];

export const DEMO_CBT_EXERCISES: CbtExercise[] = [
  {
    id: 'cbt-001',
    title: 'Cognitive Reframing for PMS Stress',
    category: 'Cognitive Reframing',
    durationMin: 7,
    description: 'Notice automatic negative thoughts regarding cycle mood shifts and gently reframe them with objective, supportive statements.',
    steps: [
      'Identify the automatic thought (e.g. "I cannot cope with anything today").',
      'Examine the biological context: Hormonal shifts (estrogen drop) temporarily lower neurotransmitter serotonin availability.',
      'Separate the thought from identity: You are experiencing a transient physiological state, not a personal inadequacy.',
      'Formulate a balanced reframe: "My body is processing hormonal changes. I can adjust my pace, rest, and be kind to myself today."'
    ],
    reflectionPrompt: 'Write down one self-critical thought you experienced today, followed by a compassionate, evidence-based reframe.',
    completed: true,
    completedAt: '2026-09-06 18:20',
  },
  {
    id: 'cbt-002',
    title: '4-7-8 Parasympathetic Vagus Breathing',
    category: 'Stress Relief',
    durationMin: 5,
    description: 'An interactive rhythmic breathing exercise designed to engage the parasympathetic nervous system and reduce cortisol.',
    steps: [
      'Inhale quietly through the nose for a count of 4.',
      'Hold the breath gently for a count of 7.',
      'Exhale completely through open lips making a whoosh sound for a count of 8.',
      'Repeat the cycle 4 times sequentially.'
    ],
    reflectionPrompt: 'Notice any subtle changes in muscle tension in your jaw, shoulders, and abdomen before versus after this breathing pattern.',
    completed: true,
    completedAt: '2026-09-07 19:40',
  },
  {
    id: 'cbt-003',
    title: '5-4-3-2-1 Somatosensory Grounding',
    category: 'Grounding',
    durationMin: 6,
    description: 'Anchor yourself during episodes of heightened anxiety or physical discomfort by connecting with immediate sensory cues.',
    steps: [
      'Acknowledge 5 things you can see around you.',
      'Acknowledge 4 things you can physically touch or feel.',
      'Acknowledge 3 distinct sounds you can hear right now.',
      'Acknowledge 2 scents you can smell.',
      'Acknowledge 1 positive attribute or sensation about yourself.'
    ],
    reflectionPrompt: 'How did shifting focus from internal worry to external sensory inputs influence your heart rate and breath?',
    completed: false,
  },
  {
    id: 'cbt-004',
    title: 'Decatastrophizing Menstrual Discomfort',
    category: 'Mindful Reflection',
    durationMin: 8,
    description: 'Differentiate between physical sensation and the catastrophic anticipation that amplifies pain perception.',
    steps: [
      'Locate the sensation in the body without using judgmental adjectives like "unbearable".',
      'Rate the sensation objectively on a 1-10 scale.',
      'Remind yourself of the body’s healing capacity and transient nature of the luteal/menstrual transition.',
      'List 3 comforting soothing actions within your immediate control (heat pack, warm tea, loose clothing).'
    ],
    reflectionPrompt: 'What gentle supportive action can you gift your body within the next 30 minutes?',
    completed: false,
  }
];

export const DEMO_SHARING_CONSENT: HerHealthSharingConsent = {
  shareCycleSummary: true,
  shareSymptomTrends: true,
  shareMoodSummary: true,
  shareMedicationList: false,
  shareEmergencyContactAlerts: true,
  partnerName: 'Sanjay Roy',
  partnerAccessKey: 'HER-PARTNER-7729',
  doctorAccessAllowed: true,
  lastUpdated: '2026-09-05 11:30',
};
