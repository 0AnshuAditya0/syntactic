import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { generatePrivateKey, hashPrivateKey } from '@/lib/auth/private-key';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/signup
 * Handles Post-OAuth signup logic:
 * 1. Verifies the user is authenticated (via session) OR validates an OAuth token if provided (simpler to rely on session)
 * 2. Generates a private key if one doesn't exist
 * 3. Returns the key
 * 
 * Note: The prompt requested dealing with "oauth_token". 
 * In a Next.js App Router + Supabase Auth context, usually the client handles OAuth redirect, 
 * then the server session is established. 
 * We will check for an active session to verify identity.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        // We can get the user from the Supabase session
        const supabaseAdmin = createAdminClient();

        /* 
           If the client sends an 'oauth_token', we could verify it, but it's cleaner 
           to rely on the session cookie if the user just logged in.
           However, let's look at the request body usage.
        */

        // Get current user from session
        const cookieStore = cookies();
        const token = cookieStore.get('sb-access-token')?.value ||
            cookieStore.get('sb-localhost-auth-token')?.value; // Adjust depending on cookie name config

        // Using getUser() which validates the auth header or cookie
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in with Google or GitHub first.' },
                { status: 401 }
            );
        }

        // Check if user already has a private key
        const { data: existingKey } = await supabaseAdmin
            .from('private_key_hash')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existingKey) {
            return NextResponse.json(
                { error: 'Private key already exists for this account.' },
                { status: 409 }
            );
        }

        // Generate and hash private key
        const privateKey = generatePrivateKey();
        const keyHash = await hashPrivateKey(privateKey);

        // Store hash in private_key_hash table
        const { error: insertError } = await supabaseAdmin
            .from('private_key_hash')
            .insert({
                user_id: user.id,
                key_hash: keyHash,
                is_active: true
            });

        if (insertError) {
            console.error('Key storage error:', insertError);
            return NextResponse.json(
                { error: 'Failed to generate security key.' },
                { status: 500 }
            );
        }

        // Also ensure profile exists (optional, depending on if trigger does it)
        // We'll trust the trigger or previous logic, but logging success is good.

        // Return the UNHASHED key - ONE TIME ONLY
        return NextResponse.json({
            success: true,
            private_key: privateKey,
            user: {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            },
            message: "IMPORTANT: Save this key securely. You'll need it for public device logins."
        });

    } catch (error) {
        console.error('Signup/KeyGen error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
