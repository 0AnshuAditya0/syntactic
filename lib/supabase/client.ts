import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
