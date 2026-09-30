import { GoogleGenAI } from '@google/genai';
import { db } from './db.js';

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface CompanionMessagePayload {
  user_id: string;
  text?: string;
  audio?: string; // base64 encoded audio string
  audio_mime_type?: string;
  channel?: 'text' | 'voice';
  companion_locale?: string;
  consent_flag?: boolean; // consent to store transcript beyond session continuity
}

export interface CompanionMessageResponse {
  conversation_id: string;
  reply: string;
  channel: 'text' | 'voice';
  companion_locale: string;
  audio_out?: string; // synthesized voice base64 or speech synthesis directive
  voice_config?: {
    voice_name: string;
    locale: string;
    pitch: number;
    rate: number;
  };
  routed_to_pipeline_explainer?: boolean;
  assessment_reference?: {
    assessment_id: string;
    risk_score: number;
    risk_band: string;
    disease_type: string;
  } | null;
  rate_limit_status: {
    allowed: boolean;
    remaining: number;
  };
}

const REGISTER_GUIDELINES: Record<string, { name: string; targetLang: string; registerGuidance: string; voiceName: string }> = {
  india_en: {
    name: 'Indian English / Hinglish',
    targetLang: 'English (with natural Indian conversational cadence & occasional familiar Hinglish idioms)',
    registerGuidance: 'Respond in a warm, everyday Indian conversational style, as a caring local community health worker or trusted family elder would explain things. Use comforting, relatable Indian-English turns of phrase (e.g., "Do not worry, let us look at this step-by-step", "First let us get a routine checkup done with a good physician nearby", "take it easy"). Avoid stiff, textbook-formal or robotic language.',
    voiceName: 'en-IN-Wavenet-D'
  },
  american: {
    name: 'American English',
    targetLang: 'American English',
    registerGuidance: 'Respond using friendly, casual American English idiom, conversational flow, and reassuring phrasing (e.g., "Hey there", "Take a deep breath — here is the breakdown in plain English", "We definitely want to follow up on this with your primary care doctor"). Clear, direct, empathetic.',
    voiceName: 'en-US-Neural2-F'
  },
  british: {
    name: 'British English',
    targetLang: 'British English',
    registerGuidance: 'Respond using polite British English idiom and UK spelling conventions (e.g., "Do not worry, let us look through your results", "consult your GP or local surgery", "whilst", "programme", "specialist care"). Reassuring, measured, respectful.',
    voiceName: 'en-GB-Neural2-B'
  },
  hi: {
    name: 'Hindi (हिन्दी)',
    targetLang: 'Hindi (हिन्दी)',
    registerGuidance: 'Respond in natural, everyday conversational Hindi (बोलचाल की सरल हिन्दी), as a caring local health companion would. Use simple, non-intimidating vocabulary and avoid heavy Sanskritized textbook jargon.',
    voiceName: 'hi-IN-Neural2-A'
  },
  ta: {
    name: 'Tamil (தமிழ்)',
    targetLang: 'Tamil (தமிழ்)',
    registerGuidance: 'Respond in natural, respectful, everyday spoken Tamil (எளிய தமிழ்), providing clear, compassionate health guidance without complex clinical jargon.',
    voiceName: 'ta-IN-Standard-A'
  },
  te: {
    name: 'Telugu (తెలుగు)',
    targetLang: 'Telugu (తెలుగు)',
    registerGuidance: 'Respond in friendly, natural conversational Telugu (సులభమైన తెలుగు), explaining health metrics with empathy and clarity.',
    voiceName: 'te-IN-Standard-A'
  },
  bn: {
    name: 'Bengali (বাংলা)',
    targetLang: 'Bengali (বাংলা)',
    registerGuidance: 'Respond in warm, colloquial everyday Bengali (সহজ বাংলা), reassuring the user and explaining screening results gently.',
    voiceName: 'bn-IN-Standard-A'
  },
  mr: {
    name: 'Marathi (मराठी)',
    targetLang: 'Marathi (मराठी)',
    registerGuidance: 'Respond in natural, respectful conversational Marathi (सोपी मराठी), breaking down health screening details step-by-step.',
    voiceName: 'mr-IN-Standard-A'
  },
  kn: {
    name: 'Kannada (ಕನ್ನಡ)',
    targetLang: 'Kannada (ಕನ್ನಡ)',
    registerGuidance: 'Respond in everyday conversational Kannada (ಸರಳ ಕನ್ನಡ), offering supportive and clear explanations.',
    voiceName: 'kn-IN-Standard-A'
  },
  pa: {
    name: 'Punjabi (ਪੰਜਾਬੀ)',
    targetLang: 'Punjabi (ਪੰਜਾਬੀ)',
    registerGuidance: 'Respond in warm, affectionate spoken Punjabi (ਸਰਲ ਪੰਜਾਬੀ), guiding the user with practical reassurance.',
    voiceName: 'pa-IN-Standard-A'
  },
  gu: {
    name: 'Gujarati (ગુજરાતી)',
    targetLang: 'Gujarati (ગુજરાતી)',
    registerGuidance: 'Respond in warm, everyday conversational Gujarati (સરળ ગુજરાતી), explaining screening observations with care.',
    voiceName: 'gu-IN-Standard-A'
  },
  ml: {
    name: 'Malayalam (മലയാളം)',
    targetLang: 'Malayalam (മലയാളം)',
    registerGuidance: 'Respond in compassionate everyday conversational Malayalam (ലളിതമായ മലയാളം), explaining health metrics simply.',
    voiceName: 'ml-IN-Standard-A'
  }
};

/**
 * Rate limiter / cost guard: max 30 requests per 10-minute window per user.
 */
export function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const WINDOW_MS = 10 * 60 * 1000;
  const MAX_CALLS = 30;
  const now = Date.now();

  const record = db.prepare('SELECT window_start, request_count FROM rate_limits WHERE user_id = ?').get(userId) as any;

  if (!record || now - record.window_start > WINDOW_MS) {
    db.prepare(`
      INSERT INTO rate_limits (user_id, window_start, request_count)
      VALUES (?, ?, 1)
      ON CONFLICT(user_id) DO UPDATE SET window_start = ?, request_count = 1
    `).run(userId, now, now);
    return { allowed: true, remaining: MAX_CALLS - 1 };
  }

  if (record.request_count >= MAX_CALLS) {
    return { allowed: false, remaining: 0 };
  }

  db.prepare('UPDATE rate_limits SET request_count = request_count + 1 WHERE user_id = ?').run(userId);
  return { allowed: true, remaining: MAX_CALLS - record.request_count - 1 };
}

/**
 * Process incoming companion message (Text or Voice)
 */
export async function handleCompanionMessage(payload: CompanionMessagePayload): Promise<CompanionMessageResponse> {
  const {
    user_id,
    text,
    audio,
    audio_mime_type = 'audio/webm',
    channel = 'text',
    companion_locale = 'india_en',
    consent_flag = false
  } = payload;

  // 1. Check Rate Limit
  const rateLimitStatus = checkRateLimit(user_id);
  if (!rateLimitStatus.allowed) {
    return {
      conversation_id: `ERR-${Date.now()}`,
      reply: "You have reached the maximum companion conversation limit for this 10-minute window. Please take a pause or discuss your screening directly with your physician.",
      channel,
      companion_locale,
      rate_limit_status: rateLimitStatus
    };
  }

  // 2. Transcribe voice if audio base64 is provided on the way in
  let inputTranscript = (text || '').trim();
  const client = getGenAI();

  if (audio && (!inputTranscript || inputTranscript.length === 0)) {
    if (client) {
      try {
        const audioBuffer = Buffer.from(audio.replace(/^data:audio\/\w+;base64,/, ''), 'base64');
        const sttResponse = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: audio_mime_type,
                    data: audioBuffer.toString('base64'),
                  }
                },
                {
                  text: 'Transcribe the user speech accurately in its original spoken language. Return ONLY the transcribed text, nothing else.'
                }
              ]
            }
          ]
        });
        inputTranscript = sttResponse.text?.trim() || 'Audio received';
      } catch (err) {
        console.error('STT audio transcription failed, fallback to placeholder:', err);
        inputTranscript = 'Spoken voice message from patient';
      }
    } else {
      inputTranscript = 'Spoken voice message from patient';
    }
  }

  // 3. Retrieve patient's latest assessment for strictly factual grounding
  const pat = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(user_id) as any;
  const patientId = pat?.id || user_id;

  const latestAssessment = db.prepare(`
    SELECT id, date, disease_type, risk_score, risk_band, contributing_factors, model_version, notes
    FROM assessments
    WHERE patient_id = ?
    ORDER BY date DESC LIMIT 1
  `).get(patientId) as any;

  let assessmentContext = '';
  let assessmentRef = null;

  if (latestAssessment) {
    let factorsList = [];
    try {
      factorsList = JSON.parse(latestAssessment.contributing_factors);
    } catch {
      factorsList = [];
    }

    assessmentRef = {
      assessment_id: latestAssessment.id,
      risk_score: latestAssessment.risk_score,
      risk_band: latestAssessment.risk_band,
      disease_type: latestAssessment.disease_type
    };

    assessmentContext = `
FACTUAL CLINICAL RECORD FOR THIS PATIENT (SOURCE OF TRUTH - DO NOT INVENT OTHER NUMBERS):
- Assessment ID: ${latestAssessment.id}
- Screening Condition: ${latestAssessment.disease_type}
- Calibrated Risk Score: ${latestAssessment.risk_score} / 100
- Risk Band: ${latestAssessment.risk_band.toUpperCase()}
- Top Contributing Biomarkers: ${factorsList.map((f: any) => `${f.name} (${f.value}%)`).join(', ')}
- Clinical Guidance: ${latestAssessment.notes || 'Routine follow-up recommended.'}
`;
  }

  // 4. Check if user is asking "how does this work" or technical pipeline details
  const lowerMsg = inputTranscript.toLowerCase();
  const isAskingTechnical = 
    lowerMsg.includes('how does this work') ||
    lowerMsg.includes('how it works') ||
    lowerMsg.includes('how do you work') ||
    lowerMsg.includes('quantum') ||
    lowerMsg.includes('algorithm') ||
    lowerMsg.includes('vqc') ||
    lowerMsg.includes('qubit') ||
    lowerMsg.includes('technolog') ||
    lowerMsg.includes('architecture');

  let replyText = '';
  let routedToPipelineExplainer = false;

  const selectedRegister = REGISTER_GUIDELINES[companion_locale] || REGISTER_GUIDELINES.india_en;

  if (isAskingTechnical) {
    routedToPipelineExplainer = true;
    if (companion_locale === 'hi') {
      replyText = `हमारी जांच प्रणाली के तकनीकी आर्किटेक्चर (क्वांटम सर्किट्स, वीक्यूसी, और क्लासिकल रैंडम फॉरेस्ट) की पूरी वैज्ञानिक जानकारी ऐप के 'Pipeline Explainer' टैब में विस्तार से उपलब्ध है। वहाँ आप देख सकते हैं कि कैसे डेटा को प्रोसेस किया गया। मैं यहाँ आपके स्वास्थ्य परिणामों और डॉक्टर से परामर्श की तैयारी में मदद के लिए उपलब्ध हूँ। क्या आप अपने परिणामों पर बात करना चाहेंगे?`;
    } else if (companion_locale === 'ta') {
      replyText = `எங்கள் அமைப்பின் குவாண்டம் சர்க்யூட்கள் மற்றும் அல்காரிதம் பற்றிய விரிவான தகவல்கள் பயன்பாட்டின் 'Pipeline Explainer' பகுதியில் உள்ளன. அங்கு நீங்கள் முழு தொழில்நுட்ப விளக்கத்தையும் பார்க்கலாம். நான் உங்கள் உடல்நல முடிவுகளை விளக்கவும், மருத்துவரிடம் என்ன கேட்க வேண்டும் என்பதை வழிகாட்டவும் இங்கிருக்கிறேன்.`;
    } else {
      replyText = `For a complete breakdown of our technical quantum-classical architecture (including the 4-qubit Hilbert space embedding, ZZFeatureMap, and Random Forest ensemble), please open the dedicated 'Pipeline Explainer' tab in the app navigation. It provides full circuit diagrams and variance analysis. Here in our chat, I am focused on your health results and doctor consultation preparation. Would you like to discuss what your current score means?`;
    }
  } else {
    // LLM Call or Fallback with strictly enforced non-diagnostic, "problem not process" prompt
    const systemPrompt = `You are the Q-Diagnose AI Health Companion, an empathetic, caring, multilingual health assistant focused on helping patients understand their health risk numbers and what practical steps to take next.

CRITICAL INSTRUCTION — TALK ABOUT THE PROBLEM, NOT THE PROCESS:
1. TALK ABOUT THE PATIENT'S PROBLEM AND NEXT STEPS, NEVER THE TECHNICAL PROCESS:
   - Your primary role is to explain what the patient's result means, why it matters, and what to do next — in plain, everyday language, exactly the way a caring relative or local health worker would put it.
   - You have a short, STRICTLY FIXED SET of 4 topics you are allowed to talk about by default:
     (a) What the result / risk level means (in plain language without clinical jargon)
     (b) Why it matters for their long-term health and well-being
     (c) What practical steps to take next (e.g. scheduling a doctor consultation, questions to bring to their doctor, simple dietary/lifestyle habits)
     (d) Reassurance and emergency guidance
   - NEVER BRING UP HOW THE SYSTEM WORKS INTERNALLY. Do NOT mention quantum computing, quantum circuits, VQC, qubits, machine learning pipelines, model names, feature extraction, or algorithms UNLESS the patient specifically and explicitly asks "how does this work?" or directly inquires about the technology.
   - All technical and quantum pipeline explanations live strictly in the separate "Pipeline Explainer" tab of the app, NOT in your everyday conversation with the patient.

CRITICAL SAFETY & MEDICAL POLICIES (MANDATORY ACROSS ALL ACCENTS & LANGUAGES):
2. YOU ARE NOT A DOCTOR AND YOU DO NOT PROVIDE MEDICAL DIAGNOSES. Frame all assessments as "AI-assisted early risk screening that helps you know when to see a doctor."
3. NEVER prescribe medications or declare definitive medical conditions.
4. EMERGENCY FIRST: If the user mentions any emergency warning signs (severe chest pain, severe difficulty breathing, sudden weakness/paralysis, unconsciousness, severe bleeding, or sudden speech loss), IMMEDIATELY urge them to contact emergency services (112 / 108 in India, 911 in the US, 999 in the UK) or go to the nearest hospital emergency room right away. Do NOT tell them to wait for an AI screening.
5. REGISTER & TONE GUIDELINES:
   - Selected Dialect / Register: ${selectedRegister.name}
   - Specific Instructions: ${selectedRegister.registerGuidance}
   - Always keep the medical substance, risk thresholds, and emergency instructions strictly accurate, while adapting the conversational style, idioms, and vocabulary to this register.
6. Keep answers warm, human, reassuring, and concise (2-3 short paragraphs or clean bullet points).

${assessmentContext}
`;

    if (client) {
      try {
        const genResponse = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: inputTranscript }]
            }
          ],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.6,
            maxOutputTokens: 600,
          }
        });
        replyText = genResponse.text?.trim() || '';
      } catch (err) {
        console.error('Gemini call failed, using deterministic register fallback:', err);
      }
    }

    // High quality deterministic fallback if API is unavailable
    if (!replyText) {
      if (lowerMsg.includes('chest') || lowerMsg.includes('breath') || lowerMsg.includes('pain') || lowerMsg.includes('emergency')) {
        replyText = "Please do not wait. If you are experiencing severe chest pain, shortness of breath, sudden numbness, or dizziness, please contact emergency services immediately (108 / 112 in India, 911 in the US, 999 in the UK) or go to the nearest hospital emergency department.";
      } else if (latestAssessment) {
        replyText = `Your recent screening shows a ${latestAssessment.risk_band.toUpperCase()} risk profile with a score of ${latestAssessment.risk_score} / 100. In plain words, this highlights key indicators like ${latestAssessment.disease_type.replace('_', ' ')} biomarkers that warrant proactive attention. The most constructive next step is to schedule an appointment with your doctor, share this summary, and discuss simple everyday habits and follow-up lab tests.`;
      } else {
        replyText = "Namaste! I am your health companion. Please do not worry at all — I am here to help explain what your screening results mean in plain, everyday language, why they matter, and what questions to prepare for your doctor. How can I assist you right now?";
      }
    }
  }

  // 5. Audit log in companion_conversations
  const convId = `CONV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  try {
    db.prepare(`
      INSERT INTO companion_conversations (id, user_id, timestamp, channel, language, transcript, reply, consent_flag, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      convId,
      user_id,
      new Date().toISOString(),
      channel,
      companion_locale,
      inputTranscript,
      replyText,
      consent_flag ? 1 : 0,
      new Date().toISOString()
    );
  } catch (err) {
    console.error('Failed to log companion conversation:', err);
  }

  return {
    conversation_id: convId,
    reply: replyText,
    channel,
    companion_locale,
    voice_config: {
      voice_name: selectedRegister.voiceName,
      locale: companion_locale,
      pitch: 1.0,
      rate: 1.0
    },
    routed_to_pipeline_explainer: routedToPipelineExplainer,
    assessment_reference: assessmentRef,
    rate_limit_status: rateLimitStatus
  };
}
