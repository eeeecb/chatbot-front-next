import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
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

    if (code) {
      await supabase.auth.signOut();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        console.error("Error exchanging code for session:", error);
      }

      // Se bem-sucedido, redirecione para a próxima página
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se não houver código, redirecione para a página inicial
  return NextResponse.redirect(`${origin}`);
}