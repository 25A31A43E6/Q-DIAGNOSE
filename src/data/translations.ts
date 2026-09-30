import { SupportedLanguage } from '../types';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  modePatient: string;
  modeClinical: string;
  patientModeBadge: string;
  clinicalModeBadge: string;
  
  // Navigation
  navHome: string;
  navCheckHealth: string;
  navMyResults: string;
  navMemoryCare: string;
  navMindMood: string;
  navAssistant: string;
  navSettings: string;
  
  navDashboard: string;
  navUploadPredict: string;
  navPredictionResults: string;
  navModelBenchmarks: string;
  navDatasetReference: string;

  // 6-Step Core Flow & Safety
  navEmergencyCheck?: string;
  navAssessment?: string;
  navPrediction?: string;
  navGuidance?: string;
  navHospitals?: string;
  navQuantumPipeline?: string;
  navHistory?: string;
  persistentEmergencyBtn?: string;
  emergencyWarningMessage?: string;
  emergencyChecklistTitle?: string;
  disclaimerMedical?: string;
  
  // SOS & Emergency
  sosButton: string;
  sosModalTitle: string;
  sosModalSubtitle: string;
  sosCallEmergency: string;
  sosCallCaregiver: string;
  sosFindHospitals: string;
  sosCrisisLine: string;
  sosDisclaimer: string;
  sosCancel: string;

  // Disclaimer
  researchDisclaimer: string;
  nonDiagnosticNotice: string;

  // Patient Home
  greeting: string;
  greetingSubtitle: string;
  quickCheckTitle: string;
  quickCheckDesc: string;
  memoryCareTitle: string;
  memoryCareDesc: string;
  mindMoodTitle: string;
  mindMoodDesc: string;
  assistantCardTitle: string;
  assistantCardDesc: string;
  
  // Check Health Wizard
  stepSelectArea: string;
  stepProvideDetails: string;
  stepReviewAnalyze: string;
  breastHealth: string;
  heartHealth: string;
  neuroVoiceHealth: string;
  startAnalysis: string;
  loadDemoPatient: string;

  // Results
  whatWeFound: string;
  confidenceTitle: string;
  keyContributingFactors: string;
  learnMoreDetails: string;
  askAssistantAboutResults: string;
  nextStepsTitle: string;

  // Memory Care
  todayOrientation: string;
  dailyRoutine: string;
  medicationReminders: string;
  familyMemoryRecall: string;
  imConfusedButton: string;
  caregiverDashboard: string;

  // Mind & Mood
  screenersTitle: string;
  phq9Title: string;
  gad7Title: string;
  groundingResources: string;
  startScreener: string;

  // Assistant
  assistantTitle: string;
  assistantStatus: string;
  assistantPromptPlaceholder: string;
  calmGroundingButton: string;
  voiceGuideButton: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    appName: 'Q-Diagnose',
    tagline: 'Hybrid Quantum-Classical Health & Early Screening Platform',
    modePatient: 'Patient Mode',
    modeClinical: 'Clinical/Research Mode',
    patientModeBadge: 'Patient & Caregiver View',
    clinicalModeBadge: 'Quantum ML Research Lab',
    
    navHome: 'Home',
    navCheckHealth: 'Check My Health',
    navMyResults: 'My Results',
    navMemoryCare: 'Memory Care',
    navMindMood: 'Mind & Mood',
    navAssistant: 'Talk to Assistant',
    navSettings: 'Settings',

    navDashboard: 'Research Dashboard',
    navUploadPredict: 'Upload & Predict',
    navPredictionResults: 'Prediction Results',
    navModelBenchmarks: 'Model Benchmarks',
    navDatasetReference: 'Dataset Reference',

    sosButton: 'SOS Help',
    sosModalTitle: 'Immediate Support & Emergency Assistance',
    sosModalSubtitle: 'Select the type of assistance you need right now. No call is placed without your explicit tap.',
    sosCallEmergency: 'Call Emergency Services (112 / 108 / 911)',
    sosCallCaregiver: 'Call Trusted Caregiver / Family Contact',
    sosFindHospitals: 'Find Nearest Medical Center & ER',
    sosCrisisLine: 'Call Mental Health Crisis Helpline (14416 / 988)',
    sosDisclaimer: 'Emergency choices require your active confirmation on the next prompt.',
    sosCancel: 'Return to App',

    researchDisclaimer: 'Research & Screening Platform: Not a definitive medical diagnosis. Always consult healthcare professionals for clinical decisions.',
    nonDiagnosticNotice: 'This is an early screening and health support tool. It does not replace clinical evaluation or emergency medical services.',

    greeting: 'How can we support your health today?',
    greetingSubtitle: 'Explore guided health assessments, memory care routines, mental wellbeing screeners, and our multilingual AI assistant.',
    quickCheckTitle: 'Check My Health',
    quickCheckDesc: 'Guided assessment for breast, heart, and neurological wellbeing powered by quantum-classical models.',
    memoryCareTitle: 'Memory & Cognitive Care',
    memoryCareDesc: 'Gentle daily routines, orientation cards, medication tracking, and family memory prompts.',
    mindMoodTitle: 'Mind & Mood Wellbeing',
    mindMoodDesc: 'Confidential self-report screeners (PHQ-9, GAD-7) and calming grounding exercises.',
    assistantCardTitle: 'AI Health Companion',
    assistantCardDesc: 'Voice-guided assistance, panic grounding exercises, and step-by-step app navigation in 6 languages.',

    stepSelectArea: '1. Select Focus Area',
    stepProvideDetails: '2. Clinical Details',
    stepReviewAnalyze: '3. Quantum-Classical Analysis',
    breastHealth: 'Breast Tissue Health',
    heartHealth: 'Cardiovascular Health',
    neuroVoiceHealth: 'Neurological & Vocal Biomarkers',
    startAnalysis: 'Run Health Analysis',
    loadDemoPatient: 'Load Verified Patient Profile',

    whatWeFound: 'What We Found',
    confidenceTitle: 'Assessment Confidence & Range',
    keyContributingFactors: 'Primary Observed Factors',
    learnMoreDetails: 'View Detailed Model Insights (Quantum / Classical)',
    askAssistantAboutResults: 'Ask Assistant to Explain These Results in Plain Words',
    nextStepsTitle: 'Recommended Next Steps',

    todayOrientation: "Today's Orientation",
    dailyRoutine: 'Daily Routines & Checklists',
    medicationReminders: 'Medication Schedule',
    familyMemoryRecall: 'Family & Familiar Faces',
    imConfusedButton: "I'm Feeling Confused — Help Me",
    caregiverDashboard: 'Caregiver Portal & History',

    screenersTitle: 'Mental & Behavioral Health Screeners',
    phq9Title: 'PHQ-9 Mood & Wellbeing Screener',
    gad7Title: 'GAD-7 Anxiety & Calmness Screener',
    groundingResources: 'Calmness & Grounding Resource Library',
    startScreener: 'Start Confidential Screener',

    assistantTitle: 'Q-Diagnose Health Companion',
    assistantStatus: 'Ready to listen & guide in your language',
    assistantPromptPlaceholder: 'Type or speak: "Guide me through this", "I feel panicky", "Explain my results"...',
    calmGroundingButton: 'Calm Panic / Breathe',
    voiceGuideButton: 'Voice Guide',
  },
  hi: {
    appName: 'Q-डायग्नोस',
    tagline: 'हाइब्रिड क्वांटम-क्लासिकल स्वास्थ्य एवं प्रारंभिक जांच मंच',
    modePatient: 'मरीज़ मोड (Patient)',
    modeClinical: 'अनुसंधान मोड (Clinical)',
    patientModeBadge: 'मरीज़ और देखभालकर्ता दृश्य',
    clinicalModeBadge: 'क्वांटम एमएल अनुसंधान लैब',

    navHome: 'मुख्य पृष्ठ',
    navCheckHealth: 'स्वास्थ्य जांचें',
    navMyResults: 'मेरे परिणाम',
    navMemoryCare: 'स्मृति देखभाल',
    navMindMood: 'मन और मनोदशा',
    navAssistant: 'सहायक से बात करें',
    navSettings: 'सेटिंग्स',

    navDashboard: 'अनुसंधान डैशबोर्ड',
    navUploadPredict: 'अपलोड व भविष्यवाणी',
    navPredictionResults: 'भविष्यवाणी परिणाम',
    navModelBenchmarks: 'मॉडल बेंचमार्क',
    navDatasetReference: 'डेटासेट संदर्भ',

    sosButton: 'आपातकालीन SOS',
    sosModalTitle: 'तत्काल सहायता एवं आपातकालीन संपर्क',
    sosModalSubtitle: 'अपनी आवश्यकतानुसार विकल्प चुनें। आपकी पुष्टि के बिना कोई कॉल नहीं की जाएगी।',
    sosCallEmergency: 'आपातकालीन सेवाओं को कॉल करें (112 / 108)',
    sosCallCaregiver: 'विश्वसनीय देखभालकर्ता / परिवार को कॉल करें',
    sosFindHospitals: 'निकटतम अस्पताल और आपातकालीन कक्ष खोजें',
    sosCrisisLine: 'मानसिक स्वास्थ्य हेल्पलाइन (टेली-मानस 14416 / 1800-599-0019)',
    sosDisclaimer: 'आपातकालीन कॉल के लिए आपकी सक्रिय पुष्टि आवश्यक होगी।',
    sosCancel: 'ऐप पर वापस जाएं',

    researchDisclaimer: 'अनुसंधान एवं जांच मंच: यह अंतिम चिकित्सा निदान नहीं है। हमेशा योग्य डॉक्टर से परामर्श लें।',
    nonDiagnosticNotice: 'यह एक प्रारंभिक स्वास्थ्य जांच उपकरण है। यह आपातकालीन चिकित्सा का विकल्प नहीं है।',

    greeting: 'आज हम आपके स्वास्थ्य में कैसे सहायता कर सकते हैं?',
    greetingSubtitle: 'मार्गदर्शित स्वास्थ्य जांच, स्मृति देखभाल, मानसिक स्वास्थ्य स्क्रीनिंग और बहुभाषी सहायक का उपयोग करें।',
    quickCheckTitle: 'स्वास्थ्य जांच',
    quickCheckDesc: 'स्तन, हृदय और तंत्रिका संबंधी स्वास्थ्य की हाइब्रिड क्वांटम जांच।',
    memoryCareTitle: 'स्मृति एवं संज्ञानात्मक देखभाल',
    memoryCareDesc: 'दैनिक दिनचर्या, दवा की याद दिलाने वाले अलार्म और पारिवारिक स्मृति अभ्यास।',
    mindMoodTitle: 'मन एवं मनोदशा स्वास्थ्य',
    mindMoodDesc: 'गोपनीय PHQ-9, GAD-7 स्क्रीनिंग और शांत करने वाले श्वसन अभ्यास।',
    assistantCardTitle: 'एआई स्वास्थ्य साथी',
    assistantCardDesc: 'आवाज द्वारा मार्गदर्शन, पैनिक अटैक ग्राउंडिंग और 6 भाषाओं में सहायता।',

    stepSelectArea: '1. स्वास्थ्य क्षेत्र चुनें',
    stepProvideDetails: '2. लक्षण एवं विवरण',
    stepReviewAnalyze: '3. क्वांटम-क्लासिकल विश्लेषण',
    breastHealth: 'स्तन स्वास्थ्य',
    heartHealth: 'हृदय स्वास्थ्य (Cardiovascular)',
    neuroVoiceHealth: 'तंत्रिका व आवाज बायोमार्कर',
    startAnalysis: 'विश्लेषण शुरू करें',
    loadDemoPatient: 'परीक्षण मरीज़ प्रोफ़ाइल लोड करें',

    whatWeFound: 'जांच में क्या पाया गया',
    confidenceTitle: 'विश्वास स्तर एवं सीमा',
    keyContributingFactors: 'प्रमुख प्रभावित करने वाले कारक',
    learnMoreDetails: 'मॉडल की विस्तृत तकनीकी जानकारी देखें',
    askAssistantAboutResults: 'सहायक से सरल भाषा में समझाने को कहें',
    nextStepsTitle: 'सुझाए गए अगले कदम',

    todayOrientation: 'आज की स्थिति (दिन व समय)',
    dailyRoutine: 'दैनिक कार्य एवं दिनचर्या',
    medicationReminders: 'दवाइयों का समय',
    familyMemoryRecall: 'परिवार और परिचित चेहरे',
    imConfusedButton: 'मुझे भ्रम हो रहा है — मदद करें',
    caregiverDashboard: 'देखभालकर्ता पोर्टल',

    screenersTitle: 'मानसिक एवं व्यवहारिक स्वास्थ्य स्क्रीनिंग',
    phq9Title: 'PHQ-9 मनोदशा स्क्रीनिंग',
    gad7Title: 'GAD-7 चिंता एवं शांति स्क्रीनिंग',
    groundingResources: 'शांति एवं ग्राउंडिंग संसाधन',
    startScreener: 'गोपनीय जांच शुरू करें',

    assistantTitle: 'Q-डायग्नोस स्वास्थ्य साथी',
    assistantStatus: 'आपकी भाषा में सुनने और मदद करने के लिए तैयार',
    assistantPromptPlaceholder: 'लिखें या बोलें: "मुझे समझाइए", "मुझे घबराहट हो रही है", "परिणाम बताएं"...',
    calmGroundingButton: 'घबराहट शांत करें',
    voiceGuideButton: 'आवाज गाइड',
  },
  ta: {
    appName: 'Q-டயக்னோஸ்',
    tagline: 'குவாண்டம்-கிளாசிக்கல் ஆரம்ப சுகாதார பரிசோதனை தளம்',
    modePatient: 'நோயாளி பயன்முறை',
    modeClinical: 'ஆராய்ச்சி பயன்முறை',
    patientModeBadge: 'நோயாளி மற்றும் பராமரிப்பாளர் பார்வை',
    clinicalModeBadge: 'குவாண்டம் எம்எல் ஆராய்ச்சி மையம்',

    navHome: 'முகப்பு',
    navCheckHealth: 'உடல்நலப் பரிசோதனை',
    navMyResults: 'என் முடிவுகள்',
    navMemoryCare: 'நினைவாற்றல் பாதுகாப்பு',
    navMindMood: 'மனநிலை & அமைதி',
    navAssistant: 'உதவியாளரிடம் பேசுங்கள்',
    navSettings: 'அமைப்புகள்',

    navDashboard: 'ஆராய்ச்சி பலகை',
    navUploadPredict: 'பதிவேற்றம் & கணிப்பு',
    navPredictionResults: 'கணிப்பு முடிவுகள்',
    navModelBenchmarks: 'மாதிரி ஒப்பீடுகள்',
    navDatasetReference: 'தரவுத்தொகுப்பு குறிப்பு',

    sosButton: 'அவசர உதவி SOS',
    sosModalTitle: 'உடனடி உதவி மற்றும் அவசர தொடர்பு',
    sosModalSubtitle: 'உங்களுக்கு தேவையான உதவியை தேர்வு செய்யுங்கள். உங்கள் உறுதிப்படுத்தல் இல்லாமல் அழைப்பு செல்லாது.',
    sosCallEmergency: 'அவசர சேவைகளை அழைக்கவும் (112 / 108)',
    sosCallCaregiver: 'குடும்பத்தினரை அழைக்கவும்',
    sosFindHospitals: 'அருகிலுள்ள மருத்துவமனையைக் கண்டறியவும்',
    sosCrisisLine: 'மனநல உதவி எண் (14416 / 1800-599-0019)',
    sosDisclaimer: 'அவசர அழைப்பை உறுதிப்படுத்த கிளிக் செய்யவும்.',
    sosCancel: 'பயன்பாட்டிற்குத் திரும்பு',

    researchDisclaimer: 'ஆராய்ச்சி மற்றும் பரிசோதனை தளம்: இது இறுதி மருத்துவ நோயறிதல் அல்ல. மருத்துவரை அணுகவும்.',
    nonDiagnosticNotice: 'இது ஆரம்ப சுகாதார வழிகாட்டுதல் கருவி மட்டுமே.',

    greeting: 'இன்று உங்கள் உடல்நலத்திற்கு எவ்வாறு உதவலாம்?',
    greetingSubtitle: 'வழிகாட்டப்பட்ட சுகாதார சோதனைகள், நினைவாற்றல் உதவிகள் மற்றும் பலமொழி குரல் உதவியாளர்.',
    quickCheckTitle: 'உடல்நலப் பரிசோதனை',
    quickCheckDesc: 'மார்பகம், இதயம் மற்றும் நரம்பியல் ஆரோக்கியத்திற்கான பரிசோதனை.',
    memoryCareTitle: 'நினைவாற்றல் & அறிவாற்றல் பராமரிப்பு',
    memoryCareDesc: 'தினசரி நினைவூட்டல்கள், மருந்து அட்டவணை மற்றும் குடும்ப நினைவுகள்.',
    mindMoodTitle: 'மனநல நல்வாழ்வு',
    mindMoodDesc: 'ரகசிய PHQ-9, GAD-7 சுய மதிப்பீடுகள் மற்றும் சுவாசப் பயிற்சிகள்.',
    assistantCardTitle: 'AI குரல் உதவியாளர்',
    assistantCardDesc: 'பயப்பட வேண்டாம் - அமைதிப்படுத்தும் சுவாசப் பயிற்சிகள் மற்றும் வழிகாட்டுதல்.',

    stepSelectArea: '1. பிரிவைத் தேர்ந்தெடுக்கவும்',
    stepProvideDetails: '2. விவரங்களை உள்ளிடவும்',
    stepReviewAnalyze: '3. குவாண்டம் பகுப்பாய்வு',
    breastHealth: 'மார்பக திசு ஆரோக்கியம்',
    heartHealth: 'இதய நல்வாழ்வு',
    neuroVoiceHealth: 'நரம்பியல் & குரல் குறிப்பான்கள்',
    startAnalysis: 'பகுப்பாய்வைத் தொடங்கு',
    loadDemoPatient: 'மாதிரி நோயாளியை ஏற்றவும்',

    whatWeFound: 'கண்டறியப்பட்ட தகவல்கள்',
    confidenceTitle: 'துல்லியம் மற்றும் நம்பிக்கை வரம்பு',
    keyContributingFactors: 'முக்கிய காரணிகள்',
    learnMoreDetails: 'விரிவான மாதிரி விளக்கங்களைப் பார்க்கவும்',
    askAssistantAboutResults: 'முடிவுகளை எளிய தமிழில் விளக்கக் கேளுங்கள்',
    nextStepsTitle: 'பரிந்துரைக்கப்பட்ட அடுத்த கட்டங்கள்',

    todayOrientation: 'இன்றைய நாள் மற்றும் நேரம்',
    dailyRoutine: 'தினசரி நடைமுறைகள்',
    medicationReminders: 'மருந்து அட்டவணை',
    familyMemoryRecall: 'குடும்ப உறுப்பினர்களின் நினைவுகள்',
    imConfusedButton: 'எனக்கு குழப்பமாக உள்ளது — உதவி தேவை',
    caregiverDashboard: 'பராமரிப்பாளர் தளம்',

    screenersTitle: 'மனநல சுய பரிசோதனை',
    phq9Title: 'PHQ-9 மனநிலை மதிப்பீடு',
    gad7Title: 'GAD-7 பதட்ட மதிப்பீடு',
    groundingResources: 'அமைதிப்படுத்தும் சுவாசப் பயிற்சிகள்',
    startScreener: 'மதிப்பீட்டைத் தொடங்கவும்',

    assistantTitle: 'Q-டயக்னோஸ் நலன் உதவியாளர்',
    assistantStatus: 'தமிழில் வழிகாட்டத் தயார்',
    assistantPromptPlaceholder: 'பேசவும் அல்லது தட்டச்சு செய்யவும்: "எனக்கு உதவுங்கள்", "பதட்டமாக உள்ளது"...',
    calmGroundingButton: 'சுவாசப் பயிற்சி',
    voiceGuideButton: 'குரல் வழிகாட்டி',
  },
  te: {
    appName: 'Q-డయాగ్నోస్',
    tagline: 'క్వాంటం-క్లాసికల్ ముందస్తు ఆరోగ్య స్క్రీనింగ్ వేదిక',
    modePatient: 'రోగి మోడ్ (Patient)',
    modeClinical: 'పరిశోధన మోడ్ (Clinical)',
    patientModeBadge: 'రోగి & సంరక్షకుల వీక్షణ',
    clinicalModeBadge: 'క్వాంటం పరిశోధన విభాగం',

    navHome: 'హోమ్',
    navCheckHealth: 'ఆరోగ్య పరీక్ష',
    navMyResults: 'నా ఫలితాలు',
    navMemoryCare: 'జ్ఞాపకశక్తి సంరక్షణ',
    navMindMood: 'మనస్సు & మానసిక స్థితి',
    navAssistant: 'సహాయకుడితో మాట్లాడండి',
    navSettings: 'సెట్టింగ్‌లు',

    navDashboard: 'పరిశోధన డాష్‌బోర్డ్',
    navUploadPredict: 'అప్‌లోడ్ & అంచనా',
    navPredictionResults: 'ఫలితాలు',
    navModelBenchmarks: 'మోడల్ బెంచ్‌మార్క్‌లు',
    navDatasetReference: 'డేటాసెట్ సమాచారం',

    sosButton: 'అత్యవసర SOS',
    sosModalTitle: 'తక్షణ అత్యవసర సహాయం',
    sosModalSubtitle: 'మీకు అవసరమైన సహాయాన్ని ఎంచుకోండి. మీ అనుమతి లేకుండా కాల్ చేయబడదు.',
    sosCallEmergency: 'అత్యవసర సేవలకు కాల్ చేయండి (112 / 108)',
    sosCallCaregiver: 'కుటుంబ సభ్యులకు కాల్ చేయండి',
    sosFindHospitals: 'సమీపంలోని ఆసుపత్రిని కనుగొనండి',
    sosCrisisLine: 'మానసిక ఆరోగ్య హెల్ప్‌లైన్ (14416 / 1800-599-0019)',
    sosDisclaimer: 'అత్యవసర కాల్ చేయడానికి నిర్ధారించండి.',
    sosCancel: 'యాప్‌కి తిరిగి వెళ్లండి',

    researchDisclaimer: 'పరిశోధన వేదిక: ఇది ఖచ్చితమైన వైద్య నిర్ధారణ కాదు. వైద్యుడిని సంప్రదించండి.',
    nonDiagnosticNotice: 'ఇది ప్రాథమిక ఆరోగ్య పరీక్షా సాధనం మాత్రమే.',

    greeting: 'ఈరోజు మీ ఆరోగ్యానికి ఎలా సహాయపడగలం?',
    greetingSubtitle: 'ఆరోగ్య పరీక్షలు, జ్ఞాపకశక్తి సంరక్షణ మరియు బహుభాషా ఏఐ సహాయకుడి సేవలు.',
    quickCheckTitle: 'ఆరోగ్య పరీక్ష',
    quickCheckDesc: 'రొమ్ము, గుండె మరియు నాడీ సంబంధిత ఆరోగ్య పరిశీలన.',
    memoryCareTitle: 'జ్ఞాపకశక్తి సంరక్షణ',
    memoryCareDesc: 'రోజువారీ దినచర్యలు, మందుల రిమైండర్లు మరియు కుటుంబ జ్ఞాపకాలు.',
    mindMoodTitle: 'మానసిక ఆరోగ్యం',
    mindMoodDesc: 'గోప్యమైన PHQ-9, GAD-7 స్క్రీనింగ్‌లు మరియు ప్రశాంతత శ్వాస వ్యాయామాలు.',
    assistantCardTitle: 'AI వాయిస్ అసిస్టెంట్',
    assistantCardDesc: 'భయపడవద్దు - ప్రశాంతపరిచే శ్వాస పద్ధతులు మరియు మార్గదర్శకత్వం.',

    stepSelectArea: '1. విభాగాన్ని ఎంచుకోండి',
    stepProvideDetails: '2. వివరాలు నమోదు చేయండి',
    stepReviewAnalyze: '3. క్వాంటం విశ్లేషణ',
    breastHealth: 'రొమ్ము ఆరోగ్య పరిశీలన',
    heartHealth: 'గుండె ఆరోగ్యం',
    neuroVoiceHealth: 'వాయిస్ & నాడీ బయోమార్కర్లు',
    startAnalysis: 'విశ్లేషణ ప్రారంభించండి',
    loadDemoPatient: 'నమూనా రోగి ప్రొఫైల్‌ను లోడ్ చేయండి',

    whatWeFound: 'కనుగొన్న వివరాలు',
    confidenceTitle: 'నమ్మక స్థాయి & పరిధి',
    keyContributingFactors: 'ముఖ్యమైన అంశాలు',
    learnMoreDetails: 'వివరణాత్మక సాంకేతిక వివరాలు చూడండి',
    askAssistantAboutResults: 'ఫలితాలను సులభమైన తెలుగులో వివరించమని అడగండి',
    nextStepsTitle: 'తదుపరి సూచించబడిన చర్యలు',

    todayOrientation: 'ఈరోజు సమయం మరియు తేదీ',
    dailyRoutine: 'రోజువారీ పనులు',
    medicationReminders: 'మందుల సమయ పట్టిక',
    familyMemoryRecall: 'కుటుంబ సభ్యుల జ్ఞాపకాలు',
    imConfusedButton: 'నాకు గందరగోళంగా ఉంది — సహాయం చేయండి',
    caregiverDashboard: 'సంరక్షకుల పోర్టల్',

    screenersTitle: 'మానసిక ఆరోగ్య స్క్రీనింగ్',
    phq9Title: 'PHQ-9 మానసిక స్థితి అంచనా',
    gad7Title: 'GAD-7 ఆందోళన అంచనా',
    groundingResources: 'ప్రశాంతత వ్యాయామాలు',
    startScreener: 'స్క్రీనింగ్ ప్రారంభించండి',

    assistantTitle: 'Q-డయాగ్నోస్ హెల్త్ అసిస్టెంట్',
    assistantStatus: 'తెలుగులో మార్గదర్శనం చేయడానికి సిద్ధంగా ఉంది',
    assistantPromptPlaceholder: 'మాట్లాడండి లేదా టైప్ చేయండి: "నాకు సహాయం చేయండి", "కంగారుగా ఉంది"...',
    calmGroundingButton: 'ప్రశాంత శ్వాస',
    voiceGuideButton: 'వాయిస్ గైడ్',
  },
  bn: {
    appName: 'Q-ডায়াগনোজ',
    tagline: 'কোয়ান্টাম-ক্লাসিক্যাল প্রাথমিক স্বাস্থ্য স্ক্রিনিং প্ল্যাটফর্ম',
    modePatient: 'রোগী মোড (Patient)',
    modeClinical: 'গবেষণা মোড (Clinical)',
    patientModeBadge: 'রোগী ও পরিচর্যাকারীর ভিউ',
    clinicalModeBadge: 'কোয়ান্টাম এমএল গবেষণা ল্যাব',

    navHome: 'হোম',
    navCheckHealth: 'স্বাস্থ্য পরীক্ষা',
    navMyResults: 'আমার ফলাফল',
    navMemoryCare: 'স্মৃতি যত্ন (Memory Care)',
    navMindMood: 'মন ও মেজাজ',
    navAssistant: 'সহকারীর সাথে কথা বলুন',
    navSettings: 'সেটিংস',

    navDashboard: 'গবেষণা ড্যাশবোর্ড',
    navUploadPredict: 'আপলোড ও পূর্বাভাস',
    navPredictionResults: 'ফলাফল বিবরণ',
    navModelBenchmarks: 'মডেল বেঞ্চমার্ক',
    navDatasetReference: 'তথ্যসূত্র ও রেফারেন্স',

    sosButton: 'জরুরী SOS',
    sosModalTitle: 'জরুরী সহায়তা এবং যোগাযোগ',
    sosModalSubtitle: 'আপনার প্রয়োজনীয় সহায়তা বেছে নিন। আপনার নিশ্চিতকরণ ছাড়া কোনো কল যাবে না।',
    sosCallEmergency: 'জরুরী সেবা কল করুন (112 / 108)',
    sosCallCaregiver: 'পরিবারের সদস্যকে কল করুন',
    sosFindHospitals: 'নিকটস্থ হাসপাতাল ও এমার্জেন্সি খুঁজুন',
    sosCrisisLine: 'মানসিক স্বাস্থ্য হেল্পলাইন (14416 / 1800-599-0019)',
    sosDisclaimer: 'জরুরী কলের জন্য নিশ্চিতকরণ প্রয়োজন।',
    sosCancel: 'ফিরে যান',

    researchDisclaimer: 'গবেষণা ও স্ক্রিনিং প্ল্যাটফর্ম: এটি কোনো চূড়ান্ত চিকিৎসা নির্ণয় নয়। ডাক্তারের পরামর্শ নিন।',
    nonDiagnosticNotice: 'এটি একটি প্রাথমিক স্বাস্থ্য সহায়ক সরঞ্জাম মাত্র।',

    greeting: 'আজ আমরা আপনার স্বাস্থ্যে কীভাবে সাহায্য করতে পারি?',
    greetingSubtitle: 'নির্দেশিত স্বাস্থ্য পরীক্ষা, স্মৃতি যত্ন রুটিন এবং বহুভাষিক এআই সহকারী।',
    quickCheckTitle: 'স্বাস্থ্য পরীক্ষা',
    quickCheckDesc: 'স্তন, হার্ট এবং স্নায়ু স্বাস্থ্য মূল্যায়ন।',
    memoryCareTitle: 'স্মৃতি ও বোধশক্তি যত্ন',
    memoryCareDesc: 'দৈনিক রুটিন, ওষুধের সময়সূচী এবং পারিবারিক স্মৃতির চর্চা।',
    mindMoodTitle: 'মানসিক স্বাস্থ্য ও মেজাজ',
    mindMoodDesc: 'গোপনীয় PHQ-9, GAD-7 স্ব-মূল্যায়ন এবং শান্ত শ্বাস-প্রশ্বাসের ব্যায়াম।',
    assistantCardTitle: 'এআই ভয়েস সহকারী',
    assistantCardDesc: 'আতঙ্কিত হবেন না - শান্ত করার শ্বাস-প্রশ্বাসের গাইড ও নির্দেশনা।',

    stepSelectArea: '১. বিভাগ নির্বাচন করুন',
    stepProvideDetails: '২. বিবরণ দিন',
    stepReviewAnalyze: '৩. কোয়ান্টাম বিশ্লেষণ',
    breastHealth: 'স্তন স্বাস্থ্য পরীক্ষা',
    heartHealth: 'কার্ডিওভাসকুলার বা হার্ট স্বাস্থ্য',
    neuroVoiceHealth: 'স্নায়ু ও কণ্ঠস্বর বায়োমার্কার',
    startAnalysis: 'বিশ্লেষণ শুরু করুন',
    loadDemoPatient: 'নমুনা রোগীর প্রোফাইল লোড করুন',

    whatWeFound: 'মূল পর্যবেক্ষণ',
    confidenceTitle: 'বিশ্বস্ততা ও রেঞ্জ',
    keyContributingFactors: 'প্রধান লক্ষণীয় উপাদান',
    learnMoreDetails: 'বিশদ প্রযুক্তিগত মডেল বিবরণ দেখুন',
    askAssistantAboutResults: 'সহকারীকে সহজ বাংলায় ফলাফল বোঝাতে বলুন',
    nextStepsTitle: 'পরামর্শকৃত পরবর্তী পদক্ষেপ',

    todayOrientation: 'আজকের দিন ও সময়',
    dailyRoutine: 'দৈনিক কাজকর্ম',
    medicationReminders: 'ওষুধের সময়সূচী',
    familyMemoryRecall: 'পরিবারের সদস্যদের স্মৃতি',
    imConfusedButton: 'আমি বিভ্রান্ত বোধ করছি — সাহায্য করুন',
    caregiverDashboard: 'পরিচর্যাকারী পোর্টাল',

    screenersTitle: 'মানসিক স্বাস্থ্য স্ক্রিনিং',
    phq9Title: 'PHQ-9 মেজাজ মূল্যায়ন',
    gad7Title: 'GAD-7 উদ্বেগ মূল্যায়ন',
    groundingResources: 'শান্ত হওয়ার ব্যায়াম',
    startScreener: 'মূল্যায়ন শুরু করুন',

    assistantTitle: 'Q-ডায়াগনোজ স্বাস্থ্য সহকারী',
    assistantStatus: 'বাংলায় নির্দেশনা দিতে প্রস্তুত',
    assistantPromptPlaceholder: 'বলুন বা লিখুন: "আমাকে সাহায্য করুন", "ভয় লাগছে", "ফলাফল বুঝিয়ে দিন"...',
    calmGroundingButton: 'শান্ত শ্বাস-প্রশ্বাস',
    voiceGuideButton: 'ভয়েস গাইড',
  },
  mr: {
    appName: 'Q-डायग्नोस',
    tagline: 'हायब्रिड क्वांटम-क्लासिकल आरोग्य आणि पूर्व तपासणी व्यासपीठ',
    modePatient: 'रुग्ण मोड (Patient)',
    modeClinical: 'संशोधन मोड (Clinical)',
    patientModeBadge: 'रुग्ण आणि काळजीवाहू दृश्य',
    clinicalModeBadge: 'क्वांटम एमएल संशोधन केंद्र',

    navHome: 'मुख्य पृष्ठ',
    navCheckHealth: 'आरोग्य तपासा',
    navMyResults: 'माझे निकाल',
    navMemoryCare: 'स्मृती काळजी',
    navMindMood: 'मन आणि मनस्थिती',
    navAssistant: 'मदतनीसाशी बोला',
    navSettings: 'सेटिंग्ज',

    navDashboard: 'संशोधन डॅशबोर्ड',
    navUploadPredict: 'अपलोड आणि अंदाज',
    navPredictionResults: 'अंदाज निकाल',
    navModelBenchmarks: 'मॉडेल बेंचमार्क',
    navDatasetReference: 'डेटासेट संदर्भ',

    sosButton: 'तातडीची मदत SOS',
    sosModalTitle: 'त्वरित सहाय्य आणि आपत्कालीन संपर्क',
    sosModalSubtitle: 'आपल्या आवश्यकतेनुसार पर्याय निवडा. आपल्या पुष्टीकरणाशिवाय कोणताही कॉल केला जाणार नाही.',
    sosCallEmergency: 'आपत्कालीन सेवांना कॉल करा (112 / 108)',
    sosCallCaregiver: 'कुटुंबातील व्यक्तीस कॉल करा',
    sosFindHospitals: 'जवळचे रुग्णालय शोधा',
    sosCrisisLine: 'मानसिक आरोग्य हेल्पलाइन (14416 / 1800-599-0019)',
    sosDisclaimer: 'आपत्कालीन कॉलसाठी सक्रिय पुष्टीकरण आवश्यक आहे.',
    sosCancel: 'मागे जा',

    researchDisclaimer: 'संशोधन आणि पूर्वतपासणी व्यासपीठ: हे अंतिम वैद्यकीय निदान नाही. डॉक्टरांचा सल्ला घ्या.',
    nonDiagnosticNotice: 'हे केवळ प्राथमिक आरोग्य तपासणी साधन आहे.',

    greeting: 'आज आम्ही आपल्या आरोग्यासाठी कशी मदत करू शकतो?',
    greetingSubtitle: 'आरोग्य तपासणी, स्मृती काळजी, मानसिक आरोग्य मूल्यमापन आणि बहुभाषिक सहाय्यक.',
    quickCheckTitle: 'आरोग्य तपासणी',
    quickCheckDesc: 'स्तन, हृदय आणि मेंदू आरोग्याची हाइब्रिड क्वांटम तपासणी.',
    memoryCareTitle: 'स्मृती आणि संज्ञानात्मक काळजी',
    memoryCareDesc: 'दैनिक दिनचर्या, औषधांची वेळ आणि कौटुंबिक आठवणी.',
    mindMoodTitle: 'मानसिक आरोग्य आणि मनस्थिती',
    mindMoodDesc: 'गोपनीय PHQ-9, GAD-7 चाचणी आणि शांत करणारे श्वसन व्यायाम.',
    assistantCardTitle: 'AI आवाज सहाय्यक',
    assistantCardDesc: 'घाबरू नका - शांत करणारा श्वसन सराव आणि मार्गदर्शन.',

    stepSelectArea: '१. आरोग्य क्षेत्र निवडा',
    stepProvideDetails: '२. तपशील प्रविष्ट करा',
    stepReviewAnalyze: '३. क्वांटम विश्लेषण',
    breastHealth: 'स्तन आरोग्य',
    heartHealth: 'हृदय आरोग्य (Cardiovascular)',
    neuroVoiceHealth: 'मेंदू व आवाज बायोमार्कर्स',
    startAnalysis: 'विश्लेषण सुरू करा',
    loadDemoPatient: 'नमुना रुग्ण माहिती लोड करा',

    whatWeFound: 'तपासणीतील मुख्य निरीक्षणे',
    confidenceTitle: 'विश्वास पातळी आणि श्रेणी',
    keyContributingFactors: 'प्रमुख घटक',
    learnMoreDetails: 'सविस्तर तांत्रिक मॉडेल माहिती पहा',
    askAssistantAboutResults: 'निकाल सोप्या मराठीत समजावून सांगण्यास सांगा',
    nextStepsTitle: 'पुढील सुचवलेली पावले',

    todayOrientation: 'आजचा वार आणि वेळ',
    dailyRoutine: 'दैनंदिन दिनक्रम',
    medicationReminders: 'औषधांचे वेळापत्रक',
    familyMemoryRecall: 'कुटुंबातील व्यक्तींच्या आठवणी',
    imConfusedButton: 'मला गोंधळल्यासारखे वाटत आहे — मदत हवी',
    caregiverDashboard: 'काळजीवाहू पोर्टल',

    screenersTitle: 'मानसिक आरोग्य पूर्वतपासणी',
    phq9Title: 'PHQ-9 मनस्थिती मूल्यमापन',
    gad7Title: 'GAD-7 चिंता मूल्यमापन',
    groundingResources: 'शांतता आणि श्वास व्यायाम',
    startScreener: 'चाचणी सुरू करा',

    assistantTitle: 'Q-डायग्नोस आरोग्य साथी',
    assistantStatus: 'मराठीत मार्गदर्शन करण्यास सज्ज',
    assistantPromptPlaceholder: 'बोला किंवा लिहा: "मला मदत करा", "घाबरल्यासारखे वाटत आहे"...',
    calmGroundingButton: 'शांत श्वसन',
    voiceGuideButton: 'आवाज मार्गदर्शक',
  },
};
