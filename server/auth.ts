import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import { hashPassword, verifyPassword, encryptField, decryptField } from './crypto.js';

const JWT_SECRET = process.env.JWT_SECRET || 'qdiagnose-jwt-secret-key-2026-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: string;
  role: 'patient' | 'doctor' | 'admin';
  email: string;
  name: string;
  ui_locale: string;
  companion_locale: string;
  patient_id?: string;
  doctor_id?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Generate signed JWT token
 */
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      patient_id: user.patient_id,
      doctor_id: user.doctor_id
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Middleware: Verify JWT Bearer token
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    // If no token, return 401 Unauthorized
    res.status(401).json({ error: 'Authentication required. Please provide a valid Bearer token.' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const userRow = db.prepare('SELECT id, role, email, name, ui_locale, companion_locale FROM users WHERE id = ?').get(payload.id) as any;
    
    if (!userRow) {
      res.status(401).json({ error: 'User session no longer valid.' });
      return;
    }

    let patientId: string | undefined = undefined;
    let doctorId: string | undefined = undefined;

    if (userRow.role === 'patient') {
      const pat = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(userRow.id) as any;
      patientId = pat?.id;
    } else if (userRow.role === 'doctor') {
      const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(userRow.id) as any;
      doctorId = doc?.id;
    }

    req.user = {
      id: userRow.id,
      role: userRow.role,
      email: userRow.email,
      name: userRow.name,
      ui_locale: userRow.ui_locale,
      companion_locale: userRow.companion_locale,
      patient_id: patientId,
      doctor_id: doctorId
    };

    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
    return;
  }
}

/**
 * Optional authentication: attaches user if present, but doesn't block if absent
 */
export function optionalAuthenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const userRow = db.prepare('SELECT id, role, email, name, ui_locale, companion_locale FROM users WHERE id = ?').get(payload.id) as any;
    if (userRow) {
      let patientId: string | undefined;
      let doctorId: string | undefined;

      if (userRow.role === 'patient') {
        const pat = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(userRow.id) as any;
        patientId = pat?.id;
      } else if (userRow.role === 'doctor') {
        const doc = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(userRow.id) as any;
        doctorId = doc?.id;
      }

      req.user = {
        id: userRow.id,
        role: userRow.role,
        email: userRow.email,
        name: userRow.name,
        ui_locale: userRow.ui_locale,
        companion_locale: userRow.companion_locale,
        patient_id: patientId,
        doctor_id: doctorId
      };
    }
  } catch {
    // Ignore invalid token in optional middleware
  }
  next();
}

/**
 * Role guard middleware
 */
export function requireRole(allowedRoles: Array<'patient' | 'doctor' | 'admin'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: `Access denied. Role '${req.user.role}' is not authorized for this resource.` 
      });
      return;
    }
    next();
  };
}

/**
 * Patient data access guard:
 * - Patient can only access their own data
 * - Doctor can only access if explicitly linked to that patient in doctor_patients
 */
export function verifyPatientAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const requestedPatientId = req.params.patient_id || req.body.patient_id;
  if (!requestedPatientId) {
    res.status(400).json({ error: 'patient_id is required.' });
    return;
  }

  // If user is a patient, they can ONLY access their own patient_id
  if (req.user.role === 'patient') {
    if (req.user.patient_id !== requestedPatientId) {
      res.status(403).json({ error: 'Forbidden: Patients may only access their own health records.' });
      return;
    }
    next();
    return;
  }

  // If user is a doctor, verify active link in doctor_patients
  if (req.user.role === 'doctor') {
    if (!req.user.doctor_id) {
      res.status(403).json({ error: 'Forbidden: Doctor profile not found.' });
      return;
    }

    const link = db.prepare(`
      SELECT id FROM doctor_patients 
      WHERE doctor_id = ? AND patient_id = ? AND status = 'active'
    `).get(req.user.doctor_id, requestedPatientId);

    if (!link) {
      res.status(403).json({ 
        error: 'Forbidden: Doctor is not explicitly linked to this patient care record.' 
      });
      return;
    }

    // Log audit record of doctor opening this patient's chart
    try {
      const logId = `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      db.prepare(`
        INSERT INTO doctor_access_log (id, doctor_id, patient_id, action, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `).run(logId, req.user.doctor_id, requestedPatientId, `${req.method} ${req.originalUrl}`, new Date().toISOString());
    } catch (e) {
      console.error('Failed to write doctor access log:', e);
    }

    next();
    return;
  }

  // Admin has access
  if (req.user.role === 'admin') {
    next();
    return;
  }

  res.status(403).json({ error: 'Forbidden.' });
}
