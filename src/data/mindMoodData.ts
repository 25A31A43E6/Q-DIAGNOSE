import { ScreenerQuestion, CopingResource, CrisisContact } from '../types';

export const PHQ9_QUESTIONS: ScreenerQuestion[] = [
  { id: 1, text: 'Little interest or pleasure in doing things' },
  { id: 2, text: 'Feeling down, depressed, or hopeless' },
  { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 4, text: 'Feeling tired or having little energy' },
  { id: 5, text: 'Poor appetite or overeating' },
  { id: 6, text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down' },
  { id: 7, text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
  { id: 8, text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless' },
  { id: 9, text: 'Thoughts that you would be better off dead or of hurting yourself in some way' },
];

export const GAD7_QUESTIONS: ScreenerQuestion[] = [
  { id: 1, text: 'Feeling nervous, anxious, or on edge' },
  { id: 2, text: 'Not being able to stop or control worrying' },
  { id: 3, text: 'Worrying too much about different things' },
  { id: 4, text: 'Trouble relaxing' },
  { id: 5, text: 'Being so restless that it is hard to sit still' },
  { id: 6, text: 'Becoming easily annoyed or irritable' },
  { id: 7, text: 'Feeling afraid as if something awful might happen' },
];

export const SCREENER_RESPONSE_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

export const SCALE_OPTIONS = SCREENER_RESPONSE_OPTIONS;

export function getPhq9Evaluation(score: number) {
  if (score <= 4) {
    return {
      severityBand: 'Minimal / No Depressive Symptoms',
      severityColor: 'emerald',
      plainSummary: 'Your answers reflect normal fluctuations in daily mood without significant depressive disruption.',
      recommendations: [
        'Maintain healthy sleep, hydration, and social connections.',
        'Engage in regular physical activity and mindful relaxation.',
        'Retake this self-check whenever you experience sustained shifts in energy or mood.'
      ]
    };
  } else if (score <= 9) {
    return {
      severityBand: 'Mild Symptoms',
      severityColor: 'teal',
      plainSummary: 'Your answers suggest mild mood fluctuations that may occasionally affect your daily routine or energy.',
      recommendations: [
        'Practice daily stress reduction and guided breathing exercises in our Coping Library.',
        'Share your feelings with trusted friends, family, or a counselor.',
        'Monitor your sleep patterns and daily activity levels.'
      ]
    };
  } else if (score <= 14) {
    return {
      severityBand: 'Moderate Symptoms',
      severityColor: 'amber',
      plainSummary: 'Your answers suggest moderate symptoms that are noticeably impacting your mood, concentration, or sleep.',
      recommendations: [
        'Consider scheduling an appointment with a licensed mental health professional or general physician.',
        'Utilize our guided grounding tools when feeling overwhelmed.',
        'Establish consistent sleep routines and gentle daily exercise.'
      ]
    };
  } else if (score <= 19) {
    return {
      severityBand: 'Moderately Severe Symptoms',
      severityColor: 'orange',
      plainSummary: 'Your answers indicate significant symptoms that are causing considerable distress in daily functioning.',
      recommendations: [
        'We strongly encourage reaching out to a healthcare provider, psychologist, or psychiatrist for a formal evaluation.',
        'Talk with a trusted loved one or caregiver about how you are feeling.',
        'Use our emergency SOS or crisis line resources if distress becomes acute.'
      ]
    };
  } else {
    return {
      severityBand: 'Severe Symptoms',
      severityColor: 'rose',
      plainSummary: 'Your answers indicate severe distress across multiple areas of daily life and mood.',
      recommendations: [
        'Please connect promptly with a qualified mental health specialist or medical clinic.',
        'Keep crisis support lines readily accessible (National Tele-MANAS 14416 or 988).',
        'Do not hesitate to tap the SOS button for immediate connection to support.'
      ]
    };
  }
}

export function getGad7Evaluation(score: number) {
  if (score <= 4) {
    return {
      severityBand: 'Minimal / Normal Anxiety',
      severityColor: 'emerald',
      plainSummary: 'Your responses indicate typical, manageable levels of situational stress.',
      recommendations: [
        'Continue proactive self-care, mindfulness, and regular rest.',
        'Use our short 2-minute breathing breaks during busy workdays.'
      ]
    };
  } else if (score <= 9) {
    return {
      severityBand: 'Mild Anxiety',
      severityColor: 'teal',
      plainSummary: 'Your responses show mild anxiety or worry that may occasionally create tension or restlessness.',
      recommendations: [
        'Try our 5-4-3-2-1 Sensory Grounding tool to center your focus during tense moments.',
        'Limit excessive caffeine intake and prioritize 7-8 hours of sleep.',
        'Consider journaling thoughts to process recurring worries.'
      ]
    };
  } else if (score <= 14) {
    return {
      severityBand: 'Moderate Anxiety',
      severityColor: 'amber',
      plainSummary: 'Your responses suggest moderate anxiety that is actively interfering with your calm and productivity.',
      recommendations: [
        'Consider consulting a counselor or physician for supportive strategies (e.g. CBT techniques).',
        'Practice Box Breathing twice daily (4s in, 4s hold, 4s out, 4s hold).',
        'Involve a trusted support person in your wellness journey.'
      ]
    };
  } else {
    return {
      severityBand: 'Severe Anxiety',
      severityColor: 'rose',
      plainSummary: 'Your responses reflect high levels of anxiety and persistent worry affecting daily life.',
      recommendations: [
        'We recommend consulting a mental health professional or primary care physician promptly.',
        'Use our AI Companion Panic Grounding mode whenever acute physical symptoms (rapid heartbeat, shortness of breath) arise.',
        'Access immediate crisis helpline support via our SOS menu if needed.'
      ]
    };
  }
}

export const COPING_RESOURCES: CopingResource[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing (4-4-4-4 Technique)',
    category: 'breathing',
    duration: '3 Minutes',
    description: 'A scientifically validated autonomic nervous system reset used by physicians and first responders to lower acute heart rate.',
    instructions: [
      'Inhale slowly and deeply through your nose for 4 seconds.',
      'Hold the breath gently in your chest for 4 seconds.',
      'Exhale smoothly through your mouth for 4 seconds.',
      'Hold empty lungs for 4 seconds before the next breath.',
      'Repeat for 4 to 6 continuous cycles until your body softens.'
    ]
  },
  {
    id: '54321-grounding',
    title: '5-4-3-2-1 Sensory Grounding',
    category: 'grounding',
    duration: '4 Minutes',
    description: 'An evidence-based cognitive redirection exercise that re-anchors your brain into physical reality during panic or dissociation.',
    instructions: [
      'Acknowledge 5 things you can SEE around you (e.g. a chair, light, wall color).',
      'Acknowledge 4 things you can physically TOUCH (e.g. fabric of your shirt, cool desk).',
      'Acknowledge 3 things you can HEAR (e.g. distant traffic, fan hum, your own breath).',
      'Acknowledge 2 things you can SMELL (e.g. coffee, fresh air, clean room).',
      'Acknowledge 1 thing you can TASTE (e.g. sip of cool water, mint, or baseline taste).'
    ]
  },
  {
    id: '478-breathing',
    title: '4-7-8 Relaxing Breath',
    category: 'breathing',
    duration: '4 Minutes',
    description: 'Developed by Dr. Andrew Weil, this pattern acts as a natural tranquilizer for the nervous system, ideal before sleep.',
    instructions: [
      'Close your mouth and inhale quietly through your nose to a count of 4.',
      'Hold your breath comfortably for a count of 7.',
      'Exhale completely through your mouth, making a whoosh sound to a count of 8.',
      'Inhale again and repeat the cycle four times total.'
    ]
  },
  {
    id: 'progressive-relaxation',
    title: 'Progressive Muscle Relaxation (PMR)',
    category: 'relaxation',
    duration: '6 Minutes',
    description: 'Systematically tense and release muscle groups to discharge physiological stress stored in your body.',
    instructions: [
      'Begin with your feet: curl your toes tightly for 5 seconds, then completely release.',
      'Move up to your calves and thighs: tense firmly for 5 seconds, then exhale and release.',
      'Clench your hands into fists and tighten your arms for 5 seconds, then let them fall heavy and limp.',
      'Gently raise your shoulders toward your ears for 5 seconds, then drop them softly.',
      'Notice the warm, heavy sensation of relaxation flowing through your entire body.'
    ]
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Rest & Recovery Checklist',
    category: 'sleep',
    duration: 'Self-Paced',
    description: 'Non-pharmacological clinical sleep practices to support neuro-cognitive recovery and emotional resilience.',
    instructions: [
      'Dim screens and overhead lights 60 minutes before bedtime.',
      'Keep the sleeping environment cool (18–20°C / 65–68°F) and dark.',
      'Avoid heavy meals and caffeine within 5 hours of your intended sleep time.',
      'If unable to sleep after 20 minutes, get out of bed and do a gentle reading activity under soft warm light.'
    ]
  },
  {
    id: 'gratitude-journaling',
    title: 'Reflective Grounding Journal Prompts',
    category: 'journaling',
    duration: '5 Minutes',
    description: 'Short structured prompts to interrupt catastrophic thought loops and cultivate cognitive equilibrium.',
    instructions: [
      'Write down: "Three things that went smoothly today, no matter how small."',
      'Write down: "One challenge I handled in the past, and the inner strength that helped me."',
      'Write down: "One supportive person or memory that gives me comfort right now."'
    ]
  }
];

export const CRISIS_CONTACTS: CrisisContact[] = [
  {
    name: 'National Emergency Helpline (India)',
    number: '112',
    description: 'All-in-one emergency response for medical, police, and fire distress across India.',
    available: '24/7 Toll-Free',
    isEmergency: true
  },
  {
    name: 'Medical Ambulance Dispatch',
    number: '108 / 102',
    description: 'Emergency medical services and rapid ambulance transport.',
    available: '24/7 Toll-Free',
    isEmergency: true
  },
  {
    name: 'Tele-MANAS (Govt of India Mental Health)',
    number: '14416 / 1800 891 4416',
    description: 'Comprehensive 24/7 mental health counseling in 20+ regional Indian languages.',
    available: '24/7 Toll-Free • Multilingual',
    isEmergency: false
  },
  {
    name: 'KIRAN National Mental Health Helpline',
    number: '1800-599-0019',
    description: 'Depression, panic, anxiety, and suicide prevention counseling by Dept of Empowerment of Persons with Disabilities.',
    available: '24/7 Toll-Free',
    isEmergency: false
  },
  {
    name: 'Vandrevala Foundation Helpline',
    number: '+91 9999 666 555',
    description: 'Free, confidential mental health crisis support and psychological first aid.',
    available: '24/7 Active Counseling',
    isEmergency: false
  },
  {
    name: 'AASRA Suicide Prevention Helpline',
    number: '+91 98204 66726',
    description: 'Voluntary non-judgmental crisis intervention for those in severe emotional distress.',
    available: '24/7 Non-Judgmental Support',
    isEmergency: false
  },
  {
    name: 'US / International Crisis Lifeline (988)',
    number: '988',
    description: 'Suicide & Crisis Lifeline available nationwide across the US & Canada.',
    available: '24/7 Free & Confidential',
    isEmergency: false
  }
];
