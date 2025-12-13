import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyPrivateKey } from '@/lib/auth/private-key';
import crypto from 'crypto';

/**
 * POST /api/auth/login-key
 * Handles login via Email + Private Key for public devices.
 */
export async function POST(req: NextRequest) {
    try {
        const { identifier, private_key } = await req.json();

        if (!identifier || !private_key) {
            return NextResponse.json(
                { error: 'Email/Username and Private Key are required' },
                { status: 400 }
            );
        }

        const supabaseAdmin = createAdminClient();
        let userId: string | null = null;

        // 1. Identify User
        if (identifier.includes('@')) {
            // Is Email
            const { data: id, error } = await supabaseAdmin.rpc('get_user_id_by_email', {
                email_input: identifier
            });
            if (id) userId = id;
            else if (error) console.error('RPC Error:', error);
        } else {
            // Is Username
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('username', identifier)
                .single();
            if (profile) userId = profile.id;
        }

        if (!userId) {
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 2. Retrieve Hashed Key (Check NEW table first, then OLD profiles table)
        let keyHash = '';

        // Check new table
        const { data: keyData } = await supabaseAdmin
            .from('private_key_hash')
            .select('key_hash, is_active')
            .eq('user_id', userId)
            .single();

        if (keyData && keyData.is_active) {
            keyHash = keyData.key_hash;
        } else {
            // Check legacy profiles table
            const { data: profileData } = await supabaseAdmin
                .from('profiles')
                .select('private_key_hash')
                .eq('id', userId)
                .single();

            if (profileData?.private_key_hash) {
                keyHash = profileData.private_key_hash;
            }
        }

        if (!keyHash) {
            await new Promise(r => setTimeout(r, 1000));
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 3. Verify Key
        const cleanKey = private_key.trim();
        const isValid = await verifyPrivateKey(cleanKey, keyHash);

        if (!isValid) {
            await supabaseAdmin.from('auth_logs').insert({
                user_id: userId,
                event_type: 'login_key',
                status: 'failure',
                ip_address: req.headers.get('x-forwarded-for') || 'unknown',
                user_agent: req.headers.get('user-agent'),
                details: { method: 'invalid_key_match' }
            });

            await new Promise(r => setTimeout(r, 1000));
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 4. Success - Create Session
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

        await supabaseAdmin.from('temporary_sessions').insert({
            user_id: userId,
            session_token: sessionToken,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            device_info: { user_agent: req.headers.get('user-agent') },
            expires_at: expiresAt.toISOString()
        });

        // Log success
        await supabaseAdmin.from('auth_logs').insert({
            user_id: userId,
            event_type: 'login_key',
            status: 'success',
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent')
        });

        const { data: userProfile } = await supabaseAdmin
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('id', userId)
            .single();

        const { data: { user: authUser } } = await supabaseAdmin.auth.admin.getUserById(userId);

        return NextResponse.json({
            success: true,
            session_token: sessionToken,
            expires_at: expiresAt.toISOString(),
            user: {
                id: userId,
                email: authUser?.email,
                name: userProfile?.display_name || userProfile?.username,
                username: userProfile?.username,
                avatar_url: userProfile?.avatar_url
            }
        });

    } catch (error) {
        console.error('Login Key Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
