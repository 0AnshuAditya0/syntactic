import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Use mock values for build time if env vars are missing
    // This prevents the build from failing in CI/CD without secrets
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase environment variables are missing. Client functionality will be limited.');
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}

// Export a singleton instance for client components
export const supabase = createClient()
