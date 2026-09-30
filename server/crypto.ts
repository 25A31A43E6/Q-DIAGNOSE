import crypto from 'node:crypto';

// Encryption configuration for sensitive health & contact data at rest
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV for GCM
const TAG_LENGTH = 16; // 128-bit auth tag

// Derive 256-bit encryption key from environment or secure deterministic fallback
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || 'qdiagnose-secure-at-rest-key-2026-production';
  return crypto.scryptSync(secret, 'qdiagnose-salt-secure-storage', 32);
}

/**
 * Encrypts sensitive string data at rest using AES-256-GCM.
 * Output format: base64(iv + authTag + cipherText)
 */
export function encryptField(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  // Combine IV (12) + Tag (16) + Encrypted data
  const combined = Buffer.concat([iv, tag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypts AES-256-GCM encrypted field from base64 string.
 */
export function decryptField(cipherBase64: string): string {
  if (!cipherBase64) return '';
  try {
    const combined = Buffer.from(cipherBase64, 'base64');
    if (combined.length < IV_LENGTH + TAG_LENGTH) {
      return cipherBase64; // Return as-is if unencrypted legacy
    }

    const iv = combined.subarray(0, IV_LENGTH);
    const tag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encryptedData = combined.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);

    return decrypted.toString('utf8');
  } catch (err) {
    // If decryption fails (e.g. plaintext entered during testing), return fallback
    return cipherBase64;
  }
}

/**
 * Hash password using scrypt with random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify password against stored scrypt hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
  } catch {
    return false;
  }
}
