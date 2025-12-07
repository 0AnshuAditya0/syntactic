import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyPrivateKey } from '@/lib/auth/private-key';

export async function POST(req: NextRequest) {
    try {
        const { username, privateKey } = await req.json();

        if (!username || !privateKey) {
            return NextResponse.json(
                { error: 'Username and private key are required' },
                { status: 400 }
            );
        }

        const supabaseAdmin = createAdminClient();

        // 1. Find user by username
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id, private_key_hash, username, recovery_email')
            .eq('username', username)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'Invalid username or private key' },
                { status: 401 }
            );
        }

        // 2. Verify private key
        const isValid = await verifyPrivateKey(privateKey, profile.private_key_hash);

        if (!isValid) {
            console.warn('Failed sync login attempt:', {
                username,
                ip: req.headers.get('x-forwarded-for'),
                timestamp: new Date().toISOString(),
            });

            return NextResponse.json(
                { error: 'Invalid username or private key' },
                { status: 401 }
            );
        }

        // 3. Get user's email
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.id);

        if (userError || !userData.user) {
            console.error('User fetch error:', userError);
            return NextResponse.json(
                { error: 'Failed to fetch user data' },
                { status: 500 }
            );
        }

        // 4. Generate magic link
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: userData.user.email!,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/playground`,
            },
        });

        if (linkError || !linkData || !linkData.properties?.action_link) {
            console.error('Link generation error:', linkError);
            return NextResponse.json(
                { error: 'Failed to create session link' },
                { status: 500 }
            );
        }

        // 5. Return the redirect URL
        return NextResponse.json({
            success: true,
            redirectUrl: linkData.properties.action_link,
            user: {
                id: profile.id,
                username: profile.username,
            },
        });

    } catch (error: any) {
        console.error('Sync login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
