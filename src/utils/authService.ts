import { AuthUserProfile, UserRole } from '../types';

const TOKEN_KEY = 'qdiagnose_auth_token';
const USER_KEY = 'qdiagnose_auth_user';

export const DEMO_ACCOUNTS: {
  role: UserRole;
  label: string;
  sublabel: string;
  email: string;
  password: string;
  user: AuthUserProfile;
}[] = [
  {
    role: 'patient',
    label: 'Ananya Roy',
    sublabel: 'Patient • Breast Cancer & Metabolic History',
    email: 'patient.ananya@qdiagnose.org',
    password: 'password123',
    user: {
      id: 'USR-PAT-001',
      role: 'patient',
      email: 'patient.ananya@qdiagnose.org',
      name: 'Ananya Roy',
      patient_id: 'PAT-001',
      ui_locale: 'en',
      companion_locale: 'india_en'
    }
  },
  {
    role: 'patient',
    label: 'Vikram Mehta',
    sublabel: 'Patient • Cardiovascular Risk Screening',
    email: 'vikram.mehta@qdiagnose.org',
    password: 'password123',
    user: {
      id: 'USR-PAT-002',
      role: 'patient',
      email: 'vikram.mehta@qdiagnose.org',
      name: 'Vikram Mehta',
      patient_id: 'PAT-002',
      ui_locale: 'en',
      companion_locale: 'india_en'
    }
  },
  {
    role: 'doctor',
    label: 'Dr. Rajesh Sharma, MD',
    sublabel: 'Doctor • Lead Clinical Investigator (AIIMS Delhi)',
    email: 'dr.sharma@qdiagnose.org',
    password: 'doctor123',
    user: {
      id: 'USR-DOC-001',
      role: 'doctor',
      email: 'dr.sharma@qdiagnose.org',
      name: 'Dr. Rajesh Sharma, MD',
      doctor_id: 'DOC-001',
      specialty: 'Clinical Oncology & Health Risk Assessment',
      hospital: 'All India Institute of Medical Sciences (AIIMS)',
      ui_locale: 'en',
      companion_locale: 'india_en'
    }
  },
  {
    role: 'doctor',
    label: 'Dr. Elena Vance, PhD',
    sublabel: 'Doctor • Quantum Machine Learning & Radiology',
    email: 'dr.vance@qdiagnose.org',
    password: 'doctor123',
    user: {
      id: 'USR-DOC-002',
      role: 'doctor',
      email: 'dr.vance@qdiagnose.org',
      name: 'Dr. Elena Vance, PhD',
      doctor_id: 'DOC-002',
      specialty: 'Quantum Health Computing & Diagnostic Imaging',
      hospital: 'Tata Memorial Quantum Oncology Center',
      ui_locale: 'en',
      companion_locale: 'india_en'
    }
  },
  {
    role: 'admin',
    label: 'System Administrator',
    sublabel: 'Admin • Compliance, RBAC & Security Audit Trail',
    email: 'admin@qdiagnose.org',
    password: 'admin123',
    user: {
      id: 'USR-ADM-001',
      role: 'admin',
      email: 'admin@qdiagnose.org',
      name: 'System Administrator',
      ui_locale: 'en',
      companion_locale: 'india_en'
    }
  }
];

export function getStoredUser(): AuthUserProfile {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse stored user:', e);
  }
  // Default to Dr. Rajesh Sharma for clinical richness or Ananya Roy for patient view
  return DEMO_ACCOUNTS[2].user;
}

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_KEY) || 'demo-jwt-token-qdiagnose-research-session';
}

export function setStoredSession(user: AuthUserProfile, token: string): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredSession(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginUser(email: string, password: string): Promise<{ user: AuthUserProfile; token: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setStoredSession(data.user, data.token);
      return { user: data.user, token: data.token };
    }
  } catch (err) {
    console.warn('Backend login network issue, checking demo credentials:', err);
  }

  // Fallback match in demo accounts if offline/transient
  const matched = DEMO_ACCOUNTS.find(
    acc => acc.email.toLowerCase() === email.toLowerCase().trim() && acc.password === password
  );
  if (matched) {
    const demoToken = `demo-token-${matched.user.role}-${Date.now()}`;
    setStoredSession(matched.user, demoToken);
    return { user: matched.user, token: demoToken };
  }

  throw new Error('Invalid email address or password. Please verify your credentials.');
}

export async function registerPatient(payload: any): Promise<{ user: AuthUserProfile; token: string }> {
  const res = await fetch('/api/auth/register/patient', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to register patient account.');
  }
  const data = await res.json();
  setStoredSession(data.user, data.token);
  return { user: data.user, token: data.token };
}

export async function registerDoctor(payload: any): Promise<{ user: AuthUserProfile; token: string }> {
  const res = await fetch('/api/auth/register/doctor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to register doctor account.');
  }
  const data = await res.json();
  setStoredSession(data.user, data.token);
  return { user: data.user, token: data.token };
}
