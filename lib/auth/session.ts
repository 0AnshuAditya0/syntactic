import { nanoid } from 'nanoid';

/**
 * Get or create a session ID for anonymous users
 * Stored in localStorage
 */
export function getOrCreateSessionId(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    let sessionId = localStorage.getItem('syntactic_session_id');

    if (!sessionId) {
        sessionId = nanoid(32);
        localStorage.setItem('syntactic_session_id', sessionId);
    }

    return sessionId;
}

/**
 * Clear the session ID (on logout or signup)
 */
export function clearSessionId(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('syntactic_session_id');
    }
}

/**
 * Link anonymous files to user account on signup
 * This should be called after successful signup
 */
export async function linkAnonymousFiles(userId: string, sessionId: string): Promise<void> {
    try {
        const response = await fetch('/api/code/link-files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, sessionId }),
        });

        if (!response.ok) {
            throw new Error('Failed to link anonymous files');
        }

        // Clear session ID after linking
        clearSessionId();
    } catch (error) {
        console.error('Error linking anonymous files:', error);
        // Don't throw - this is not critical for signup success
    }
}
