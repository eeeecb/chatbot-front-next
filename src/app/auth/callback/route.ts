import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    try {
      // Clear any existing session
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
      }

      // If successful, redirect to the next page
      return NextResponse.redirect(new URL(next, request.url));

    } catch (error) {
      console.error("Unexpected error during authentication:", error);
      return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
    }
  }

  // If no code is present, redirect to the home page or an error page
  return NextResponse.redirect(new URL('/', request.url));
}