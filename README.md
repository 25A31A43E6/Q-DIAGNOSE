# Q-Diagnose: Backend & Full-Stack Platform
## Hybrid Quantum-AI Early Health Risk Screening System

Q-Diagnose combines classical biostatistical models with high-dimensional Variational Quantum Classifiers (VQC) and quantum Hilbert-space feature maps (`ZZFeatureMap`), coupled with a multilingual, multi-register voice/text AI companion.

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js**: v20 or v22 (Node 22 built-in SQLite supported natively)
- **npm** or **bun**

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration items:
- `GEMINI_API_KEY`: Gemini API key for AI Companion conversations & STT transcription.
- `JWT_SECRET`: Secret string for signing session tokens.
- `ENCRYPTION_KEY`: 256-bit symmetric encryption key for AES-256-GCM data at rest.
- `DATABASE_URL`: `sqlite://data/qdiagnose.db` (defaults to local embedded SQLite file).
- `PORT`: `3000` (required for container ingress).

### 3. Database Initialization & Migrations
Database tables and demo seed fixtures automatically migrate on server boot:
```bash
npm run dev
# Server boots on http://localhost:3000
# SQLite WAL database created in ./data/qdiagnose.db
```
To run migrations and seed data manually:
```bash
npx tsx -e "import { runMigrationsAndSeed } from './server/migrations.js'; runMigrationsAndSeed();"
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Database Schema & Data Models

The persistence layer uses SQLite (or relational PostgreSQL via connection string) with AES-256-GCM field encryption:

1. **`users`**: Account records for both roles (`patient`, `doctor`, `admin`) with scrypt password hashing, contact info (encrypted at rest), `ui_locale`, and `companion_locale`.
2. **`patients`**: Linked to `users`. Stores demographic fields (`dob`, `gender`, `blood_group`), encrypted emergency contact, encrypted medical history, and linked primary doctor.
3. **`doctors`**: Linked to `users`. Stores specialty, medical license number, hospital affiliation, and clinical bio.
4. **`doctor_patients`**: Explicit role-based relational access mapping doctors to authorized patients with status (`active`, `pending`, `discharged`).
5. **`assessments`**: Stores screening runs with `patient_id`, disease type, raw features (encrypted JSON), calibrated `risk_score` (0–100), `risk_band` (`low`, `moderate`, `high`), top `contributing_factors` (JSON), `model_version`, quantum/classical probabilities, and complete pipeline stage breakdown.
6. **`emergency_events`**: Audit log whenever deterministic emergency symptoms are evaluated, capturing flagged red flags, severity, timestamp, and guidance given. Non-blocking.
7. **`doctor_access_log`**: HIPAA/ABDM-style access audit trail capturing doctor ID, patient ID, action, and timestamp every time a doctor views a patient chart.
8. **`companion_conversations`**: Stores conversation transcripts and voice channel entries for session continuity, guarded by a `consent_flag` (default `0`).
9. **`rate_limits`**: Cost-guard rate-limiting tracker (max 30 requests per 10-minute window per user).

---

## 🗺️ Frontend Feature to Backend Endpoint Mapping

| Frontend Feature / Component | Backend REST Endpoint | Method | Functional Purpose |
| :--- | :--- | :--- | :--- |
| **Patient / Doctor Signup** | `/auth/register/patient`<br>`/auth/register/doctor` | `POST` | Creates account with role, hashes password, encrypts contact info, issues JWT. |
| **User Sign In** | `/auth/login` | `POST` | Validates credentials, returns JWT token, user object, and patient/doctor profile. |
| **Current User Session** | `/auth/me` | `GET` | Authenticated session profile with linked doctor/patient associations. |
| **Health Assessment Wizard** | `/assessments` | `POST` | Accepts patient inputs, runs model serving pipeline, returns risk score, band, contributing features, and stores encrypted record. |
| **Patient Assessment History** | `/assessments/:patient_id` | `GET` | Returns past screening runs with date filtering (`?from=&to=`) and role verification. |
| **Risk-Trend Visualizer** | `/assessments/:patient_id/trend` | `GET` | Returns chronologically ordered points with delta, direction, and min/max stats for charts. |
| **Deterministic Emergency Triage** | `/emergency-check` | `POST` | Evaluates red-flag symptoms with zero model dependencies; logs audit record in `emergency_events`. |
| **Doctor Workspace Patient Queue** | `/doctors/:doctor_id/patients` | `GET` | Returns linked patients sorted high-risk first (`?sort=high_risk_first`), filterable by risk band or search. Logs access. |
| **Pipeline Explainer Tab (Opt-In)** | `/pipeline-explainer/:assessment_id` | `GET` | Detailed 6-stage quantum circuit breakdown, ZZFeatureMap parameters, PCA variance, and ansatz depth for scientific review. |
| **AI Health Companion (Text & Voice)** | `/companion/message` | `POST` | Gemini 3.8 Flash engine grounded in patient's actual assessment; supports STT audio input, TTS voice config, rate limits, and "problem not process" routing. |
| **Companion History** | `/companion/history/:user_id` | `GET` | Retrieves continuity history with consent tracking. |

*Note: All endpoints are accessible both with and without the `/api` prefix (e.g. `/api/assessments` and `/assessments`).*

---

## 🧠 Model Serving & "Problem Not Process" Principle

- **Hybrid Quantum Model Pipeline**:
  - `vqc-hybrid-v2.4-qiskit` (Breast Cancer cytology)
  - `vqc-cardio-v1.9` (Cardiovascular hemodynamics)
  - `vqc-neuro-v1.2` (Neurological phonation micro-tremors)
- **Circuit Specifications**: 4 Qubits, `ZZFeatureMap` ($reps=2$), `RealAmplitudes` Ansatz ($depth=8$), Hilbert-space dimension $2^4=16$.
- **AI Companion Policy ("Problem Not Process")**:
  - Focuses on the patient's condition: plain-language risk meaning, why it matters, questions for the doctor, and emergency guidance.
  - No unsolicited quantum mechanics or algorithm talk.
  - If a patient explicitly asks *"How does this work?"*, the companion transparently routes them to the dedicated **Pipeline Explainer** view (`GET /pipeline-explainer/:assessment_id`).

---

## 🔒 Security & Privacy

- **Field-Level Encryption**: Sensitive biometric inputs, patient contact numbers, emergency contacts, and medical histories are encrypted at rest using AES-256-GCM.
- **Strict RBAC**: Patients only access their own records; doctors can only access patients explicitly linked in `doctor_patients`.
- **Audit Logging**: Every doctor review of a patient record is automatically written to `doctor_access_log`.
- **Deterministic Emergency Guard**: Immediate referral to 108 / 112 / 911 / 999 when acute symptoms are flagged.
