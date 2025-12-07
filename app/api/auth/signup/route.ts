import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { generatePrivateKey, hashPrivateKey } from '@/lib/auth/private-key';

export async function POST(req: NextRequest) {
    try {
        const { email, password, username, recoveryEmail } = await req.json();

        // Validation
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: 'Email, password, and username are required' },
                { status: 400 }
            );
        }

        if (username.length < 3 || username.length > 30) {
            return NextResponse.json(
                { error: 'Username must be between 3 and 30 characters' },
                { status: 400 }
            );
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return NextResponse.json(
                { error: 'Username can only contain letters, numbers, hyphens, and underscores' },
                { status: 400 }
            );
        }

        const supabaseAdmin = createAdminClient();

        // Check if username already exists
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (existingProfile) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 409 }
            );
        }

        // 1. Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email for now
            user_metadata: {
                username,
            },
        });

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // 2. Generate and hash private key
        const privateKey = generatePrivateKey();
        const privateKeyHash = await hashPrivateKey(privateKey);

        // 3. Create profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: authData.user.id,
                username,
                private_key_hash: privateKeyHash,
                recovery_email: recoveryEmail || email,
                key_version: 1,
            });

        if (profileError) {
            console.error('Profile error:', profileError);
            console.error('Profile error details:', JSON.stringify(profileError, null, 2));
            console.error('Attempted to insert:', {
                id: authData.user.id,
                username,
                recovery_email: recoveryEmail || email,
            });

            // Rollback: delete auth user
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

            return NextResponse.json(
                {
                    error: 'Failed to create profile',
                    details: profileError.message || 'Unknown error'
                },
                { status: 500 }
            );
        }

        // 4. Return success with private key (ONLY TIME it's shown)
        return NextResponse.json({
            success: true,
            privateKey, // User must save this!
            userId: authData.user.id,
            username,
            message: 'Account created successfully. Save your private key securely!',
        });

    } catch (error: unknown) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
