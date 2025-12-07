import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure 32-character private key
 * Uses alphanumeric characters (a-z, A-Z, 0-9)
 */
export function generatePrivateKey(): string {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 32);
    return nanoid();
}

/**
 * Hash a private key for secure storage
 * Uses bcrypt with 12 rounds (recommended for passwords)
 */
export async function hashPrivateKey(key: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(key, salt);
}

/**
 * Verify a private key against a stored hash
 */
export async function verifyPrivateKey(key: string, hash: string): Promise<boolean> {
    return bcrypt.compare(key, hash);
}

/**
 * Format private key for display (groups of 8 characters)
 * Example: "AbCd1234" -> "AbCd-1234-EfGh-5678-IjKl-9012-MnOp-3456"
 */
export function formatPrivateKey(key: string): string {
    return key.match(/.{1,4}/g)?.join('-') || key;
}

/**
 * Validate private key format
 * Must be exactly 32 alphanumeric characters
 */
export function isValidPrivateKeyFormat(key: string): boolean {
    return /^[a-zA-Z0-9]{32}$/.test(key);
}
