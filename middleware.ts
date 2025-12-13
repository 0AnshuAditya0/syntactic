import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Session Validation for Protected Routes
    // Note: We cannot easily access sessionStorage here (client side).
    // But for Supabase Auth, we check cookies.

    // For 'Temporary Session' (Key Login), the token is in sessionStorage (Client).
    // This means the Middleware CANNOT protect routes based on that token easily 
    // unless we send it in a Header or Cookie.
    // The 'Login' API returned a token but client stored it in sessionStorage.

    // So, server-side rendering (App Router) won't know about the temp user.
    // The Client Components will handle the auth state.
    // For purely API routes or server layouts, we might treat them as 'Guest'.
    // This is a trade-off of the "sessionStorage" requirement.

    // However, we can use this middleware to refresh Supabase sessions if they exist.

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
