import { MedicationReminder, DailyRoutineItem, MemoryPromptCard } from '../types';

export type { MedicationReminder, DailyRoutineItem, MemoryPromptCard };

export const INITIAL_MEDICATIONS: MedicationReminder[] = [
  {
    id: 'med-1',
    name: 'Donepezil (Aricept)',
    dosage: '10 mg • 1 tablet',
    time: '08:30 AM',
    taken: true,
    notes: 'Take with morning breakfast or water.'
  },
  {
    id: 'med-2',
    name: 'Memantine (Namenda)',
    dosage: '10 mg • 1 tablet',
    time: '01:00 PM',
    taken: false,
    notes: 'Take with lunch.'
  },
  {
    id: 'med-3',
    name: 'Omega-3 & Vitamin D3',
    dosage: '1000 mg softgel',
    time: '07:30 PM',
    taken: false,
    notes: 'Take with evening meal.'
  }
];

export const INITIAL_ROUTINES: DailyRoutineItem[] = [
  {
    id: 'rout-1',
    title: 'Morning Sunshine & Garden Walk (15 mins)',
    time: '09:00 AM',
    completed: true,
    iconName: 'sun'
  },
  {
    id: 'rout-2',
    title: 'Hydration Break (1 glass fresh water)',
    time: '11:00 AM',
    completed: true,
    iconName: 'droplet'
  },
  {
    id: 'rout-3',
    title: 'Gentle Music & Family Photo Album Review',
    time: '03:30 PM',
    completed: false,
    iconName: 'music'
  },
  {
    id: 'rout-4',
    title: 'Evening Relaxing Tea & Call with Grandchildren',
    time: '06:00 PM',
    completed: false,
    iconName: 'phone'
  }
];

export const MEMORY_PROMPT_CARDS: MemoryPromptCard[] = [
  {
    id: 'fam-1',
    personName: 'Ananya Sharma',
    relationship: 'Daughter (Eldest)',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    memories: [
      'Loves classical music and plays the violin.',
      'Lives in Bengaluru and calls every Tuesday and Sunday evening.',
      'Favorite shared memory: Cooking festival sweets together in the kitchen.'
    ],
    favoriteTopic: 'Gardening & recipes'
  },
  {
    id: 'fam-2',
    personName: 'Rohan Sharma',
    relationship: 'Grandson (Age 10)',
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80',
    memories: [
      'Always brings his handmade art drawings to show you.',
      'You taught him how to play chess on Sunday afternoons.',
      'His favorite treat is warm jalebi and ice cream.'
    ],
    favoriteTopic: 'Chess & drawing animals'
  },
  {
    id: 'fam-3',
    personName: 'Dr. Priya Varma',
    relationship: 'Primary Neurologist & Care Physician',
    photoUrl: 'https://images.unsplash.com/photo-1594824813583-e029497e793e?auto=format&fit=crop&w=400&q=80',
    memories: [
      'Has been your physician for 4 years at Apex Medical Hospital.',
      'Very gentle and always asks about your morning walks.',
      'Next routine wellness checkup is scheduled for next month.'
    ],
    favoriteTopic: 'Morning walks & sleep'
  }
];

export interface CaregiverNote {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  moodRating: 'Calm & Happy' | 'Mildly Restless' | 'Needed Reassurance' | 'High Energy';
}

export const INITIAL_CAREGIVER_NOTES: CaregiverNote[] = [
  {
    id: 'note-1',
    author: 'Ananya (Daughter / Caregiver)',
    timestamp: 'Today, 09:15 AM',
    content: 'Took morning Donepezil smoothly with breakfast. Enjoyed 20 minutes in the garden looking at marigolds.',
    moodRating: 'Calm & Happy'
  },
  {
    id: 'note-2',
    author: 'Sunil (Home Nurse)',
    timestamp: 'Yesterday, 04:30 PM',
    content: 'Brief confusion around 3 PM regarding the time of day. We looked at the orientation card and listened to calm sitar music, which settled everything nicely.',
    moodRating: 'Needed Reassurance'
  }
];
