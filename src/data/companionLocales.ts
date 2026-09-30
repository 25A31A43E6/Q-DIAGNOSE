import { CompanionLocale, CompanionLocaleOption, SupportedLanguage } from '../types';

export const COMPANION_LOCALES: CompanionLocaleOption[] = [
  {
    id: 'india_en',
    name: 'India (Indian English)',
    nativeName: 'Hinglish / Indian English',
    flag: '',
    registerDescription: 'Warm, everyday Indian conversational style, as a caring local health worker or trusted family elder would explain.',
    category: 'primary',
    defaultUiLang: 'en'
  },
  {
    id: 'american',
    name: 'American English',
    nativeName: 'US English',
    flag: '',
    registerDescription: 'Casual American English idiom, friendly conversational rhythm, and reassuring phrasing.',
    category: 'primary',
    defaultUiLang: 'en'
  },
  {
    id: 'british',
    name: 'British English',
    nativeName: 'UK English',
    flag: '',
    registerDescription: 'Polite British English idiom, spelling conventions (GP, chemist, A&E), and reassuring tone.',
    category: 'primary',
    defaultUiLang: 'en'
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '',
    registerDescription: 'Everyday conversational Hindi with natural warmth and simple, non-intimidating vocabulary.',
    category: 'regional',
    defaultUiLang: 'hi'
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '',
    registerDescription: 'Conversational everyday Tamil with respectful and comforting health guidance.',
    category: 'regional',
    defaultUiLang: 'ta'
  },
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '',
    registerDescription: 'Everyday spoken Telugu providing clear, supportive risk awareness and explanations.',
    category: 'regional',
    defaultUiLang: 'te'
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '',
    registerDescription: 'Warm and colloquial Bengali, breaking down screening concepts gently.',
    category: 'regional',
    defaultUiLang: 'bn'
  },
  {
    id: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '',
    registerDescription: 'Natural conversational Marathi, explaining screening metrics step-by-step.',
    category: 'regional',
    defaultUiLang: 'mr'
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '',
    registerDescription: 'Gentle everyday conversational Kannada explaining screening and physician consults.',
    category: 'regional',
    defaultUiLang: 'en'
  },
  {
    id: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '',
    registerDescription: 'Affectionate and clear spoken Punjabi, guiding users with reassurance.',
    category: 'regional',
    defaultUiLang: 'en'
  },
  {
    id: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '',
    registerDescription: 'Warm conversational Gujarati providing approachable guidance on health metrics.',
    category: 'regional',
    defaultUiLang: 'en'
  },
  {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '',
    registerDescription: 'Compassionate, conversational Malayalam for accessible health risk awareness.',
    category: 'regional',
    defaultUiLang: 'en'
  }
];

export const COMPANION_REGISTER_GREETINGS: Record<CompanionLocale, string> = {
  india_en: "Namaste! I am your Q-Diagnose health companion. Don't worry at all — I'm here to explain what your screening numbers mean in simple words, why they matter, and what questions to prepare for your doctor. How can I help you today?",
  american: "Hey there! I'm your Q-Diagnose health assistant. Take a deep breath — I'm here to break down what your screening numbers mean in plain English, why they matter, and what steps to take next with your doctor. What's on your mind today?",
  british: "Hello there. I am your Q-Diagnose health companion. Please do not worry — I am here to help explain your screening results in plain English, why they matter, and suggest questions to discuss with your GP. How can I assist you today?",
  hi: "नमस्ते! मैं आपका Q-Diagnose स्वास्थ्य साथी हूँ। बिल्कुल चिंता न करें — मैं आपकी जांच के परिणामों को सरल भाषा में समझाने, इसका क्या महत्व है और डॉक्टर से पूछने वाले सवाल तैयार करने के लिए यहाँ हूँ। आज मैं आपकी क्या मदद करूँ?",
  ta: "வணக்கம்! நான் உங்கள் Q-Diagnose நலன் துணைவன். எதற்கும் பயப்பட வேண்டாம் — உங்கள் பரிசோதனை முடிவுகள் என்ன சொல்கின்றன, அவை ஏன் முக்கியம் மற்றும் மருத்துவரிடம் கேட்க வேண்டிய கேள்விகளைத் தயார் செய்ய நான் உதவுகிறேன். என்ன தெரிந்து கொள்ள வேண்டும்?",
  te: "నమస్కారం! నేను మీ Q-Diagnose ఆరోగ్య సహాయకుడిని. ఏమాత్రం ఆందోళన చెందకండి — మీ స్క్రీనింగ్ ఫలితాలను తేలికైన మాటల్లో వివరించడానికి, దాని ప్రాముఖ్యత మరియు డాక్టర్‌తో మాట్లాడే ప్రశ్నలను సిద్ధం చేయడానికి నేను ఇక్కడ ఉన్నాను. నేను మీకు ఎలా సహాయపడాలి?",
  bn: "নমস্কার! আমি আপনার Q-Diagnose স্বাস্থ্য সহায়তাকারী। একদম চিন্তা করবেন না — আপনার স্ক্রীনিং ফলাফল সহজ ভাষায় বুঝিয়ে দিতে, এর গুরুত্ব বুঝতে এবং চিকিৎসকের সাথে আলোচনার প্রস্তুতিতে সাহায্য করতে আমি এখানে আছি। কীভাবে সাহায্য করতে পারি?",
  mr: "नमस्कार! मी आपला Q-Diagnose आरोग्य साथी आहे. काळजी करू नका — आपल्या तपासणीचे निकाल सोप्या भाषेत समजून सांगण्यासाठी, त्याचे महत्त्व जाणून घेण्यासाठी आणि डॉक्टरांशी चर्चेसाठी मी सदैव तयार आहे. आज मी आपल्याला काय मदत करू?",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ Q-Diagnose ಆರೋಗ್ಯ ಸಹಾಯಕ. ಚಿಂತೆ ಮಾಡಬೇಡಿ — ನಿಮ್ಮ ಆರೋಗ್ಯ ಸ್ಕ್ರೀನಿಂಗ್ ಫಲಿತಾಂಶಗಳು ಏನು ಸೂಚಿಸುತ್ತವೆ ಮತ್ತು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
  pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ ਤੁਹਾਡਾ Q-Diagnose ਸਿਹਤ ਸਾਥੀ ਹਾਂ। ਬਿਲਕੁਲ ਵੀ ਫ਼ਿਕਰ ਨਾ ਕਰੋ — ਮੈਂ ਤੁਹਾਡੇ ਸਕ੍ਰੀਨਿੰਗ ਨਤੀਜਿਆਂ ਦਾ ਮਤਲਬ ਸਮਝਾਉਣ, ਇਸਦਾ ਕੀ ਮਹੱਤਵ ਹੈ ਅਤੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰਨ ਵਿੱਚ ਮਦਦ ਲਈ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
  gu: "નમસ્તે! હું તમારો Q-Diagnose સ્વાસ્થ્ય સાથી છું. બિલકુલ ચિંતા ન કરો — હું તમારા સ્ક્રીનીંગ પરિણામોનો અર્થ સરળ ભાષામાં સમજાવવા, તેનું મહત્વ અને ડૉક્ટરની સલાહ માટે મદદ કરવા તૈયાર છું. હું તમારી શું સહાય કરું?",
  ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ Q-Diagnose ആരോഗ്യ സഹായിയാണ്. ആശങ്കപ്പെടേണ്ടതില്ല — നിങ്ങളുടെ സ്ക്രീനിംഗ് ഫലങ്ങൾ ലളിതമായി വിശദീകരിക്കാനും, അവയുടെ പ്രാധാന്യം മനസ്സിലാക്കാനും ഡോക്ടറോട് ചോദിക്കേണ്ട കാര്യങ്ങൾ തയ്യാറാക്കാനും ഞാൻ സഹായിക്കാം. എന്താണ് അറിയേണ്ടത്?"
};
