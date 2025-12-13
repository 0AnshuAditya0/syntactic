import { customAlphabet } from 'nanoid';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure private key with format SYNT-XXXX-XXXX-XXXX-XXXX
 * Total 5 groups: 1 prefix + 4 random groups of 4 chars
 * Uses alphanumeric characters (A-Z, 0-9) - Uppercase only for readability as per requirements
 */
export function generatePrivateKey(): string {
    // Alphanumeric uppercase: A-Z, 0-9
    // Removing confusing characters like I, O, 0, 1 if we wanted, but prompt said "A-Z, 0-9"
    // Prompt Example: SYNT-A7K9-B2X4-M8P1-Q5R3
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nanoid = customAlphabet(alphabet, 4);

    // Generate 4 groups of 4 characters
    const p1 = nanoid();
    const p2 = nanoid();
    const p3 = nanoid();
    const p4 = nanoid();

    return `SYNT-${p1}-${p2}-${p3}-${p4}`;
}

/**
 * Hash a private key for secure storage
 * Uses bcrypt with 12 rounds
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
 * Validate private key format
 * Must match SYNT-XXXX-XXXX-XXXX-XXXX
 */
export function isValidPrivateKeyFormat(key: string): boolean {
    // Match SYNT- followed by 4 groups of 4 alphanumeric chars
    return /^SYNT(-[A-Z0-9]{4}){4}$/.test(key);
}

/**
 * Helper to mask key for display if needed (e.g. SYNT-XXXX...Q5R3)
 */
export function maskPrivateKey(key: string): string {
    if (!key) return '';
    return key.substring(0, 9) + '****-****-****-' + key.substring(key.length - 4);
}

/**
 * Format private key for display
 * Currently a pass-through as keys are stored/generated in the correct format
 */
export function formatPrivateKey(key: string): string {
    return key;
}
