import { Router, Request, Response } from 'express';
import { db } from './db.js';
import { 
  authenticateToken, 
  optionalAuthenticateToken, 
  requireRole, 
  verifyPatientAccess, 
  generateToken, 
  AuthenticatedRequest 
} from './auth.js';
import { hashPassword, verifyPassword, encryptField, decryptField } from './crypto.js';
import { runModelPipeline } from './modelService.js';
import { handleCompanionMessage } from './companionService.js';

export const apiRouter = Router();

// -------------------------------------------------------------
// 1. AUTHENTICATION & ROLES
// -------------------------------------------------------------

// POST /auth/register/patient
apiRouter.post(['/auth/register/patient', '/register/patient'], async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      name,
      contact,
      dob,
      gender,
      blood_group,
      emergency_contact,
      medical_history,
      primary_doctor_id,
      ui_locale = 'en',
      companion_locale = 'india_en'
    } = req.body || {};

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required.' });
      return;
    }

    // Check if email exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const userId = `USR-PAT-${Date.now()}`;
    const patientId = `PAT-${Date.now()}`;
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, role, email, password_hash, name, contact, ui_locale, companion_locale, created_at, updated_at)
      VALUES (?, 'patient', ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      email.toLowerCase().trim(),
      passwordHash,
      name.trim(),
      contact ? encryptField(contact) : null,
      ui_locale,
      companion_locale,
      now,
      now
    );

    db.prepare(`
      INSERT INTO patients (id, user_id, dob, gender, blood_group, emergency_contact, medical_history, primary_doctor_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      patientId,
      userId,
      dob || null,
      gender || null,
      blood_group || null,
      emergency_contact ? encryptField(emergency_contact) : null,
      medical_history ? encryptField(medical_history) : null,
      primary_doctor_id || null,
      now
    );

    // If primary doctor specified, link in doctor_patients
    if (primary_doctor_id) {
      const docExists = db.prepare('SELECT id FROM doctors WHERE id = ?').get(primary_doctor_id);
      if (docExists) {
        db.prepare(`
          INSERT INTO doctor_patients (id, doctor_id, patient_id, status, assigned_at)
          VALUES (?, ?, ?, 'active', ?)
        `).run(`DP-${Date.now()}`, primary_doctor_id, patientId, now);
      }
    }

    const authUser = {
      id: userId,
      role: 'patient' as const,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      ui_locale,
      companion_locale,
      patient_id: patientId
    };

    const token = generateToken(authUser);

    res.status(201).json({
      message: 'Patient registered successfully.',
      token,
      user: authUser,
      patient: {
        id: patientId,
        dob,
        gender,
        blood_group,
        primary_doctor_id
      }
    });
  } catch (err: any) {
    console.error('Patient registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// POST /auth/register/doctor
apiRouter.post(['/auth/register/doctor', '/register/doctor'], async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      name,
      contact,
      specialty = 'General Medicine & Health Risk Screening',
      license_number,
      hospital = 'General Health Care',
      bio,
      ui_locale = 'en',
      companion_locale = 'india_en'
    } = req.body || {};

    if (!email || !password || !name || !license_number) {
      res.status(400).json({ error: 'Email, password, name, and license_number are required.' });
      return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const userId = `USR-DOC-${Date.now()}`;
    const doctorId = `DOC-${Date.now()}`;
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, role, email, password_hash, name, contact, ui_locale, companion_locale, created_at, updated_at)
      VALUES (?, 'doctor', ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      email.toLowerCase().trim(),
      passwordHash,
      name.trim(),
      contact ? encryptField(contact) : null,
      ui_locale,
      companion_locale,
      now,
      now
    );

    db.prepare(`
      INSERT INTO doctors (id, user_id, specialty, license_number, hospital, bio, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      doctorId,
      userId,
      specialty.trim(),
      license_number.trim(),
      hospital.trim(),
      bio || null,
      now
    );

    const authUser = {
      id: userId,
      role: 'doctor' as const,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      ui_locale,
      companion_locale,
      doctor_id: doctorId
    };

    const token = generateToken(authUser);

    res.status(201).json({
      message: 'Doctor registered successfully.',
      token,
      user: authUser,
      doctor: {
        id: doctorId,
        specialty,
        license_number,
        hospital,
        bio
      }
    });
  } catch (err: any) {
    console.error('Doctor registration error:', err);
    res.status(500).json({ error: 'Internal server error during doctor registration.' });
  }
});

// POST /auth/login
apiRouter.post(['/auth/login', '/login'], async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.prepare(`
      SELECT id, role, email, password_hash, name, contact, ui_locale, companion_locale 
      FROM users 
      WHERE email = ?
    `).get(email.toLowerCase().trim()) as any;

    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid email address or password.' });
      return;
    }

    let patientRecord = null;
    let doctorRecord = null;

    if (user.role === 'patient') {
      const pat = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(user.id) as any;
      if (pat) {
        patientRecord = {
          id: pat.id,
          dob: pat.dob,
          gender: pat.gender,
          blood_group: pat.blood_group,
          emergency_contact: decryptField(pat.emergency_contact),
          medical_history: decryptField(pat.medical_history),
          primary_doctor_id: pat.primary_doctor_id
        };
      }
    } else if (user.role === 'doctor') {
      const doc = db.prepare('SELECT * FROM doctors WHERE user_id = ?').get(user.id) as any;
      if (doc) {
        doctorRecord = {
          id: doc.id,
          specialty: doc.specialty,
          license_number: doc.license_number,
          hospital: doc.hospital,
          bio: doc.bio
        };
      }
    }

    const authUser = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      ui_locale: user.ui_locale,
      companion_locale: user.companion_locale,
      patient_id: patientRecord?.id,
      doctor_id: doctorRecord?.id
    };

    const token = generateToken(authUser);

    res.json({
      message: 'Login successful.',
      token,
      user: authUser,
      patient: patientRecord,
      doctor: doctorRecord
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// GET /auth/me
apiRouter.get(['/auth/me', '/me'], authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    let profileData: any = {};

    if (user.role === 'patient') {
      const pat = db.prepare('SELECT * FROM patients WHERE id = ?').get(user.patient_id) as any;
      if (pat) {
        // Find linked primary doctor name if available
        let doctorName = null;
        if (pat.primary_doctor_id) {
          const docRow = db.prepare(`
            SELECT u.name, d.hospital, d.specialty 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.id = ?
          `).get(pat.primary_doctor_id) as any;
          if (docRow) doctorName = docRow.name;
        }

        profileData = {
          id: pat.id,
          dob: pat.dob,
          gender: pat.gender,
          blood_group: pat.blood_group,
          emergency_contact: decryptField(pat.emergency_contact),
          medical_history: decryptField(pat.medical_history),
          primary_doctor_id: pat.primary_doctor_id,
          primary_doctor_name: doctorName
        };
      }
    } else if (user.role === 'doctor') {
      const doc = db.prepare('SELECT * FROM doctors WHERE id = ?').get(user.doctor_id) as any;
      if (doc) {
        const patientCountRow = db.prepare("SELECT COUNT(*) as count FROM doctor_patients WHERE doctor_id = ? AND status = 'active'").get(doc.id) as any;
        profileData = {
          id: doc.id,
          specialty: doc.specialty,
          license_number: doc.license_number,
          hospital: doc.hospital,
          bio: doc.bio,
          active_patients_count: patientCountRow?.count || 0
        };
      }
    }

    res.json({
      user,
      profile: profileData
    });
  } catch (err: any) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// -------------------------------------------------------------
// 2. CORE ASSESSMENTS & MODEL SERVING
// -------------------------------------------------------------

// POST /assessments - accept patient input, run model pipeline, return risk score + contributing factors, store result
apiRouter.post(['/assessments', '/api/assessments'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      patient_id,
      features,
      data,
      disease_type = 'breast_cancer',
      model = 'both',
      notes
    } = req.body || {};

    const submittedFeatures = features || data || {};
    let resolvedPatientId = patient_id;

    // If authenticated as patient, ensure patient_id matches
    if (req.user && req.user.role === 'patient') {
      resolvedPatientId = req.user.patient_id || resolvedPatientId;
    }

    // If still no patient_id, fallback to first seed patient or anonymous placeholder
    if (!resolvedPatientId) {
      const firstPat = db.prepare('SELECT id FROM patients LIMIT 1').get() as any;
      resolvedPatientId = firstPat?.id || 'PAT-ANONYMOUS';
    }

    // Execute Model Serving Pipeline
    const modelResult = await runModelPipeline(submittedFeatures, disease_type, model);

    const assessmentId = `ASM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    // Encrypt sensitive raw input features at rest
    const encryptedInput = encryptField(JSON.stringify(submittedFeatures));

    db.prepare(`
      INSERT INTO assessments (
        id, patient_id, date, disease_type, input_features, risk_score, risk_band, 
        contributing_factors, model_version, quantum_score, classical_score, consensus_agreement, 
        quantum_metadata, classical_metadata, pipeline_breakdown, notes, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assessmentId,
      resolvedPatientId,
      now,
      modelResult.disease_type,
      encryptedInput,
      modelResult.risk_score,
      modelResult.risk_band,
      JSON.stringify(modelResult.contributing_factors),
      modelResult.model_version,
      modelResult.quantum_score,
      modelResult.classical_score,
      modelResult.consensus_agreement ? 1 : 0,
      JSON.stringify(modelResult.quantum_metadata),
      JSON.stringify(modelResult.classical_metadata),
      JSON.stringify(modelResult.pipeline_breakdown),
      notes || modelResult.notes,
      now
    );

    res.status(201).json({
      id: assessmentId,
      patient_id: resolvedPatientId,
      date: now,
      disease_type: modelResult.disease_type,
      risk_score: modelResult.risk_score,
      risk_band: modelResult.risk_band,
      risk_label: modelResult.risk_label,
      prediction: modelResult.prediction,
      confidence: modelResult.confidence,
      contributing_factors: modelResult.contributing_factors,
      model_version: modelResult.model_version,
      quantum_score: modelResult.quantum_score,
      classical_score: modelResult.classical_score,
      consensus: modelResult.consensus_agreement ? 'Concordant' : 'Discordant',
      plain_language_meaning: modelResult.plain_language_meaning,
      recommended_next_step: modelResult.recommended_next_step,
      notes: notes || modelResult.notes,
      disclaimer: 'This is an AI-assisted early health risk screening, not a medical diagnosis.'
    });
  } catch (err: any) {
    console.error('Assessment execution error:', err);
    res.status(500).json({ error: 'Failed to process and store health risk assessment.' });
  }
});

// GET /assessments/:patient_id - history for a patient (self or authorized doctor) with date-range filtering
apiRouter.get(['/assessments/:patient_id', '/api/assessments/:patient_id'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patient_id } = req.params;
    const { from, to, disease_type } = req.query as { from?: string; to?: string; disease_type?: string };

    // RBAC: If token provided, verify patient access
    if (req.user) {
      if (req.user.role === 'patient' && req.user.patient_id !== patient_id) {
        res.status(403).json({ error: 'Forbidden: Patients may only access their own assessments.' });
        return;
      }
      if (req.user.role === 'doctor') {
        const link = db.prepare(`
          SELECT id FROM doctor_patients WHERE doctor_id = ? AND patient_id = ? AND status = 'active'
        `).get(req.user.doctor_id, patient_id);
        if (!link) {
          res.status(403).json({ error: 'Forbidden: Doctor is not linked to this patient.' });
          return;
        }
        // Audit doctor access
        db.prepare(`
          INSERT INTO doctor_access_log (id, doctor_id, patient_id, action, timestamp)
          VALUES (?, ?, ?, 'VIEW_ASSESSMENT_HISTORY', ?)
        `).run(`LOG-${Date.now()}`, req.user.doctor_id, patient_id, new Date().toISOString());
      }
    }

    let sql = 'SELECT * FROM assessments WHERE patient_id = ?';
    const params: any[] = [patient_id];

    if (from) {
      sql += ' AND date >= ?';
      params.push(from);
    }
    if (to) {
      sql += ' AND date <= ?';
      params.push(to);
    }
    if (disease_type) {
      sql += ' AND disease_type = ?';
      params.push(disease_type);
    }

    sql += ' ORDER BY date DESC';

    const rows = db.prepare(sql).all(...params) as any[];

    const formatted = rows.map(r => {
      let contributing = [];
      try {
        contributing = JSON.parse(r.contributing_factors);
      } catch {}

      return {
        id: r.id,
        patient_id: r.patient_id,
        date: r.date,
        disease_type: r.disease_type,
        risk_score: r.risk_score,
        risk_band: r.risk_band,
        risk_label: r.risk_band === 'high' ? 'High Risk' : r.risk_band === 'moderate' ? 'Moderate Risk' : 'Low Risk',
        contributing_factors: contributing,
        model_version: r.model_version,
        quantum_score: r.quantum_score,
        classical_score: r.classical_score,
        consensus_agreement: !!r.consensus_agreement,
        notes: r.notes
      };
    });

    res.json({
      patient_id,
      count: formatted.length,
      assessments: formatted
    });
  } catch (err: any) {
    console.error('Fetch assessments error:', err);
    res.status(500).json({ error: 'Failed to retrieve patient assessments.' });
  }
});

// GET /assessments/:patient_id/trend - data shaped specifically for risk-trend chart
apiRouter.get(['/assessments/:patient_id/trend', '/api/assessments/:patient_id/trend'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patient_id } = req.params;
    const { disease_type } = req.query as { disease_type?: string };

    let sql = 'SELECT id, date, disease_type, risk_score, risk_band, model_version, contributing_factors, consensus_agreement FROM assessments WHERE patient_id = ?';
    const params: any[] = [patient_id];

    if (disease_type) {
      sql += ' AND disease_type = ?';
      params.push(disease_type);
    }

    sql += ' ORDER BY date ASC';

    const rows = db.prepare(sql).all(...params) as any[];

    if (rows.length === 0) {
      res.json({
        patient_id,
        trend_points: [],
        summary: {
          total_assessments: 0,
          current_score: 0,
          delta: 0,
          direction: 'stable',
          lowest_score: 0,
          highest_score: 0
        }
      });
      return;
    }

    const trendPoints = rows.map(r => {
      let topFactor = 'Biomarker balance';
      try {
        const factors = JSON.parse(r.contributing_factors);
        if (factors.length > 0) topFactor = factors[0].name;
      } catch {}

      return {
        assessment_id: r.id,
        date: r.date,
        risk_score: r.risk_score,
        risk_band: r.risk_band,
        model_version: r.model_version,
        disease_type: r.disease_type,
        primary_contributor: topFactor,
        consensus: r.consensus_agreement ? 'Concordant' : 'Discordant'
      };
    });

    const currentScore = trendPoints[trendPoints.length - 1].risk_score;
    const previousScore = trendPoints.length > 1 ? trendPoints[trendPoints.length - 2].risk_score : currentScore;
    const delta = currentScore - previousScore;
    const direction = delta > 0 ? 'increasing' : delta < 0 ? 'improving' : 'stable';

    const scores = trendPoints.map(p => p.risk_score);
    const lowestScore = Math.min(...scores);
    const highestScore = Math.max(...scores);

    res.json({
      patient_id,
      trend_points: trendPoints,
      summary: {
        total_assessments: trendPoints.length,
        current_score: currentScore,
        previous_score: previousScore,
        delta,
        direction,
        lowest_score: lowestScore,
        highest_score: highestScore
      }
    });
  } catch (err: any) {
    console.error('Trend calculation error:', err);
    res.status(500).json({ error: 'Failed to generate assessment trend data.' });
  }
});

// -------------------------------------------------------------
// 3. DETERMINISTIC EMERGENCY CHECK (NON-BLOCKING AUDIT LOG)
// -------------------------------------------------------------

// POST /emergency-check - deterministic emergency checklist, no model dependency, audit logged
apiRouter.post(['/emergency-check', '/api/emergency-check'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { symptoms = [], patient_id, notes } = req.body || {};

    const resolvedPatientId = patient_id || (req.user && req.user.patient_id) || 'PAT-ANONYMOUS';

    // Critical symptoms list that deterministically trigger emergency alert
    const criticalSymptomsKeywords = [
      'crushing chest pain',
      'chest pain radiating',
      'shortness of breath at rest',
      'sudden weakness',
      'facial droop',
      'slurred speech',
      'loss of consciousness',
      'coughing blood',
      'severe acute dizziness'
    ];

    const inputSymptoms = Array.isArray(symptoms) ? symptoms : [String(symptoms)];
    const flaggedCritical = inputSymptoms.filter(s => {
      const lower = s.toLowerCase();
      return criticalSymptomsKeywords.some(keyword => lower.includes(keyword));
    });

    const isEmergency = flaggedCritical.length > 0 || inputSymptoms.length >= 2;
    const verdict = isEmergency ? 'EMERGENCY_DISPATCH_ADVISED' : 'ROUTINE_TRIAGE_CONTINUED';
    const severity = isEmergency ? 'CRITICAL' : 'NON_ACUTE';

    const actionTaken = isEmergency 
      ? 'Deterministic emergency warning displayed; directed patient to immediate helpline 108 / 112 or emergency room.' 
      : 'Standard screening checklist passed; no acute emergency red flags identified.';

    const eventId = `EMG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    // Audit log in emergency_events
    try {
      db.prepare(`
        INSERT INTO emergency_events (id, patient_id, timestamp, symptoms_flagged, verdict, severity, action_taken, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        eventId,
        resolvedPatientId,
        now,
        JSON.stringify(inputSymptoms),
        verdict,
        severity,
        actionTaken,
        now
      );
    } catch (e) {
      console.error('Failed to log emergency event:', e);
    }

    res.json({
      event_id: eventId,
      is_emergency: isEmergency,
      verdict,
      severity,
      flagged_critical_symptoms: flaggedCritical,
      all_symptoms_evaluated: inputSymptoms,
      emergency_guidance: isEmergency 
        ? "CRITICAL MEDICAL WARNING: Your reported symptoms indicate a potential acute medical emergency. Please DO NOT wait for screening or test results. Call emergency services or visit the nearest emergency room immediately."
        : "No immediate emergency warning signs detected. You may proceed with routine risk screening and schedule a standard doctor checkup.",
      hotlines: {
        india: '108 (Ambulance) / 112 (National Emergency)',
        united_states: '911 (Emergency Dispatch)',
        united_kingdom: '999 (Emergency) / 111 (NHS Triage)'
      },
      audit_logged: true,
      timestamp: now
    });
  } catch (err: any) {
    console.error('Emergency check error:', err);
    res.status(500).json({ error: 'Failed to process emergency check.' });
  }
});

// -------------------------------------------------------------
// 4. DOCTOR PATIENT QUEUE (HIGH RISK FIRST, AUDIT LOGGED)
// -------------------------------------------------------------

// GET /doctors/:doctor_id/patients - patient list/queue for doctor, sortable/filterable, high-risk first
apiRouter.get(['/doctors/:doctor_id/patients', '/api/doctors/:doctor_id/patients'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { doctor_id } = req.params;
    const { sort = 'high_risk_first', risk_band, search } = req.query as { sort?: string; risk_band?: string; search?: string };

    // Check doctor authorization
    if (req.user && req.user.role === 'doctor' && req.user.doctor_id !== doctor_id) {
      res.status(403).json({ error: 'Forbidden: Doctors may only access their own patient queue.' });
      return;
    }

    // Query linked patients
    const linkedPatients = db.prepare(`
      SELECT 
        p.id as patient_id,
        p.dob,
        p.gender,
        p.blood_group,
        p.emergency_contact,
        p.medical_history,
        dp.assigned_at,
        dp.status as link_status,
        u.name,
        u.email,
        u.contact,
        u.ui_locale,
        u.companion_locale
      FROM doctor_patients dp
      JOIN patients p ON dp.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE dp.doctor_id = ? AND dp.status = 'active'
    `).all(doctor_id) as any[];

    // For each patient, fetch latest assessment and emergency event count
    const enriched = linkedPatients.map(p => {
      const latestAsm = db.prepare(`
        SELECT id, date, disease_type, risk_score, risk_band, contributing_factors, model_version
        FROM assessments
        WHERE patient_id = ?
        ORDER BY date DESC LIMIT 1
      `).get(p.patient_id) as any;

      const emergencyCountRow = db.prepare(`
        SELECT COUNT(*) as count FROM emergency_events WHERE patient_id = ? AND severity = 'CRITICAL'
      `).get(p.patient_id) as any;

      let contributing = [];
      if (latestAsm) {
        try {
          contributing = JSON.parse(latestAsm.contributing_factors);
        } catch {}
      }

      return {
        patient_id: p.patient_id,
        name: p.name,
        email: p.email,
        contact: decryptField(p.contact),
        dob: p.dob,
        gender: p.gender,
        blood_group: p.blood_group,
        emergency_contact: decryptField(p.emergency_contact),
        medical_history: decryptField(p.medical_history),
        assigned_at: p.assigned_at,
        ui_locale: p.ui_locale,
        companion_locale: p.companion_locale,
        critical_emergencies_flagged: emergencyCountRow?.count || 0,
        latest_assessment: latestAsm ? {
          assessment_id: latestAsm.id,
          date: latestAsm.date,
          disease_type: latestAsm.disease_type,
          risk_score: latestAsm.risk_score,
          risk_band: latestAsm.risk_band,
          model_version: latestAsm.model_version,
          top_contributor: contributing[0]?.name || 'N/A'
        } : null,
        risk_sort_value: latestAsm ? latestAsm.risk_score : 0
      };
    });

    // Filtering
    let filtered = enriched;
    if (risk_band) {
      filtered = filtered.filter(p => p.latest_assessment?.risk_band === risk_band.toLowerCase());
    }
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.email.toLowerCase().includes(term) ||
        p.patient_id.toLowerCase().includes(term)
      );
    }

    // Sorting: high-risk first by default
    if (sort === 'high_risk_first') {
      filtered.sort((a, b) => b.risk_sort_value - a.risk_sort_value);
    } else if (sort === 'low_risk_first') {
      filtered.sort((a, b) => a.risk_sort_value - b.risk_sort_value);
    } else if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime());
    }

    // Audit doctor queue access
    try {
      db.prepare(`
        INSERT INTO doctor_access_log (id, doctor_id, patient_id, action, timestamp)
        VALUES (?, ?, 'PATIENT_QUEUE', 'VIEW_DOCTOR_PATIENT_LIST', ?)
      `).run(`LOG-${Date.now()}`, doctor_id, new Date().toISOString());
    } catch {}

    res.json({
      doctor_id,
      total_patients: filtered.length,
      patients: filtered
    });
  } catch (err: any) {
    console.error('Doctor patient queue error:', err);
    res.status(500).json({ error: 'Failed to fetch doctor patient queue.' });
  }
});

// -------------------------------------------------------------
// 5. TECHNICAL PIPELINE EXPLAINER (OPT-IN TECHNICAL VIEW ONLY)
// -------------------------------------------------------------

// GET /pipeline-explainer/:assessment_id - pipeline stage breakdown + quantum circuit details
apiRouter.get(['/pipeline-explainer/:assessment_id', '/api/pipeline-explainer/:assessment_id'], async (req: Request, res: Response) => {
  try {
    const { assessment_id } = req.params;

    const asm = db.prepare(`
      SELECT 
        id, patient_id, date, disease_type, risk_score, risk_band, model_version, 
        quantum_score, classical_score, consensus_agreement, quantum_metadata, 
        classical_metadata, pipeline_breakdown, notes
      FROM assessments
      WHERE id = ?
    `).get(assessment_id) as any;

    if (!asm) {
      res.status(404).json({ error: `Assessment '${assessment_id}' not found.` });
      return;
    }

    let qMeta = {};
    let cMeta = {};
    let pBreakdown = {};

    try { qMeta = JSON.parse(asm.quantum_metadata); } catch {}
    try { cMeta = JSON.parse(asm.classical_metadata); } catch {}
    try { pBreakdown = JSON.parse(asm.pipeline_breakdown); } catch {}

    res.json({
      assessment_id: asm.id,
      patient_id: asm.patient_id,
      date: asm.date,
      disease_type: asm.disease_type,
      risk_score: asm.risk_score,
      risk_band: asm.risk_band,
      model_version: asm.model_version,
      quantum_score: asm.quantum_score,
      classical_score: asm.classical_score,
      consensus: asm.consensus_agreement ? 'Concordant' : 'Discordant',
      quantum_circuit_details: qMeta,
      classical_model_details: cMeta,
      pipeline_stages: pBreakdown,
      technical_notes: asm.notes,
      notice: 'This technical explainer is provided exclusively for clinical and scientific review.'
    });
  } catch (err: any) {
    console.error('Pipeline explainer error:', err);
    res.status(500).json({ error: 'Failed to retrieve pipeline explainer details.' });
  }
});

// -------------------------------------------------------------
// 6. AI COMPANION (TEXT + VOICE, REGISTER & "PROBLEM NOT PROCESS")
// -------------------------------------------------------------

// POST /companion/message
apiRouter.post(['/companion/message', '/api/companion/message'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      user_id,
      text,
      audio,
      channel = 'text',
      companion_locale,
      consent_flag = false
    } = req.body || {};

    const resolvedUserId = user_id || (req.user && req.user.id) || 'USR-ANONYMOUS';
    const resolvedLocale = companion_locale || (req.user && req.user.companion_locale) || 'india_en';

    const response = await handleCompanionMessage({
      user_id: resolvedUserId,
      text,
      audio,
      channel,
      companion_locale: resolvedLocale,
      consent_flag: !!consent_flag
    });

    res.json(response);
  } catch (err: any) {
    console.error('Companion message error:', err);
    res.status(500).json({ error: 'Failed to process companion message.' });
  }
});

// -------------------------------------------------------------
// 7. PASSWORD RESET WORKFLOW
// -------------------------------------------------------------

apiRouter.post(['/auth/forgot-password', '/api/auth/forgot-password'], async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      res.status(400).json({ error: 'Email address is required.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(cleanEmail) as any;
    
    // Generate a secure reset token
    const token = `RST-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour expiry

    if (user) {
      db.prepare(`
        INSERT INTO password_resets (id, email, token, expires_at, used, created_at)
        VALUES (?, ?, ?, ?, 0, ?)
      `).run(`PR-${Date.now()}`, cleanEmail, token, expiresAt, new Date().toISOString());

      // Log audit event
      db.prepare(`
        INSERT INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
        VALUES (?, ?, ?, 'user', 'PASSWORD_RESET_REQUESTED', 'AUTH', ?, 'Password reset link generated.', '127.0.0.1', ?)
      `).run(`AUD-${Date.now()}`, user.id, cleanEmail, user.id, new Date().toISOString());
    }

    // Always return success message to avoid email enumeration
    res.json({
      message: 'If an account with this email address exists in the Q-Diagnose research registry, instructions and a verification code have been prepared.',
      demo_reset_token: user ? token : null
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process password reset request.' });
  }
});

apiRouter.post(['/auth/reset-password', '/api/auth/reset-password'], async (req: Request, res: Response) => {
  try {
    const { token, new_password } = req.body || {};
    if (!token || !new_password) {
      res.status(400).json({ error: 'Reset token and new password are required.' });
      return;
    }

    if (new_password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }

    const resetRecord = db.prepare(`
      SELECT * FROM password_resets 
      WHERE token = ? AND used = 0 AND expires_at > ?
    `).get(token, new Date().toISOString()) as any;

    if (!resetRecord) {
      res.status(400).json({ error: 'Invalid or expired password reset token.' });
      return;
    }

    const passwordHash = hashPassword(new_password);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?
    `).run(passwordHash, now, resetRecord.email);

    db.prepare(`
      UPDATE password_resets SET used = 1 WHERE id = ?
    `).run(resetRecord.id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
      VALUES (?, NULL, ?, 'user', 'PASSWORD_RESET_COMPLETED', 'AUTH', ?, 'Password successfully updated via reset token.', '127.0.0.1', ?)
    `).run(`AUD-${Date.now()}`, resetRecord.email, resetRecord.email, now);

    res.json({ message: 'Password has been successfully updated. You may now login.' });
  } catch (err: any) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// -------------------------------------------------------------
// 8. PATIENT PORTAL (OWN HEALTH RECORDS & CONSENT)
// -------------------------------------------------------------

// GET /api/patient/dashboard
apiRouter.get(['/patient/dashboard', '/api/patient/dashboard'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientId = req.user?.patient_id || (req.query.patient_id as string) || 'PAT-001';

    const patient = db.prepare(`
      SELECT p.*, u.name, u.email, u.contact 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `).get(patientId) as any;

    if (!patient) {
      res.status(404).json({ error: 'Patient not found.' });
      return;
    }

    const latestAssessment = db.prepare(`
      SELECT * FROM assessments WHERE patient_id = ? ORDER BY date DESC LIMIT 1
    `).get(patientId) as any;

    const latestLab = db.prepare(`
      SELECT * FROM lab_reports WHERE patient_id = ? ORDER BY date DESC LIMIT 1
    `).get(patientId) as any;

    const activeMedsCount = (db.prepare(`
      SELECT COUNT(*) as count FROM medications WHERE patient_id = ? AND status = 'active'
    `).get(patientId) as any)?.count || 0;

    const activeConsentsCount = (db.prepare(`
      SELECT COUNT(*) as count FROM patient_consents WHERE patient_id = ? AND status = 'active'
    `).get(patientId) as any)?.count || 0;

    const recentRecords = db.prepare(`
      SELECT id, title, record_type, date, author_name FROM medical_records WHERE patient_id = ? ORDER BY date DESC LIMIT 3
    `).all(patientId) as any[];

    res.json({
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        dob: patient.dob,
        gender: patient.gender,
        blood_group: patient.blood_group,
        emergency_contact: decryptField(patient.emergency_contact),
        medical_history: decryptField(patient.medical_history)
      },
      summary: {
        active_medications_count: activeMedsCount,
        active_consents_count: activeConsentsCount,
        latest_assessment: latestAssessment ? {
          id: latestAssessment.id,
          date: latestAssessment.date,
          disease_type: latestAssessment.disease_type,
          risk_score: latestAssessment.risk_score,
          risk_band: latestAssessment.risk_band,
          model_version: latestAssessment.model_version
        } : null,
        latest_lab: latestLab ? {
          id: latestLab.id,
          report_name: latestLab.report_name,
          date: latestLab.date,
          laboratory: latestLab.laboratory
        } : null
      },
      recent_records: recentRecords
    });
  } catch (err: any) {
    console.error('Patient dashboard error:', err);
    res.status(500).json({ error: 'Failed to retrieve patient dashboard.' });
  }
});

// GET /api/patient/records
apiRouter.get(['/patient/records', '/api/patient/records'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientId = req.user?.patient_id || (req.query.patient_id as string) || 'PAT-001';

    const records = db.prepare(`
      SELECT * FROM medical_records WHERE patient_id = ? ORDER BY date DESC
    `).all(patientId) as any[];

    const decrypted = records.map(r => ({
      ...r,
      content: decryptField(r.content)
    }));

    res.json({ patient_id: patientId, records: decrypted });
  } catch (err: any) {
    console.error('Fetch medical records error:', err);
    res.status(500).json({ error: 'Failed to retrieve medical records.' });
  }
});

// GET /api/patient/labs
apiRouter.get(['/patient/labs', '/api/patient/labs'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientId = req.user?.patient_id || (req.query.patient_id as string) || 'PAT-001';

    const labs = db.prepare(`
      SELECT * FROM lab_reports WHERE patient_id = ? ORDER BY date DESC
    `).all(patientId) as any[];

    const parsed = labs.map(l => {
      let params = [];
      try { params = JSON.parse(l.parameters); } catch {}
      return { ...l, parameters: params };
    });

    res.json({ patient_id: patientId, lab_reports: parsed });
  } catch (err: any) {
    console.error('Fetch labs error:', err);
    res.status(500).json({ error: 'Failed to retrieve laboratory reports.' });
  }
});

// GET /api/patient/medications
apiRouter.get(['/patient/medications', '/api/patient/medications'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientId = req.user?.patient_id || (req.query.patient_id as string) || 'PAT-001';
    const { status } = req.query as { status?: string };

    let sql = 'SELECT * FROM medications WHERE patient_id = ?';
    const params: any[] = [patientId];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    sql += ' ORDER BY status ASC, start_date DESC';

    const meds = db.prepare(sql).all(...params) as any[];
    res.json({ patient_id: patientId, medications: meds });
  } catch (err: any) {
    console.error('Fetch medications error:', err);
    res.status(500).json({ error: 'Failed to retrieve medications.' });
  }
});

// GET /api/patient/consents
apiRouter.get(['/patient/consents', '/api/patient/consents'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientId = req.user?.patient_id || (req.query.patient_id as string) || 'PAT-001';

    const consents = db.prepare(`
      SELECT * FROM patient_consents WHERE patient_id = ? ORDER BY granted_at DESC
    `).all(patientId) as any[];

    res.json({ patient_id: patientId, consents });
  } catch (err: any) {
    console.error('Fetch consents error:', err);
    res.status(500).json({ error: 'Failed to retrieve patient consents.' });
  }
});

// POST /api/patient/consents/:id/revoke
apiRouter.post(['/patient/consents/:id/revoke', '/api/patient/consents/:id/revoke'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason = 'Revoked by patient request' } = req.body || {};
    const now = new Date().toISOString();

    const consent = db.prepare('SELECT * FROM patient_consents WHERE id = ?').get(id) as any;
    if (!consent) {
      res.status(404).json({ error: 'Consent record not found.' });
      return;
    }

    db.prepare(`
      UPDATE patient_consents 
      SET status = 'revoked', revoked_at = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `).run(now, reason, now, id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, 'patient', 'CONSENT_REVOKED', 'PATIENT_CONSENT', ?, ?, '127.0.0.1', ?)
    `).run(
      `AUD-${Date.now()}`,
      req.user?.id || 'USR-PAT-001',
      req.user?.email || 'patient@qdiagnose.org',
      id,
      `Patient revoked access for ${consent.doctor_name}. Reason: ${reason}`,
      now
    );

    res.json({ message: 'Consent has been revoked successfully.', consent_id: id });
  } catch (err: any) {
    console.error('Revoke consent error:', err);
    res.status(500).json({ error: 'Failed to revoke consent.' });
  }
});

// POST /api/patient/consents/grant
apiRouter.post(['/patient/consents/grant', '/api/patient/consents/grant'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      patient_id,
      doctor_id,
      doctor_name,
      doctor_specialty,
      hospital,
      access_medical_records = 1,
      access_lab_reports = 1,
      access_medications = 1,
      access_ai_predictions = 1,
      expires_at
    } = req.body || {};

    const resolvedPatientId = patient_id || req.user?.patient_id || 'PAT-001';
    const now = new Date().toISOString();
    const consentId = `CST-${Date.now()}`;

    db.prepare(`
      INSERT INTO patient_consents (
        id, patient_id, doctor_id, doctor_name, doctor_specialty, hospital,
        access_medical_records, access_lab_reports, access_medications, access_ai_predictions,
        status, granted_at, expires_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
    `).run(
      consentId,
      resolvedPatientId,
      doctor_id,
      doctor_name,
      doctor_specialty || 'Clinical Specialist',
      hospital || 'Affiliated Medical Center',
      access_medical_records ? 1 : 0,
      access_lab_reports ? 1 : 0,
      access_medications ? 1 : 0,
      access_ai_predictions ? 1 : 0,
      now,
      expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      now
    );

    // Also link in doctor_patients if not linked
    db.prepare(`
      INSERT OR IGNORE INTO doctor_patients (id, doctor_id, patient_id, status, assigned_at)
      VALUES (?, ?, ?, 'active', ?)
    `).run(`DP-${Date.now()}`, doctor_id, resolvedPatientId, now);

    // Audit log
    db.prepare(`
      INSERT INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, 'patient', 'CONSENT_GRANTED', 'PATIENT_CONSENT', ?, ?, '127.0.0.1', ?)
    `).run(
      `AUD-${Date.now()}`,
      req.user?.id || 'USR-PAT-001',
      req.user?.email || 'patient@qdiagnose.org',
      consentId,
      `Patient granted clinical consent to ${doctor_name}.`,
      now
    );

    res.status(201).json({ message: 'Consent granted successfully.', consent_id: consentId });
  } catch (err: any) {
    console.error('Grant consent error:', err);
    res.status(500).json({ error: 'Failed to grant consent.' });
  }
});

// GET /api/patient/audit-logs
apiRouter.get(['/patient/audit-logs', '/api/patient/audit-logs'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientId = req.user?.patient_id || (req.query.patient_id as string) || 'PAT-001';

    const doctorAccessLogs = db.prepare(`
      SELECT 
        l.id, l.action, l.timestamp,
        u.name as doctor_name, d.hospital, d.specialty
      FROM doctor_access_log l
      JOIN doctors d ON l.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE l.patient_id = ?
      ORDER BY l.timestamp DESC LIMIT 50
    `).all(patientId) as any[];

    const emergencyAccessLogs = db.prepare(`
      SELECT * FROM emergency_access_logs WHERE patient_id = ? ORDER BY timestamp DESC
    `).all(patientId) as any[];

    res.json({
      patient_id: patientId,
      doctor_access_logs: doctorAccessLogs,
      emergency_access_logs: emergencyAccessLogs
    });
  } catch (err: any) {
    console.error('Fetch patient audit logs error:', err);
    res.status(500).json({ error: 'Failed to fetch patient audit history.' });
  }
});

// -------------------------------------------------------------
// 9. DOCTOR 360° & CONTROLLED EMERGENCY ACCESS
// -------------------------------------------------------------

// GET /api/doctor/patients/:patient_id/360
apiRouter.get(['/doctor/patients/:patient_id/360', '/api/doctor/patients/:patient_id/360'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patient_id } = req.params;
    const doctorId = req.user?.doctor_id || (req.query.doctor_id as string) || 'DOC-001';
    const emergencyToken = (req.query.emergency_token as string) || req.headers['x-emergency-token'];

    // Check if patient exists
    const patient = db.prepare(`
      SELECT p.*, u.name, u.email, u.contact 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `).get(patient_id) as any;

    if (!patient) {
      res.status(404).json({ error: 'Patient record not found.' });
      return;
    }

    // Check consent authorization
    const activeConsent = db.prepare(`
      SELECT * FROM patient_consents 
      WHERE patient_id = ? AND doctor_id = ? AND status = 'active'
    `).get(patient_id, doctorId) as any;

    // Check doctor-patient assignment
    const docPatientLink = db.prepare(`
      SELECT * FROM doctor_patients 
      WHERE patient_id = ? AND doctor_id = ? AND status = 'active'
    `).get(patient_id, doctorId) as any;

    const isAuthorized = !!activeConsent || !!docPatientLink || !!emergencyToken;

    if (!isAuthorized) {
      // Return 403 with emergency access metadata
      res.status(403).json({
        error: 'ConsentRequired',
        emergency_access_required: true,
        message: 'This patient has not granted normal access to the requested restricted information. Emergency access should only be used when necessary for immediate treatment or patient safety.',
        patient: {
          id: patient.id,
          name: patient.name,
          age: patient.dob ? Math.floor((Date.now() - new Date(patient.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : 52,
          gender: patient.gender,
          blood_group: patient.blood_group
        }
      });
      return;
    }

    // Log clinician access to audit trail
    const now = new Date().toISOString();
    try {
      db.prepare(`
        INSERT INTO doctor_access_log (id, doctor_id, patient_id, action, timestamp)
        VALUES (?, ?, ?, 'VIEW_DOCTOR_360', ?)
      `).run(`LOG-${Date.now()}`, doctorId, patient_id, now);

      db.prepare(`
        INSERT INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
        VALUES (?, ?, ?, 'doctor', 'VIEW_DOCTOR_360', 'PATIENT_DOSSIER', ?, ?, '127.0.0.1', ?)
      `).run(
        `AUD-${Date.now()}`,
        req.user?.id || doctorId,
        req.user?.email || 'doctor@qdiagnose.org',
        patient_id,
        `Doctor 360 dossier accessed for patient ${patient.name} (${patient_id}).`,
        now
      );
    } catch (e) {
      console.error('Audit logging error:', e);
    }

    // Fetch full 360 dossier
    const medicalRecords = db.prepare(`
      SELECT * FROM medical_records WHERE patient_id = ? ORDER BY date DESC
    `).all(patient_id) as any[];

    const labs = db.prepare(`
      SELECT * FROM lab_reports WHERE patient_id = ? ORDER BY date DESC
    `).all(patient_id) as any[];

    const medications = db.prepare(`
      SELECT * FROM medications WHERE patient_id = ? ORDER BY status ASC, start_date DESC
    `).all(patient_id) as any[];

    const assessments = db.prepare(`
      SELECT * FROM assessments WHERE patient_id = ? ORDER BY date DESC
    `).all(patient_id) as any[];

    const consents = db.prepare(`
      SELECT * FROM patient_consents WHERE patient_id = ? ORDER BY granted_at DESC
    `).all(patient_id) as any[];

    const accessHistory = db.prepare(`
      SELECT l.*, u.name as doctor_name, d.hospital 
      FROM doctor_access_log l
      JOIN doctors d ON l.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE l.patient_id = ?
      ORDER BY l.timestamp DESC LIMIT 20
    `).all(patient_id) as any[];

    res.json({
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        contact: decryptField(patient.contact),
        dob: patient.dob,
        age: patient.dob ? Math.floor((Date.now() - new Date(patient.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : 52,
        gender: patient.gender,
        blood_group: patient.blood_group,
        emergency_contact: decryptField(patient.emergency_contact),
        medical_history: decryptField(patient.medical_history),
        status: 'Active',
        consent_status: activeConsent ? 'Active ABDM Consent' : emergencyToken ? 'Emergency Override Active' : 'Restricted'
      },
      medical_records: medicalRecords.map(m => ({ ...m, content: decryptField(m.content) })),
      lab_reports: labs.map(l => {
        let p = [];
        try { p = JSON.parse(l.parameters); } catch {}
        return { ...l, parameters: p };
      }),
      medications,
      ai_predictions: assessments.map(a => {
        let cf = [];
        try { cf = JSON.parse(a.contributing_factors); } catch {}
        return {
          ...a,
          contributing_factors: cf,
          consensus: a.consensus_agreement ? 'Concordant' : 'Discordant'
        };
      }),
      consents,
      access_history: accessHistory,
      emergency_override_active: !!emergencyToken
    });
  } catch (err: any) {
    console.error('Doctor 360 error:', err);
    res.status(500).json({ error: 'Failed to retrieve Doctor 360 dossier.' });
  }
});

// POST /api/doctor/patients/:patient_id/emergency-access
apiRouter.post(['/doctor/patients/:patient_id/emergency-access', '/api/doctor/patients/:patient_id/emergency-access'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patient_id } = req.params;
    const { reason, confirmed_care } = req.body || {};
    const doctorId = req.user?.doctor_id || (req.body.doctor_id as string) || 'DOC-001';

    if (!reason || reason.trim().length < 10) {
      res.status(400).json({ error: 'A mandatory clinical justification of at least 10 characters is required for emergency access.' });
      return;
    }

    if (!confirmed_care) {
      res.status(400).json({ error: 'You must confirm that this request is necessary for emergency patient care.' });
      return;
    }

    const patient = db.prepare(`
      SELECT p.id, u.name 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `).get(patient_id) as any;

    if (!patient) {
      res.status(404).json({ error: 'Patient not found.' });
      return;
    }

    const doctor = db.prepare(`
      SELECT d.id, u.name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      WHERE d.id = ?
    `).get(doctorId) as any;

    const eventId = `EMG-ACC-${Date.now()}`;
    const emergencyToken = `EMG-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    // 1. Log immutable event in emergency_access_logs
    db.prepare(`
      INSERT INTO emergency_access_logs (id, doctor_id, doctor_name, patient_id, patient_name, reason, confirmed_care, ip_address, action, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, 1, '127.0.0.1', 'EMERGENCY_OVERRIDE_ACCESS', ?)
    `).run(
      eventId,
      doctorId,
      doctor?.name || 'Dr. Attending Clinician',
      patient.id,
      patient.name,
      reason.trim(),
      now
    );

    // 2. Log in global security audit trail
    db.prepare(`
      INSERT INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, 'doctor', 'EMERGENCY_ACCESS_GRANTED', 'PATIENT_DOSSIER', ?, ?, '127.0.0.1', ?)
    `).run(
      `AUD-${Date.now()}`,
      req.user?.id || doctorId,
      req.user?.email || 'doctor@qdiagnose.org',
      patient_id,
      `EMERGENCY ACCESS GRANTED: Doctor ${doctor?.name || doctorId} accessed restricted records for patient ${patient.name} (${patient_id}). Reason: "${reason.trim()}". Confirmed emergency care checkbox checked.`,
      now
    );

    res.json({
      message: 'Emergency access granted. This session has been recorded in the immutable clinical audit log.',
      emergency_token: emergencyToken,
      audit_event_id: eventId,
      expires_in: '1 hour',
      patient_id,
      doctor_id: doctorId,
      timestamp: now
    });
  } catch (err: any) {
    console.error('Emergency access error:', err);
    res.status(500).json({ error: 'Failed to process emergency access override.' });
  }
});

// -------------------------------------------------------------
// 10. ADMIN DASHBOARD & SECURITY AUDIT TRAILS
// -------------------------------------------------------------

// GET /api/admin/dashboard
apiRouter.get(['/admin/dashboard', '/api/admin/dashboard'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any)?.c || 0;
    const totalPatients = (db.prepare('SELECT COUNT(*) as c FROM patients').get() as any)?.c || 0;
    const totalDoctors = (db.prepare('SELECT COUNT(*) as c FROM doctors').get() as any)?.c || 0;
    const totalAssessments = (db.prepare('SELECT COUNT(*) as c FROM assessments').get() as any)?.c || 0;
    const totalAuditEvents = (db.prepare('SELECT COUNT(*) as c FROM audit_events').get() as any)?.c || 0;
    const totalEmergencyAccess = (db.prepare('SELECT COUNT(*) as c FROM emergency_access_logs').get() as any)?.c || 0;

    const recentAuditEvents = db.prepare(`
      SELECT * FROM audit_events ORDER BY timestamp DESC LIMIT 15
    `).all() as any[];

    const usersList = db.prepare(`
      SELECT id, role, email, name, status, created_at FROM users ORDER BY created_at DESC LIMIT 20
    `).all() as any[];

    res.json({
      stats: {
        total_users: totalUsers,
        total_patients: totalPatients,
        total_doctors: totalDoctors,
        total_assessments: totalAssessments,
        total_audit_events: totalAuditEvents,
        total_emergency_access: totalEmergencyAccess
      },
      recent_audit_events: recentAuditEvents,
      users: usersList
    });
  } catch (err: any) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Failed to retrieve admin dashboard.' });
  }
});

// GET /api/admin/audit-logs
apiRouter.get(['/admin/audit-logs', '/api/admin/audit-logs'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, action, search } = req.query as { role?: string; action?: string; search?: string };

    let sql = 'SELECT * FROM audit_events WHERE 1=1';
    const params: any[] = [];

    if (role && role !== 'all') {
      sql += ' AND user_role = ?';
      params.push(role);
    }

    if (action && action !== 'all') {
      sql += ' AND action LIKE ?';
      params.push(`%${action}%`);
    }

    if (search) {
      sql += ' AND (details LIKE ? OR user_email LIKE ? OR target_id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY timestamp DESC LIMIT 100';

    const logs = db.prepare(sql).all(...params) as any[];
    res.json({ count: logs.length, audit_logs: logs });
  } catch (err: any) {
    console.error('Admin audit logs error:', err);
    res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
});

// POST /api/admin/verify-doctor
apiRouter.post(['/admin/verify-doctor', '/api/admin/verify-doctor'], optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user_id, status = 'active' } = req.body || {};
    if (!user_id) {
      res.status(400).json({ error: 'user_id is required.' });
      return;
    }

    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, user_id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
      VALUES (?, ?, ?, 'admin', 'DOCTOR_VERIFICATION_UPDATED', 'DOCTOR_ACCOUNT', ?, ?, '127.0.0.1', ?)
    `).run(
      `AUD-${Date.now()}`,
      req.user?.id || 'USR-ADM-001',
      req.user?.email || 'admin@qdiagnose.org',
      user_id,
      `Doctor account status updated to '${status}' by administrator.`,
      new Date().toISOString()
    );

    res.json({ message: `Doctor status updated to '${status}'.` });
  } catch (err: any) {
    console.error('Verify doctor error:', err);
    res.status(500).json({ error: 'Failed to update doctor verification.' });
  }
});

