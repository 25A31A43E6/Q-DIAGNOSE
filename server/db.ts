import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = process.env.DATABASE_URL?.replace('sqlite://', '') || path.join(DATA_DIR, 'qdiagnose.db');
export const db = new DatabaseSync(DB_FILE);

// Enable WAL mode for high concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize all database tables matching the required schema.
 */
export function initDatabaseSchema() {
  db.exec(`
    -- 1. Users Table (Patient & Doctor accounts)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      contact TEXT, -- encrypted contact number
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'pending_verification', 'suspended')),
      ui_locale TEXT NOT NULL DEFAULT 'en',
      companion_locale TEXT NOT NULL DEFAULT 'india_en',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 2. Patients Table (Demographic & Clinical Profile)
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      dob TEXT,
      gender TEXT,
      blood_group TEXT,
      emergency_contact TEXT, -- encrypted
      medical_history TEXT, -- encrypted
      primary_doctor_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. Doctors Table (Specialty & Hospital Affiliation)
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      specialty TEXT NOT NULL,
      license_number TEXT NOT NULL,
      hospital TEXT NOT NULL,
      bio TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 4. Doctor-Patient Relationship Table (Explicit RBAC linkages)
    CREATE TABLE IF NOT EXISTS doctor_patients (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'pending', 'discharged')),
      assigned_at TEXT NOT NULL,
      UNIQUE(doctor_id, patient_id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 5. Assessments Table (Hybrid Quantum-Classical Screening Records)
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      date TEXT NOT NULL,
      disease_type TEXT NOT NULL, -- breast_cancer | cardiovascular | neurological
      input_features TEXT NOT NULL, -- encrypted JSON string of raw submitted features
      risk_score INTEGER NOT NULL, -- 0-100
      risk_band TEXT NOT NULL CHECK(risk_band IN ('low', 'moderate', 'high')),
      contributing_factors TEXT NOT NULL, -- JSON array of top contributing features
      model_version TEXT NOT NULL, -- e.g. 'vqc-hybrid-v2.4-qiskit'
      quantum_score REAL,
      classical_score REAL,
      consensus_agreement INTEGER DEFAULT 1,
      quantum_metadata TEXT, -- JSON details of circuit, ansatz, qubits
      classical_metadata TEXT, -- JSON details of trees, criterion
      pipeline_breakdown TEXT, -- JSON details of preprocessing & stage timings
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 6. Emergency Events Table (Deterministic Checklist Audit Log)
    CREATE TABLE IF NOT EXISTS emergency_events (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      symptoms_flagged TEXT NOT NULL, -- JSON array of selected red-flag symptoms
      verdict TEXT NOT NULL, -- 'EMERGENCY_DISPATCH_ADVISED' | 'IMMEDIATE_TRIAGE_RECOMMENDED'
      severity TEXT NOT NULL DEFAULT 'CRITICAL',
      action_taken TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 7. Doctor Access Log Table (Audit trail whenever doctor opens patient record)
    CREATE TABLE IF NOT EXISTS doctor_access_log (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      action TEXT NOT NULL DEFAULT 'VIEW_RECORD',
      timestamp TEXT NOT NULL,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 8. Companion Conversations Table (Text & Voice History, Consent Scoped)
    CREATE TABLE IF NOT EXISTS companion_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      channel TEXT NOT NULL CHECK(channel IN ('text', 'voice')),
      language TEXT NOT NULL,
      transcript TEXT NOT NULL,
      reply TEXT NOT NULL,
      consent_flag INTEGER NOT NULL DEFAULT 0, -- 0: continuity only, 1: consented to research improvement
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 9. Rate Limits Table (User LLM request rate limiter / cost-guard)
    CREATE TABLE IF NOT EXISTS rate_limits (
      user_id TEXT PRIMARY KEY,
      window_start INTEGER NOT NULL,
      request_count INTEGER NOT NULL
    );

    -- 10. Medical Records & Consultations
    CREATE TABLE IF NOT EXISTS medical_records (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      title TEXT NOT NULL,
      record_type TEXT NOT NULL CHECK(record_type IN ('consultation', 'diagnosis', 'clinical_note', 'procedure', 'discharge')),
      date TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL DEFAULT 'doctor',
      content TEXT NOT NULL, -- encrypted clinical narrative
      status TEXT NOT NULL DEFAULT 'final',
      access_controlled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 11. Laboratory Reports (Structured Parameters, Abnormal Flags & Ranges)
    CREATE TABLE IF NOT EXISTS lab_reports (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      report_name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Biochemistry',
      date TEXT NOT NULL,
      laboratory TEXT NOT NULL,
      ordering_doctor TEXT NOT NULL,
      parameters TEXT NOT NULL, -- JSON array of { parameter, value, unit, reference_range, status, is_abnormal }
      clinical_summary TEXT,
      attached_document_name TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 12. Medications (Active, Inactive, Historical)
    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      route TEXT NOT NULL DEFAULT 'Oral',
      start_date TEXT NOT NULL,
      end_date TEXT,
      status TEXT NOT NULL CHECK(status IN ('active', 'inactive', 'historical')),
      prescribing_doctor TEXT NOT NULL,
      indication TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 13. Patient Consent Management
    CREATE TABLE IF NOT EXISTS patient_consents (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      doctor_specialty TEXT NOT NULL,
      hospital TEXT NOT NULL,
      access_medical_records INTEGER NOT NULL DEFAULT 1,
      access_lab_reports INTEGER NOT NULL DEFAULT 1,
      access_medications INTEGER NOT NULL DEFAULT 1,
      access_ai_predictions INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL CHECK(status IN ('active', 'revoked', 'expired')),
      granted_at TEXT NOT NULL,
      expires_at TEXT,
      revoked_at TEXT,
      notes TEXT,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );

    -- 14. Emergency Access Logs (Strict Audit Workflow)
    CREATE TABLE IF NOT EXISTS emergency_access_logs (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      reason TEXT NOT NULL,
      confirmed_care INTEGER NOT NULL DEFAULT 1,
      ip_address TEXT,
      action TEXT NOT NULL DEFAULT 'EMERGENCY_OVERRIDE_ACCESS',
      timestamp TEXT NOT NULL,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    -- 15. Immutable Security Audit Events
    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_email TEXT,
      user_role TEXT,
      action TEXT NOT NULL,
      target_resource TEXT NOT NULL,
      target_id TEXT,
      details TEXT NOT NULL,
      ip_address TEXT,
      timestamp TEXT NOT NULL
    );

    -- 16. Password Reset Tokens
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    -- Indices for quick query performance
    CREATE INDEX IF NOT EXISTS idx_assessments_patient_date ON assessments(patient_id, date);
    CREATE INDEX IF NOT EXISTS idx_emergency_patient_time ON emergency_events(patient_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_doctor_access_patient ON doctor_access_log(patient_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_companion_user_time ON companion_conversations(user_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_doc_pat_pair ON doctor_patients(doctor_id, patient_id);
    CREATE INDEX IF NOT EXISTS idx_med_records_patient ON medical_records(patient_id, date);
    CREATE INDEX IF NOT EXISTS idx_lab_reports_patient ON lab_reports(patient_id, date);
    CREATE INDEX IF NOT EXISTS idx_medications_patient ON medications(patient_id, status);
    CREATE INDEX IF NOT EXISTS idx_consents_patient ON patient_consents(patient_id, status);
    CREATE INDEX IF NOT EXISTS idx_audit_events_time ON audit_events(timestamp);
  `);

  // Ensure backward compatibility on existing databases
  const ensureColumn = (tableName: string, columnName: string, columnDef: string) => {
    try {
      const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as any[];
      const exists = columns.some((c: any) => c.name === columnName);
      if (!exists) {
        db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef};`);
      }
    } catch (err) {
      console.warn(`Could not ensure column ${columnName} on ${tableName}:`, err);
    }
  };

  ensureColumn('users', 'status', "TEXT NOT NULL DEFAULT 'active'");
  ensureColumn('users', 'ui_locale', "TEXT NOT NULL DEFAULT 'en'");
  ensureColumn('users', 'companion_locale', "TEXT NOT NULL DEFAULT 'india_en'");
}

// Automatically initialize schema when module is imported
initDatabaseSchema();
