import { db } from './db.js';
import { hashPassword, encryptField } from './crypto.js';

export function runMigrationsAndSeed() {
  const now = new Date().toISOString();
  const defaultPasswordHash = hashPassword('password123');
  const doctorPasswordHash = hashPassword('doctor123');
  const adminPasswordHash = hashPassword('admin123');

  // Well-known test IDs for relational seeding across tables
  const doc1Id = 'DOC-001';
  const doc2Id = 'DOC-002';
  const doc3Id = 'DOC-003';
  const pat1Id = 'PAT-001';
  const pat2Id = 'PAT-002';
  const pat3Id = 'PAT-003';
  const pat4Id = 'PAT-004';

  // 1. Ensure Admin User exists
  const adminExists = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any;
  if (!adminExists) {
    db.prepare(`
      INSERT INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
      VALUES (?, 'admin', 'admin@qdiagnose.org', ?, 'System Administrator (RBAC Oversight)', ?, 'active', 'en', 'india_en', ?, ?)
    `).run(
      'USR-ADM-001',
      adminPasswordHash,
      encryptField('+91 80000 00001'),
      now,
      now
    );
  }

  // Seed Doctors and Users (INSERT OR IGNORE ensures missing entities are created without crashing)
  // 1. Dr. Rajesh Sharma (Cardio-Oncology Specialist)
  const doc1UserId = 'USR-DOC-001';
  db.prepare(`
    INSERT OR IGNORE INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
    VALUES (?, 'doctor', 'dr.sharma@qdiagnose.org', ?, 'Dr. Rajesh Sharma, MD', ?, 'active', 'en', 'india_en', ?, ?)
  `).run(
    doc1UserId,
    doctorPasswordHash,
    encryptField('+91 98201 44521'),
    now,
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO doctors (id, user_id, specialty, license_number, hospital, bio, created_at)
    VALUES (?, ?, 'Cardiovascular & Oncology Screening', 'MCI-78421-B', 'Apollo Heart & Oncology Research Centre, New Delhi', '20+ years leading non-invasive preventative risk stratification and quantum biomarker research.', ?)
  `).run(
    doc1Id,
    doc1UserId,
    now
  );

  // 2. Dr. Elena Vance (Neurology Specialist)
  const doc2UserId = 'USR-DOC-002';
  db.prepare(`
    INSERT OR IGNORE INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
    VALUES (?, 'doctor', 'dr.vance@qdiagnose.org', ?, 'Dr. Elena Vance, Neurologist', ?, 'active', 'en', 'american', ?, ?)
  `).run(
    doc2UserId,
    doctorPasswordHash,
    encryptField('+1 415 555 0192'),
    now,
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO doctors (id, user_id, specialty, license_number, hospital, bio, created_at)
    VALUES (?, ?, 'Neurological & Acoustic Biomarkers', 'CA-MED-99412', 'Bay Area Neuroscience & Clinical Research Institute', 'Specializing in early micro-tremor phonation analysis and motor risk prevention.', ?)
  `).run(
    doc2Id,
    doc2UserId,
    now
  );

  // 3. Dr. Sarah Johnson (Cardiology Specialist for SIH scenarios)
  const doc3UserId = 'USR-DOC-003';
  db.prepare(`
    INSERT OR IGNORE INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
    VALUES (?, 'doctor', 'dr.sarah@qdiagnose.org', ?, 'Dr. Sarah Johnson, MD', ?, 'active', 'en', 'american', ?, ?)
  `).run(
    doc3UserId,
    doctorPasswordHash,
    encryptField('+1 617 555 3829'),
    now,
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO doctors (id, user_id, specialty, license_number, hospital, bio, created_at)
    VALUES (?, ?, 'Cardiology & Preventive Medicine', 'MA-MED-44819', 'Boston General Heart & Vascular Center', 'Cardiologist specializing in early hemodynamic decompensation and machine learning decision support.', ?)
  `).run(
    doc3Id,
    doc3UserId,
    now
  );

  // Insert Patients
  // Patient 1: Ananya Roy (Breast Cancer & Cardio Monitoring, Linked to Dr. Sharma)
  const pat1UserId = 'USR-PAT-001';
  db.prepare(`
    INSERT OR IGNORE INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
    VALUES (?, 'patient', 'patient.ananya@qdiagnose.org', ?, 'Ananya Roy', ?, 'active', 'en', 'india_en', ?, ?)
  `).run(
    pat1UserId,
    defaultPasswordHash,
    encryptField('+91 98450 11234'),
    now,
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO patients (id, user_id, dob, gender, blood_group, emergency_contact, medical_history, primary_doctor_id, created_at)
    VALUES (?, ?, '1979-05-14', 'Female', 'B+', ?, ?, ?, ?)
  `).run(
    pat1Id,
    pat1UserId,
    encryptField('+91 98450 99887 (Sanjay Roy - Spouse)'),
    encryptField('Maternal history of early breast cancer; borderline hypertension managed with lifestyle.'),
    doc1Id,
    now
  );

  // Patient 2: Vikram Mehta (High Cardiovascular Risk, Linked to Dr. Sharma)
  const pat2UserId = 'USR-PAT-002';
  db.prepare(`
    INSERT OR IGNORE INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
    VALUES (?, 'patient', 'vikram.mehta@qdiagnose.org', ?, 'Vikram Mehta', ?, 'active', 'hi', 'hi', ?, ?)
  `).run(
    pat2UserId,
    defaultPasswordHash,
    encryptField('+91 98110 54321'),
    now,
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO patients (id, user_id, dob, gender, blood_group, emergency_contact, medical_history, primary_doctor_id, created_at)
    VALUES (?, ?, '1968-11-22', 'Male', 'O+', ?, ?, ?, ?)
  `).run(
    pat2Id,
    pat2UserId,
    encryptField('+91 98110 98765 (Sunita Mehta - Spouse)'),
    encryptField('Hypertension for 6 years, elevated LDL (165 mg/dL), mild exertional dyspnea.'),
    doc1Id,
    now
  );

  // Patient 3: Priya Swaminathan (Low Risk, Routine Annual Check, Linked to Dr. Sharma)
  const pat3UserId = 'USR-PAT-003';
  db.prepare(`
    INSERT OR IGNORE INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
    VALUES (?, 'patient', 'priya.s@qdiagnose.org', ?, 'Priya Swaminathan', ?, 'active', 'ta', 'ta', ?, ?)
  `).run(
    pat3UserId,
    defaultPasswordHash,
    encryptField('+91 94440 22334'),
    now,
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO patients (id, user_id, dob, gender, blood_group, emergency_contact, medical_history, primary_doctor_id, created_at)
    VALUES (?, ?, '1988-03-10', 'Female', 'A+', ?, ?, ?, ?)
  `).run(
    pat3Id,
    pat3UserId,
    encryptField('+91 94440 88776 (Karthik Swaminathan)'),
    encryptField('No chronic conditions. Non-smoker, regular yogic exercise.'),
    doc1Id,
    now
  );

  // Patient 4: Robert Miller (Neurological tremor monitoring, Linked to Dr. Vance)
  const pat4UserId = 'USR-PAT-004';
  db.prepare(`
    INSERT OR IGNORE INTO users (id, role, email, password_hash, name, contact, status, ui_locale, companion_locale, created_at, updated_at)
    VALUES (?, 'patient', 'robert.miller@qdiagnose.org', ?, 'Robert Miller', ?, 'active', 'en', 'american', ?, ?)
  `).run(
    pat4UserId,
    defaultPasswordHash,
    encryptField('+1 415 888 1234'),
    now,
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO patients (id, user_id, dob, gender, blood_group, emergency_contact, medical_history, primary_doctor_id, created_at)
    VALUES (?, ?, '1961-08-19', 'Male', 'AB+', ?, ?, ?, ?)
  `).run(
    pat4Id,
    pat4UserId,
    encryptField('+1 415 888 9876 (Sarah Miller - Daughter)'),
    encryptField('Mild resting tremor in right hand for 9 months; subtle vocal fatigue during prolonged speaking.'),
    doc2Id,
    now
  );

  // Link Patients to Doctors
  db.prepare(`
    INSERT OR IGNORE INTO doctor_patients (id, doctor_id, patient_id, status, assigned_at)
    VALUES (?, ?, ?, 'active', ?)
  `).run('DP-001', doc1Id, pat1Id, '2026-01-10T09:00:00.000Z');

  db.prepare(`
    INSERT OR IGNORE INTO doctor_patients (id, doctor_id, patient_id, status, assigned_at)
    VALUES (?, ?, ?, 'active', ?)
  `).run('DP-002', doc1Id, pat2Id, '2026-02-15T11:30:00.000Z');

  db.prepare(`
    INSERT OR IGNORE INTO doctor_patients (id, doctor_id, patient_id, status, assigned_at)
    VALUES (?, ?, ?, 'active', ?)
  `).run('DP-003', doc1Id, pat3Id, '2026-03-01T14:15:00.000Z');

  db.prepare(`
    INSERT OR IGNORE INTO doctor_patients (id, doctor_id, patient_id, status, assigned_at)
    VALUES (?, ?, ?, 'active', ?)
  `).run('DP-004', doc2Id, pat4Id, '2026-04-05T10:00:00.000Z');

  // Link Dr. Sarah Johnson to Vikram Mehta (Active)
  db.prepare(`
    INSERT OR IGNORE INTO doctor_patients (id, doctor_id, patient_id, status, assigned_at)
    VALUES (?, ?, ?, 'active', ?)
  `).run('DP-005', doc3Id, pat2Id, '2026-09-12T08:00:00.000Z');

  // Insert Historical Assessments (giving rich historical trends for patients)
  const asmCount = db.prepare('SELECT COUNT(*) as count FROM assessments').get() as { count: number };
  if (!asmCount || asmCount.count === 0) {
    // Ananya Roy - Historical trend over several months
    const ananyaDates = [
      { date: '2026-04-12T10:00:00.000Z', score: 48, band: 'moderate', model: 'vqc-hybrid-v2.2-qiskit', disease: 'breast_cancer' },
      { date: '2026-06-18T11:20:00.000Z', score: 42, band: 'moderate', model: 'vqc-hybrid-v2.3-qiskit', disease: 'breast_cancer' },
      { date: '2026-08-25T09:45:00.000Z', score: 38, band: 'moderate', model: 'vqc-hybrid-v2.4-qiskit', disease: 'breast_cancer' },
      { date: '2026-09-01T14:30:00.000Z', score: 32, band: 'low', model: 'vqc-hybrid-v2.4-qiskit', disease: 'breast_cancer' }
    ];

    ananyaDates.forEach((rec, idx) => {
      const asmId = `ASM-ANANYA-00${idx + 1}`;
      const contributing = JSON.stringify([
        { name: 'concave_points_mean', value: 28.5, description: 'Number of concave contour segments' },
        { name: 'area_worst', value: 22.1, description: 'Nuclear region area measurement' },
        { name: 'texture_mean', value: 16.4, description: 'Variation in gray-scale values' }
      ]);
      const inputFeats = JSON.stringify({ radius_mean: 13.8, concave_points_mean: 0.042, area_worst: 620.5 });

      db.prepare(`
        INSERT OR IGNORE INTO assessments (
          id, patient_id, date, disease_type, input_features, risk_score, risk_band, 
          contributing_factors, model_version, quantum_score, classical_score, consensus_agreement, 
          quantum_metadata, classical_metadata, pipeline_breakdown, notes, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
      `).run(
        asmId,
        pat1Id,
        rec.date,
        rec.disease,
        encryptField(inputFeats),
        rec.score,
        rec.band,
        contributing,
        rec.model,
        0.34,
        0.31,
        JSON.stringify({ qubits: 4, ansatz: 'RealAmplitudes (depth=8)', feature_map: 'ZZFeatureMap (reps=2)' }),
        JSON.stringify({ trees: 100, criterion: 'Gini Impurity' }),
        JSON.stringify({ scaler: 'StandardScaler', pca_dim: 4, explained_variance: '92.4%' }),
        'Consistent reduction in contour concavity markers following lifestyle and nutritional modifications.',
        rec.date
      );
    });

    // Vikram Mehta - High cardiovascular risk assessments
    const vikramDates = [
      { date: '2026-07-10T15:00:00.000Z', score: 72, band: 'high', model: 'vqc-cardio-v1.8', disease: 'cardiovascular' },
      { date: '2026-08-14T10:15:00.000Z', score: 78, band: 'high', model: 'vqc-cardio-v1.8', disease: 'cardiovascular' },
      { date: '2026-09-02T16:20:00.000Z', score: 74, band: 'high', model: 'vqc-cardio-v1.9', disease: 'cardiovascular' }
    ];

    vikramDates.forEach((rec, idx) => {
      const asmId = `ASM-VIKRAM-00${idx + 1}`;
      const contributing = JSON.stringify([
        { name: 'st_slope_flat', value: 34.0, description: 'Exercise ST segment flat depression' },
        { name: 'max_heart_rate_achieved', value: 27.5, description: 'Chronotropic response during exertion' },
        { name: 'resting_systolic_bp', value: 21.0, description: 'Resting systolic blood pressure elevation' }
      ]);
      const inputFeats = JSON.stringify({ resting_bp: 154, max_heart_rate: 122, st_slope: 'flat', cholesterol: 248 });

      db.prepare(`
        INSERT OR IGNORE INTO assessments (
          id, patient_id, date, disease_type, input_features, risk_score, risk_band, 
          contributing_factors, model_version, quantum_score, classical_score, consensus_agreement, 
          quantum_metadata, classical_metadata, pipeline_breakdown, notes, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
      `).run(
        asmId,
        pat2Id,
        rec.date,
        rec.disease,
        encryptField(inputFeats),
        rec.score,
        rec.band,
        contributing,
        rec.model,
        0.76,
        0.72,
        JSON.stringify({ qubits: 4, ansatz: 'RealAmplitudes (depth=8)', feature_map: 'ZZFeatureMap (reps=2)' }),
        JSON.stringify({ trees: 100, criterion: 'Gini Impurity' }),
        JSON.stringify({ scaler: 'StandardScaler', pca_dim: 4, explained_variance: '88.7%' }),
        'Persistent exercise ST depression indicating significant subendocardial ischemia risk. Doctor consultation urgently scheduled.',
        rec.date
      );
    });

    // Robert Miller - Neurological tremor acoustic screening
    const robertDates = [
      { date: '2026-08-01T11:00:00.000Z', score: 58, band: 'moderate', model: 'vqc-neuro-v1.2', disease: 'neurological' },
      { date: '2026-08-28T14:30:00.000Z', score: 62, band: 'moderate', model: 'vqc-neuro-v1.2', disease: 'neurological' }
    ];

    robertDates.forEach((rec, idx) => {
      const asmId = `ASM-ROBERT-00${idx + 1}`;
      const contributing = JSON.stringify([
        { name: 'fundamental_freq_spread (spread1)', value: 32.1, description: 'Nonlinear pitch frequency attractor dispersion' },
        { name: 'harmonic_noise_ratio (HNR)', value: 26.8, description: 'Vocal acoustic breathiness and spectral turbulence' },
        { name: 'shimmer_apq5', value: 19.4, description: 'Cycle amplitude perturbation' }
      ]);
      const inputFeats = JSON.stringify({ jitter: 0.0072, shimmer: 0.042, hnr: 17.8, spread1: -4.8 });

      db.prepare(`
        INSERT OR IGNORE INTO assessments (
          id, patient_id, date, disease_type, input_features, risk_score, risk_band, 
          contributing_factors, model_version, quantum_score, classical_score, consensus_agreement, 
          quantum_metadata, classical_metadata, pipeline_breakdown, notes, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
      `).run(
        asmId,
        pat4Id,
        rec.date,
        rec.disease,
        encryptField(inputFeats),
        rec.score,
        rec.band,
        contributing,
        rec.model,
        0.63,
        0.60,
        JSON.stringify({ qubits: 4, ansatz: 'RealAmplitudes (depth=8)', feature_map: 'ZZFeatureMap (reps=2)' }),
        JSON.stringify({ trees: 100, criterion: 'Gini Impurity' }),
        JSON.stringify({ scaler: 'StandardScaler', pca_dim: 4, explained_variance: '90.1%' }),
        'Acoustic micro-tremor and HNR decrease flag early phonatory motor signs for neurological review.',
        rec.date
      );
    });
  }

  // Seed one emergency event for audit demonstration
  db.prepare(`
    INSERT OR IGNORE INTO emergency_events (id, patient_id, timestamp, symptoms_flagged, verdict, severity, action_taken, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'EMG-001',
    pat2Id,
    '2026-08-14T10:20:00.000Z',
    JSON.stringify(['Crushing chest pain radiating to left arm', 'Acute shortness of breath at rest']),
    'EMERGENCY_DISPATCH_ADVISED',
    'CRITICAL',
    'Emergency 108 helpline displayed on screen; patient notified to report to nearest emergency room immediately.',
    '2026-08-14T10:20:00.000Z'
  );

  // Seed doctor access log
  db.prepare(`
    INSERT OR IGNORE INTO doctor_access_log (id, doctor_id, patient_id, action, timestamp)
    VALUES (?, ?, ?, 'VIEW_ASSESSMENT_HISTORY', ?)
  `).run(
    'LOG-001',
    doc1Id,
    pat2Id,
    '2026-09-02T17:00:00.000Z'
  );

  // Seed Medical Records if empty
  const medRecordCount = db.prepare('SELECT COUNT(*) as count FROM medical_records').get() as { count: number };
  if (!medRecordCount || medRecordCount.count === 0) {
    // Ananya Roy records
    db.prepare(`
      INSERT INTO medical_records (id, patient_id, title, record_type, date, author_name, author_role, content, status, access_controlled, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-REC-001',
      'PAT-001',
      'Preventive Oncology & Biomarker Assessment',
      'consultation',
      '2026-09-01',
      'Dr. Rajesh Sharma, MD',
      'doctor',
      encryptField('Patient presents for routine bi-annual review. Prior hybrid VQC screening shows progressive risk down-trending (48% -> 32%). Physical examination normal with no palpable axillary or cervical lymphadenopathy. Urged continuation of low-glycemic dietary regimen and daily aerobic exercise.'),
      'final',
      1,
      '2026-09-01T14:45:00.000Z'
    );

    db.prepare(`
      INSERT INTO medical_records (id, patient_id, title, record_type, date, author_name, author_role, content, status, access_controlled, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-REC-002',
      'PAT-001',
      'Digital Mammography & Ultrasound Bilateral Screening',
      'clinical_note',
      '2026-08-25',
      'Dr. P. Sundaram, Radiologist',
      'specialist',
      encryptField('Bilateral full-field digital mammography: Dense breast tissue (ACR Density Category B). No suspicious microcalcifications, architectural distortion, or focal masses. BI-RADS Category 1: Negative. Recommend routine annual screening.'),
      'final',
      1,
      '2026-08-25T11:00:00.000Z'
    );

    // Vikram Mehta records
    db.prepare(`
      INSERT INTO medical_records (id, patient_id, title, record_type, date, author_name, author_role, content, status, access_controlled, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-REC-003',
      'PAT-002',
      'Cardiology Evaluation - Ischemic Risk & Exertional Angina',
      'consultation',
      '2026-09-02',
      'Dr. Rajesh Sharma, MD',
      'doctor',
      encryptField('Patient reports intermittent retrosternal tightness on brisk walking (>500m), relieved within 3 minutes of rest. Resting BP 154/96 mmHg. Hybrid quantum-classical risk assessment indicates 74% elevated score with model concordant consensus. Initiated uptitration of Rosuvastatin and added Ramipril. Ordered outpatient Coronary CT Angiogram.'),
      'final',
      1,
      '2026-09-02T16:35:00.000Z'
    );

    db.prepare(`
      INSERT INTO medical_records (id, patient_id, title, record_type, date, author_name, author_role, content, status, access_controlled, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-REC-004',
      'PAT-002',
      'Treadmill Exercise Stress Test (TMT) Report',
      'procedure',
      '2026-08-14',
      'Dr. Rajesh Sharma, MD',
      'doctor',
      encryptField('Standard Bruce protocol. Test terminated at Stage III (6.4 METs) due to horizontal ST-segment depression (1.8 mm in Leads II, III, aVF, V5-V6) and exertional chest pressure. Blood pressure response: 150/90 baseline -> 185/105 peak. Conclusion: Positive for exercise-induced myocardial ischemia at moderate workload.'),
      'final',
      1,
      '2026-08-14T11:15:00.000Z'
    );
  }

  // Seed Lab Reports if empty
  const labCount = db.prepare('SELECT COUNT(*) as count FROM lab_reports').get() as { count: number };
  if (!labCount || labCount.count === 0) {
    // Ananya Roy Lab
    const ananyaCbcParams = [
      { parameter: 'Hemoglobin', value: '13.4', unit: 'g/dL', reference_range: '12.0 - 15.5', status: 'Normal', is_abnormal: false },
      { parameter: 'Total Leukocyte Count (WBC)', value: '6,800', unit: '/µL', reference_range: '4,000 - 11,000', status: 'Normal', is_abnormal: false },
      { parameter: 'Platelet Count', value: '245,000', unit: '/µL', reference_range: '150,000 - 450,000', status: 'Normal', is_abnormal: false },
      { parameter: 'Packed Cell Volume (PCV)', value: '39.8', unit: '%', reference_range: '36.0 - 46.0', status: 'Normal', is_abnormal: false },
      { parameter: 'Erythrocyte Sedimentation Rate (ESR)', value: '12', unit: 'mm/hr', reference_range: '0 - 20', status: 'Normal', is_abnormal: false }
    ];

    const ananyaCmpParams = [
      { parameter: 'Fasting Blood Glucose', value: '92', unit: 'mg/dL', reference_range: '70 - 99', status: 'Normal', is_abnormal: false },
      { parameter: 'HbA1c', value: '5.4', unit: '%', reference_range: '< 5.7', status: 'Normal', is_abnormal: false },
      { parameter: 'Serum Creatinine', value: '0.82', unit: 'mg/dL', reference_range: '0.55 - 1.02', status: 'Normal', is_abnormal: false },
      { parameter: 'Estimated GFR (CKD-EPI)', value: '98', unit: 'mL/min/1.73m²', reference_range: '> 90', status: 'Normal', is_abnormal: false },
      { parameter: 'Total Bilirubin', value: '0.7', unit: 'mg/dL', reference_range: '0.2 - 1.2', status: 'Normal', is_abnormal: false },
      { parameter: 'Alanine Aminotransferase (ALT)', value: '22', unit: 'U/L', reference_range: '7 - 35', status: 'Normal', is_abnormal: false },
      { parameter: 'Aspartate Aminotransferase (AST)', value: '20', unit: 'U/L', reference_range: '8 - 33', status: 'Normal', is_abnormal: false }
    ];

    db.prepare(`
      INSERT INTO lab_reports (id, patient_id, report_name, category, date, laboratory, ordering_doctor, parameters, clinical_summary, attached_document_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'LAB-001',
      'PAT-001',
      'Complete Blood Count (CBC) with Differential',
      'Hematology',
      '2026-08-28',
      'Apollo Diagnostics Central Lab, New Delhi',
      'Dr. Rajesh Sharma, MD',
      JSON.stringify(ananyaCbcParams),
      'Normal hematological indices. Adequate cellular morphology without leukocytosis or cytopenia.',
      'CBC_AnanyaRoy_20260828.pdf',
      '2026-08-28T16:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO lab_reports (id, patient_id, report_name, category, date, laboratory, ordering_doctor, parameters, clinical_summary, attached_document_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'LAB-002',
      'PAT-001',
      'Comprehensive Metabolic & Renal Profile',
      'Biochemistry',
      '2026-08-28',
      'Apollo Diagnostics Central Lab, New Delhi',
      'Dr. Rajesh Sharma, MD',
      JSON.stringify(ananyaCmpParams),
      'Normoglycemic profile. Intact renal clearance and baseline hepatic transaminases within target limits.',
      'CMP_AnanyaRoy_20260828.pdf',
      '2026-08-28T16:15:00.000Z'
    );

    // Vikram Mehta Labs
    const vikramLipidParams = [
      { parameter: 'Total Cholesterol', value: '248', unit: 'mg/dL', reference_range: '< 200', status: 'High', is_abnormal: true },
      { parameter: 'LDL-C (Calculated)', value: '165', unit: 'mg/dL', reference_range: '< 100', status: 'High', is_abnormal: true },
      { parameter: 'HDL-C', value: '38', unit: 'mg/dL', reference_range: '> 40', status: 'Low', is_abnormal: true },
      { parameter: 'Triglycerides', value: '225', unit: 'mg/dL', reference_range: '< 150', status: 'High', is_abnormal: true },
      { parameter: 'Non-HDL Cholesterol', value: '210', unit: 'mg/dL', reference_range: '< 130', status: 'High', is_abnormal: true },
      { parameter: 'High-Sensitivity CRP (hs-CRP)', value: '3.8', unit: 'mg/L', reference_range: '< 1.0', status: 'High', is_abnormal: true }
    ];

    const vikramCardiacParams = [
      { parameter: 'High-Sensitivity Troponin-I', value: '14.2', unit: 'ng/L', reference_range: '< 19.8 (99th %tile)', status: 'Normal', is_abnormal: false },
      { parameter: 'NT-proBNP', value: '215', unit: 'pg/mL', reference_range: '< 125', status: 'Elevated', is_abnormal: true },
      { parameter: 'Serum Potassium (K+)', value: '4.4', unit: 'mEq/L', reference_range: '3.5 - 5.1', status: 'Normal', is_abnormal: false },
      { parameter: 'Serum Sodium (Na+)', value: '141', unit: 'mEq/L', reference_range: '135 - 145', status: 'Normal', is_abnormal: false }
    ];

    db.prepare(`
      INSERT INTO lab_reports (id, patient_id, report_name, category, date, laboratory, ordering_doctor, parameters, clinical_summary, attached_document_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'LAB-003',
      'PAT-002',
      'Atherogenic Lipid Panel & Inflammatory Markers',
      'Lipid Profile',
      '2026-08-30',
      'Max Healthcare Diagnostic Laboratories, Delhi NCR',
      'Dr. Rajesh Sharma, MD',
      JSON.stringify(vikramLipidParams),
      'Mixed dyslipidemia with marked elevation in LDL-C (165 mg/dL) and systemic inflammation (hs-CRP 3.8 mg/L). Indicates accelerated atherogenic plaque instability risk.',
      'LipidPanel_VikramMehta_20260830.pdf',
      '2026-08-30T10:30:00.000Z'
    );

    db.prepare(`
      INSERT INTO lab_reports (id, patient_id, report_name, category, date, laboratory, ordering_doctor, parameters, clinical_summary, attached_document_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'LAB-004',
      'PAT-002',
      'Cardiac Neurohormone & Electrolyte Panel',
      'Cardiovascular',
      '2026-08-30',
      'Max Healthcare Diagnostic Laboratories, Delhi NCR',
      'Dr. Rajesh Sharma, MD',
      JSON.stringify(vikramCardiacParams),
      'Troponin-I below myocardial necrosis threshold. Mild NT-proBNP elevation reflects ventricular wall tension under elevated afterload.',
      'CardiacPanel_VikramMehta_20260830.pdf',
      '2026-08-30T11:00:00.000Z'
    );
  }

  // Seed Medications if empty
  const medCount = db.prepare('SELECT COUNT(*) as count FROM medications').get() as { count: number };
  if (!medCount || medCount.count === 0) {
    // Ananya Roy Medications
    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-001',
      'PAT-001',
      'Atorvastatin Calcium',
      '10 mg',
      'Once daily at bedtime',
      'Oral',
      '2026-01-15',
      null,
      'active',
      'Dr. Rajesh Sharma, MD',
      'Primary cardiovascular prophylaxis',
      'Well-tolerated without myalgia.',
      '2026-01-15T09:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-002',
      'PAT-001',
      'Telmisartan',
      '40 mg',
      'Once daily in the morning',
      'Oral',
      '2025-11-20',
      null,
      'active',
      'Dr. Rajesh Sharma, MD',
      'Mild essential hypertension',
      'Achieved target BP < 125/80 mmHg.',
      '2025-11-20T10:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-003',
      'PAT-001',
      'Amoxicillin-Clavulanate',
      '625 mg',
      'Every 12 hours for 5 days',
      'Oral',
      '2026-03-10',
      '2026-03-15',
      'historical',
      'Dr. N. Roy, Family Physician',
      'Acute maxillary sinusitis',
      'Course completed successfully. Infection fully resolved.',
      '2026-03-10T14:00:00.000Z'
    );

    // Vikram Mehta Medications
    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-004',
      'PAT-002',
      'Rosuvastatin Zinc',
      '20 mg',
      'Once daily at night',
      'Oral',
      '2026-08-30',
      null,
      'active',
      'Dr. Rajesh Sharma, MD',
      'Severe hypercholesterolemia & CAD risk',
      'Titrated up from 10mg following elevated LDL result.',
      '2026-08-30T17:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-005',
      'PAT-002',
      'Metoprolol Succinate ER',
      '50 mg',
      'Once daily with breakfast',
      'Oral',
      '2026-02-10',
      null,
      'active',
      'Dr. Rajesh Sharma, MD',
      'Exertional angina & chronotropic control',
      'Target resting heart rate 60-65 bpm.',
      '2026-02-10T11:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-006',
      'PAT-002',
      'Enteric-Coated Aspirin (Ecosprin)',
      '75 mg',
      'Once daily post lunch',
      'Oral',
      '2026-02-10',
      null,
      'active',
      'Dr. Rajesh Sharma, MD',
      'Antiplatelet secondary prophylaxis',
      'Take with full glass of water.',
      '2026-02-10T11:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-007',
      'PAT-002',
      'Ramipril',
      '5 mg',
      'Once daily in the morning',
      'Oral',
      '2026-09-02',
      null,
      'active',
      'Dr. Rajesh Sharma, MD',
      'Hypertension & cardioprotective ACE-inhibition',
      'Monitor serum potassium and renal parameters in 4 weeks.',
      '2026-09-02T16:40:00.000Z'
    );

    db.prepare(`
      INSERT INTO medications (id, patient_id, name, dosage, frequency, route, start_date, end_date, status, prescribing_doctor, indication, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'MED-008',
      'PAT-002',
      'Hydrochlorothiazide',
      '12.5 mg',
      'Once daily',
      'Oral',
      '2025-06-01',
      '2026-09-02',
      'inactive',
      'Dr. Rajesh Sharma, MD',
      'Diuretic for BP management',
      'Discontinued; replaced with ACE inhibitor (Ramipril).',
      '2025-06-01T09:00:00.000Z'
    );
  }

  // Seed Patient Consents if empty
  const consentCount = db.prepare('SELECT COUNT(*) as count FROM patient_consents').get() as { count: number };
  if (!consentCount || consentCount.count === 0) {
    db.prepare(`
      INSERT OR IGNORE INTO patient_consents (id, patient_id, doctor_id, doctor_name, doctor_specialty, hospital, access_medical_records, access_lab_reports, access_medications, access_ai_predictions, status, granted_at, expires_at, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1, 1, 1, 'active', '2026-01-10T09:00:00.000Z', '2027-01-10T09:00:00.000Z', 'Primary attending physician consent under ABDM National Digital Health Mission.', '2026-01-10T09:00:00.000Z')
    `).run(
      'CST-001',
      'PAT-001',
      'DOC-001',
      'Dr. Rajesh Sharma, MD',
      'Cardiovascular & Oncology Screening',
      'Apollo Heart & Oncology Research Centre, New Delhi'
    );

    db.prepare(`
      INSERT OR IGNORE INTO patient_consents (id, patient_id, doctor_id, doctor_name, doctor_specialty, hospital, access_medical_records, access_lab_reports, access_medications, access_ai_predictions, status, granted_at, expires_at, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1, 1, 1, 'active', '2026-02-15T11:30:00.000Z', '2027-02-15T11:30:00.000Z', 'Comprehensive cardiology clinical decision support consent.', '2026-02-15T11:30:00.000Z')
    `).run(
      'CST-002',
      'PAT-002',
      'DOC-001',
      'Dr. Rajesh Sharma, MD',
      'Cardiovascular & Oncology Screening',
      'Apollo Heart & Oncology Research Centre, New Delhi'
    );

    db.prepare(`
      INSERT OR IGNORE INTO patient_consents (id, patient_id, doctor_id, doctor_name, doctor_specialty, hospital, access_medical_records, access_lab_reports, access_medications, access_ai_predictions, status, granted_at, expires_at, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1, 0, 1, 'active', '2026-09-12T08:00:00.000Z', '2026-12-31T23:59:59.000Z', 'Second opinion cardiac review consultation.', '2026-09-12T08:00:00.000Z')
    `).run(
      'CST-003',
      'PAT-002',
      'DOC-003',
      'Dr. Sarah Johnson, MD',
      'Cardiology & Preventive Medicine',
      'Boston General Heart & Vascular Center'
    );

    // Revoked demonstration record
    db.prepare(`
      INSERT OR IGNORE INTO patient_consents (id, patient_id, doctor_id, doctor_name, doctor_specialty, hospital, access_medical_records, access_lab_reports, access_medications, access_ai_predictions, status, granted_at, expires_at, revoked_at, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, 1, 1, 1, 'revoked', '2026-03-01T10:00:00.000Z', '2027-03-01T10:00:00.000Z', '2026-08-20T15:20:00.000Z', 'Consent revoked by patient: consultation episode completed.', '2026-08-20T15:20:00.000Z')
    `).run(
      'CST-004',
      'PAT-002',
      'DOC-002',
      'Dr. Elena Vance, Neurologist',
      'Neurological & Acoustic Biomarkers',
      'Bay Area Neuroscience & Clinical Research Institute'
    );
  }

  // Seed Security Audit Events if empty
  const auditCount = db.prepare('SELECT COUNT(*) as count FROM audit_events').get() as { count: number };
  if (!auditCount || auditCount.count === 0) {
    const auditLogs = [
      { id: 'AUD-001', user: 'admin@qdiagnose.org', role: 'admin', action: 'RBAC_SYSTEM_INITIALIZED', resource: 'SYSTEM', target: 'GLOBAL', details: 'Initialized Q-Diagnose Zero-Trust RBAC security framework with AES-256-GCM encryption.', time: '2026-01-01T00:00:00.000Z' },
      { id: 'AUD-002', user: 'dr.sharma@qdiagnose.org', role: 'doctor', action: 'VIEW_PATIENT_360', resource: 'PATIENT_RECORD', target: 'PAT-002', details: 'Authorized clinician access to Vikram Mehta medical timeline and hemodynamic telemetry.', time: '2026-09-02T16:25:00.000Z' },
      { id: 'AUD-003', user: 'vikram.mehta@qdiagnose.org', role: 'patient', action: 'CONSENT_REVOCATION', resource: 'PATIENT_CONSENT', target: 'CST-004', details: 'Patient revoked access permissions for Dr. Elena Vance following completion of neurological evaluation.', time: '2026-08-20T15:20:00.000Z' },
      { id: 'AUD-004', user: 'dr.sharma@qdiagnose.org', role: 'doctor', action: 'QUANTUM_HYBRID_INFERENCE_RUN', resource: 'AI_MODEL', target: 'vqc-cardio-v1.9', details: 'Executed hybrid VQC-Random Forest inference on Cleveland Heart Disease vector for patient PAT-002.', time: '2026-09-02T16:20:00.000Z' },
      { id: 'AUD-005', user: 'dr.vance@qdiagnose.org', role: 'doctor', action: 'EMERGENCY_OVERRIDE_LOGGED', resource: 'EMERGENCY_ACCESS', target: 'PAT-002', details: 'Critical override logged during acute telemetry decompensation alert. Mandatory rationale verified.', time: '2026-08-14T10:22:00.000Z' }
    ];

    for (const log of auditLogs) {
      db.prepare(`
        INSERT OR IGNORE INTO audit_events (id, user_id, user_email, user_role, action, target_resource, target_id, details, ip_address, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, '127.0.0.1', ?)
      `).run(log.id, log.user, log.user, log.role, log.action, log.resource, log.target, log.details, log.time);
    }
  }

  console.log('[Database] Migrations and initial seeds populated successfully.');
}
