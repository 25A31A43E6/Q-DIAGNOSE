import { 
  NeurologicalConditionId, 
  NeurologicalConditionResult, 
  NeurologicalReportData, 
  SavedNeurologicalReport, 
  ScreeningHistoryTimelineItem,
  NeurologyEducationItem
} from '../types';

export const NEUROLOGICAL_CONDITIONS_INFO: Record<NeurologicalConditionId, {
  name: string;
  shortName: string;
  description: string;
  commonSymptoms: string[];
  whenToSeekHelp: string[];
  specialist: string;
}> = {
  alzheimers: {
    name: "Alzheimer's Disease & Cognitive Changes",
    shortName: "Alzheimer's Disease",
    description: "A progressive condition that gently affects memory, reasoning, decision-making, and language skills over time.",
    commonSymptoms: [
      "Frequent memory lapses interfering with daily routines",
      "Difficulty completing familiar tasks (e.g. managing bills, following recipes)",
      "Trouble finding the right words or following conversations",
      "Disorientation regarding dates, seasons, or familiar locations",
      "Changes in mood, social withdrawal, or uncharacteristic hesitation"
    ],
    whenToSeekHelp: [
      "Memory changes noticed by family or close friends",
      "Persistent confusion regarding time, location, or loved ones",
      "Difficulty performing regular work or independent living tasks",
      "Sudden personality changes or repeated misplacement of everyday items"
    ],
    specialist: "Cognitive Neurologist / Memory Specialist"
  },
  parkinsons: {
    name: "Parkinson's Disease & Movement Disorders",
    shortName: "Parkinson's Disease",
    description: "A neurodegenerative movement disorder affecting motor coordination, balance, vocal quality, and muscular ease.",
    commonSymptoms: [
      "Involuntary resting tremor in hands, fingers, or chin",
      "Limb stiffness, muscular rigidity, or slow movements (bradykinesia)",
      "Unsteady balance, stooped posture, or shorter walking steps",
      "Soft, monotone voice or reduced facial expressiveness",
      "Handwriting becoming noticeably smaller and crowded (micrographia)"
    ],
    whenToSeekHelp: [
      "Tremors or involuntary shaking at rest",
      "Unexplained stiffness making dressing or walking difficult",
      "Frequent balance instability or near-falls",
      "Noticing changes in vocal projection or motor fluidity"
    ],
    specialist: "Movement Disorder Neurologist"
  },
  epilepsy: {
    name: "Epilepsy & Seizure Disorders",
    shortName: "Epilepsy",
    description: "A neurological condition characterized by recurrent, unprovoked electrical disturbances in the brain causing brief sensory or motor alterations.",
    commonSymptoms: [
      "Episodes of unresponsiveness or blank staring spells",
      "Uncontrolled jerking movements of arms and legs",
      "Temporary confusion or brief memory blackouts",
      "Unusual sensations (tingling, aura, smell, or taste)",
      "Sudden collapse or unexplained emotional surges"
    ],
    whenToSeekHelp: [
      "Any first-time seizure or unexplained loss of consciousness",
      "Seizure lasting longer than 5 minutes (Emergency 112 / 108)",
      "Slow recovery or difficulty breathing after an episode",
      "Repetitive twitching accompanied by disorientation"
    ],
    specialist: "Epileptologist / Clinical Neurologist"
  },
  stroke: {
    name: "Stroke & Cerebrovascular Health",
    shortName: "Stroke",
    description: "An acute medical event occurring when blood flow to a region of the brain is interrupted or reduced, requiring emergency care.",
    commonSymptoms: [
      "Sudden numbness or weakness in face, arm, or leg (especially one side)",
      "Sudden difficulty speaking, slurred words, or trouble understanding speech",
      "Sudden vision loss, double vision, or blurriness in one or both eyes",
      "Sudden dizziness, loss of balance, or difficulty walking",
      "Sudden, severe headache with no known previous cause"
    ],
    whenToSeekHelp: [
      "EMERGENCY: Immediate hospital evaluation required (FAST protocol)",
      "Face drooping, Arm weakness, Speech difficulty -> Time to call 112 / 108",
      "Do not wait for symptoms to resolve on their own"
    ],
    specialist: "Vascular Neurologist / Stroke Care Team"
  },
  ms: {
    name: "Multiple Sclerosis (MS) & Demyelinating Disorders",
    shortName: "Multiple Sclerosis",
    description: "A chronic condition where the body's immune system affects the protective myelin covering of nerves in the central nervous system.",
    commonSymptoms: [
      "Numbness, tingling, or electric-shock sensations in limbs or neck",
      "Vision problems such as optic neuritis, blurry vision, or eye pain",
      "Profound fatigue that does not improve with standard rest",
      "Muscle spasticity, weakness, or coordination difficulties",
      "Sensory sensitivity to elevated body temperature (Uhthoff's sign)"
    ],
    whenToSeekHelp: [
      "Persistent numbness, tingling, or weakness lasting days",
      "Unexplained painful or blurry vision in one eye",
      "Sudden loss of balance or difficulty walking unassisted",
      "Recurrent flare-ups of sensory and coordination symptoms"
    ],
    specialist: "Neuroimmunologist / General Neurologist"
  }
};

export const DEFAULT_SCREENING_HISTORY: ScreeningHistoryTimelineItem[] = [
  {
    id: 'HIST-NEUR-01',
    date: 'May 14, 2026',
    score: 42,
    conditionName: "Alzheimer's Disease",
    status: 'Further Evaluation',
    reportId: 'REP-NEUR-01'
  },
  {
    id: 'HIST-NEUR-02',
    date: 'Jul 10, 2026',
    score: 55,
    conditionName: "Alzheimer's Disease",
    status: 'Further Evaluation',
    reportId: 'REP-NEUR-02'
  },
  {
    id: 'HIST-NEUR-03',
    date: 'Aug 18, 2026',
    score: 64,
    conditionName: "Parkinson's Disease",
    status: 'Further Evaluation',
    reportId: 'REP-NEUR-03'
  },
  {
    id: 'HIST-NEUR-04',
    date: 'Sep 04, 2026',
    score: 78,
    conditionName: "Alzheimer's Disease",
    status: 'High Concern',
    reportId: 'REP-NEUR-04'
  }
];

export const INITIAL_SAVED_REPORTS: SavedNeurologicalReport[] = [
  {
    id: 'REP-NEUR-04',
    date: 'Sep 04, 2026',
    assessmentType: 'Comprehensive Neurological Screening',
    primaryConcernName: "Alzheimer's Disease",
    primaryConcernScore: 78,
    status: 'High Concern',
    report: {
      id: 'REP-NEUR-04',
      patientName: 'Vikram Joshi',
      patientId: 'PT-NEUR-9402',
      age: 64,
      gender: 'Male',
      assessmentDate: 'September 4, 2026',
      inputType: 'symptoms',
      reportedSymptoms: ['Memory Problems', 'Speech Problems', 'Sleep Problems'],
      symptomsDescription: 'I have been experiencing memory problems, occasional confusion, and difficulty finding words during conversations over the past 4 months.',
      importantFindings: [
        'Short-term recall difficulties noted in daily activities',
        'Word-finding pauses reported during conversational speech',
        'Mild sleep fragmentation and night awakenings noted'
      ],
      conditions: [
        {
          id: 'alzheimers',
          name: "Alzheimer's Disease",
          score: 78,
          level: 'High Concern',
          levelBand: 'high',
          whyThisResult: 'Memory-related changes, word-finding hesitation, and occasional confusion were specifically highlighted in your reported symptoms.',
          keyIndicators: ['Short-term memory difficulties', 'Expressive word recall pauses', 'Mild temporal confusion']
        },
        {
          id: 'parkinsons',
          name: "Parkinson's Disease",
          score: 42,
          level: 'Further Evaluation',
          levelBand: 'moderate',
          whyThisResult: 'No resting tremor was reported, but mild sleep changes and subtle motor fatigue warrant general review.',
          keyIndicators: ['Sleep quality changes', 'Mild physical fatigue']
        },
        {
          id: 'epilepsy',
          name: 'Epilepsy',
          score: 18,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'No seizures, episodic staring spells, or sudden blackouts were noted in your screening input.',
          keyIndicators: ['No seizure-like events reported']
        },
        {
          id: 'stroke',
          name: 'Stroke',
          score: 24,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'No sudden one-sided facial drooping, sudden limb paralysis, or emergency focal deficits reported.',
          keyIndicators: ['No acute focal motor deficit']
        },
        {
          id: 'ms',
          name: 'Multiple Sclerosis (MS)',
          score: 28,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'No optic neuritis, localized electric-shock sensations, or focal demyelinating symptoms described.',
          keyIndicators: ['No optic neuritis or focal numbness']
        }
      ],
      primaryConcern: {
        id: 'alzheimers',
        name: "Alzheimer's Disease",
        score: 78,
        level: 'High Concern',
        levelBand: 'high',
        whyThisResult: 'Memory-related changes and word-finding difficulties were specifically highlighted in your reported symptoms.',
        keyIndicators: ['Short-term memory difficulties', 'Expressive word recall pauses']
      },
      recommendedSpecialist: 'Neurologist (Cognitive & Memory Care)',
      nextSteps: [
        'Schedule a formal clinical consultation with a qualified neurologist.',
        'Consider bringing a family member or caregiver to help provide collateral history.',
        'Keep a daily symptom diary noting specific memory lapses or conversational hesitations.',
        'Bring past medical records and current medication lists to your appointment.'
      ],
      safetyNotice: 'This is an AI-assisted screening result and does not confirm a medical diagnosis. Only a licensed physician can diagnose neurological conditions.',
      timestamp: '2026-09-04 10:30:00'
    }
  },
  {
    id: 'REP-NEUR-03',
    date: 'Aug 18, 2026',
    assessmentType: 'Motor & Vocal Screening',
    primaryConcernName: "Parkinson's Disease",
    primaryConcernScore: 64,
    status: 'Further Evaluation',
    report: {
      id: 'REP-NEUR-03',
      patientName: 'Vikram Joshi',
      patientId: 'PT-NEUR-9402',
      age: 64,
      gender: 'Male',
      assessmentDate: 'August 18, 2026',
      inputType: 'symptoms',
      reportedSymptoms: ['Tremor', 'Balance Problems'],
      symptomsDescription: 'Intermittent resting tremor in right hand when relaxed and slight hesitation when turning around while walking.',
      importantFindings: [
        'Resting hand tremor reported in quiet states',
        'Mild postural imbalance noted during rapid turns'
      ],
      conditions: [
        {
          id: 'parkinsons',
          name: "Parkinson's Disease",
          score: 64,
          level: 'Further Evaluation',
          levelBand: 'moderate',
          whyThisResult: 'Hand tremor during resting state and minor turning imbalance were reported in the screening.',
          keyIndicators: ['Resting hand tremor', 'Mild postural hesitation']
        },
        {
          id: 'alzheimers',
          name: "Alzheimer's Disease",
          score: 48,
          level: 'Further Evaluation',
          levelBand: 'moderate',
          whyThisResult: 'Mild cognitive fatigue was noted during busy afternoon schedules.',
          keyIndicators: ['Afternoon cognitive fatigue']
        },
        {
          id: 'ms',
          name: 'Multiple Sclerosis (MS)',
          score: 35,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'Balance changes noted, but without optic symptoms or electric-shock limb sensations.',
          keyIndicators: ['Balance instability without optic involvement']
        },
        {
          id: 'stroke',
          name: 'Stroke',
          score: 22,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'Tremor has been gradual rather than sudden acute onset.',
          keyIndicators: ['Gradual onset pattern']
        },
        {
          id: 'epilepsy',
          name: 'Epilepsy',
          score: 15,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'No seizure episodes or loss of consciousness.',
          keyIndicators: ['No seizure manifestations']
        }
      ],
      primaryConcern: {
        id: 'parkinsons',
        name: "Parkinson's Disease",
        score: 64,
        level: 'Further Evaluation',
        levelBand: 'moderate',
        whyThisResult: 'Hand tremor during resting state and turning imbalance were reported in the screening.',
        keyIndicators: ['Resting hand tremor', 'Mild postural hesitation']
      },
      recommendedSpecialist: 'Neurologist (Movement Disorder Specialist)',
      nextSteps: [
        'Consult a neurologist for clinical examination of muscle tone and gait.',
        'Document when tremor is most noticeable (e.g. at rest vs active holding).',
        'Avoid self-medicating or stopping any prescribed medications.'
      ],
      safetyNotice: 'This is an AI-assisted screening result and does not confirm a medical diagnosis.',
      timestamp: '2026-08-18 14:15:00'
    }
  },
  {
    id: 'REP-NEUR-02',
    date: 'Jul 10, 2026',
    assessmentType: 'Medical Report Screening (Brain MRI)',
    primaryConcernName: "Alzheimer's Disease",
    primaryConcernScore: 55,
    status: 'Further Evaluation',
    report: {
      id: 'REP-NEUR-02',
      patientName: 'Vikram Joshi',
      patientId: 'PT-NEUR-9402',
      age: 64,
      gender: 'Male',
      assessmentDate: 'July 10, 2026',
      inputType: 'report',
      reportedSymptoms: ['Memory Problems', 'Headache'],
      uploadedReportInfo: {
        fileName: 'Brain_MRI_Neuro_Imaging_Report.pdf',
        fileType: 'PDF Document',
        fileSize: '2.4 MB',
        uploadDate: '2026-07-10'
      },
      importantFindings: [
        'Mild bilateral hippocampal volume reduction noted on T1 sequences',
        'No acute intracranial hemorrhage or territorial infarction',
        'Age-appropriate periventricular white matter changes',
        'Vascular parameters: Not available in the uploaded report.',
        'Spinal cord evaluation: Not available in the uploaded report.'
      ],
      conditions: [
        {
          id: 'alzheimers',
          name: "Alzheimer's Disease",
          score: 55,
          level: 'Further Evaluation',
          levelBand: 'moderate',
          whyThisResult: 'The uploaded MRI report indicates mild hippocampal volumetric changes, warranting clinical correlation.',
          keyIndicators: ['Mild hippocampal volume changes', 'Preserved cortical thickness']
        },
        {
          id: 'stroke',
          name: 'Stroke',
          score: 28,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'The report explicitly confirms no acute infarct or territorial vascular occlusion.',
          keyIndicators: ['No acute infarction on diffusion-weighted imaging']
        },
        {
          id: 'parkinsons',
          name: "Parkinson's Disease",
          score: 30,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'Basal ganglia signal characteristics appear within normal parameters.',
          keyIndicators: ['Normal basal ganglia appearance']
        },
        {
          id: 'ms',
          name: 'Multiple Sclerosis (MS)',
          score: 22,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'No active demyelinating plaques or Dawson fingers described.',
          keyIndicators: ['No active demyelinating lesions']
        },
        {
          id: 'epilepsy',
          name: 'Epilepsy',
          score: 18,
          level: 'Low Concern',
          levelBand: 'low',
          whyThisResult: 'No structural cortical dysplasia or mesial temporal sclerosis reported.',
          keyIndicators: ['No epileptogenic structural focus']
        }
      ],
      primaryConcern: {
        id: 'alzheimers',
        name: "Alzheimer's Disease",
        score: 55,
        level: 'Further Evaluation',
        levelBand: 'moderate',
        whyThisResult: 'Mild bilateral hippocampal volume changes noted on structural MRI require medical review.',
        keyIndicators: ['Mild hippocampal volume changes']
      },
      recommendedSpecialist: 'Neurologist',
      nextSteps: [
        'Share this MRI imaging report with your neurologist.',
        'Follow up with standard neuro-cognitive assessment (MMSE/MoCA).',
        'Maintain regular sleep schedule and physical activity.'
      ],
      safetyNotice: 'This is an AI-assisted screening result and does not confirm a medical diagnosis.',
      timestamp: '2026-07-10 11:45:00'
    }
  }
];

export const SAMPLE_MEDICAL_REPORTS = [
  {
    id: 'sample-mri',
    title: 'Brain MRI Scan Report (Neuro-Imaging)',
    fileName: 'Brain_MRI_Neuro_Imaging_Report.pdf',
    fileType: 'application/pdf',
    fileSize: '2.4 MB',
    summary: 'Mild bilateral hippocampal volume reduction; no acute territorial infarction or intracranial hemorrhage; age-appropriate white matter changes.',
    findings: [
      'Mild bilateral hippocampal volume reduction on coronal T1 sequences',
      'Absence of acute territorial stroke or large-vessel occlusion',
      'Fazekas Grade 1 age-consistent periventricular signal changes',
      'Spinal cord evaluation: Not available in the uploaded report.',
      'Cerebral perfusion dynamics: Not available in the uploaded report.'
    ]
  },
  {
    id: 'sample-eeg',
    title: 'Routine Video-EEG Diagnostic Summary',
    fileName: 'Clinical_EEG_Report_Neuro_Consult.pdf',
    fileType: 'application/pdf',
    fileSize: '1.8 MB',
    summary: 'Background posterior rhythm 9.5 Hz; no focal epileptiform discharges; no periodic sharp waves; reactive to eye closure.',
    findings: [
      'Normal posterior dominant rhythm reactive to eye opening',
      'No electrographic seizure patterns or paroxysmal spike-and-wave discharges',
      'Intermittent photic stimulation produced symmetric driving without driving asymmetry',
      'Sleep stage architecture: Not available in the uploaded report.',
      'Intracranial pressure: Not available in the uploaded report.'
    ]
  },
  {
    id: 'sample-motor',
    title: 'Acoustic Dysphonia & Motor Assessment Summary',
    fileName: 'Motor_Tremor_Acoustic_Report.pdf',
    fileType: 'application/pdf',
    fileSize: '1.2 MB',
    summary: 'Acoustic vocal jitter 0.0078, shimmer 0.043; resting micro-tremor in right hand ~4.5 Hz; mild bilateral cogwheel rigidity.',
    findings: [
      'Resting micro-tremor characterized at 4-5 Hz in right distal extremities',
      'Mild acoustic pitch period perturbation (PPE 0.284) on sustained phonation',
      'Slight reduction in arm swing during gait cycle',
      'Dopamine transporter SPECT: Not available in the uploaded report.',
      'Cognitive staging score: Not available in the uploaded report.'
    ]
  }
];
